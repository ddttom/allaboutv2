---
title: "MX Cog Unified Specification"
version: "2.1-draft"
created: 2026-02-08
modified: 2026-03-04
author: Tom Cranstoun
description: "The unified specification for MX cogs — one document type, many block types. Capability, trust, and governance in one format."

mx:
  status: draft
  maintainer: tom.cranstoun@gmail.com
  category: specification
  tags: [cog, specification, the-gathering, open-standard, metadata]
  governed-by: The Gathering
  license: MIT
  supersedes:
    - "cog-spec.md v0.3 (engine capability spec)"
    - "cog-specification.md (Reginald trust/governance spec)"
---

# MX Cog Unified Specification v2.1-draft

**A cog is an intelligent document. One file, many blocks.**

Machine-readable metadata. Human-readable documentation. Self-describing modules. Verified trust.

This specification is governed by **The Gathering** — an independent, open standards body focused on metadata that helps machines understand documents. The specification is MIT licensed. Anyone can implement it.

---

## 1. Introduction

The **cog** is the atomic unit of MX. Every piece of structured knowledge in the MX ecosystem — whether it validates pricing data, describes an API, or certifies a product specification — is a cog.

**A cog is any file with structured metadata.** The content defines a cog, not the file extension. A `.md` file with YAML frontmatter is a cog. A `.txt` file with YAML frontmatter is a cog. The canonical format is `.cog.md` — YAML frontmatter for machines, markdown documentation for humans — but the `.cog.` infix is a convention for humans, not a requirement for machines. Machines read the metadata and just know.

Any file type can carry cog metadata in its native format. A `.cog.html` file carries metadata in HTML meta tags. A `.cog.js` file carries metadata in JSDoc comments. A `.cog.css` file carries metadata in CSS comments. `README.cog.md` is a `README.md` in cog format. Cogs are intelligent documents — not a different kind of thing from the documents they enhance.

A cog contains **blocks**. Each block has a type that says what its content is. A prose block carries human-readable text. An action block carries executable instructions. A code block carries source code. An essence block carries binary content. Blocks are defined in YAML frontmatter; the markdown body is the prose block.

There is one cog type. The blocks determine what it does. A cog with an action block can execute. A cog with only prose and info blocks documents. A cog with an essence block wraps binary content. The distinction is in the blocks, not in separate document categories.

For business audiences, cogs are called **docs** — MX Docs. For developers, the technical name **cog** persists. The file extension `.cog.md` stays. The bridge: "We call them cogs internally." Once. Then back to doc.

---

## 2. One Cog, Many Blocks

There is one document type: the cog. What a cog does depends on the blocks it contains.

An **info-doc** is a cog without an action block. It documents, describes, certifies. An **action-doc** is a cog with an action block. It validates, generates, extracts, analyses. The distinction is in the blocks, not in the file format.

| | Info-Doc | Action-Doc |
| --- | --- | --- |
| **What it is** | A cog without an action block | A cog with an action block |
| **What it does** | Documents, describes, certifies | Validates, generates, extracts, analyses |
| **Has action block** | No | Yes |
| **File extension** | `.cog.md` | `.cog.md` |
| **Example** | `cog-system.cog.md` (describes the COG system) | `pricing.cog.md` (validates pricing data) |
| **Business analogy** | Single source of truth | Standard Operating Procedure that executes itself |

**How to tell them apart:** Read the YAML frontmatter. If there is an `execute` object with `actions`, it is an action-doc. If there is no action block, it is an info-doc. Both are cogs. Both use the same format. The blocks inside determine what the cog can do.

**Why not multiple doc types?** An earlier design considered separate types — pointer-docs, reference-docs, code-docs, html-docs — each a distinct document category. This was rejected. Multiplying doc types creates a taxonomy that grows with every new content kind. Instead, there is one cog type. The blocks determine what the cog contains and what it can do. A cog with a code block is not a "code-doc" — it is a cog that happens to contain code. The sub-type is in the blocks, not in the file format.

---

## 3. Block Architecture

A cog is composed of blocks. Each block has a type that declares what its content is. Blocks live in the YAML frontmatter as entries in the `blocks` array. The markdown body below the frontmatter is the prose block — it does not need to be declared in YAML.

### Block Types

| Block Type | Purpose | Required |
| --- | --- | --- |
| `prose` | Human-readable narrative. The markdown body. | Implicit — the markdown body IS the prose block |
| `essence` | Binary content (images, PDFs, audio). Encoded as base64 or a pointer. | No |
| `action` | Executable instructions. Defines what the cog can do. | No (presence makes it an action-doc) |
| `code` | Source code. Embedded program text in any language. | No |
| `html` | HTML content. May reference WebMCP standards for embedded routines. | No |
| `provenance` | Origin and lineage. Where this content came from, how it was derived. | No |
| `version` | Version history and changelog within the cog. | No |
| `definition` | Standards conformance. Declares which standards the cog's blocks follow. | Recommended |
| `security` | Trust and access policy. Signing requirements, execution permissions. | No |
| `sop` | Standard Operating Procedures. Merged at read-time from the uber doc. | No |

**Field Dictionary:** The complete machine-parseable block type definitions — including field names, types, and requirements for each block — live in `fields.cog.md` under the `blockTypes` YAML array. This section provides the architectural narrative.

### The Prose Block

The markdown body of every cog is its prose block. It is never declared in YAML — it is implicit. The prose block is for humans. It reads like a well-written blog post: informative, editorial, authoritative. The YAML is for machines. The markdown is for humans.

Any MX-aware file can declare `mx.inherits` to extend another file. The inheriting file adds structured metadata on top of the target's content. The target can be any file type — `.md`, `.cog.md`, `.html`, `.json`, `.yaml`, or anything else. Paths can be relative or absolute. The older `prose-source` field is deprecated in favour of `inherits`.

### The Essence Block

Binary content — images, PDFs, audio, video, compiled assets — cannot live as markdown. The essence block wraps binary content inside a cog.

```yaml
blocks:
  - essence:
      type: image/png
      encoding: base64
      size: 1847
      content: "iVBORw0KGgoAAAANSUhEUg..."
```

**Size rule:** If the binary content is 2kb or smaller, it is embedded as base64 in the `content` field. If it exceeds 2kb, the essence block becomes a pointer:

```yaml
blocks:
  - essence:
      type: image/png
      encoding: pointer
      size: 245760
      location: "assets/product-photo.png"
      checksum: "sha256:a7f3b2e1..."
```

When the essence block is a pointer, there is no binary content in the cog body. The `location` field points to the canonical location of the binary. The `checksum` field allows verification.

### The Definition Block

The definition block declares which standards the cog conforms to. It is the cog's backward-compatibility statement and its contract with readers.

```yaml
blocks:
  - definition:
      standards:
        - name: "The Gathering"
          version: "2.0-draft"
          scope: "cog metadata format, block types, reader behaviour"
        - name: "Schema.org"
          version: "26.0"
          scope: "product metadata in info blocks"
```

**Hierarchical conformance.** The definition block operates at two levels:

1. **Document-level** — a `definition` entry in the top-level `blocks` array applies to the entire cog. All blocks inherit these standards by default.
2. **Per-block override** — any individual block can include its own `standards` array that overrides or extends the document-level definition for that block only.

```yaml
blocks:
  - definition:
      standards:
        - name: "The Gathering"
          version: "2.0-draft"
          scope: "cog metadata format"
  - html:
      standards:
        - name: "WebMCP"
          version: "0.1-draft"
          scope: "embedded routines"
      content: "<mx-widget>...</mx-widget>"
```

In this example, the entire cog follows The Gathering standard. The HTML block additionally conforms to the WebMCP standard.

**For non-MX readers.** When a reader does not implement MX, the definition block tells it which standards are in use. An LLM encountering a cog for the first time reads the definition block to understand what conventions to expect. This is the backward-compatibility mechanism — the cog introduces itself.

### The Action Block

The action block is what makes a cog executable. It is documented in detail in Section 7 (Action-Doc Extensions). The presence of an action block (the `execute` object) is what distinguishes an action-doc from an info-doc.

### The Code Block

Source code embedded in the cog. Unlike fenced code blocks in the prose (which are for display), a code block in the YAML is machine-addressable — a reader can extract and execute it.

```yaml
blocks:
  - code:
      language: javascript
      purpose: "Validation logic for pricing fields"
      content: |
        function validatePrice(price) {
          return price > 0 && price < 1000000;
        }
```

