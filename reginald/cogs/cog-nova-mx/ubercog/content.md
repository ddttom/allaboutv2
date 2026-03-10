---
version: "1.5.0"
description: The repo-level briefing. What this repository is, what lives where, how to route. Any agent reading this can navigate the MX-Hub.

created: 2026-02-14
modified: 2026-03-08

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-mx-os]
  tags: [ubercog, gateway, briefing, routing, repo, mx-hub, onboarding]

  audience: both
  readingLevel: beginner

  contentType: "briefing-doc"
  runbook: "mx exec ubercog"

  execute:
    runtime: runbook
    command: mx ubercog
    actions:
      - name: brief
        description: Give any AI agent the full repo context in one pass
        usage: Read this cog top to bottom. The agent should understand the repo structure, Canon layout, and boot chain. After reading, the agent can navigate without guessing.
        inputs: []
        outputs:
          - name: briefing
            type: object
            description: Complete repo context for any AI agent

      - name: route
        description: Route a query to the right location in the repo
        usage: Given a question or intent, use the routing tables in this cog to identify the correct directory, file, or Canon initiative. Return the path, what to read first, and why.
        inputs:
          - name: query
            type: string
            description: What the agent is looking for
        outputs:
          - name: route
            type: object
            description: Path, read-first file, and rationale

      - name: status
        description: Report the current state of the repo
        usage: Check git status, submodule status, and npm scripts. Report whether submodules are initialised and what commands are available.
        inputs: []
        outputs:
          - name: status-report
            type: object
            description: Current repo state
---

# The Repo Uber Cog

You have found the MX-Hub repository. This cog is your map.

The machine uber cog (`$MX_HOME/UBER.cog.md`) told you about the universe. This cog tells you about the neighbourhood — what lives in this repo, how it is organised, and how to find what you need.

---

## What This Repo Is

**MX-Hub** is the monorepo for Cog-Nova-MX Ltd. It contains everything: Canon (the single source of truth), the Maxine app, the cog registry, the book manuscripts, the web audit suite, and the operational brain of the gestalt.

---

## Where Things Live

### Root Files — The Boot Chain

| File | Role | Read when |
|------|------|-----------|
| `llms.txt` | AI discovery file (llms.txt standard). Project structure for all AI agents | First (non-Claude agents) |
| `UBERCOG.cog.md` | This file. Repo map and routing | First. Always |
| `CLAUDE.md` | AI agent configuration and instructions | After this file |
| `SOUL.md` | Who Maxine is in this partnership | When you need voice and boundaries |
| `mx-canon/ssot/principles.cog.md` | The rules we build by | When making design decisions |
| `REMINDERS.md` | Unified reminder system — dashboard, active items, context | Start of every session |
| `env.cog.md` | Project-level configuration (hostnames, URLs, author) | When generating content |
| `LEARNINGS.md` | Mistakes and hard-won rules | Before repeating a mistake |
| `CHANGELOG.md` | What changed and when | When you need history |
| `planner.md` | Prioritised deadlines and commitments by date | When checking timeline |
| `next-steps-plan.md` | Active project roadmap and tracking | When planning work |
| `mx-canon/ssot/pitches/partners/colleague-summary.md` | Internal business summary for team onboarding | When briefing colleagues |
| `mx-canon/ssot/pitches/investors/investor-summary.md` | Confidential investor deck and projections | When preparing fundraising |
| `mx-canon/ssot/mx-messaging-framework.md` | Brand messaging framework | When writing external content |
| `mx-canon/mx-maxine-lives/management/plans/mx-agent-independence.cog.md` | Core architectural principle | When understanding MX philosophy |
| `mx-canon/ssot/specifications/mcp-prd.md` | Product requirements for MCP integration | When working on IDE integration |
| `scripts/cogs/INSTALLME.cog.md` | Action cog with embedded setup script | When setting up new machine |
| `getting-started.cog.md` | Human onboarding guide (action cog) | When joining the team |
| `MAXINE-DECISIONS.md` | Decision authority boundaries | See `mx-canon/mx-maxine-lives/MAXINE-DECISIONS.md` |

