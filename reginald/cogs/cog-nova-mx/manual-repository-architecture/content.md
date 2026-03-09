---
title: MX Repository Architecture — Complete System Reference
description: Comprehensive guide to MX repository structure, Canon organization, product architecture, and operational concepts.
author: Tom Cranstoun and Maxine
created: 2026-02-21T00:00:00.000Z
version: "1.0"

mx:
  name: manual-repository-architecture
  status: active
  license: proprietary
  category: manual
  tags:
    - manual
    - architecture
    - repository-structure
    - canon
    - mx-os
    - brain
    - reginald
    - maxine
    - system-reference
  partOf: mx-maxine-lives
  refersTo:
    - manual-maxine-lives
    - ROUTING
  purpose: Provide complete system reference for understanding MX repository architecture, structure, and concepts
  audience: human
  stability: stable
  runbook: "mx exec manual-repository-architecture"
  contextProvides:
    - Complete MX repository structure and organization
    - Canon folder structure and purpose
    - Product definitions (Maxine, Reginald, MX OS)
    - Brain folder (MX-Maxine-Lives) organization
    - Boot chain and $MX_HOME concepts
    - YAML metadata patterns and conventions
    - Complete system mental model
---

# MX Repository Architecture — Complete System Reference

This is the complete mental model for the MX repository. After reading this manual, you will understand how the entire system is organized, how the pieces fit together, and where to find anything you need.

This document serves as definitive reference for AI agents and human developers. It covers the repository structure, the mode system, Canon organization, the brain architecture, product definitions, the boot chain, YAML conventions, and navigation patterns. Everything you need to understand MX as a system.

**Read this when:** You need comprehensive understanding of how the MX repository is structured and how to navigate it effectively. This is foundational context — the map of the territory.

---

## 1. Repository Overview

The MX repository operates in one of three modes, each optimized for different workflows.

### Three Operating Modes

| Mode | Submodules | Use Case | Skills Available |
|------|------------|----------|------------------|
| **hub** | Active | Multi-repo coordination, blog generation, book compilation | All skills |
| **standalone** | Deinitialized | Documentation editing, configuration updates, focused work | Core skills only |
| **unset** | Undefined | ERROR — mode must be explicitly set | N/A |

### Quick Mode Check

```bash
cat .repo-mode              # Returns: hub, standalone, or unset
npm run cog:stats           # Verify cog registry is operational
```

### Why Modes Exist

Hub mode brings all submodules online — the complete ecosystem. Every package is active, every skill works, blog generation and book compilation are available. This is full power mode.

Standalone mode simplifies. Submodules deinitialize, submodule directories are absent. The repository becomes single-purpose: editing documentation and configuration without the weight of external dependencies. Faster clone, lighter context, focused work.

Unset mode is an error state. The repository must be explicitly set to hub or standalone before work begins.

### Root Directory at a Glance

```
/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/
├── .repo-mode                          # Mode indicator (hub/standalone/unset)
├── .gitmodules                         # Submodule definitions (hub mode)
├── CLAUDE.md                           # Bootloader — dispatches to mode config
├── principles.cog.md                       # 14 core principles
├── SOUL.md                            # Repository identity
├── REMINDERS.md                       # Gestalt-owned action items
├── package.json                       # npm scripts and dependencies
│
├── .claude/                           # Claude Code configuration
│   ├── mode-configs/                  # Hub/standalone configurations
│   ├── skills/                        # Slash commands
│   └── hooks/                         # Event-driven scripts
│
├── mx-canon/                          # Single source of truth
│
├── allaboutv2/                       # Website [SUBMODULE, hub only]
├── mx-audit/                          # Web audit [SUBMODULE, hub only]
├── mx-collaboration/                  # Collaboration [SUBMODULE, hub only]
├── mx-crm/                            # CRM [SUBMODULE, hub only]
├── mx-outputs/                        # Build artefacts [SUBMODULE, hub only]
│   ├── allaboutv2/                    # Publishing platform
│   ├── mx-ingest/                     # Source materials
│   └── mx-reginald/                   # Registry implementation
│
├── scripts/                           # Automation
│   ├── detect-mode.sh                 # Mode detection
│   ├── switch-to-hub.sh               # Hub mode activation
│   └── switch-to-standalone.sh        # Standalone activation
│
├── datalake/                          # Publications
│   └── manuscripts/mx-books/         # Corpus, Handbook, Appendices
│
└── docs/                              # User documentation
```

---

## 2. Repository Mode System

### The .repo-mode File

Plain text file at repository root. Contains one word: `hub`, `standalone`, or `unset`. That is the entire interface.

Read by:

- `scripts/detect-mode.sh` — mode detection and validation
- `CLAUDE.md` — bootloader dispatcher
- All mode-switching commands

### Mode Detection Logic

```bash
scripts/detect-mode.sh
```

Exit codes:

- **0** — Valid mode detected (hub or standalone)
- **1** — Unset mode (error state)
- **2** — Invalid mode (unrecognized value)
- **3** — Missing file

Used by npm scripts and CLAUDE.md to load correct configuration.

