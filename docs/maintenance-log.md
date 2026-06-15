# Maintenance Log — AspenOak

Track all content updates here so you have a record of what changed and when.

---

## Log Format
**[Date] — [Type of change]**
- What changed
- File(s) edited
- Committed: yes/no

---

## Log

**2026-06-15 — Homepage photo refresh**
- Hero: replaced single blob photo + floating photo with a 3-photo cluster (bagel, muffin, oats) that fills the column — less whitespace, higher-res shots
- Collage: removed the refreshers image (moved to menu), expanded to a 9-photo wall with new shots (bagel cross-section feature, cookie sandwiches, pop-tarts, pudding cup, latte, stuffed bagels)
- Menu: Refreshers section is now a photo feature band using refreshers.png
- Files: site/index.html, site/menu.html, site/css/home.css, site/css/style.css

**2026-06-15 — Menu redesign, new items & photos, price update**
- Converted 18 iPhone .HEIC photos to web-optimized .jpg (automation/convert_heic.py); originals not committed (.gitignore)
- Menu redesign: photo-forward feature bands + photo-card grids (new CSS in style.css)
- Added items — Muffins, Pop-Tarts, M&M Sandwich Cookie, Bars, Sugar Cookies (single $1–$2), Dirt Cake Cups ($5.50), Energy Bites, Triple Berry Overnight Oats, Blueberry Chia Pudding, Dirty Diet Coke ($4.50)
- **Price change:** Plain Jane $7.50→$8.50, The Dilly $8.50→$9.50 (menu + order page + Square ITEMS map)
- Online ordering expanded: all new items orderable; generalized product modal (bagel/flavor/soda options); pickup now any open day with per-day time slots; bagel sandwiches enforced weekend-only (front-end + server)
- Verified: order.html cart logic (automation/test_order.py) + server price/variant integrity (automation/test_checkout.mjs), both passing
- Files: site/menu.html, site/order.html, site/css/style.css, netlify/functions/create-checkout.mjs, site/assets/*, automation/*
- ⚠️ Open: confirm bagel-sandwich weekday policy with client (currently weekend-only); homepage photos not yet refreshed

**2026-06-15 — Cleanup & bug fixes**
- Removed seasonal Easter menu (section in `menu.html`, CSS in `style.css`, deleted `assets/eastermenu.png`)
- Fixed multi-sandwich bagel bug: cart now sends bagel type per line item; server reads `entry.bagel` with an allow-list
- Removed dead code: old order-form + qty handlers in `js/main.js`, unused `isSandbox` and empty `buyer_email_address` in `create-checkout.mjs`
- Cleaned Square env switch to rely on `SQUARE_ENV` only
- Aligned order modal quantity cap (10 → 20) with server validation
- Files: `site/menu.html`, `site/css/style.css`, `site/order.html`, `site/js/main.js`, `netlify/functions/create-checkout.mjs`

**2025-04-15 — Initial build**
- Full site built: index, about, contact, menu, order pages
- Folder restructured: files moved to `site/`, images to `assets/`
- netlify.toml configured, CLAUDE.md created
- Files: all
