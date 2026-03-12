---
version: "1.0"
description: "Operational conventions for MX-The-Books: naming patterns, file locations, assumed rules, and standards. What you need to know to work here without guessing."
created: 2026-02-15
modified: 2026-02-15
author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published
  category: convention
  partOf: mx-maxine-lives
  buildsOn: [UBERCOG, env]
  tags: [conventions, naming, locations, patterns, operations, registry]
  audience: both
  readingLevel: intermediate

  contentType: "action-doc"
  runbook: "mx exec conventions"
  execute:
    runtime: runbook
    command: mx conventions
    actions:
      - name: validate
        description: Check the repo against documented conventions
        usage: |
          Walk through each convention category. For each rule, check if the repo complies.
          Report violations as: [category] convention — expected vs found — file path.
          Do not auto-fix. Present the report and let the user decide.
        inputs: []
        outputs:
          - name: violations
            type: array
            description: "List of convention violations found"
      - name: check-naming
        description: Check file and folder naming conventions only
        usage: |
          Scan for: version numbers in filenames, non-kebab-case folders, cog files without .cog. infix,
          register files without date prefix, reports without segment suffix.
        inputs: []
        outputs:
          - name: naming-violations
            type: array
            description: "Naming convention violations"
---

# Conventions Registry

The operational rulebook. Read this before creating files, naming things, or putting content anywhere.

---

## 1. File Naming

| Convention | Pattern | Scope | Source |
|-----------|---------|-------|--------|
| Cog files | `{descriptive-name}.cog.{ext}` | Everywhere | cog-unified-spec |
| Register entries | `{YYYY-MM-DD}-{title}.cog.md` | registers/ | registers/SOUL.md |
| Session reports | `{YYYY-MM-DD}-{segment}-report.md` | mx-outputs/md/reports/directors/session/ | MEMORY.md |
| Blog posts | Original filename preserved | communications/blogs/ | blogs/SOUL.md |
| No version in filename | Use `version:` in frontmatter | Everywhere | principles.cog.md #11 |
| Kebab-case | All filenames use hyphens | Everywhere | Implicit, universally observed |
| Uber cogs | `UBER.cog.md` | $MX_HOME and repo root | $MX_HOME convention |

**Report segments:** morning (before 12:00), afternoon (12:00–17:00), evening (17:00+). One file per segment, updated if more work happens.

**Blog exception:** Blog files keep editorial names. Dates live in YAML frontmatter, not the filename. Provenance tracked via `moved-from:` and `moved-date:` fields.

---

## 2. Folder Naming

| Convention | Pattern | Scope | Source |
|-----------|---------|-------|--------|
| Kebab-case | Hyphens, no spaces, no underscores | Everywhere | Implicit, universally observed |
| SOUL.md in every folder | Read before editing | Brain, Canon | principles.cog.md #12 |
| mx-canon uppercase | Brand emphasis: `mx-canon/`, `MX-Maxine-Lives/` | Canon tree | Established convention |
| Register subfolders | Three-letter codes: ADR, BDR, NDR, MDR, FDR, CVR | registers/ | registers/SOUL.md |
| Client deliverables | `mx-outputs/datalake/clients/{client-name}/` | datalake | env.cog.md |

---

## 3. Content Locations

Where things live. These are not suggestions — if content goes elsewhere, it's in the wrong place.

### Drafts and Source

| Content | Location | Notes |
|---------|----------|-------|
| Protocols manuscripts | `datalake/manuscripts/mx-books/mx-protocols/protocols/` | Chapter files: `chapter-*.md` |
| Handbook chapters | `datalake/manuscripts/mx-books/mx-handbook/chapters/` | Chapter files: `chapter-*.md` |
| Blog drafts (md) | `mx-canon/mx-maxine-lives/communications/blogs/md/` | Markdown source |
| Blog templates | `mx-canon/mx-maxine-lives/communications/blogs/md/templates/` | EDS and MX templates |
| Draft ideas | `datalake/pipeline/drafts/ideas/` | Raw ideas, contrasts, wip |
| Use cases | `datalake/pipeline/drafts/use-cases/` | Audience-specific use cases |
| Specifications | `datalake/pipeline/drafts/specifications/` | Demo specs, book plans |

### Generated Output