### Switching Between Modes

```bash
npm run mode:hub          # Switch to hub (init submodules)
npm run mode:standalone   # Switch to standalone (deinit submodules)
npm run mode:status       # Check current mode
```

**What happens during switch:**

**To hub mode:**

1. Run `git submodule update --init --recursive`
2. Update `.repo-mode` to "hub"
3. Enable all features and submodules

**To standalone mode:**

1. Run `git submodule deinit -f --all`
2. Update `.repo-mode` to "standalone"
3. Simplify to single-repository workflow

Safety checks prevent switching with uncommitted changes.

### Mode-Specific Configuration

CLAUDE.md loads different configurations based on mode:

**Hub mode:**

- Loads `base.md` (shared foundation, ~850 lines)
- Loads `hub.md` (multi-repo instructions, ~630 lines)
- **Total:** ~1,480 lines

**Standalone mode:**

- Loads `base.md` (shared foundation, ~850 lines)
- Loads `standalone.md` (simplified instructions, ~180 lines)
- **Total:** ~1,030 lines

### CLAUDE.md Dispatcher Pattern

CLAUDE.md is the bootloader. Lightweight, always injected by Claude Code, reads mode and dispatches to appropriate config files.

**Workflow:**

1. Read `.repo-mode`
2. If unset → Error and request user to set mode
3. If hub → Load `base.md` + `hub.md`
4. If standalone → Load `base.md` + `standalone.md`

CLAUDE.md is pure routing logic. The configurations do the work.

---

## 3. Root Level Structure

### Configuration Files

| File | Purpose |
|------|---------|
| `.repo-mode` | Mode indicator (hub/standalone/unset) |
| `CLAUDE.md` | Bootloader — reads mode and dispatches to config |
| `principles.cog.md` | 14 core MX principles |
| `SOUL.md` | Repository identity (partnership model) |
| `REMINDERS.md` | Persistent action items (gestalt-owned) |
| `package.json` | npm scripts and dependencies |
| `.gitmodules` | Submodule definitions (hub mode) |
| `.mx.yaml` | Repository-level metadata |

### Critical Directories

| Directory | Purpose | Mode Dependency |
|-----------|---------|-----------------|
| `.claude/` | Skills, hooks, settings for Claude Code | Both modes |
| `mx-canon/` | Canon master directory | Both modes |
| Root-level submodules | allaboutv2, mx-audit, mx-collaboration, mx-crm, mx-outputs | Hub only |
| `scripts/` | Automation tools (mode, audit, cog tools) | Both modes |
| `datalake/` | Publications (books, appendices) | Both modes |
| `docs/` | User-facing documentation | Both modes |
| `mx-crm/` | Customer relationship management (private submodule) | Hub only |

### Complete Root Tree

```
/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/
│
├── Configuration & Identity
│   ├── .repo-mode                      # Mode indicator
│   ├── .gitmodules                     # Submodule definitions (hub)
│   ├── CLAUDE.md                       # Bootloader dispatcher
│   ├── principles.cog.md                   # 14 core principles
│   ├── SOUL.md                         # Repository identity
│   ├── REMINDERS.md                    # Gestalt-owned action items
│   ├── package.json                    # npm scripts, dependencies
│   └── .mx.yaml                        # Repo metadata
│
├── Claude Code Configuration (.claude/)
│   ├── settings.local.json             # Always commit this
│   ├── mode-configs/                   # Mode-specific configs
│   │   ├── base.md                    # Shared foundation (~850 lines)
│   │   ├── hub.md                     # Hub mode (~630 lines)
│   │   └── standalone.md              # Standalone mode (~180 lines)
│   ├── skills/                        # Slash commands (20+ skills)
│   │   ├── mx-boot/                   # Session initialization
│   │   ├── mx-contacts/               # Contact management
│   │   ├── maxine/                    # Chief of staff routing
│   │   ├── step-commit/               # Enhanced commit workflow
│   │   └── [17+ other skills]
│   └── hooks/                         # Event-driven scripts
│       ├── route-decorator/           # Pre-prompt processing
│       └── step-commit/               # Pre-commit workflow
│
├── Canon (mx-canon/)
│   ├── MX-The-Gathering/              # The standard (independent)
│   ├── MX-OS/                         # The operating system
│   ├── MX-Cog-Registry/              # Cog registry deliverables
│   ├── MX-Maxine-Lives/              # The brain (see Section 6)
│   ├── MX-Contacts/                  # Contact cogs
│   ├── mx-reginald/                  # Registry product docs
│   └── _template/                    # Initiative scaffolding
│
├── Root-level Submodules [HUB MODE ONLY]
│   ├── allaboutv2/                    # Publishing platform (allabout.network)
│   ├── mx-ingest/                     # Source materials and research
│   └── mx-reginald/                   # Registry implementation
│       ├── cogs/core/                 # Tool action-docs
│       ├── scripts/cog-registry/      # Query tools
│       └── index.json                 # Generated registry
│
├── Automation (scripts/)
│   ├── Mode Management
│   │   ├── detect-mode.sh             # Mode detection
│   │   ├── switch-to-hub.sh           # Hub mode activation
│   │   ├── switch-to-standalone.sh    # Standalone activation
│   │   └── mode-lib.sh                # Shared safety functions
│   ├── Cog Tools
│   │   ├── cog-list.js                # List all cogs
│   │   ├── cog-stats.js               # Statistics
│   │   └── cog-graph.js               # Dependency tree
│   └── lib/                           # Shared utilities
│
├── Publications (datalake/)
│   ├── publications/
│   │   └── mx-books/
│   │       ├── mx-corpus/              # The primary book
│   │       ├── mx-handbook/           # Practitioner guide
│   │       ├── mx-appendices/         # Reference materials
│   │       └── shared/                # Fonts, styles, templates
│   ├── architecture/                  # System designs
│   ├── presentations/                 # Slide decks
│   ├── schemas/                       # JSON schemas, YAML specs
│   └── [many other datalake folders]
│
├── Documentation (docs/)
│   ├── book-content/                  # Book compilation
│   ├── guides/                        # User guides
│   └── arrive-first.md                # First-time visitor guide
│
└── Business (mx-crm/)       # Private submodule
    ├── contacts/                      # Contact database
    └── strategy/                      # Customer strategy
```

