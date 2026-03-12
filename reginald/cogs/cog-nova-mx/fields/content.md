---
title: "MX Field Dictionary — Single Source of Truth"
version: "4.1"
created: 2026-02-13
modified: 2026-03-03
author: The Gathering
description: "Single source of truth for all MX field information — definitions, types, profiles, block types, carrier formats, and overlap resolution."

mx:
  status: active
  license: proprietary
  category: standard
  partOf: mx-ssot
  buildsOn: [what-is-a-cog]
  tags: [fields, metadata, yaml, frontmatter, dictionary, vocabulary, blocks, carriers, code, media, database]
  audience: [machines, humans]

  contentType: field-dictionary
  runbook: "This is the universal metadata registry. Parse the fields array for every canonical field with name, type, definition, status, and profile. The blockTypes array defines block types and their fields. The carrierFormats array maps metadata to file types. The overlap-resolution section declares which field wins when two seem similar. The namespace-policy section defines three levels: standard (no prefix), MX-public (x-mx-), and MX-private (x-mx-p-). The prefix IS the policy."

  namespacePolicy:
    description: "Three-level attribute namespace. Standard fields belong to The Gathering open standard. Extensions are namespaced to prevent pollution."
    adr: "mx-canon/mx-maxine-lives/thinking/decisions/2026-02-14-attribute-namespace-policy.cog.md"
    levels:
      - level: standard
        prefix: ""
        owner: "The Gathering"
        visibility: "Universal — all implementations use these fields"
        example: "title, author, created, version, tags"
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

        shell:
          syntax: "camelCase in # key: value lines"
          example: "# buildsOn: [script-helper]"
          rationale: "Comment-block frontmatter strips # prefix to produce valid YAML. Same naming as YAML context."
          enforcement: mandatory

        xmp:
          syntax: "mx: namespace prefix"
          example: "mx:contentType, mx:audience"
          rationale: "XMP custom namespace convention. Registered namespace URI for MX metadata."
          enforcement: mandatory

        sidecar:
          syntax: "camelCase in YAML (same as yaml context)"
          example: "{ mx: { contentType: image, aiTraining: prohibited } }"
          rationale: "Sidecar files are standard YAML. Same naming rules as YAML frontmatter."
          enforcement: mandatory

        sql-comment:
          syntax: "camelCase in -- @mx comment blocks"
          example: "-- @mx\n-- purpose: User account storage\n-- @mx:end"
          rationale: "SQL comment block stripped of -- prefix produces valid YAML."
          enforcement: mandatory

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
        status: "absorbed — file removed 2026-03-03"
      - path: datalake/knowledge/reference/frontmatter-field-audit.md
        contribution: "Usage counts across 1,065 files, naming inconsistencies, profile groupings"
        status: "absorbed — file removed 2026-03-03"
      - path: datalake/knowledge/specifications/index-of-yaml-attributes-used.md
        contribution: "Auto-generated attribute index from .mx.yaml.md folder metadata files"
      - path: mx-canon/mx-the-gathering/field-dictionary-guide.cog.md
        contribution: "How to add new fields procedure, vendor extension guidance"
        date: 2026-03-01
        status: "absorbed — file removed 2026-03-03"
      - path: mx-canon/ssot/writing-guides/mx-yaml-md-guide.md
        contribution: "Folder metadata inheritance model, identity vs inheritable fields, allowed values"
        date: 2026-03-01
      - path: explain.md
        contribution: "Metadata architecture overview — two-zone model, inheritance, profiles, namespace policy"
        date: 2026-03-03
        status: "absorbed — file removed 2026-03-03"
      - path: mx-canon/mx-the-gathering/specifications/mx-code-metadata-spec.md
        contribution: "Code metadata — repository, file, function, class, inline annotations, dependency, environment, test, API fields and carrier formats"
        date: 2026-03-03
      - path: mx-canon/mx-the-gathering/specifications/mx-media-metadata-spec.md
        contribution: "Media metadata — sidecar files, embedded metadata alignment, image, video, audio, document, rights, collections fields and carrier formats"
        date: 2026-03-03
      - path: mx-canon/mx-the-gathering/specifications/mx-database-metadata-spec.md
        contribution: "Database metadata — database, schema, table, column, relationship, index, view, query, procedure, dictionary, classification fields"
        date: 2026-03-03

  defaultsPolicy:
    description: "Two-zone frontmatter model. Zone 1 (top-level): title, description, author, created, modified, version — always explicit, never inside mx: block. Zone 2 (mx: block): all other fields. Optional Zone 2 fields with defined defaults may be omitted; tools treat absent optional fields as their documented default value."
    rule: "Only optional fields may have defaults. If an optional field's value matches its default, the field may be omitted to reduce frontmatter size. Tools must handle absent optional fields by applying the documented default."
    zones:
      top-level:
        fields: [title, description, author, created, modified, version]
        rule: "Always explicit. These are document identity fields and never move under mx:."
      mx:
        fields: "All other MX-operational fields (status, contentType, category, tags, audience, runbook, execute, ai* fields, etc.)"
        rule: "Optional fields with documented defaults may be omitted when matching their default value."
    always-explicit:
      - {field: title, requirement: required, reason: "Identity — every document needs a name"}
      - {field: description, requirement: required, reason: "Discovery — search engines and AI agents need this"}
      - {field: author, requirement: required, reason: "Attribution — immutable provenance"}
      - {field: created, requirement: required, reason: "Timestamp — immutable creation date"}
      - {field: modified, requirement: required, reason: "Timestamp — last modification date"}
      - {field: version, requirement: recommended, reason: "Version tracking — explicit is safer than assumed"}
      - {field: status, requirement: recommended, reason: "Lifecycle — always declare your document state"}
    fields-with-defaults:
      - field: confidential
        default: false
        absent-means: "Document is public"
      - field: machineOnly
        default: false
        absent-means: "Content is for both humans and machines"
      - field: aiAssistance
        default: "welcome"
        absent-means: "AI agents are welcome to assist"
      - field: aiEditable
        default: false
        absent-means: "AI agents should not edit this content"
      - field: aiGenerationAllowed
        default: true
        absent-means: "AI generation is permitted"
      - field: aiGenerationReviewRequired
        default: true
        absent-means: "AI-generated content requires human review"

  # ═══════════════════════════════════════════════════════════════
  # BLOCK TYPES — moved from cog-unified-spec.cog.md Section 3
  # Each block type defines what content it carries and what fields it requires.
  # One cog type, many blocks. The blocks determine behaviour.
  # ═══════════════════════════════════════════════════════════════

  blockTypes:
    - name: prose
      implicit: true
      description: "Human-readable narrative. The markdown body of every cog. Never declared in YAML — it is implicit."
      fields:
        - name: prose-source
          type: string
          required: false
          description: "External file path for inherited prose content. Allows one cog to carry machine-readable YAML while a companion .md file carries the human narrative."

    - name: essence
      implicit: false
      description: "Binary content (images, PDFs, audio, video, compiled assets). Encoded as base64 or a pointer."
      sizeRule: "2kb or smaller = embedded base64. Over 2kb = pointer with checksum."
      fields:
        - name: type
          type: string
          required: true
          description: "MIME type (e.g., image/png, application/pdf, audio/mpeg)"
        - name: encoding
          type: string
          required: true
          validValues: [base64, pointer]
          description: "How binary content is stored"
        - name: size
          type: number
          required: true
          description: "Content size in bytes"
        - name: content
          type: string
          required: false
          description: "Base64-encoded content (when encoding is base64)"
        - name: location
          type: string
          required: false
          description: "File path to binary content (when encoding is pointer)"
        - name: checksum
          type: string
          required: false
          description: "SHA-256 checksum for verification (when encoding is pointer)"

    - name: definition
      implicit: false
      description: "Standards conformance declarations. The cog's backward-compatibility statement and contract with readers."
      hierarchical: true
      hierarchyNote: "Document-level definition applies to all blocks. Per-block definition overrides for that block only."
      fields:
        - name: standards
          type: array
          required: true
          description: "Array of conformance declarations"
        - name: standards[].name
          type: string
          required: true
          description: "Standard name (e.g., The Gathering, Schema.org, WebMCP)"
        - name: standards[].version
          type: string
          required: true
          description: "Standard version (semantic versioning)"
        - name: standards[].scope
          type: string
          required: true
          description: "What this standard applies to (e.g., cog metadata format, product metadata)"

    - name: action
      implicit: false
      description: "Executable instructions. Presence of an execute object makes a cog into an action-doc. See execute fields in the fields array."
      note: "The action block IS the execute object in YAML frontmatter. Documented as execute.* fields in this dictionary."

    - name: code
      implicit: false
      description: "Source code embedded in the cog. Machine-addressable — a reader can extract and execute it. Unlike fenced code blocks in prose (display only)."
      fields:
        - name: language
          type: string
          required: true
          description: "Programming language (e.g., javascript, python, bash)"
        - name: content
          type: string
          required: true
          description: "Source code content"
        - name: purpose
          type: string
          required: false
          description: "What this code does"

    - name: html
      implicit: false
      description: "HTML content. May reference WebMCP for embedded routines. Can carry interactive widgets, forms, or visualisations."
      interBlockAccess: "An HTML block using WebMCP can access all other blocks in the cog — reading essence content, querying code blocks, rendering provenance. Governed by security block and SOP policy."
      fields:
        - name: content
          type: string
          required: true
          description: "HTML markup"
        - name: standards
          type: array
          required: false
          description: "Conformance declarations (e.g., WebMCP)"

    - name: security
      implicit: false
      description: "Trust and execution policy. Readers consult the security block to determine whether to execute action blocks or render HTML blocks."
      fields:
        - name: signing
          type: string
          required: false
          validValues: [required, optional]
          description: "Whether cryptographic signing is required"
        - name: execution
          type: string
          required: false
          validValues: [sandboxed, unrestricted]
          description: "Execution environment constraint"
        - name: trust-level
          type: number
          required: false
          description: "Numeric trust tier (1-3)"
        - name: policy
          type: string
          required: false
          description: "Free text policy statement"

    - name: sop
      implicit: false
      virtual: true
      description: "Standard Operating Procedures. Merged at read-time from the uber doc (UBER.cog.md). Does not exist in the cog file on disk."
      fields:
        - name: scope
          type: string
          required: true
          description: "What this SOP applies to (all-cogs, html-blocks, domain-specific)"
        - name: instructions
          type: string
          required: true
          description: "Procedure instructions (multi-line text)"

    - name: provenance
      implicit: false
      description: "Origin and lineage — where the content came from, how it was derived, what transformations were applied."
      fields:
        - name: origin
          type: string
          required: false
          description: "URL of original source"
        - name: derived-from
          type: string
          required: false
          description: "Source cog reference"
        - name: method
          type: string
          required: false
          description: "Transformation description"
        - name: date
          type: string
          required: false
          description: "Derivation date (ISO 8601)"

    - name: version
      implicit: false
      description: "Version history and changelog within the cog. Complements the top-level version field with detailed history."
      fields:
        - name: history
          type: array
          required: true
          description: "Array of version entries"
        - name: history[].version
          type: string
          required: true
          description: "Version number (semver)"
        - name: history[].date
          type: string
          required: true
          description: "Release date (ISO 8601)"
        - name: history[].changes
          type: string
          required: true
          description: "Description of changes"

  # ═══════════════════════════════════════════════════════════════
  # CARRIER FORMATS — how metadata is expressed in each file type
  # MX follows the embrace-and-extend model. Each file type carries
  # metadata in its native format. MX never duplicates, never wraps.
  # ═══════════════════════════════════════════════════════════════

  carrierFormats:
    - format: ".cog.md"
      metadataLocation: "YAML frontmatter between --- delimiters"
      mxIdentity: "Standard cog fields in YAML"
      nativeBlocks: "Markdown body = prose block"
      parsingRule: "Standard YAML parser reads frontmatter"
      backwardCompatible: true
      narrativeSection: "Carrier: YAML Frontmatter"

    - format: ".cog.html"
      metadataLocation: "<meta> tags in <head>"
      mxIdentity: '<meta name="mx:*"> tags, data-mx-* attributes on elements'
      nativeBlocks: "Schema.org JSON-LD = definition, <meta name='description'> = prose excerpt, <main> = essence"
      parsingRule: "Parse <meta> tags; strip mx: prefix; apply kebab-to-camelCase conversion"
      backwardCompatible: true
      note: "Browsers ignore unknown <meta> names. Can embed <style> and <script> with their own native metadata."
      pointerPattern: '<link rel="mx" href="page.cog.md">'
      narrativeSection: "Carrier: HTML"

    - format: ".cog.js"
      metadataLocation: "JSDoc comment block (/** ... */)"
      mxIdentity: "@mx: tags in JSDoc"
      nativeBlocks: "@description = prose, @param/@returns = definition, function bodies = code (implicit)"
      parsingRule: "Parse JSDoc block; extract @mx: prefixed tags; value follows tag on same line"
      backwardCompatible: true
      note: "JavaScript runtimes ignore JSDoc comments"
      narrativeSection: "Carrier: JavaScript/TypeScript"

    - format: ".cog.css"
      metadataLocation: "/* */ comment block at file top"
      mxIdentity: "@mx: tags in CSS comments"
      nativeBlocks: "File description = prose, :root custom properties = definition"
      parsingRule: "Parse opening comment block; extract @mx: prefixed tags"
      backwardCompatible: true
      note: "CSS processors ignore comment content"
      narrativeSection: "Carrier: CSS"

    - format: ".cog.png/.cog.jpg"
      metadataLocation: "EXIF/XMP metadata"
      mxIdentity: "MX XMP fields in custom namespace"
      nativeBlocks: "Existing EXIF = provenance"
      parsingRule: "Read XMP; extract mx: namespace fields"
      backwardCompatible: true
      narrativeSection: "Carrier: Images and Media"

    - format: "shell scripts"
      metadataLocation: "# --- comment block after shebang"
      mxIdentity: "Standard fields in # key: value lines"
      nativeBlocks: "Script body = code (implicit)"
      parsingRule: "Strip leading # and one space from each line between # --- delimiters. Result is valid YAML."
      backwardCompatible: true
      applicability: "Any #-comment language: bash, python, ruby, perl, dockerfiles, YAML configs"
      narrativeSection: "Carrier: Shell Scripts"

    - format: ".mx.yaml (media sidecar)"
      metadataLocation: "Standalone YAML sidecar file alongside media asset"
      mxIdentity: "Standard YAML with mx: block"
      nativeBlocks: "Sidecar extends or overrides embedded metadata (EXIF/IPTC/XMP)"
      parsingRule: "Standard YAML parser. File naming: {assetname}.mx.yaml for individual assets, _mx.yaml for directory defaults."
      backwardCompatible: true
      narrativeSection: "Carrier: Media Sidecar"

    - format: "mx.yaml (code repository)"
      metadataLocation: "mx.yaml or .mx/config.yaml at repository root"
      mxIdentity: "Standard YAML with project, context, stack, conventions, ai properties"
      nativeBlocks: "Repository-level metadata inherited by all files"
      parsingRule: "Standard YAML parser. Discovery order: mx.yaml, .mx/config.yaml, package.json[mx], pyproject.toml[tool.mx]"
      backwardCompatible: true
      narrativeSection: "Carrier: Code Repository"

    - format: "database sidecars"
      metadataLocation: "mx.database.yaml, {name}.schema.yaml, {name}.table.yaml, {name}.view.yaml, {name}.query.yaml"
      mxIdentity: "Standard YAML describing database objects"
      nativeBlocks: "Database hierarchy metadata"
      parsingRule: "Standard YAML parser. Also supports inline SQL comments: -- @mx ... -- @mx:end"
      backwardCompatible: true
      narrativeSection: "Carrier: Database Sidecar"

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


    - fields: [content-type, contentType]
      winner: contentType
      reason: "contentType is canonical (camelCase). content-type is legacy kebab-case."

    - fields: [reading-level, readingLevel]
      winner: readingLevel
      reason: "readingLevel is canonical (camelCase). reading-level is legacy kebab-case."

    - fields: [moved-from, movedFrom]
      winner: movedFrom
      reason: "movedFrom is canonical (camelCase). moved-from is legacy kebab-case."

    - fields: [moved-date, movedDate]
      winner: movedDate
      reason: "movedDate is canonical (camelCase). moved-date is legacy kebab-case."

    - fields: [session-start, sessionStart]
      winner: sessionStart
      reason: "sessionStart is canonical (camelCase). session-start is legacy kebab-case."

    - fields: [session-end, sessionEnd]
      winner: sessionEnd
      reason: "sessionEnd is canonical (camelCase). session-end is legacy kebab-case."

    - fields: [report-type, reportType]
      winner: reportType
      reason: "reportType is canonical (camelCase). report-type is legacy kebab-case."

    - fields: [report-id, reportId]
      winner: reportId
      reason: "reportId is canonical (camelCase). report-id is legacy kebab-case."

    - fields: [pages-analyzed, pagesAnalyzed, pagesAudited]
      winner: pagesAudited
      reason: "pagesAudited is canonical (spelling-neutral, NDR #3). pagesAnalyzed is American English. pages-analyzed is legacy kebab-case."

    - fields: [performance-score, performanceScore]
      winner: performanceScore
      reason: "performanceScore is canonical (camelCase). performance-score is legacy kebab-case."

    - fields: [llm-suitability-score, llmSuitabilityScore]
      winner: llmSuitabilityScore
      reason: "llmSuitabilityScore is canonical (camelCase). llm-suitability-score is legacy kebab-case."

    - fields: [seo-score, seoScore]
      winner: seoScore
      reason: "seoScore is canonical (camelCase). seo-score is legacy kebab-case."

    - fields: [content-state, contentState]
      winner: contentState
      reason: "contentState is canonical (camelCase). content-state is legacy kebab-case. Distinct from status — tracks content workflow position."

    - fields: [mx-watches-files, mxWatchesFiles]
      winner: mxWatchesFiles
      reason: "mxWatchesFiles is canonical (camelCase). mx-watches-files is legacy kebab-case."

    # === AI FIELD PREFIX MIGRATIONS ===
    # All AI policy fields now carry the ai prefix for clarity

    - fields: [assistance, aiAssistance]
      winner: aiAssistance
      reason: "aiAssistance is canonical. All AI policy fields use the ai prefix."

    - fields: [editable, aiEditable]
      winner: aiEditable
      reason: "aiEditable is canonical. All AI policy fields use the ai prefix."

    - fields: [training, aiTraining]
      winner: aiTraining
      reason: "aiTraining is canonical. All AI policy fields use the ai prefix."

    - fields: [trainingConditions, aiTrainingConditions]
      winner: aiTrainingConditions
      reason: "aiTrainingConditions is canonical. All AI policy fields use the ai prefix."

    - fields: [generationAllowed, aiGenerationAllowed]
      winner: aiGenerationAllowed
      reason: "aiGenerationAllowed is canonical. All AI policy fields use the ai prefix."

    - fields: [generationReviewRequired, aiGenerationReviewRequired]
      winner: aiGenerationReviewRequired
      reason: "aiGenerationReviewRequired is canonical. All AI policy fields use the ai prefix."

    - fields: [sensitivePaths, aiSensitivePaths]
      winner: aiSensitivePaths
      reason: "aiSensitivePaths is canonical. All AI policy fields use the ai prefix."

    - fields: [permittedAreas, aiPermittedAreas]
      winner: aiPermittedAreas
      reason: "aiPermittedAreas is canonical. All AI policy fields use the ai prefix."

    - fields: [prohibitedAreas, aiProhibitedAreas]
      winner: aiProhibitedAreas
      reason: "aiProhibitedAreas is canonical. All AI policy fields use the ai prefix."

    # === NEAR-DUPLICATE RESOLUTIONS ===

    - fields: [status, blogState, publicationStatus]
      overlap: false
      reason: "Different scopes. status is the generic lifecycle field (core profile, 18 values). blogState is blog-specific (draft, review, published). publicationStatus is demo/HTML-specific (draft, review, published, archived). Use the profile-specific field when available."

    - fields: [confidential, confidentiality]
      winner: confidential
      reason: "confidential (boolean) is canonical. confidentiality (string with graduated values) is deprecated. Use confidential: true to mark private records."

    - fields: [inherit, inherits, inheritFrom, inheritable]
      winner: inheritable
      reason: "inheritable is canonical. inherit, inherits, and inheritFrom are deprecated. Parent folders declare which fields are inheritable; child folders do not need to specify where they inherit from."

    - fields: [type, contentType, cogType]
      winner: contentType
      reason: "type is deprecated (too generic, undefined values). Use contentType for document classification, cogType for cog classification."

    - fields: [wordcount, wordCount]
      winner: wordCount
      reason: "wordCount is canonical (camelCase, NDR #2). wordcount is a legacy naming violation."

    - fields: [issued, publicationDate]
      winner: publicationDate
      reason: "publicationDate is canonical. issued is deprecated (v1.9). Both represent a publication date; one field is sufficient."

    - fields: [description, purpose]
      overlap: false
      reason: "Different concerns. description is a one-line summary of what the document is (max 160 chars, for search and discovery). purpose is an enumerated classification of why it exists (specification, reference, guide, etc.)."

    - fields: [name, title]
      winner: title
      reason: "title is canonical (v1.9). name is deprecated. Machine identifier is now derived from filename."

    - fields: [location, venue]
      winner: location
      reason: "location is canonical (v1.9). venue is deprecated. location now serves both contact and event profiles."

    - fields: [author, maintainer]
      overlap: false
      reason: "Different roles. author is the original creator (immutable). maintainer is the person or team responsible for ongoing updates (mutable). A document's author never changes; its maintainer may."

  fields:
    # === CORE FIELDS (all documents) ===

    - name: title
      type: string
      definition: "Human-readable document title. The canonical identity field for all documents including cog files."
      example: "MX Field Dictionary"
      notes: "Required on every document. If both title in frontmatter and an H1 heading exist, avoid duplication."
      status: canonical
      profile: core
      required: true

    - name: name
      type: string
      definition: "Deprecated. Machine identifier formerly used in cog files. Use title instead; machine ID is now derived from filename."
      notes: "Deprecated in v1.9. Machine identifier now derived from filename. Use title."
      status: deprecated
      profile: cog
      supersededBy: title

    - name: description
      type: string
      definition: "One-line summary. Max 160 characters. Used by search engines, AI agents, and registry listings."
      example: "Single source of truth for every YAML frontmatter field."
      notes: "Max 160 characters. Used by search engines, AI agents, and the cog registry."
      status: canonical
      profile: core
      required: true

    - name: author
      type: string
      definition: "Creator of the document. Person name or collaborative attribution."
      example: "Tom Cranstoun and Maxine"
      notes: "Immutable after creation. For collaborative work, list all contributors. Distinct from maintainer."
      status: canonical
      profile: core
      required: true

    - name: created
      type: string
      definition: "Creation date. ISO 8601 format (YYYY-MM-DD)."
      example: 2026-03-01
      notes: "Immutable — set once, never updated. ISO 8601 (YYYY-MM-DD)."
      status: canonical
      profile: core
      required: true

    - name: modified
      type: string
      definition: "Last modification date. ISO 8601 format (YYYY-MM-DD)."
      example: 2026-03-02
      notes: "Update every time file content changes. ISO 8601 (YYYY-MM-DD)."
      status: canonical
      profile: core
      required: true

    - name: version
      type: string
      definition: "Semantic version string. Lives in frontmatter, never in filenames."
      example: "2.0"
      notes: "Always quote in YAML (prevents 1.0 being parsed as number). Lives in frontmatter, never in filenames."
      status: canonical
      profile: core
      required: recommended

    - name: status
      type: string
      definition: "Lifecycle state. Standard values: draft, active, published, deprecated, archived, unknown. Decision records: proposed, accepted, rejected, superseded. Workflow: pending, review, approved, planning, open, closed, sent. Special: canonical."
      example: active
      validValues: [draft, active, published, deprecated, archived, unknown, proposed, accepted, rejected, superseded, pending, review, approved, planning, open, closed, sent, canonical]
      notes: "Core recommended — always include. Different contexts use different subsets."
      status: canonical
      profile: core
      required: recommended

    - name: tags
      type: array
      definition: "Discovery keywords. Array of strings for search, filtering, and agent matching."
      example: [metadata, yaml, frontmatter, reference]
      notes: "Array of lowercase strings for search, filtering, and agent matching."
      status: canonical
      profile: core
      required: optional

    - name: audience
      type: string-or-array
      definition: "Intended readership. Values: tech, business, humans, machines, agents, both."
      example: [humans, machines]
      validValues: [tech, business, humans, machines, agents, both]
      notes: "Can be string or array."
      status: canonical
      profile: core
      required: optional

    - name: purpose
      type: string
      definition: "Why this document exists. Values: specification, reference, guide, operational manual, dispatcher, configuration."
      example: reference
      validValues: [specification, reference, guide, "operational manual", dispatcher, configuration]
      notes: "Why this document exists. Distinct from contentType (classification)."
      status: canonical
      profile: core
      required: optional

    - name: license
      type: string
      definition: "SPDX license identifier."
      example: proprietary
      notes: "SPDX identifier. Common values: proprietary, MIT, Apache-2.0, CC-BY-4.0."
      status: canonical
      profile: core
      required: optional

    - name: maintainer
      type: string
      definition: "Person or team responsible for maintaining this document. Distinct from author — maintainer handles ongoing updates."
      example: "Maxine"
      notes: "Mutable. Distinct from author (immutable creator). The person handling ongoing updates."
      status: canonical
      profile: core
      required: optional

    - name: type
      type: string
      definition: "Generic classification. Deprecated — use contentType for documents, cogType for cogs."
      notes: "Deprecated. Use contentType for documents, cogType for cogs."
      status: deprecated
      profile: core
      required: optional

    - name: confidentiality
      type: string
      definition: "Privacy level. Deprecated — use confidential (boolean) instead."
      notes: "Deprecated. Use confidential (boolean) instead."
      status: deprecated
      profile: core
      required: optional

    - name: ownership
      type: string-or-object
      definition: "Ownership details. Can be a string (owner name) or object with owner, delegate, and contact."
      example: "Tom Cranstoun"
      notes: "Can be a string or object with owner, delegate, and contact fields."
      status: canonical
      profile: core
      required: optional

    - name: domain
      type: string
      definition: "Business domain or subject area. In folder metadata, lives under the mx: object and is an identity field (never inherited). Values are context-specific."
      example: "machine-experience"
      notes: "Identity field in folder metadata — never inherited. Values are context-specific."
      status: canonical
      profile: [core, folder]
      required: optional

    - name: segment
      type: string
      definition: "Audience segment. Values: developer, author, agent, business."
      example: developer
      validValues: [developer, author, agent, business]
      status: canonical
      profile: core
      required: optional

    # === COG FIELDS ===

    - name: category
      type: string
      definition: "Cog category. Values: mx-core, mx-tool, mx-contact, mx-ops, mx-content."
      example: standard
      notes: "Required for cog files. Determines registry grouping."
      status: canonical
      profile: cog
      required: true

    - name: partOf
      type: string
      definition: "Parent collection, suite, or initiative."
      example: mx-the-gathering
      notes: "Required for cog files. Names the parent collection or initiative."
      status: canonical
      profile: cog
      required: true

    - name: buildsOn
      type: array
      definition: "Context graph. Array of cog names this document builds upon. Soft dependency — provides context, not a hard requirement."
      example: [what-is-a-cog, cog-unified-spec]
      notes: "Soft dependency for context. Builds the cog knowledge graph."
      status: canonical
      profile: cog
      required: optional

    - name: requires
      type: array
      definition: "Hard dependencies. Array of cog names that must exist for this cog to function."
      example: [node-runtime, markdownlint-cli2]
      notes: "Hard dependency. The cog cannot function without these."
      status: canonical
      profile: cog
      required: optional

    - name: refersTo
      type: array
      definition: "Related cogs or external resources. Informational links, not dependencies."
      example: [field-dictionary, cog-unified-spec]
      notes: "Informational links, not dependencies."
      status: canonical
      profile: cog
      required: optional

    - name: includes
      type: array
      definition: "Cog composition — content reuse without duplication. Array of include declarations, each specifying a source cog (relative path or reginald:<name>), optional block filter, and resolution mode (build or read). Included content is merged into the cog; the including cog's own content overrides included content of the same type."
      example: [{source: "shared/validation-policy.cog.md", blocks: [sop], resolution: build}]
      notes: "Structural composition. Distinct from builds-on (soft recommendation) and requires (hard dependency). See cog-unified-spec Section 3 for full specification including inline @include markers."
      status: canonical
      profile: cog
      required: optional

    - name: execute
      type: object
      definition: "Action block. Contains runtime, command, actions, and policy. Its presence makes a cog an action-doc."
      example: {runtime: node, command: "node scripts/validate.js"}
      notes: "Its presence makes a cog an action-doc. Action cogs live in scripts/ folder."
      status: canonical
      profile: cog
      required: false

    - name: blocks
      type: array
      definition: "Declares block types present in the document. Values: prose, action, definition, essence, provenance, version, code, html, sop, security."
      example: [prose, definition, code]
      validValues: [prose, action, definition, essence, provenance, version, code, html, sop, security]
      notes: "Declares block types present in the document body."
      status: canonical
      profile: cog
      required: optional

    - name: policy
      type: string-or-object
      definition: "Content handling rules for agents. Inherited from uber docs via effective doc resolution."
      example: "inherit from parent uber-doc"
      notes: "Content handling rules for agents. Inherited via effective doc resolution."
      status: canonical
      profile: cog
      required: optional

    - name: deliverable
      type: string-or-array
      definition: "What this cog produces or delivers. Declares the tangible output — a report, a validated artefact, a trained team, a published page. Particularly useful for action-docs where the deliverable is the reason the cog exists."
      example: "validated cog registered in REGINALD"
      notes: "Declares the output of a cog. For action-docs, describes what running the actions produces. For info-docs, describes the knowledge or artefact the cog represents. Array form for cogs with multiple deliverables."
      status: canonical
      profile: cog
      required: optional

    # === AGENT/AI FIELDS ===

    - name: ai
      type: object
      definition: "AI-related metadata. Contains disclosure, attribution, freshness policies for AI-generated content."
      example: {disclosure: true, attribution: "Generated by Claude"}
      notes: "Container for AI-specific metadata: disclosure, attribution, freshness."
      status: canonical
      profile: core
      required: optional

    - name: contextProvides
      type: string-or-array
      definition: "What context this document provides to agents. Describes the knowledge or capability this document contributes."
      example: "Field definitions and naming conventions for the MX ecosystem"
      notes: "Describes what knowledge this document contributes to an agent context window."
      status: canonical
      profile: core
      required: optional

    - name: aiAssistance
      type: string-or-object
      definition: "AI assistance policy. Values: welcome, restricted, prohibited. Inheritable."
      default: "welcome"
      example: restricted
      validValues: [welcome, restricted, prohibited]
      notes: "Inheritable. Only declare when restricting or prohibiting."
      status: canonical
      profile: [core, folder]
      required: optional

    - name: aiEditable
      type: boolean
      definition: "Whether this content can be edited by AI agents. In folder metadata defaults to true. Inheritable."
      default: false
      example: true
      notes: "Inheritable. In folder metadata defaults to true. Only declare when granting edit permission on documents."
      status: canonical
      profile: [core, folder]
      required: optional

    # === TECHNICAL FIELDS ===

    - name: runtime
      type: string
      definition: "Execution environment. Values: node, browser, deno, bun."
      example: node
      validValues: [node, browser, deno, bun]
      notes: "Required for script profile."
      status: canonical
      profile: script
      required: optional

    - name: dependencies
      type: array
      definition: "Package dependencies. Array of package names or package@version strings."
      example: [markdownlint-cli2, gray-matter]
      notes: "Array of package names or package@version strings."
      status: canonical
      profile: script
      required: optional

    # === MX METADATA FIELDS (formerly nested under mx: object) ===

    - name: mxSpecVersion
      type: string
      definition: "MX specification version. Distinct from version (document version). Typically '1.0'."
      example: "1.0"
      notes: "Distinct from version (document version). Tracks MX specification conformance."
      status: canonical
      profile: folder
      required: optional

    - name: project
      type: object
      definition: "Project metadata object. Contains name, description, repository, documentation."
      example: {name: "MX Hub", repository: "https://github.com/..."}
      notes: "Container for project-level metadata in root folder files."
      status: canonical
      profile: folder
      required: optional

    - name: context
      type: object
      definition: "Domain context object. Contains domain, purpose, constraints."
      example: {domain: "machine-experience", purpose: specification}
      notes: "Container for domain context in folder metadata."
      status: canonical
      profile: folder
      required: optional

    - name: stack
      type: object
      definition: "Technical stack object. Contains language, runtime, version."
      example: {language: javascript, runtime: node}
      notes: "Container for technical stack information."
      status: canonical
      profile: folder
      required: optional

    - name: conventions
      type: object
      definition: "Code conventions object. Contains style, testing, documentation, markdown, commits."
      example: {style: "ESLint + Prettier", markdown: markdownlint-cli2}
      notes: "Container for code and documentation conventions. Inheritable."
      status: canonical
      profile: folder
      required: optional

    # === INHERITANCE FIELDS ===

    - name: inheritable
      type: array
      definition: "List of field paths that child folders inherit from this folder's metadata."
      example: [author, audience, stability, aiAssistance, aiEditable]
      notes: "Parent declares which fields children may inherit. Identity fields should never be listed."
      status: canonical
      profile: folder
      required: optional

    - name: inherit
      type: boolean-or-string
      definition: "Whether to inherit from parent. Deprecated — use inheritable on the parent folder instead."
      notes: "Deprecated. Use inheritable on the parent folder instead."
      status: deprecated
      profile: folder
      required: optional

    - name: inheritFrom
      type: string
      definition: "Explicit path to parent metadata file. Deprecated — use inheritable on the parent folder instead."
      notes: "Deprecated. Use inheritable on the parent folder instead."
      status: deprecated
      profile: folder
      required: optional

    - name: inheritExcept
      type: array
      definition: "Fields to exclude from inheritance. Array of field names."
      example: [audience, stability]
      notes: "Child folder opts out of specific inherited fields."
      status: canonical
      profile: folder
      required: optional

    - name: runbook
      type: string
      definition: "Operational instructions for agents. Describes how to interpret and act on this document."
      example: "Parse the fields array. Each entry has name, type, definition, status, and profile."
      notes: "Instructions for AI agents. Write in imperative voice. Be specific."
      status: canonical
      profile: core

    - name: contentType
      type: string
      definition: "Machine-readable content type classification."
      example: field-dictionary
      notes: "Free-form classification. Common: specification, guide, reference, info-doc, identity, report."
      status: canonical
      profile: core

    # === AI FIELDS (all prefixed with ai) ===

    - name: aiTraining
      type: string
      definition: "AI training policy. Values: conditional, allowed, prohibited. Inheritable."
      example: conditional
      validValues: [conditional, allowed, prohibited]
      notes: "Inheritable. When conditional, check aiTrainingConditions."
      status: canonical
      profile: folder

    - name: aiTrainingConditions
      type: array
      definition: "Conditions under which AI training is permitted. Array of strings describing exclusions or requirements."
      example: [exclude credentials, exclude personal data]
      notes: "Only relevant when aiTraining is conditional."
      status: canonical
      profile: folder

    - name: aiSensitivePaths
      type: array
      definition: "Glob patterns for paths that AI agents must not read or train on."
      example: [secrets/**, .env, credentials.*]
      notes: "Glob patterns. Applied recursively within the folder."
      status: canonical
      profile: folder

    - name: aiPermittedAreas
      type: array
      definition: "Glob patterns for paths where AI generation is allowed."
      example: [docs/**, src/public/**]
      notes: "Glob patterns for explicitly allowed AI generation."
      status: canonical
      profile: folder

    - name: aiProhibitedAreas
      type: array
      definition: "Glob patterns for paths where AI generation is prohibited."
      example: [legal/**, contracts/**]
      notes: "Glob patterns for explicitly forbidden AI generation."
      status: canonical
      profile: folder

    - name: aiGenerationAllowed
      type: boolean
      definition: "Whether AI agents may generate new content. Inheritable."
      default: true
      example: false
      notes: "Inheritable. Only declare when prohibiting generation."
      status: canonical
      profile: folder

    - name: aiGenerationReviewRequired
      type: boolean
      definition: "Whether AI-generated content requires human review. Inheritable."
      default: true
      example: false
      notes: "Inheritable. Only declare when waiving the review requirement."
      status: canonical
      profile: folder

    # === ROUTING-ONLY FIELDS ===

    - name: words
      type: array
      definition: "Spell-checker dictionary entries. Declares which terms are valid vocabulary. Distinct from tags — words validates spelling, tags enables discovery."
      example: [cog, frontmatter, metadata, camelCase]
      notes: "ROUTING.cog.md only. Validates spelling, not discovery. Distinct from tags."
      status: canonical
      profile: routing

    - name: keyFields
      type: array
      definition: "Route hint. Tells agents which YAML fields matter most when reading files in a given folder. Distinct from tags — keyFields directs attention, tags enables discovery."
      example: [title, status, contentType, category]
      notes: "ROUTING.cog.md only. Route hint for agents. Distinct from tags."
      status: canonical
      profile: routing

    # === BOOK PROFILE ===

    - name: book
      type: string
      definition: "Which book this chapter belongs to."
      example: "MX: The Protocols"
      notes: "Identifies which book a chapter belongs to."
      status: canonical
      profile: book

    - name: chapter
      type: number
      definition: "Chapter number within the book."
      example: 5
      notes: "Numeric chapter number for ordering and cross-referencing."
      status: canonical
      profile: book

    - name: wordCount
      type: number
      definition: "Word count of the document content."
      example: 3500
      notes: "Used for publication planning and progress tracking."
      status: canonical
      profile: book

    - name: copyright
      type: string
      definition: "Copyright notice."
      example: "\u00a9 2026 Tom Cranstoun. All rights reserved."
      notes: "Full copyright notice. Distinct from license (SPDX identifier)."
      status: canonical
      profile: book

    # === BLOG PROFILE ===

    - name: publicationDate
      type: string
      definition: "Publication or issuance date. ISO 8601 format (YYYY-MM-DD or full datetime). Used for blogs and cogs."
      example: 2026-03-01
      notes: "ISO 8601. Distinct from created (file creation) and modified (last edit)."
      status: canonical
      profile: [blog, cog]

    - name: readingTime
      type: string
      definition: "Estimated reading time."
      example: "5 min read"
      notes: "Human-friendly estimate. Can be derived from wordCount."
      status: canonical
      profile: blog

    - name: blogUrl
      type: string
      definition: "Published URL of the blog post."
      example: "https://allabout.network/blogs/mx/field-dictionary"
      notes: "Published URL. Set after deployment."
      status: canonical
      profile: blog

    - name: blogState
      type: string
      definition: "Blog lifecycle state. Values: draft, review, published."
      example: published
      validValues: [draft, review, published]
      notes: "Blog-specific lifecycle. Distinct from status (generic)."
      status: canonical
      profile: blog

    # === CONTACT PROFILE ===

    - name: relationship
      type: string
      definition: "Relationship type. Values: advisory-board, investor, partner, prospect, team."
      example: advisory-board
      validValues: [advisory-board, investor, partner, prospect, team]
      status: canonical
      profile: contact

    - name: role
      type: string
      definition: "Job title or role."
      example: "CTO"
      status: canonical
      profile: contact

    - name: company
      type: string
      definition: "Organisation name."
      example: "Cog-Nova-MX Ltd"
      status: canonical
      profile: contact

    - name: nextAction
      type: string
      definition: "Next action for this contact."
      example: "Follow up after Frankfurt CMS Summit"
      notes: "Free-form text describing the next step."
      status: canonical
      profile: contact

    - name: confidential
      type: boolean
      definition: "Whether this record must be excluded from public outputs. Replaces the deprecated confidentiality field."
      default: false
      example: true
      notes: "Only declare when marking content as confidential."
      status: canonical
      profile: [core, contact]

    # === DEMO/HTML PROFILE ===

    - name: publicationStatus
      type: string
      definition: "Publication lifecycle. Values: draft, review, published, archived."
      example: published
      validValues: [draft, review, published, archived]
      notes: "Demo/HTML-specific lifecycle. Distinct from status and blogState."
      status: canonical
      profile: demo

    - name: machineOnly
      type: boolean
      definition: "Whether this content is for machines only. When absent, content is for both audiences."
      default: false
      example: true
      notes: "Only declare when content is exclusively for machine consumption."
      status: canonical
      profile: core

    # === FOLDER METADATA PROFILE ===

    - name: folderType
      type: string
      definition: "Type of folder. Values: category, content, config, build, scripts, submodule."
      example: content
      validValues: [category, content, config, build, scripts, submodule]
      status: canonical
      profile: folder

    - name: stability
      type: string
      definition: "Content stability. Values: stable, evolving, experimental, deprecated, archived."
      example: stable
      validValues: [stable, evolving, experimental, deprecated, archived]
      notes: "Content stability. Helps agents assess information reliability."
      status: canonical
      profile: folder

    - name: lifecycle
      type: string
      definition: "Folder lifecycle stage. Values: production, development, prototype, legacy, deprecated."
      example: production
      validValues: [production, development, prototype, legacy, deprecated]
      notes: "Development phase. Distinct from stability (content reliability)."
      status: canonical
      profile: folder

    - name: hasSubfolders
      type: boolean
      definition: "Whether the folder contains subfolders."
      example: true
      notes: "Helps tools decide whether to recurse into subdirectories."
      status: canonical
      profile: folder

    - name: inherits
      type: string
      definition: "Path to parent folder metadata file. Deprecated — use inheritable on the parent folder instead."
      notes: "Deprecated. Use inheritable on parent folder instead."
      status: deprecated
      profile: folder

    - name: relatedFolders
      type: array
      definition: "Related folders with path, relationship type, and description."
      example: [{path: "../mx-audit", relationship: sibling}]
      notes: "Array of objects with path, relationship, and description."
      status: canonical
      profile: folder

    - name: primaryLanguages
      type: array
      definition: "Primary programming or content languages in the folder."
      example: [javascript, markdown]
      notes: "Helps agents select appropriate tools for the folder."
      status: canonical
      profile: folder


    # === CONTACT/CRM FIELDS ===

    - name: email
      type: string
      definition: "Contact email address."
      example: "tom.cranstoun@gmail.com"
      status: canonical
      profile: contact

    - name: phone
      type: string
      definition: "Contact phone number."
      example: "+44 7700 900000"
      notes: "Include international dialling code. Quote to prevent YAML number parsing."
      status: canonical
      profile: contact

    - name: whatsapp
      type: string
      definition: "WhatsApp contact number."
      example: "+44 7700 900000"
      notes: "May differ from phone. Quote the value."
      status: canonical
      profile: contact

    - name: nickname
      type: string
      definition: "Informal name or abbreviation."
      example: "Max"
      notes: "Informal name. Helps agents recognise conversational references."
      status: canonical
      profile: contact

    - name: priority
      type: string
      definition: "Contact priority. Values: high, medium, low."
      example: high
      validValues: [high, medium, low]
      notes: "Determines outreach frequency and attention level."
      status: canonical
      profile: contact

    - name: lastContact
      type: string
      definition: "Date of last contact. ISO 8601 format (YYYY-MM-DD)."
      example: 2026-02-28
      notes: "ISO 8601. Updated after each interaction."
      status: canonical
      profile: contact

    - name: twinOf
      type: string
      definition: "Twin or paired contact reference."
      example: "maxine"
      notes: "References a paired contact. Used for AI/human pairs."
      status: canonical
      profile: contact

    - name: location
      type: string
      definition: "Physical location, city, or venue. Used for contacts (city/address) and events (venue name or details)."
      example: "London, UK"
      notes: "Physical location for contacts or events. Replaces deprecated venue."
      status: canonical
      profile: [contact, event]

    - name: messages
      type: array
      definition: "Message history or communication templates."
      example: [{date: 2026-02-28, platform: email, summary: "Discussed roadmap"}]
      notes: "Communication history and template storage."
      status: canonical
      profile: contact

    - name: platform
      type: string
      definition: "Communication platform. Values: email, whatsapp, linkedin, slack."
      example: email
      validValues: [email, whatsapp, linkedin, slack]
      notes: "Preferred communication platform."
      status: canonical
      profile: contact

    # === REPORT FIELDS ===

    - name: reportType
      type: string
      definition: "Type of report. Values: session, completion, audit, directors, build."
      example: directors
      validValues: [session, completion, audit, directors, build]
      notes: "Determines report template and output format."
      status: canonical
      profile: report

    - name: reportId
      type: string
      definition: "Unique report identifier."
      example: "RPT-2026-03-001"
      notes: "Unique identifier for cross-referencing."
      status: canonical
      profile: report

    - name: client
      type: string
      definition: "Client name for audit or deliverable reports."
      example: "Acme Corp"
      notes: "Client name for audit or deliverable reports."
      status: canonical
      profile: report

    - name: sessionStart
      type: string
      definition: "Session start timestamp. ISO 8601 format."
      example: "2026-03-01T09:00:00Z"
      notes: "ISO 8601 datetime with timezone."
      status: canonical
      profile: report

    - name: sessionEnd
      type: string
      definition: "Session end timestamp. ISO 8601 format."
      example: "2026-03-01T17:00:00Z"
      notes: "ISO 8601 datetime with timezone."
      status: canonical
      profile: report

    # === AUDIT FIELDS ===

    - name: pagesAudited
      type: number
      definition: "Number of pages audited in an audit."
      example: 42
      notes: "Spelling-neutral (NDR #3)."
      status: canonical
      profile: audit

    - name: performanceScore
      type: number
      definition: "Performance score (0-100)."
      example: 85
      notes: "Score 0-100. Typically from Lighthouse."
      status: canonical
      profile: audit

    - name: llmSuitabilityScore
      type: number
      definition: "LLM suitability score (0-100)."
      example: 72
      notes: "Score 0-100. MX-specific metric for AI agent compatibility."
      status: canonical
      profile: audit

    - name: seoScore
      type: number
      definition: "SEO score (0-100)."
      example: 91
      notes: "Score 0-100."
      status: canonical
      profile: audit

    # === CONTENT WORKFLOW FIELDS ===

    - name: contentState
      type: string
      definition: "Content workflow position. Distinct from status — contentState tracks where content is in the editorial pipeline. Values: raw, editing, review, approved, published."
      example: editing
      validValues: [raw, editing, review, approved, published]
      notes: "Editorial pipeline position. Distinct from status (generic lifecycle)."
      status: canonical
      profile: core

    - name: mxWatchesFiles
      type: array
      definition: "Array of file paths this document watches for changes. Used by MX OS to trigger re-evaluation when watched files are modified."
      example: [../README.md, ../package.json]
      notes: "MX OS monitors these and triggers re-evaluation when they change."
      status: canonical
      profile: folder

    # === COG EXTENSION FIELDS ===

    - name: cogId
      type: string
      definition: "Unique cog identifier within the registry."
      example: "field-dictionary"
      notes: "Typically derived from filename without .cog.md extension."
      status: canonical
      profile: cog

    - name: cogType
      type: string
      definition: "Cog type classification. Values: info, action, routing, certificate-of-genuineness."
      example: info
      validValues: [info, action, routing, certificate-of-genuineness]
      notes: "Info = reference, action = has execute block, routing = agent navigation, certificate-of-genuineness = publisher-verified credential with publisher block."
      status: canonical
      profile: cog

    - name: issued
      type: string
      definition: "Deprecated. Use publicationDate instead. Date cog was issued or published."
      notes: "Deprecated in v1.9. Use publicationDate instead."
      status: deprecated
      profile: cog
      supersededBy: publicationDate

    - name: expires
      type: string
      definition: "Expiry date for time-sensitive cogs. ISO 8601 format (YYYY-MM-DD)."
      example: 2026-12-31
      notes: "ISO 8601. For time-sensitive content. Review or archive after this date."
      status: canonical
      profile: cog

    - name: correctionSla
      type: string
      definition: "SLA for correcting errors in the cog content."
      example: "24 hours"
      notes: "Sets expectations for error correction urgency."
      status: canonical
      profile: cog

    - name: lastVerified
      type: string
      definition: "Date the cog was last verified accurate. ISO 8601 format (YYYY-MM-DD)."
      example: 2026-03-01
      notes: "ISO 8601. Helps agents assess content freshness."
      status: canonical
      profile: cog

    - name: updateTriggers
      type: array
      definition: "Conditions that trigger a cog update. Array of trigger descriptions."
      example: [specification-change, new-field-added]
      notes: "Events that should prompt a cog update."
      status: canonical
      profile: cog

    # === CONTENT MIGRATION FIELDS ===

    - name: movedFrom
      type: string
      definition: "Previous file path before content was relocated."
      example: "datalake/knowledge/reference/field-definitions.md"
      notes: "Previous path. Used for redirect generation and link maintenance."
      status: canonical
      profile: migration

    - name: movedDate
      type: string
      definition: "Date content was relocated. ISO 8601 format (YYYY-MM-DD)."
      example: 2026-02-28
      notes: "ISO 8601. When the content was relocated."
      status: canonical
      profile: migration

    # === SCHEMA/DATA FIELDS ===

    - name: ld
      type: object
      definition: "Inline JSON-LD structured data (Schema.org). Embeds structured data directly in YAML frontmatter."
      example: {"@type": "TechArticle", name: "MX Field Dictionary"}
      notes: "Inline JSON-LD (Schema.org) in YAML frontmatter."
      status: canonical
      profile: core

    - name: readingLevel
      type: string
      definition: "Content reading level. Values: beginner, intermediate, advanced, expert."
      example: intermediate
      validValues: [beginner, intermediate, advanced, expert]
      notes: "Helps agents recommend content based on user expertise."
      status: canonical
      profile: core

    # === EVENT FIELDS ===

    - name: event
      type: string-or-object
      definition: "Event name or event details object."
      example: "CMS Summit Frankfurt 2026"
      notes: "Can be a string or structured object with event details."
      status: canonical
      profile: event

    - name: venue
      type: string-or-object
      definition: "Deprecated. Use location instead. Venue name or venue details."
      notes: "Deprecated in v1.9. Use location instead."
      status: deprecated
      profile: event
      supersededBy: location

    - name: organiser
      type: string
      definition: "Event organiser name or organisation."
      example: "Boye & Company"
      notes: "British English spelling."
      status: canonical
      profile: event

    - name: hours
      type: string-or-object
      definition: "Operating hours or event schedule."
      example: "09:00-17:00 CET"
      notes: "Can be a string or structured object. Include timezone."
      status: canonical
      profile: event

    # === NON-YAML MX IDENTITY FIELDS (mx:* namespace) ===
    # These fields are used in HTML meta tags, JSDoc @mx: tags, and CSS comments.
    # They are the non-YAML equivalent of the standard cog fields.

    - name: mx:name
      type: string
      definition: "Cog name. Equivalent to name in YAML frontmatter."
      example: '<meta name="mx:name" content="field-dictionary">'
      notes: "HTML equivalent of YAML title/name."
      status: canonical
      profile: [html, js, css]

    - name: mx:version
      type: string
      definition: "Version. Equivalent to version in YAML frontmatter."
      example: '<meta name="mx:version" content="2.0">'
      notes: "HTML equivalent of YAML version."
      status: canonical
      profile: [html, js, css]

    - name: mx:type
      type: string
      definition: "Domain type classification."
      example: '<meta name="mx:type" content="specification">'
      status: canonical
      profile: html

    - name: mx:purpose
      type: string
      definition: "Why this file exists."
      example: "@mx:purpose utility"
      notes: "JSDoc and CSS comment contexts."
      status: canonical
      profile: [js, css]

    - name: mx:audience
      type: string
      definition: "Intended readership."
      example: "@mx:audience developer"
      notes: "JSDoc and CSS comment contexts."
      status: canonical
      profile: [js, css]

    - name: mx:stability
      type: string
      definition: "Stability level. Values: stable, evolving, experimental, deprecated, archived."
      example: "@mx:stability stable"
      validValues: [stable, evolving, experimental, deprecated, archived]
      status: canonical
      profile: [js, css]

    - name: mx:category
      type: string
      definition: "Cog category."
      example: '<meta name="mx:category" content="standard">'
      status: canonical
      profile: [html, js, css]

    - name: mx:tags
      type: string
      definition: "Discovery keywords as comma-separated string."
      example: '<meta name="mx:tags" content="metadata, yaml, frontmatter">'
      notes: "Comma-separated string in non-YAML contexts."
      status: canonical
      profile: [html, js, css]

    - name: mx:builds-on
      type: string
      definition: "Context dependencies as comma-separated cog names."
      example: "@mx:builds-on cog-unified-spec, field-dictionary"
      status: canonical
      profile: [js, css]

    - name: mx:documented-in
      type: string
      definition: "Path to companion documentation."
      example: "@mx:documented-in ../docs/field-dictionary.cog.md"
      notes: "Links code to its companion documentation."
      status: canonical
      profile: [js, css]

    - name: mx:context-provides
      type: string
      definition: "What context this file provides to agents."
      example: '@mx:context-provides "Validation utilities for frontmatter"'
      status: canonical
      profile: [js, css]

    # ═══════════════════════════════════════════════════════════
    # CODE METADATA FIELDS — absorbed from mx-code-metadata-spec.md
    # Repository, file, function, class, inline, dependency,
    # environment, test, and API metadata for source code.
    # ═══════════════════════════════════════════════════════════

    # --- Code: Repository level ---

    - name: project.name
      type: string
      definition: "Project name for code repository metadata."
      example: "My Project"
      status: canonical
      profile: code-repository
      required: true

    - name: project.description
      type: string
      definition: "Brief description of what this project does."
      example: "API backend for order processing"
      status: canonical
      profile: code-repository
      required: true

    - name: project.repository
      type: string
      definition: "Source repository URL."
      example: "https://github.com/example/my-project"
      status: canonical
      profile: code-repository
      required: false

    - name: project.documentation
      type: string
      definition: "Documentation site URL."
      example: "https://docs.example.com/my-project"
      status: canonical
      profile: code-repository
      required: false

    - name: context.domain
      type: string
      definition: "Business or technical domain of the project."
      example: "e-commerce"
      status: canonical
      profile: code-repository
      required: false

    - name: context.purpose
      type: string
      definition: "What the project does (operational purpose, not document description)."
      example: "API backend for order processing"
      status: canonical
      profile: code-repository
      required: false

    - name: context.constraints
      type: array
      definition: "Non-functional requirements and constraints."
      example: ["Must handle 10,000 requests per second", "GDPR compliant"]
      status: canonical
      profile: code-repository
      required: false

    - name: stack.language
      type: string
      definition: "Primary programming language."
      example: "typescript"
      status: canonical
      profile: code-repository
      required: false

    - name: stack.runtime
      type: string
      definition: "Execution environment."
      example: "node"
      status: canonical
      profile: code-repository
      required: false

    - name: stack.version
      type: string
      definition: "Language or runtime version."
      example: "20.x"
      status: canonical
      profile: code-repository
      required: false

    - name: stack.framework
      type: string
      definition: "Primary framework."
      example: "express"
      status: canonical
      profile: code-repository
      required: false

    - name: conventions.style
      type: string
      definition: "Code style tool or guide."
      example: "prettier"
      status: canonical
      profile: code-repository
      required: false

    - name: conventions.testing
      type: string
      definition: "Testing framework."
      example: "jest"
      status: canonical
      profile: code-repository
      required: false

    - name: conventions.documentation
      type: string
      definition: "Documentation format."
      example: "jsdoc"
      status: canonical
      profile: code-repository
      required: false

    # --- Code: File level ---

    - name: owner
      type: string
      definition: "Team or person responsible for this file or resource."
      example: "platform-team"
      notes: "Used at file and directory level in code metadata. Also applies to media rights and database tables."
      status: canonical
      profile: [code-file, media-rights, database-table]
      required: false

    - name: reviewers
      type: array
      definition: "Required reviewers for changes to this file."
      example: ["@senior-dev", "@security-team"]
      status: canonical
      profile: code-file
      required: false

    - name: ai.contextRequired
      type: array
      definition: "Files AI should read before editing this one."
      example: ["src/types/user.ts", "src/config/schema.ts"]
      notes: "Prevents AI from making changes without understanding dependencies."
      status: canonical
      profile: [code-file, code-function, code-class]
      required: false

    - name: ai.contextProvides
      type: array
      definition: "Concepts this file defines that other files depend on."
      example: ["User type definitions", "Validation rules"]
      status: canonical
      profile: code-file
      required: false

    - name: ai.generationNotes
      type: string
      definition: "Guidance for AI generating similar code."
      example: "Follow the repository's error handling pattern using Result types"
      status: canonical
      profile: [code-file, code-function]
      required: false

    - name: ai.reason
      type: string
      definition: "Explanation for AI restrictions on this resource."
      example: "Handles authentication tokens — changes require security review"
      notes: "Used with ai.editable, ai.doNotModify, ai.sensitive to explain WHY."
      status: canonical
      profile: [code-file, code-function, code-class, database]
      required: false

    # --- Code: Function level ---

    - name: pure
      type: boolean
      definition: "Whether function has no side effects."
      example: true
      status: canonical
      profile: code-function
      required: false

    - name: idempotent
      type: boolean
      definition: "Whether repeated calls produce the same result."
      example: true
      status: canonical
      profile: [code-function, code-api]
      required: false

    - name: complexity
      type: string
      definition: "Time complexity in Big O notation."
      example: "O(n)"
      status: canonical
      profile: code-function
      required: false

    - name: throws
      type: array
      definition: "Exception types this function may throw. Use raises for Python."
      example: ["InvalidDiscountError", "NegativePriceError"]
      status: canonical
      profile: code-function
      required: false

    - name: since
      type: string
      definition: "Version when this function was introduced."
      example: "1.2.0"
      status: canonical
      profile: code-function
      required: false

    - name: see
      type: array
      definition: "Related functions or documentation."
      example: ["calculateSubtotal", "docs/pricing.md"]
      status: canonical
      profile: code-function
      required: false

    - name: ai.confidence
      type: number
      definition: "Confidence in implementation correctness (0-1)."
      example: 0.9
      notes: "0.9 = high confidence, 0.5 = uncertain, below 0.5 = needs review."
      status: canonical
      profile: [code-function, code-class]
      required: false

    - name: ai.testCoverage
      type: boolean
      definition: "Whether this function has test coverage."
      example: true
      status: canonical
      profile: code-function
      required: false

    - name: ai.edgeCases
      type: array
      definition: "Known edge cases and expected behaviour."
      example: ["Empty cart returns 0", "Negative discounts are rejected"]
      status: canonical
      profile: [code-function, code-test]
      required: false

    - name: ai.refactorNotes
      type: string
      definition: "Guidance for refactoring this function."
      example: "Extract discount logic to separate module when discount types exceed 5"
      status: canonical
      profile: code-function
      required: false

    - name: ai.doNotModify
      type: boolean
      definition: "AI should not change this function."
      example: true
      status: canonical
      profile: [code-function, code-class]
      required: false

    # --- Code: Class level ---

    - name: pattern
      type: string
      definition: "Design pattern used by this class."
      example: "singleton"
      validValues: [singleton, factory, observer, strategy, builder, adapter, decorator, proxy, command, mediator]
      status: canonical
      profile: code-class
      required: false

    - name: threadSafe
      type: boolean
      definition: "Whether class is safe for concurrent access."
      example: false
      status: canonical
      profile: code-class
      required: false

    - name: invariants
      type: array
      definition: "Conditions that must always be true for this class."
      example: ["If currentUser is set, tokens must be valid", "Token refresh happens before expiry"]
      status: canonical
      profile: code-class
      required: false

    - name: ai.sensitive
      type: boolean
      definition: "Whether this class or resource handles sensitive data."
      example: true
      status: canonical
      profile: [code-class, code-api]
      required: false

    - name: ai.modificationImpact
      type: string
      definition: "What might break if this class changes."
      example: "All authentication flows depend on this class"
      status: canonical
      profile: code-class
      required: false

    # --- Code: Inline annotations ---

    - name: mx:begin
      type: string
      definition: "Opens an annotated code block. Value is the block tag (security-critical, performance-critical, compatibility, workaround, generated, legacy)."
      example: "// @mx:begin security-critical"
      validValues: [security-critical, performance-critical, compatibility, workaround, generated, legacy]
      status: canonical
      profile: code-inline

    - name: mx:end
      type: string
      definition: "Closes an annotated code block. Value matches the opening tag."
      example: "// @mx:end security-critical"
      status: canonical
      profile: code-inline

    - name: mx:sensitive
      type: string
      definition: "Line annotation marking sensitive data. Flags: no-log, no-expose."
      example: "const API_KEY = process.env.API_KEY; // @mx:sensitive no-log no-expose"
      status: canonical
      profile: code-inline

    - name: mx:intentional
      type: string
      definition: "Line annotation marking deliberate unusual code."
      example: "await sleep(100); // @mx:intentional rate-limiting"
      status: canonical
      profile: code-inline

    - name: mx:todo
      type: string
      definition: "Line annotation for tasks to complete."
      example: "// @mx:todo refactor Extract to separate function"
      status: canonical
      profile: code-inline

    - name: mx:ai
      type: string
      definition: "Line annotation with AI-specific instructions. Values: do-not-remove, do-not-modify, preserve-logic, explain-before-changing, generated, reviewed."
      example: "// @mx:ai do-not-remove This null check prevents crash in edge case #1234"
      status: canonical
      profile: code-inline

    # --- Code: Dependency level ---

    - name: dependency.purpose
      type: string
      definition: "Why this dependency exists."
      example: "HTTP server framework"
      status: canonical
      profile: code-dependency
      required: false

    - name: dependency.critical
      type: boolean
      definition: "Whether this dependency is critical to the project."
      example: true
      status: canonical
      profile: code-dependency
      required: false

    - name: dependency.upgradePolicy
      type: string
      definition: "How aggressively to upgrade this dependency."
      example: "conservative"
      validValues: [aggressive, conservative, locked, manual]
      status: canonical
      profile: code-dependency
      required: false

    - name: dependency.alternativesConsidered
      type: array
      definition: "Alternative packages considered before choosing this dependency."
      example: ["fastify", "koa"]
      status: canonical
      profile: code-dependency
      required: false

    - name: ai.replacementPermitted
      type: boolean
      definition: "Whether AI may suggest replacing this dependency."
      example: false
      status: canonical
      profile: code-dependency
      required: false

    - name: ai.upgradePermitted
      type: boolean
      definition: "Whether AI may suggest upgrading this dependency."
      example: true
      status: canonical
      profile: code-dependency
      required: false

    # --- Code: Test level ---

    - name: testType
      type: string
      definition: "Type of test file."
      example: "integration"
      validValues: [unit, integration, e2e, performance, security, smoke, acceptance]
      status: canonical
      profile: code-test
      required: true

    - name: coverageTarget
      type: number
      definition: "Target code coverage percentage."
      example: 90
      status: canonical
      profile: code-test
      required: false

    - name: subject
      type: string
      definition: "What this test file tests."
      example: "src/services/pricing.ts"
      status: canonical
      profile: code-test
      required: true

    - name: fixtures
      type: array
      definition: "Test data files required."
      example: ["__fixtures__/sample-cart.json"]
      status: canonical
      profile: code-test
      required: false

    - name: ai.generationPermitted
      type: boolean
      definition: "Whether AI may generate tests for this module."
      example: true
      status: canonical
      profile: code-test
      required: false

    - name: ai.mustCover
      type: array
      definition: "Scenarios that tests must cover."
      example: ["empty input", "maximum values", "concurrent access"]
      status: canonical
      profile: code-test
      required: false

    - name: ai.doNotMock
      type: array
      definition: "Dependencies that should not be mocked in tests."
      example: ["database", "auth-service"]
      status: canonical
      profile: code-test
      required: false

    # --- Code: API level ---

    - name: method
      type: string
      definition: "HTTP method for API endpoint."
      example: "POST"
      validValues: [GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS]
      status: canonical
      profile: code-api
      required: true

    - name: path
      type: string
      definition: "API endpoint path."
      example: "/api/v1/orders"
      status: canonical
      profile: code-api
      required: true

    - name: auth
      type: string
      definition: "Authentication requirement for API endpoint."
      example: "bearer"
      validValues: [none, basic, bearer, api-key, oauth2, session]
      status: canonical
      profile: code-api
      required: false

    - name: rateLimit
      type: string
      definition: "Rate limiting configuration."
      example: "100/minute"
      status: canonical
      profile: code-api
      required: false

    - name: cache.enabled
      type: boolean
      definition: "Whether API response is cacheable."
      example: true
      status: canonical
      profile: code-api
      required: false

    - name: cache.ttl
      type: number
      definition: "Cache time-to-live in seconds."
      example: 300
      status: canonical
      profile: code-api
      required: false

    - name: ai.safeToCall
      type: boolean
      definition: "Whether AI agents may call this API endpoint."
      example: true
      notes: "false means AI should never invoke this endpoint autonomously."
      status: canonical
      profile: [code-api, database-query]
      required: false

    - name: ai.testMode
      type: string
      definition: "Test mode availability for API endpoint."
      example: "Use X-Test-Mode: true header"
      status: canonical
      profile: code-api
      required: false

    - name: ai.sensitiveRequestFields
      type: array
      definition: "Request fields that contain sensitive data."
      example: ["password", "creditCard"]
      status: canonical
      profile: code-api
      required: false

    - name: ai.sensitiveResponseFields
      type: array
      definition: "Response fields that contain sensitive data."
      example: ["ssn", "bankAccount"]
      status: canonical
      profile: code-api
      required: false

    - name: ai.sideEffects
      type: array
      definition: "Side effects of calling this API endpoint."
      example: ["Creates order record", "Sends confirmation email", "Charges payment method"]
      status: canonical
      profile: [code-api, database-procedure]
      required: false

    # ═══════════════════════════════════════════════════════════
    # MEDIA METADATA FIELDS — absorbed from mx-media-metadata-spec.md
    # Sidecar files, embedded metadata alignment, image, video,
    # audio, document, rights, and collection metadata.
    # ═══════════════════════════════════════════════════════════

    # --- Media: Sidecar ---

    - name: asset
      type: string
      definition: "Explicit link to the media asset file. Optional if sidecar filename matches."
      example: "hero-image.jpg"
      status: canonical
      profile: media-sidecar
      required: false

    - name: embedded.source
      type: string
      definition: "How to handle embedded metadata (EXIF/IPTC/XMP/ID3)."
      example: "preserve"
      validValues: [preserve, override, ignore]
      notes: "preserve = sidecar extends embedded. override = sidecar wins. ignore = skip embedded."
      status: canonical
      profile: media-sidecar
      required: false

    - name: embedded.sync
      type: boolean
      definition: "Whether to sync sidecar metadata back to embedded fields."
      example: false
      status: canonical
      profile: media-sidecar
      required: false

    # --- Media: Image ---

    - name: alt
      type: string
      definition: "Alternative text for screen readers and AI agents."
      example: "Silver Widget Pro on white background"
      status: canonical
      profile: [media-image, media-video]
      required: true

    - name: caption
      type: string
      definition: "Human-readable caption for display."
      example: "The new Widget Pro, available Q2 2026"
      status: canonical
      profile: [media-image, media-video]
      required: false

    - name: format
      type: string
      definition: "File format of the media asset."
      example: "jpeg"
      status: canonical
      profile: [media-image, media-video, media-audio, media-document]
      required: false

    - name: width
      type: number
      definition: "Width in pixels."
      example: 4000
      status: canonical
      profile: [media-image, media-video]
      required: false

    - name: height
      type: number
      definition: "Height in pixels."
      example: 3000
      status: canonical
      profile: [media-image, media-video]
      required: false

    - name: aspectRatio
      type: string
      definition: "Aspect ratio as width:height."
      example: "4:3"
      status: canonical
      profile: [media-image, media-video]
      required: false

    - name: colorSpace
      type: string
      definition: "Colour space of the image."
      example: "sRGB"
      status: canonical
      profile: media-image
      required: false

    - name: compression
      type: string
      definition: "Compression type."
      example: "lossy"
      validValues: [lossy, lossless, none]
      status: canonical
      profile: media-image
      required: false

    - name: dpi
      type: number
      definition: "Resolution in dots per inch."
      example: 300
      status: canonical
      profile: [media-image, media-document]
      required: false

    # --- Media: Video ---

    - name: codec.video
      type: string
      definition: "Video codec."
      example: "h264"
      status: canonical
      profile: media-video
      required: false

    - name: codec.audio
      type: string
      definition: "Audio codec."
      example: "aac"
      status: canonical
      profile: [media-video, media-audio]
      required: false

    - name: frameRate
      type: number
      definition: "Frames per second."
      example: 30
      status: canonical
      profile: media-video
      required: false

    - name: duration
      type: number
      definition: "Duration in seconds."
      example: 3600
      status: canonical
      profile: [media-video, media-audio]
      required: false

    - name: fileSize
      type: number
      definition: "File size in bytes."
      example: 52428800
      status: canonical
      profile: [media-image, media-video, media-audio, media-document]
      required: false

    - name: chapters
      type: array
      definition: "Chapter markers with title and start/end times."
      example: [{title: "Introduction", start: 0, end: 120}]
      status: canonical
      profile: [media-video, media-audio]
      required: false

    - name: captions
      type: array
      definition: "Caption/subtitle tracks with language and file path."
      example: [{language: "en", file: "captions-en.vtt"}]
      status: canonical
      profile: media-video
      required: false

    - name: transcript
      type: object
      definition: "Transcript file with language and format."
      example: {language: "en", file: "transcript.txt"}
      status: canonical
      profile: [media-video, media-audio]
      required: false

    # --- Media: Audio ---

    - name: sampleRate
      type: number
      definition: "Sample rate in Hz."
      example: 44100
      status: canonical
      profile: media-audio
      required: false

    - name: channels
      type: number
      definition: "Number of audio channels."
      example: 2
      status: canonical
      profile: media-audio
      required: false

    # --- Media: Capture ---

    - name: capture.date
      type: string
      definition: "Date the media was captured. ISO 8601."
      example: "2026-01-15"
      status: canonical
      profile: media-image
      required: false

    - name: capture.location
      type: string
      definition: "Location where media was captured."
      example: "Studio A, London"
      status: canonical
      profile: media-image
      required: false

    - name: capture.device
      type: string
      definition: "Camera or recording device model."
      example: "Canon EOS R5"
      status: canonical
      profile: media-image
      required: false

    - name: photographer
      type: string
      definition: "Name of the photographer."
      example: "Jane Smith"
      status: canonical
      profile: media-image
      required: false

    # --- Media: Document ---

    - name: pages
      type: number
      definition: "Number of pages in a document or PDF."
      example: 42
      status: canonical
      profile: media-document
      required: false

    - name: taggedPdf
      type: boolean
      definition: "Whether PDF has accessibility tags."
      example: true
      status: canonical
      profile: media-document
      required: false

    # --- Media: Rights ---

    - name: rights.owner
      type: string
      definition: "Entity that owns this media asset."
      example: "Acme Corporation"
      status: canonical
      profile: media-rights
      required: true

    - name: rights.copyright
      type: string
      definition: "Copyright statement."
      example: "© 2026 Acme Corporation. All rights reserved."
      status: canonical
      profile: media-rights
      required: false

    - name: rights.license
      type: string
      definition: "License type for the media asset."
      example: "proprietary"
      validValues: [proprietary, public-domain, cc-by, cc-by-sa, cc-by-nc, cc-by-nc-sa, cc-by-nd, cc-by-nc-nd, cc0, editorial, royalty-free, rights-managed, custom]
      status: canonical
      profile: media-rights
      required: true

    - name: rights.attribution.required
      type: boolean
      definition: "Whether attribution is required when using this asset."
      example: true
      status: canonical
      profile: media-rights
      required: false

    - name: rights.usage.commercial
      type: boolean
      definition: "Whether asset may be used commercially."
      example: false
      status: canonical
      profile: media-rights
      required: false

    - name: rights.usage.thirdParty
      type: boolean
      definition: "Whether asset may be shared with third parties."
      example: false
      status: canonical
      profile: media-rights
      required: false

    - name: rights.territorial.allowed
      type: array
      definition: "Territory codes where usage is allowed."
      example: [GB, US, EU]
      status: canonical
      profile: media-rights
      required: false

    - name: rights.temporal.perpetual
      type: boolean
      definition: "Whether usage rights are perpetual."
      example: false
      status: canonical
      profile: media-rights
      required: false

    # --- Media: AI ---

    - name: ai.altText
      type: string
      definition: "AI-friendly alternative text description."
      example: "Aerial photograph of office building at sunset"
      status: canonical
      profile: [media-image, media-video]
      required: false

    - name: ai.contentTags
      type: array
      definition: "AI-detected content tags."
      example: ["building", "sunset", "architecture"]
      status: canonical
      profile: [media-image, media-video]
      required: false

    - name: ai.descriptionConfidence
      type: number
      definition: "Confidence in the provided description (0-1)."
      example: 0.95
      status: canonical
      profile: [media-image, media-video, media-audio, database-schema]
      required: false

    - name: ai.sensitiveContent
      type: boolean
      definition: "Whether media contains sensitive content."
      example: false
      status: canonical
      profile: [media-image, media-video]
      required: false

    - name: ai.transcriptSource
      type: string
      definition: "Origin of transcript."
      example: "human"
      validValues: [human, ai-generated, ai-assisted]
      status: canonical
      profile: [media-video, media-audio]
      required: false

    - name: ai.citationRequired
      type: boolean
      definition: "Whether AI must cite this asset when referencing."
      example: true
      status: canonical
      profile: media-rights
      required: false

    - name: ai.extraction
      type: string
      definition: "Whether AI may extract information from this asset."
      example: "permitted"
      validValues: [prohibited, permitted]
      status: canonical
      profile: media-rights
      required: false

    - name: ai.reproduction
      type: string
      definition: "Whether AI may reproduce this asset in responses."
      example: "prohibited"
      validValues: [prohibited, permitted]
      status: canonical
      profile: media-rights
      required: false

    - name: variants
      type: array
      definition: "Responsive or alternative image variants."
      example: [{purpose: "retina", width: 8000}, {purpose: "thumbnail", width: 200}]
      status: canonical
      profile: media-image
      required: false

    # ═══════════════════════════════════════════════════════════
    # DATABASE METADATA FIELDS — absorbed from mx-database-metadata-spec.md
    # Database, schema, table, column, relationship, view, query,
    # procedure, dictionary, and classification metadata.
    # ═══════════════════════════════════════════════════════════

    # --- Database level ---

    - name: database.engine
      type: string
      definition: "Database engine type."
      example: "postgresql"
      status: canonical
      profile: database
      required: true

    - name: database.version
      type: string
      definition: "Database engine version."
      example: "15.4"
      status: canonical
      profile: database
      required: false

    - name: database.environment
      type: string
      definition: "Deployment environment."
      example: "production"
      validValues: [production, staging, development, testing]
      status: canonical
      profile: database
      required: false

    - name: database.steward
      type: string
      definition: "Data steward contact (email or team)."
      example: "data-governance@example.com"
      status: canonical
      profile: [database, database-table]
      required: false

    - name: classification.sensitivity
      type: string
      definition: "Data sensitivity classification level."
      example: "confidential"
      validValues: [public, internal, confidential, restricted]
      notes: "public = AI can query and train. internal = AI can query, no training. confidential = AI sees schema only. restricted = no AI access."
      status: canonical
      profile: [database, database-schema, database-table]
      required: false

    - name: classification.containsPii
      type: boolean
      definition: "Whether this resource contains personal identifiable information."
      example: true
      status: canonical
      profile: [database, database-table]
      required: false

    - name: classification.containsFinancial
      type: boolean
      definition: "Whether this resource contains financial data."
      example: true
      status: canonical
      profile: [database, database-table]
      required: false

    - name: classification.regulatory
      type: array
      definition: "Applicable regulatory frameworks."
      example: [gdpr, pci-dss]
      status: canonical
      profile: [database, database-table]
      required: false

    - name: retention.defaultDays
      type: number
      definition: "Default data retention period in days."
      example: 2555
      status: canonical
      profile: database
      required: false

    - name: ai.queryAllowed
      type: boolean
      definition: "Whether AI agents may execute queries against this resource."
      example: false
      status: canonical
      profile: [database, database-schema, database-table]
      required: false

    - name: ai.schemaAccess
      type: boolean
      definition: "Whether AI agents may read the schema."
      example: true
      status: canonical
      profile: database
      required: false

    - name: ai.sampleData
      type: string
      definition: "Sample data access level for AI."
      example: "prohibited"
      validValues: [allowed, anonymised, prohibited]
      status: canonical
      profile: [database, database-table]
      required: false

    - name: ai.trainingData
      type: string
      definition: "Whether AI may use this data for training."
      example: "prohibited"
      validValues: [permitted, anonymised, prohibited]
      status: canonical
      profile: [database, database-table]
      required: false

    # --- Schema level ---

    - name: schema.domains
      type: array
      definition: "Business domains covered by this schema."
      example: [identity, commerce, inventory]
      status: canonical
      profile: database-schema
      required: false

    # --- Table level ---

    - name: table.domain
      type: string
      definition: "Business domain this table belongs to."
      example: "identity"
      status: canonical
      profile: database-table
      required: false

    - name: table.subdomain
      type: string
      definition: "Business subdomain."
      example: "accounts"
      status: canonical
      profile: database-table
      required: false

    - name: classification.piiTypes
      type: array
      definition: "Types of PII present in this table."
      example: [name, email, phone, address]
      status: canonical
      profile: database-table
      required: false

    - name: classification.gdprLawfulBasis
      type: string
      definition: "GDPR lawful basis for processing."
      example: "contract"
      validValues: [consent, contract, legal-obligation, vital-interests, public-task, legitimate-interests]
      status: canonical
      profile: database-table
      required: false

    - name: volume.rowCountEstimate
      type: number
      definition: "Estimated number of rows."
      example: 2500000
      status: canonical
      profile: database-table
      required: false

    - name: volume.growthRate
      type: string
      definition: "Estimated growth rate."
      example: "10000/day"
      status: canonical
      profile: database-table
      required: false

    - name: quality.completeness
      type: number
      definition: "Data completeness score (0-1)."
      example: 0.98
      status: canonical
      profile: database-table
      required: false

    - name: ai.schemaVisible
      type: boolean
      definition: "Whether AI may see this table's schema."
      example: true
      status: canonical
      profile: database-table
      required: false

    - name: ai.semanticDescription
      type: string
      definition: "AI-friendly natural language description of the table."
      example: "User account information including personal identifiers and contact details"
      status: canonical
      profile: [database-table, database-view]
      required: false

    - name: ai.commonQueries
      type: array
      definition: "Common query patterns for this table."
      example: ["Find user by email", "Get user profile", "List active users"]
      status: canonical
      profile: [database-table, database-view]
      required: false

    - name: ai.joinsWith
      type: array
      definition: "Common join relationships."
      example: [{table: "orders", relationship: "users.id = orders.user_id"}]
      status: canonical
      profile: database-table
      required: false

    # --- Column level ---

    - name: column.semantic.type
      type: string
      definition: "Semantic type of the column data."
      example: "email"
      validValues: [identifier, name, email, phone, address, country, currency, quantity, percentage, timestamp, date, duration, status, category, description, url, json, binary]
      status: canonical
      profile: database-column
      required: false

    - name: column.semantic.entity
      type: string
      definition: "Entity type this column belongs to."
      example: "user"
      status: canonical
      profile: database-column
      required: false

    - name: column.semantic.role
      type: string
      definition: "Role of this column within the entity."
      example: "contact"
      status: canonical
      profile: database-column
      required: false

    - name: column.semantic.standard
      type: string
      definition: "Standard this column conforms to."
      example: "iso-3166-1-alpha-2"
      status: canonical
      profile: database-column
      required: false

    - name: column.pii
      type: boolean
      definition: "Whether this column contains PII."
      example: true
      status: canonical
      profile: database-column
      required: false

    - name: column.piiType
      type: string
      definition: "Type of PII in this column."
      example: "email"
      validValues: [name, email, phone, address, dob, ssn, financial, health]
      status: canonical
      profile: database-column
      required: false

    - name: column.encrypted
      type: boolean
      definition: "Whether column values are encrypted."
      example: true
      status: canonical
      profile: database-column
      required: false

    - name: ai.searchable
      type: boolean
      definition: "Whether AI may use this column in search queries."
      example: true
      status: canonical
      profile: database-column
      required: false

    - name: ai.maskInResponses
      type: boolean
      definition: "Whether AI must mask this column's values in responses."
      example: true
      notes: "true = show '***' instead of actual values in AI responses."
      status: canonical
      profile: database-column
      required: false

    - name: ai.displayName
      type: string
      definition: "Human-friendly name for AI to use when referencing this column."
      example: "Email Address"
      status: canonical
      profile: database-column
      required: false

    # --- Relationship level ---

    - name: relationship.type
      type: string
      definition: "Relationship cardinality."
      example: "one_to_many"
      validValues: [one_to_one, one_to_many, many_to_one, many_to_many]
      status: canonical
      profile: database-relationship
      required: true

    - name: relationship.from
      type: object
      definition: "Source table and column."
      example: {table: "users", column: "id"}
      status: canonical
      profile: database-relationship
      required: true

    - name: relationship.to
      type: object
      definition: "Target table and column."
      example: {table: "orders", column: "user_id"}
      status: canonical
      profile: database-relationship
      required: true

    - name: ai.traverse
      type: boolean
      definition: "Whether AI may traverse this relationship in queries."
      example: true
      status: canonical
      profile: database-relationship
      required: false

    # --- View level ---

    - name: view.materialized
      type: boolean
      definition: "Whether this is a materialised view."
      example: true
      status: canonical
      profile: database-view
      required: false

    - name: view.sourceTables
      type: array
      definition: "Tables this view is built from."
      example: [users, orders, order_items]
      status: canonical
      profile: database-view
      required: false

    # --- Query level ---

    - name: query.sql
      type: string
      definition: "The SQL query definition."
      example: "SELECT u.*, COUNT(o.id) FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id"
      status: canonical
      profile: database-query
      required: true

    - name: query.parameters
      type: array
      definition: "Query parameters with name, type, and description."
      example: [{name: "user_id", type: "integer", required: true}]
      status: canonical
      profile: database-query
      required: false

    - name: ai.safeToRun
      type: boolean
      definition: "Whether AI may execute this query."
      example: true
      status: canonical
      profile: [database-query, database-procedure]
      required: false

    - name: ai.returnsPii
      type: boolean
      definition: "Whether this query returns PII data."
      example: true
      notes: "When true, AI should not display raw results."
      status: canonical
      profile: database-query
      required: false

    # --- Procedure level ---

    - name: procedure.parameters
      type: array
      definition: "Procedure parameters with name, type, direction (in/out)."
      example: [{name: "user_id", type: "integer", direction: "in"}]
      status: canonical
      profile: database-procedure
      required: false

    - name: procedure.tablesModified
      type: array
      definition: "Tables modified by this procedure and the operation type."
      example: [{table: "users", operation: "update"}]
      status: canonical
      profile: database-procedure
      required: false

    - name: ai.neverSuggest
      type: boolean
      definition: "Whether AI should never suggest running this procedure."
      example: true
      notes: "For destructive or high-risk procedures."
      status: canonical
      profile: database-procedure
      required: false

    # --- Data dictionary ---

    - name: dictionary.glossary
      type: array
      definition: "Business term definitions with term, definition, and aliases."
      example: [{term: "Active User", definition: "User who logged in within last 30 days", aliases: ["MAU"]}]
      status: canonical
      profile: database-dictionary
      required: false

    # === MX-PUBLIC EXTENSIONS (x-mx-) ===
    # Public vendor extensions belonging to Cog-Nova-MX.
    # Visible in published cogs. Other implementations may ignore or adopt them.
    # See ADR: vendor-extensions-policy.cog.md

    - name: x-mx-mount-type
      type: string
      definition: "Mount type for submodule repositories. Values: personal, team, product, standard."
      example: personal
      validValues: [personal, team, product, standard]
      notes: "Categorises submodules in the hub mount table."
      status: canonical
      profile: x-mx-public
      required: true
      context: "Used in .mx.yaml.md folder metadata for git submodules to categorise them in the hub mount table."

    - name: x-mx-mount-swappable
      type: string-or-boolean
      definition: "Whether this mount can be swapped for a different repository. Values: true, false, fork."
      example: true
      validValues: [true, false, fork]
      notes: "Personal = swappable, product = not, standard = forkable."
      status: canonical
      profile: x-mx-public
      required: true
      context: "Personal mounts are swappable (each business mounts their own). Product mounts are not. Standard mounts are forkable."

    - name: x-mx-mount-upstream
      type: string
      definition: "Upstream source for standard-type mounts. URL or description of where to pull updates from."
      example: "https://github.com/Digital-Domain-Technologies-Ltd/MX-Gathering"
      notes: "Only for standard mount type."
      status: canonical
      profile: x-mx-public
      required: false
      context: "Only used for standard mount type. Points to The Gathering open standard or equivalent upstream."

    # === MX-PRIVATE EXTENSIONS (x-mx-p-) ===
    # Private fields are not documented here. Their names and meanings
    # are stored in $MX_HOME/registries/ and decoded only by registry holders.
    # See ADR: 2026-02-14-attribute-namespace-policy.cog.md

  profiles:
    - name: core
      description: "Fields that apply to all MX documents."
      required: [title, description, author, created, modified]
      recommended: [version, status]
      optional: [tags, audience, purpose, license, machineOnly, maintainer, confidential, ownership, domain, segment, ai, contextProvides, aiAssistance, aiEditable, ld, readingLevel, runbook, contentType, contentState]

    - name: cog
      description: "Fields specific to .cog.md files. Machine identifier is derived from filename."
      required: [category, partOf]
      recommended: [buildsOn, tags]
      optional: [requires, refersTo, execute, blocks, policy, cogId, cogType, publicationDate, expires, correctionSla, lastVerified, updateTriggers]

    - name: book
      description: "Fields for book manuscript chapters."
      required: [book, chapter, wordCount, copyright]

    - name: blog
      description: "Fields for blog posts."
      required: [publicationDate, blogState]
      optional: [readingTime, blogUrl, movedFrom, movedDate]

    - name: contact
      description: "Fields for contact/person records."
      required: [relationship, role, company]
      optional: [nextAction, confidential, messages, email, phone, whatsapp, nickname, priority, lastContact, twinOf, location, platform]

    - name: demo
      description: "Fields for HTML demo deployments."
      required: [publicationStatus]

    - name: folder
      description: "Fields for .mx.yaml.md folder metadata. All fields are top-level in YAML frontmatter."
      required: [folderType, stability, lifecycle, domain]
      recommended: [primaryLanguages]
      optional: [hasSubfolders, relatedFolders, version, aiAssistance, aiEditable, aiGenerationAllowed, aiGenerationReviewRequired, aiTraining, aiTrainingConditions, aiSensitivePaths, aiPermittedAreas, aiProhibitedAreas, mxSpecVersion, project, context, stack, conventions, inheritable, inheritExcept, contentType, mxWatchesFiles]

    - name: report
      description: "Fields for session reports, audit reports, and completion reports."
      required: [reportType]
      optional: [reportId, client, sessionStart, sessionEnd]

    - name: audit
      description: "Fields for MX web audit scoring and metrics."
      optional: [pagesAudited, performanceScore, llmSuitabilityScore, seoScore]

    - name: event
      description: "Fields for events, locations, and presentations."
      optional: [event, location, organiser, hours]

    - name: migration
      description: "Fields for tracking content relocation."
      optional: [movedFrom, movedDate]

    - name: routing
      description: "Fields used exclusively in ROUTING.cog.md. Not for general documents."
      fields: [words, keyFields]


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

    # --- Code metadata profiles (absorbed from mx-code-metadata-spec.md) ---

    - name: code-repository
      description: "Repository-level metadata. Lives in mx.yaml, .mx/config.yaml, or package.json[mx]."
      required: [project.name, project.description]
      optional: [project.repository, project.documentation, context.domain, context.purpose, context.constraints, stack.language, stack.runtime, stack.version, stack.framework, conventions.style, conventions.testing, conventions.documentation]

    - name: code-file
      description: "File-level metadata. Appears in @mx comment blocks at the top of source files."
      optional: [owner, reviewers, ai.contextRequired, ai.contextProvides, ai.generationNotes, ai.reason]

    - name: code-function
      description: "Function-level metadata. Appears in @mx blocks within JSDoc or docstrings."
      optional: [pure, idempotent, complexity, throws, since, see, ai.confidence, ai.testCoverage, ai.edgeCases, ai.refactorNotes, ai.doNotModify, ai.reason]

    - name: code-class
      description: "Class-level metadata. Appears in @mx blocks within class JSDoc or docstrings."
      optional: [pattern, threadSafe, invariants, ai.sensitive, ai.modificationImpact, ai.confidence, ai.doNotModify, ai.contextRequired, ai.reason]

    - name: code-inline
      description: "Inline code annotations. @mx:begin/@mx:end for blocks, @mx:tag for lines."
      fields: [mx:begin, mx:end, mx:sensitive, mx:intentional, mx:todo, mx:ai]

    - name: code-dependency
      description: "Dependency metadata. Extends package.json or pyproject.toml with MX properties."
      optional: [dependency.purpose, dependency.critical, dependency.upgradePolicy, dependency.alternativesConsidered, ai.replacementPermitted, ai.upgradePermitted]

    - name: code-test
      description: "Test file metadata."
      required: [testType, subject]
      optional: [coverageTarget, fixtures, ai.generationPermitted, ai.mustCover, ai.edgeCases, ai.doNotMock]

    - name: code-api
      description: "API endpoint metadata. OpenAPI extensions or route annotations."
      required: [method, path]
      optional: [auth, rateLimit, cache.enabled, cache.ttl, idempotent, ai.safeToCall, ai.sensitive, ai.testMode, ai.sensitiveRequestFields, ai.sensitiveResponseFields, ai.sideEffects]

    # --- Media metadata profiles (absorbed from mx-media-metadata-spec.md) ---

    - name: media-sidecar
      description: "Shared sidecar metadata fields. File naming: {asset}.mx.yaml or _mx.yaml for directory defaults."
      optional: [asset, embedded.source, embedded.sync]

    - name: media-image
      description: "Image-specific metadata (JPEG, PNG, WebP, SVG, etc.)."
      required: [alt]
      optional: [caption, format, width, height, aspectRatio, colorSpace, compression, dpi, fileSize, capture.date, capture.location, capture.device, photographer, variants]

    - name: media-video
      description: "Video-specific metadata (MP4, WebM, etc.)."
      optional: [alt, caption, format, width, height, aspectRatio, codec.video, codec.audio, frameRate, duration, fileSize, chapters, captions, transcript, director]

    - name: media-audio
      description: "Audio-specific metadata (MP3, WAV, FLAC, podcast episodes, etc.)."
      optional: [format, codec.audio, duration, fileSize, sampleRate, channels, chapters, transcript, host, guests]

    - name: media-document
      description: "Document metadata (PDF, DOCX, presentations, etc.)."
      optional: [format, pages, dpi, fileSize, taggedPdf]

    - name: media-rights
      description: "Rights and licensing metadata shared across all media types."
      required: [rights.owner, rights.license]
      optional: [rights.copyright, rights.attribution.required, rights.attribution.format, rights.usage.commercial, rights.usage.thirdParty, rights.territorial.allowed, rights.temporal.perpetual, ai.citationRequired, ai.extraction, ai.reproduction]

    # --- Database metadata profiles (absorbed from mx-database-metadata-spec.md) ---

    - name: database
      description: "Database-level metadata. Lives in mx.database.yaml."
      required: [database.engine]
      optional: [database.version, database.environment, database.steward, classification.sensitivity, classification.containsPii, classification.containsFinancial, classification.regulatory, retention.defaultDays, ai.queryAllowed, ai.schemaAccess, ai.sampleData, ai.trainingData, ai.reason]

    - name: database-schema
      description: "Schema-level metadata. Lives in {name}.schema.yaml."
      optional: [schema.domains, classification.sensitivity, ai.queryAllowed, ai.descriptionConfidence]

    - name: database-table
      description: "Table-level metadata. Lives in {name}.table.yaml."
      optional: [table.domain, table.subdomain, database.steward, classification.sensitivity, classification.containsPii, classification.piiTypes, classification.containsFinancial, classification.gdprLawfulBasis, classification.regulatory, volume.rowCountEstimate, volume.growthRate, quality.completeness, ai.queryAllowed, ai.schemaVisible, ai.sampleData, ai.trainingData, ai.semanticDescription, ai.commonQueries, ai.joinsWith]

    - name: database-column
      description: "Column-level metadata within table definitions."
      optional: [column.semantic.type, column.semantic.entity, column.semantic.role, column.semantic.standard, column.pii, column.piiType, column.encrypted, ai.searchable, ai.maskInResponses, ai.displayName]

    - name: database-relationship
      description: "Relationship metadata between tables."
      required: [relationship.type, relationship.from, relationship.to]
      optional: [ai.traverse]

    - name: database-view
      description: "View metadata."
      optional: [view.materialized, view.sourceTables, ai.semanticDescription, ai.commonQueries]

    - name: database-query
      description: "Named query metadata."
      required: [query.sql]
      optional: [query.parameters, ai.safeToRun, ai.safeToCall, ai.returnsPii]

    - name: database-procedure
      description: "Stored procedure metadata."
      optional: [procedure.parameters, procedure.tablesModified, ai.safeToRun, ai.neverSuggest, ai.sideEffects]

    - name: database-dictionary
      description: "Data dictionary with glossary, standards, and naming conventions."
      optional: [dictionary.glossary]

    - name: x-mx-public
      description: "MX-public extension fields. Prefix: x-mx-. Visible in published cogs. Cog-Nova-MX vendor extensions."
      fields: [x-mx-mount-type, x-mx-mount-swappable, x-mx-mount-upstream]

    - name: x-mx-private
      description: "MX-private extension fields. Obfuscated. Prefix: x-mx-p-. Field names are not listed publicly."
      fields: []
---

# MX Field Dictionary

> **This is the single source of truth for all MX field information.** If any other file in the repository contradicts what is here, this file wins.

## 0. Metadata Architecture Overview

Every file in MX-Hub carries structured metadata. MX metadata makes files self-describing — a machine reading any file can immediately understand what it is, who wrote it, what it relates to, and how it should be handled.

### Two kinds of metadata file

- **Folder metadata (`.mx.yaml.md`)** — One per directory. Hidden from casual browsing (`ls`), visible to machines (`ls -a`). Describes the folder: what it contains, how it should be used, what rules apply.
- **Document metadata (`.cog.md`)** — Standalone documents with YAML frontmatter. Describes a single document: title, author, status, dependencies, execution instructions.

| Aspect | `.mx.yaml.md` | `.cog.md` |
|--------|---------------|-----------|
| Describes | A folder | A document |
| Requires | `folderType`, `stability`, `lifecycle` | `category`, `partOf` |
| Can execute | No | Yes (optional `execute:` block) |
| Per folder | Exactly one | Any number |
| Hidden | Yes (dot prefix) | No |

### Two-zone frontmatter model

**Zone 1 — top level (document identity):** `title`, `description`, `author`, `created`, `modified`, `version` — always explicit, universal to any YAML parser.

**Zone 2 — under `mx:` (MX-operational):** everything else — `status`, `contentType`, `tags`, `audience`, `license`, `runbook`, `execute`, AI policy fields.

The boundary is intentional. Zone 1 fields are universal. Zone 2 fields belong to The Gathering's `mx:` namespace. The `mx:` block is the machine's instruction set; the top level is the document's passport.

### Inheritance

Child folders inherit metadata from parents. Fields marked as inheritable (e.g., `aiAssistance`, `audience`, `stability`) propagate down the tree. Identity fields (`title`, `description`, `created`) are never inherited. Vendor extensions (`x-mx-*`) are never inherited. If a child declares a field, the child's value wins.

### Profiles

Not every file needs every field. Profiles define which fields apply to which document types: `core` (everything), `cog` (.cog.md files), `folder` (.mx.yaml.md files), `book`, `blog`, `contact`, `report`, `audit`, `event`, `migration`, `routing`, `script`, `x-mx-public`.

---

Metadata is everywhere. A markdown file carries it in YAML frontmatter. An HTML page carries it in `<meta>` tags. A JavaScript file carries it in JSDoc comments. A photograph carries it in EXIF headers. A shell script carries it in comment blocks. A database carries it in column constraints and SQL comments.

MX does not invent new metadata formats. It recognises existing ones and adds an identity layer — name, version, purpose, audience, governance — using the native convention of each file type. The approach is embrace and extend: honour what the file already says, then add what MX needs for discoverability and trust.

But metadata only works when everyone agrees on what the fields mean. When one team uses `keywords` and another uses `tags` for the same thing, the machines cannot connect them. When `date` might mean creation date, publication date, or last-modified date, the metadata is noise, not signal.

This dictionary exists to end that ambiguity. Every field, every block type, every carrier format, every namespace mapping — one definition, one source of truth for the entire ecosystem.

---

## 1. What this dictionary does

The MX ecosystem has two complementary authorities. The **cog-unified-spec** defines structure — blocks, inheritance, reader behaviour, the architecture of a cog file. This dictionary defines **vocabulary** — what each field means, which fields are required for which document types, how metadata is carried across file formats, and what to do when two fields seem to mean the same thing.

The spec says *how* cogs are built. The dictionary says *what goes inside them*, regardless of which carrier format delivers the metadata.

**For AI agents:** Parse the YAML frontmatter above. The `fields` array contains every canonical field with name, type, definition, status, and profile. The `blockTypes` array defines all block types with their field structures. The `carrierFormats` array summarises how metadata travels across file types. The `overlap-resolution` array declares which field wins when two seem similar. The `namespace-policy` section defines who owns what.

**For humans:** Start with the naming conventions and namespace policy below — that is the philosophy. Then browse the carrier format sections to understand how metadata lives in different file types. The field-by-field definitions are in the YAML above, organised by profile.

---

## 2. How fields are organised

Not every document needs every field. A blog post needs different metadata from a contact record. A shell script needs different metadata from a database schema. The dictionary groups fields into **profiles** — sets of fields that apply to specific document types or metadata contexts.

### Document profiles

| Profile | What it covers | Required fields |
|---------|---------------|-----------------|
| **Core** | Every MX document | `title`, `description`, `author`, `created`, `modified` |
| **Cog** | `.cog.md` files in the registry | `name`, `category`, `partOf` |
| **Book** | Protocols and Handbook chapters | `book`, `chapter`, `wordCount`, `copyright` |
| **Blog** | Published articles | `publicationDate`, `blogState` |
| **Contact** | Person records | `relationship`, `role`, `company` |
| **Folder** | `.mx.yaml.md` folder metadata | `folderType`, `stability`, `lifecycle`, `domain` |
| **Report** | Session and audit reports | `reportType` |
| **Audit** | Web audit scoring | *(all optional)* |
| **Event** | Events and presentations | *(all optional)* |
| **Migration** | Content relocation tracking | *(all optional)* |
| **x-mx-public** | Cog-Nova-MX vendor extensions | `x-mx-mount-type`, `x-mx-mount-swappable` |

### Code profiles

| Profile | What it covers | Required fields |
|---------|---------------|-----------------|
| **code-repository** | Whole repository or project | `project.name`, `project.language` |
| **code-file** | Individual source files | `file.language`, `file.purpose` |
| **code-function** | Function-level metadata | `function.name`, `function.purpose` |
| **code-class** | Class and module metadata | `class.name`, `class.purpose` |
| **code-inline** | Inline code annotations | `annotation.type` |
| **code-dependency** | Dependency and package metadata | `dependency.name`, `dependency.version` |
| **code-test** | Test suites and cases | `test.framework`, `test.coverage` |
| **code-api** | API endpoint documentation | `api.method`, `api.path` |

### Media profiles

| Profile | What it covers | Required fields |
|---------|---------------|-----------------|
| **media-sidecar** | Sidecar metadata files | `sidecar.targetFile`, `sidecar.format` |
| **media-image** | Photograph and image metadata | `image.format`, `image.dimensions` |
| **media-video** | Video asset metadata | `video.format`, `video.duration` |
| **media-audio** | Audio asset metadata | `audio.format`, `audio.duration` |
| **media-document** | PDF and document metadata | `document.format`, `document.pageCount` |
| **media-rights** | Rights and licensing metadata | `rights.license`, `rights.holder` |

### Database profiles

| Profile | What it covers | Required fields |
|---------|---------------|-----------------|
| **database** | Whole database metadata | `database.engine`, `database.name` |
| **database-schema** | Schema-level metadata | `schema.name`, `schema.purpose` |
| **database-table** | Table metadata and semantics | `table.name`, `table.purpose` |
| **database-column** | Column-level metadata | `column.name`, `column.dataType` |
| **database-relationship** | Foreign keys and joins | `relationship.type`, `relationship.fromTable` |
| **database-view** | View definitions | `view.name`, `view.purpose` |
| **database-query** | Named queries and reports | `query.name`, `query.purpose` |
| **database-procedure** | Stored procedures and triggers | `procedure.name`, `procedure.purpose` |
| **database-dictionary** | Data dictionary entries | `dictionary.term`, `dictionary.definition` |

A cog file inherits the core profile automatically — it needs both the core fields and the cog-specific fields. The profiles are additive, not exclusive.

---

## 3. Naming conventions

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

## 4. When fields overlap

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

## 5. Namespace policy

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

### Carrier-specific syntax

The namespace convention adapts to the native metadata format of each carrier:

| Carrier | Standard field | MX-operational field | Vendor extension |
|---------|---------------|---------------------|------------------|
| **YAML** (`.cog.md`) | `title: "..."` | `mx: contentType: guide` | `x-mx-mount-type: personal` |
| **HTML** (`.cog.html`) | `<meta name="description">` | `<meta name="mx:content-type">` | `<meta name="x-mx:deployment">` |
| **JavaScript** (`.cog.js`) | `@description ...` | `@mx:content-type guide` | `@x-mx:pipeline-stage report` |
| **CSS** (`.cog.css`) | `@description ...` | `@mx:content-type theme` | `@x-mx:design-system core` |
| **Shell scripts** | `# description: "..."` | `# mx.contentType: tool` | `# x-mx-pipeline: build` |
| **XMP/EXIF** (images) | Native EXIF fields | `mx:` XMP namespace | `x-mx:` XMP namespace |
| **Media sidecars** | Standard YAML fields | `mx:` block in sidecar | `x-mx-` fields in sidecar |
| **SQL comments** | `-- description: ...` | `-- mx.contentType: table` | `-- x-mx-classification: pii` |

The pattern is consistent: standard fields use the native convention without prefix, MX-operational fields use the `mx:` prefix in the native convention, and vendor extensions use `x-mx-` or `x-vendor-` in the native convention.

**ADR:** `mx-canon/mx-maxine-lives/thinking/decisions/2026-02-14-attribute-namespace-policy.cog.md`

---

## 6. Two-zone metadata structure

Every MX document uses a two-zone metadata model, regardless of carrier format. Document identity fields occupy Zone 1. All MX-operational metadata occupies Zone 2.

**Zone 1 — top level (document identity):** `title`, `description`, `author`, `created`, `modified`, `version`

**Zone 2 — under `mx:` (MX-operational metadata):** everything else — `status`, `contentType`, `category`, `partOf`, `tags`, `audience`, `license`, `runbook`, `execute`, AI policy fields, and all other MX fields.

```yaml
---
title: "My Document"
description: "What this document is about."
author: "Tom Cranstoun"
created: 2026-03-02
modified: 2026-03-02
version: "1.0"

mx:
  status: active
  contentType: guide
  tags: [metadata, mx]
  audience: [humans, machines]
---
```

The boundary is intentional. Zone 1 fields are universal — any YAML parser reads `title` and `author` without knowing anything about MX. Zone 2 fields are MX-operational — they require understanding of the MX ecosystem to interpret correctly. Separating them makes the frontmatter self-describing at a glance.

In non-YAML contexts (HTML, JS, CSS), the `mx:` prefix marks the same boundary: `<meta name="mx:content-type">` in HTML, `@mx:content-type` in JSDoc. The pattern is consistent — `mx:` signals MX-operational metadata whether in a YAML block or an HTML attribute.

The `mx:` namespace belongs to **The Gathering** — it is part of the open standard, not a vendor extension.

---

## 7. Field migration

When a field is renamed, the overlap-resolution section in the YAML above declares which name wins. The canonical name is the only name that new documents should use. Migration tooling (`npm run audit:renames`) tracks old-to-new mappings and reports references that need updating.

---

## 8. Folder metadata inheritance

Every directory in the MX ecosystem can have a `.mx.yaml.md` file. Child directories inherit from their parent automatically. The parent declares which fields are inheritable via the `inheritable` array.

### Identity fields (never inherited — always per-folder)

- `title`, `description`, `purpose` — what makes this folder unique
- `created`, `modified` — per-file timestamps
- `domain` — the folder's business domain

### Inheritable fields (stripped if identical to parent)

- `author`, `audience`, `stability`, `status`, `lifecycle`
- `folderType`, `primaryLanguages`, `hasSubfolders`
- `version`, `contentType`
- `aiAssistance`, `aiEditable`
- `aiGenerationAllowed`, `aiGenerationReviewRequired`
- `aiTraining`, `aiTrainingConditions`

### Vendor extension fields (never inherited)

Fields prefixed with `x-mx-` are per-folder and never inherited. They represent mount configuration specific to that repository.

### Root files

Files at the top of a directory tree are root files. They define the full set of defaults for their subtree via the `inheritable` array. Submodule roots are always root files (`folderType: submodule`).

---

## 9. How to add a new field

### Standard fields (The Gathering vocabulary)

1. **Check overlap** — search the `overlap-resolution` section. Does an existing field already cover this concept?
2. **Choose a profile** — which document types need this field? (core, cog, folder, blog, etc.)
3. **Follow naming conventions** — camelCase, spelling-neutral, no prefix
4. **Add to the `fields:` array** in this dictionary with name, type, definition, status, profile, and required level
5. **Register in the profile** — add the field to the relevant profile's required/recommended/optional list
6. **Validate** — run `npm run cog:validate` to confirm the dictionary parses correctly

### Vendor extension fields (Cog-Nova-MX)

1. **Use the `x-mx-` prefix** for public extensions, `x-mx-p-` for private
2. **Use kebab-case** for extension field names (unlike standard camelCase)
3. **Add to the `fields:` array** with `profile: x-mx-public` or `profile: x-mx-private`
4. **Document the context** — explain where and why this extension is used
5. **No Gathering approval needed** — vendor extensions are Cog-Nova-MX's decision

### What NOT to do

- Do not create a field that duplicates an existing one. Check overlap resolution first.
- Do not use snake_case. Ever. The naming convention is camelCase for standard fields, kebab-case for vendor extensions.
- Do not define fields in guides, specifications, or book chapters. This dictionary is the single source of truth.

---

## 10. Allowed values quick reference

| Field | Allowed values |
|-------|---------------|
| `status` | draft, active, published, deprecated, archived, unknown, proposed, accepted, rejected, superseded, pending, review, approved, planning, open, closed, sent, canonical |
| `stability` | stable, evolving, experimental, deprecated, archived |
| `lifecycle` | production, development, prototype, legacy, deprecated |
| `folderType` | category, content, config, build, scripts, submodule |
| `audience` | tech, business, humans, machines, agents, both |
| `blogState` | draft, review, published |
| `confidential` | true, false |
| `aiAssistance` | welcome, restricted, prohibited |
| `aiEditable` | true, false |
| `aiTraining` | conditional, allowed, prohibited |
| `priority` | high, medium, low |
| `reportType` | session, completion, audit, directors, build |
| `readingLevel` | beginner, intermediate, advanced, expert |
| `x-mx-mount-type` | personal, team, product, standard |
| `x-mx-mount-swappable` | true, false, fork |

---

## 11. Block types

A cog is composed of blocks. Each block has a type that declares what its content is. Blocks live in the YAML frontmatter as entries in the `blocks` array. The markdown body below the frontmatter is the prose block — it does not need to be declared in YAML.

The `blockTypes` array in the YAML above defines every block type with its fields, types, and requirements. This section provides the narrative context.

### Block type reference

| Block Type | Purpose | Required |
|------------|---------|----------|
| **prose** | Human-readable narrative. The markdown body. | Implicit — the markdown body IS the prose block |
| **essence** | Binary content (images, PDFs, audio). Encoded as base64 or a pointer. | No |
| **definition** | Standards conformance. Declares which standards the cog follows. | Recommended |
| **action** | Executable instructions. Defines what the cog can do. | No (presence makes it an action-doc) |
| **code** | Source code. Embedded program text in any language. | No |
| **html** | HTML content. May reference WebMCP standards. | No |
| **security** | Trust and access policy. Signing requirements, execution permissions. | No |
| **sop** | Standard Operating Procedures. Merged at read-time from the uber doc. | No |
| **provenance** | Origin and lineage. Where content came from, how it was derived. | No |
| **version** | Version history and changelog within the cog. | No |

### prose

The markdown body of every cog is its prose block. It is never declared in YAML — it is implicit. The prose block is for humans. It reads like a well-written document: informative, editorial, authoritative. The YAML is for machines. The markdown is for humans.

If a cog has a `prose-source` field in its frontmatter, the prose block is inherited from an external file. This allows one cog to carry the machine-readable YAML while a companion file carries the human narrative.

### essence

Binary content — images, PDFs, audio, video, compiled assets — cannot live as markdown. The essence block wraps binary content inside a cog.

```yaml
blocks:
  - essence:
      type: image/png
      encoding: base64
      size: 1847
      content: "iVBORw0KGgoAAAANSUhEUg..."
```

**Size rule:** If the binary content is 2kb or smaller, it is embedded as base64 in the `content` field. If it exceeds 2kb, the essence block becomes a pointer:

```yaml
blocks:
  - essence:
      type: image/png
      encoding: pointer
      size: 245760
      location: "assets/product-photo.png"
      checksum: "sha256:a7f3b2e1..."
```

When the essence block is a pointer, there is no binary content in the cog body. The `location` field points to the canonical location of the binary. The `checksum` field allows verification.

### definition

The definition block declares which standards the cog conforms to. It is the cog's backward-compatibility statement and its contract with readers.

```yaml
blocks:
  - definition:
      standards:
        - name: "The Gathering"
          version: "2.0-draft"
          scope: "cog metadata format, block types, reader behaviour"
        - name: "Schema.org"
          version: "26.0"
          scope: "product metadata in info blocks"
```

**Hierarchical conformance.** The definition block operates at two levels. A `definition` entry in the top-level `blocks` array applies to the entire cog. Any individual block can include its own `standards` array that overrides or extends the document-level definition for that block only.

**For non-MX readers.** When a reader does not implement MX, the definition block tells it which standards are in use. An LLM encountering a cog for the first time reads the definition block to understand what conventions to expect.

### action

The action block is what makes a cog executable. The presence of an action block (the `execute` object) is what distinguishes an action-doc from an info-doc. Action blocks define what the cog can do — validate data, generate reports, extract information, analyse content.

### code

Source code embedded in the cog. Unlike fenced code blocks in the prose (which are for display), a code block in the YAML is machine-addressable — a reader can extract and execute it.

```yaml
blocks:
  - code:
      language: javascript
      purpose: "Validation logic for pricing fields"
      content: |
        function validatePrice(price) {
          return price > 0 && price < 1000000;
        }
```

### html

HTML content that may reference emerging standards like WebMCP for embedded routines. An HTML block can carry interactive widgets, forms, or visualisations. An HTML block using WebMCP can access all other blocks in the cog — reading essence content, querying code blocks, rendering provenance. This access is governed by the cog's security block and the reader's SOP policy.

### security

Declares the trust and execution policy for the cog. Readers consult the security block to determine whether they are willing to execute action blocks or render HTML blocks.

```yaml
blocks:
  - security:
      signing: required
      execution: sandboxed
      trust-level: 3
      policy: "Refuse to execute unsigned action blocks. HTML blocks render in sandbox only."
```

Readers may refuse to execute unsigned cogs. This is reader agency — the security block is the cog's statement of what it expects; the reader decides whether to comply.

### sop

Standard Operating Procedures injected at read-time by MX implementations. The SOP block is virtual — it does not exist in the cog file on disk. When an MX implementation reads a cog, it merges the relevant SOP block from its uber doc into the cog at read-time. The file stays clean. The procedures are always current.

### provenance

Records the origin and lineage of the cog's content — where it came from, how it was derived, what transformations were applied.

```yaml
blocks:
  - provenance:
      origin: "https://example.com/product-specs"
      derived-from: "product-catalogue-v3.cog.md"
      method: "Extracted and restructured from HTML source"
      date: 2026-02-13
```

### version

Changelog and version history within the cog itself. Complements the `version` field in base frontmatter with detailed history.

```yaml
blocks:
  - version:
      history:
        - version: "2.0"
          date: 2026-02-13
          changes: "Block architecture introduced. Single cog type."
        - version: "1.0"
          date: 2026-02-08
          changes: "Initial specification."
```

### Reader agency

A reader of a cog is not obligated to process every block:

1. **Ignore blocks.** A reader may skip any block type it does not understand or does not need. An HTML-unaware reader ignores HTML blocks. The prose block is always readable.

2. **Mixin blocks.** A reader may inject its own blocks before reading the cog — either prepending (adding before the cog's blocks) or substituting (replacing a block of the same type).

3. **Refuse execution.** A reader may refuse to execute action blocks from unsigned cogs, following its security block or SOP policy. The cog remains readable as documentation even when execution is refused.

Reader agency means cogs degrade gracefully. A minimal reader that only understands prose blocks can still read every cog in the ecosystem. A full MX implementation processes all block types. Everything in between works too.

---

## 12. Carrier formats

MX follows the **embrace-and-extend** model. Every file type has established conventions for metadata. MX does not replace them — it recognises existing structures as native blocks and adds an MX identity layer on top.

The `carrierFormats` array in the YAML above defines every carrier with its metadata location, MX identity mechanism, and parsing section reference. This section provides the full parsing rules and examples.

### The embrace-and-extend principle

A JavaScript file already has JSDoc tags. MX recognises `@description` as the prose block and `@param`/`@returns` as the definition block. An HTML file already has `<meta>` tags. MX recognises `<meta name="description">` as a prose excerpt and Schema.org JSON-LD as a definition block. MX never duplicates what the file already says.

The MX identity layer adds governance and discoverability — name, version, purpose, audience, category — using the native comment or metadata convention of each file type.

**Backward compatibility:** `.cog.html` is valid HTML. `.cog.js` is valid JavaScript. `.cog.css` is valid CSS. Adding MX metadata does not break the file for tools that do not understand MX.

### 12.1. Markdown (.cog.md)

The canonical cog format. YAML frontmatter for machines, markdown body for humans.

**Metadata location:** YAML frontmatter between `---` delimiters at the top of the file.

**MX identity:** Standard cog fields in YAML. The `mx:` block contains MX-operational fields.

**Parsing rule:** Standard YAML parser. Extract content between the first and second `---` lines.

**Pre-existing structures recognised as blocks:**

- Markdown body = prose block (implicit)
- Fenced code blocks = display code (not machine-addressable; use the `code` block type for that)

```markdown
---
title: "Pricing Validator"
description: "Validates pricing data to catch errors before AI agents misinterpret them."
author: "Tom Cranstoun"
created: 2026-02-09
modified: 2026-03-03
version: "1.0"

mx:
  status: active
  contentType: specification
  tags: [pricing, validation]
---

# Pricing Validator

Human-readable documentation goes here...
```

### 12.2. HTML (.cog.html)

HTML files carry metadata in `<meta>` tags in the `<head>` element and Schema.org JSON-LD in `<script>` elements.

**Metadata location:** `<meta>` tags in `<head>`, `data-mx-*` attributes on elements.

**MX identity:** `<meta name="mx:*">` tags for MX-operational fields. `data-mx-*` attributes for element-level metadata.

**Parsing rule:** Parse `<meta>` tags in `<head>`. Names without prefix are standard HTML metadata. Names with `mx:` prefix are MX-operational. Names with `x-mx:` prefix are vendor extensions.

**Pre-existing structures recognised as blocks:**

- Schema.org JSON-LD = definition block
- `<meta name="description">` = prose excerpt
- `<main>` content = essence block
- `<style>` elements = embedded CSS carrier (see 12.4)
- `<script>` elements = embedded JS carrier (see 12.3)

```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="description" content="Product pricing validation tool">
  <meta name="author" content="Tom Cranstoun">
  <meta name="mx:content-type" content="tool">
  <meta name="mx:status" content="active">
  <meta name="mx:audience" content="machines">
  <link rel="mx" href="pricing.cog.md">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pricing Validator"
  }
  </script>
</head>
<body>
  <main data-mx-block="essence">
    <!-- Content here -->
  </main>
</body>
</html>
```

**Pointer to full cog:** Any HTML page can reference a full `.cog.md` file using `<link rel="mx" href="page.cog.md">`. This allows lightweight HTML pages to point to their full cog definition without embedding all metadata inline.

**Embedded blocks in HTML:** A `.cog.html` file may contain `<style>` and `<script>` elements. Each embedded language uses its own native metadata convention — CSS comments inside `<style>`, JSDoc inside `<script>`. A single HTML file can therefore carry multiple blocks, each with its own metadata. This is the foundation of "the doc IS the app."

### 12.3. JavaScript (.cog.js)

JavaScript files carry metadata in JSDoc comment blocks.

**Metadata location:** JSDoc `/** */` comment block at the top of the file.

**MX identity:** `@mx:` tags in the JSDoc block.

**Parsing rule:** Parse the JSDoc block. Standard JSDoc tags (`@description`, `@param`, `@returns`) are recognised as native metadata. Tags prefixed with `@mx:` are MX-operational. Tags prefixed with `@x-mx:` are vendor extensions.

**Pre-existing structures recognised as blocks:**

- `@description` = prose block
- `@param` / `@returns` = definition block
- Function bodies = code block (implicit)
- `@example` = code block (display)

```javascript
/**
 * @description Validates pricing data to catch range errors
 * @version 1.0.0
 * @author Tom Cranstoun
 * @mx:content-type validator
 * @mx:status active
 * @mx:audience machines
 * @mx:tags pricing, validation, commerce
 *
 * @param {Object} priceData - The pricing object to validate
 * @returns {ValidationResult} Validation outcome with errors
 */
function validatePrice(priceData) {
  // Implementation
}
```

### 12.4. CSS (.cog.css)

CSS files carry metadata in comment blocks at the top of the file.

**Metadata location:** `/* */` comment block at the top of the file.

**MX identity:** `@mx:` tags in the CSS comment block.

**Parsing rule:** Parse the opening comment block. Lines with `@` prefixes follow the same convention as JSDoc — `@description` is standard, `@mx:` is MX-operational, `@x-mx:` is vendor extension.

**Pre-existing structures recognised as blocks:**

- File description = prose block
- `:root` custom properties = definition block (design tokens)
- Media queries and selectors = code block (implicit)

```css
/**
 * @description Core design tokens for MX branding
 * @version 2.0.0
 * @author Tom Cranstoun
 * @mx:content-type theme
 * @mx:status active
 * @mx:audience machines
 */

:root {
  --mx-primary: #1a1a2e;
  --mx-accent: #e94560;
  --mx-font-family: 'Inter', sans-serif;
}
```

### 12.5. Images (.cog.png, .cog.jpg)

Image files carry metadata in EXIF and XMP headers.

**Metadata location:** EXIF/XMP metadata embedded in the image file.

**MX identity:** MX fields in the XMP namespace. The `mx:` XMP namespace is registered for MX-operational fields.

**Parsing rule:** Read EXIF/XMP metadata using standard image metadata libraries. Existing EXIF fields (camera, GPS, timestamp) are recognised as the provenance block. MX fields in the XMP namespace are MX-operational.

**Pre-existing structures recognised as blocks:**

- EXIF data (camera model, exposure, GPS) = provenance block
- XMP description = prose excerpt
- IPTC caption / keywords = definition block

```xml
<!-- XMP metadata in image file -->
<rdf:Description xmlns:mx="https://mx.community/ns/1.0/">
  <mx:contentType>photograph</mx:contentType>
  <mx:status>active</mx:status>
  <mx:audience>humans</mx:audience>
  <mx:rights>
    <mx:license>CC-BY-4.0</mx:license>
    <mx:holder>Tom Cranstoun</mx:holder>
  </mx:rights>
</rdf:Description>
```

### 12.6. Shell scripts

Shell scripts (and any `#`-comment language) carry metadata in comment-block frontmatter.

**Metadata location:** `# ---` delimited comment block after the shebang line.

**MX identity:** Standard fields in `# key: value` format. MX-operational fields use `# mx.field: value`.

**Parsing rule:** Strip the leading hash and one space from each line between `# ---` delimiters. The result is valid YAML. Any tool that parses YAML can parse script metadata.

**Pre-existing structures recognised as blocks:**

- Comment blocks with structural intent = prose block
- Function signatures and case structures = code skeleton

```bash
#!/bin/bash
# ---
# title: "mx.ls — Directory listing"
# version: "1.0"
# created: 2026-02-10
# modified: 2026-02-10
# author: Tom Cranstoun
# description: "Wraps eza with sensible defaults and named modes"
# category: mx-tools
# status: active
# tags: [eza, ls, directory, filesystem]
# dependencies: [eza]
# builds-on: [script-helper]
# ---
```

**The cut compute principle.** When an AI agent needs to work with a script, the workflow is: (1) read metadata only — the comment block tells the agent what the script does, its dependencies, and its status; (2) read skeleton if needed — extract comments and structural skeleton without implementation lines; (3) read full script only if necessary. This three-tier approach reduces token consumption by 60-85% for typical script interactions.

**Applicability beyond bash.** This convention works for any language that uses `#` for comments: Python, Ruby, Perl, YAML configuration files, Dockerfiles. For languages using other comment styles (`//`, `/* */`, `--`), the same fields and structure apply — only the comment prefix changes.

### 12.7. Media sidecars

Media sidecar files provide machine-readable metadata for binary assets that cannot carry their own YAML frontmatter.

**Metadata location:** A companion `.mx.yaml.md` or `.mx.yaml` file alongside the media asset.

**MX identity:** Standard two-zone YAML structure. Zone 1 for document identity, Zone 2 (`mx:` block) for MX-operational fields.

**Naming convention:** The sidecar filename matches the asset filename with `.mx.yaml.md` appended. For example, `hero-image.png` has a sidecar at `hero-image.png.mx.yaml.md`.

**Relationship to embedded metadata:** The sidecar is authoritative. Where EXIF/XMP metadata exists in the binary asset, the sidecar can reference it but does not duplicate it. The `sidecar.alignedMetadata` field declares which embedded fields have been verified to match the sidecar.

```yaml
---
title: "Product Hero Image"
description: "Main product photograph for landing page"
author: "Tom Cranstoun"
created: 2026-01-15
modified: 2026-03-01

mx:
  status: active
  contentType: photograph
  sidecar:
    targetFile: "hero-image.png"
    format: "image/png"
    dimensions: { width: 1920, height: 1080 }
    alignedMetadata: [title, author, created]
  rights:
    license: "CC-BY-4.0"
    holder: "Cog-Nova-MX Ltd"
    commercial: true
---
```

### 12.8. Code repositories

Repository-level metadata provides project-wide context for AI agents working with code.

**Metadata location:** A `.mx.yaml.md` file at the repository root, or a dedicated `mx.config.yaml` file.

**MX identity:** Standard two-zone YAML structure with code-specific profiles.

**Inheritance:** Repository metadata flows down to directories and files. Child `.mx.yaml.md` files inherit from the repository root and may override specific fields.

```yaml
---
title: "MX Audit"
description: "Web audit tooling for MX compliance analysis"
author: "Tom Cranstoun"
created: 2025-11-01
modified: 2026-03-03

mx:
  status: active
  contentType: tool
  project:
    name: mx-audit
    language: javascript
    framework: node
    packageManager: npm
    testFramework: jest
  conventions:
    style: eslint
    commits: conventional
    branching: trunk-based
---
```

### 12.9. Database sidecars

Database metadata sidecars provide schema documentation that AI agents can parse without direct database access.

**Metadata location:** A `.mx.yaml.md` file alongside the database, or SQL comment blocks within migration files and schema definitions.

**MX identity:** Standard two-zone YAML structure with database-specific profiles.

**SQL comment format:** For inline metadata within SQL files, use `-- ---` delimiters with `-- key: value` lines. The parsing rule is identical to shell script metadata — strip the leading double-dash prefix and parse as YAML.

```sql
-- ---
-- title: "Users Table"
-- description: "Core user accounts with authentication data"
-- mx.contentType: table
-- mx.classification: pii
-- mx.status: active
-- ---

CREATE TABLE users (
  id         SERIAL PRIMARY KEY,    -- mx.semantic: identifier
  email      VARCHAR(255) NOT NULL, -- mx.semantic: contact, mx.pii: true
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Sidecar format for full schema documentation:**

```yaml
---
title: "E-Commerce Database Schema"
description: "Core database schema for product catalogue and orders"
author: "Tom Cranstoun"
created: 2026-01-10
modified: 2026-03-03

mx:
  status: active
  contentType: schema
  database:
    engine: postgresql
    name: ecommerce
    version: "14.0"
  schema:
    name: public
    tables: [users, products, orders, order_items]
    purpose: "Transactional data for e-commerce operations"
---
```

---

## 13. Code metadata

Code metadata enables AI agents to understand code context, constraints, and intent without parsing implementation details. The fields defined in this section belong to the code-* profiles in the YAML above.

### 13.1. Repository metadata

Repository-level metadata declares project-wide context. This metadata lives in a `.mx.yaml.md` file at the repository root, or in a dedicated `mx.yaml` file.

**File location precedence:**

1. `.mx.yaml.md` (MX standard)
2. `mx.yaml` or `mx.yml`
3. `.mx/config.yaml`
4. `package.json` under an `mx` key (Node.js projects)
5. `pyproject.toml` under `[tool.mx]` (Python projects)

The repository metadata covers project identity (`project.*` fields), audience context, domain and constraints (`context.*` fields), technology stack (`stack.*` fields), and development conventions (`conventions.*` fields).

```yaml
# mx.yaml at repository root
mx:
  version: "1.0"
  project:
    name: "Order Service"
    description: "API backend for order processing"
    repository: https://github.com/example/order-service
  context:
    domain: "e-commerce"
    purpose: "API backend for order processing"
    constraints:
      - "Must handle 10,000 requests per second"
      - "GDPR compliant"
  stack:
    language: typescript
    runtime: node
    version: "20.x"
    framework: express
  conventions:
    style: prettier
    testing: jest
    documentation: jsdoc
```

### 13.2. File metadata

File-level metadata declares context for individual source files. This metadata appears at the top of the file in the native comment format.

The `@mx` marker signals the beginning of MX metadata within a comment block. Everything between `@mx` and the end of the comment is parsed as YAML.

**JavaScript / TypeScript:**

```javascript
/**
 * @mx
 * audience: machine
 * purpose: "Validates user input against schema"
 * stability: stable
 * dependencies:
 *   - zod
 * ai:
 *   editable: true
 *   contextRequired: ["src/types/user.ts"]
 */
```

**Python:**

```python
"""
@mx
audience: machine
purpose: "Validates user input against schema"
stability: stable
ai:
  editable: true
  contextRequired: ["src/types/user.py"]
"""
```

**Go:**

```go
/*
@mx
audience: machine
purpose: "Validates user input against schema"
stability: stable
ai:
  editable: true
*/
```

**Rust:**

```rust
//! @mx
//! audience: machine
//! purpose: "Validates user input against schema"
//! stability: stable
```

### 13.3. Function and class metadata

Function metadata provides granular context for individual code units. The `@mx` marker works within function-level JSDoc, docstrings, or comment blocks.

**Function metadata example (TypeScript):**

```typescript
/**
 * Calculates the total price including tax and discounts.
 *
 * @mx
 * pure: true
 * complexity: O(n)
 * throws: [InvalidDiscountError, NegativePriceError]
 * ai:
 *   confidence: 0.9
 *   testCoverage: true
 *   edgeCases:
 *     - "Empty cart returns 0"
 *     - "Negative discounts are rejected"
 *
 * @param items - Array of cart items
 * @param discountCode - Optional discount code
 * @returns Total price in smallest currency unit
 */
function calculateTotal(items: CartItem[], discountCode?: string): number {
  // ...
}
```

**Class metadata example (TypeScript):**

```typescript
/**
 * Manages user authentication state and token refresh.
 *
 * @mx
 * pattern: singleton
 * threadSafe: false
 * state:
 *   - currentUser: "Authenticated user or null"
 *   - tokens: "Access and refresh tokens"
 * invariants:
 *   - "If currentUser is set, tokens must be valid"
 * ai:
 *   sensitive: true
 *   reason: "Handles authentication tokens"
 *   contextRequired: ["src/types/auth.ts"]
 */
class AuthManager {
  // ...
}
```

### 13.4. Inline annotations

Inline annotations provide context for specific code blocks or lines without requiring full metadata blocks.

**Block annotations** mark regions of code with semantic context:

```typescript
// @mx:begin security-critical
// All code in this block handles authentication tokens.
// AI assistants should not modify without human review.
const token = await refreshToken(currentToken);
validateTokenSignature(token);
storeToken(token);
// @mx:end security-critical
```

**Block annotation tags:** `security-critical`, `performance-critical`, `compatibility`, `workaround`, `generated`, `legacy`.

**Line annotations** mark individual lines:

```typescript
const API_KEY = process.env.API_KEY; // @mx:sensitive no-log no-expose
await sleep(100);                    // @mx:intentional rate-limiting
if (value === null) {                // @mx:ai do-not-remove edge case #1234
  return defaultValue;
}
```

**Line annotation tags:** `@mx:sensitive`, `@mx:intentional`, `@mx:todo`, `@mx:fixme`, `@mx:hack`, `@mx:ai`.

**AI-specific annotations:** `@mx:ai do-not-remove`, `@mx:ai do-not-modify`, `@mx:ai preserve-logic`, `@mx:ai explain-before-changing`, `@mx:ai generated`, `@mx:ai reviewed`.

### 13.5. Dependency metadata

Dependency metadata declares why dependencies exist and how they should be managed. This extends native package manifests (`package.json`, `pyproject.toml`) with an `mx` key.

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "zod": "^3.22.0"
  },
  "mx": {
    "dependencies": {
      "express": {
        "purpose": "HTTP server framework",
        "critical": true,
        "upgradePolicy": "conservative",
        "alternativesConsidered": ["fastify", "koa"]
      },
      "zod": {
        "purpose": "Runtime type validation",
        "critical": true,
        "ai": {
          "replacementPermitted": false,
          "reason": "Schema definitions throughout codebase"
        }
      }
    }
  }
}
```

### 13.6. Environment metadata

Environment metadata declares runtime requirements and configuration, stored in `.mx/environment.yaml` or equivalent.

```yaml
mx:
  environments:
    development:
      description: "Local development environment"
      requirements:
        node: ">=20.0.0"
      services:
        - postgres:15
        - redis:7
      envVars:
        required: [DATABASE_URL, REDIS_URL]
        sensitive: [DATABASE_URL]
    production:
      description: "Production deployment"
      envVars:
        sensitive: [API_KEY, JWT_SECRET, DATABASE_URL]
      ai:
        access: prohibited
        reason: "Production secrets must not be exposed to AI assistants"
```

### 13.7. Test metadata

Test metadata declares test context, coverage targets, and AI generation permissions.

```typescript
/**
 * @mx
 * testType: unit
 * coverageTarget: 90%
 * subject: src/utils/validation.ts
 * fixtures:
 *   - valid_users.json
 *   - invalid_users.json
 * ai:
 *   generationPermitted: true
 *   mustCover:
 *     - "Empty input"
 *     - "Invalid email format"
 *     - "Missing required fields"
 */
describe('validateUser', () => {
  // ...
});
```

### 13.8. API metadata

API metadata declares endpoint context for web services. This extends OpenAPI specifications with MX fields using the `x-mx:` extension prefix.

```yaml
# OpenAPI with MX extensions
paths:
  /users/{id}:
    get:
      summary: Get user by ID
      x-mx:
        audience: machine
        rateLimit: 100/minute
        cache:
          enabled: true
          ttl: 300
        ai:
          safeToCall: true
          idempotent: true
          sensitiveResponseFields: [email, phone]
```

Route annotations in code use the same fields:

```typescript
/**
 * @mx
 * method: GET
 * path: /users/:id
 * auth: required
 * rateLimit: 100/minute
 * ai:
 *   safeToCall: true
 *   testMode: "Add ?test=true for mock data"
 */
router.get('/users/:id', getUser);
```

### 13.9. Code metadata inheritance

Code metadata supports inheritance at multiple levels: repository to directory, directory to file, file to function/class.

```text
mx.yaml (repository)
  > src/ (directory)
    > src/payments/ (directory)
      > src/payments/stripe.ts (file)
        > processPayment() (function)
```

Child levels inherit from parents unless explicitly overridden. A directory without its own configuration inherits directly from its nearest ancestor that has configuration.

**Repository root detection.** The repository root is identified by presence of `mx.yaml` with a `version` property, or by the version control directory (`.git`). Build systems must not traverse above the repository root when resolving inheritance.

---

## 14. Media metadata

Media metadata enables AI agents to understand media context, content, rights, and appropriate use without analysing binary content. The fields defined in this section belong to the media-* profiles in the YAML above.

### 14.1. Sidecar files

Media sidecar files are the primary mechanism for attaching machine-readable metadata to binary assets. Every media asset can have a companion `.mx.yaml.md` file that provides full MX metadata.

**Naming convention:** The sidecar filename is the asset filename with `.mx.yaml.md` appended.

| Asset | Sidecar |
|-------|---------|
| `hero.png` | `hero.png.mx.yaml.md` |
| `intro.mp4` | `intro.mp4.mx.yaml.md` |
| `podcast.mp3` | `podcast.mp3.mx.yaml.md` |
| `report.pdf` | `report.pdf.mx.yaml.md` |

**Relationship to embedded metadata.** Many media formats carry embedded metadata (EXIF in photographs, ID3 in audio, XMP across formats). The sidecar is authoritative where both exist. The `sidecar.alignedMetadata` field declares which embedded fields have been verified to match the sidecar, preventing drift.

```yaml
---
title: "Product Hero Image"
description: "Main product photograph for landing page"
author: "Tom Cranstoun"
created: 2026-01-15
modified: 2026-03-01

mx:
  status: active
  contentType: photograph
  sidecar:
    targetFile: "hero.png"
    format: "image/png"
    dimensions: { width: 1920, height: 1080 }
    alignedMetadata: [title, author, created]
  rights:
    license: "CC-BY-4.0"
    holder: "Cog-Nova-MX Ltd"
    commercial: true
    attribution: "Photo by Tom Cranstoun"
---
```

### 14.2. Image metadata

Image metadata extends the sidecar format with image-specific fields for dimensions, format, colour space, and capture context.

**Key fields:** `image.format`, `image.dimensions`, `image.colorSpace`, `image.resolution`, `image.compression`.

**Capture metadata.** For photographs, capture context (camera, lens, exposure, GPS) lives in EXIF. The sidecar references but does not duplicate it. The `capture.*` fields provide human-readable summaries where EXIF is too technical.

```yaml
mx:
  contentType: photograph
  image:
    format: "image/jpeg"
    dimensions: { width: 4032, height: 3024 }
    colorSpace: sRGB
    resolution: { x: 300, y: 300, unit: dpi }
  capture:
    device: "iPhone 15 Pro"
    date: 2026-01-15
    location: "London, UK"
    context: "Product shoot for spring catalogue"
```

### 14.3. Video metadata

Video metadata covers duration, resolution, codec, frame rate, and chapter structure.

**Key fields:** `video.format`, `video.duration`, `video.resolution`, `video.codec`, `video.frameRate`, `video.chapters`.

```yaml
mx:
  contentType: video
  video:
    format: "video/mp4"
    duration: "PT12M30S"
    resolution: { width: 1920, height: 1080 }
    codec: H.264
    frameRate: 30
    hasAudio: true
    chapters:
      - title: "Introduction"
        startTime: "PT0S"
      - title: "Demo"
        startTime: "PT2M15S"
```

### 14.4. Audio metadata

Audio metadata covers duration, format, bitrate, and transcript availability.

**Key fields:** `audio.format`, `audio.duration`, `audio.bitrate`, `audio.channels`, `audio.sampleRate`.

```yaml
mx:
  contentType: podcast
  audio:
    format: "audio/mp3"
    duration: "PT45M"
    bitrate: 192
    channels: stereo
    sampleRate: 44100
    hasTranscript: true
    transcriptPath: "episode-12.transcript.md"
```

### 14.5. Document metadata

Document metadata covers PDFs, presentations, and other document formats.

**Key fields:** `document.format`, `document.pageCount`, `document.wordCount`, `document.hasOCR`, `document.accessible`.

```yaml
mx:
  contentType: report
  document:
    format: "application/pdf"
    pageCount: 24
    wordCount: 8500
    hasOCR: true
    accessible: true
    language: "en-GB"
    extractedText: "report-text.md"
```

### 14.6. Rights and licensing

Rights metadata is critical for AI agents to understand what they may and may not do with media assets. The `rights.*` fields declare licensing, attribution requirements, and usage restrictions.

**Key fields:** `rights.license`, `rights.holder`, `rights.commercial`, `rights.attribution`, `rights.modifications`, `rights.aiTraining`, `rights.aiGeneration`.

```yaml
mx:
  rights:
    license: "CC-BY-NC-4.0"
    holder: "Cog-Nova-MX Ltd"
    commercial: false
    attribution: "Credit required: Tom Cranstoun / Cog-Nova-MX"
    modifications: allowed
    territory: worldwide
    expires: null
    aiTraining: prohibited
    aiGeneration: prohibited
    reason: "Proprietary visual identity — not for AI training or generation"
```

**AI interpretation.** When an AI agent encounters media with rights metadata, it must respect the declared permissions. `aiTraining: prohibited` means the content must not be used for model training. `aiGeneration: prohibited` means the content must not be used as a basis for generated content. These fields are explicit — no inference required.

### 14.7. Collections and galleries

Media assets can be grouped into collections using a collection sidecar that references member assets.

```yaml
mx:
  contentType: collection
  collection:
    name: "Spring 2026 Product Photos"
    purpose: "Product catalogue imagery"
    members:
      - file: "hero.png"
        role: primary
      - file: "detail-1.png"
        role: supplementary
      - file: "detail-2.png"
        role: supplementary
    ordering: explicit
    rights:
      license: "proprietary"
      holder: "Cog-Nova-MX Ltd"
```

---

## 15. Database metadata

Database metadata enables AI agents to understand data semantics, relationships, constraints, and appropriate use without direct database access. The fields defined in this section belong to the database-* profiles in the YAML above.

### 15.1. Database and schema metadata

Database-level metadata provides the top-level context — engine, version, purpose, and classification.

```yaml
---
title: "E-Commerce Database"
description: "Core transactional database for product catalogue and orders"
author: "Tom Cranstoun"
created: 2026-01-10
modified: 2026-03-03

mx:
  status: active
  contentType: database
  database:
    engine: postgresql
    name: ecommerce
    version: "14.0"
    purpose: "Transactional data for e-commerce operations"
    classification: confidential
  schema:
    name: public
    tables: [users, products, orders, order_items]
    views: [active_orders, product_summary]
    purpose: "Primary transactional schema"
---
```

### 15.2. Table metadata

Table metadata provides semantic context for each table — purpose, row estimates, relationships, and data classification.

```yaml
mx:
  contentType: table
  table:
    name: users
    purpose: "Core user accounts with authentication data"
    schema: public
    estimatedRows: 50000
    growthRate: "100/day"
    classification: pii
    owner: "identity-team"
    retention:
      policy: "7 years after account closure"
      legal: "GDPR Article 17"
```

### 15.3. Column metadata

Column-level metadata provides semantic meaning beyond the data type — what the column represents, its sensitivity, and how AI agents should treat it.

```yaml
mx:
  contentType: column
  column:
    name: email
    table: users
    dataType: "varchar(255)"
    semantic: contact
    pii: true
    nullable: false
    unique: true
    description: "Primary contact email address"
    validation: "RFC 5322 email format"
    ai:
      sensitive: true
      maskInLogs: true
      reason: "Personal contact information under GDPR"
```

**Inline SQL metadata.** Column metadata can also appear as SQL comments within schema definitions:

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,             -- mx.semantic: identifier
  email      VARCHAR(255) NOT NULL UNIQUE,   -- mx.semantic: contact, mx.pii: true
  name       VARCHAR(100),                   -- mx.semantic: personal-name, mx.pii: true
  created_at TIMESTAMP DEFAULT NOW(),        -- mx.semantic: audit-timestamp
  deleted_at TIMESTAMP                       -- mx.semantic: soft-delete
);
```

### 15.4. Relationship metadata

Relationship metadata documents foreign keys, joins, and conceptual links between tables.

```yaml
mx:
  contentType: relationship
  relationship:
    type: "many-to-one"
    fromTable: orders
    fromColumn: user_id
    toTable: users
    toColumn: id
    onDelete: restrict
    onUpdate: cascade
    purpose: "Links orders to the customer who placed them"
    businessRule: "Every order must have a valid customer"
