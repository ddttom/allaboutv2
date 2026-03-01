---
title: "BDR: Rename mx.createOutputPrompt to mx.deliverable"
name: bdr-002-deliverable-rename
description: "Business decision to rename mx.createOutputPrompt to mx.deliverable — business language replaces AI jargon"
version: "1.0"
created: 2026-02-15
author: Tom Cranstoun and Maxine
status: accepted
category: decision-record
confidentiality: public
tags: [metadata, terminology, business-language, deliverable]
bdr:
  number: 2
  title: "Rename mx.createOutputPrompt to mx.deliverable"
  status: accepted
  date: 2026-02-15
  context: "The mx.createOutputPrompt field uses AI jargon ('prompt'). Humans are nervous of AI terminology. Companion rename to BDR-001 (promptingInstruction to runbook)."
  decision: "Rename the field to mx.deliverable. 'Deliverable' is a business term everyone understands — it's what gets produced."
  consequences: "33 occurrences renamed across 11 files. All future cogs use mx.deliverable. The cog spec must be updated to reflect the new field name."
mx:
  runbook: "This is a business decision record. It documents the rationale for renaming mx.createOutputPrompt to mx.deliverable across the MX ecosystem."
---

# BDR 002: Rename mx.createOutputPrompt to mx.deliverable

## Context

The companion field to `mx.runbook` was called `mx.createOutputPrompt`. It contains generation instructions — what to produce, where to put it, what quality criteria to apply.

The problem is the same as BDR-001: "createOutputPrompt" is AI jargon. "Output prompt" sounds like a directive for a language model. Business audiences see it and disengage.

"Deliverable" is an established business term. Project managers, consultants, and operations teams all know what a deliverable is — a defined output with acceptance criteria. It carries authority without triggering AI anxiety.

## Decision

1. Rename the YAML key from `createOutputPrompt` to `deliverable` across all active files
2. Update standards documentation (attributes registry, bootloader config, reference docs)
3. Update validator code (`mx-validator.js`)
4. Update blog posts and book content
5. Update memory files and governance documents
6. Preserve historical references in LEARNINGS.md and CHANGELOG.md

## Implementation

Manual targeted edits across 11 files (33 occurrences). Smaller scope than BDR-001 — no script needed.

### Files changed

| Category | Files | Occurrences |
|----------|-------|-------------|
| Standards/registry | 2 (Canon + datalake mirror) | 8 |
| Bootloader config | 1 (base.md) | 4 |
| Reference docs | 2 (PRINCIPLES.md + mx-principles-for-repos.md) | 6 |
| Validator code | 1 (mx-validator.js) | 2 |
| Blog posts | 5 (md + html versions) | 5 |
| Book appendix | 1 (appendix-l) | 3 |
| Agent guide | 1 (yaml-frontmatter-template.md) | 1 |

### Prose changes

Also updated remaining "prompting instructions" prose to "runbook" language in blog posts and documentation.

## Consequences

- All active files now use `mx.deliverable` instead of `mx.createOutputPrompt`
- The cog unified spec needs updating to reflect the new field name (reminder filed)
- Future sessions will use `mx.deliverable` by default (recorded in MEMORY.md)
- Business audiences see familiar project language, not AI jargon
- The two core MX metadata fields are now both business terms: `runbook` + `deliverable`

## Revenue impact

Indirect. Same reasoning as BDR-001: reducing AI anxiety in business-facing documents improves reception with investors, partners, and CMS vendors.
