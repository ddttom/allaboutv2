---
title: "MX Field Dictionary"
version: "1.5"
created: 2026-02-13
modified: 2026-02-23
author: The Gathering
description: "The single source of truth for every YAML frontmatter field in the MX ecosystem. Definitions, types, profiles, and overlap resolution."

mx:
  name: field-dictionary
  status: active
  license: proprietary
  category: standard
  partOf: mx-the-gathering
  buildsOn: [what-is-a-cog]
  tags: [fields, metadata, yaml, frontmatter, dictionary, vocabulary]
  audience: [machines, humans]

  contentType: field-dictionary
  runbook: "This is the canonical field dictionary. When validating, generating, or querying frontmatter fields, parse the fields array below. Each entry has a name, type, definition, status, and profile. The overlap-resolution section declares which field wins when two seem similar. The namespace-policy section defines three levels: standard (no prefix), MX-public (x-mx-), and MX-private (x-mx-p-). The prefix IS the policy."
  namespacePolicy:
    description: "Three-level attribute namespace. Standard fields belong to The Gathering open standard. Extensions are namespaced to prevent pollution."
    adr: "mx-canon/mx-maxine-lives/thinking/decisions/2026-02-14-attribute-namespace-policy.cog.md"
    levels:
      - level: standard
        prefix: ""
        owner: "The Gathering"
        visibility: "Universal — all implementations use these fields"
        example: "name, author, created, version, tags"
        rule: "No prefix. Defined by the open standard. All implementations honour them."

      - level: mx-public
        prefix: "x-mx-"
        owner: "Cog-Nova-MX"
        visibility: "Visible in published cogs. Implementation extension, not the open standard."
        example: "x-mx-audience-segment, x-mx-pipeline-stage"
        rule: "x- signals extension. mx- signals whose. Visible to anyone reading the cog."

      - level: mx-private
        prefix: "x-mx-p-"
        owner: "Cog-Nova-MX"
        visibility: "Obfuscated. Only $MX_HOME registry holders can decode the value."
        example: "x-mx-p-*"
        rule: "p- signals private. Values are hashed, encoded, or tokenised. The decode registry lives in $MX_HOME. Field names and their meanings are not documented publicly."

    convention: "x- follows HTTP extension header convention. mx- identifies Cog-Nova-MX. p- identifies private/obfuscated. The prefix is the policy — no additional visibility markers needed."

    namingConvention:
      rule: "All field names use camelCase. Aligns with Schema.org and Dublin Core vocabulary conventions."
      ndr: "mx-canon/mx-maxine-lives/registers/NDR/2026-02-16-camelcase-naming.cog.md"
      date: 2026-02-16
      examples:
        correct: ["readingLevel", "buildsOn", "blogState", "contentType", "partOf"]
        banned-snake: ["reading_level", "builds_on", "blog_state"]
        banned-kebab: ["reading-level", "builds-on", "blog-state"]
        unchanged: ["title", "author", "created", "version", "tags", "name"]
      enforcement:
        audit: "npm run audit:metadata — reports violations in Section 9"
        validator: "node scripts/mx-validator.js — warns on new violations"
      rationale: "MX metadata is a vocabulary (like Schema.org), not markup (like HTML attributes). Vocabularies use camelCase. YAML has no preference — the convention comes from the consuming ecosystem."

    spelling-neutrality:
      rule: "Prefer spelling-neutral field names. Where US/UK spelling differs, use an abbreviation or synonym that avoids the conflict."
      ndr: "mx-canon/mx-maxine-lives/registers/NDR/2026-02-16-spelling-neutrality.cog.md"
      date: 2026-02-16
      strategy:
        - "Abbreviate: org (not organisation/organization). W3C Organization Ontology precedent."
        - "Follow standards: license (SPDX universal). Not licence."
        - "Use neutral synonyms: imagesAudited (not imagesAnalysed/imagesAnalyzed)."
      exceptions:
        - "license — SPDX standard spelling. Universal across npm, GitHub, every package manager."
      rationale: "MX is a global standard. Spelling-neutral names prevent regional debates and follow the Schema.org principle: when a neutral term is available, use it."

    context-specific-naming:
      rule: "Context determines syntax. YAML frontmatter uses camelCase. HTML/JS/CSS contexts use kebab-case with mx: prefix. Same field, different representation."
      alignment: "mx-canon/mx-maxine-lives/deliverables/mx-standards-alignment.cog.md"

      contexts:
        yaml:
          syntax: camelCase
          example: "buildsOn: [cog-unified-spec]"
          rationale: "Schema.org precedent. YAML is a data format — use the vocabulary's native naming."
          enforcement: mandatory

        html:
          syntax: "kebab-case with mx: prefix"
          example: "<meta name='mx:content-type' content='field-dictionary'>"
          rationale: "HTML attribute convention. Follows data-* pattern (data-user-name in HTML, dataset.userName in JS)."
          enforcement: mandatory

        jsdoc:
          syntax: "kebab-case with @mx: tag"
          example: "@mx:runtime node"
          rationale: "JSDoc at-rule convention. @param, @returns, @mx: all follow same pattern."
          enforcement: "flexible (kebab preferred, validated by linter not spec)"

        css:
          syntax: "kebab-case with @mx: comment"
          example: "/* @mx:type utility */"
          rationale: "CSS at-rule convention. @media, @supports, @mx: all use hyphens."
          enforcement: "flexible (kebab preferred, validated by linter not spec)"

      namespace-equivalence:
        description: "The mx: object in YAML is equivalent to mx:* prefix in HTML/JS/CSS. Both represent The Gathering's standard namespace."
        yaml-form: |
          mx:
            contentType: field-dictionary
            runbook: "Parse the fields array"
        html-form: |
          <meta name="mx:content-type" content="field-dictionary">
          <meta name="mx:runbook" content="Parse the fields array">
        note: "The mx: namespace belongs to The Gathering (open standard), not Cog-Nova-MX. See governance section in mx-standards-alignment.cog.md."

      precedents:
        - standard: Schema.org
          pattern: "camelCase properties (datePublished, servesCuisine)"
          mx-applies: "YAML frontmatter fields"

        - standard: "Dublin Core"
          pattern: "dc: object in YAML, <meta name='dc:title'> in HTML"
          mx-applies: "mx: object in YAML, <meta name='mx:name'> in HTML"

        - standard: "Open Graph"
          pattern: "og: object in frontmatter, <meta property='og:title'> in HTML"
          mx-applies: "Same pattern — context determines syntax"

        - standard: "HTML dataset API"
          pattern: "data-user-name (HTML) → dataset.userName (JS)"
          mx-applies: "mx:content-type (HTML) → contentType (YAML under mx:)"

      enforcement-levels:
        mandatory:
          - "YAML frontmatter: camelCase required"
          - "HTML meta tags: kebab-case required"
        flexible:
          - "JSDoc comments: kebab-case preferred, enforce via ESLint"
          - "CSS comments: kebab-case preferred, enforce via stylelint"
        rationale: "Strict where machines parse (YAML, HTML). Flexible where humans read (code comments)."

  sources:
    merged-from:
      - path: datalake/knowledge/reference/mx-metadata-standards.md
        contribution: "Field definitions, validation rules, audience/purpose semantics"
      - path: datalake/knowledge/reference/frontmatter-field-audit.md
        contribution: "Usage counts across 1,065 files, naming inconsistencies, profile groupings"
      - path: datalake/knowledge/specifications/index-of-yaml-attributes-used.md
        contribution: "Auto-generated attribute index from .mx.yaml.md folder metadata files"

  overlap-resolution:
    - fields: [tags, keywords]
      winner: tags
      reason: "tags is canonical. Discovery keywords for AI and search."

    - fields: [words, tags]
      overlap: false
      reason: "Different concerns. words is a spell-checker dictionary list in ROUTING.cog.md concepts — it tells aspell which terms are valid MX vocabulary. tags is for document discovery. A cog can have tags: [routing, agent] and the routing concept can have words: [routing] — different purposes."

    - fields: [keyFields, tags]
      overlap: false
      reason: "Different concerns. keyFields is a ROUTING.cog.md route hint — it tells agents which YAML fields matter most when reading files in that folder. tags is for discovery. keyFields says 'look at these fields', tags says 'find me by these terms'."

    - fields: [audience, audience.primary]
      winner: audience
      reason: "audience is the canonical top-level field. audience.primary is a legacy namespace variant from folder metadata. Use audience."

    - fields: [created, date, creation-date]
      winner: created
      reason: "created is canonical."

    - fields: [modified, lastUpdated, lastmod, last-updated]
      winner: modified
      reason: "modified is canonical."

    - fields: [author, createdBy]
      winner: author
      reason: "author is canonical."

    - fields: [refersTo, related_files, related-files, related-documents, relatedDocuments, related-documentation]
      winner: refersTo
      reason: "refersTo is canonical."

    - fields: [partOf, part-of]
      winner: partOf
      reason: "partOf is canonical (camelCase)."

    - fields: [coOwnership, co-ownership]
      winner: coOwnership
      reason: "coOwnership is canonical (camelCase)."

    - fields: [org, organisation, organization]
      winner: org
      reason: "Neutral abbreviation. Avoids US/UK spelling entirely. W3C Organization Ontology uses org: prefix. NDR #3."

    - fields: [version, document-version]
      winner: version
      reason: "version is canonical."

    - fields: [mx:context-provides, mx:context_provides, mx-ai-contextProvides]
      winner: mx:context-provides
      reason: "mx:context-provides is canonical (kebab-case, mx: prefix)."

    # === KEBAB-CASE → CAMELCASE MIGRATIONS ===
    # Legacy kebab-case fields migrate to canonical camelCase

    - fields: [builds-on, buildsOn]
      winner: buildsOn
      reason: "buildsOn is canonical (camelCase). builds-on is legacy kebab-case."

    - fields: [blog-state, blogState]
      winner: blogState
      reason: "blogState is canonical (camelCase). blog-state is legacy kebab-case."

    - fields: [publication-date, publicationDate]
      winner: publicationDate
      reason: "publicationDate is canonical (camelCase). publication-date is legacy kebab-case."

    - fields: [next-action, nextAction]
      winner: nextAction
      reason: "nextAction is canonical (camelCase). next-action is legacy kebab-case."

    - fields: [reading-time, readingTime]
      winner: readingTime
      reason: "readingTime is canonical (camelCase). reading-time is legacy kebab-case."

    - fields: [blog-url, blogUrl]
      winner: blogUrl
      reason: "blogUrl is canonical (camelCase). blog-url is legacy kebab-case."

    - fields: [machine-only, machineOnly]
      winner: machineOnly
      reason: "machineOnly is canonical (camelCase). machine-only is legacy kebab-case."

    - fields: [folder-type, folderType]
      winner: folderType
      reason: "folderType is canonical (camelCase). folder-type is legacy kebab-case."

    - fields: [mx:content-policy, mx:contentPolicy]
      winner: mx:contentPolicy
      reason: "mx:contentPolicy is canonical (camelCase). mx:content-policy is legacy kebab-case."

    - fields: [mx:attribution, mx:attribution]
      winner: mx:attribution
      reason: "mx:attribution is canonical."

    - fields: [content-type, contentType]
      winner: contentType
      reason: "contentType is canonical (camelCase). content-type is legacy kebab-case."

    - fields: [reading-level, readingLevel]
      winner: readingLevel
      reason: "readingLevel is canonical (camelCase). reading-level is legacy kebab-case."

  fields:
    # === CORE FIELDS (all documents) ===

    - name: title
      type: string
      definition: "Human-readable document title. Non-cog files use title; cog files use name."
      status: canonical
      profile: core
      required: true

    - name: name
      type: string
      definition: "Machine identifier for cog files. Kebab-case, unique within the registry."
      status: canonical
      profile: cog
      required: true

    - name: description
      type: string
      definition: "One-line summary. Max 160 characters. Used by search engines, AI agents, and registry listings."
      status: canonical
      profile: core
      required: true

    - name: author
      type: string
      definition: "Creator of the document. Person name or collaborative attribution."
      status: canonical
      profile: core
      required: true

    - name: created
      type: string
      definition: "Creation date. ISO 8601 format (YYYY-MM-DD)."
      status: canonical
      profile: core
      required: true

    - name: modified
      type: string
      definition: "Last modification date. ISO 8601 format (YYYY-MM-DD)."
      status: canonical
      profile: core
      required: true

    - name: version
      type: string
      definition: "Semantic version string. Lives in frontmatter, never in filenames."
      status: canonical
      profile: core
      required: recommended

    - name: status
      type: string
      definition: "Lifecycle state. Standard values: draft, active, published, deprecated, archived, unknown. Decision records: proposed, accepted, rejected, superseded. Workflow: pending, planning, open, closed, sent. Special: canonical."
      status: canonical
      profile: core
      required: recommended

    - name: tags
      type: array
      definition: "Discovery keywords. Array of strings for search, filtering, and agent matching."
      status: canonical
      profile: core
      required: optional

    - name: audience
      type: string-or-array
      definition: "Intended readership. Values: tech, business, humans, machines, agents, both."
      status: canonical
      profile: core
      required: optional

    - name: purpose
      type: string
      definition: "Why this document exists. Values: specification, reference, guide, operational manual, dispatcher, configuration."
      status: canonical
      profile: core
      required: optional

    - name: license
      type: string
      definition: "SPDX license identifier."
      status: canonical
      profile: core
      required: optional

    - name: maintainer
      type: string
      definition: "Person or team responsible for maintaining this document. Distinct from author — maintainer handles ongoing updates."
      status: canonical
      profile: core
      required: optional

    - name: type
      type: string
      definition: "Generic classification. Values vary by context: document type, content type, entity type."
      status: canonical
      profile: core
      required: optional

    - name: confidentiality
      type: string
      definition: "Privacy level. Values: public, internal, confidential, restricted."
      status: canonical
      profile: core
      required: optional

    - name: ownership
      type: string-or-object
      definition: "Ownership details. Can be a string (owner name) or object with owner, delegate, and contact."
      status: canonical
      profile: core
      required: optional

    - name: domain
      type: string
      definition: "Business domain or subject area. Values: mx, reginald, allabout, gathering, canon."
      status: canonical
      profile: core
      required: optional

    - name: segment
      type: string
      definition: "Audience segment. Values: developer, author, agent, business."
      status: canonical
      profile: core
      required: optional

    # === COG FIELDS ===

    - name: category
      type: string
      definition: "Cog category. Values: mx-core, mx-tool, mx-contact, mx-ops, mx-content."
      status: canonical
      profile: cog
      required: true

    - name: partOf
      type: string
      definition: "Parent collection, suite, or initiative."
      status: canonical
      profile: cog
      required: true

    - name: buildsOn
      type: array
      definition: "Context graph. Array of cog names this document builds upon. Soft dependency — provides context, not a hard requirement."
      status: canonical
      profile: cog
      required: optional

    - name: requires
      type: array
      definition: "Hard dependencies. Array of cog names that must exist for this cog to function."
      status: canonical
      profile: cog
      required: optional

    - name: refersTo
      type: array
      definition: "Related cogs or external resources. Informational links, not dependencies."
      status: canonical
      profile: cog
      required: optional

    - name: execute
      type: object
      definition: "Action block. Contains runtime, command, actions, and policy. Its presence makes a cog an action-doc."
      status: canonical
      profile: cog
      required: false

    - name: blocks
      type: array
      definition: "Declares block types present in the document. Values: prose, action, definition, essence, provenance, version, code, html, policy, security."
      status: canonical
      profile: cog
      required: optional

    - name: policy
      type: string-or-object
      definition: "Content handling rules for agents. Inherited from uber docs via effective doc resolution."
      status: canonical
      profile: cog
      required: optional

    # === AGENT/AI FIELDS ===

    - name: ai
      type: object
      definition: "AI-related metadata. Contains disclosure, attribution, freshness policies for AI-generated content."
      status: canonical
      profile: core
      required: optional

    - name: contextProvides
      type: string-or-array
      definition: "What context this document provides to agents. Describes the knowledge or capability this document contributes."
      status: canonical
      profile: core
      required: optional

    - name: assistance
      type: string-or-object
      definition: "What assistance this document provides or requires. Can describe help available or needed."
      status: canonical
      profile: core
      required: optional

    - name: editable
      type: boolean
      definition: "Whether this content can be edited by agents. Default: false."
      status: canonical
      profile: core
      required: optional

    # === TECHNICAL FIELDS ===

    - name: runtime
      type: string
      definition: "Execution environment. Values: node, browser, deno, bun."
      status: canonical
      profile: script
      required: optional

    - name: dependencies
      type: array
      definition: "Package dependencies. Array of package names or package@version strings."
      status: canonical
      profile: script
      required: optional

    # === MX OBJECT FIELDS ===

    - name: mx
      type: object
      definition: "MX metadata object. Contains runbook, content type, and principle alignment fields."
      status: canonical
      profile: core
      required: optional

    - name: runbook
      type: string
      definition: "Operational instructions for agents. Describes how to interpret and act on this document. Lives under the mx: object in YAML."
      status: canonical
      profile: core

    - name: contentType
      type: string
      definition: "Machine-readable content type classification. Lives under the mx: object in YAML."
      status: canonical
      profile: core

    # === ROUTING-ONLY FIELDS ===

    - name: words
      type: array
      definition: "Spell-checker dictionary entries. Declares which terms are valid vocabulary. Distinct from tags — words validates spelling, tags enables discovery."
      status: canonical
      profile: routing

    - name: keyFields
      type: array
      definition: "Route hint. Tells agents which YAML fields matter most when reading files in a given folder. Distinct from tags — keyFields directs attention, tags enables discovery."
      status: canonical
      profile: routing

    # === BOOK PROFILE ===

    - name: book
      type: string
      definition: "Which book this chapter belongs to."
      status: canonical
      profile: book

    - name: chapter
      type: number
      definition: "Chapter number within the book."
      status: canonical
      profile: book

    - name: wordcount
      type: number
      definition: "Word count of the document content."
      status: canonical
      profile: book

    - name: copyright
      type: string
      definition: "Copyright notice."
      status: canonical
      profile: book

    # === BLOG PROFILE ===

    - name: publicationDate
      type: string
      definition: "Publication date. ISO 8601 format (YYYY-MM-DD)."
      status: canonical
      profile: blog

    - name: readingTime
      type: string
      definition: "Estimated reading time."
      status: canonical
      profile: blog

    - name: blogUrl
      type: string
      definition: "Published URL of the blog post."
      status: canonical
      profile: blog

    - name: blogState
      type: string
      definition: "Blog lifecycle state. Values: draft, review, published."
      status: canonical
      profile: blog

    # === CONTACT PROFILE ===

    - name: relationship
      type: string
      definition: "Relationship type. Values: advisory-board, investor, partner, prospect, team."
      status: canonical
      profile: contact

    - name: role
      type: string
      definition: "Job title or role."
      status: canonical
      profile: contact

    - name: company
      type: string
      definition: "Organisation name."
      status: canonical
      profile: contact

    - name: nextAction
      type: string
      definition: "Next action for this contact."
      status: canonical
      profile: contact

    - name: confidential
      type: boolean
      definition: "Whether this record must be excluded from public outputs."
      status: canonical
      profile: contact

    # === DEMO/HTML PROFILE ===

    - name: publicationStatus
      type: string
      definition: "Publication lifecycle. Values: draft, review, published, archived."
      status: canonical
      profile: demo

    - name: machineOnly
      type: boolean
      definition: "Whether this content is for machines only. Default: false (both audiences)."
      status: canonical
      profile: core

    # === FOLDER METADATA PROFILE ===

    - name: folderType
      type: string
      definition: "Type of folder. Values: content, config, scripts, output."
      status: canonical
      profile: folder

    - name: stability
      type: string
      definition: "Content stability. Values: stable, evolving, experimental."
      status: canonical
      profile: folder

    - name: lifecycle
      type: string
      definition: "Folder lifecycle stage. Values: production, development, deprecated."
      status: canonical
      profile: folder

    - name: hasSubfolders
      type: boolean
      definition: "Whether the folder contains subfolders."
      status: canonical
      profile: folder

    - name: inherits
      type: string
      definition: "Path to parent folder metadata file. Enables folder inheritance."
      status: canonical
      profile: folder

    - name: relatedFolders
      type: array
      definition: "Related folders with path, relationship type, and description."
      status: canonical
      profile: folder

    - name: primaryLanguages
      type: array
      definition: "Primary programming or content languages in the folder."
      status: canonical
      profile: folder

    # === MX CARRIER FIELDS ===

    - name: mx:content-policy
      type: string
      definition: "Content handling policy for agents. Used in HTML meta tags."
      status: canonical
      profile: mx-carrier

    - name: mx:attribution
      type: string
      definition: "Attribution requirement for agent-generated content. Used in HTML meta tags."
      status: canonical
      profile: mx-carrier

    # === NON-YAML MX IDENTITY FIELDS (mx:* namespace) ===
    # These fields are used in HTML meta tags, JSDoc @mx: tags, and CSS comments.
    # They are the non-YAML equivalent of the standard cog fields.

    - name: mx:name
      type: string
      definition: "Cog name. Equivalent to name in YAML frontmatter."
      status: canonical
      profile: [html, js, css]

    - name: mx:version
      type: string
      definition: "Version. Equivalent to version in YAML frontmatter."
      status: canonical
      profile: [html, js, css]

    - name: mx:type
      type: string
      definition: "Domain type classification."
      status: canonical
      profile: html

    - name: mx:purpose
      type: string
      definition: "Why this file exists."
      status: canonical
      profile: [js, css]

    - name: mx:audience
      type: string
      definition: "Intended readership."
      status: canonical
      profile: [js, css]

    - name: mx:stability
      type: string
      definition: "Stability level. Values: stable, evolving, experimental."
      status: canonical
      profile: [js, css]

    - name: mx:category
      type: string
      definition: "Cog category."
      status: canonical
      profile: [html, js, css]

    - name: mx:tags
      type: string
      definition: "Discovery keywords as comma-separated string."
      status: canonical
      profile: [html, js, css]

    - name: mx:builds-on
      type: string
      definition: "Context dependencies as comma-separated cog names."
      status: canonical
      profile: [js, css]

    - name: mx:documented-in
      type: string
      definition: "Path to companion documentation."
      status: canonical
      profile: [js, css]

    - name: mx:context-provides
      type: string
      definition: "What context this file provides to agents."
      status: canonical
      profile: [js, css]

    # === MX-PRIVATE EXTENSIONS (x-mx-p-) ===
    # Private fields are not documented here. Their names and meanings
    # are stored in $MX_HOME/registries/ and decoded only by registry holders.
    # See ADR: 2026-02-14-attribute-namespace-policy.cog.md

  profiles:
    - name: core
      description: "Fields that apply to all MX documents."
      required: [title, description, author, created, modified]
      recommended: [version, status]
      optional: [tags, audience, purpose, license, mx, machineOnly, maintainer, type, confidentiality, ownership, domain, segment, ai, contextProvides, assistance, editable]

    - name: cog
      description: "Fields specific to .cog.md files."
      required: [name, category, partOf]
      recommended: [buildsOn, tags]
      optional: [requires, refersTo, execute, blocks, policy]

    - name: book
      description: "Fields for book manuscript chapters."
      required: [book, chapter, wordcount, copyright]

    - name: blog
      description: "Fields for blog posts."
      required: [publicationDate, blogState]
      optional: [readingTime, blogUrl]

    - name: contact
      description: "Fields for contact/person records."
      required: [relationship, role, company]
      optional: [nextAction, confidential, messages]

    - name: demo
      description: "Fields for HTML demo deployments."
      required: [publicationStatus]

    - name: folder
      description: "Fields for .mx.yaml.md folder metadata."
      required: [folderType, stability, lifecycle]
      optional: [hasSubfolders, inherits, relatedFolders, primaryLanguages]

    - name: routing
      description: "Fields used exclusively in ROUTING.cog.md. Not for general documents."
      fields: [words, keyFields]

    - name: mx-carrier
      description: "MX carrier tag fields for AI content handling in HTML meta tags."
      fields: [mx:content-policy, mx:attribution]

    - name: script
      description: "Fields for executable scripts and cog.js files."
      required: [runtime]
      optional: [dependencies]

    - name: html
      description: "Fields for .cog.html files. Convention: <meta name='mx:field'>."
      required: [mx:name]
      recommended: [mx:version, mx:type]
      optional: [mx:category, mx:audience, mx:tags]

    - name: js
      description: "Fields for .cog.js files. Convention: @mx:field in JSDoc blocks."
      required: [mx:name]
      recommended: [mx:version, mx:purpose]
      optional: [mx:audience, mx:stability, mx:category, mx:tags, mx:builds-on, mx:documented-in, mx:context-provides]

    - name: css
      description: "Fields for .cog.css files. Convention: @mx:field in comment blocks."
      required: [mx:name]
      recommended: [mx:version, mx:purpose]
      optional: [mx:audience, mx:stability, mx:category, mx:tags]

    - name: x-mx-private
      description: "MX-private extension fields. Obfuscated. Prefix: x-mx-p-. Field names are not listed publicly."
      fields: []
