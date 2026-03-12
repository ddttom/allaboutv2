---
title: "All My GitHub Repositories"
version: "1.0"
description: "Self-updating action cog that scans GitHub repos and generates a classified, sorted table."

created: 2026-02-24
modified: 2026-02-24

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, installme]
  tags: [github, inventory, catalog, action-cog, self-updating]

  audience: agents
  readingLevel: advanced

  contentType: "action-doc"
  runbook: "mx exec allmygithubs"
  # Block architecture
  blocks:
    - definition:
        standards:
          - name: "The Gathering"
            version: "2.1-draft"
            scope: "cog metadata format, action execution"
    - code:
        id: scan-repos
        language: bash
        purpose: "Fetch GitHub repos via gh CLI, classify, and update table in this cog"
        location: embedded
        marker: "```bash @embedded:scan-repos"
        description: |
          Scans all GitHub repositories using gh API:
          - Fetches personal repos + organization repos
          - Classifies by name prefix → topics → 'Other'
          - Categories: MX 🔷, Web, Tools, Archive, Other
          - Sorts: MX first, then by category, then by last push
          - Updates the table section in this cog file

  prerequisites:
    required:
      - name: gh
        check: "gh --version"
        why: "GitHub CLI for API access"
      - name: jq
        check: "jq --version"
        why: "JSON parsing"
    auth:
      - name: github-auth
        check: "gh auth status"
        why: "Authenticated to fetch private repos"

  classification:
    rules:
      - pattern: "^[Mm][Xx]-"
        type: "MX"
        icon: "🔷"
      - pattern: "^web-|^allabout|^site-"
        type: "Web"
        icon: ""
      - pattern: "^tool-|^cli-|^util-|^script-"
        type: "Tools"
        icon: ""
    archive-conditions:
      - "GitHub archived flag is true"
      - "Last push older than 12 months"
    fallback: "Other"

  sort-order:
    - "MX"
    - "Web"
    - "Tools"
    - "Other"
    - "Archive"
  sub-sort: "pushed_at DESC"

  output:
    format: "markdown-table"
    columns: ["Name", "Type", "Description", "Last Push", "Link"]
    location: "self (replaces <!-- TABLE --> section)"

  execute:
    runtime: bash
    command: mx cog allmygithubs
    actions:
      - name: scan
        description: "Scan GitHub repos and update the table in this cog"
        usage: "mx cog allmygithubs scan"
        embedded-script: scan-repos
        outputs:
          - name: table
            type: markdown
            description: "Updated markdown table"

      - name: dry-run
        description: "Show what would be generated without updating the cog"
        usage: "mx cog allmygithubs scan --dry-run"
        embedded-script: scan-repos
---

# mx-allmygithubs.cog.md

**An action cog. Scans your GitHub and updates itself with a classified repo table.**

---

## What This Is

This is a **self-updating action cog** that:

1. **Scans GitHub** — Fetches all repos from your account and organizations
2. **Classifies** — Groups by type (MX, Web, Tools, Archive, Other)
3. **Sorts** — MX repos first, then by category, then by most recent push
4. **Updates itself** — Writes the table back into this file

The embedded script reads configuration FROM this cog's YAML and writes results back into this file. Single source of truth.

---

## For AI Agents

Read the YAML frontmatter. It contains:

- **prerequisites** — Required tools (gh, jq) and auth status
- **classification.rules** — How repos are categorized
- **sort-order** — Category priority (MX on top)
- **execute.actions** — Available actions (scan)

To run:

```bash
# Via mx command
mx allmygithubs

# Or extract and run directly
bash -c "$(awk '/^```bash @embedded:scan-repos$/,/^```$/' mx-allmygithubs.cog.md | sed '1d;$d')"
```

---

## For Humans

### Quick Usage

```bash
# Scan and update the table
mx allmygithubs

# Preview without updating
mx allmygithubs --dry-run

# Or run directly
./mx-allmygithubs.cog.md scan
```

### Prerequisites

| Tool | Required | Check | Install |
|------|----------|-------|---------|
| gh | Yes | `gh --version` | `brew install gh` |
| jq | Yes | `jq --version` | `brew install jq` |
| Auth | Yes | `gh auth status` | `gh auth login` |

---

## Classification Logic

Repos are classified in this priority order:

1. **Name prefix** — `mx-*`, `MX-*` → MX; `web-*`, `allabout*` → Web; `tool-*`, `cli-*` → Tools
2. **GitHub topics** — If repo has topic `mx`, `machine-experience` → MX
3. **Archive check** — Archived OR no push in 12+ months → Archive
4. **Fallback** — Everything else → Other

---

## Repository Table

<!-- TABLE:START -->
| Name | Type | Description | Last Push | Link |
|------|------|-------------|-----------|------|
| 🔷 MX-hub | MX | Hub repository orchestrating MX (Machine Experience) series  | 2026-02-24 | [MX-hub](https://github.com/Digital-Domain-Technologies-Ltd/MX-hub) |
| 🔷 MX-ingest | MX |  | 2026-02-24 | [MX-ingest](https://github.com/Digital-Domain-Technologies-Ltd/MX-ingest) |
| 🔷 MX-CRM | MX | Customer Relationship Management - Private repository for cl | 2026-02-24 | [MX-CRM](https://github.com/Digital-Domain-Technologies-Ltd/MX-CRM) |
| 🔷 MX-business-planning | MX | Private business planning and strategy documents for MX Seri | 2026-02-24 | [MX-business-planning](https://github.com/Digital-Domain-Technologies-Ltd/MX-business-planning) |
| 🔷 MX-Gathering | MX | Community building resources for MX Series - Events, discuss | 2026-02-23 | [MX-Gathering](https://github.com/Digital-Domain-Technologies-Ltd/MX-Gathering) |
| 🔷 mx-collaboration | MX |  | 2026-02-23 | [mx-collaboration](https://github.com/ddttom/mx-collaboration) |
| 🔷 MX-outputs | MX | Generated content and deliverables for the MX project - book | 2026-02-23 | [MX-outputs](https://github.com/Digital-Domain-Technologies-Ltd/MX-outputs) |
| 🔷 MX-Audit | MX |  | 2026-02-20 | [MX-Audit](https://github.com/digital-domain-technologies/MX-Audit) |
| 🔷 MX-template-repo | MX | Intent Repository template - a ready-to-use starting point f | 2026-02-18 | [MX-template-repo](https://github.com/digital-domain-technologies/MX-template-repo) |
| 🔷 MX-digital-twin | MX | MX Digital Twin - Part of the MX series | 2026-02-06 | [MX-digital-twin](https://github.com/Digital-Domain-Technologies-Ltd/MX-digital-twin) |
| 🔷 mx-collaboration-with | MX |  | 2026-02-03 | [mx-collaboration-with](https://github.com/ddttom/mx-collaboration-with) |
| 🔷 mx-exit-strategy | MX | Strategic planning repository for business exit strategy dev | 2026-01-30 | [mx-exit-strategy](https://github.com/Digital-Domain-Technologies-Ltd/mx-exit-strategy) |
| 🔷 MX-Gathering | MX | MX Gathering - Community resources, patterns, and examples | 2026-01-28 | [MX-Gathering](https://github.com/MX-Experience/MX-Gathering) |
| 🔷 MX: The Handbook | MX | MX: The Handbook - Practical implementation guide for AI-ready ar | 2026-01-28 | [MX: The Handbook](https://github.com/MX-Experience/MX-Handbook) |
| 🔷 MX-Bible | MX | The MX Bible - Comprehensive guide to Machine Experience pri | 2026-01-28 | [MX-Bible](https://github.com/MX-Experience/MX-Bible) |
| 🔷 MX-Legal | MX | Private repository for MX intellectual property documentatio | 2026-01-27 | [MX-Legal](https://github.com/Digital-Domain-Technologies-Ltd/MX-Legal) |
| allaboutv2 | Web | allabout | 2026-02-24 | [allaboutv2](https://github.com/ddttom/allaboutv2) |
| iCal | Other |  | 2026-02-23 | [iCal](https://github.com/ddttom/iCal) |
| Notes | Other | My notes | 2026-02-21 | [Notes](https://github.com/ddttom/Notes) |
| invisible-users | Other |  | 2026-01-30 | [invisible-users](https://github.com/ddttom/invisible-users) |
| intent-cms | Other | Content management where assets carry their own maintenance  | 2026-01-30 | [intent-cms](https://github.com/digital-domain-technologies/intent-cms) |
| .github | Other | Organization profile and community health files | 2026-01-28 | [.github](https://github.com/MX-Experience/.github) |
| invisible-users-outputs | Other | Generated content and materials for The Invisible Users book | 2026-01-27 | [invisible-users-outputs](https://github.com/Digital-Domain-Technologies-Ltd/invisible-users-outputs) |
| invisible-users-bible | Other | The Invisible Users: Designing the Web for AI Agents and Eve | 2026-01-26 | [invisible-users-bible](https://github.com/Digital-Domain-Technologies-Ltd/invisible-users-bible) |
| invisible-users-slim | Other | Don't Make AI Think: Designing Web Interfaces for AI Agents  | 2026-01-21 | [invisible-users-slim](https://github.com/Digital-Domain-Technologies-Ltd/invisible-users-slim) |
| Zettel | Other | My zetteel repository  | 2026-01-21 | [Zettel](https://github.com/ddttom/Zettel) |
| vue-with-eds | Other |  | 2026-01-19 | [vue-with-eds](https://github.com/ddttom/vue-with-eds) |
| ucp | Other | Specification and documentation for the Universal Commerce P | 2026-01-12 | [ucp](https://github.com/ddttom/ucp) |
| invisible-users-manuscript | Other | Manuscript for invisible users book | 2026-01-09 | [invisible-users-manuscript](https://github.com/ddttom/invisible-users-manuscript) |
| my-pa11y-project | Other | A11LY PROJECT | 2026-01-05 | [my-pa11y-project](https://github.com/ddttom/my-pa11y-project) |
| mac-blueprint | Other |  | 2025-12-19 | [mac-blueprint](https://github.com/ddttom/mac-blueprint) |
| calendar-sidebar | Other |  | 2025-12-14 | [calendar-sidebar](https://github.com/ddttom/calendar-sidebar) |
| bun-scripts | Other |  | 2025-12-13 | [bun-scripts](https://github.com/ddttom/bun-scripts) |
| cloudflare-worker | Other |  | 2025-12-13 | [cloudflare-worker](https://github.com/ddttom/cloudflare-worker) |
| webcomponents-with-eds | Other | A collection of lightweight, high-performance web components | 2025-12-12 | [webcomponents-with-eds](https://github.com/ddttom/webcomponents-with-eds) |
| aem-worker | Other |  | 2025-12-09 | [aem-worker](https://github.com/ddttom/aem-worker) |
| helix-website | Other | The Helix website https://www.aem.live/ | 2025-12-08 | [helix-website](https://github.com/ddttom/helix-website) |
| bun-docs | Other | Incredibly fast JavaScript runtime, bundler, test runner, an | 2025-12-05 | [bun-docs](https://github.com/ddttom/bun-docs) |
| fixEcalendar | Other |  | 2025-12-05 | [fixEcalendar](https://github.com/ddttom/fixEcalendar) |
| plusplus | Other | Helix/Frankline/Edge PlusPlus | 2025-11-29 | [plusplus](https://github.com/Digital-Domain-Technologies-Ltd/plusplus) |
| edgeservices | Other | testing aem edge services | 2025-11-29 | [edgeservices](https://github.com/ddttom/edgeservices) |
| pim | Other | pim | 2025-11-29 | [pim](https://github.com/ddttom/pim) |
| projectX | Other |  | 2025-11-29 | [projectX](https://github.com/ddttom/projectX) |
| usb-cleaner | Other |  USBCleaner is a lightweight macOS utility designed to help  | 2025-11-27 | [usb-cleaner](https://github.com/ddttom/usb-cleaner) |
| author-kit | Other | Powerfully simple authoring for Edge Delivery | 2025-11-14 | [author-kit](https://github.com/ddttom/author-kit) |
| cc-trace | Other | Claude Code CLI skill: Interactive assistant for interceptin | 2025-11-09 | [cc-trace](https://github.com/ddttom/cc-trace) |
| advanced-cdn | Other |  | 2025-10-22 | [advanced-cdn](https://github.com/ddttom/advanced-cdn) |
| skills | Other | Public repository for Skills | 2025-10-18 | [skills](https://github.com/ddttom/skills) |
| homehub | Other | A lightweight, no-login, self-hosted family utility for your | 2025-10-07 | [homehub](https://github.com/ddttom/homehub) |
| AI-Web-Browser | Other | macOS AI-enhanced web browser built with SwiftUI and Apple M | 2025-09-06 | [AI-Web-Browser](https://github.com/ddttom/AI-Web-Browser) |
| geo-images | Other |  | 2025-08-29 | [geo-images](https://github.com/ddttom/geo-images) |
| adjuster | Other | A Photo Adjuster | 2025-08-05 | [adjuster](https://github.com/ddttom/adjuster) |
| spectrum-with-eds | Other |  | 2025-06-19 | [spectrum-with-eds](https://github.com/ddttom/spectrum-with-eds) |
| react-with-eds | Other |  | 2025-06-13 | [react-with-eds](https://github.com/ddttom/react-with-eds) |
| spa-with-eds | Other |  | 2025-06-10 | [spa-with-eds](https://github.com/ddttom/spa-with-eds) |
| doc2web | Other | create a web page from a docx | 2025-06-04 | [doc2web](https://github.com/ddttom/doc2web) |
| mirror | Other | flip images horizontally | 2025-05-28 | [mirror](https://github.com/ddttom/mirror) |
| ai-with-mac | Other | Introduction to AI with Mac | 2025-05-24 | [ai-with-mac](https://github.com/ddttom/ai-with-mac) |
| mlx-llm-tutorial | Other | A tutorial on Apple MLX and LLM | 2025-05-16 | [mlx-llm-tutorial](https://github.com/ddttom/mlx-llm-tutorial) |
| CodeProject.AI-Server | Other | CodeProject.AI Server is a self contained service that softw | 2025-03-13 | [CodeProject.AI-Server](https://github.com/ddttom/CodeProject.AI-Server) |
| invisible-users-manuscript | Archive |  | 2026-02-13 | [invisible-users-manuscript](https://github.com/Digital-Domain-Technologies-Ltd/invisible-users-manuscript) |
| MX-The-Handbook | Archive | MX-The Handbook: Designing Web Interfaces for AI Agents - Pr | 2026-02-13 | [MX-The-Handbook](https://github.com/Digital-Domain-Technologies-Ltd/MX-The-Handbook) |
| invisible-users-appendices | Archive | Shared appendices for The Invisible Users book series - Impl | 2026-02-13 | [invisible-users-appendices](https://github.com/Digital-Domain-Technologies-Ltd/invisible-users-appendices) |
| invisible-users-code-examples | Archive | AI-friendly web patterns - Code examples demonstrating good  | 2026-02-10 | [invisible-users-code-examples](https://github.com/Digital-Domain-Technologies-Ltd/invisible-users-code-examples) |
| ContentID | Archive | Content ID POC | 2025-01-31 | [ContentID](https://github.com/ddttom/ContentID) |
| parser | Archive | Text Parser | 2024-12-29 | [parser](https://github.com/ddttom/parser) |
| fzf-tab | Archive | Replace zsh's default completion selection menu with fzf! | 2024-11-06 | [fzf-tab](https://github.com/ddttom/fzf-tab) |
| block-ai | Archive |  | 2024-10-30 | [block-ai](https://github.com/ddttom/block-ai) |
| claude-dev | Archive | Autonomous coding agent right in your IDE, capable of creati | 2024-09-30 | [claude-dev](https://github.com/ddttom/claude-dev) |
| bff | Archive | Backend for FrontEnd | 2024-07-18 | [bff](https://github.com/Digital-Domain-Technologies-Ltd/bff) |
| csc | Archive |  | 2024-06-29 | [csc](https://github.com/ddttom/csc) |
| cors-anywhere | Archive | CORS Anywhere is a NodeJS reverse proxy which adds CORS head | 2024-06-24 | [cors-anywhere](https://github.com/ddttom/cors-anywhere) |
| monoplusplus | Archive | The mono repo version of plusplus, all configuration done | 2024-06-18 | [monoplusplus](https://github.com/Digital-Domain-Technologies-Ltd/monoplusplus) |
| plusplusconfig | Archive | sample configuration for plusplus | 2024-06-16 | [plusplusconfig](https://github.com/Digital-Domain-Technologies-Ltd/plusplusconfig) |
| plusplustools | Archive | toolset for plusplus | 2024-05-25 | [plusplustools](https://github.com/Digital-Domain-Technologies-Ltd/plusplustools) |
| universal-editor-sample-editable-app | Archive |  | 2024-05-23 | [universal-editor-sample-editable-app](https://github.com/ddttom/universal-editor-sample-editable-app) |
| aem-experimentation | Archive | A lightweight Franklin plugin for experimentation and segmen | 2024-04-24 | [aem-experimentation](https://github.com/ddttom/aem-experimentation) |
| htmlmaker | Archive | Make HTML From Helix | 2024-04-04 | [htmlmaker](https://github.com/ddttom/htmlmaker) |
| contentopsv3 | Archive | Content OPS v3 | 2024-03-01 | [contentopsv3](https://github.com/ddttom/contentopsv3) |
| franklin-with-library | Archive | Franklin with Library | 2024-01-28 | [franklin-with-library](https://github.com/ddttom/franklin-with-library) |
| GitChat | Archive | Chat with your git repo | 2024-01-23 | [GitChat](https://github.com/ddttom/GitChat) |
| my-s3-upload | Archive | node js app for s3 uploading | 2023-10-05 | [my-s3-upload](https://github.com/ddttom/my-s3-upload) |
| starter | Archive | Sample project built on top of the Websight CMS | 2023-07-21 | [starter](https://github.com/ddttom/starter) |
| PDFViewer | Archive | Created with CodeSandbox | 2022-03-25 | [PDFViewer](https://github.com/ddttom/PDFViewer) |
| flutter-folio | Archive | A platform adaptive Flutter app for desktop, mobile and web. | 2022-01-05 | [flutter-folio](https://github.com/ddttom/flutter-folio) |
| mapfollow | Archive | Sample application to demonstrating the use of GeoLocator to | 2021-11-30 | [mapfollow](https://github.com/ddttom/mapfollow) |
| one-click-hugo-cms | Archive |  | 2021-11-24 | [one-click-hugo-cms](https://github.com/ddttom/one-click-hugo-cms) |
| json-server | Archive | Get a full fake REST API with zero coding in less than 30 se | 2021-09-18 | [json-server](https://github.com/ddttom/json-server) |
| sling-org-apache-sling-app-cms | Archive | Apache Sling - CMS Reference App | 2021-08-29 | [sling-org-apache-sling-app-cms](https://github.com/ddttom/sling-org-apache-sling-app-cms) |
| EfCoreInAction | Archive | Supporting code to go with the book "Entity Framework Core i | 2020-02-14 | [EfCoreInAction](https://github.com/ddttom/EfCoreInAction) |
| learnjs | Archive | Prepared Workspace for "Serverless Single Page Apps" @ Pragp | 2018-11-18 | [learnjs](https://github.com/ddttom/learnjs) |
| aem-wknd | Archive | Aem Weekend Journal | 2018-07-09 | [aem-wknd](https://github.com/ddttom/aem-wknd) |
| try_git | Archive |  | 2012-07-05 | [try_git](https://github.com/ddttom/try_git) |
<!-- TABLE:END -->

---

## Embedded Script

The following bash script is embedded in this cog. The marker `@embedded:scan-repos` allows tools to extract it.

```bash @embedded:scan-repos
#!/bin/bash
# ---
# title: "GitHub Repository Scanner (Embedded in mx-allmygithubs.cog.md)"
# version: "1.0"
# description: "Fetches repos, classifies, sorts, and updates the table in this cog."
# ---

set -euo pipefail

# ─────────────────────────────────────────────
# Determine cog file location
# ─────────────────────────────────────────────
if [ -n "${COG_PATH:-}" ]; then
  COG_FILE="$COG_PATH"
elif [ -f "scripts/mx-allmygithubs.cog.md" ]; then
  COG_FILE="scripts/mx-allmygithubs.cog.md"
elif [ -f "mx-allmygithubs.cog.md" ]; then
  COG_FILE="mx-allmygithubs.cog.md"
else
  COG_FILE=""
fi

# ─────────────────────────────────────────────
# Flags
# ─────────────────────────────────────────────
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    -h|--help)
      echo "Usage: [script] [options]"
      echo "Options: --dry-run"
      exit 0 ;;
    scan) shift ;;  # Accept 'scan' as a no-op action word
    *) shift ;;
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

# ─────────────────────────────────────────────
# Prerequisites Check
# ─────────────────────────────────────────────
header "Checking Prerequisites"

command -v gh &>/dev/null || { fail "gh CLI not installed (brew install gh)"; exit 1; }
pass "gh CLI installed"

command -v jq &>/dev/null || { fail "jq not installed (brew install jq)"; exit 1; }
pass "jq installed"

gh auth status &>/dev/null || { fail "Not authenticated (run: gh auth login)"; exit 1; }
pass "GitHub authenticated"

# ─────────────────────────────────────────────
# Fetch Repositories
# ─────────────────────────────────────────────
header "Fetching Repositories"

# Get current user
GITHUB_USER=$(gh api user --jq '.login')
info "Scanning repos for: $GITHUB_USER"

# Fetch personal repos
info "Fetching personal repositories..."
PERSONAL_REPOS=$(gh api "users/$GITHUB_USER/repos?per_page=100&sort=pushed" --paginate 2>/dev/null || echo "[]")
PERSONAL_COUNT=$(echo "$PERSONAL_REPOS" | jq 'length')
pass "Personal repos: $PERSONAL_COUNT"

# Fetch org repos
info "Fetching organization repositories..."
ORGS=$(gh api "user/orgs" --jq '.[].login' 2>/dev/null || echo "")
ORG_REPOS="[]"
ORG_COUNT=0

for org in $ORGS; do
  info "  Scanning org: $org"
  ORG_DATA=$(gh api "orgs/$org/repos?per_page=100&sort=pushed" --paginate 2>/dev/null || echo "[]")
  ORG_REPOS=$(echo "$ORG_REPOS $ORG_DATA" | jq -s 'add')
  THIS_COUNT=$(echo "$ORG_DATA" | jq 'length')
  ORG_COUNT=$((ORG_COUNT + THIS_COUNT))
done
pass "Organization repos: $ORG_COUNT"

# Combine all repos
ALL_REPOS=$(echo "$PERSONAL_REPOS $ORG_REPOS" | jq -s 'add | unique_by(.id)')
TOTAL_COUNT=$(echo "$ALL_REPOS" | jq 'length')
pass "Total unique repos: $TOTAL_COUNT"

# ─────────────────────────────────────────────
# Classify Repositories
# ─────────────────────────────────────────────
header "Classifying Repositories"

TWELVE_MONTHS_AGO=$(date -v-12m +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -d "12 months ago" +%Y-%m-%dT%H:%M:%SZ)

classify_repo() {
  local name="$1"
  local archived="$2"
  local pushed_at="$3"
  local topics="$4"

  # Archive check: archived flag OR no push in 12+ months
  if [ "$archived" = "true" ] || [[ "$pushed_at" < "$TWELVE_MONTHS_AGO" ]]; then
    echo "Archive"
    return
  fi

  # Name prefix detection
  if [[ "$name" =~ ^[Mm][Xx]- ]] || [[ "$name" =~ ^[Mm][Xx]_ ]]; then
    echo "MX"
    return
  fi

  if [[ "$name" =~ ^web- ]] || [[ "$name" =~ ^allabout ]] || [[ "$name" =~ ^site- ]]; then
    echo "Web"
    return
  fi

  if [[ "$name" =~ ^tool- ]] || [[ "$name" =~ ^cli- ]] || [[ "$name" =~ ^util- ]] || [[ "$name" =~ ^script- ]]; then
    echo "Tools"
    return
  fi

  # Topic detection
  if echo "$topics" | grep -qiE 'mx|machine-experience'; then
    echo "MX"
    return
  fi

  if echo "$topics" | grep -qiE 'web|website|frontend'; then
    echo "Web"
    return
  fi

  if echo "$topics" | grep -qiE 'tool|cli|utility|script'; then
    echo "Tools"
    return
  fi

  echo "Other"
}

# Process all repos with jq (handles escaping properly)
# First, add classification as a temporary file to avoid subshell issues
TEMP_CLASSIFIED=$(mktemp)

echo "$ALL_REPOS" | jq -c '.[]' | while read -r repo; do
  name=$(echo "$repo" | jq -r '.name')
  archived=$(echo "$repo" | jq -r '.archived')
  pushed_at=$(echo "$repo" | jq -r '.pushed_at')
  topics=$(echo "$repo" | jq -r '.topics | join(",")')

  type=$(classify_repo "$name" "$archived" "$pushed_at" "$topics")

  # Use jq to construct JSON properly (handles all escaping)
  echo "$repo" | jq --arg type "$type" '{
    name: .name,
    type: $type,
    description: ((.description // "")[0:60]),
    pushed_at: .pushed_at,
    push_date: (.pushed_at[0:10]),
    url: .html_url
  }'
done > "$TEMP_CLASSIFIED"

CLASSIFIED_REPOS=$(cat "$TEMP_CLASSIFIED" | jq -s '.')
rm -f "$TEMP_CLASSIFIED"

# Count by type
MX_COUNT=$(echo "$CLASSIFIED_REPOS" | jq '[.[] | select(.type=="MX")] | length')
WEB_COUNT=$(echo "$CLASSIFIED_REPOS" | jq '[.[] | select(.type=="Web")] | length')
TOOLS_COUNT=$(echo "$CLASSIFIED_REPOS" | jq '[.[] | select(.type=="Tools")] | length')
ARCHIVE_COUNT=$(echo "$CLASSIFIED_REPOS" | jq '[.[] | select(.type=="Archive")] | length')
OTHER_COUNT=$(echo "$CLASSIFIED_REPOS" | jq '[.[] | select(.type=="Other")] | length')

pass "MX: $MX_COUNT"
pass "Web: $WEB_COUNT"
pass "Tools: $TOOLS_COUNT"
pass "Archive: $ARCHIVE_COUNT"
pass "Other: $OTHER_COUNT"

# ─────────────────────────────────────────────
# Generate Table
# ─────────────────────────────────────────────
header "Generating Table"

# Sort: MX first, then by category priority, then by pushed_at within category
generate_table() {
  echo "| Name | Type | Description | Last Push | Link |"
  echo "|------|------|-------------|-----------|------|"

  # Define sort order
  for category in "MX" "Web" "Tools" "Other" "Archive"; do
    echo "$CLASSIFIED_REPOS" | jq -r --arg cat "$category" '
      [.[] | select(.type == $cat)]
      | sort_by(.pushed_at)
      | reverse
      | .[]
      | "| \(if .type == "MX" then "🔷 " else "" end)\(.name) | \(.type) | \(.description) | \(.push_date) | [\(.name)](\(.url)) |"
    '
  done
}

TABLE=$(generate_table)
TABLE_LINES=$(echo "$TABLE" | wc -l | tr -d ' ')
pass "Generated table with $TABLE_LINES rows"

# ─────────────────────────────────────────────
# Update Cog File
# ─────────────────────────────────────────────
if [ "$DRY_RUN" = true ]; then
  header "Dry Run — Table Preview"
  echo "$TABLE"
  echo ""
  warn "DRY RUN — cog file not updated"
  exit 0
fi

if [ -z "$COG_FILE" ] || [ ! -f "$COG_FILE" ]; then
  header "Output (no cog file to update)"
  echo "$TABLE"
  exit 0
fi

header "Updating Cog File"

# Write table to temp file (awk can't handle multiline -v)
TABLE_FILE=$(mktemp)
echo "$TABLE" > "$TABLE_FILE"

# Create output file
TEMP_FILE=$(mktemp)

# Replace content between markers using a state machine
# Read before START marker, insert table, skip until END marker, read after
{
  # Print everything before TABLE:START
  sed -n '1,/<!-- TABLE:START -->/p' "$COG_FILE"
  # Print the table
  cat "$TABLE_FILE"
  # Print everything from TABLE:END onwards
  sed -n '/<!-- TABLE:END -->/,$p' "$COG_FILE"
} > "$TEMP_FILE"

rm -f "$TABLE_FILE"

# Update modified date in YAML frontmatter
TODAY=$(date +%Y-%m-%d)
sed -i.bak "s/^modified: .*/modified: $TODAY/" "$TEMP_FILE"
rm -f "$TEMP_FILE.bak"

# Replace original file
mv "$TEMP_FILE" "$COG_FILE"

pass "Updated: $COG_FILE"
pass "Modified date: $TODAY"

# ─────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║          ${GREEN}GitHub Scan Complete${RESET}${BOLD}                           ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  Total repos: $TOTAL_COUNT"
echo -e "  🔷 MX: $MX_COUNT | Web: $WEB_COUNT | Tools: $TOOLS_COUNT | Other: $OTHER_COUNT | Archive: $ARCHIVE_COUNT"
echo -e "  Updated: $COG_FILE"
echo ""
```

---

*Stop guessing. Start reading. Then run the embedded code.*