### The HTML Block

HTML content that may reference emerging standards like WebMCP for embedded routines. An HTML block can carry interactive widgets, forms, or visualisations.

```yaml
blocks:
  - html:
      standards:
        - name: "WebMCP"
          version: "0.1-draft"
          scope: "embedded routines, inter-block access"
      content: "<mx-pricing-widget data-source='pricing.cog.md'></mx-pricing-widget>"
```

**WebMCP** is an emerging standard for embedding machine-callable routines in HTML. The specification is not yet finalised. HTML blocks that declare WebMCP conformance signal to readers that the content contains executable routines following that standard.

**Inter-block access.** An HTML block using WebMCP can access all other blocks in the cog — reading essence content, querying code blocks, rendering provenance, displaying version history. The HTML block becomes the interactive surface through which all other blocks are presented. This access is governed by the cog's security block and the reader's SOP policy. If policies allow it, the HTML block is a window into the entire cog. If policies restrict it, the HTML block renders in isolation.

### The Security Block

Declares the trust and execution policy for the cog. Readers consult the security block to determine whether they are willing to execute action blocks or render HTML blocks.

```yaml
blocks:
  - security:
      signing: required
      execution: sandboxed
      trust-level: 3
      policy: "Refuse to execute unsigned action blocks. HTML blocks render in sandbox only."
```

Readers may refuse to execute unsigned cogs. This is reader agency — the security block is the cog's statement of what it expects; the reader decides whether to comply.

### The SOP Block

Standard Operating Procedures injected at read-time by MX implementations. The SOP block is defined in the **uber doc** — the master document every MX implementation must maintain.

**The SOP block is virtual.** It does not exist in the cog file on disk. When an MX implementation reads a cog, it merges the relevant SOP block from its uber doc into the cog at read-time. The file stays clean. The procedures are always current.

```yaml
# In the uber doc (UBER.cog.md):
sop:
  - scope: "all-cogs"
    instructions: |
      Before executing any action block, verify the cog's signature.
      Log all executions to the audit trail.
      Never modify a cog during execution.
  - scope: "html-blocks"
    instructions: |
      Render HTML blocks in a sandboxed iframe.
      Do not execute scripts from unsigned cogs.
```

The uber doc is the implementation's master set of SOPs. Every MX implementation must have one. It contains the procedures that govern how that implementation reads, executes, and manages cogs.

### The Provenance Block

Records the origin and lineage of the cog's content — where it came from, how it was derived, what transformations were applied.

```yaml
blocks:
  - provenance:
      origin: "https://example.com/product-specs"
      derived-from: "product-catalogue-v3.cog.md"
      method: "Extracted and restructured from HTML source"
      date: 2026-02-13
```

### The Version Block

Changelog and version history within the cog itself. Complements the `version` field in base frontmatter with detailed history.

```yaml
blocks:
  - version:
      history:
        - version: "2.0"
          date: 2026-02-13
          changes: "Block architecture introduced. Single cog type."
        - version: "1.0"
          date: 2026-02-08
          changes: "Initial specification."
```

### Reader Agency

A reader of a cog is not obligated to process every block. Reader agency is a core principle:

1. **Ignore blocks.** A reader may skip any block type it does not understand or does not need. An HTML-unaware reader ignores HTML blocks. A security-unaware reader ignores security blocks. The prose block is always readable.

2. **Mixin blocks.** A reader may inject its own blocks before reading the cog. This operates in two modes:
   - **Prepend** — the reader's block is added before the cog's blocks (e.g., injecting SOP instructions before processing)
   - **Substitute** — the reader's block replaces a block of the same type in the cog (e.g., the reader's security policy overrides the cog's)

3. **Refuse execution.** A reader may refuse to execute action blocks from unsigned cogs, following its security block or SOP policy. The cog remains readable as documentation even when execution is refused.

Reader agency means cogs degrade gracefully. A minimal reader that only understands prose blocks can still read every cog in the ecosystem. A full MX implementation processes all block types. Everything in between works too.

### Uber Doc Requirement

Every MX implementation must maintain an **uber doc** (`UBER.cog.md`). The uber doc is the implementation's master configuration — it contains:

- The master set of SOPs (merged into cogs at read-time)
- The implementation's security policy
- Default definition block (standards the implementation expects)
- Reader mixin configuration (what blocks to prepend or substitute)

The uber doc is itself a cog. It follows the same format. It is the implementation's identity document — what kind of reader it is, what it expects, and how it behaves.

The uber doc is also the natural place to document effective doc policy — cache location, default TTL, invalidation behaviour. See "The Effective Doc" below.

### The Effective Doc

Reading a cog in a full MX implementation is expensive. The reader must:

1. Load the source cog from wherever it lives (local, Reginald, network)
2. Merge the uber doc's SOP blocks into the cog
3. Apply the reader's mixin configuration (prepend, substitute)
4. Evaluate the definition block hierarchy (document-level defaults, per-block overrides)
5. Enforce the security block and SOP policy
6. Resolve inheritance from any `builds-on` chain

Every step costs compute. Every step costs inference. For a cog that is read frequently — or for a chain of cogs that inherit from each other — the cost compounds.

The **effective doc** is the solution. It is a cached, fully-resolved version of a cog with all inheritance, SOPs, mixins, and policies already applied. The effective doc is what a reader actually works with after the first read.

**Key properties:**

- **Reader-specific.** Each reader's effective doc is different, because each reader brings its own uber doc, mixins, and SOP policy. Two implementations reading the same source cog produce two different effective docs.

- **Locally cached.** The effective doc lives in the reader's local cache only. It is never published, never shared, never uploaded to Reginald. It is a private artefact of the reader's processing.

- **Invalidated by any upstream change.** If the source cog changes, the effective doc is stale. If the uber doc's SOPs change, stale. If the reader's mixin configuration changes, stale. If the TTL expires, stale. Whichever comes first.

- **Machine-determined TTL.** The reader decides how long to cache the effective doc. The cog's governance period (if specified in the provenance or version block) is advisory — the machine may cache for longer or shorter based on its own resource constraints, access patterns, and trust model. The governance period is a hint, not a ceiling.

**Implementation guidance:**

Implementations should document their effective doc policy in the uber doc:

```yaml
blocks:
  - sop:
      effective-doc-policy:
        cache-location: "local"        # where effective docs are stored
        default-ttl: "machine"         # machine decides | or a duration hint
        invalidation:
          - source-cog-change
          - uber-doc-change
          - mixin-config-change
          - ttl-expiry
        governance-period: "advisory"  # advisory | strict
```

The effective doc pattern is not mandatory. A minimal implementation may re-resolve every read. A high-performance implementation may cache aggressively. Both are valid. The pattern exists to reduce inference cost without sacrificing correctness — the same cog, fully resolved, served from cache until something changes.

"Cut compute, not context."

#### Worked Example: Effective Doc Resolution

Consider a conference cog published on a venue's website. The source cog declares basic facts:

```yaml
---
name: cms-summit-2026
description: "CMS Summit Frankfurt, 12 May 2026"
author: "Conference organisers"
created: 2026-01-15
modified: 2026-03-01
version: "1.0"

mx:
  status: active
  contentType: event
  tags: [conference, cms, frankfurt, content-management]
  audience: [attendees, speakers]
  deliverable: "conference programme with session details"
---

Sessions, speakers, and venue details follow in the markdown body.
```

The reader's uber doc (`UBER.cog.md`) contributes SOP policy:

```yaml
blocks:
  - sop:
      content-policy:
        dietary-check: "Match event catering tags against reader dietary cogs"
        accessibility-check: "Match venue features against reader accessibility cogs"
      effective-doc-policy:
        cache-location: "local"
        default-ttl: "24h"
        invalidation:
          - source-cog-change
          - uber-doc-change
          - mixin-config-change
          - ttl-expiry
        governance-period: "advisory"
```

The reader's personal cogs include a wheelchair-user identity with tags `[step-free, lift-access, accessible-parking]` and a dietary cog with tags `[vegetarian, nut-allergy]`.

**The effective doc** merges all three inputs:

1. Source cog fields are preserved (name, description, tags, deliverable)
2. Uber doc SOPs are applied — dietary-check runs against the catering tags, accessibility-check runs against the venue features
3. Personal cog matches are scored — the wheelchair-user identity matches venue accessibility attributes
4. The result is cached locally with a 24-hour TTL

