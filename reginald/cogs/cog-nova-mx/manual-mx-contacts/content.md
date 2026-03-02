---
name: manual-mx-contacts
title: MX Contacts — Manual
description: Step-by-step guide for managing contacts, messages, and archives in mx-crm.
version: "1.0"
status: active
created: 2026-02-09T00:00:00.000Z
modified: 2026-02-13T00:00:00.000Z
author: Tom Cranstoun and Maxine
category: manual
tags:
  - manual
  - contacts
  - messages
  - archive
partOf: mx-maxine-lives
audience: operators
purpose: Document mx contacts - usage, workflow, and best practices
audience: human
stability: stable
runbook: Read when working with mx contacts or understanding its functionality
contextProvides:
  - Step-by-step guide for managing contacts, messages, and archives in mx-crm.
  - Usage guide and workflow for mx contacts
  - Troubleshooting and best practices
refersTo: []
---

# MX Contacts Manual

**How to use the contact management system. For Tom, Maxine, or any AI agent.**

---

## Quick Reference

| Task | What to say |
|------|-------------|
| Add a contact | "Add a new contact for [name]" |
| Write a message | "Write a message to [name] about [topic]" |
| Archive a message | "Archive the [name] message" |
| List all contacts | "List all contacts with status" |
| Check a contact | "Show me [name]'s contact cog" |

---

## The Structure

```
mx-crm/contacts/
├── contacts-soul.md                 # Rules — read this first
├── how-i-work.md                   # Worked example for investors
│
├── janus-boye/                     # One folder per person
│   ├── janus-boye.cog.md          # The person
│   ├── messages/                   # Active correspondence
│   │   └── message-janus-boye.md
│   └── archive/                    # Completed correspondence
│
├── michael-andrews/
│   ├── michael-andrews.cog.md
│   ├── messages/
│   │   └── message-michael-andrews.md
│   └── archive/
│
└── ... (one folder per contact)
```

**Three levels**: contact folder > contact cog + messages/ + archive/.

---

## Adding a New Contact

### Step 1: Create the folder structure

```
new-contact-name/
├── new-contact-name.cog.md
├── messages/
└── archive/
```

The folder name matches the cog name. Always lowercase, hyphenated.

### Step 2: Write the contact cog

Use this template:

```yaml
---
name: firstname-lastname
type: contact
description: One-line summary of who they are
relationship: advisor | partner | family | collaborator | prospect
status: active | pending | dormant
organisation: Where they work (optional)
role: Their role if relevant to MX (optional)
context: >
  Why this person matters to MX. What they bring.
  What the current state of the relationship is.
messages: []
next-action: What happens next with this person
---

# Firstname Lastname

Human-readable narrative about the relationship.

## Relationship

How they relate to MX. Personal, professional, or both.

## What we want from them

Specific asks or goals for this relationship.

## History

- Date: Event or action taken
```

### Step 3: Required fields

| Field | Required | Values |
|-------|----------|--------|
| `name` | Yes | lowercase-hyphenated |
| `type` | Yes | always `contact` |
| `description` | Yes | one line |
| `relationship` | Yes | advisor, partner, family, collaborator, prospect |
| `status` | Yes | active, pending, dormant |
| `context` | Yes | narrative, any length |
| `messages` | Yes | array (can be empty `[]`) |
| `next-action` | Yes | what happens next |
| `organisation` | No | where they work |
| `role` | No | their formal role if relevant |

---

## Writing a Message

### Step 1: Create the message file

Place it in the contact's `messages/` folder:

```
contact-name/messages/message-contact-name.md
```

If there are multiple messages, name them descriptively:

```
contact-name/messages/message-contact-name-briefing.md
contact-name/messages/message-contact-name-followup.md
```

### Step 2: Write the message metadata

Minimum metadata:

```yaml
---
title: "Message to Firstname Lastname"
version: "1.0"
status: draft
created: 2026-02-09
modified: 2026-02-09
author: Tom Cranstoun
type: direct-message | personal-message
platform: email | linkedin | email-or-linkedin | in-person-or-email
---
```

Rich metadata (for important contacts — see Michael Andrews example):