---

# MX Field Dictionary

Every document in the MX ecosystem carries YAML frontmatter — a block of structured metadata at the top of the file. That metadata is what makes the document machine-readable. An AI agent can parse twelve lines of YAML and understand a document that would take a human ten minutes to read.

But metadata only works when everyone agrees on what the fields mean. When one team uses `keywords` and another uses `tags` for the same thing, the machines can't connect them. When a field called `date` might mean creation date, publication date, or last-modified date, the metadata is noise, not signal.

This dictionary exists to end that ambiguity. One definition per field. One source of truth for the entire ecosystem.

---

## What this dictionary does

The MX ecosystem has two complementary authorities. The **cog-unified-spec** defines structure — blocks, inheritance, reader behaviour, the architecture of a cog file. This dictionary defines **vocabulary** — what each field means, which fields are required for which document types, and what to do when two fields seem to mean the same thing.

The spec says *how* cogs are built. The dictionary says *what goes inside them*.

**For AI agents:** Parse the YAML frontmatter above. The `fields` array contains every canonical field with name, type, definition, status, and profile. The `overlap-resolution` array declares which field wins when two seem similar. The `namespace-policy` section defines who owns what.

**For humans:** Start with the naming conventions and namespace policy below — that's the philosophy. Then browse the overlap resolution section — that's where the confusion lives. The field-by-field definitions are in the YAML above, organised by profile (core, cog, book, blog, contact, folder).