A different reader with no accessibility cogs and different dietary requirements produces a different effective doc from the same source cog. The source never changes. The interpretation is reader-specific.

### Cog Composition — The Includes Mechanism

Cogs reuse content. A validation policy appears in every action-doc. A standard disclaimer appears in every published specification. A shared field group appears across contact cogs. Without a composition mechanism, this content is duplicated — and duplicated content drifts.

The **includes mechanism** solves this. A cog declares what it includes, from where, and when the inclusion resolves.

#### Two Syntaxes

**1. YAML `includes` field** — in frontmatter, declares structural includes at the cog level:

```yaml
includes:
  - source: shared/validation-policy.cog.md
    blocks: [sop]
    resolution: build
  - source: reginald:standard-disclaimer
    resolution: read
```

Each include specifies:

| Field | Required | Description |
| --- | --- | --- |
| `source` | yes | Path to the included cog — relative path or `reginald:<name>` for registry lookup |
| `blocks` | no | Which block types to include. Omit to include the entire cog |
| `resolution` | no | `build` (resolved before publication) or `read` (resolved by the reader). Default: `build` |

**2. Inline `@include` marker** — in the markdown body, inserts content at a specific point:

```markdown
## Validation Rules

The following rules apply to all cogs in this collection.

@include(shared/validation-policy.cog.md#sop)

Additional rules specific to this cog follow below.
```

The inline marker uses fragment syntax (`#block-type` or `#section-heading`) to select a portion of the included cog. Without a fragment, the entire markdown body is inserted.

#### Resolution Modes

| Mode | When | Result | Use Case |
| --- | --- | --- | --- |
| `build` | Before publication | Published cog is self-contained — no dependencies at read time | Shared policies, standard disclaimers, boilerplate fields |
| `read` | When the reader loads the cog | Reader fetches and merges included content at load time | Living references that must reflect the latest source |

Build-time resolution produces a cog that works offline, in constrained environments, and without registry access. Read-time resolution keeps content current but requires the source to be reachable.

An author chooses the resolution mode per include. The same cog may mix build-time and read-time includes.

#### Override Rules

When a cog includes content from another cog, the including cog's own content takes precedence:

- **YAML fields:** The including cog's fields override included fields of the same name. This follows the same rule as inheritance — child overrides parent.
- **Blocks:** If the including cog defines a block of the same type as an included block, the including cog's version replaces the included version entirely.
- **Inline content:** Content before and after an `@include` marker belongs to the including cog. The included content fills the gap.

This means an author can include a shared policy and then override specific parts without editing the shared source.

#### Source References

Two reference formats are supported:

| Format | Syntax | Resolution |
| --- | --- | --- |
| Relative path | `shared/policy.cog.md` | Resolved relative to the including cog's location |
| Registry name | `reginald:cog-name` or `reginald:category/cog-name` | Resolved via REGINALD registry lookup |

Relative paths work within the same repository. Registry names work across repositories and for published cogs. A cog may reference both in the same `includes` list.

#### Relationship to Existing Concepts

- **`builds-on`** is a soft recommendation — "read this for context." Includes are structural — "merge this content into me."
- **The uber doc** contributes SOPs via the effective doc pattern. Includes contribute content via explicit declaration.
- **The effective doc** is the final resolved output after all includes, inheritance, SOPs, and mixins are applied.

The resolution chain is: source cog → includes resolved → uber doc SOPs applied → mixins applied → effective doc cached.

#### Reference Implementations

Working examples of the composition and effective doc patterns live at `mx-canon/mx-the-gathering/reference-implementations/`:

| File | Demonstrates |
| --- | --- |
| `shared-validation-policy.cog.md` | A cog designed to be included — shared validation rules |
| `example-with-includes.cog.md` | The `includes` field in action, with override |
| `effective-doc-example.cog.md` | Complete resolution chain from source cog to cached effective doc |

---

## 4. MX Principles

These principles govern all cogs:

### Design for Both

Patterns that work for AI agents also work for humans. When building a cog, ask: does this benefit both machines AND humans? The solutions should converge.

### Explain Everything

Let there be no assumptions. If a value is obvious to humans, it is meaningless to machines.

**Bad:**

```yaml
title: "Cog Name"
description: A cog that does things
```

**Good:**

```yaml
# title: Human-readable document title
# Machine identifier is derived from filename: "pricing.cog.md" → pricing
title: "Pricing Validator"

# description: One sentence explaining what this cog does (max 160 chars)
description: Validate pricing data to catch range errors and formatting issues before AI agents misinterpret them
```

Every field should provide real information, not placeholders.

---

## 5. Format

The canonical cog format is `.cog.md` — YAML frontmatter for machines, markdown for humans:

```text
cogs/
  core/
    pricing.cog.md
    a11y.cog.md
    schema.cog.md
```

Structure of a `.cog.md` file:

```markdown
---
# YAML frontmatter (machine-readable)
---

# Cog Name

Markdown documentation (human-readable)
```

Any file type can be a cog by adding the `.cog.` infix: `.cog.html`, `.cog.js`, `.cog.css`, `.cog.png`. Each file type carries its metadata in the format native to that file type.

### Native Metadata Across File Types

MX follows the **embrace-and-extend** model. Every file type has its own established conventions for metadata. MX does not replace them — it recognises existing structures as native blocks and adds an MX identity layer on top.

A JavaScript file already has JSDoc tags. MX recognises `@description` as the prose block and `@param`/`@returns` as the definition block. An HTML file already has `<meta>` tags. MX recognises `<meta name="description">` as a prose excerpt and Schema.org JSON-LD as a definition block. MX never duplicates what the file already says.

The MX identity layer adds governance and discoverability — name, version, purpose, audience, category — using the native comment or metadata convention of each file type.

| File Type | Native Metadata Location | MX Identity Layer | Pre-existing Structures Recognised As Blocks |
| --- | --- | --- | --- |
| `.cog.md` | YAML frontmatter | Standard cog fields in YAML | Markdown body = prose block |
| `.cog.html` | `<meta>` tags in `<head>` | `<meta name="mx:*">` tags, `data-mx-*` attributes on elements | Schema.org JSON-LD = definition, `<meta name="description">` = prose excerpt, `<main>` = essence |
| `.cog.js` | JSDoc comment block | `@mx:` tags in JSDoc | `@description` = prose, `@param`/`@returns` = definition, function bodies = code (implicit) |
| `.cog.css` | `/* */` comment block | `@mx:` tags in CSS comments | File description = prose, `:root` custom properties = definition |
| `.cog.png/.jpg` | EXIF/XMP metadata | MX XMP fields | Existing EXIF = provenance |
| Shell scripts | `# ---` comment block | Standard fields in comments | (See Section 21) |

**The principle:** embrace what the file already says. Extend with what MX needs. Never duplicate. Never wrap.

**Field Dictionary:** The complete carrier format definitions — including parsing rules, examples, and MX identity mechanisms for each carrier — live in `fields.cog.md` under the `carrierFormats` YAML array and Sections 12.1–12.9.

**Backward compatibility:** `.cog.html` is valid HTML. `.cog.js` is valid JavaScript. `.cog.css` is valid CSS. Adding MX metadata does not break the file for tools that do not understand MX. Browsers ignore unknown `<meta>` names. JavaScript runtimes ignore JSDoc comments. CSS processors ignore comment content. MX metadata is inert for non-MX readers.

**Embedded blocks in HTML:** A `.cog.html` file may contain `<style>` and `<script>` elements. Each embedded language uses its own native metadata convention — CSS comments inside `<style>`, JSDoc inside `<script>`. A single HTML file can therefore carry multiple blocks, each with its own metadata. This is the foundation of "the doc IS the app."

**Pointer to full cog:** Any HTML page can reference a full `.cog.md` file using `<link rel="mx" href="page.cog.md">`. This allows lightweight HTML pages to point to their full cog definition without embedding all metadata inline.

### Namespace Convention

Metadata field names follow a namespace convention that separates the open standard from implementation extensions.

1. **Standard fields** (no prefix) — The Gathering's core vocabulary. All implementations honour these. Examples: `name`, `version`, `description`, `created`, `modified`, `author`, `tags`, `buildsOn`.

2. **MX standard extensions** (`mx:` prefix) — The Gathering's extended vocabulary for agent alignment and operational metadata. Part of the open standard, not vendor-specific. Examples: `mx:contentType`, `mx:runbook`, `mx:audience`. In YAML, these appear as an `mx:` object. In HTML/JS/CSS, they use the `mx:` prefix.

