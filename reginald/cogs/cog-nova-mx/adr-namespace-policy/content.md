---
title: "ADR: Namespace Policy — Standard Fields and mx: Namespace"
description: "Architecture decision: namespace policy for The Gathering's open standard — standard fields (no prefix) and mx: namespace governance. Defines what belongs to the standard vs vendor extensions."
created: 2026-02-17
modified: 2026-02-17
author: The Gathering

mx:
  name: adr-namespace-policy
  status: active
  decision-status: accepted
  tags: [adr, namespace, standard, mx-namespace, governance, fields, vocabulary]
  partOf: mx-the-gathering
  category: standard

  context:
    trigger: "Repository handover to The Gathering — need clear namespace governance policy that separates standard from vendor extensions."
    date: 2026-02-17
    session: "Gathering handover audit"
---

# ADR: Namespace Policy — Standard Fields and mx: Namespace

**Status:** Accepted
**Date:** 17 February 2026
**Decision maker:** The Gathering

---

## Context

The Gathering governs the MX open standard. Cog-Nova-MX builds one implementation (MX OS). To prevent namespace pollution and ensure the standard remains vendor-neutral, The Gathering must clearly define which namespaces belong to the standard and which belong to implementations.

This ADR establishes namespace governance for The Gathering's standard vocabulary. It clarifies that the `mx:` namespace belongs to the open standard (like Dublin Core's `dc:` or Open Graph's `og:`), not to any vendor.

A companion ADR in the MX-Hub repository defines vendor extension namespaces (`x-mx-` and `x-mx-p-`).

## Decision

### Two-level standard namespace

| Level | Prefix | Owner | Visibility | Example |
|---|---|---|---|---|
| **Standard fields** | *(none)* | The Gathering | Universal — all implementations | `name`, `author`, `created`, `version`, `tags` |
| **Standard extensions** | `mx:` | The Gathering | Universal — all implementations | `mx: { contentType: ..., runbook: ... }` |

### The mx: namespace — Governance

**Critical principle:** The `mx:` namespace belongs to **The Gathering**, not to any vendor.

| Namespace | Owner | Status | Example |
|-----------|-------|--------|---------|
| *(no prefix)* | The Gathering | Open standard | `name`, `buildsOn`, `partOf` |
| `mx:` object (YAML) | The Gathering | Open standard | `mx: { contentType: ..., runbook: ... }` |
| `mx:*` prefix (HTML/JS/CSS) | The Gathering | Open standard | `<meta name="mx:content-type">` |

### The distinction: Standard vocabulary vs vendor extensions

Standard vocabularies use namespace prefixes to identify their governing body:

- `dc:` — Dublin Core (governed by DCMI, independent standards body)
- `og:` — Open Graph (governed by Open Graph protocol, community standard)
- `mx:` — Machine Experience (governed by The Gathering, independent standards body)

Vendor extensions use `x-` prefixes to identify implementation-specific additions:

- `x-webkit-` — Safari-specific CSS properties (vendor: Apple)
- `x-moz-` — Firefox-specific CSS properties (vendor: Mozilla)
- `x-mx-` — MX OS-specific fields (vendor: Cog-Nova-MX)

**The `mx:` namespace is NOT a vendor prefix.** It identifies The Gathering's standard vocabulary, just as `dc:` identifies Dublin Core terms and `og:` identifies Open Graph properties.

### Precedents

| Standard | Namespace | Governed by | Type |
|----------|-----------|-------------|------|
| Dublin Core | `dc:` | DCMI (independent standards body) | Metadata vocabulary |
| Open Graph | `og:` | Open Graph protocol (community) | Social media metadata |
| Schema.org | `schema:` | Schema.org (W3C Community Group) | Structured data vocabulary |
| **MX** | **`mx:`** | **The Gathering (independent standards body)** | **AI agent metadata** |

### Context-specific naming — YAML vs HTML/JS/CSS

The same MX field appears in different syntactic forms depending on context:

| Context | Syntax | Example | Convention source |
|---------|--------|---------|-------------------|
| **YAML frontmatter** | camelCase | `buildsOn`, `contentType` | Schema.org vocabulary |
| **HTML meta tags** | kebab-case with `mx:` | `<meta name="mx:content-type">` | HTML attribute convention |
| **JSDoc comments** | kebab-case with `@mx:` | `@mx:runtime node` | JSDoc at-rule convention |
| **CSS comments** | kebab-case with `@mx:` | `/* @mx:type utility */` | CSS at-rule convention |

**Why the difference?**

- YAML is a data format — uses the vocabulary's native naming (camelCase, following Schema.org)
- HTML/CSS are markup — use hyphenated attributes (following `data-*` pattern)
- The HTML dataset API demonstrates this: `data-user-name` (HTML) becomes `dataset.userName` (JavaScript)

**Complete alignment documentation:** See `mx-standards-alignment.cog.md` for web standards precedents and rationale.

### Rules

1. **Standard fields have no prefix.** The Gathering defines them. All implementations use them.
2. **The mx: namespace belongs to The Gathering.** It is part of the open standard. Implementations may add vendor-specific extensions using their own `x-{vendor}-` prefixes.
3. **Context determines syntax.** YAML uses camelCase. HTML/CSS use kebab-case with `mx:` prefix. Same field, different representation.
4. **The field dictionary is the authority.** Every standard field is registered in `fields.cog.md` with its definition, type, and profile.

## Alternatives considered

### Using mx: as a vendor prefix

**Rejected because:** The Gathering is an independent standards body, not a vendor. Using `mx:` as a vendor prefix would conflate the standard with one implementation. The pattern of independent standards bodies governing namespace prefixes (Dublin Core → `dc:`, Open Graph → `og:`) is established and well-understood.

### No namespace for standard extensions

**Rejected because:** Without a namespace, standard extensions would be indistinguishable from core fields. The `mx:` object/prefix clearly signals "this is part of the MX standard vocabulary" while allowing implementations to extend independently.

### Different namespaces for YAML vs HTML

**Rejected because:** Existing standards (Dublin Core, Open Graph) use the same namespace across contexts, adapting syntax to context. `dc:` in HTML becomes `dc:` object in YAML. MX follows this pattern.

## Consequences

1. **The Gathering controls the mx: namespace** — Implementation vendors cannot pollute the standard namespace
2. **Implementations use vendor prefixes** — Cog-Nova-MX uses `x-mx-` for extensions, others use `x-{vendor}-`
3. **Standard remains vendor-neutral** — Anyone can implement The Gathering's standard
4. **Clear governance model** — Dublin Core and Open Graph precedents guide decision-making
5. **Context-aware syntax** — Same vocabulary adapts to YAML, HTML, JS, CSS conventions

## Related documents

- Field dictionary: `mx-canon/ssot/fields.cog.md`
- Standards alignment: `specifications/mx-standards-alignment.cog.md`
- Cog unified spec: `specifications/cog-unified-spec.md`
- Vendor extensions policy: `https://github.com/cog-nova-mx/mx-hub/blob/main/mx-canon/mx-maxine-lives/registers/ADR/vendor-extensions-policy.cog.md` (Cog-Nova-MX implementation)

---

*The mx: namespace belongs to everyone. The standard is open. Implementations extend, they don't replace.*
