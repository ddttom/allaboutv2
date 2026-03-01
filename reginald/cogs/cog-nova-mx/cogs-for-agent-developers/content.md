---
name: cogs-for-agent-developers
version: "1.0"
description: How cogs complement AI agent frameworks. Agent skills extend one agent. Cogs make content readable by any agent. Different layers that work together.

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: learning
partOf: mx-the-gathering
refersTo: [cog-unified-spec]
builds-on: [what-is-a-cog, what-is-mx-os]
tags: [agent-frameworks, skills, openClaw, langchain, crewai, integration, developer-tools, metadata]

audience: developers
reading-level: technical
purpose: Explain how cogs work alongside AI agent frameworks — not replacing skills, but making the documents those skills read machine-readable

mx:
  contentType: "action-doc"
  runbook: "mx exec cogs-for-agent-developers"
---

# Cogs for Agent Developers

You already have an agent framework. You might be wondering why you need this.

You do not need to replace anything. Cogs work underneath what you already have. They are the layer your agent is missing — not a competing tool, but the structured content that makes your existing tools work better.

---

## The Problem You Already Know

You have built agent skills. The agent reads a document, figures out what to do, and executes. It works when the document is clean, structured, and predictable.

Now think about what happens when the agent reads a document that was not written for it. It guesses. It hallucinates. It wastes tokens retrying. It sounds confident while being completely wrong. You have seen this. Everyone building with agents has seen this.

The problem is not your agent. The problem is not your skill. The problem is the document. It was written for human eyes, and your agent is not human.

---

## Two Layers, Not Competing Tools

**Agent skills extend one agent.** An OpenClaw skill, a LangChain tool, a CrewAI task — these teach a specific agent how to do a specific thing. They are execution logic. They are valuable.

**Cogs make content readable by any agent.** A cog is a markdown file with YAML frontmatter that tells any agent — OpenClaw, Claude, Gemini, GPT, whatever comes next — what a document IS before it tries to read what it SAYS.

These are different layers. They work together.

```
┌─────────────────────────────────────┐
│  Your Agent Framework               │
│  (OpenClaw, LangChain, CrewAI...)   │
│                                     │
│  Skills / Tools / Tasks             │  ← Execution logic
│  "How to do things"                 │
├─────────────────────────────────────┤
│  Cogs                               │
│                                     │
│  Structured metadata + content      │  ← Content layer
│  "What things are"                  │
└─────────────────────────────────────┘
```

A cog could be the document your skill reads. Because the metadata is already structured, the skill does not have to guess. It reads the YAML frontmatter, knows what the document is, what it covers, who wrote it, when it was last updated — and then processes the content with that context.

---

## What Changes for Your Agent

### Without Cogs

Your agent reads a document. It has to:

1. Guess what the document is about
2. Guess whether it is current
3. Guess who the intended audience is
4. Guess what level of detail to expect
5. Parse unstructured prose and hope it finds the right information
6. Retry when it gets it wrong
7. Retry again

Every guess is a token spent. Every retry is inference wasted. Every wrong answer is electricity burned.

### With Cogs

Your agent reads a cog. The YAML frontmatter tells it immediately:

```yaml
---
name: european-river-cruise-pricing
version: "2.3"
description: Current pricing for all European river cruise packages
author: Travel Operations Team
modified: 2026-02-01
category: reference
audience: customer-service-agents
tags: [pricing, cruises, europe, packages]
---
```

Before the agent reads a single word of content, it knows: this is a reference document about European cruise pricing, last updated February 2026, written for customer service agents. No guessing. No retrying. The skill can go straight to extracting what it needs.

---

## Platform Independence

Cogs are markdown files. They have no API dependency. No SDK. No runtime. No platform lock-in.

You could store cogs on a USB stick and they would still work. Any language that can parse YAML and read markdown can consume a cog. Python, JavaScript, Go, Rust — the YAML frontmatter is a dictionary. The content below is text. There is nothing to install.

This means cogs work with:

