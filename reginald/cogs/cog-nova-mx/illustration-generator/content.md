---
version: "1.2.0"
description: "Create SVG illustrations and syntax-highlighted code blocks with metadata for MX publications, following established visual style and quality standards."
created: 2026-02-17
modified: 2026-03-03
author: Tom Cranstoun and Maxine

mx:
  maintainer: tom.cranstoun@gmail.com
  license: proprietary
  status: published
  category: content-creation
  partOf: mx-cog-registry
  refersTo: [pdf-generator, mx-handbook, visual-style]
  tags: [illustration, svg, visual-design, style-guide, metadata, code-blocks, syntax-highlighting]
  buildsOn: [pdf-generator]
  runtime:
    type: interactive
    engine: human-ai-collaboration
  execute:
    actions:
      - name: create
        description: "Create a new illustration following MX visual style standards"
        usage: |
          ## CREATE — New Illustration Workflow
          This action guides creating professional illustrations for MX publications.
          ### Step 1: Identify the concept
          Before creating any illustration, clarify:
          - **What concept needs visualization?** (e.g., agent decision flow, content hierarchy)
          - **What chapter/document** will use it?
          - **What type of illustration** best communicates the concept?
            - **Flowchart:** Decision processes, workflows, sequential steps
            - **Architecture:** Layered systems, structure, relationships
            - **Comparison:** Side-by-side evaluation, before/after, good/bad
            - **Timeline:** Chronological events, roadmaps, phases
          ### Step 2: Choose the category
          Organize illustrations by visual type:
          | Category | When to Use | Examples |
          |----------|-------------|----------|
          | **flowcharts/** | Decision trees, processes, sequential logic | Agent decision flow, implementation roadmap |
          | **architectures/** | System structure, layers, hierarchies | Content hierarchy, progressive enhancement layers |
          | **comparisons/** | Side-by-side evaluation, contrasts | Navigation patterns, agent vs human visits |
          | **timelines/** | Chronological events, roadmaps | First-mover advantage, platform race |
          | **code-blocks/** | Code examples with syntax highlighting | JavaScript functions, HTML markup, CSS rules, YAML frontmatter |
          **File path pattern:**
          ```
          datalake/assets/images/svg/{category}/{name}.cog.svg
          ```
          ### Step 3: Apply the visual style guide
          **Approved Color Scheme:**
          - **Success/Good:** `#4ade80` (green) — fills: `#d1fae5`, text: `#065f46`
          - **Caution/Partial:** `#fbbf24` (amber) — fills: `#fef3c7`, text: `#92400e`
          - **Error/Blocked:** `#ef4444` (red) — fills: `#fee2e2`, text: `#991b1b`
          - **Neutral/Structure:** `#6b7280` (gray) — fills: `#f3f4f6`, text: `#1f2937`
          **Typography Standards:**
          - **Titles:** Georgia, serif, 24px, bold, `#1f2937`
          - **Subtitles:** system-ui, sans-serif, 14px, `#6b7280`
          - **Body text:** system-ui, sans-serif, 10-12px, `#1f2937` or `#4b5563`
          - **Code:** 'Courier New', monospace, 10-12px, `#1f2937`
          - **Labels:** system-ui, sans-serif, 11-14px, bold
          **Dimensions:**
          - **ViewBox:** `0 0 900 600` (3:2 aspect ratio)
          - **PNG export:** 2700px width (3× scale for print quality)
          - **Background:** White (`#ffffff`)
          - **Margins:** 50px minimum from edges
          **Layout Principles:**
          - Clear visual hierarchy (titles, main content, annotations)
          - Generous whitespace between elements
          - Consistent alignment and spacing
          - Readable at 50% scale (for handbook printing)
          ### Step 4: Create YAML frontmatter
          Every `.cog.svg` file starts with XML comment containing YAML:
          ```yaml
          ===
          name: illustration-name
          version: "1.0.0"
          title: "Human-Readable Title"
          description: "One-sentence description of what the illustration shows"
          created: YYYY-MM-DD
          modified: YYYY-MM-DD
          author: Maxine (AI-generated) | Tom Cranstoun | Co-created
          license: MIT
          status: published | draft | review
          category: illustration
          partOf: mx-illustrations
          inherits: book-svg-style
          purpose: "Comprehension aid - [specific purpose]"
          refersTo: [mx-handbook, relevant-topics]
          visualType: flowchart | architecture | comparison | timeline
          concept: specific-concept-name
          audience: both | tech | business | humans
          usedIn:
            - book: mx-handbook | mx-protocols
              chapters: [chapter-02, chapter-03]
              context: "Illustrates [specific concept] to [show/explain what]"
          tags: [tag1, tag2, tag3, tag4, tag5]
          mx:
            contentType: illustration-cog
            discoverable: true
            reusable: true
          ===
          ```
          **CRITICAL:** Use `===` instead of `---` as YAML delimiters inside SVG comments. XML/HTML comments cannot contain double hyphens (`--`) anywhere except at the start (`<!--`) and end (`-->`). The standard YAML delimiter `---` contains double hyphens, which causes PDF generation to fail with "Double hyphen within comment" errors.
          **Field Guide:**
          - `name`: Kebab-case identifier matching filename
          - `version`: Semantic version starting at 1.0.0
          - `title`: Display title for captions
          - `description`: Complete sentence explaining the illustration
          - `visualType`: Primary category (must match directory)
          - `concept`: Specific concept being illustrated (kebab-case)
          - `audience`: Who benefits (both = technical + business)
          - `usedIn`: Which books and chapters reference this illustration
          - `tags`: 5-8 descriptive keywords for discovery
          ### Step 5: Build the SVG structure
          **Standard SVG template:**
          ```xml
          <?xml version="1.0" encoding="UTF-8"?>
          <!--
          [YAML frontmatter here]
          -->
          <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
            <title>[Illustration Title]</title>
            <desc>[Longer description for accessibility]</desc>
            <defs>
              <style>
                .background { fill: #ffffff; }
                .title-text { font-family: Georgia, serif; font-size: 24px; font-weight: bold; fill: #1f2937; }
                /* Additional CSS classes following style guide */
              </style>
              <!-- Arrowhead markers if needed -->
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
              </marker>
            </defs>
            <!-- Background -->
            <rect class="background" width="900" height="600"/>
            <!-- Title -->
            <text class="title-text" x="450" y="35" text-anchor="middle">[Title]</text>
            <text class="subtitle-text" x="450" y="55" text-anchor="middle">[Subtitle]</text>
            <!-- Main content elements -->
            <!-- ... -->
          </svg>
          ```
          **Best Practices:**
          - Use CSS classes for styling (not inline styles)
          - Group related elements with `<g>` tags
          - Add comments for major sections
          - Use consistent naming conventions
          - Make text readable without CSS (fallback fonts)
          ### Step 6: Convert SVG to PNG
          **Automated conversion (recommended):**
          ```bash
          npm run illustrations:generate
          ```
          This recursively converts all `.svg` and `.cog.svg` files in subdirectories.
          **Automatic validation:** The script includes auto-detection and auto-fix for double-hyphen errors. Before conversion, it scans all `.cog.svg` files for `---` YAML delimiters and automatically replaces them with `===`. This prevents PDF generation errors caused by double hyphens inside XML comments.
          **Manual conversion (if needed):**
          ```bash
          # For a specific subdirectory
          qlmanage -t -s 2700 -o "datalake/assets/images/bitmap/flowcharts/" \
            "datalake/assets/images/svg/flowcharts/illustration-name.cog.svg"
          # Rename output
          mv "datalake/assets/images/bitmap/flowcharts/illustration-name.cog.svg.png" \
             "datalake/assets/images/bitmap/flowcharts/illustration-name.png"
          ```
          ### Step 7: Add to chapter markdown
          Insert the illustration with caption:
          ```markdown
          ![Illustration Title](../../../image-assets/bitmap/category/illustration-name.png)
          *Figure X.Y: [Caption describing what the illustration shows and why it matters.
          Explain the visual structure (colors, arrows, sections) and key takeaways for readers.
          2-4 sentences providing context that helps readers understand the illustration.]*
          ```
          **Caption Template:**
          - **Sentence 1:** What the illustration shows (visual inventory)
          - **Sentence 2-3:** How to read it (guide to structure/colors/flow)
          - **Sentence 4:** Why it matters (key takeaway or implication)
          ### Step 8: Quality checklist
          Before considering an illustration complete:
          - [ ] **Visual clarity:** Readable at 50% scale?
          - [ ] **Color accessibility:** Works for colorblind readers?
          - [ ] **Text legibility:** All labels readable?
          - [ ] **Consistent style:** Matches approved color scheme?
          - [ ] **Proper metadata:** Complete YAML frontmatter?
          - [ ] **Correct category:** In right subdirectory?
          - [ ] **PNG generated:** Bitmap version exists?
          - [ ] **Referenced in chapter:** Markdown image added?
          - [ ] **Caption complete:** Figure number and explanation?
          - [ ] **Print quality:** 2700px width for crisp printing?
          **"Excellent" Standard:**
          - Communicates concept instantly (< 5 seconds to grasp)
          - No unnecessary details or decoration
          - Works in black & white (structure, not just color)
          - Professional typography and alignment
          - Self-explanatory with minimal caption
        inputs:
          - name: concept
            type: string
            required: true
            description: "The concept to illustrate (e.g., 'agent decision flow')"
          - name: chapter
            type: string
            required: true
            description: "Chapter that will use this illustration (e.g., 'chapter-03')"
          - name: visual-type
            type: string
            required: true
            description: "Type of illustration: flowchart, architecture, comparison, or timeline"
        outputs:
          - name: svg-file
            type: file
            description: "Created SVG - report full absolute path (e.g., /Users/.../datalake/assets/images/svg/flowcharts/name.cog.svg)"
          - name: png-file
            type: file
            description: "Generated PNG - report full absolute path (e.g., /Users/.../datalake/assets/images/bitmap/flowcharts/name.png)"
        completion:
          report: |
            Always list full absolute paths for all files created:
            - SVG source: /Users/.../datalake/assets/images/svg/{category}/{name}.cog.svg
            - PNG output: /Users/.../datalake/assets/images/bitmap/{category}/{name}.png
            MX Principle: Full absolute paths enable traceability and make outputs easy to locate.
      - name: create-code-block
        description: "Convert code blocks to syntax-highlighted SVG images using VS Code Dark+ theme"
        usage: |
          ## CREATE-CODE-BLOCK — Code to SVG Conversion
          This action converts code blocks into professional SVG images with syntax highlighting.
          ### Step 1: Extract code content
          **From markdown source:**
          - Identify fenced code blocks (```language)
          - Preserve exact code content (no modifications)
          - Note the language identifier (js, html, css, yaml, bash, etc.)
          - Extract surrounding context (heading, paragraph explaining the code)
          ### Step 2: Apply VS Code Dark+ syntax highlighting
          **Color Scheme Reference:**
          Use VS Code Dark+ theme colors for all languages:
          **JavaScript / TypeScript:**
          - **Keywords** (`if`, `function`, `const`, `let`, `var`, `return`, `import`, `export`): `#569cd6`
          - **Strings** (`"text"`, `'text'`, `` `template` ``): `#ce9178`
          - **Comments** (`// comment`, `/* block */`): `#6a9955`
          - **Function names** (`functionName()`): `#dcdcaa`
          - **Variables** (`variableName`): `#9cdcfe`
          - **Numbers** (`123`, `0.5`): `#b5cea8`
          - **Operators** (`=`, `+`, `=>`, `&&`): `#d4d4d4`
          - **Punctuation** (`{`, `}`, `(`, `)`, `;`): `#d4d4d4`
          **HTML:**
          - **Tag names** (`<div>`, `<span>`, `<html>`): `#569cd6`
          - **Attribute names** (`class`, `id`, `href`): `#9cdcfe`
          - **Attribute values** (`"value"`, `'value'`): `#ce9178`
          - **Punctuation** (`<`, `>`, `=`, `/`): `#808080`
          - **Comments** (`<!-- comment -->`): `#6a9955`
          **CSS:**
          - **Selectors** (`.class`, `#id`, `element`): `#d7ba7d`
          - **Property names** (`color`, `margin`, `display`): `#9cdcfe`
          - **Property values** (`#fff`, `10px`, `flex`): `#ce9178`
          - **Units** (`px`, `em`, `%`): `#b5cea8`
          - **Punctuation** (`{`, `}`, `:`, `;`): `#d4d4d4`
          - **Comments** (`/* comment */`): `#6a9955`
          **YAML:**
          - **Keys** (`name`, `version`, `description`): `#9cdcfe`
          - **String values** (`"value"`, `'value'`): `#ce9178`
          - **Booleans** (`true`, `false`): `#569cd6`
          - **Numbers** (`123`, `1.0.0`): `#b5cea8`
          - **Null** (`null`): `#569cd6`
          - **Comments** (`# comment`): `#6a9955`
          - **Punctuation** (`:`, `-`, `[`, `]`): `#d4d4d4`
          **Bash / Shell:**
          - **Commands** (`echo`, `cd`, `npm`, `git`): `#569cd6`
          - **Strings** (`"text"`, `'text'`): `#ce9178`
          - **Variables** (`$VAR`, `${VAR}`): `#9cdcfe`
          - **Comments** (`# comment`): `#6a9955`
          - **Operators** (`|`, `&&`, `>`, `<`): `#d4d4d4`
          - **Flags** (`--flag`, `-f`): `#b5cea8`
          **JSON:**
          - **Keys** (`"name"`, `"version"`): `#9cdcfe`
          - **String values** (`"value"`): `#ce9178`
          - **Numbers** (`123`, `1.5`): `#b5cea8`
          - **Booleans** (`true`, `false`): `#569cd6`
          - **Null** (`null`): `#569cd6`
          - **Punctuation** (`{`, `}`, `[`, `]`, `:`, `,`): `#d4d4d4`
          **Markdown:**
          - **Headings** (`#`, `##`, `###`): `#569cd6`
          - **Bold/Italic markers** (`**`, `*`, `__`, `_`): `#d4d4d4`
          - **Links** (`[text](url)`): `#9cdcfe` (text), `#ce9178` (URL)
          - **Code** (`` `code` ``): `#ce9178`
          - **Lists** (`-`, `*`, `1.`): `#d4d4d4`
          ### Step 3: Create SVG structure
          **Code block SVG template:**
          ```xml
          <?xml version="1.0" encoding="UTF-8"?>
          <!--
          [YAML frontmatter — see Step 4]
          -->
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="[auto]" viewBox="0 0 800 [auto]">
            <title>Code Example: [Brief description]</title>
            <desc>Syntax-highlighted [language] code showing [what it does]</desc>
            <defs>
              <style>
                .background { fill: #1e1e1e; }
                .code-text { font-family: 'Courier New', 'Consolas', monospace; font-size: 13px; }
                .keyword { fill: #569cd6; }
                .string { fill: #ce9178; }
                .comment { fill: #6a9955; }
                .function { fill: #dcdcaa; }
                .variable { fill: #9cdcfe; }
                .number { fill: #b5cea8; }
                .punctuation { fill: #d4d4d4; }
              </style>
            </defs>
            <!-- Dark background (VS Code Dark+ theme) -->
            <rect class="background" width="800" height="[auto]"/>
            <!-- Code lines with syntax highlighting -->
            <text class="code-text" x="15" y="25">
              <tspan class="keyword">function</tspan>
              <tspan class="function"> example</tspan>
              <tspan class="punctuation">()</tspan>
              <tspan class="punctuation"> {</tspan>
            </text>
            <text class="code-text" x="15" y="45">
              <tspan class="punctuation">  </tspan>
              <tspan class="keyword">return</tspan>
              <tspan class="string"> "Hello, World!"</tspan>
              <tspan class="punctuation">;</tspan>
            </text>
            <text class="code-text" x="15" y="65">
              <tspan class="punctuation">}</tspan>
            </text>
          </svg>
          ```
          **Layout Guidelines:**
          - **Width:** 800px (narrower than illustrations, fits code naturally)
          - **Height:** Auto-calculated (20px per line + 15px top/bottom padding)
          - **Line spacing:** 20px between baselines
          - **Left margin:** 15px
          - **Font size:** 13px (readable when printed)
          - **Background:** Dark (`#1e1e1e` — VS Code Dark+ background)
          ### Step 4: Create YAML frontmatter
          **Code block metadata template:**
          ```yaml
          ===
          name: code-block-chapter-XX-example-N
          version: "1.0.0"
          title: "[Language] Example: [Brief Description]"
          description: "Syntax-highlighted [language] code demonstrating [concept]"
          created: YYYY-MM-DD
          modified: YYYY-MM-DD
          author: Maxine (AI-generated)
          license: MIT
          status: published
          category: illustration
          partOf: mx-illustrations
          inherits: book-svg-style
          purpose: "Code example - [specific purpose]"
          refersTo: [mx-handbook, chapter-XX]
          visualType: code-block
          language: javascript | html | css | yaml | bash | json | markdown
          lineCount: 15
          concept: concept-being-demonstrated
          audience: tech | both
          usedIn:
            - book: mx-handbook | mx-protocols
              chapters: [chapter-XX]
              context: "Demonstrates [specific technique/pattern]"
          syntaxTheme: vscode-dark-plus
          colorScheme:
            keyword: "#569cd6"
            string: "#ce9178"
            comment: "#6a9955"
            function: "#dcdcaa"
            variable: "#9cdcfe"
            number: "#b5cea8"
            punctuation: "#d4d4d4"
          tags: [code-block, [language], syntax-highlighting, example]
          mx:
            contentType: code-block-cog
            discoverable: true
            reusable: true
          ===
          ```
          **CRITICAL:** Use `===` instead of `---` as YAML delimiters inside SVG comments. XML/HTML comments cannot contain double hyphens (`--`) anywhere except at the start (`<!--`) and end (`-->`). The standard YAML delimiter `---` contains double hyphens, which causes PDF generation to fail with "Double hyphen within comment" errors.
          **Field Guide:**
          - `name`: Pattern `code-block-chapter-XX-example-N` for traceability
          - `visualType`: Always `code-block` for this action
          - `language`: Must match the code's language identifier
          - `lineCount`: Number of lines in the code example
          - `syntaxTheme`: Always `vscode-dark-plus` for consistency
          - `colorScheme`: Documents colors used (aids future updates)
          ### Step 5: Convert SVG to PNG
          Same workflow as illustrations:
          ```bash
          npm run illustrations:generate
          ```
          This recursively processes `code-blocks/` subdirectory alongside other categories.
          **Automatic validation:** The generation script now includes auto-detection and auto-fix for double-hyphen errors. Before PNG generation, it scans all `.cog.svg` files for `---` YAML delimiters and automatically replaces them with `===`. If issues are found, you'll see:
          ```
          ⚠️  Found SVG files with --- delimiters (causes PDF errors). Auto-fixing...
          ./path/to/file.cog.svg
          ✓ Fixed: Replaced --- with === in all SVG files
          ```
          ### Step 6: Replace code block in source markdown
          **Original markdown:**
          ```markdown
          Here's how to do it:
          ```javascript
          function example() {
            return "Hello, World!";
          }
          ` ` `
          ```
          **Replacement:**
          ```markdown
          Here's how to do it:
          ![JavaScript Example: Simple Function](../../../image-assets/bitmap/code-blocks/code-block-chapter-03-example-1.png)
          *Code Example 3.1: JavaScript function returning a greeting string. The function keyword (blue) declares the function, the return statement (blue) sends back a string value (orange).*
          ```
          **Caption Template for Code Blocks:**
          - **Sentence 1:** What the code does (functional description)
          - **Sentence 2:** How to read key elements (color guide + syntax explanation)
          - Keep technical but accessible
          ### Step 7: Quality checklist
          Before completing a code block illustration:
          - [ ] **Syntax correct:** Code compiles/runs without errors?
          - [ ] **Colors accurate:** Matches VS Code Dark+ exactly?
          - [ ] **Readable:** Text legible at print size?
          - [ ] **Complete metadata:** All YAML fields filled?
          - [ ] **Proper category:** In code-blocks/ subdirectory?
          - [ ] **PNG generated:** Bitmap version exists?
          - [ ] **Source replaced:** Markdown uses image reference?
          - [ ] **Caption complete:** Describes what code does + color guide?
        inputs:
          - name: code-content
            type: string
            required: true
            description: "The code to convert (exact content from code block)"
          - name: language
            type: string
            required: true
            description: "Programming language (js, html, css, yaml, bash, json, markdown)"
          - name: context
            type: string
            required: true
            description: "What concept this code demonstrates (for naming and metadata)"
          - name: chapter
            type: string
            required: true
            description: "Chapter using this code block (e.g., 'chapter-03')"
        outputs:
          - name: svg-file
            type: file
            description: "Created SVG - report full absolute path (e.g., /Users/.../code-blocks/code-block-chapter-03-example-1.cog.svg)"
          - name: png-file
            type: file
            description: "Generated PNG - report full absolute path (e.g., /Users/.../code-blocks/code-block-chapter-03-example-1.png)"
        completion:
          report: |
            Always list full absolute paths for all files created:
            - SVG source: /Users/.../datalake/assets/images/svg/code-blocks/{name}.cog.svg
            - PNG output: /Users/.../datalake/assets/images/bitmap/code-blocks/{name}.png
            MX Principle: Full absolute paths enable traceability and make outputs easy to locate.
  mx:
    contentType: action-doc
    runbook: "mx exec illustration-generator"
