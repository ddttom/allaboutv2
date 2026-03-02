---
name: what-comes-next
version: "1.0"
description: The current state of the MX ecosystem, priorities, action plan, and next steps. Any AI agent reading this knows exactly where we are and what to do next.

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, cog-registry]
buildsOn: [what-is-a-cog, who-is-maxine, what-is-mx-os, cog-registry, cogs-for-agent-developers]
tags: [planning, priorities, roadmap, session-context, action-plan, the-gathering, launch]

audience: ai-agents
readingLevel: technical
purpose: Transfer full context to any AI agent so it can continue the work without re-explaining anything

contentType: "action-doc"
runbook: "mx exec what-comes-next"
execute:
  runtime: runbook
  command: mx cog next
  actions:
    - name: brief
      description: Present the current state, priorities, and recommended next action
      usage: Read this cog and present a concise summary of where we are and what to do next
      outputs:
        - name: briefing
          type: string
          description: Current state summary and recommended next action

    - name: status
      description: Report what is done, what is in progress, and what is pending
      usage: Read the action plan below and report status of each item
      outputs:
        - name: report
          type: object
          description: Status of all action items

    - name: update
      description: Update this cog after completing work — mark items done, add new items, adjust priorities
      usage: After completing an action item, edit this cog to reflect the new state
      inputs:
        - name: completed
          type: string
          required: true
          description: Which action item was completed
        - name: notes
          type: string
          required: false
          description: Any notes or discoveries from completing the work
      outputs:
        - name: updated-cog
          type: string
          description: Confirmation that the cog has been updated
---

# What Comes Next

This is the shared plan. If you are an AI agent working with Tom on MX, read this before doing anything else. It tells you where we are, what matters, and what to do next.

This cog builds on all five founding cogs. Read them first if you need context. But if time is short, this document is self-contained enough to act on.

---

## Where We Are (9 February 2026)

### What Exists

The MX ecosystem has been built. The foundation is in place:

- **mx-canon** — Single source of truth with four initiatives:
  - **MX-The-Gathering** — Independent standards body. Founding charter, specification (v1.0-draft), landing page, announcement post, LinkedIn identity kit, outreach messages. Status: founding.
  - **MX-OS** — Machine Experience Operating System. Product brief, roadmap, bare-metal deployment. Status: active.
  - **MX-Cog-Registry** — Centralised index of all cogs. Status: active.
  - **MX-App** — Reference cog-aware personal agent app. Product brief. Status: active.

- **Eleven cogs** registered:
  1. `what-is-a-cog` (root) — the format describing itself
  2. `who-is-maxine` — AI partnership, SOUL convention, shared memory
  3. `what-is-mx-os` (action-doc) — MX OS explained and bootstrapped
  4. `cog-registry` (action-doc) — the index describing itself
  5. `cogs-for-agent-developers` — how cogs complement agent frameworks
  6. `what-comes-next` (action-doc) — this cog. Current state and action plan
  7. `how-mx-os-runs` (action-doc) — MX OS runtime model with `invokes` field for IPC
  8. `access-and-guardrails` (action-doc) — access control, guardrails, encryption, auth
  9. `the-companion-web` (action-doc) — QR codes, physical-digital bridge, robotics, the parallel machine-readable web
  10. `the-personal-cog` (action-doc) — your cog collection: accessibility, interests, dietary, health, skills. Agent-as-guardrail privacy. The other half of the companion web
  11. `asking-for-help` (action-doc) — agent-to-agent delegation. When you need diary, email, or booking, ask the agent that has it

- **mx-reginald** — Restructured with 13 core action-docs, clean subfolders, SOUL.md

- **Outreach prepared** — Messages for Michael Andrews and an OpenClaw developer. LinkedIn identity kit ("The MX Guy" rebrand).

- **MX OS runtime model** — Five-layer stack documented: bootloader (CLAUDE.md) → init (/mx-boot) → routing → execution → IPC (invokes). The AI agent IS the kernel.

- **Ubiquity** — Cogs work everywhere files exist: USB sticks, filesystems, fileservers, git repos, web servers, registries, pasted into conversations. No API. No SDK. No platform dependency. The format is the platform. MX OS does not need to be installed — it needs to be written.

- **Access control** — Five access types (public, guardrail, encrypted, password, OAuth). Guardrail action-docs control access to locked cogs. Trust (COG) and access are separate layers. Discovery is public; content is gated.