### Canon — Single Source of Truth

Everything authoritative lives under `mx-canon/`. If Canon conflicts with anything elsewhere, Canon wins.

| Initiative | Path | What it governs |
|-----------|------|----------------|
| **MX-Maxine-Lives** | `mx-canon/mx-maxine-lives/` | The gestalt's brain. Decisions, assumptions, doubts, risks, plans, blogs |
| **MX-OS** | `mx-canon/mx-os/` | Operating system specs, boot system, phrasebook, blog generator |
| **MX-The-Gathering** | `mx-canon/mx-the-gathering/` | The open standard. Cog unified spec |
| **MX-App** | `mx-canon/mx-app/` | Maxine product vision, app architecture |
| **MX-Vision** | `mx-canon/mx-vision/` | Future opportunities (smart glasses, etc.) |
| **_template** | `mx-canon/_template/` | Scaffold for new initiatives |

**Every initiative has:** a `SOUL.md` (read first), a `deliverables/` folder, and YAML-frontmattered cog files.

### The Brain — MX-Maxine-Lives

The brain has its own routing system. Read `mx-canon/mx-maxine-lives/ROUTING.md` for the full table. Quick version:

| You need | Go to |
|----------|-------|
| Why a decision was made | `registers/ADR/` (architecture), `BDR/` (business), `NDR/` (naming), `MDR/` (messaging), `CVR/` (conventions), `FDR/` (format) |
| What we believe is true | `thinking/assumptions/` |
| What we are unsure about | `thinking/doubts/` |
| Raw captures | `thinking/notes/` |
| Project risks | `management/risks/` |
| Key dates | `management/milestones/` |
| What needs doing | `management/todo/` |
| Strategies | `management/plans/` |
| Session reports | `mx-outputs/md/reports/directors/session/` |
| Blog posts | `communications/blogs/` |

### Content and Publications

| Location | What |
|----------|------|
| `datalake/manuscripts/mx-books/` | Book manuscripts (Protocols, Handbook, Appendices, Code Examples) |
| `datalake/` | Central knowledge index, schemas, guides, image assets, configs |
| `mx-crm/` | CRM — contacts, prospects, client deliverables, outreach templates [SUBMODULE, PRIVATE]. Single source of truth for all contact and relationship data. |
| `prompts/` | AI prompt templates and system instructions |
| `tests/` | Test infrastructure for book generation (PDF/LaTeX testing, illustration validation) |
| `datalake/pipeline/drafts/` | Draft content organised by topic — ideas, use-cases, specifications. |
| `mx-outputs/` | Build artefacts [SUBMODULE, PRIVATE]. Type-first structure: `pdf/` (books, manuals), `md/` (reports, audit), `html/` (blogs, baselines), `json/`, `pptx/`. Auto-indexed README. |
| `mx-collaboration/` | Structured document pipeline [SUBMODULE]. Incoming proposals, accepted, published. |

### Products and Tools

| Location | What |
|----------|------|
| `mx-maxine-app/` | Maxine — Primary application (Electron app, PWA, embedded server, AI router) |
| `mx-reginald/` | Cog registry, core tool cogs, query scripts |
| `mx-audit/` | Web Audit Suite — Production website analysis tool [SUBMODULE] |

### Infrastructure

| Location | What |
|----------|------|
| `.claude/` | Claude Code integration — skills, hooks |
| `datalake/knowledge/` | System documentation, specifications, book configs |
| `scripts/` | Build and deployment scripts |
| Root-level submodules | `allaboutv2/`, `mx-audit/`, `mx-collaboration/`, `mx-crm/`, `mx-outputs/` |

---

## Business & Operational Context

MX-Hub contains critical business and operational documents that guide strategy, messaging, and partnerships:

