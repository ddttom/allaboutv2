---
version: "1.0.0"
description: "Find what changed in the repo — list files by time period and type, extract metadata, show git status, surface gaps. The content audit tool."
created: 2026-02-11
modified: 2026-03-03
author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published
  category: mx-content
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, building-action-docs]
  tags: [audit, content, files, metadata, git, dashboard, activity, changed, inventory]
  audience: agents
  readingLevel: advanced
  execute:
    runtime: runbook
    command: mx whats-changed
    actions:
      - name: list
        description: List files matching a time period and type filter with metadata
        usage: |
          1. Parse the user's request to extract:
             - **period**: Natural language time expression. Convert to a find-compatible duration:
               - "today" → files modified since midnight today
               - "yesterday" → files modified in the last 48 hours
               - "this week" → files modified in the last 7 days
               - "last 3 days" → files modified in the last 3 days
               - "last week" → files modified in the last 7-14 days
               - "this month" → files modified in the last 30 days
               - "since Monday" → calculate days since last Monday
               - Default if not specified: last 24 hours
             - **type**: File extension filter.
               - "md" → *.md files only
               - "html" → *.html files only
               - "all" → every file
               - Multiple: "md and html" → both *.md and *.html
               - Default if not specified: all
             - **path**: Subdirectory to scope the search.
               - Default: repo root
               - Example: "in mx-canon" → search only mx-canon/
          2. Find matching files using filesystem tools:
             - Search the specified path (default: repo root)
             - Filter by modification time matching the period
             - Filter by file extension matching the type
             - Exclude: node_modules/, .git/, .claude/ (internal tooling)
          3. For each file found:
             a. **File info**: relative path from repo root, file extension, last modified date
             b. **Git status**: Check git status for the file
                - Untracked (??) or Added (A) → mark as NEW
                - Modified (M) → mark as MODIFIED
                - Clean (committed, no changes) → mark as COMMITTED
             c. **Frontmatter extraction** (for files that support it — md, yaml, yml, cog.md):
                - Parse YAML frontmatter between --- markers
                - Extract: title (or name), content-state (or status), author, date, version
                - If no frontmatter: mark as "no frontmatter"
             d. **For HTML files**: extract <title> tag content and content-state meta tag if present
          4. Present results as a table sorted by modification date (newest first):
             | Status | Type | Title | State | Path | Modified |
             |--------|------|-------|-------|------|----------|
             | NEW | md | Content That Manages Itself | in-review | mx-crm/blog/... | 2026-02-11 |
             | MODIFIED | md | The Principles That Changed... | published | datalake/pipeline/drafts/... | 2026-02-11 |
          5. Below the table, show:
             - Total count: "Found N files (X new, Y modified, Z committed)"
             - Period: "Period: last 24 hours"
             - Type filter: "Type: md"
             - Search path: "Path: repo root"
        inputs:
          - name: period
            type: string
            required: false
            description: "Natural language time period — 'today', 'last week', 'since Monday'. Default: last 24 hours"
          - name: type
            type: string
            required: false
            description: "File extension filter — 'md', 'html', 'all', or multiple like 'md and html'. Default: all"
          - name: path
            type: string
            required: false
            description: "Subdirectory to scope search. Default: repo root"
        outputs:
          - name: file-list
            type: array
            description: "Table of files with status, type, title, state, path, modified date"
      - name: summary
        description: Aggregate counts by file type, content state, and git status
        usage: |
          1. Run the list action internally with the same period/type/path inputs
          2. Aggregate the results into three breakdowns:
             **By file type:**
             | Type | Count |
             |------|-------|
             | md | 42 |
             | html | 14 |
             | css | 14 |
             **By content state** (only for files with frontmatter):
             | State | Count |
             |-------|-------|
             | published | 16 |
             | draft | 3 |
             | in-review | 1 |
             | no frontmatter | 22 |
             **By git status:**
             | Status | Count |
             |--------|-------|
             | NEW | 5 |
             | MODIFIED | 35 |
             | COMMITTED | 2 |
          3. Show the total and period at the top:
             "Summary: 42 files changed in the last 24 hours"
        inputs:
          - name: period
            type: string
            required: false
            description: "Natural language time period. Default: last 24 hours"
          - name: type
            type: string
            required: false
            description: "File extension filter. Default: all"
          - name: path
            type: string
            required: false
            description: "Subdirectory to scope search. Default: repo root"
        outputs:
          - name: summary-report
            type: object
            description: "Aggregated counts by type, state, and git status"
      - name: detail
        description: Deep-inspect a single file's full metadata
        usage: |
          1. Accept a file path from the user
          2. Read the file
          3. Extract and present ALL metadata:
             **File info:**
             - Path: [relative path]
             - Type: [extension]
             - Size: [bytes]
             - Last modified: [date]
             - Git status: [NEW/MODIFIED/COMMITTED]
             **YAML frontmatter** (if present — show all fields):
             - title: ...
             - author: ...
             - status: ...
             - [every field found]
             **For HTML files:**
             - <title> content
             - All <meta> tags (name + content)
             - Schema.org JSON-LD (if present, show type and headline)
             **Metadata quality assessment:**
             - Has frontmatter: yes/no
             - Has title: yes/no
             - Has author: yes/no
             - Has date: yes/no
             - Has status/content-state: yes/no
             - Has description: yes/no
             - Has keywords/tags: yes/no
             - Quality score: N/7 fields present
          4. If the file is part of a cog (*.cog.md), also show:
             - Category, builds-on, tags, execute block summary
        inputs:
          - name: file-path
            type: string
            required: true
            description: "Path to the file to inspect"
        outputs:
          - name: file-detail
            type: object
            description: "Complete metadata inspection of a single file"
      - name: timeline
        description: Group changes by day to show activity patterns
        usage: |
          1. Run the list action with the specified period (default: last 7 days) and type/path
          2. Group files by modification date (day)
          3. Present as a timeline:
             **2026-02-11** (today) — 23 files
             - 1 new, 22 modified
             - Types: md (15), html (5), css (3)
             - Notable: Content That Manages Itself (NEW, in-review)
             **2026-02-10** — 45 files
             - 3 new, 42 modified
             - Types: md (30), html (10), js (3), json (2)
             - Notable: joymaker-soul.md (NEW), REMINDERS.md (NEW)
             **2026-02-09** — 12 files
             ...
          4. At the bottom, show:
             - Total files across period
             - Most active day
             - Most common file type
        inputs:
          - name: period
            type: string
            required: false
            description: "Natural language time period. Default: last 7 days"
          - name: type
            type: string
            required: false
            description: "File extension filter. Default: all"
          - name: path
            type: string
            required: false
            description: "Subdirectory to scope search. Default: repo root"
        outputs:
          - name: timeline-report
            type: object
            description: "Day-by-day breakdown of file changes"
      - name: gaps
        description: Find files missing YAML frontmatter or key metadata fields
        usage: |
          1. Run the list action with the specified period/type/path
          2. For each file that SHOULD have frontmatter (md, cog.md, yaml):
             - Check for presence of YAML frontmatter (--- markers)
             - If frontmatter exists, check for key fields:
               - title (or name for cogs)
               - author
               - date (or created/modified)
               - description
               - status (or content-state)
             - Score: count of present fields out of 5
          3. Filter to files with gaps (score < 5 or no frontmatter at all)
          4. Present as a table sorted by score (worst first):
             | Score | Missing Fields | Path |
             |-------|---------------|------|
             | 0/5 | no frontmatter | datalake/pipeline/drafts/ideas/meeting.md |
             | 2/5 | author, date, description | datalake/knowledge/architecture/README.md |
             | 4/5 | description | mx-canon/mx-maxine-lives/management/plans/roadmap.md |
          5. Summary:
             - "Found N files with metadata gaps out of M total"
             - "Most common missing field: [field name]"
             - "Files with no frontmatter at all: N"
          6. Optionally suggest: "Run /mx-c-whats-changed detail [path] for full inspection of any file"
        inputs:
          - name: period
            type: string
            required: false
            description: "Natural language time period. Default: last 24 hours"
          - name: type
            type: string
            required: false
            description: "File extension filter. Default: md"
          - name: path
            type: string
            required: false
            description: "Subdirectory to scope search. Default: repo root"
        outputs:
          - name: gaps-report
            type: object
            description: "Files with missing or incomplete metadata"
  mx:
    contentType: "action-doc"
    runbook: "mx exec whats-changed"
    semantic: true
    convergence: true
    accessibility: true
