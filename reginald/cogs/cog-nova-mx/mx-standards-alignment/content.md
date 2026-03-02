---
name: mx-standards-alignment
title: "MX Standards Alignment"
version: "1.0"
status: active
created: 2026-02-17
modified: 2026-02-17
author: The Gathering
license: proprietary
category: standard
partOf: mx-the-gathering
buildsOn: [cog-unified-spec, field-dictionary]
description: "How MX metadata conventions align with established web standards — Schema.org, Dublin Core, Open Graph. Explains governance, naming conventions, and context-specific rules."
tags: [standards, alignment, schema-org, dublin-core, open-graph, governance, naming-conventions]
audience: [humans, machines]

contentType: standards-alignment
runbook: "This document explains how MX follows existing web metadata standards. Read it when implementing validators, designing new fields, or explaining MX's design decisions. The governance section clarifies namespace ownership. The naming-conventions section explains context-dependent rules. The standards-precedents section provides citations."
---

# MX Standards Alignment

**Version:** 1.0
**Status:** Active
**Principle:** MX is the process of honouring all existing and future standards.

---

## What this document does

MX metadata didn't emerge from a vacuum. Every design decision — from field naming to namespace structure — follows precedents set by established web standards. This document maps MX conventions to their sources and explains why each choice was made.

**For implementers:** When you're building validators, parsers, or authoring tools, this document answers "why does MX do it this way?" Every convention has a reason, usually borrowed from a standard that solved the same problem decades ago.

**For standards bodies:** This document demonstrates how MX extends existing standards without conflicting with them. The `mx:` namespace operates like Dublin Core's `dc:` — a recognized vocabulary that machines understand.

---

## Core principle

> **MX uses existing standards, protocols, and conventions. Markdown, YAML, HTML meta tags, QR codes, git, OAuth, MIT licence. It only extends when no existing standard fits. Never invent when you can adopt.**

This principle governs every decision in this document. When Schema.org uses camelCase, MX uses camelCase. When HTML uses kebab-case, MX uses kebab-case. When W3C defines a namespace pattern, MX follows it.

---

## Standards precedents

### Schema.org — Vocabulary and naming

**What it is:** The dominant structured data vocabulary for the web. Created by Google, Microsoft, Yahoo, and Yandex in 2011. Now maintained by the Schema.org community.

**What MX adopts:**

1. **camelCase property names** — Schema.org uses `datePublished`, `servesCuisine`, `givenName`. MX follows this in YAML frontmatter fields like `publicationDate`, `readingTime`, `keyFields`.

2. **Lowercase first letter** — Schema.org uses `BlogPosting`, not `blogPosting`, for types but `datePublished` for properties. MX field names start lowercase: `buildsOn`, `partOf`, `refersTo`.

3. **Semantic precision** — Schema.org distinguishes `author` from `creator` from `contributor`. MX does the same: `author` (who wrote it), `partOf` (what collection), `buildsOn` (soft dependency).

