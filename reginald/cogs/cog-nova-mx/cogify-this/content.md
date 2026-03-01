---
name: cogify-this
version: "1.5.0"
description: Convert existing content into MX-enhanced format with comprehensive metadata, accessibility, and WebMCP integration

created: 2026-02-20
modified: 2026-02-20

author: Cog-Nova-MX Ltd
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: active

category: mx-tools
partOf: mx-cog-registry
refersTo: [what-is-a-cog, mx-reference-implementations, bilingual-business-template]
builds-on: [what-is-a-cog]
tags: [cogify, conversion, mx-enhancement, metadata, webmcp, accessibility, transformation]

audience: tech
reading-level: technical
purpose: Transform existing content (HTML, markdown, documents) into MX-enhanced format with YAML frontmatter, WebMCP tools, Schema.org markup, and Reginald certification metadata

runtime: runbook

mx:
  runbook: |
    This action-doc guides AI agents through the cogification process:

    **What is "Cogification"?**
    Converting existing content into MX-enhanced format by:
    1. Adding comprehensive YAML frontmatter with MX metadata
    2. Wrapping content with appropriate cog structure
    3. Adding Schema.org markup for machine readability
    4. Implementing WebMCP tools for AI agent interaction
    5. Ensuring WCAG 2.1 AA accessibility compliance
    6. Preparing for Reginald registry certification

    **When to Cogify:**
    - Existing HTML pages → .cog.html with embedded metadata
    - Markdown documents → .cog.md with enhanced frontmatter
    - Static websites → Single-page MX-enhanced references
    - Business content → Machine-readable certified docs
    - Legacy content → Future-proof MX format

    **Cogification Workflow:**

    Step 1: Analyze Source
    - Identify content type (HTML, markdown, PDF, etc.)
    - Detect language(s) present
    - Identify business/content domain
    - Determine appropriate Schema.org type
    - Note existing metadata and structure

    Step 1.5: Run Enhanced HTML/CSS Audit (Highly Recommended)
    - Use Enhanced Audit System to capture complete web structure
    - Automates DOM extraction, CSS analysis, asset caching
    - Generates multi-format outputs for offline development
    - Provides validation baseline for automated testing
    - See: ../../../mx-reference-implementations/_templates/audit-system/README.md

    **Quick start (from repo root):**
    ```bash
    # One-time setup
    npm run cogify:install

    # Audit any website
    npm run cogify -- --target=https://example.com

    # Custom output directory
    npm run cogify -- --target=https://restaurant.com --output-dir=./restaurant-audit
    ```

    **Alternative (direct method):**
    ```bash
    cd mx-canon/mx-the-gathering/reference-implementations/templates/audit-system
    npm install && npx playwright install chromium
    node enhanced-audit.js --target=https://example.com --cache-assets --verbose
    ```

    Outputs generated:
    - `audit-data.json` - Complete DOM tree + computed CSS (165KB)
    - `validation-baseline.json` - Structural metrics for testing
    - `visual-audit-report.md` - Human-readable specifications
    - `screenshots/homepage.png` - Full-page visual reference
    - `cached-html/` - Rendered HTML for offline reference (24h TTL)
    - `cached-css/` - All stylesheets cached locally (24h TTL)
    - `cache-manifest.json` - Asset tracking with integrity hashes

    Benefits:
    - **Complete DOM structure** - Every element, attribute, and nesting level
    - **CSS cascade mapping** - Which rules win for each property (specificity)
    - **24-hour asset caching** - Work offline with cached HTML/CSS
    - **Exact RGB colors** - Converted to hex automatically
    - **Computed typography** - Font families, sizes, weights, custom properties
    - **Validation baseline** - Automated before/after comparison
    - **Pixel-perfect accuracy** - All data needed for exact replication

    This is the recommended workflow for complex sites requiring structural accuracy.

    Step 2: Select Template
    - Use bilingual-business-template.cog.html for comparison/translation use cases
    - Use single-language-business-template.cog.html for mobile-first content sites
    - Use standard .cog.md frontmatter for documentation
    - Create custom template for specialized use cases

    Step 3: Generate YAML Frontmatter
    Required fields:
    - name: unique identifier (kebab-case)
    - title: human-readable title
    - description: one-sentence description
    - version: semantic version (start with 1.0.0)
    - created: ISO date
    - modified: ISO date
    - author: creator name
    - category: classification
    - status: active|draft|deprecated
    - tags: array of keywords
    - audience: tech|business|both|humans

    MX-specific fields:
    - mx.runtime: browser|node|runbook|shell
    - mx.runbook: usage instructions (for action-docs)
    - mx.deliverable: output specification (for generators)

    Advanced fields:
    - builds-on: dependency array
    - partOf: parent collection
    - refersTo: related cogs
    - definition: standards compliance
    - policy: merging and inheritance rules
    - security: CSP and headers
    - certification: COG certification metadata
    - registry: Reginald registration data

    Step 4: Add Schema.org Markup
    - Choose appropriate type (Restaurant, Hotel, Product, etc.)
    - Add JSON-LD script in <head>
    - Include all required properties
    - Add optional but recommended properties
    - Validate at https://validator.schema.org/

    Step 5: Implement WebMCP Tools
    - Define tool names and descriptions
    - Create inputSchema for each tool
    - Implement execute() functions
    - Declare in <meta name="mcp:tools">
    - Test tool invocation

    Step 6: Ensure Accessibility
    - Add skip navigation link
    - Use semantic HTML (header, main, nav, footer)
    - Include ARIA labels where needed
    - Ensure sufficient color contrast
    - Add alt text for images
    - Test with pa11y or WAVE

    Step 7: Optimize for Bilingual (if applicable)
    Choose pattern based on use case:

    Side-by-side pattern:
    - Side-by-side desktop layout
    - Toggle for mobile
    - Language-specific content blocks
    - URL hash routing (#lang=es)
    - Language toggle button
    - Update html[lang] attribute

    Single-language toggle pattern:
    - Single-language view at a time
    - Prominent toggle button (fixed position)
    - Fade transitions (400ms)
    - localStorage persistence
    - Mobile-first (no layout shifts)
    - Update html[lang] attribute

    Step 8: Add Certification Metadata
    - Include certification block in YAML
    - Add provenance information
    - Document transformation method
    - Specify registry category
    - Generate hash for integrity

    Step 9: Validate
    - W3C HTML validator
    - WCAG 2.1 AA compliance
    - Schema.org validation
    - WebMCP specification
    - Markdown lint (for .md cogs)
    - YAML frontmatter parsing

    Step 10: Register
    - Add to cog registry
    - Update Reginald index
    - Generate certification signature
    - Publish to CDN (if public)

  deliverable:
    output-format: ".cog.html or .cog.md"
    includes:
      - Comprehensive YAML frontmatter
      - Original content preserved
      - Schema.org markup
      - WebMCP tool definitions
      - Accessibility enhancements
      - Certification metadata
    validation:
      - YAML parse success
      - HTML/markdown valid
      - Schema.org valid
      - WCAG 2.1 AA compliant
      - WebMCP spec compliant

action:
  audit:
    description: "Run enhanced HTML/CSS audit to capture all website data"
    inputs:
      - name: target
        type: string
        required: true
        description: "URL to audit"
      - name: output-dir
        type: string
        default: "./audit"
        description: "Output directory for audit files"
      - name: cache-assets
        type: boolean
        default: true
        description: "Cache HTML/CSS locally (24h TTL)"
    outputs:
      - name: audit-directory
        type: directory
        description: "Directory containing all audit outputs"
    command: "npm run cogify -- --target={target} --output-dir={output-dir}"
    example: |
      # Basic audit
      npm run cogify -- --target=https://restaurant.com

      # Custom output directory
      npm run cogify -- --target=https://hotel.com --output-dir=./hotel-audit

      # Check cache validity
      npm run cogify:check

  cogify:
    description: "Convert a file or URL to MX-enhanced format"
    inputs:
      - name: source
        type: string
        required: true
        description: "File path or URL to cogify"
      - name: output-type
        type: string
        enum: [.cog.html, .cog.md, auto]
        default: auto
        description: "Output format (auto-detects from source)"
      - name: languages
        type: array
        default: [en]
        description: "Languages present in source"
      - name: schema-type
        type: string
        description: "Schema.org type (Restaurant, Hotel, Product, etc.)"
      - name: business-name
        type: string
        description: "Business/content name"
      - name: add-webmcp
        type: boolean
        default: true
        description: "Include WebMCP tool definitions"
      - name: certify
        type: boolean
        default: true
        description: "Add certification metadata"
    outputs:
      - name: cogified-file
        type: file
        description: "MX-enhanced version of source"
    example: |
      Input: existing-restaurant-site.html
      Output: restaurant-name-mx-reference.cog.html

      The output includes:
      - 180 lines of YAML frontmatter
      - Original HTML content
      - Schema.org Restaurant markup
      - 4 WebMCP tools
      - WCAG 2.1 AA compliance
      - Reginald certification metadata

  validate-cog:
    description: "Validate an existing cog for compliance"
    inputs:
      - name: cog-path
        type: string
        required: true
        description: "Path to .cog.* file"
      - name: strict
        type: boolean
        default: false
        description: "Strict mode (fail on warnings)"
    outputs:
      - name: validation-report
        type: object
        description: "Compliance report with pass/fail status"
    example: |
      Input: my-business.cog.html
      Output: {
        yaml: "valid",
        html: "valid",
        schema: "valid",
        accessibility: "AA compliant",
        webmcp: "compliant",
        warnings: []
      }

  extract-template:
    description: "Extract reusable template from existing cog"
    inputs:
      - name: source-cog
        type: string
        required: true
        description: "Path to reference cog"
      - name: template-name
        type: string
        required: true
        description: "Name for extracted template"
    outputs:
      - name: template-file
        type: file
        description: "Generalized template with placeholders"
    example: |
      Input: los-granainos-mx-reference.cog.html
      Output: bilingual-business-template.cog.html

      All business-specific content replaced with [placeholders]

definition:
  input-formats:
    - HTML (single or multi-page)
    - Markdown (.md)
    - PDF (text extraction)
    - Plain text
    - JSON (structured data)

  output-formats:
    - .cog.html (HTML with embedded YAML)
    - .cog.md (Markdown with YAML frontmatter)
    - .cog.json (JSON with embedded metadata)

  required-enhancements:
    - YAML frontmatter (minimum 20 fields)
    - Native metadata (HTML meta tags or markdown frontmatter)
    - Accessibility (WCAG 2.1 AA)
    - Optional but recommended: Schema.org, WebMCP, certification

  templates-available:
    - bilingual-business-template.cog.html (side-by-side layout, use with enhanced audit system)
    - single-language-business-template.cog.html (toggle pattern, use with enhanced audit system)
    - standard-doc-template.cog.md
    - action-doc-template.cog.md
    - info-doc-template.cog.md
    - enhanced-audit-system/ (Complete HTML/CSS/DOM audit tool for pixel-perfect replication)
    - Note: Enhanced audit system captures DOM structure, CSS cascade, and caches assets for offline development

policy:
  transformation:
    principle: "Preserve original, enhance metadata"
    non-destructive: true
    reversible: true

  preservation:
    content: "100% preserved"
    structure: "Maintained with enhancements"
    styling: "Preserved or improved"
    functionality: "Enhanced with WebMCP"

  quality:
    accessibility: "WCAG 2.1 AA minimum"
    validation: "W3C compliant"
    metadata: "Comprehensive"
    documentation: "Self-describing"

provenance:
  inspiration: "Los Granainos MX reference implementation"
  methodology: "Pattern extraction and generalization"
  validation: "Applied to multiple business types"

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

registry:
  reginald:
    category: mx-tools
    subcategory: conversion
    visibility: public
    searchable: true
    keywords: [cogify, conversion, mx-enhancement, transformation, metadata, webmcp, accessibility]
---

# Cogify This

Convert existing content into MX-enhanced format.

## What is Cogification?

**Cogification** is the process of transforming existing content (HTML pages, markdown documents, PDFs, websites) into MX-enhanced format by adding:

1. **Comprehensive YAML frontmatter** with MX metadata
2. **Schema.org markup** for machine readability
3. **WebMCP tool definitions** for AI agent interaction
4. **WCAG 2.1 AA accessibility** compliance
5. **Reginald certification** metadata

The result is a **`.cog.html`** or **`.cog.md`** file that is:

- Machine-readable (AI agents can parse and understand)
- Human-readable (browsers and editors render normally)
- Accessible (meets WCAG 2.1 AA standards)
- Certifiable (ready for Reginald registry)
- Future-proof (built on open standards)

## When to Cogify

- **Static websites** → Single-page MX-enhanced references
- **Business sites** → Machine-readable certified pages
- **Documentation** → Enhanced markdown with comprehensive metadata
- **Legacy content** → Future-proof format
- **Multi-page sites** → Consolidated single-page experience

## Quick Start

### Example: Cogify a Restaurant Website

```bash
# Input: existing HTML pages
https://restaurant.com/index.html
https://restaurant.com/menu.html
https://restaurant.com/contact.html

# Cogification process:
1. Extract and consolidate content
2. Add YAML frontmatter (180+ lines)
3. Add Schema.org Restaurant markup
4. Implement WebMCP tools (menu-query, reservation-info, etc.)
5. Ensure WCAG 2.1 AA accessibility
6. Add bilingual support (if needed)
7. Add certification metadata

# Output: restaurant-name-mx-reference.cog.html
Single-page, bilingual, machine-readable, certified
```

### Example: Cogify a Markdown Document

```bash
# Input: README.md
Plain markdown with basic frontmatter

# Cogification process:
1. Enhance YAML frontmatter
2. Add MX-specific fields (mx.runbook, mx.deliverable)
3. Add builds-on dependencies
4. Add certification metadata
5. Validate markdown

# Output: README.cog.md
Enhanced markdown with comprehensive metadata
```

## Templates Available

### 1. Bilingual Business Template (Side-by-Side)

**File:** `mx-canon/mx-the-gathering/reference-implementations/templates/bilingual-business-template.cog.html`

**Use for:**

- Comparison use cases (translation, review)
- Educational content (language learning)
- Desktop-first experiences
- When users need to see both languages simultaneously

**Features:**

- Side-by-side bilingual layout (desktop)
- Language toggle (mobile)
- Comprehensive YAML frontmatter
- Schema.org markup (customizable type)
- WebMCP tool definitions
- WCAG 2.1 AA compliant
- Reginald certification ready

**How to use:**

1. Copy template to new file
2. Replace all `[placeholders]` with your content
3. Customize CSS variables for branding
4. Update Schema.org type and data
5. Define WebMCP tools for your use case
6. Add content in both Spanish and English
7. Validate and test

### 2. Single-Language Business Template (Toggle Pattern)

**File:** `mx-canon/mx-the-gathering/reference-implementations/templates/single-language-business-template.cog.html`

**Use for:**

- Content-heavy sites (restaurants, hotels, services)
- Mobile-first experiences
- Cleaner single-language UX
- When side-by-side comparison isn't needed

**Features:**

- Single-language view with toggle button
- Fade transitions between languages (400ms)
- localStorage persistence (remembers preference)
- Mobile-first design (no layout shifts)
- Comprehensive YAML frontmatter
- Schema.org markup (customizable type)
- WebMCP tool definitions
- WCAG 2.1 AA compliant
- Reginald certification ready

**How to use:**

1. Copy template to new file
2. Replace all `[placeholders]` with your content
3. Customize CSS variables for branding
4. Update Schema.org type and data
5. Define WebMCP tools for your use case
6. Add content in both Spanish and English
7. Test language toggle and persistence
8. Validate and test

**When to choose:**

- **Side-by-side:** Comparison, translation, language learning, desktop-first
- **Single-language toggle:** Content consumption, mobile-first, cleaner UX, content-heavy sites

### 3. Standard Doc Template

**Use for:**

- Documentation pages
- Technical specifications
- User guides
- README files

**Features:**

- Enhanced YAML frontmatter
- Documentation-specific metadata
- Builds-on dependencies
- Version tracking

### 4. Action-Doc Template

**Use for:**

- Runbooks and procedures
- AI agent instructions
- Automated workflows
- Tool definitions

**Features:**

- mx.runbook field
- Action definitions
- Input/output schemas
- Example usage

## Cogification Workflow

### Step 1: Analyze Source

```bash
# What are you cogifying?
- Content type: HTML? Markdown? PDF?
- Languages: Monolingual or multilingual?
- Domain: Business? Documentation? Blog?
- Schema.org type: Restaurant? Product? Article?
```

### Step 2: Select Template

```bash
# Choose appropriate template:
- Bilingual business (side-by-side) → bilingual-business-template.cog.html
- Bilingual business (toggle) → single-language-business-template.cog.html
- Documentation → standard-doc-template.cog.md
- Runbook → action-doc-template.cog.md
- Custom need → Start from scratch with cog-unified-spec

# Decision criteria:
Side-by-side pattern when:
  - Users need to compare languages
  - Translation/education use case
  - Desktop-first experience

Single-language toggle when:
  - Content-heavy sites (menus, descriptions)
  - Mobile-first experience
  - Cleaner single-language UX
  - Side-by-side comparison not needed
```

### Step 3: Generate YAML Frontmatter

**Minimum required fields:**

```yaml
---
name: unique-identifier
title: "Human-readable Title"
description: "One-sentence description"
version: "1.0.0"
created: "2026-02-20"
modified: "2026-02-20"
author: "Your Name"
category: category-name
status: active
tags: [tag1, tag2, tag3]
audience: tech|business|both|humans
---
```

**MX-enhanced fields:**

```yaml
mx:
  runtime: browser|node|runbook|shell
  runbook: |
    Usage instructions for action-docs
  deliverable:
    path: "output-filename"
    format: "output-format"

builds-on: [dependency-cog-1, dependency-cog-2]
partOf: parent-collection
refersTo: [related-cog-1, related-cog-2]
```

### Step 4: Add Schema.org Markup

**For a restaurant:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Business Name",
  "description": "Business description",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "Region",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "36.5167",
    "longitude": "-4.6333"
  },
  "servesCuisine": ["Spanish", "Mediterranean"],
  "priceRange": "€€"
}
</script>
```

**Choose the right type:**

- Restaurant, Hotel, LocalBusiness
- Product, Offer, Service
- Article, BlogPosting, NewsArticle
- Event, Course, Recipe

### Step 5: Implement WebMCP Tools

```javascript
window.mcpTools = {
  'tool-name': {
    name: 'tool-name',
    description: 'What this tool does',
    inputSchema: {
      type: 'object',
      properties: {
        param: {
          type: 'string',
          description: 'Parameter description'
        }
      },
      required: ['param']
    },
    execute: async (params) => {
      // Tool implementation
      return { success: true, data: result };
    }
  }
};
```

**Common tool patterns:**

- `query-*` - Search or filter content
- `get-*-info` - Retrieve information
- `toggle-*` - Change settings
- `calculate-*` - Perform computations

### Step 6: Ensure Accessibility

**WCAG 2.1 AA checklist:**

- [ ] Skip navigation link
- [ ] Semantic HTML (header, main, nav, footer)
- [ ] ARIA labels on interactive elements
- [ ] Color contrast ≥ 4.5:1
- [ ] Alt text on all images
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Form labels associated
- [ ] Error messages clear
- [ ] Language declared (html[lang])

**Test with:**

- pa11y (CLI)
- WAVE (browser extension)
- Lighthouse (Chrome DevTools)

### Step 7: Validate

```bash
# HTML validation
w3c-validator your-file.cog.html

