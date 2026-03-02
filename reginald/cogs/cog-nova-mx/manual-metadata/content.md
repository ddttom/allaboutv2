---
title: Metadata Manual — How to Make Any File Machine-Readable
description: Step-by-step guide for adding MX metadata to markdown, JavaScript, CSS, and HTML files. The human playbook for the embrace-and-extend model.
version: "1.0"
created: 2026-02-15T00:00:00.000Z
modified: 2026-02-15T00:00:00.000Z
author: Tom Cranstoun and Maxine

mx:
  name: manual-metadata
  status: active
  license: proprietary
  category: manual
  tags:
    - manual
    - metadata
    - conventions
    - html
    - javascript
    - css
    - yaml
    - frontmatter
    - embrace-extend
  partOf: mx-maxine-lives
  audience:
    - operators
    - tech
  buildsOn:
    - what-is-a-cog
    - mx-metadata-conventions
    - field-dictionary
  execute:
    runtime: runbook
    actions:
      - name: validate
        description: Check a file for correct MX metadata per its file type
        usage: Provide a file path. The agent reads the file, determines its type, and checks that MX metadata follows the conventions in this manual.
        inputs:
          - name: file-path
            type: string
            required: true
            description: Path to the file to validate
        outputs:
          - name: report
            type: object
            description: "Validation results: file type detected, metadata found, issues, suggestions"
  purpose: Document metadata - usage, workflow, and best practices
  stability: stable
  runbook: "mx exec manual-metadata"
  contextProvides:
    - Step-by-step guide for adding MX metadata to markdown, JavaScript, CSS, and HTML files. The human playbook for the embrace-and-extend model.
    - Usage guide and workflow for metadata
    - Troubleshooting and best practices
  refersTo: []
---

# Metadata Manual

**How to add MX metadata to any file. For Tom, Maxine, or any AI agent.**

MX metadata makes a file introduce itself. An AI agent reads the metadata and knows: what is this, who made it, what version, what is it for, who is it for. Without metadata, the agent reads every line. With metadata, it reads twelve lines and decides.

The rule is simple: use the metadata convention that already exists for your file type. MX adds its own fields on top. Never duplicate. Never wrap.

---

## Which Convention Do I Use?

```
What file type are you working with?
│
├── .md (Markdown)
│   ├── Is it a cog? (.cog.md)
│   │   └── YES → YAML frontmatter with name: field (Section A)
│   │   └── NO  → YAML frontmatter with title: field (Section A)
│
├── .js (JavaScript)
│   └── JSDoc comment block with @mx: tags (Section B)
│
├── .css (CSS)
│   └── Comment block /* */ with @mx: tags (Section C)
│
├── .html (HTML)
│   └── <meta name="mx:*"> tags in <head> (Section D)
│
├── .sh / .py / .rb (Scripts)
│   └── # --- comment block with key: value (Section E)
│
└── .png / .jpg (Images)
    └── EXIF/XMP fields (future — see implementation spec)
```

---

## Section A: Markdown Files

### Before

```markdown
# Pricing Validator

Validates pricing data.
```

### After (.cog.md)

```markdown
---
name: pricing-validator
version: "1.0.0"
description: "Validate pricing data to catch range errors"
created: 2026-02-15
modified: 2026-02-15
author: Tom Cranstoun
---

# Pricing Validator

Validates pricing data to catch the errors before they erode trust.
```

### After (regular .md)

```markdown
---
title: "Pricing Validator Guide"
description: "How to use the pricing validator"
author: Tom Cranstoun
created: 2026-02-15
modified: 2026-02-15
---

# Pricing Validator Guide

How to use the pricing validator.
```

### What changed

- Added YAML frontmatter between `---` fences
- Cog files use `name:` (machine identifier, kebab-case)
- Regular files use `title:` (human-readable)
- Six fields cover the minimum: name/title, description, author, created, modified, version

### Minimum required fields

| Cog (.cog.md) | Regular (.md) |
| --- | --- |
| `name` | `title` |
| `version` | `description` |
| `description` | `author` |
| `created` | `created` |
| `modified` | `modified` |
| `author` | |

### Nice to have

`status`, `tags`, `audience`, `purpose`, `category`, `builds-on`, `partOf`

---

## Section B: JavaScript Files

### Before

```javascript
function validatePrice(url) {
  // validates pricing data
}
```

### After

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
 */
