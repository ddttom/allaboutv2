---
version: "1.12.1"
description: "Generate professional PDFs from markdown — table formatting, diagram rendering, illustrations, auto-scaled images. A4 and Kindle formats via pandoc."
created: 2026-02-15
modified: 2026-03-09
author: Tom Cranstoun and Maxine

mx:
  maintainer: tom.cranstoun@gmail.com
  license: proprietary
  status: published
  category: mx-core
  partOf: mx-os
  refersTo: [what-is-a-cog, env, reginald-mirror]
  buildsOn: [what-is-a-cog, what-is-mx-os]
  tags: [pdf, generation, pandoc, xelatex, emoji-cleanup, unicode-cleanup, zero-width-space, task-lists, document-production, kindle, a4, diagrams, svg, png-conversion, illustrations, ascii-art, code-blocks, syntax-highlighting, page-breaks, typography, widow-orphan-prevention, aspect-ratio, rsvg-convert, imagemagick, tool-cascade]
  audience: both
  readingLevel: advanced
  execute:
    runtime: runbook
    command: mx pdf-generator
    prerequisites:
      - cog: generate-footnotes
        action: generate
        reason: "Footnote HTML pages and QR code SVGs must be current before PDF compilation"
    poststeps:
      - cog: reginald-mirror
        action: sync
        reason: "After any cog modification, sync the Reginald web mirror to reflect changes"
    policy: |
      Pre-flight: Run ./scripts/generate-footnotes.sh before PDF generation to ensure
      footnote HTML pages and QR code SVGs are up to date.
      Post-flight: Run npm run reginald:mirror after modifying this cog to sync
      the Reginald web mirror at allaboutv2/reginald/.
      Git-first: Always commit source files before amending them. Never create backup
      copies, -print.md intermediates, or appended docs — git handles recovery.
      Fix emojis directly in source markdown files, never create intermediate copies.
      No file duplication. No -copy.md, -backup.md, or -print.md files. Ever.
      Footnote URLs: All footnote definitions with URLs must use trailing backslash line
      breaks so each URL renders on its own line in PDF output. Without `\`, pandoc
      collapses indented continuation lines into one paragraph. See writing-style.md
      Section 11 for the full convention and examples.
      Multi-file compilation: When compiling books or multi-chapter documents, list chapter
      files EXPLICITLY rather than using glob patterns (chapter-*.md). Glob patterns can
      match processing artifacts (-print.md, -copy.md) causing duplicate content in output.
      Example: Use "chapter-01.md chapter-02.md chapter-03.md" NOT "chapter-*.md".
      This ensures correct chapter order and prevents artifacts from appearing in the PDF.
    actions:
      - name: generate
        description: "Clean emojis, replace with textual equivalents, generate PDF in chosen format."
        usage: |
          ## GENERATE — Full Pipeline
          This is the main action. It cleans the source markdown, replaces emoji/icon
          characters with their textual equivalents in markdown conventions, then generates
          a professional PDF using pandoc + xelatex.
          ### Step 0: Generate footnote pages
          Run `./scripts/generate-footnotes.sh` to ensure all footnote HTML pages and
          QR code SVGs are up to date before PDF compilation. This ensures the QR code
          SVGs referenced in chapters point to current footnote pages.

          **Footnote URL formatting:** Verify that all footnote definitions in the
          source markdown use trailing backslash `\` line breaks between the description
          and each URL. Without this, pandoc collapses multi-URL footnotes into a single
          line in the PDF. See writing-style.md Section 11.
          ### Step 1: Identify the source file(s)
          1. If the user provides an explicit path, use it
          2. If the user says "the md" or "the markdown", check IDE context and conversation history
          3. If the user provides a filename only, search the repository with Glob
          4. If ambiguous, ask the user to clarify
          **For multi-file compilation (books with multiple chapters):**
          - List chapter files EXPLICITLY in the correct order
          - Do NOT use glob patterns like `chapter-*.md` — they can match processing artifacts
          - Example: `chapter-01.md chapter-02.md chapter-03.md` (correct order guaranteed)
          - Glob patterns may match `-print.md`, `-copy.md`, or other artifacts causing duplicates
          - Correct order typically: cover → preface → chapter-00 → chapter-01-N → glossary → end
          ### Step 2: Choose the engine
          Inspect the source markdown for ASCII box-drawing characters (any of: `┌ ┐ └ ┘ ├ ┤ │ ─ ┬ ┴`).
          - **If diagrams found:** Use Node engine (`node scripts/generate-document-pdf.js`)
            — converts ASCII diagrams to SVG then PNG at 300 DPI before PDF generation
          - **If no diagrams:** Use bash engine (`./scripts/mx-pdf.sh`) or direct pandoc
            — faster, simpler, proven
          If the bash engine requires `mx.generate` in frontmatter and the source lacks it,
          warn the user but proceed using direct pandoc instead.
          ### Step 3: Improve ASCII diagram rendering
          **Purpose:** Keep ASCII diagrams as-is but improve their PDF rendering by preventing page breaks.
          **Detection:**
          Search for code blocks containing ASCII box-drawing characters: `┌┐└┘├┤│─┬┴` or simple ASCII art using `+`, `-`, `|`
          **Approach:**
          Wrap ASCII diagrams with LaTeX `\begin{samepage}...\end{samepage}` commands to prevent them from breaking across pages.
          **Implementation:**
          1. **Locate ASCII diagrams:**
             ```bash
             # Search for lines with ASCII box patterns
             grep -E '\+[-]+\+|┌|└|│' chapter-file.md
             ```
          2. **Wrap with samepage environment:**
             Add `\begin{samepage}` before the heading or context paragraph that introduces the diagram.
             Add `\end{samepage}` after the closing ``` of the code block.
             **Example:**
             ```markdown
             Consider this common layout pattern:
             \begin{samepage}
             **Visual layout (what humans see):**
             ```text
             +----------------------------------+
             | [Navigation Menu]                |
             +----------------------------------+
             | Main Content      | Sidebar      |
             +----------------------------------+
             ```
             \end{samepage}
             **HTML order (what AI reads):**
             ```
          3. **Benefits:**
             - Preserves searchability (ASCII remains as text)
             - Maintains source simplicity (no image conversion needed)
             - Prevents awkward page breaks mid-diagram
             - Works with any ASCII style (box-drawing or simple +/-/|)
          4. **Alternative: Professional SVG conversion (when appropriate):**
             For complex diagrams where ASCII isn't sufficient, consider converting to professional SVG illustrations:
             - Read context (heading, surrounding paragraphs)
             - Interpret the concept (flowchart, architecture, comparison, timeline)
             - Redesign as professional illustration following illustration-generator.cog.md style guide
             - Store in `datalake/assets/images/svg/{category}/`
             - Replace ASCII with image reference in markdown
          **When to skip:** If no ASCII diagrams found, skip this step entirely.
          ### Step 4: Convert code blocks to syntax-highlighted SVG
          **Purpose:** Transform code blocks into professional SVG images with VS Code Dark+ syntax highlighting.
          **Detection:**
          After ASCII diagrams have been extracted, search for ALL remaining fenced code blocks:
          ```bash
          grep -n '```' source-file.md
          ```
          **Process each code block:**
          1. **Identify language** from fence (```js, ```html, ```yaml, etc.)
          2. **Extract code content** (preserve exactly, no modifications)
          3. **Extract context:**
             - Heading above the code
             - Paragraph explaining what the code does
          4. **Apply VS Code Dark+ syntax highlighting:**
             - Reference: illustration-generator.cog.md `create-code-block` action
             - Use documented color schemes per language
             - JavaScript: keywords `#569cd6`, strings `#ce9178`, comments `#6a9955`, etc.
             - HTML: tags `#569cd6`, attributes `#9cdcfe`, values `#ce9178`
             - CSS: selectors `#d7ba7d`, properties `#9cdcfe`, values `#ce9178`
             - YAML: keys `#9cdcfe`, strings `#ce9178`, comments `#6a9955`
             - And all other documented languages
          5. **Generate `.cog.svg`:**
             - Width: 800px (narrower than illustrations)
             - Height: auto-calculated (20px per line + 30px padding)
             - Background: dark `#1e1e1e` (VS Code Dark+ background)
             - Font: 'Courier New', 13px, monospace
             - Complete YAML frontmatter with language, lineCount, syntaxTheme, colorScheme
          6. **Store in code-blocks category:**
             ```
             datalake/assets/images/svg/code-blocks/code-block-chapter-XX-example-N.cog.svg
             ```
          7. **Replace code block in source markdown:**
             ```markdown
             ![Language Example: Description](../../../image-assets/bitmap/code-blocks/code-block-chapter-XX-example-N.png)
             *Code Example X.Y: [What code does + color guide]*
             ```
          **Naming pattern:**
          - `code-block-chapter-02-example-1.cog.svg` (first code block in chapter 2)
          - `code-block-chapter-02-example-2.cog.svg` (second code block in chapter 2)
          - Increment counter per chapter
          **Quality requirements:**
          - Syntax must be correct (code compiles/runs)
          - Colors must match VS Code Dark+ exactly
          - Text must be readable at print size
          - Complete YAML frontmatter required
          **DEPRECATED:** This step is no longer used. Code blocks remain as searchable text in the source markdown. Pandoc's `--syntax-highlighting=pygments` provides colored syntax highlighting directly in the PDF without requiring image conversion.
          **Why deprecated:** Preserving searchability in PDFs is more valuable than perfect color matching. Users can search for code examples, copy-paste code, and maintain source markdown integrity. Pandoc's pygments highlighting provides professional coloring while keeping code as text.
          ### Step 5: Generate illustrations with aspect ratio preservation
          Check the source markdown for image references (markdown syntax: `![...](filename.png)`).
          If image references are found:
          1. **Check if PNG files exist** in `datalake/assets/images/bitmap/`
          2. **Check if PNGs are stale** (SVG modified after PNG):
             ```bash
             # Compare modification times
             [ datalake/assets/images/svg/diagram.svg -nt datalake/assets/images/bitmap/diagram.png ]
             ```
          3. **If any are missing or stale**, run the illustration generator:
             ```bash
             npm run illustrations:generate
             ```
          4. This runs `scripts/generate-illustrations.sh` which converts all `.svg` and `.cog.svg` files
             from `datalake/assets/images/svg/` (including subdirectories) to PNG at 2700px width
          **Why this matters:** Pandoc cannot embed SVGs with CSS properly. PNGs must exist before
          PDF generation. Running `illustrations:generate` ensures all referenced images are available
          with correct aspect ratios preserved.
          **Detection pattern:**
          ```bash
          # Check for image references in markdown
          grep -o '!\[.*\]([^)]*\.png)' "$SOURCE" | sed 's/.*(\(.*\))/\1/'
          ```
          **When to skip:** If all referenced PNGs exist AND are newer than their source SVGs,
          skip generation to save time.
          #### Aspect Ratio Preservation (CRITICAL)
          **The Problem:** Different SVG-to-PNG conversion tools handle aspect ratios differently:
          - **qlmanage** (macOS Quick Look) creates square thumbnails with padding, regardless of source aspect ratio
          - **rsvg-convert** (librsvg) preserves source aspect ratio perfectly
          - **ImageMagick** (magick) preserves source aspect ratio with good quality
          **The Solution:** Tool cascade with aspect-ratio-preserving tools first:
          **Priority Order:**
          1. **rsvg-convert** (primary) — best quality, perfect aspect ratio preservation
             ```bash
             rsvg-convert -w 2700 --keep-aspect-ratio input.svg -o output.png
             ```
          2. **ImageMagick** (fallback) — good quality, preserves aspect ratio
             ```bash
             magick -density 300 -background white input.svg output.png
             ```
          3. **qlmanage** (last resort) — creates squares, adds padding, use only if others unavailable
             ```bash
             qlmanage -t -s 2700 -o output_dir/ input.svg
             ```
             ⚠️ **Warning:** qlmanage will create 2700×2700 square thumbnails even for landscape
             (3:2) or portrait images, adding letterbox padding. This causes clipping in PDFs
             when LaTeX tries to scale the padded square to fit the page.
          **Installation:**
          ```bash
          # macOS (Homebrew)
          brew install librsvg      # Provides rsvg-convert
          brew install imagemagick  # Provides magick
          # Verify installation
          which rsvg-convert   # Should show /opt/homebrew/bin/rsvg-convert
          which magick         # Should show /opt/homebrew/bin/magick
          ```
          **Script Implementation:**
          The `scripts/generate-illustrations.sh` script implements this cascade automatically:
          - Detects available tools at runtime
          - Tries each tool in priority order
          - Reports which tool was used for each conversion
          - Handles both `.svg` and `.cog.svg` extensions correctly
          - Processes all subdirectories recursively
          - Non-interactive (no prompts, safe for automation)
          **CRITICAL: .cog.svg filename handling:**
          The script correctly handles both `.cog.svg` and `.svg` extensions:
          ```bash
          # Correct pattern (from generate-illustrations.sh):
          png_name="${svg_base%.svg}"     # Remove .svg extension first
          png_name="${png_name%.cog}.png" # Remove .cog if present, add .png
          ```
          This ensures:
          - `agent-html-reading.cog.svg` → `agent-html-reading.png` (correct)
          - `diagram-name.svg` → `diagram-name.png` (correct)
          - Never creates `.png.png` or `.svg.png` (bug avoided)
          **Subdirectory Support:**
          Unlike the previous inline script, `generate-illustrations.sh` processes subdirectories
          recursively and automatically:
          - `svg/flowcharts/*.cog.svg` → `bitmap/flowcharts/*.png`
          - `svg/architectures/*.cog.svg` → `bitmap/architectures/*.png`
          - `svg/comparisons/*.cog.svg` → `bitmap/comparisons/*.png`
          - `svg/tools/*.svg` → `bitmap/tools/*.png`
          - Any depth, any category
          **Output Directory Structure:**
          The script mirrors the SVG directory structure in the bitmap directory:
          ```
          datalake/assets/images/
            ├── svg/
            │   ├── flowcharts/
            │   │   ├── agent-decision-flow.cog.svg (900×600)
            │   │   └── implementation-roadmap.cog.svg (900×600)
            │   ├── architectures/
            │   │   └── content-hierarchy.cog.svg (900×600)
            │   └── tools/
            │       └── maxine-logo.svg (500×500)
            └── bitmap/
                ├── flowcharts/
                │   ├── agent-decision-flow.png (2700×1800) ✓ 3:2 preserved
                │   └── implementation-roadmap.png (2700×1800) ✓ 3:2 preserved
                ├── architectures/
                │   └── content-hierarchy.png (2700×1800) ✓ 3:2 preserved
                └── tools/
                    └── maxine-logo.png (2700×2700) ✓ 1:1 preserved
          ```
          **Troubleshooting:**
          1. **Images clipping in PDF despite correct PNG dimensions:**
             - Check LaTeX `\pandocbounded` macro in metadata.yaml
             - Adjust width/height constraints (e.g., `0.95\linewidth`, `0.65\textheight`)
             - Ensure both width AND height constraints are appropriate for aspect ratio
          2. **Square thumbnails when source SVG is landscape:**
             - qlmanage was used (last resort tool)
             - Install rsvg-convert: `brew install librsvg`
             - Regenerate: `npm run illustrations:generate`
             - Verify: `file bitmap/diagram.png` should show correct aspect ratio
          3. **Stale PNGs not regenerating:**
             - Script only converts on-demand (doesn't check timestamps by default)
             - Force regeneration: delete PNGs and rerun
             - Or: add timestamp checking to the script (future enhancement)
          4. **"All tools failed" for specific SVG:**
             - Check SVG syntax with `xmllint --noout diagram.svg`
             - Look for unescaped XML entities (use `&amp;` not `&`)
             - Try manual conversion to identify specific error
             - Example fix: `sed -i '' 's/Trial & error/Trial \&amp; error/g' diagram.svg`
          **Note:** This step is automatic and invisible to the user unless it runs. Report in Step 9
          if illustrations were generated, which tool was used, and how many files were converted.
          ### Step 6: Clean emojis directly in source files
          **CRITICAL:** Fix emojis directly in source markdown files. Never create
          intermediate `-print.md` files. Git-first: commit source before fixing if
          not already committed.
          **Detection:**
          ```bash
          # Find all emojis in source files
          grep -n "[💰🎯✅❌⚠️🔴🟡🔵🚨💡📧🌐📄💼📊🔧⭐📝🏆📈🎨🔒🌟🤝🌍🛡️🏗️🎵🔗🔍🤖]" source-files...
          ```
          **Replacement table** — markdown convention equivalents, not just removal:
          | Emoji | Replacement | Category | Context |
          | ----- | ----------- | -------- | ------- |
          | ✅    | **Done**    | Status   | Task completion |
          | ❌    | **Failed**  | Status   | Error/rejection |
          | ✅    | ✓           | Marks    | Correct/apply this |
          | ❌    | ✗           | Marks    | Incorrect/skip this |
          | ⚠️ ⚠  | **Warning** | Status   | Caution needed |
          | 🔴    | **Red**     | Status   | Blocked/stopped |
          | 🟡    | **Amber**   | Status   | Partial/warning |
          | 🔵    | **Blue**    | Status   | Info/in progress |
          | 🚨    | **Alert:**  | Prefix   | Urgent notice |
          | 💡    | **Tip:**    | Prefix   | Helpful hint |
          | 🎯💰🔍🤖📧🌐📄💼📊🔧⭐📝🏆📈🎨🔒🌟🤝🌍🛡️🏗️🎵🔗 | (remove) | Decorative | No semantic value |
          **Workflow:**
          1. **Check for emojis** in all source files (single file or multi-file compilation)
          2. **If found and uncommitted:** Commit source first (`git commit -m "docs: pre-PDF emoji cleanup"`)
          3. **Fix directly** using Edit tool with context-appropriate replacements:
             - Status contexts (✅ in "✅ Task complete") → **Done**
             - List markers (✅ in "- ✅ Apply this rule") → ✓
             - Decorative emojis (🎯💰📊 in headings) → remove entirely
          4. **Verify** with grep that no emojis remain
          5. **Commit fixes** (`git commit -m "fix: remove emojis from source markdown"`)
          **Why source, not intermediate:**
          - Emojis break LaTeX rendering (xelatex font warnings)
          - Source markdown is canonical — keep it LaTeX-compatible
          - No -print.md proliferation — git is the backup system
          - Single source of truth for both web and print
          **For multi-file compilations:**
          Process ALL source files, not just the first. Check every chapter/section
          file that will be included in the final PDF.
          ### Step 6.5: Clean invisible Unicode characters
          **Purpose:** Remove invisible Unicode characters that cause LaTeX font warnings.
          **Detection:**
          ```bash
          # Check for zero-width spaces and other invisible characters
          grep -P '[\x{200B}\x{200C}\x{200D}\x{FEFF}]' source-file.md
          # Or use hexdump to find them
          hexdump -C source-file.md | grep -E "e2 80 (8b|8c|8d)|ef bb bf"
          ```
          **Common invisible characters:**
          | Character | Unicode | Name | Cause |
          | --------- | ------- | ---- | ----- |
          | ​ | U+200B | Zero Width Space | Copy-paste from web |
          | ‌ | U+200C | Zero Width Non-Joiner | Copy-paste from web |
          | ‍ | U+200D | Zero Width Joiner | Copy-paste from web |
          |  | U+FEFF | Byte Order Mark | File encoding artifacts |
          **Removal:**
          ```bash
          # Remove all invisible Unicode from source files
          sed -i '' $'s/\u200b//g' source-file.md
          sed -i '' $'s/\u200c//g' source-file.md
          sed -i '' $'s/\u200d//g' source-file.md
          sed -i '' $'s/\ufeff//g' source-file.md
          ```
          **Why this matters:** These characters are invisible to humans but cause
          `[WARNING] Missing character: There is no ​ (U+200B)` errors in xelatex.
          They typically enter files through copy-paste from web pages.
          ### Step 7: Choose output format
          If the user specifies a format, use it. Otherwise default to A4.
          **A4 (default):**
          ```bash
          pandoc "$SOURCE_FILES" -o "$OUTPUT_PDF" \
            -f markdown-task_lists \
            --pdf-engine=xelatex --syntax-highlighting=idiomatic --toc --toc-depth=2 \
            -V geometry:margin=1in -V fontsize=11pt \
            -V documentclass=book -V papersize=a4 -V linkcolor=blue \
            -V header-includes='\usepackage{graphicx}\setkeys{Gin}{width=\textwidth,height=\textheight,keepaspectratio}' \
            -V header-includes='\usepackage{fancyhdr}' \
            --metadata title="$TITLE" --metadata author="$AUTHOR" \
            --metadata date="$DATE"
          ```
          **Kindle (6x9 inch):**
          ```bash
          pandoc "$SOURCE_FILES" -o "$OUTPUT_PDF" \
            -f markdown-task_lists \
            --pdf-engine=xelatex --syntax-highlighting=idiomatic --toc --toc-depth=2 \
            -V geometry:paperwidth=6in -V geometry:paperheight=9in \
            -V geometry:inner=0.625in -V geometry:outer=0.5in \
            -V geometry:top=0.625in -V geometry:bottom=0.625in \
            -V fontsize=11pt -V documentclass=book \
            -V classoption=openright -V linkcolor=black \
            -V header-includes='\usepackage{graphicx}\setkeys{Gin}{width=\textwidth,height=\textheight,keepaspectratio}' \
            --metadata title="$TITLE" --metadata author="$AUTHOR"
          ```
          **Task list handling:**
          The `-f markdown-task_lists` flag disables pandoc's task list extension.
          Without this, markdown `- [ ]` items get converted to Unicode checkbox
          characters (☐ U+2610) which cause LaTeX font warnings:
          ```
          [WARNING] Missing character: There is no ☐ (U+2610) in font [lmroman10-regular]
          ```
          Disabling the extension keeps `- [ ]` as literal text, which renders cleanly.
          Both formats include:
          - `--syntax-highlighting=idiomatic` for professional code block rendering
          - `--toc --toc-depth=2` for table of contents
          - `-V documentclass=book` for book-quality layout
          - Auto-scaled images (`graphicx` with `keepaspectratio`) to prevent clipping
          - Fancy headers with "Review Copy not for publication/distribution" footer
          **Image scaling:** The `graphicx` package with `\setkeys{Gin}{...}` ensures all images
          automatically scale to fit within text width/height while maintaining aspect ratio.
          This prevents wide images (e.g., 2700px timelines) from being clipped at page margins.
          **Code highlighting:** The `--syntax-highlighting=idiomatic` provides consistent syntax
          highlighting across all code blocks (bash, python, javascript, etc.) using
          pandoc's built-in colorization engine.
          **Resource paths for multi-file compilations:** When compiling books from multiple
          chapter files with images referenced using relative paths (`../../../image-assets/...`),
          use `--resource-path` with multiple directories:
          ```bash
          --resource-path=.:datalake/manuscripts/mx-books/shared:datalake/manuscripts/mx-books/mx-handbook/chapters:datalake
          ```
          This allows pandoc to resolve images from:
          - Current directory (`.`)
          - Shared content directory (for chapter-specific images)
          - Chapters directory (for local references)
          - Datalake root (for `image-assets/...` paths)
          Images must exist at their referenced paths before PDF generation or pandoc will emit
          warnings and replace them with alt text descriptions.
          ### Step 7.5: Configure professional table formatting
          **Purpose:** Enhance markdown tables with professional styling, alternating row colors, and proper handling of tables that span multiple pages.
          **LaTeX packages required:**
          Add to metadata.yaml `header-includes`:
          ```yaml
          \usepackage{longtable}     # Tables spanning multiple pages
          \usepackage{booktabs}      # Professional horizontal rules
          \usepackage{array}         # Enhanced column definitions
          \usepackage{colortbl}      # Row color alternation
          ```
          **Color definitions:**
          ```yaml
          \definecolor{tableheader}{HTML}{D9DEE4}
          \definecolor{tableodd}{HTML}{FFFFFF}
          \definecolor{tableeven}{HTML}{EEF0F3}
          ```
          **Header row coloring and alternating rows with smaller font:**
          ```yaml
          \let\oldtoprule\toprule
          \renewcommand{\toprule}{\oldtoprule\rowcolor{tableheader}}
          \let\oldlongtable\longtable
          \let\endoldlongtable\endlongtable
          \renewenvironment{longtable}{\small\rowcolors{2}{tableodd}{tableeven}\oldlongtable}{\endoldlongtable}
          ```
          **Pandoc flag for caption positioning:**
          ```bash
          --table-caption-position=above
          ```
          **Benefits:**
          - **Professional appearance:** booktabs provides publication-quality horizontal rules
          - **Better readability:** alternating row colors help eyes track across columns
          - **Automatic page breaks:** longtable handles tables that span multiple pages
          - **Consistent styling:** all tables follow the same visual language
          - **No additional work:** works automatically with standard markdown tables
          **Example markdown table:**
          ```markdown
          | Business Type | Failure Pattern | Lost Revenue |
          | ------------- | --------------- | ------------ |
          | Tour Operator | Paginated itinerary | £2,000 per booking |
          | E-commerce    | Toast notification  | £150 per sale |
          ```
          This renders with:
          - Distinct gray header row (`#D9DEE4`)
          - Visible white/gray alternating data rows (`#FFFFFF` / `#EEF0F3`)
          - Slightly smaller font (`\small` — ~10pt when body is 11pt) for better column fit
          - Professional top/middle/bottom rules (booktabs)
          - Caption above table (academic standard)
          - Automatic column width distribution
          ### Step 7.6: Control page breaks and typography
          **Purpose:** Prevent widows, orphans, and awkward page breaks that split paragraphs, tables, or code blocks from their context.
          **LaTeX settings required:**
          Add to metadata.yaml `header-includes`:
          ```yaml
          \usepackage{needspace}           # Intelligent space checking
          \widowpenalty=10000              # Prevent widows (last line alone at top of page)
          \clubpenalty=10000               # Prevent orphans (first line alone at bottom of page)
          \displaywidowpenalty=10000       # Prevent widows before display environments
          \brokenpenalty=4000              # Discourage page breaks after hyphenated lines
          \predisplaypenalty=10000         # Prevent page breaks just before code/display blocks
          \raggedbottom                    # Allow flexible page bottom spacing
          ```
          **What these settings do:**
          1. **Widow prevention (`\widowpenalty=10000`):**
             - Prevents single lines of a paragraph appearing alone at the top of a page
             - LaTeX will try very hard (penalty 10000) to avoid this layout
             - Example: A paragraph's last line won't be orphaned on the next page
          2. **Orphan/Club prevention (`\clubpenalty=10000`):**
             - Prevents single lines of a paragraph appearing alone at the bottom of a page
             - Keeps at least 2 lines together when paragraphs break across pages
             - Example: A paragraph's first line won't be orphaned at page bottom
          3. **Display widow prevention (`\displaywidowpenalty=10000`):**
             - Prevents a single line of text before a display environment (code block, table)
             - Ensures at least two lines of prose precede any display element at page bottom
          5. **Hyphenation break prevention (`\brokenpenalty=4000`):**
             - Discourages page breaks immediately after a hyphenated line
             - Prevents hyphen-then-page-break which disrupts reading flow
          6. **Pre-display penalty (`\predisplaypenalty=10000`):**
             - Prevents page breaks just before code blocks, tables, or display environments
             - Keeps introductory text on the same page as the content it introduces
          7. **Flexible page bottoms (`\raggedbottom`):**
             - Allows pages to end at different vertical positions
             - Prevents LaTeX from stretching whitespace to fill pages
             - Works with all penalties above by giving LaTeX flexibility
          8. **Intelligent spacing (`needspace` package):**
             - Checks available space before placing tables or code blocks
             - Moves content to next page if insufficient space
             - Prevents tables/code from starting on one page and continuing on next
          **Using needspace with tables:**
          ```markdown
          The following table shows revenue loss patterns:
          \needspace{5\baselineskip}
          | Business Type | Lost Revenue |
          | ------------- | ------------ |
          | Tour Operator | £2,000 per booking |
          ```
          The `\needspace{5\baselineskip}` command checks for 5 lines of available space. If less than 5 lines remain on the current page, the table moves to the next page.
          **Using needspace with code blocks:**
          ```markdown
          Here's the implementation:
          \needspace{7\baselineskip}
          ```bash
          npm run illustrations:generate
          ```
          ```
          This keeps the heading ("Here's the implementation:") with the first ~5 lines of code.
          **How much space to request:**
          - **Small tables (3-5 rows):** `\needspace{5\baselineskip}`
          - **Medium tables (6-10 rows):** `\needspace{10\baselineskip}`
          - **Code blocks:** `\needspace{7\baselineskip}` (heading + 5 lines of code)
          - **Large content:** Use `longtable` or `samepage` environment instead
          **Scope:**
          These settings are **universal** — apply to all book metadata.yaml files (Handbook, Protocols, case studies). They establish consistent typography standards across all MX publications.
          **Trade-offs:**
          - **Pro:** Professional typography, no awkward widows/orphans, context preserved
          - **Pro:** Readers never see single orphaned lines or split context
          - **Con:** May create slightly uneven page bottoms (acceptable with `\raggedbottom`)
          - **Con:** Some pages may have extra whitespace to preserve paragraph/table integrity
          **Note:** These are penalty settings, not absolute rules. LaTeX will still break pages if there's no other option (e.g., a 20-line paragraph must break somewhere). The high penalty (10000) means LaTeX tries very hard to avoid it.
          ### Step 8: Extract metadata
          Read the YAML frontmatter for title, author, date/created fields.
          Pass these to pandoc as `--metadata` flags. If fields are missing,
          use sensible defaults (filename as title, "Tom Cranstoun" as author,
          today's date).
          ### Step 9: Report
          After generation, report:
          - Input file path(s) and size
          - ASCII diagrams reinterpreted (if any)
          - Code blocks converted to SVG (if any)
          - Emoji fixes applied (if any)
          - Illustrations generated (if any)
          - **Output PDF full absolute path** and size (e.g., `/Users/.../mx-outputs/pdf/books/handbook/mx-handbook.pdf`)
          - Format used (A4 or Kindle)
          - Engine used (bash or Node)
          - Any warnings (missing images, missing metadata fields)
          **MX Principle:** Always list full absolute paths for all outputs created.
          This enables traceability and makes it easy to locate generated files.
        inputs:
          - name: source
            type: file
            required: true
            description: "Path to the markdown file to convert"
          - name: format
            type: string
            required: false
            description: "Output format: 'a4' (default) or 'kindle'"
          - name: output
            type: file
            required: false
            description: "Custom output path. Defaults to outputs/ or same directory as source."
        outputs:
          - name: pdf
            type: file
            description: "The generated PDF file"
      - name: check-emojis
        description: "Detect emojis in source files and report what would be replaced (dry-run mode)."
        usage: |
          ## CHECK-EMOJIS — Emoji Detection Report
          Use this action when you want to see what emojis exist in source files
          and what they would be replaced with, without modifying any files.
          ### Step 1: Identify the source file(s)
          Same inference logic as the `generate` action. Works with single files
          or multi-file compilations.
          ### Step 2: Scan for emojis
          ```bash
          grep -n "[💰🎯✅❌⚠️🔴🟡🔵🚨💡📧🌐📄💼📊🔧⭐📝🏆📈🎨🔒🌟🤝🌍🛡️🏗️🎵🔗🔍🤖]" source-files...
          ```
          ### Step 3: Report findings
          For each emoji found, show:
          - File path and line number
          - Current line content with emoji highlighted
          - Proposed replacement from the emoji table
          - Context category (status/marks/decorative)
          **Example output:**
          ```
          Emoji Detection Report
          =====================
          chapter-00-introduction-to-mx.md:107
            Current:  **💰 FINANCIAL SNAPSHOT FOR EXECUTIVES**
            Replace:  **FINANCIAL SNAPSHOT FOR EXECUTIVES**
            Category: Decorative (remove)
          chapter-09-anti-patterns.md:1110
            Current:  - ✅ All cross-document references
            Replace:  - ✓ All cross-document references
            Category: Marks (correct/apply)
          Total: 5 emojis found in 2 files
          Run 'generate' action to fix emojis and create PDF.
          ```
        inputs:
          - name: source
            type: file
            required: true
            description: "Path to markdown file(s) to check"
        outputs:
          - name: report
            type: text
            description: "Emoji detection report with proposed replacements"
      - name: diagram-workflow
        description: "Create SVG diagrams, convert to PNG, and integrate into PDF publishing pipeline."
        usage: |
          ## DIAGRAM-WORKFLOW — SVG to PDF Integration
          This action covers the complete workflow for adding diagrams to book chapters.
          ### Step 1: Create SVG diagram
          **Location and naming:**
          Illustrations are organized by visual type in category subdirectories:
          ```
          datalake/assets/images/svg/{category}/generic-name.cog.svg
          ```
          **Categories:**
          - `timelines/` — Sequential events, competitive positioning, roadmaps
          - `comparisons/` — Split-view contrasts, before/after scenarios
          - `flowcharts/` — Process flows, decision trees, workflows
          - `architectures/` — System diagrams, technical architecture
          **Naming convention:**
          - Generic, reusable names (NOT chapter-specific)
          - Examples: `first-mover-advantage-timeline.cog.svg`, `human-vs-agent-comparison.cog.svg`
          - Use `.cog.svg` extension to indicate MX-enhanced SVG with YAML frontmatter
          For generated/programmatic diagrams from code:
          ```
          datalake/assets/images/svg/generated/<SOURCE-DOC>/diagram-name.svg
          ```
          **Metadata structure:**
          All `.cog.svg` files include YAML frontmatter with inheritance from the canonical style guide:
          ```xml
          <?xml version="1.0" encoding="UTF-8"?>
          <!--
          ---
          name: first-mover-advantage-timeline
          version: "1.0.0"
          title: "First-Mover Advantage Timeline"
          description: "Visual representation of competitive positioning..."
          created: 2026-02-17
          modified: 2026-02-17
          author: Maxine (AI-generated)
          license: MIT
          status: published
          category: illustration
          partOf: mx-illustrations
          inherits: book-svg-style
          purpose: "Business case visualization for competitive timing decisions"
          refersTo: [chapter-00-introduction-to-mx, competitive-analysis]
          visualType: timeline
          concept: first-mover-advantage
          audience: business
          usedIn:
            - book: mx-protocols
              chapters: [chapter-00]
              context: "Illustrates competitive positioning section"
          tags: [timeline, business-case, competitive-advantage]
          mx:
            contentType: illustration-cog
            discoverable: true
            reusable: true
          ---
          -->
          <svg width="900" height="600" viewBox="0 0 900 600">
            <title>First-Mover Advantage Timeline</title>
            <desc>Visual representation of competitive positioning...</desc>
            <!-- SVG content -->
          </svg>
          ```
          **Key metadata fields:**
          - `inherits: book-svg-style` — Inherits all requirements from canonical guide
          - `visualType` — timeline, comparison, flowchart, architecture
          - `concept` — The idea being illustrated
          - `usedIn` — Bidirectional tracking of book/chapter usage
          - Native SVG elements: `<title>`, `<desc>` for accessibility
          **Canonical requirements:**
          All illustrations inherit technical specifications from:
          ```
          datalake/assets/configs/books/rules/book-svg-style.md
          ```
          This guide defines:
          - ViewBox dimensions (800×500 or 900×600)
          - Background color (#ffffff white, MANDATORY)
          - Font families (system-ui, Georgia)
          - Visual style rules
          - Content approach patterns
          **Technical specifications (MUST follow):**
          - Viewbox: 800×500 or 900×600 (consistent within book)
          - Background: `#ffffff` (white) — MANDATORY for all illustrations
          - Font family: system-ui, sans-serif (or Georgia for titles)
          - Export format: SVG with embedded styles
          - CSS styling: Use embedded `<style>` tags with classes for colors
          **Visual style rules:**
          - Clean, professional appearance (no decoration)
          - Colour coding: green = working/good, amber/red = broken/problem
          - Dashed borders for failure states, solid for success
          - Clear labels and annotations
          - Every visual element serves a purpose
          **Content patterns that work:**
          - Split-view comparisons (human vs agent, before vs after)
          - Flow diagrams for processes
          - Side-by-side contrasts
          - Timeline visualizations
          ### Step 2: Convert SVG → PNG
          **CRITICAL:** PDFs cannot embed SVGs with CSS properly. You MUST convert to PNG first.
          Run this before PDF generation:
          ```bash
          npm run illustrations:generate
          ```
          This script:
          1. Uses `qlmanage` (macOS) for proper CSS rendering at 2700px width
          2. Falls back to ImageMagick if qlmanage unavailable
          3. Generates PNGs to: `datalake/assets/images/bitmap/`
          4. Preserves category subdirectory structure and converts to PNG:
             - `timelines/first-mover-advantage-timeline.cog.svg` → `timelines/first-mover-advantage-timeline.png`
             - The `.cog` suffix is dropped in PNG output
          **Why PNG instead of direct SVG embedding?**
          While pandoc theoretically supports SVG images, the PNG workflow is strongly preferred because:
          1. **YAML frontmatter breaks LaTeX:** `.cog.svg` files contain YAML frontmatter in XML comments
             using `===` delimiters. When pandoc passes SVGs to xelatex, the LaTeX parser sees the
             `<!--` comment syntax and throws "Double hyphen within comment" XML parsing errors.
             Even with correct delimiters, the presence of complex metadata confuses the PDF engine.
          2. **CSS rendering reliability:** SVG files using `<style>` tags with CSS classes render
             inconsistently in LaTeX. Colors, fonts, and layouts that work perfectly in browsers
             often break or render incorrectly when embedded in PDFs via pandoc's SVG support.
          3. **Build process simplicity:** Converting to PNG first creates a clean separation:
             - Design stage: Create rich `.cog.svg` with full metadata, CSS, and semantic markup
             - Build stage: Flatten to PNG bitmap that's guaranteed to render identically everywhere
             - No surprises in the PDF output, no need to debug LaTeX/SVG interaction issues
          4. **Print quality guarantee:** PNGs at 2700px width provide excellent print resolution
             while avoiding all the edge cases and compatibility issues of SVG-in-PDF workflows.
          **Bottom line:** PNG workflow is not a limitation, it's a deliberate architectural choice
          that prioritizes reliability and consistency over theoretical format purity.
          **Why qlmanage?** ImageMagick has limited CSS support and may render CSS-styled
          SVG elements incorrectly. qlmanage uses WebKit rendering engine for accurate output.
          **Verify output:** Always check the PNG matches the SVG rendering in a browser.
          If colors/styles are wrong, qlmanage failed and you got ImageMagick fallback.
          ### Step 3: Reference in markdown
          In your chapter markdown file, use **relative filename with category subdirectory**:
          ```markdown
          ![Caption describing the diagram](timelines/first-mover-advantage-timeline.png)
          ```
          Or for simple references without subdirectory (backward compatible):
          ```markdown
          ![Caption describing the diagram](chapter-00-agent-journey.png)
          ```
          **Path handling:** Pandoc's `--resource-path` searches both flat and subdirectory structures automatically.
          The PDF generation commands include:
          ```bash
          --resource-path=datalake/manuscripts/mx-books/shared:datalake/manuscripts/mx-books/mx-protocols/protocols:datalake/assets/images/bitmap/book-illustrations
          ```
          This tells Pandoc to search the shared content directory (for chapter-00 SVGs),
          the chapter directory, AND the bitmap illustrations directory for images.
          ### Step 4: Generate PDF with diagrams
          For full book with diagrams:
          ```bash
          npm run pdf:protocols-all
          ```
          This runs:
          1. `npm run illustrations:generate` (SVG → PNG conversion)
          2. `npm run pdf:protocols-html` (HTML preview)
          3. `npm run pdf:protocols-kindle` (Kindle 6×9 PDF)
          4. `npm run pdf:protocols-generate` (A4 PDF with XeLaTeX)
          5. `npm run pdf:appendix` (Appendix HTML generation)
          For single chapter testing:
          ```bash
          npm run illustrations:generate
          npm run pdf:chapter00-simple
          ```
          ### Step 5: Verify diagram rendering
          Check the generated PDF:
          - Images appear at correct size (not distorted)
          - Colors render accurately
          - Text is readable (not blurry)
          - Captions are present and formatted correctly
          If images are missing:
          - Verify PNG exists in `datalake/assets/images/bitmap/`
          - Check filename matches exactly (case-sensitive)
          - Ensure `npm run illustrations:generate` ran successfully
          If images are blurry/low-quality:
          - SVG might lack proper viewBox
          - qlmanage might have failed (check for ImageMagick warnings)
          - Re-export SVG with correct dimensions
          ### Common Issues
          **Issue:** "Image not found" in PDF
          **Fix:** Image filename in markdown must match PNG filename exactly (case-sensitive).
          Include category subdirectory if using new structure (e.g., `timelines/diagram-name.png`)
          **Issue:** Colors wrong in PNG
          **Fix:** qlmanage failed, ImageMagick doesn't support CSS. Simplify SVG to use
          inline styles (`style="fill:#ff0000"`) instead of CSS classes.
          **Issue:** Text missing in PNG
          **Fix:** SVG uses web fonts not available during conversion. Use system-ui,
          sans-serif, or Georgia (guaranteed available on macOS).
          **Issue:** Diagram too large/small in PDF
          **Fix:** Use consistent viewBox (800×500 or 900×600). Pandoc scales automatically.
        inputs:
          - name: svg-file
            type: file
            required: true
            description: "Path to SVG diagram to convert"
          - name: chapter
            type: string
            required: true
            description: "Chapter number (e.g., '00', '01') for filename convention"
        outputs:
          - name: png-file
            type: file
            description: "Converted PNG at datalake/assets/images/bitmap/"
      - name: free-book
        description: "Assemble the MX free book sampler from preface, chapter-00, and kickoff PDFs."
        usage: |
          ## FREE-BOOK — Free Book Assembly

          Delegates to `gen-free-book` cog to merge pre-existing PDFs into a
          single free book sampler.

          ### Execution

          ```bash
          npm run pdf:free-book
          # or directly:
          bash scripts/gen-free-book.sh
          ```

          ### Components (in order)

          1. **Preface** (includes acknowledgements) — generated from markdown
          2. **MX: The Introduction** — pre-built PDF
          3. **The AI Tipping Point — CMS Kickoff 2024** — external PDF

          ### Output

          `mx-outputs/pdf/books/free-book/mx-free-book.pdf`

          See `scripts/cogs/gen-free-book.cog.md` for full details.
        outputs:
          - name: pdf
            type: file
            description: "The merged free book PDF at mx-outputs/pdf/books/free-book/mx-free-book.pdf"
  mx:
    contentType: action-doc
    runbook: "mx exec pdf-generator"
---

# The PDF Generator

Professional PDFs from markdown with professional table formatting, improved ASCII diagram rendering, syntax-highlighted code blocks, emoji cleanup, invisible Unicode removal, and automatic illustration generation in A4 or Kindle format.

## What This Does

Takes any markdown file and produces a clean, professional PDF suitable for client delivery, book chapters, or review copies. The complete pipeline:

1. **Infers source file** — from explicit path, IDE context, or repository search
2. **Chooses engine** — detects ASCII diagrams and picks Node or bash engine
3. **Improves ASCII rendering** — wraps diagrams in samepage environment to prevent page breaks while preserving searchability
4. **Deprecated: Code block SVG conversion** — no longer used; pandoc's pygments provides colored, searchable code
5. **Auto-generates illustrations** — converts all SVG to PNG at print quality (2700px)
6. **Fixes emojis in source** — replaces emojis directly in markdown files with textual equivalents
6.5. **Cleans invisible Unicode** — removes zero-width spaces (U+200B) and other invisible characters that cause LaTeX warnings
7. **Chooses format** — A4 (default) or Kindle 6×9 with appropriate margins
7.5. **Configures table formatting** — alternating row colors, booktabs rules, multi-page support, captions above
7.6. **Disables task list extension** — prevents `- [ ]` from becoming Unicode checkboxes
8. **Extracts metadata** — reads YAML frontmatter for title, author, date
9. **Generates PDF** — using pandoc + xelatex with book-quality formatting and auto-scaled images

Three engines, one cog:

- **SVG conversion** (`npm run illustrations:generate`) — converts SVG to PNG with proper CSS rendering
- **Bash engine** (`mx-pdf.sh`) — handles text-only documents (default)
- **Node engine** (`generate-document-pdf.js`) — legacy engine for advanced ASCII processing

## Why This Exists

PDF generation was spread across npm scripts, bash scripts, and a Node script with no unified entry point. This cog provides a single action-doc that any AI agent can read and execute. The instructions are the program. You are the runtime.

The emoji problem is real: xelatex cannot render emoji characters, causing font warnings and missing glyphs. This cog fixes emojis directly in source markdown files using context-appropriate textual equivalents — **Done** for status emojis, ✓ for list markers, removal for decorative emojis. No intermediate files created. Source markdown remains LaTeX-compatible.

## Git-First Workflow

This cog enforces a git-first workflow:

- **Commit before fixing emojis.** If source files have uncommitted changes, commit first. Emoji fixes are source amendments.
- **Fix source directly.** Never create `-print.md`, `-copy.md`, or `-backup.md` files. Fix emojis in place. Git is the recovery mechanism.
- **No intermediate files.** Source markdown is canonical. Keep it LaTeX-compatible by removing emojis permanently.
- **No appended docs.** Don't create extra documentation files about the generation. The cog itself documents the process.

## For AI Agents

1. Read this cog's `execute.actions.generate` block for the full procedure
2. Pick the right engine based on ASCII diagram detection (Step 2)
3. **Improve ASCII diagram rendering** — wrap diagrams in `\begin{samepage}...\end{samepage}` to prevent page breaks (Step 3)
4. **DEPRECATED: Code block SVG conversion** — Step 4 is no longer used; pandoc's `--syntax-highlighting` handles syntax highlighting
5. Auto-generate illustrations if markdown references images — converts SVG to PNG (Step 5)
6. **Fix emojis directly in source files** — use replacement table with context-appropriate equivalents (Step 6)
7. **Clean invisible Unicode** — remove U+200B, U+200C, U+200D, U+FEFF characters (Step 6.5)
8. **Use `-f markdown-task_lists`** — disable task list extension to prevent checkbox Unicode warnings
9. Never create -print.md or intermediate files — source is canonical
10. Choose output format — default to A4 unless user specifies Kindle (Step 7)
11. Extract metadata from YAML frontmatter (Step 8)
12. Include image auto-scaling and code syntax highlighting in pandoc commands (`--syntax-highlighting=pygments`)
13. **Report full absolute paths for all outputs** — enables traceability (MX principle, Step 9)
14. Report transformation counts: ASCII diagrams improved, emojis fixed, illustrations generated
15. Warn but proceed if `mx.generate` is missing from the source frontmatter

## Dependencies

| Tool | Required | Install |
| ---- | -------- | ------- |
| pandoc | Yes | `brew install pandoc` |
| xelatex | Yes | `brew install --cask mactex-no-gui` |
| perl | Yes | Pre-installed on macOS |
| node | For diagrams only | `brew install node` |

## Related

- `scripts/mx-pdf.sh` — the bash engine this cog wraps
- `scripts/generate-document-pdf.js` — the Node engine for diagram-heavy documents
- `datalake/assets/configs/books/protocols/metadata.yaml` — full book configuration (covers, fancy headers)
- `.claude/skills/mx-c-pdf-generator/skill.md` — the Claude Code skill entry point

---

*"The document is the program. The PDF is the proof."*
