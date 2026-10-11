# Dar Zafran — Customization Guide

This document covers everything you need to change before publishing the template as your own restaurant website.

---

## Quick Start Checklist

Before publishing, complete every item in this list:

- [ ] Restaurant name, tagline, chef name
- [ ] Contact details: phone, email, address
- [ ] Opening hours
- [ ] Menu dishes and prices
- [ ] Connect a reservation provider (or remove the wizard)
- [ ] Set your production domain in all canonical URLs and OG tags
- [ ] Add social media profile links
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Create or link real Privacy Policy and Terms of Use pages
- [ ] Replace OG images with production absolute URLs
- [ ] Replace all placeholder images with your own photography

---

## 1. Restaurant Identity

**Files:** All 6 HTML files, `js/i18n.js`

Search for `Dar Zafran` and replace with your restaurant name throughout.

| Item | Location | Default |
|------|----------|---------|
| Restaurant name | `<title>`, `<nav>`, footer | `Dar Zafran` |
| Tagline | `js/i18n.js` key `home.hero.tagline` | "Ancient craft. Present pleasure." |
| Chef name | `story.html`, `js/i18n.js` | Youssef Benjelloun |
| Founded year | `story.html` section 3 | 2019 |

---

## 2. Contact Placeholders

**Files:** All HTML footers, `reservation.html` aside, `js/i18n.js`

Replace the following placeholder values everywhere they appear:

| Placeholder | Replace with |
|------------|-------------|
| `[PHONE NUMBER]` | Your restaurant's phone number |
| `[EMAIL ADDRESS]` | Your reservation / contact email |
| `[STREET ADDRESS]` | Street address line |
| `[CITY, POSTAL CODE]` | City and postal code |
| `[COUNTRY]` | Country name |

In `js/i18n.js` the address keys are `footer.addr1`, `footer.addr2`, `footer.addr3` — update all three language dictionaries (EN, FR, AR).

---

## 3. Opening Hours

**Files:** `js/i18n.js`, footer of all HTML files

Current defaults (update in all 3 language dictionaries):
- Tuesday – Sunday
- Lunch: 12:00 – 15:00
- Dinner: 19:00 – 23:00
- Closed Mondays

Keys to update: `footer.hours-days`, `footer.hours-lunch`, `footer.hours-dinner`, `footer.hours-closed`, `label.tue-sun`, `res.eyebrow`.

**Verify before publishing** — these times are displayed publicly and affect reservation validation (the wizard blocks Monday bookings).

---

## 4. Menu Content

**Files:** `menu.html`, `js/i18n.js`

- Dishes, prices, and descriptions are in `menu.html` inside each `.menu-item` article
- Tab labels are in `js/i18n.js`: `menu.tab.starters`, `menu.tab.mains`, `menu.tab.couscous`, `menu.tab.sweets`, `menu.tab.drinks`
- The featured couscous section (Section 4) and tea ritual video (Section 5b) should be updated to reflect your actual menu
- Prices are hard-coded in HTML — search for `MAD` to find all instances

**Verify before publishing** — menu content is the most likely to be out of date.

---

## 5. Reservation System

The 5-step reservation wizard is **fully connected to the included PHP backend**. It submits to `POST /api/reservations/public` via `fetch()` and displays a real booking reference on success (e.g. `DZ-2026-XXXXXX`).

No additional configuration is required — reservations work out of the box once the backend is running.

### To replace the built-in backend with a third-party provider

#### Option A — OpenTable / Resy / SevenRooms embed
Replace the wizard section in `reservation.html` with the booking widget code provided by your reservation platform.

#### Option B — Different backend endpoint
In `js/wizard.js`, change the `fetch()` URL at the submit handler to point to your backend. The payload fields are: `first_name`, `last_name`, `email`, `phone`, `reservation_date` (YYYY-MM-DD), `reservation_time` (HH:MM), `guests`, `occasion`, `special_requests`, `lang`.

#### Option C — Email / form service (minimal)
Use a service like Formspree or Netlify Forms — replace the `fetch()` call in `js/wizard.js` with a POST to their endpoint.

---

## 6. Production Domain

**Files:** All 6 HTML files

Before launch, update every `https://darzafran.ma/` URL with your real domain:

- `<link rel="canonical" href="...">` — in every `<head>`
- `<meta property="og:url" content="...">` — in every `<head>`
- `<meta property="og:image" content="...">` — change from relative path to absolute URL (see Section 10)
- JSON-LD `"url"` property in `index.html`

Search for `darzafran.ma` across all HTML files to find every instance.

---

## 7. Social Media Profiles

**File:** All HTML footers (brand column)

There is a commented-out `<nav class="footer__social">` block in each footer. Uncomment it and add your real social media links:

```html
<nav class="footer__social" aria-label="Social media">
  <a href="https://instagram.com/YOUR_HANDLE" class="footer__social-link" aria-label="Instagram">
    <!-- Add Instagram SVG icon here -->
  </a>
  <a href="https://facebook.com/YOUR_PAGE" class="footer__social-link" aria-label="Facebook">
    <!-- Add Facebook SVG icon here -->
  </a>
</nav>
```

