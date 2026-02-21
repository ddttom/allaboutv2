# Los Granainos Restaurant - MX Reference Implementation

**Live Demo:** <https://allabout.network/mx/demo/salva/>

Bilingual (Spanish/English) restaurant website demonstrating MX OS multilingual SEO best practices.

---

## Overview

Los Granainos is a single-language-toggle MX-enhanced reference implementation combining:

- **Path-based multilingual SEO** — Separate `/es/` and `/en/` directories for proper search engine indexing
- **Full Schema.org Restaurant markup** — Menu sections, items, opening hours, location
- **WebMCP tool exposure** — AI agents can interact with menu data and language switching
- **Interactive Leaflet maps** — OpenStreetMap integration with contact info tooltips
- **Complete accessibility** — WCAG 2.1 AA compliance
- **Reginald certification** — Ready for MX registry publication

---

## Directory Structure

```
salva/
├── index.html              # Root redirect (language detection)
├── sitemap.xml             # Multilingual sitemap with hreflang
├── es/                     # Spanish version
│   ├── index.cog.html      # Spanish content (data-lang="es")
│   └── index.cog.css       # Shared styles
└── en/                     # English version
    ├── index.cog.html      # English content (data-lang="en")
    └── index.cog.css       # Shared styles
```

---

## Multilingual SEO Implementation

### Path-Based Language Routing

- **Spanish version:** `/mx/demo/salva/es/index.html` (default)
- **English version:** `/mx/demo/salva/en/index.html`
- **Root redirect:** `/mx/demo/salva/index.html` detects browser language

### hreflang Configuration

Both language versions include proper hreflang tags:

```html
<link rel="alternate" hreflang="es" href="https://allabout.network/mx/demo/salva/es/index.html" />
<link rel="alternate" hreflang="en" href="https://allabout.network/mx/demo/salva/en/index.html" />
<link rel="alternate" hreflang="x-default" href="https://allabout.network/mx/demo/salva/es/index.html" />
```

### Sitemap

`sitemap.xml` includes both language versions with bidirectional hreflang annotations for proper search engine discovery.

---

## Features

### Content Presentation

- Single-language display (one language visible at a time)
- Language toggle button navigates between `/es/` and `/en/` URLs
- Both versions contain identical bilingual content
- CSS controls visibility based on `data-lang` attribute on `<html>` element

### Navigation

Full navigation menu with sections:

- **Inicio** (Home) — Hero section with restaurant overview
- **Menú** (Menu) — Featured menu items
- **Carta Completa** (Full Menu) — Complete categorized menu
- **Nosotros** (About) — Restaurant history and story
- **Contacto** (Contact) — Map, address, hours, phone

### Schema.org Markup

Complete Restaurant schema with:

- Menu sections (Starters, Mains, Desserts, Drinks)
- Menu items with descriptions and prices
- Geographic coordinates
- Opening hours
- Contact information

### WebMCP Tools

AI agents can interact via WebMCP:

- `toggle-language` — Switch between Spanish/English versions
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
- Collapsible navigation for small screens
- Touch-friendly interactive elements
- Optimized for all device sizes

---

## Usage

### Viewing the Demo

1. **Direct access:** Open `/mx/demo/salva/` in a browser
2. **Language detection:** Root `index.html` redirects based on browser language
3. **Manual selection:** Visit `/es/index.html` or `/en/index.html` directly

### Testing Multilingual SEO

```bash
# Validate hreflang tags
curl -I https://allabout.network/mx/demo/salva/es/index.html

# Check sitemap
curl https://allabout.network/mx/demo/salva/sitemap.xml

# Test language detection redirect
curl -L https://allabout.network/mx/demo/salva/

# Validate with Google tools
# https://search.google.com/test/rich-results
# https://technicalseo.com/tools/hreflang/
```

---

## Migration Pattern

This implementation demonstrates the migration from hash-based to path-based language routing:

### Before (Hash-Based) ❌

```
/restaurant.html#lang=es
/restaurant.html#lang=en
```

**Problem:** Search engines ignore hash fragments. Both URLs are treated as one page.

### After (Path-Based) ✅

```
/es/restaurant.html
/en/restaurant.html
```

**Benefit:** Search engines index separately, proper language targeting, better rankings.

---

## Files Modified

**From original single-file hash-based version:**

- Frontmatter: Updated `languages` to structured format with URLs and `hreflang` array
- HTML: Set `lang` and `data-lang` attributes appropriately for each language version
- JavaScript: Removed hash-based toggling, replaced with path-based navigation
- WebMCP: Updated `toggle-language` tool to navigate between URLs

**New files:**

- `index.html` — Root redirect with language detection
- `sitemap.xml` — Multilingual sitemap with hreflang annotations
- `README.md` — This documentation

---

## Related Documentation

- **[MULTILINGUAL-SEO-GUIDE.md](../../../hub-content/mx-reference-implementations/_templates/MULTILINGUAL-SEO-GUIDE.md)** — Comprehensive multilingual SEO reference
- **[TEMPLATE-UPDATE-NOTES.md](../../../hub-content/mx-reference-implementations/_templates/TEMPLATE-UPDATE-NOTES.md)** — Migration implementation guide
- **[Cogify Manual](../../../hub-content/MX-Canon/MX-Maxine-Lives/manuals/manual-cogify.cog.md)** — Multilingual best practices section

---

## Version History

- **v2.2.0 (2026-02-21)** — Path-based multilingual SEO implementation
- **v2.1.0 (2026-02-20)** — Single-language toggle with hash-based routing
- **v2.0.0 (2026-02-20)** — Multi-page consolidation with Playwright accuracy
- **v1.0.0** — Original site extraction

---

**MX Technologies Ltd** — Making the web work for everyone and everything that uses it.
