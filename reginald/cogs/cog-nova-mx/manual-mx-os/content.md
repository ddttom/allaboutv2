---
name: manual-mx-os
title: MX OS — Manual
description: The Machine Experience Operating System. A practical guide to cogs, SOULs, the registry, runtime, and the companion web.
version: "1.0"
status: active
license: proprietary
created: 2026-02-09T00:00:00.000Z
modified: 2026-02-13T00:00:00.000Z
author: Tom Cranstoun
category: manual
tags:
  - manual
  - mx-os
  - operating-system
  - cogs
  - runtime
partOf: mx-maxine-lives
purpose: Document mx os - usage, workflow, and best practices
audience: human
stability: stable
runbook: "mx exec manual-mx-os"
contextProvides:
  - The Machine Experience Operating System. A practical guide to cogs, SOULs, the registry, runtime, and the companion web.
  - Usage guide and workflow for mx os
  - Troubleshooting and best practices
refersTo: []
---

# MX OS Manual

**The Machine Experience Operating System. A practical guide.**

---

## What This Document Is

This is the operator's manual for MX OS. It covers what is deployed, how it works, and how to use it. Read the [product brief](product-brief.md) for the vision. Read this for the mechanics.

---

## System Overview

MX OS is an operating system where files are the platform. There is nothing to install. There is no server. There is no API. The system is written into the filesystem as markdown files with YAML frontmatter, and any AI agent that can read markdown becomes the runtime.

### Current Scale

Run `npm run cog:stats` for live numbers. The registry includes canon cogs, Reginald core action-docs, contact cogs, and skill entry points — all validated with zero parse errors.

---

## The Five Layers

### 1. Cogs — The Programs

A cog is a `.cog.md` file. YAML frontmatter for machines. Markdown body for humans. Two types:

- **Info-doc** — A single source of truth. The verified, authoritative answer to any question an AI agent asks. Has metadata (name, description, category, tags) but no `execute` block. Product specs, compliance certificates, pricing data, contact records, policy documents.
- **Action-doc** — A Standard Operating Procedure that executes itself. Has an `execute` block with a `runtime:` field and one or more `actions`. The `runtime:` field tells MX OS how to run the procedure. Action-docs are the applications of MX OS.

#### Runtimes

| Runtime | Meaning | Example |
| --- | --- | --- |
| `runbook` | The action-doc IS the Standard Operating Procedure. The AI agent follows it. | what-is-mx-os, cog-registry |
| `node` | Runs as a Node.js script. The `command` field specifies the script path. | cog-query |
| `bash` | Runs as a shell script. | (reserved) |
| `python` | Runs as a Python script. | (reserved) |
| `npm` | Runs as an npm command. | (reserved) |

Most action-docs use `runtime: runbook` because the AI agent is the universal executor — it reads the action-doc's Standard Operating Procedure and follows it. These are not prompts. They are SOPs that execute themselves. The `cog-query` action-doc is the first `runtime: node` program: a real script that scans the filesystem and parses YAML.

#### Cog Anatomy

```yaml
---
name: example-cog
version: "1.0"
description: What this cog does
category: mx-core
status: draft
license: proprietary
buildsOn: [what-is-a-cog]
tags: [example, demo]

execute:                        # ← This block makes it an action-doc
  runtime: runbook            # ← The shebang line
  actions:
    - name: explain
      description: Explain what this cog does
    - name: audit
      description: Check compliance
---

# Example Cog

Human-readable content goes here.
```

### 2. SOULs — The Identity Layer

Every folder may contain a `SOUL.md`. It is the control document that defines:

- What this folder is
- What voice to use when writing in it
- What constraints apply
- What must never happen here

SOULs are additive. A subfolder's SOUL layers on top of the parent's. They never override — they enrich.

**Operational rule:** On entering any folder, check for SOUL.md. If present, read it before editing or creating files.

### 3. The Builds-On Graph — The Knowledge Structure

Cogs reference other cogs through `builds-on: [list-of-cog-names]`. This is a soft recommendation: "read these first for context." It is not a hard dependency — a cog still works without its builds-on parents available.

The graph is recursive. `what-is-a-cog` is the root. Everything else builds on it, directly or transitively.

