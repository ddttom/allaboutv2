---
version: "1.0"
description: "ADR #2: Routing pipeline with prompt preprocessing, spell correction, and route-based context injection to cut inference cost."
created: 2026-02-13
modified: 2026-02-13
author: Tom Cranstoun and Maxine

mx:
  name: routing-pipeline-adr
  license: proprietary
  status: accepted
  category: adr
  partOf: mx-maxine-lives

  adr:
    number: 2
    title: "Routing Pipeline — Prompt Preprocessing with Route-Based Context Injection"
    status: accepted
    date: 2026-02-13
    context: "Every prompt to Claude carries inference cost. Complex or ambiguous prompts waste compute because Claude must search for context that already exists in structured form. The gestalt has ROUTING.cog.md files that map intents to folders. A hook can inject this routing context before Claude sees the prompt — cutting inference, improving accuracy."
    decision: "Build a UserPromptSubmit hook that spell-corrects prompts locally (aspell), matches intents against a routing registry, and injects relevant routing context into the conversation. The cog defines the SOP. The hook executes it."
    consequences:
      - "Every complex prompt gets routing context — Claude knows where to look before searching"
      - "aspell runs locally — no inference cost for spell correction"
      - "Smart trigger means simple prompts pass through unmodified — no latency penalty"
      - "Auto-generated routing registry scales as new ROUTING.cog.md files are added"
      - "The instruction IS the program — the action-doc SOP and the hook are the same system"

  affects:
    - mx-os
    - mx-maxine-lives
    - all-initiatives
  buildsOn: [maxine-lives, maxine-lives-routing]
  tags: [adr, routing, hook, inference-reduction, aspell, preprocessing, pipeline]
  audience: [gestalt, developers]

  contentType: "adr"
  runbook: "This ADR documents the routing pipeline architecture. The pipeline preprocesses user prompts with spell correction, route matching, and context injection to reduce Claude's inference cost."
---

# ADR 2: Routing Pipeline — Prompt Preprocessing with Route-Based Context Injection

**Status:** Accepted
**Date:** 2026-02-13
**Deciders:** Tom Cranstoun and Maxine

---

## Context

Every prompt sent to Claude costs inference. When the prompt is complex or ambiguous, Claude spends tokens searching for context that already exists in structured form — ROUTING.cog.md files that map intents to specific folders, SOULs, and file patterns.

The gestalt has already built the routing infrastructure (ADR #1 established the block architecture; ROUTING.md and ROUTING.cog.md in Maxine Lives map every query type to the right folder). What's missing is the bridge between the human's prompt and the structured routing information.

Tom types fast with typos. Claude interprets through them, but that costs inference too.

---

## Decision

Build a **prompt preprocessing pipeline** implemented as:

1. **An action-doc** (`routing-pipeline.cog.md`) that defines the SOP
2. **A UserPromptSubmit hook** (`route-decorator.sh`) that executes it
3. **A routing registry** (auto-generated JSON index of all ROUTING.cog.md files)
4. **A sync script** (`route-sync.js`) that generates the registry

### The Pipeline

```
User prompt
    │
    ▼
[1. aspell] ── Fix obvious typos (local, zero inference cost)
    │
    ▼
[2. Smart trigger] ── Is this complex enough to route?
    │                   < 10 words → pass through
    │                   ≥ 10 words → continue
    ▼
[3. Route-match] ── Scan routing-registry.json
    │                Match prompt keywords against route intents
    │                Find relevant folders, SOULs, key fields
    ▼
[4. Decorate] ── Inject routing context via additionalContext
    │              Visible first time (user learns the pattern)
    │              Hidden after (efficiency)
    ▼
[5. Claude] ── Enriched prompt → better answer, less inference
    │
    ▼
[6. Post-route] ── Hook + Claude hybrid decision:
                    Does this need a follow-up interview?
                    If yes → route again → interview → repeat
```

### Key Design Decisions

**aspell for spell correction** — Local tool, no inference cost. aspell lists misspelled words; corrections are provided as context hints, not automatic replacements (safer than auto-correct).

**Smart trigger** — Prompts under 10 words pass through unmodified. No latency penalty for simple commands. Complex/ambiguous prompts get the full pipeline.

**Auto-generated registry** — `npm run route:sync` scans all ROUTING.cog.md files, extracts intents and keywords, generates `routing-registry.json`. Same pattern as `npm run cog:sync`. Registry updates as routing files are added.

**Visible then hidden** — First time a user sees routing decoration, it's visible (they learn the pattern). After that, it's injected as hidden context. State tracked in `.claude/hooks/state/route-decoration-seen`.

**Hybrid interview decision** — The hook flags low-confidence routes (e.g., matched 0 or 5+ routes). Claude confirms whether an interview is needed. Neither decides alone.

---

## Consequences

### Positive

- **Reduced inference cost** — Claude knows where to look before searching.
- **Better accuracy** — Route context includes specific SOUL.md paths and key YAML fields.
- **Zero cost for simple prompts** — Smart trigger bypasses the pipeline.
- **Scalable** — Every new initiative with a ROUTING.cog.md automatically joins the registry.
- **Self-documenting** — The action-doc IS the specification. The hook IS the implementation.

### Negative

- **Latency on complex prompts** — aspell + jq + route matching adds time (mitigated: typically < 500ms).
- **Registry staleness** — If `route:sync` isn't run, new routes won't be found (mitigated: run on session start or pre-commit).
- **Keyword matching limits** — Simple keyword matching may produce false positives (mitigated: Claude interprets the context, not the hook).

### Risks

- **aspell not installed** — Hook degrades gracefully (skips spell step).
- **No routing registry** — Hook exits silently (no decoration).
- **jq not installed** — Hook cannot parse registry (fails silently).

---

## Implementation

| Deliverable | Path | Type |
|---|---|---|
| Action-doc SOP | `mx-canon/MX-Cog-Registry/cogs/routing-pipeline.cog.md` | action-doc |
| Hook script | `.claude/hooks/route-decorator.sh` | bash |
| Sync script | `scripts/route-sync.js` | node.js |
| Registry | `mx-canon/mx-maxine-lives/routing-registry.json` | auto-generated |
| npm command | `npm run route:sync` | package.json |
| Hook config | `.claude/settings.local.json` | UserPromptSubmit event |

---

## Phase 2 (Future)

- **Post-response routing** — Analyse Claude's response to decide if interview needed.
- **Per-initiative routing** — Roll out ROUTING.md + ROUTING.cog.md to all Canon initiatives.
- **Confidence scoring** — Smart trigger uses match count and specificity, not just word count.
- **Registry auto-refresh** — SessionStart hook runs `route:sync` automatically.

---

*Cut compute, not context.*