---

## How fields are organised

Not every document needs every field. A blog post needs different metadata from a contact record. The dictionary groups fields into **profiles** — sets of fields that apply to specific document types.

| Profile | What it covers | Required fields |
|---------|---------------|-----------------|
| **Core** | Every MX document | `title`, `description`, `author`, `created`, `modified` |
| **Cog** | `.cog.md` files in the registry | `name`, `category`, `partOf` |
| **Book** | Protocols and Handbook chapters | `book`, `chapter`, `wordcount`, `copyright` |
| **Blog** | Published articles | `publicationDate`, `blogState` |
| **Contact** | Person records | `relationship`, `role`, `company` |
| **Folder** | `.mx.yaml.md` folder metadata | `folderType`, `stability`, `lifecycle` |
| **MX Carrier** | AI content handling policies | `mx:content-policy`, `mx:attribution` |

A cog file inherits the core profile automatically — it needs both the core fields and the cog-specific fields. The profiles are additive, not exclusive.

---

## Naming conventions

Field names are code, not prose. They need to be consistent, predictable, and unambiguous. Three naming decisions govern the entire vocabulary.

### camelCase everywhere (NDR #2)

All multi-word field names use **camelCase**: `readingLevel`, `buildsOn`, `blogState`, `contentType`. Not kebab-case (`reading-level`), not snake_case (`reading_level`).