---

# What's Changed

Find what changed in the repo. Filter by time, by file type, by directory. Extract metadata. Show git status. Surface gaps. The content audit tool built for AI agents and humans alike.

---

## What This Does

This action-doc generalises a common question: "What files changed recently?" It wraps that question in a structured workflow with five actions that cover different levels of detail.

- **list** — the core action. Find files matching a period and type filter. Show path, modification date, title (from frontmatter), content state, and git status (new vs modified). This is what you reach for first.

- **summary** — the overview. Same query as list, but aggregated into counts by file type, content state, and git status. Quick pulse check on repo activity.

- **detail** — the deep dive. Point it at a single file and get every piece of metadata: frontmatter fields, HTML meta tags, Schema.org data, and a quality score.

- **timeline** — the pattern view. Group changes by day across a period. See which days were busy, what types of files changed, and what stood out.

- **gaps** — the governance check. Find files that should have frontmatter but don't, or have frontmatter with missing fields. The metadata hygiene tool.

---

## Why This Exists

Every repo accumulates files. Every team asks "what changed?" The answer usually involves someone running git log, find commands, or grep chains and manually assembling the picture.

This cog makes that a single question. "What markdown files changed this week?" "Show me everything that changed in mx-canon since Monday." "Which files are missing metadata?"

The key features:

- **Natural language periods** — say "today", "last week", "since Monday" instead of calculating dates
- **Any file type** — md, html, css, yaml, json, svg, js, or "all"
- **Metadata extraction** — YAML frontmatter parsed automatically for files that have it
- **Git-aware** — knows whether a file is new (untracked/added), modified, or committed
- **Subdirectory scoping** — focus on mx-canon, datalake/pipeline/drafts, or any subdirectory

---

## For AI Agents

When a user asks "what changed" or "show me recent files" or "content audit":

1. Read this action-doc
2. Parse the user's request for period, type, and path
3. Run the appropriate action (list for specifics, summary for overview, gaps for hygiene)
4. Present results in the format specified by the action's usage instructions
5. If the user asks follow-up questions, use detail for single-file inspection

Default behaviour when invoked with no arguments: run **list** for the last 24 hours, all file types, repo root.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Gap analysis complete

Output:
  /Users/tom/Documents/MX/metadata-gaps-2026-02-17.md (3.2KB)
```

Not just "Gap analysis complete" or "outputs/metadata-gaps.md" — the full absolute path from root.

---

## Examples

"What markdown files changed today?"
→ `list` with period=today, type=md

"Give me a summary of this week's activity"
→ `summary` with period=this week, type=all

"Show me everything about SOUL.md"
→ `detail` with file-path=SOUL.md

"What's the activity pattern for the last month?"
→ `timeline` with period=this month

"Which files are missing metadata?"
→ `gaps` with period=all time, type=md

---

*What changed? Ask the cog. It reads the repo so you don't have to.*
