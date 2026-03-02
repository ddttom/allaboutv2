---
description: Content metadata expert, author of "No More Silos"
author: Tom Cranstoun
created: 2026-02-09

mx:
  name: michael-andrews
  contentType: contact
  category: contact
  tags: [contact, collaborator, metadata, content-strategy]
  relationship: collaborator
  status: active
  organisation: Independent consultant
  context: Wrote the definitive work on content metadata and structured content strategy. His "No More Silos" thinking is the intellectual predecessor to the companion web.
  messages:
    - file: messages/message-michael-andrews.md
      date: 2026-02-09
      type: pre-call-briefing
      status: sent
      note: Pre-call briefing sent. Companion web, bidirectional model, app, green angle.
    - date: 2026-02-09
      type: reply
      status: received
      note: Michael read the briefing in VS Code. Compared cogs to Solid Project pods. Asked about controlled values in YAML frontmatter — kebab-case vs free text, and whether only agents or also non-AI programs evaluate header values. Wants a meeting on the calendar.
    - date: 2026-02-09
      type: reply
      status: sent
      note: Tom replied. Clarified cogs vs pods — modular/granular vs monolithic, agent-orchestrated vs user-hosted. Acknowledged YAML schema question — kebab-case for control directives, free text for content metadata — should separate more explicitly in schema.
  next-action: Schedule Zoom call — Michael is ready to meet
---

# Michael Andrews

Michael wrote the book on content metadata. His "No More Silos" work is about breaking down content silos through structured metadata — the same problem the companion web solves, but for a new audience: AI agents.

## Relationship

Professional. Michael accepted a Zoom call after the initial outreach. He knows the basics — cogs, the metadata format, The Gathering. The pre-call briefing added the companion web, bidirectional model, app, and green angle. He has now read the briefing and replied with substantive questions.

## What we want from Michael

His perspective on the companion web framing. He has spent his career thinking about how metadata makes content work across systems. The companion web is that same problem — but the systems are now AI agents, phones, and robots. We want to know if the framing lands, what holes he sees, and where "No More Silos" thinking applies to this new audience.

## Michael's Feedback (9 Feb 2026)

Michael read the briefing in VS Code. Two key observations:

### 1. Solid Project Comparison

Michael noted that cogs are "similar in intent, though not in implementation" to Solid pods (https://solidproject.org/). Tom's response: the difference is granularity and orchestration. Solid pods are monolithic personal data stores (one pod per user). Cogs are modular, specialised, and agent-orchestrated — a user has separate cogs for content, commerce, identity, compliance, each with its own logic and permissions. The tradeoff: cogs require more explicit governance for inter-cog data flow.

### 2. YAML Frontmatter Controlled Values

Michael asked about where and how to store controlled values for YAML frontmatter — some are kebab-case (control directives), others are free text (content attributes). He asked whether only agents or also non-AI programs evaluate these. Tom's response: both evaluate, but for different purposes. Kebab-case attributes are control directives (system-processable). Free text is content metadata. The schema should separate these more explicitly.

**This is a real spec question.** The cog-unified-spec should clarify which fields use controlled vocabularies vs free text, and signal this to implementers.

## Zoom Call Agenda

Topics to cover, informed by Michael's questions and the decisions made since:

### 1. Cogs vs Solid Pods — Positioning

Michael compared cogs to Solid Project pods. The differentiators:

- **Granularity**: Solid = one pod per user. Cogs = modular, one per domain (content, commerce, identity, compliance).
- **Orchestration**: Solid = user manages. Cogs = agent-orchestrated, contextual sharing.
- **Governance**: Solid = pod-level access. Cogs = per-cog access with guardrail pattern, cascading gates.
- **Format**: Solid = linked hub-content/RDF. Cogs = YAML + markdown. Lower barrier, wider tooling.

Ask Michael: does the Solid comparison help or hinder positioning? Should we reference it or avoid it?

### 2. Two Naming Conventions — The Answer

Michael asked about camelCase vs kebab-case. The answer is: **two specs, two conventions, both correct in context.**

- **MX Code Metadata Spec** (HTML/JSON-LD attributes): `camelCase` — `mx:verifiedBy`, `mx:reviewDate`. Follows Schema.org/JSON-LD conventions.
- **Cog Unified Spec** (YAML frontmatter field names): `kebab-case` — `builds-on`, `reading-level`, `next-action`. Standard YAML practice.

Both are correct because they operate in different formats. HTML attributes follow JSON-LD conventions. YAML frontmatter follows YAML conventions.

### 3. Controlled Values — Now in the Spec

Michael's question prompted a spec update. The cog-unified-spec now includes:

- **Value Type taxonomy**: every field is classified as `identifier` (kebab-case slug), `free text`, `enum`, `date`, `semver`, `uri`, `email`, `boolean`, or `object`.
- **Explicit note**: both AI agents AND non-AI programs evaluate frontmatter values. Controlled values are machine-processable. Free text is for human context.
- Applied to all field tables (Required, Optional, Contact Profile, Execute Object, Actions, Extensions).

Show Michael the updated spec. Ask: does this address his question? What would he add?

### 4. The Companion Web — His Expertise

The core question we wanted Michael's perspective on:

- Does the companion web framing land? QR codes → landing pages → cog metadata → agent understands.
- Where does "No More Silos" thinking apply to this new audience (AI agents, robots, phones)?
- What holes does he see in the metadata model?

### 5. The Gathering — Potential Role

Is Michael interested in reviewing the spec as a practitioner? His metadata expertise makes him an ideal early reviewer. Not asking for endorsement — asking for sharp critique.

## History

- Initial outreach: Accepted Zoom call
- Pre-call briefing: Sent (message-michael-andrews.md)
- 9 Feb 2026: Michael read briefing, replied with Solid comparison and YAML schema question
- 9 Feb 2026: Tom replied — clarified cogs vs pods, acknowledged schema question
- 9 Feb 2026: Spec updated with Value Types based on Michael's question
- Next: Schedule Zoom call
