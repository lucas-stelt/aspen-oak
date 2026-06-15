// Unit test for create-checkout.mjs line-item building & price integrity.
// Stubs global.fetch to capture the payload sent to Square (no real network).
import handler from '../netlify/functions/create-checkout.mjs';

process.env.SQUARE_ENV = 'sandbox';
process.env.SQUARE_ACCESS_TOKEN = 'test';
process.env.SQUARE_LOCATION_ID = 'TESTLOC';

let sent = null;
globalThis.fetch = async (url, opts) => {
  sent = JSON.parse(opts.body);
  return new Response(JSON.stringify({ payment_link: { url: 'https://sq/stub' } }), { status: 200 });
};

function reqFor(body) {
  return new Request('https://aspenoakhome.com/api/create-checkout', {
    method: 'POST',
    headers: { origin: 'https://aspenoakhome.com', 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

let failures = 0;
function check(name, cond) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
  if (!cond) failures++;
}

// 1) Valid mixed order: sandwich (weekend) + flavored items -----------------
let res = await handler(reqFor({
  cart: [
    { id: 'plain-jane', qty: 2, bagel: 'Everything' },
    { id: 'muffin', qty: 1, variant: 'Chocolate Chip' },
    { id: 'the-dilly', qty: 1, bagel: 'Asiago' },
    { id: 'dirt-cup', qty: 1, variant: "S'mores" },
    { id: 'dirty-diet-coke', qty: 1, variant: 'Diet Coke' },
    { id: 'mm-cookie', qty: 3 },
  ],
  pickupDay: 'Saturday', pickupTime: '9:00 AM', notes: 'no onions',
}));
check('valid order returns 200', res.status === 200);
const li = Object.fromEntries(sent.order.line_items.map(i => [i.name, i]));
check('Plain Jane price 850 + bagel name', li['Plain Jane Bagel Sandwich (Everything bagel)']?.base_price_money.amount === 850);
check('Plain Jane qty 2', li['Plain Jane Bagel Sandwich (Everything bagel)']?.quantity === '2');
check('The Dilly price 950', li['The Dilly Bagel Sandwich (Asiago bagel)']?.base_price_money.amount === 950);
check('Muffin variant name + 350', li['Muffin — Chocolate Chip']?.base_price_money.amount === 350);
check("Dirt cup S'mores + 550", li["Dirt Cake Cup — S'mores"]?.base_price_money.amount === 550);
check('Dirty Diet Coke + 450', li['Dirty Diet Coke — Diet Coke']?.base_price_money.amount === 450);
check('M&M cookie (no variant) + 350', li['M&M Sandwich Cookie']?.base_price_money.amount === 350);
check('pickup note recorded', sent.order.metadata.pickup_info.includes('Saturday at 9:00 AM'));

// 2) Sandwich on a weekday must be rejected ---------------------------------
res = await handler(reqFor({
  cart: [{ id: 'plain-jane', qty: 1, bagel: 'Plain' }],
  pickupDay: 'Tuesday', pickupTime: '9:00 AM',
}));
check('sandwich on weekday -> 400', res.status === 400);

// 3) Non-sandwich on a weekday is fine --------------------------------------
res = await handler(reqFor({
  cart: [{ id: 'muffin', qty: 1, variant: 'Banana' }],
  pickupDay: 'Tuesday', pickupTime: '9:00 AM',
}));
check('muffin on weekday -> 200', res.status === 200);

// 4) Unknown item rejected, bad variant ignored (not added to name) ---------
res = await handler(reqFor({ cart: [{ id: 'nope', qty: 1 }], pickupDay: 'Tuesday', pickupTime: '9:00 AM' }));
check('unknown item -> 400', res.status === 400);

res = await handler(reqFor({ cart: [{ id: 'muffin', qty: 1, variant: 'Hacked $0' }], pickupDay: 'Tuesday', pickupTime: '9:00 AM' }));
check('bad variant stripped, still 350', res.status === 200 && sent.order.line_items[0].name === 'Muffin' && sent.order.line_items[0].base_price_money.amount === 350);

console.log(failures === 0 ? '\nALL SERVER TESTS PASSED' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
