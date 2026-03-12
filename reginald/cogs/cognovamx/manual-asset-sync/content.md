---
title: "Asset Synchronizer Manual"
description: "Synchronizes CSS, JavaScript, images, fonts, and other static assets across multilingual site language directories."
author: Tom Cranstoun and Maxine
created: 2026-02-21
modified: 2026-03-02
version: "1.0"

mx:
  status: active
  category: manual
  tags: [manual, multilingual, assets, sync, automation, workflow]
  partOf: mx-maxine-lives
  audience: humans
  stability: "stable"
  runbook: "Read when synchronizing assets across multilingual site languages or managing static files"
  contextProvides:
    - "Asset synchronization workflow (language-to-language and external source modes)"
    - "Supported asset types and file filtering"
    - "Dry run safety features and workflow integration"
    - "Best practices for multilingual asset management"
  refersTo:
    - "mx-canon/mx-the-gathering/reference-implementations/_tools/sync-assets.js"
    - "mx-canon/mx-the-gathering/reference-implementations/_tools/README.cog.md"
---

# Asset Synchronizer

Synchronizes CSS, JavaScript, images, fonts, and other static assets across language directories in multilingual sites. Supports two modes: copy from one language to others, or copy from external source to all languages.

---

## Overview

Multilingual sites often share assets (stylesheets, scripts, images, fonts) across language versions. Manually copying these files is error-prone and time-consuming. This tool automates asset synchronization with safety features.

**Key Features:**

- Copy from one language to all others
- Copy from external source to all languages
- Supports multiple asset types (CSS, JS, images, fonts, JSON)
- Dry run mode for safety
- Asset type filtering
- Modification time preservation

**Supported Asset Types:**

- **Styles:** `.css`
- **Scripts:** `.js`
- **Data:** `.json`
- **Images:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.ico`
- **Fonts:** `.woff`, `.woff2`, `.ttf`, `.eot`

---

## Usage

### Mode 1: Language-to-Language Copy

Copy assets from one language directory to all others.

```bash
npm run sync:assets -- --dir=/path/to/site --mode=language
```

**Example:**

```bash
npm run sync:assets -- --dir=allaboutv2/mx/demo/salva --mode=language
```

**Behavior:**

- Finds all assets in first language directory (`/es/`)
- Copies to other language directories (`/en/`, etc.)
- Preserves relative paths within language directories

---

### Mode 2: External Source Copy

Copy assets from external directory to all language directories.

```bash
npm run sync:assets -- --dir=/path/to/site --mode=external --source=/path/to/assets
```

**Example:**

```bash
npm run sync:assets -- --dir=dist --mode=external --source=shared-assets
```

**Behavior:**

- Reads all assets from `--source` directory
- Copies to every language directory
- Maintains source directory structure

---

### Command-Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `--dir` | Current directory | Site root directory |
| `--mode` | `language` | Copy mode: `language` or `external` |
| `--source` | (required for external mode) | External asset directory |
| `--languages` | `es,en` | Comma-separated language codes |
| `--types` | (all types) | Filter asset types (e.g., `css,js`) |
| `--dry-run` | `false` | Show what would be copied without copying |

### Examples

**Dry run (preview only):**

```bash
npm run sync:assets -- --dir=dist --dry-run=true
```

**Copy only CSS and JS:**

```bash
npm run sync:assets -- --dir=dist --types=css,js
```

**Copy from shared assets to all languages:**

```bash
npm run sync:assets -- --dir=public --mode=external --source=common/assets
```

---

## How It Works

### Language-to-Language Mode

**Step 1: Asset Discovery**
Scans first language directory (`/es/`) for supported file types:

```
/es/
  ├── styles.css
  ├── script.js
  ├── logo.png
  └── fonts/
      └── custom.woff2
```

**Step 2: Copy to Other Languages**
Replicates structure in each target language:

```
/en/
  ├── styles.css         ← copied from /es/
  ├── script.js          ← copied from /es/
  ├── logo.png           ← copied from /es/
  └── fonts/
      └── custom.woff2   ← copied from /es/
```

**Preserves:**

- Directory structure
- File modification times
- Relative paths

---

### External Source Mode

**Step 1: Source Reading**
Scans external directory:

```
shared-assets/
  ├── global.css
  ├── common.js
  └── images/
      └── banner.jpg
```

**Step 2: Copy to All Languages**

```
/es/
  ├── global.css
  ├── common.js
  └── images/
      └── banner.jpg

/en/
  ├── global.css
  ├── common.js
  └── images/
      └── banner.jpg
```

---

## Dry Run Mode

Use `--dry-run=true` to preview changes without modifying files:

```
🔄 MX Asset Synchronizer (DRY RUN)

Configuration:
  Directory: /path/to/site
  Mode: language
  Languages: es, en

📁 Scanning for assets in /es/...

📋 Assets to sync:
   [CSS] styles.css
   [JS] script.js
   [PNG] logo.png
   [WOFF2] fonts/custom.woff2

🔄 Would copy to:
   → /en/styles.css
   → /en/script.js
   → /en/logo.png
   → /en/fonts/custom.woff2

📊 Summary:
   Assets found: 4
   Target languages: 1
   Total operations: 4

⚠️  DRY RUN - No files were modified
```

**Exit Code:** 0

---

## Asset Type Filtering

Copy only specific asset types:

**CSS only:**

```bash
npm run sync:assets -- --types=css
```

**Images only:**

```bash
npm run sync:assets -- --types=png,jpg,jpeg,gif,svg,webp
```

**CSS and JavaScript:**

```bash
npm run sync:assets -- --types=css,js
```

---

## Safety Features

1. **Dry Run Default:**
   - Shows what would happen before actual copy
   - Requires explicit confirmation for production use

2. **Type Validation:**
   - Only copies recognized asset types
   - Prevents accidental HTML file overwrite

3. **Directory Preservation:**
   - Maintains source directory structure
   - Creates target directories as needed

4. **Overwrite Warning:**
   - Alerts when overwriting existing files
   - Shows file count before copy

---

## Workflow Integration

### After Template Generation

```bash
# 1. Generate multilingual templates
npm run generate:multilingual -- --template=index.html --domain=example.com

# 2. Copy CSS/JS/images from source language
npm run sync:assets -- --mode=language

# 3. Validate structure
npm run validate:multilingual
```

### With External Asset Library

```bash
# 1. Sync shared assets to all languages
npm run sync:assets -- --mode=external --source=shared-assets

# 2. Sync language-specific assets
npm run sync:assets -- --mode=language

# 3. Generate sitemap
npm run generate:sitemap
```

---

## Troubleshooting

**No assets found:**

- Check `--dir` path is correct
- Verify first language directory (`/es/`) contains assets
- Ensure files have supported extensions

**Source directory not found (external mode):**

- Verify `--source` path exists
- Use absolute or relative path from current directory

**Permission errors:**

- Check write permissions on target directories
- May need elevated permissions for system directories

**Wrong files copied:**

- Use `--types` to filter asset types
- Run with `--dry-run=true` first to preview

---

## Implementation Details

**File:** `mx-canon/mx-the-gathering/reference-implementations/_tools/sync-assets.js`
**Language:** Node.js
**Dependencies:** None (uses Node.js built-ins)
**NPM Script:** `sync:assets`
**Exit Codes:**

- `0` - Success
- `1` - Error (source not found, permission denied)

---

## Related Tools

- **Multilingual Template Generator** - Creates HTML files needing asset sync
- **Content Parity Checker** - Verifies consistency after sync
- **Deployment Helper** - Includes asset sync in workflow

---

*Part of MX OS. The instructions are the program.*
