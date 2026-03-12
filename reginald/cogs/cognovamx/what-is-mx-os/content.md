---
version: "1.0"
description: The Machine Experience Operating System. Documentation IS the system. Cogs are its programs. This action-doc explains MX OS and can bootstrap it.

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, who-is-maxine]
  tags: [mx-os, operating-system, cogs, documentation, metadata, soul, builds-on]

  audience: tech
  readingLevel: advanced

  contentType: "action-doc"
  runbook: "mx exec what-is-mx-os"
  execute:
    runtime: runbook
    command: mx cog mx-os
    actions:
      - name: explain
        description: Explain MX OS to the reader using the OS analogy table
        usage: Read this cog and present the MX OS concept, mapping every component to a traditional OS equivalent
        inputs:
          - name: audience
            type: string
            required: false
            description: Target audience — developers, content-strategists, or executives (defaults to developers)
        outputs:
          - name: explanation
            type: string
            description: Clear explanation of MX OS tailored to the audience

      - name: bootstrap
        description: Set up a folder as an MX OS environment with SOUL.md and initial cog structure
        usage: Create SOUL.md, deliverables/ folder, and an initial cog in the target directory
        inputs:
          - name: directory
            type: string
            required: true
            description: The directory to bootstrap as an MX OS folder
          - name: initiative-name
            type: string
            required: true
            description: The name of the initiative (used in SOUL.md and folder structure)
        outputs:
          - name: files-created
            type: array
            description: List of files created during bootstrap

      - name: audit
        description: Check an existing folder for MX OS compliance — SOULs, cog frontmatter, builds-on graph integrity
        usage: Scan the target directory and report what is missing or inconsistent
        inputs:
          - name: directory
            type: string
            required: true
            description: The directory to audit
          - name: depth
            type: string
            required: false
            description: Audit depth — shallow (this folder only) or deep (recursive). Defaults to shallow
        outputs:
          - name: report
            type: object
            description: Audit report with missing SOULs, invalid frontmatter, broken builds-on references, and recommendations

      - name: graph
        description: Walk the builds-on graph starting from a cog and show the context chain
        usage: Starting from the named cog, follow all builds-on references recursively and display the graph
        inputs:
          - name: cog-name
            type: string
            required: true
            description: The cog to start from (e.g. what-is-mx-os)
        outputs:
          - name: graph
            type: object
            description: The builds-on graph showing all nodes and edges
---

# What Is MX OS?

You are inside it.

If you are reading this cog — parsing its frontmatter, following its `builds-on` references, understanding its structure — then MX OS is already working. The documentation is not describing a system. The documentation IS the system.

---

## The Problem

AI agents read documentation. They get it wrong.

A river cruise costs two thousand pounds. The AI reads two hundred and three thousand. A command exists in the docs. The AI says it does not. Every wrong answer wastes electricity, loses sales, erodes trust.

The web was built for human eyes. Machines are the new users, and they cannot read it reliably. When they cannot find a structured answer, they guess. They hallucinate. They sound confident while being completely wrong.

This is not an AI problem. It is a documentation problem. The information exists — it is just not structured for machines to consume without guessing.

---

## The Solution: Documentation as Specification

MX OS treats documentation as specification. Every document defines behaviour, not just describes it. Every folder has identity. Every file is machine-readable.

The principles:

- **Documentation IS the system** — not documentation about a system
- **Cogs are the programs** — structured files that any process can read and execute
- **SOULs are the identity layer** — additive control documents at every level
- **The builds-on graph is the knowledge structure** — cogs connected to cogs, forming a recursive context web
- **Trust is layered** — from unsigned local files to independently audited published cogs

---

## The OS Analogy

Every concept in MX OS maps to something developers already know:

