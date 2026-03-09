---
title: "MX Metadata Conventions — Embrace and Extend"
description: "How MX metadata works across every file type. The implementation rules for native metadata, block mapping, namespace extension, and Reginald serving."
author: "Tom Cranstoun and Maxine"
created: 2026-02-15
modified: 2026-02-15
version: "1.0"

mx:
  status: active
  category: deliverable
  contentType: info-doc
  tags: [metadata, conventions, html, javascript, css, file-types, embrace-extend, blocks, namespace]
  audience: [tech, business]
  buildsOn: [what-is-a-cog, fields]
  partOf: mx-maxine-lives
  runbook: "This document defines how MX metadata works in every file type. Read this before adding metadata to non-markdown files. The Gathering spec defines the principles; this document defines the rules."
---

# MX Metadata Conventions — Embrace and Extend

MX does not ask you to rewrite your JavaScript. It reads what you already wrote and understands it.

Every file type has its own conventions for metadata. JavaScript has JSDoc. HTML has meta tags. CSS has comments at the top. These conventions have been around for decades. They work. MX does not replace them.

What MX adds is an identity layer. Your JavaScript file already describes its functions with `@param` and `@returns`. MX adds `@mx:name` and `@mx:purpose` so the file can introduce itself to any AI agent, any registry, any machine that needs to understand what it is.

The architecture is: **embrace** what the file already says. **Extend** with what MX needs. Never duplicate. Never wrap. The pre-existing metadata IS the block.

---

## Standards Hierarchy

Everything that benefits SEO, GEO (Generative Engine Optimisation), accessibility, and usability also benefits MX. Established web standards — HTML semantics, WCAG, Schema.org, Open Graph, Dublin Core, `robots.txt`, `sitemap.xml` — come first. MX adds governance and lifecycle metadata where those standards leave gaps. MX never duplicates or replaces what existing standards already provide.

A well-built MX page is also a well-built SEO page, a well-built accessible page, and a well-built GEO page. The standards reinforce each other.

---

## The Embrace-and-Extend Model

When MX reads a file, it does two things:

1. **Recognises pre-existing structures as blocks.** JSDoc `@description` is the prose block. Schema.org JSON-LD is the definition block. EXIF data is the provenance block. These are not MX inventions. They are existing standards that MX classifies into its block system.

2. **Adds the MX identity layer.** Fields like `@mx:name`, `@mx:version`, `@mx:purpose`, `@mx:audience`, and `@mx:category` are the governance metadata. They tell machines: who is this, what version is it, what is it for, and who is it for.

The result: a file that works exactly as before for tools that do not understand MX, and is fully machine-readable for tools that do.

---

## Per-File-Type Conventions

### Markdown (.cog.md)

The canonical format. Fully documented in the cog unified spec (The Gathering, v2.1-draft).

```markdown
---
name: pricing-validator
version: "1.0.0"
description: "Validate pricing data to catch range errors before AI agents misinterpret them"
created: 2026-02-15
modified: 2026-02-15
author: Tom Cranstoun
category: mx-core
tags: [pricing, validation, accuracy]
---

# Pricing Validator

Validates pricing data to catch the errors before they erode trust.
```

**Metadata location:** YAML frontmatter between `---` fences.
**MX extension:** Standard cog fields (no prefix needed in YAML).
**Prose block:** The markdown body below the frontmatter.
**Blocks:** Declared in the `blocks:` array in YAML.

---

### JavaScript (.cog.js)

JavaScript files carry metadata in JSDoc comment blocks. MX adds `@mx:` tags alongside standard JSDoc tags.

```javascript
/**
 * Pricing Validation Engine
 *
 * @file pricing-validator.cog.js
 * @description Validates pricing data against MX schema rules
 * @version 1.0.0
 * @author Tom Cranstoun
 *
 * @mx:name pricing-validator
 * @mx:version 1.0.0
 * @mx:purpose Validate pricing data to catch range errors
 * @mx:audience developers, ai-agents
 * @mx:category mx-core
 * @mx:stability stable
 * @mx:builds-on pricing, schema
 * @mx:tags pricing, validation, accuracy
 *
 * @param {string} url - The URL to validate
 * @returns {object} Validation results with issues found
 */
export function validatePricing(url) {
  // implementation
}
```

**Metadata location:** JSDoc comment block at the top of the file.
**MX extension:** `@mx:` prefixed tags within the JSDoc block.
**Block mapping:**

| JSDoc Structure | MX Block Equivalent |
| --- | --- |
| `@description` / `@file` | prose |
| `@param`, `@returns`, `@typedef` | definition |
| `@example` | code |
| `@see`, `@link` | builds-on / refersTo equivalent |
| Function bodies | code (implicit) |

