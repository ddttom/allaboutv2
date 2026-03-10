---
version: "1.0"
description: "ADR #4: PNG conversion workflow for PDF generation — deliberate architectural choice prioritizing reliability over format purity."
created: 2026-02-18
modified: 2026-03-02
author: Tom Cranstoun and Maxine

mx:
  status: accepted
  category: architecture
  partOf: mx-maxine-lives
  tags: [adr, pdf-generation, svg, png, illustration-pipeline, latex, build-system]
  audience: [tech, tech]

  adr:
    number: 4
    title: "PNG Conversion Workflow for PDF Generation"
    status: accepted
    date: 2026-02-18
    context: "MX uses .cog.svg files with YAML frontmatter for illustrations. While pandoc theoretically supports direct SVG embedding in PDFs, this causes XML parsing errors in LaTeX when YAML metadata is present in SVG comments, and produces inconsistent CSS rendering."
    decision: "Convert all SVG illustrations to PNG at 2700px width before PDF generation. Use qlmanage (macOS WebKit rendering) for accurate CSS rendering. Treat PNG workflow as deliberate architecture, not limitation."
    consequences: "Clean separation between design (rich .cog.svg with metahub-content/CSS) and build (flattened PNG bitmap). Guaranteed consistent rendering across all PDF outputs. Eliminates LaTeX/SVG interaction edge cases. Print quality maintained at 2700px resolution. Future-proofs against xelatex parsing changes."

  buildsOn: [pdf-generator, illustration-generator, adr-01-block-architecture]
---

# PNG Conversion Workflow for PDF Generation

## Context

MX OS uses `.cog.svg` files as the canonical format for illustrations across all publications (handbook, protocols, presentations). These SVG files include:

- **YAML frontmatter** in XML comments (`=== ... ===` delimiters)
- **CSS styling** via embedded `<style>` tags with classes
- **Semantic metadata** (name, version, visualType, concept, usedIn, etc.)
- **Accessibility elements** (title, desc)

During handbook PDF generation (February 2026), we encountered critical issues when attempting to embed `.cog.svg` files directly in PDFs via pandoc + xelatex:

### Issue 1: XML Parsing Errors

LaTeX's XML parser throws "Double hyphen within comment" errors when processing SVG comments containing complex metadata. Even with correct `===` delimiters (avoiding `---` double-hyphens), the presence of multi-line YAML frontmatter confuses the PDF engine.

**Error example:**

```
error on line 3 at column 1: Double hyphen within comment: <!--
```

### Issue 2: CSS Rendering Inconsistency

SVG files using `<style>` tags with CSS classes render perfectly in web browsers but break or render incorrectly when embedded in PDFs. Colors, fonts, and layouts that work in Chrome/Safari fail unpredictably in xelatex's SVG processing pipeline.

### Issue 3: Build Complexity

Direct SVG embedding requires debugging LaTeX/SVG interaction issues, managing different rendering engines' quirks, and maintaining fallback paths when SVG features aren't supported.

## Decision

**We adopt PNG conversion as the canonical workflow for PDF generation.**

### The Pipeline

1. **Design stage:** Create rich `.cog.svg` files with complete YAML frontmatter, CSS styling, and semantic markup
2. **Build stage:** Convert to PNG bitmaps at 2700px width using qlmanage (macOS WebKit rendering engine)
3. **PDF generation:** Embed PNG files via pandoc with auto-scaling (graphicx package)

### Implementation

**Script:** `npm run illustrations:generate`

- Recursively converts all `.svg` and `.cog.svg` files from `datalake/assets/images/svg/{category}/`
- Uses qlmanage for proper CSS rendering (WebKit engine)
- Falls back to ImageMagick if qlmanage unavailable
- Outputs to `datalake/assets/images/bitmap/{category}/` preserving directory structure
- Drops `.cog` suffix in PNG output: `name.cog.svg` → `name.png`

**Pandoc configuration:**

```latex
\usepackage{graphicx}
\setkeys{Gin}{width=\textwidth,height=\textheight,keepaspectratio}
```

This ensures all images auto-scale to fit within page margins while maintaining aspect ratio.

### Why qlmanage?

ImageMagick has limited CSS support and renders CSS-styled SVG elements incorrectly. qlmanage uses the WebKit rendering engine (same as Safari), guaranteeing that PNGs match browser rendering exactly.

## Rationale

