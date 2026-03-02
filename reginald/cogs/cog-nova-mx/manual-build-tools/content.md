---
name: manual-build-tools
title: Build Tools Manual
description: Sitemap generation, content organisation, ASCII-to-SVG conversion, context URL injection, and VS Code cleanup.
author: Tom Cranstoun and Maxine
created: 2026-02-15T00:00:00.000Z
version: "1.0"
status: active
category: manual
tags:
  - manual
  - build
  - tools
  - sitemap
  - svg
  - cleanup
  - publishing
partOf: mx-maxine-lives
purpose: Document build tools - usage, workflow, and best practices
audience: human
stability: stable
runbook: Read when working with build tools or understanding its functionality
contextProvides:
  - Sitemap generation, content organisation, ASCII-to-SVG conversion, context URL injection, and VS Code cleanup.
  - Usage guide and workflow for build tools
  - Troubleshooting and best practices
refersTo: []
---

# Build Tools

Scripts for content processing, publishing, and environment management.

---

## Scripts

### generate-sitemap.js

Generates `sitemap.xml` for book appendices following the sitemaps.org protocol. Targets allabout.network URLs.

```bash
node scripts/generate-sitemap.js
```

### organize-think-content.js

Splits a monolithic `full_text.txt` into per-chapter markdown files with illustration references.

```bash
node scripts/organize-think-content.js
```

### preprocess-ascii-to-svg.js

Converts ASCII diagrams in markdown files to professional SVG with MX brand styling (boxes, arrows, colours).

```bash
node scripts/preprocess-ascii-to-svg.js <markdown-file>
```

### add-context-urls.py

Finds markdown links to `.md` files and adds context-preserving URL annotations in the pattern `[file](path) ("Title" at <URL>)`.

```bash
python3 scripts/add-context-urls.py
```

### cleanup-extensions.sh

Removes unused VS Code extensions (PHP, Java, C#, Swift, remote dev, etc.) to reduce clutter and improve performance. Keeps AI assistants, Python/Jupyter, AEM, Docker, and essentials.

```bash
bash scripts/cleanup-extensions.sh
```

### migrate-to-v1.sh

One-time migration script from old repository structure to v1. Supports `--dry-run` and `--minimal` flags.

```bash
bash scripts/migrate-to-v1.sh [--dry-run] [--minimal]
```

---

## Files

| Script | Category | Language |
|--------|----------|----------|
| `scripts/generate-sitemap.js` | Publishing | Node.js |
| `scripts/organize-think-content.js` | Content | Node.js |
| `scripts/preprocess-ascii-to-svg.js` | Publishing | Node.js |
| `scripts/add-context-urls.py` | Content | Python |
| `scripts/cleanup-extensions.sh` | Environment | Bash |
| `scripts/migrate-to-v1.sh` | Migration | Bash |

---

*Part of MX OS. The instructions are the program.*
