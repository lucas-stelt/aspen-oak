# AspenOak Bakery — Website Project

## Project Overview
Freelance website for AspenOak, a scratch-made bakery, coffee shop, and curated pantry located at 633 N 8th Street, Downtown Sheboygan, WI. Built by Lucas Steltenpohl.

## Tech Stack
- **Frontend:** Pure HTML, CSS, JavaScript (no frameworks, no build tools)
- **Hosting:** Netlify (free tier) — auto-deploys from GitHub `main` branch
- **Publish directory:** `site/` (configured in `netlify.toml`)
- **Domain:** aspenoakhome.com — live, registered on Netlify in Lucas's name
- **Online Ordering:** Square embed (planned — Phase 2)

## Folder Structure
```
aspen-oak/
├── site/               ← everything Netlify deploys
│   ├── index.html      ← homepage
│   ├── about.html
│   ├── contact.html
│   ├── menu.html       ← most frequently updated page
│   ├── order.html      ← weekend bagel order form
│   ├── css/
│   │   ├── style.css   ← global styles (used by all pages)
│   │   └── home.css    ← homepage-only styles
│   ├── js/
│   │   └── main.js     ← shared JS (nav, form validation, animations)
│   └── assets/         ← all images go here
├── proposal/           ← client-facing documents
├── docs/               ← project notes, maintenance log
├── automation/         ← future: auto-update pipeline scripts
├── netlify.toml        ← tells Netlify to publish from site/
└── CLAUDE.md           ← this file
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

## Planned Work (Phase 2)
- [x] Connect GitHub repo to Netlify (auto-deploy active)
- [x] Purchase and configure custom domain (aspenoakhome.com — live)
- [ ] Square online ordering embed on `order.html`
- [ ] Automated content pipeline (iCloud shared drive → GitHub → Netlify)

## Notes
- All image files must be added to `site/assets/` — never use absolute paths
- Menu items and prices change frequently — always verify with client before updating
- The Easter menu section in `menu.html` is seasonal and should be removed/updated after the holiday
