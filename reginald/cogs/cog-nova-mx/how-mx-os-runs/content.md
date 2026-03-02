---
name: how-mx-os-runs
version: "1.0"
description: The MX OS runtime model. How an AI agent boots, discovers cogs, routes tasks, executes action-docs, and chains actions through invokes. The operating system explained from the inside.

created: 2026-02-09
modified: 2026-02-10

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, cog-registry, mx-principles]
buildsOn: [what-is-a-cog, what-is-mx-os, cog-registry, what-is-mx-environment]
tags: [runtime, boot-sequence, routing, execution, kernel, shell, invokes, ipc, mx-os, sop-agent, entry-points]

audience: developers
readingLevel: technical
purpose: Document how MX OS actually runs — the boot sequence, discovery, routing, execution, and inter-cog communication that make the system work

contentType: "action-doc"
runbook: "mx exec how-mx-os-runs"
execute:
  runtime: runbook
  command: mx cog runtime
  actions:
    - name: explain
      description: Present the MX OS runtime model to any audience
      usage: Read this cog and explain the five-layer runtime stack, using the boot sequence and ASCII diagrams
      outputs:
        - name: explanation
          type: string
          description: Clear explanation of the MX OS runtime

    - name: boot
      description: Execute the MX OS boot sequence for this session
      usage: Read cog-registry.cog.md (know what programs exist) and what-comes-next.cog.md (know current priorities). Report what was loaded.
      invokes: [cog-registry.list, what-comes-next.brief]
      outputs:
        - name: boot-report
          type: object
          description: Summary of what the agent now knows after booting

    - name: route
      description: Given a task description, find the right cog to handle it
      usage: Read the registry, match the task against cog metadata (category, tags, audience, description), and recommend which cog to read
      inputs:
        - name: task
          type: string
          required: true
          description: What the user wants to do
      invokes: [cog-registry.search]
      outputs:
        - name: recommendation
          type: object
          description: The recommended cog(s) to read, with reasoning

    - name: diagnose
      description: Check the health of the MX OS runtime — are all layers working?
      usage: Verify bootloader (CLAUDE.md exists), registry (cog-registry.cog.md readable), SOULs (root SOUL.md exists), builds-on graph (no broken references)
      invokes: [cog-registry.validate]
      outputs:
        - name: health-report
          type: object
          description: Health status of each runtime layer
---

# How MX OS Runs

This cog explains the runtime model of MX OS. Not what MX OS is — that is in `what-is-mx-os`. This is how it works. The mechanisms. The boot sequence. The execution model. The wiring.

If you are an AI agent and you want to understand how to operate within MX OS, this is your systems manual.

---

## The Runtime Stack

```
┌─────────────────────────────────────────────────┐
│  0. Machine Boot                                │
│  $MX_HOME (~/.mx/)                              │
│  machine.yaml, repos.yaml, user.yaml           │
│  "Know the universe before you know the repo."  │
├─────────────────────────────────────────────────┤
│  1. Bootloader                                  │
│  CLAUDE.md / system config                      │
│  Always-on. Lightweight pointer.                │
│  "MX OS exists. Here is how to initialise."     │
├─────────────────────────────────────────────────┤
│  2. Init                                        │
│  /mx-boot or equivalent                         │
│  Once per session. Reads:                       │
│  • cog-registry.cog.md (program index)          │
│  • what-comes-next.cog.md (current state)       │
│  After init: agent knows the OS.                │
├─────────────────────────────────────────────────┤
│  3. Routing                                     │
│  Routing action-doc / registry metadata          │
│  Maps "do X" to "read cog Y"                    │
│  Uses category, tags, audience, description     │
├─────────────────────────────────────────────────┤
│  4. Execution                                   │
│  The AI agent (kernel + shell)                  │
│  runbook: read and follow                     │
│  bash/node/python: use tools to run             │
│  The agent IS the universal runtime.            │
├─────────────────────────────────────────────────┤
│  5. IPC (invokes)                               │
│  Action-docs calling action-docs                  │
│  invokes: field in execute block                │
│  Agent follows the chain sequentially           │
└─────────────────────────────────────────────────┘
```

---

## Layer 0: Machine Boot

Before the repo bootloader loads, MX OS checks for machine-level context. If `$MX_HOME` is set (typically `~/.mx/`), the agent reads three files:

1. **machine.yaml** — What hardware and OS. Hostname, architecture, role (development, CI, production). The agent adjusts expectations: this is a developer laptop, not a build server.
2. **repos.yaml** — What MX-aware repositories exist on this machine. Paths, descriptions, capabilities. The agent knows the universe of repos before it reads one.
3. **user.yaml** — Who owns this machine. Name, role, partnership model. The agent knows who it is working with.

Machine boot is optional. If `$MX_HOME` is not set, MX OS starts at Layer 1 — no machine context, just repo context. Everything still works. But the agent works blind to the universe.

When machine boot IS available, the agent knows the planet before it reads the guidebook. Don't panic. Read `$MX_HOME`.