```yaml
---
title: "Direct Message — Firstname Lastname (Purpose)"
version: "1.0"
status: draft
created: 2026-02-09
modified: 2026-02-09
author: Tom Cranstoun
type: direct-message
platform: email
category: outreach
confidential: true

recipient:
  name: Firstname Lastname
  expertise: their-field
  relationship: collaborator
  cog: ../contact-name.cog.md

purpose: What this message is about in one sentence
audience: who-will-read-this
readingLevel: expert | general

tags:
  - topic-one
  - topic-two

refersTo:
  - cog-name-one
  - cog-name-two

thread:
  sequence: 1
  next-action: What happens after sending
  expected-outcome: What we hope to get back

mx:
  semantic: true
  convergence: true
  accessibility: true
---
```

### Step 3: Register the message in the contact cog

Add an entry to the contact's `messages:` array:

```yaml
messages:
  - file: messages/message-contact-name.md
    date: 2026-02-09
    type: full-briefing
    status: draft
    note: Short description of what this message contains.
```

**Message status values**: `draft`, `sent`, `replied`, `archived`

---

## Archiving a Message

When a message has served its purpose — sent, replied to, conversation complete:

### Step 1: Move the file

From `contact-name/messages/` to `contact-name/archive/`:

```
michael-andrews/messages/message-michael-andrews.md
  → michael-andrews/archive/message-michael-andrews.md
```

### Step 2: Update the contact cog

Change the `file:` path and `status:` in the messages array:

```yaml
messages:
  - file: archive/message-michael-andrews.md
    date: 2026-02-09
    type: pre-call-briefing
    status: archived
    note: Pre-call briefing sent. Zoom call completed.
```

### Step 3: Update the note

Add what happened — the outcome, not just the action:

```yaml
    note: Pre-call briefing sent. Zoom call held 15 Feb. Michael supports companion web framing.
```

---

## Updating Contact Status

When the relationship state changes, update the cog immediately.

| Status | Meaning |
|--------|---------|
| `active` | Ongoing engagement, recent communication |
| `pending` | Waiting — message sent but no reply, or outreach planned |
| `dormant` | No current activity, relationship exists but quiet |

Also update `next-action:` to reflect the current state:

```yaml
status: active
next-action: Schedule follow-up call for March
```

---

## Naming Conventions

| Item | Pattern | Example |
|------|---------|---------|
| Contact folder | `firstname-lastname/` | `michael-andrews/` |
| Contact cog | `firstname-lastname.cog.md` | `michael-andrews.cog.md` |
| Message file | `message-firstname-lastname.md` | `message-michael-andrews.md` |
| Named message | `message-firstname-lastname-topic.md` | `message-michael-andrews-followup.md` |

**Rules**:

- Always lowercase
- Always hyphenated (no spaces, no underscores)
- Folder name matches cog name (without extension)
- No version numbers in filenames — versions live in YAML frontmatter

---

## File References

All paths in metadata are **relative to the cog that contains them**.

| From | To | Path |
|------|----|------|
| Contact cog | Its message | `messages/message-name.md` |
| Contact cog | Its archived message | `archive/message-name.md` |
| Message | Its contact cog | `../contact-name.cog.md` |

Never use absolute paths. Never reference across contact folders.

---

## Confidentiality Rules

Everything in mx-crm is **confidential by default**.

- Contact cogs contain relationship details, strategy notes, and personal context
- Messages contain correspondence content
- Advisory board members are identified by name internally but **never by advisor number** in anything that might be shared
- Nothing from this folder appears in Gathering deliverables, public websites, or marketing materials
- The `how-i-work.md` document is marked confidential — investor-only

---

## The Action-Cog Operations

The `mx-contacts.cog.md` action-doc defines four operations any AI agent can execute:

### `list`

Read every contact folder, parse the cog, return a summary table with name, relationship, status, and message count.

### `add-contact`

Given a name: create the folder, create `messages/` and `archive/` subfolders, create the contact cog from template.

### `archive`

Given a contact name and message filename: move the message to archive/, update the cog's message reference and status.

### `restructure`

One-time operation. Already executed 9 Feb 2026. Converted from flat `cogs/` + `messages/` structure to per-contact folders. Retained for historical reference.

---

## Current Contacts

| Name | Relationship | Status | Messages |
|------|-------------|--------|----------|
| Michael Andrews | collaborator | active | 1 (pre-call briefing) |
| Janus Boye | mentor | active | 1 (full briefing) |
| Scott McGregor | partner | active | 1 (full briefing) |
| Helen | advisor | active | 1 (briefing + Q&A) |
| Eleanor Cranstoun | family | active | 1 (director briefing) |
| OpenClaw Developer | prospect | pending | 1 (outreach) |

---

*People are not leads. They are relationships. Track them with respect.*
