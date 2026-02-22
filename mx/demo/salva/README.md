# Los Granainos Restaurant - N-Language MX Reference Implementation

**Live Demo:** <https://allabout.network/mx/demo/salva/>

N-language (Spanish/English) restaurant website demonstrating MX OS multilingual SEO best practices with shared assets architecture.

---

## Overview

Los Granainos is an n-language MX-enhanced reference implementation combining:

- **N-language architecture** — Shared `/assets/` folder with language-agnostic CSS/JS
- **Path-based multilingual SEO** — Separate `/es/` and `/en/` directories for proper search engine indexing
- **Full Schema.org Restaurant markup** — Menu sections, items, opening hours, location
- **WebMCP tool exposure** — AI agents can interact with menu data and language switching
- **Interactive Leaflet maps** — OpenStreetMap integration with contact info tooltips
- **Complete accessibility** — WCAG 2.1 AA compliance
- **REGINALD-ready** — Prepared for server-side language redirect at edge layer

---

## Directory Structure

```
salva/
├── assets/                 # Shared assets (n-language architecture)
│   ├── style.css           # Shared CSS (all languages)
│   └── script.js           # Shared JS (n-language aware)
├── es/                     # Spanish version
│   └── index.cog.html      # Spanish content (lang="es")
├── en/                     # English version
│   └── index.cog.html      # English content (lang="en")
├── index.html              # Root redirect (Accept-Language detection)
├── sitemap.xml             # Multilingual sitemap with hreflang
└── README.md               # This documentation
```

---

## N-Language Architecture

### Key Principles

1. **Zero duplication** — CSS and JS in `/assets/` shared across all languages
2. **N-language support** — Add new languages by creating directory + HTML only
3. **Language-agnostic code** — JS auto-detects current language from URL path
4. **No persistence** — Always follows Accept-Language header (GDPR compliant)
5. **Regional variant cascade** — `es-MX` → `es` → default language

### Shared Assets

**`/assets/style.css`** — Single stylesheet for all language versions:

- CSS variables for consistent theming
- Responsive breakpoints (mobile-first)
- Hamburger menu with slide-in drawer
- Print styles

**`/assets/script.js`** — N-language aware JavaScript:

- Auto-detects current language from URL path (`/es/`, `/en/`, `/fr/`)
- Language selector works with any number of languages
- WebMCP tool definitions
- Hamburger menu logic
- Smooth scroll for anchor links

### Adding a New Language

1. Create new directory: `mkdir fr/`
2. Copy HTML template: `cp en/index.cog.html fr/index.cog.html`
3. Update content to French
4. Update `lang` attribute: `<html lang="fr">`
5. Add option to language selector in HTML
6. Update `index.html` available languages array
7. Update `sitemap.xml` with new language URLs

No CSS or JS changes required.

---

## Multilingual SEO Implementation

### Path-Based Language Routing

- **Spanish version:** `/mx/demo/salva/es/index.html` (default)
- **English version:** `/mx/demo/salva/en/index.html`
- **Root redirect:** `/mx/demo/salva/index.html` detects browser language

### Accept-Language Detection

Root `index.html` implements cascading language detection:

```javascript
// Regional variant cascade: es-MX → es → default
function findBestLanguage(browserLangs, available, defaultLang) {
  for (const pref of browserLangs) {
    if (available.includes(pref.full)) return pref.full;  // es-mx
    if (available.includes(pref.base)) return pref.base;  // es
  }
  return defaultLang;
}
```

### hreflang Configuration

Both language versions include proper hreflang tags:

```html
<link rel="alternate" hreflang="es" href="https://allabout.network/mx/demo/salva/es/index.html" />
<link rel="alternate" hreflang="en" href="https://allabout.network/mx/demo/salva/en/index.html" />
<link rel="alternate" hreflang="x-default" href="https://allabout.network/mx/demo/salva/es/index.html" />
```

### REGINALD Edge Redirect

When deployed with REGINALD, server-side language detection happens at Cloudflare Workers level:

- Eliminates flash of wrong content
- Proper SEO for crawlers without JS execution
- <10ms added latency
- Client-side `index.html` serves as fallback

See: `packages/mx-collaboration/proposals/reginald-language-redirect.md`

---

## Features

### Mobile Navigation (Hamburger Menu)

- CSS-only 3-line icon (::before/::after pseudo-elements)
- Slide-in drawer from right (300ms transition)
- Overlay click to close
- Escape key to close
- Body scroll lock when open
- ARIA states for accessibility

### Language Selector

- `<select>` dropdown (n-language support, not binary toggle)
- Inside drawer on mobile, in nav on desktop
- Auto-selects current language based on path
- Navigates to equivalent page in selected language

### WebMCP Tools

AI agents can interact via WebMCP:

- `toggle-language` — Switch to any available language
- `get-language-info` — Get current and available languages
- `menu-query` — Query menu items by category
- `reservation-info` — Get contact and booking information
- `location-info` — Get geographic location data

---

## Design Notes

### Visual Accuracy

Pixel-perfect recreation based on Playwright capture of original site:

- **Hero section:** No images, full-width gradient only
- **Typography:** Google Fonts (Lato + Playfair Display)
- **Branding:** "DESDE 1987" in coral above massive serif title
- **Colors:** Exact RGB values from original site

### Responsive Design

- Mobile-first approach
- Hamburger navigation for screens < 900px
- Touch-friendly interactive elements
- Optimized for all device sizes

---

## Usage

### Viewing the Demo

1. **Direct access:** Open `/mx/demo/salva/` in a browser
2. **Language detection:** Root `index.html` redirects based on browser language
3. **Manual selection:** Visit `/es/index.html` or `/en/index.html` directly

### Testing

```bash
# Validate hreflang tags
curl -I https://allabout.network/mx/demo/salva/es/index.html

# Check sitemap
curl https://allabout.network/mx/demo/salva/sitemap.xml

# Test language detection redirect
curl -L https://allabout.network/mx/demo/salva/

# Test with specific Accept-Language header
curl -H "Accept-Language: en-US,en;q=0.9" -L https://allabout.network/mx/demo/salva/
```

---

## Version History

- **v3.0.0 (2026-02-22)** — N-language architecture with shared assets
- **v2.2.0 (2026-02-21)** — Path-based multilingual SEO implementation
- **v2.1.0 (2026-02-20)** — Single-language toggle with hash-based routing
- **v2.0.0 (2026-02-20)** — Multi-page consolidation with Playwright accuracy
- **v1.0.0** — Original site extraction

---

## Related Documentation

- **[REGINALD Language Redirect Proposal](../../../packages/mx-collaboration/proposals/reginald-language-redirect.md)** — Server-side language detection
- **[Cogify Manual](../../../hub-content/MX-Canon/MX-Cog-Registry/cogs/cogify-this.cog.md)** — N-language architecture documentation
- **[N-Lang Business Template](../../../hub-content/mx-reference-implementations/_templates/n-lang-business-template.cog.html)** — Template for n-language sites

---

**MX Technologies Ltd** — Making the web work for everyone and everything that uses it.