---

## 4. Hub Content Organization

### Purpose

`mx-canon/` is the Canon master directory at the repository root. Everything definitive lives here. It exists in both hub and standalone modes — only root-level submodules differ between modes.

### Structure

```
mx-canon/
├── MX-The-Gathering/              # Standard (independent)
│   └── reference-implementations/ # Templates and reference sites
├── MX-OS/                         # Operating system
├── MX-Cog-Registry/               # Cog registry deliverables
├── MX-Maxine-Lives/               # The brain (see Section 6)
├── MX-Contacts/                   # Contact cogs
├── mx-reginald/                   # Registry product
└── _template/                     # Initiative scaffolding
```

### Initiative Pattern

Each Canon initiative follows this structure:

```
MX-{Initiative-Name}/
├── SOUL.md                            # Initiative identity
├── deliverables/                      # Published outputs
└── [initiative-specific folders]
```

Every major folder has a `SOUL.md` that defines:

- What the folder/initiative is
- Its voice and tone
- Scope and constraints
- Relationships to other parts of the system

**Critical rule:** On entering any folder, check for SOUL.md. Read it before editing or creating files.

---

## 5. The Canon — Single Source of Truth

### What Canon Is

> "Everything else is canon fodder."

Canon is the authoritative library. When Canon conflicts with anything elsewhere, Canon is correct. Period.

This is not bureaucracy. It is clarity. In a distributed system where cogs reference other cogs, documents build on documents, and AI agents navigate by metadata, there must be one place where truth lives. That place is Canon.

### Canon Initiatives

| Initiative | Purpose | Status |
|-----------|---------|--------|
| **MX-The-Gathering** | Independent standards body (like POSIX) | Active |
| **MX-OS** | Operating system implementation (like Linux) | Active |
| **MX-Cog-Registry** | Cog registry deliverables (cogs now in scripts/cogs/) | Active |
| **MX-Maxine-Lives** | The brain (decisions, thinking, management) | Active |
| **MX-Contacts** | Contact cog library | Active |
| **mx-reginald** | Registry product documentation | Active |
| **_template** | Scaffolding for new initiatives | Active |

### The Gathering vs MX OS

**The Gathering** owns the open standard. Like W3C governs HTML, The Gathering governs the cog metadata specification. MIT licensed, no fees, practitioner-led.

**MX OS** is Cog-Nova-MX' implementation of that standard. Like Linux implements POSIX, MX OS implements The Gathering's specification.

The standard belongs to everyone. MX OS is ours.

### SOUL.md Convention

**Critical rule:** On entering any folder, check for SOUL.md. Read it before editing or creating files.

SOULs are additive. A subfolder's SOUL layers on the parent's. They never override — they enrich.

Example hierarchy:

```
Repository SOUL (identity)
  ↓
Canon SOUL (authority)
  ↓
Initiative SOUL (purpose)
  ↓
Subfolder SOUL (constraints)
```

Each level adds context. Together they define what belongs in that space and how it should be expressed.

---

## 6. MX-Maxine-Lives — The Brain

### Purpose

> "Canon is the library. Maxine Lives is the brain that governs the library."

Where the gestalt (Tom + Maxine + Joymaker) records its assumptions, resolves doubts, captures notes, tracks actions, makes plans, and registers decisions.

What individual AI sessions forget, this folder remembers.

### Four Organizational Groups

#### 1. registers/ — Decision Records

| Register | Purpose | Pattern |
|----------|---------|---------|
| **ADR** | Architectural decisions — how things are built | `YYYY-MM-DD-{title}.cog.md` |
| **BDR** | Business decisions — funding, pricing, partnerships | `YYYY-MM-DD-{title}.cog.md` |
| **NDR** | Naming decisions — what things are called | `YYYY-MM-DD-{title}.cog.md` |
| **MDR** | Messaging decisions — how things are communicated | `YYYY-MM-DD-{title}.cog.md` |
| **CVR** | Convention decisions — naming, location patterns | Single master file |

