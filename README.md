# AspenOak — Website & Online Ordering

Website for AspenOak, a scratch-made bakery, coffee shop, and curated pantry in Downtown Sheboygan, WI.

**Live site:** [aspenoakhome.com](https://aspenoakhome.com)

---

## Tech Stack

- Pure HTML / CSS / JavaScript — no frameworks, no build tools
- Hosted on Netlify (free tier, auto-deploys from `main`)
- Square Payment Links API for online ordering (via Netlify Functions)

## Project Structure

```
site/           → All deployed pages, styles, scripts, and assets
netlify/        → Serverless functions (Square checkout integration)
proposal/       → Client-facing proposal and pricing documents
docs/           → Internal project notes and maintenance log
automation/     → Future: automated content pipeline scripts
```

## Quick Start

1. Edit files in `site/` or `netlify/functions/`
2. Commit and push to `main`
3. Netlify auto-deploys within ~30 seconds

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage — hero, hours, photos, reviews |
| `menu.html` | Full menu organized by category |
| `order.html` | Online ordering with cart → Square checkout |
| `about.html` | Brand story and values |
| `contact.html` | Contact form, hours, address, socials |
| `order-confirmed.html` | Post-payment confirmation page |

## Environment Variables (Netlify)

| Variable | Purpose |
|----------|---------|
| `SQUARE_ACCESS_TOKEN` | Square API key |
| `SQUARE_LOCATION_ID` | Square location for payment links |
| `SQUARE_ENV` | `sandbox` or `production` |

## Contact

Built by Lucas Steltenpohl  
steltenpohllucas@gmail.com | 715-347-4224
