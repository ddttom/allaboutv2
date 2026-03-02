---
name: manual-enhanced-audit
title: Enhanced Audit System Manual
description: Complete HTML/CSS/DOM capture system for pixel-perfect web replication with 24-hour asset caching and multi-format outputs.
author: Tom Cranstoun and Maxine
created: 2026-02-20T00:00:00.000Z
version: "2.0"
status: active
category: manual
tags:
  - manual
  - audit
  - playwright
  - dom
  - css
  - caching
  - web-replication
  - cogify
partOf: mx-maxine-lives
refersTo:
  - cogify-this
  - pixel-perfect-web-replication
purpose: Document enhanced audit - usage, workflow, and best practices
audience: human
stability: stable
runbook: Read when working with enhanced audit or understanding its functionality
contextProvides:
  - Complete HTML/CSS/DOM capture system for pixel-perfect web replication with 24-hour asset caching and multi-format outputs.
  - Usage guide and workflow for enhanced audit
  - Troubleshooting and best practices
---

# Enhanced Audit System Manual

Comprehensive HTML/CSS/DOM capture tool for extracting everything needed to rebuild websites with pixel-perfect accuracy.

---

## Overview

### What It Does

The Enhanced Audit System captures **complete website structure** before AI-powered cogification:

1. **Complete DOM Tree** - Every element, attribute, nesting level (including shadow DOM)
2. **Computed CSS** - All styles for every element with inherited values and cascade resolution
3. **Original Stylesheets** - Raw CSS files as authored by developers
4. **CSS Cascade Map** - Which rules win for each property (specificity tracking)
5. **Visual Specifications** - Exact colors (RGB → hex), typography, layout measurements
6. **Asset Inventory** - Images, fonts, resources with URLs and dimensions
7. **Navigation Structure** - Complete site navigation with links
8. **Validation Baseline** - Automated comparison metrics for QA

### Why Use It

**Problem:** Building pixel-perfect replications without guessing

**Solution:** Capture all data upfront, work offline, validate automatically

**Benefits:**

- ✅ No color/font guessing - Exact specifications extracted
- ✅ Offline development - 24-hour cached HTML/CSS
- ✅ Automated validation - Baseline comparison
- ✅ Complete accuracy - DOM structure preserved
- ✅ Fast workflow - Single command capture

---

## Quick Start

### Installation (One-Time)

```bash
npm run cogify:install
```

This installs:

- Playwright (browser automation)
- Enhanced Audit System dependencies
- Chromium browser for capture

### Basic Usage

```bash
# Audit any website
npm run cogify -- --target=https://example.com

# Custom output directory
npm run cogify -- --target=https://restaurant.com --output-dir=./restaurant-audit

# Quick audit without caching
npm run cogify -- --target=https://hotel.com --cache-assets=false
```

### Check Cache Validity

```bash
npm run cogify:check
```

Output shows cache status and expiry time (24-hour TTL).

---

## Commands

### npm run cogify

**Description:** Extract all website data for cogification

**Syntax:**

```bash
npm run cogify -- --target=<url> [options]
```

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `--target=<url>` | (required) | Website URL to audit |
| `--output-dir=<path>` | `./audit` | Output directory |
| `--cache-assets=<bool>` | `true` | Cache HTML/CSS locally (24h) |
| `--ttl=<ms>` | `86400000` | Cache TTL (milliseconds) |
| `--verbose=<bool>` | `true` | Show progress indicators |

**Examples:**

```bash
# Basic audit
npm run cogify -- --target=https://los-granainos.pages.dev

# Custom output with 12-hour cache
npm run cogify -- --target=https://hotel.com --output-dir=./hotel --ttl=43200000

# Fast audit without asset caching
npm run cogify -- --target=https://site.com --cache-assets=false
```

### npm run cogify:install

**Description:** Install dependencies and Playwright browsers

**Syntax:**

```bash
npm run cogify:install
```

**What it installs:**

- Playwright npm package
- Chromium browser
- Enhanced Audit System modules

**When to use:** Once per machine, or after system updates

### npm run cogify:check

**Description:** Check cache validity and status

**Syntax:**

```bash
npm run cogify:check
```

**Output:**

```json
{
  "valid": true,
  "timeRemaining": "18h 23m",
  "assetCount": 2,
  "cacheDir": "./audit",
  "expiresAt": "2026-02-21T15:16:38.847Z"
}
```