---

# The Illustration Generator

Create professional visual aids and syntax-highlighted code blocks for MX publications following established style standards and quality criteria.

## What This Does

Guides the creation of SVG illustrations and code blocks with proper metadata, consistent visual style, and professional quality for books, documentation, and presentations. Two actions:

### Action 1: Create Illustrations

Professional diagrams for concepts and workflows:

1. **Concept identification** — What needs visualization and why
2. **Category selection** — Flowchart, architecture, comparison, or timeline
3. **Visual style application** — Approved colors, typography, dimensions
4. **Metadata creation** — Complete YAML frontmatter with all fields
5. **SVG structure** — Standard template with best practices
6. **PNG conversion** — Automated workflow for print-quality output
7. **Chapter integration** — Markdown reference with descriptive caption
8. **Quality assurance** — 8-point checklist for "excellent" standard

### Action 2: Create Code Blocks

Syntax-highlighted code examples with VS Code Dark+ theme:

1. **Extract code content** — From markdown fenced code blocks
2. **Apply syntax highlighting** — VS Code Dark+ colors per language
3. **Create SVG structure** — Dark background, monospace font, proper spacing
4. **Metadata creation** — Language, line count, color scheme documentation
5. **PNG conversion** — Same automated workflow as illustrations
6. **Replace in source** — Markdown code block → image reference
7. **Quality checklist** — Syntax correct, colors accurate, readable