```

### 15.5. View and query metadata

Views and named queries receive their own metadata to explain purpose, performance characteristics, and refresh policies.

**View metadata:**

```yaml
mx:
  contentType: view
  view:
    name: active_orders
    purpose: "Orders placed in the last 30 days that have not been fulfilled"
    baseTables: [orders, order_items, users]
    materialised: false
    refreshPolicy: null
    performance: "Scans orders table — use date index"
```

**Query metadata:**

```yaml
mx:
  contentType: query
  query:
    name: "monthly-revenue-report"
    purpose: "Calculates total revenue grouped by product category"
    parameters:
      - name: start_date
        type: date
        required: true
      - name: end_date
        type: date
        required: true
    expectedRuntime: "< 5 seconds"
    schedule: "First of each month"
```

### 15.6. Stored procedures and triggers

Procedure metadata documents stored procedures, functions, and triggers with their purpose, parameters, and side effects.

```yaml
mx:
  contentType: procedure
  procedure:
    name: "process_refund"
    purpose: "Processes a customer refund and updates inventory"
    parameters:
      - name: order_id
        type: integer
        required: true
      - name: reason
        type: text
        required: true
    sideEffects:
      - "Updates order status to 'refunded'"
      - "Restores inventory quantities"
      - "Creates audit log entry"
    ai:
      safeToCall: false
      reason: "Financial transaction — requires human approval"