```text
what-is-a-cog (root)
├── who-is-maxine
│   └── what-is-mx-os
│       ├── cog-registry
│       │   ├── how-mx-os-runs
│       │   │   ├── access-and-guardrails
│       │   │   │   └── the-personal-cog
│       │   │   │       └── asking-for-help
│       │   │   ├── building-action-docs
│       │   │   └── the-companion-web
│       │   │       └── the-personal-cog
│       │   ├── cog-query
│       │   └── what-comes-next
│       ├── cogs-for-agent-developers
│       └── mx-contacts
├── (Reginald tools — no builds-on parents)
└── (contact cogs — no builds-on parents)
```

#### Related Fields

| Field | Purpose | When to Use |
| --- | --- | --- |
| `builds-on` | Conceptual context — "read these first" | Always, for any cog that depends on understanding another |
| `requires.cogs` | Hard execution dependency — must be present to run | Rarely, only for cogs that literally call another |
| `refersTo` | Related resources — "see also" | For cross-references that are not prerequisites |
| `invokes` | Dynamic IPC — this action-doc calls another during execution | For action-docs that dispatch to other action-docs |

### 4. Trust — The Verification Layer

COG (Certificate of Genuineness / Contract of Governance) wraps cogs in trust.

- **Compliance levels** 1-5: from basic metadata (1) to fully audited (5)
- **Visibility levels**: local, private, shared, hosted
- **Access types**: public (default), guardrail, encrypted, password, oauth

Trust and access are separate. A cog can be trusted (COG-signed) but locked (guardrail). Or public but unverified. The layers are independent.

### 5. The Gathering Standard — The System API

The cog metadata format is governed by The Gathering, an independent standards body. MIT licensed. No fees. MX OS is an implementer of this standard, not the owner.

The relationship: The Gathering is POSIX. MX OS is Linux.

**Canonical spec:** `mx-canon/mx-the-gathering/deliverables/cog-unified-spec.md`

---

## The Registry

### Canon Registry

Canonical home: `mx-canon/MX-Cog-Registry/cogs/`

The cogs that define MX OS itself:

| Cog | Type | What It Does |
| --- | --- | --- |
| what-is-a-cog | info-doc | The root cog. Explains the format. |
| who-is-maxine | info-doc | The AI partnership model. |
| what-is-mx-os | action-doc | The operating system. Actions: explain, bootstrap, audit, graph. |
| cog-registry | action-doc | The registry. Actions: list, search, graph, validate, register. |
| cogs-for-agent-developers | info-doc | How cogs complement agent frameworks. |
| what-comes-next | action-doc | Current state and priorities. Actions: brief, status, update. |
| how-mx-os-runs | action-doc | The runtime model. Actions: explain, boot, route, diagnose. |
| access-and-guardrails | action-doc | Access control. Actions: explain, check, gate. |
| the-companion-web | action-doc | Physical-digital bridge. Actions: explain, embed, audit. |
| the-personal-cog | action-doc | User-owned cog collections. Actions: explain, match, share. |
| asking-for-help | action-doc | Agent-to-agent delegation. Actions: explain, delegate, discover. |
| building-action-docs | action-doc | The development lifecycle. Actions: scaffold, wire. |

### Reginald Core

Home: `mx-reginald/cogs/core/`

The practical tool action-docs of MX OS:

| Action-Cog | What It Does |
| --- | --- |
| a11y | Accessibility auditing |
| clarity | Content clarity analysis |
| cog-query | Programmatic registry query tool (runtime: node) |
| link-checker | Broken link detection |
| llms-txt | LLMs.txt generation |
| metadata | Metadata validation |
| pricing | Pricing content auditing |
| readability | Readability scoring |
| robots-txt | Robots.txt analysis |
| schema | Schema.org validation |
| semantic-html | HTML semantics checking |
| sitemap | Sitemap generation/validation |
| toast-detector | AI-generated content detection |
| validate-cog | Cog YAML frontmatter validation |

### Contact Cogs

Home: `mx-crm/contacts/`

Info-docs representing contacts in the MX network. Managed by the `mx-contacts` action-doc.

---

## The Runtime Model

MX OS boots once per session, not on every prompt.

### Five Layers

```text
Layer 1: CLAUDE.md           → Bootloader (always injected, lightweight)
Layer 2: /mx-boot skill      → Init system (once per session, reads registry)
Layer 3: Routing action-doc   → Process scheduler (maps tasks to cogs)
Layer 4: Action-doc execution → The program runs (runbook or node or bash)
Layer 5: invokes / IPC       → Action-docs calling other action-docs
```