| Content | Location | Notes |
|---------|----------|-------|
| Protocols PDFs | `mx-outputs/pdf/books/protocols/` | PDF, Kindle, simple formats |
| Protocols HTML | `mx-outputs/html/books/protocols/` | Standalone HTML for print |
| Handbook PDFs | `mx-outputs/pdf/books/handbook/` | PDF, Kindle, simple formats |
| Handbook HTML | `mx-outputs/html/books/handbook/` | Standalone HTML |
| Chapter 00 standalone | `mx-outputs/pdf/books/chapters/` | PDF and HTML |
| Blog HTML (QA) | `mx-canon/mx-maxine-lives/communications/blogs/html/allabout/` | Brain copy for review |
| Blog HTML (other) | `communications/blogs/html/{protocols,outputs,lifecycle}/` | By provenance |
| Client deliverables | `mx-outputs/datalake/clients/{client-name}/` | Per-client |
| Temp/working | `mx-outputs/datalake/tmp/` | Gitignored |

### Publishing Hosts

| Content | Host repo | Deploy target | Notes |
|---------|-----------|---------------|-------|
| MX HTML blogs | `allaboutv2/blogs/mx/` | allabout.network | `npm run blog:publish` copies from brain |
| EDS blogs | `allaboutv2/blogs/ddt/` | allabout.network | EDS auto-deploys |
| Blog catalogue | `allaboutv2/blogs/ddt/my-blog.json` | allabout.network | Blog index |

**Publishing flow:** Brain holds the archive. Host repo receives only the published output. Never edit in the host — edit in the brain, then publish.

---

## 4. Cog Conventions

| Convention | Rule | Source |
|-----------|------|--------|
| Name field | kebab-case, matches filename | Implicit, universally observed |
| Attribute names | camelCase for multi-word | LEARNINGS.md |
| Required frontmatter | name, version, description, created, author, status, category, tags | base.md |
| YAML for markdown | Frontmatter between `---` fences | cog-unified-spec |
| Meta tags for HTML | `<meta name="mx:*">` | cog-unified-spec v2.1 |
| Link rel for HTML | `<link rel="mx" href="...">` | cog-unified-spec v2.1 |
| JS @mx: tags | `@mx:name`, `@mx:version`, etc. in JSDoc | mx-metadata-conventions |
| CSS @mx: tags | `@mx:name`, `@mx:version`, etc. in `/* */` comments | mx-metadata-conventions |
| Deprecated cog:* | Use `mx:*` instead (backend accepts both) | mx-metadata-conventions |
| Deprecated @mx-ai-* | Use `@mx:*` instead | FDR deprecated fields |
| One doc type | Info-doc (no action block) or action-doc (with action block). No other types. | ADR: block-architecture |
| Builds-on | Reference by cog name, not file path | cog-unified-spec |
| Canon wins | If Canon conflicts with anywhere else, Canon is correct | principles.cog.md |

### Status Values by Context

| Context | Values | Source |
|---------|--------|--------|
| Register decisions | proposed, accepted, superseded, deprecated | registers/SOUL.md |
| Blog posts | draft, published, archived | blogs/SOUL.md |
| Assumptions | active, validated, invalidated, retired | thinking/SOUL.md |
| Doubts | open, investigating, resolved, accepted | thinking/SOUL.md |
| Tasks | pending, in-progress, blocked, done, cancelled | management/SOUL.md |
| Plans | draft, active, completed, superseded, abandoned | management/SOUL.md |

---

## 5. Metadata Conventions

| Convention | Rule | Source |
|-----------|------|--------|
| All .md files need frontmatter | YAML between `---` fences | base.md |
| Version in frontmatter | `version: "1.0"` — never in filename | principles.cog.md #11 |
| British dates in prose | "15 February 2026" | base.md |
| ISO dates in metadata | `2026-02-15` | base.md |
| No hardcoded counts | Say "the registry" not "33 cogs" | principles.cog.md, MEMORY.md |
| Audience field | `both`, `humans`, `machines`, `tech`, `business` | mx-messaging.cog.md |
| Ownership field | `gestalt` for shared artefacts | MEMORY.md |
| mx: in non-YAML | `@mx:field` in JS/CSS, `<meta name="mx:field">` in HTML | mx-metadata-conventions |
| Embrace and extend | Pre-existing metadata (JSDoc, Schema.org, etc.) recognised as blocks | cog-unified-spec v2.1 |
| Vendor namespace | `prefix:field` pattern, registered in Reginald | cog-unified-spec v2.1 |