Why? MX metadata is a vocabulary — a set of named properties, like Schema.org or Dublin Core. Web vocabularies use camelCase. HTML attributes use hyphens, but MX fields are consumed by code (AI agents, parsers, validators), not embedded in HTML markup. The vocabulary convention applies.

Single-word fields are unchanged: `title`, `author`, `created`, `version`, `tags`, `name`.

**NDR:** `mx-canon/mx-maxine-lives/registers/NDR/2026-02-16-camelcase-naming.cog.md`

### Spelling neutrality (NDR #3)

MX is a global standard. Where a field name contains a word with American/British spelling variants, use a **neutral form** — an abbreviation or synonym that sidesteps the conflict entirely.

| Strategy | Example | Precedent |
|----------|---------|-----------|
| **Abbreviate** | `org` not organisation/organization | W3C Organization Ontology uses `org:` |
| **Follow universal standards** | `license` not licence | SPDX, npm, GitHub |
| **Use neutral synonyms** | `imagesAudited` not imagesAnalysed/imagesAnalyzed | Schema.org neutral naming |

Prose content remains British English — the books, the documentation, the descriptions. Field names are code. Code doesn't have a nationality.

**NDR:** `mx-canon/mx-maxine-lives/registers/NDR/2026-02-16-spelling-neutrality.cog.md`

