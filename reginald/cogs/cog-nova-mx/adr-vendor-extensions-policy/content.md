---
name: adr-vendor-extensions-policy
title: "ADR: Vendor Extensions Policy — x-mx- Public and Private Namespaces"
description: "Architecture decision: Cog-Nova-MX' vendor extension namespaces — x-mx- (public) and x-mx-p- (private). Defines implementation-specific fields that extend The Gathering's open standard."
created: 2026-02-17
modified: 2026-02-17
author: Tom Cranstoun and Maxine
status: active
decision-status: accepted
tags: [adr, namespace, vendor-extensions, x-mx, privacy, obfuscation, implementation]
partOf: mx-maxine-lives
category: mx-core

context:
  trigger: "Cog ID system design — documents created by cogs need an mx-ref attribute tracing back to the source cog. Tom identified that 'mx-ref' is not properly namespaced — it looks like a standard field when it's an MX OS implementation detail. Repository handover to The Gathering required splitting namespace governance into standard (The Gathering) vs vendor (Cog-Nova-MX)."
  date: 2026-02-14 (original), 2026-02-17 (split from dual-scope ADR)
  session: "Interview session on cog IDs + Gathering handover audit"
---

# ADR: Vendor Extensions Policy

**Status:** Accepted
**Date:** 14 February 2026 (original decision), 17 February 2026 (extracted to separate ADR)
**Decision maker:** Tom Cranstoun

---

## Context

MX OS extends The Gathering's open standard with implementation-specific attributes. Without a namespace convention, MX-specific fields look identical to standard fields in YAML frontmatter. Anyone reading a cog's frontmatter cannot tell whether a field belongs to the open standard or is an Cog-Nova-MX extension.

The immediate trigger was the cog ID system: documents created by cogs carry a hashed reference back to the source cog. This hash is deliberately obfuscated — only registry holders can decode it. Putting an unnamespaced field in frontmatter would conflate the implementation with the standard and leak information about the MX toolchain.

The Gathering owns the standard. MX OS is one implementation. Any implementation-specific extensions must be visually and semantically distinct from standard fields.

## Decision

### Two-level vendor extension namespace

| Level | Prefix | Owner | Visibility | Example |
|---|---|---|---|---|
| **MX-public** | `x-mx-` | Cog-Nova-MX | Visible in published cogs. Implementation extension. | `x-mx-audience-segment`, `x-mx-pipeline-stage` |
| **MX-private** | `x-mx-p-` | Cog-Nova-MX | Obfuscated. Only registry/token holders can decode. | `x-mx-p-ref` (cog ID hash) |

### Prefix convention

- `x-` follows HTTP extension header convention — signals "this is an extension, not the standard"
- `mx-` signals whose extension — Cog-Nova-MX
- `p-` signals private/obfuscated — the value is meaningless without the decode registry

### Rules

1. **MX-public extensions use `x-mx-`.** Visible in published cogs. Other implementations may ignore them or adopt them.
2. **MX-private extensions use `x-mx-p-`.** Values are obfuscated (hashed, encoded, or tokenised). Only holders of a decode registry can resolve the value. Registries exist at two levels: repo (company/team) and `$MX_HOME` (personal).
3. **The prefix is the policy.** No additional visibility markers needed. The sub-prefix tells you the visibility level.
4. **The field dictionary is the authority.** Every `x-mx-` and `x-mx-p-` field must be registered in the field dictionary with its level, definition, and profile.

### Context-specific naming — YAML vs HTML/JS/CSS

The same pattern applies to vendor extensions as standard fields:

- YAML: `x-mx-audience-segment` (kebab-case)
- HTML: `<meta name="x-mx:audience-segment">` (colon-separated in attribute name)

This follows the established pattern: markup contexts use kebab-case with colons, data contexts use kebab-case directly.

## Alternatives considered

### Nested `mx:` object

```yaml
mx:
  ref: hash-value
  visibility: private
```

**Rejected because:** Adds nesting depth. The existing `mx:` object already contains standard fields (`runbook`, `contentType`). Mixing standard MX metadata with obfuscated private values in the same namespace creates confusion. The `mx:` namespace belongs to The Gathering, not Cog-Nova-MX. The prefix approach keeps everything flat and scannable.

### `mxos-` prefix

```yaml
mxos-ref: hash-value
```

**Rejected because:** Doesn't distinguish public from private extensions. All MX OS fields would share one prefix. The two-level model requires two MX prefixes.

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
| **Repo** (default) | `mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml` | Anyone with repo access | Company/team cog IDs |
| **Personal** | `$MX_HOME/registries/cog-id-registry.yaml` | Machine-only | Personal or external cog IDs |

**Lookup chain:** `$MX_HOME` first (personal overrides), then repo registry.

**Auto-registration:** Generate auto-registers to the repo registry. Personal registration is opt-in.

**Same schema:** Both registries use identical YAML format. Same code reads both.

## First fields under this policy

| Field | Level | Type | Purpose |
|---|---|---|---|
| `x-mx-p-ref` | MX-private | string (MD5 hash) | Cog ID — traces a document back to the cog that created it |

## Related documents

- Field dictionary: `mx-canon/mx-maxine-lives/registers/FDR/field-dictionary.cog.md`
- Cog ID system: `mx-canon/MX-Cog-Registry/cogs/cog-id.cog.md`
- Repo registry: `mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml`
- The Gathering's namespace policy: `https://github.com/the-gathering/mx-standard/blob/main/architecture-decisions/adr-02-namespace-policy.cog.md` (standard namespaces)
- Original dual-scope ADR: `mx-canon/mx-maxine-lives/thinking/decisions/2026-02-14-attribute-namespace-policy.cog.md` (archived — split into standard + vendor ADRs)

---

*The prefix is the policy. Standard fields have no prefix. Extensions declare themselves.*
