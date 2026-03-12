---
version: "1.0"
description: "NDR #2: All YAML frontmatter field names must use camelCase. Aligns with Schema.org and Dublin Core vocabulary conventions."
created: 2026-02-16
modified: 2026-03-02
author: Tom Cranstoun and Maxine

mx:
  status: accepted
  category: naming
  partOf: mx-the-gathering
  tags: [ndr, naming, camelCase, fields, metadata, schema-org, dublin-core, standards]
  audience: both

  ndr:
    number: 2
    title: "Field Naming Convention — camelCase Everywhere"
    status: accepted
    date: 2026-02-16
    rationale: "Web standards research confirms: vocabularies use camelCase (Schema.org, Dublin Core), markup uses hyphens (HTML data-*, CSS, HTTP headers). MX metadata is a vocabulary, not markup. camelCase aligns with the standards MX already references."
    evidence: "HTML data-* attributes auto-convert to camelCase in the DOM API. Schema.org uses lowerCamelCase for all properties. Dublin Core changed from Title-Case to camelCase in 2000 to align with XML/RDF. YAML has no opinion — the convention comes from the consuming ecosystem."
    enforcement: "mx-audit.js reports violations. mx-validator.js warns on new violations."

  affects:
    - field-dictionary
    - cog-unified-spec
    - mx-metadata-conventions
    - mx-attributes-registry

  buildsOn: [what-is-a-cog]
---

# NDR #2: camelCase Field Names

**Status:** Accepted
**Date:** 16 February 2026
**Decision maker:** Tom Cranstoun

---

## The Rule

All YAML frontmatter field names use **camelCase**.

| Convention | Example | Status |
|-----------|---------|--------|
| camelCase | `readingLevel`, `blogState`, `buildsOn` | Required |
| snake_case | `reading_level`, `blog_state` | Banned |
| kebab-case | `reading-level`, `blog-state` | Banned (multi-word) |
| Single word | `title`, `author`, `created` | Unchanged |

This applies to:

- Top-level YAML keys (`partOf`, `refersTo`, `readingLevel`)
- `mx:` sub-fields (`contentType`, `runbook`, `agentAction`)
- All document profiles (core, cog, book, blog, contact, folder)

**Exceptions:**

- `x-mx-` and `x-mx-p-` prefixed fields (vendor extension convention, kept as-is)
- The `mx:` key itself (namespace separator, not a multi-word field)

---

## Why camelCase

MX metadata is a **vocabulary** — a set of named properties that describe documents. It is not markup, not CSS, not HTTP headers.

Web vocabularies use camelCase:

| Standard | Convention | Authority |
|----------|-----------|-----------|
| Schema.org | `dateOfBirth`, `servesCuisine` | schema.org/docs/styleguide.html |
| Dublin Core | `dateAccepted`, `isReplacedBy` | DCMI Naming Policy |
| HTML dataset API | `dataset.dateOfBirth` | WHATWG Living Standard |

Web markup uses hyphens — but MX fields are consumed by code (AI agents, parsers, validators), not embedded in HTML attributes. The vocabulary convention applies.

**YAML has no opinion.** The YAML 1.2.2 spec says nothing about key naming. The convention comes from the consuming ecosystem. MX's ecosystem is Schema.org-adjacent.

---

## What Changes

### High-frequency renames needed

| Current (kebab) | New (camelCase) | Files |
|----------------|-----------------|-------|
| `builds-on` | `buildsOn` | ~61 |
| `reading-level` | `readingLevel` | ~48 |
| `content-state` | `contentState` | ~20 |
| `moved-from` | `movedFrom` | ~19 |
| `moved-date` | `movedDate` | ~19 |
| `content-filename` | `contentFilename` | ~19 |
| `session-start` | `sessionStart` | ~16 |
| `session-end` | `sessionEnd` | ~16 |
| `mx:content-policy` | `mx:contentPolicy` | ~12 |
| `publication-date` | `publicationDate` | ~11 |

### snake_case renames needed

| Current (snake) | New (camelCase) | Files |
|----------------|-----------------|-------|
| `related_files` | `refersTo` (already deprecated) | ~3 |
| `site_name` | `siteName` | ~2 |
| `estimated_presentation_time` | `estimatedPresentationTime` | ~4 |
| `mx.last_updated` | Remove (duplicate of `modified`) | ~3 |
| `mx.related_files` | Remove (duplicate of `refersTo`) | ~3 |
| `mx.update_instructions` | `mx.updateInstructions` | ~3 |

Full inventory: run `npm run audit:metadata` and see Section 9.

---

## Enforcement

| Tool | What it does |
|------|-------------|
| `scripts/mx-audit.js` | Reports all naming violations in Section 9 of the audit report |
| `scripts/mx-validator.js` | Warns on new snake_case or kebab-case fields during validation |

The audit reports. The validator prevents new violations. Existing violations are fixed in a separate remediation pass.

---

## Related

- Field dictionary: `mx-canon/ssot/fields.cog.md`
- Attributes registry: `mx-canon/MX-Registries/deliverables/mx-attributes-registry.md` (line 1108: "No Underscores")
- LEARNINGS.md (line 325-405: previous snake_case cleanup)
- ADR: Attribute Namespace Policy (2026-02-14)

---

*MX metadata is a vocabulary. Vocabularies use camelCase. The standard is Schema.org. The rule is simple.*
