---
version: "1.0"
description: "ADR #6: Two-style blockquote system for PDF generation — distinguishing cross-reference callouts from pull quotes using a Pandoc Lua filter and custom LaTeX environments."
created: 2026-03-10
modified: 2026-03-10
author: Tom Cranstoun and Maxine

mx:
  status: accepted
  category: architecture
  partOf: mx-maxine-lives
  tags: [adr, pdf-generation, blockquotes, pull-quotes, cross-references, lua-filter, latex, pandoc]
  audience: [tech]

  adr:
    number: 6
    title: "Blockquote Styling for PDF Generation"
    status: accepted
    date: 2026-03-10
    context: "Both books (Handbook and Protocols) use markdown blockquotes (>) for three distinct purposes: cross-reference callouts pointing to the companion book, attributed quotes from people, and highlighted key statements. All three render identically in PDF output, making it impossible for readers to distinguish navigational callouts from substantive quotations."
    decision: "Implement a two-style blockquote system using a Pandoc Lua filter (scripts/filters/blockquote-styles.lua) that detects blockquote type from content patterns, plus custom LaTeX environments in both books' metadata.yaml header-includes. Cross-reference callouts (detected by bold label pattern like '**For theoretical foundation:**') render as light grey boxes with thin borders. Pull quotes (everything else) render with a thick dark left bar, italic text, and em-dash attribution."
    consequences: "Visual distinction between navigational and substantive blockquotes. No markdown source changes required — the Lua filter detects patterns automatically. Requires --lua-filter flag added to all pandoc commands in package.json. Both books share the same filter and LaTeX environments for consistency."

  buildsOn: [2026-02-18-typography-standards-for-pdf-generation]
---

# Blockquote Styling for PDF Generation

## Context

Both MX books use markdown blockquotes (`>`) for three distinct purposes:

1. **Cross-reference callouts** — Pointing readers to the companion book (e.g. "For theoretical foundation: see MX: The Protocols")
2. **Attributed quotes** — Actual quotes from people or systems
3. **Key statements** — Highlighted important principles or conclusions

All three render identically in PDF output as standard LaTeX `quote` environments. Readers cannot distinguish navigational callouts from substantive quotations.

## Decision

Implement a two-style system:

### Style 1: Cross-Reference Callouts

- **Detection**: Blockquotes starting with a bold label pattern (e.g. `> **For theoretical foundation:**`, `> **For comprehensive analysis:**`, `> **Companion volume:**`, `> **See also:**`, `> **For technical depth:**`)
- **Visual**: Light grey background box (`#F0F0F0`) with thin border (`#CCCCCC`)
- **Purpose**: Navigation — tells the reader where to find more information

### Style 2: Pull Quotes

- **Detection**: All other blockquotes (default)
- **Visual**: Thick dark left bar (`#333333`, 3pt width), italic text, em-dash attribution
- **Purpose**: Emphasis — highlights important statements or attributed quotes

### Implementation

1. **Pandoc Lua filter** (`scripts/filters/blockquote-styles.lua`) — inspects first inline element of each blockquote. If it matches a bold cross-reference label pattern, wraps in `\begin{mxcrossref}...\end{mxcrossref}`. Otherwise wraps in `\begin{mxpullquote}...\end{mxpullquote}`.

2. **LaTeX environments** (in `header-includes:` of both books' `metadata.yaml`) — defines `mxcrossref` and `mxpullquote` environments with distinct styling.

3. **Build pipeline** — `--lua-filter scripts/filters/blockquote-styles.lua` added to all pandoc commands in `package.json`.

## Consequences

- Visual distinction between navigational and substantive blockquotes improves reader experience
- No markdown source changes required — the Lua filter detects patterns automatically
- Both books share the same filter and LaTeX environments for consistency
- Requires `--lua-filter` flag added to all pandoc commands in package.json
- Authors writing new cross-reference callouts should follow the bold label pattern convention
- The filter is additive — blockquotes without recognised patterns fall through to pull quote styling

## Cross-Reference Label Patterns

The following bold patterns at the start of a blockquote trigger cross-reference styling:

- `**For theoretical foundation:**`
- `**For comprehensive analysis:**`
- `**For technical depth:**`
- `**Companion volume:**`
- `**See also:**`
- `**Hands-On:**`
- `**For ...: **` (any "For X:" pattern with bold formatting)
