---
version: "1.0.0"
description: "The action action-doc that reads and executes INSTALLME.md files — diagnose, install, verify, register. The tool that stops hallucination."

created: 2026-02-10
modified: 2026-02-10

author: Tom Cranstoun and Maxine

mx:
  name: installme-runner
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, what-is-mx-os, what-is-mx-environment, what-is-installme]
  tags: [installme, runner, action, install, diagnostics, prerequisites, sop-agent, executor, mx-os]

  audience: ai-agents
  readingLevel: technical
  purpose: Give any AI agent the operational tool to execute INSTALLME.md — read the metadata, run diagnostics, install, verify, register

  contentType: "action-doc"
  runbook: "mx exec installme-runner"
  execute:
    runtime: runbook
    command: mx installme
    actions:
      - name: diagnose
        description: Check all prerequisites listed in INSTALLME.md and report machine readiness
        usage: |
          1. Detect environment mode:
             - If $MX_HOME is set, read ~/.mx/machine.yaml for OS, architecture, hostname
             - If $MX_HOME is set, read ~/.mx/repos.yaml to check if this repo is already registered
             - If $MX_HOME is not set, note standalone mode — all checks will run inline

          2. Read INSTALLME.md in the current repository root
             - Parse YAML frontmatter
             - Extract prerequisites.required and prerequisites.optional

          3. For each required prerequisite:
             - Run the `check` command (e.g. "git --version")
             - Parse the version from output
             - Compare against `minimum` version
             - Report: PASS (installed, meets minimum), FAIL (missing), WARN (below minimum)

          4. For each optional prerequisite:
             - Run the `check` command
             - Report: AVAILABLE or NOT INSTALLED (no failure — these are optional)

          5. Present summary:
             - Machine: [hostname, OS, arch] (from $MX_HOME or detected inline)
             - Required: [pass count] / [total] passed
             - Optional: [available count] / [total] available
             - Verdict: READY or NOT READY (with specific failures listed)

          Do not proceed to install if any required prerequisite fails.
        inputs:
          - name: installme-path
            type: string
            required: false
            description: "Path to INSTALLME.md (defaults to ./INSTALLME.md in current repo root)"
        outputs:
          - name: diagnostics
            type: object
            description: "Machine readiness report with per-prerequisite pass/fail"

      - name: install
        description: Execute the install-steps from INSTALLME.md in order
        usage: |
          1. Run the diagnose action first. Do not proceed if verdict is NOT READY.

          2. Read install-steps from INSTALLME.md frontmatter

          3. For each step (in order):
             - Announce: "Step [n]: [name]"
             - Run the `command`
             - If command fails and `fallback` exists, run the fallback
             - If both fail, stop and report the failure
             - If command succeeds, report success and move to next step

          4. After all steps complete, automatically run the verify action

          Rules:
          - Never skip steps
          - Never reorder steps
          - Never invent steps that are not in the frontmatter
          - Never guess at commands — use exactly what INSTALLME.md specifies
          - If a step has a `note`, read it for context but do not treat it as a command
        inputs:
          - name: repo-url
            type: string
            required: false
            description: "Git clone URL (only needed if step 1 is a clone operation)"
          - name: installme-path
            type: string
            required: false
            description: "Path to INSTALLME.md (defaults to ./INSTALLME.md)"
        outputs:
          - name: install-report
            type: object
            description: "Step-by-step results with pass/fail per step"

      - name: verify
        description: Confirm the installation succeeded by running verification commands
        usage: |
          1. Read verify.commands from INSTALLME.md frontmatter

          2. Run each command in order
             - Capture output

          3. Check each success-criteria against the outputs
             - Report PASS or FAIL for each criterion

          4. Present summary:
             - Commands run: [count]
             - Criteria checked: [count]
             - Result: ALL PASS or FAILURES DETECTED (with specifics)

          5. If all pass and $MX_HOME is set, offer to run the register action
        inputs:
          - name: installme-path
            type: string
            required: false
            description: "Path to INSTALLME.md (defaults to ./INSTALLME.md)"
        outputs:
          - name: verification
            type: object
            description: "Verification results with pass/fail per criterion"

      - name: register
        description: Register this repo in $MX_HOME/repos.yaml (MX environments only)
        usage: |
          1. Check that $MX_HOME is set. If not, report that registration requires MX OS and stop.

          2. Read ~/.mx/repos.yaml

          3. Check if this repo path is already listed
             - If yes, report "already registered" and stop
             - If no, continue

          4. Read INSTALLME.md frontmatter for repo metadata (name, description)

          5. Add entry to repos.yaml:
             - name: [from INSTALLME.md or directory name]
             - path: [absolute path to repo]
             - description: [from INSTALLME.md description field]
             - role: [from INSTALLME.md or "development"]
             - registered: [today's date]

          6. Write updated repos.yaml

          7. Report what was added
        inputs:
          - name: repo-path
            type: string
            required: false
            description: "Absolute path to the repo (defaults to current working directory)"
        outputs:
          - name: registration
            type: object
            description: "The new or existing repos.yaml entry"

      - name: audit
        description: Check whether a repository has a valid INSTALLME.md
        usage: |
          1. Check if INSTALLME.md exists in the repo root
             - If missing, report: "No INSTALLME.md found. AI agents will hallucinate through README.md."

          2. If present, parse YAML frontmatter and check for:
             - prerequisites section (required and optional)
             - install-steps section (at least one step)
             - verify section (at least one command and one criterion)
             - Each prerequisite has: name, check, why
             - Each step has: step number, name, command

          3. Report:
             - INSTALLME.md: present/missing
             - Prerequisites: [count] required, [count] optional
             - Install steps: [count]
             - Verify commands: [count]
             - Verify criteria: [count]
             - Quality: COMPLETE / PARTIAL / MISSING
             - Recommendations: list any missing or weak sections

          4. If $MX_HOME context is available, cross-reference prerequisites against
             machine.yaml to identify any that the machine already satisfies
        inputs:
          - name: repo-path
            type: string
            required: false
            description: "Path to repo root to audit (defaults to current directory)"
        outputs:
          - name: audit-report
            type: object
            description: "INSTALLME.md quality and completeness report"
---

# The INSTALLME Runner

This is the tool. The other cog ([what-is-installme](what-is-installme.cog.md)) explains the convention. This one executes it.

---

## What This Does

When an AI agent encounters a repository with an INSTALLME.md, it needs to know how to act on it. Reading the YAML frontmatter gives the data. This action-doc gives the procedure.

Five actions, one workflow:

1. **Diagnose** — Check every prerequisite. Report what is installed, what is missing, what is below minimum version. In MX environments, the machine context is already known. In standalone, run the checks inline.

2. **Install** — Run each install step in order. Use fallbacks if primary commands fail. Stop on failure. Never invent steps.

3. **Verify** — Run verification commands. Check success criteria. Report pass/fail.

4. **Register** — In MX environments, add the repo to `$MX_HOME/repos.yaml` so future sessions know it exists.

5. **Audit** — Check whether a repo has a valid INSTALLME.md at all. Report completeness and quality.

---

## The Two-Mode Pattern

Every action in this action-doc starts with the same check: is `$MX_HOME` set?

If yes, the agent is in an MX environment. It has already read `machine.yaml` during the machine boot stage. It knows the OS, the architecture, the hostname. It knows what other repos are registered. The diagnostic checks become confirmations rather than discoveries.

If no, the agent is standalone. It runs every check from scratch, discovers the machine state inline, and cannot register the repo in a central location. The workflow still works — it just works without the head start.

This is the two-stage boot principle in action: machine context first makes everything faster and smarter. But the system degrades gracefully when machine context is not available.

---

## Why a Separate Runner

The INSTALLME.md file at repo root contains the data — what prerequisites, what steps, what verification. It is specific to one repository.

This action-doc contains the procedure — how to read that data, how to execute it, how to handle errors, how to register. It is generic to all repositories.

The separation matters. A new repository adopting the INSTALLME.md convention gets the data format (from [what-is-installme](what-is-installme.cog.md)) and the execution model (from this action-doc) for free. Write the frontmatter. The runner knows what to do with it.

---

## For AI Agents

When you encounter a repository and the user says "install this":

1. **Check for INSTALLME.md** in the repo root
2. **If found**, read this action-doc for the execution procedure
3. **Run diagnose** first — always
4. **If ready**, run install
5. **Then verify** — always
6. **If MX environment**, offer to register
7. **Report output paths** — if registration creates or updates files, provide full absolute paths

The actions section above contains complete, step-by-step instructions for each operation. Follow them exactly. The instructions are the program. You are the runtime.

**Output Reporting Principle:** When the register action updates the repos.yaml file, always report the full absolute path of the modified file. This enables traceability and makes it easy to verify where the registration was recorded.

Example:

```
✓ Repository registered successfully

Registry updated:
  /Users/tom/.mx/repos.yaml

Entry added:
  name: mx-collaboration
  path: /Users/tom/Documents/MX/mx-collaboration
  role: development
```

Not just "registered to repos.yaml" — the full absolute path from root.

---

## The Rules

These are not guidelines. They are constraints.

1. **Never invent commands.** If INSTALLME.md says `npm install`, run `npm install`. Not `npm ci`. Not `yarn`. Not `bun install`. What the frontmatter says.

2. **Never skip diagnostics.** Always run diagnose before install. A failed prerequisite caught early saves the user from a broken environment.

3. **Never skip verification.** Always run verify after install. An unverified installation is an assumption, not a fact.

4. **Stop on failure.** If a step fails and the fallback fails, stop. Report what failed and why. Do not continue hoping the next step will fix it.

5. **Respect the frontmatter.** The YAML is the single source of truth. The markdown is for humans. When executing, read the YAML.

---

*The instructions are the program. You are the runtime. Stop guessing. Start reading.*