**When to use:** Before working offline, to verify cache is still valid

---

## Output Files

### Directory Structure

Running `npm run cogify -- --target=https://example.com` creates:

```
audit/
├── audit-data.json              # 165KB - Complete DOM + CSS
├── validation-baseline.json     # Structural metrics
├── visual-audit-report.md       # Human-readable specs
├── cache-manifest.json          # Asset tracking
│
├── screenshots/
│   └── homepage.png             # Full-page visual reference
│
├── cached-html/
│   └── index-[hash].html        # Rendered HTML (24h TTL)
│
└── cached-css/
    └── stylesheet-[hash].css    # Stylesheets (24h TTL)
```

### audit-data.json

**Size:** ~165KB

**Contents:**

- `metadata` - Version, timestamp, viewport, user agent
- `dom` - Complete element tree with all attributes
- `computedStyles` - CSS for all elements (51+ selectors)
- `stylesheets` - Original CSS files
- `colors` - RGB → hex color palette
- `images` - Image inventory with URLs
- `navigation` - Site navigation structure

**Usage:**

```javascript
const auditData = require('./audit/audit-data.json');

// Get DOM structure
const domTree = auditData.dom;

// Get colors
const colors = auditData.colors;

// Get font families
const fonts = Object.values(auditData.computedStyles)
  .map(s => s['font-family'])
  .filter(Boolean);
```

### validation-baseline.json

**Size:** ~800 bytes

**Contents:**

```json
{
  "structure": {
    "elementCount": 166,
    "maxDepth": 10,
    "sections": ["inicio", "nosotros", "menu", "contacto"],
    "landmarks": ["main", "navigation", "contentinfo"]
  },
  "styles": {
    "colorCount": 14,
    "fontFamilies": ["Lato", "Playfair Display"],
    "customPropertiesCount": 65
  }
}
```

**Usage:** Automated validation of implementation vs. original

### visual-audit-report.md

**Size:** ~1KB

**Contents:**

- Overview statistics
- Color palette (RGB → hex)
- Typography specifications
- Image inventory
- Navigation structure

**Usage:** Human-readable reference during development

### cache-manifest.json

**Size:** ~700 bytes

**Contents:**

```json
{
  "version": "2.0.0",
  "cachedAt": "2026-02-20T15:16:38.847Z",
  "expiresAt": "2026-02-21T15:16:38.847Z",
  "ttl": 86400000,
  "assets": {
    "https://example.com": {
      "type": "html",
      "localPath": "audit/cached-html/index-e760d848.html",
      "hash": "17580bce865e283b",
      "size": 19914
    }
  }
}
```

**Usage:** Track cached assets, verify integrity, check expiry

---

## Workflow Integration

### Step-by-Step Cogification

```bash
# 1. Capture website data
npm run cogify -- --target=https://restaurant.com

# 2. Review captured data
cat audit/visual-audit-report.md
open audit/screenshots/homepage.png

# 3. Use data for AI-powered cogification
# - Read audit-data.json for DOM structure
# - Apply exact colors from color palette
# - Use computed typography specs
# - Reference cached HTML for offline work

# 4. Validate implementation
# Compare against validation-baseline.json
```

### Integration with Cogify-This

The Enhanced Audit System is **Step 1.5** in the cogify-this workflow:

```
Step 1: Analyze Source
Step 1.5: Run Enhanced HTML/CSS Audit ← npm run cogify
Step 2: Select Template
Step 3: Generate YAML Frontmatter
...
```

See: `mx-canon/MX-Cog-Registry/cogs/cogify-this.cog.md`

---

## Cache Management

### 24-Hour TTL

All cached assets expire after 24 hours to ensure data freshness.

**Check validity:**

```bash
npm run cogify:check
```

**Refresh expired cache:**

```bash
npm run cogify -- --target=https://example.com
# Automatically detects changes and updates cache
```

### Offline Development

With cached assets, work without internet:

```bash
# View cached original
open audit/cached-html/index-abc123.html

# View your implementation
open my-implementation.html

# Compare side-by-side offline
```

### Cache Mismatch Detection

If the original site changes during development:

