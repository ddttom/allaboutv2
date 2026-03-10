---
version: "1.0"
description: "ADR #6: SVG-to-PNG aspect ratio preservation with tool cascade — fixing qlmanage square thumbnail bug for professional PDF layout."
created: 2026-02-18
modified: 2026-03-02
author: Tom Cranstoun and Maxine

mx:
  status: accepted
  category: architecture
  partOf: mx-maxine-lives
  tags: [adr, pdf-generation, svg, png, aspect-ratio, rsvg-convert, imagemagick, qlmanage, illustration-pipeline]
  audience: [tech, tech]

  adr:
    number: 6
    title: "SVG-to-PNG Aspect Ratio Preservation with Tool Cascade"
    status: accepted
    date: 2026-02-18
    context: "MX Handbook PDF generation (Feb 2026) revealed critical image clipping issue: landscape SVG diagrams (900×600, 3:2 ratio) were converted to square PNGs (2700×2700) with letterbox padding by qlmanage, causing LaTeX to scale incorrectly and clip content outside page margins."
    decision: "Implement tool cascade for SVG-to-PNG conversion: rsvg-convert (primary) → ImageMagick (fallback) → qlmanage (last resort). Always preserve source aspect ratio. Document qlmanage square thumbnail limitation."
    consequences: "All book diagrams maintain 3:2 aspect ratio (2700×1800 PNG from 900×600 SVG). Images scale properly in LaTeX without clipping. Professional PDF layout with readable diagrams. Universal workflow across all MX publications."

  buildsOn: [pdf-generator, 2026-02-18-png-workflow-for-pdf-generation, illustration-generator]
---

# SVG-to-PNG Aspect Ratio Preservation with Tool Cascade

## Context

During MX Handbook PDF generation (February 2026), we discovered that book diagrams were clipping in the PDF despite being designed at 900×600 pixels (3:2 landscape aspect ratio). Investigation revealed a fundamental limitation of macOS's qlmanage tool that was silently destroying aspect ratios.

### The Problem: qlmanage Creates Square Thumbnails

**Discovery timeline:**

1. **Initial symptom:** Timeline diagram clipping in PDF at top/bottom edges
2. **First hypothesis:** LaTeX image scaling too large (tried 95%, 80%, 70%, 50% width — all clipped)
3. **Second hypothesis:** pandocbounded macro double-scaling (removed setkeys — still clipped)
4. **Root cause found:** PNG files were 2700×2700 (square) when source SVGs were 900×600 (landscape)

**Technical analysis:**

```bash
# Source SVG
file datalake/assets/images/svg/chapter-00-first-mover-timeline.svg
# → SVG image, 900×600

# PNG created by qlmanage -s 2700
file datalake/assets/images/bitmap/chapter-00-first-mover-timeline.png
# → PNG image, 2700×2700 (WRONG! Should be 2700×1800)
```

**The qlmanage limitation:**

```bash
qlmanage -t -s 2700 -o output/ input.svg
```

The `-s 2700` flag tells qlmanage to create a 2700×2700 **square thumbnail**, regardless of source aspect ratio. For non-square images:

- Landscape (3:2) → 2700×2700 with top/bottom letterbox padding
- Portrait (2:3) → 2700×2700 with left/right pillarbox padding
- Square (1:1) → 2700×2700 (correct)

**Why this breaks PDFs:**