# Accessibility testing
pa11y your-file.cog.html

# Schema.org validation
# Visit: https://validator.schema.org/
# Paste your page URL or HTML

# YAML validation
npm run cog:validate -- your-file.cog.md
```

### Step 8: Register

```bash
# Add to cog registry
npm run registry:add -- your-file.cog.html

# Sync Reginald index
npm run cog:sync

# Validate registry entry
npm run cog:validate
```

## Real-World Examples

### Example 1: Los Granainos Restaurant

**Source:** https://los-granainos.pages.dev/ (7 pages)

**Output (v1.0):** [los-granainos-mx-reference.cog.html](../mx-reference-implementations/los-granainos/los-granainos-mx-reference.cog.html)

- Side-by-side bilingual pattern
- Desktop-optimized layout
- Good for comparison and translation
- Manual styling (pre-Playwright capture)

**Output (v2.0):** [los-granainos-single-lang.cog.html](../mx-reference-implementations/los-granainos/los-granainos-single-lang.cog.html)

- Single-language toggle pattern
- Mobile-first design
- Fade transitions (400ms)
- localStorage persistence
- Cleaner content-focused UX
- **Playwright-captured visual design** - pixel-perfect accuracy achieved

**Enhanced Audit Process (v2.0):**

```bash
# Simple one-command audit
npm run cogify -- --target=https://los-granainos.pages.dev
```

This generated comprehensive outputs:

1. Captured complete website data with Enhanced Audit System
2. Generated multi-format outputs:
   - `audit-data.json` - Complete DOM tree + computed CSS (165KB)
   - `validation-baseline.json` - Structural metrics for testing
   - `visual-audit-report.md` - Human-readable design specifications
   - `cached-html/` + `cached-css/` - 24-hour offline cache
   - `screenshots/homepage.png` - Full-page visual reference
3. Applied precise RGB values from audit: coral rgb(212, 112, 75), cream rgb(244, 232, 208)
4. Used exact typography from CSS analysis: Playfair Display 128px for H1, Lato 16px for body
5. Linked images to original URLs (no downloads)
6. Verified visual match against cached HTML and screenshots

**Enhancements (both versions):**

- Consolidated 7 pages into 1
- Added bilingual support (Spanish/English)
- 180 lines of YAML frontmatter
- Full Schema.org Restaurant markup
- 4 WebMCP tools (menu-query, reservation-info, location-info, toggle-language)
- WCAG 2.1 AA compliant
- Reginald certification metadata

**Result:** Machine-readable, AI-parseable, human-friendly single-page restaurant reference. Two pattern options for different use cases. V2.0 demonstrates Playwright-based pixel-perfect reconstruction.

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

- Use Enhanced Audit System for comprehensive HTML/CSS/DOM capture
- Extract exact RGB colors from audit reports (don't guess)
- Use computed typography from CSS analysis
- Leverage cached HTML/CSS for offline development
- Reference validation baseline for automated testing
- Link to original images rather than downloading
- Generate screenshots for visual verification
- Document any intentional deviations from source

❌ **DON'T:**

- Guess at colors or typography
- Manually inspect CSS when automation is available
- Download images (link to originals for reference implementations)
- Skip visual comparison against source
- Assume structure without capturing

### CSS Extraction

✅ **DO:**

**Extract inline CSS to external files for:**

- Better separation of concerns (structure vs. presentation)
- Easier CSS maintenance and updates
- Browser caching benefits (CSS file cached separately)
- Cleaner HTML structure and readability
- Standard web development best practices
- Following MX `.cog.` naming convention

**Process:**

1. Extract all CSS from `<style>` tags
2. Create external `.cog.css` file in same directory
3. Add descriptive header comment in CSS file
4. Replace `<style>` block with `<link rel="stylesheet" href="filename.cog.css">`
5. Position link after other external stylesheets to maintain cascade order
6. Test visual appearance matches exactly (browser DevTools Network tab)

**Example:**

```html
<!-- Before: Inline CSS -->
<style>
  body { font-family: 'Lato', sans-serif; }
  h1 { font-size: 3rem; }
  /* ... 900 lines of CSS ... */