```bash
npm run cogify -- --target=https://example.com

# Output:
# ⚠ WARNING: Site has changed since last audit
# Screenshot hash: abc123 (cached) vs def456 (current)
# Proceeding with newer data...
# Updating cache...
```

### Manual Cache Cleanup

```bash
# Clear all cached assets
rm -rf audit/cached-*
rm audit/cache-manifest.json

# Re-run audit to rebuild cache
npm run cogify -- --target=https://example.com
```

---

## Advanced Usage

### Direct Method (Alternative)

For advanced users who need finer control:

```bash
cd mx-canon/mx-the-gathering/reference-implementations/_templates/audit-system
npm install
npx playwright install chromium
node enhanced-audit.js --target=https://example.com --output-dir=../../my-project/audit
```

### Custom TTL

```bash
# 12-hour cache
npm run cogify -- --target=https://example.com --ttl=43200000

# 48-hour cache
npm run cogify -- --target=https://example.com --ttl=172800000

# No expiry (not recommended)
npm run cogify -- --target=https://example.com --ttl=0
```

### Multiple Audits

```bash
# Audit multiple sites with separate directories
npm run cogify -- --target=https://site1.com --output-dir=./site1-audit
npm run cogify -- --target=https://site2.com --output-dir=./site2-audit
npm run cogify -- --target=https://site3.com --output-dir=./site3-audit
```

---

## Troubleshooting

### "Dependencies not installed"

**Error:**

```
❌ ERROR: Dependencies not installed

Run this command first:
  npm run cogify:install
```

**Fix:**

```bash
npm run cogify:install
```

### "Playwright browser not installed"

**Error:**

```
⚠️  WARNING: Playwright may not be fully installed
```

**Fix:**

```bash
cd mx-canon/mx-the-gathering/reference-implementations/_templates/audit-system
npx playwright install chromium
```

### "Invalid URL"

**Error:**

```
❌ ERROR: Invalid URL: example.com
```

**Fix:** Use fully-qualified URLs:

```bash
# ❌ Wrong
npm run cogify -- --target=example.com

# ✅ Correct
npm run cogify -- --target=https://example.com
```

### Cache Taking Too Much Space

**Problem:** Multiple audits consuming disk space

**Fix:**

```bash
# Remove old audit directories
rm -rf audit-*

# Clear current audit cache
rm -rf audit/cached-*
rm audit/cache-manifest.json
```

### Slow Execution

**Problem:** Audit taking longer than expected

**Possible causes:**

- Large website with many resources
- Slow network connection
- Heavy JavaScript rendering

**Optimization:**

```bash
# Skip asset caching for faster audit
npm run cogify -- --target=https://large-site.com --cache-assets=false
```

---

## Architecture

### Modular Design

```
Enhanced Audit System
    ├── DOM Extractor (lib/dom-extractor.js)
    │   └── Serializes complete DOM tree
    ├── CSS Analyzer (lib/css-analyzer.js)
    │   └── Extracts computed styles + cascade
    ├── Asset Cacher (lib/asset-cacher.js)
    │   └── Manages 24h TTL cache
    └── Output Generators
        ├── audit-data.json
        ├── validation-baseline.json
        └── visual-audit-report.md
```

### Performance

| Metric | Typical Value |
|--------|---------------|
| Total execution time | ~8 seconds |
| Page load time | ~2 seconds |
| DOM extraction | <1 second |
| CSS analysis | ~1 second |
| Screenshot capture | ~2 seconds |
| Asset caching | <1 second |
| Total output size | ~1.2 MB |

---

## Known Limitations

### 1. Color Palette Extraction

**Issue:** Only captures explicitly set colors, not all computed colors

**Impact:** May miss some background/border colors

**Workaround:** Parse `audit-data.json` → `computedStyles` for complete color data

**Future:** Phase 2 enhancement to extract all computed colors

### 2. Image Inventory

**Issue:** May not capture all images (especially dynamic/lazy-loaded)

**Impact:** Some images may need manual identification

**Workaround:** Parse DOM tree in `audit-data.json` for img elements

**Future:** Phase 2 enhancement for complete image extraction

### 3. Navigation Links

**Issue:** May not extract all navigation links

**Impact:** Manual navigation structure verification needed

**Workaround:** Parse DOM tree for nav/a elements

**Future:** Phase 2 enhancement for complete navigation extraction

### 4. Dynamic Content