| File/Directory | What | When to Read |
|----------------|------|--------------|
| `mx-canon/ssot/pitches/partners/colleague-summary.md` | Internal business summary for team onboarding. Explains what MX is, why it matters, business model, revenue streams. | When onboarding team members or partners |
| `INVESTOR-SUMMARY.md` | Confidential investor deck. Market opportunity, valuation scenarios (£5M–£1B+), financial projections, use of funds. | When preparing for fundraising or investor meetings |
| `mx-canon/ssot/mx-messaging-framework.md` | Brand messaging framework. Doc/cog terminology split, product family (Maxine, Reginald), audience metadata (tech/business/humans). | When writing external content or marketing materials |
| `mx-agent-independence.cog.md` | Core architectural principle. "The file IS the platform." MX is agent-agnostic, no vendor lock-in. | When understanding MX philosophy and architecture |
| `mcp-prd.md` | Product Requirements Document for MCP-based VS Code control. Detailed specifications for AI-powered IDE integration via Model Context Protocol. | When working on IDE integration or MCP features |
| `mx-crm/` | Contact and relationship management system [SUBMODULE, PRIVATE]. Plain-text CRM with contact files (`mx-crm/contacts/`), strategy notes (`mx-crm/strategy/`), interaction logs, and task tracking. Maxine monitors and updates during heartbeats. | When tracking partnerships, outreach, or relationship status |

---

## Routing by Intent

### "I need to write or edit a book chapter"

Route to `datalake/manuscripts/mx-books/mx-protocols/protocols/` (Protocols) or `mx-handbook/chapters/` (Handbook). Shared chapters (Ch00, Glossary) are in `datalake/manuscripts/mx-books/shared/`. British English, first person, real examples only.

### "I need to create or edit a blog post"

Route to `mx-canon/mx-maxine-lives/communications/blogs/`. Read `scripts/cogs/blog-generator.cog.md` for the full template and pipeline. Three stages: draft (md) → QA (html) → published (allaboutv2).

### "I need to work on the Maxine app"

Route to `mx-maxine-app/`. Read `mx-canon/mx-app/product-brief.md` for scope. The uber Maxine plan is at `mx-canon/mx-app/uber-maxine-plan.cog.md`.

### "I need to find or create a cog"

Query the registry: `npm run cog:list`, `npm run cog:find -- <term>`. Registries are at `datalake/registries/`. The canonical spec is at `mx-canon/mx-the-gathering/specifications/cog-unified-spec.cog.md`.

### "I need to understand a decision"

Route to the brain: `mx-canon/mx-maxine-lives/registers/`. ADR for architecture, BDR for business, NDR for naming, MDR for messaging, CVR for conventions.

### "I need to run a skill or command"

Skills live at `.claude/skills/`. The routing registry at `mx-canon/mx-maxine-lives/routing-registry.json` lists every skill, hook, and npm script. Or just type `/maxine` to route intelligently.

### "I need to contact someone or check partnership status"

Route to `mx-crm/`. Read `mx-crm/README.md` for system structure. Contact files are in `mx-crm/contacts/` (one file per person with YAML frontmatter + notes). Strategy notes and partnership profiles are in `mx-crm/strategy/`. Interaction logs in `mx-crm/INTERACTIONS.md`, tasks in `mx-crm/TASKS.md`.

### "I need to check deadlines or the operational timeline"

Route to `planner.md` for prioritised commitments by date (Boye London 26 Feb, Frankfurt 12 May, book launches Apr/Jul). For active project roadmap and tracking, see `next-steps-plan.md`.

### "I need to onboard a colleague or prepare investor materials"

Route to `mx-canon/ssot/pitches/partners/colleague-summary.md` for team onboarding (explains MX, business model, revenue). For fundraising, see `INVESTOR-SUMMARY.md` (valuation scenarios, financial projections, use of funds). Both confidential.

### "I need to understand AI agent discovery or the llms.txt standard"

Route to `llms.txt` at repository root. This is the standard AI discovery file per llms.txt specification. 272 lines documenting project structure, book manuscripts, Web Audit Suite, and access guidelines for any AI agent.

### "I need session reminders or startup context"

Route to `REMINDERS.md`. This is the unified reminder system with dashboard (urgent items, key dates, quick reference) and active items by priority. Owned by the gestalt.

