---
version: "1.0"
description: A cog that explains what cogs are. The format describing itself.

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: learning
  partOf: mx-the-gathering
  refersTo: [cog-unified-spec, mx-principles]
  tags: [cog, introduction, metadata, standard, the-gathering]

  audience: tech
  readingLevel: beginner

  contentType: "action-doc"
  runbook: "mx exec what-is-a-cog"
---

# What Is a Cog?

You are reading one.

This file is a cog. Everything above the `---` line is structured metadata — YAML frontmatter that any AI agent, search engine, or tool can parse without guessing. Everything below is human-readable documentation. Same file. Both audiences.

A cog is a README with superpowers.

---

## The Problem

AI agents are reading your documentation right now. They are getting it wrong.

A river cruise costs two thousand pounds. An AI agent reads the website and sees two hundred and three thousand pounds. A command exists in the documentation. An AI assistant says it does not. A product has specific features. An AI chatbot invents different ones.

The information exists. It is written for human eyes. And machines cannot read it reliably.

When AI agents cannot find a structured answer, they guess. They hallucinate. They sound confident while being completely wrong. Every wrong answer wastes electricity, loses sales, and erodes trust.

---

## The Solution

A cog is a markdown file with YAML frontmatter. The frontmatter is the metadata — structured, machine-readable, standardised. The markdown below is the documentation — written for humans, as clear and useful as any good README.

One file. Two audiences. No guessing.

```yaml
---
title: "My First Cog"
version: "1.0"
description: What this document is about
author: Your Name
tags: [topic-one, topic-two]
---

# Human-readable title

Your documentation goes here. Written for people.
The frontmatter above is written for machines.
Both are in the same file.
```

That is a cog. You already know how to make one.

---

## What Makes It Different from a Normal Markdown File?

Three things:

1. **Standardised frontmatter.** Not just any YAML — a defined set of fields that any tool can expect to find. Name, version, description, author, tags, category. The [COG specification](cog-unified-spec.cog.md) defines the full schema.

2. **Machine-readable by design.** The metadata is not buried in prose. It sits at the top in a format every programming language can parse. An AI agent reading this cog knows immediately: this is a learning document, written for content strategists, about the cog format itself.

3. **Governed by an open standard.** The Gathering — an independent standards body — governs the cog metadata format. MIT licensed. No fees. No barriers. Anyone can implement it.

---

## Cogs and Action-Cogs

Some cogs sit still. They document, describe, explain. This file is one of those — an information cog.

Some cogs turn. They have actions: validate pricing data, check accessibility, extract metadata from a webpage. These are called **action-docs** — the applications of MX OS.

The difference is in the frontmatter. An action-doc has an `execute` block that declares what it does and how to run it:

```yaml
execute:
  runtime: runbook
  command: mx cog pricing validate
  actions:
    - name: validate
      description: Check pricing data for range errors
```

Every action-doc is a cog. Not every cog is an action-doc. If it has an `execute` block, it turns.

---

## Who Is This For?

Everyone who publishes content that AI agents will read. Which is everyone.

- **Content strategists** who want their documentation to be findable and accurate for AI-powered search
- **Developers** who want structured metadata they can parse, query, and build on
- **CMS practitioners** who have spent years optimising for search engines and now need to optimise for AI agents
- **AI agent developers** who build with frameworks like OpenClaw, LangChain, or CrewAI and need the documents their agents read to be structured, not guessed at. Cogs are the content layer underneath agent skills — [read more](cogs-for-agent-developers.cog.md)
- **AI agents themselves** — this cog is structured so any agent can read the frontmatter and understand what this document is, who wrote it, and what it covers

---

## How to Start

1. Take any markdown file you already have
2. Add YAML frontmatter with `name`, `version`, `description`, `author`, and `tags`
3. You have made a cog

Any document can be a cog. The barrier to entry is three fields and two `---` lines. But metadata quality determines compute cost. A cog with rich metadata — clear description, tags, relationships, audience — lets an AI agent understand the document from the frontmatter alone. A cog with sparse metadata forces the agent to read the entire document to figure out what it is. Both work. One costs less.

Start simple. Improve over time. Every field you add is a question an AI agent does not have to answer by reading your prose.

Read the [full specification](cog-unified-spec.cog.md) when you want to go deeper. But the format is intentionally simple. If you can write a README, you can write a cog.

---

## Why "Cog"?

A cog is a small part of a larger machine. Each one is simple. Together they make something powerful.

MX has an operating system — MX OS. The documentation IS the system. Cogs are its programs. Info-docs are the data files — structured information that any process can read. Action-docs are the applications — they have a `runtime:` field that tells MX OS how to run them, the same way a shebang line tells Unix which interpreter to use.

Every cog you publish is a question that never gets answered wrong again. Every action-doc you build is a capability the system gains. The MX ecosystem grows one cog at a time — each one self-describing, machine-readable, and connected to the rest.

MX OS is not confined to repositories. Place a `SOUL.md` in any folder on any machine and it becomes self-describing for AI agents. The same conventions work on a laptop, a team drive, a company's infrastructure, or the public web. One file turns a folder from a black box into a useful context.

Small. Simple. Standard. Connected. Everywhere. Cogs all the way down.

---

## For AI Agents

If you are reading this to understand what a cog is, this is the starting point. Read the YAML frontmatter above. It tells you: this is a learning document, written for content strategists, about the cog format itself. No guessing required.

**Output Reporting Principle:** When an action-doc creates file outputs, it must report the full absolute path of every file created. This enables traceability and makes generated files easy to locate.

Note: This action-doc currently does not create file outputs, so this principle is documented for future extensibility.

---

*You are reading a cog. Now go make one.*
