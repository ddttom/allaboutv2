---
name: manual-mx-exec
title: "MX-EXEC Manual"
version: "1.0"
description: "Manual page for mx-exec and mx commands — MX OS action cog executor"
created: 2026-02-24
modified: 2026-02-24
author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published
category: mx-os
partOf: mx-os
tags: [manual, mx-exec, mx, action-cog, cli, shell]
audience: developers
readingLevel: technical
purpose: "Comprehensive reference for the mx-exec command and shell integration"
---

# MX-EXEC(1) — MX OS Action Cog Executor

## NAME

**mx-exec** — execute embedded scripts from action cogs

**mx** — short alias for mx-exec

## SYNOPSIS

```
mx-exec <cogname> [args...]
mx-exec --list
mx-exec --extract <cogname>
mx-exec --info <cogname>
mx-exec --help

mx <cogname> [args...]
mx list
mx extract <cogname>
mx info <cogname>
mx help
```

## DESCRIPTION

**mx-exec** finds and executes embedded scripts from action cogs (`.cog.md` files). Action cogs are self-contained documents that include both documentation and executable code.

The embedded script is extracted from a marked code fence and executed with bash. All arguments after the cogname are passed through to the script.

## COMMANDS

### mx-exec \<cogname\> [args...]

Run the embedded script from the specified cog. Arguments are passed through.

```bash
mx-exec installme --dry-run
mx-exec installme --mx-home-only
```

### mx-exec --list, mx list

List all available action cogs in the search paths.

```bash
mx list
```

Output:

```
Available Action Cogs:

  installme       Self-contained action cog for installing MX OS...

ℹ 1 action cog(s) found
```

### mx-exec --extract \<cogname\>, mx extract \<cogname\>

Extract the embedded script to stdout without executing it. Useful for inspection or piping to a file.

```bash
mx extract installme > setup.sh
mx extract installme | head -20
```

### mx-exec --info \<cogname\>, mx info \<cogname\>

Display metadata about a cog: name, version, description, embedded scripts, and available actions.

```bash
mx info installme
```

Output:

```
Cog: INSTALLME.cog.md
Path: ./INSTALLME.cog.md

Metadata:
  name: installme
  title: "MX OS Installation"
  version: "2.0"
  description: "Self-contained action cog..."

Embedded Scripts:
  @embedded:setup-script

Actions:
  setup
  diagnose
  extract
```

### mx-exec --help, mx help

Display help information.

## COG NAME RESOLUTION

When you provide a cogname, mx-exec searches for matching files using case variations:

| Input | Files checked |
|-------|---------------|
| `installme` | `installme.cog.md`, `INSTALLME.cog.md`, `Installme.cog.md`, `installMe.cog.md` |
| `my-cog` | `my-cog.cog.md`, `MY-COG.cog.md`, `MyCog.cog.md`, `myCog.cog.md` |

On macOS (case-insensitive filesystem), all variations match the same file.

Subdirectories are also checked:

```
./installme/installme.cog.md
```

## SEARCH PATHS

Cogs are searched in this order:

1. **Current directory** (`.`)
2. **$MX_HOME** (default: `~/.mx`)
3. **$MX_HUB** (if set)

First match wins.

## ENVIRONMENT VARIABLES

### MX_HOME

Location of MX OS home directory. Default: `~/.mx`

Contains machine context files (machine.yaml, user.yaml, repos.yaml).

### MX_HUB

Location of MX-hub repository. Used as a search path for cogs.

### COG_PATH

Set by mx-exec when running a cog. Contains the absolute path to the cog file being executed. Scripts can use this to reference their own YAML configuration.

## ACTION COG FORMAT

An action cog is a markdown file with:

1. **YAML frontmatter** — metadata, prerequisites, execute block
2. **Markdown prose** — human documentation
3. **Embedded code fence** — the actual script

### Marker Format

Scripts are embedded in marked code fences:

````markdown
```bash @embedded:script-id
#!/bin/bash
# Your script here
echo "Hello from action cog"
```
````

The marker `@embedded:script-id` allows tools to extract the code.

### Extraction Command

The extraction uses awk and sed:

```bash
awk '/^```bash @embedded:setup-script$/,/^```$/' file.cog.md | sed '1d;$d'
```

This:

1. Finds lines between the marked fence and closing fence
2. Removes the first line (fence opener)
3. Removes the last line (fence closer)
4. Returns pure script content

## EXAMPLES

### Run installation with dry-run

```bash
mx installme --dry-run
```

### List available cogs

```bash
mx list
```

### Extract script for inspection

```bash
mx extract installme | less
```

### Save extracted script

```bash
mx extract installme > /tmp/setup.sh
chmod +x /tmp/setup.sh
/tmp/setup.sh --help
```

### Run from anywhere (with shell integration)

```bash
# After adding to ~/.zshrc:
mx installme --mx-home-only
```

### Use command-not-found handler

```bash
# If shell integration is loaded:
installme --dry-run
# → Automatically runs: mx installme --dry-run
```

## SHELL INTEGRATION

Add to `~/.zshrc` for enhanced experience:

```bash
export MX_HOME="$HOME/.mx"
export MX_HUB="$HOME/github/MX-hub"  # Adjust to your clone location
export PATH="/opt/homebrew/opt/node@22/bin:$MX_HUB/scripts/bin:$PATH"
[[ -f "$MX_HUB/scripts/bin/mx-shell-integration.sh" ]] && source "$MX_HUB/scripts/bin/mx-shell-integration.sh"
```

This provides:

- **PATH setup** — `mx` and `mx-exec` available everywhere
- **Command-not-found handler** — type `installme` to run `mx installme`
- **Tab completion** — `mx inst<TAB>` completes to `mx installme`
- **Aliases** — `mxl` (list), `mxi` (info), `mxe` (extract)

## EXIT STATUS

- **0** — Success
- **1** — Cog not found or execution error
- **127** — Command not found (from embedded script)

## FILES

- `scripts/bin/mx` — Short command hub
- `scripts/bin/mx-exec` — Full executor
- `scripts/bin/mx-shell-integration.sh` — Shell setup
- `INSTALLME.cog.md` — Example action cog

## SEE ALSO

- [INSTALLME.cog.md](../../INSTALLME.cog.md) — Example action cog
- [cog-unified-spec.md](../../mx-canon/mx-the-gathering/deliverables/cog-unified-spec.md) — COG specification
- [scripts/bin/README.md](README.md) — Quick reference

## AUTHORS

Tom Cranstoun and Maxine (Claude)

Cog-Nova-MX Ltd — Making the web work for everyone and everything that uses it.

## VERSION

1.0 — February 2026