**Canonical tag format:** `@mx:field-name` (kebab-case after `@mx:`). The `@mx-ai-*` pattern found in older files is deprecated — migrate to `@mx:*`.

**Required `@mx:` tags:** `@mx:name`
**Recommended:** `@mx:version`, `@mx:purpose`
**Optional:** `@mx:audience`, `@mx:stability`, `@mx:category`, `@mx:tags`, `@mx:builds-on`, `@mx:documented-in`, `@mx:context-provides`

---

### CSS (.cog.css)

CSS has no native metadata convention like JSDoc. MX uses a structured comment block at the top of the file with the same `@mx:` tag pattern as JavaScript.

```css
/**
 * MX Dark Theme
 *
 * @mx:name mx-dark-theme
 * @mx:version 1.0.0
 * @mx:purpose Dark colour scheme following WCAG AA contrast requirements
 * @mx:audience designers, developers
 * @mx:stability stable
 * @mx:category capability
 * @mx:tags theme, dark-mode, accessibility, wcag
 */

:root {
  --mx-bg: #1a1a2e;
  --mx-text: #e0e0e0;
  --mx-accent: #00d4aa;
}
```

**Metadata location:** `/* */` comment block at the top of the file.
**MX extension:** `@mx:` prefixed tags inside the comment block.
**Block mapping:**

| CSS Structure | MX Block Equivalent |
| --- | --- |
| File-top description comment | prose |
| `:root` custom properties | definition |
| Media query documentation | definition |
| Rule documentation comments | code (implicit) |

**Required `@mx:` tags:** `@mx:name`
**Recommended:** `@mx:version`, `@mx:purpose`
**Optional:** `@mx:audience`, `@mx:stability`, `@mx:category`, `@mx:tags`

---

### HTML (.cog.html)

HTML files carry page-level metadata in `<meta>` tags and block-level metadata in `data-mx-*` attributes. Embedded `<style>` and `<script>` blocks use their own native conventions.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Highland Kitchen — Edinburgh</title>

    <!-- MX identity metadata -->
    <meta name="mx:name" content="highland-kitchen">
    <meta name="mx:version" content="1.0.0">
    <meta name="mx:type" content="restaurant">
    <meta name="mx:category" content="venue">
    <meta name="mx:audience" content="humans, ai-agents">
    <meta name="mx:tags" content="restaurant, edinburgh, scottish-cuisine, accessibility">
    <link rel="mx" href="/highland-kitchen.cog.md">

    <!-- Standard web metadata (embraced, not duplicated) -->
    <meta name="description" content="Traditional Scottish cuisine in Edinburgh's Old Town">
    <script type="application/ld+json">
    { "@context": "https://schema.org", "@type": "Restaurant", "name": "The Highland Kitchen" }
    </script>

    <!-- Embedded CSS block with its own metadata -->
    <style data-mx-block="code" data-mx-purpose="theme">
        /**
         * @mx:name highland-theme
         * @mx:version 1.0.0
         */
        body { font-family: Georgia, serif; }
    </style>

    <!-- Embedded JS block with its own metadata -->
    <script data-mx-block="code" data-mx-purpose="booking">
        /**
         * @mx:name booking-widget
         * @mx:version 1.0.0
         * @description Handles table reservation form submission
         */
        function bookTable(date, guests) { /* ... */ }
    </script>