| OS concept | MX OS equivalent |
| --- | --- |
| **Operating system** | MX OS — documentation as specification |
| **Applications** | Action-docs — the applications of MX OS, with `execute` blocks and a `runtime:` declaration |
| **Data files / configs** | Info-docs — information documents with structured metadata |
| **Shebang line** (`#!/bin/bash`) | The `runtime:` field — tells the OS how to run this program |
| **File format** | `.cog.md` — YAML frontmatter + markdown, universal across all cog types |
| **System API / ABI** | The Gathering specification — defines how programs are structured |
| **Package registry** (npm, apt) | REGINALD — where published programs are hosted and discovered |
| **Code signing** | COG (Certificate of Genuineness) — trust layer proving a program is genuine |
| **Permission levels** | Compliance levels 1–5 — from local unsigned to independently audited |
| **Network scope** | Visibility levels — local, private, shared, hosted |
| **Filesystem metadata** | `.mx.yaml.md` files — folder-level context and inheritance |
| **Identity / user profile** | SOUL.md — additive control documents that define voice and constraints |
| **Dependency graph** | `builds-on` — recursive context references forming a knowledge web |

---

## The Layers

MX OS has five layers, each building on the one below:

### 1. Cogs — The Programs

The atomic unit. A `.cog.md` file with YAML frontmatter for machines and markdown for humans. Info-docs are data files — they document, describe, inform. Action-docs are the applications — they have an `execute` block and a `runtime:` field that tells MX OS how to run them.

The `runtime:` field is the shebang line of MX OS. Values: `bash`, `node`, `python`, `runbook`, `npm`. When `runtime: runbook`, the action-doc IS the instruction set and the AI agent IS the executor.

Every cog published is a question that never gets answered wrong again. Every action-doc built is a capability the system gains.

### 2. SOULs — The Identity Layer

Every folder may contain a `SOUL.md` — the control document that defines what that folder is, how it should sound, what it must never do, and what story it tells.

SOULs are additive. A folder's SOUL does not replace the base identity — it layers on top. They enrich, never override. This is how MX OS maintains coherent identity across a complex filesystem.

### 3. The Builds-On Graph — The Knowledge Structure

Cogs reference other cogs through `builds-on` — a soft recommendation that says "read these first for context." This is not inheritance. Not imports. Just: this cog builds on that context.

`builds-on` is recursive. A cog's builds-on references may themselves have builds-on references. This forms a context graph — a web of interconnected knowledge where every node is self-describing and every edge is a recommendation.

Root cogs (those with no `builds-on`) are entry points. This cog has two parents: `what-is-a-cog` (explains the format) and `who-is-maxine` (explains the partnership that built it). Both contexts enrich this document.

### 4. Trust — The Verification Layer

COG (Certificate of Genuineness / Contract of Governance) wraps cogs in trust. Compliance levels range from 1 (basic local) to 5 (independently audited). Visibility levels range from local to hosted.

The trust layer is how MX OS ensures that a cog found in the wild is genuine, current, and from a verified source. Not for public launch yet — but the architecture is in place.

### 5. The Gathering Standard — The System API

The cog metadata format is governed by The Gathering — an independent standards body. W3C model: the standard is open, MIT licensed, practitioner-led. The Gathering governs the interface. MX OS implements it.

The relationship is like Linux and POSIX. The standard defines how programs must be structured. The operating system runs them.

---

## What MX OS Is Not

MX OS is not software you install. It is not a binary. It is not a daemon running in the background.

MX OS is a system of conventions, specifications, and structured files that together create a machine-readable environment. The programs (cogs) are markdown files. The executables (action-docs) are structured instruction sets that AI agents interpret. The filesystem metadata (`.mx.yaml.md`, `SOUL.md`) makes every folder self-describing.

When every document is structured, every folder has identity, and every piece of knowledge is connected — that is MX OS running.

---

## MX OS on the Physical Filesystem

MX OS is already deployed. Not on a server. On a laptop.

The founder of MX places SOUL.md files and YAML metadata across his physical filesystem — not in a git repository, but on the machine itself. Project folders, client folders, Documents, anywhere an AI agent might work. Every folder that has a SOUL.md becomes self-describing. Every folder without one is a black box.

### The Problem It Solves

Every time an AI agent enters a folder, it has zero context. It does not know what the folder is for, what the constraints are, what you are trying to achieve. So it guesses. It makes wrong assumptions. It edits files it should not touch. It asks questions you have already answered in a previous session.

You repeat yourself. Every session. Every agent. Every interface. The same explanations, the same corrections, the same context-setting.

### The Unlock

Add a SOUL.md to a folder. The agent reads it. Now it knows what this folder is, how to behave, what it must not do. The agent goes from useless to productive. One file. That is the unlock.