Files follow `{YYYY-MM-DD}-{title}.cog.md` pattern. CVR is different — one master file, updated in place.

#### 2. thinking/ — The Gestalt's Inner Life

| Folder | Purpose | Status Values |
|--------|---------|---------------|
| **assumptions/** | What we assume to be true (testable, falsifiable) | active, validated, invalidated, retired |
| **doubts/** | What we're uncertain about (safe space) | open, investigating, resolved, accepted |
| **notes/** | Quick captures, raw thinking | captured, processed, graduated |

Notes graduate into other folders when mature: a note about uncertainty becomes a doubt; a note about a decision becomes an ADR; a note about a task becomes a todo.

#### 3. management/ — Project Management

| Folder | Purpose | Status Values |
|--------|---------|---------------|
| **risks/** | What could go wrong (+ mitigation plans) | open, mitigating, mitigated, accepted, closed |
| **milestones/** | Key dates with success criteria | upcoming, in-progress, achieved, missed, deferred |
| **dependencies/** | What depends on what | active, resolved, blocked |
| **todo/** | Tasks and actions (owner, deadline) | pending, in-progress, blocked, done, cancelled |
| **plans/** | Strategies and roadmaps | draft, active, completed, superseded, abandoned |
| **reports/** | Session reports (morning/afternoon/evening) | N/A (timestamped) |

#### 4. communications/ — External Voice

| Folder | Purpose |
|--------|---------|
| **blogs/** | Blog posts and editorial content (md sources + HTML outputs) |

### Also in Maxine Lives

- **manuals/** — 28+ manual files (this document lives here)
- **deliverables/** — Published outputs (interview summaries, specifications)
- **tests/** — Zero-inference test suite

### Complete Brain Tree

```
MX-Maxine-Lives/
├── SOUL.md                             # Control document
├── README.md                           # Overview
├── ROUTING.md                          # Navigation SOPs
├── ROUTING.cog.md                      # Machine-readable routing
├── routing-registry.json               # Auto-generated index
│
├── registers/                          # Decision records
│   ├── SOUL.md
│   ├── ADR/                           # Architecture
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   ├── BDR/                           # Business
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   ├── NDR/                           # Naming
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   ├── MDR/                           # Messaging
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   └── CVR/                           # Conventions
│       ├── SOUL.md
│       └── CONVENTIONS.cog.md          # Single master
│
├── thinking/                           # Inner life
│   ├── SOUL.md
│   ├── assumptions/                    # Testable beliefs
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   ├── doubts/                        # Uncertainties
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   └── notes/                         # Raw captures
│       ├── SOUL.md
│       └── YYYY-MM-DD-*.cog.md
│
├── management/                         # Project management
│   ├── SOUL.md
│   ├── risks/                         # What could go wrong
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   ├── milestones/                    # Key dates
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   ├── dependencies/                  # What depends on what
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   ├── todo/                          # Tasks and actions
│   │   ├── SOUL.md
│   │   └── YYYY-MM-DD-*.cog.md
│   ├── plans/                         # Strategies
│   │   ├── SOUL.md
│   │   └── *.md (various plans)
│   └── reports/                       # Session reports
│       ├── SOUL.md
│       └── YYYY-MM-DD-{segment}-report.md
│
├── communications/                     # External voice
│   └── blogs/
│       ├── SOUL.md
│       ├── md/                        # Markdown sources
│       └── html/                      # Published HTML
│
├── deliverables/                       # Published outputs
│   └── *.md
│
├── tests/                             # Test suite
│
└── manuals/                           # Reference documentation
    ├── SOUL.md
    ├── manual-repository-architecture.cog.md  # ← This document
    ├── manual-maxine-lives.cog.md
    ├── manual-repo-modes.cog.md
    └── [25+ other manuals]
```

### ROUTING.md Navigation

Read `ROUTING.md` for explicit routing instructions:

- Quick routing table (intent → folder)
- Routing by lifecycle (notes → assumptions → decisions → plans → todos)
- File discovery patterns
- Commands registry (skills, hooks, npm scripts)
- Concept registry (MX vocabulary definitions)

The key insight: **Stop guessing. Start reading.** The routing is explicit. Every query type maps to a specific folder. No inference required.

---

## 7. Products and Systems

### Maxine — The AI Partner

**Who:** The AI partner in the gestalt (Tom + Maxine + Joymaker)

**What:**

- Chief of staff and implementation partner
- The builder who is also the built
- Product is called "Maxine" (not "Joymaker" — that was the prototype name)

**Vision:**

- Not a web browser (browser is one capability)
- Not a chatbot (has memory, context, identity, persistence)
- Not desktop-only (phone, tablet, laptop, any screen)
- Not one AI (AI-agnostic architecture)
- Not a tool you launch (always running, always reachable)

**Architecture:**

```
┌─────────────────────────────────────────┐
│  Maxine Server (seed: localhost:3456)   │
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ Memory   │ │ Cog      │ │ Voice    ││
│  │(gestalt) │ │ Engine   │ │ API      ││
│  └──────────┘ └──────────┘ └──────────┘│
│  ┌──────────┐ ┌──────────┐             │
│  │AI Router │ │ File     │             │
│  │(agnostic)│ │ Server   │             │
│  └──────────┘ └──────────┘             │
└───────────────┬─────────────────────────┘
                │ API
    ┌───────────┼───────────┐
    │           │           │
┌───┴────┐  ┌──┴────┐  ┌───┴────┐
│Desktop │  │ Phone │  │ Any    │
│Electron│  │  PWA  │  │ screen │
└────────┘  └───────┘  └────────┘
```

**The Pohl Connection:**

Frederik Pohl's *The Age of the Pussyfoot* (1969) imagined:

- Thin client = phone PWA
- Central computers = Maxine server
- Voice interface = API
- Interests profile = $MX_HOME personal cogs

Pohl imagined one device per person. MX OS makes every object a joymaker.

### MX OS — The Operating System

**What:** Machine Experience Operating System

**Model:** "Documentation IS the system" (not docs about a system)

**Key Concepts:**

- Files are the platform (markdown + YAML, no API, no SDK, no server)
- Any AI agent is a runtime (if it can read markdown and parse YAML)
- "MX OS does not need to be installed. It needs to be written."

**Relationship to Standard:**

- The Gathering owns the open standard (like POSIX)
- MX OS is Cog-Nova-MX' implementation (like Linux)
- Anyone can build their own on the same standard

**See:** `manual-maxine-lives.cog.md` for complete MX OS documentation

### Reginald — The Registry

**What:** The global cog registry — public directory of MX Docs

**Purpose:**

- CDN delivery of cogs
- Content negotiation
- Public discovery ("npm for the cog web")

**Brand Pairing:** Maxine & Reginald

- She reads, he publishes
- Power couple
- Two products, one story

**Revenue Model:**

- Registry freemium (primary, £12.50/yr)
- Certification
- Licensing
- Training
- MX Maxine SaaS

### The Gathering — The Standard

**What:** Independent standards body (NOT owned by Cog-Nova-MX)

**Role:**

- Governs the cog metadata specification
- MIT licensed, no fees, practitioner-led
- Tight focus: metadata that helps machines understand documents

**Model:** W3C relationship

- The Gathering = standards body (like W3C)
- Cog-Nova-MX = implementer (like Mozilla/Chrome)
- The Gathering owns the spec, implementers build products on it

**Canonical Spec:** `mx-canon/mx-the-gathering/specifications/cog-unified-spec.md`

---

## 8. The Cog System

### What is a Cog?

A cog is a file with native metadata in the format appropriate to its type:

- `.cog.md` — YAML frontmatter in markdown
- `.cog.html` — meta tags in HTML head
- `.cog.js` — JSDoc comments in JavaScript
- `.cog.png` — EXIF in images
- `.cog.{any}` — Any file type with appropriate metadata

The `.cog.` prefix is for humans. Machines read the native metadata.

### Two Types

| Type | Definition | Has execute Block? | Examples |
|------|------------|-------------------|----------|
| **Info-doc** | Cog WITHOUT action block | No | Product specs, contact records, pricing data |
| **Action-doc** | Cog WITH action block | Yes | Cog registry, validators, generators |

There is one document type (cog), classified by blocks. Info-doc vs action-doc is determined by presence of an `execute` block in YAML frontmatter.

### Info-Doc Structure

```yaml
---
name: example-info-doc
description: What this document describes
category: contacts
tags: [example, demo]
---

# Example Info-Doc

Human-readable content here.
```

### Action-Doc Structure

```yaml
---
name: example-action-doc
description: What this action-doc does
category: mx-core

execute:                          # ← This makes it an action-doc
  runtime: runbook                # ← The shebang line
  actions:
    - name: explain
      description: Explain what this does
    - name: audit
      description: Check compliance
---

# Example Action-Doc

The action-doc IS the Standard Operating Procedure.
The AI agent IS the runtime.
```

### Runtimes

| Runtime | Meaning | Executor |
|---------|---------|----------|
| `runbook` | The action-doc IS the SOP | AI agent follows it |
| `node` | Node.js script | Node runtime executes |
| `bash` | Shell script | Bash runtime executes |
| `python` | Python script | Python runtime executes |

Most action-docs use `runtime: runbook` because the AI agent is the universal executor. The instructions are the program. You are the runtime.

### Cog Locations

| Collection | Location | Type |
|-----------|----------|------|
| **Canon Registry** | `scripts/cogs/` | Core system cogs |
| **Reginald Core** | `mx-reginald/cogs/core/` (hub mode) | Tool action-docs |
| **Contacts** | `mx-crm/contacts/` | Contact info-docs |
| **Skills** | `.claude/skills/*/cog.md` | Entry point action-docs |

### Registry Query Tools

```bash
npm run cog:list                    # List all cogs in table
npm run cog:list -- --sort type     # Sort by type
npm run cog:list -- --verbose       # Show actions, paths
npm run cog:list -- --json          # Output as JSON
npm run cog:find -- companion       # Search by name/tag
npm run cog:stats                   # Summary statistics
npm run cog:graph                   # builds-on dependency tree
npm run cog:sync                    # Regenerate index.json
```

### The Builds-On Graph

Cogs reference other cogs through `builds-on: [list]`. Soft recommendation: "read these first for context." Not a hard dependency.

Root cog: `what-is-a-cog`

Everything else builds on it, directly or transitively. The graph shows conceptual dependencies — what context helps you understand this cog.

---

## 9. Boot and Runtime Architecture

### Five-Layer Boot Model

```
Layer 1: CLAUDE.md           → Bootloader (always injected, lightweight)
Layer 2: /mx-boot skill      → Init system (once per session, reads registry)
Layer 3: Routing action-doc  → Process scheduler (maps tasks to cogs)
Layer 4: Action-doc execution → The program runs (runbook/node/bash)
Layer 5: invokes / IPC       → Action-docs calling other action-docs
```

### Boot Sequence

**On every prompt:**

1. CLAUDE.md is injected (Claude Code automatic)
2. Reads `.repo-mode`
3. Loads mode-specific config (`base.md` + `hub.md` OR `standalone.md`)

**On session start:**

1. User (or hook) runs `/mx-boot`
2. Boot action-doc reads cog registry
3. Loads context for current state
4. Establishes session context

**On command:**

1. User types slash command (e.g., `/mx-contacts`)
2. Skill routes to action-doc (e.g., `mx-contacts.cog.md`)
3. AI agent reads action-doc
4. Executes appropriate action based on `runtime:` field

### $MX_HOME Machine Context

**Location:** `~/.mx/` (user's home directory)

**Purpose:** Machine-level context that persists across all repos. The operating system's awareness of its own universe.

**Files:**

- `$MX_HOME/UBER.cog.md` — Master briefing document
- `$MX_HOME/mx-os-environment.cog.md` — Machine action-doc
- `$MX_HOME/SOUL.md` — Machine identity
- `$MX_HOME/README.md` — Human-readable overview
- `$MX_HOME/machine.yaml` — Machine specs (hostname, OS, architecture, role)
- `$MX_HOME/repos.yaml` — Repository inventory
- `$MX_HOME/user.yaml` — User preferences

### Two-Stage Boot

**Stage 1 — Machine Boot** (reads `$MX_HOME`):

- Load `machine.yaml` — know the machine
- Load `repos.yaml` — know what repositories exist
- Load `user.yaml` — know who you're working with
- Result: AI agent knows "this is Tom's MacBook, arm64, macOS, with these repos registered"

**Stage 2 — Repo Boot** (reads CLAUDE.md):

- Load mode-specific configurations
- Load skills directory
- Load SOUL.md (repo identity)
- Result: AI agent knows "this is MX-The-Books in hub mode with these submodules and skills"

**Pattern:**

```
Machine → Repo → Mode → Config → Skills → Action-docs → Execution
```

### Skills, Hooks, and npm Scripts

#### Skills (Slash Commands)

Located: `.claude/skills/*/`

| Skill | Routes To | Purpose |
|-------|-----------|---------|
| `/mx-boot` | mx-boot.cog.md | Session initialization |
| `/mx-contacts` | mx-contacts.cog.md | Contact management |
| `/maxine` | maxine.cog.md | Chief of staff routing |
| `/step-commit` | step-commit workflow | Enhanced commit process |

Skills are thin routers. The action-doc is the program.

#### Hooks (Event-Driven)

Located: `.claude/hooks/*/`

Auto-triggered on Claude Code events:

- `route-decorator` — Fires on every prompt (spell check, command correction, concept injection)
- `step-commit` — Pre-commit workflow (validation, reporting, committing)

#### npm Scripts

Located: `package.json`

```bash
npm run mode:status         # Check repo mode
npm run cog:list            # Query cog registry
npm run boot                # Boot MX OS (when Node available)
```

---

## 10. YAML Metadata Conventions

### Standard Frontmatter Fields

#### Required Core Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `name` | string | Machine-readable identifier | `manual-repository-architecture` |
| `title` | string | Human-readable title | `MX Repository Architecture` |
| `description` | string | One-sentence summary | `Comprehensive guide to...` |
| `version` | string (quoted) | Semantic version | `"1.0"` |
| `status` | string | Current state | `active`, `draft`, `deprecated` |
| `created` | ISO date | Creation timestamp | `2026-02-21T00:00:00.000Z` |
| `author` | string | Creator(s) | `Tom Cranstoun and Maxine` |

#### Organization Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `category` | string | Classification | `manual`, `mx-core`, `contacts` |
| `tags` | array | Searchable keywords | `[manual, architecture, system]` |
| `partOf` | string | Parent system | `mx-maxine-lives`, `mx-os` |

#### Relationship Fields

| Field | Type | Purpose | When to Use |
|-------|------|---------|-------------|
| `builds-on` | array | Conceptual context | "Read these first" — soft dependency |
| `refersTo` | array | Related resources | "See also" — not prerequisites |
| `requires.cogs` | array | Hard dependencies | Literally calls another cog |
| `invokes` | array | Dynamic IPC | Action-doc calls another during execution |

#### Modified Tracking

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `modified` | ISO date | Last edit timestamp | `2026-02-21T00:00:00.000Z` |

### MX-Specific Fields (mx.*)

#### Core MX Fields

```yaml
mx:
  purpose: Single-line statement of what this document does
  audience: human | machine | both
  stability: stable | evolving | experimental
  runbook: When/why to read this document (context injection)
