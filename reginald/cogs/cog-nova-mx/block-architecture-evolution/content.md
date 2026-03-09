---
version: "1.0"
description: "How the cog format evolved from two document types to one document with blocks — the architectural journey, the design principles, and what it means for implementations."
created: 2026-03-03
modified: 2026-03-04
author: Tom Cranstoun and Maxine

mx:
  license: proprietary
  status: draft
  category: mx-core
  partOf: mx-the-gathering
  buildsOn: [cog-unified-spec, adr-01-block-architecture]
  refersTo: [ndr-01-block-naming, adr-02-namespace-policy]
  tags: [blocks, architecture, evolution, specification, history, design]
  audience: [humans, agents]
  contentType: specification
---

# Block Architecture Evolution

How the cog format went from two document types to one document with blocks — and why this matters for everyone building on the standard.

---

## The Problem: Two Types Was the Wrong Cut

The cog specification v1.0 defined two document types:

- **Info-doc** — documentation, reference material, knowledge
- **Action-doc** — executable procedures, runbooks, automations

This seemed natural. Documents either describe or do. But Tom saw the problem quickly: real documents are not either/or. A restaurant's web page describes the menu (info) and takes bookings (action). A product specification explains features (info) and includes validation code (code). A README teaches a developer (prose) and contains installation commands (action).

The two-type model forced a choice that did not reflect reality. Worse, it invited more types. Pointer docs. Reference docs. Code docs. HTML docs. Every new use case demanded a new category. This path led to complexity without end.

> "I have reinvented the internet in a backward compatible way."
> — Tom Cranstoun, 12 February 2026

---

## The Journey: From Types to Blocks

### The Interview (12 February 2026)

Tom and Maxine conducted a seven-round interview session that produced the architectural breakthrough. The full transcript is preserved in `mx-canon/mx-maxine-lives/deliverables/block-architecture-interview.md`.

The core insight emerged in the first round:

> "One doc to rule them all. No variations is absurdly simple."

There is not a taxonomy of document types. There is ONE document type. It contains blocks. What blocks are present determines what the document can do. A cog is not a different kind of thing from a README — it IS a README, in cog format. Or a web page. Or a JavaScript module. Or an image.

### The Decision (ADR #1, 12 February 2026)

The insight was formalised as Architecture Decision Record #1 (`mx-canon/mx-the-gathering/architecture-decisions/adr-01-block-architecture.cog.md`). Status: Accepted.

**Decision:** Replace two cog types with one document type — `.cog.{extension}` — containing open-ended blocks.

### The Spec Update (v2.0-draft → v2.1-draft)

The cog-unified-spec was rewritten to reflect the block architecture. Section 3 defines the block types. The field dictionary (`mx-canon/ssot/fields.cog.md`) was updated with machine-parseable definitions for every block field.

---

## The Insight: One Document, Many Blocks

A cog is a single document that may contain any combination of typed blocks. Each block serves a different purpose, a different audience, a different capability level.

Think of it like a gem with facets. The same object, viewed from different angles, reveals different surfaces. A human reads the prose block. A search engine reads the definition block. An AI agent reads the action block. A browser renders the HTML block. None of them needs all the blocks. Each takes what it understands and ignores the rest.

This is the principle of **reader agency**: the document declares what it contains; the reader decides what to use.

---

## The Block Types

The specification defines ten block types. This list is a starting point, not a ceiling — the architecture is deliberately open-ended. Readers ignore blocks they do not understand.

| Block | Purpose | Key Property |
|-------|---------|-------------|
| **Prose** | Human-readable narrative | Implicit — the markdown body of every `.cog.md` file |
| **Essence** | Binary content (images, audio, video, PDFs) | Base64 inline (up to 2 KB) or pointer (above 2 KB) |
| **Definition** | Standards conformance declarations | Hierarchical — document-level default, per-block override |
| **Action** | Executable instructions (the `execute` block) | Makes a cog an action-doc. Runtime, policy, actions array |
| **Code** | Machine-addressable source code | Unlike prose code blocks, these can be extracted and run |
| **HTML** | Web content, potentially with WebMCP routines | Inter-block access to all other blocks (governed by security) |
| **Security** | Trust and execution policy | Reader agency — the cog states requirements, the reader decides |
| **SOP** | Standard Operating Procedures | Virtual — merged at read-time from the uber doc, not on disk |
| **Provenance** | Origin, lineage, chain of custody | Where content came from and how it was transformed |
| **Version** | Detailed changelog | Complements the top-level `version` field with full history |

### Blocks in YAML

Blocks live in the YAML frontmatter as an array under `blocks:`:

```yaml
mx:
  blocks:
    - definition:
        standards:
          - name: "The Gathering"
            version: "2.0-draft"
    - security:
        signing: required
        execution: sandboxed
        trust-level: 3
    - provenance:
        origin: "https://example.com/source"
        derived-from: "original-spec.cog.md"
        method: "Extracted and restructured"
        date: 2026-02-13
```

