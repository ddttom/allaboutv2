---
version: "1.0.0"
description: MX OS lives on the machine, not in the repo. $MX_HOME is the machine-level context — the answer to the machine, the universe, and everything.

created: 2026-02-10
modified: 2026-02-10

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, what-is-mx-os]
  tags: [environment, mx-home, machine-context, boot, bare-metal, two-stage-boot, mx-os]

  audience: both
  readingLevel: beginner
---

# What Is the MX Environment?

MX OS lives on the machine. Not in a repository. Not in a container. On the actual machine — the metal, the disk, the filesystem.

A repository is one neighbourhood in that universe. CLAUDE.md describes the neighbourhood. But an AI agent starting a session does not know what city it is in, what country, what planet. It knows one street and has to guess everything else.

The MX environment is the missing context. The machine describing itself.

---

## The Problem

An AI agent starts a session. It reads CLAUDE.md. It learns about this repository — its mode, its skills, its structure. Good.

But it does not know:

- What machine it is on (developer laptop? CI server? production?)
- What other repositories exist (where is Canon? where are the scripts?)
- Who it is working with (Tom Cranstoun? a new contributor? a CI pipeline?)
- What role this machine plays in MX OS (development? deployment? testing?)

So it asks. Or it guesses. Or it reads MEMORY.md and pieces together breadcrumbs from previous sessions. Every time it does this, it spends tokens on context that should be free.

This is the same compute problem that script metadata solves for scripts — but at a higher level. The machine itself is the black box.

---

## The Solution: $MX_HOME

`$MX_HOME` is an environment variable pointing to `~/.mx/`. It works like `$JAVA_HOME` or `$GOPATH` — a convention developers already know.

Inside `~/.mx/` are four things:

1. **SOUL.md** — Identity of this MX OS installation. Voice, constraints, purpose.
2. **machine.yaml** — The physical context: hostname, OS, architecture, role.
3. **repos.yaml** — Every MX-aware repository on this machine: paths, descriptions, capabilities.
4. **user.yaml** — Who owns this machine: name, role, company, partnership model.
5. **mx-os-environment.cog.md** — The action-doc that reads, audits, and bootstraps all of the above.

Three data files. Thirty lines total. The entire machine described.

---

## Two-Stage Boot

MX OS now boots in two stages:

**Stage 1 — Machine boot.** Read `$MX_HOME`. The AI agent loads machine.yaml, repos.yaml, user.yaml. It now knows: this is Tom's MacBook, arm64, macOS. There is one registered repository at this path. Tom Cranstoun is the founder of CogNovaMX. Maxine is the AI partner. The partnership model applies.

**Stage 2 — Repo boot.** Read `CLAUDE.md` in the current repository. The AI agent loads mode configs, skills, hooks. It now knows: this is MX-The-Books in hub mode, with these submodules, these skills, these conventions.

The order matters. Machine context first gives the AI agent the universe. Repo context second gives it the territory. An agent that knows both can make decisions that neither stage alone supports.

Example: an AI agent running in MX-The-Books needs to reference a script in `~/bin/`. Without machine context, it guesses the path. With `$MX_HOME/machine.yaml`, it reads `paths.bin: ~/bin` and knows exactly where to look. The machine told it.

---

## The Hitchhiker's Principle

The repo is the Guide. It contains the book, the cogs, the canon — the life, the universe, and everything that matters to MX.

But it helps to know which planet you are on before you open the Guide.

`$MX_HOME` tells you the planet. CLAUDE.md tells you the neighbourhood. SOUL.md tells you the room. The cog tells you the object. Context at every level. Self-describing all the way up and all the way down.

This is what Tom means when he says "we have now become the OS for the planet." Not an operating system that runs applications. An operating system that makes every level of the stack — from the machine to the metadata — readable by both humans and machines.

---

## Cogs All the Way Down

The MX environment is itself a cog. Not a new format. Not a special case. An action-doc with YAML frontmatter, markdown prose, and executable actions.

This matters. The principle "any document can be a cog" does not stop at documents. Machine context is a cog. Environment configuration is a cog. The thing that CONTAINS registries is itself registered. Meta. Meta. Meta.

The alternative was inventing a new format for environment context. A custom config file. A JSON schema. A binary blob. But MX OS uses existing standards, and the existing MX standard is cogs. So the environment is a cog.

Practice what you preach. Cogs all the way down — and all the way up.

---

## Where We Are

This section is dated 10 February 2026.

**What exists:**

- `~/.mx/` directory with SOUL.md, machine.yaml, repos.yaml, user.yaml
- `mx-os-environment.cog.md` action-doc in `~/.mx/` with four actions: report, audit, bootstrap, register-repo
- One registered repo (MX-The-Books)
- This concept cog in Canon explaining the system

**What comes next:**

- Export `$MX_HOME` in the shell profile so every process can find it
- Update mx.* scripts to read `$MX_HOME` for machine context
- Update `how-mx-os-runs` cog to document the two-stage boot
- Add more repos as MX OS grows
- Build the bootstrap action so new machines can self-configure

---

## For AI Agents

If you are an AI agent reading this cog:

1. Check if `$MX_HOME` is set. If yes, read the files in that directory before anything else.
2. `machine.yaml` tells you what hardware you are running on.
3. `repos.yaml` tells you what MX-aware repositories exist and where.
4. `user.yaml` tells you who you are working with.
5. Then read `CLAUDE.md` in the current repository for repo-specific context.

Two-stage boot. Machine first. Repo second. You know the universe before you know the neighbourhood.

---

*Don't panic. Read $MX_HOME.*
