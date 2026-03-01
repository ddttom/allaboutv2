---
name: manual-cogify
title: Cogify Workflow Manual
description: Complete guide to converting existing content into MX-enhanced format with metadata, accessibility, and WebMCP integration.
author: Tom Cranstoun and Maxine
created: 2026-02-20T00:00:00.000Z
version: "1.5"
status: active
category: manual
tags:
  - manual
  - cogify
  - conversion
  - mx-enhancement
  - metadata
  - webmcp
  - accessibility
  - workflow
partOf: mx-maxine-lives
refersTo:
  - cogify-this
  - enhanced-audit
  - pixel-perfect-web-replication
mx:
  purpose: Document cogify - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: Read when working with cogify or understanding its functionality
  ai:
    contextProvides:
      - Complete guide to converting existing content into MX-enhanced format with metadata, accessibility, and WebMCP integration.
      - Usage guide and workflow for cogify
      - Troubleshooting and best practices
---

# Cogify Workflow Manual

Complete guide to converting existing websites, documents, and content into MX-enhanced format that is machine-readable, accessible, and certifiable.

---

## Overview

### What is Cogification?

**Cogification** transforms existing content into MX-enhanced format by adding:

1. **Comprehensive YAML frontmatter** - 20+ metadata fields
2. **Schema.org markup** - Machine-readable structured data
3. **WebMCP tool definitions** - AI agent interaction capability
4. **WCAG 2.1 AA accessibility** - Compliant and inclusive
5. **Reginald certification** - Verified and trusted

### Why Cogify?

**Problem:** Content exists but isn't machine-readable, accessible, or certifiable

**Solution:** Add structured metadata and enhancement layers

**Benefits:**

- ✅ AI agents can parse and understand
- ✅ Search engines get structured data
- ✅ Accessible to all users (WCAG 2.1 AA)
- ✅ Certifiable for Reginald registry
- ✅ Future-proof with open standards

### Output Formats

- `.cog.html` - HTML pages with embedded YAML metadata
- `.cog.md` - Markdown documents with YAML frontmatter
- `.cog.json` - JSON data with embedded metadata

---

## Quick Start

### 3-Step Cogification

```bash
# Step 1: Capture website data
npm run cogify -- --target=https://restaurant.com

# Step 2: Copy template (n-language architecture)
cp mx-canon/mx-the-gathering/reference-implementations/_templates/n-lang-business-template.cog.html \
   my-restaurant/en/index.cog.html

# Step 3: Customize with captured data
# - Replace [placeholders] with business info
# - Apply exact colors from audit/visual-audit-report.md
# - Use typography specs from audit
# - Add additional languages (copy to /es/, /de/, etc.)
# - Validate and register
```

---

## Complete Workflow

### Step 1: Analyze Source

**Identify:**

- Content type (HTML, markdown, PDF, etc.)
- Language(s) present
- Business/content domain
- Schema.org type (Restaurant, Hotel, Product, etc.)
- Existing metadata and structure

**Commands:**

```bash
# View source
open https://example.com

# Check meta tags
curl -s https://example.com | grep -i "meta"

# Identify languages
curl -s https://example.com | grep -i "lang"
```

### Step 1.5: Run Enhanced HTML/CSS Audit (Highly Recommended)

**Purpose:** Capture complete website structure before AI processing

**Command:**

```bash
# One-time setup
npm run cogify:install

# Audit website
npm run cogify -- --target=https://restaurant.com

# Review outputs
cat audit/visual-audit-report.md
open audit/screenshots/homepage.png
```

**What you get:**

- Complete DOM tree (`audit-data.json`)
- Exact colors (RGB → hex)
- Computed typography specifications
- 24-hour cached HTML/CSS for offline work
- Validation baseline for automated testing

**Benefits:**

- ✅ No guessing at colors or fonts
- ✅ Pixel-perfect accuracy achievable
- ✅ Work offline with cached assets
- ✅ Automated validation

