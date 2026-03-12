---
version: 1.0.0
description: Generate a new Canon initiative folder with full lifecycle support

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun & Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: draft

  category: mx-canon
  partOf: mx-canon
  refersTo: [soul-template]
  tags: [canon, template, meta, initiative, governance]

  execute:
    runtime: runbook
    command: mx canon init
    actions:
      - name: generate
        description: Create a new Canon initiative folder from the template
        usage: mx canon init generate <initiative-name>
        inputs:
          - name: initiative-name
            type: string
            required: true
            description: Name of the initiative (will be prefixed with MX- if not already)
          - name: description
            type: string
            required: true
            description: One-line description of the initiative
        outputs:
          - name: folder
            type: string
            description: Path to the created initiative folder

      - name: interview
        description: Interview the user to fill in the SOUL.md for a new initiative
        usage: mx canon init interview <initiative-path>
        inputs:
          - name: initiative-path
            type: string
            required: true
            description: Path to the initiative folder containing the SOUL template
        outputs:
          - name: soul
            type: object
            description: Completed SOUL.md content based on interview answers
        interview-questions:
          - field: what-it-is
            question: "What is this initiative? Describe it in one or two sentences as if explaining to someone who has never heard of it."
            maps-to: "## What [Name] Is"
          - field: voice
            question: "How should this initiative sound? Pick three to five adjectives."
            maps-to: "## Voice"
            guidance: "Think about who reads these documents. Developers? Business people? Both? The voice should match the audience."
          - field: core-narrative
            question: "What problem does this initiative solve? Start with the pain, then the solution."
            maps-to: "## Core Narrative"
            guidance: "Lead with what is broken today. Then explain what this initiative does about it. Be specific — use a concrete example if you have one."
          - field: constraints
            question: "What must this initiative never do? What rules are non-negotiable?"
            maps-to: "## Constraints"
            guidance: "Constraints protect the initiative from drift. Think about independence, licensing, scope boundaries, naming rules."
          - field: closing-line
            question: "Give this initiative a closing line. One sentence, italicised, that captures its essence."
            maps-to: "Closing line"
            guidance: "Like The Gathering's 'The standard belongs to the community.' or Canon's 'Everything else is canon fodder.'"

      - name: validate
        description: Validate a Canon initiative folder against Canon rules
        usage: mx canon init validate <initiative-path>
        inputs:
          - name: initiative-path
            type: string
            required: true
            description: Path to the initiative folder to validate
        outputs:
          - name: validation
            type: object
            description: Validation results
        checks:
          - name: soul-exists
            description: SOUL.md must exist at the initiative root
            severity: error
          - name: deliverables-readme
            description: deliverables/README.md must exist
            severity: error
          - name: frontmatter-version
            description: Every .md file must have version field in YAML frontmatter
            severity: error
          - name: no-version-in-filename
            description: No filenames may contain version numbers (e.g. -v1, -v2)
            severity: error
          - name: soul-sections
            description: SOUL.md must contain What It Is, Voice, Core Narrative, and Constraints sections
            severity: warning
          - name: deliverables-public
            description: Files in deliverables/ must not contain confidential information
            severity: warning

      - name: register
        description: Add the new initiative to the Canon README.md table
        usage: mx canon init register <initiative-path>
        inputs:
          - name: initiative-path
            type: string
            required: true
            description: Path to the initiative folder
          - name: purpose
            type: string
            required: true
            description: One-line purpose for the Canon README table
          - name: status
            type: string
            required: true
            description: Current status (e.g. Founding, Active, Draft)
        outputs:
          - name: registered
            type: boolean
            description: Whether registration succeeded

  requires:
    bins: []
    cogs: []

  contentType: "action-doc"
  runbook: "mx exec canon-init"
  convergence: true
  accessibility: false
  semantic: true
---

# canon-init

Generate a new Canon initiative folder with full lifecycle support.

## Purpose

Canon is the single source of truth. Every initiative in Canon follows the same structure. This action-doc enforces that structure by generating it, interviewing for the SOUL, validating the result, and registering the initiative.

It is itself a Canon folder. Meta-meta. The template that makes the templates.

## Usage

### Generate a new initiative

```bash
mx canon init generate "The-Handbook"
```

Creates:

```text
mx-canon/
└── MX-The-Handbook/
    ├── SOUL.md                  # From soul-template.md, ready for interview
    └── deliverables/
        ├── README.md            # Deliverables rules (enforced)
        ├── landing-page.html    # MX-flavoured starter
        ├── announcement.md      # MX-flavoured starter
        └── linkedin-promo.md    # MX-flavoured starter
```

### Interview to fill the SOUL

```bash
mx canon init interview mx-canon/MX-The-Handbook
```

Asks five questions. Maps answers to SOUL.md sections. Writes the completed SOUL.

### Validate the initiative

```bash
mx canon init validate mx-canon/MX-The-Handbook
```

Checks:

- SOUL.md exists and has required sections
- deliverables/README.md exists
- Every .md file has `version:` in frontmatter
- No version numbers in filenames
- No confidential information in deliverables

### Register in Canon

```bash
mx canon init register mx-canon/MX-The-Handbook --purpose "Practitioner guide" --status "Draft"
```

Adds a row to the Canon README.md Current Initiatives table.

### Full lifecycle (all four steps)

```bash
mx canon init generate "The-Handbook" --full
```

Runs generate, interview, validate, and register in sequence.

## The Five Interview Questions

When the interview action runs, it asks:

1. **What is it?** — One or two sentences. Plain language.
2. **How should it sound?** — Three to five adjectives for the voice.
3. **What problem does it solve?** — Pain first, then solution.
4. **What must it never do?** — Non-negotiable constraints.
5. **Closing line?** — One sentence that captures the essence.

These map directly to SOUL.md sections. The interview is the SOUL.

## Validation Rules

| Rule | Severity | What It Checks |
| --- | --- | --- |
| SOUL exists | Error | SOUL.md at initiative root |
| Deliverables README | Error | deliverables/README.md exists |
| Frontmatter version | Error | Every .md file has `version:` in YAML |
| No version in filename | Error | No -v1, -v2 patterns in filenames |
| SOUL sections | Warning | Required sections present in SOUL.md |
| Deliverables clean | Warning | No confidential info in deliverables/ |

## For AI Agents

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Initiative created successfully

Output:
  /Users/tom/Documents/MX/mx-canon/MX-The-Handbook/ (directory created)
  /Users/tom/Documents/MX/mx-canon/MX-The-Handbook/SOUL.md
  /Users/tom/Documents/MX/mx-canon/MX-The-Handbook/deliverables/ (directory created)
  /Users/tom/Documents/MX/mx-canon/MX-The-Handbook/deliverables/README.md
```

Not just "Initiative created" or "files generated" — the full absolute path of every file and directory created.

---

## Related

- [soul-template.md](soul-template.md) — The interview-driven SOUL template
- [Canon README](../README.md) — The Canon root
- [MX-The-Gathering](../MX-The-Gathering/) — First initiative, the reference implementation