</style>

<!-- After: External CSS -->
<link rel="stylesheet" href="index.cog.css">
```

**File naming:**

- `index.cog.css` pairs with `index.cog.html`
- `restaurant-name.cog.css` pairs with `restaurant-name.cog.html`
- Always use `.cog.` infix to identify as part of cog system

**Benefits:**

- HTML file size reduced significantly (more readable)
- CSS is cacheable by browsers (performance)
- CSS can be shared across multiple HTML cogs
- Easier to update styles without touching HTML
- Professional code organization

❌ **DON'T:**

- Extract CSS prematurely before HTML structure is stable
- Break the CSS cascade order when adding link tag
- Mix inline styles with external stylesheet (choose one approach)
- Remove CSS comments or documentation during extraction
- Forget to test visual appearance after extraction
- Skip the `.cog.` infix in CSS filename

### Bilingual Patterns

✅ **DO:**

**Use side-by-side pattern when:**

- Users need to compare languages
- Translation or educational use case
- Desktop-first experience
- Technical/legal documents where comparison matters

**Use single-language toggle when:**

- Content-heavy sites (menus, long descriptions)
- Mobile-first experience preferred
- Cleaner single-language UX desired
- Side-by-side comparison not needed
- Reducing cognitive load important

**Mobile considerations:**

- Side-by-side becomes toggle on mobile anyway
- Single-language toggle is more mobile-friendly (no layout shifts)
- Test toggle button visibility on all screen sizes
- Ensure language preference persists (localStorage)
- Consider default language based on Accept-Language header

❌ **DON'T:**

- Force side-by-side on mobile (readability suffers)
- Hide language toggle (users must find it easily)
- Forget to update html[lang] attribute on switch
- Ignore localStorage (preserve user preference)
- Mix patterns in the same implementation

### Mobile Navigation (Hamburger Menu)

✅ **DO:**

**Use hamburger navigation for mobile-first responsive design:**

- Hamburger icon (CSS-only 3-line via ::before/::after)
- Slide-in drawer from right (300ms transition)
- Overlay click to close
- Escape key to close
- Focus management (return to hamburger on close)
- Body scroll lock when drawer open
- ARIA states (aria-expanded, aria-label updates)

**N-Language Support:**

- Use `<select>` dropdown for language selection (not binary toggle)
- Place inside drawer on mobile, in nav on desktop
- Path-based routing: `/es/page.html`, `/en/page.html`
- Auto-detect current language from path
- Support adding future languages without code changes

**Example HTML structure:**

```html
<nav id="nav" role="navigation" aria-label="Main navigation" aria-expanded="false">
  <!-- Hamburger button (mobile only) -->
  <button class="nav-hamburger" type="button" aria-controls="nav" aria-label="Open navigation">
    <span class="nav-hamburger-icon"></span>
  </button>

  <!-- Navigation sections (slide-in drawer on mobile) -->
  <div class="nav-sections">
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#menu">Menu</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>

    <!-- Language selector (n-language support) -->
    <div class="nav-language">
      <select class="language-select" aria-label="Select language">
        <option value="es">Español</option>
        <option value="en">English</option>
        <!-- Add more languages as needed -->
      </select>
    </div>
  </div>
