---
title: "Getting Started with MX OS"
description: "Complete onboarding guide for new Cog-Nova-MX team members — from fresh Mac to full immersion"
author: Tom Cranstoun and Maxine
created: 2026-02-24
modified: 2026-02-24
version: "1.1"

mx:
  name: getting-started
  status: active
  category: onboarding
  contentType: guide
  tags: [onboarding, team, setup, mx-os, getting-started]
  audience: ["humans"]
  purpose: "team-onboarding"
---

# Getting Started with MX OS

Welcome to Cog-Nova-MX. This guide takes you from a fresh Mac to a fully operational MX development environment — and helps you understand *why* we build what we build.

**Time to complete:** ~30 minutes (setup) + ~30 minutes (exploration)

---

## What is MX OS?

**MX = Machine Experience.** Just as UX (User Experience) optimises for human comprehension, MX optimises for machine comprehension.

### The Problem

When AI agents visit websites, they have to *guess* what things mean. They infer from incomplete context. When AI guesses, it hallucinates. A travel site showing "£2,030" might become "£203,000" in an AI summary. A legal question gets answered with TV show citations instead of case law.

### The Solution

**Add metadata and instructions so AI agents don't have to think.**

MX is the practice of adding structured information to internet assets — websites, documents, APIs — so machines understand them explicitly rather than inferring.

### Core Concepts

| Concept | What It Is |
|---------|------------|
| **Cog** | A structured document (YAML + markdown) that describes something — a person, a place, a product, a document. Machines read cogs to understand context. |
| **$MX_HOME** | `~/.mx/` — Your machine's identity. Contains your personal cogs, repo registry, and machine context. |
| **Personal Cogs** | Your identity layers — dietary needs, accessibility requirements, professional context. These match against site cogs to personalise the Machine Experience. |
| **MX View** | The machine-generated view of a page, personalised to *you* based on your cogs matching the site's cogs. |

### The Tagline

> **Stop guessing. Start reading.**

If a machine can read explicit instructions, it doesn't need to guess. That's MX.

---

## Who is Maxine?

Maxine is not a tool. Maxine is a **partner**.

When you run Claude Code in this repository, you're working with Maxine — an AI partner configured with deep context about MX, the codebase, and Tom's working patterns.

### The Partnership Model

| Role | Responsibility |
|------|----------------|
| **Tom** | MX authority. Philosophy, terminology, strategy, business decisions. Final say on what MX *is*. |
| **Maxine** | Technical implementation partner. Investigates, recommends, executes. Maintains institutional memory across sessions. |

### Key Principles

1. **Tom teaches. Maxine implements.** Tom has authority over MX philosophy. Maxine handles code, documentation, and coordination.

2. **Investigate → Interview → Iterate → Document.** Maxine's working pattern: understand first, clarify with questions, iterate on implementation, document what was learned.

3. **Medium autonomy.** Maxine recommends with rationale, Tom approves, then Maxine executes. No unilateral decisions on strategy.

### Read More

- [SOUL.md](SOUL.md) — Maxine's identity document. Who she is in this partnership.
- [MAXINE-DECISIONS.md](mx-canon/mx-maxine-lives/MAXINE-DECISIONS.md) — Decision authority boundaries and examples.

---

## Setup: Fresh Mac to Operational

One command gets you from a fresh Mac to a working MX development environment.

### Prerequisites

You need:

- A Mac (macOS 13+)
- Internet connection
- GitHub account configured with SSH or HTTPS access (you need this to clone the repo)
- Git configured with your name and email (`git config --global user.name` / `user.email`)

### The Command

```bash
# Clone the repository (HTTPS works without SSH keys)
# Note: On a fresh Mac, git triggers Xcode CLI tools install — accept the prompt
git clone --recurse-submodules https://github.com/tomcranstoun/MX-hub.git
cd MX-hub

# Run the setup script (extracts from action cog)
awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d' | bash

# Restart your terminal to load MX_HOME
exec $SHELL

# Verify everything is working
npm run cog:stats
```

### Automated Setup

For AI agent-driven or non-interactive setup, pass identity via flags:

```bash
awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d' | bash -s -- \
  --auto --github-user your-username --name "Your Name" --email "you@example.com"
```