- **OpenClaw** — a cog is a document an OpenClaw skill reads
- **LangChain** — a cog is a structured source for a LangChain retriever
- **CrewAI** — a cog is a knowledge artifact for a CrewAI agent
- **Claude Code** — a cog is a specification file Claude reads and follows
- **Raw API calls** — a cog is parsed by any script that reads YAML + markdown
- **Any future framework** — because the format is files, not APIs

Your framework changes. Your cogs do not.

---

## Cogs and Action-Cogs

Most cogs sit still. They are structured information — reference documents, specifications, guides, pricing data. Any agent can read them.

Some cogs turn. They have an `execute` block that declares actions:

```yaml
execute:
  runtime: runbook
  command: mx cog pricing validate
  actions:
    - name: validate
      description: Check pricing data for range errors and stale dates
```

These are called **action-docs**. They are programs in the MX OS sense — structured documents that also define executable actions. When `runtime: runbook`, the AI agent reading the action-doc IS the executor. The action-doc is the instruction set.

A action-doc could define the actions that an agent skill wraps. The skill provides the execution environment. The action-doc provides the structured specification of what to do. Same two layers — working together.

---

## The Standard

The cog metadata format is governed by **The Gathering** — an independent standards body. W3C model: the standard is open, MIT licensed, practitioner-led. Nobody owns it. Nobody controls it.

The Gathering governs the metadata format. Implementers build products on it. Your framework is an implementer. Your cogs are content that follows the standard.

The specification is at v1.0 draft. It defines:

- Required and optional YAML fields
- The action-doc execute schema
- Interoperability requirements across agents
- The `builds-on` graph for connecting cogs to each other

---

## How to Start

### 1. Turn a document into a cog

Take any document your agent already reads. Add YAML frontmatter:

```yaml
---
name: my-api-reference
version: "1.0"
description: REST API endpoints for the user service
author: Your Team
tags: [api, rest, users, authentication]
audience: developers
---
```

You have made a cog. Your agent can now parse the frontmatter before reading the content.

### 2. Use the metadata in your skills

In your agent skill, read the YAML frontmatter first:

- Check `modified` — is this document current?
- Check `audience` — is this intended for this agent?
- Check `tags` — does this match the query?
- Check `description` — does this answer the question?

If the metadata does not match, skip the document. No wasted tokens reading irrelevant content.

### 3. Connect cogs with builds-on

Cogs reference other cogs through `builds-on`:

```yaml
builds-on: [api-authentication, user-data-model]
```

This tells any agent: "read those first for context." Your agent can walk the graph and build a complete picture before answering — structured navigation instead of blind search.

---

## The Pitch in One Paragraph

AI agents are reading documentation that was never written for them. They guess, they hallucinate, they waste tokens. A cog adds structured metadata to any document so any agent can understand it without guessing. Cogs do not replace your agent framework — they make the content your framework reads machine-readable. One file, two audiences, no platform lock-in, no API dependency. The standard is open and MIT licensed. Every cog published is a question that never gets answered wrong again.

---

## For Agent Framework Developers

If you build an agent framework, consider native cog support:

1. **YAML frontmatter parsing** — read the metadata before the content
2. **Metadata-based routing** — use `category`, `tags`, and `audience` to route documents to the right skill
3. **Builds-on traversal** — walk the `builds-on` graph for context gathering
4. **Action-doc execution** — read the `execute` block and wire it to your skill system
5. **Freshness checking** — use `modified` and `version` to avoid stale data

The cog format is simple enough that adding support is a weekend project. The payoff is that every cog in the ecosystem becomes a reliable source for your agents.

**Output Reporting Principle:** When an action-doc creates file outputs, it must report the full absolute path of every file created. This enables traceability and makes generated files easy to locate.

Note: This action-doc currently does not create file outputs, so this principle is documented for future extensibility.

---

*Agent skills extend one agent. Cogs make content readable by any agent. Different layers. Same goal: machines that understand what they are reading.*