</nav>
```

**EDS vs Standalone Approach:**

Standalone COGs (.cog.html files) use inline code, not EDS blocks:

| Aspect | EDS Blocks | Standalone COG |
|--------|-----------|----------------|
| CSS | `/blocks/header/header.css` | Inline `<style>` or `.cog.css` |
| JS | `/blocks/header/header.js` | Inline `<script>` |
| Loading | E-L-D phases | Single file |
| Breakpoint | 900px (EDS convention) | 899px (max-width) |
| Dependency | EDS runtime | None (self-contained) |

Standalone COGs are self-contained single files that work without a build system or EDS runtime. All CSS and JavaScript is either inline or in a paired `.cog.css` file.

**N-Language Architecture (Recommended):**

For multilingual sites, use the n-language architecture with shared assets:

```
/site-name/
├── assets/
│   ├── style.css       # Shared CSS (all languages)
│   └── script.js       # Shared JS (n-language aware)
├── es/
│   └── index.cog.html  # Spanish version
├── en/
│   └── index.cog.html  # English version
├── fr/
│   └── index.cog.html  # French version (add as needed)
├── index.html          # Root redirect with Accept-Language detection
└── sitemap.xml         # Multilingual sitemap
```

| Aspect | Per-Language Files | Shared Assets (N-Lang) |
|--------|-------------------|------------------------|
| CSS | `/es/index.cog.css` | `/assets/style.css` |
| JS | Inline in each HTML | `/assets/script.js` |
| Duplication | High (copy per language) | Zero |
| Adding language | Copy entire file | Add directory + HTML only |
| Maintenance | Update all files | Update one file |

**Templates with hamburger:**

- `n-lang-business-template.cog.html` - N-language architecture with hamburger nav pattern

**Reference implementation:** `allaboutv2/mx/demo/salva/` - Los Granainos restaurant demo

❌ **DON'T:**

- Use CSS frameworks (keep it vanilla, self-contained)
- Hard-code only 2 languages (use n-language pattern)
- Slide drawer from left (right is more natural on mobile)
- Skip body scroll lock (prevents background scrolling)
- Forget keyboard accessibility (Escape key, focus management)

### Multilingual SEO

✅ **DO:**

**Use path-based language routing for SEO:**

- `/es/restaurant.html` and `/en/restaurant.html` (separate URLs)
- Each language version indexed independently by search engines
- Proper language targeting in search results
- hreflang works correctly

**Implementation (N-Language Architecture):**

1. Create directory structure with shared `/assets/` folder
2. Create `/assets/style.css` with all shared styles
3. Create `/assets/script.js` with n-language aware JavaScript
4. Create language directories (`/es/`, `/en/`, `/fr/`, etc.)
5. Add hreflang tags to each language version's `<head>`
6. Create root redirect with Accept-Language detection (see `n-lang-business-template`)
7. Update sitemap with all language versions

**hreflang example:**

```html
<link rel="alternate" hreflang="es" href="https://example.com/es/page.html" />
<link rel="alternate" hreflang="en" href="https://example.com/en/page.html" />
<link rel="alternate" hreflang="x-default" href="https://example.com/es/page.html" />
```

**Reference external assets from language HTML:**

```html
<!-- In /es/index.cog.html or /en/index.cog.html -->
<link rel="stylesheet" href="../assets/style.css">
<script src="../assets/script.js"></script>
```

**YAML frontmatter (n-language):**

```yaml
languages:
  - code: es
    name: Spanish
    url: /es/page.html
    default: true
  - code: en
    name: English
    url: /en/page.html
  - code: fr
    name: French
    url: /fr/page.html
    # Add more languages as needed
