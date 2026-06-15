# Marketing Setup — AspenOak

Practical checklist for getting AspenOak found online (Google + Instagram). Most of this is free.

---

## 1. Google Business Profile (highest priority)

This is what shows the info box / map / hours / reviews when someone Googles "AspenOak." Free, separate from the website.

- [ ] Go to **google.com/business** and search "AspenOak" — claim the auto-created profile, or create one.
- [ ] **Verify ownership** (postcard to 633 N 8th St, phone, or video). Must be done by someone at the business.
- [ ] Complete the profile:
  - Category: **Bakery** (secondary: Coffee shop)
  - Address: 633 N 8th Street, Sheboygan, WI 53081
  - Phone: (920) 946-8880
  - Website: https://aspenoakhome.com
  - Hours: Mon–Fri 8–5, Sat 8–3, Sun 8–12
  - Upload lots of photos (use the new ones in `site/assets/`)
- [ ] Ask happy customers for **Google reviews** — biggest lever for the local map results.

## 2. Google Search Console (gets the site indexed)

- [ ] Go to **search.google.com/search-console**, add property `aspenoakhome.com`.
- [ ] Verify ownership — easiest options:
  - **DNS:** add the TXT record Google gives you in Netlify (Domains → DNS), **or**
  - **HTML tag:** copy the `<meta name="google-site-verification" ...>` tag Google gives you and **send it to Lucas** — it goes in `index.html` `<head>`.
- [ ] Submit the sitemap: `https://aspenoakhome.com/sitemap.xml` (already live).

## 3. Instagram auto-feed (homepage "Follow along" section)

The section is built and parked on the `insta-feed` branch. To make it auto-pull @AspenOakHome posts:

- [ ] In the Instagram app: **Settings → Account type and tools → Switch to professional account** (Business or Creator — free).
- [ ] Link the Instagram account to the **AspenOak Facebook Page** (Instagram settings → linked accounts).
- [ ] Create a free account at **behold.so**, connect @AspenOakHome, copy the embed snippet/feed ID.
- [ ] Send the snippet to Lucas — it gets wired into the homepage section.

## 4. Keep Name / Address / Phone (NAP) identical everywhere

Google cross-checks these; mismatches hurt ranking. Use exactly:

> **AspenOak** · 633 N 8th Street, Sheboygan, WI 53081 · (920) 946-8880

- [ ] Website (done), Google Business Profile, Facebook, Instagram bio
- [ ] Free listings: Yelp, Apple Maps (Apple Business Connect), Bing Places

---

## What's already done on the website (2026-06-15)

- LocalBusiness ("Bakery") structured data with address, phone, hours, socials (`index.html`)
- `sitemap.xml` + `robots.txt`
- Open Graph / Twitter share tags + canonical URLs on all pages
- Phone number added to homepage hours strip + contact page
- Order-confirmation page set to `noindex`

**Confirm:** ZIP code is assumed **53081** — verify and tell Lucas if different (it's in the structured data + this doc).