```

### 15.7. Data classification

Database metadata supports systematic data classification for privacy, compliance, and AI governance.

| Classification | Meaning | AI access |
|----------------|---------|-----------|
| `public` | Freely available data | Full access |
| `internal` | Internal business data | Read with caution |
| `confidential` | Restricted business data | Metadata only |
| `pii` | Personal identifiable information | No access without authorisation |
| `sensitive` | Highly sensitive (financial, health) | Prohibited |

```yaml
mx:
  database:
    classification: confidential
  table:
    classification: pii
  column:
    pii: true
    classification: sensitive
    ai:
      access: prohibited
      maskInLogs: true
      reason: "Financial data under PCI-DSS"
```

Classification inherits downward: database to schema to table to column. A column can escalate (mark itself more sensitive than its table) but cannot de-escalate (mark itself less sensitive).

### 15.8. Data dictionary

The data dictionary profile provides a glossary of business terms mapped to database objects, bridging domain language and technical implementation.

```yaml
mx:
  contentType: dictionary
  dictionary:
    term: "Customer Lifetime Value"
    abbreviation: CLV
    definition: "Total revenue attributed to a customer across all orders"
    calculation: "SUM(orders.total) WHERE orders.user_id = users.id"
    tables: [users, orders]
    owner: "analytics-team"
    lastVerified: 2026-02-15
