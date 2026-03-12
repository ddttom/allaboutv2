---
version: "1.0"
description: "ADR #1: Replace two cog types (info-doc/action-doc) with one document type containing open-ended blocks."
created: 2026-02-12
modified: 2026-02-13
author: Tom Cranstoun and Maxine

mx:
  name: block-architecture-decision
  license: proprietary
  status: accepted
  category: architecture
  partOf: mx-the-gathering
  tags: [adr, block-architecture, specification, evolution, webmcp, privacy, registry]
  audience: [developers, investors, business]
  adr:
    number: 1
    title: "Block Architecture — One Doc with Blocks"
    status: accepted
    date: 2026-02-12
    context: "The cog specification had two types: info-doc and action-doc. This was the wrong cut."
    decision: "Replace two cog types with one document type containing open-ended blocks."
    consequences: "Replaces cog-unified-spec v1.0. Affects books, pitches, and The Gathering's standard."

  buildsOn: [what-is-a-cog, what-is-mx-os]

  blocks:
    - prose:
        description: "The architectural decision narrative — what changed, why, and what it means."
    - definition:
        standards:
          - name: "The Gathering"
            version: "2.0-draft"
            scope: "cog metadata format, block types, reader behaviour"
          - name: "WebMCP"
            version: "W3C Draft 2026-02-12"
            scope: "HTML blocks — callable tools for AI agents"
            reference: "https://webmachinelearning.github.io/webmcp/"
          - name: "Schema.org"
            scope: "Structured data in definition blocks"
          - name: "JSON-LD"
            scope: "Linked data in HTML blocks"
        validation:
          - "All blocks must be ignorable by readers that don't understand them"
          - "Native metadata format must be preserved (YAML for .md, meta tags for .html, EXIF for images)"
          - "Backward compatibility: .cog.html must be valid HTML, .cog.js must be valid JS"
    - provenance:
        origin: "7-round interview session, 2026-02-12"
        participants: ["Tom Cranstoun", "Maxine"]
        source: "../deliverables/block-architecture-interview.md"

  contentType: "adr"
  runbook: "This is ADR #1 for the Maxine Lives initiative. It records the decision to move from two cog types to one document type with blocks. Read this for architectural context. For the full interview transcript, see the deliverables folder."
---

# ADR 1: Block Architecture — One Doc with Blocks

**Date:** 2026-02-12
**Status:** Accepted
**Participants:** Tom Cranstoun and Maxine

---

## Context

The cog specification had two types: info-doc (documentation) and action-doc (executable). Tom proposed adding more types — pointer docs, reference docs, code docs, HTML docs. This was the wrong direction. More types means more complexity.

The insight: there is ONE document type. It contains blocks. What blocks are present determines what the doc can do.

---

## Decision

Replace the info-doc/action-doc distinction with a single document type: `.cog.{extension}`. Any file format, made intelligent.

### One Document Type

- `README.cog.md` — a README in cog format
- `restaurant.cog.html` — a web page in cog format
- `app.cog.js` — JavaScript in cog format
- `theme.cog.css` — CSS in cog format
- `logo.cog.png` — an image in cog format

The `.cog.` is for humans. Machines read the metadata and just know.

### Native Metadata

Metadata lives in the file's own format. Not in a wrapper. Not in a sidecar.

| Format | Metadata Location |
|--------|------------------|
| Markdown | YAML frontmatter |
| HTML | `<meta>` tags, JSON-LD |
| JavaScript | Comment block (YAML) |
| CSS | Comment block (YAML) |
| Images | EXIF data |
| JSON | Top-level fields |

The cog IS the resource fork — portable and textual.

### Open-Ended Blocks

Block types are fully open. The core set is a starting point. Any implementer can define new blocks. Readers ignore blocks they don't understand.

| Block | Purpose |
|-------|---------|
| **Prose** | Human-readable narrative |
| **Essence** | The payload — the thing itself |
| **Action** | Executable procedures |
| **Code** | Actual runnable code |
| **HTML** | Web content, WebMCP callable tools |
| **Definition** | Standards manifest with validation rules |
| **Security** | Requirements for reading/executing |
| **SOP** | Standard Operating Procedures |
| **Policy** | How merging/mixing works |
| **Provenance** | Origin, history, chain of custody |
| **Version** | Version information |

### Layered Mixin Model

Three layers, applied in order on the client side:

1. **Implementation uber doc** — what MX Maxine does by default
2. **Machine uber doc** — what this instance does ($MX_HOME)
3. **Personal cogs** — what this user needs

The server never sees personal data. Personalisation happens locally.

> "Nobody sends that to the server. The old model did. Google knew. It might not be peanuts we are talking about — it might be sexual orientation."

### The Doc IS the App

`.cog.html` + `.cog.js` + `.cog.css` = a complete web application. With WebMCP (W3C draft, 2026), HTML blocks expose callable tools for AI agents.

### Reginald = npm for the Cog Web

Package registry. Signed, authenticated, or open. CDN layer serves essence, executes CDN blocks, or sends the full cog. Implementations send cog headers for content negotiation.

### Security Model

The doc declares its requirements. The reader must comply. The reader CAN be stricter but not looser.

### Standards Honouring

MX is the process of honouring all existing and future standards. RDF, JSON-LD, Schema.org, WebMCP — all absorbed as valid block formats. The definition block declares conformance with validation rules.

### Block Inheritance

`builds-on` has two modes:

- **Soft context** — "read these first" (existing model)
- **Hard template inheritance** — inherit blocks from parent, override/extend (new)

### Backward Compatibility

- `.cog.html` is valid HTML
- `.cog.js` is valid JavaScript
- `.cog.md` is valid markdown
- Existing `.cog.md` files need only small additions

---

## What Changed

| Before | After |
|--------|-------|
| Two types: info-doc, action-doc | One type: `.cog.{extension}` with blocks |
| Markdown only (`.cog.md`) | Any file format (`.cog.html`, `.cog.js`, `.cog.css`, `.cog.png`) |
| Wrapper/sidecar metadata | Native metadata (EXIF, meta tags, YAML, comments) |
| Document describes an app | Document IS the app |
| Reginald is a registry | Reginald is npm for the cog web |
| Companion web alongside pages | The page itself is a cog |

---

## Consequences

- **Replaces** cog-unified-spec v1.0
- **Affects** The Handbook (2 Apr) and The Protocols (1 Jul)
- **Affects** investor pitch and Frankfurt demo
- **Affects** The Gathering's standard
- **Requires** new specification, evolution document, messaging updates, first `.cog.html` example

---

## Business Separation

**CogNovaMX Ltd** builds and sells Maxine — the reference implementation. Commercial.

**The Gathering** owns the open standard. Uncontrolled by CogNovaMX. Tom set it up. He wants to give the techniques away. A truly open community takes it forward. The W3C model.

---

*"I have reinvented the internet in a backward compatible way."*