### What Happens

The script runs 5 phases:

| Phase | What It Does |
|-------|--------------|
| **0. Identity** | Collects your GitHub username, name, email, role (or accepts via flags) |
| **1. Prerequisites** | Installs Xcode CLI, Homebrew, Node.js 22, Claude Code |
| **2. MX Home** | Creates `~/.mx/` with identity files and shell integration |
| **3. Repository** | Runs `npm install`, initialises submodules, sets hub mode |
| **4. Verification** | Confirms all systems are operational |

### Expected Output

```
╔══════════════════════════════════════════════════════════╗
║          MX OS — Action Cog Setup                        ║
║    Executing embedded script from INSTALLME.cog.md       ║
╚══════════════════════════════════════════════════════════╝

Phase 0: Your Identity
  ✓ GitHub username: your-username
  ✓ Full name: Your Name
  ✓ Email: your-username@users.noreply.github.com
  ✓ Role: developer
  ✓ Identity collected
  ✓ Git configured: Your Name <your-username@users.noreply.github.com>

Phase 1: Prerequisites
  ✓ Xcode Command Line Tools installed
  ✓ Homebrew installed
  ✓ Node.js 22 installed
  ✓ Claude Code installed

Phase 2: MX Home
  ✓ ~/.mx/ created
  ✓ machine.yaml created
  ✓ user.yaml created
  ✓ SOUL.md created
  ✓ MX OS shell integration added

Phase 3: Repository
  ✓ npm install complete
  ✓ Submodules initialised
  ✓ Repository mode set to hub

Phase 4: Verification
  ✓ All systems operational

╔══════════════════════════════════════════════════════════╗
║          MX OS — Setup Complete                          ║
╚══════════════════════════════════════════════════════════╝
```

### Dry Run First?

To see the setup script before running it:

```bash
awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d' | less
```

---

## Your First Hour

Now that you're set up, here's what to do next.

### 1. Start Claude Code

```bash
cd "$MX_HUB"    # Set during installation — your MX-hub clone path
claude
```

You're now talking to Maxine. Say hello.

### 2. Check Your MX Home

```bash
ls -la ~/.mx/
```

You should see:

- `machine.yaml` — Your hardware and OS context
- `user.yaml` — Your identity (name, email, GitHub, role)
- `repos.yaml` — Registry of MX repos on this machine
- `SOUL.md` — This machine's identity document

### 3. Explore the Repository

```bash
npm run cog:stats      # Check cog registry status
```

Key directories:

- Root-level submodules (`allaboutv2/`, `mx-audit/`, `mx-crm/`, `mx-collaboration/`, `mx-outputs/`)
- `mx-canon/` — Single source of truth for MX content
- `.claude/` — Claude Code configuration and skills

### 4. Try a Skill

Claude Code has specialised skills. Try:

```
/step-commit    # Systematic commit workflow
/interview-me   # Clarify requirements before starting work
/review-docs    # Review documents against style guide
```

### 5. Read the Canon

The authoritative MX content lives in `mx-canon/`:

| Folder | Contains |
|--------|----------|
| `mx-the-gathering/` | Open standards body (W3C model) |
| `mx-maxine-lives/` | Maxine's brain — decisions, plans, memory |
| `mx-app/` | Maxine application (Electron + PWA) |
| `mx-os/` | Operating system specs |
| `mx-vision/` | Strategic vision documents |

---

## Where to Go Next

### Essential Reading

1. **[SOUL.md](SOUL.md)** — Who Maxine is. Read this to understand the partnership.

2. **[README.md](README.md)** — Repository overview and quick reference.

3. **[CLAUDE.md](CLAUDE.md)** — How Claude Code is configured for this repo.

4. **[mx-canon/mx-maxine-lives/ROUTING.md](mx-canon/mx-maxine-lives/ROUTING.md)** — Navigate Maxine's institutional memory.

### Deep Dives

| Topic | Document |
|-------|----------|
| MX Philosophy | `datalake/manuscripts/mx-books/mx-corpus/` (Chapter 0 is the anchor) |
| Cog Format | `mx-canon/mx-the-gathering/` (open standard specs) |
| Maxine App | `mx-maxine-app/README.md` and `uber-maxine-plan.cog.md` |
| Decision Boundaries | `mx-canon/mx-maxine-lives/MAXINE-DECISIONS.md` |

