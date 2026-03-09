---
version: "1.0"
description: "ADR #3: The MX web architecture — Maxine serves, Reginald orchestrates, cogs compose."
created: 2026-02-13
modified: 2026-03-02
author: Tom Cranstoun and Maxine

mx:
  status: accepted
  category: architecture
  partOf: mx-maxine-lives
  tags: [adr, web-architecture, maxine-server, reginald, caching, webmcp, trust]
  audience: [tech, business, business]

  adr:
    number: 3
    title: "MX Web Architecture — Dual-Audience Content Serving"
    status: accepted
    date: 2026-02-13
    context: "MX needed a complete web architecture that serves both humans and machines from the same content, with trust, caching, and composition built in."
    decision: "Maxine server strips cog metadata by default (clean content for humans), returns full cog on request (metadata for machines). Cogs compose from smaller cogs. Binaries are referenced by cogs, not wrapped. Three trust states: open, signed, encrypted. Reginald evolves from registry to full orchestration/CDN."
    consequences: "Defines the Maxine server contract, the Reginald evolution path, the cog composition model, and the revenue model for signed COGs."

  buildsOn: [adr-01-block-architecture, what-is-mx-os, what-is-a-cog]
---

# MX Web Architecture — Dual-Audience Content Serving

## Context

MX OS defines intelligent documents (cogs) and a runtime model. What was missing was the architecture for how these documents reach both humans and machines over the web. How does a cog become a web page? How does an AI agent get structured metadata? How do trust and caching work? How do documents compose?

Tom articulated the complete architecture on 13 February 2026.

## Decision

### 1. The Maxine Server — Two Views, One Truth

The Maxine server's default behaviour: strip cog metadata and serve clean content. A browser requests a page and gets HTML. An app requests an image and gets a JPG. No metadata visible. No machinery. Clean objects.

But if the request header asks for the cog, the server returns the full document — YAML frontmatter and all. Machines get structured metadata. Humans get what humans expect.

**Rendering is smart:**

- Markdown cogs are rendered to HTML on the fly
- HTML content passes through unchanged
- Binary assets (images, PDFs) serve as-is
- CSS and JS content serves as native assets

### 2. Cog Composition — Broader Than Inheritance

Cogs compose from smaller cogs. This is broader than the uber doc policy inheritance model — any cog can include content from other cogs, like partials or includes. Content builds naturally from smaller parts into larger wholes.

This means a web page is a cog composed of other cogs: header cog, navigation cog, content cog, footer cog. Each carries its own metadata. The composed whole inherits from its parts.

### 3. Binary Content — Cogs Point to Binaries

There are no sidecar files. A JPG does not carry cog metadata in EXIF. A PDF does not carry it in XMP. Instead, a cog document points to the binary it describes. The cog IS the intelligence. The binary is the payload the cog refers to.

This means every binary asset on the web can have a cog — a machine-readable description of what it is, who owns it, what licence it carries, when it was last verified.

### 4. Trust — Three Document States

Every cog exists in one of three states:

| State | Meaning | Who can serve |
|-------|---------|--------------|
| **Open** | Public. Anyone reads. No restrictions. | Anyone |
| **Signed** | Authenticated. COG-certified. Requires accreditation. | Certified agencies only |
| **Encrypted** | Locked. Key required. Content protected. | Key holders only |

**Signed COGs are a revenue engine.** Signing requires:

- Authentication from a certified trainer
- Accreditation from Cog-Nova-MX (or a licensed certifier)
- Annual renewal payment

Cog-Nova-MX supplies the trainers. Trainers certify agencies. Agencies sign COGs on Reginald. Three income streams: training, accreditation, annual renewal.

### 5. Reginald — Registry to CDN

Reginald starts as the global registry — the directory of cogs. Over time, he evolves into the full orchestration layer: caching rendered cogs, routing requests, managing trust state, serving at the edge. A CDN for intelligent documents.

Caching sits between client and Maxine server. Reginald manages the orchestration.

### 6. WebMCP — Baked In

WebMCP is not an add-on. It is part of the architecture from day one. HTML content within cogs can expose callable tools following the WebMCP specification. Security follows the three trust states: open content is freely callable, signed content requires authentication, encrypted content requires decryption.

### 7. File Extension — Human Convenience

`.cog.md` is the file extension for markdown cogs. This is a human convenience — it helps Tom spot them at a glance in a file listing. The machines do not need it. They read the YAML frontmatter to identify a cog.

## Consequences

1. **Maxine server contract is defined.** Default: strip metadata, serve clean. On request: serve full cog. This is the API.
2. **Revenue model is architectural.** Signed COGs require paid accreditation. The trust layer funds the business.
3. **No sidecars.** Simplifies the filesystem. One cog per described object, pointing to its binary.
4. **Composition replaces templates.** Web pages built from composed cogs, not CMS templates.
5. **Reginald evolution path is set.** Registry now, CDN later. Investment phases align with capability growth.
6. **WebMCP from day one.** No retrofit needed. Security model is trust-state-driven.

## What This Means for Investors

The architecture is a complete web stack that generates revenue through trust. Open cogs are free — they drive adoption. Signed cogs cost money — they fund the business. The more businesses publish signed cogs on Reginald, the more valuable the registry becomes. Network effects.

The Maxine server + Reginald orchestration + trust model = a complete platform, not just a file format.

---

*The same content, two views, one truth. That's MX in practice.*