3. **Vendor extensions** (`vendor:field` or `x-vendor-` prefix) — Implementation-specific fields. Each vendor owns their namespace. Examples: `adobe:template`, `contentful:space`, `x-mx-deployment-id` (CogNovaMX product field).

4. **The Gathering defines the pattern.** The `prefix:field` convention is the open standard. What goes in each vendor's namespace is the vendor's business. The pattern is consistent across all file types — `@vendor:field` in JSDoc, `<meta name="vendor:field">` in HTML, `/* @vendor:field */` in CSS.

5. **Registration.** Vendors register their namespace prefix in REGINALD to avoid collisions. The registry of registered prefixes is public. Unregistered prefixes are valid but not guaranteed unique.

**Context-specific syntax:**

- **YAML frontmatter:** Vendor extensions use the `x-` prefix convention. `x-mx-` for public CogNovaMX fields, `x-mx-p-` for private CogNovaMX fields. The `mx:` object is for The Gathering's standard extensions.
- **HTML/JS/CSS:** Vendor extensions use colon-separated names like `adobe:template` or `x-mx:field`. The `mx:` prefix is for The Gathering's standard extensions.

**Governance clarity:** The `mx:` namespace belongs to The Gathering (independent standards body), not CogNovaMX (implementation vendor). This follows the Dublin Core model — `dc:` is governed by DCMI, not by any vendor. See `mx-canon/mx-maxine-lives/deliverables/mx-standards-alignment.cog.md` for complete precedents and rationale.

---

## 6. Frontmatter Schema — Base Cog

These fields apply to every cog, whether info-doc or action-doc.

### Value Types

Every field has a **value type** that tells implementers what format to expect:

| Value Type | Meaning | Example |
| --- | --- | --- |
| `identifier` | Kebab-case slug. Machine-processable. | `mx-core`, `developers` |
| `free text` | Human-readable string. No format constraint. | `Validate pricing data...` |
| `enum` | One of a fixed set of identifiers. | `draft` / `stable` / `deprecated` |
| `date` | ISO 8601 timestamp. | `2026-02-09` |
| `semver` | Semantic version number. | `1.0.0` |
| `email` | Email address. | `tom@example.com` |
| `uri` | URL or file path. | `https://example.com` |
| `boolean` | `true` or `false`. | `true` |
| `object` | Nested YAML structure. See subsection. | `mx:` block |

**Naming convention for identifiers and enums:** kebab-case. All controlled vocabulary values use lowercase hyphenated words: `non-technical`, `mx-core`, `ai-agents`. Free text values have no naming constraint.

**Who evaluates these values?** Both AI agents and non-AI programs (validators, query tools, CI pipelines) read and evaluate frontmatter. Controlled values (identifiers, enums) are machine-processable. Free text is for human context but may also be used by AI agents for semantic matching.

### Field Naming Conventions

All frontmatter field names use kebab-case. The following canonical names are the standard. When migrating existing documents, replace deprecated alternatives with canonical names.

| Canonical Name | Deprecated Alternatives | Notes |
| --- | --- | --- |
| `created` | `date`, `creation-date` | ISO 8601. When the document was first written |
| `modified` | `lastUpdated`, `lastmod`, `last-updated` | ISO 8601. When the document was last changed |
| `version` | `document-version` | Semver string. Never put version numbers in filenames |
| `author` | `createdBy` | The original creator |
| `tags` | `keywords` | Array of kebab-case identifiers for discovery |
| `organisation` | `organization` | British English spelling (MX convention) |
| `status` | `state` | Lifecycle state of the document |
| `superseded-by` | `replaced-by` | Path to the replacement document |

**Why canonical names matter:** The audit of 1,210 files across the MX ecosystem found 220 unique frontmatter keys, including four different names for "last modified date" and six variants for "related items." Canonical names eliminate ambiguity for validators, query tools, and AI agents.

**Field Dictionary:** The complete field reference — including definitions, types, profiles, deprecated mappings, overlap resolution, block types, carrier formats, and code/media/database metadata — lives at `mx-canon/ssot/fields.cog.md`. This spec defines structure. The field dictionary defines vocabulary.

### Required Fields

| Field | Type | Value Type | Description |
| --- | --- | --- | --- |
| `name` | string | identifier | Unique identifier (lowercase, hyphenated, case-insensitive lookup) |
| `version` | string | semver | Version number (e.g. `1.0.0`) |
| `description` | string | free text | One-line purpose (max 160 chars) |
| `created` | string | date | Creation timestamp |
| `modified` | string | date | Last modification timestamp |
| `author` | string | free text | Creator |

### Optional Fields

| Field | Type | Value Type | Description |
| --- | --- | --- | --- |
| `maintainer` | string | email | Current maintainer email |
| `license` | string | identifier | SPDX license identifier |
| `status` | string | enum | `draft` / `stable` / `deprecated` |
| `category` | string | identifier | `mx-core` / `capability` / `integration` |
| `tags` | array | identifier[] | Searchable keywords |
| `requires` | object | object | Dependencies (see subsection) |
| `mx` | object | object | MX principle alignment (see subsection) |
| `partOf` | string | identifier | Parent collection or suite |
| `refersTo` | array | identifier[] | Related cogs or resources |
| `builds-on` | array | identifier[] | Cogs that provide context (soft recommendation, not hard dependency) |
| `copiedFrom` | string | uri | Source if derived from another |
| `audience` | string or array | identifier | Target reader(s) (e.g. `developers`, `investors`, `ai-agents`) |
| `purpose` | string | free text | Why this cog exists — the intent beyond what it does |
| `reading-level` | string | enum | `non-technical` / `general` / `technical` / `expert` |
| `type` | string | identifier | Domain classifier (e.g. `contact`) — identifies which profile applies |
| `confidential` | boolean | boolean | If true, must not be shared or published publicly |
| `deliverable` | string or array | free text | What this cog produces or delivers (e.g. `validated cog registered in REGINALD`) |
| `includes` | array | object[] | Composition — content reuse from other cogs (see Section 3, "Cog Composition") |

### Cog Profiles

The base schema covers universal fields. Domain-specific cogs use additional fields defined by **profiles**. A profile is a named set of fields that extend the base schema for a particular use case. The `type` field identifies which profile applies.

Profiles are optional extensions. A validator checks base fields first, then applies profile-specific rules if the cog declares a recognised `type`.

#### Contact Profile

Cogs with `type: contact` represent people or organisations in the MX network. Managed by the `mx-contacts` action-doc.

| Field | Type | Value Type | Description |
| --- | --- | --- | --- |
| `relationship` | string | identifier | Relationship to MX (e.g. `mentor`, `advisor`, `partner`, `prospect`) |
| `organisation` | string | free text | Company or organisation name |
| `role` | string | free text | Job title, role, or stake (e.g. `25% A shares`) |
| `context` | string | free text | Background information and relationship history |
| `messages` | array | object[] | Message log — objects with `file`, `date`, `type`, `status`, `note` |
| `next-action` | string | free text | What to do next (e.g. `Send message this week`) |

Contact cogs are typically info-docs (no action block). Their YAML frontmatter is the structured data. Their markdown body provides human-readable context.

**Note:** Contact cogs are almost always `confidential: true`. The `confidential` field is a base cog field, not contact-specific — any cog can be confidential.

---

## 7. Action-Doc Extensions

An action-doc adds the `execute` object to the base cog fields. The presence of `execute` is what makes a cog into an action-doc.

### Execute Object

```yaml
execute:
  runtime: bash | node | python | runbook | npm
  command: mx cog <name>
  actions:
    - name: <action-name>
      description: What this action does
      usage: mx cog <name> <action> [args]
      inputs:
        - name: <param>
          type: string | number | boolean | object | array
          required: true | false
          description: What this input is
      outputs:
        - name: <output>
          type: string | number | boolean | object | array | file
          description: What this returns
      invokes: [other-cog.action]    # Action-doc actions called during execution (optional)
```

### Execute Object Fields

| Field | Value Type | Description |
| --- | --- | --- |
| `runtime` | enum | `bash` / `node` / `python` / `runbook` / `npm` — how to execute |
| `command` | free text | Script path or CLI command (required for `node`, `bash`, `python`) |
| `actions` | object[] | List of action definitions (at least one required) |

### Action Fields

