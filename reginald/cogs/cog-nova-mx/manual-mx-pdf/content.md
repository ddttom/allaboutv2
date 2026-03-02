---
name: manual-mx-pdf
title: mx-pdf Manual
description: Generate professional PDFs from markdown using Pandoc and XeLaTeX.
author: Tom Cranstoun and Maxine
created: 2026-02-15T00:00:00.000Z
version: "1.0"
status: active
category: manual
tags:
  - manual
  - mx-pdf
  - pdf
  - pandoc
  - publishing
partOf: mx-maxine-lives
purpose: Document mx pdf - usage, workflow, and best practices
audience: human
stability: stable
runbook: Read when working with mx pdf or understanding its functionality
contextProvides:
  - Generate professional PDFs from markdown using Pandoc and XeLaTeX.
  - Usage guide and workflow for mx pdf
  - Troubleshooting and best practices
refersTo: []
---

# mx-pdf — PDF Generation

Convert markdown files to professional PDFs. Strips emoji, extracts YAML metadata, generates table of contents, and produces clean A4 documents.

---

## Quick Start

```bash
bash scripts/mx-pdf.sh <markdown-file>
```

---

## What It Does

1. Reads a markdown file with YAML frontmatter
2. Strips all emoji characters (they break XeLaTeX rendering)
3. Extracts title, author, date from frontmatter
4. Generates a 2-level table of contents
5. Produces a clean A4 PDF with professional formatting (11pt, 1" margins)
6. Saves an intermediate cleaned markdown for future regeneration

---

## Dependencies

| Dependency | Purpose | Install |
|------------|---------|---------|
| **pandoc** | Markdown to LaTeX conversion | `brew install pandoc` |
| **xelatex** | LaTeX to PDF rendering | `brew install --cask mactex` or `brew install basictex` |

---

## Files

| File | Purpose |
|------|---------|
| `scripts/mx-pdf.sh` | The script |
| `mx-canon/mx-maxine-lives/manuals/manual-mx-pdf.cog.md` | This manual |

---

*Part of MX OS. The instructions are the program.*
