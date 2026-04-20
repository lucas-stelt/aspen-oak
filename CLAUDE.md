# AspenOak Bakery — Website Project

## Project Overview
Freelance website for AspenOak, a scratch-made bakery, coffee shop, and curated pantry located at 633 N 8th Street, Downtown Sheboygan, WI. Built by Lucas Steltenpohl.

## Tech Stack
- **Frontend:** Pure HTML, CSS, JavaScript (no frameworks, no build tools)
- **Hosting:** Netlify (free tier) — auto-deploys from GitHub `main` branch
- **Publish directory:** `site/` (configured in `netlify.toml`)
- **Functions directory:** `netlify/functions/` — serverless functions (esbuild bundler)
- **Domain:** aspenoakhome.com — live, registered on Netlify in Lucas's name
- **Online Ordering:** Square Payment Links API via Netlify Function (Phase 2 — in progress, deployed but not fully tested)

## Folder Structure
```
aspen-oak/
├── site/                        ← everything Netlify deploys
│   ├── index.html               ← homepage
│   ├── about.html
│   ├── contact.html
│   ├── menu.html                ← most frequently updated page
│   ├── order.html               ← product card UI + cart drawer → Square checkout
│   ├── order-confirmed.html     ← post-payment landing page
│   ├── css/
│   │   ├── style.css            ← global styles (used by all pages)
│   │   └── home.css            ← homepage-only styles
│   ├── js/
│   │   └── main.js             ← shared JS (nav, form validation, animations)
│   └── assets/                 ← all images go here
├── netlify/
│   └── functions/
│       └── create-checkout.js  ← calls Square Payment Links API, validates cart server-side
├── proposal/                   ← client-facing documents
├── docs/                       ← project notes, maintenance log
├── automation/                 ← future: auto-update pipeline scripts
├── .env                        ← local secrets (gitignored — never commit)
├── .gitignore
├── netlify.toml                ← publish = site/, functions = netlify/functions
└── CLAUDE.md                   ← this file
```

## Key Client Info
- **Business:** AspenOak
- **Location:** 633 N 8th Street, Sheboygan, WI
- **Hours:** Mon–Fri 8–5, Sat 8–3, Sun 8–12
- **Social:** @AspenOakHome on Instagram and Facebook
- **Square POS:** Active in-store, Square account exists
- **Content updates:** Owner will share new photos/menu items via iCloud shared drive (frequency: daily to weekly)

## Development Workflow
1. Edit files in `site/`
2. `git add` + `git commit` + `git push origin main`
3. Netlify auto-deploys within ~30 seconds

## Custom Slash Commands
- `/update-menu` — step-by-step guide for adding/editing menu items
- `/add-photo` — guide for adding new photos to the site
- `/deploy-check` — pre-deploy verification checklist

## Square Integration
- **Approach:** Custom cart UI on `order.html` → Netlify Function → Square Payment Links API → redirect to Square hosted checkout
- **Function:** `netlify/functions/create-checkout.js` — validates items server-side, hardcoded prices, calls `POST /v2/online-checkout/payment-links`
- **Netlify env vars required:** `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_ENV` (`sandbox` or `production`)
- **Local env vars:** same keys in `.env` file (gitignored)
- **Status:** Deployed to production, sandbox credentials set in Netlify — end-to-end test not yet completed (checkout returned error, debugging in progress)
- **Next session:** Run `netlify link --name <site-name>` then `netlify dev` to test locally and read Square error from terminal logs
- **Test card (sandbox):** `4111 1111 1111 1111`, any future expiry, any CVV
- **Go-live checklist:** Swap Netlify env vars to production credentials, change `SQUARE_ENV=production`, redeploy

## Development Workflow
1. Edit files in `site/` or `netlify/functions/`
2. Test locally with `netlify dev` (serves on `http://localhost:8888`)
3. `git add` + `git commit` + `git push origin main`
4. Netlify auto-deploys within ~30 seconds

## Planned Work
- [x] Connect GitHub repo to Netlify (auto-deploy active)
- [x] Purchase and configure custom domain (aspenoakhome.com — live)
- [x] Square ordering UI built and deployed (`order.html` + Netlify function)
- [ ] Debug and complete Square sandbox end-to-end test
- [ ] Swap to Square production credentials and go live
- [ ] Automated content pipeline (iCloud shared drive → GitHub → Netlify)

## Notes
- All image files must be added to `site/assets/` — never use absolute paths
- Menu items and prices change frequently — always verify with client before updating
- The Easter menu section in `menu.html` is seasonal and should be removed/updated after the holiday
- Item prices in `create-checkout.js` `ITEMS` map must stay in sync with `order.html` display prices
- Never commit `.env` — credentials go in Netlify environment variables for production
