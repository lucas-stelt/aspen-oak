"""Functional smoke test for order.html cart logic (no network to Square).

Drives the page with Playwright + system Chrome, intercepts the /api/create-checkout
POST to capture the payload the front-end would send, and asserts the cart behaves:
  - flavor item -> variant routing
  - bagel item  -> bagel routing + weekend-only day restriction
  - quantities, totals, and option requirement
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = (Path(__file__).resolve().parent.parent / "site" / "order.html").as_uri()
captured = {}


def run():
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome")
        pg = b.new_page()

        def handle(route):
            req = route.request
            captured["payload"] = req.post_data_json
            route.fulfill(status=200, content_type="application/json",
                          body=json.dumps({"url": "https://example.com/checkout-stub"}))
        pg.route("**/api/create-checkout", handle)

        pg.goto(URL)

        # 0) Product photos injected (real photo + emoji placeholder fallback) -
        assert pg.get_attribute('.product-card[data-id="muffin"] .product-card-media img', "src"), "muffin should get a photo"
        assert pg.query_selector('.product-card[data-id="drip-coffee"] .product-card-media.ph'), "drip coffee should get a placeholder tile"
        assert pg.query_selector("#pickup-hint") is None, "weekend hint element should be gone"

        # 1) Add a Muffin (flavor variant) -------------------------------------
        pg.click('.product-card[data-id="muffin"]')
        assert pg.is_visible("#option-section"), "option selector should show for muffin"
        assert "Flavor" in pg.inner_text("#option-label"), "label should read Flavor"
        pg.select_option("#modal-option", "Chocolate Chip")
        pg.click("#modal-add-btn")
        assert "Chocolate Chip" in pg.inner_text("#cart-items"), "variant should appear in cart"
        pg.click("#cart-close")  # cart opens after add; close before next product

        # 2) Add a Plain Jane (bagel) — now available any open day -------------
        pg.click('.product-card[data-id="plain-jane"]')
        assert "Bagel type" in pg.inner_text("#option-label"), "sandwich label should be Bagel type"
        pg.select_option("#modal-option", "Everything")
        # drink upsell only shows for sandwiches
        assert pg.is_visible("#upsell-section"), "upsell should show for sandwich"
        pg.click("#modal-add-btn")

        day_opts = pg.eval_on_selector_all("#pickup-day option", "els => els.map(e => e.value).filter(Boolean)")
        assert day_opts == ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], \
            f"all open days should be available even with a sandwich, got {day_opts}"

        # 3) Choose a WEEKDAY pickup + checkout (proves bagels aren't weekend-only) -
        pg.select_option("#pickup-day", "Wednesday")
        pg.select_option("#pickup-time", "9:00 AM")
        pg.click("#checkout-btn")
        pg.wait_for_function("() => window.location.href.includes('checkout-stub')", timeout=5000)

        b.close()

    payload = captured.get("payload")
    assert payload, "no checkout payload captured"
    items = {i["id"]: i for i in payload["cart"]}
    assert items["muffin"]["variant"] == "Chocolate Chip", items["muffin"]
    assert items["muffin"]["bagel"] is None
    assert items["plain-jane"]["bagel"] == "Everything", items["plain-jane"]
    assert items["plain-jane"]["variant"] is None
    assert payload["pickupDay"] == "Wednesday" and payload["pickupTime"] == "9:00 AM"
    print("PAYLOAD:", json.dumps(payload))
    print("ALL ASSERTIONS PASSED")


if __name__ == "__main__":
    run()