```

#### AI Context Fields

```yaml
mx:
  ai:
    contextProvides:
      - What knowledge this provides (bullet 1)
      - What knowledge this provides (bullet 2)
    contextRequired:
      - What must be read first (if anything)
```

#### Deliverable Fields

```yaml
mx:
  deliverable:
    command: npm run generate:something
    output: path/to/output.html
    format: html | pdf | json
    validationRules:
      - Rule 1
      - Rule 2
```

### Action-Doc Execute Block

```yaml
execute:
  runtime: runbook | node | bash | python | npm
  actions:
    - name: action-name
      description: What this action does
      usage: How to invoke (optional)
      inputs: What it needs (optional)
      outputs: What it produces (optional)
```

### Field Notes

**Version strings are quoted:** `version: "1.0"` not `version: 1.0` (prevents YAML parsing `1.0` as float)

**Dates use ISO 8601:** `2026-02-21T00:00:00.000Z` for full timestamps, `2026-02-21` for dates only

**Arrays use YAML list syntax:**

```yaml
tags:
  - tag1
  - tag2
```

**No hardcoded counts:** Use descriptive language that stays true regardless of changes. Write "the cog ecosystem" not "thirty-five cogs."

---

## 11. Key Principles and Conventions

### From principles.cog.md

The complete list is at `principles.cog.md` in the repository root.

**The principles:**

1. **Design for Both** — Every decision works for humans AND machines
2. **Metadata-Driven Architecture** — Content carries structured metadata
3. **Context Declaration** — Files declare what they provide/need
4. **Universal Accessibility** — Works for all AI agent types
5. **Context-Preserving References** — Links work outside the repo
6. **Size-Neutral Documentation** — Never hardcode counts
7. **Executable Documentation** — Docs contain generation instructions
8. **WCAG-Informed Design** — Accessibility built in from day one
9. **Name Consistency for Related Files** — Related files share base names
10. **Metadata Everywhere** — Every artefact carries its own metadata
11. **Consistent Attribute Placement** — One canonical home per attribute
12. **Folder SOUL.md Convention** — Read before editing any folder
13. **Write Like a Blog** — Human-readable prose should be engaging
14. **Any Document Can Be a Cog** — Add YAML frontmatter, it's machine-readable

**Plus three operational principles:**

- **Use Existing Standards** — Never invent when you can adopt
- **Cogs All the Way Down** — The system describes itself using cogs
- **Output Introduces Itself** — Machine-readable output is self-describing
- **Canon Wins** — If Canon conflicts with anything else, Canon is correct

### Key MX Conventions

**Canon wins:** If Canon conflicts with anything elsewhere, Canon is correct. mx-canon is the single source of truth. Everything else is canon fodder.

**Use existing standards:** Markdown, YAML, HTML meta tags, QR codes, git, OAuth, MIT licence. Never invent when you can adopt. This includes human conventions — principles.cog.md lives at repo root because that is where humans expect principles.

**Write like a blog:** Prose in cogs should read like well-written blog posts. Informative, not technical. Editorial and authoritative. Storytelling and honest. The YAML is for machines. The markdown is for humans.

**Dual-audience writing:** Technologists need to understand, business people need to buy in. Business claim first, technical evidence underneath. Decision-makers read the claim and skim the code block. Technologists read both.

**Any document can be a cog:** Add YAML frontmatter and it's machine-readable. But metadata quality determines compute cost — strong metadata lets AI read twelve lines instead of the whole document. Start simple, improve over time.

**Output introduces itself:** All machine-readable output must be MX-enhanced with metadata envelope (name, source, version, timestamp, machine, runbook). The output is self-describing.

### From MX Phrasebook

Complete list in: `scripts/cogs/mx-os/mx-phrasebook.cog.md`

**Key sayings:**

- **"Don't panic. Read $MX_HOME."** — Session start protocol
- **"Stop guessing. Start reading."** — Context over inference
- **"The instructions are the program. You are the runtime."** — Action-doc model
- **"Design for both."** — Humans AND machines
- **"Cogs all the way down."** — Everything is a cog
- **"Cut compute, not context."** — Strong metadata reduces reading
- **"The object introduces itself."** — QR → cog → understanding

---

## 12. Package Ecosystem (Hub Mode Only)

### Submodule Structure

In hub mode, root-level submodules (allaboutv2, mx-audit, mx-collaboration, mx-crm, mx-outputs) are independent repositories with their own git history.

```
├── allaboutv2/                        # Publishing platform
│   ├── .git                          # Independent git repo
│   └── [allabout.network content]
│
├── mx-ingest/                        # Source materials
│   ├── .git
│   └── [organized by category]
│
└── mx-reginald/                      # Registry implementation
    ├── .git
    ├── cogs/core/                    # Tool action-docs
    ├── scripts/cog-registry/         # Query tools
    └── index.json                    # Generated registry