</head>
```

**Page-level metadata:** `<meta name="mx:*" content="...">` in `<head>`.
**Block-level metadata:** `data-mx-*` attributes on `<style>` and `<script>` elements.
**Pointer to full cog:** `<link rel="mx" href="page.cog.md">`.
**Block mapping:**

| HTML Structure | MX Block Equivalent |
| --- | --- |
| `<meta name="description">` | prose (excerpt) |
| Schema.org JSON-LD | definition |
| Open Graph `<meta property="og:*">` | recognised metadata (not MX-specific, but readable) |
| `<main>` content | essence |
| `<style>` elements | code (CSS) |
| `<script>` elements | code (JS) |

**Required `mx:` tags:** `mx:name`
**Recommended:** `mx:version`, `mx:type`
**Optional:** `mx:category`, `mx:audience`, `mx:tags`, `mx:purpose`

---

### Images (.cog.png, .cog.jpg)

Image files carry metadata in EXIF/XMP fields. MX adds identity fields in the XMP namespace.

This is a future convention. The principle is documented here; the detailed XMP field mapping will be added when the first image cog is created.

**Pre-existing structures recognised:**

- EXIF creation date = provenance
- EXIF camera/device info = provenance
- XMP Dublin Core fields = standard metadata

---

## Reginald Serving Behaviour

When Reginald serves a `.cog.html` file, it content-negotiates:

- **MX-aware client** (`Accept: application/mx+json` or similar): receives parsed metadata with block boundaries and types. The client can address individual blocks by type.
- **Standard browser** (`Accept: text/html`): receives the HTML page as-is. All MX metadata is inert — browsers ignore unknown `<meta>` names, `data-mx-*` attributes are spec-compliant HTML5, and comments are invisible.

MX metadata is left inert for old browsers. There is no stripping, no processing cost, no transformation. The file works for both audiences as written. This is "design for both" at the file level.

A cog's security or policy block may override this default. Confidential metadata can be stripped on serve. But the default is: leave it. The web already ignores what it does not understand.

---

## Extension Rules

### When to use mx:*

Use the `mx:` namespace for Cog-Nova-MX product-specific metadata — fields that are meaningful within MX OS, Maxine, and Reginald. Examples: `mx:purpose`, `mx:audience`, `mx:stability`, `mx:context-provides`.

### When to use a vendor namespace

If you are a CMS vendor, platform provider, or tool maker adding metadata to cogs, register your own namespace prefix. Examples: `adobe:template`, `contentful:space`, `shopify:collection`. Your namespace is yours. MX does not police it.

Register your prefix in Reginald to avoid collisions. The Gathering defines the `prefix:field` pattern. What goes in your prefix is your business.

### When to propose a new standard field

If a field would be useful to every implementation (not just Cog-Nova-MX), propose it to The Gathering. Standard fields have no prefix — they belong to everyone. Examples: `name`, `version`, `description`.

### Decision tree

```
Is this field useful to ALL implementations?
  ├── YES → Propose to The Gathering (standard field, no prefix)
  └── NO → Is this an Cog-Nova-MX product field?
            ├── YES → Use mx:* namespace
            └── NO → Register your own vendor:* namespace
```

---

## Deprecations

### @mx-ai-* pattern

The `@mx-ai-*` pattern is deprecated. If encountered in any file, migrate to the canonical `@mx:*` format:

| Deprecated | Canonical |
| --- | --- |
| `@mx-ai-assistance` | (remove — MX metadata implies AI-readability) |
| `@mx-ai-editable` | (remove — not a metadata concern) |
| `@mx-ai-contextProvides` | `@mx:context-provides` |

### context_provides vs context-provides

Existing files use `@mx:context_provides` (underscore). The canonical form is `@mx:context-provides` (kebab-case, per MX convention). Migrate on next edit.

### cog:* HTML namespace

The `cog:*` HTML meta tag namespace (`<meta name="cog:name">`, `<link rel="cog">`) is deprecated. Use `mx:*` (`<meta name="mx:name">`, `<link rel="mx">`). Backend code accepts both during transition.

---

## Complete Block Mapping Reference

| Pre-existing Structure | File Type | Maps To Block | Notes |
| --- | --- | --- | --- |
| YAML frontmatter fields | .cog.md | (base metadata) | Not a block — the identity layer |
| Markdown body | .cog.md | prose | Implicit — never declared in YAML |
| JSDoc `@description` / `@file` | .cog.js | prose | File-level description |
| JSDoc `@param` / `@returns` / `@typedef` | .cog.js | definition | Function interface contract |
| JSDoc `@example` | .cog.js | code | Inline example |
| Function bodies | .cog.js | code (implicit) | The executable content |
| CSS file-top comment | .cog.css | prose | File description |
| CSS `:root` custom properties | .cog.css | definition | Design tokens |
| CSS rules | .cog.css | code (implicit) | The stylesheet content |
| `<meta name="description">` | .cog.html | prose (excerpt) | Page description |
| Schema.org JSON-LD | .cog.html | definition | Structured data |
| Open Graph `<meta property="og:*">` | .cog.html | (recognised, not MX-specific) | Social metadata |
| `<main>` content | .cog.html | essence | The page itself |
| `<style>` elements | .cog.html | code (CSS) | Embedded stylesheet |
| `<script>` elements | .cog.html | code (JS) | Embedded program |
| EXIF creation date | .cog.png/jpg | provenance | When the image was captured |
| `# ---` comment block | shell scripts | (base metadata) | See cog unified spec Section 21 |

---

*MX Metadata Conventions v1.0 — 15 February 2026*

*Implementation spec for Cog-Nova-MX. Built on The Gathering cog unified spec v2.1-draft.*

*"Embrace what the file already says. Extend with what MX needs. Never duplicate. Never wrap."*
