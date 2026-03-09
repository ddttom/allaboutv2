---
version: "1.0"
description: How to build action-docs — from description to working tool. Describe, create, test, wire. The pattern that turns natural language into MX OS applications.

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-contacts, mx-principles]
  buildsOn: [what-is-a-cog, what-is-mx-os, how-mx-os-runs]
  tags: [development, lifecycle, operational, entry-points, scaffold, tutorial, worked-example, mx-contacts]

  audience: tech
  readingLevel: advanced

  execute:
    runtime: runbook
    command: mx cog build
    actions:
      - name: explain
        description: Present the operational action-doc development lifecycle
        usage: Read this cog and explain the four-phase lifecycle (describe, create, test, wire) with the MX-Contacts worked example
        outputs:
          - name: explanation
            type: string
            description: Clear explanation of how to build operational action-docs

      - name: scaffold
        description: Create a new operational action-doc with entry point wiring
        usage: >
          Given a domain name (e.g. "finances", "content", "outreach"):
          1. Create an action-doc file with YAML frontmatter matching the cog-unified-spec
          2. Include an execute block with runtime: runbook
          3. Add standard actions: list, report, priorities, next, dashboard
          4. Add domain-specific actions based on the human's description
          5. Create the entry point configuration for the host platform
          6. Register the entry point in the boot sequence
          7. Return the file paths created
        inputs:
          - name: domain
            type: string
            required: true
            description: The domain this action-doc manages (e.g. "contacts", "finances", "content")
          - name: description
            type: string
            required: true
            description: Natural language description of what the action-doc should do
        outputs:
          - name: files-created
            type: array
            description: Paths to all files created (action-doc, entry point config, skill file)

      - name: wire
        description: Add entry point and boot registration for an existing action-doc
        usage: >
          Given a path to an existing action-doc:
          1. Read the action-doc to understand its actions
          2. Create the entry point configuration for the host platform
          3. Register the entry point in the boot sequence
          4. Return the wiring summary
        inputs:
          - name: cog-path
            type: string
            required: true
            description: Path to the action-doc to wire up
        outputs:
          - name: wiring-report
            type: string
            description: Summary of entry point and boot registration created

  contentType: "action-doc"
  runbook: "mx exec building-action-docs"
  semantic: true
  convergence: true
  accessibility: true
---

# Building Action-Cogs

How to go from "I need a tool for X" to a working, discoverable, invocable action-doc. The complete development lifecycle.

---

## The Insight

MX-Contacts was built with zero code. No database. No application server. No programming language. One human described what they needed. One AI agent created an action-doc with eight actions. The human tested it, asked "how do I use this from anywhere?", and the agent wired up an entry point.

The result: a fully operational contact management system built from markdown files and YAML metadata.

This is not an accident. This is the MX OS development model.

---

## The Four Phases

```
┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│  DESCRIBE  │───▶│  CREATE   │───▶│   TEST    │───▶│   WIRE    │
│            │    │           │    │           │    │           │
│  Human     │    │  AI agent │    │  Human +  │    │  AI agent │
│  says what │    │  writes   │    │  AI run   │    │  creates  │
│  they need │    │  the cog  │    │  actions  │    │  entry    │
│            │    │           │    │           │    │  points   │
└───────────┘    └───────────┘    └───────────┘    └───────────┘
```

### Phase 1: Describe

The human describes what they need in natural language. No specification document. No requirements template. Just language.

**Example:** "I need to manage contacts — track who I have messaged, what the status is, who needs attention next, and get a dashboard of everything."

The description does not need to be precise. The AI agent asks clarifying questions. The human refines. This is a conversation, not a contract.

### Phase 2: Create

The AI agent creates an action-doc:

1. **YAML frontmatter** — name, description, category, tags, builds-on, execute block
2. **Actions** — each action has a name, description, usage (the instructions), inputs, and outputs
3. **Runtime** — `runbook` for most operational action-docs (the AI agent IS the executor)
4. **Body** — markdown explaining the system for human readers

The `usage` field in each action is the key. It is a natural language instruction that any AI agent can follow. Not pseudocode. Not an API signature. Just clear instructions.

```yaml
execute:
  runtime: runbook
  actions:
    - name: dashboard
      description: One-screen overview of everything
      usage: >
        Combine list, report, priorities, and next into a single dashboard:
        1. Header: date, total contacts, total messages
        2. Priority section: top 3 priorities with reasoning
        3. Next task: highlighted at the top
        4. Full contact table: name, relationship, message status, next action
```

### Phase 3: Test

The human invokes an action. The AI agent reads the action-doc, follows the usage instructions, reads the actual data, and produces output.

Testing is immediate. There is no build step. There is no compilation. There is no deployment. The action-doc exists as a file. The AI agent reads it and executes.

If the output is wrong, the human says so. The AI agent adjusts the action-doc. Test again. This cycle is measured in seconds, not hours.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ PDF generated successfully

Output:
  /Users/tom/Documents/MX/mx-outputs/pdf/books/handbook/mx-handbook.pdf (2.2MB)
