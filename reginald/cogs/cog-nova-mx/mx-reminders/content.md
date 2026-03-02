---
name: mx-reminders
version: "1.0.0"
description: "Manages persistent reminders across sessions. Reads, writes, and prioritises action items in REMINDERS.md."

created: 2026-02-10
modified: 2026-02-10

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
buildsOn: [what-is-a-cog, what-is-mx-os]
tags: [reminders, tasks, persistence, session, productivity, mx-os]

audience: both
readingLevel: non-technical
purpose: Keep action items visible across sessions so nothing falls through the cracks

contentType: "action-doc"
runbook: "mx exec mx-reminders"
execute:
  runtime: runbook
  command: mx reminders
  actions:
    - name: list
      description: Show all active (incomplete) reminders
      usage: |
        Read REMINDERS.md from the repository root. Parse the "Active" section.
        Present each unchecked item (`- [ ]`) with its description and date added.
        If there are no active reminders, say "No active reminders."
        Do not show completed items unless explicitly asked.
      inputs: []
      outputs:
        - name: reminders
          type: array
          description: Active reminder items with descriptions and dates

    - name: add
      description: Add a new reminder to REMINDERS.md
      usage: |
        Open REMINDERS.md at the repository root.
        Append a new item to the "Active" section in this format:
          - [ ] **Short title** — Description of what needs doing. *(added: YYYY-MM-DD)*
        Use today's date. Keep the title short (3-8 words). The description should be
        specific enough that a future AI agent or human understands what to do without
        further context.
        Save the file. Do not modify any other items.
      inputs:
        - name: title
          type: string
          required: true
          description: Short title for the reminder (3-8 words)
        - name: description
          type: string
          required: true
          description: What needs to be done, with enough context to act on later
      outputs:
        - name: reminder
          type: object
          description: The newly added reminder

    - name: complete
      description: Mark a reminder as done and move it to the Completed section
      usage: |
        Open REMINDERS.md at the repository root.
        Find the matching reminder in the "Active" section.
        Change `- [ ]` to `- [x]` and append *(completed: YYYY-MM-DD)*.
        Move the item from the "Active" section to the top of the "Completed" section.
        If "Completed" section says "*None yet.*", remove that line first.
        Save the file.
      inputs:
        - name: reminder
          type: string
          required: true
          description: The title or enough text to identify the reminder to complete
      outputs:
        - name: completed
          type: object
          description: The completed reminder with completion date

    - name: prioritise
      description: Reorder active reminders by priority
      usage: |
        Open REMINDERS.md at the repository root.
        Read all items in the "Active" section.
        Present them to the user and ask which order they should be in.
        Rewrite the "Active" section with items in the new order.
        The first item is highest priority. Do not change any item text — only reorder.
        Save the file.
      inputs: []
      outputs:
        - name: reminders
          type: array
          description: Reminders in new priority order
---

# MX Reminders

Every session generates action items. Some get done immediately. Some need to wait — for a future session, for a decision, for external input. Without a persistent place to put them, they vanish.

REMINDERS.md is that place. It sits at the repository root, has YAML frontmatter (so AI agents can read the metadata), and holds a simple checklist of things to do.

This action-doc manages it.

---

## How It Works

**REMINDERS.md** is an info-doc at the repository root. It has two sections:

- **Active** — unchecked items (`- [ ]`) that need attention
- **Completed** — checked items (`- [x]`) that are done

AI agents read REMINDERS.md at session start (it's in the bootloader). Active reminders surface immediately so nothing is forgotten.

---

## The Four Actions

### `list` — What needs doing?

Read the Active section. Show each reminder with its title, description, and date. This is the first thing an agent does when reminders exist.

### `add` — Remember this for later

Append a new item to Active. Every reminder gets a short bold title, a description with enough context to act on later, and the date it was added. If you are not going to do something now, add it here.

### `complete` — Done

Mark an item as complete. Change the checkbox, add the completion date, move it to Completed. The history stays — you can see what was done and when.

### `prioritise` — What matters most?

Reorder the Active list. The first item is the most important. Ask the human which order they want. Do not guess priorities — ask.

---

## When to Use This

- End of a session: "We said we'd review X later" — add a reminder
- Start of a session: Read REMINDERS.md, surface active items
- During work: "This needs doing but not now" — add a reminder
- Cleanup: Complete items that are done, prioritise what remains

---

## Convention

REMINDERS.md follows the same pattern as SOUL.md, PRINCIPLES.md, and INSTALLME.md — a root-level file with YAML frontmatter that AI agents read as part of their context. It is an info-doc managed by this action-doc.

The format is deliberately simple. A checklist. Nothing more.

---

*"Don't forget. Write it down."*
