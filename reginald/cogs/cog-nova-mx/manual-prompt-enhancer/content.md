---
title: Prompt Enhancer — Manual
description: The route-decorator hook. Zero-inference prompt preprocessing with spell checking, route matching, and concept injection.
author: Tom Cranstoun and Maxine
created: 2026-02-13T00:00:00.000Z
version: "1.0"

mx:
  name: manual-prompt-enhancer
  status: active
  category: manual
  tags:
    - manual
    - prompt-enhancer
    - hooks
    - routing
  partOf: mx-maxine-lives
  purpose: Document prompt enhancer - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: Read when working with prompt enhancer or understanding its functionality
  contextProvides:
    - The route-decorator hook. Zero-inference prompt preprocessing with spell checking, route matching, and concept injection.
    - Usage guide and workflow for prompt enhancer
    - Troubleshooting and best practices
  refersTo: []
---

# Prompt Enhancer — Manual

**The route-decorator hook. Zero-inference prompt preprocessing.**

---

## What It Does

Every prompt you type gets preprocessed before Claude sees it. The route-decorator hook runs locally on your machine — no AI inference, no API calls, no cost — and injects context that helps Claude give better answers faster.

Four things happen:

1. **Slash command correction** — Mistyped `/maxin`? The hook suggests `/maxine` before Claude ever sees it.
2. **Spell checking** — Genuine typos are flagged. Both British and American spellings are valid. MX vocabulary is never flagged.
3. **Route matching** — Say "architecture decisions" and the hook tells Claude exactly which folder to look in: `registers/ADR/`.
4. **Concept matching** — Say "maxine" and the hook tells Claude what it is and where to find it: `mx-canon/mx-maxine-lives/ — The gestalt's brain.`

The result is injected as `additionalContext` into the prompt. Claude reads it before processing your request. You get faster, more accurate responses with less back-and-forth.

---

## How It Works

### The Pipeline

```
User types prompt
    │
    ▼
Step 0: Slash Command Correction
    │   Is it /something? Check against known skills.
    │   Prefix → Substring → Fuzzy matching.
    │   If unrecognised: suggest corrections and stop.
    │
    ▼
Step 1: Spell Checking
    │   Strip slash command words (never spell-check /maxine).
    │   Strip angle bracket content (never spell-check <tags>).
    │   Run aspell dual-dictionary (en_US + en_GB).
    │   Filter out MX vocabulary (.aspell-mx.pws).
    │   Both British and American valid — only flag genuine typos.
    │   Genuine typos = wrong in BOTH dictionaries.
    │
    ▼
Step 2: Route Matching
    │   Match prompt keywords against routing registry.
    │   Map intent → folder → SOUL.md.
    │   "architecture decisions" → registers/ADR/
    │
    ▼
Step 3: Concept Matching
    │   Match MX vocabulary terms in the prompt.
    │   Inject path + definition for each match.
    │   "maxine" → mx-canon/mx-maxine-lives/ — The gestalt's brain.
    │
    ▼
Step 4: Build Context
    │   Assemble all sections: routes, concepts, typos.
    │
    ▼
Step 5: Inject
    Output JSON with additionalContext → Claude sees it.
```

### What Claude Sees

When you type: `update the reginald colour scheme for architecture`

Claude receives your prompt plus:

```
[MX Routing] Relevant Maxine Lives folders detected for this prompt:
  why-architecture: registers/ADR/ — Why was this built this way?

[MX Concepts] Domain terms detected:
  reginald: mx-reginald/ — The global registry. Public directory of MX Docs.
```

Claude now knows where the architecture decisions live and what Reginald is. "Colour" is valid British English — it's not flagged. No inference wasted on figuring this out.

---

## Slash Command Correction

If your prompt starts with `/`, the hook checks it against all known skills from the routing registry.

**Three matching strategies (in order):**

| Strategy | What it does | Example |
|----------|-------------|---------|
| Prefix | You typed the beginning | `/max` → `/maxine` |
| Substring | The command contains your text | `/boot` → `/mx-boot` |
| Fuzzy | Bidirectional character overlap | `/intervew-me` → `/interview-me` |

If nothing matches, the hook lists all available commands.

If the command IS valid (exact match), the hook passes through silently — no correction needed.

---

## Spell Checking

The spell checker uses aspell with **both American English (en_US) and British English (en_GB) as valid dictionaries**. A word valid in either dictionary is correct. Only words wrong in both are flagged as typos.

The logic:

1. Check every word against en_US and en_GB.
2. If valid in either — it's correct. No action.
3. If invalid in both — it's a genuine typo. Flag it.

| Word | en_US | en_GB | Result |
|------|-------|-------|--------|
| color | valid | — | Not flagged |
| colour | — | valid | Not flagged |
| colur | invalid | invalid | Flagged as typo |

### MX Vocabulary

MX-specific terms (maxine, reginald, gestalt, yaml, frontmatter, etc.) are never flagged as typos. The word list is auto-generated from the concepts registry by `npm run route:sync` and stored in `.aspell-mx.pws`.

### What's Not Spell-Checked

