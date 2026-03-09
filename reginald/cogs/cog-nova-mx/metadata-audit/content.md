---
version: "1.0"
description: "Audit all YAML frontmatter — compare against the field dictionary, detect deprecated fields, namespace errors, missing required fields, and mx: object sprawl."
created: 2026-02-16
modified: 2026-02-16
author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published
  category: mx-tools
  partOf: mx-os
  refersTo: [field-dictionary, cog-unified-spec, mx-metadata-conventions]
  buildsOn: [what-is-a-cog]
  tags: [audit, metadata, standards, compliance, field-dictionary, namespace, deprecated-fields, frontmatter, yaml]
  audience: both
  readingLevel: intermediate

  execute:
    runtime: runbook
    command: npm run audit:metadata
    actions:
      - name: audit
        description: Run the full metadata audit across the hub
        usage: |
          Run `npm run audit:metadata` or `node scripts/mx-audit.js`.

          What it does:
          1. Parses the field dictionary (source of truth for all YAML fields)
          2. Walks every .md file in the hub (main repo + all submodules)
          3. Extracts YAML frontmatter from each file
          4. Compares every field against the dictionary
          5. Detects deprecated fields, unknown fields, missing required fields
          6. Inventories every sub-field inside the mx: YAML object
          7. Scans prose for namespace attribution errors (mx: belongs to The Gathering, not Cog-Nova-MX)
          8. Generates a 9-section markdown report

          Supports flags:
            --json     Output JSON instead of markdown report
            --summary  Console summary only, no report file
            --help     Usage information
        inputs: []
        outputs:
          - name: report
            type: file
            description: "Timestamped markdown report in mx-outputs/md/reports/validation/"
          - name: console-summary
            type: string
            description: "Key metrics printed to terminal"

  semantic: true
  convergence: true
  accessibility: true
  contentType: action-doc
  runbook: "mx exec metadata-audit"
---

# Metadata Audit

Every .md file in the MX ecosystem has YAML frontmatter. The field dictionary defines what those fields should be. This cog checks whether reality matches the standard.

---

## What It Finds

| Check | What it catches |
|-------|----------------|
| **Deprecated fields** | `date` instead of `created`, `keywords` instead of `tags`, `related_files` instead of `refersTo` |
| **Missing required fields** | Per document profile — core files need `title`, cogs need `name` and `partOf`, contacts need `role` |
| **Unknown fields** | Fields not registered in the field dictionary at all |
| **Namespace errors** | Documents that incorrectly say `mx:` belongs to Cog-Nova-MX (it belongs to The Gathering) |
| **mx: object sprawl** | Inventory of every sub-field inside `mx:`, categorised as alignment/operational/legacy/other |
| **Standards contradictions** | Known cases where authoritative documents disagree |
| **Parse errors** | Files with malformed YAML frontmatter |

---

## The Report

Nine sections, prioritised for remediation:

1. **Executive Summary** — total files, coverage, health score
2. **Field Usage Counts** — every field with count, status (canonical/deprecated/unknown), and profile
3. **Deprecated Field Usage** — files still using old field names, with canonical replacements
4. **Missing Required Fields** — by document profile
5. **mx: Object Inventory** — every sub-field with count and category
6. **Namespace Attribution Errors** — documents with incorrect mx: ownership claims
7. **Standards Contradictions** — where authoritative docs disagree
8. **Unknown Fields** — fields not in the dictionary
9. **Recommendations** — prioritised remediation list

Reports are saved to `mx-outputs/md/reports/validation/` with timestamps.

---

## Source of Truth

The **field dictionary** is the single authority:

```
mx-canon/ssot/fields.cog.md
```

It defines every canonical field, deprecated mappings, document profiles, and the namespace policy. The audit script parses this file programmatically — it does not hardcode field lists.

---

## The Namespace Rule

The `mx:` YAML namespace belongs to **The Gathering** (the open standard). It is not a vendor prefix.

| Level | Prefix | Owner |
|-------|--------|-------|
| Standard | *(none)* | The Gathering |
| MX standard extension | `mx:` | The Gathering |
| Cog-Nova-MX public | `x-mx-` | Cog-Nova-MX |
| Cog-Nova-MX private | `x-mx-p-` | Cog-Nova-MX |

The audit detects documents that get this wrong.

---

## Commands

```bash
npm run audit:metadata              # Full audit with markdown report
node scripts/mx-audit.js --summary  # Console summary only
node scripts/mx-audit.js --json     # JSON output
node scripts/mx-audit.js --help     # Usage
```

---

## Workflow

**Audit first, fix second.** Never bulk-rename fields without running the audit. The report tells you what to fix and in what order.

1. Run the audit
2. Review the report with Tom
3. Plan the remediation (phase 2)
4. Execute fixes
5. Re-run the audit to verify

---

## Output Reporting

**Output Reporting Principle:** When the audit completes, it MUST report the full absolute path of the generated report file. This enables traceability and makes it easy to locate the audit results.

Example:

```
✓ Metadata audit completed

Output:
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-outputs/md/reports/validation/metadata-audit-2026-02-17-143022.md

Summary:
  Files analysed: 1,247
  Deprecated fields: 23 instances across 18 files
  Unknown fields: 7 unique fields
  Health score: 87/100
```

Not just "report saved to validation-reports/" — the full absolute path from root.

---

*Stop guessing. Start reading. The field dictionary is the standard. The audit is the evidence.*
