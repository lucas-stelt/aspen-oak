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

**2026-06-15 — SEO bundle (local search groundwork)**
- Added LocalBusiness ("Bakery") JSON-LD structured data to index.html (name, address, phone 920-946-8880, hours, socials)
- Added sitemap.xml + robots.txt
- Added Open Graph/Twitter share tags + canonical URLs to all pages; order-confirmed set to noindex
- Added phone number to homepage hours strip + contact page (NAP)
- New `docs/marketing-setup.md` — checklist for Google Business Profile, Search Console, Instagram auto-feed, NAP
- ⚠️ ZIP assumed 53081 (confirm with client); Google Search Console verification still needs the client's token
- Files: all site/*.html, site/sitemap.xml, site/robots.txt, docs/marketing-setup.md

**2026-06-15 — Bagels available everyday + photos on order page**
- Bagel sandwiches no longer weekend-only: removed the weekend pickup guard (order.html day logic + create-checkout.mjs server check); pickup is now any open day for all items
- Updated weekend-only copy across order, menu, home, and contact pages
- Order page product cards now show photos (JS injects a media tile per card from a MEDIA map; emoji placeholder for items without a photo yet — bar, energy bites, chia, drip/espresso/chai, dirty diet coke)
- Updated tests: test_order.py (everyday pickup + photo injection), test_checkout.mjs (weekday sandwich now 200) — both passing
- Files: site/order.html, site/menu.html, site/index.html, site/contact.html, netlify/functions/create-checkout.mjs, automation/test_*

**2026-06-15 — Hero bagel photo enlarged**
- Reworked hero photo cluster: bagel is now a large full-width square (shows the whole sandwich, no cropping); muffin + oats sit below
- File: site/css/home.css
- Note: curated Instagram "Follow along" section is parked on branch `insta-feed` (not deployed) — waiting on the @AspenOakHome login to set up an auto-updating widget (e.g. Behold)

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