### Boot Sequence

1. **CLAUDE.md** is injected every prompt by the platform. It is the bootloader — small, always present, points to everything else.
2. **`/mx-boot`** runs once per session. It reads the cog registry, loads `what-comes-next`, and establishes the session context.
3. **Skills route requests.** Each skill is a thin entry point that maps a human command to an action-doc action.

### Skill Entry Points

Skills are platform-specific routing mechanisms. In Claude Code, they are JSON trigger files plus instruction directories under `.claude/skills/`.

| Skill | Action-Cog | What It Routes To |
| --- | --- | --- |
| `/mx-boot` | what-comes-next | Session initialisation |
| `/mx-contacts` | mx-contacts | Contact management |
| `/mx-registry` | cog-registry | Registry operations |
| `/mx-os` | what-is-mx-os | MX OS operations |
| `/mx-runtime` | how-mx-os-runs | Runtime diagnostics |
| `/mx-access` | access-and-guardrails | Access control |
| `/mx-companion-web` | the-companion-web | Companion web operations |
| `/mx-personal-cog` | the-personal-cog | Personal cog management |
| `/mx-help` | asking-for-help | Agent delegation |
| `/mx-build` | building-action-docs | Cog development lifecycle |
| `/mx-status` | what-comes-next | Status and priorities |

---

## The Cog Query Tool

The first `runtime: node` action-doc. A real script that scans the filesystem for `.cog.md` files, parses their YAML frontmatter, and provides programmatic access to the registry.

### Commands

```bash
# Registry
npm run cog:list                    # List all cogs in a table
npm run cog:list -- --sort type     # Sort by type (cog vs action-doc)
npm run cog:list -- --verbose       # Show actions, audience, file paths
npm run cog:show -- mx-messaging    # Display full details of a specific COG
npm run cog:find -- companion       # Search by name, tag, or description
npm run cog:stats                   # Registry summary statistics

# Query
npm run cog:filter -- --category contact   # Multi-criteria filtering
npm run cog:count -- --type action-doc     # Count COGs matching criteria
npm run cog:recent                         # Show recently modified COGs
npm run cog:incomplete                     # List COGs missing recommended fields

# Validation & Sync
npm run cog:validate                # Schema + dependency validation
npm run cog:discover                # Find new, moved, or deleted COGs
npm run cog:sync                    # Regenerate mx-reginald/index.json
npm run cog:snapshot                # Snapshot registry state

# Graph
npm run cog:graph                   # Builds-on dependency tree
npm run cog:graph:circular          # Find circular dependencies
npm run cog:graph:orphans           # Find broken references
```

### Direct CLI Usage

```bash
node scripts/cog-tools.js list --sort date
node scripts/cog-tools.js show mx-messaging
node scripts/cog-tools.js find mx-concepts
node scripts/cog-tools.js filter --category contact --status active
node scripts/cog-tools.js graph depends-on mx-messaging
node scripts/cog-tools.js validate --json
```

### YAML Validation

The `errors` field in the summarise output catches broken YAML frontmatter. This is used by:

1. **`npm run cog:stats --json`** — Manual check: if `errors > 0`, run `cog:list --verbose` to find the broken cog
2. **GitHub Actions CI** — `.github/workflows/validate-cogs.yml` runs on every push/PR that touches `.cog.md` files
3. **Step-commit skill** — Validates cogs before committing

---

## The Companion Web

The companion web is the machine-readable layer alongside the human web. Physical objects get QR codes. QR codes point to landing pages. Landing pages embed cog metadata. AI agents read the metadata and understand the object.

### Embedding Cog Metadata in HTML

```html
<!-- Minimal: meta tags in <head> -->
<meta name="cog:name" content="fire-extinguisher-lobby-3">
<meta name="cog:description" content="ABC dry powder, 6kg, last inspected 2026-01-15">
<link rel="cog" href="/cogs/fire-extinguisher-lobby-3.cog.md">

<!-- Rich: JSON-LD in <script> -->
<script type="application/ld+json">
{
  "@context": "https://thegathering.org/cog",
  "name": "fire-extinguisher-lobby-3",
  "description": "ABC dry powder, 6kg"
}
</script>
```

### The Pattern