**See:** `manual-enhanced-audit.cog.md` for complete documentation

### Step 2: Select Template

**Available templates:**

| Template | Use Case |
|----------|----------|
| `n-lang-business-template.cog.html` | N-language with shared assets (1, 2, 3... n languages) |
| `standard-doc-template.cog.md` | Documentation pages |
| `action-doc-template.cog.md` | Executable action-docs |
| `info-doc-template.cog.md` | Descriptive info-docs |

**N-Language Architecture:**

```
Supports any number of languages with shared CSS/JS:
- 1 language: /en/ only
- 2 languages: /en/ + /es/
- 3+ languages: /en/ + /es/ + /de/ + /fr/ ...

Add languages by creating directories + HTML.
No code changes required.
```

**Command:**

```bash
# Create directory structure
mkdir -p my-business/{assets,en,es}

# Copy template to first language
cp mx-canon/mx-the-gathering/reference-implementations/_templates/n-lang-business-template.cog.html \
   my-business/en/index.cog.html

# Copy shared assets from reference implementation
cp allaboutv2/mx/demo/salva/assets/style.css my-business/assets/
cp allaboutv2/mx/demo/salva/assets/script.js my-business/assets/
```

### Step 3: Generate YAML Frontmatter

**Required fields:**

```yaml
name: business-name                    # Unique identifier (kebab-case)
title: "Business Name"                 # Human-readable title
description: "One-sentence summary"    # Brief description
version: "1.0.0"                       # Semantic version
created: 2026-02-20                    # ISO date
modified: 2026-02-20                   # ISO date
author: "Business Owner"               # Creator name
category: restaurant                   # Classification
status: active                         # active|draft|deprecated
tags: [spanish, english, bilingual]    # Keywords
audience: both                         # tech|business|both|humans
```

**MX-specific fields:**

```yaml
mx:
  runtime: browser                     # browser|node|runbook|shell
  runbook: |                           # Usage instructions
    This is a bilingual restaurant reference...
```

**Advanced fields:**

```yaml
builds-on: [what-is-a-cog]             # Dependencies
partOf: mx-reference-implementations   # Parent collection
refersTo: [bilingual-business-template] # Related cogs
certification:                         # COG certification
  cog:
    version: "1.0"
    issued: "2026-02-20T00:00:00Z"
registry:                              # Reginald registration
  reginald:
    category: restaurants
    visibility: public
```

### Step 4: Add Schema.org Markup

**Common types:**

| Business Type | Schema.org Type |
|--------------|----------------|
| Restaurant | `Restaurant` |
| Hotel | `Hotel` |
| Retail shop | `Store` |
| Professional service | `ProfessionalService` |
| Healthcare | `MedicalBusiness` |
| Real estate | `RealEstateAgent` |

**Example (Restaurant):**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Los Granainos",
  "description": "Authentic Spanish cuisine in Cala de Mijas",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Principal 123",
    "addressLocality": "Cala de Mijas",
    "addressCountry": "ES"
  },
  "telephone": "+34-952-123-456",
  "servesCuisine": "Spanish",
  "priceRange": "€€"
}
</script>
```

**Validation:**

```bash
# Validate at https://validator.schema.org/
# Or use Google Rich Results Test
```

### Step 5: Implement WebMCP Tools

**Common tool patterns:**

```javascript
// Menu query tool
window.mcp_tools = {
  "menu-query": {
    name: "menu-query",
    description: "Query restaurant menu items",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string" },
        priceRange: { type: "string" }
      }
    },
    execute: async function(params) {
      // Implementation
    }
  }
};
```

**Declare in meta tag:**

```html
<meta name="mcp:tools" content='["menu-query", "reservation-info", "toggle-language"]'>
```

**Test invocation:**

```javascript
// In browser console
window.mcp_tools["menu-query"].execute({ category: "fish" })
```

### Step 6: Ensure Accessibility (WCAG 2.1 AA)

**Checklist:**

- [ ] Skip navigation link
- [ ] Semantic HTML (header, main, nav, footer)
- [ ] ARIA labels where needed
- [ ] Sufficient color contrast (4.5:1 for normal text)
- [ ] Alt text for all images
- [ ] Keyboard navigation works
- [ ] Form labels present
- [ ] Heading hierarchy correct (h1 → h2 → h3)

**Testing:**

```bash
# Install pa11y
npm install -g pa11y