### The `x-mx-` prefix convention

Standard fields have no prefix — they belong to everyone. Cog-Nova-MX' own extensions use `x-mx-` (public) or `x-mx-p-` (private/obfuscated). This follows HTTP extension header convention and keeps the standard namespace clean.

---

## When fields overlap

Some fields look similar but serve different purposes. The overlap-resolution section in the YAML above is the authoritative answer, but three cases deserve explanation.

### tags vs words vs keyFields

| Field | What it means | Where it's used |
|-------|--------------|-----------------|
| `tags` | "Find me by these terms" | Any document |
| `words` | "These are real words, don't flag them as typos" | ROUTING.cog.md spell-checker only |
| `keyFields` | "When you read files here, look at these YAML fields first" | ROUTING.cog.md route hints only |

`tags` is for discovery. `words` is for the spell-checker. `keyFields` is for routing. Different jobs, different fields.

### created vs date vs creation-date

They all meant the same thing. Now there's one field: `created`. ISO 8601 format (`YYYY-MM-DD`).

### refersTo vs related_files vs related-files vs related-documents

Four names for the same concept — "what other documents does this one reference?" Now there's one: `refersTo`. Array of paths or cog names. Informational links, not hard dependencies (that's `requires`).

---

## Namespace policy

The Gathering owns the open standard. MX OS is one implementation. Any fields that MX OS adds must be visually and semantically distinct from standard fields.