**Citation:** [Schema.org Style Guide](https://schema.org/docs/styleguide.html)

**Why it matters:** Schema.org is the vocabulary layer of the modern web. Search engines, AI agents, and accessibility tools all consume Schema.org markup. MX aligns with this ecosystem.

---

### Dublin Core — Namespace governance

**What it is:** A metadata standard created in 1995, now maintained by the Dublin Core Metadata Initiative (DCMI). The `dc:` namespace is universally recognized.

**What MX adopts:**

1. **Independent standards body** — Dublin Core is governed by DCMI, not by any vendor. MX follows this model: The Gathering governs the `mx:` namespace, not Cog-Nova-MX.

2. **Colon-separated namespace in HTML** — Dublin Core uses `<meta name="dc:title">`. MX uses `<meta name="mx:name">`.

3. **Object structure in YAML** — Dublin Core metadata in YAML uses an object:

   ```yaml
   dc:
     title: "Example"
     creator: "Author"
   ```

   MX follows this pattern:

   ```yaml
   mx:
     contentType: field-dictionary
     runbook: "..."
   ```

4. **2000 naming shift** — Dublin Core changed from Title-Case to camelCase in 2000 to align with XML and RDF conventions. MX learned from this: camelCase from day one.

**Citation:** [DCMI Naming Policy](https://www.dublincore.org/specifications/dublin-core/dcmi-namespace/)

**Why it matters:** Dublin Core proved that an independent standards body can govern a namespace across decades. The `mx:` namespace follows the same model — open, neutral, implementer-friendly.

---

### Open Graph — Multi-context metadata

**What it is:** Metadata protocol created by Facebook (now Meta) in 2010. Used by every social media platform to render link previews.

**What MX adopts:**

1. **Colon-separated properties** — Open Graph uses `og:title`, `og:image`, `og:type`. MX uses `mx:name`, `mx:version`, `mx:type` in HTML contexts.

2. **Same vocabulary, different syntax** — Open Graph metadata appears as HTML meta tags:

   ```html
   <meta property="og:title" content="Example">
   ```

   But in YAML (like Jekyll frontmatter), it becomes an object:

   ```yaml
   og:
     title: "Example"
   ```

   MX follows this pattern: `mx:field` in HTML, `mx: { field: value }` in YAML.

**Citation:** [Open Graph Protocol](https://ogp.me/)

**Why it matters:** Open Graph demonstrated that the same vocabulary can adapt to different contexts. MX extends this: camelCase in YAML, kebab-case in HTML/JS/CSS, always the same meaning.

---

### HTML dataset API — Attribute-to-property transformation

**What it is:** The Web Hypertext Application Technology Working Group (WHATWG) defines how HTML `data-*` attributes map to JavaScript properties.

**What MX adopts:**

1. **Automatic kebab→camel conversion** — HTML uses `<div data-user-name="Tom">`. JavaScript reads `element.dataset.userName`. The browser automatically converts kebab-case to camelCase.

2. **Context determines syntax** — Markup uses hyphens. Code uses camelCase. Same data, different representation.

**MX applies this:**

- HTML: `<meta name="mx:content-type" content="field-dictionary">`
- YAML: `mx: { contentType: field-dictionary }`
- Both reference the same field. The context determines the syntax.

**Citation:** [WHATWG HTML Living Standard — dataset](https://html.spec.whatwg.org/multipage/dom.html#dom-dataset)

**Why it matters:** Web developers already understand that `data-user-name` and `dataset.userName` are the same field. MX leverages this existing mental model.

---

## Governance model

### Who owns what

| Namespace | Owner | Status | Use case |
|-----------|-------|--------|----------|
| *(no prefix)* | The Gathering | Open standard | Core vocabulary (`title`, `author`, `tags`, `buildsOn`) |
| `mx:` (object in YAML) | The Gathering | Open standard | Alignment fields (`contentType`, `runbook`) |
| `mx:*` (prefix in HTML/JS/CSS) | The Gathering | Open standard | Same fields as `mx:` object, different context |
| `x-mx-` | Cog-Nova-MX | Public vendor extension | Product-specific, non-standard |
| `x-mx-p-` | Cog-Nova-MX | Private vendor extension | Obfuscated, registry-decoded |

### Why `mx:` is not a vendor prefix

**Common misconception:** "`mx:` is a vendor prefix like `adobe:` or `contentful:`."

**Reality:** `mx:` belongs to The Gathering, the independent standards body. It is part of the open standard, not a product extension.

**Precedents:**

- `dc:` (Dublin Core) — governed by DCMI, not by any vendor
- `og:` (Open Graph) — governed by Open Graph protocol, not by Meta
- `schema:` (Schema.org) — governed by Schema.org community, not by Google

**The rule:** If an independent standards body governs it, it's not a vendor prefix. Vendor prefixes identify products (like `x-webkit-` for Safari-specific CSS). Standards prefixes identify vocabularies (like `dc:` for Dublin Core terms).

### What Cog-Nova-MX owns

Cog-Nova-MX owns the **implementation** (MX OS, MX Maxine, MX Reginald), not the **standard**. This follows the Linux model:

- POSIX = open standard (like The Gathering's cog spec)
- Linux = implementation (like MX OS)
- Anyone can build POSIX-compliant systems. Anyone can build Gathering-compliant systems.

When Cog-Nova-MX needs product-specific fields that don't belong in the standard, it uses `x-mx-` (public) or `x-mx-p-` (private). Examples:

- `x-mx-deployment-id` — Reginald-specific
- `x-mx-p-abc` — Private field, name obfuscated

---

## Naming conventions

### Context determines syntax

MX metadata appears in multiple contexts — YAML frontmatter, HTML meta tags, JSDoc comments, CSS comments. Each context has established conventions. MX honours them.

| Context | Convention | Example field | Rationale |
|---------|-----------|---------------|-----------|
| **YAML frontmatter** | camelCase | `buildsOn`, `readingTime` | Schema.org precedent |
| **HTML meta tags** | kebab-case with `mx:` | `<meta name="mx:content-type">` | HTML attribute convention |
| **JSDoc comments** | kebab-case with `@mx:` | `@mx:runtime claude` | JSDoc tag convention |
| **CSS comments** | kebab-case with `@mx:` | `/* @mx:type utility */` | CSS at-rule convention |

**The pattern:** Markup contexts (HTML/CSS) use kebab-case. Data contexts (YAML/JSON) use camelCase. Code follows the language convention.

### Why HTML uses kebab-case

HTML attributes have always used hyphens:

- `<meta http-equiv="...">`
- `<meta property="og:site-name">`
- `<div data-user-id="123">`

MX follows this convention:

- `<meta name="mx:content-type">` — not `<meta name="mx:contentType">`

When browsers parse `data-*` attributes, they convert to camelCase in JavaScript. The same mental model applies to `mx:*` — different syntax, same meaning.

### Why YAML uses camelCase

YAML is a data serialization format, not markup. When vocabularies serialize to YAML, they use the vocabulary's native naming convention.

**Schema.org in YAML:**

```yaml
"@type": BlogPosting
datePublished: "2026-02-17"
author:
  "@type": Person
  name: Tom Cranstoun
```

**MX in YAML:**

```yaml
name: mx-standards-alignment
buildsOn: [cog-unified-spec]
partOf: mx-maxine-lives
mx:
  contentType: standards-alignment
  runbook: "..."
```

Both use camelCase because the consuming systems (Schema.org processors, MX agents) expect camelCase properties.

---

## Enforcement levels

Different contexts require different enforcement levels.

| Context | Enforcement | Rationale |
|---------|------------|-----------|
| **YAML frontmatter** | Mandatory camelCase | Validators can check, tooling can convert, breaking changes are local |
| **HTML meta tags** | Mandatory kebab-case | Web convention, machine-parsed, affects interoperability |
| **JSDoc comments** | Flexible (kebab preferred) | Developer-facing, less established patterns, enforce via linting not validation |
| **CSS comments** | Flexible (kebab preferred) | Same as JSDoc — developer-facing, less critical |

**The principle:** Strict where machines parse, flexible where humans read.

---

## Spelling neutrality

MX is a global standard. Spelling conventions vary by region. MX avoids this entirely by using neutral terms.

**The rule:** When a neutral term exists, use it. When no neutral term exists, follow the universal standard.

**Examples:**

| Concept | US spelling | UK spelling | MX field name | Why |
|---------|------------|-------------|---------------|-----|
| Organization | organization | organisation | `org` | Neutral abbreviation. W3C uses `org:` prefix. |
| License | license | licence | `license` | SPDX standard spelling. Universal across npm, GitHub, all package managers. |
| Color | color | colour | `color` | CSS property. Web standard wins. |
| Optimize | optimize | optimise | `imagesOptimized` | No neutral term. US spelling is web standard (image optimization tools, documentation). |

**Rationale:** MX is consumed by machines in every country. Spelling-neutral names prevent regional debates and follow the Schema.org principle: when a neutral term is available, use it.

**Citation:** [Schema.org FAQ](https://schema.org/docs/faq.html) — "We use American English spelling for property names."

**MX difference:** Schema.org chose US spelling. MX chose neutral terms where possible, then fell back to web standards.

---

## Examples across contexts

### Example 1: Document metadata

**YAML frontmatter (.cog.md):**

```yaml
---
name: mx-standards-alignment
version: "1.0"
created: 2026-02-17
buildsOn: [cog-unified-spec, field-dictionary]
partOf: mx-maxine-lives
mx:
  contentType: standards-alignment
  runbook: "This document explains..."
---
```

**HTML meta tags (.cog.html):**

```html
<meta name="mx:name" content="mx-standards-alignment">
<meta name="mx:version" content="1.0">
<meta name="mx:content-type" content="standards-alignment">
<meta name="mx:part-of" content="mx-maxine-lives">
```

**Same fields, different syntax.** YAML uses camelCase, HTML uses kebab-case. Both are correct for their context.

---

### Example 2: JavaScript function

**JSDoc comment:**

```javascript
/**
 * Parse cog frontmatter
 * @mx:runtime node
 * @mx:category parser
 * @mx:version 2.1
 */
function parseCogFrontmatter(content) {
  // ...
}
```

**Why kebab-case?** JSDoc tags follow at-rule conventions. `@param`, `@returns`, `@deprecated`. The `@mx:` prefix signals MX-specific metadata.

---

### Example 3: CSS utility

**CSS comment:**

```css
/*
 * @mx:type utility
 * @mx:category layout
 * @mx:browser-support modern
 */
.mx-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Why kebab-case?** CSS at-rules use hyphens: `@media`, `@supports`, `@keyframes`. The `@mx:` prefix follows this pattern.

---

## Decision summary

| Question | Answer | Source |
|----------|--------|--------|
| **Why camelCase in YAML?** | Schema.org uses camelCase for properties. MX follows the dominant web vocabulary standard. | [Schema.org Style Guide](https://schema.org/docs/styleguide.html) |
| **Why kebab-case in HTML?** | HTML attributes use hyphens. MX follows web markup conventions. | HTML spec |
| **Why `mx:` prefix in HTML but object in YAML?** | Dublin Core and Open Graph do the same. Colon syntax is for attribute names. Object syntax is for data structures. | [DCMI](https://www.dublincore.org/), [Open Graph](https://ogp.me/) |
| **Why does The Gathering own `mx:`?** | Independent standards bodies govern vocabularies. Dublin Core → DCMI. Open Graph → OGP. MX → The Gathering. | DCMI Namespace Policy |
| **Why spelling-neutral fields?** | MX is global. `org` avoids US/UK debates. `license` follows SPDX universal standard. | Schema.org FAQ + SPDX |

---

## Related documents

| Document | Role |
|----------|------|
| [field-dictionary.cog.md](../registers/FDR/field-dictionary.cog.md) | Complete vocabulary of YAML fields |
| [cog-unified-spec.md](../MX-The-Gathering/deliverables/cog-unified-spec.md) | Structural specification for cog files |
| [namespace-policy ADR](../registers/NDR/2026-02-14-namespace-policy.cog.md) | Namespace architecture and vendor extensions |
| [camelCase naming NDR](../registers/NDR/2026-02-16-camelcase-naming.cog.md) | YAML field naming convention |

---

## For standards bodies

If you're evaluating MX for adoption, compatibility, or interoperability:

**MX does not conflict with existing standards.** It extends them. The `mx:` namespace operates alongside `og:`, `dc:`, `schema:`. A document can have Schema.org structured data, Open Graph preview metadata, Dublin Core archival metadata, and MX agent instructions — all coexisting without collision.

**MX is not proprietary.** The Gathering is an independent standards body. The cog specification is MIT-licensed. Anyone can implement Gathering-compliant tools. Cog-Nova-MX builds one implementation; others can build their own.

**MX follows web architecture.** Namespaces prevent collision. Colon-separated prefixes signal vocabulary boundaries. This pattern has worked for 25+ years (XML namespaces, RDF vocabularies, HTML meta tags). MX applies it consistently.

---

## Conclusion

MX standards alignment is not about inventing new patterns. It's about applying proven patterns from Schema.org, Dublin Core, Open Graph, and the WHATWG to a new problem space — making documents machine-readable for AI agents.

Every decision in this document has a precedent. Every convention has a rationale. Every namespace has a governance model.

When you implement MX, you're not learning a new system. You're applying the web standards you already know to a new use case: the companion web, where machines read documents the way humans do — with context, purpose, and understanding.

---

*MX is the process of honouring all existing and future standards. This document is the proof.*
