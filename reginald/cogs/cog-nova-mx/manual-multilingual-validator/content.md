---
name: manual-multilingual-validator
title: "Multilingual Validator Manual"
description: "Validates multilingual site implementation for SEO compliance, checking lang attributes, hreflang tags, directory structure, and root redirect."
author: Tom Cranstoun and Maxine
created: 2026-02-21
version: "1.0"
status: active
category: manual
tags: [manual, multilingual, validation, seo, quality-assurance, hreflang]
partOf: mx-maxine-lives
purpose: "Document the multilingual validator tool - SEO compliance checking and validation workflow"
audience: "human"
stability: "stable"
runbook: "Read when validating multilingual sites, checking SEO compliance, or troubleshooting hreflang issues"
contextProvides:
  - "23+ multilingual SEO validation checks explained"
  - "Lang attribute and hreflang tag compliance rules"
  - "Anti-pattern detection (hash/query param language switching)"
  - "CI/CD integration patterns for automated validation"
refersTo:
  - "mx-canon/mx-the-gathering/reference-implementations/_tools/validate-multilingual.js"
  - "mx-canon/mx-the-gathering/reference-implementations/_tools/README.cog.md"
---

# Multilingual Validator

Validates multilingual site structure and implementation for SEO compliance. Checks `lang` attributes, `data-lang` attributes, hreflang tags, root redirect, sitemap, and detects anti-patterns like hash-based or query parameter language switching.

---

## Overview

Ensures your multilingual site follows Google's best practices and avoids common SEO pitfalls. Performs 23+ validation checks across directory structure, HTML attributes, navigation patterns, and sitemap compliance.

**Key Features:**

- Directory structure validation
- HTML lang/data-lang attribute checking
- Hreflang absolute URL verification
- Hash/query param anti-pattern detection
- x-default hreflang presence
- Root redirect validation
- Sitemap compliance checking
- Configurable strict mode

---

## Usage

### Basic Usage

```bash
npm run validate:multilingual -- --dir=/path/to/site
```

### Command-Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `--dir` | Current directory | Site root directory |
| `--languages` | `es,en` | Comma-separated language codes |
| `--strict` | `false` | Show all passed checks (verbose) |

### Examples

**Validate Los Granainos:**

```bash
npm run validate:multilingual -- --dir=allaboutv2/mx/demo/salva
```

**Strict mode (show all checks):**

```bash
npm run validate:multilingual -- --dir=dist --strict=true
```

**Custom languages:**

```bash
npm run validate:multilingual -- --dir=public --languages=fr,de,it
```

---

## Validation Checks

### 1. Directory Structure (Critical)

**Checks:**

- `/es/` directory exists
- `/en/` directory exists
- Additional language directories per configuration

**Why It Matters:**
Path-based routing is Google's recommended approach for multilingual sites. Hash or query parameters don't create distinct URLs for indexing.

---

### 2. HTML Lang Attributes (Critical)

**Checks for each HTML file:**

```html
<html lang="es" data-lang="es">
```

- `lang` attribute matches expected language
- `data-lang` attribute matches expected language
- Both attributes present on `<html>` tag

**Why It Matters:**
Search engines and assistive technologies use `lang` to understand content language. Incorrect values cause indexing and accessibility issues.

---

### 3. Hreflang Tags (Critical)

**Checks:**

- All hreflang links use absolute URLs
- No hash-based URLs (`#lang=es`)
- No query parameter URLs (`?lang=es`)
- No relative URLs (must be `https://domain.com/...`)

**Valid:**

```html
<link rel="alternate" hreflang="es" href="https://example.com/es/index.html" />
<link rel="alternate" hreflang="en" href="https://example.com/en/index.html" />
```

**Invalid:**

```html
<link rel="alternate" hreflang="es" href="/es/index.html" />  <!-- Relative -->
<link rel="alternate" hreflang="es" href="#lang=es" />        <!-- Hash -->
<link rel="alternate" hreflang="es" href="?lang=es" />        <!-- Query -->
```

