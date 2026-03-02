---
name: mx-boot
version: "1.0.0"
description: "The MX OS bootstrapper. Takes any machine from zero to operational — checks prerequisites, installs dependencies, configures the environment, initialises the session, and reports status. Three entry points: INSTALLME action cog (bare metal), npm run boot (Node available), /mx-boot skill (session init)."

created: 2026-02-11
modified: 2026-02-11

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, mx-principles]
buildsOn: [what-is-a-cog, what-is-mx-os, how-mx-os-runs, what-is-mx-environment]
tags: [boot, bootstrap, install, preflight, init, session, zero-to-operational, entry-point, mx-os]

audience: both
readingLevel: technical
purpose: Bootstrap MX OS from any starting point — bare machine, fresh clone, or new session. The single boot cog that unifies preflight, installation, configuration, session init, and status reporting.

execute:
  runtime: runbook
  command: mx boot
  actions:
    - name: preflight
      description: Check all prerequisites and report machine readiness
      usage: |
        Check each prerequisite in order. For each one, run the check command and compare
        the version against the minimum. Report pass/fail for each.

        **Prerequisites (required):**

        | Tool | Check Command | Minimum | Why |
        |------|--------------|---------|-----|
        | git | `git --version` | 2.0 | Repository uses git submodules |
        | node | `node --version` | 20.0 | Build scripts, cog tools, content generation |
        | npm | `npm --version` | 9.0 | Package management and script runner |

        **Prerequisites (optional):**

        | Tool | Check Command | Why |
        |------|--------------|-----|
        | gh | `gh --version` | GitHub CLI for PR workflows |
        | pandoc | `pandoc --version` | PDF generation from markdown |
        | pdflatex | `pdflatex --version` | PDF generation with Pandoc |

        **Machine context (if available):**

        If `$MX_HOME` is set, read `$MX_HOME/machine.yaml` first for OS and architecture context.
        This lets you skip checks for tools you already know are installed.

        If `$MX_HOME` is NOT set, run all checks from scratch. The preflight works either way.

        **Output format:**

        ```
        ## MX OS Preflight

        Machine: [hostname or "unknown"]
        OS: [os or "detecting..."]
        $MX_HOME: [path or "not set"]

        ### Required
        ✓ git 2.47.1 (minimum 2.0)
        ✓ node 22.13.1 (minimum 20.0)
        ✓ npm 10.9.2 (minimum 9.0)

        ### Optional
        ✓ gh 2.65.0
        ✗ pandoc — not installed (needed for PDF generation)
        ✗ pdflatex — not installed (needed for PDF generation)

        ### Result
        PASS — all required prerequisites met
        [or]
        FAIL — missing: node, npm. Install Node.js 20+ from https://nodejs.org/
        ```

        If any required prerequisite fails, do NOT proceed to install.
        Report what is missing and how to install it.
      inputs:
        - name: verbose
          type: boolean
          required: false
          description: "Show detailed version info and paths (default: false)"
      outputs:
        - name: preflight-report
          type: object
          description: "Machine readiness report with pass/fail for each prerequisite"

    - name: install
      description: Install npm dependencies and set up the repository
      usage: |
        Run after preflight passes. This action installs everything the repo needs.

        **Steps (in order):**

        1. **Check we are in the repo root:**
           - Verify `package.json` exists in the current directory
           - If not, report error: "Not in the MX-The-Books repo root"

        2. **Install npm dependencies:**
           - Run `npm install`
           - This triggers the `postinstall` script which also installs:
             - `scripts/mx-nav-server/` dependencies
             - `scripts/qr-code-generator/` dependencies
           - Report success or failure

        3. **Make scripts executable:**
           - Run: `chmod +x scripts/*.sh scripts/**/*.sh` (if shell scripts exist)
           - Report how many scripts were made executable

        4. **Sync cog registry:**
           - Run `npm run cog:sync` to regenerate mx-reginald/index.json
           - Report cog count

        5. **Verify:**
           - Run `npm run cog:stats` — should list cogs with zero errors
           - Report pass/fail

        If any step fails, report the error and stop. Do not skip steps.
      inputs: []
      outputs:
        - name: install-report
          type: object
          description: "Step-by-step installation results with pass/fail"

    - name: configure
      description: Set up $MX_HOME and machine context (creates ~/.mx/ if needed)
      usage: |
        This action ensures the machine has MX OS machine-level context.
        It is safe to run multiple times — it never overwrites existing files.

        **Step 1: Check $MX_HOME**

        - If `$MX_HOME` is set and `~/.mx/` exists:
          - Report: "$MX_HOME is configured at [path]"
          - Skip to Step 3 (verify)

        - If `$MX_HOME` is NOT set or `~/.mx/` does not exist:
          - Ask: "MX OS machine context is not configured. Set it up now?"
          - If yes, proceed to Step 2

        **Step 2: Bootstrap ~/.mx/**

        Create the directory and files:

        ```
        ~/.mx/
        ├── SOUL.md           # Machine identity
        ├── machine.yaml      # Hardware and OS context
        ├── repos.yaml        # Registered repositories
        ├── user.yaml         # Machine owner identity
        ├── UBER.cog.md       # The uber briefing cog
        └── mx-os-environment.cog.md  # Machine environment action-doc
        ```

        For each file:
        - If it already exists: skip (never overwrite)
        - If it does not exist: create with sensible defaults

        **machine.yaml defaults:**
        ```yaml
        hostname: [detect with `hostname`]
        os: [detect with `uname -s`]
        os-version: [detect with `sw_vers -productVersion` on macOS]
        kernel: [detect with `uname -r`]
        architecture: [detect with `uname -m`]
        role: development
        description: "MX OS deployment"
        mx-os:
          version: "1.0"
          deployed: [today's date]
          home: ~/.mx
          env-var: MX_HOME
        ```

        **repos.yaml defaults:**
        ```yaml
        repos: []
        ```

        **user.yaml defaults:**
        ```yaml
        name: ""
        role: ""
        company: ""
        email: ""
        ```
        Ask the user for name and email at minimum.

        **Add $MX_HOME to shell profile:**
        - Detect shell: check `$SHELL`
        - If zsh: append to `~/.zshrc`
        - If bash: append to `~/.bash_profile`
        - Add: `export MX_HOME="$HOME/.mx"`
        - Ask before modifying shell profile

        **Step 3: Register this repo**

        - Read `~/.mx/repos.yaml`
        - Check if this repo is already registered (match by path)
        - If not registered: add entry with name, path, description, role
        - If already registered: skip

        **Step 4: Report**

        ```
        ## MX OS Configure

        $MX_HOME: ~/.mx/ [created | already exists]
        Shell profile: ~/.zshrc [updated | already configured | skipped]

        Machine: [hostname] ([os] [architecture])
        User: [name] ([email])
        Repos registered: [count]

        This repo: [registered | already registered]
        ```
      inputs:
        - name: shell-profile
          type: string
          required: false
          description: "Path to shell profile (auto-detected if not specified)"
      outputs:
        - name: configure-report
          type: object
          description: "Configuration results — what was created, what was skipped"

    - name: init
      description: Session init — read registry, priorities, SOUL. Run once per session.
      usage: |
        This is the session-start action. Everything is installed and configured.
        Now load the MX OS context into this session.

        **What to read (in order):**

        1. **$MX_HOME context** (if available):
           - Read `$MX_HOME/machine.yaml` — know the machine
           - Read `$MX_HOME/repos.yaml` — know the universe
           - Read `$MX_HOME/user.yaml` — know the human

        2. **Repository context:**
           - Read `SOUL.md` at repo root — identity and partnership
           - Read cog registry (run `npm run cog:list` or read `mx-reginald/index.json`) — know the programs
           - Read `mx-canon/MX-Cog-Registry/cogs/what-comes-next.cog.md` — know current priorities

        3. **Internalise:** After reading, the agent knows:
           - Every cog by name (routing table)
           - Current priorities (action plan)
           - Identity (SOUL)
           - Machine context (if MX environment)

        **Present boot briefing:**

        ```
        ## MX OS — Booted

        ### Machine
        [hostname] — [os] [architecture] (or "no machine context" if no $MX_HOME)

        ### Registry
        [List cog names — just names, one line. No counts in prose.]

        ### Current Priorities
        - Priority 1: [name] — [status]
        - Priority 2: [name] — [status]

        ### Available Skills
        [List mx-c- and mx- skills from .claude/skills/]

        ### Identity
        [Name from SOUL.md]

        ### Ready
        MX OS is loaded. I know the registry. Ask me anything.
        ```

        **Rules:**
        - Read ACTUAL files — never use cached or remembered versions
        - Present concisely — status screen, not essay
        - If a file is missing, report as warning
        - Init is read-only — do not modify anything
      inputs: []
      outputs:
        - name: boot-briefing
          type: object
          description: "Session context — registry, priorities, identity, status"
      invokes: [cog-registry.list, what-comes-next.brief]

    - name: status
      description: Layered status report — pass/fail, then dashboard, then guided next steps
      usage: |
        Three layers of detail, presented in order:

        **Layer 1: Pass/Fail**

        Quick health check — is the system operational?

        | Check | How | Pass | Fail |
        |-------|-----|------|------|
        | Node.js | `node --version` | Version 20+ | Missing or old |
        | npm | `npm --version` | Version 9+ | Missing or old |
        | git | `git --version` | Version 2+ | Missing or old |
        | npm deps | Check `node_modules/` exists | Directory exists | Missing (run npm install) |
        | Cog registry | `npm run cog:stats` | Reports cogs, 0 errors | Errors found |
        | $MX_HOME | Check env var | Set and ~/.mx/ exists | Not set |
        | SOUL.md | Check root file | Exists | Missing |

        Result: `PASS — MX OS operational` or `FAIL — N issues found`

        **Layer 2: Dashboard**

        If pass, show the full picture:

        ```
        ## MX OS Status Dashboard

        **System:** [hostname] — [os] [arch]
        **$MX_HOME:** [path or "not configured"]
        **Registered repos:** [count]

        **Cog Registry:**
        - Total cogs: [from cog:stats]
        - Action-docs: [count]
        - Info-docs: [count]
        - Parse errors: [count]

        **Registries:** [count from registry-of-registries]
        **Skills:** [count from .claude/skills/]

        **Architecture status:** [see below]
        ```

        **Architecture status** — this is the "knows it's being built" part:

        Check each system layer and report completeness:

        | Layer | Component | Status |
        |-------|-----------|--------|
        | 0 | $MX_HOME | ✓ configured / ✗ not set |
        | 0 | machine.yaml | ✓ exists / ✗ missing |
        | 0 | repos.yaml | ✓ exists / ✗ missing |
        | 0 | user.yaml | ✓ exists / ✗ missing |
        | 1 | CLAUDE.md | ✓ exists / ✗ missing |
        | 2 | /mx-boot skill | ✓ wired / ✗ missing |
        | 2 | cog registry | ✓ populated / ✗ empty |
        | 3 | Routing cog | ✓ exists / ✗ missing |
        | 4 | Action-docs | ✓ N available / ✗ none |
        | 5 | IPC (invokes) | ✓ used by N cogs / ✗ unused |

        **Layer 3: Guided Next Steps**

        If anything is incomplete, provide specific commands:

        ```
        ### Next Steps
        1. [Specific action with exact command]
        2. [Specific action with exact command]
        3. [Specific action with exact command]
        ```

        Only show next steps if there ARE steps needed. If everything passes, say:
        "System is fully operational. No action needed."
      inputs: []
      outputs:
        - name: status-report
          type: object
          description: "Layered status: pass/fail + dashboard + guided next steps"
      invokes: [registry-of-registries.dashboard]

    - name: route
      description: Given a task, find the right cog or skill to handle it
      usage: |
        The routing action. Maps "I want to do X" to "read cog Y, run action Z."

        **How routing works:**

        1. Accept a task description from the user (natural language)

        2. Search the cog registry for matches:
           - Match against cog `name` (exact or fuzzy)
           - Match against `tags` (keyword match)
           - Match against `category` (domain match)
           - Match against `description` (semantic match)
           - Match against action names in `execute.actions` (what it can do)

        3. Search the skills directory for matches:
           - List `.claude/skills/*/skill.md`
           - Match skill name and "When to Use" section against the task

        4. Rank results by relevance:
           - Exact name match: highest
           - Action name match: high
           - Tag match: medium
           - Description match: lower
           - Category match: lowest

        5. Present recommendation:

           ```
           ## Route: [task summary]

           **Best match:** [cog name] — [description]
           **Action:** [action name] — [what it does]
           **Invoke:** /mx-c-[name] or read [path]

           **Also relevant:**
           - [cog name] — [why it might help]
           - [cog name] — [why it might help]
           ```

        6. If no match found:
           - Suggest creating a new action-doc with `/mx-build scaffold`
           - Or suggest the user describe what they need

        **The routing table is the cog registry.** Read it fresh every time.
        Do not maintain a separate routing index — the registry IS the index.
      inputs:
        - name: task
          type: string
          required: true
          description: "What the user wants to do, in natural language"
      outputs:
        - name: recommendation
          type: object
          description: "The recommended cog(s) and action(s) with reasoning"
      invokes: [cog-registry.search]

mx:
  contentType: "action-doc"
  runbook: "mx exec mx-boot"
  semantic: true
  convergence: true
  accessibility: true
---

# MX OS Boot

The bootstrapper. Takes any machine from zero to operational.

---

## The Problem

You clone an MX repo on a fresh machine. Or you start a new Claude Code session. Or you are a partner evaluating MX OS for the first time. In every case, the same question: how do I get this running?

Today, the answer is scattered. INSTALLME.md handles installation. The /mx-boot skill handles session init. The mx-os-environment cog handles machine context. Three files, three patterns, three things to find and read.

This cog unifies them. One program. Three entry points. Zero to operational.

---

## Three Entry Points

The boot sequence works from three starting points, depending on what the machine has:

### Entry Point 1: INSTALLME Action Cog (Bare Metal)

The machine has nothing except a shell. Maybe not even Node.js.

```bash
git clone <repo-url>
cd repo
awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d' | bash
```

The INSTALLME embedded script runs the full sequence: identity → prerequisites → MX Home → repository setup → verification. If Node.js is missing, it installs it via Homebrew. If $MX_HOME is not set, it creates it. For automated setup, pass `--auto` with identity flags.

### Entry Point 2: npm run boot (Node Available)

The machine has Node.js and npm. The repo is cloned.

```bash
npm install
npm run cog:stats
```

With Node available, run npm install directly and verify with cog:stats. Runs: install → verify.

### Entry Point 3: /mx-boot Skill (Session Init)

Everything is installed. You are starting a new Claude Code session.

```
/mx-boot
```

Runs: init → status. Reads the registry, loads priorities, presents the briefing. This is the existing /mx-boot behaviour, now backed by this action-doc.

---

## The Sequence

```
INSTALLME / npm install          /mx-boot skill
        │                              │
        ▼                              │
   ┌──────────┐                        │
   │ preflight │ ── Check prerequisites │
   └──────────┘                        │
        │                              │
        ▼                              │
   ┌──────────┐                        │
   │ install   │ ── npm install, mode,  │
   │           │    submodules, sync    │
   └──────────┘                        │
        │                              │
        ▼                              │
   ┌──────────┐                        │
   │ configure │ ── $MX_HOME, register  │
   └──────────┘                        │
        │                              │
        ▼                              ▼
   ┌──────────┐                  ┌──────────┐
   │ status   │◀─────────────────│   init   │
   └──────────┘                  └──────────┘
        │
        ▼
   ┌──────────┐
   │  route   │ ── Available on demand
   └──────────┘