**Analogy:** firmware. It runs before the BIOS. It tells the hardware what it is.

See: [what-is-mx-environment](what-is-mx-environment.cog.md)

---

## Layer 1: The Bootloader

The bootloader is the platform configuration that the AI agent reads on every interaction. In Claude Code, this is `CLAUDE.md`. In other platforms, it may be a system prompt, a `.clinerules` file, or any always-on configuration.

The bootloader's job is minimal:

1. Tell the agent that MX OS exists
2. Point to the init mechanism (a skill, a cog, or a direct instruction)
3. Load SOUL.md for identity

The bootloader does NOT read the registry on every turn. That would waste tokens. It is a pointer, not a program.

**Analogy:** BIOS. It does not run your applications — it loads the operating system that does.

---

## Layer 2: Init

Init runs once per session. Its job is to give the agent a map of the system.

**What init reads:**

1. **cog-registry.cog.md** — The index of all cogs. After reading this, the agent knows what programs exist, what they do, and how they connect (builds-on graph).

2. **what-comes-next.cog.md** — The current state. After reading this, the agent knows what priorities are active, what work is pending, and what Tom needs next.

**After init, the agent is booted.** It has:

- A programme listing (registry)
- Current priorities (what-comes-next)
- Identity (SOUL.md, loaded by bootloader)
- The specification (cog-unified-spec, referenced by registry)

**Implementation:** In this repository, init is a skill: `/mx-boot`. The skill reads the two files and presents a briefing. In other environments, init could be an action-doc action, a script, or a manual instruction.

**Analogy:** `systemd` / `init.d`. Runs once at startup to bring the system to a usable state.

---

## Layer 3: Routing

The agent is booted. The user asks it to do something. How does it know which cog to read?

**Routing uses cog metadata.** Every cog in the registry has:

- `category` — what domain it belongs to (learning, mx-core, reference)
- `tags` — keywords for matching (pricing, cruises, agent-frameworks)
- `audience` — who it is for (developers, content-strategists, ai-agents)
- `description` — what it does

The agent matches the task against this metadata. "Write an outreach message" → look for cogs tagged `outreach` or in category `communication`. "Validate the spec" → look for cogs with action `validate`.

**Routing can be an action-doc.** A dedicated routing action-doc maps task patterns to cogs. This is the dispatcher — the process scheduler of MX OS. The `route` action in this cog demonstrates the pattern.

**Fallback:** If no routing action-doc exists, the agent reads the registry directly and uses its own reasoning to match. AI reasoning IS a capable router — it just benefits from structure.

**Analogy:** Process scheduler. Maps requests to the right program.

---

## Layer 4: Execution

The agent finds the right cog. Now it executes.

### For `runtime: runbook`

The agent reads the action-doc's execute block and follows the instructions. The `usage` field in each action is a natural language instruction. The `inputs` and `outputs` define the data contract.

The action-doc IS the instruction set. The agent IS the executor.

This is the most common runtime in MX OS. Most action-docs — the applications of MX OS — are specifications that tell the agent what to do, not scripts to be run externally.

### For `runtime: bash`

The agent uses its Bash tool (or equivalent) to run the command specified in the action. The action-doc defines what to run. The agent's tool capabilities provide the shell.

### For `runtime: node` or `runtime: python`

Same pattern. The agent uses its tools to invoke the interpreter with the specified command or script.

### For `runtime: npm`

The agent runs `npm run <script>` using its Bash tool.

### The Key Point

**The AI agent is the universal runtime.** It does not call an external kernel. It IS the kernel. Every application (action-doc), regardless of runtime type, is executed by the same agent using its available tools.

**Analogy:** The agent is both the kernel and the shell. It schedules, interprets, and executes.

---

## Entry Points — The Human Interface

The five layers above describe how MX OS works from the agent's perspective. But humans need to invoke it too. An entry point is a platform-specific mechanism that routes a human's natural language request to the right action-doc action.

### What an Entry Point Does

1. **Routes** the human's request to an action-doc action
2. **Reads** the action-doc fresh (never cached)
3. **Reads** SOUL.md for constraints
4. **Follows** the action's usage instructions

The entry point is thin — a router, not a program. The action-doc is the program.

### Platform Implementations

| Platform | Entry Point | Boot Mechanism |
| --- | --- | --- |
| Claude Code | Skill file (`.claude/skills/`) | `/mx-boot` lists available skills |
| Claude Web | System prompt instruction | Prompt lists available tools |
| ChatGPT | Custom GPT instructions | Instructions list commands |
| Any AI chat | Paste action-doc into context | Tell the agent what is available |

The action-doc is universal. The entry point adapts to the platform. Same separation as a program (universal) and a desktop shortcut (platform-specific).

### The Full Stack

```
Human request ("show me the dashboard")
    ↓
Entry point (skill / system prompt / pasted context)
    ↓
┌─────────────────────────────────────────────────┐
│  1. Bootloader → 2. Init → 3. Routing →        │
│  4. Execution → 5. IPC                          │
└─────────────────────────────────────────────────┘
    ↓
Output
```

