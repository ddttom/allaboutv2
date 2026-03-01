---
name: installme
title: "MX OS Installation"
version: "2.1"
description: "Self-contained action cog for installing MX OS. Contains both instructions and executable script."

created: 2026-02-10
modified: 2026-02-24

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, mx-principles]
builds-on: [what-is-a-cog, what-is-mx-os, what-is-mx-environment, mx-boot]
tags: [install, setup, onboarding, sop-agent, diagnostics, prerequisites, mx-os, action-cog]

audience: ai-agents
reading-level: technical
purpose: "Self-contained installation cog. Machines read YAML + execute embedded script. Humans read markdown."

mx:
  contentType: "action-doc"
  runbook: "mx exec installme"

# Block architecture - describes what this cog contains
blocks:
  - definition:
      standards:
        - name: "The Gathering"
          version: "2.1-draft"
          scope: "cog metadata format, action execution"
  - code:
      id: setup-script
      language: bash
      purpose: "New Mac to operational MX OS"
      location: embedded
      marker: "```bash @embedded:setup-script"
      description: |
        Complete setup script that:
        - Reads prerequisites from this cog's YAML
        - Installs Xcode CLI, Homebrew, Node.js, Claude Code
        - Creates ~/.mx/ with machine context and shell integration
        - Runs npm install, initialises submodules
        - Verifies all systems operational

mx-environment:
  detection: "$MX_HOME"
  benefit: "Machine context available before installation"
  fallback: "Diagnose inline"

# Prerequisites for existing systems (Node.js already installed)
prerequisites:
  required:
    - name: git
      check: "git --version"
      minimum: "2.0"
      why: "Repository uses git submodules"
    - name: github-access
      check: "git ls-remote https://github.com/tomcranstoun/MX-hub.git HEAD"
      why: "Must be able to clone the repository (SSH or HTTPS)"
    - name: node
      check: "node --version"
      minimum: "20.0"
      why: "Build scripts, cog tools, and content generation"
    - name: npm
      check: "npm --version"
      minimum: "9.0"
      why: "Package management"
  optional:
    - name: pandoc
      check: "pandoc --version"
      minimum: "3.0"
      why: "PDF generation (book builds only)"
    - name: gh
      check: "gh --version"
      why: "GitHub CLI for PR workflows"

# Prerequisites for fresh Mac (nothing installed)
new-mac-prerequisites:
  required:
    - name: xcode-cli
      check: "xcode-select -p"
      install: "xcode-select --install"
      why: "Git and build tools"
    - name: homebrew
      check: "brew --version"
      install: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
      why: "Package manager for macOS"
    - name: node
      check: "node --version"
      install: "brew install node@22"
      minimum: "22.0"
      why: "MX OS runtime"
    - name: claude-code
      check: "claude --version"
      install: "npm install -g @anthropic-ai/claude-code"
      why: "AI partner interface"
  optional:
    - name: gh
      check: "gh --version"
      install: "brew install gh"
      why: "GitHub CLI for PR workflows"
    - name: pandoc
      check: "pandoc --version"
      install: "brew install pandoc"
      why: "PDF generation"

# Installation steps for existing systems
install-steps:
  - step: 1
    name: "Clone with submodules"
    command: "git clone --recurse-submodules <repo-url>"
    fallback: "git clone <repo-url> && cd repo && git submodule update --init --recursive"
  - step: 2
    name: "Install dependencies"
    command: "npm install"
  - step: 3
    name: "Verify"
    command: "npm run cog:stats"

# New Mac steps (uses embedded script)
new-mac-steps:
  - step: 1
    name: "Clone repository"
    command: "git clone --recurse-submodules https://github.com/tomcranstoun/MX-hub.git"
    bootstrap: "git triggers Xcode CLI tools prompt - accept and wait"
    prerequisite: "GitHub access configured (SSH or HTTPS)"
  - step: 2
    name: "Run embedded setup"
    command: "bash -c \"$(awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d')\""
    note: "Extracts and runs the embedded script from this cog"
    flags: "--auto --github-user <user> --name <name> --email <email>"
  - step: 3
    name: "Restart terminal"
    command: "exec $SHELL"
  - step: 4
    name: "Verify"
    command: "npm run cog:stats"

