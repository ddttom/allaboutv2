---
title: "BDR: Rename promptingInstruction to runbook"
name: bdr-001-runbook-rename
description: "Business decision to rename promptingInstruction to runbook — operations language replaces AI jargon"
version: "1.0"
created: 2026-02-15
author: Tom Cranstoun and Maxine
status: accepted
category: decision-record
tags: [metadata, terminology, business-language, runbook]
bdr:
  number: 1
  title: "Rename promptingInstruction to runbook"
  status: accepted
  date: 2026-02-15
  context: "The promptingInstruction field in YAML frontmatter uses AI jargon. Humans are nervous of AI terminology. Business audiences read 'prompting instruction' and think 'this is an AI thing, not for me.'"
  decision: "Rename the field to runbook. Rewrite all values to read like operations runbooks, not AI prompts."
  consequences: "204 files renamed across the hub. 13 files had jargon values rewritten. All future cogs use runbook. The cog spec must be updated to reflect the new field name."
runbook: "This is a business decision record. It documents the rationale for renaming promptingInstruction to runbook across the entire MX ecosystem."
---

# BDR 001: Rename promptingInstruction to runbook

## Context

Every cog in the MX ecosystem carries a `promptingInstruction` field in its YAML frontmatter. The field tells readers how to handle the document - what to do with it, when to read it, how to apply it.

The problem: "promptingInstruction" is AI jargon. It sounds like a technical directive for a language model. When a business leader, investor, or CMS practitioner sees it in a YAML block, they read "this is AI plumbing" and disengage.

"Runbook" is an established operations term. IT teams, DevOps engineers, and business operations people all know what a runbook is - a set of procedures for handling a situation. It carries authority without triggering AI anxiety.

## Decision

1. Rename the YAML key from `promptingInstruction` to `runbook` across all files in the hub
2. Rewrite all generic AI-jargon placeholder values to business operations language
3. Update Canon documents (spec-level change)
4. Update memory files and governance documents

## Implementation

- **Script 1:** `scripts/rename-prompting-to-runbook.sh` - mechanical key rename across 204 files
- **Script 2:** `scripts/rewrite-runbook-values.sh` - targeted rewrite of 13 files with AI jargon values

### Replacement patterns

| Old value | New value |
|-----------|-----------|
| "AI guidance here" | "Read and follow when processing this document" |
| "Context for AI agents parsing this content" | "Read and follow when processing this content" |
| "When to inject this file" | "Read this file when its topic is relevant to the current task" |
| "When to inject this context for AI agents" | "Read this context when its topic is relevant to the current task" |
| "Guidance for AI agents parsing this document" | "Read and follow when processing this document" |
| "AI-only or for both humans and AI" | "for machines only or for both humans and machines" |

## Consequences

- All 204 files in the hub now use `runbook` instead of `promptingInstruction`
- The cog unified spec needs updating to reflect the new field name
- The field dictionary (FDR) needs the entry updated
- Future sessions will use `runbook` by default (recorded in MEMORY.md)
- Business audiences see familiar operations language, not AI jargon
- The rename scripts remain in `scripts/` for reference and for applying to other repos

## Revenue impact

Indirect. Reducing AI anxiety in business-facing documents improves reception of MX with investors, partners, and CMS vendors. The field name appears in every cog - it is one of the most visible pieces of MX metadata.
