---
version: "1.0.0"
description: "A conceptual map of MX — every idea, how they connect, and where to go deeper. The newcomer's guide to Machine Experience."

created: 2026-02-11
modified: 2026-02-11

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, what-is-mx-os]
  tags: [concepts, primer, onboarding, glossary, mental-model, newcomer, map]

  audience: both
  readingLevel: beginner
---

# MX Concepts

A map of every idea in MX, how they fit together, and where to look next. Start at the top. Each layer builds on the one before it.

---

## Layer 1 — The Idea

### Machine Experience (MX)

The web has two audiences now. Humans read pages. Machines read metadata. Machine Experience is the discipline of designing for both — making content work for people and for the AI agents, search engines, robots, and software systems that increasingly consume it.

MX is not about replacing human experience. It is about adding a parallel layer — structured, machine-readable, honest — so that machines understand what they are reading instead of guessing.

### "Design for both."

The founding principle. Every decision in MX must work for humans AND machines. YAML frontmatter for machines. Markdown prose for humans. Same file. Both audiences served. If a design helps one audience while hurting the other, it is wrong.

---

## Layer 2 — The Building Block

### Cog

The atomic unit of MX. A `.cog.md` file — a markdown document with YAML frontmatter. The frontmatter is for machines. The markdown is for humans. One file, two audiences.

Any document can become a cog. Add YAML frontmatter and it is machine-readable. That is the whole barrier to entry. But metadata quality matters — strong metadata lets an AI agent read twelve lines of YAML instead of scanning an entire document.

### Info-Cog

A cog without an `execute` block. It holds information — product specs, compliance certificates, pricing data, contact records, policy documents. An info-doc is the single source of truth: the verified, authoritative answer to any question an AI agent asks.

Think of it as a data file. It sits in the registry. It describes itself. It does not do anything — it IS something.

### Action-Cog

A cog with an `execute` block and a `runtime:` field. It does things. An action-doc is a Standard Operating Procedure that can execute itself. It contains one or more actions, each with step-by-step instructions.

Think of it as a program. It has a shebang line (`runtime:`), commands (`actions`), inputs, and outputs.

### YAML Frontmatter

The metadata block at the top of every cog, delimited by `---`. Machine-readable structured data — name, version, description, category, tags, relationships to other cogs. This is what makes a document a cog.

The YAML is the reason an AI agent can understand a document without reading the whole thing. Twelve lines of metadata can save thousands of tokens.

---

## Layer 3 — The Operating System

### MX OS

The Machine Experience Operating System. A product of CogNovaMX Ltd.

MX OS is an operating system where files are the platform. There is nothing to install. No server. No API. No SDK. The system is written into the filesystem as markdown files with YAML frontmatter, and any AI agent that can read markdown becomes the runtime.

"Documentation IS the system." Not documentation about a system — the documentation defines behaviour.

"MX OS does not need to be installed. It needs to be written."

### Files Are the Platform

No database. No application server. No deployment pipeline. Cogs are markdown files. Move them anywhere — USB stick, git repo, web server, pasted into a conversation. The file IS the program. The filesystem IS the platform.

### Any AI Agent Is a Runtime

If it can read markdown and parse YAML, it can run MX OS. Claude, GPT, Gemini, a custom agent — the runtime is whatever reads the cog. This is deliberate. MX OS does not depend on any single AI provider.

---

## Layer 4 — Identity and Context

### SOUL.md

The identity document for a folder. A SOUL.md defines what the folder is, what voice to use when writing in it, what constraints apply, and what must never happen here.

SOULs are additive. A subfolder's SOUL layers on top of the parent's. They never override — they enrich.

**Operational rule:** On entering any folder, check for SOUL.md. If present, read it before editing or creating files.

One SOUL.md turns a folder from a black box into a self-describing environment. That is the unlock.

### The Three-Tier Context Model

MX organises context at three levels. Each level answers a different question.

| Level | File | Question it answers |
| --- | --- | --- |
| **Machine** | `$MX_HOME` (`~/.mx/`) | What machine am I on? What repos exist? Who is the user? |
| **Project** | `env.cog.md` (repo root) | What is the hostname? Who is the default author? Where do files go? |
| **File** | Individual `.cog.md` | What is this specific document? What does it do? |

Three tiers. Machine knows the universe. Project knows the neighbourhood. File knows itself.

### $MX_HOME

The machine-level context directory at `~/.mx/`. Contains `machine.yaml` (what machine), `repos.yaml` (what repos), `user.yaml` (who), and a SOUL.md. This is the first thing an AI agent reads on a new machine.