```

Not just "PDF generated" or "mx-outputs/pdf/books/handbook/mx-handbook.pdf" — the full absolute path from root.

### Phase 4: Wire

The action-doc works. But it only works when the human is in the right folder, in the right session, with the right context. The wiring phase solves three problems:

1. **Entry point** — How does a human invoke this from anywhere?
2. **Discovery** — How does a human know this exists?
3. **Context** — How does the AI agent find the action-doc without the human pointing to it?

---

## Entry Points

An entry point is a platform-specific mechanism that routes a human's request to an action-doc. The concept is generic. The implementation depends on the AI platform.

### The Pattern

Every operational action-doc needs:

| Component | What it does | OS Analogy |
| --- | --- | --- |
| **The action-doc** | Defines actions and usage instructions | The executable binary |
| **The entry point** | Routes human requests to the action-doc | Desktop shortcut / Start Menu entry |
| **Boot registration** | Advertises the action-doc as available | Installed applications list |

### Platform Implementations

The entry point looks different on every platform, but the pattern is the same:

| Platform | Entry Point Mechanism | Boot Mechanism |
| --- | --- | --- |
| Claude Code | Skill file (`.claude/skills/`) | `/mx-boot` skill lists it |
| Claude Web | System prompt instruction | Prompt mentions available tools |
| ChatGPT | Custom GPT instructions | Instructions list available commands |
| Any AI chat | Paste the action-doc into context | Tell the agent what is available |
| Script runner | Shell alias or npm script | Package.json scripts section |

The action-doc itself is universal. The entry point adapts to the platform. This is why the pattern is described generically in the specification — **every action-doc needs a human-facing entry point** — while the implementation details live in platform-specific guides.

### What Entry Points Do

An entry point:

1. **Reads the action-doc** — fresh, every time. Never cached.
2. **Reads the SOUL.md** — for voice, constraints, and confidentiality rules.
3. **Parses the human's request** — maps natural language to an action name.
4. **Follows the usage instructions** — executes the action as defined in the action-doc.

The entry point is thin. It is a router, not a program. The action-doc is the program.

---

## The Worked Example: MX-Contacts

### What was built

A contact management system with six contacts, per-contact folders, message tracking, archiving, priorities, and a dashboard.

### The files

```
MX-Contacts/
├── SOUL.md                              # Folder identity
├── mx-contacts.cog.md                   # The action-doc (8 actions)
├── michael-andrews/
│   ├── michael-andrews.cog.md          # Contact data
│   ├── messages/
│   │   └── message-michael-andrews.md  # Correspondence
│   └── archive/                         # Completed messages
├── janus-boye/
│   └── ...
└── [4 more contacts]
```

### The action-doc actions

| Action | What it does |
| --- | --- |
| `list` | Table of all contacts with status |
| `report` | Full status report with message counts |
| `priorities` | Ranked urgency list — who needs attention |
| `next` | Single most important task |
| `dashboard` | One-screen overview of everything |
| `add-contact` | Create new contact folder from template |
| `archive` | Move completed message to archive |
| `restructure` | Reorganise folder structure |

### The development timeline

1. **Describe**: "Contacts ought to be folderised by contact name with messages in a folder underneath with an archive folder for completed ones."
2. **Create**: AI created `mx-contacts.cog.md` with four initial actions. Restructured six contacts from flat folders to per-contact hierarchy.
3. **Test**: Ran the dashboard action. Output was correct. Added four more actions (report, priorities, next, dashboard).
4. **Wire**: Created an entry point and registered it in boot. The action-doc is now invocable from any folder, any session, without prior context.

Total time from description to working system: one conversation.

### What was NOT needed

- No code was written
- No database was created
- No application server was deployed
- No API was designed
- No tests were written (the actions are self-testing — wrong output is immediately visible)
- No deployment pipeline was configured

The metadata is the application.

---

## Standard Actions

Operational action-docs tend to need the same core actions. When scaffolding a new one, start with these:

| Action | Purpose | Pattern |
| --- | --- | --- |
| `list` | Show everything | Read all items, present a table |
| `report` | Full status report | Read all items, extract status + metadata, summarise |
| `priorities` | Ranked urgency | Score items by urgency criteria, rank, present top items |
| `next` | Single next task | Run priorities internally, return top item with context |
| `dashboard` | One-screen overview | Combine list + report + priorities + next |
| `add` | Create new item | Create from template with required structure |
| `archive` | Complete an item | Move to archive, update references |

Not every action-doc needs all of these. But most operational action-docs benefit from `list`, `report`, and `dashboard` at minimum.

---

## The Development Model

Traditional software development:

```
Requirements → Design → Code → Test → Deploy → Operate
(weeks to months)
```

MX OS development:

```
Describe → Create → Test → Wire
(minutes to hours)
```

The difference is not just speed. The difference is who does the work.

In traditional development, humans write code. Machines run it. In MX OS development, humans describe intent. AI agents write the program (the action-doc). The same AI agents run it.

There is no build step because action-docs are not compiled. There is no deployment step because action-docs are files. There is no operations team because the AI agent that created the system is the same agent that operates it.

**The development model IS the operational model.**

---

## For AI Agents: How to Scaffold

If a human asks you to build an operational action-doc:

1. **Interview**: Ask what domain, what actions, what data exists. Keep it short — three to five questions.
2. **Create the action-doc**: YAML frontmatter with execute block, actions with usage instructions, markdown body with explanation.
3. **Create supporting structure**: Folders, templates, SOUL.md if needed.
4. **Test immediately**: Run the dashboard or list action on real data.
5. **Wire up**: Create the entry point for the current platform. Register in boot.
6. **Register**: Add the action-doc to the cog-registry if it is a core system tool.

The scaffold action in this action-doc automates steps 2-5.

---

## Why This Matters

Every organisation has operational patterns that live in spreadsheets, Notion databases, Trello boards, and people's heads. None of these are machine-readable. None of these survive a session boundary.

An operational action-doc captures the pattern in a format that any AI agent can read and execute. The pattern survives across sessions, across platforms, across agents. It is a file. It works everywhere files work.

The human describes what they need. The AI builds it. The AI runs it. The human gets the dashboard.

**That is the pitch.**

---

*Describe what you need. The machine builds the system.*
