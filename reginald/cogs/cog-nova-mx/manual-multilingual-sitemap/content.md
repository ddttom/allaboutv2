---
name: manual-multilingual-sitemap
title: "Multilingual Sitemap Generator Manual"
description: "Automatically generates sitemap.xml for multilingual sites with proper hreflang annotations following sitemaps.org protocol and Google best practices."
author: Tom Cranstoun and Maxine
created: 2026-02-21
version: "1.0"
status: active
category: manual
tags: [manual, multilingual, sitemap, seo, hreflang, google, internationalization]
partOf: mx-maxine-lives
mx:
  purpose: "Document the multilingual sitemap generator tool - usage, workflow, and SEO best practices"
  audience: "human"
  stability: "stable"
  runbook: "Read when working with multilingual sites, generating sitemaps, or implementing hreflang SEO"
  ai:
    contextProvides:
      - "Multilingual sitemap generation workflow and command-line usage"
      - "Google SEO best practices for hreflang annotations"
      - "Sitemap.xml structure and bidirectional language references"
      - "Troubleshooting multilingual sitemap issues"
refersTo:
  - "mx-canon/mx-the-gathering/reference-implementations/_tools/generate-sitemap.js"
  - "mx-canon/mx-the-gathering/reference-implementations/_tools/README.cog.md"
---

# Multilingual Sitemap Generator

Automatically generates `sitemap.xml` for multilingual sites with proper hreflang annotations, following the sitemaps.org protocol and Google's multilingual SEO best practices.

---

## Overview

The sitemap generator scans language directories (`/es/`, `/en/`, etc.), groups HTML files by page, and creates a sitemap with bidirectional hreflang links. Each page appears once per language with cross-references to all translations.

**Key Features:**

- Automatic HTML file discovery
- Language-based file grouping
- Bidirectional hreflang annotations
- x-default language support
- Configurable change frequency and priority
- File modification time tracking

---

## Usage

### Basic Usage

```bash
npm run generate:sitemap -- --domain=example.com --dir=/path/to/site
```

### Command-Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `--domain` | `example.com` | Domain name for URLs |
| `--dir` | Current directory | Site root directory |
| `--languages` | `es,en` | Comma-separated language codes |
| `--defaultLang` | `es` | Default language for x-default |
| `--changefreq` | `weekly` | How often content changes |
| `--priority` | `1.0` | URL priority (0.0-1.0) |
| `--output` | `sitemap.xml` | Output filename |

### Examples

**Generate sitemap for Los Granainos:**

```bash
npm run generate:sitemap -- --domain=allabout.network --dir=allaboutv2/mx/demo/salva
```

**Custom languages and priority:**

```bash
npm run generate:sitemap -- --domain=example.com --languages=fr,de,it --priority=0.8
```

**Monthly updates with custom output:**

```bash
npm run generate:sitemap -- --domain=example.com --changefreq=monthly --output=public/sitemap.xml
```

---

## How It Works

### 1. File Discovery

Recursively scans the directory for HTML files, skipping common directories:

- `node_modules/`
- `.git/`
- `archive/`
- `messages/`

### 2. Language Grouping

Groups files by page path, matching across language directories:

```
/es/index.html  → Page: "index.html", Language: "es"
/en/index.html  → Page: "index.html", Language: "en"
```

### 3. Sitemap Generation

For each page, creates one `<url>` entry per language with:

- `<loc>` - Absolute URL to the page
- `<xhtml:link>` - hreflang links to all language versions
- `<xhtml:link>` - x-default pointing to default language
- `<lastmod>` - File modification date (YYYY-MM-DD)
- `<changefreq>` - Update frequency hint for crawlers
- `<priority>` - Relative importance (0.0-1.0)

### 4. Output Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- index.html - ES version -->
  <url>
    <loc>https://example.com/es/index.html</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/index.html"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/index.html"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/es/index.html"/>
    <lastmod>2026-02-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- index.html - EN version -->
  <url>
    <loc>https://example.com/en/index.html</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/index.html"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/index.html"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/es/index.html"/>
    <lastmod>2026-02-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

</urlset>
```

---

## Next Steps After Generation

1. **Review** - Check the generated sitemap.xml for correctness
2. **Upload** - Include in deployment to site root
3. **Submit** - Add to Google Search Console
4. **robots.txt** - Add `Sitemap: https://example.com/sitemap.xml`

---

## Troubleshooting

**No HTML files found:**

- Check `--dir` path is correct
- Verify language directories exist (`/es/`, `/en/`)
- Ensure HTML files have `.html` extension

**Missing language versions:**

- Sitemap only includes languages with actual HTML files
- If `/en/index.html` doesn't exist, only `/es/` version appears

**Wrong domain in URLs:**

- Use `--domain` to specify correct domain
- Don't include `https://` prefix (added automatically)

---

## Implementation Details

**File:** `mx-canon/mx-the-gathering/reference-implementations/_tools/generate-sitemap.js`
**Language:** Node.js
**Dependencies:** None (uses Node.js built-ins)
**NPM Script:** `generate:sitemap`
**Exit Codes:**

- `0` - Success
- `1` - Error (shown in console)

---

## Related Tools

- **Multilingual Template Generator** - Creates language-specific HTML versions
- **Multilingual Validator** - Validates sitemap compliance
- **Deployment Helper** - Orchestrates sitemap generation in workflow

---

*Part of MX OS. The instructions are the program.*
