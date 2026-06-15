const ALLOWED_ORIGIN = 'https://aspenoakhome.com';

// Server-side price source of truth (cents). Display prices in order.html
// and menu.html must stay in sync with these amounts.
//   bagel:        true  -> accepts an `entry.bagel` choice, pickup is weekend-only
//   variants:     list  -> accepts an `entry.variant` flavor/option from this set
const ITEMS = {
  'plain-jane':      { name: 'Plain Jane Bagel Sandwich', amount: 850, bagel: true },
  'the-dilly':       { name: 'The Dilly Bagel Sandwich',  amount: 950, bagel: true },

  'drip-coffee':     { name: 'Drip Coffee',  amount: 300 },
  'espresso':        { name: 'Espresso',     amount: 300 },
  'latte':           { name: 'Latte',        amount: 550 },
  'chai-latte':      { name: 'Chai Latte',   amount: 550 },
  'dirty-diet-coke': { name: 'Dirty Diet Coke', amount: 450, variants: ['Coke', 'Diet Coke'] },

  'muffin':          { name: 'Muffin',       amount: 350, variants: ['Blueberry', 'Mixed Berry', 'Chocolate Chip', 'Banana', 'Lemon Poppyseed'] },
  'pop-tart':        { name: 'Pop-Tart',     amount: 350, variants: ['Nutella', 'Strawberry', 'Blueberry'] },
  'mm-cookie':       { name: 'M&M Sandwich Cookie', amount: 350 },
  'bar':             { name: 'Bar',          amount: 350, variants: ['7-Layer', 'Strawberry Crunch Cheesecake', 'Lemon Coconut Blondie', 'White Chocolate Macadamia Blondie'] },
  'sugar-cookie-sm': { name: 'Sugar Cookie (Small)', amount: 100 },
  'sugar-cookie-lg': { name: 'Sugar Cookie (Large)', amount: 200 },

  'dirt-cup':        { name: 'Dirt Cake Cup', amount: 550, variants: ['Oreo Dirt Cake', 'Vanilla Oreo Dirt Cake', 'Circus Animal Cookie Cake', "S'mores"] },
  'energy-bites':    { name: 'Energy Bites',  amount: 550, variants: ['M&M Bites', 'Date Chocolate Cherry Bites'] },
  'overnight-oats':  { name: 'Triple Berry Overnight Oats', amount: 550 },
  'chia-pudding':    { name: 'Blueberry Chia Pudding',      amount: 550 },
};

const ALLOWED_BAGELS = ['Plain', 'Everything', 'Asiago', 'Jalapeño Cheddar'];
const WEEKEND_DAYS = ['Saturday', 'Sunday'];

export default async (req) => {
  const origin = req.headers.get('origin') || '';
  const isLocalDev = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('netlify.app');

  if (origin !== ALLOWED_ORIGIN && !isLocalDev) {
    return new Response('Forbidden', { status: 403 });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { cart, pickupDay, pickupTime, notes } = body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400 });
  }

  // Validate and build line items using server-side prices only
  const lineItems = [];
  let hasWeekendItem = false;

  for (const entry of cart) {
    const item = ITEMS[entry.id];
    if (!item) {
      return new Response(JSON.stringify({ error: `Unknown item: ${entry.id}` }), { status: 400 });
    }
    const qty = parseInt(entry.qty, 10);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return new Response(JSON.stringify({ error: `Invalid quantity for ${entry.id}` }), { status: 400 });
    }

    let itemName = item.name;

    if (item.bagel) {
      hasWeekendItem = true;
      if (entry.bagel && ALLOWED_BAGELS.includes(entry.bagel)) {
        itemName += ` (${entry.bagel} bagel)`;
      }
    }

    if (item.variants && entry.variant && item.variants.includes(entry.variant)) {
      itemName += ` — ${entry.variant}`;
    }

    lineItems.push({
      name: itemName,
      quantity: String(qty),
      base_price_money: { amount: item.amount, currency: 'USD' },
    });
  }

  // Bagel sandwiches are weekend pickup only
  if (hasWeekendItem && !WEEKEND_DAYS.includes(pickupDay)) {
    return new Response(
      JSON.stringify({ error: 'Bagel sandwiches are available for Saturday or Sunday pickup only.' }),
      { status: 400 }
    );
  }

  const orderNote = [
    pickupDay && pickupTime ? `Pickup: ${pickupDay} at ${pickupTime}` : null,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean).join(' | ');

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;

  const squareBase = process.env.SQUARE_ENV === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';

  const payload = {
    idempotency_key: crypto.randomUUID(),
    order: {
      location_id: locationId,
      line_items: lineItems,
      ...(orderNote && { metadata: { pickup_info: orderNote } }),
    },
    checkout_options: {
      redirect_url: `${ALLOWED_ORIGIN}/order-confirmed.html`,
    },
  };

  const squareRes = await fetch(`${squareBase}/v2/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
    },
    body: JSON.stringify(payload),
  });

  const squareData = await squareRes.json();

  if (!squareRes.ok) {
    console.error('Square error:', squareData);
    return new Response(JSON.stringify({ error: 'Failed to create checkout' }), { status: 502 });
  }

  return new Response(
    JSON.stringify({ url: squareData.payment_link.url }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isLocalDev ? origin : ALLOWED_ORIGIN,
      },
    }
  );
};

export const config = { path: '/api/create-checkout' };