---

## 6. Git Conventions

| Convention | Rule | Source |
|-----------|------|--------|
| Commit messages | Lowercase imperative, prefix: feat/fix/docs/chore | Implicit, universally observed |
| Co-authored-by | `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` | SOUL.md |
| Submodule-first | Commit and push submodules BEFORE main repo | hub.md |
| Always pwd first | Check directory before every git operation | hub.md, LEARNINGS.md |
| Always commit settings | `.claude/settings.local.json` is always committed | MEMORY.md |
| git mv for renames | Preserve history | hub.md |
| No force push | Warn before any force push | Implicit safety rule |

---

## 7. Writing Conventions

| Convention | Rule | Source |
|-----------|------|--------|
| British English | organise, colour, whilst (but code uses international: "Organization") | base.md |
| Write like a blog | Informative, not technical. Editorial and authoritative. | principles.cog.md #13 |
| Dual audience | Business claim first, technical evidence underneath | principles.cog.md #14 |
| No exaggeration | No "exciting", "amazing", "revolutionary" | blog-generator.cog.md |
| Short dashes only | Not em-dashes | base.md |
| No colons in chapter titles | Chapters use descriptive titles without colons | base.md |
| Timeless manuscripts | No publication dates about the book itself | hub.md, TIMELESS-MANUSCRIPT-RULE.md |
| Size-neutral language | Never hardcode counts in prose | base.md, principles.cog.md |

---

## 8. Publishing Conventions

| Convention | Rule | Source |
|-----------|------|--------|
| Brain is archive | Both md and html live in the brain | blogs/SOUL.md |
| Host is deployment | allaboutv2 receives published output only | blog-generator.cog.md |
| Blog pipeline | Draft (md) → QA (html) → Publish (host) | blog-generator.cog.md |
| env.cog.md first | Read env.cog.md before generating any content | blog-generator.cog.md |
| Never hardcode URLs | All hostnames and URLs come from env.cog.md | env.cog.md |

---

## 9. Tool Conventions

| Convention | Pattern | Source |
|-----------|---------|--------|
| npm scripts | `category:action` (e.g. `pdf:bible-html`, `blog:publish`) | package.json |
| MX cog commands | `/mx-c-{cog-name}` | MEMORY.md |
| MX system commands | `/mx-{function}` (boot, status, help) | MEMORY.md |
| Skill template | `.claude/skills/_mx-c-template/skill.md` | MEMORY.md |

---

## 10. Inheritance Chain

The boot sequence defines what overrides what:

```
$MX_HOME/UBER.cog.md     →  repo/UBER.cog.md  →  folder/SOUL.md
    (the universe)              (the neighbourhood)    (the room)
```

| Level | File | What it provides |
|-------|------|-----------------|
| Machine | `$MX_HOME/UBER.cog.md` | MX OS, principles, identity, boot sequence |
| Machine | `$MX_HOME/machine.yaml` | Hardware context |
| Machine | `$MX_HOME/repos.yaml` | All repositories |
| Machine | `$MX_HOME/user.yaml` | Who you're working with |
| Repo | `UBER.cog.md` | Repo operations (PDF, blog, validation) |
| Repo | `CLAUDE.md` | Mode dispatcher, agent instructions |
| Repo | `env.cog.md` | Hostnames, paths, author defaults |
| Folder | `SOUL.md` | Voice, constraints, file patterns |

**Override rule:** Specific beats general. A folder SOUL.md can add constraints but cannot contradict Canon.

---

## For AI Agents

When you arrive in this repo:

1. Read `$MX_HOME/UBER.cog.md` if you haven't — the universe
2. Read `UBER.cog.md` at repo root — the neighbourhood
3. Read this file — the rules
4. Read `SOUL.md` in your current folder — the room
5. Follow the conventions. If something isn't covered here, check LEARNINGS.md

When creating files: check this registry for the naming pattern. When placing files: check this registry for the location. When writing prose: check this registry for the style. When in doubt: Canon wins content, convention wins location.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Convention validation complete

Output:
  /Users/tom/Documents/MX/convention-violations-2026-02-17.md (2.1KB)
```

Not just "Validation complete" or "violations report generated" — the full absolute path from root.

---

*Stop guessing. Start reading.*