# Test accessibility
pa11y my-business.cog.html

# Or use WAVE browser extension
# https://wave.webaim.org/extension/
```

### Step 7: Implement N-Language Architecture

**Directory structure:**

```
my-site/
├── assets/              # Shared CSS/JS (all languages)
│   ├── style.css
│   └── script.js
├── en/                  # English version
│   └── index.cog.html
├── es/                  # Spanish version
│   └── index.cog.html
└── index.html           # Root redirect (Accept-Language detection)
```

**Root redirect (index.html):**

```html
<script>
  const availableLanguages = ['en', 'es'];
  const defaultLanguage = 'en';

  function parseLanguagePreferences() {
    const languages = navigator.languages || [navigator.language];
    return languages.map(lang => ({
      full: lang.toLowerCase(),
      base: lang.toLowerCase().split('-')[0]
    }));
  }

  function findBestLanguage(browserLangs, available, defaultLang) {
    for (const pref of browserLangs) {
      if (available.includes(pref.full)) return pref.full;
      if (available.includes(pref.base)) return pref.base;
    }
    return defaultLang;
  }

  const browserPrefs = parseLanguagePreferences();
  const targetLang = findBestLanguage(browserPrefs, availableLanguages, defaultLanguage);
  window.location.replace('./' + targetLang + '/');