```

The full boot (INSTALLME action cog / npm install) runs four actions in sequence. The session boot (/mx-boot) runs two. The route action is available on demand after boot.

---

## Architecture Awareness

The status action knows the system is still being built. It checks every layer of the MX OS runtime stack and reports what exists, what is missing, and what to do about it.

This is not a green/red dashboard that assumes everything should be perfect. It is an honest report that says: "Layer 3 routing is documented but not wired as a skill yet. Layer 5 IPC is defined but only used by 2 cogs. Here is what to build next."

The boot cog knows the architecture. It knows what has been built and what has not. It grows as the system grows.

---

## For AI Agents

When asked to boot, initialise, or set up MX OS:

1. Read this cog
2. Determine which entry point the user is using:
   - Fresh machine / bare metal → run preflight + install + configure + status
   - New session / already installed → run init + status
   - Just checking → run status alone
3. Follow the action's usage instructions exactly
4. Report results in the specified format
5. If any step fails, report the error and stop — do not skip steps

The boot cog is the front door. Every other cog is behind it.

---

## Relationship to Other Cogs

| Cog | Relationship |
|-----|-------------|
| `how-mx-os-runs` | Documents the runtime model that boot implements |
| `what-is-mx-environment` | Documents the $MX_HOME that configure sets up |
| `INSTALLME.cog.md` | The repo-level installer — action cog with embedded setup script |
| `registry-of-registries` | Status action invokes its dashboard for registry health |
| `cog-registry` | Init action reads it to build the routing table |
| `what-comes-next` | Init action reads it for current priorities |

---

*Zero to operational. One cog. Three entry points. The boot sequence that works from anywhere. Stop guessing. Start reading.*