Three levels, distinguished by prefix:

| Level | Prefix | Who owns it | Who can read it |
|-------|--------|-------------|-----------------|
| **Standard** | *(none)* | The Gathering | Everyone. All implementations honour these. |
| **MX-public** | `x-mx-` | Cog-Nova-MX | Anyone reading the cog. Visible but non-standard. |
| **MX-private** | `x-mx-p-` | Cog-Nova-MX | Only `$MX_HOME` registry holders. Values are obfuscated. |

The prefix tells you everything. `x-` means "extension, not the standard." `mx-` means "this extension belongs to Cog-Nova-MX." `p-` means "private — the value is meaningless without the decode registry."

Think of it like postal addresses. Standard fields are the street name — everyone can read them. `x-mx-` fields are the company name on the letterbox — visible, but not part of the official address. `x-mx-p-` fields are a locked P.O. box — you need the key to know what's inside.

### In practice

```yaml
# Standard (The Gathering) — every implementation uses these
name: mx-audit
version: "1.1.0"
author: Tom Cranstoun and Maxine

# MX-public extension — visible, non-standard
x-mx-pipeline-stage: report-generation

# MX-private extension — obfuscated, registry-decoded
x-mx-p-abc: 7f3a8b2c1d4e5f6090812345abcdef67
```

