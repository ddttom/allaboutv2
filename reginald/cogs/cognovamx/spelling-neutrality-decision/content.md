---
version: "1.0"
description: "NDR #3: Prefer spelling-neutral field names. Where US/UK spelling differs, use an abbreviation or neutral synonym."
created: 2026-02-16
author: Tom Cranstoun and Maxine

mx:
  name: spelling-neutrality-decision
  status: accepted
  category: naming
  partOf: mx-the-gathering
  tags: [ndr, naming, spelling, neutral, abbreviation, standards, org, license]
  audience: both

  ndr:
    number: 3
    title: "Spelling Neutrality — Abbreviate to Avoid Regional Variants"
    status: accepted
    date: 2026-02-16
    rationale: "MX is a global standard. Field names should not force a US/UK spelling choice. Where a neutral abbreviation or synonym exists, use it. Where a single standard spelling is universal (license via SPDX), use that."
    evidence: "Schema.org recommends neutral synonyms (WorkersUnion, not Labour/Labor Union). W3C Organization Ontology uses org: prefix. SPDX license identifier is universal. Every web standard uses -ize but OED also prefers -ize — the MX solution is to avoid the word entirely."
    enforcement: "mx-audit.js reports violations. mx-rename-tracker.js tracks mappings."

  affects:
    - field-dictionary
    - cog-unified-spec
    - mx-metadata-conventions
    - mx-contacts

  buildsOn: [what-is-a-cog]
---

# NDR #3: Spelling Neutrality

**Status:** Accepted
**Date:** 16 February 2026
**Decision maker:** Tom Cranstoun

---

## The Rule

Where a field name contains a word with US/UK spelling variants, use a **neutral form** — an abbreviation or synonym that sidesteps the conflict entirely.

| Strategy | Example | Precedent |
|----------|---------|-----------|
| Abbreviate | `org` not organisation/organization | W3C Organization Ontology `org:` prefix |
| Follow universal standard | `license` not licence | SPDX, npm, GitHub, every package manager |
| Use neutral synonym | `imagesAudited` not imagesAnalysed/imagesAnalyzed | Schema.org neutral naming principle |

---

## Why Neutrality

MX is a global standard. The Gathering serves implementers worldwide. Forcing a spelling choice creates friction:

- American developers see `organisation` and think it's a typo
- British developers see `organization` and think it's American bias
- Neither sees `org` and objects

Schema.org faced this directly. Their solution, documented in their terminology FAQ: *"if a more neutral term/spelling is available, that helps."* They renamed `Labour Union` to `WorkersUnion` to avoid the US/UK split entirely.

MX adopts the same principle for field names.

---

## Specific Decisions

### `org` replaces `organisation` and `organization`

| Aspect | Detail |
|--------|--------|
| Old (British) | `organisation` |
| Old (American) | `organization` |
| New (neutral) | `org` |
| Precedent | W3C Organization Ontology uses `org:` as namespace prefix |
| Files affected | 11 files (contacts, profiles) |

### `license` is the universal form

| Aspect | Detail |
|--------|--------|
| Standard | `license` (SPDX identifier) |
| Rejected | `licence` (British) |
| Action | `mx.licence` → `mx.license` |
| Rationale | SPDX is universal. npm `license`, GitHub `license`, Creative Commons `license`. No ambiguity. |

### Neutral synonyms for -ise/-ize words

| Old Name | New Name | Why |
|----------|----------|-----|
| `images-analyzed` / `images-analysed` | `imagesAudited` | Audit tool output — "audited" is the correct verb |
| `pages-analyzed` / `pages-analysed` | `pagesAudited` | Same — these are audit results |

**General rule:** When a field name would contain -ise/-ize, -isation/-ization, or -yse/-yze, look for a synonym that avoids the suffix entirely. If no synonym exists, use the -ize form (Oxford English Dictionary preferred, Schema.org standard).

---

## What This Does NOT Change

- **Prose content** remains British English. The field dictionary says "British English is canonical for MX" — this applies to human-readable text, documentation, and books. Field names are code, not prose.
- **Single-word fields** with no US/UK variant are unchanged: `title`, `author`, `created`, `tags`, `version`.
- **`license`** was already American in the field dictionary (SPDX standard). This NDR formalises that choice and removes `mx.licence`.

---

## The Three-Step Test

When naming a new field:

1. **Is there a US/UK spelling difference?** Check -ise/-ize, -our/-or, -isation/-ization, -re/-er, -ogue/-og
2. **Is there a neutral abbreviation?** Check W3C, Schema.org, programming conventions (abbrcode)
3. **Is there a neutral synonym?** Check Schema.org's approach: different word, same meaning

If yes to #2 or #3, use the neutral form. If no neutral form exists, use the -ize form (OED + Schema.org precedent).

---

## Related

- NDR #2: camelCase Field Names (2026-02-16)
- Field dictionary: `mx-canon/ssot/fields.cog.md`
- Schema.org terminology FAQ: neutral naming principle
- W3C Organization Ontology: `org:` prefix precedent

---

*MX is a global standard. The field names should welcome everyone.*