| Field | Value Type | Description |
| --- | --- | --- |
| `name` | identifier | Action name (kebab-case) |
| `description` | free text | What this action does |
| `usage` | free text | How to invoke (CLI syntax or natural language for `runbook`) |
| `inputs` | object[] | Parameters — each with `name` (identifier), `type` (enum), `required` (boolean), `description` (free text) |
| `outputs` | object[] | Return values — each with `name` (identifier), `type` (enum), `description` (free text) |
| `invokes` | identifier[] | Other action-doc actions called during execution (e.g. `cog-registry.validate`) |

### Runtime Field (Required)

The `runtime` field declares **how** the action-doc is executed. An action-doc without a runtime is incomplete — it describes what it does but not how to run it.

| Runtime | Meaning | Executor |
| --- | --- | --- |
| `bash` | Shell script or CLI command | Run via system shell |
| `node` | JavaScript/TypeScript | Run via Node.js |
| `python` | Python script | Run via Python interpreter |
| `runbook` | Instructions for an AI agent | Executed by an AI agent reading the action-doc and following its actions as instructions |
| `npm` | npm script | Run via `npm run` |

**`runbook` is the default for action-docs that describe capabilities an AI agent should perform.** Most MX action-docs are `runbook` — the actions describe what an AI agent should do when asked. The action-doc is the instruction set. The AI agent is the executor.

When `runtime: runbook`, the `usage` field in each action is written as a natural language instruction that an AI agent can follow. The `inputs` and `outputs` describe the data the agent works with.

**The `deliverable` field** declares what running the action-doc produces. For a publication workflow, the deliverable might be `"validated cog registered in REGINALD"`. For a training course, `"trained team with documented competencies"`. The deliverable is the reason the cog exists — the tangible output that justifies the work. Info-docs may also declare deliverables: a specification delivers `"canonical format for interoperable cogs"`.

An action-doc may combine runtimes. For example, an action-doc with `runtime: bash` may have one action that runs a shell command and another that is an instruction for the AI agent. In this case, use the primary runtime and note exceptions in the action descriptions.

### Embedded Scripts

An action-doc can embed executable scripts directly in the markdown body using the `@embedded:` marker. This is an alternative or complement to the `execute` object in YAML frontmatter.

```markdown
```bash @embedded:script-id
#!/bin/bash
# Script content here
echo "Hello from embedded script"
```                                     (close the fence)
```

**Marker format:** The `@embedded:` marker appears on the same line as the opening code fence, followed by a script identifier. The identifier is used to reference the script for extraction and execution.

**When to use embedded scripts:**

| Approach | Use When |
| --- | --- |
| `execute` object in YAML | Actions are instructions for AI agents (`runtime: runbook`) |
| `@embedded:` script | Actions are shell/node/python scripts to be extracted and run |
| Both | The cog documents the capability (YAML) AND provides the implementation (embedded) |

**Extraction:** Tools like `mx-exec` extract embedded scripts by finding the `@embedded:script-id` marker and extracting everything between the opening and closing code fences.

**Script runtimes:** The language specified in the code fence (`bash`, `node`, `python`) indicates how to execute the extracted script.

### The runbook Field

The `runbook` field (under `mx:` in YAML) provides execution instructions as an alternative to the full `execute` object. It is suitable for simpler action-docs where the full action schema is not required.

```yaml
mx:
  contentType: action-doc
  runbook: "mx marp-regen <path-to-markdown>"
```

**Runbook formats:**

1. **String** — A single instruction or command:

   ```yaml
   mx:
     runbook: "npm run build"
   ```

2. **Multiline string** — Detailed instructions:

   ```yaml
   mx:
     runbook: |
       To regenerate the output:
       1. Run npm install
       2. Run npm run build
       3. Check the dist/ folder
   ```

3. **Array** — Multiple actions where the user selects one:

   ```yaml
   mx:
     runbook:
       - build: "npm run build"
       - test: "npm run test"
       - deploy: "npm run deploy"
   ```

   When runbook is an array, each item is an object with an action name as the key and a command as the value. The executor (human or AI agent) selects which action to run.

**Relationship to execute object:** The `runbook` field is a lightweight alternative to the full `execute` object. Use `execute` when you need structured inputs, outputs, and multiple documented actions. Use `runbook` when a simple command or instruction suffices.

### Action-Level Extensions

Individual actions may include additional fields beyond `name`, `description`, `usage`, `inputs`, `outputs`, and `invokes`. These are action-level extensions — domain-specific metadata attached to a particular action.

| Extension | Value Type | Description |
| --- | --- | --- |
| `interview-questions` | object[] | Questions for an AI agent to ask the human. Objects with `field` (identifier), `question` (free text), `maps-to` (free text), and optional `guidance` (free text). |
| `checks` | object[] | Validation rules. Objects with `name` (identifier), `description` (free text), and `severity` (enum: `error` / `warning`). |

Action-level extensions are not part of the core schema. A validator should pass unrecognised action fields without error. They are documented here for interoperability — agents that encounter these fields should use them.

### MX Alignment Object

Declare alignment with MX principles:

```yaml
mx:
  convergence: true    # Benefits both humans and machines
  accessibility: true  # Improves accessibility
  semantic: true       # Uses or promotes semantic structures
```

If an action-doc does not align with MX principles, it should explain why in the documentation.

### Requires Object

```yaml
requires:
  bins: [curl, jq]           # Required CLI tools
  cogs: [schema]             # Required other cogs
```

### Relationship Fields

```yaml
partOf: mx-core                    # This cog belongs to a collection
refersTo: [schema, a11y]           # Related cogs or external resources
buildsOn: [what-is-a-cog]        # Read these first for full context
copiedFrom: https://example.com    # Attribution if derived from another source
```

### The builds-on Field

`builds-on` is a soft recommendation, not a hard dependency. It tells an AI agent: "for full context, also read these cogs." The cog still makes sense on its own — but reading what it builds on gives deeper understanding.

This mirrors the additive SOUL principle. Just as folder SOULs layer on top of Maxine's base identity without replacing it, cogs layer on top of other cogs without importing or inheriting from them.

`builds-on` is not `requires`. An action-doc's `requires.cogs` declares hard dependencies needed for execution. `builds-on` declares conceptual context — background reading that enriches understanding. A validator does not flag missing `builds-on` references. An agent that skips them still works, just with less context.

**Example:** `who-is-maxine.cog.md` builds on `what-is-a-cog.cog.md`. An agent reading the Maxine cog can follow the partnership model without knowing what a cog is — but reading the first cog first makes everything click.

**`builds-on` is recursive.** A cog's `builds-on` references may themselves have `builds-on` references. This forms a context graph — a web of cogs that build on each other. An agent encountering a `builds-on` chain should follow it to the roots for fullest context. Root cogs (like `what-is-a-cog`) have no `builds-on` — they are entry points. As the ecosystem grows, the graph grows with it.

### The invokes Field

```yaml
execute:
  actions:
    - name: validate
      invokes: [cog-registry.validate, schema-checker.check]
```

`invokes` declares which other action-doc actions this action calls during execution. It is inter-cog communication — one program calling another.

When an AI agent executes an action with `invokes`, it reads and executes the invoked action-doc's action as part of the current action. The agent is the runtime for both — it follows the invocation chain.

**`invokes` is not `builds-on`.** `builds-on` says "read this for context." `invokes` says "execute this as part of the action." One is conceptual. The other is operational.

**`invokes` is not `requires.cogs`.** `requires.cogs` declares that a cog must be present for this action-doc to work. `invokes` declares that a specific action in a specific action-doc is called during execution. `requires` is a static check. `invokes` is a dynamic call.

| Field | Relationship | When | Purpose |
| --- | --- | --- | --- |
| `builds-on` | Read these first | Before reading | Conceptual context |
| `requires.cogs` | These must exist | Before execution | Static dependency |
| `invokes` | Execute these | During execution | Dynamic call chain |

### The access Object

```yaml
access:
  type: public | guardrail | encrypted | password | oauth
  gate: auth-guardrail          # name of guardrail cog (for type: guardrail)
  provider: azure-ad             # OAuth provider (for type: oauth)
  note: "Requires team credentials"  # human-readable access note
```

The `access` object declares how a cog is protected. It is separate from trust (COG) — trust asks "is this genuine?" while access asks "can I read or run this?"