---

## Essential Commands

All npm commands listed below are run from the repository root. Commands are organized by functional area.

### Installation & Boot

```bash
# Standard installation (Node.js already installed)
npm install                       # Install dependencies
git submodule update --init --recursive  # Initialize submodules

# New Mac setup (bare metal — extracts script from action cog)
mx exec installme                 # If mx command available
# Or directly:
awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d' | bash
```

### Cog Registry Operations

```bash
# Registry commands
npm run cog:list                  # List all cogs with name, type, category, builds-on
npm run cog:list -- --sort date   # Sort by modification date
npm run cog:show -- <name>        # Display full details of a specific COG
npm run cog:find -- <term>        # Search cogs by name, tag, or description
npm run cog:stats                 # Show totals by type, category, status, runtime

# Query commands
npm run cog:filter                # Multi-criteria filtering (--status, --category, --type, --tag)
npm run cog:count                 # Count COGs matching filter criteria
npm run cog:recent                # Show COGs modified in last 7 days
npm run cog:recent -- 14          # Show COGs modified in last 14 days
npm run cog:incomplete            # List COGs missing recommended fields

# Graph commands
npm run cog:graph                 # Display builds-on dependency tree
npm run cog:graph:circular        # Find circular dependencies
npm run cog:graph:orphans         # Find broken dependency references

# Validation & sync
npm run cog:validate              # Validate all cog files for spec compliance
npm run cog:sync                  # Regenerate mx-reginald/index.json from cog files
npm run cog:sync-and-commit       # Sync registry + auto-commit with standard message
npm run cog:snapshot              # Create timestamped registry snapshot
npm run cog:full-sync             # Validate + snapshot

# Execute
npm run cog:run                   # Execute a cog's action block
```

### Cogification (Content Conversion)

```bash
# Convert websites to MX-enhanced format (pixel-perfect replication)
npm run cogify:install                      # Install Playwright + deps (one-time setup)
npm run cogify -- --target=<url>            # Capture complete website data (DOM, CSS, assets)
npm run cogify:check                        # Check cache validity (24h TTL)

# What gets captured:
# - Complete DOM tree with all elements/attributes
# - Computed CSS with cascade resolution
# - Exact colors (RGB → hex) and typography
# - 24-hour cached HTML/CSS for offline work
# - Validation baseline for automated testing
# - Multi-format outputs (JSON, markdown, screenshots)

# Documentation:
# - Manual: mx-canon/mx-maxine-lives/manuals/manual-cogify.cog.md
# - Audit: mx-canon/mx-maxine-lives/manuals/manual-enhanced-audit.cog.md
# - Templates: mx-canon/mx-the-gathering/reference-implementations/templates/
```

### Blog Pipeline

```bash
# Manage blog drafts, QA, and publication
npm run blog:status               # Show pipeline inventory (draft/QA/published counts)
npm run blog:qa                   # Validate HTML in QA stage for WCAG compliance
npm run blog:publish              # Deploy blogs from QA to allaboutv2
```

### PDF Generation — Protocols (MX: The Protocols)

```bash
# Generate Protocols book in multiple formats
npm run pdf:protocols-html            # HTML version (open and print to PDF with ⌘+P)
npm run pdf:protocols-generate        # PDF directly via xelatex (full formatting)
npm run pdf:protocols-kindle          # Kindle-formatted PDF (6"×9", optimized margins)
npm run pdf:protocols-simple          # Simple PDF without fancy formatting
npm run pdf:protocols-all             # Generate all Protocols formats (HTML + PDF + Kindle)
npm run illustrations:generate    # Generate illustrations before PDF build
npm run pdf:appendix              # Generate appendix HTML
```

### PDF Generation — Handbook (MX: The Handbook)

```bash
# Generate Handbook book in multiple formats
npm run pdf:mx-html               # HTML version (print to PDF with ⌘+P)
npm run pdf:mx-generate           # PDF directly via xelatex (full formatting)
npm run pdf:mx-kindle             # Kindle-formatted PDF (6"×9")
npm run pdf:mx-simple             # Simple PDF without fancy formatting
npm run pdf:mx-all                # Generate all Handbook formats (HTML + PDF + Kindle)
```

