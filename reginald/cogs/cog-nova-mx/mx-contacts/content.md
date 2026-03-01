---
name: mx-contacts
version: "2.0"
description: Top-level management action-doc for MX Contacts — organises contacts, tracks status, reports priorities, and surfaces next actions
created: 2026-02-09
modified: 2026-02-09
author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published
category: mx-operations
partOf: mx-contacts
confidential: true

tags:
  - contacts
  - relationship-management
  - folder-structure
  - operations

builds-on:
  - what-is-a-cog
  - what-is-mx-os

execute:
  runtime: runbook
  command: mx contacts
  actions:
    - name: list
      description: List all contacts with their status and relationship type
      usage: Read each contact folder, parse the .cog.md file, return a summary table
      outputs:
        - name: contact-list
          type: string
          description: Table of contacts with name, relationship, status, and message count

    - name: restructure
      description: Reorganise mx-crm/contacts from flat cogs/messages folders into per-contact folders
      usage: >
        For each contact cog in cogs/:
        1. Create a folder named after the contact (e.g. michael-andrews/)
        2. Create messages/ subfolder inside it
        3. Create archive/ subfolder inside it
        4. Move the contact cog into the contact folder
        5. Move corresponding messages into the contact's messages/ folder
        6. Update file references in the cog (messages.file paths)
        7. Update file references in messages (recipient.cog paths)
        8. Update SOUL.md to reflect the new structure
        9. Remove empty cogs/ and messages/ directories
      outputs:
        - name: restructure-report
          type: string
          description: Summary of files moved and references updated

    - name: archive
      description: Move a completed message to its contact's archive folder
      usage: >
        Given a contact name and message filename:
        1. Move the message from contact/messages/ to contact/archive/
        2. Update the contact cog's messages array to reflect archived status
      outputs:
        - name: archive-confirmation
          type: string
          description: Confirmation of archived message with updated paths

    - name: add-contact
      description: Create a new contact folder with cog template and empty messages/archive folders
      usage: >
        Given a contact name:
        1. Create contact-name/ folder
        2. Create contact-name/messages/ subfolder
        3. Create contact-name/archive/ subfolder
        4. Create contact-name/contact-name.cog.md from template
      outputs:
        - name: new-contact
          type: string
          description: Path to the new contact cog

    - name: report
      description: Full status report across all contacts — name, relationship, message status, and next action
      usage: >
        For each contact folder:
        1. Read the contact cog
        2. Extract name, relationship, status, messages (with their status), and next-action
        3. Return a markdown table sorted by relationship type:
           | Name | Relationship | Status | Messages (draft/sent/replied/archived) | Next Action |
        4. Include a summary line: total contacts, total messages, how many sent, how many awaiting response
      outputs:
        - name: status-report
          type: string
          description: Full markdown status report with summary

    - name: priorities
      description: Show contacts ranked by urgency — who needs attention now
      usage: >
        For each contact folder:
        1. Read the contact cog
        2. Score urgency based on:
           - Messages still in draft = high (action needed from Tom)
           - Messages sent, awaiting response = medium (waiting)
           - Messages with status replied = high (Tom needs to act on reply)
           - All messages archived = low (relationship maintained)
           - next-action contains time words (this week, today, before) = boost priority
        3. Return a ranked list, highest priority first:
           | Priority | Name | Why | Next Action |
        4. Flag any contacts with stale status (no update in 7+ days)
      outputs:
        - name: priority-list
          type: string
          description: Ranked priority list with reasoning

    - name: next
      description: Show the single most important next task across all contacts
      usage: >
        1. Run the priorities action internally
        2. Return only the top item:
           - Who: contact name
           - What: the next-action from their cog
           - Why: why this is the highest priority
           - Context: one-line summary from the contact's context field
        3. If multiple items tie for top priority, list all tied items
      outputs:
        - name: next-task
          type: string
          description: The single most important next action with context

    - name: dashboard
      description: One-screen overview — contacts, messages, priorities, and next task combined
      usage: >
        Combine the output of list, report, priorities, and next into a single dashboard:
        1. Header: date, total contacts, total messages
        2. Priority section: top 3 priorities with reasoning
        3. Next task: highlighted at the top
        4. Full contact table: name, relationship, message status, next action
        5. Stale contacts: anyone with no update in 7+ days
      outputs:
        - name: dashboard
          type: string
          description: Combined one-screen overview of all contacts and actions

mx:
  contentType: "action-doc"
  runbook: "mx exec mx-contacts"
  semantic: true
  convergence: true
  accessibility: true
---

# MX Contacts Management

**One folder per person. Messages underneath. Archive when done.**

## Folder Structure

```
mx-crm/contacts/
├── SOUL.md                         # Initiative identity
├── mx-contacts.cog.md             # This action-doc (management)
├── contact-name/
│   ├── contact-name.cog.md        # The person — metadata + narrative
│   ├── messages/                   # Active correspondence
│   │   └── message-contact-name.md
│   └── archive/                    # Completed correspondence
```

## Design Principles

1. **One folder per person** — The contact cog and all their correspondence live together.
2. **Messages are children** — Messages belong to the contact, not to a flat pool.
3. **Archive is local** — Completed messages move to the contact's own archive, not a shared bin.
4. **References are relative** — Cogs reference `messages/filename.md`, messages reference `../contact-name.cog.md`.
5. **SOUL.md governs** — All constraints from SOUL.md apply within every contact folder.

## Why This Structure

The flat `cogs/` and `messages/` folders worked for six contacts. They will not work for sixty. Per-contact folders:

- Keep everything about a relationship in one place
- Make it obvious which messages belong to which contact
- Support archiving without losing context
- Scale naturally as relationships grow

---

## For AI Agents

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Contact added successfully

Output:
  /Users/tom/Documents/MX/mx-crm/contacts/michael-andrews/michael-andrews.cog.md
  /Users/tom/Documents/MX/mx-crm/contacts/michael-andrews/messages/ (directory created)
  /Users/tom/Documents/MX/mx-crm/contacts/michael-andrews/archive/ (directory created)
```

Not just "Contact added" or "michael-andrews folder created" — the full absolute path of every file and directory created.