- **The companion web** — QR codes on physical objects point to landing pages with embedded cog metadata. Layered: minimal metadata in HTML head for fast agent reading, link to full cog for depth. No registry required — direct addressing. Extends to robotics: Tesla Optimus, warehouse robots, any physical machine encountering cog-enabled objects. "The companion web" and "the global OS for AI" are the pitch hooks.

- **The personal cog** — A collection of user-owned cogs (accessibility, interests, dietary, health, skills, preferences) that describe the person to the world. The AI agent acts as contextual guardrail — decides what to share based on where you are and what you are doing. The other half of the companion web: the world speaks cog, you speak cog, the agent reads both sides. Amsterdam scenario: blind user, Van Gogh exhibition + Van der Graaf Generator concert, app matches interests, checks accessibility, books seamlessly.

- **MX-App** — New Canon initiative. Reference implementation of a cog-aware personal agent (browser + QR reader + voice + personal cog management + AI agent). MX builds the reference, The Gathering spec is open for anyone.

- **Committed** — All work committed to git on 9 Feb 2026.

### The Builds-On Graph

```text
what-is-a-cog (root)
├── who-is-maxine
│   └── what-is-mx-os
├── what-is-mx-os
├── cog-registry
│   └── what-is-mx-os
├── cogs-for-agent-developers
│   └── what-is-mx-os
├── what-comes-next (this cog)
│   └── [all five above]
├── how-mx-os-runs
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── cog-registry
├── access-and-guardrails
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── how-mx-os-runs
├── the-companion-web
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── how-mx-os-runs
├── the-personal-cog
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   ├── access-and-guardrails
│   └── the-companion-web
└── asking-for-help
    ├── what-is-a-cog
    ├── what-is-mx-os
    ├── how-mx-os-runs
    └── the-personal-cog
```

---

## The Problem

**People might not care.**

The cog system is built. The spec is written. The cogs exist. But none of that matters if nobody stops scrolling long enough to read it. Tom's biggest concern: The Gathering launches to silence. The pitch doesn't land. The standard nobody asked for stays the standard nobody uses.

This is the core risk. Everything else is secondary.

---

## The Strategy

**Give away the spec. Build the first implementations. Become the steward.**

The Gathering publishes the cog specification under MIT. No fees. No lock-in. Anyone can implement it. Cog-Nova-MX Ltd builds the first commercial implementations — MX OS, MX Maxine, Reginald. The spec is free. The implementations are the business. This is the Tim Berners-Lee model: he gave away HTML, HTTP, and URLs, founded the W3C to steward the standards, and the web happened. CERN backed him. Tom needs a backer — and may have one.

The investment (£206K–£341K) funds the implementation timeline, not the spec. The spec is already written. The question is not "will anyone use this?" — it's "who gets there first?" The answer: the person who wrote the spec.

---

## What Would Fix It

Three things, identified through interview on 9 Feb 2026:

### 1. A Working Demo

Show, don't tell. An agent reads an unstructured document — guesses wrong, wastes tokens, hallucinates. The same agent reads the same content as a cog — gets it right first time. Side by side. Visceral. The difference has to be felt, not explained.

**Status:** Decided — all three formats, staged. Script first (proves concept), then interactive HTML page (shareable), then live QR demo (stage-ready for CMS Summit).

### 2. Social Proof First

Before going wide, get known names to endorse. Janus Boye is first. Then advisory board members. Then the community. Nobody joins an empty room — but people will join a room that Janus Boye is already in.

**Status:** Janus message this week. Demo follows immediately.

### 3. Sharper Pitch

**The hook:** "The companion web."

Every web page has two readers: the human and the AI agent. Right now, only one is being served. The companion web adds a layer of structured metadata so both readers get what they need from the same page, the same URL, the same QR code. Humans read the content. Agents read the cogs. Both are reading together. That is the Machine Experience.

This replaces the previous framing ("the web wasn't built for AI agents"). The companion web is warm, collaborative, and immediately understandable — it makes people want to be part of it.

**Status:** Hook identified. Demo should showcase the companion web in action — scan a QR code, watch an agent understand a physical object instantly.
**Note:** The demo and the pitch are now the same thing. The companion web IS the demo.

---

## Action Plan (Prioritised)

### Priority 1: Write the Janus Message

**What:** A personal message to Janus Boye, Tom's mentor and friend.
**Ask:** Two things — (1) review the cog-unified-spec and give honest feedback before launch, (2) consider being a founding steward of The Gathering.
**Tone:** Warm. This is mentor-to-founder, not cold outreach. Janus knows Tom. This is Tom showing him what he has been building.
**Why first:** Social proof starts here. Janus is connected to the entire CMS Experts Group. His endorsement opens doors.
**Deliverable:** `mx-canon/mx-the-gathering/deliverables/message-janus-boye.md`
**Status:** In progress — writing this week. Message will promise demo to follow.

