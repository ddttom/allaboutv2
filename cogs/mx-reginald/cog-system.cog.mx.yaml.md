---
mx:
  version: "1.0"
  type: "cog-document"
  name: "COG System Overview"
  description: "The first COG registered in REGINALD. Self-describing: a COG that documents the COG system itself, with human narrative and links to MX Holdings, MX Books, and MX Reginald."

  file:
    name: "cog-system.cog.md"
    format: "text/markdown"
    frontmatter: "YAML (certificate + governance headers)"
    encoding: "UTF-8"
    language: "en"

  cog_metadata:
    id: "cog-mx-reginald-cog-system-20260208"
    publisher: "MX Reginald Ltd"
    subject: "COG Document System"
    category: "specification"
    scope: "system-overview"
    status: "draft"
    compliance_level: 2
    signature: "unsigned"

  content_summary:
    narrative_sections:
      - "What is a COG (opens with 'You're reading one right now')"
      - "The problem (Danube cruise £2,030→£203,000, developer 40,000-token cascade)"
      - "The solution (verified documents for both humans and machines)"
      - "The two layers (Certificate of Genuineness + Contract of Governance)"
      - "Why COG (gear metaphor)"
      - "The lifecycle (7 stages, explained in plain language)"
      - "Five compliance levels (Basic through Audited)"
      - "Where COGs live (allabout.network/cogs/ path)"
      - "The MX ecosystem (Holdings, Books, what exists today)"
      - "The community (The Gathering)"
      - "Key dates and further reading"
    links_to:
      - "MX Holdings (three companies)"
      - "MX Books (Handbook April 2026, Codex July 2026)"
      - "MX Reginald Ltd (operating company)"
      - "COG specification (full technical reference)"
      - "Grant application (investor pitch)"
      - "Public explainer (plain language)"

  lifecycle:
    created: "2026-02-08"
    author: "Tom Cranstoun"
    co_author: "Claude Opus 4.6 (Maxine)"
    review_cycle: "monthly"
    next_review: "2026-03-08"
    update_triggers:
      - "COG specification version change"
      - "MX ecosystem company changes"
      - "book publication dates change"
      - "signing engine processes first document"

  regeneration:
    prompt: "Create a self-describing COG document that explains the COG system (Certificate of Genuineness / Contract of Governance). Must include rich human narrative with real-world examples (cruise pricing, developer token waste). Links to MX Holdings, MX Books, and MX Reginald. Follow the COG specification at reginald/cog-specification.md. Status: draft, unsigned, Level 2 compliance. COGs live at allabout.network/cogs/{client-id}/{subject}.cog.md — no dot prefix."
    sources:
      - "reginald/cog-specification.md"
      - "reginald/README.md"
      - "reginald/grant/README.md"
      - "reginald/grant/public-explainer.md"

  related:
    specification: "reginald/cog-specification.md"
    registry_root: "cogs/"
    client_directory: "cogs/mx-reginald/"
    company: "reginald/README.md"
---

# COG System Overview — MX Metadata

Metadata for `cog-system.cog.md`, the first COG registered in REGINALD.

## Regeneration

If the COG document is lost, it can be recreated from this metadata using the regeneration prompt and source files listed above.

## Status

- **Current**: Draft (unsigned, Level 2)
- **Next milestone**: Signing (Level 3) when Signing Engine processes first production document
- **Target**: Level 4 (signed + registered) by CMS Summit Frankfurt, 12 May 2026
