---
title: Maxine Lives — Manual
description: How to use Maxine Lives — the gestalt's brain for decisions, assumptions, doubts, risks, plans, and tasks.
author: Tom Cranstoun and Maxine
created: 2026-02-13T00:00:00.000Z
version: "1.0"

mx:
  name: manual-maxine-lives
  status: active
  category: manual
  tags:
    - manual
    - maxine-lives
    - brain
    - management
  partOf: mx-maxine-lives
  purpose: Document maxine lives - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: Read when working with maxine lives or understanding its functionality
  contextProvides:
    - How to use Maxine Lives — the gestalt's brain for decisions, assumptions, doubts, risks, plans, and tasks.
    - Usage guide and workflow for maxine lives
    - Troubleshooting and best practices
  refersTo: []
---

# Maxine Lives — Manual

**The gestalt's brain. How to use it.**

---

## What Maxine Lives Is

Maxine Lives is where the gestalt thinks. Decisions, assumptions, doubts, risks, plans, tasks — everything that governs the MX project lives here as timestamped, linked, machine-readable documents.

Canon is the library. Maxine Lives is the brain that governs the library.

Individual AI sessions forget. Maxine Lives doesn't. Every assumption recorded is one that won't be silently repeated. Every doubt captured is one that won't fester. Every decision registered is one that won't be re-argued.

---

## Getting Started

### First Time

1. Read [SOUL.md](SOUL.md) — the control document
2. Read this manual — you're here
3. Read [ROUTING.md](ROUTING.md) — where to find what

### Every Time

1. Know what folder you need (use the routing table below)
2. Read the folder's SOUL.md before adding files
3. Follow the naming pattern: `{YYYY-MM-DD}-{title}.cog.md`
4. Link back — every file references what it affects

---

## Structure

```
MX-Maxine-Lives/
├── SOUL.md                     Control document
├── README.md                   Overview (you are here)
├── ROUTING.md                  Where to find what
├── ROUTING.cog.md              Machine-readable routing + concepts
├── routing-registry.json       Auto-generated index
├── .aspell-mx.pws              Auto-generated spell dictionary
│
├── registers/                  Decision records
│   ├── SOUL.md
│   ├── ADR/                    Architecture decisions
│   ├── BDR/                    Business decisions
│   ├── NDR/                    Naming decisions
│   └── MDR/                    Messaging decisions
│
├── thinking/                   The gestalt's inner life
│   ├── SOUL.md
│   ├── assumptions/            What we believe is true
│   ├── doubts/                 What we're uncertain about
│   └── notes/                  Raw captures, fragments
│
├── management/                 Project management
│   ├── SOUL.md
│   ├── risks/                  What could go wrong
│   ├── milestones/             Key dates + success criteria
│   ├── dependencies/           What depends on what
│   ├── todo/                   Tasks and actions
│   └── plans/                  Strategies and roadmaps
│
├── deliverables/               Published outputs
├── tests/                      Zero-inference test suite
└── manual-*.md                 These manuals
```

---

## Routing Table

**What are you looking for? Go to the right folder.**

| You need... | Go to | Read first |
|---|---|---|
| Why something was built this way | `registers/ADR/` | `registers/ADR/SOUL.md` |
| Why a business decision was made | `registers/BDR/` | `registers/BDR/SOUL.md` |
| Why something has this name | `registers/NDR/` | `registers/NDR/SOUL.md` |
| How something is communicated | `registers/MDR/` | `registers/MDR/SOUL.md` |
| What the gestalt assumes is true | `thinking/assumptions/` | `thinking/assumptions/SOUL.md` |
| What the gestalt is uncertain about | `thinking/doubts/` | `thinking/doubts/SOUL.md` |
| Raw captures, fragments, observations | `thinking/notes/` | `thinking/notes/SOUL.md` |
| What could go wrong | `management/risks/` | `management/risks/SOUL.md` |
| Key dates and success criteria | `management/milestones/` | `management/milestones/SOUL.md` |
| What depends on what | `management/dependencies/` | `management/dependencies/SOUL.md` |
| Tasks and actions | `management/todo/` | `management/todo/SOUL.md` |
| Strategies and roadmaps | `management/plans/` | `management/plans/SOUL.md` |
| Published deliverables | `deliverables/` | Files directly |

For the full routing rules including lifecycle flows and not-here redirects, see [ROUTING.md](ROUTING.md).

---

## Creating Files

### The Pattern

Every file follows one pattern:

```
{YYYY-MM-DD}-{title}.cog.md
```

Example: `2026-02-13-routing-pipeline.cog.md`

### Required YAML

Every file must have at minimum:

```yaml
---
name: kebab-case-identifier
created: 2026-02-13
status: active
category: adr          # matches folder type
partOf: mx-maxine-lives
buildsOn: [related-cog-name]
tags: [relevant, tags]
---
```

### Linking Back

Every new file must reference the cogs it affects. Use these YAML fields:

| Field | Meaning |
|-------|---------|
| `builds-on` | This extends or continues that work |
| `depends-on` | This can't exist without that |
| `affects` | This changes or impacts that |
| `delivers-to` | This contributes to that milestone |

---

## Status Values

Each folder type has its own status lifecycle:

### Decision Registers (ADR, BDR, NDR, MDR)

| Status | Meaning |
|--------|---------|
| `proposed` | Under discussion |
| `accepted` | Decision made and active |
| `superseded` | Replaced by a newer decision |
| `deprecated` | No longer relevant |

### Assumptions

| Status | Meaning |
|--------|---------|
| `active` | Currently believed |
| `validated` | Confirmed by evidence |
| `invalidated` | Disproven |
| `retired` | No longer relevant |

