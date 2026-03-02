---
version: "1.0"
description: "Trim CHANGELOG.md to current week only, archiving older entries to dated files in the brain."
created: 2026-02-15
modified: 2026-02-15
author: Tom Cranstoun and Maxine

mx:
  name: changelog-trimmer
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published
  category: mx-tools
  partOf: mx-os
  refersTo: [conventions]
  buildsOn: [ubercog]
  tags: [changelog, trim, archive, maintenance, automation]
  audience: both
  readingLevel: practical
  purpose: "Keep CHANGELOG.md lean by archiving entries older than the current week."

  contentType: "action-doc"
  runbook: "mx exec changelog-trimmer"
  execute:
    runtime: runbook
    command: npm run changelog:trim
    actions:
      - name: trim
        description: Archive old entries and keep only the current week
        usage: |
          Run `npm run changelog:trim` or `bash scripts/changelog-trim.sh`.

          What it does:
          1. Reads CHANGELOG.md
          2. Identifies the Monday of the current week as the boundary
          3. Keeps: frontmatter, header, and all entries dated from Monday onwards
          4. Archives everything older to `mx-canon/mx-maxine-lives/management/changelog-archives/changelog-archive-YYYY-MM-DD.md`
          5. If an archive file for today already exists, appends to it
          6. Reports what was kept and what was archived

          Supports `--dry-run` to preview without writing.
        inputs: []
        outputs:
          - name: trimmed-changelog
            type: file
            description: "CHANGELOG.md with only current week entries"
          - name: archive-file
            type: file
            description: "Dated archive of older entries"

      - name: status
        description: Report CHANGELOG.md size and age of oldest entry
        usage: |
          Run `npm run changelog:trim -- --status`.
          Reports: line count, entry count, oldest entry date, whether trim is recommended.
        inputs: []
        outputs:
          - name: status-report
            type: object
            description: "Current CHANGELOG.md health"
---

# Changelog Trimmer

CHANGELOG.md grows with every session. Left unchecked, it becomes a context-eating monster — agents load it, parse it, and waste tokens on history that no longer matters for the current work.

This cog keeps it lean. Current week only. Everything else goes to the archive.

---

## The Rule

**CHANGELOG.md retains the current week's entries only.** Monday is the boundary. Anything from before Monday gets archived.

Archives live in the brain: `mx-canon/mx-maxine-lives/management/changelog-archives/`. One file per trim, dated. Nothing is deleted — it is moved.

---

## The Pipeline

| Stage | What happens |
|-------|-------------|
| **Read** | Parse CHANGELOG.md, identify entry dates from `(YYYY-MM-DD)` markers |
| **Split** | Current week entries stay. Older entries extracted. |
| **Archive** | Older entries written to dated archive file with frontmatter |
| **Rewrite** | CHANGELOG.md rewritten with only current week + a "Previous changes" link |
| **Report** | Summary: lines before, lines after, entries archived, archive file path |

---

## Step-Commit Integration

The step-commit workflow checks CHANGELOG.md size. If it exceeds 300 lines or contains entries older than the current week, it warns and offers to trim.

This is a warning, not a block. The human decides when to trim.

---

## Archive Format

Archive files use the same Keep a Changelog format:

```yaml
---
title: "Changelog Archive"
description: "Archived changelog entries from MX-Hub"
created: 2026-02-15
author: Tom Cranstoun and Maxine
source: CHANGELOG.md
archived-by: changelog-trimmer
---
```

The archive is a historical record. It is not loaded by agents. It exists for humans who want to look back.

---

## Commands

```bash
npm run changelog:trim              # Trim and archive
npm run changelog:trim -- --dry-run # Preview without writing
npm run changelog:trim -- --status  # Report current state
```

---

## Output Reporting

**Output Reporting Principle:** When the trim action completes, it MUST report the full absolute paths of both the updated CHANGELOG.md and the created archive file. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Changelog trimmed successfully

Outputs:
  /Users/tom/Documents/MX/MX-The-Books/repo/CHANGELOG.md (current week only, 127 lines)
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-canon/mx-maxine-lives/management/changelog-archives/changelog-archive-2026-02-17.md (archived entries, 245 lines)
```

Not just "archived to changelog-archives/" — the full absolute paths from root.

---

*Cut compute, not context.*
