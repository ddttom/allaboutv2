---
name: marp-regen
version: "1.0.0"
description: "Regenerate PPTX presentations from Marp markdown files"

created: 2026-02-26
modified: 2026-02-26

author: Tom Cranstoun and Maxine
maintainer: tom.cranstoun@gmail.com
license: proprietary
status: published

category: mx-tools
partOf: mx-os
tags: [marp, presentation, pptx, slides, regenerate]

audience: both
reading-level: technical
purpose: "Convert Marp markdown to PPTX using marp-cli"

execute:
  runtime: bash
  command: |
    @embedded:marp-regen-script
  actions:
    - name: generate
      description: "Regenerate PPTX from a Marp markdown file"
      usage: |
        ## GENERATE — Marp to PPTX

        Converts a Marp markdown file (.md with `marp: true` frontmatter) to PPTX.

        ### Usage

        ```bash
        mx marp-regen <path-to-markdown>
        ```

        ### Example

        ```bash
        mx marp-regen mx-outputs/md/presentations/london-cms-experts-2026-02-26.md
        ```

        ### What it does

        1. Validates the file exists and has `marp: true` in frontmatter
        2. Runs `npx @marp-team/marp-cli` with `--pptx --allow-local-files`
        3. Outputs PPTX in the same directory as the source markdown

      inputs:
        - name: source
          type: file
          required: true
          description: "Path to the Marp markdown file"
      outputs:
        - name: pptx
          type: file
          description: "Generated PPTX presentation"

mx:
  contentType: action-doc
  runbook: "mx exec marp-regen"

---

```bash @embedded:marp-regen-script
#!/bin/bash
# Marp PPTX Regenerator
# Usage: mx marp-regen <path-to-markdown>

set -e

SOURCE="$1"

if [ -z "$SOURCE" ]; then
  echo "Usage: mx marp-regen <path-to-markdown>"
  echo "Example: mx marp-regen mx-outputs/md/presentations/my-talk.md"
  exit 1
fi

if [ ! -f "$SOURCE" ]; then
  echo "Error: File not found: $SOURCE"
  exit 1
fi

# Check for marp: true in frontmatter
if ! grep -q "^marp: true" "$SOURCE"; then
  echo "Warning: File may not be a Marp presentation (no 'marp: true' found)"
fi

# Get directory of source file
DIR=$(dirname "$SOURCE")

# Run marp-cli
echo "Regenerating PPTX from: $SOURCE"
cd "$DIR" && npx @marp-team/marp-cli "$(basename "$SOURCE")" --pptx --allow-local-files

# Report output
BASENAME=$(basename "$SOURCE" .md)
echo ""
echo "Done: $DIR/$BASENAME.pptx"
```

---

# Marp Presentation Regenerator

Converts Marp markdown presentations to PPTX format.

## What This Does

Takes a Marp markdown file (with `marp: true` in frontmatter) and generates a PowerPoint presentation using marp-cli.

## Usage

```bash
mx marp-regen mx-outputs/md/presentations/london-cms-experts-2026-02-26.md
```

## Requirements

- Node.js (for npx)
- @marp-team/marp-cli (installed via npx on first run)

## Related

- Marp documentation: https://marp.app/
- Presentation source: `mx-outputs/md/presentations/`
