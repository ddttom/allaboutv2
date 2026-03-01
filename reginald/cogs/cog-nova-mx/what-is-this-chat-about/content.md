---
name: what-is-this-chat-about
version: "1.0.0"
description: "Summarise what a chat session covered — structured output for future sessions, Tom, and external readers."

created: 2026-02-11
modified: 2026-02-11

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-os
partOf: mx-os
refersTo: [cog-unified-spec, mx-principles]
builds-on: [what-is-a-cog, building-action-docs]
tags: [session, summary, chat, context, memory, audit, gestalt]

audience: ai-agents
reading-level: technical
purpose: Give any AI agent a repeatable SOP for summarising a chat session — what was discussed, what was built, what changed, and what to do next

execute:
  runtime: runbook
  command: mx what-is-this-chat-about
  actions:
    - name: summarise
      description: Produce a structured summary of the current chat session and write it as a dated info-doc
      usage: |
        1. **Gather context** from the current conversation:
           a. Scan tool calls for files read, written, edited, and commands executed
           b. Identify user requests and the problems they were solving
           c. Note technical decisions made and alternatives considered
           d. List all commits created during the session (git log)
           e. Check git status for uncommitted changes
           f. Read REMINDERS.md for any reminders added or completed during the session

        2. **Classify the session** into one or more themes:
           - Feature implementation
           - Bug fix
           - Documentation update
           - Refactoring
           - Configuration change
           - Vision / planning
           - Business / pitch work

        3. **Write the summary** as a dated info-doc file:
           - Path: `mx-outputs/md/reports/completions/{YYYY-MM-DD}/session-summary-{YYYY-MM-DD}T{HH-MM}.cog.md`
           - Create the date directory if it does not exist
           - Use ISO 8601 for the date, hyphens (not colons) in the filename time

        4. **Structure the info-doc** with this frontmatter and body:

           ```yaml
           ---
           name: session-summary-{YYYY-MM-DD}T{HH-MM}
           version: "1.0.0"
           description: "{One-line summary of main accomplishment}"
           created: {YYYY-MM-DD}
           modified: {YYYY-MM-DD}
           author: Tom Cranstoun and Maxine
           status: published
           category: session
           tags: [session, summary, {theme tags}]
           session-date: "{YYYY-MM-DD}"
           session-themes: [{theme list}]
           commits: [{commit hash list}]
           files-changed: {count}
           ---
           ```

           Body sections:
           - **Overview** — 1-2 paragraph summary. What was the session about and why.
           - **What Was Accomplished** — Numbered list of major tasks with file links.
           - **Files Modified** — Table of files changed with descriptions.
           - **Commits** — Table of commit hashes and messages.
           - **Technical Decisions** — Key choices made and why.
           - **Uncommitted Changes** — What remains unstaged.
           - **Active Reminders** — Current state of REMINDERS.md.
           - **Next Steps** — What should happen next session.

        5. **Present the summary** in the conversation as well — do not just write the file silently. Show the overview, accomplishments, and next steps.
      inputs:
        - name: scope
          type: string
          required: false
          description: "Scope the summary to a specific part of the session (e.g. 'just the api work'). Default: entire session."
      outputs:
        - name: summary-file
          type: file
          description: "Path to the written info-doc file"
        - name: summary-text
          type: string
          description: "The summary presented in conversation"

    - name: compare
      description: Compare two session summaries to show what changed between them
      usage: |
        1. **Read both session summary cog files** specified by the user.
           - Accept paths, dates, or natural language ("today's first session" and "today's second session")
           - If only one is given, compare it against the most recent other summary in the same date folder
           - If none given, compare the two most recent summaries

        2. **Extract structured data** from both cogs:
           - commits (from `commits:` frontmatter)
           - files-changed count
           - session-themes
           - tags
           - the "What Was Accomplished" section
           - the "Next Steps" section

        3. **Generate a comparison report**:
           - **Continuity**: Did session B pick up where session A left off? Match A's "Next Steps" against B's "What Was Accomplished".
           - **Theme shift**: Did the themes change? What new themes appeared?
           - **Velocity**: Files changed, commits made, reminders added/completed.
           - **Drift**: Was anything from A's next steps NOT addressed in B? Flag these as potential gaps.
           - **New work**: What in B was not predicted by A's next steps? This is emergent work.

        4. **Present the comparison** in the conversation. Use a table for velocity metrics and prose for continuity analysis.
      inputs:
        - name: session-a
          type: string
          required: false
          description: "Path or date reference for the first (earlier) session summary"
        - name: session-b
          type: string
          required: false
          description: "Path or date reference for the second (later) session summary"
      outputs:
        - name: comparison-text
          type: string
          description: "The comparison report presented in conversation"

    - name: brief
      description: Produce a 3-line executive summary of the current session for external readers
      usage: |
        1. **Analyse the current conversation** using the same context-gathering steps as the `summarise` action (step 1).

        2. **Distill to exactly three lines**:
           - **Line 1: What** — One sentence describing what was accomplished. Business language, not technical. No jargon.
           - **Line 2: Why** — One sentence explaining why this matters. Connect to MX mission or business value.
           - **Line 3: Next** — One sentence stating the most important next step.

        3. **Rules**:
           - No bullet points. Three sentences. Full stop after each.
           - No file paths, commit hashes, or technical terms unless they are already business terms (e.g. "SOP", "cog").
           - Written for someone who has never seen MX OS but understands business.
           - Under 280 characters total if possible (tweetable).

        4. **Present in conversation** and offer to write to a file if the user wants.
      inputs: []
      outputs:
        - name: brief-text
          type: string
          description: "The 3-line executive summary"

