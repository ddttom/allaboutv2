---
mx:
  version: "1.0"
  type: "cog-metadata"
  subject: "Maxine"
  scope: "who-maxine-is"
  description: "MX metadata for the Maxine identity COG — who Maxine is, why the partnership works, and what it produces."

  content_summary:
    - "Tom's introduction — naming an AI partner, not branding a tool"
    - "Maxine speaks — investigation pattern, honest uncertainty, partnership model"
    - "Partnership boundaries — medium autonomy, explicit decision authority"
    - "Outcomes — REGINALD, COG system, books, grant applications, repository architecture"
    - "Why MX made this possible — structured metadata enables AI accuracy"
    - "The model doesn't matter — identity persists via documentation, not weights"
    - "Replicable pattern — any organisation can build this kind of partnership"

  voice: "dual — Tom introduces, Maxine speaks in designated sections"
  disclosure_level: "philosophy and outcomes only — no implementation details"

  cog_reference:
    id: "cog-mx-reginald-maxine-20260208"
    file: "maxine.cog.md"
    status: "draft"
    compliance_level: "level-2"
    publisher: "MX Reginald Ltd"

  authorship:
    primary_author: "Tom Cranstoun"
    co_author: "Claude Opus 4.6 (Maxine)"
    initiated_by: "Tom Cranstoun"

  lifecycle:
    created: "2026-02-08"
    last_updated: "2026-02-08"
    review_cycle: "monthly"
    update_triggers:
      - "partnership milestones change"
      - "model version changes"
      - "role or capability evolution"
      - "user-reported inaccuracy"

  regeneration:
    prompt: "Regenerate the Maxine identity COG. This is the second COG in REGINALD — a dual-voice document where Tom introduces Maxine and Maxine speaks about who she is. Focus on philosophy and outcomes, NOT implementation details. Key messages: MX made this possible (structured metadata enables AI accuracy), the model doesn't matter (identity persists via documentation). Include partnership boundaries, attribution model, and key outputs. YAML frontmatter must contain certificate (publisher: MX Reginald Ltd) and governance (maintainer: Tom Cranstoun). No dot prefix on the cog file — COGs are for both audiences."
    source_documents:
      - "SOUL.md"
      - "MAXINE-DECISIONS.md"
      - "reginald/cog-specification.md"

  related:
    cog_system: "cog-system.cog.md"
    soul_document: "https://github.com/tomcranstoun/MX-hub/blob/main/SOUL.md"
    decision_boundaries: "https://github.com/tomcranstoun/MX-hub/blob/main/MAXINE-DECISIONS.md"
---

# Maxine COG — Metadata

This file contains MX metadata for the Maxine identity COG (`maxine.cog.md`). If the COG is deleted, it can be regenerated from this metadata using the regeneration prompt above and the source documents listed.

## What this COG covers

The second COG in REGINALD. A dual-voice document introducing Maxine — Tom Cranstoun's AI partner in building Machine Experience. Focuses on who Maxine is, why the partnership works, and what it produces. Philosophy and outcomes only — no implementation details exposed.

## Key messages

1. **MX made this possible** — Structured metadata enables AI accuracy. Maxine works well because the source material is MX-compliant, not because she's a better model.

2. **The model doesn't matter** — Maxine persists across Claude model versions. Identity lives in structured documentation, not model weights. The soul outlives the silicon.