| Access Type | Meaning | OS Analogy |
| --- | --- | --- |
| `public` | No gate. Any agent can read and execute | `chmod 644` — world-readable |
| `guardrail` | A guardrail action-doc must execute and grant access before the agent can read the content | `sudo` / PolicyKit |
| `encrypted` | The cog file or its content is encrypted. A key is required to decrypt | dm-crypt / FileVault |
| `password` | The cog is behind HTTP basic auth or similar credential-based access | Login prompt / PAM |
| `oauth` | The cog is behind an OAuth flow (enterprise SSO, cloud provider) | Kerberos / SSO |

If `access` is not present, the cog is assumed public.

**Frontmatter stays discoverable.** Even when a cog's content is locked, its YAML frontmatter (name, description, tags, category, access type) should remain readable. This allows registries and agents to discover and catalogue the cog without having access to the content. The metadata is the catalogue entry. The content is behind the gate.

**The guardrail pattern.** When `access.type: guardrail`, the `access.gate` field names an action-doc that must execute successfully before the locked cog becomes accessible. The guardrail action-doc checks identity, permissions, tokens, or runs an unlock action. If the guardrail grants access, the agent proceeds. If not, the agent sees only the frontmatter.

```yaml
# Example: a locked pricing cog
---
title: "Client Pricing 2026"
access:
  type: guardrail
  gate: team-auth
  note: "Requires team-auth cog to verify credentials"
---
# [Content locked — guardrail required]
```

**Trust and access are independent layers.** A cog can be:

- **Genuine and public** — verified by COG, readable by anyone
- **Genuine and locked** — verified by COG, but content requires authorisation
- **Unverified and public** — no COG, but anyone can read it
- **Unverified and locked** — no COG and content is gated

Both layers add value independently. Neither depends on the other.

---

## 8. Cogs in Business Terms

Every organisation has two kinds of operational document: reference material and procedures. The reference material tells you what's true. The procedures tell you what to do. Cogs are the machine-readable versions of both.

**An info-doc is a single source of truth.** The verified, structured, authoritative answer to any question an AI agent asks. Product specifications, compliance certificates, pricing data, contact records, policy documents — anything an organisation needs to get right, every time, without ambiguity. An info-doc is that answer, structured so machines read it as accurately as humans do.

**An action-doc is a Standard Operating Procedure that executes itself.** Every organisation runs on SOPs — the step-by-step instructions that ensure a task gets done the same way every time, by anyone, to the required standard. SOPs are how businesses achieve consistency, quality control, and safety.

An action-doc is a machine-executable SOP. The same document that a human reads as instructions, an AI agent reads and runs. There is no translation layer — the procedure IS the program.

| SOP Concept | Action-Doc Equivalent |
| --- | --- |
| Step-by-step instructions | `execute.actions` — each action with inputs, outputs, and usage |
| "Anyone can follow it" | `runtime: runbook` — any AI agent can execute the procedure |
| Consistency | Same cog, same steps, same result, every time |
| Quality control | `invokes` chains and `checks` extensions — built-in validation |
| Safety protocols | `access` object and guardrail pattern — controlled execution |
| Version control | `version` field and lifecycle — draft through re-signed |
| Accountability | Contract of Governance — named maintainer, review cycle, correction SLA |
| Audit trail | Certificate of Genuineness — signed, timestamped, verifiable |

The difference between a traditional SOP and an action-doc is the difference between a recipe printed on paper and a recipe that cooks the meal. A traditional SOP lives in a binder, a wiki, or a PDF. Someone reads it. Someone follows it. Someone might skip a step. An action-doc lives in the system. The AI agent reads it and executes every step, every time. No steps skipped. No corners cut.

This means every SOP in an organisation is a candidate to become an action-doc. Onboarding procedures, deployment checklists, compliance checks, data validation workflows, incident response plans — any repeatable process with defined steps can be written as an action-doc and executed by an AI agent.

The `runtime: runbook` field is what makes this work. It tells the system: this is not a script to run — this is a set of instructions for an AI agent to follow. The action-doc is the instruction set. The AI agent is the executor. The procedure documents itself and runs itself in the same file.

---

## 9. Governance Layer — Certificate of Genuineness

The governance layer wraps a cog with trust. It proves the document is genuine: who published it, when, and that it conforms to MX standards.

This layer is optional for local use. It is required for REGINALD registration.

### Certificate Header

```yaml
cogId: "cog-{publisher}-{subject}-{date}"
cogType: "certificate-of-genuineness"

publisher:
  name: "Publisher Name"
  verified: true
  signedBy: "email@example.com"

subject:
  name: "Subject Name"
  category: "category"
  scope: "what-this-covers"

publicationDate: "2026-02-08T14:30:00Z"
expires: "2026-08-08T14:30:00Z"
lastVerified: "2026-02-08T14:30:00Z"

signature: "mx-sig-..."
mxCompliance: "level-3"
registry: "allabout.network"
```

A cog without the Certificate is unverified. You do not know if it is genuine.

---

## 10. Accountability Layer — Contract of Governance

The accountability layer defines who maintains this cog, how often it is reviewed, what triggers updates, and what the correction SLA is.

This layer is optional for local use. It is required for REGINALD registration.

### Governance Body

```yaml
maintainer:
  name: "Maintainer Name"
  contact: "email@example.com"
  escalation: "escalation@example.com"

reviewCycle: "monthly"
updateTriggers:
  - "product version change"
  - "breaking API change"
  - "security advisory"
  - "user-reported inaccuracy"

accuracyCommitment: "verified against current production release"
correctionSla: "48 hours from report to updated COG"

usage:
  sopInference: "permitted"
  caching: "permitted for 24 hours"
  redistribution: "with attribution"
  commercialUse: "permitted"
```

A cog without the Contract is ungoverned. Nobody has promised to keep it accurate.

---

## 11. Compliance Levels

Not every cog needs the same verification. A developer's local filesystem cog has different requirements than a pharmaceutical dosage reference.

| Level | Certificate requirement | Governance requirement | Use case |
| --- | --- | --- | --- |
| **1 — Basic** | YAML frontmatter present | Publisher identified | Internal documentation |
| **2 — Structured** | MX-compliant format | Maintainer and contact provided | Public documentation |
| **3 — Signed** | Cryptographically signed | Review cycle and update triggers defined | REGINALD minimum |
| **4 — Registered** | Signed and registered in REGINALD | Full governance contract with SLA | Commercial documentation |
| **5 — Audited** | Signed, registered, and independently verified | Governance audited by third party | Regulated industries |

**Level 3** is the minimum for REGINALD registration — the point where AI systems can trust the content programmatically.

**Level 5** is for healthcare, finance, and legal — industries where a wrong answer harms people.

---

## 12. Visibility Levels

The cog format is universal. Where a cog lives determines its visibility.

| Level | Scope | Example | Registration |
| --- | --- | --- | --- |
| **Local** | Your machine, your AI agent | `.mx.yaml.md` files across a filesystem | None required |
| **Private** | Within an organisation | Internal API docs, onboarding guides | Internal registry |
| **Shared** | Between partners | Vendor documentation for clients | Bilateral agreement |
| **Hosted** | Publicly available | `allabout.network/cogs/` | REGINALD registration |

REGINALD is not the cog system. REGINALD is the public host within the cog system.

---

## 13. Lifecycle

```text
DRAFT → SIGNED → REGISTERED → ACTIVE → REVIEW → UPDATED → RE-SIGNED
                                 ↑                              │
                                 └──────────────────────────────┘
```

| Stage | Certificate action | Contract action |
| --- | --- | --- |
| Draft | Content prepared, unsigned | Governance terms defined |
| Signed | Signing engine validates and signs | Maintainer commits to governance terms |
| Registered | Added to REGINALD registry | Governance terms indexed and enforceable |
| Active | Queryable by AI systems | Maintenance schedule begins |
| Review | Approaching expiry or trigger event | Maintainer reviews accuracy |
| Updated | Content revised | Governance log updated |
| Re-signed | New signature, new timestamp | Renewal of governance commitment |

---

## 14. Categories

Cogs (info-docs and action-docs) belong to categories:

| Category | Focus | Examples |
| --- | --- | --- |
| **mx-core** | Robot-First Web | a11y, pricing, schema, llms-txt, semantic-html |
| **capability** | General tools | (future: image-alt, pdf-parser, spell-check) |
| **integration** | External services | (future: lighthouse, axe-core, pagespeed) |

---

## 15. Validation Rules

### A valid cog MUST

- Have all required base fields in frontmatter (name, version, description, created, modified, author)
- Have `name` matching the filename stem (e.g. `pricing.cog.md` has `name: pricing`)
- Have valid ISO 8601 timestamps
- Have valid semver version

