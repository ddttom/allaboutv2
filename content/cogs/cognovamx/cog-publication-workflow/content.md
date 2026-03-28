---
version: "1.0"
description: "Cog publication workflow — author, validate, register, and publish a cog to the Reginald registry."
created: 2026-03-03
modified: 2026-03-03
author: Tom Cranstoun and Maxine

mx:
  maintainer: info@allabout.network
  license: proprietary
  status: published

  category: mx-tools
  partOf: mx-os
  refersTo: [registry-sync, what-is-a-cog]
  buildsOn: [what-is-a-cog]
  tags: [cog, publication, registry, reginald, workflow, validation]
  deliverable: "validated cog registered in REGINALD"

  audience: both

  execute:
    runtime: runbook
    command: mx cog-publication-workflow
    policy: |
      Every cog must pass validation before entering the registry. No exceptions.
      British English in all prose content. International standards in code and metadata.
      Field dictionary (mx-canon/ssot/fields.cog.md) is the single source of truth for
      all field names, types, and valid values. Do not invent fields.
      Markdown must pass markdownlint-cli2 with the repo's .markdownlint-cli2.jsonc config.
      Two-zone YAML: Zone 1 (document identity) at top level, Zone 2 (operational) under mx:.
      Action cogs use license: proprietary, not MIT.
      Never publish a cog with status: draft to the registry — set status: published first.
    actions:
      - name: publish
        description: "Full pipeline — author, validate, register, and publish a cog."
        usage: |
          ## PUBLISH — Full Cog Publication Workflow

          ### Phase 1: Author

          Confirm the cog file exists and has correct structure:

          1. Check the file has a `.cog.md` extension (or `.cog.html`, `.cog.js`, etc.)
          2. Verify two-zone YAML frontmatter is present:
             - Zone 1: `version`, `description`, `created`, `modified`, `author`
             - Zone 2 under `mx:`: `status`, `contentType`, `tags`, `audience` at minimum
          3. For action cogs, verify additional fields:
             - `mx.license: proprietary`
             - `mx.execute:` block with `runtime`, `policy`, and `actions`
             - `mx.contentType: action-doc`
             - `mx.runbook:` field
          4. Verify the markdown body has at minimum:
             - An H1 heading matching the cog's purpose
             - A "Why This Exists" or equivalent section
             - A closing principle or tagline (italic, at end)

          ### Phase 2: Validate

          Run the `validate` action (see below). All checks must pass before proceeding.

          If any check fails, stop and report the errors. Do not proceed to registration.

          ### Phase 3: Register

          Add the cog to the registry:

          1. Copy the cog file to `scripts/cogs/` if it is not already there

             Action cogs live in `scripts/cogs/` as their source location.
             Info cogs live throughout `mx-canon/`.
             The registry indexes all cog files regardless of location.

          2. Run registry sync:

             ```bash
             npm run cog:sync
             ```

             This regenerates:
             - `mx-reginald/index.json` — full registry
             - `mx-reginald/stats.json` — totals by type, category, status

          3. Verify the cog appears in the registry:

             ```bash
             npm run cog:find -- <cog-name>
             ```

          ### Phase 4: Confirm

          Report the publication result:

          ```
          ✓ Cog published successfully

          Cog:      <cog-name>.cog.md
          Version:  <version>
          Category: <category>
          Status:   published

          Registry: mx-reginald/index.json (updated)
          ```

        inputs:
          - name: cog-path
            type: file
            required: true
            description: "Path to the cog file to publish"
        outputs:
          - name: result
            type: string
            description: "Publication confirmation with cog details"
          - name: registry
            type: file
            description: "mx-reginald/index.json (updated)"

      - name: validate
        description: "Run all validation checks on a cog file without publishing."
        usage: |
          ## VALIDATE — Cog Quality Gate

          Run all checks. Report pass/fail for each. A cog must pass all checks
          before it can be published.

          ### Check 1: Markdown Linting

          ```bash
          npx markdownlint-cli2 <cog-path>
          ```

          Must produce zero errors. The repo config at `.markdownlint-cli2.jsonc` is
          auto-detected — do not pass a `-c` flag.

          Key rules enforced:
          - MD022: Blank lines around headings
          - MD031: Blank lines around fenced code blocks
          - MD032: Blank lines around lists
          - MD047: File ends with single newline

          ### Check 2: YAML Frontmatter

          Parse the YAML frontmatter and verify:

          1. Zone 1 fields present: `version`, `description`, `created`, `modified`, `author`
          2. `mx:` section exists
          3. Zone 2 fields present under `mx:`: `status`, `tags` at minimum
          4. `mx.status` is a valid value: `draft`, `published`, `active`, `deprecated`
          5. No unknown top-level fields outside Zone 1 + `mx:`
          6. Dates use ISO format (YYYY-MM-DD)

          ### Check 3: Field Dictionary Compliance

          Cross-reference all YAML fields against `mx-canon/ssot/fields.cog.md`:

          1. All field names must exist in the dictionary
          2. Field values must match declared types
          3. Required fields for the cog's profile must be present
          4. No deprecated fields used without acknowledged migration path

          ### Check 4: Content Structure

          Verify the markdown body:

          1. Has an H1 heading
          2. Has at least one H2 section
          3. No orphan links (references to files that don't exist)
          4. British English in prose (spot-check: "organise" not "organize",
             "colour" not "color", "recognised" not "recognized")

          ### Check 5: Action Cog Rules (if contentType is action-doc)

          1. `mx.license` is `proprietary`
          2. `mx.execute` block exists with `runtime` and `actions`
          3. `mx.runbook` field exists
          4. File lives in `scripts/cogs/` or `scripts/` directory
          5. At least one action defined with `name`, `description`, and `usage`

          ### Report Format

          ```
          Cog Validation: <cog-name>.cog.md

          ✓ Markdown linting        — 0 errors
          ✓ YAML frontmatter        — all zones valid
          ✓ Field dictionary        — all fields canonical
          ✓ Content structure        — H1, H2s, British English
          ✓ Action cog rules        — execute block valid

          Result: PASS (5/5 checks)
          ```

          Or on failure:

          ```
          Cog Validation: <cog-name>.cog.md

          ✓ Markdown linting        — 0 errors
          ✗ YAML frontmatter        — missing: modified
          ✓ Field dictionary        — all fields canonical
          ✓ Content structure        — H1, H2s, British English
          — Action cog rules        — skipped (not action-doc)

          Result: FAIL (3/4 checks passed, 1 failed)
          ```

        inputs:
          - name: cog-path
            type: file
            required: true
            description: "Path to the cog file to validate"
        outputs:
          - name: report
            type: string
            description: "Validation report with pass/fail per check"
          - name: passed
            type: boolean
            description: "Whether all checks passed"

      - name: status
        description: "Check the publication state of a cog in the registry."
        usage: |
          ## STATUS — Check Cog Publication State

          Query the registry to determine whether a cog is published.

          ### Step 1: Search the registry

          ```bash
          npm run cog:find -- <cog-name>
          ```

          ### Step 2: Report state

          If found in registry:

          ```
          Cog:      <cog-name>.cog.md
          Status:   published
          Version:  <version>
          Category: <category>
          Registry: mx-reginald/index.json
          ```

          If not found:

          ```
          Cog:      <cog-name>.cog.md
          Status:   not registered
          Action:   run `mx exec cog-publication-workflow publish` to publish
          ```

        inputs:
          - name: cog-name
            type: string
            required: true
            description: "Name of the cog to check (without .cog.md extension)"
        outputs:
          - name: state
            type: string
            description: "Publication state: published, draft, not-registered"

  contentType: action-doc
  runbook: "mx exec cog-publication-workflow"
---

# Cog Publication Workflow

The quality gate for the cog ecosystem. Every cog — whether authored by Tom, Maxine, or a future contributor — passes through the same pipeline before it enters the Reginald registry.

## Why This Exists

A registry is only as trustworthy as its contents. Without a publication workflow:

- Cogs with missing metadata enter the registry and break discovery tools
- Inconsistent frontmatter makes machine parsing unreliable
- Undocumented fields creep in, diverging from the field dictionary
- Validation happens informally or not at all

This cog formalises the process. Author. Validate. Register. Publish. Every time.

---

## The Pipeline

```
Author          Validate           Register          Publish
  │                │                  │                 │
  ▼                ▼                  ▼                 ▼
Write cog  →  Lint + check  →  npm run cog:sync  →  Confirmed
  file        frontmatter,       updates              in
              fields,            index.json            registry
              structure
```

Each phase is an explicit checkpoint. Failure at any phase stops the pipeline.

---

## What Gets Checked

| Check | Tool | What It Verifies |
|-------|------|-----------------|
| Markdown linting | `markdownlint-cli2` | Formatting rules (blank lines, headings, code blocks) |
| YAML frontmatter | Parser | Two-zone model, required fields, valid values |
| Field dictionary | Cross-reference | All fields exist in `fields.cog.md`, correct types |
| Content structure | Reader | H1 heading, H2 sections, British English |
| Action cog rules | Checker | License, execute block, runbook, file location |

---

## For AI Agents

1. Read the `execute.actions` block for full procedures
2. Start with `validate` to check a cog before publishing
3. Use `publish` for the full pipeline (validate is included)
4. Use `status` to check if a cog is already registered
5. Use existing `npm run cog:validate` and `npm run cog:sync` commands — do not reimplement

**Output Reporting Principle:** Report the full absolute path of every output file created or modified.

---

## Dependencies

| Tool | Required | Install |
|------|----------|---------|
| node | Yes | `brew install node` |
| npm | Yes | Comes with Node |
| markdownlint-cli2 | Yes | `npm install -g markdownlint-cli2` or use `npx` |

---

## Related

- `scripts/cogs/registry-sync.cog.md` — keeps the registry in sync after changes
- `mx-canon/ssot/fields.cog.md` — field dictionary (validation source of truth)
- `mx-canon/mx-the-gathering/specifications/cog-unified-spec.cog.md` — the cog format specification
- `mx-reginald/index.json` — the registry this workflow publishes to

---

*"Every cog earns its place. No shortcuts, no exceptions."*