</script>
```

**Language selector (in shared script.js):**

```javascript
function getCurrentLanguage() {
  const match = window.location.pathname.match(/\/([a-z]{2})\//i);
  return match ? match[1].toLowerCase() : 'en';
}

document.querySelector('.language-select')?.addEventListener('change', (e) => {
  const targetLang = e.target.value;
  const currentPath = window.location.pathname;
  const newPath = currentPath.replace(/\/[a-z]{2}\//i, `/${targetLang}/`);
  window.location.href = newPath;
});
```

**GDPR Compliance:**

- No cookies
- No localStorage
- Always follows browser Accept-Language header

### Step 8: Add Certification Metadata

**Certification block:**

```yaml
certification:
  cog:
    version: "1.0"
    issued: "2026-02-20T00:00:00Z"
    issuer:
      name: "Cog-Nova-MX Ltd"
      id: "mx-tech-001"
      authority: "reginald.mx"
    governance:
      license: MIT
      attribution-required: false
      modification-allowed: true
      commercial-use: true
```

**Provenance:**

```yaml
provenance:
  source: "https://original-site.com"
  captured: "2026-02-20"
  method: "enhanced-audit-system"
  transformed: "cogification"
```

### Step 9: Validate

**W3C HTML Validator:**

```bash
# Online: https://validator.w3.org/
# Or use html-validate
npm install -g html-validate
html-validate my-business.cog.html
```

**WCAG Compliance:**

```bash
pa11y my-business.cog.html
```

**Schema.org Validation:**

```bash
# Visit: https://validator.schema.org/
# Paste URL or HTML
```

**YAML Frontmatter:**

```bash
npm run cog:validate -- my-business.cog.html
```

**Markdown Lint (for .cog.md):**

```bash
npm run lint:markdown:fix
```

### Step 10: Register

**Add to cog registry:**

```bash
npm run registry:add -- my-business.cog.html
```

**Update Reginald index:**

```bash
npm run cog:sync
```

**Validate registry entry:**

```bash
npm run cog:validate
```

**Publish to CDN (if public):**

```bash
# Future feature
npm run registry:publish -- my-business.cog.html
```

---

## Real-World Example: Los Granainos Restaurant

### Source

- **URL:** <https://los-granainos.pages.dev/>
- **Pages:** 7 (home, menu, about, contact, etc.)
- **Languages:** Spanish and English
- **Type:** Restaurant

### Process

**Step 1.5: Enhanced Audit**

```bash
npm run cogify -- --target=https://los-granainos.pages.dev
```

**Captured:**

- 166 elements, max depth 10
- Colors: coral #d4704b, cream #f4e8d0
- Typography: Playfair Display 128px, Lato 16px
- 4 sections: inicio, nosotros, menu, contacto

**Step 2: Selected template**

```bash
# Create n-language structure
mkdir -p salva/{assets,es,en}

# Copy n-language template
cp n-lang-business-template.cog.html salva/es/index.cog.html
```

**Step 3-10: Customization**

- Applied exact colors from audit to shared /assets/style.css
- Used exact typography specifications
- Added Schema.org Restaurant markup
- Implemented 4 WebMCP tools in shared /assets/script.js
- Ensured WCAG 2.1 AA compliance
- Added certification metadata
- Created English version (es/ → en/)

### Result

**Output:** N-language Salva demo at `allaboutv2/mx/demo/salva/`

**Features:**

- 180 lines of YAML frontmatter (per language)
- Shared /assets/ folder (CSS + JS)
- Path-based routing (/es/, /en/)
- Accept-Language detection
- Pixel-perfect visual match to original
- Machine-readable (Schema.org)
- AI-interactive (WebMCP)
- Accessible (WCAG 2.1 AA)
- Certifiable (Reginald ready)

**Files:**

- `allaboutv2/mx/demo/salva/es/index.cog.html` (Spanish)
- `allaboutv2/mx/demo/salva/en/index.cog.html` (English)
- `allaboutv2/mx/demo/salva/assets/` (shared CSS/JS)
- `allaboutv2/mx/demo/salva/index.html` (root redirect)

---

## Best Practices

### Content Preservation

✅ **DO:**

- Preserve 100% of original content
- Maintain structure and hierarchy
- Keep existing styling (or improve)
- Enhance with metadata, don't replace

❌ **DON'T:**

- Delete original content
- Break existing functionality
- Remove accessibility features
- Lose information in transformation

### Metadata Quality

✅ **DO:**

- Be comprehensive (20+ YAML fields minimum)
- Be accurate (validate all data)
- Be specific (precise descriptions)
- Be consistent (follow conventions)

❌ **DON'T:**

- Use generic descriptions
- Leave required fields empty
- Copy-paste without customization
- Ignore validation warnings

### Accessibility

✅ **DO:**

- Test with assistive technology
- Ensure keyboard navigation
- Provide text alternatives
- Meet WCAG 2.1 AA minimum

❌ **DON'T:**

- Rely on color alone
- Hide content from screen readers
- Skip semantic HTML
- Ignore contrast ratios

### Visual Capture

✅ **DO:**

- Use Enhanced Audit System for data capture
- Extract exact RGB colors from audit reports
- Use computed typography from CSS analysis
- Leverage cached HTML/CSS for offline work
- Reference validation baseline for testing
- Link to original images (don't download)
- Generate screenshots for verification

❌ **DON'T:**

- Guess at colors or typography
- Manually inspect CSS when automation available
- Download images (link to originals)
- Skip visual comparison against source

### N-Language Architecture

✅ **DO:**

- Use shared /assets/ folder for CSS and JavaScript
- Create separate directories for each language (/en/, /es/, /de/)
- Use path-based routing (not query parameters or hash fragments)
- Implement Accept-Language detection at root
- Add hreflang tags for SEO
- Follow GDPR compliance (no cookies for language preference)
- Auto-detect language from URL path in JavaScript

❌ **DON'T:**

- Duplicate CSS/JS across language versions
- Use query parameters (?lang=en) for language routing
- Use hash fragments (#lang=es) for language routing
- Store language preference in cookies/localStorage
- Hardcode available languages in multiple places
- Forget to update hreflang when adding languages

---

## Multilingual SEO Best Practices

### Path-Based Language Routing (Required for SEO)

**❌ DON'T use query parameters or hash fragments:**

```html
<!-- BAD - no SEO benefit -->
<a href="?lang=en">English</a>
<a href="#lang=es">Español</a>
```

**✅ DO use path-based URLs:**

```html
<!-- GOOD - proper SEO -->
<a href="/en/restaurant.html">English</a>
<a href="/es/restaurant.html">Español</a>
```

**Why this matters:**

- Query parameters (`?lang=en`) are seen as **one URL** by search engines
- Hash fragments (`#lang=es`) are **completely ignored** by crawlers
- Path-based URLs (`/es/`, `/en/`) are indexed **separately**
- Result: Each language version ranks independently in search results

### Recommended URL Structure

**Pattern: Language prefix with default redirect**

```
├── / (root)                   → redirects to /es/ or /en/ based on browser
├── /es/                       → Spanish homepage
├── /es/about.html             → Spanish about page
├── /en/                       → English homepage
└── /en/about.html             → English about page
```

**Benefits:**

- Symmetrical structure (both languages in subdirectories)
- Explicit language declaration in URL
- Easy to add more languages (/fr/, /de/, etc.)
- Automated language detection at root

### hreflang Implementation

**Required on every page:**

```html
<head>
  <!-- Self-reference -->
  <link rel="alternate" hreflang="es" href="https://example.com/es/page.html" />

  <!-- Other language version -->
  <link rel="alternate" hreflang="en" href="https://example.com/en/page.html" />

  <!-- Default fallback for unsupported languages -->
  <link rel="alternate" hreflang="x-default" href="https://example.com/es/page.html" />
</head>
```

**Critical rules:**

- Use **absolute URLs** (not relative: `/es/page.html` is wrong)
- Include **all language versions** on every page
- Add **x-default** fallback (usually primary language)
- Ensure **bidirectional links** (if Spanish links to English, English must link to Spanish)

### YAML Frontmatter for Multilingual

Add language metadata to cog frontmatter:

```yaml
---
languages:
  - code: es
    name: Spanish
    url: /es/restaurant.html
    default: true
  - code: en
    name: English
    url: /en/restaurant.html
    default: false
hreflang:
  - lang: es
    href: https://example.com/es/restaurant.html
  - lang: en
    href: https://example.com/en/restaurant.html
  - lang: x-default
    href: https://example.com/es/restaurant.html
---
```

### Root Redirect Pattern

Create `index.html` at root for browser language detection:

```html
<script>
  const userLang = (navigator.language || navigator.userLanguage).substring(0, 2);
  const supportedLangs = ['es', 'en'];
  const targetLang = supportedLangs.includes(userLang) ? userLang : 'es';
  window.location.href = `/${targetLang}/`;
</script>
<noscript>
  <a href="/es/">Español</a> | <a href="/en/">English</a>
</noscript>
```

**Template available:** `mx-canon/mx-the-gathering/reference-implementations/_templates/index-redirect-template.html`

### Sitemap Configuration

Include all language versions with hreflang annotations:

```xml
<url>
  <loc>https://example.com/es/page.html</loc>
  <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/page.html"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/page.html"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/es/page.html"/>
</url>
```

**Template available:** `mx-canon/mx-the-gathering/reference-implementations/_templates/sitemap-template.xml`

### Migration from Query/Hash to Path-Based

**If you have existing query parameter or hash-based implementations:**

1. **Create directory structure:**

   ```bash
   mkdir -p /es /en
   ```

2. **Duplicate content into language directories:**
   - Move Spanish content to `/es/`
   - Create English translations in `/en/`

3. **Update all internal links:**

   ```html
   <!-- OLD -->
   <a href="/about?lang=es">Acerca de</a>

   <!-- NEW -->
   <a href="/es/about.html">Acerca de</a>
   ```

4. **Add hreflang tags to `<head>`** (see example above)

5. **Create root redirect** (see template above)

6. **Update sitemap** with both language versions

7. **Remove old query parameter/hash logic:**
   - Delete JavaScript language switchers that use `?lang=` or `#lang=`
   - Remove URL hash detection code
   - Remove query parameter parsing

8. **Test:**
   - Verify all links work
   - Test browser language detection
   - Validate hreflang with testing tool
   - Check Google Search Console after deployment

### Common Mistakes to Avoid

❌ **Using query parameters:** `?lang=en` (search engines ignore these)
❌ **Using hash fragments:** `#lang=es` (completely invisible to crawlers)
❌ **Relative URLs in hreflang:** Must use absolute URLs with domain
❌ **Missing x-default:** Always provide fallback for unsupported languages
❌ **Inconsistent hreflang:** Must be bidirectional across all pages
❌ **Not updating internal links:** All navigation must use new path-based URLs

### Testing Checklist

- [ ] Each language has distinct URLs (`/es/`, `/en/`)
- [ ] hreflang tags present in `<head>` on all pages
- [ ] hreflang uses absolute URLs (not relative)
- [ ] x-default is specified
- [ ] hreflang is bidirectional (consistent across all pages)
- [ ] Sitemap includes all language versions
- [ ] Root redirect works (test with browser language settings)
- [ ] Internal links use path-based URLs
- [ ] Language switcher navigates correctly
- [ ] No broken links between versions

### SEO Benefits

**Before (query/hash-based):**

- ❌ One URL for all languages
- ❌ Search engines can't distinguish languages
- ❌ Poor language targeting in results
- ❌ Lower rankings for multilingual keywords

**After (path-based):**

- ✅ Separate URLs per language
- ✅ Proper language targeting
- ✅ Better crawlability and indexing
- ✅ Improved rankings for each language

### Further Reading

**Comprehensive guide:** `mx-canon/mx-the-gathering/reference-implementations/_templates/MULTILINGUAL-SEO-GUIDE.md`

**Google documentation:**

- [Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [hreflang Implementation](https://developers.google.com/search/docs/specialty/international/localized-versions)

---

## Templates Reference

### N-Language Business Template

**File:** `n-lang-business-template.cog.html`

**Features:**

- Supports 1 to n languages with shared assets
- Path-based routing (/en/, /es/, /de/)
- Accept-Language detection
- GDPR compliant (no cookies/localStorage)
- Complete YAML frontmatter (180+ lines)
- Schema.org framework
- WebMCP tool pattern
- WCAG 2.1 AA structure

**Architecture:**

```
site/
├── assets/              # Shared CSS/JS
│   ├── style.css        # All styling
│   └── script.js        # N-language aware
├── en/index.cog.html    # English content
├── es/index.cog.html    # Spanish content
└── index.html           # Root redirect
```

**Placeholders:**

```
[business-name]
[Business Name]
[business-type]
[SchemaType]
[street-address]
[city]
[country-code]
[phone-number]
[email]
[website-url]
... (40+ total)
```

**Adding languages:**

1. Create directory (mkdir fr/)
2. Copy HTML template
3. Translate content
4. Update language arrays

No CSS or JavaScript changes required.

---

## Tools and Commands

### Cogify Commands

```bash
# Enhanced audit
npm run cogify -- --target=https://example.com
npm run cogify:install
npm run cogify:check

# Registry management
npm run registry:add -- file.cog.html
npm run cog:sync
npm run cog:validate

# Cog queries
npm run cog:list
npm run cog:find -- term
npm run cog:stats

# Validation
npm run lint:markdown:fix
html-validate file.cog.html
pa11y file.cog.html
```

### Online Tools

- **W3C HTML Validator:** <https://validator.w3.org/>
- **Schema.org Validator:** <https://validator.schema.org/>
- **WAVE Accessibility:** <https://wave.webaim.org/>
- **Google Rich Results Test:** <https://search.google.com/test/rich-results>

---

## Troubleshooting

### Missing Required Fields

**Error:**

```
YAML validation failed: Missing required field 'description'
```

**Fix:** Add all required fields to YAML frontmatter:

```yaml
name: my-cog
title: "My Cog"
description: "Brief description"
version: "1.0.0"
created: 2026-02-20
author: "Your Name"
status: active
```

### Schema.org Validation Errors

**Error:**

```
Schema validation failed: Missing required property 'address'
```

**Fix:** Add all required Schema.org properties:

```json
{
  "@type": "Restaurant",
  "name": "Required",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Required"
  }
}
```

### Accessibility Failures

**Error:**

```
pa11y: Missing alt attribute on img element
```

**Fix:** Add alt text to all images:

```html
<img src="image.jpg" alt="Descriptive text">
```

### WebMCP Tools Not Working

**Error:**

```
TypeError: window.mcp_tools is undefined
```

**Fix:** Declare tools before using:

```html
<script>
window.mcp_tools = {
  "tool-name": {
    name: "tool-name",
    execute: async function(params) {
      // Implementation
    }
  }
};
</script>
```

---

## Reference

### Related Manuals

- **Enhanced Audit System:** `manual-enhanced-audit.cog.md`
- **MX OS Manual:** `mx-os-manual.cog.md`
- **Reginald Manual:** `mx-reginald-manual.cog.md`

### Related Cogs

- **Cogify-This:** `MX-Cog-Registry/cogs/cogify-this.cog.md` (v1.3.0)
- **Pixel-Perfect Replication:** `MX-Cog-Registry/cogs/pixel-perfect-web-replication.cog.md`
- **Cog Unified Spec:** `MX-The-Gathering/deliverables/cog-unified-spec.md`

### Documentation

- **Template Catalog:** `mx-reference-implementations/_templates/README.md`
- **Extraction Summary:** `mx-reference-implementations/_templates/TEMPLATE-EXTRACTION-SUMMARY.md`
- **Cogify Guide:** `mx-reference-implementations/_templates/audit-system/COGIFY-GUIDE.md`

### Examples

- **Los Granainos:** `mx-reference-implementations/los-granainos/`
  - Side-by-side version: `los-granainos-mx-reference.cog.html`
  - Single-language version: `los-granainos-single-lang.cog.html`
  - Audit data: `audit/`

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Cogification Workflow                     │
└─────────────────────────────────────────────────────────────┘

Step 1: Analyze Source
  ├─ Identify content type, language, domain
  ├─ Determine Schema.org type
  └─ Note existing metadata
           ↓
Step 1.5: Enhanced Audit (npm run cogify)
  ├─ Capture DOM tree, CSS, assets
  ├─ Generate audit outputs
  └─ Cache for offline work (24h)
           ↓
Step 2: Select Template
  ├─ bilingual-business-template.cog.html
  ├─ single-language-business-template.cog.html
  └─ standard-doc-template.cog.md
           ↓
Step 3-6: Customize
  ├─ Generate YAML frontmatter
  ├─ Add Schema.org markup
  ├─ Implement WebMCP tools
  └─ Ensure WCAG 2.1 AA accessibility
           ↓
Step 7-8: Enhance
  ├─ Optimize bilingual pattern
  └─ Add certification metadata
           ↓
Step 9: Validate
  ├─ W3C HTML validation
  ├─ WCAG compliance (pa11y)
  ├─ Schema.org validation
  └─ YAML frontmatter parsing
           ↓
Step 10: Register
  ├─ Add to cog registry
  ├─ Update Reginald index
  └─ Publish (if public)
           ↓
        ✅ DONE
   .cog.html or .cog.md
   Machine-readable, accessible, certifiable
```

---

**Version:** 1.5.0
**Status:** Production Ready
**Created:** 2026-02-20
**Updated:** 2026-02-22
**Author:** Cog-Nova-MX Ltd

*"Cogification: Making the web work for everyone and everything that uses it."*
