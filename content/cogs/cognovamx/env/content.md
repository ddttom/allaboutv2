---

version: "1.0.0"
description: "Project-level environment configuration. The MX equivalent of .env — one place for values that other cogs reference, never hardcode."

created: 2026-02-11
modified: 2026-02-11

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, what-is-mx-environment]
  buildsOn: [what-is-a-cog, what-is-mx-os]
  tags: [environment, config, settings, hostname, project, convention]

  audience: both
  readingLevel: advanced

  contentType: "config-doc"
  runbook: "mx exec env"
  # ─────────────────────────────────────────────
  # PROJECT ENVIRONMENT — the values live here
  # ─────────────────────────────────────────────

  site:
    hostname: allabout.network
    base-url: https://allabout.network
    protocol: https

  default-author:
    name: Tom Cranstoun
    linkedin: https://www.linkedin.com/in/tom-cranstoun/
    email: info@allabout.network
    image: https://allabout.network/media_126e99d56f06caf788bee715aff92281d2e31a206.png
    bio: "has been building content systems since 1977, specializing in Adobe Experience Manager, Edge Delivery Services, and Machine Experience (MX) strategic advisory."
    profile-page: about.tom.cranstoun.html

  publisher:
    name: AllAbout.Network
    url: https://allabout.network
    copyright: "Tom Cranstoun. All rights reserved."

  paths:
    eds-blog: mx-crm/content/
    mx-blog: allaboutv2/blogs/mx/
    mx-blog-css: allaboutv2/blogs/mx/shared-mx.css
    eds-blog-url: /blogs/ddt/
    mx-blog-url: /blogs/mx/

  social:
    og-site-name: AllAbout.Network
    twitter-card: summary_large_image

  defaults:
    language: en-GB
    date-format-prose: "DD Month YYYY"
    date-format-meta: "YYYY-MM-DD"
    reading-speed-wpm: 200
    blogState: draft

  ai:
    preferred-access: html
    content-policy: extract-with-attribution
    freshness: monthly
    structured-data: schema.org-jsonld
    llms-txt: /llms.txt

  execute:
    runtime: runbook
    command: mx env
    actions:
      - name: show
        description: Display the current project configuration
        usage: |
          1. Read env.cog.md from the repository root
          2. Extract all config sections from the YAML frontmatter
          3. Present as a formatted table:

             | Section | Key | Value |
             |---------|-----|-------|
             | site | hostname | allabout.network |
             | site | base-url | https://allabout.network |
             | ... | ... | ... |

          4. Count total config values
          5. Report: "{count} configuration values in {section-count} sections"
        outputs:
          - name: config-table
            type: string
            description: "Formatted table of all config values"

      - name: validate
        description: Find hardcoded values in the codebase that should reference env.cog.md
        usage: |
          1. Read env.cog.md to get all config values
          2. For each value that is a URL or hostname:
             - Search the codebase for literal occurrences using grep
             - Exclude env.cog.md itself from results
             - Exclude .git/ and node_modules/
             - Exclude session summaries and completion logs (mx-outputs/md/reports/completions/)
          3. For each match found:
             - Record: file path, line number, the hardcoded value, which config key it should reference
          4. Present results:

             | File | Line | Hardcoded Value | Should Reference |
             |------|------|-----------------|------------------|
             | blog-generator.cog.md | 142 | allabout.network | site.hostname |
             | data-sovereignty.html | 24 | https://allabout.network/blogs/mx/ | site.base-url + paths.mx-blog-url |

          5. Summary: "{count} hardcoded references found across {file-count} files"

          Note: This is an audit tool. It reports — it does not change files.
          Some hardcoded references are intentional (published blog content, canonical URLs in live HTML).
          The validate action helps distinguish between:
          - Template files (SHOULD reference config) — cogs, generators, scripts
          - Published content (MAY keep literal values) — live HTML, published markdown
          - Historical records (IGNORE) — session logs, changelogs, git history
        inputs:
          - name: section
            type: string
            required: false
            description: "Optional: only validate values from a specific section (e.g. 'site', 'author')"
        outputs:
          - name: audit-report
            type: object
            description: "List of hardcoded values with file locations and recommended references"

      - name: propagate
        description: Replace hardcoded values in template files with references to env.cog.md
        usage: |
          1. Run the validate action first to identify hardcoded values
          2. Filter to template files only:
             - *.cog.md files (cog templates and action-docs)
             - .claude/skills/**/*.md (skill definitions)
             - scripts/*.js (build scripts)
             - Exclude published HTML and markdown content
          3. For each template file with hardcoded values:
             - Show the proposed change: old value → reference notation
             - Ask the user to confirm before making changes
          4. For action-doc runbook instructions:
             - Replace literal URLs with: "Read site.base-url from env.cog.md"
             - Replace literal hostnames with: "Read site.hostname from env.cog.md"
             - Replace literal author info with: "Read default-author.name from env.cog.md"
          5. Present summary:
             - Files updated: {count}
             - Values replaced: {count}
             - Files skipped (published content): {count}

          IMPORTANT: Always ask before modifying files. Never auto-replace in published content.
        inputs:
          - name: dry-run
            type: boolean
            required: false
            description: "If true, show what would change without modifying files (default: true)"
        outputs:
          - name: propagation-report
            type: object
            description: "Summary of changes made or proposed"
---


# Project Environment

The MX equivalent of `.env`. One cog at the repo root. Every configurable value lives here. Other cogs reference it — they never hardcode.

---

## Why This Exists

The hostname `allabout.network` appears in hundreds of files across this codebase. It is hardcoded in HTML templates, action-doc runbooks, build scripts, metadata tables, and JSON-LD blocks. When the hostname changes — and it will, before Frankfurt — every one of those references needs updating.

This is the `.env` problem. The solution is the same: centralise the values, reference them from one place.

But this is MX. The config file is a cog. It has YAML frontmatter (machine-readable), markdown documentation (human-readable), and actions (executable). It follows the same conventions as everything else in the ecosystem.

---

## How It Works

The YAML frontmatter contains all project-level configuration organised by section:

| Section | Contains | Example |
|---------|----------|---------|
| **site** | Hostname, base URL, protocol | `hostname: allabout.network` |
| **default-author** | Default author identity | `name: Tom Cranstoun` |
| **publisher** | Publishing entity | `name: AllAbout.Network` |
| **paths** | File locations and URL patterns | `mx-blog: allaboutv2/blogs/mx/` |
| **social** | Social media card defaults | `og-site-name: AllAbout.Network` |
| **defaults** | Language, date formats, reading speed | `language: en-GB` |
| **ai** | AI meta tag defaults | `content-policy: extract-with-attribution` |

---

## The Convention

**For action-docs and templates:**

Do not write:

```
Output path: allaboutv2/blogs/mx/{slug}.html
URL pattern: https://allabout.network/blogs/mx/{slug}.html
```

Write instead:

```
Output path: Read paths.mx-blog from env.cog.md, append {slug}.html
URL pattern: Read site.base-url from env.cog.md, append paths.mx-blog-url, append {slug}.html
```

**For HTML templates:**

The MX HTML blog generator should read values from env.cog.md at generation time and write them into the output. The generated HTML file contains the resolved values — not references. The source of truth stays in env.cog.md; the output is a snapshot.

**For published content:**

Published blog posts, live HTML, and committed markdown may contain resolved values. These are snapshots. When the hostname changes, re-generate affected files using the blog-generator cog (which reads from env.cog.md) rather than find-and-replace.

---

## Three Actions

**show** — Display current configuration as a formatted table. Useful for confirming values before generating content or debugging path issues.

**validate** — Audit the codebase for hardcoded values that should reference env.cog.md. Reports file locations and which config key to use. Does not modify files.

**propagate** — Replace hardcoded values in template files (cogs, skills, scripts) with references to env.cog.md. Always asks before changing files. Never touches published content.

---

## When Values Change

1. Edit the YAML frontmatter in this file (e.g., change `hostname: allabout.network` to `hostname: mx.technology`)
2. Run `mx env validate` to see what is affected
3. Re-generate affected content using the appropriate action-docs (blog-generator, etc.)
4. Run `mx env propagate --dry-run` to check template files
5. Run `mx env propagate` to update templates (with confirmation)

The validate action distinguishes between template files (should be updated) and published content (re-generate, don't find-and-replace).

---

## Relationship to $MX_HOME

`$MX_HOME` (`~/.mx/`) is **machine-level** context — which machine am I on, what repos exist, who is the user.

`env.cog.md` is **project-level** context — what is the hostname, who is the default author, where do blog files go.

Two levels, same principle: describe the context so AI agents do not have to guess.

| Level | File | Scope | Example |
|-------|------|-------|---------|
| Machine | `~/.mx/machine.yaml` | The entire machine | hostname, OS, architecture |
| Machine | `~/.mx/repos.yaml` | All repositories | paths, descriptions, capabilities |
| Machine | `~/.mx/user.yaml` | The current user | name, email, preferences |
| Project | `env.cog.md` | One repository | site URL, author defaults, paths |
| File | Individual `.cog.md` | One document | title, description, status |

Three tiers of context. Machine knows the universe. Project knows the neighbourhood. File knows itself.

---

## For AI Agents

When generating content, building templates, or creating new cogs:

1. **Read env.cog.md first** — before hardcoding any URL, hostname, author name, or path
2. **Reference, do not hardcode** — use the section.key notation in runbook instructions
3. **Resolve at generation time** — when creating output files (HTML, markdown), write the resolved value, not the reference
4. **When in doubt, check** — run `mx env show` to see current values

The convention is simple: if a value might change between environments, it belongs in env.cog.md. If it is specific to one document, it belongs in that document's frontmatter.

---

*Stop guessing. Read env.cog.md.*