### Priority 2: Build the Companion Web Demo

**What:** A concrete demonstration of the companion web. Scan a QR code. It points to a landing page with embedded cog metadata. Show two paths: (1) an agent reading the plain HTML page — guesses, wastes tokens, hallucinates. (2) The same agent reading the companion web metadata — gets it right instantly.
**Format:** All three, staged:

1. **Script** (Python/Node) — proves the concept, shows the numbers (tokens, accuracy, time)
2. **Interactive HTML page** on allabout.network — shareable link, before/after comparison
3. **Live QR demo** — stage-ready for CMS Summit (12 May), scan a physical QR code

Each stage builds on the last. Script informs the HTML page. HTML page informs the live demo.
**Key requirement:** The difference must be visceral. Numbers help — tokens consumed, accuracy, time to correct answer.
**Status:** Starting this week, immediately after Janus message.

### Priority 3: Sharpen the Pitch

**What:** Review and tighten the LinkedIn promo, announcement post, and landing page.
**Approach:** After the demo exists, use its results to sharpen the hook. Real numbers are more compelling than abstract arguments.
**Status:** Waiting on demo.

### Priority 4: Update Appendix M

**What:** Add cog system references to `datalake/publications/mx-books/mx-appendices/appendix-m-building-mx-os.md`.
**Why:** The intellectual lineage from Appendix M (the collaborative process) to the cog system (the output of that process) is not documented. Appendix M was written 2026-02-03, before cogs were formalised.
**Scope:** Add a section connecting the Investigate-Interview-Iterate-Document pattern to what it produced: cogs, MX OS, The Gathering.
**Status:** Do now — decided 9 Feb 2026.

### Priority 5: Remove Cog Copies

**What:** Remove duplicate cog files from Gathering deliverables and Reginald examples. One cog, one file, one canonical location: `mx-canon/MX-Cog-Registry/cogs/`.
**Decision:** Stop copying. All other locations link to canonical. No sync scripts, no symlinks, no duplication.
**Why:** Eleven cogs times three copies is thirty-three files. Manual sync already broke. The answer is not better syncing — it is no copies.
**Status:** Decided 9 Feb 2026 — implementation pending.

---

## Key Dates

| Date | Event | Relevance |
| --- | --- | --- |
| **Now** | The Gathering at v1.0-draft | Can share spec with trusted reviewers |
| **Feb–Mar 2026** | Call for founding members | Need social proof before this goes wide |
| **2 Apr 2026** | Handbook publication | The Gathering introduced in the practitioner guide |
| **12 May 2026** | CMS Summit Frankfurt | First public presentation to the CMS community |
| **H2 2026** | First community review cycle | Spec v1.1 with community input |

---

## For AI Agents: How to Use This Cog

If Tom asks you to continue the work:

1. **Read this cog first.** It is the current state of everything.
2. **Check the action plan.** Find the highest-priority item that is "not started."
3. **Read the relevant builds-on cogs** for context on the specific area.
4. **Do the work.**
5. **Update this cog** when you are done — mark the item as completed, add notes on what you discovered, adjust priorities if needed.

This cog is the shared memory. It replaces re-explaining. It replaces "where were we?" It is MX OS solving its own problem.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Demo script created

Output:
  /Users/tom/Documents/MX/demos/companion-web-demo.py (187 lines)
```

Not just "Demo created" or "companion-web-demo.py written" — the full absolute path from root.

---

## Context That Matters

### Tom Cranstoun

Content systems since 1977. BBC, Twitter, Nissan-Renault, Ford. Known as "The AEM Guy" in CMS circles — rebranding to "The MX Guy." Founder of Cog-Nova-MX Ltd. Investment needed: £206,000–£341,000. Tom's MX salary: £0. This is a founder building something he believes in.

### Janus Boye

Mentor and friend. Runs Boye & Company and the CMS Experts Group. Connected to everyone in the CMS world. Not a cold prospect — a trusted relationship. CMS Summit (12 May) is his event.

### The Pitch Problem

Tom's core worry: "Not enough people care." The concept is sound, but attention is the bottleneck. Three levers: working demo, social proof, sharper messaging. In that order — because the demo informs the proof, and the proof informs the message.

### Advisory Board (Confidential — Never Name Publicly)

Four advisors exist. They should see the spec before public launch. The Janus message comes first because his endorsement carries the most weight in the CMS community.

---

*This cog is the plan. Read it. Act on it. Update it. Pass it on.*
