---
title: "ADR: Attribute Namespace Policy — Public, Private, and Standard Fields [ARCHIVED]"
description: "ARCHIVED 2026-02-17. Three-tier namespace prefix policy — standard (no prefix), MX-public (x-mx-), MX-private (x-mx-p-). Split into separate ADRs."
created: 2026-02-14
modified: 2026-02-17
author: Tom Cranstoun and Maxine
version: "1.0"

mx:
  status: archived
  decision-status: superseded
  superseded-by:
    - mx-canon/mx-the-gathering/architecture-decisions/adr-02-namespace-policy.cog.md
    - mx-canon/mx-maxine-lives/registers/ADR/vendor-extensions-policy.cog.md
  tags: [adr, namespace, attributes, fields, policy, cog-id, x-mx, privacy, obfuscation, governance, naming-conventions, archived]
  partOf: mx-maxine-lives
  category: mx-core

  context:
    trigger: "Cog ID system design — documents created by cogs need an mx-ref attribute tracing back to the source cog. Tom identified that 'mx-ref' is not properly namespaced — it looks like a standard field when it's an MX OS implementation detail."
    date: 2026-02-14
    session: "Interview session on cog IDs, namespace policy, and public/private attribute levels"
    archive-reason: "Repository handover to The Gathering required clean organizational separation. This ADR covered both The Gathering's standard namespaces AND CogNovaMX' vendor extensions. Split into two separate ADRs on 2026-02-17 to clarify governance boundaries."
---

# ADR: Attribute Namespace Policy [ARCHIVED]

> **⚠️ ARCHIVED:** This ADR has been split into two separate ADRs for cleaner governance separation:
>
> - **The Gathering (standard):** [adr-02-namespace-policy.cog.md](../../MX-The-Gathering/architecture-decisions/adr-02-namespace-policy.cog.md)
> - **CogNovaMX (vendor):** [vendor-extensions-policy.cog.md](../../MX-Maxine-Lives/registers/ADR/vendor-extensions-policy.cog.md)
>
> This document is preserved for historical reference only.

**Status:** Accepted
**Date:** 14 February 2026
**Decision maker:** Tom Cranstoun

---

## Context

MX OS extends The Gathering's open standard with implementation-specific attributes. Without a namespace convention, MX-specific fields look identical to standard fields in YAML frontmatter. Anyone reading a cog's frontmatter cannot tell whether `mx-ref` belongs to the open standard or is an CogNovaMX extension.

The immediate trigger was the cog ID system: documents created by cogs carry a hashed reference (`x-mx-p-ref`) back to the source cog. This hash is deliberately obfuscated — only registry holders can decode it. Putting an unnamespaced `mx-ref` field in frontmatter conflates the implementation with the standard and leaks information about the MX toolchain.

The Gathering owns the standard. MX OS is one implementation. Any implementation-specific extensions must be visually and semantically distinct from standard fields.

## Decision

### Three-level attribute model

| Level | Prefix | Owner | Visibility | Example |
|---|---|---|---|---|
| **Standard** | *(none)* | The Gathering | Universal — all implementations | `name`, `author`, `created`, `version`, `tags` |
| **MX-public** | `x-mx-` | CogNovaMX | Visible in published cogs. Implementation extension. | `x-mx-audience-segment`, `x-mx-pipeline-stage` |
| **MX-private** | `x-mx-p-` | CogNovaMX | Obfuscated. Only registry/token holders can decode. | `x-mx-p-ref` (cog ID hash) |

### Prefix convention

- `x-` follows HTTP extension header convention — signals "this is an extension, not the standard"
- `mx-` signals whose extension — CogNovaMX
- `p-` signals private/obfuscated — the value is meaningless without the decode registry

### Rules

1. **Standard fields have no prefix.** The Gathering defines them. All implementations use them.
2. **MX-public extensions use `x-mx-`.** Visible in published cogs. Other implementations may ignore them or adopt them.
3. **MX-private extensions use `x-mx-p-`.** Values are obfuscated (hashed, encoded, or tokenised). Only holders of a decode registry can resolve the value. Registries exist at two levels: repo (company/team) and `$MX_HOME` (personal).
4. **The prefix is the policy.** No additional visibility markers needed. The sub-prefix tells you the visibility level.
5. **The field dictionary is the authority.** Every `x-mx-` and `x-mx-p-` field must be registered in the field dictionary with its level, definition, and profile.

### The `mx:` namespace — Governance clarification

**Important:** The `mx:` namespace belongs to **The Gathering**, not CogNovaMX. This is a common source of confusion.

