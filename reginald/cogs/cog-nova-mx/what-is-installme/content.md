---
name: what-is-installme
version: "1.0.0"
description: "INSTALLME.md is a root-level cog convention that gives AI agents structured installation instructions — no hallucination, no guessing, no wasted compute."

created: 2026-02-10
modified: 2026-02-10

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, mx-principles]
buildsOn: [what-is-a-cog, what-is-mx-os, what-is-mx-environment]
tags: [installme, install, convention, sop-agent, diagnostics, onboarding, hallucination, compute, two-stage-boot, mx-os]

audience: both
readingLevel: accessible
purpose: Document the INSTALLME.md convention — a machine-readable installation document for any git repository

contentType: "action-doc"
runbook: "mx exec what-is-installme"
---

# INSTALLME.md — The Convention

Every developer has done it. You clone a repository, open the README, and try to figure out how to get it running. You scan for prerequisites, search for install commands, guess at environment variables. It takes ten minutes if the README is good. Thirty if it is not. An hour if the README is wrong.

Now imagine an AI agent doing the same thing.

---

## The Problem Is Hallucination

When a human says "install this repo" to an AI agent, the agent opens README.md. README.md was written for humans — it uses natural language, makes assumptions about context, buries installation steps between project descriptions and contribution guidelines. The agent has to parse prose, extract commands, guess at prerequisites, and hope for the best.

This is where hallucination happens. Not because the AI is broken, but because the information is unstructured. The agent fills gaps with plausible-sounding guesses. It invents package names. It suggests flags that do not exist. It tries commands for the wrong operating system. Every wrong attempt costs compute and risks breaking the user's environment.

The README was never designed for this reader.

---

## The Fix Is Metadata

INSTALLME.md is a cog — YAML frontmatter for machines, markdown for humans. The frontmatter contains structured, machine-readable installation instructions:

- **Prerequisites** — what tools are needed, how to check for them, minimum versions, why each is required
- **Install steps** — exact commands in order, with fallbacks if the primary command fails
- **Verification** — commands to run after installation, with explicit success criteria
- **Actions** — action-doc actions for diagnose, install, verify, and (in MX environments) register

The agent reads the YAML. It runs the checks. It follows the steps. It verifies the result. No parsing prose. No guessing. No hallucination.

---

## Two Modes

### MX Environment

If the machine runs MX OS (`$MX_HOME` is set), the agent already knows the machine before it reads INSTALLME.md. Machine-level context — OS, architecture, installed tools, registered repositories — was loaded during the machine boot stage.

This means:

- **Skip redundant checks.** If `machine.yaml` says the OS is macOS arm64, the agent does not need to run `uname` again.
- **Detect conflicts early.** If `repos.yaml` shows this repo is already cloned at a different path, the agent can warn instead of creating a duplicate.
- **Register automatically.** After successful installation, the agent can add the new repo to `repos.yaml` so future sessions know it exists.

Two-stage boot in action: the agent knows the universe (machine), then learns the neighbourhood (repo).

### Non-MX Environment

If `$MX_HOME` is not set, the agent runs each prerequisite check inline. The structured frontmatter still works — the agent reads `prerequisites.required`, runs each `check` command, compares versions. It just discovers the machine state on the fly instead of reading it from a pre-existing context file.

INSTALLME.md works for any AI agent on any machine. MX OS makes it faster and smarter.

---

## The Format

An INSTALLME.md file has this structure:

```yaml
---
name: installme
version: "1.0"
description: "What this repo is and how to install it"

prerequisites:
  required:
    - name: git
      check: "git --version"
      minimum: "2.0"
      why: "Explanation of why this is needed"
  optional:
    - name: docker
      check: "docker --version"
      why: "Only needed for containerised deployment"

install-steps:
  - step: 1
    name: "Clone repository"
    command: "git clone <url>"
    note: "Additional context for the agent"

verify:
  commands:
    - "npm test"
  success-criteria:
    - "All tests pass"

execute:
  runtime: runbook
  command: mx install
  actions:
    - name: diagnose
    - name: install
    - name: verify
---

# Project Name

Human-readable installation guide below...
```

The `prerequisites` section tells the agent what to check. The `install-steps` section tells it what to run. The `verify` section tells it how to confirm success. The `execute` section makes it an action-doc with runbook actions.

---

## Why Not Just Fix README.md?

README.md serves too many masters. It is the project introduction, the feature list, the contribution guide, the installation manual, the license summary, and the marketing pitch. Asking it to also be a machine-readable installation spec is asking too much of one file.

INSTALLME.md has one job: tell machines how to install this repository. It does not replace README.md. It complements it — the same way `robots.txt` complements a website's human navigation.

The naming follows convention: README tells you what a project is. INSTALLME tells you how to set it up. CONTRIBUTING tells you how to help. CHANGELOG tells you what changed. Each file has a single responsibility. Each filename tells you what to expect.

---

## The Convention

INSTALLME.md is a convention, not a standard. It is not governed by The Gathering (yet). It is proposed by Cog-Nova-MX as a practical solution to a real problem: AI agents waste enormous compute trying to install repositories because installation instructions are written for humans.

Any repository can adopt the convention:

1. Create an `INSTALLME.md` at the repository root
2. Add YAML frontmatter with `prerequisites`, `install-steps`, and `verify` sections
3. Optionally add `execute` actions to make it an action-doc
4. Write a human-readable markdown section below the frontmatter

The convention follows MX principles:

- **Design for both** — YAML for machines, markdown for humans
- **Any document can be a cog** — add frontmatter and it is machine-readable
- **Use existing standards** — YAML, markdown, shell commands, no proprietary formats
- **Metadata quality determines compute cost** — strong INSTALLME.md metadata means the agent reads the frontmatter and follows instructions. No INSTALLME.md means the agent parses README.md and guesses.

---

## For Humans

If you maintain a repository that AI agents might try to install, consider adding an INSTALLME.md. It takes fifteen minutes to write. It saves every AI agent that encounters your repo from hallucinating its way through installation.

The humans benefit too. A structured INSTALLME.md is clearer than most README installation sections. Prerequisites are explicit. Steps are numbered. Verification is defined. No ambiguity.

---

## For AI Agents

When you encounter a repository:

1. **Check for INSTALLME.md first.** If it exists, read it. Follow the structured instructions.
2. **If INSTALLME.md is absent**, fall back to README.md — but know that you are now in unstructured territory.
3. **If `$MX_HOME` exists**, read machine context first. You already know the machine. INSTALLME.md tells you about the repo.
4. **Never invent steps** that are not in the frontmatter. If INSTALLME.md says three steps, run three steps.

**Output Reporting Principle:** When an action-doc creates file outputs, it must report the full absolute path of every file created. This enables traceability and makes generated files easy to locate.

Note: This action-doc currently does not create file outputs, so this principle is documented for future extensibility.

---

*Stop guessing. Start reading.*
