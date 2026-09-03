const ALLOWED_ORIGIN = 'https://aspenoakhome.com';

// Server-side price source of truth (cents). Display prices in order.html
// and menu.html must stay in sync with these amounts.
//   bagel:        true  -> accepts an `entry.bagel` choice (Plain/Everything/...)
//   variants:     list  -> accepts an `entry.variant` flavor/option from this set
//   sizes:        map   -> accepts an `entry.size` and sets its server-owned price
const ITEMS = {
  'basic-b':         { name: 'Basic B Bagel Sandwich',    amount: 800,  bagel: true },
  'the-piggy':       { name: 'The Piggy Bagel Sandwich',  amount: 950,  bagel: true },
  'plain-jane':      { name: 'Plain Jane Bagel Sandwich', amount: 950,  bagel: true },
  'the-dilly':       { name: 'The Dilly Bagel Sandwich',  amount: 1050, bagel: true },

  'drip-coffee':     { name: 'Drip Coffee',  amount: 300 },
  'espresso':        { name: 'Espresso',     amount: 300 },
  'latte':           { name: 'Latte',         sizes: { '12 oz': 400, '16 oz': 525, '20 oz': 600 }, milk: true, syrup: true },
  'cappuccino':      { name: 'Cappuccino',    sizes: { '12 oz': 375, '16 oz': 450 }, milk: true, syrup: true },
  'americano':       { name: 'Americano',     sizes: { '12 oz': 350, '16 oz': 450, '20 oz': 550 }, milk: true, syrup: true },
  'mocha':           { name: 'Mocha',         sizes: { '12 oz': 450, '16 oz': 550, '20 oz': 650 }, milk: true, syrup: true },
  'chai-latte':      { name: 'Chai',          sizes: { '12 oz': 550, '16 oz': 650, '20 oz': 750 }, milk: true, syrup: true },
  'chai-charger':    { name: 'Chai Charger',  sizes: { '12 oz': 600, '16 oz': 700, '20 oz': 800 }, milk: true, syrup: true },
  'hot-chocolate':   { name: 'Hot Chocolate', sizes: { '12 oz': 400, '16 oz': 450 }, milk: true, syrup: true },
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
const ALLOWED_MILKS = ['No milk', 'Whole', 'Skim', '2%', 'Chocolate', 'Almond', 'Oat'];
const ALLOWED_SYRUPS = ['No syrup', 'Vanilla', 'Brown sugar', 'Brown sugar cinnamon', 'Pistachio', 'Cinnamon', 'Hazelnut', 'White chocolate', 'Caramel', 'Dark chocolate', 'Brown butter toffee', 'Almond', 'Macadamia nut', 'Irish cream', 'Salted caramel'];
const BAGEL_PICKUP_WINDOWS = {
  Monday: [480, 720], Tuesday: [480, 720], Wednesday: [480, 720],
  Thursday: [480, 720], Friday: [480, 720],
  Saturday: [480, 870], Sunday: [480, 690],
};

function pickupMinutes(value) {
  const match = /^(1[0-2]|[1-9]):([0-5]\d) (AM|PM)$/.exec(value || '');
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3] === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
}

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
  let containsBagelSandwich = false;

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
    let amount = item.amount;

    if (item.bagel) containsBagelSandwich = true;

    if (item.bagel && entry.bagel && ALLOWED_BAGELS.includes(entry.bagel)) {
      itemName += ` (${entry.bagel} bagel)`;
    }

    if (item.variants && entry.variant && item.variants.includes(entry.variant)) {
      itemName += ` — ${entry.variant}`;
    }

    if (item.sizes) {
      amount = item.sizes[entry.size];
      if (!amount) {
        return new Response(JSON.stringify({ error: `Invalid size for ${entry.id}` }), { status: 400 });
      }
      itemName += ` — ${entry.size}`;
    }

    if (item.milk) {
      if (!ALLOWED_MILKS.includes(entry.milk)) {
        return new Response(JSON.stringify({ error: `Invalid milk for ${entry.id}` }), { status: 400 });
      }
      itemName += entry.milk === 'No milk' ? ', no milk' : `, ${entry.milk} milk`;
    }

    if (item.syrup) {
      if (!ALLOWED_SYRUPS.includes(entry.syrup)) {
        return new Response(JSON.stringify({ error: `Invalid syrup for ${entry.id}` }), { status: 400 });
      }
      if (entry.syrup !== 'No syrup') itemName += `, ${entry.syrup} syrup`;
    }

    lineItems.push({
      name: itemName,
      quantity: String(qty),
      base_price_money: { amount, currency: 'USD' },
    });
  }

  if (containsBagelSandwich) {
    const minutes = pickupMinutes(pickupTime);
    const window = BAGEL_PICKUP_WINDOWS[pickupDay];
    if (!window || minutes === null || minutes < window[0] || minutes > window[1]) {
      return new Response(JSON.stringify({ error: 'Bagel sandwiches are available weekdays until noon and all day on weekends.' }), { status: 400 });
    }
  }

  const pickupLine = pickupDay && pickupTime ? `Pickup: ${pickupDay} at ${pickupTime}` : '';
  const orderNote = [
    pickupLine || null,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean).join(' | ');

  // Square's Payment Links API drops the order-level `note`, so put the pickup
  // time + customer notes on the first line item — that's what shows on the POS
  // ticket and Dashboard. (Order metadata is API-only and never displayed.)
  if (orderNote && lineItems.length) {
    lineItems[0].note = orderNote.slice(0, 500);
  }

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