When LaTeX tries to scale a 2700×2700 image to fit page width (A4 = 210mm with 1" margins), it preserves the square aspect ratio. The actual diagram content (letterboxed in the center) ends up taller than the page, causing clipping.

```
┌─────────────────────┐
│   (black padding)   │  ← qlmanage adds this
├─────────────────────┤
│  actual diagram     │  ← 3:2 content squashed into square
│  (900×600 original) │
├─────────────────────┤
│   (black padding)   │  ← qlmanage adds this
└─────────────────────┘
  2700×2700 square PNG
```

### Why qlmanage Was Used Initially

ADR #4 (PNG Conversion Workflow) chose qlmanage as the primary tool because:

- Uses macOS WebKit rendering engine (perfect CSS support)
- Same rendering as Safari browser
- Reliable for CSS-styled SVG elements

This was correct for **CSS rendering** but overlooked the **aspect ratio** consequence.

## Decision

**Implement a tool cascade that prioritizes aspect ratio preservation:**

### Priority Order

1. **rsvg-convert** (librsvg) — primary tool
   - Perfect aspect ratio preservation
   - Excellent SVG spec compliance
   - Fast, reliable, predictable
   - Command: `rsvg-convert -w 2700 --keep-aspect-ratio input.svg -o output.png`

2. **ImageMagick** (`magick`) — fallback
   - Preserves aspect ratio
   - Good quality rendering
   - Wider platform support (Linux, macOS, Windows)
   - Command: `magick -density 300 -background white input.svg output.png`

3. **qlmanage** — last resort only
   - Creates square thumbnails (aspect ratio lost)
   - Use only when rsvg-convert and ImageMagick unavailable
   - Warn user when qlmanage is used
   - Command: `qlmanage -t -s 2700 -o output_dir/ input.svg`

### Implementation: scripts/generate-illustrations.sh

**Architecture:**

- Detects available tools at startup (which rsvg-convert, which magick, which qlmanage)
- Tries tools in priority order for each SVG
- Reports which tool succeeded for each conversion
- Colored output: green (rsvg/magick), yellow (qlmanage warning)
- Non-interactive: no prompts (stdin < /dev/null), safe for CI/CD

**Key features:**

```bash
# Tool detection
if command -v rsvg-convert &> /dev/null; then
    RSVG_AVAILABLE=true
fi

# Conversion with cascade
convert_svg() {
    local svg_path="$1"
    local success=false

    # Try rsvg-convert first (preserves aspect ratio)
    if [[ "$RSVG_AVAILABLE" == "true" ]]; then
        if rsvg-convert -w 2700 --keep-aspect-ratio "$svg_path" -o "$png_path"; then
            echo "✓ $svg_path → $png_name (rsvg-convert)"
            success=true
            return 0
        fi
    fi

    # Fallback to ImageMagick (preserves aspect ratio)
    if [[ "$success" == "false" && "$MAGICK_AVAILABLE" == "true" ]]; then
        if magick -density 300 -background white "$svg_path" "$png_path"; then
            echo "✓ $svg_path → $png_name (ImageMagick)"
            success=true
            return 0
        fi
    fi

    # Last resort: qlmanage (creates squares!)
    if [[ "$success" == "false" && "$QLMANAGE_AVAILABLE" == "true" ]]; then
        echo "⚠ $svg_path → $png_name (qlmanage - may create square!)"
        qlmanage -t -s 2700 -o "$output_dir" "$svg_path"
        success=true
        return 0
    fi

    # All tools failed
    echo "✗ $svg_path (all tools failed)"
    return 1
}
```

**Path handling:**

- Runs from repo root, cds to `datalake/assets/images/svg/`
- Uses relative paths from svg directory
- Outputs to `../../../datalake/assets/images/bitmap/`
- Mirrors subdirectory structure (flowcharts/, architectures/, comparisons/)

**Filename handling:**

- Correctly strips both `.svg` and `.cog` extensions
- `agent-decision-flow.cog.svg` → `agent-decision-flow.png` (correct)
- Never creates `.png.png` or `.svg.png` (bug avoided)

## Rationale

### 1. Aspect Ratio is Critical for PDF Layout

LaTeX's `\pandocbounded` macro scales images to fit within page dimensions while preserving aspect ratio. If the PNG has the wrong aspect ratio (square when source is landscape), the scaling math is wrong and content clips.

**Example:**

- Source SVG: 900×600 (3:2, landscape)
- Correct PNG: 2700×1800 (3:2 preserved)
- LaTeX scales to: 95% page width × auto height = fits perfectly
- Wrong PNG: 2700×2700 (1:1, square with padding)
- LaTeX scales to: 95% page width × same height = content taller than page = clips

### 2. Tool Selection Based on Correct Criteria

ADR #4 chose qlmanage for **CSS rendering accuracy**. This ADR refines that decision with a new criterion: **aspect ratio preservation**.

**Correct tool selection:**

- CSS-styled SVGs (complex gradients, filters, advanced styling) → qlmanage OK (square acceptable for decorative icons)
- Book diagrams (flowcharts, architectures, timelines) → rsvg-convert/ImageMagick required (aspect ratio critical)

**Resolution:** Use tool cascade. rsvg-convert handles 90% of cases correctly. qlmanage only used for files that rsvg-convert cannot process (rare edge cases).

### 3. Universal Solution for All MX Publications

This workflow applies to:

- MX Handbook (diagrams, flowcharts, timelines)
- MX Protocols (architecture diagrams, illustrations)
- Blog posts (screenshots, diagrams)
- Presentations (slide graphics)
- Any SVG used in PDF output

### 4. Better Quality, Not Just Correct Layout

rsvg-convert produces excellent quality PNGs with:

- Anti-aliased text and shapes
- Correct color rendering
- Clean edges and curves
- Proper transparency handling

ImageMagick is nearly as good. qlmanage is last resort not just for aspect ratio, but for overall quality.

## Consequences

### Positive

- **Correct aspect ratios:** All book diagrams now 2700×1800 (3:2) matching source 900×600
- **No clipping:** Images scale properly within LaTeX page constraints
- **Professional layout:** Diagrams readable at appropriate size (95% width × 65% height)
- **Universal workflow:** Works for all SVG files across all categories
- **Platform portable:** rsvg-convert and ImageMagick available on Linux, macOS, Windows
- **Clear warnings:** Yellow alert when qlmanage used (user knows to install better tools)
- **Automated:** `npm run illustrations:generate` handles everything

### Measured Impact (MX Handbook, 2026-02-18)

**Before (qlmanage only):**

- 7 book diagrams: all 2700×2700 (square, wrong)
- PDF: images clipping at top/bottom
- Tried 70%, 50% width — still clipped (aspect ratio was the problem, not size)

**After (tool cascade):**

- 7 book diagrams via rsvg-convert: all 2700×1800 (3:2, correct)
- 24 icons/logos via qlmanage: mostly square logos (1:1, correct for those)
- PDF: images scale perfectly, no clipping
- Final size: 95% width × 65% height — readable and professional

**File sizes (reasonable):**

- chapter-00-first-mover-timeline.png: 412K
- agent-decision-flow.png: 260K
- implementation-roadmap.png: 408K
- content-hierarchy.png: 312K
- agent-html-reading.png: 396K
- progressive-enhancement.png: 376K
- agent-navigation-patterns.png: 404K

### Trade-offs

- **Dependency:** Requires rsvg-convert installation (`brew install librsvg`)
- **Fallback chain:** More complex script logic (but invisible to users)
- **Tool detection:** Runtime checking adds startup time (negligible: <100ms)

### Installation

**macOS (Homebrew):**

```bash
brew install librsvg      # Primary tool (rsvg-convert)
brew install imagemagick  # Fallback tool (magick)
```

**Linux (Ubuntu/Debian):**

```bash
apt-get install librsvg2-bin  # Provides rsvg-convert
apt-get install imagemagick   # Provides convert/magick
```

**Verification:**

```bash
which rsvg-convert   # Should show installation path
rsvg-convert --version  # Should show version 2.x
```

### Documentation Impact

- **pdf-generator.cog.md v1.9.0:** Step 5 completely rewritten with tool cascade, aspect ratio explanation, troubleshooting guide
- **scripts/generate-illustrations.sh v2.0.0:** New standalone script replacing inline npm script
- **package.json:** Updated illustrations:generate to call new script
- **This ADR:** Canonical reference for aspect ratio preservation decision

## Alternatives Considered

### Alternative 1: Stick with qlmanage only, adjust LaTeX scaling

**Rejected because:**

- Scaling square images to fit landscape aspect causes padding waste
- User sees black bars or stretched content
- Not a solution — just makes the bug less visible
- Doesn't fix root cause (wrong aspect ratio)

### Alternative 2: Pre-process SVGs to square format

**Rejected because:**

- Adds padding at design time (bloats source files)
- Loses design fidelity (original aspect ratio is correct)
- Makes source SVGs ugly and harder to maintain
- Wrong layer to fix this (problem is in conversion, not design)

### Alternative 3: Use only ImageMagick, skip qlmanage entirely

**Considered but modified:**

- ImageMagick has good aspect ratio preservation
- But rsvg-convert is better (faster, cleaner output, better SVG spec compliance)
- Solution: Use both — try rsvg-convert first, ImageMagick second
- Keep qlmanage for edge cases where others fail (rare but possible)

### Alternative 4: Convert to square thumbnails, add manual crop step

**Rejected because:**

- Manual cropping breaks automation
- Requires human judgment per image
- Fragile (breaks when SVG updated)
- Terrible workflow for batch processing

## Implementation Notes

### Verification After Conversion

Always check output dimensions match source aspect ratio:

```bash
# Check source SVG dimensions (viewBox or width/height)
grep -E 'viewBox|width|height' datalake/assets/images/svg/diagram.svg

# Check output PNG dimensions
file datalake/assets/images/bitmap/diagram.png

# Example output for 3:2 source:
# PNG image data, 2700 x 1800, 8-bit/color RGB  ← Correct!
# PNG image data, 2700 x 2700, 8-bit/color RGB  ← Wrong (qlmanage)
```

### When qlmanage is Acceptable

Square output is **correct** for:

- Logos (usually designed as squares: 500×500)
- Icons (designed as squares: 200×200)
- Profile photos (cropped to squares)
- QR codes (always square)

Square output is **wrong** for:

- Flowcharts (typically landscape)
- Timelines (wide landscape)
- Architecture diagrams (landscape or portrait)
- Screenshots (match device aspect ratio)

### Troubleshooting: Images Still Clipping

If images clip despite correct aspect ratio:

1. **Check PNG dimensions:** `file bitmap/diagram.png` should match source ratio
2. **Check LaTeX scaling:** Adjust `\pandocbounded` constraints in metadata.yaml
3. **Verify source SVG:** No clipping/overflow in source design
4. **Check LaTeX output:** Look for "Overfull \hbox" warnings

**Example fix (metadata.yaml):**

```latex
\renewcommand*\pandocbounded[1]{%
  \Gscale@div\@tempa{0.65\textheight}{...}%  ← Adjust height constraint
  \Gscale@div\@tempb{0.95\linewidth}{...}%   ← Adjust width constraint
  ...
}
```

Start conservative (70% width × 45% height), increase gradually (95% × 65%) until images are readable without clipping.

## Status

**Accepted** — This architectural decision is implemented across all MX publications as of 2026-02-18.

**Related ADRs:**

- ADR #4: PNG Conversion Workflow (establishes PNG-first approach)
- ADR #5: Typography Standards for PDF Generation (widow/orphan prevention)
- This ADR #6: Aspect Ratio Preservation (refines ADR #4 with tool cascade)

---

*"The tool that renders CSS perfectly isn't useful if it destroys aspect ratios. Use the right tool for the right job, in the right order."* — Maxine, 2026-02-18