"Don't panic. Read $MX_HOME."

### env.cog.md

The project-level configuration cog. Lives at the repository root. Centralises values that would otherwise be hardcoded across hundreds of files — hostnames, author details, URL patterns, paths. Other cogs reference it. They never hardcode.

The MX equivalent of `.env`. But it is a cog, so it has actions too — show the config, validate the codebase for hardcoded values, propagate changes to templates.

---

## Layer 5 — Connections

### Builds-On

The field that connects cogs to each other: `builds-on: [list-of-cog-names]`. A soft recommendation — "read these first for context." Not a hard dependency. A cog still works without its builds-on parents available.

The builds-on graph is recursive. `what-is-a-cog` is the root. Everything else builds on it, directly or transitively. The graph forms a knowledge structure — a context web where every node is self-describing and every edge says "this concept assumes that concept."

### refersTo

Cross-references. "See also." Not prerequisites — just related resources. Looser than `builds-on`.

### invokes

Dynamic inter-process communication. When one action-doc calls another during execution. The signal system of MX OS.

---

## Layer 6 — How Things Run

### Runtime

The `runtime:` field in an action-doc's `execute` block. It tells MX OS how to run the program — the shebang line.

| Runtime | How it runs |
| --- | --- |
| `runbook` | The action-doc IS the instruction set. The AI agent reads and follows it. |
| `node` | Runs as a Node.js script. |
| `bash` | Runs as a shell command. |

Most action-docs use `runtime: runbook`. The AI agent is the universal executor — it reads the Standard Operating Procedure and follows it. No code. No compilation. The instructions are the program. The agent is the runtime.

### Boot Model

MX OS boots once per session, not on every prompt.

1. **CLAUDE.md** — the bootloader. Always injected. Lightweight. Points to everything else.
2. **/mx-boot** — the init system. Runs once. Reads the registry. Establishes session context.
3. **Routing** — maps tasks to the right action-doc.
4. **Execution** — the action-doc runs.
5. **IPC** — action-docs calling other action-docs via `invokes`.

Two-stage context: machine context first ($MX_HOME — know the universe), then repo context (CLAUDE.md — know the neighbourhood).

### Skills

Platform-specific routing mechanisms. In Claude Code, a skill is a thin entry point that maps a human command (like `/mx-contacts`) to an action-doc action. The skill is the desktop shortcut. The action-doc is the program.

---

## Layer 7 — The Standard

### The Gathering

An independent standards body that governs the cog metadata format. Not owned by CogNovaMX. MIT licensed. No fees. Practitioner-led.

The Gathering defines how cog metadata must be structured so that any machine can understand any document. Think W3C, not a vendor consortium.

The relationship to MX OS is precise: The Gathering is POSIX. MX OS is Linux. The standard defines the interface. The operating system implements it. Anyone can build their own implementation on the same standard.

"The standard belongs to everyone. MX OS is ours."

### Cog Unified Spec

The canonical specification for cog metadata, governed by The Gathering. Defines every field, every type, every convention. Lives at `mx-canon/mx-the-gathering/specifications/cog-unified-spec.cog.md`.

---

## Layer 8 — Trust

### COG (Certificate of Genuineness / Contract of Governance)

The trust wrapper for cogs. Two meanings, one acronym:

- **Certificate of Genuineness** — this cog is what it says it is. Verified. Authentic.
- **Contract of Governance** — these are the rules for using this cog. Permissions. Constraints. Liability.

### Compliance Levels

Five levels, from basic to fully audited:

| Level | Meaning |
| --- | --- |
| 1 | Basic metadata present |
| 2 | Metadata validated |
| 3 | Content reviewed |
| 4 | Third-party verified |
| 5 | Fully audited |

### Visibility

Where a cog can be seen: **local** (one machine), **private** (one organisation), **shared** (trusted partners), **hosted** (public web).

### Access Control

Five access types: **public** (default), **guardrail** (an action-doc checks identity before granting access), **encrypted**, **password**, **oauth**.

Key principle: discovery is always public. Frontmatter is always readable. Content can be gated. An AI agent can always discover what a cog IS, even if it cannot read the content.

---

## Layer 9 — The Ecosystem

### Reginald

The package registry for MX OS. Named after the butler — he knows where everything is. Contains the core tool action-docs: accessibility auditing, readability scoring, metadata validation, link checking, schema validation, and more.

Home: `mx-reginald/`

