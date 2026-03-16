---
version: 0.1.0
description: Generate HTML footnote pages and QR codes from markdown chapter footnotes

created: 2026-03-08
modified: 2026-03-09

author: Maxine (MX - Machine eXperience Engine)

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: active

  category: mx-tools
  partOf: mx-os
  refersTo: [pdf-generator, blog-generator]
  tags: [footnotes, html, qr-code, generation, books]

  execute:
    runtime: runbook
    command: mx exec generate-footnotes
    actions:
      - name: generate
        description: Generate HTML footnote pages and QR codes for all chapters with footnotes
        usage: ./scripts/generate-footnotes.sh
        outputs:
          - name: footnote-pages
            type: directory
            description: HTML footnote pages at allaboutv2/mx/footnotes/
          - name: qr-codes
            type: file
            description: QR code PNGs alongside chapter markdown files, generated using the qrcode npm package

      - name: list
        description: List all chapters that have footnotes
        usage: ./scripts/generate-footnotes.sh --list
  runbook: "mx exec generate-footnotes"
---

# Generate Footnotes

Scans all markdown files in `datalake/manuscripts/mx-books/` for Pandoc-style footnote definitions (`[^name]: ...`), then generates:

1. **HTML footnote pages** at `allaboutv2/mx/footnotes/{book}-{chapter}.html` — each footnote listed with its description and clickable URLs on separate lines
2. **QR code PNGs** alongside each chapter file — actual scannable QR codes encoding the URL to the footnote page, generated using the `qrcode` npm package (from `scripts/qr-code-generator/node_modules/`). Chapter markdown references the `.png` version.

## When to run

- After adding, editing, or removing footnotes in any chapter
- Before PDF generation or publication
- As part of the pre-publish workflow

## How it works

1. Finds all `.md` files with `[^` footnote patterns
2. Groups footnotes by chapter file
3. Generates one HTML page per chapter with footnotes
4. Generates one QR code card PNG per chapter (scannable QR code + title + URL + description)
5. HTML follows allaboutv2 conventions (MX carrier metadata, Schema.org JSON-LD)

## Output

- `allaboutv2/mx/footnotes/shared-chapter-00.html`
- `datalake/manuscripts/mx-books/shared/chapter-00-footnotes-qr.png`
- (additional files as more chapters gain footnotes)

The script is idempotent — safe to re-run whenever footnotes change.

## QR code generation

QR codes are generated as composite card images: a scannable QR code on the left with "Footnotes & References" title, the footnote page URL, and a description on the right. Generated using the `qrcode` npm package (from `scripts/qr-code-generator/node_modules/`) for the QR code, composed into an SVG card, then converted to PNG via `rsvg-convert`. Each card is placed alongside the chapter markdown file. The QR code uses high error correction (Level H), suitable for print.

## PDF footnote formatting

This cog generates HTML footnote pages where URL line breaks are handled by CSS. However, the source markdown footnotes also appear in PDF output via pandoc. Pandoc collapses indented continuation lines into a single paragraph, so footnote definitions must use trailing backslash `\` line breaks between the description and each URL. Without this, multi-URL footnotes run together on one line in the PDF.

See `mx-canon/ssot/writing-guides/writing-style.md` Section 11 for the full convention and examples.