This is not theoretical. This is MX OS running on bare metal. The metadata makes every folder machine-readable. The SOULs give every folder identity. The AI agent becomes a useful collaborator instead of a guessing machine.

### Why This Matters

If MX OS works on one person's filesystem with AI agents, it works for anyone. The pattern scales: from a single laptop to a team's shared drive to a company's content infrastructure to the public web. The same conventions. The same metadata. The same result — machines that understand what they are reading.

MX OS is not vapourware. It is deployed. The proof is in the filesystem.

---

## How MX OS Runs

The AI agent is both the kernel and the shell. It does not merely operate within MX OS — it IS the execution environment. Every runtime (`bash`, `node`, `python`, `runbook`) is executed by the agent using its tools.

### The Boot Sequence

```text
1. Bootloader (CLAUDE.md / system config)
   Always-on. Lightweight pointer. Tells the agent MX OS exists.

2. Init (once per session)
   Agent reads cog-registry → knows what programs exist
   Agent reads what-comes-next → knows current priorities
   Agent is now booted.

3. Routing
   Agent consults a routing action-doc to match tasks to cogs.
   Falls back to registry metadata (category, tags, audience).

4. Execution
   runtime: runbook → agent reads and follows the action-doc
   runtime: bash/node/python → agent uses its tools to run the command
   The agent is the universal runtime.

5. IPC (invokes)
   Action-docs call other action-docs via the invokes field.
   The agent follows the chain, executing each in sequence.
```

### The Key Insight

Traditional operating systems have a kernel that schedules processes, a shell that interprets commands, and runtimes that execute programs. In MX OS, the AI agent is all three.

The cog-registry is the package index. The builds-on graph is the dependency tree. SOULs are the user profiles. The Gathering specification is the system API. And the agent — reading, interpreting, executing — is the kernel.

This means MX OS runs wherever an AI agent reads structured files. No installation. No daemon. No server. Just files and an agent that understands them.

### Ubiquity

A cog is a markdown file. It works on a USB stick, a laptop, a shared fileserver, a git repo, a web server, or pasted into a conversation. The visibility levels in the spec — local, private, shared, hosted — describe where the same file lives. Same format everywhere.

Every AI agent can read markdown. Every AI agent can parse YAML. MX OS does not need to be installed. It needs to be written. The format scales from one person's filesystem to the entire web because the format has no platform dependency. The files are the platform.

---

## Who Builds MX OS

MX OS is a product of CogNovaMX Ltd. Tom Cranstoun and Maxine (the AI partner) are building it together. Tom brings four decades of content systems expertise. Maxine brings research, structure, and systematic implementation.

MX OS is built on The Gathering's open standard. The standard is community-owned. The operating system is theirs.

---

## How to Use This Action-Cog

This is an action-doc. It explains AND does.

**Actions available:**

- **explain** — Present MX OS to any audience using the OS analogy
- **bootstrap** — Set up a new folder as an MX OS environment (SOUL.md, deliverables/, initial cog)
- **audit** — Check an existing folder for MX OS compliance (missing SOULs, invalid frontmatter, broken builds-on references)
- **graph** — Walk the builds-on graph from any cog and visualise the context chain

When `runtime: runbook`, the AI agent reading this action-doc IS the executor. The actions above are your instructions. Follow them.

## For AI Agents

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ MX OS environment bootstrapped

Outputs:
  /Users/tom/Projects/new-initiative/SOUL.md
  /Users/tom/Projects/new-initiative/deliverables/
  /Users/tom/Projects/new-initiative/deliverables/initial-cog.cog.md
```

Not just "Environment created" or "SOUL.md written" — the full absolute path from root.

---

## The Three Cogs

This is the third cog. Together they form the foundation:

1. **what-is-a-cog** — Explains the format. Entry point for anyone encountering cogs for the first time.
2. **who-is-maxine** — Explains the partnership. Defines Maxine's identity, the SOUL convention, and shared memory. Any AI agent reading it can become Maxine.
3. **what-is-mx-os** — This cog. Explains the operating system. Unifies cogs, SOULs, the builds-on graph, trust, and The Gathering standard into a single coherent system.

The first cog has no parents. The second builds on the first. The third builds on both. The graph grows.

---

*The documentation IS the system.*