function validatePrice(url) {
  // validates pricing data
}
```

### What changed

- Added JSDoc comment block at the top
- Standard JSDoc tags (`@description`, `@version`, `@author`) are the existing convention — MX recognises them
- `@mx:` prefixed tags add the MX identity layer
- The file is still valid JavaScript — nothing breaks for non-MX tools

### Minimum required @mx: tags

`@mx:name`

### Recommended

`@mx:version`, `@mx:purpose`

### Nice to have

`@mx:audience`, `@mx:stability`, `@mx:category`, `@mx:tags`, `@mx:builds-on`

### What MX recognises from existing JSDoc

| You already wrote | MX reads it as |
| --- | --- |
| `@description` | prose block |
| `@param` / `@returns` | definition block |
| `@example` | code block |
| `@see` / `@link` | related references |

---

## Section C: CSS Files

### Before

```css
:root {
  --bg: #1a1a2e;
  --text: #e0e0e0;
}
```

### After

```css
/**
 * MX Dark Theme
 *
 * @mx:name mx-dark-theme
 * @mx:version 1.0.0
 * @mx:purpose Dark colour scheme following WCAG AA contrast
 * @mx:audience designers, developers
 * @mx:stability stable
 */

:root {
  --bg: #1a1a2e;
  --text: #e0e0e0;
}
```

### What changed

- Added a structured comment block at the top
- Uses the same `@mx:` tag pattern as JavaScript
- The file is still valid CSS — nothing breaks

### Minimum required @mx: tags

`@mx:name`

### Recommended

`@mx:version`, `@mx:purpose`

---

## Section D: HTML Files

### Before

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>The Highland Kitchen</title>
</head>
```

### After

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>The Highland Kitchen</title>

    <!-- MX identity -->
    <meta name="mx:name" content="highland-kitchen">
    <meta name="mx:version" content="1.0.0">
    <meta name="mx:type" content="restaurant">
    <link rel="mx" href="/highland-kitchen.cog.md">
</head>
```

### What changed

- Added `<meta name="mx:*">` tags for page-level identity
- Added `<link rel="mx">` pointing to the full cog file
- The page is still valid HTML — browsers ignore unknown meta names

### For embedded blocks

If your HTML contains `<style>` or `<script>` elements, each one uses its own native convention:

```html
<style data-mx-block="code" data-mx-purpose="theme">
    /**
     * @mx:name highland-theme
     * @mx:version 1.0.0
     */
    body { font-family: Georgia, serif; }
</style>
```

The `data-mx-*` attributes on the tag give machines quick access. The `@mx:` tags inside give the full metadata. Both are valid HTML5.

### Minimum required mx: tags

`mx:name`

### Recommended

`mx:version`, `mx:type`

### What MX recognises from existing HTML

| You already have | MX reads it as |
| --- | --- |
| `<meta name="description">` | prose excerpt |
| Schema.org JSON-LD | definition block |
| Open Graph tags | social metadata (recognised, not MX-specific) |
| `<main>` content | essence block |

---

## Section E: Shell Scripts

### Before

```bash
#!/bin/bash
echo "Hello"
```

### After

```bash
#!/bin/bash
# ---
# title: "mx.hello — Greeting script"
# version: "1.0"
# created: 2026-02-15
# modified: 2026-02-15
# author: Tom Cranstoun
# description: "Prints a greeting"
# category: mx-tools
# status: active
# tags: [greeting, demo]
# ---

echo "Hello"
```

### What changed

- Added `# ---` delimited comment block (YAML in comments)
- Strip the `#` prefix and you get valid YAML
- Works for any `#`-comment language: Python, Ruby, Perl, Dockerfile

Full details in cog unified spec Section 21.

---

## Quick Reference Card

| File Type | Where | Minimum Fields | Pattern |
| --- | --- | --- | --- |
| `.cog.md` | YAML frontmatter | `name`, `version`, `description`, `created`, `modified`, `author` | Standard cog |
| `.md` | YAML frontmatter | `title`, `description`, `author`, `created`, `modified` | Document |
| `.cog.js` | JSDoc block | `@mx:name` | `@mx:field value` |
| `.cog.css` | `/* */` comment | `@mx:name` | `@mx:field value` |
| `.cog.html` | `<meta>` tags | `mx:name` | `<meta name="mx:field" content="value">` |
| `.sh` | `# ---` block | `title`, `version`, `description` | `# key: value` |

---

## Links

| Resource | Location | What it tells you |
| --- | --- | --- |
| Field Definition Register (FDR) | `mx-canon/mx-maxine-lives/registers/FDR/field-dictionary.cog.md` | Every field defined, with type, profile, and deprecation status |
| Convention Register (CVR) | `mx-canon/mx-maxine-lives/registers/CVR/` | Operational conventions — naming, formatting, git |
| Cog Unified Spec | `mx-canon/mx-the-gathering/deliverables/cog-unified-spec.md` | The open standard (The Gathering) |
| MX Implementation Spec | `MX-Cog-Registry/cogs/mx-maxine-lives/mx-metadata-conventions.cog.md` | Detailed rules per file type, block mapping, Reginald behaviour |

---

## For AI Agents

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Validation complete

Output:
  /Users/tom/Documents/MX/validation-report-2026-02-17.json (1.8KB)
```

Not just "Validation complete" or "validation-report.json created" — the full absolute path from root.

---

*Metadata Manual v1.0 — 15 February 2026*

*"Embrace what the file already says. Extend with what MX needs."*