The prose block is never declared — it is the markdown body itself. The action block is the `execute` object. All other blocks are explicit entries in the array.

---

## Design Principles

### Open-Ended Blocks

The block list is not fixed. Any implementer can define new block types. The core ten are a starting vocabulary. Future standards (WebMCP, new W3C specifications, industry-specific schemas) become new block types without changing the architecture.

### Reader Agency

The document declares. The reader decides. A security block says "signing required" — but the reader chooses whether to enforce that requirement. The document's role is to be honest about what it contains and what it expects. The reader's role is to apply its own policies.

### Native Metadata

Metadata lives in the file's own format. Not in a wrapper. Not in a sidecar.

| Format | Metadata Location |
|--------|------------------|
| Markdown (`.cog.md`) | YAML frontmatter |
| HTML (`.cog.html`) | `<meta>` tags, JSON-LD |
| JavaScript (`.cog.js`) | Comment block (YAML) |
| CSS (`.cog.css`) | Comment block (YAML) |
| Images (`.cog.png`) | EXIF data |
| JSON (`.cog.json`) | Top-level fields |

The cog IS the resource fork — portable and textual. The metadata travels with the essence. No sidecar files. No wrappers.

### Virtual SOP Blocks

SOPs are not stored in individual cog files. They live in the **uber doc** — the implementation's master set of operating procedures. When an MX implementation reads a cog, it merges the relevant SOPs at read-time. The file stays clean. The procedures are always current. Different implementations can have different SOPs for the same cog.

### The Layered Mixin Model

Three layers, applied in order on the client side:

1. **Implementation uber doc** — what MX Maxine does by default
2. **Machine uber doc** — what this instance does (`$MX_HOME`)
3. **Personal cogs** — what this user needs

The server never sees personal data. Personalisation happens locally. Privacy by architecture.

---

## What Changed

| Before (v1.0) | After (v2.1-draft) |
|----------------|---------------------|
| Two types: info-doc, action-doc | One type: `.cog.{extension}` with blocks |
| Markdown only (`.cog.md`) | Any file format (`.cog.html`, `.cog.js`, `.cog.css`, `.cog.png`) |
| Wrapper/sidecar metadata | Native metadata (EXIF, meta tags, YAML, comments) |
| Document describes an app | Document IS the app |
| Reginald is a registry | Reginald is npm for the cog web |
| Companion web alongside pages | The page itself is a cog |
| Fixed categories | Open-ended block types |
| Server-side personalisation | Client-side layered mixin model |

### Backward Compatibility

Nothing breaks:

- `.cog.md` is valid markdown — any markdown renderer can read it
- `.cog.html` is valid HTML — any browser can render it
- `.cog.js` is valid JavaScript — any runtime can execute it
- Existing `.cog.md` files need only small additions to gain block capabilities

The `.cog.` infix is for humans. Machines read the metadata and just know.

---

## The Naming Decision

The architecture uses the word "block" for these typed sections. Early feedback identified a risk: confusion with blockchain technology. The concepts are entirely unrelated, but the word overlap could cause misunderstanding with investors, business audiences, and the general public.

NDR #1 (`mx-canon/mx-the-gathering/naming-decisions/ndr-01-block-naming.cog.md`) evaluated alternatives. The advisory board reviewed the options and resolved the naming decision on 3 March 2026. The term **block** is retained — it is the most widely understood term for typed sections within a document, and the blockchain association is a manageable disambiguation rather than a fundamental confusion.

The "facet" alternative was considered — a surface of a gem, the same object seen from a different angle — but "block" won on clarity and familiarity. The architecture documentation, specifications, and code all use "block" as the canonical term.

---

## Implementation Status

| Component | Status | Location |
|-----------|--------|----------|
| Specification (block types defined) | Done | `cog-unified-spec.cog.md` Section 3 |
| Field dictionary (block fields) | Done | `fields.cog.md` blockTypes array |
| ADR #1 (decision record) | Accepted | `adr-01-block-architecture.cog.md` |
| NDR #1 (naming decision) | Proposed | `ndr-01-block-naming.cog.md` |
| Namespace policy (ADR #2) | Accepted | `adr-02-namespace-policy.cog.md` |
| Interview transcript | Preserved | `block-architecture-interview.md` |
| Reader implementations | Not started | — |
| WebMCP integration | Awaiting W3C | — |
| `.cog.html` example | Not started | — |
| Block inheritance (hard template) | Specified, not implemented | — |

---

## What This Means

For **authors**: Write one document. Add blocks as needed. A simple README with just prose and a definition block is a valid cog. A complex action-doc with security, provenance, and code blocks is also a valid cog. Same format, different depth.

For **implementers**: Read the blocks you understand. Ignore the rest. A basic reader processes prose and definition blocks. An advanced reader handles action, code, and HTML blocks. Both are correct. The architecture scales with the reader's capability.

For **the standard**: The block architecture is deliberately open. New block types can be added by anyone, for any purpose, without changing the specification. The standard grows through practice, not through committee.

---

*"One doc to rule them all. No variations is absurdly simple."*