hreflang:
  - lang: es
    href: https://example.com/es/page.html
  - lang: en
    href: https://example.com/en/page.html
  - lang: fr
    href: https://example.com/fr/page.html
  - lang: x-default
    href: https://example.com/es/page.html
```

❌ **DON'T:**

- Use query parameters (`?lang=en`) — search engines see as one URL
- Use hash fragments (`#lang=es`) — completely ignored by crawlers
- Use relative URLs in hreflang — must be absolute with domain
- Forget x-default fallback — needed for unsupported languages
- Mix path-based and query parameter approaches

**Why this matters:**

- Query/hash-based: ❌ One URL for all languages, no SEO benefit
- Path-based: ✅ Separate URLs, proper indexing, better rankings

**Full guide:** `mx-canon/mx-the-gathering/reference-implementations/templates/MULTILINGUAL-SEO-GUIDE.md`

## Troubleshooting

### Common Issues

**Issue:** YAML parse error

**Solution:** Check indentation (2 spaces), validate at yamllint.com, ensure all quotes match

---

**Issue:** Schema.org validation fails

**Solution:** Verify all required properties present, check data types, use validator.schema.org

---

**Issue:** WebMCP tools not working

**Solution:** Ensure window.mcpTools defined, check inputSchema, test execute() functions

---

**Issue:** Language toggle not working

**Solution:** Verify JavaScript loaded, check data-lang attributes, confirm hash routing

---

**Issue:** Accessibility test fails

**Solution:** Run pa11y with --reporter cli, fix reported issues one by one, re-test

## Further Reading

- [Cog Unified Spec](../MX-The-Gathering/specifications/cog-unified-spec.md) - Full cog specification
- [Los Granainos Reference](../mx-reference-implementations/los-granainos/) - Complete example
- [WebMCP Specification](https://webmachinelearning.github.io/webmcp/) - W3C draft standard
- [Schema.org Types](https://schema.org/docs/schemas.html) - All available types
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards

## Support

Need help cogifying your content?

- Review the bilingual-business-template.cog.html
- Check the Los Granainos example
- Read the cog unified spec
- Ask for assistance in MX Canon brain

---

*Stop guessing. Start reading. Start cogifying.*