## Why This Exists

The MX Handbook needed comprehensive illustration coverage across 11 chapters. Creating illustrations ad-hoc without documented standards leads to:

- Inconsistent visual style
- Missing or incomplete metadata
- Wrong dimensions or aspect ratios
- Poor print quality
- Difficult maintenance and updates

This cog documents the approved visual language and workflow established during the first illustration batch (2026-02-17), enabling consistent quality for future illustrations.

## For AI Agents

**For concept illustrations (create action):**

1. Read this cog's `execute.actions.create` block for the complete workflow
2. Start with concept identification and chapter context
3. Choose appropriate category (flowchart/architecture/comparison/timeline)
4. Apply visual style guide exactly — approved colors, typography, dimensions
5. Create complete YAML frontmatter using the template
6. Build SVG following standard structure
7. Run npm run illustrations:generate for automated conversion
8. Add markdown reference with descriptive figure caption
9. Verify against 8-point quality checklist
10. **Report full absolute paths for all outputs** — SVG and PNG files (MX principle)
11. Only mark complete when "excellent" standard achieved

**For code blocks (create-code-block action):**

1. Read this cog's `execute.actions.create-code-block` block for complete workflow
2. Extract code content from markdown fenced code blocks
3. Identify language and surrounding context
4. Apply VS Code Dark+ syntax highlighting colors exactly as documented
5. Create 800px wide SVG with dark background (#1e1e1e)
6. Include complete YAML frontmatter with language and color scheme
7. Run npm run illustrations:generate for PNG conversion
8. Replace original code block with image reference in source markdown
9. Add descriptive caption explaining code functionality
10. **Report full absolute paths for all outputs** — SVG and PNG files (MX principle)
11. Verify syntax correctness and color accuracy

## Dependencies

| Tool | Required | Install |
| ---- | -------- | ------- |
| qlmanage | Yes (macOS) | Pre-installed on macOS |
| ImageMagick | Fallback | `brew install imagemagick` |
| npm | Yes | Node.js installation |

## Related Cogs

- `pdf-generator.cog.md` — Embeds illustrations in generated PDFs
- `mx-phrasebook.cog.md` — "Design for both" principle

---

*"The object introduces itself."* — Every illustration is self-describing with complete metadata and clear visual communication.