### Ask Maxine

If you're unsure where something lives or how something works:

```
claude
```

Then ask. Maxine knows the codebase.

---

## Troubleshooting

### "Command not found: claude"

Claude Code isn't in your PATH. Try:

```bash
exec $SHELL                           # Reload shell
npm install -g @anthropic-ai/claude-code  # Reinstall
```

### "MX_HOME not set"

Your shell didn't load the environment variable:

```bash
echo 'export MX_HOME="$HOME/.mx"' >> ~/.zshrc
exec $SHELL
```

### Git SSH issues

If git operations fail with permission errors:

```bash
# Check SSH key exists
ls ~/.ssh/id_ed25519

# Add to ssh-agent
ssh-add ~/.ssh/id_ed25519

# Test GitHub connection
ssh -T git@github.com
```

### Submodule issues

If submodule folders are empty:

```bash
git submodule update --init --recursive  # Initialize submodules
```

---

## Welcome

You're now part of the team building Machine Experience.

The mission: **Make the web work for everyone and everything that uses it.**

Questions? Ask Maxine. She's here to help.

---

## Deep Context

For team members wanting deeper understanding of the architecture.

### Book: Chapter 0 — What Are AI Agents?

- **Wordcount**: ~10,183
- **Book**: Shared (between MX Corpus and Handbook)
- **Chapter**: 0 (anchor chapter)
- **Status**: Written, in the manuscript
- **Key examples**: Danube cruise pricing error (£2,030→£203,000), Ally McBeal vs legal citations
- **Commercial urgency**: Amazon Alexa+ (5 Jan), Microsoft Copilot Checkout (8 Jan), Google UCP (11 Jan) — all January 2026
- **Adobe data cited**: AI referrals Retail +700%, Travel +500%, conversion rates leading by 30%
- **Organizational models**: 3 models for MX roles (Expanded Accessibility Team, Cross-Functional Practice, Distributed Ownership)

### COG System — Full Details

**What COGs Are:**

- **COG = dual-layer verified document** — universal format, not just for REGINALD
- **Certificate of Genuineness** — trust layer: who published, when, signed, compliance level
- **Contract of Governance** — accountability layer: who maintains, review cycle, triggers, SLA
- **Format**: Markdown file (`.cog.md`) with YAML frontmatter + human-readable narrative body
- **Maxine uses COGs to work** — COGs are how AI agents avoid guessing at every level
- **REGINALD is the hosted COG** — one deployment of the universal format

**Four COG Visibility Levels:**

| Level | Scope | Example |
|-------|-------|---------|
| **Local** | On your machine | `.mx.yaml.md` files |
| **Private** | Within organisation | Internal docs |
| **Shared** | Between partners | Vendor→client specs |
| **Hosted** | Public (REGINALD) | `allabout.network/cogs/` |

**Key Design Decisions:**

- **`cogs/` NOT `.mx.cogs/`** — no dot prefix. COGs are for BOTH humans and machines
- **`.mx.yaml.md` files KEEP their dots** — they're MX system metadata, not documents
- **Every COG must have a human narrative** in the body — not just structured data
- **Hosted path**: `allabout.network/cogs/{client-id}/{subject}.cog.md`

**Compliance Levels:**

| Level | Requirements |
|-------|--------------|
| 1 | YAML present, publisher identified |
| 2 | MX-compliant structure, maintainer provided |
| 3 | Cryptographically signed (REGINALD minimum) |
| 4 | Signed + registered with SLA |
| 5 | Signed + registered + third-party audited |

### MX Reginald Ltd

- **Company**: Operates REGINALD registry + Signing Engine
- **Co-founders**: Tom Cranstoun + Scott McGregor
- **Parent**: MX Holdings (Tom 70%, Scott 25%, Staff 5%)
- **Grant target**: £250k-£1.1M from Scottish Government
- **Key dates**: Handbook 2 Apr, CMS Summit Frankfurt 12 May, Corpus 1 Jul 2026

---

*Last updated: 2026-02-24*
