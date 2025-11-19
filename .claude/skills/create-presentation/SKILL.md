---
name: create-presentation
description: Create or update presentation notebooks with embedded HTML and JavaScript in markdown cells using EDS blocks. Convert executable code cells to informative text. Build presentations, slides, demos, showcases with accordion, cards, tabs, hero, grid, table blocks. No runnable JavaScript cells - only visual markdown with inline scripts for presentation mode.
---

# Create Presentation Skill

## Purpose

Transform Jupyter notebooks into beautiful presentation-mode experiences using embedded HTML and JavaScript within markdown cells. Leverages EDS blocks for visual appeal while preventing code execution by users.

## When to Use

- Creating presentation notebooks
- Building interactive demos without executable code
- Converting educational notebooks to presentation format
- Creating showcases, tutorials, or product demos
- Building slide-like experiences with EDS blocks
- Updating existing notebooks to presentation mode
- Applying inline HTML styling for beautiful, consistent appearance

## Key Concepts

### Presentation Mode vs Interactive Mode

**Interactive Notebooks** (e.g., test.ipynb):
- Users can run JavaScript code cells
- Code cells have "Run" buttons
- For developers and testing

**Presentation Notebooks** (e.g., demo.ipynb):
- No executable code cells
- All interactivity via inline scripts in markdown
- For end users, clients, presentations
- Beautiful visual layouts with EDS blocks

### Core Approach

1. **All content in markdown cells** - No code cells with executable JavaScript
2. **Inline scripts in markdown** - Use `<script>` tags within markdown for interactivity
3. **EDS blocks via HTML** - Embed block HTML directly in markdown
4. **Conversion of existing code cells** - Transform to informative markdown text
5. **Inline HTML styling** - Apply consistent design system for beautiful presentation

## Available EDS Blocks

See [resources/blocks-reference.md](resources/blocks-reference.md) for complete details on all blocks.

**Visual Layout Blocks:**
- `accordion` - Collapsible sections
- `cards` - Card grid layouts
- `tabs` - Tabbed content
- `grid` - Flexible grid layouts
- `hero` - Hero banners
- `table` - Data tables

**Content Blocks:**
- `quote` - Pull quotes
- `columns` - Multi-column layouts
- `modal` - Dialog overlays
- `video` - Embedded videos

**Interactive Blocks:**
- `code-expander` - Expandable code snippets
- `counter` - Animated counters
- `floating-alert` - Dismissible alerts

## Quick Start

### Creating a New Presentation

```markdown
Use /create-presentation command with:
- Topic or title
- Key sections/topics
- Desired blocks (accordion, cards, tabs, etc.)
```

**Example:**
```
/create-presentation "Product Demo" with sections: Features, Benefits, Pricing
Use cards for features, accordion for benefits, table for pricing
```

### Converting Existing Notebook

```markdown
Use /create-presentation with path to existing .ipynb file
All code cells will be converted to informative markdown
```

**Example:**
```
/create-presentation convert education.ipynb
Keep structure but make it presentation-only
```

## Structure Pattern

### Metadata Setup

Every presentation notebook should have:

```json
{
  "metadata": {
    "title": "Presentation Title",
    "description": "Brief description",
    "author": "Author Name",
    "date": "2025-01-19",
    "category": "presentation",
    "repo": "https://github.com/username/repo",
    "manual-path": "docs/for-ai/your-documentation.md"
  }
}
```

**Key Fields:**

- **`title`** - Main presentation title (required)
- **`description`** - One-line summary (optional)
- **`author`** - Author name (optional)
- **`date`** - Publication date (optional)
- **`category`** - Content category, e.g., "presentation" (optional)
- **`repo`** - Repository URL for linking .md files (optional)
- **`manual-path`** - Path to documentation for "Read the Manual" button (optional)
  - **REQUIRED for button:** Button only appears if `manual-path` is provided
  - With `repo` and plain .md: Creates GitHub link `{repo}/blob/main/{manual-path}`
  - Absolute path (`/...`): Used as-is
  - Relative path: Made absolute from root
  - Full URL: Used as-is
  - **No default:** If omitted, button will not appear

### Cell Structure

**Important:** Do NOT automatically include a Table of Contents. The presentation template does not include a TOC by default. Only add navigation if explicitly requested by the user.

**Typical structure:**

**Title Cell (Markdown):**
```markdown
# 🎯 Presentation Title

**Subtitle or tagline**

---

## Overview

Brief introduction to the presentation
```