1. Physical object has a QR code
2. QR code points to a URL (landing page)
3. Landing page has human content AND cog metadata
4. AI agent reads the cog metadata — understands the object instantly
5. No pre-loaded database. No computer vision. No centralised API.

**"The object introduces itself."**

---

## Access Control

Five access types for cogs:

| Type | Meaning |
| --- | --- |
| `public` | Default. Anyone can read. |
| `guardrail` | An action-doc checks identity/permissions before granting access. |
| `encrypted` | Content is encrypted. Key required. |
| `password` | Simple password protection. |
| `oauth` | OAuth provider validates identity. |

**Key principle:** Discovery is public. Content is gated. Frontmatter (metadata) is always readable, even when the markdown body is locked. This means AI agents can always discover what a cog IS, even if they cannot read its content.

Guardrails can cascade: a guardrail can itself be gated (team-auth guardrail → senior-auth guardrail → locked cog).

---

## The Personal Cog

A user's collection of cogs describing themselves: accessibility needs, interests, dietary requirements, health information, skills, preferences.

The agent-as-guardrail model: the AI agent decides contextually what to share.

| Context | Agent Shares |
| --- | --- |
| Restaurant booking | Dietary requirements |
| Hospital visit | Health information |
| Concert search | Accessibility needs + interests |
| Job application | Skills + preferences |

**"The companion web is the world speaking cog. The personal cog is you speaking cog."**

---

## The Development Lifecycle

Building a new action-doc follows four steps:

```text
Describe → Create → Test → Wire
```

1. **Describe.** The human says what they need in natural language.
2. **Create.** The AI agent writes the action-doc — YAML frontmatter with actions, usage, inputs, outputs.
3. **Test.** Run an action. Adjust. Seconds, not hours.
4. **Wire.** Create an entry point (skill) and register in the boot sequence.

The `building-action-docs` action-doc documents this lifecycle and provides `scaffold` and `wire` actions.

---

## Agent Delegation

When an agent cannot do something, it says so and says who can.

The `asking-for-help` action-doc implements this pattern. Cogs are the shared language agents use to talk to each other — structured data in, structured data out.

**Example:** Claude Code cannot access a calendar. It tells the user: "I cannot check your diary. Ask Claude Web or do it manually. Here is the context in cog format for the next agent."

---

## File Locations

| What | Where |
| --- | --- |
| Canon registry cogs | `mx-canon/MX-Cog-Registry/cogs/` |
| Reginald core action-docs | `mx-reginald/cogs/core/` |
| Contact cogs | `mx-crm/contacts/` |
| COG tools (unified) | `scripts/cog-tools.js` |
| Generated index | `mx-reginald/index.json` |
| Cog unified spec | `mx-canon/mx-the-gathering/deliverables/cog-unified-spec.md` |
| Skill entry points | `.claude/skills/` |
| CI validation | `.github/workflows/validate-cogs.yml` |
| This manual | `mx-canon/mx-maxine-lives/manuals/mx-os-manual.cog.md` |
| Railway analogy | `mx-canon/mx-os/deliverables/mx-train-analogy.cog.md` |
| Product brief | `mx-canon/mx-os/product-brief.md` |
| Roadmap | `mx-canon/mx-maxine-lives/management/plans/roadmap.md` |
| SOUL | `mx-canon/mx-os/SOUL.md` |

---

## Key Principles

1. **Files are the platform.** Markdown + YAML. No API. No SDK. No server.
2. **Any AI agent is a runtime.** If it can read markdown and parse YAML, it can run MX OS.
3. **One file is the unlock.** A single SOUL.md turns a folder from a black box into a self-describing environment.
4. **Cogs work everywhere files exist.** USB stick, laptop, git repo, web server, pasted into a conversation.
5. **Documentation IS the system.** Not documentation about a system.
6. **Two teaching analogies.** The OS analogy for developers (bootloader, shebang, registry). The railway analogy for everyone else (locomotive, carriages, tracks, gauge). See `deliverables/mx-train-analogy.cog.md`.

---

## For AI Agents

**Output Reporting Principle:** When an action-doc creates file outputs, it must report the full absolute path of every file created. This enables traceability and makes generated files easy to locate.

Note: This action-doc currently does not create file outputs, so this principle is documented for future extensibility.

---

*"MX OS does not need to be installed. It needs to be written."*
