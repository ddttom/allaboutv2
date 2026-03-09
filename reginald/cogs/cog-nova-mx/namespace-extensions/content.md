---
title: "Namespace Extensions — How to Extend MX Metadata"
description: "MX namespace policy: standard fields (no prefix), mx: namespace (The Gathering), vendor extensions (x-mx-, x-mx-p-). The prefix is the policy."
version: "1.0"
created: 2026-03-01
modified: 2026-03-01
author: Tom Cranstoun and Maxine

mx:
  status: active
  category: standard
  partOf: mx-the-gathering
  buildsOn: [fields, adr-02-namespace-policy, vendor-extensions-policy]
  tags: [namespace, extensions, vendor, x-mx, metadata, policy, standard]
  audience: [humans, machines]

  contentType: reference
  runbook: "This cog explains how MX metadata namespaces work. Use it to understand which fields belong to the standard, which are vendor extensions, and how to create new extensions. The prefix on a field name tells you everything: no prefix = standard, mx: = standard extension, x-mx- = vendor public, x-mx-p- = vendor private."
---

# Namespace Extensions

## The Problem

A field called `pipeline-stage` in YAML frontmatter — who defined it? Is it part of the open standard? Is it something one vendor added? Can other implementations rely on it?

Without a namespace policy, every field looks the same. Implementations pollute the standard. The standard becomes whatever one vendor ships. Other implementations can't tell what's required and what's optional vendor sugar.

MX solves this with prefixes. The prefix on a field name is the policy.

---

## Three Levels

| Level | Prefix | Owner | Who can read it |
|-------|--------|-------|-----------------|
| **Standard** | *(none)* | The Gathering | Everyone. All implementations honour these. |
| **Standard extension** | `mx:` | The Gathering | Everyone. Part of the open standard vocabulary. |
| **Vendor public** | `x-{vendor}-` | The vendor | Anyone reading the cog. Visible but non-standard. |
| **Vendor private** | `x-{vendor}-p-` | The vendor | Only registry holders. Values are obfuscated. |

Cog-Nova-MX uses `x-mx-` (public) and `x-mx-p-` (private) as its vendor prefixes.

---

## Standard Fields (no prefix)

Fields with no prefix belong to The Gathering's open standard. Every MX implementation must honour them.

```yaml
title: "My Document"
author: Tom Cranstoun
created: 2026-03-01
version: "1.0"
tags: [example, documentation]
```

These are defined in the [field dictionary](../ssot/fields.cog.md). The Gathering governs them. No vendor can redefine them.

---

## The mx: Namespace (standard extension)

The `mx:` namespace also belongs to The Gathering — it is NOT a vendor prefix. It carries standard metadata that extends the core fields.

```yaml
mx:
  contentType: field-dictionary
  runbook: "Parse the fields array"
```

Think of it like Dublin Core's `dc:` or Open Graph's `og:` — a namespace prefix that identifies a standards body, not a vendor.

| Standard | Namespace | Governed by |
|----------|-----------|-------------|
| Dublin Core | `dc:` | DCMI |
| Open Graph | `og:` | Open Graph protocol |
| Schema.org | `schema:` | W3C Community Group |
| **MX** | **`mx:`** | **The Gathering** |

---

## Vendor Extensions (x-mx-)

When Cog-Nova-MX needs fields that are not part of the open standard, they use the `x-mx-` prefix. The `x-` signals "extension, not the standard." The `mx-` signals whose extension.

```yaml
# Standard fields (The Gathering)
title: "My Mount"
status: active

# Vendor extensions (Cog-Nova-MX)
x-mx-mount-type: personal
x-mx-mount-swappable: true
x-mx-pipeline-stage: report-generation
```

Other implementations may ignore `x-mx-` fields. They are visible, documented, but not required by the standard.

**Current `x-mx-` fields:**

| Field | Purpose |
|-------|---------|
| `x-mx-mount-type` | Submodule mount type: personal, team, product, standard |
| `x-mx-mount-swappable` | Whether the mount can be swapped for a different repo |
| `x-mx-mount-upstream` | Upstream source for standard-type mounts |

---

## Vendor Private Extensions (x-mx-p-)

When Cog-Nova-MX needs fields whose values are obfuscated — only decodable by registry holders — they use `x-mx-p-`.

```yaml
x-mx-p-ref: 7f3a8b2c1d4e5f6090812345abcdef67
```

External readers see a prefix and a hash. That's the point. The decode registry lives in `$MX_HOME/registries/`. Field names and their meanings are not documented publicly.

---

## The Prefix Convention

The prefix follows HTTP extension header convention:

- `x-` — this is an extension, not the standard
- `mx-` — this extension belongs to Cog-Nova-MX
- `p-` — this is private/obfuscated

Other vendors follow the same pattern with their own identifier:

- `x-acme-` — Acme Corp's public extensions
- `x-acme-p-` — Acme Corp's private extensions

---

## Context-Specific Naming

The same field appears differently depending on context:

| Context | Syntax | Example |
|---------|--------|---------|
| **YAML** | kebab-case | `x-mx-mount-type: personal` |
| **HTML** | kebab-case with colon | `<meta name="x-mx:mount-type" content="personal">` |

Standard fields follow a different pattern:

| Context | Syntax | Example |
|---------|--------|---------|
| **YAML** | camelCase | `contentType: reference` |
| **HTML** | kebab-case with `mx:` | `<meta name="mx:content-type" content="reference">` |

Why the difference? Standard fields are vocabulary (like Schema.org — camelCase). Extension fields already contain hyphens in their prefix, so kebab-case is natural throughout.

---

## How to Create a New Extension

1. **Check the field dictionary** — does a standard field already cover this?
2. **Choose the level** — public (`x-mx-`) or private (`x-mx-p-`)?
3. **Name it** — kebab-case after the prefix: `x-mx-your-field-name`
4. **Register it** — add to the field dictionary under the `x-mx-public` profile
5. **Document it** — what it means, what values it accepts, where it's used

---

## Related Documents

- [Field dictionary](../ssot/fields.cog.md) — every field defined
- [ADR: Namespace policy](architecture-decisions/adr-02-namespace-policy.cog.md) — standard namespace governance
- [ADR: Vendor extensions](../../mx-maxine-lives/registers/ADR/vendor-extensions-policy.cog.md) — Cog-Nova-MX vendor prefixes
- [Standards alignment](specifications/mx-standards-alignment.cog.md) — web standards precedents

---

*The prefix is the policy. No prefix means standard. `x-mx-` means vendor extension. The field name tells you everything you need to know.*
