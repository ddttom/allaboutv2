---
name: manual-multilingual-template
title: "Multilingual Template Generator Manual"
description: "Converts a single HTML template into language-specific versions with proper lang attributes, hreflang tags, and root redirect for multilingual sites."
author: Tom Cranstoun and Maxine
created: 2026-02-21
version: "1.0"
status: active
category: manual
tags: [manual, multilingual, template, generation, hreflang, internationalization]
partOf: mx-maxine-lives
mx:
  purpose: "Document the multilingual template generator - converting single HTML to multiple language versions"
  audience: "human"
  stability: "stable"
  runbook: "Read when creating multilingual sites from templates or understanding language version generation"
  ai:
    contextProvides:
      - "Template to multiple language versions workflow"
      - "Lang attribute and hreflang tag generation process"
      - "Root redirect with browser language detection"
      - "Path-based routing implementation for multilingual sites"
refersTo:
  - "mx-canon/mx-the-gathering/reference-implementations/_tools/generate-multilingual.js"
  - "mx-canon/mx-the-gathering/reference-implementations/_tools/README.cog.md"
---

# Multilingual Template Generator

Takes a single HTML template file and generates language-specific versions (`/es/`, `/en/`, etc.) with proper `lang` and `data-lang` attributes, absolute hreflang tags, and a root redirect with browser language detection.

---

## Overview

Starting from one HTML template, this tool creates a complete multilingual site structure:

- Language-specific directories (`/es/`, `/en/`)
- Updated HTML files with correct language attributes
- Proper hreflang meta tags with absolute URLs
- Root `index.html` with JavaScript language detection
- Noscript fallback for accessibility

**Key Features:**

- Single template → multiple language versions
- Automatic lang/data-lang attribute updates
- Absolute URL hreflang tags
- x-default language support
- Root redirect with browser detection
- Path-based language routing (no hash/query params)

---

## Usage

### Basic Usage

```bash
npm run generate:multilingual -- --template=input.html --domain=example.com
```

### Command-Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `--template` | (required) | Path to input HTML template |
| `--domain` | `example.com` | Domain name for hreflang URLs |
| `--output` | Current directory | Output directory |
| `--languages` | `es,en` | Comma-separated language codes |
| `--defaultLang` | `es` | Default language |
| `--baseUrl` | (empty) | Base URL path (e.g., `/mx/demo/salva`) |

### Examples

**Generate from template:**

```bash
npm run generate:multilingual -- --template=source.html --domain=allabout.network --output=dist
```

**With base URL path:**

```bash
npm run generate:multilingual -- --template=index.html --domain=example.com --baseUrl=/mx/demo/site
```

**Three languages:**

```bash
npm run generate:multilingual -- --template=page.html --languages=fr,de,it --defaultLang=fr
```

---

## How It Works

### 1. Template Reading

Reads the input HTML template and validates it exists.

### 2. Language Version Generation

For each language, creates a modified version with:

**HTML Tag Updates:**

```html
<!-- Original -->
<html lang="en" data-lang="en">

<!-- Spanish version -->
<html lang="es" data-lang="es">

<!-- English version -->
<html lang="en" data-lang="en">
```

**Hreflang Tag Updates:**

```html
<!-- Removes any existing hreflang tags -->
<!-- Inserts new ones with absolute URLs -->
<link rel="alternate" hreflang="es" href="https://example.com/es/index.html" />
<link rel="alternate" hreflang="en" href="https://example.com/en/index.html" />
<link rel="alternate" hreflang="x-default" href="https://example.com/es/index.html" />
```

**Content-Language Meta:**

```html
<meta http-equiv="content-language" content="es, en">
```

**Navigation Link Conversion:**

- Converts `#lang=xx` → `/xx/filename.html`
- Converts `?lang=xx` → `/xx/filename.html`
- Ensures path-based routing throughout

### 3. Root Redirect Generation

Creates `index.html` at site root with:

**JavaScript Language Detection:**

```javascript
const userLang = (navigator.language || navigator.userLanguage).substring(0, 2);
const supportedLangs = ['es', 'en'];
const defaultLang = 'es';
const targetLang = supportedLangs.includes(userLang) ? userLang : defaultLang;
window.location.href = `${targetLang}/index.html`;
```

**Noscript Fallback:**

```html
<noscript>
  <h1>Choose Your Language / Elige tu idioma</h1>
  <ul>
    <li><a href="es/index.html">Español</a></li>
    <li><a href="en/index.html">English</a></li>
  </ul>
</noscript>
```

### 4. Output Structure

```
output/
├── index.html              # Root redirect
├── es/
│   └── filename.html       # Spanish version
└── en/
    └── filename.html       # English version
```

---

## Template Requirements

**Minimum HTML Structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Page Title</title>
</head>
<body>
  <!-- Content -->
</body>
</html>
```

**Best Practices:**

- Use semantic HTML5
- Include lang attribute on `<html>` tag
- Avoid hardcoded language references
- Use relative paths for assets (will work across language versions)

---

## Next Steps After Generation

1. **Review** - Check generated files for correctness
2. **Add Assets** - Copy CSS/JS/images to language directories
3. **Generate Sitemap** - Run `npm run generate:sitemap`
4. **Validate** - Run `npm run validate:multilingual`

---

## Troubleshooting

**Template file not found:**

- Check `--template` path is correct
- Use absolute or relative path from current directory

**Generated files missing lang attributes:**

- Ensure template has `<html>` tag
- Check template is valid HTML

**Hreflang URLs incorrect:**

- Verify `--domain` is correct (no https:// prefix)
- Use `--baseUrl` if site is in subdirectory

**Language detection not working:**

- Root `index.html` must be at site root
- JavaScript must be enabled (noscript fallback provides manual selection)

---

## Implementation Details

**File:** `mx-canon/mx-the-gathering/reference-implementations/_tools/generate-multilingual.js`
**Language:** Node.js
**Dependencies:** None (uses Node.js built-ins)
**NPM Script:** `generate:multilingual`
**Exit Codes:**

- `0` - Success
- `1` - Error (template not found or invalid)

---

## Related Tools

- **Multilingual Validator** - Validates generated files
- **Asset Synchronizer** - Copies assets to language directories
- **Sitemap Generator** - Creates sitemap with hreflang

---

*Part of MX OS. The instructions are the program.*