| Namespace | Owner | Status | Example |
|-----------|-------|--------|---------|
| *(no prefix)* | The Gathering | Open standard | `name`, `buildsOn`, `partOf` |
| `mx:` object (YAML) | The Gathering | Open standard | `mx: { contentType: ..., runbook: ... }` |
| `mx:*` prefix (HTML/JS/CSS) | The Gathering | Open standard | `<meta name="mx:content-type">` |
| `x-mx-` | CogNovaMX | Vendor extension (public) | `x-mx-audience-segment` |
| `x-mx-p-` | CogNovaMX | Vendor extension (private) | `x-mx-p-ref` |

**The distinction:**

- Standard vocabularies use namespace prefixes (`dc:` for Dublin Core, `og:` for Open Graph, `mx:` for MX)
- Vendor extensions use `x-` prefixes (`x-webkit-` for Safari, `x-mx-` for CogNovaMX)

The `mx:` namespace is NOT a vendor prefix. It identifies The Gathering's standard vocabulary, just as `dc:` identifies Dublin Core terms and `og:` identifies Open Graph properties.

**Precedents:**

- Dublin Core → `dc:` namespace governed by DCMI (independent standards body)
- Open Graph → `og:` namespace governed by Open Graph protocol (community standard)
- MX → `mx:` namespace governed by The Gathering (independent standards body)

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

**The same pattern applies to vendor extensions:**

- YAML: `x-mx-audience-segment` (kebab-case)
- HTML: `<meta name="x-mx:audience-segment">` (colon-separated in attribute name)

**Complete alignment documentation:** See `mx-canon/mx-maxine-lives/deliverables/mx-standards-alignment.cog.md` for web standards precedents and rationale.

## Alternatives considered

### Nested `mx:` object

```yaml
mx:
  ref: hash-value
  visibility: private
```

**Rejected because:** Adds nesting depth. The existing `mx:` object already contains `runbook` and `contentType`. Mixing standard MX metadata with obfuscated private values in the same namespace creates confusion. The prefix approach keeps everything flat and scannable.

### `mxos-` prefix

```yaml
mxos-ref: hash-value
```

**Rejected because:** Doesn't distinguish public from private extensions. All MX OS fields would share one prefix. The three-level model requires two MX prefixes.

### `mx.` dotted namespace

```yaml
"mx.ref": hash-value
```

**Rejected because:** YAML keys with dots require quoting. Breaks readability and tooling compatibility. Dots in YAML keys are a common source of parsing issues.

### Convention-only (no runtime markers)

**Rejected because:** The visibility distinction needs to be machine-readable. AI agents must know which fields are obfuscated. A documentation-only convention doesn't serve the runtime.

## Consequences

1. **Cog ID system** uses `x-mx-p-ref` — properly namespaced as MX-private
2. **Field dictionary** updated with namespace policy section and new field entries
3. **Future MX extensions** follow the same convention — no ad-hoc field names
4. **The Gathering standard** is protected — no MX-specific pollution in the open standard namespace
5. **Other implementations** can adopt their own `x-{vendor}-` namespace following the same pattern
6. **Two-level decode registry** — repo-level for company/team, `$MX_HOME` for personal/external

## Two-level registry chain

The `x-mx-p-ref` decode registry exists at two levels:

| Level | Location | Access | Purpose |
|---|---|---|---|
| **Repo** (default) | `mx-reginald/registries/cog-id-registry.yaml` | Anyone with repo access | Company/team cog IDs |
| **Personal** | `$MX_HOME/registries/cog-id-registry.yaml` | Machine-only | Personal or external cog IDs |

**Lookup chain:** `$MX_HOME` first (personal overrides), then repo registry.

**Auto-registration:** Generate auto-registers to the repo registry. Personal registration is opt-in.

**Same schema:** Both registries use identical YAML format. Same code reads both.

## First fields under this policy

| Field | Level | Type | Purpose |
|---|---|---|---|
| `x-mx-p-ref` | MX-private | string (MD5 hash) | Cog ID — traces a document back to the cog that created it |

## Related documents

- Field dictionary: `mx-canon/ssot/fields.cog.md`
- Cog unified spec: `mx-canon/mx-the-gathering/specifications/cog-unified-spec.cog.md`
- Cog ID system: `scripts/cogs/cog-id.cog.md`
- Repo registry: `mx-reginald/registries/cog-id-registry.yaml`

---

*The prefix is the policy. Standard fields have no prefix. Extensions declare themselves.*
