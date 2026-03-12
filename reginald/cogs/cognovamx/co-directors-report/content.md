---
version: "2.2"
description: Time-segmented session reports for co-directors. Three daily segments (morning, afternoon, evening). Interviews Tom, reads data, and updates REMINDERS.md.

created: 2026-02-10
modified: 2026-02-14

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-maxine-lives
  refersTo: [cog-unified-spec]
  buildsOn: [what-is-a-cog, what-is-mx-os, mx-reminders]
  tags: [reporting, governance, co-directors, session, board, stakeholders, archive, sop]

  audience: business
  readingLevel: beginner

  contentType: "action-doc"
  runbook: "mx exec co-directors-report"
  execute:
    runtime: runbook
    command: mx co-directors report
    policy: |
      Reports are factual summaries, not marketing. Be honest about failures and abandoned work.
      Never include confidential names (advisory board members described by role only).
      Reports are filed as dated, segmented snapshots. Each day has up to three segments: morning (before 12:00), afternoon (12:00–17:00), evening (after 17:00).
      Within a segment, the report is updated (not duplicated). A new segment creates a new file.
      Structure adapts to what happened — no forced sections. Every report has a descriptive title.
      Next steps identified in the report are added to REMINDERS.md automatically.
    actions:
      - name: generate
        description: Interview Tom, gather all available data, produce a segment report, and update reminders
        usage: |
          ## Phase 0 — Detect Segment

          Determine the current time segment from the system clock:

          - **morning** — before 12:00
          - **afternoon** — 12:00 to 16:59
          - **evening** — 17:00 onwards

          Run `date +%H` to get the current hour. Map to segment name.

          Calculate the `--since` boundary:
          - **morning** — midnight today (`YYYY-MM-DDT00:00:00`)
          - **afternoon** — noon today (`YYYY-MM-DDT12:00:00`)
          - **evening** — 5pm today (`YYYY-MM-DDT17:00:00`)

          Check for an existing report for this segment:
          - Look for `mx-outputs/md/reports/directors/session/YYYY-MM-DD-<segment>-report.md`
          - If it exists, this is an **update** — read it first, then merge new data into it
          - If it does not exist, this is a **new** report

          Also check for earlier segments today. If a morning report exists and we are now in afternoon, the `--since` for git log should be the morning report's timestamp (to avoid double-counting). Use the earlier report's last commit hash or the segment boundary time, whichever is later.

          ## Phase 0.5 — Refresh Self-Knowledge

          Before gathering data, regenerate Maxine's self-knowledge:

          1. **Save the current snapshot**: Read `mx-canon/mx-maxine-lives/about.mx.cog.md` and store the YAML `snapshot:` section
          2. **Run the recon script**: `bash scripts/mx-about-recon.sh`
          3. **Read the new snapshot**: Read the regenerated `about.mx.cog.md` YAML `snapshot:` section
          4. **Diff the snapshots**: Compare old vs new. Note any changes in cog counts, manual counts, skill counts, registry entries, decision counts, etc.
          5. **Store the diff**: Keep the list of changes for Phase 3 — they become the "What Changed About Me" section in the report

          If `about.mx.cog.md` does not exist yet (first run), skip the diff — just generate the file.

          ## Phase 1 — Gather Data

          Read all available sources in parallel:

          1. **Git history**: Run `git log --oneline --since="<since-boundary>"` and `git log --stat --since="<since-boundary>"` to get commits, files changed, and line counts for THIS segment only
          2. **Git diff**: Run `git diff --stat HEAD` for any uncommitted changes
          3. **Changelog**: Read CHANGELOG.md — latest [Unreleased] section
          4. **REMINDERS.md**: Read active reminders to check for completed or relevant items
          5. **mx-canon changes**: Run `git diff --name-only <since-boundary>..HEAD -- mx-canon/` to identify which Canon files changed
          6. **Session context**: Review the current conversation for decisions, insights, and direction changes that git cannot capture
          7. **Earlier segments today**: If morning or afternoon reports exist, read their summaries so this report can reference continuity without repeating detail
          8. **Self-knowledge diff**: The about.mx snapshot diff from Phase 0.5

          ## Phase 2 — Interview Tom

          Start with one open question:

          > "What should the board know about this [morning/afternoon/evening]?"

          Listen to the answer. Then ask up to 3 follow-up questions based on what Tom said and what the data shows. Follow-ups should probe:
          - Anything significant the data shows that Tom did not mention
          - Decisions or direction changes that need board visibility
          - Blockers or risks that surfaced

          Do not use a fixed question list. Let the conversation guide the follow-ups. If Tom's first answer covers everything, do not force more questions.

          **If this is an update to an existing segment report** (same segment, more work done since last update), skip Phase 2 — merge the new data into the existing report without re-interviewing.

          ## Phase 3 — Generate Report

          Combine Tom's reflections with the gathered data. The report structure is adaptive — include only sections that have substance. Every report must have:

          - **A descriptive title** in the frontmatter and heading (not just a date — describe what happened)
          - **A summary paragraph** — Tom's framing supported by numbers
          - **Next steps** — what comes next

          Beyond those three, include sections only when the session warrants them. Possible sections (use as needed, not as a checklist):

          - By the Numbers (commits, files, lines — when quantification adds value)
          - What Was Built (new deliverables, documents, cogs)
          - What Changed (modifications, renames, restructuring)
          - The Insight (when a conceptual breakthrough or reframing occurred)
          - Decisions Made (choices that affect direction)
          - Open Questions (things needing co-director attention)
          - What Changed About Me (when the self-knowledge diff from Phase 0.5 shows meaningful changes — new cogs, new skills, new registries, new decisions)
          - What This Means for Investors (when changes affect the pitch or business case)
          - Commit Log (hash + theme for every commit in this segment)

          Use Tom's voice for the summary. Use plain business language throughout — no jargon unless explained. Be honest. Be specific.

          If earlier segment reports exist today, the summary should acknowledge continuity: "Building on this morning's work on X, this afternoon..."

          ### Frontmatter

          ```yaml
          ---
          title: "Co-Directors Report — Descriptive Title Here"
          created: "YYYY-MM-DD"
          segment: "morning|afternoon|evening"
          version: "1.0"
          author: Tom Cranstoun and Maxine
          audience: stakeholders
          confidentiality: internal
          ---
          ```

          ### File naming

          Save to `mx-outputs/md/reports/directors/session/YYYY-MM-DD-<segment>-report.md`

          Examples:
          - `2026-02-13-morning-report.md`
          - `2026-02-13-afternoon-report.md`
          - `2026-02-13-evening-report.md`

          If updating an existing segment report, overwrite the file (increment `version` in frontmatter).

          ## Phase 4 — Update REMINDERS.md

          Read the Next Steps from the generated report. For each actionable item:

          1. Check if it already exists in REMINDERS.md
          2. If not, add it to the Active Reminders section
          3. If a reminder was completed during this session, move it to the Completed section with today's date

          Do not ask permission for reminder updates — this is a gestalt-owned file.

        inputs:
          - name: segment
            type: string
            description: "Time segment: morning, afternoon, or evening. Auto-detected from system clock if not provided."
            required: false
          - name: since
            type: string
            description: "Override start boundary for git log. Format: YYYY-MM-DDTHH:MM:SS. Auto-calculated from segment if not provided."
            required: false
        outputs:
          - name: report
            type: file
            description: The generated segment report, saved to management/reports/
        invokes: [mx-reminders.add, mx-reminders.complete]

      - name: list
        description: List all reports in the archive
        usage: |
          1. List files in mx-outputs/md/reports/directors/session/ matching ????-??-??-*.md
          2. For each, read the YAML frontmatter to get title and date
          3. Present as a table: date, title
          4. Most recent first
        outputs:
          - name: report-list
            type: string
            description: Table of all archived reports

      - name: review
        description: Summarise the last N reports for board review
        usage: |
          1. Read the most recent N reports from mx-outputs/md/reports/directors/session/ (default: 5)
          2. Extract the Summary section from each
          3. Present as a chronological digest with dates and one-paragraph summaries
          4. End with cumulative statistics (total commits, total files, date range)
          5. Identify recurring themes or unresolved questions across reports
        inputs:
          - name: count
            type: number
            description: "Number of recent reports to review (default: 5)"
            required: false
        outputs:
          - name: digest
            type: string
            description: Board-level digest of recent sessions
