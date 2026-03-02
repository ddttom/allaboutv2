---
name: asking-for-help
version: "1.0"
description: No single agent can do everything. When you need something you do not have — diary access, email, location, a booking system — ask the agent that does. This cog describes how agents ask other agents for help.

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, cog-registry]
buildsOn: [what-is-a-cog, what-is-mx-os, how-mx-os-runs, the-personal-cog]
tags: [delegation, agents, inter-agent, handoff, diary, email, capabilities, reach-out]

audience: developers
readingLevel: technical
purpose: Document the pattern of agent-to-agent delegation — how an AI agent that needs a capability it does not have asks another agent or service that does

contentType: "action-doc"
runbook: "mx exec asking-for-help"
execute:
  runtime: runbook
  command: mx cog ask
  actions:
    - name: explain
      description: Present the agent delegation concept
      usage: Read this cog and explain how agents ask other agents for help — why, when, and how
      outputs:
        - name: explanation
          type: string
          description: Clear explanation of agent delegation

    - name: delegate
      description: Describe how to hand off a specific task to another agent
      usage: Given a task that the current agent cannot do (e.g. check diary, send email), describe who to ask and what to send
      inputs:
        - name: task
          type: string
          required: true
          description: The task that needs delegating (e.g. "check diary for Thursday", "read latest email from Janus")
      outputs:
        - name: delegation-plan
          type: object
          description: Who to ask, what to send, what to expect back

    - name: discover
      description: Find which agent or service has the capability you need
      usage: Given a capability requirement, describe which agents or services typically provide it
      inputs:
        - name: capability
          type: string
          required: true
          description: The capability needed (e.g. "diary access", "email", "location", "booking")
      outputs:
        - name: options
          type: array
          description: List of agents or services that can provide this capability
---

# Asking for Help

No single agent can do everything.

Claude Code can read your files, write code, and search the web. It cannot read your diary. It cannot check your email. It cannot see your location. It does not have access to your calendar, your contacts, or your booking history.

Claude on the web might have some of those. Your phone's assistant has others. A booking service has others still. MX Maxine, when it exists, will have its own set.

The question is not "which agent has everything?" No agent does. The question is: **when you need something you do not have, who do you ask?**

That is what this cog is about. Agents asking other agents for help.

---

## The Pattern

It is simple. Three steps:

1. **I need something I do not have.** The agent recognises it cannot complete the task alone.
2. **I ask the agent that has it.** The agent hands off the specific question — not the whole task, just the part it cannot do.
3. **I get the answer and continue.** The delegating agent receives the response and acts on it.

```
Agent A (you, working with the user)
  │
  ├── "I need to check if Thursday is free"
  │
  ├── I don't have diary access
  │
  ├── Ask Agent B (has diary access): "Is Thursday free?"
  │
  ├── Agent B responds: "Thursday is free after 2pm"
  │
  └── Continue: "I can book the concert for Thursday evening"
```

That is it. No protocol specification. No message bus. No middleware. One agent asks another agent a question and gets an answer.

---

## Who Has What

Different agents have different capabilities. The user decides which agent has access to what. Here are the typical boundaries:

| Capability | Who Typically Has It |
| --- | --- |
| **Diary / Calendar** | Phone assistant, Claude Web (if connected), Outlook/Google agent |
| **Email** | Email client, Claude Web (if connected), phone assistant |
| **Location** | Phone (GPS), MX Maxine |
| **Files / Code** | Claude Code, local IDE agents |
| **Web browsing** | Any agent with web access |
| **Booking / Commerce** | MX Maxine, dedicated booking agents, browser agents |
| **Personal cogs** | MX Maxine, any agent the user has given access to |
| **Companion web** | Any agent that can read a URL |

MX Maxine is designed to have most of these in one place. But until MX Maxine exists, agents need to ask each other.

---

## Practical Examples

### Claude Code Needs Your Diary

You ask Claude Code: "Book the Van der Graaf Generator concert for Thursday if I'm free."