verify:
  commands:
    - "npm run cog:stats"
  success-criteria:
    - "npm install completes without errors"
    - "All submodules initialised"
    - "$MX_HOME exists and contains machine.yaml, user.yaml"

# Action execution block - makes this an action-doc
execute:
  runtime: bash
  command: mx cog installme
  actions:
    - name: setup
      description: "Run full MX OS setup (fresh Mac or existing system)"
      usage: "mx cog installme setup [--dry-run] [--mx-home-only] [--auto] [--github-user X] [--name X] [--email X] [--role X]"
      embedded-script: setup-script
      inputs:
        - name: dry-run
          type: boolean
          required: false
          description: "Show what would happen without doing it"
        - name: mx-home-only
          type: boolean
          required: false
          description: "Skip prerequisites, just set up ~/.mx/"
        - name: auto
          type: boolean
          required: false
          description: "Non-interactive mode — use defaults and skip confirmations"
        - name: github-user
          type: string
          required: false
          description: "GitHub username (used with --auto)"
        - name: name
          type: string
          required: false
          description: "Full name (used with --auto)"
        - name: email
          type: string
          required: false
          description: "Email address (used with --auto)"
        - name: role
          type: string
          required: false
          description: "Role (used with --auto, default: developer)"

    - name: diagnose
      description: "Check all prerequisites and report machine readiness"
      usage: "mx cog installme diagnose"
      outputs:
        - name: diagnostics
          type: object
          description: "Machine readiness report"

    - name: extract
      description: "Extract the embedded setup script to a file"
      usage: "mx cog installme extract [output-path]"
      outputs:
        - name: script-path
          type: string
          description: "Path to extracted script"
---

# INSTALLME.cog.md

**An action cog. Contains both instructions AND executable code.**

Stop hallucinating. Read this. Then run the embedded script.

---

## What This Is

This is an **action cog** — a self-contained document that includes:

1. **YAML metadata** — Machine-readable prerequisites, steps, and actions
2. **Markdown prose** — Human-readable documentation (what you're reading now)
3. **Embedded script** — The actual installation code (at the bottom of this file)

The embedded script reads its configuration FROM this same file. Single source of truth. The cog contains everything needed to install MX OS on a fresh Mac.

**Prerequisite:** GitHub access must be configured before running the installer — you need it to clone the repo.

---

## For AI Agents

Read the YAML frontmatter. It contains:

- **prerequisites** — For existing systems with Node.js
- **new-mac-prerequisites** — For fresh Macs (includes Homebrew, Node.js)
- **install-steps** — Sequential installation commands
- **execute.actions** — Available actions (setup, diagnose, extract)

To run the embedded script (**must be run from the MX-hub repo root**):

```bash
# Option 1: Extract and run (recommended)
mx cog installme extract && bash setup-script.sh

# Option 2: Run inline (extracts from this file)
bash -c "$(awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d')"

# Option 3: Non-interactive (for AI agents)
bash -c "$(awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d')" -- \
  --auto --github-user your-username --name "Your Name" --email "you@example.com"
```

**Note:** The script detects its working directory from `pwd`. Always `cd MX-hub` before running.

---

## For Humans

### Quick Install (Existing System)

```bash
git clone --recurse-submodules <repo-url>
cd MX-hub
npm install
git submodule update --init --recursive
```

### Fresh Mac Install

```bash
# Prerequisite: GitHub access configured (SSH or HTTPS)

# Clone (git triggers Xcode CLI tools install)
git clone --recurse-submodules https://github.com/tomcranstoun/MX-hub.git
cd MX-hub

# Extract and run the embedded script
awk '/^```bash @embedded:setup-script$/,/^```$/' scripts/cogs/INSTALLME.cog.md | sed '1d;$d' > /tmp/mx-setup.sh
bash /tmp/mx-setup.sh

# Restart terminal
exec $SHELL

# Verify
npm run cog:stats
```

---

## What Gets Installed

| Tool | Required | Purpose |
|------|----------|---------|
| Xcode CLI Tools | Yes | Git, compilers |
| Homebrew | Yes | Package manager |
| Node.js 22 | Yes | MX OS runtime |
| Claude Code | Yes | AI partner |
| GitHub CLI | No | PR workflows |
| Pandoc | No | PDF generation |

**MX Home (`~/.mx/`):**

- `machine.yaml` — Hardware/OS context
- `user.yaml` — Your identity
- `repos.yaml` — Repo registry
- `SOUL.md` — Machine identity

---

## Shell Integration

The setup script adds MX OS integration to your shell profile automatically. The following is added to `~/.zshrc`:

```bash
# MX OS
export MX_HOME="$HOME/.mx"
export MX_HUB="<your-mx-hub-path>"  # Set during installation to your actual clone path
export PATH="/opt/homebrew/opt/node@22/bin:$MX_HUB/scripts/bin:$PATH"
[[ -f "$MX_HUB/scripts/bin/mx-shell-integration.sh" ]] && source "$MX_HUB/scripts/bin/mx-shell-integration.sh"
```

Then reload: `source ~/.zshrc`

**What you get:**

| Feature | Command | Description |
|---------|---------|-------------|
| Run cog | `mx installme --dry-run` | Execute action cogs |
| List cogs | `mx list` or `mxl` | Show available cogs |
| Cog info | `mx info installme` | Show cog metadata |
| Extract | `mx extract installme` | Extract script to stdout |
| Command-not-found | `installme` | Automatically tries `mx installme` |
| Tab completion | `mx inst<TAB>` | Completes cog names |

**MX OS utilities in `scripts/bin/`:**

- `mx` — Command hub (short alias)
- `mx-exec` — Action cog executor (full version)
- `mx-shell-integration.sh` — Shell setup (PATH, completions, command-not-found)

---

## The Action Cog Pattern

This file demonstrates **action cogs** — documents that contain their own executable code.

**Structure:**

```
YAML frontmatter (metadata + execute block)
---
Markdown prose (human documentation)
---
Embedded code fence (@embedded:id marker)
```

**Why it matters:**

- Single source of truth (no separate script to sync)
- Self-documenting (the instructions ARE the documentation)
- Portable (one file contains everything)
- Versionable (git tracks the whole thing)

---

## Embedded Script

The following bash script is embedded in this cog. It reads prerequisites from the YAML above and executes them. The marker `@embedded:setup-script` allows tools to extract it.

```bash @embedded:setup-script
#!/bin/bash
# ---
# title: "MX OS Setup Script (Embedded in INSTALLME.cog.md)"
# version: "2.1"
# description: "Extracted from action cog. Reads prerequisites from parent cog's YAML."
# ---

set -euo pipefail

# Determine script location (handle both embedded and extracted execution)
if [ -n "${COG_PATH:-}" ]; then
  INSTALLME="$COG_PATH"
elif [ -f "INSTALLME.cog.md" ]; then
  INSTALLME="INSTALLME.cog.md"
elif [ -f "scripts/cogs/INSTALLME.cog.md" ]; then
  INSTALLME="scripts/cogs/INSTALLME.cog.md"
elif [ -f "INSTALLME.md" ]; then
  INSTALLME="INSTALLME.md"
else
  INSTALLME=""
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || pwd)"

# ─────────────────────────────────────────────
# YAML Parser — reads prerequisites from cog
# ─────────────────────────────────────────────
parse_prereqs() {
  local section="$1"

  if [ -z "$INSTALLME" ] || [ ! -f "$INSTALLME" ]; then
    echo "[]"
    return
  fi

  python3 << 'PYEOF'
import sys, re, json, os

def parse_yaml_frontmatter(filepath, section):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except:
        return []

    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL | re.MULTILINE)
    if not match:
        return []

    yaml_content = match.group(1)
    prereq_match = re.search(r'new-mac-prerequisites:\s*\n(.*?)(?=\n\w|\Z)', yaml_content, re.DOTALL)
    if not prereq_match:
        return []

    prereq_content = prereq_match.group(1)
    section_match = re.search(rf'{section}:\s*\n(.*?)(?=\n  \w|\Z)', prereq_content, re.DOTALL)
    if not section_match:
        return []

    section_content = section_match.group(1)
    items = []
    current_item = {}

    for line in section_content.split('\n'):
        line = line.rstrip()
        if not line.strip():
            continue
        if re.match(r'\s*-\s+name:', line):
            if current_item:
                items.append(current_item)
            current_item = {}
            m = re.search(r'name:\s*(.+)', line)
            if m: current_item['name'] = m.group(1).strip().strip('"\'')
        elif re.match(r'\s+check:', line):
            m = re.search(r'check:\s*(.+)', line)
            if m: current_item['check'] = m.group(1).strip().strip('"\'')
        elif re.match(r'\s+install:', line):
            m = re.search(r'install:\s*(.+)', line)
            if m: current_item['install'] = m.group(1).strip().strip('"\'')
        elif re.match(r'\s+minimum:', line):
            m = re.search(r'minimum:\s*(.+)', line)
            if m: current_item['minimum'] = m.group(1).strip().strip('"\'')
        elif re.match(r'\s+why:', line):
            m = re.search(r'why:\s*(.+)', line)
            if m: current_item['why'] = m.group(1).strip().strip('"\'')
    if current_item:
        items.append(current_item)
    return items

filepath = os.environ.get('INSTALLME_PATH', 'INSTALLME.cog.md')
section = os.environ.get('PREREQ_SECTION', 'required')
print(json.dumps(parse_yaml_frontmatter(filepath, section)))
PYEOF
}

get_version() {
  local name="$1"
  case "$name" in
    xcode-cli) echo "installed" ;;
    homebrew) brew --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+' | head -1 || echo "unknown" ;;
    node) node --version 2>/dev/null | tr -d 'v' || echo "unknown" ;;
    npm) npm --version 2>/dev/null || echo "unknown" ;;
    claude-code) claude --version 2>/dev/null | head -1 || echo "unknown" ;;
    gh) gh --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+' | head -1 || echo "unknown" ;;
    pandoc) pandoc --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+' | head -1 || echo "unknown" ;;
    *) echo "unknown" ;;
  esac
}

# ─────────────────────────────────────────────
# Flags
# ─────────────────────────────────────────────
DRY_RUN=false
MX_HOME_ONLY=false
SKIP_OPTIONAL=false
AUTO=false
FLAG_GITHUB_USER=""
FLAG_NAME=""
FLAG_EMAIL=""
FLAG_ROLE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    --mx-home-only) MX_HOME_ONLY=true; shift ;;
    --skip-optional) SKIP_OPTIONAL=true; shift ;;
    --auto) AUTO=true; shift ;;
    --github-user) FLAG_GITHUB_USER="$2"; shift 2 ;;
    --name) FLAG_NAME="$2"; shift 2 ;;
    --email) FLAG_EMAIL="$2"; shift 2 ;;
    --role) FLAG_ROLE="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: [script] [options]"
      echo "Options:"
      echo "  --dry-run         Show what would happen without doing it"
      echo "  --mx-home-only    Skip prerequisites, just set up ~/.mx/"
      echo "  --skip-optional   Skip optional tools (gh, pandoc)"
      echo "  --auto            Non-interactive mode (use defaults, skip confirmations)"
      echo "  --github-user X   GitHub username (for --auto)"
      echo "  --name X          Full name (for --auto)"
      echo "  --email X         Email address (for --auto)"
      echo "  --role X          Role (for --auto, default: developer)"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ─────────────────────────────────────────────
# Colours
# ─────────────────────────────────────────────
if [ -t 1 ]; then
  GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[0;33m'
  BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'
else
  GREEN='' RED='' YELLOW='' BLUE='' CYAN='' BOLD='' RESET=''
fi

pass() { echo -e "  ${GREEN}✓${RESET} $1"; }
fail() { echo -e "  ${RED}✗${RESET} $1"; }
warn() { echo -e "  ${YELLOW}⚠${RESET} $1"; }
info() { echo -e "  ${BLUE}ℹ${RESET} $1"; }
header() { echo -e "\n${BOLD}${CYAN}$1${RESET}\n"; }
dry() { echo -e "  ${YELLOW}[dry-run]${RESET} Would: $1"; }

confirm() {
  local prompt="$1"
  if [ "$AUTO" = true ]; then
    return 0  # Auto-accept all confirmations
  fi
  local response
  read -r -p "$prompt [Y/n] " response
  [[ -z "$response" || "$response" =~ ^[Yy] ]]
}

# ─────────────────────────────────────────────
# Banner
# ─────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║          MX OS — Action Cog Setup                        ║${RESET}"
echo -e "${BOLD}║    Executing embedded script from INSTALLME.cog.md       ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════╝${RESET}"

if [ "$DRY_RUN" = true ]; then
  echo ""
  warn "DRY RUN MODE — no changes will be made"
fi

if [ "$AUTO" = true ]; then
  echo ""
  info "AUTO MODE — using defaults, skipping confirmations"
fi

if [ -n "$INSTALLME" ]; then
  info "Reading config from: $INSTALLME"
else
  warn "No cog file found — using fallback defaults"
fi

# ─────────────────────────────────────────────
# Phase 0: Identity Collection
# ─────────────────────────────────────────────
header "Phase 0: Your Identity"

info "We need a few details to configure your workspace."
echo ""

if [ -n "$FLAG_GITHUB_USER" ]; then
  GITHUB_USERNAME="$FLAG_GITHUB_USER"
elif [ "$DRY_RUN" = true ]; then
  dry "Would prompt for GitHub username"
  GITHUB_USERNAME="dryrun-user"
elif [ "$AUTO" = true ]; then
  GITHUB_USERNAME="$(whoami)"
  warn "Using system username: $GITHUB_USERNAME"
else
  read -r -p "  GitHub username: " GITHUB_USERNAME
  [ -z "$GITHUB_USERNAME" ] && GITHUB_USERNAME="$(whoami)" && warn "Using: $GITHUB_USERNAME"
fi
pass "GitHub username: $GITHUB_USERNAME"

if [ -n "$FLAG_NAME" ]; then
  USER_FULL_NAME="$FLAG_NAME"
elif [ "$DRY_RUN" = true ]; then
  dry "Would prompt for full name"
  USER_FULL_NAME="Dry Run User"
elif [ "$AUTO" = true ]; then
  USER_FULL_NAME="$GITHUB_USERNAME"
else
  read -r -p "  Your full name: " USER_FULL_NAME
  [ -z "$USER_FULL_NAME" ] && USER_FULL_NAME="$GITHUB_USERNAME"
fi
pass "Full name: $USER_FULL_NAME"

GITHUB_EMAIL="${GITHUB_USERNAME}@users.noreply.github.com"
if [ -n "$FLAG_EMAIL" ]; then
  USER_EMAIL="$FLAG_EMAIL"
elif [ "$DRY_RUN" = true ]; then
  USER_EMAIL="$GITHUB_EMAIL"
elif [ "$AUTO" = true ]; then
  USER_EMAIL="$GITHUB_EMAIL"
else
  read -r -p "  Email [$GITHUB_EMAIL]: " USER_EMAIL
  [ -z "$USER_EMAIL" ] && USER_EMAIL="$GITHUB_EMAIL"
fi
pass "Email: $USER_EMAIL"

if [ -n "$FLAG_ROLE" ]; then
  USER_ROLE="$FLAG_ROLE"
elif [ "$DRY_RUN" = true ]; then
  USER_ROLE="developer"
elif [ "$AUTO" = true ]; then
  USER_ROLE="developer"
else
  read -r -p "  Your role [developer]: " USER_ROLE
  [ -z "$USER_ROLE" ] && USER_ROLE="developer"
fi
pass "Role: $USER_ROLE"

if [ "$DRY_RUN" = true ] || [ "$AUTO" = true ]; then
  USER_COMPANY=""
else
  read -r -p "  Company (optional): " USER_COMPANY
fi
[ -n "$USER_COMPANY" ] && pass "Company: $USER_COMPANY"

echo ""
pass "Identity collected"

# Configure git globals (you already have git since you cloned the repo)
if [ "$DRY_RUN" = true ]; then
  dry "Configure git user.name and user.email"
else
  git config --global user.name "$USER_FULL_NAME"
  git config --global user.email "$USER_EMAIL"
  pass "Git configured: $USER_FULL_NAME <$USER_EMAIL>"
fi

# ─────────────────────────────────────────────
# Phase 1: Prerequisites (from cog YAML)
# ─────────────────────────────────────────────
if [ "$MX_HOME_ONLY" = false ]; then
  header "Phase 1: Prerequisites"

  if [[ "$(uname -s)" != "Darwin" ]]; then
    fail "This script is for macOS only"
    exit 1
  fi
  pass "macOS $(sw_vers -productVersion 2>/dev/null || echo 'detected')"

  # Parse required prerequisites
  REQUIRED_JSON=$(INSTALLME_PATH="$INSTALLME" PREREQ_SECTION="required" parse_prereqs "required")

  echo "$REQUIRED_JSON" | python3 -c "
import sys, json, shlex
items = json.load(sys.stdin)
for i, item in enumerate(items):
    for key in ['name', 'check', 'install', 'minimum', 'why']:
        val = item.get(key, '')
        print(f'PREREQ_{i}_{key.upper()}={shlex.quote(val)}')
print(f'PREREQ_COUNT={len(items)}')
" > /tmp/mx_prereqs.sh
  source /tmp/mx_prereqs.sh

  for ((i=0; i<PREREQ_COUNT; i++)); do
    eval "NAME=\$PREREQ_${i}_NAME"
    eval "CHECK=\$PREREQ_${i}_CHECK"
    eval "INSTALL=\$PREREQ_${i}_INSTALL"
    eval "MIN=\$PREREQ_${i}_MINIMUM"
    eval "WHY=\$PREREQ_${i}_WHY"

    [ -z "$NAME" ] && continue

    if eval "$CHECK" &>/dev/null; then
      VERSION=$(get_version "$NAME")
      [ -n "$MIN" ] && pass "$NAME $VERSION (min: $MIN)" || pass "$NAME installed"
    else
      if [ "$DRY_RUN" = true ]; then
        dry "Install $NAME ($WHY)"
      else
        case "$NAME" in
          xcode-cli)
            info "Installing Xcode CLI Tools..."
            xcode-select --install 2>/dev/null || true
            [ "$AUTO" = false ] && read -r -p "Press Enter after installation... "
            xcode-select -p &>/dev/null && pass "Xcode CLI installed" || { fail "Failed"; exit 1; }
            ;;
          homebrew)
            if confirm "Install Homebrew? ($WHY)"; then
              /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
              [[ -f "/opt/homebrew/bin/brew" ]] && eval "$(/opt/homebrew/bin/brew shellenv)"
              [[ -f "/usr/local/bin/brew" ]] && eval "$(/usr/local/bin/brew shellenv)"
              command -v brew &>/dev/null && pass "Homebrew installed" || { fail "Failed"; exit 1; }
            else
              fail "Homebrew required"; exit 1
            fi
            ;;
          node)
            if confirm "Install Node.js ${MIN:-22}? ($WHY)"; then
              brew install "node@${MIN:-22}"
              brew link --overwrite "node@${MIN:-22}" 2>/dev/null || true
              # Ensure keg-only node is in PATH for this session
              export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
              command -v node &>/dev/null && pass "Node.js installed" || { fail "Failed"; exit 1; }
            else
              fail "Node.js required"; exit 1
            fi
            ;;
          claude-code)
            info "Installing Claude Code..."
            npm install -g @anthropic-ai/claude-code 2>/dev/null && pass "Claude Code installed" || warn "Install manually"
            ;;
          *)
            [ -n "$INSTALL" ] && { info "Installing $NAME..."; eval "$INSTALL" && pass "$NAME installed" || fail "Failed"; }
            ;;
        esac
      fi
    fi
  done

  command -v npm &>/dev/null && pass "npm $(npm --version)" || { fail "npm missing"; exit 1; }

  # Optional prerequisites
  if [ "$SKIP_OPTIONAL" = false ]; then
    echo ""
    info "Optional tools..."

    OPTIONAL_JSON=$(INSTALLME_PATH="$INSTALLME" PREREQ_SECTION="optional" parse_prereqs "optional")

    echo "$OPTIONAL_JSON" | python3 -c "
import sys, json, shlex
items = json.load(sys.stdin)
for i, item in enumerate(items):
    for key in ['name', 'check', 'install', 'why']:
        val = item.get(key, '')
        print(f'OPT_{i}_{key.upper()}={shlex.quote(val)}')
print(f'OPT_COUNT={len(items)}')
" > /tmp/mx_opt.sh
    source /tmp/mx_opt.sh

    for ((i=0; i<OPT_COUNT; i++)); do
      eval "NAME=\$OPT_${i}_NAME"
      eval "CHECK=\$OPT_${i}_CHECK"
      eval "INSTALL=\$OPT_${i}_INSTALL"
      eval "WHY=\$OPT_${i}_WHY"

      [ -z "$NAME" ] && continue

      if eval "$CHECK" &>/dev/null; then
        pass "$NAME $(get_version "$NAME")"
      elif [ "$DRY_RUN" = true ]; then
        dry "Install $NAME ($WHY)"
      elif confirm "Install $NAME? $WHY"; then
        [ -n "$INSTALL" ] && eval "$INSTALL" && pass "$NAME installed" || warn "Failed"
      else
        warn "$NAME skipped"
      fi
    done
  fi

  rm -f /tmp/mx_prereqs.sh /tmp/mx_opt.sh
  echo ""
  pass "Prerequisites complete"
fi

# ─────────────────────────────────────────────
# Phase 2: MX Home
# ─────────────────────────────────────────────
header "Phase 2: MX Home"

MX_HOME_DIR="$HOME/.mx"

[ -d "$MX_HOME_DIR" ] && pass "\$MX_HOME exists" || { [ "$DRY_RUN" = true ] && dry "Create $MX_HOME_DIR" || { mkdir -p "$MX_HOME_DIR"; pass "Created $MX_HOME_DIR"; }; }

# machine.yaml
if [ -f "$MX_HOME_DIR/machine.yaml" ]; then
  pass "machine.yaml exists"
elif [ "$DRY_RUN" = true ]; then
  dry "Create machine.yaml"
else
  cat > "$MX_HOME_DIR/machine.yaml" << EOF
hostname: $(hostname)
os: $(uname -s)
os-version: $(sw_vers -productVersion 2>/dev/null || echo "unknown")
architecture: $(uname -m)
role: development
mx-os:
  version: "2.0"
  deployed: $(date +%Y-%m-%d)
  home: ~/.mx
EOF
  pass "machine.yaml created"
fi

# repos.yaml
if [ -f "$MX_HOME_DIR/repos.yaml" ]; then
  pass "repos.yaml exists"
elif [ "$DRY_RUN" = true ]; then
  dry "Create repos.yaml"
else
  echo "repos: []" > "$MX_HOME_DIR/repos.yaml"
  pass "repos.yaml created"
fi

# user.yaml
if [ -f "$MX_HOME_DIR/user.yaml" ]; then
  pass "user.yaml exists"
elif [ "$DRY_RUN" = true ]; then
  dry "Create user.yaml"
else
  cat > "$MX_HOME_DIR/user.yaml" << EOF
name: "$USER_FULL_NAME"
email: "$USER_EMAIL"
role: "$USER_ROLE"
company: "$USER_COMPANY"
github: "$GITHUB_USERNAME"
EOF
  pass "user.yaml created"
fi

# SOUL.md
if [ -f "$MX_HOME_DIR/SOUL.md" ]; then
  pass "SOUL.md exists"
elif [ "$DRY_RUN" = true ]; then
  dry "Create SOUL.md"
else
  cat > "$MX_HOME_DIR/SOUL.md" << EOF
# Machine Identity

This is **$(hostname)** — MX OS, operated by **$USER_FULL_NAME** (@$GITHUB_USERNAME).

See: machine.yaml, user.yaml, repos.yaml
EOF
  pass "SOUL.md created"
fi

# Shell profile — full MX OS integration
SHELL_NAME=$(basename "$SHELL")
[[ "$SHELL_NAME" == "zsh" ]] && PROFILE="$HOME/.zshrc" || PROFILE="$HOME/.bash_profile"

if grep -q "MX_HOME" "$PROFILE" 2>/dev/null; then
  pass "MX OS already in profile"
elif [ "$DRY_RUN" = true ]; then
  dry "Add MX OS to $PROFILE"
elif confirm "Add MX OS shell integration to $PROFILE?"; then
  cat >> "$PROFILE" << MXEOF

# MX OS
export MX_HOME="\$HOME/.mx"
export MX_HUB="$SCRIPT_DIR"
export PATH="/opt/homebrew/opt/node@22/bin:\$MX_HUB/scripts/bin:\$PATH"
[[ -f "\$MX_HUB/scripts/bin/mx-shell-integration.sh" ]] && source "\$MX_HUB/scripts/bin/mx-shell-integration.sh"
MXEOF
  pass "MX OS shell integration added to $PROFILE"
  info "After restart: mx list, mx installme --dry-run"
fi

export MX_HOME="$MX_HOME_DIR"
export MX_HUB="$SCRIPT_DIR"

# ─────────────────────────────────────────────
# Phase 3: Repository
# ─────────────────────────────────────────────
header "Phase 3: Repository"

if [ "$DRY_RUN" = true ]; then
  dry "Run npm install"
  dry "Initialise git submodules"
  dry "Register MX-hub in repos.yaml"
else
  info "Installing npm dependencies..."
  (cd "$SCRIPT_DIR" && npm install) && pass "npm install complete" || { fail "npm install failed"; exit 1; }

  info "Initialising submodules..."
  (cd "$SCRIPT_DIR" && git submodule update --init --recursive) && pass "Submodules initialised" || warn "Submodule init had issues"

  # Register this repo in ~/.mx/repos.yaml
  if [ -f "$MX_HOME_DIR/repos.yaml" ]; then
    if grep -q "$SCRIPT_DIR" "$MX_HOME_DIR/repos.yaml" 2>/dev/null; then
      pass "MX-hub already registered in repos.yaml"
    else
      cat > "$MX_HOME_DIR/repos.yaml" << EOF
repos:
  - name: MX-hub
    path: "$SCRIPT_DIR"
    role: hub
    registered: $(date +%Y-%m-%d)
EOF
      pass "MX-hub registered in repos.yaml"
    fi
  fi
fi

# ─────────────────────────────────────────────
# Phase 4: Verification
# ─────────────────────────────────────────────
header "Phase 4: Verification"

VERIFY_PASS=true

# Check MX_HOME
[ -d "$MX_HOME_DIR" ] && pass "\$MX_HOME exists" || { fail "\$MX_HOME missing"; VERIFY_PASS=false; }
[ -f "$MX_HOME_DIR/machine.yaml" ] && pass "machine.yaml present" || { fail "machine.yaml missing"; VERIFY_PASS=false; }
[ -f "$MX_HOME_DIR/user.yaml" ] && pass "user.yaml present" || { fail "user.yaml missing"; VERIFY_PASS=false; }

# Check repo state
[ -d "$SCRIPT_DIR/node_modules" ] && pass "node_modules present" || { fail "node_modules missing"; VERIFY_PASS=false; }
grep -q "$SCRIPT_DIR" "$MX_HOME_DIR/repos.yaml" 2>/dev/null && pass "MX-hub registered in repos.yaml" || warn "MX-hub not in repos.yaml"

# Check tools
command -v node &>/dev/null && pass "node $(node --version)" || { fail "node not in PATH"; VERIFY_PASS=false; }
command -v npm &>/dev/null && pass "npm $(npm --version)" || { fail "npm not in PATH"; VERIFY_PASS=false; }

if [ "$VERIFY_PASS" = true ]; then
  echo ""
  pass "All systems operational"
else
  echo ""
  fail "Some checks failed — review output above"
fi

# ─────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════════╗${RESET}"
if [ "$DRY_RUN" = true ]; then
  echo -e "${BOLD}║              DRY RUN COMPLETE                            ║${RESET}"
else
  echo -e "${BOLD}║          ${GREEN}MX OS — Setup Complete${RESET}${BOLD}                        ║${RESET}"
fi
echo -e "${BOLD}╚══════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  Identity: $USER_FULL_NAME (@$GITHUB_USERNAME)"
echo -e "  MX_HOME:  $MX_HOME_DIR"
echo ""
[ "$DRY_RUN" = false ] && echo -e "  → Restart terminal: exec \$SHELL"
echo -e "  → Verify: npm run cog:stats"
echo ""
```

---

*Stop guessing. Start reading. Then run the embedded code.*
