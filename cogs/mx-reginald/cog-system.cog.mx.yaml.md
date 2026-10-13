---
description: "The first COG registered in REGINALD. Self-describing: a COG that documents the COG system itself, with human narrative and links to MX Holdings, MX Books, and MX Reginald."

title: COG System Overview
author: Tom Cranstoun
created: '2026-03-01'
type: cog-document
mx:
  mxSpecVersion: "0.9"
  file:
    name: "cog-system.cog.md"
    format: "text/markdown"
    frontmatter: "YAML (certificate + governance headers)"
    encoding: "UTF-8"
    language: "en"
  x-mx-scope: "system-overview"
  summary: >-
    Opens with "You're reading one right now" and explains what a COG is. It sets out the problem through two
    examples (a Danube cruise priced at £2,030 read as £203,000, and a developer's 40,000-token cascade) and the
    solution: verified documents for humans and machines alike. It covers the two strands of the COG record
    (attestation and stewardship metadata), the gear metaphor behind the name, the lifecycle and the compliance
    levels in plain language, where COGs live under allabout.network/cogs/, the MX ecosystem and The Gathering,
    and closes with key dates and further reading. It links to MX Holdings, MX Books, MX Reginald Ltd, the COG
    specification, the grant application and the public explainer.
  lifecycle:
    created: "2026-02-08"
    author: "Tom Cranstoun"
    co_author: "Claude Opus 4.6 (Maxine)"
    reviewCycle: "monthly"
    next_review: "2026-03-08"
    updateTriggers:
      - "COG specification version change"
      - "MX ecosystem company changes"
      - "book publication dates change"
      - "signing engine processes first document"
  x-mx-regeneration:
    prompt: "Create a self-describing COG document that explains the COG system (Community Owned Governance Standard). Must include rich human narrative with real-world examples (cruise pricing, developer token waste). Links to MX Holdings, MX Books, and MX Reginald. Follow the COG specification at reginald/cog-specification.md. Status: draft, unsigned, Level 2 compliance. COGs live at allabout.network/cogs/{client-id}/{subject}.cog.md — no dot prefix."
    sources:
      - "reginald/cog-specification.md"
      - "reginald/README.md"
      - "reginald/grant/README.md"
      - "reginald/grant/public-explainer.md"
  refersTo:
    specification: "reginald/cog-specification.md"
    registry_root: "cogs/"
    client_directory: "cogs/mx-reginald/"
    company: "reginald/README.md"
  canonicalUri: https://raw.githubusercontent.com/ddttom/allaboutv2/main/cogs/mx-reginald/cog-system.cog.mx.yaml.md
---

# COG System Overview — MX Metadata

Metadata for `cog-system.cog.md`, the first COG registered in REGINALD.

## Regeneration

If the COG document is lost, it can be recreated from this metadata using the regeneration prompt and source files listed above.

## Status

- **Current**: Draft (unsigned, Level 2)
- **Next milestone**: Signing (Level 3) when Signing Engine processes first production document
- **Target**: Level 4 (signed + registered) by CMS Summit Frankfurt, 12 May 2026
