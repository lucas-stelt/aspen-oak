const ALLOWED_ORIGIN = 'https://aspenoakhome.com';

const ITEMS = {
  'plain-jane':   { name: 'Plain Jane Bagel Sandwich',  amount: 750  },
  'the-dilly':    { name: 'The Dilly Bagel Sandwich',   amount: 850  },
  'drip-coffee':  { name: 'Drip Coffee',                amount: 300  },
  'latte':        { name: 'Latte',                      amount: 550  },
  'chai-latte':   { name: 'Chai Latte',                 amount: 550  },
  'espresso':     { name: 'Espresso',                   amount: 300  },
};

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

  const { cart, pickupDay, pickupTime, notes, bagel } = body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400 });
  }

  // Validate and build line items using server-side prices only
  const lineItems = [];
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
    if (entry.id === 'plain-jane' || entry.id === 'the-dilly') {
      if (bagel) itemName += ` (${bagel} bagel)`;
    }

    lineItems.push({
      name: itemName,
      quantity: String(qty),
      base_price_money: { amount: item.amount, currency: 'USD' },
    });
  }

  const orderNote = [
    pickupDay && pickupTime ? `Pickup: ${pickupDay} at ${pickupTime}` : null,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean).join(' | ');

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const isSandbox = token?.startsWith('EAAAE') === false; // sandbox tokens start differently

  const squareBase = token?.includes('sandbox') || process.env.SQUARE_ENV === 'sandbox'
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
    ...(orderNote && { pre_populated_data: { buyer_email_address: '' } }),
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
