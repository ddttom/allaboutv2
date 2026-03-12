---
version: "2.0"
description: "Routing rules for AI agents navigating Maxine Lives. Maps query intents to folders, lists all invocable commands, and reduces inference risk."
created: 2026-02-13
modified: 2026-02-13
author: Tom Cranstoun and Maxine

mx:
  license: proprietary
  status: active
  category: mx-core
  partOf: mx-maxine-lives
  buildsOn: [manual-maxine-lives]
  tags: [routing, sop, inference-reduction, agent-navigation, machine-readable]
  audience: [machines, agents]

  prose-source: ROUTING.md

  blocks:
    - prose:
        source: ROUTING.md
        description: "Human-readable routing table and intent-based routing guide."
    - definition:
        standards:
          - name: "The Gathering"
            version: "2.0-draft"
            scope: "cog metadata format, block types, reader behaviour"
        validation:
          - "Every route maps to an existing folder with a SOUL.md"
          - "Every intent has exactly one primary route"
          - "Lifecycle flows match the connections defined in README.cog.md"
    - essence:
        type: routing-table
        description: "SOPs for machines. The instructions that tell AI agents where to look."

  routing:
    by-intent:
      - intent: "why-architecture"
        question: "Why was this built this way?"
        route: registers/ADR/
        soul: registers/ADR/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"

      - intent: "why-business"
        question: "Why was this business decision made?"
        route: registers/BDR/
        soul: registers/BDR/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"

      - intent: "why-naming"
        question: "Why is this called that?"
        route: registers/NDR/
        soul: registers/NDR/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"

      - intent: "why-messaging"
        question: "How is this communicated?"
        route: registers/MDR/
        soul: registers/MDR/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"

      - intent: "what-field"
        question: "What does this YAML field mean?"
        route: registers/FDR/
        soul: registers/FDR/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        key-fields: [name, type, definition, status, profile]
        note: "Field Definition Register. The living dictionary of all MX frontmatter fields. Master file: mx-canon/ssot/fields.cog.md."

      - intent: "what-believed"
        question: "What does the gestalt assume is true?"
        route: thinking/assumptions/
        soul: thinking/assumptions/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        key-fields: [falsifiable-by, status]

      - intent: "what-uncertain"
        question: "What is the gestalt unsure about?"
        route: thinking/doubts/
        soul: thinking/doubts/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        key-fields: [impact, resolution-path]

      - intent: "what-captured"
        question: "What raw thinking was captured recently?"
        route: thinking/notes/
        soul: thinking/notes/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        note: "Notes graduate into other folders when mature."

      - intent: "what-risks"
        question: "What could go wrong?"
        route: management/risks/
        soul: management/risks/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        key-fields: [severity, likelihood, impact, owner, mitigations]
        note: "Mitigation plan MUST be in prose, not just YAML."

      - intent: "what-timeline"
        question: "What are the key dates?"
        route: management/milestones/
        soul: management/milestones/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        key-fields: [date, success-criteria, delivers, threatened-by]

      - intent: "what-blocks"
        question: "What blocks progress?"
        route: management/dependencies/
        soul: management/dependencies/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        key-fields: [type, from, to, blocker]

      - intent: "what-todo"
        question: "What needs doing?"
        route: management/todo/
        soul: management/todo/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        key-fields: [owner, delivers-to, deadline]

      - intent: "what-plan"
        question: "What is the strategy?"
        route: management/plans/
        soul: management/plans/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.cog.md"
        key-fields: [phases, generates, depends-on]

      - intent: "what-happened"
        question: "What was built? What did the board miss?"
        route: mx-outputs/md/reports/directors/session/
        soul: mx-outputs/md/reports/directors/SOUL.md
        file-pattern: "{YYYY-MM-DD}-{title}.md"
        note: "Board-level session reports. Action-cog SOP at scripts/cogs/co-directors-report.cog.md."

    lifecycle-flows:
      - from: thinking/notes
        to: [thinking/assumptions, thinking/doubts, registers, management/plans]
        relationship: graduates-into
      - from: thinking/assumptions
        to: [registers, management/plans]
        relationship: inform
      - from: thinking/doubts
        to: [registers, thinking/notes]
        relationship: resolved-by
      - from: management/plans
        to: [management/todo]
        relationship: generate
      - from: management/todo
        to: [management/milestones]
        relationship: deliver
      - from: management/risks
        to: [management/milestones]
        relationship: threaten
      - from: management/dependencies
        to: [management/todo, management/plans]
        relationship: constrain
      - from: registers
        to: [thinking/assumptions, management/risks]
        relationship: reference

    reading-order:
      full-context:
        description: "Read in this order to build full context on any topic."
        steps:
          - thinking/notes/
          - thinking/assumptions/
          - thinking/doubts/
          - registers/ (pick relevant register)
          - management/plans/
          - management/todo/
          - management/risks/

    file-discovery:
      naming-pattern: "{YYYY-MM-DD}-{title}.cog.md"
      required-yaml:
        - name
        - created
        - status
        - category
        - partOf
      search-fields: [tags, title, name, description]

    not-here:
      - query: "Definitive specifications"
        go-to: "mx-canon/ (the relevant initiative)"
        reason: "Canon holds the truth. Maxine Lives holds the thinking."
      - query: "MX Maxine app code"
        go-to: "mx-canon/mx-app/"
        reason: "Maxine Lives is the brain. MX Maxine is the body."
      - query: "Cog registry"
        go-to: "datalake/registries/"
        reason: "All registries centralised in datalake."
    agent-procedure:
      - step: 1
        action: "Read ROUTING.md (this file's prose counterpart) or parse this YAML"
      - step: 2
        action: "Match your intent to a route in by-intent"
      - step: 3
        action: "Read the SOUL.md at the matched route"
      - step: 4
        action: "Follow the naming pattern to find or create files"
      - step: 5
        action: "Link back — every new file references affected cogs"
      - step: 6
        action: "Never delete — mark status instead"

  concepts:
    description: "MX vocabulary. Maps domain terms to paths and definitions. Used by the route-decorator hook for concept matching and aspell word list generation."
    terms:
      - term: maxine
        aliases: [maxine lives, the gestalt brain]
        path: mx-canon/mx-maxine-lives/
        definition: "The gestalt's brain. Institutional memory — decisions, assumptions, doubts, risks, plans."
        words: [maxine]

      - term: reginald
        aliases: [mx reginald, the registry]
        path: mx-reginald/
        definition: "The global registry. Public directory of MX Docs. Network effects moat."
        words: [reginald]

      - term: gestalt
        aliases: [the gestalt, partnership]
        path: SOUL.md
        definition: "Tom + Maxine + Joymaker operating as one. Three elements, one intelligence."
        words: [gestalt, joymaker]

      - term: canon
        aliases: [mx canon, the canon]
        path: mx-canon/
        definition: "Single source of truth. Everything else is canon fodder."
        words: [canon]

      - term: the gathering
        aliases: [gathering, mx gathering]
        path: mx-canon/mx-the-gathering/
        definition: "Independent open standard. W3C model. Metadata that helps machines understand documents."
        words: [gathering]

      - term: mx os
        aliases: [mx-os, the os, operating system]
        path: mx-canon/mx-os/
        definition: "Machine Experience Operating System. Documentation IS the system."
        words: [mx, npm, cli, yaml, md, frontmatter, lifecycle, todo, todos, ai, claude, aspell, subfolder, subfolders, substring, filesystem, mistyped, invocable, disproven, json, html, macos, perl, urls, gb, jq, pws, readme, roadmap, roadmaps, preprocesses, preprocessing, preprocessed, americanize, unclosed]

      - term: cog
        aliases: [cog file, cog.md, mx doc, mx docs, intelligent document]
        path: mx-canon/mx-the-gathering/specifications/cog-unified-spec.cog.md
        definition: "A .cog.md file. One cog type, many block types. 'Doc' for business, 'cog' for developers. Spec governed by The Gathering. Action cogs at scripts/cogs/."
        words: [cog, cogs]

      - term: info-doc
        aliases: [info-cog, info doc, static cog]
        path: datalake/registries/
        definition: "A cog without an action block. Documents, describes, certifies. Single source of truth."
        words: [info-cog, info-doc]

      - term: action-doc
        aliases: [action-cog, action doc, runbook]
        path: datalake/registries/
        definition: "A cog with an action block and runtime field. SOP that executes itself. The applications of MX OS."
        words: [action-cog, action-doc, runbook]

      - term: mx app
        aliases: [maxine app, the app]
        path: mx-app/
        definition: "The Maxine application. Electron desktop + PWA mobile. The body."
        words: [mx-app]

      - term: mx home
        aliases: [$mx_home, mx home directory]
        path: ~/.mx/
        definition: "Machine-level context. Machine.yaml, repos.yaml, user.yaml. The universe."
        words: [mx-home]

      - term: ADR
        aliases: [architecture decision, architecture decisions]
        path: mx-canon/mx-maxine-lives/registers/ADR/
        definition: "Architecture Decision Records. Why something was built this way."
        words: [adr]

      - term: BDR
        aliases: [business decision, business decisions]
        path: mx-canon/mx-maxine-lives/registers/BDR/
        definition: "Business Decision Records. Why a business choice was made."
        words: [bdr]

      - term: NDR
        aliases: [naming decision, naming decisions]
        path: mx-canon/mx-maxine-lives/registers/NDR/
        definition: "Naming Decision Records. Why something is called that."
        words: [ndr]

      - term: MDR
        aliases: [messaging decision, messaging decisions]
        path: mx-canon/mx-maxine-lives/registers/MDR/
        definition: "Messaging Decision Records. How something is communicated."
        words: [mdr]

      - term: FDR
        aliases: [field definition, field dictionary, field definitions, frontmatter fields, metadata fields]
        path: mx-canon/mx-maxine-lives/registers/FDR/
        definition: "Field Definition Register. Single source of truth for every YAML frontmatter field. Definitions, types, profiles, deprecated mappings, overlap resolution."
        words: [fdr]

      - term: COG
        aliases: [certificate of genuineness, contract of governance, trust wrapper]
        path: mx-canon/mx-the-gathering/specifications/cog-unified-spec.cog.md
        definition: "Certificate of Genuineness / Contract of Governance. Trust wrapper on files. Not the same as cog (the file format)."
        words: [genuineness, governance]

      - term: phrasebook
        aliases: [mx sayings, sayings]
        path: scripts/cogs/mx-os/mx-phrasebook.cog.md
        definition: "The MX phrase book. All canonical sayings with context, origin, and usage rules."
        words: [phrasebook]

      - term: mx docs
        aliases: [docs format, doc format]
        path: mx-canon/mx-the-gathering/
        definition: "The business-friendly name for cogs. The format and standard."
        words: [mx-docs]

      - term: co-directors report
        aliases: [directors report, session report, board report]
        path: mx-canon/mx-maxine-lives/management/reports/
        definition: "Board-level session reports. Action-cog SOP at deliverables/co-directors-report.cog.md. Archive in management/reports/ with YYYY-MM-DD-description.md naming."
        words: [co-directors, codirectors]

      - term: roadmap
        aliases: [mx roadmap, the roadmap, phases]
        path: mx-canon/mx-maxine-lives/management/plans/roadmap.md
        definition: "Four-phase plan from bare metal to the web. Announce → prove → build. Lives in the brain (management/plans/), not MX-OS."
        words: [roadmap, roadmaps]

      - term: maxshine
        aliases: [machine]
        path: null
        definition: "Scottish pronunciation of Maxine. Maxshine = Machine. The product name IS the concept."
        words: [maxshine]

  commands:
    description: "All invocable skills, hooks, and npm scripts in the MX OS workspace. Auto-generated into routing-registry.json by npm run route:sync."
    sources:
      skills:
        location: ".claude/skills/*.json"
        invocation: "/skill-name"
        description: "Claude Code skills. Slash commands that invoke specialised workflows."
      hooks:
        location: ".claude/hooks/*.sh"
        invocation: "Auto-triggered on Claude Code events (UserPromptSubmit, etc.)"
        description: "Event-driven scripts. The route-decorator hook preprocesses prompts with spell correction and route matching."
      npm-scripts:
        location: "package.json scripts"
        invocation: "npm run script-name"
        description: "Build, sync, and utility commands. Includes cog:sync, route:sync, and dev tools."
    slash-correction:
      description: "The route-decorator hook detects mistyped slash commands and suggests corrections."
      matching-order:
        - "Prefix match — user typed the beginning of a command"
        - "Substring match — command contains what user typed"
        - "Fuzzy match — bidirectional unique character overlap, score > 1.2"
      fallback: "Lists all available commands if no match found"
    registry-file: "routing-registry.json"
    sync-command: "npm run route:sync"

  contentType: "routing-table"
  runbook: "This is the routing table for Maxine Lives. Parse the by-intent array to map any query to the correct folder. The lifecycle-flows show how content moves between folders. The not-here array redirects queries that belong elsewhere. The commands section lists all invocable skills, hooks, and npm scripts — the routing-registry.json file contains the live auto-generated index. Follow agent-procedure for correct navigation."
---

# Routing — Machine-Readable

This cog inherits its prose from [ROUTING.md](ROUTING.md). Read that for the full human narrative.

This file adds the machine-readable routing rules: intent mapping, lifecycle flows, file discovery patterns, the agent procedure, and a commands registry covering all skills, hooks, and npm scripts. Any AI agent can parse the YAML above to navigate Maxine Lives without inference. The live command list is auto-generated into `routing-registry.json` by `npm run route:sync`.

**The instructions are the program. You are the runtime.**