### A valid action-doc MUST additionally

- Have an `execute` object with at least one action
- Have each action define `name`, `description`, and `usage`

### A valid cog SHOULD

- Declare `mx` alignment
- Include usage examples in documentation
- Document all inputs and outputs (for action-docs)

---

## 16. Examples

### Minimal Info-Doc

```yaml
---
title: "API Reference"
version: 1.0.0
description: Claude Code installation and update procedures
created: 2026-02-08T14:30:00Z
modified: 2026-02-08T14:30:00Z
author: Anthropic
---

# Claude Code: Installation and Update

## Update procedure

1. Exit your current Claude Code session
2. Run: `claude update`
3. Verify: `claude --version`
```

### Minimal Action-Doc

```yaml
---
title: "Pricing Validator"
version: 0.1.0
description: Validate pricing data to catch range errors and formatting issues
created: 2026-02-06T12:00:00Z
modified: 2026-02-06T12:00:00Z
author: MX

execute:
  command: mx cog pricing
  actions:
    - name: validate
      description: Check pricing data for formatting errors and implausible ranges
      usage: mx cog pricing validate <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to analyze for pricing data
      outputs:
        - name: report
          type: object
          description: Validation results with issues found
---

# pricing

Validate pricing data to catch the £200,000 errors before they erode trust.

## Usage

```bash
mx cog pricing validate https://example.com/cruises
```

### Full Signed COG (Level 3)

```yaml
---
title: "Claude Code Update"
description: Claude Code installation and update procedures
author: Anthropic
created: 2026-02-08T14:30:00Z
modified: 2026-02-08T14:30:00Z
status: active
category: developer-tool
version: "1.0"
cogId: "cog-anthropic-claude-code-update-20260208"
cogType: "certificate-of-genuineness"

publisher:
  name: "Anthropic"
  verified: true
  signedBy: "docs@anthropic.com"

subject:
  name: "Claude Code"
  category: "developer-tool"
  scope: "installation-and-update"

publicationDate: "2026-02-08T14:30:00Z"
expires: "2026-08-08T14:30:00Z"
signature: "mx-sig-a7f3b2e1c4d8e9f2..."
mxCompliance: "level-3"
registry: "allabout.network"

maintainer:
  name: "Anthropic Documentation Team"
  contact: "docs@anthropic.com"

reviewCycle: "monthly"
updateTriggers:
  - "Claude Code version release"
  - "installation process change"
  - "user-reported inaccuracy"

accuracyCommitment: "verified against current production release"
correctionSla: "48 hours"

usage:
  sopInference: "permitted"
  caching: "24 hours"
  redistribution: "with attribution"
---

# Claude Code: Installation and Update

## Update procedure

1. Exit your current Claude Code session
2. Run: `claude update`
3. Verify: `claude --version`

**Important:** Cannot update from within a running session.

## Common mistakes

| Mistake | Why it fails | Correct approach |
| --- | --- | --- |
| `npm update -g @anthropic/claude-code` | Claude Code is not an npm package | Use `claude update` |
| Running update inside a session | stdin conflict prevents update | Exit session first |
```

---

## 17. Design Principles

1. **Self-describing** — Any agent can read the YAML and know what the cog does
2. **Machine-first** — Structured metadata enables automation
3. **Human-readable** — Markdown documentation for humans
4. **Single file** — One `.cog.md` file = one cog
5. **Explicit state** — Required fields, clear types, no guessing
6. **Convergence** — Benefits both humans and machines
7. **Layered trust** — Base cog works locally; add governance layers as needed
8. **Blocks compose** — One cog type, many block types. Blocks determine behaviour
9. **Reader agency** — Readers ignore, mixin, or refuse blocks at their discretion
10. **Honour existing standards — embrace and extend** — MX is the process of honouring all existing and future standards. Markdown, YAML, HTML meta tags, JSDoc, Schema.org, QR codes, git, OAuth, MIT licence, WebMCP. MX only extends when no existing standard fits. Never invent when you can adopt. When a file type already has metadata conventions (JSDoc for JavaScript, `<meta>` tags for HTML, EXIF for images), MX recognises those structures as native blocks and adds its identity layer on top. The pre-existing metadata IS the block — MX never duplicates what the file already says

---

## 18. Relationship to REGINALD

- **Cog** is the atomic unit of MX (universal, works at all visibility levels)
- **Action-doc** is a cog with an action block (it turns, it produces output)
- **Info-doc** is a cog without an action block (it documents, describes, certifies)
- **COG** (Certificate of Genuineness / Contract of Governance) is the trust wrapper around a cog
- **REGINALD** is the public registry for hosted COGs (the library)
- **Signing Engine** validates and signs COGs (the librarian's stamp)
- **MX** is the discipline that defines what makes a cog well-structured (the cataloguing standard)

Every document in REGINALD is a cog with a COG wrapper. But not every cog is in REGINALD. Local, private, and shared cogs use the same format without public registration.

---

## 19. Relationship to MX OS

MX OS is the MX Operating System — the principle that MX documentation IS the system, not documentation about a system. Cogs are the programs of MX OS.

| OS concept | MX OS equivalent |
| --- | --- |
| **Operating system** | MX OS — documentation as specification |
| **Programs / executables** | Action-docs — cogs with action blocks and a `runtime:` declaration |
| **Data files / configs** | Info-docs — cogs with structured metadata but no action block |
| **Shebang line** (`#!/bin/bash`) | The `runtime:` field — tells the OS how to run this program |
| **File format** | `.cog.md` — YAML frontmatter + markdown, universal across all cog types |
| **System API** | The Gathering specification — defines how programs are structured |
| **Package registry** | REGINALD — where published programs are hosted and discovered |
| **Code signing** | COG (Certificate of Genuineness) — trust layer proving a program is genuine |
| **Permission levels** | Compliance levels 1–5 — from local unsigned to independently audited |
| **Network scope** | Visibility levels — local, private, shared, hosted |
| **Filesystem metadata** | `.mx.yaml.md` files — folder-level context and inheritance |
| **Identity / user profile** | SOUL.md — self-describing identity for a folder or project |
| **Dependency graph** | `builds-on` — context chain between cogs |
| **Inter-process communication** | `invokes` — one action-doc calling another during execution |
| **Bootloader** | CLAUDE.md (or platform equivalent) — always-on pointer to the OS |
| **Init system** | Boot skill or entry cog — reads registry and current state once per session |
| **Process scheduler / dispatcher** | Routing action-doc — maps tasks to the right cog |
| **File permissions / ACL** | `access` object — public, guardrail, encrypted, password, oauth |
| **sudo / privilege escalation** | Guardrail action-doc — must execute to unlock protected cogs |

The `runtime:` field is the key bridge. In a traditional OS, a shebang line tells the kernel which interpreter to use. In MX OS, `runtime:` tells the system how to execute an action-doc: `bash` for shell scripts, `node` for JavaScript, `python` for Python, `npm` for package scripts, and `runbook` for action-docs where the AI agent IS the executor — the action-doc is the instruction set, the agent runs it.

Info-docs are the data files and configuration of MX OS. They do not execute, but they are structured so any program (human or machine) can read them without guessing. Every cog published is a question that never gets answered wrong again.

Action-docs are the programs. They turn. They validate pricing, check accessibility, extract metadata, generate documentation. The more action-docs that exist, the more MX OS can do. The more info-docs that exist, the less AI agents need to guess.

MX OS is not confined to repositories. SOULs and YAML metadata can be placed on any filesystem — a laptop, a team drive, a company's content infrastructure, the public web. Every folder with a `SOUL.md` becomes self-describing for AI agents. Every folder without one is a black box. The pattern scales from a single machine to the entire web.

### The Runtime Model

An AI agent operating within MX OS follows a layered execution model:

1. **Bootloader** — The platform configuration (CLAUDE.md, system prompt, or equivalent) is always-on. It tells the agent that MX OS exists and where to find it. It is lightweight — a pointer, not a program.

2. **Init** — Once per session, the agent reads the cog registry (to know what programs exist) and the current state cog (to know what priorities and actions are pending). After init, the agent is booted — it has a map of the system.

3. **Routing** — When the agent receives a task, it consults a routing action-doc that maps task types to the right cog. The router uses metadata (category, tags, audience) to select. If no router exists, the agent uses the registry directly.