mx:
  contentType: "action-doc"
  runbook: "mx exec what-is-this-chat-about"
  convergence: true
  accessibility: false
  semantic: true
---

# What Is This Chat About

Every chat session is work. Work that gets lost if nobody writes it down.

This action-doc is the SOP for session documentation. It turns a conversation — scattered tool calls, file edits, git commits, decisions made in passing — into a structured record that future sessions can read, Tom can reference, and external readers can understand.

## Why This Exists

AI agents forget between sessions. The gestalt does not — but only if someone writes down what happened. This cog is the "someone."

Every session summary is itself an info-doc: YAML frontmatter for machines, markdown body for humans. A future Maxine session can read the frontmatter to know what themes were covered, how many files changed, and what the next steps were — without reading the full summary. Cut compute, not context.

## The Three Actions

### summarise

The core action. Analyses the current conversation, gathers context from tool calls and git history, classifies the session by theme, and writes a dated info-doc to `mx-outputs/md/reports/completions/`. Also presents the summary in conversation so Tom sees it immediately.

The output file follows the session summary convention established in the `mx-endsession` skill — but formalised as a cog with machine-readable frontmatter.

### compare

Takes two session summaries and shows what changed between them. Did session B pick up where session A left off? What themes shifted? What work was emergent (not predicted by the previous session's next steps)? What fell through the cracks?

This is the session audit tool. It turns a sequence of summaries into a narrative of progress.

### brief

Three lines. Business language. No jargon. What happened, why it matters, what's next. Under 280 characters if possible. For investors, partners, or anyone who needs the headline without the detail.

## How It Fits

This cog replaces the ad-hoc session summary pattern with a formal, repeatable SOP. The `mx-endsession` skill can invoke this cog's `summarise` action instead of carrying its own summary logic. One SOP, one source of truth.

Session summaries are info-docs. This action-doc creates them. The builder builds the record. The record remembers the builder.

## For AI Agents

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Session summary created

Output:
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-outputs/md/reports/completions/2026-02-17/session-summary-2026-02-17T14-30.cog.md
```

Not just "Summary written" or "session-summary-2026-02-17T14-30.cog.md created" — the full absolute path from root.

*"The gestalt never forgets — but only if someone writes it down."*