### PDF Generation — Chapter 0 (Standalone)

```bash
# Generate standalone Chapter 0: What Are AI Agents?
npm run pdf:chapter00             # Simple PDF (default)
npm run pdf:chapter00-simple      # Same as above
npm run pdf:chapter00-html        # HTML version
npm run pdf:chapter00-kindle      # Kindle format
```

### PDF Generation — Utilities

```bash
# PDF generation utilities
npm run pdf:doc                   # Generate PDF from single document
npm run pdf:metadata              # Embed metadata into existing PDFs
```

### Validation & Linting

```bash
# Markdown linting
npm run lint:markdown             # Lint key markdown files (README, CLAUDE.md, docs/)
npm run lint:markdown:fix         # Auto-fix markdown issues
npm run lint:markdown:all         # Lint ALL markdown files (comprehensive)

# Link and path validation
npm run validate:links            # Check for broken links in book chapters
npm run validate:paths            # Validate file paths referenced in documents
npm run validate:paths:strict     # Strict path validation (fail on any issues)

# Demo and MX validation
npm run validate:demo             # Validate demo files for correctness
npm run validate:demo:json        # Output validation results as JSON
npm run validate:demo:strict      # Strict demo validation
npm run validate:lpc              # Validate LPC-specific demo files
npm run validate:mx               # Validate MX files against schema
npm run validate:mx:all           # Validate all MX files in repository

# Submodule checks
npm run submodules:check          # Check submodule status (detailed)
npm run submodules:quick          # Quick submodule status check
```

### MX Audit (Web Accessibility Suite)

```bash
# Run web accessibility audits
npm run audit:start               # Start audit server
npm run audit:allabout            # Audit allabout.network site (full sitemap scan)
npm run audit:test                # Run audit test suite
npm run audit:metadata            # Check metadata compliance
npm run audit:renames             # Track renamed files in audit system
npm run audit:lint                # Lint audit codebase
npm run audit:install             # Install audit dependencies
```

### Navigation Server

```bash
# MX navigation server for local development
npm run nav:install               # Install nav server dependencies
npm run nav:start                 # Start navigation server (production)
npm run nav:dev                   # Start in development mode (watch/reload)
```

### QR Code Generator

```bash
# Generate QR codes for cogs and objects
npm run qr:install                # Install QR generator dependencies
npm run qr:generate               # Generate QR codes
npm run qr:start                  # Start QR server (production)
npm run qr:dev                    # Start in development mode
```

### MX System Commands

```bash
# MX file generation and management
npm run mx:show                   # Show MX metadata for current directory
npm run mx:generate               # Generate MX YAML from README files
npm run mx:generate:dry-run       # Preview changes without writing
npm run mx:generate:dir           # Generate for specific directory
npm run mx:generate:force         # Force regeneration (overwrite existing)
npm run mx:migrate                # Migrate old MX YAML to new format
npm run mx:migrate:dry-run        # Preview migration changes
npm run mx:validate               # Validate MX YAML files
npm run mx:onboard                # Onboard new repository to MX system
npm run mx:enhance                # Enhance MX YAML from README content
npm run mx:enhance:dry-run        # Preview enhancement changes
npm run mx:effective              # Generate effective docs (resolved inheritance)
npm run mx:effective:dry-run      # Preview effective doc generation
npm run mx:spell                  # Spell check MX files
npm run mx:hooks:install          # Install MX git hooks
```

### Registry Management

```bash
# Manage registries (contact, routing, etc.)
npm run registry:add              # Add entry to registry
npm run registry:update           # Update registry entry
npm run registry:query            # Query registry
npm run registry:validate         # Validate registry structure
npm run registry:list             # List all registry entries
npm run registry:stats            # Show registry statistics
```

### Routing

```bash
# Routing registry management
npm run route:sync                # Regenerate routing registry from cogs/skills
npm run route:test                # Test route decorator functionality
```