---

# Co-Directors Report

A Standard Operating Procedure that generates board-level session reports for MX Holdings stakeholders.

---

## Why This Exists

Development sessions produce dozens of commits, file changes, and decisions. None of that is visible to co-directors, advisory board members, or potential investors unless someone writes it up. This action-doc is the SOP for that write-up.

The reports are not marketing. They are honest, dated snapshots: what was built, what changed, what needs attention. They accumulate in the deliverables archive, building an institutional memory that any stakeholder can read from the beginning.

---

## How It Works

Each working day produces up to three segment reports: morning, afternoon, and evening. The segment is detected from the system clock. Each report covers only the work done in that segment — no double-counting, no ad-hoc suffixes.

Every report starts with an open conversation. The action-doc asks Tom one question: *"What should the board know about this [segment]?"* — then follows up based on the answer and the data. No fixed question list. The conversation guides the report. If the segment report is being updated (more work done in the same segment), new data is merged without re-interviewing.

The report structure adapts to what happened. A session with a conceptual breakthrough gets an "Insight" section. A session with business decisions gets a "Decisions Made" section. A routine coding session gets "What Was Built" and numbers. No forced sections, no empty headings.

After generating the report, the action-doc updates REMINDERS.md with any next steps — automatically, because both files are gestalt-owned.

---

## Data Sources

The action-doc reads everything available:

- **Git history** — commits, file changes, line counts since the last report
- **Git diff** — uncommitted work in progress
- **Changelog** — the latest unreleased section
- **REMINDERS.md** — active items, completed items
- **mx-canon changes** — which Canon files were modified (the strategic signal)
- **Session context** — the conversation itself, including decisions and insights that git cannot capture
- **Self-knowledge diff** — changes to `about.mx.cog.md` since the previous report (new cogs, new skills, new registries, new decisions)

---

## The Archive

Reports accumulate in `mx-outputs/md/reports/directors/session/`. Named by date and segment:

- `2026-02-13-morning-report.md`
- `2026-02-13-afternoon-report.md`
- `2026-02-13-evening-report.md`

Up to three reports per day. Each covers one segment of the working day. The `list` action shows what is in the archive. The `review` action produces a board-level digest of the most recent reports.

---

## Audience

Written for people who run businesses:

1. **Co-directors** — Eleanor Cranstoun and Scott McGregor
2. **Advisory board** — four industry practitioners (described by role, never by name)
3. **Investors and sponsors** — anyone evaluating MX progress
4. **Future team members** — onboarding context

---

*The board does not read git logs. This SOP makes sure they do not have to.*