Private fields use the `x-mx-p-` prefix. The field names and their meanings are not documented publicly — they exist only in the `$MX_HOME` decode registry. External readers see a prefix and a hash. That's the point.

**ADR:** `mx-canon/mx-maxine-lives/thinking/decisions/2026-02-14-attribute-namespace-policy.cog.md`

---

## The mx: object

Inside YAML frontmatter, the `mx:` object carries MX-specific metadata that extends the standard fields. It contains the **runbook** (operational instructions for AI agents), content type declarations, and principle alignment flags.

```yaml
mx:
  contentType: field-dictionary
  runbook: "Parse the fields array. Each entry has name, type, definition, status, and profile."
```

The `mx:` namespace belongs to **The Gathering** — it is part of the open standard, not a vendor extension. This is a common source of confusion. The `mx:` object in YAML is equivalent to `<meta name="mx:field">` in HTML and `@mx:field` in JS/CSS comments. In non-YAML contexts, the prefix serves the same role that the YAML object structure serves in frontmatter.

---

## Field migration

When a field is renamed, the overlap-resolution section in the YAML above declares which name wins. The canonical name is the only name that new documents should use. Migration tooling (`npm run audit:renames`) tracks old-to-new mappings and reports references that need updating.

---

*One definition per field. No ambiguity. No overlap. The YAML is for machines. The prose is for humans. Design for both.*
