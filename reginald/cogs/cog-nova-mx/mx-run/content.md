---
version: "1.0"
description: Universal cog executor — looks up any cog by name, lists its actions, and dispatches execution by runtime

created: 2026-02-11
modified: 2026-02-11

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: draft

  category: mx-core
  partOf: mx-os
  buildsOn: [what-is-a-cog, cog-query, cog-registry]
  refersTo: [what-is-mx-os, how-mx-os-runs]
  tags: [executor, runtime, dispatcher, cli, cog, mx-os]

  contentType: "action-doc"
  runbook: "mx exec mx-run"
  execute:
    runtime: node
    command: node mx-reginald/scripts/mx-run.js
    actions:
      - name: list
        description: List all executable action-docs in the registry
        usage: node mx-reginald/scripts/mx-run.js
        outputs:
          - name: table
            type: string
            description: Formatted table of action-docs with name, runtime, action count, and description

      - name: show
        description: Show a cog's details and list its available actions
        usage: node mx-reginald/scripts/mx-run.js <cogname>
        inputs:
          - name: cogname
            type: string
            required: true
            description: The name of the cog to inspect
        outputs:
          - name: info
            type: string
            description: Cog metadata and action list

      - name: execute
        description: Execute a specific action on a cog, dispatching by runtime
        usage: node mx-reginald/scripts/mx-run.js <cogname> <action> [args...]
        inputs:
          - name: cogname
            type: string
            required: true
            description: The name of the cog to execute
          - name: action
            type: string
            required: true
            description: The action to run
        outputs:
          - name: result
            type: string
            description: Output from the executed action

  requires:
    bins: [node]
    packages: [js-yaml]
---

# MX Run

The universal cog executor. Type a cog name, get its actions. Type an action, it runs.

---

## What It Does

MX Run is the command-line interface to MX OS. It bridges the gap between the cog registry (which knows what exists) and execution (which makes things happen).

Three modes:

1. **No arguments** — list every action-doc in the system
2. **Cog name** — show that cog's details and list its actions
3. **Cog name + action** — execute the action

---

## How It Dispatches

MX Run reads the cog's `runtime` field and acts accordingly:

| Runtime   | What happens                                       |
|-----------|---------------------------------------------------|
| `node`    | Runs the command with action name as subcommand    |
| `bash`    | Runs the command with action name as subcommand    |
| `npm`     | Runs the npm command from the execute block        |
| `runbook` | Shows the SOP for an AI agent to follow            |

For runbook cogs, MX Run shows the SOP on screen. The instructions are the program. You are the runtime.

---

## Usage

### As mx command (anywhere on the system)

```bash
mx run                           # List all action-docs
mx run cog-query                 # Show cog-query's actions
mx run cog-query list --json     # Execute the list action with --json flag
```

### As npm command (from repo root)

```bash
npm run cog:run                           # List all action-docs
npm run cog:run -- cog-query              # Show cog-query's actions
npm run cog:run -- cog-query list --json  # Execute the list action
```

---

## Name Resolution

MX Run looks up cog names in `mx-reginald/index.json` — the pre-built registry index. This is fast (no filesystem scan). If your cog does not appear, run `npm run cog:sync` to regenerate the index.

If a name is not found, MX Run suggests similar names from the registry.

---

## Why This Matters

Before MX Run, executing a cog meant knowing its file path and runtime. Now you just need its name. This is the first step toward MX OS as a real operating system: name a thing, run a thing.

---

*The instructions are the program. MX Run is the runtime.*
