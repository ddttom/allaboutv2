---
version: "1.0"
description: "NDR #1: The word 'block' risks confusion with blockchain. Propose alternatives for advisory board review."
created: 2026-02-13
author: Tom Cranstoun and Maxine

mx:
  name: block-naming-decision
  status: proposed
  category: naming
  partOf: mx-the-gathering
  tags: [ndr, naming, blocks, terminology, advisory-board]
  audience: [developers, business, investors]

  ndr:
    number: 1
    title: "Block Naming — Avoiding Blockchain Confusion"
    status: proposed
    date: 2026-02-13
    old-name: "block"
    new-name: "TBD — awaiting advisory board input"
    rationale: "The word 'block' in 'block architecture', 'HTML block', 'prose block' etc. will be confused with blockchain by investors, business audiences, and the general public. The concepts are completely unrelated. We need a term that means 'discrete typed section within a cog' without triggering blockchain associations."
    audience: "All — this term appears in specs, pitches, manuals, and the books"

  affects:
    - cog-unified-spec
    - block-architecture-decision
    - mx-messaging
    - vision-statement

  buildsOn: [block-architecture-decision, what-is-a-cog]
---

# Block Naming — Avoiding Blockchain Confusion

## The Problem

The cog-unified-spec v2.0 introduced a "block architecture" where cogs contain typed sections: prose blocks, action blocks, code blocks, HTML blocks, essence blocks, definition blocks. The architecture is right. The name is wrong.

"Block" will be confused with "blockchain" by every non-technical audience we serve — investors, CMS vendors, business decision-makers, the AI-fearful public. The confusion is guaranteed. It costs us credibility and forces an explanation every time.

Tom raised this on 13 February 2026: *"Beware we do not confuse blocks with blockchain. Not the same thing."*

## The Requirement

A word that means: **a discrete, typed section within a cog document.** Each one carries a different kind of content (prose, code, HTML, metadata, binary references). A cog is composed of them. They are typed. They are optional. Readers can ignore, include, or refuse them.

## Candidates

| Term | Usage Example | Pros | Cons |
|------|--------------|------|------|
| **Facet** | "prose facet", "HTML facet", "a cog has facets" | Implies different views of the same thing. Echoes "design for both." Distinctive. | Less familiar. Could sound precious. |
| **Section** | "prose section", "code section" | Everyone understands it. HTML has `<section>`. | Generic. Overloaded. No personality. |
| **Layer** | "prose layer", "code layer" | Implies composition and stacking. | Confused with network layers (OSI). |
| **Part** | "prose part", "action part" | Simple. "A cog has parts." | Too generic. No distinctiveness. |
| **Slice** | "prose slice", "code slice" | Clear. Each slice is a typed chunk. | Food metaphor. Slightly clinical. |
| **Cell** | "prose cell", "code cell" | Jupyter notebooks use cells. Familiar to devs. | Confused with spreadsheet cells. Biology. |
| **Pane** | "prose pane", "code pane" | Like window panes — different views in one frame. | Visual metaphor may not fit files. |
| **Leaf** | "prose leaf", "code leaf" | Tree metaphor. "Leaves of a document." | Implies flat/terminal. Not composable. |

### Maxine's Recommendation

**Facet** is the strongest candidate. A facet is a surface of a gem — the same object, seen from a different angle. "A cog has facets. Each facet serves a different audience." It echoes the MX principle of designing for both.

But this is a naming decision that affects every document, pitch, book, and spec. It warrants advisory board input.

## Decision Process

1. **Proposed** — 13 Feb 2026, this NDR
2. **Advisory board review** — present options at next meeting
3. **Accepted** — when the board agrees on a term
4. **Implemented** — rename across all specs, books, pitches, and code

## What Changes If Renamed

- `cog-unified-spec.md` — all block type references
- `block-architecture-decision` ADR — title and content
- Vision statement — architecture description
- MX: The Handbook and MX: The Codex — manuscript chapters
- Messaging framework (`mx-messaging.cog.md`)
- All skills and manuals that reference block types
- YAML field name: `blocks:` array in frontmatter

## Scope

This affects the user-facing term only. The YAML field name (`blocks:`) should change to match. Internal code variable names are secondary — they follow the spec.

---

*Names matter. They carry meaning, set expectations, and either help or hinder understanding. Get this one right.*