- Slash command words (`/maxine` — the `maxine` part is skipped)
- Angle bracket content (`<tags>`, `<placeholders>`, unclosed `<` to end of line)
- The prompt is checked as-is (no YAML/code block awareness — that's for `npm run mx:spell`)

---

## Route Matching

Routes are defined in [ROUTING.cog.md](ROUTING.cog.md) and indexed into `routing-registry.json` by `npm run route:sync`.

Each route has:

- **intent** — machine identifier (e.g., `why-architecture`)
- **question** — what the user is asking (e.g., "Why was this built this way?")
- **route** — the folder path (e.g., `registers/ADR/`)
- **keywords** — words that trigger the match

When any keyword appears in your prompt, the route is injected:

```
[MX Routing] Relevant Maxine Lives folders detected for this prompt:
  why-architecture: registers/ADR/ — Why was this built this way?
```

### Current Routes

| Keywords | Route | What's there |
|----------|-------|-------------|
| architecture, built | `registers/ADR/` | Architecture decisions |
| business, funded, priced | `registers/BDR/` | Business decisions |
| naming, called | `registers/NDR/` | Naming decisions |
| messaging, communicated | `registers/MDR/` | Messaging decisions |
| assume, believed, gestalt, true | `thinking/assumptions/` | Assumptions |
| uncertain, unsure | `thinking/doubts/` | Doubts |
| captured, raw, thinking | `thinking/notes/` | Notes |
| risks, wrong | `management/risks/` | Risks |
| dates, timeline, milestones | `management/milestones/` | Milestones |
| blocks, progress, depends | `management/dependencies/` | Dependencies |
| todo, needs, doing | `management/todo/` | Todos |
| strategy, plan, roadmap | `management/plans/` | Plans |

---

## Concept Matching

Concepts are MX vocabulary terms defined in [ROUTING.cog.md](ROUTING.cog.md). Each concept has:

- **term** — canonical name
- **aliases** — alternative phrases that match
- **path** — where to find it
- **definition** — one-sentence explanation

When a concept term or alias appears in your prompt, the hook injects:

```
[MX Concepts] Domain terms detected:
  maxine: mx-canon/mx-maxine-lives/ — The gestalt's brain. Institutional memory.
  reginald: mx-reginald/ — The global registry. Public directory of MX Docs.
```

Multiple concepts can match in a single prompt.

---

## Configuration

### Files

| File | Purpose |
|------|---------|
| `.claude/hooks/route-decorator.sh` | The hook script |
| `.claude/settings.local.json` | Hook registration (UserPromptSubmit event) |
| `mx-canon/mx-maxine-lives/ROUTING.cog.md` | Routes, concepts, commands (source of truth) |
| `mx-canon/mx-maxine-lives/routing-registry.json` | Auto-generated index (do not edit manually) |
| `mx-canon/mx-maxine-lives/.aspell-mx.pws` | Auto-generated aspell word list |

### Commands

| Command | What it does |
|---------|-------------|
| `npm run route:sync` | Regenerate routing-registry.json and .aspell-mx.pws from ROUTING.cog.md |
| `npm run route:test` | Run the zero-inference test suite (40 tests) |

### Adding a New Route

Edit [ROUTING.cog.md](ROUTING.cog.md) — add an entry to the `routing.by-intent` array:

```yaml
- intent: "my-new-intent"
  question: "What is the user asking?"
  route: folder/path/
  soul: folder/path/SOUL.md
  file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
```

Then run `npm run route:sync` to regenerate the registry.

### Adding a New Concept

Edit [ROUTING.cog.md](ROUTING.cog.md) — add an entry to the `concepts.terms` array:

```yaml
- term: my-concept
  aliases: [alternative name, another alias]
  path: mx-canon/path/to/folder/
  definition: "One-sentence explanation."
  words: [my-concept, myword]
```

Then run `npm run route:sync` to regenerate the registry and aspell word list.

---

## Testing

The test suite runs without AI inference — pure bash assertions:

```bash
npm run route:test
```

**40 tests across 9 groups:**

1. Slash Command Correction (5 tests)
2. Spell Checking (4 tests)
3. Dual-Dialect Tolerance (4 tests)
4. Route Matching (6 tests)
5. Short Prompts (3 tests)
6. Concept Matching (8 tests)
7. Aspell MX Word List (4 tests)
8. Edge Cases (3 tests)
9. Angle Bracket Handling (3 tests)

Tests live in `mx-canon/mx-maxine-lives/tests/test-route-decorator.sh`.

---

## Visibility

The first time the hook fires in a session, it adds a note explaining what happened:

```
(Route context auto-injected by route-decorator hook. Shown once to introduce the pattern.)
```

After the first time, the injection is silent — context arrives without explanation.

---

## Dependencies

- **jq** — JSON parsing (required)
- **aspell** — Spell checking (optional — spell features degrade gracefully)
- **aspell en_US dictionary** — American English
- **aspell en_GB dictionary** — British English

Install on macOS: `brew install jq aspell`

---

*Cut inference cost by telling Claude where to look. The instructions are the program. You are the runtime.*