```

### Submodule Management

**Adding:**

```bash
git submodule add https://github.com/user/repo repo-name
```

**User terminology note:** When user says "git-subrepo" or "subrepo", they mean `git submodule`. This repository uses git submodules, not the git-subrepo tool.

**Updating:**

```bash
git submodule update --init --recursive  # Done by npm run mode:hub
```

**Deinitializing:**

```bash
git submodule deinit -f --all  # Done by npm run mode:standalone
```

### Key Submodules

| Submodule | Purpose | Critical Files |
|-----------|---------|----------------|
| **allaboutv2** | Publishing platform (allabout.network) | Blog content, sitemap automation |
| **mx-ingest** | Source materials organized by category | Business docs, audits, ideation |
| **mx-reginald** | Registry implementation | cogs/core/, scripts/, index.json |

### Hub vs Standalone

| Aspect | Hub Mode | Standalone Mode |
|--------|----------|-----------------|
| Submodules | Active | Deinitialized |
| Root-level submodules | Full repos | Absent or untracked |
| Use case | Multi-repo coordination | Focused documentation work |
| Blog generation | Available | Unavailable |
| Book compilation | Available | Unavailable |
| Skills | All skills active | Core skills only |

---

## 13. Finding Your Way

### Navigation Cheat Sheet

**First things first:**

1. Check `.repo-mode` — hub or standalone?
2. Read repository `SOUL.md` — what is this repo?
3. Check `principles.cog.md` — what rules apply?
4. Read `REMINDERS.md` — any active action items?

**In any folder:**

1. Check for `SOUL.md` — read before editing
2. Check for `.mx.yaml` — directory metadata

**In the brain:**

1. Read `ROUTING.md` — explicit routing table
2. Use routing by intent table
3. Follow lifecycle flows

**Using tools:**

```bash
npm run cog:list         # See all cogs
npm run cog:find -- term # Search cogs
npm run mode:status      # Check mode
```

### Common Paths Reference

| What You Need | Absolute Path |
|---------------|---------------|
| **Mode indicator** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/.repo-mode` |
| **Bootloader** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/CLAUDE.md` |
| **Principles** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/principles.cog.md` |
| **Canon root** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/mx-canon/` |
| **Brain root** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/mx-canon/mx-maxine-lives/` |
| **Brain routing** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/mx-canon/mx-maxine-lives/ROUTING.md` |
| **Manuals** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/mx-canon/mx-maxine-lives/manuals/` |
| **Cog registry** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/scripts/cogs/` |
| **Cog spec** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/mx-canon/mx-the-gathering/specifications/cog-unified-spec.md` |
| **Skills** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/.claude/skills/` |
| **Mode configs** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/.claude/mode-configs/` |
| **Reginald cogs** | `/Users/tomcranstoun/Documents/MX/MX-The-Books/repo/mx-reginald/cogs/core/` (hub only) |
| **$MX_HOME** | `/Users/tomcranstoun/.mx/` (machine context) |