**Why It Matters:**
Google requires absolute URLs in hreflang annotations. Relative or hash-based URLs won't be recognized.

---

### 4. Navigation Anti-Patterns (Critical)

**Detects:**

- Hash-based language switching: `href="#lang=es"`
- Query parameter switching: `href="?lang=es"`

**Why It Matters:**
These patterns create single-URL sites instead of distinct language versions. Google can't index different languages separately, killing SEO.

---

### 5. X-Default Hreflang (Warning)

**Checks:**

```html
<link rel="alternate" hreflang="x-default" href="https://example.com/es/index.html" />
```

**Why It Matters:**
`x-default` tells Google which version to show users whose language isn't explicitly supported. Recommended but not required.

---

### 6. Root Redirect (Warning)

**Checks:**

- `index.html` exists at site root
- Contains `navigator.language` JavaScript
- Has `<noscript>` fallback

**Why It Matters:**
Users visiting the domain root should be redirected to their preferred language. JavaScript detection + noscript fallback ensures accessibility.

---

### 7. Sitemap (Warning)

**Checks:**

- `sitemap.xml` exists
- Contains `xmlns:xhtml` namespace
- Has `xhtml:link` hreflang annotations

**Why It Matters:**
Sitemap helps Google discover all language versions quickly. Missing or incorrect sitemap delays indexing.

---

## Output Format

### Success (No Issues)

```
🎉 Perfect! Multilingual implementation is compliant.

📊 SUMMARY:
   Passed: 23
   Warnings: 0
   Errors: 0
```

**Exit Code:** 0

---

### Warnings Only

```
✓ No critical errors. Warnings should be addressed when possible.

⚠️  WARNINGS:
   ⚠ es/index.html: Missing x-default hreflang (recommended)
   ⚠ Root redirect: Missing noscript fallback

📊 SUMMARY:
   Passed: 21
   Warnings: 2
   Errors: 0
```

**Exit Code:** 0

---

### Errors Present

```
✗ Critical errors found. Fix errors before deployment.

❌ ERRORS:
   ✗ es/index.html: lang="en" (expected "es")
   ✗ es/index.html: Found 3 hash-based language references (#lang=)
   ✗ en/index.html: hreflang uses relative URL (/en/index.html)

📊 SUMMARY:
   Passed: 18
   Warnings: 2
   Errors: 3
```

**Exit Code:** 1

---

## Strict Mode

With `--strict=true`, shows all passed checks:

```
✅ ALL CHECKS PASSED:
   ✓ Directory exists: es/
   ✓ Directory exists: en/
   ✓ es/index.html: lang="es"
   ✓ es/index.html: data-lang="es"
   ✓ es/index.html: hreflang uses absolute URL
   ✓ es/index.html: No hash-based language switching
   [... all 23 checks ...]
```

---

## Integration with CI/CD

### Pre-Deployment Check

```bash
npm run validate:multilingual -- --dir=dist || exit 1
```

### GitHub Actions

```yaml
- name: Validate Multilingual SEO
  run: npm run validate:multilingual -- --dir=dist
```

---

## Troubleshooting

**False positives on lang attribute:**

- Ensure HTML files are in correct language directories
- Check `--languages` configuration matches directory structure

**Missing sitemap warnings:**

- Run `npm run generate:sitemap` first
- Sitemap warnings don't block deployment (exit code 0)

**Hreflang relative URL warnings:**

- Use Template Generator to create files with absolute URLs
- Or manually update to absolute URLs

---

## Implementation Details

**File:** `mx-canon/mx-the-gathering/reference-implementations/_tools/validate-multilingual.js`
**Language:** Node.js
**Dependencies:** None (uses Node.js built-ins)
**NPM Script:** `validate:multilingual`
**Exit Codes:**

- `0` - Success (no errors, warnings OK)
- `1` - Critical errors found

---

## Related Tools

- **Multilingual Template Generator** - Creates compliant HTML files
- **Deployment Helper** - Runs validation as part of deployment workflow
- **Sitemap Generator** - Creates compliant sitemap

---

*Part of MX OS. The instructions are the program.*