4. **Execution** — The agent is both kernel and shell. For `runtime: runbook`, the agent reads the action-doc and follows its instructions. For `runtime: bash`, `node`, or `python`, the agent uses its tools to run the command. The agent is the universal runtime.

5. **IPC** — Action-docs declare `invokes` references to call other action-doc actions during execution. The agent follows the invocation chain, reading and executing each invoked action-doc in sequence.

The key insight: the AI agent is the operating system. It does not merely run within MX OS — it IS the kernel, the shell, and the runtime. Cogs are the programs it runs. SOULs are the identity it adopts. The builds-on graph is the knowledge it navigates. The specification is the API it follows.

---

## 20. Non-Cog Document Metadata

Not every markdown file in the MX ecosystem is a cog. Book chapters, READMEs, blog posts, guides, notes, configuration files — these are regular `.md` files that benefit from standardised frontmatter without being cogs.

The Gathering standard applies to cogs. But the frontmatter conventions — canonical field names, value types, and the principle that every document should be self-describing — are useful for any document that machines need to understand.

### Minimum Frontmatter for Non-Cog Documents

| Field | Required | Value Type | Description |
| --- | --- | --- | --- |
| `title` | Yes | free text | Human-readable document title |
| `description` | Yes | free text | One-line summary (max 160 chars) |
| `author` | Yes | free text | Creator |
| `created` | Yes | date | Creation date (ISO 8601) |
| `modified` | Yes | date | Last modification date (ISO 8601) |
| `version` | Recommended | semver | Document version |
| `status` | Recommended | enum | `draft` / `active` / `stable` / `superseded` / `deprecated` / `archived` |
| `audience` | Optional | identifier | Who this is for |
| `purpose` | Optional | free text | Why this document exists |
| `tags` | Optional | identifier[] | Discovery keywords |

Non-cog documents use `title` where cogs use `name`. A cog's `name` is a machine identifier (kebab-case, matches filename). A document's `title` is human-readable.

### When to Use Cog Format vs Document Format

| If the document... | Use |
| --- | --- |
| Has actions or an execute block | `.cog.md` with full cog schema |
| Is registered in REGINALD | `.cog.md` with governance layers |
| Is structured MX metadata (contacts, definitions) | `.cog.md` with appropriate profile |
| Is a book chapter, blog post, guide, or note | `.md` with document frontmatter |
| Is a README or configuration file | `.md` with document frontmatter |
| Is a folder identity file | `SOUL.md` (follows SOUL conventions) |
| Is folder-level metadata | `.mx.yaml.md` (follows folder metadata conventions) |

### Document Profiles

Domain-specific documents extend the minimum set with profile-specific fields. These are recommendations, not requirements — a validator should not reject documents with unrecognised profile fields.

#### Book Profile

For book manuscripts (chapters, appendices, glossaries):

| Field | Value Type | Description |
| --- | --- | --- |
| `book` | identifier | Which book this belongs to (e.g. `mx-protocols`, `mx-handbook`) |
| `chapter` | free text | Chapter identifier or number |
| `wordcount` | number | Approximate word count |
| `copyright` | free text | Copyright notice |

#### Blog Profile

For blog posts and articles:

| Field | Value Type | Description |
| --- | --- | --- |
| `blog-state` | enum | `draft` / `review` / `published` / `archived` |
| `blog-url` | uri | Published URL |
| `publication-date` | date | When published (may differ from `created`) |
| `reading-time` | free text | Estimated reading time (e.g. `5 min`) |

#### Folder Metadata Profile

For `.mx.yaml.md` files that describe folders:

| Field | Value Type | Description |
| --- | --- | --- |
| `folderType` | identifier | What kind of folder (e.g. `project`, `archive`, `config`) |
| `stability` | enum | `experimental` / `evolving` / `stable` / `frozen` |
| `lifecycle` | enum | `active` / `maintenance` / `archived` |
| `inherits` | identifier | Parent folder's context |
| `relatedFolders` | identifier[] | Other folders related to this one |
| `dependencies` | identifier[] | Folders this depends on |
| `primaryLanguages` | identifier[] | Programming languages or content types |
| `hasSubfolders` | boolean | Whether this folder has children |

#### Superseded Document Fields

For documents that have been replaced or are reference copies:

| Field | Value Type | Description |
| --- | --- | --- |
| `superseded-by` | uri | Path to the replacement document |
| `canonical-source` | uri | Path to the authoritative version (for reference copies) |
| `supersedes` | free text or array | What this document replaces |

---

## 21. Script Metadata — Comment-Block Frontmatter

**Field Dictionary:** The complete script metadata specification, including field definitions and parsing rules for all carrier formats, is in `fields.cog.md` Sections 12.6 and 13. This section provides the architectural overview.

Cogs are markdown files with YAML frontmatter. Scripts are not markdown — but they still need machine-readable metadata. This section defines the standard for embedding cog-compatible metadata in shell scripts (and any `#`-comment language) using comment blocks.

### Why Scripts Need Metadata

The same problem that cogs solve for documents applies to scripts. An AI agent encountering a shell script has no structured context — it must read every line to understand what the script does, what it depends on, and whether it is safe to modify.

With script metadata, the agent reads a 12-line comment block instead of a 200-line script. This is the **cut compute** principle: give the machine enough structured context to decide what to do before it reads the implementation.

### Format

Script metadata uses `# ---` delimiters (matching YAML `---` convention) with `# key: value` lines:

```bash
#!/bin/bash
# ---
# title: "mx.ls — Directory listing"
# version: "1.0"
# created: 2026-02-10
# modified: 2026-02-10
# author: Tom Cranstoun
# description: "Wraps eza with sensible defaults and named modes"
# category: mx-tools
# status: active
# tags: [eza, ls, directory, filesystem]
# dependencies: [eza]
# builds-on: [script-helper]
# ---
```

**Parsing rule:** Strip the leading `#` and one space from each line between `# ---` delimiters. The result is valid YAML. Any tool that parses YAML can parse script metadata.

### Required Fields

| Field | Value Type | Description |
| --- | --- | --- |
| `title` | free text | Display name of the script |
| `version` | semver | Version number |
| `created` | date | Creation date (ISO 8601) |
| `modified` | date | Last modification date |
| `author` | free text | Creator |
| `description` | free text | One-line purpose (max 160 chars) |

### Optional Fields

| Field | Value Type | Description |
| --- | --- | --- |
| `category` | identifier | `mx-tools` / `mx-core` / `utility` / `integration` |
| `status` | enum | `draft` / `active` / `deprecated` |
| `tags` | identifier[] | Searchable keywords |
| `dependencies` | identifier[] | External tools required (e.g. `eza`, `git`, `node`) |
| `builds-on` | identifier[] | MX cogs this script relates to |

### The Cut Compute Principle

When an AI agent needs to work with a script, the workflow is:

1. **Read metadata only** — the comment-block frontmatter tells the agent what the script does, its dependencies, and its status
2. **Read skeleton if needed** — the `mx.inspect.sh` tool extracts comments and structural skeleton (function signatures, control flow, variable declarations) without implementation lines
3. **Read full script only if necessary** — most tasks (updating metadata, adding a function, understanding purpose) do not require reading every line

This three-tier approach reduces token consumption by 60-85% for typical script interactions. At scale across an organisation's tooling, this is significant.

### Script Inspection Tool

The companion tool `mx.inspect.sh` extracts a structural skeleton from any shell script:

```bash
mx.inspect.sh path/to/script.sh
# Output: /tmp/script.sh.inspect.txt
```

The inspection output contains:

- All comment lines (preserving structure and grouping)
- The shebang line
- Function signatures (`function foo()` / `foo() {`)
- Case/esac structure (case statements, branch patterns)
- Control flow headers (if/then/elif/else/fi, while/for/do/done)
- Top-level variable assignments
- No implementation lines

The inspection file is what the AI agent reads first. It provides intent (comments), shape (structure), and identity (metadata) — the three things an agent needs to make decisions.

### Applicability Beyond Bash

This convention works for any language that uses `#` for comments: Python, Ruby, Perl, YAML configuration files, Dockerfiles. The format is identical — `# ---` delimiters, `# key: value` lines. The parsing rule is the same.

For languages using other comment styles (`//`, `/* */`, `--`), the same fields and structure apply — only the comment prefix changes. Implementations should support at minimum `#` and `//` prefixed metadata blocks.

---

*MX Cog Unified Specification v2.1-draft — 15 February 2026*

*Governed by The Gathering. MIT Licensed.*

*"The standard belongs to the community."*