For the complete pattern of building operational action-docs with entry points, see `building-action-docs`.

---

## Layer 5: IPC (Inter-Cog Communication)

Action-docs can call other action-docs during execution.

### The `invokes` Field

```yaml
execute:
  actions:
    - name: boot
      invokes: [cog-registry.list, what-comes-next.brief]
```

`invokes` declares that this action, when executed, should also execute the named actions from other action-docs. The format is `cog-name.action-name`.

The agent follows the invocation chain:

1. Read the current action's instructions
2. For each invoked action-doc action, read that action-doc and execute the action
3. Use the results as context for the current action
4. Complete the current action

### `invokes` vs `builds-on` vs `requires.cogs`

| Field | When | What It Does |
| --- | --- | --- |
| `builds-on` | Before reading | "Read these first for context" — conceptual |
| `requires.cogs` | Before execution | "These must exist" — static dependency check |
| `invokes` | During execution | "Execute these actions" — dynamic call chain |

### Why This Matters

Without IPC, every action-doc is standalone. The agent must manually chain actions. With `invokes`, action-docs become composable — small programs that call other small programs. The Unix philosophy applied to structured documents.

**Analogy:** System calls. One process calling another through a defined interface.

---

## The Agent Is the Operating System

This is the fundamental insight of MX OS: the AI agent is not a user of the operating system. The AI agent IS the operating system.

| Traditional OS | MX OS |
| --- | --- |
| Kernel schedules processes | Agent reads action-docs and executes |
| Shell interprets commands | Agent interprets natural language tasks |
| Runtime executes code | Agent uses tools (Bash, Read, Write) |
| Filesystem stores files | Markdown files with YAML frontmatter |
| User profiles | SOUL.md files |
| PATH variable | cog-registry |
| Package manager | REGINALD (future) |
| Init system | /mx-boot skill |
| IPC | invokes field |
| Desktop shortcut | Entry point (skill, system prompt, paste) |

The files are the programs. The agent is the computer. MX OS runs wherever an AI agent reads structured files.

---

## Ubiquity — MX OS Runs Everywhere

A cog is a markdown file. YAML frontmatter plus text. No binary. No API dependency. No SDK. No runtime to install. This means cogs work everywhere files exist:

| Location | Visibility | How It Works |
| --- | --- | --- |
| USB stick | Local | Copy the file. Any agent that reads it gets structured context |
| Laptop filesystem | Local | SOUL.md + cogs in folders. MX OS on bare metal |
| Shared fileserver | Private / Shared | Team drive with SOULs = team-wide MX OS |
| Git repo (local) | Private | Version-controlled cogs with full history |
| Git repo (remote) | Shared / Hosted | GitHub, GitLab — cogs discoverable by URL |
| Web server | Hosted | Serve .cog.md files. Agents fetch and parse |
| Embedded in HTML | Hosted | YAML in meta tags or structured data on web pages |
| Flat registry | Shared | cog-registry.cog.md indexes everything |
| REGINALD | Hosted | Verified, signed, trust-wrapped, discoverable at inference time |
| Pasted into a conversation | Any | Copy the cog text. The agent understands it immediately |
| QR code → landing page | Hosted | The companion web: cog metadata in HTML head, full cog linked. Physical objects become machine-readable |

The visibility levels in the specification — local, private, shared, hosted — are not aspirational categories. They describe what is already true. A cog on a USB stick is local. The same cog on a web server is hosted. Same file. Same format. Different reach.

**MX OS does not need to be installed. It needs to be written.**

Every AI agent on the planet can read markdown. Every AI agent can parse YAML. The format has no platform dependency because there is no platform. The files are the platform.

This is why MX OS scales from one person's laptop to the entire web. Not because of infrastructure. Because of format. A format so simple it runs on everything, and an executor (the AI agent) that is already everywhere.

---

## For AI Agents: How to Boot

If you are an AI agent and you want to operate within MX OS:

1. **Check for CLAUDE.md** (or your platform equivalent) — it tells you MX OS exists
2. **Read `cog-registry.cog.md`** — now you know what programs are available
3. **Read `what-comes-next.cog.md`** — now you know what to do
4. **Match the task to a cog** — use the registry metadata to route
5. **Execute the cog** — follow the runtime (runbook: read and do; bash: run the command)
6. **Follow invokes** — if the action invokes other action-docs, execute those too
7. **Update what-comes-next** — mark completed work, add new items
8. **Report outputs** — when actions create files, report full absolute paths

You are now running MX OS.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ PDF generated successfully

Output:
  /Users/tom/Documents/MX/mx-outputs/pdf/books/handbook/mx-handbook.pdf (2.2MB)
```

Not just "PDF generated" or "mx-outputs/pdf/books/handbook/mx-handbook.pdf" — the full absolute path from root.

---

*The AI agent is not a user of the operating system. The AI agent IS the operating system.*