This is **not a workaround** — it's a deliberate architectural choice with four key advantages:

### 1. YAML Frontmatter Compatibility

`.cog.svg` files are self-describing documents with machine-readable metadata. LaTeX's XML parser was never designed to handle rich YAML frontmatter in SVG comments. PNG conversion separates concerns: metadata stays in source SVG (for version control, discovery, reuse), rendering uses clean bitmaps (for reliable output).

### 2. CSS Rendering Reliability

Web rendering (CSS classes, embedded styles) and PDF rendering (LaTeX graphics) are fundamentally different pipelines. Converting to PNG first guarantees identical output everywhere — browser, PDF, print. No surprises, no rendering edge cases.

### 3. Build Process Simplicity

The pipeline is straightforward:

- **Source:** `.cog.svg` (version controlled, semantic, reusable)
- **Build artifact:** `.png` (flattened, render-ready, predictable)
- **Integration:** Standard image embedding (no special LaTeX configuration)

No debugging of LaTeX/SVG interaction. No conditional rendering logic. No engine-specific workarounds.

### 4. Print Quality Guarantee

PNGs at 2700px width provide excellent print resolution (300+ DPI at standard book dimensions) while avoiding all compatibility issues of SVG-in-PDF workflows. The rendering is frozen at build time — what you see in the PNG is exactly what prints.

## Consequences

### Positive

- **Reliability:** PDF generation never fails due to SVG parsing errors
- **Consistency:** Identical rendering across all outputs (HTML, PDF, print)
- **Maintainability:** Clear separation between design artifacts (.cog.svg) and build artifacts (.png)
- **Quality:** qlmanage WebKit rendering ensures CSS fidelity
- **Performance:** LaTeX processes simple PNGs faster than complex SVGs
- **Future-proof:** Independent of xelatex SVG parsing changes

### Trade-offs

- **File size:** PNGs are larger than SVGs (but negligible for print-quality publications)
- **Scalability:** PNGs are raster (but 2700px width exceeds print requirements)
- **Build step:** Requires explicit conversion (but automated via npm script)

### Documentation Impact

- **pdf-generator.cog.md v1.8.1:** Documents PNG workflow rationale in Step 2 (diagram-workflow) and Step 5 (illustration generation)
- **illustration-generator.cog.md v1.2.0:** Documents automated conversion workflow with qlmanage
- **book-svg-style.md:** Notes PNG conversion requirement for PDF inclusion

## Alternatives Considered

### Alternative 1: Embed SVGs directly in LaTeX

**Rejected because:**

- YAML frontmatter causes XML parsing errors
- CSS rendering is unreliable in xelatex
- Requires ongoing maintenance as LaTeX/SVG specs evolve
- Edge cases multiply as illustration complexity increases

### Alternative 2: Strip metadata before embedding

**Rejected because:**

- Loses single-source-of-truth (separate .cog.svg and stripped .svg files)
- CSS rendering still unreliable
- Adds build complexity (metadata stripping pipeline)
- Version control confusion (which file is canonical?)

### Alternative 3: Use different format for illustrations

**Rejected because:**

- SVG is the correct format for vector illustrations (semantic, scalable, web-native)
- `.cog.svg` with YAML frontmatter is core to MX OS architecture
- Problem isn't the format — it's the LaTeX embedding

## Implementation Notes

### Script Bug Pattern (Fixed 2026-02-18)

The `illustrations:generate` script must correctly handle both `.cog.svg` and `.svg` extensions:

**Correct pattern:**

```bash
png="${base%.svg}"          # Remove .svg extension first
png="${png%.cog}.png"       # Remove .cog if present, add .png
```

**Avoid this bug:**

```bash
png="${base%.cog.svg}.png"  # Only matches exact .cog.svg suffix
png="${png%.svg}.png"       # Adds second .png if first didn't match
# Result: agent-html-reading.png.png (WRONG!)
```

### Verification

Always verify PNG output matches SVG rendering:

```bash
# Check PNG files were regenerated
ls -lh datalake/assets/images/bitmap/architectures/

# Compare timestamps (should be recent)
stat datalake/assets/images/bitmap/architectures/diagram-name.png
```

## Status

**Accepted** — This architectural decision is documented and implemented across all MX publications.

---

*"PNG workflow is not a limitation, it's a deliberate architectural choice that prioritizes reliability and consistency over theoretical format purity."* — pdf-generator.cog.md v1.8.1
