# Dar Zafran — Asset Manifest

All image and video files included in this template. Assets live in `assets/images/` and `assets/video/`.

> **Performance note:** Current images are PNG. For production, convert to WebP at 80–85% quality (Squoosh, ImageOptim, or `cwebp`). This will typically reduce file sizes by 40–60% with no perceptible quality loss.

---

## Images (`assets/images/`)

| File | Dimensions | Used On | Role |
|------|-----------|---------|------|
| `dar-zafran-bastilla.png` | 600 × 800 | Home (dish 01), Menu (featured dish), Gallery (item 02) | Signature dish — Bastilla au Pigeon. Portrait arch crop. |
| `dar-zafran-chicken-tagine.png` | 600 × 800 | Home (dish 02), Menu (tagine video poster) | Poulet au Citron Confit. Portrait arch crop. |
| `dar-zafran-couscous.png` | 600 × 800 | Home (dish 03) | Royal Berber Couscous. Portrait arch crop. |
| `dar-zafran-orange-dessert.png` | 600 × 800 | Home (dish 04), Gallery (item 06) | Salade d'Orange à la Cannelle. Portrait arch crop. |
| `dar-zafran-moroccan-starters.png` | 700 × 875 | Home (story section) | Moroccan starters platter. Editorial arch crop. |
| `dar-zafran-riad-courtyard.png` | 700 × 875 | Home (atmosphere bg), Story (space section), Gallery (item 01 wide) | Central courtyard. Key architectural image. |
| `dar-zafran-table-for-two.png` | 700 × 875 | Reservation (hero bg), Gallery (item 04 wide) | Intimate dining table. Key hospitality image. |
| `dar-zafran-entrance.png` | 700 × 875 | Home (hero video poster), Story (origin section), Gallery (hero bg + item 05) | Cedar entrance door. Key architectural image. |
| `dar-zafran-tea-service.png` | 600 × 800 | Menu (tea ritual video poster), Gallery (item 03) | Mint tea service. Craft / service moment. |

### Gallery composition (6 items)

| Item | File | Orientation | Category |
|------|------|-------------|----------|
| 01 (wide) | `dar-zafran-riad-courtyard.png` | Landscape 3:2 | Place / Architecture |
| 02 | `dar-zafran-bastilla.png` | Portrait 3:4 | Food — Signature |
| 03 | `dar-zafran-tea-service.png` | Portrait 3:4 | Service / Craft |
| 04 (wide) | `dar-zafran-table-for-two.png` | Landscape 3:2 | Table / Hospitality |
| 05 | `dar-zafran-entrance.png` | Portrait 3:4 | Architecture |
| 06 | `dar-zafran-orange-dessert.png` | Portrait 3:4 | Food — Dessert |

---

## Videos (`assets/video/`)

| File | Spec | Used On | Notes |
|------|------|---------|-------|
| `dar-zafran-entrance-hero.mp4` | 1920 × 1080, H.264, muted loop | Home (hero section) | Primary brand video. Autoplay, muted, loop. Poster: `dar-zafran-entrance.png`. Aim for under 8 MB. |
| `dar-zafran-tagine-reveal.mp4` | 1920 × 800 (16:6.7), H.264 | Menu (tagine strip section) | Plays on scroll via IntersectionObserver. Poster: `dar-zafran-chicken-tagine.png`. |
| `dar-zafran-tea-ritual.mp4` | Variable | Menu (tea ritual section) | Plays on scroll via IntersectionObserver. Poster: `dar-zafran-tea-service.png`. |

All below-fold videos use `preload="none"` and the `.js-video-autoplay` class, managed by `js/videos.js`.

---

## Open Graph / Social Sharing Images

Not included in the template. Create 1200 × 630 px images for each page before publishing.

| File (expected path) | Page |
|----------------------|------|
| `assets/images/og-home.webp` | index.html |
| `assets/images/og-menu.webp` | menu.html |
| `assets/images/og-story.webp` | story.html |
| `assets/images/og-gallery.webp` | gallery.html |
| `assets/images/og-reservation.webp` | reservation.html |

Recommended: dark-toned hero crop with the Dar Zafran wordmark in white. Test with [opengraph.xyz](https://www.opengraph.xyz).

---

## Favicon

| File | Format | Notes |
|------|--------|-------|
| `favicon.svg` | SVG | DZ monogram, terracotta background (`#B85C38`). Modern browsers support SVG natively. For legacy support, add a `favicon.ico` (32×32) linked in `<head>`. |

---

## Summary

| Category | Count |
|----------|-------|
| Images (PNG) | 9 |
| Videos (MP4) | 3 |
| OG images (not included — create before publishing) | 5 |
| Favicon (SVG) | 1 |
| **Total included** | **13** |