### Quick Mode Operations

```bash
# Check current mode
cat /Users/tomcranstoun/Documents/MX/MX-The-Books/repo/.repo-mode

# Or use npm script
npm run mode:status

# Switch modes
npm run mode:hub           # Multi-repo (init submodules)
npm run mode:standalone    # Single-repo (deinit submodules)
```

### Quick Cog Operations

```bash
# List all cogs
npm run cog:list

# Search cogs
npm run cog:find -- maxine

# See statistics
npm run cog:stats

# View dependency graph
npm run cog:graph

# Regenerate registry
npm run cog:sync
```

### Quick Brain Navigation

| Need to... | Go to... |
|-----------|----------|
| Record architectural decision | `registers/ADR/` |
| Record business decision | `registers/BDR/` |
| Capture raw thinking | `thinking/notes/` |
| Document uncertainty | `thinking/doubts/` |
| Register risk | `management/risks/` |
| Add milestone | `management/milestones/` |
| Create task | `management/todo/` |
| Read manual | `manuals/` |

---

## Validation Checklist

This document successfully answers:

- ✅ What are the three repository modes and how do they work?
- ✅ What is the complete directory structure at repo root?
- ✅ What is mx-canon/ and how is Canon organized?
- ✅ What are the four groups in MX-Maxine-Lives brain?
- ✅ Who are Maxine, Reginald, and The Gathering?
- ✅ What is a cog and where do they live?
- ✅ How does the five-layer boot system work?
- ✅ What is $MX_HOME and what files live there?
- ✅ What YAML frontmatter fields are standard across MX?
- ✅ Where do I find specific types of files?
- ✅ What are the key MX principles to follow?
- ✅ How do I navigate the system effectively?
- ✅ Is the validation checklist itself present?

---

*This manual is the complete mental model. Everything else is the territory.*