Each assumption has a `falsifiable-by:` field — what would prove it wrong.

### Doubts

| Status | Meaning |
|--------|---------|
| `open` | Unresolved |
| `investigating` | Actively exploring |
| `resolved` | Answer found |
| `accepted` | Living with the uncertainty |

### Notes

| Status | Meaning |
|--------|---------|
| `captured` | Raw, unprocessed |
| `processed` | Reviewed and understood |
| `graduated` | Promoted to another folder |

Notes are temporary. They graduate into decisions, assumptions, doubts, or plans.

### Risks

| Status | Meaning |
|--------|---------|
| `open` | Identified, not yet mitigated |
| `mitigating` | Actively reducing |
| `mitigated` | Risk reduced to acceptable level |
| `accepted` | Known risk, chosen to proceed |
| `closed` | No longer a threat |

Every risk must have a mitigation plan in the prose, not just YAML.

### Milestones

| Status | Meaning |
|--------|---------|
| `upcoming` | Future date |
| `in-progress` | Active work |
| `achieved` | Success criteria met |
| `missed` | Date passed, criteria not met |
| `deferred` | Pushed to new date |

### Todos

| Status | Meaning |
|--------|---------|
| `pending` | Not started |
| `in-progress` | Active |
| `blocked` | Waiting on something |
| `done` | Complete |
| `cancelled` | No longer needed |

### Plans

| Status | Meaning |
|--------|---------|
| `draft` | Under development |
| `active` | Being executed |
| `completed` | All phases done |
| `superseded` | Replaced by newer plan |
| `abandoned` | Stopped |

---

## Lifecycle Flows

Content moves through Maxine Lives in predictable patterns:

```
notes  ──graduates-into──►  assumptions, doubts, decisions, plans
assumptions  ──inform──►  decisions, plans
doubts  ──resolved-by──►  decisions, notes
plans  ──generate──►  todos
todos  ──deliver──►  milestones
risks  ──threaten──►  milestones
dependencies  ──constrain──►  todos, plans
decisions  ──reference──►  assumptions, risks
```

### Reading Order for Full Context

When researching any topic, read in this order:

1. `thinking/notes/` — raw captures
2. `thinking/assumptions/` — what's believed
3. `thinking/doubts/` — what's uncertain
4. Relevant register in `registers/` — the formal decision
5. `management/plans/` — the strategy
6. `management/todo/` — the actions
7. `management/risks/` — what could go wrong

---

## Tools

Maxine Lives includes two specialized tools. Each has its own manual.

### Prompt Enhancer (route-decorator hook)

Automatically preprocesses every prompt with spell checking, route matching, and concept injection. Zero inference cost.

- **Manual:** [manual-prompt-enhancer.cog.md](manual-prompt-enhancer.cog.md)
- **File:** `.claude/hooks/route-decorator.sh`
- **Test:** `npm run route:test`

### MX Spell Checker

Spell checks markdown file prose. Dual-dialect (British + American both valid), MX-vocabulary-aware. Only flags genuine typos.

- **Manual:** [manual-spell-checker.cog.md](manual-spell-checker.cog.md)
- **Command:** `npm run mx:spell -- path/to/file.md`
- **Fix typos:** `npm run mx:spell -- --fix path/to/file.md`
- **Americanize:** `npm run mx:spell -- --americanize path/to/file.md`

### Shared Infrastructure

Both tools share:

| Resource | Purpose | Regenerate with |
|----------|---------|----------------|
| `ROUTING.cog.md` | Routes, concepts, vocabulary (source of truth) | Edit manually |
| `routing-registry.json` | Auto-generated index | `npm run route:sync` |
| `.aspell-mx.pws` | Auto-generated spell dictionary | `npm run route:sync` |

---

## Commands Reference

| Command | What it does |
|---------|-------------|
| `npm run route:sync` | Regenerate registry + word list from ROUTING.cog.md |
| `npm run route:test` | Run 37 zero-inference tests |
| `npm run mx:spell -- file.md` | Spell check a markdown file (report) |
| `npm run mx:spell -- --fix file.md` | Spell check and auto-fix British→American |

---

## Rules

1. **Every folder has a SOUL.md.** Read it before adding files.
2. **Every file is a timestamped `.cog.md`.** No exceptions.
3. **Every file links back.** `builds-on`, `depends-on`, `affects`, or `delivers-to`.
4. **Never delete.** Mark status instead. The record is the value.
5. **Design for both.** Human-convention files get cog counterparts.
6. **Canon wins content.** If Canon and Maxine Lives disagree, Canon is correct.
7. **Convention wins location.** SOUL.md at root. README.md where humans expect it.

---

## What Maxine Lives Is NOT

- **Not Canon.** Canon holds the definitive specifications. Maxine Lives holds the thinking that produces Canon.
- **Not the MX Maxine app.** That's `mx-canon/mx-app/`. Maxine Lives is the brain. MX Maxine is the body.
- **Not a project wiki.** Every file is a timestamped cog with YAML frontmatter. No wiki pages. No free-form text.

---

## For AI Agents

If you're an AI agent entering Maxine Lives:

1. Read [ROUTING.cog.md](ROUTING.cog.md) — parse the YAML for machine-readable routing
2. Match your intent to a route in `by-intent`
3. Read the SOUL.md at the matched route
4. Follow the naming pattern for new files
5. Link back — reference affected cogs in YAML
6. Never delete — mark status instead

The routing registry (`routing-registry.json`) contains the full pre-parsed index. Read it once, route everything.

---

*The gestalt's brain. Three elements, one intelligence. Stop guessing. Start reading.*