```

---

## 16. AI interpretation guidance

This section consolidates guidance for AI agents interpreting MX metadata across all carriers. The principles apply regardless of whether the metadata lives in YAML frontmatter, HTML meta tags, code comments, or database sidecars.

### 16.1. General principles

1. **Read metadata first.** Before parsing implementation, read the structured metadata. Twelve lines of YAML provide more reliable context than scanning hundreds of lines of code or markup.

2. **Respect declared rights.** When `rights.aiTraining` or `rights.aiGeneration` fields are present, honour them without exception. These are explicit declarations, not suggestions.

3. **Honour sensitivity markers.** Fields marked `pii: true`, `classification: sensitive`, or `ai.access: prohibited` must not be logged, cached, or included in responses without explicit authorisation.

4. **Follow the inheritance chain.** Metadata inherits downward — repository to directory to file to function, database to schema to table to column. Always resolve the full chain before acting.

5. **Profile-scope your interpretation.** The same field name in different profiles may have different semantics. `purpose` in a code-file profile describes what the file does; `purpose` in a database-table profile describes what data the table holds. Use the profile context.

### 16.2. Code-specific guidance

- **Check `stability` before modifying.** A field or function marked `stability: frozen` must not be changed. `stability: stable` means changes require careful review. `stability: experimental` allows modification.
- **Read `ai.contextRequired` before editing.** If a file declares context dependencies, read those files first to understand the broader impact.
- **Respect `@mx:ai` annotations.** Inline annotations like `@mx:ai do-not-remove` and `@mx:ai preserve-logic` are direct instructions to AI agents.
- **Check `ai.editable` at file and function level.** A file may allow editing but specific functions within it may not.

### 16.3. Media-specific guidance

- **Never reproduce restricted media.** If `rights.aiGeneration: prohibited`, do not generate content based on the asset.
- **Check `rights.attribution` before referencing.** If attribution is required, include it in any response that references the asset.
- **Use `sidecar.alignedMetadata` to verify consistency.** If the sidecar declares alignment with embedded metadata, trust the sidecar values.

### 16.4. Database-specific guidance

- **Classification overrides access.** If a column is classified as `pii` or `sensitive`, do not include its values in responses regardless of other permissions.
- **Check `ai.safeToCall` before executing procedures.** Stored procedures with `safeToCall: false` require human approval.
- **Use the data dictionary.** When translating between business terms and technical column names, consult the dictionary profile entries.
- **Respect retention policies.** Do not suggest actions that would violate declared retention policies or legal requirements.

---

## 17. Related documents

- **Structure:** `mx-canon/mx-the-gathering/specifications/cog-unified-spec.cog.md` — defines how cogs are built (this dictionary defines what goes inside them)
- **Guide:** `mx-canon/ssot/writing-guides/mx-yaml-md-guide.md` — practical how-to for folder metadata (references this dictionary for field definitions)

---

*One definition per field. No ambiguity. No overlap. The metadata is for machines. The prose is for humans. Design for both.*