---

## 8. Analytics Setup

**File:** Each HTML file, before `</body>`

Add your analytics script tag before the closing `</body>` tag in all 6 HTML files.

**Google Analytics 4:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Plausible (privacy-friendly):**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/plausible.js"></script>
```

---

## 9. Legal Pages

The footer legal nav (Privacy Policy / Terms of Use) has been removed from the template as the default `href="#"` links were non-functional placeholders.

To add working legal links:
1. Create `privacy.html` and `terms.html` (or use a service like Termageddon / Iubenda)
2. Add the footer legal nav back to all HTML footers:

```html
<nav class="footer__legal" aria-label="Legal links">
  <a href="privacy.html" data-i18n="footer.privacy">Privacy Policy</a>
  <a href="terms.html" data-i18n="footer.terms">Terms of Use</a>
</nav>
```

---

## 10. OG Images

OG images are in `assets/images/` as WebP files at 1200×630:

| File | Used on page |
|------|-------------|
| `og-home.webp` | `index.html` |
| `og-menu.webp` | `menu.html` |
| `og-story.webp` | `story.html` |
| `og-reservation.webp` | `reservation.html` |
| `og-gallery.webp` | `gallery.html` |

**Important:** `og:image` must be an absolute URL for social platforms (Facebook, Twitter/X, LinkedIn) to pick it up. The current values are relative paths — change them to your production domain before launch:

```html
<!-- Change this: -->
<meta property="og:image" content="assets/images/og-home.webp">
<!-- To this: -->
<meta property="og:image" content="https://YOUR-DOMAIN/assets/images/og-home.webp">
```

To replace the OG images with your own: create 1200×630 WebP files and overwrite the existing files in `assets/images/`.

---

## 11. Image Assets

All production images are in `assets/images/`. WebP variants at 480w, 800w, 1280w (and 1920w for backgrounds) are already generated.

| File | Used on | Assignment |
|------|---------|-----------|
| `dar-zafran-bastilla.png` | `index.html` dishes | Bastilla au Pigeon dish |
| `dar-zafran-couscous.png` | `menu.html` featured dish | Royal Couscous featured |
| `dar-zafran-orange-dessert.png` | `menu.html` desserts panel | Dessert panel image |
| `dar-zafran-moroccan-starters.png` | `index.html` story section | Starters platter |
| `dar-zafran-riad-courtyard.png` | `story.html` space section | Riad architecture |
| `dar-zafran-table-for-two.png` | `reservation.html` hero bg | Reservation hero |
| `dar-zafran-entrance.png` | `index.html` video poster | Hero video poster only |
| `dar-zafran-chicken-tagine.png` | `menu.html` video poster | Tagine video poster only |
| `dar-zafran-tea-service.png` | `menu.html` video poster | Tea video poster only |

To replace an image: overwrite the PNG file and regenerate the WebP variants by running `node optimize-images.js` in `C:\temp\img-optimizer\`.

---

## 12. Typography and Colors

**File:** `css/base.css`

### Fonts
Google Fonts are loaded via `@import` in `base.css`. Current fonts:
- Display / headings: `Cormorant Garamond` (italic weight)
- Small caps: `Cormorant SC`
- Body / UI: `DM Sans`

To change fonts, update the `@import` URL in `base.css` and the `--font-display` and `--font-body` custom properties.

### Colors
All colors are CSS custom properties in `css/base.css`. Key tokens:

| Token | Value | Role |
|-------|-------|------|
| `--color-bg-cream` | `#FFFFFF` | Primary sections |
| `--color-bg-dark` | `#24201E` | Dark sections |
| `--color-bg-burgundy` | `#B85C38` | CTA / accent sections |
| `--color-terracotta` | `#B85C38` | Buttons, active states |
| `--color-text-on-cream` | `#24201E` | Text on white |
| `--color-text-on-dark` | `#FFFFFF` | Text on dark |

---

## 13. Languages and Translations

**File:** `js/i18n.js`

The site supports EN, FR, and AR. All user-facing text is in the dictionary at the top of `i18n.js`.

To add a new language:
1. Add a new language code to the `SUPPORTED` array
2. Add a new dictionary object with all keys translated
3. Add a language button to the `.lang-switcher` in every HTML file

To remove Arabic (RTL) support:
1. Remove the `ar` dictionary from `i18n.js`
2. Remove the AR language button from all navs and overlays
3. Remove the `[dir="rtl"]` blocks from `css/i18n.css`

---

## 14. Video Assets

Videos are in `assets/video/`:

| File | Used on | Notes |
|------|---------|-------|
| `dar-zafran-entrance-hero.mp4` | `index.html` hero | Autoplay, muted, loop |
| `dar-zafran-tagine-reveal.mp4` | `menu.html` section 3b | Plays on scroll |
| `dar-zafran-tea-ritual.mp4` | `menu.html` section 5b | Plays on scroll |

Replace with your own video files. Maximum recommended size: 8 MB for the hero, 4 MB for below-fold videos.