**Issue:** Content loaded after page load may not be captured

**Impact:** Infinite scroll, lazy loading may require manual capture

**Workaround:** Increase wait time or manual inspection

**Future:** Configurable wait strategies

---

## Files and Locations

### Core System

| File | Location | Purpose |
|------|----------|---------|
| `enhanced-audit.js` | `_templates/audit-system/` | Main entry point |
| `dom-extractor.js` | `_templates/audit-system/lib/` | DOM extraction |
| `css-analyzer.js` | `_templates/audit-system/lib/` | CSS analysis |
| `asset-cacher.js` | `_templates/audit-system/lib/` | Cache management |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | System overview |
| `AUDIT-ARCHITECTURE.md` | Technical architecture |
| `TEST-RESULTS.md` | Testing and validation |
| `COGIFY-GUIDE.md` | Complete workflow guide |
| `NPM-COGIFY-SUMMARY.md` | Implementation details |

### CLI Wrapper

| File | Location | Purpose |
|------|----------|---------|
| `cogify.js` | `scripts/` | User-friendly CLI wrapper |

---

## Examples

### Example 1: Restaurant Website

```bash
npm run cogify -- --target=https://los-granainos.pages.dev
```

**Captured:**

- Color palette: coral #d4704b, cream #f4e8d0
- Typography: Playfair Display 128px, Lato 16px
- 166 elements, max depth 10
- 4 sections: inicio, nosotros, menu, contacto
- Full navigation structure

**Time:** ~8 seconds

### Example 2: Hotel Website

```bash
npm run cogify -- --target=https://hotel.example.com --output-dir=./hotel-audit
```

**Use case:** Content-heavy site with many pages

**Output:** All assets cached in `./hotel-audit/` for offline work

### Example 3: Quick Audit

```bash
npm run cogify -- --target=https://boutique.com --cache-assets=false
```

**Use case:** Quick design reference without offline development

**Time:** ~5 seconds (no caching overhead)

---

## Partnership Reporting

### Generating Client Reports

When using audit data to generate client reports, **always use partnership tone** rather than critical/technical tone.

**Key Principle:** Lead with strengths, frame opportunities constructively, demonstrate partnership value.

**Complete Guidelines:**

- **Partnership Reporting Manual:** [`manual-partnership-reporting.cog.md`](manual-partnership-reporting.cog.md)
  - 4 pillars: Strengths First, Opportunity Framing, Educational, Partnership Positioning
  - Language transformation guide (critical → partnership)
  - Writing checklist and anti-patterns
  - Examples gallery (Dotfusion, ArriveFirst, Boye & Co, GEO samples)

**Report Template:**

- **Partnership Report Template:** [`mx-canon/mx-the-gathering/reference-implementations/_templates/partnership-report-template.md`](../../mx-reference-implementations/_templates/partnership-report-template.md)
  - Complete structure with YAML frontmatter
  - Example text for every section
  - Engagement options framework

**Tone Transformation Examples:**

| ❌ Avoid (Critical) | ✅ Use (Partnership) |
|---------------------|----------------------|
| "349 violations" | "349 patterns identified - service opportunity" |
| "Critical issues" | "Optimization opportunities" |
| "Compliance crisis" | "Compliance baseline with clear roadmap" |
| "Missing" | "Quick win opportunity" |

**Automated Report Generation:**

The HTML baseline comparison tool (`scripts/audit-html-compare.js`) automatically generates partnership-tone reports. All MX audit tools follow this framework.

---

## Reference

### Related Documentation

- **Cogify-This Manual:** `manual-cogify.cog.md`
- **Cogify-This Cog:** `MX-Cog-Registry/cogs/cogify-this.cog.md`
- **Pixel-Perfect Replication:** `MX-Cog-Registry/cogs/pixel-perfect-web-replication.cog.md`
- **Partnership Reporting:** `manual-partnership-reporting.cog.md` — Complete guidelines for client-facing reports

### npm Scripts

```bash
npm run cogify              # Run enhanced audit
npm run cogify:install      # Install dependencies
npm run cogify:check        # Check cache validity
```

### Help

```bash
npm run cogify -- --help
```

Shows complete usage, options, examples, and workflow.

---

**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-02-20
**Author:** Cog-Nova-MX Ltd

*"Capture first, build second = pixel-perfect on first attempt."*