**Content Cells (Markdown with Embedded Blocks):**
```markdown
## Section Title

<div class="accordion block">
  <div>
    <div>Feature 1</div>
    <div>Description of feature 1 with details...</div>
  </div>
  <div>
    <div>Feature 2</div>
    <div>Description of feature 2 with details...</div>
  </div>
</div>

<script type="module">
  // Initialize block
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

**Navigation Cell (Markdown):**
```markdown
---

## 📋 Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)
- [Conclusion](#conclusion)
```

## Block Usage Patterns

### Accordion Block (Collapsible Sections)

**Best For:** FAQs, feature lists, detailed explanations

```markdown
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

<h2 style="color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;">Section Title</h2>

<div class="accordion block">
  <div>
    <div>Question or Title</div>
    <div>Answer or detailed content here...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>

</div>
```

### Cards Block (Grid Layout)

**Best For:** Features, team members, product showcase

```markdown
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

<h2 style="color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;">Section Title</h2>

<div class="cards block">
  <div>
    <div><strong>📊 Card Title</strong></div>
    <div>Card content with description...</div>
  </div>
  <div>
    <div><strong>🚀 Another Card</strong></div>
    <div>More content here...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  const module = await import('/blocks/cards/cards.js');
  await module.default(block);
</script>

</div>
```

### Tabs Block (Tabbed Content)

**Best For:** Organizing related information, code examples, comparisons

```markdown
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

<h2 style="color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;">Section Title</h2>

<div class="tabs block">
  <div>
    <div>Tab 1</div>
    <div>Content for tab 1...</div>
  </div>
  <div>
    <div>Tab 2</div>
    <div>Content for tab 2...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.tabs.block');
  const module = await import('/blocks/tabs/tabs.js');
  await module.default(block);
</script>

</div>
```

See [resources/blocks-reference.md](resources/blocks-reference.md) for all block patterns.

## Visual Consistency Standards

**CRITICAL: All presentations must follow these exact styling standards for consistency.**

### Typography Standards

- **H1 (Hero Title)**: `font-size: 48px; font-weight: 800`
- **H2 (Major Sections)**: `color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;`
  - H2 emoji size: `32px`
- **H3 (Subsections)**: `color: #0d47a1; font-size: 26px; font-weight: 700; margin-bottom: 20px;`
  - H3 emoji size: `28px`
  - Use flexbox pattern: `display: flex; align-items: center; gap: 12px;`
- **Body text**: `font-size: 16px; line-height: 1.8; color: #212121;`
- **List item emojis**: `20px`
- **TOC/Navigation links**: `font-size: 18px; font-weight: 500`
- **IMPORTANT**: Use HTML headings with explicit styling, NOT markdown syntax (`##`, `###`)
- Markdown headings render with default grey colors - always use HTML

### Background Standards

- **Standard gradient**: `background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);`
- **All content divs MUST include**: `color: #212121;` to prevent text fading
- **Margin**: `margin: 0 0;` (no vertical gaps that expose dark ipynb-viewer background)
- **Border radius**: `border-radius: 12px;`
- **Padding**: `padding: 32px;`

### Border Hierarchy

- **H2 major sections**: `border-left: 6px solid #0288d1;` (thick border for major parts)
- **H3 subsections**: `border-left: 4px solid #0288d1;` (thinner border for content within sections)
- **Hero cells**: No border (full-width hero styling)
- **Transition cells**: `border-left: 4px solid #0288d1;` (matches subsection weight)

### Standard Container Patterns

**H2 Major Section (with section tag):**

```html
<section id="section-name">

<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

  <h2 style="color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;">🎯 Section Title</h2>

  <p style="font-size: 16px; line-height: 1.8;">Body text content here...</p>

</div>

</section>
```

**H3 Subsection (standalone):**

```html
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 4px solid #0288d1; color: #212121;">

  <h3 style="color: #0d47a1; font-size: 26px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
    <span style="font-size: 28px;">✨</span>
    Subsection Title
  </h3>

  <p style="font-size: 16px; line-height: 1.8;">Body text content here...</p>

</div>
```

**Hero Cell (title page):**

```html
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); color: white; border-radius: 16px; padding: 48px; text-align: center; margin: 0 0; box-shadow: 0 8px 20px rgba(0,0,0,0.25); color: #212121;">
  <h1 style="font-size: 48px; font-weight: 800; margin: 0 0 16px 0; display: flex; align-items: center; justify-content: center; gap: 16px;">
    <span style="font-size: 56px;">🎯</span>
    <span>Presentation Title</span>
  </h1>
  <p style="font-size: 20px; margin: 16px 0; opacity: 0.95; font-weight: 300;">
    Compelling subtitle or tagline
  </p>
</div>
```

### Block Wrapping Pattern

**CRITICAL**: All EDS blocks MUST be wrapped INSIDE styled divs, not as siblings.

Blocks inherit dark background from ipynb-viewer if not properly wrapped:

```html
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

  <h2 style="color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;">Section Title</h2>

  <!-- Optional explanation box -->
  <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 20px; margin: 0 0 24px 0; border-left: 4px solid #0288d1; color: #212121;">
    Explanation text about the block demonstration
  </div>

  <!-- Block INSIDE the container -->
  <div class="block-name block">
    <!-- block content -->
  </div>

  <script type="module">
    const block = document.querySelector('.block-name.block');
    const module = await import('/blocks/block-name/block-name.js');
    await module.default(block);
  </script>

</div> <!-- Close container AFTER block -->
```

### Common Mistakes to Avoid

1. ❌ Using markdown headings (`##`, `###`) - they render grey
2. ❌ Placing blocks as siblings to styled divs - they inherit dark background
3. ❌ Forgetting `color: #212121;` on gradient divs - text fades
4. ❌ Using vertical margins (`margin: 32px 0;`) - creates black gaps
5. ❌ Inconsistent colors across cells

## Inline HTML Styling

### Design System

Apply consistent inline HTML styling to all markdown cells for professional presentation:

**Standard Color Palette:**
```javascript
{
  heading: '#0d47a1',      // Dark Blue (all headings)
  text: '#212121',         // Dark Gray (all body text)
  border: '#0288d1',       // Blue (left borders)
  gradient_start: '#e3f2fd', // Light Blue (gradient start)
  gradient_end: '#bbdefb',   // Medium Blue (gradient end)

  // Legacy/optional colors:
  primary: '#1976d2',      // Material Blue
  secondary: '#dc004e',    // Material Pink
  success: '#2e7d32',      // Green
  warning: '#ed6c02',      // Orange
  background: '#f5f5f5',   // Light Gray
  surface: '#ffffff'       // White
}
```

### Styling Patterns

**Hero Header:**
```html
<div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; border-radius: 16px; padding: 48px; text-align: center; margin: 32px 0; box-shadow: 0 8px 16px rgba(0,0,0,0.2);">
<h1 style="font-size: 48px; font-weight: 800; margin: 0 0 16px 0;">
🗺️ Presentation Title
</h1>
<p style="font-size: 20px; margin: 16px 0; opacity: 0.95;">
Your compelling subtitle or tagline
</p>
</div>
```

**Content Card:**
```html
<div style="background: white; border-radius: 12px; padding: 28px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
<h3 style="color: #1976d2; font-size: 24px; font-weight: 700; margin-bottom: 20px;">Section Title</h3>
<div style="color: #212121; line-height: 1.8; font-size: 16px;">
Your content here with proper typography
</div>
</div>
```

**Block Wrapper (for EDS blocks):**
```html
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

<h3 style="color: #0d47a1; font-size: 26px; font-weight: 700; margin-bottom: 16px;">What this demonstrates</h3>

<p>Explanatory text before the EDS block</p>

<div class="cards block">
  <!-- Block HTML here -->
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  const module = await import('/blocks/cards/cards.js');
  await module.default(block);
</script>

</div>
```

**List with Icons (Compact Spacing):**
```html
<ul style="list-style: none; padding: 0; margin: 0;">
  <li style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.08); font-size: 16px; display: flex; align-items: center; gap: 12px;">
    <span style="font-size: 20px;">✅</span>
    <span>List item text</span>
  </li>
  <!-- Remove border-bottom from last item -->
  <li style="padding: 12px 0; font-size: 16px; display: flex; align-items: center; gap: 12px;">
    <span style="font-size: 20px;">✅</span>
    <span>Last list item</span>
  </li>
</ul>
```

### Typography Scale

- **H1 (Hero Title)**: 48px, font-weight: 800, emoji: 56px
- **H2 (Major Sections)**: 28px, font-weight: 700, emoji: 32px
- **H3 (Subsections)**: 26px, font-weight: 700, emoji: 28px
- **Body Text**: 16px, line-height: 1.8
- **TOC Links**: 18px, font-weight: 500
- **List Icons**: 20px (emojis)
- **Code**: Courier New, monospace

### Spacing System

- **Container Padding**: 32px (all content containers)
- **Hero Padding**: 48px (title cells)
- **H2 Margin-bottom**: 24px
- **H3 Margin-bottom**: 20px
- **Paragraph Margin-bottom**: 16px-24px
- **List Item Padding**: 12px vertical, with border separators
- **TOC Item Padding**: 10px vertical, 8px 12px for links
- **Flexbox Gap**: 12px (heading emoji spacing)
- **Border Radius**: 12px (standard), 16px (hero cells)

### Interactive Elements

**Hover Effects:**
- Background transitions on links
- Color changes on buttons
- Shadow depth changes on cards

**Best Practices:**
- ✅ **Use CSS `:hover` pseudo-class** - Inline JavaScript event handlers (`onmouseover`, `onmouseout`) are blocked by browser security
- ✅ **Use `<style>` tags with classes** - Define reusable classes for hover states
- ✅ **Apply `transition`** - For smooth animations (e.g., `transition: background 0.2s`)
- ✅ **Maintain accessibility** - Proper contrast ratios and focus states

**Security Note:**
Browsers block inline JavaScript event handlers when content is inserted via `innerHTML` (which ipynb-viewer uses). Always use CSS `:hover` instead of `onmouseover`/`onmouseout`.

## Converting Code Cells

### Original Code Cell

```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
```

### Converted to Markdown

```markdown
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

<h3 style="color: #0d47a1; font-size: 26px; font-weight: 700; margin-bottom: 16px;">Code Example: Testing Accordion Block</h3>

<p>This example demonstrates how to test the accordion block programmatically:</p>

**Original code:**
\```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
\```

**What it does:**
1. Imports the testBlock helper function
2. Tests the accordion block with provided content
3. Returns the rendered HTML

**Result:** The accordion block is decorated and ready for display.

---

**Note:** In presentation mode, code is shown for reference only. See the live accordion demonstration below:

<div class="accordion block">
  <!-- Actual working accordion here -->
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>

</div>
```

### Conversion Rules

1. **Show the code** - Display original code in fenced code block
2. **Explain the purpose** - What does this code do?
3. **Describe the result** - What was the expected outcome?
4. **Provide alternative** - Show the working result via embedded block

## Best Practices

### Visual Design

- Use emojis for section headers (🎯, 📊, 🚀, ✨, 💡)
- Break content into digestible chunks
- Use blocks for interactive elements
- Add horizontal rules (`---`) between major sections
- Use **bold** and *italic* for emphasis

### Content Organization

- Start with title and overview
- Table of contents for long presentations
- Group related content in blocks
- End with call-to-action or summary
- Use hash links for navigation

### Performance

- Limit to 1-3 blocks per cell (avoid overwhelming)
- Use simple inline scripts (no heavy libraries)
- Keep markdown cells focused (one topic per cell)
- Test in paged mode for smooth navigation

### Accessibility

- Use semantic HTML in blocks
- Provide alt text for images
- Clear heading hierarchy (H1 → H2 → H3)
- Descriptive link text

## Examples

See [resources/complete-examples.md](resources/complete-examples.md) for full presentation notebook examples.

## Workflow

### Step 1: Plan Structure

Identify:
- Main topic and title
- Key sections (3-7 sections ideal)
- Which blocks fit each section
- Navigation needs

### Step 2: Create Metadata

Set up notebook metadata with title, description, author, etc.

### Step 3: Build Cells

For each section:
1. Markdown header
2. Content explanation
3. Embedded block (if needed)
4. Inline script to activate block

### Step 4: Add Navigation

- Table of contents at start
- Hash links between sections
- "Back to top" or "Next section" links

### Step 5: Test

- View in default mode (scrollable)
- View in paged mode (with "Start Reading")
- Test all interactive blocks
- Verify links work

## Common Patterns

### Product Features Section

```markdown
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

<h2 style="color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;">🚀 Key Features</h2>

<div class="cards block">
  <div>
    <div><strong>📊 Feature 1</strong></div>
    <div>Description...</div>
  </div>
  <div>
    <div><strong>⚡ Feature 2</strong></div>
    <div>Description...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  const module = await import('/blocks/cards/cards.js');
  await module.default(block);
</script>

</div>
```

### FAQ Section

```markdown
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

<h2 style="color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;">❓ Frequently Asked Questions</h2>

<div class="accordion block">
  <div>
    <div>How does it work?</div>
    <div>Detailed explanation...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>

</div>
```

### Pricing Table

```markdown
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 32px; margin: 0 0; border-left: 6px solid #0288d1; color: #212121;">

<h2 style="color: #0d47a1; font-size: 28px; font-weight: 700; margin-bottom: 24px;">💰 Pricing</h2>

<div class="table block">
  <div>
    <div>Plan</div>
    <div>Price</div>
    <div>Features</div>
  </div>
  <div>
    <div>Basic</div>
    <div>$10/mo</div>
    <div>Core features</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.table.block');
  const module = await import('/blocks/table/table.js');
  await module.default(block);
</script>

</div>
```

## Technical Details

### Block Initialization Pattern

All blocks follow this pattern:

1. **HTML structure** in markdown
2. **Inline script** with module import
3. **Decoration** by calling default export

```javascript
const block = document.querySelector('.block-name.block');
const module = await import('/blocks/block-name/block-name.js');
await module.default(block);
```

### Styling

Blocks automatically load their CSS. For custom styling:

```markdown
<style>
.custom-class {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
}
</style>

<div class="custom-class">
  Custom styled content
</div>
```

### Loading CSS

If needed, manually load CSS:

```javascript
<script>
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/blocks/block-name/block-name.css';
document.head.appendChild(link);
</script>
```

## Overlay Styling (Auto-Applied)

The ipynb-viewer block automatically handles consistent styling for paged presentations:

### Font Consistency

All text uses selective font inheritance (fixed in v1.0.2):
- Only `font-family` inherits, not `font-size`, `margin`, `padding`
- Inline styles with explicit sizes are preserved
- No font jumping between slides while respecting cell styling

### Fixed Position & Height

Overlay stays perfectly still when navigating (fixed in v1.0.2):
- Pinned at 5vh from top (not vertically centered)
- Content box locked at exactly 85vh tall
- Zero movement regardless of content size
- Content scrolls internally within fixed cell area

### Navigation Hover Effects

Navigation links work with CSS hover (fixed in v1.0.2):
- Use inline styles on `<a>` elements, not `<style>` tag classes
- CSS `:hover` selector automatically applies to nav links
- No inline JavaScript needed (`onmouseover`/`onmouseout` don't work)

**Note:** These fixes apply automatically to all presentations. No additional configuration needed.

## Troubleshooting

### Fonts Look Inconsistent

**Problem:** Heading sizes change between slides

**Solution:** No action needed - fixed in v3 (Jan 2025). The ipynb-viewer now uses `font-size: revert !important` to respect inline styles. Headings with inline styles (e.g., `style="font-size: 26px"`) display at their specified sizes.

**If Still Seeing Issues:** Ensure you're using latest ipynb-viewer CSS and clear browser cache.

### Overlay Jumps When Navigating

**Problem:** Overlay resizes or moves vertically

**Solution:** No action needed - fixed in v3 (Jan 2025). The overlay is now:
- Vertically centered with fixed 85vh height using `!important`
- Content scrolls inside cell area, overlay never resizes
- Multiple overlays prevented by automatic cleanup

**If Still Seeing Issues:** Clear browser cache and verify you're on latest version.

### Multiple Overlays or Unpredictable Behavior

**Problem:** Overlay appears duplicated or behaves strangely after page refresh

**Solution:** No action needed - fixed in v3 (Jan 2025). The ipynb-viewer now removes existing overlays before creating new ones, preventing stacking.

### Navigation Hover Not Working

**Problem:** TOC links don't change background on hover

**Solution:** Navigation links are automatically styled by ipynb-viewer CSS. Use `nav[aria-label="Presentation navigation"]` wrapper and links will get proper styling automatically.

**Note:** TOC should only be added if explicitly requested. The template does not include one by default.

## Related Skills

- `jupyter-educational-notebook` - For creating interactive educational content
- `jupyter-notebook-testing` - For testing EDS blocks
- `frontend-dev-guidelines` - For styling and best practices
- `eds-block-development` - For understanding block architecture

## Related Commands

- `/create-notebook` - Creates educational (interactive) notebooks
- `/create-presentation` - Creates presentation (non-interactive) notebooks

---

**Skill Status**: Complete - Ready for creating beautiful presentation notebooks ✅

**Version**: 1.0.3 (2025-01-19)

**Recent Changes (v3):**
- Fixed multiple overlays stacking on page re-renders
- Fixed inconsistent heading font sizes in overlay (respects inline styles)
- Fixed overlay jumping with locked 85vh height and `!important` flags
- All fixes automatic - no migration needed