### Development (Maxine App)

```bash
# Run Maxine app in development mode
npm run dev                       # Start Maxine dev server (localhost only)
npm run dev:lan                   # Start on LAN (accessible from network)
npm run dev:max                   # Maxine-specific dev mode
npm run dev:voice                 # Voice interface development mode
npm run demo                      # Run demo application
```

### Utilities

```bash
# Repository utilities
npm run wordcount                 # Count words in main book chapters
npm run wordcount:all             # Count words in ALL markdown files
npm run status                    # Show book status (chapters inventory)
npm run changelog:trim            # Trim changelog to recent entries
npm run changelog:status          # Show changelog statistics
npm run onboard                   # Onboard new team member (setup + docs)
npm run commit-push               # Commit and push across all repos
npm run hooks:install             # Install git hooks
npm run repo:add                  # Add new repository to hub

# Operations
cat planner.md                    # View prioritised deadlines and commitments
cat REMINDERS.md                  # Unified reminder system (dashboard + active items)

# CRM (Contact & Relationship Management)
cat mx-crm/README.md                 # CRM system overview
cat mx-crm/CONTACTS.md               # Contact quick reference (one-pagers)
cat mx-crm/TASKS.md                  # Action items & follow-ups
cat mx-crm/INTERACTIONS.md           # Interaction log
```

### Test Commands

```bash
# Run test suites
npm test                          # Run MX Audit test suite
npm run test:illustrations        # Test illustration generation
npm run audit:test                # Run audit test suite (alias)

# Maxine-specific tests
cd mx-maxine-app && npm run test:joymaker  # Run Joymaker test suite
```

---

**Pro tip:** Use `npm run` (no args) to see all available commands with descriptions.

---

## The Boot Chain

When an AI agent arrives in this repo, boot in this order:

0. **Read `llms.txt`** (optional, for non-Claude agents or high-level discovery). Project structure overview.
1. **Read `UBERCOG.cog.md`** (this file). You now know the neighbourhood.
2. **Read `CLAUDE.md`** for AI agent configuration and instructions.
3. **Read `SOUL.md`** to know the voice and partnership boundaries.
4. **Read `REMINDERS.md`** for the unified reminder system (dashboard, urgent items, context).
5. **Read the SOUL.md in your working directory** before editing anything.

Machine context first (uber). Repo context second (ubercog). Instructions third (CLAUDE.md). Identity fourth (SOUL.md). Directory context fifth (local SOUL.md). Cogs all the way down.

---

## Installation

### Standard Installation

```bash
git clone --recurse-submodules https://github.com/Digital-Domain-Technologies-Ltd/MX-hub.git
cd MX-hub
npm install
```

### New Mac Setup (Bare Metal)

For a fresh Mac with nothing installed, extract and run the embedded script from the action cog:

```bash
awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d' | bash
```

This handles: Xcode CLI, Homebrew, Node.js, ~/.mx/ setup, and repository installation. For automated setup, add `--auto --github-user <user> --name "Name" --email "email"` flags.

### Machine-Readable Installation

For AI agents or automation scripts, read the installation cog:

- **`scripts/cogs/INSTALLME.cog.md`** — Action cog with YAML frontmatter, prerequisite checks, and embedded setup script. Works in both MX and non-MX environments.

### Manual Installation

If bootstrapper is unavailable:

**Prerequisites:**

- **Node.js 20.0.0+** — `node --version`
- **Git** — `git --version`
- **npm** — comes with Node.js

```bash
git clone https://github.com/Digital-Domain-Technologies-Ltd/MX-hub.git
cd MX-hub
git submodule update --init --recursive
npm install
```

---

## For Any Agent

You have read the UBERCOG. You know:

- What this repo contains
- Where Canon, the brain, the app, and the books live
- How to route by intent
- What commands are available
- How to boot properly

You can navigate without guessing. If something here conflicts with Canon, Canon wins.

The rest is in the cogs. Read the registry. Follow the builds-on graph. Every cog you read is a question you will never get wrong.

---

*Stop guessing. Start reading.*