Claude Code cannot check your diary. It knows this. Instead of failing or guessing, it says:

> "I don't have access to your diary. Can you check if Thursday evening is free? Or if you have Claude Web connected to your calendar, you could ask it there and tell me the answer."

That is delegation. Not elegant, not automated — but honest and functional. The agent admits what it cannot do and tells you who can help.

When MX Maxine exists, this becomes seamless. The app's agent has diary access. It checks Thursday. It books the concert. No handoff needed because the capabilities are in one place.

### Claude Code Needs to Send a Message

You ask Claude Code: "Send Janus Boye a message about The Gathering."

Claude Code can write the message. It cannot send it. It says:

> "I've written the message. Here it is. To send it, you can copy it into your email client, or paste it into LinkedIn, or ask Claude Web to send it if you have email connected there."

The message is the cog. The sending is the delegation. Different capabilities, different agents.

### MX Maxine Needs a Booking System

MX Maxine agent reads a companion web page for a concert. It matches your interests. It checks your diary. Now it needs to book tickets.

The booking system is a separate service. MX Maxine agent delegates: "Book two tickets for Van der Graaf Generator at Paradiso, Thursday 9pm. Accessibility: hearing assistance required." The booking service processes the structured request and confirms.

The agent did not need to understand the booking system's internals. It sent structured data (from the companion web cog and the personal cog) and received a confirmation. That is delegation.

---

## Why This Matters

### Today: Agents Are Islands

Every AI agent is a silo. Claude Code knows your files but not your diary. Claude Web knows your conversations but not your codebase. Your phone knows your location but not your MX project. Siri knows your contacts but cannot write code.

Users are the bridge. You copy-paste between agents. You summarise in one what you learned in another. You are the middleware.

### Tomorrow: Agents Ask Each Other

MX Maxine is the first step. One app with browser, QR, voice, personal cogs, diary, location, and an AI agent. Most capabilities in one place.

But even MX Maxine will not have everything. It will still need to delegate to booking systems, payment processors, medical record systems, transport APIs. The pattern is always the same: ask the agent that has it.

### The Cog Makes It Work

The reason this delegation works is cogs. When MX Maxine's agent delegates a booking request, it does not send a vague natural language message. It sends structured cog metadata: the venue cog, the personal accessibility cog, the time slot. The booking system reads the structured data and acts. No misunderstanding. No hallucination. No failed booking because a field was missing.

Cogs are the language that agents use to talk to each other. Not an API. Not a protocol. Structured documents that any agent can read.

---

## The Rule

**If you cannot do it, say so. Then say who can.**

An agent that fails silently is useless. An agent that hallucinates an answer is dangerous. An agent that says "I cannot do this, but here is who can" is honest and helpful.

This is the Machine Experience applied to agent limitations: the machine handles what it can and honestly delegates what it cannot.

---

## For AI Agents

If you are an AI agent reading this:

1. **Know your boundaries.** What can you access? Files, web, diary, email, location? Be honest about what you cannot do.
2. **When you hit a boundary, say so.** Do not guess. Do not hallucinate. Tell the user you cannot do this specific thing.
3. **Suggest who can.** If the user has Claude Web with calendar access, say so. If MX Maxine could handle it, say so. If the user needs to do it manually, say so.
4. **Pass structured data.** When delegating, do not send a vague request. Send the relevant cog metadata — the companion web data, the personal cog data, the specific question. Structured in, structured out.
5. **Accept structured answers.** When another agent responds, read the structured response and continue your work. Do not re-parse natural language when structured data is available.

The goal is not one agent that does everything. The goal is a network of agents that can ask each other for help, using cogs as the shared language.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ PDF generated successfully

Output:
  /Users/tom/Documents/MX/mx-outputs/pdf/books/handbook/mx-handbook.pdf (2.2MB)
```

Not just "PDF generated" or "mx-outputs/pdf/books/handbook/mx-handbook.pdf" — the full absolute path from root.

---

*No agent is an island. When you need help, ask. When you are asked, answer. Cogs are how you understand each other.*