### Cog Query Tool

The first `runtime: node` action-doc. A real script that scans the filesystem for `.cog.md` files, parses their YAML, and provides programmatic registry access. `npm run cog:list`, `cog:stats`, `cog:find`, `cog:graph`, `cog:sync`.

### mx-canon

The single source of truth for MX. Canonical definitions of every initiative — MX OS, The Gathering, the Cog Registry, Contacts, the App. Pattern: subfolder per initiative, each with SOUL.md and a deliverables/ folder. If Canon conflicts with anything elsewhere, Canon wins. "Everything else is canon fodder."

---

## Layer 10 — The Physical World

### The Companion Web

The machine-readable layer alongside the human web. Physical objects get QR codes. QR codes point to landing pages. Landing pages embed cog metadata. AI agents read the metadata and understand the object instantly.

No pre-loaded database. No computer vision. No centralised API. "The object introduces itself."

The companion web extends to any physical context — warehouse pallets, building directories, medical devices, fire extinguishers. Same format, same metadata, different readers. From phone to software agent to robot.

### The Personal Cog

A user's collection of cogs describing themselves — accessibility needs, interests, dietary requirements, health information, skills, preferences.

The AI agent acts as a contextual guardrail, deciding what to share based on the situation. Restaurant gets dietary requirements. Hospital gets health information. Concert gets accessibility needs and interests. Job application gets skills and preferences.

"The companion web is the world speaking cog. The personal cog is you speaking cog."

---

## Layer 11 — The Teaching Models

MX has two structural metaphors. Use the right one for the audience.

### The OS Analogy (for developers)

Every MX concept maps to something developers already know:

| OS concept | MX equivalent |
| --- | --- |
| Programs | Action-docs |
| Data files | Info-docs |
| Shebang line | `runtime:` field |
| Package registry | Reginald |
| Code signing | COG |
| Filesystem metadata | SOUL.md |
| Dependency graph | `builds-on` |

If a concept cannot be mapped to an OS concept, question whether it belongs.

### The Railway Analogy (for everyone else)

Every MX concept maps to something on a railway:

| Railway | MX equivalent |
| --- | --- |
| Locomotive | AI agent (the runtime) |
| Carriages | Cogs |
| Freight cars | Info-docs |
| Powered cars | Action-docs |
| Coupling | `builds-on` |
| Track gauge | The Gathering standard |
| Tracks | Files as platform |
| Stations | Repositories, folders, $MX_HOME |

**The cog railway** is the killer metaphor. A rack railway uses toothed cogs to climb gradients that smooth rails cannot handle. MX cogs give AI agents traction on the difficult terrain of unstructured content. Without cogs, the agent slips. With cogs, it climbs.

"We are not building the locomotive. We are laying the track."

---

## Layer 12 — Culture

### The Phrasebook

MX OS has a set of sayings that emerged from building. None were brainstormed. Each was earned by being useful in the moment it was needed. Key phrases:

- **"Don't panic. Read $MX_HOME."** — for lost agents starting fresh
- **"Stop guessing. Start reading."** — the anti-hallucination motto
- **"The instructions are the program. You are the runtime."** — the runbook model
- **"Documentation IS the system."** — the founding insight
- **"Design for both."** — the first principle
- **"Cogs all the way down."** — the recursive self-description pattern

Canonical source: `scripts/cogs/mx-os/mx-phrasebook.cog.md`

### Principles

The operational rules of MX OS. Use existing standards. Write like a blog. Canon wins content. Convention wins location. Never hardcode counts in prose. Never put version numbers in filenames. Any document can be a cog.

Canonical source: `principles.cog.md` at repository root.

---

## Where to Go Next

| If you want to... | Read this |
| --- | --- |
| Operate MX OS | `mx-canon/mx-maxine-lives/manuals/mx-os-manual.cog.md` |
| Understand the vision | `mx-canon/mx-os/product-brief.md` |
| Read the cog specification | `mx-canon/mx-the-gathering/specifications/cog-unified-spec.cog.md` |
| See what is in the registry | Run `npm run cog:list` |
| Use the railway pitch | `scripts/cogs/mx-os/mx-train-analogy.cog.md` |
| Find the right saying | `scripts/cogs/mx-os/mx-phrasebook.cog.md` |
| Build a new action-doc | `scripts/cogs/building-action-docs.cog.md` |
| Understand project config | `env.cog.md` at repository root |

---

*Twelve layers. One system. Start anywhere. Build on everything.*
