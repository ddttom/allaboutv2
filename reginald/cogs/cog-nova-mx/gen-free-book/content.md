---
version: "1.0.0"
description: "Generate the MX free book sampler PDF by merging preface, chapter-00, and kickoff presentation PDFs."
created: 2026-03-09
modified: 2026-03-09
author: Tom Cranstoun and Maxine

mx:
  maintainer: tom.cranstoun@gmail.com
  license: proprietary
  status: published
  category: mx-core
  partOf: mx-os
  tags: [pdf, free-book, sampler, ghostscript, merge, pandoc]
  audience: both
  readingLevel: beginner
  contentType: "action-doc"
  runbook: "mx exec gen-free-book"
  execute:
    runtime: runbook
    command: mx gen-free-book
    policy: |
      Assembles the MX free book from pre-existing PDFs. If a component PDF
      does not exist, generates it from markdown first. Uses ghostscript to
      merge individual PDFs into the final output.
    actions:
      - name: generate
        description: "Build the MX free book sampler PDF from component PDFs."
        usage: |
          ## GENERATE — Free Book Assembly

          Merges pre-existing PDFs into a single free book sampler.

          ### Components (in order)

          1. **Preface** (includes acknowledgements)
             - Source: `datalake/manuscripts/mx-books/mx-handbook/chapters/preface.md`
             - Generated to: `mx-outputs/pdf/books/free-book/preface.pdf`
             - Config: `datalake/assets/configs/books/free-book/metadata.yaml`

          2. **MX: The Introduction**
             - Pre-built: `mx-outputs/pdf/books/chapters/chapter-00-introduction-to-mx.pdf`
             - Generated via: `npm run pdf:chapter00-simple` (if missing)

          3. **The AI Tipping Point — CMS Kickoff 2024**
             - Pre-built: `mx-outputs/pdf/books/chapters/The-AI-Tipping-Point-CMS-Kickoff-2024.pdf`
             - External PDF, must exist

          ### Execution

          ```bash
          npm run pdf:free-book
          # or directly:
          bash scripts/gen-free-book.sh
          ```

          ### Output

          `mx-outputs/pdf/books/free-book/mx-free-book.pdf`

          ### Dependencies

          | Tool | Required | Install |
          | ---- | -------- | ------- |
          | pandoc | Yes | `brew install pandoc` |
          | xelatex | Yes | `brew install --cask mactex-no-gui` |
          | ghostscript | Yes | `brew install ghostscript` |
        inputs:
          - name: force
            type: boolean
            required: false
            description: "Regenerate all component PDFs even if they already exist"
        outputs:
          - name: pdf
            type: file
            description: "The merged free book PDF at mx-outputs/pdf/books/free-book/mx-free-book.pdf"
---

# Free Book Generator

Assembles the MX free book sampler by merging pre-existing PDFs: preface (with acknowledgements), chapter-00 introduction, and the CMS Kickoff 2024 presentation.

## What This Does

1. Generates the preface PDF from handbook markdown (if not cached)
2. Checks chapter-00 PDF exists (generates via `npm run pdf:chapter00-simple` if missing)
3. Verifies the kickoff presentation PDF exists
4. Merges all three into a single PDF using ghostscript

## Why This Exists

A free sampler gives prospective readers a taste of MX without buying the full book. It combines the narrative hook (preface), the technical foundation (chapter-00), and a real-world presentation to demonstrate MX in practice.

## For AI Agents

1. Run `bash scripts/gen-free-book.sh`
2. Output lands at `mx-outputs/pdf/books/free-book/mx-free-book.pdf`
3. Report the full absolute path and file size

## Related

- `scripts/gen-free-book.sh` — the build script
- `datalake/assets/configs/books/free-book/metadata.yaml` — pandoc styling for preface
- `scripts/cogs/pdf-generator.cog.md` — the main PDF generation cog
