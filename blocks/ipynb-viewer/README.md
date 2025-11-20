# IPynb Viewer Block

Display and execute Jupyter notebook (.ipynb) files directly in your EDS site with interactive JavaScript execution capabilities.

## Features

**Parse and Display Notebooks**: Renders both markdown and code cells from .ipynb files. 
**Interactive Execution**: Run JavaScript code cells individually with a click (async/await support). 
**Cell Independence**: Run any cell at any time in any order with no initialization required. 
**Browser Execution**: Runs JavaScript code directly in the browser with native APIs. 
**Direct ES6 Imports**: Each cell imports what it needs independently. 
**Output Display**: Shows console logs, results, and errors inline. 
**Overlay Previews**: Full-screen overlays for visual testing (no popup blockers). 
**Paged Variation**: Display cells one at a time with navigation controls.
**Autorun Mode**: Automatically execute code cells without Run buttons (NEW).
**Notebook Variation**: Combined manual and paged modes with visible close button (NEW).
**Hamburger Menu TOC**: Navigate cells via dropdown menu in notebook mode with visual dividers, smart filtering (NEW).
**Link Navigation**: Navigate between overlays using hash targets (NEW).
**Auto-Wrapping**: Pure markdown authoring with automatic styling in notebook mode - 90% less code (NEW).
**Action Cards**: Beautiful navigation cards from pure markdown with emoji color indicators (NEW).
**Responsive Design**: Mobile-friendly layout.
**Syntax Highlighting**: Clear code formatting with monospace fonts.
**Error Handling**: Graceful error messages and visual indicators.

## Usage

### Basic Usage

Add the block to your page with a link to your notebook file:

```
| IPynb Viewer |
|--------------|
| /path/to/notebook.ipynb |
```

### With a Clickable Link

```
| IPynb Viewer |
|--------------|
| [View Notebook](/path/to/notebook.ipynb) |
```

### Paged Variation

Display notebook cells one at a time in a full-screen overlay with Previous/Next navigation:

```
| IPynb Viewer (paged) |
|----------------------|
| /path/to/notebook.ipynb |
```

**Features:**

**Start Reading button** clicks to enter full-screen reading mode.
**Full-viewport overlay** provides an immersive, distraction-free reading experience.
**Smart cell grouping** (NEW) automatically combines instruction markdown with following code cells.
**One page at a time** lets you focus on current content without page jumping.
**Previous/Next navigation** navigates between logical pages with buttons.
**Page indicator** shows logical page count (e.g., "1 / 8" instead of raw cell count).
**Close button (×)** exits overlay and returns to page.
**Keyboard shortcuts**: Arrow Left/Right navigates between pages, Escape closes overlay.
**No page jumping** keeps the overlay fixed in viewport.
**Responsive design** adapts to mobile, tablet, and desktop.
**Dark backdrop** reduces distractions (95% opacity black).

### Autorun Variation (NEW)

Automatically execute all code cells without requiring Run button clicks:

```
| IPynb Viewer (autorun) |
|------------------------|
| /path/to/notebook.ipynb |
```

**Features:**

**Automatic execution** runs code cells immediately when displayed.
**No Run buttons** provides a cleaner, presentation-focused interface.
**Output always visible** shows results by default without user action.
**Perfect for demos** ideal for presentations and live demonstrations.
**Still interactive** users can re-run cells by refreshing or modifying code.
**Works in all modes** functions in both default view and paged overlay.

**Use Cases:**
- Live presentations where code should execute automatically
- Demonstrations that don't require user interaction
- Educational content with pre-validated output
- Progressive examples that build on each other

### Notebook Variation (NEW)

Combines manual and paged modes for the complete educational experience:

```
| IPynb Viewer (notebook) |
|--------------------------|
| /path/to/notebook.ipynb |
```

**Features:**

**Start Reading button** opens paged overlay with manual code execution.
**Read the Manual button** provides access to block documentation.
**Manual execution** users click Run buttons to execute code cells (no autorun).
**Close button visible** (×) button always visible in paged overlay for easy dismissal.
**Preview headers visible** `showPreview()` overlays display with full controls including close button.
**Full integration** combines all features (paging, manual execution, documentation).
**Perfect for tutorials** complete learning experience with reference docs.
**Side-by-side access** switch between notebook and documentation easily.
**ESC key support** pressing ESC closes the topmost overlay (paged or preview).

**Use Cases:**
- Complete interactive tutorials with documentation
- Educational courses requiring reference material
- Complex demonstrations with help documentation
- Training materials with built-in guides

### Variation: Paged + Manual (NEW)

Combine paged mode with a manual button to provide access to documentation:

```
| IPynb Viewer (paged, manual) |
|-------------------------------|
| /path/to/notebook.ipynb |
```

**Features:**

**Start Reading button** opens the notebook in full-screen paged mode.
**Read the Manual button** opens the manual specified in notebook metadata in a scrollable overlay.
**Both buttons side by side** provide easy access to both notebook and documentation.
**Separate overlays** mean manual and notebook have independent full-screen displays.
**Markdown rendering** displays manual content beautifully formatted with headings, lists, tables, and code blocks.
**Scrollable content** allows long documentation to scroll smoothly within the overlay.
**Same close button (×)** provides consistent UI across both overlays.
**Escape key** works for both overlays.

**Important:** The "Read the Manual" button **only appears** if `manual-path` is provided in the notebook metadata.

**Use Case:**
Perfect for interactive tutorials where users need to reference documentation while exploring the notebook.

## Notebook Structure Support

The block supports standard Jupyter notebook JSON format with **enhanced markdown rendering** and **metadata display**.

### Metadata Fields

The notebook metadata is displayed in the header section:

**Required Fields:**

- `title` - Main notebook title (defaults to "Jupyter Notebook" if not provided)

**Optional Fields:**

- `description` - One-line summary displayed below title
- `author` - Author name
- `date` - Publication or creation date
- `version` - Version number (e.g., "1.0", "1.3")
- `category` - Content category (e.g., "tutorial", "reference", "demo") - displayed as blue badge
- `difficulty` - Skill level (e.g., "beginner", "intermediate", "advanced") - displayed as orange badge
- `duration` - Estimated reading time (e.g., "15 minutes", "1 hour") - displayed as purple badge
- `tags` - Array of keywords for searchability (e.g., ["tutorial", "javascript", "interactive"]) - displayed as gray tags
- `license` - Content license (e.g., "MIT", "CC BY 4.0")
- `repo` - Repository URL for automatically linking .md files in markdown cells (e.g., "https://github.com/username/repo")
  - **When provided:** Markdown links to .md files are automatically converted to full repository URLs
  - **When omitted:** Links render as-is (relative paths remain relative)
  - **Important:** Use markdown link syntax `[text](file.md)`, not inline code `` `file.md` ``
- `manual-path` - Path to the manual/documentation file for the "Read the Manual" button (used with `manual` or `notebook` variations)
  - **REQUIRED for button to appear:** The "Read the Manual" button only displays if `manual-path` is provided in metadata
  - **Plain .md filename:** If path doesn't start with `http://` or `https://`, and ends with `.md`, and `repo` is provided, constructs full GitHub URL: `{repo}/blob/main/{manual-path}`
  - **Absolute path:** Paths starting with `/` are used as-is (e.g., `/blocks/ipynb-viewer/README.mdc`)
  - **Relative path:** Other paths are made absolute from root (e.g., `docs/guide.md` → `/docs/guide.md`)
  - **Full URL:** Paths starting with `http://` or `https://` are used as-is
  - **No default:** If omitted, the "Read the Manual" button will not appear (even with `manual` or `notebook` variations)
  - **Example:** `"manual-path": "docs/for-ai/explaining-presentation-notebooks.md"` with `repo` set creates link to GitHub
  - Example with repo: `[guide](docs/guide.md)` → `https://github.com/username/repo/blob/main/docs/guide.md`
  - Example without repo: `[guide](docs/guide.md)` → `<a href="docs/guide.md">guide</a>`
  - ❌ Wrong: `` `getting-started.md` `` (inline code, won't convert)
  - ✅ Correct: `[getting-started.md](docs/getting-started.md)` (markdown link, will convert)
  - Also accessible in code cells via `getRepoUrl()` helper function (returns `null` if not set)
  - Converted links open in new tab with `target="_blank"` and `rel="noopener noreferrer"`

**Example metadata in .ipynb file:**
```json
{
  "metadata": {
    "title": "My Interactive Tutorial",
    "description": "Learn JavaScript fundamentals through interactive examples",
    "author": "Tom Cranstoun",
    "date": "November 14, 2025",
    "version": "1.0",
    "category": "tutorial",
    "difficulty": "intermediate",
    "duration": "30 minutes",
    "tags": ["tutorial", "javascript", "interactive", "beginner"],
    "license": "MIT",
    "repo": "https://github.com/username/repo",
    "kernelspec": {
      "display_name": "JavaScript",
      "language": "javascript",
      "name": "jslab"
    }
  }
}
```

**Display Order:**

1. Title (1.8rem, bold, centered)
2. Description (1.1rem, italic, gray #555)
3. Author (1rem, italic, gray #666)
4. Date (0.9rem, light gray #999)
5. Version (0.85rem, gray #888, bold)
6. Meta row badges (category, difficulty, duration) - color-coded badges
7. Tags (0.8rem, gray badges)
8. License (0.8rem, gray #888)

### Markdown Cells (Enhanced)

**Code Blocks (NEW):**

Triple backtick code blocks with optional language specification. Proper syntax highlighting and formatting. Example: \`\`\`javascript\n...\n\`\`\`

**Tables (NEW):**

Full markdown table support with headers. Alternating row colors for readability. Responsive table styling. Example: `| Header 1 | Header 2 |`

**Lists (NEW):**

Unordered lists with `-` or `*`. Ordered lists with `1.`, `2.`, etc. Proper indentation and spacing.

**Inline Formatting:**

Headers (H1, H2, H3) with `#`, `##`, `###`. **Bold** text with `**text**`. *Italic* text with `*text*`. `Inline code` with backticks. [Links](url) with `[text](url)`. Line breaks.

**Documentation Links (NEW with repo metadata):**

When `repo` metadata is provided, links to .md files are automatically converted to full GitHub URLs:

```markdown
✅ Correct syntax (will convert):
- [Getting Started](docs/getting-started.md)
- [API Guide](./docs/api.md)
- See [this guide](/docs/guide.md) for details

❌ Wrong syntax (won't convert):
- `getting-started.md` (inline code, not a link)
- Getting Started: getting-started.md (plain text)
```

**Rules:**
- Must use markdown link syntax: `[text](file.md)`
- Only converts relative paths ending in `.md`
- Absolute URLs (http://, https://) are never converted
- Leading `./` or `/` are automatically stripped
- Converted links open in new tab with security attributes

### Code Cells

JavaScript code execution. Console output capture. Result display. Error handling.

## Interactive Features

### Run Button

Each code cell has a "Run" button that executes the JavaScript code (with async/await support), captures console.log() and console.error() output, displays the return value, and shows visual indicators for success/error states.

**Cell Independence:**

Run any cell at any time in any order. No initialization required. Each cell imports what it needs independently.

### Helper Functions

Import helper functions directly in any cell using ES6 imports:

```javascript
// Import what you need
const { testBlock } = await import('/scripts/ipynb-helpers.js');

// Test a block
const block = await testBlock('accordion', '<div>content</div>');

// Return result to display in output
return block.outerHTML;
```

**Available Helper Functions:**

`testBlock(blockName, innerHTML)` tests block decoration in browser. `showPreview(blockName, innerHTML)` opens overlay preview with full styling.

**Example cell structure:**
```javascript
// Import helpers
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const content = '<div><div>Title</div><div>Description</div></div>';
const block = await testBlock('accordion', content);

// Show visual preview
await showPreview('accordion', content);

// Return result to display
return block.outerHTML;
```

## Understanding the Three Overlay Types

The ipynb-viewer block uses **three distinct overlay systems** for different purposes:

### 1. Paged Overlay (Reading Mode)

**Triggered by:** Clicking the "Start Reading" button
**Purpose:** Navigate through notebook cells one page at a time
**Visual Controls:**
- Close button (×) in top-right
- **Previous/Next buttons** at the bottom
- **Page indicator** showing current page (e.g., "3 / 8")

**Keyboard Shortcuts:**
- `Arrow Left` - Previous page
- `Arrow Right` - Next page
- `Escape` - Close the paged overlay

**When visible:** This overlay is active from when you click "Start Reading" until you close it.

---

### 2. Manual Overlay (Documentation)

**Triggered by:** Clicking the "Read the Manual" button
**Purpose:** Display block documentation and reference material
**Visual Controls:**
- Close button (×) in top-right
- **Scrollable content area** for long documentation
- No pagination controls (continuous scroll)

**Keyboard Shortcuts:**
- `Escape` - Close the manual overlay

**When visible:** This overlay appears when you need to reference documentation while working with the notebook.

---

### 3. Preview Overlay (Code Execution Results)

**Triggered by:** Clicking "Run" button in code cells that use `showPreview()`
**Purpose:** Display visual results of code execution with responsive testing
**Visual Controls:**
- Close button (×) in top-right
- **Responsive view buttons** (📱 Mobile, 📱 Tablet, 🖥️ Desktop) - *only in non-notebook variations*
- **Notebook mode:** Shows close button and hamburger menu (☰) for table of contents navigation
- **Hamburger menu (notebook mode only):** Click to show dropdown TOC with cell headings, visual dividers for transitions, smart filtering (skips cells without headings)
- No pagination controls

**Keyboard Shortcuts:**
- `Escape` - Close the preview overlay (if no other overlays are open)

**When visible:** This overlay appears temporarily when you run code that calls `showPreview()`.

**Note:** In notebook variation, the preview overlay is simplified to show only the block title and close button, removing the responsive view buttons for a cleaner, distraction-free experience. The overlay height is also reduced to 75vh (instead of 95vh) to keep the pagination buttons visible and accessible.

---

### Overlay Hierarchy

When **multiple overlays are open** (e.g., you're in paged mode, have the manual open, and run code with `showPreview()`):
- The **preview overlay** appears on top of all other overlays
- Pressing `Escape` closes overlays in this order:
  1. **Preview overlay** (if open)
  2. **Manual overlay** (if open)
  3. **Paged overlay** (if open)
- Previous/Next buttons continue to work in the paged overlay beneath other overlays

This hierarchy ensures you can test responsive previews and reference documentation while reading through the notebook without losing your place.

---

### Link Navigation Between Overlays (NEW)

Navigate between pages in the paged overlay using hash links in markdown:

**How it works:**

Create links with hash targets in markdown cells:
```markdown
Jump to [Part 3](#part-3) or see the [Advanced Examples](#advanced-examples)
```

**How it works:**
- **Automatic ID generation**: All `## h2` headers automatically get IDs
- **ID format**: Text is converted to lowercase, spaces become hyphens, special chars removed
- **Example**: `## Part 1: The Big Picture` → `id="part-1-the-big-picture"`
- **Searches all pages** for the target ID
- **Navigates automatically** to the page containing the target
- **No page reload** smooth transition within overlay

**Use Cases:**
- **Table of Contents** with clickable navigation
- **Cross-references** between sections
- **Progressive learning** with "skip ahead" links
- **Modular content** allowing non-linear exploration

**Example markdown cell:**
```markdown
## 📋 Table of Contents

- [Part 1: The Big Picture](#part-1-the-big-picture)
- [Part 2: Testing Notebooks](#part-2-testing-notebooks)
- [Part 3: Educational Notebooks](#part-3-educational-notebooks)
- [Part 4: Display Modes](#part-4-display-modes)
- [Part 5: Content Patterns](#part-5-content-patterns)
- [Part 6: Pro Tips](#part-6-pro-tips)
- [Resources](#resources-next-steps)
```

**ID generation rules:**
- `## 🚀 Getting Started` → `#getting-started` (emojis removed, leading hyphen trimmed)
- `## Part 1: Introduction` → `#part-1-introduction` (lowercase, hyphens)
- `## What's New?` → `#whats-new` (apostrophe removed, spaces to hyphens)

### Live Preview with Overlay

When using `showPreview()` in code cells, the **Overlay system** opens full-screen overlay on the same page (no popup blockers!). **Responsive preview** switches between Mobile (375×667), Tablet (768×1024), and Desktop (95%×95vh) views. **Full styling** loads all CSS properly with complete styling support. **Full interactivity** executes block JavaScript with event handlers working. **Easy dismissal** via ESC, backdrop click, or close button. **No popup blockers** since it stays on the same page with no new windows.

**How it works:**

Creates full-screen overlay with semi-transparent backdrop. Includes all CSS and JavaScript for proper block rendering. Decorates block using native browser APIs. Interactive viewport switching for testing across device sizes. Result is fully functional styled blocks in overlay with responsive testing.

**Responsive Preview Buttons:**

📱 **Mobile** (375px × 667px) is iPhone SE/8 size. 📱 **Tablet** (768px × 1024px) is iPad size. 🖥️ **Desktop** (95% × 95vh) is full desktop view (default).

Switch between views with one click to test block responsiveness!

## Example Notebook Structure

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "source": [
        "# My Test Notebook\n",
        "This is a markdown cell with **bold** text."
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "console.log('Hello from Jupyter!');\n",
        "return 42;"
      ]
    }
  ],
  "metadata": {
    "title": "My Notebook"
  }
}
```

## Technical Details

### Code Execution

Code runs in the browser using `AsyncFunction` constructor for async/await support. Console methods are temporarily captured during execution. Results are displayed in an output area below each cell. Errors are caught and displayed with red styling. Each cell runs independently with its own scope.

**Autorun Mode:**

When `autorun` or `notebook` variations are used:
- Code cells execute automatically when displayed
- Run buttons are hidden via CSS (`.ipynb-autorun` class)
- Output areas are visible by default (`display: block`)
- In paged mode, cells execute when navigating to each page
- Uses same async execution context as manual mode

### Paged Variation Implementation

The paged variation uses a full-screen overlay approach to eliminate page jumping:

**How it works:**

**Variation Detection**:
   ```javascript
   const isPaged = block.classList.contains('paged');
   ```

**Start Button**: Creates "Start Reading" button in the block. Clicking opens the full-screen overlay. Original cells hidden until overlay opens.

**Overlay Structure**:
   ```html
   <div class="ipynb-paged-overlay">
     <div class="ipynb-paged-overlay-content">
       <button class="ipynb-paged-close">×</button>
       <div class="ipynb-paged-cell-area">
         <!-- Current cell cloned here -->
       </div>
       <div class="ipynb-pagination">
         <!-- Previous, Page Indicator, Next -->
       </div>
     </div>
   </div>
   ```

**Full-Screen CSS**:
   ```css
   .ipynb-paged-overlay {
     position: fixed;
     top: 0; left: 0;
     width: 100vw; height: 100vh;
     background: rgba(0, 0, 0, 0.95);
     z-index: 10000;
   }
   ```

**Smart Cell Grouping**: Automatically detects when markdown cells reference code cells and groups them together on the same "page". Detection patterns include markdown ending with colon (`:`), contains "below", "following", "try running", "click run", contains "let's test", "let's try", "example:", "here's how". **Multi-code-cell grouping** groups up to 3 consecutive code cells together when instructional markdown is followed by multiple code cells. Spacing uses 1.5rem after markdown, 1.5rem between code cells. Page indicator shows logical pages, not raw cell count.

**Navigation**: Clones current page (single or grouped cells) into overlay. Button clicks navigate between logical pages. Scrolls to top on page change (no viewport jumping). Keyboard events (Arrow Left/Right, Escape).

**Close Mechanisms**: Close button (×) in top-right corner. Escape key. Restores body scroll on close.

**Key Features:**

Smart cell grouping for better context. Instruction and code shown together. Multiple consecutive code cells (up to 3) grouped with their instruction. Logical page navigation. No page jumping (fixed viewport position). Prevents background scrolling when open. Smooth fade-in animation (0.3s). Responsive sizing (90vw × 90vh on desktop). Full-screen on mobile (100vw × 100vh).

**Link Navigation (NEW):**

Hash links (`<a href="#target">`) in markdown cells enable navigation between pages:

```javascript
// Add click handlers for hash links
const links = cellContentArea.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.getAttribute('href');
    navigateToAnchor(target);
  });
});

// Navigate to page containing target
function navigateToAnchor(target) {
  const targetId = target.replace('#', '');

  // Search pages for target ID
  for (let i = 0; i < pages.length; i++) {
    const hasTarget = pages[i].cells.some(cell => {
      return cell.querySelector(`#${targetId}`) !== null;
    });

    if (hasTarget) {
      paginationState.currentPage = i;
      updatePageDisplay();
      return;
    }
  }

  // Handle part-X pattern (e.g., #part-3 → page 2)
  const partMatch = targetId.match(/^part-(\\d+)$/);
  if (partMatch) {
    const partNum = parseInt(partMatch[1], 10) - 1;
    paginationState.currentPage = partNum;
    updatePageDisplay();
  }
}
```

**How it works:**
1. Intercepts clicks on hash links in overlay
2. Searches all pages for matching ID attribute
3. Updates current page and refreshes display
4. Supports `part-X` pattern for direct page access

**Grouping Examples:**

*Example 1: Single code cell*
```
Markdown: "Let's test an accordion:"
Code: testBlock('accordion', content)
→ One page with markdown + 1 code cell
```

*Example 2: Multiple code cells*
```
Markdown: "Try running these cells in any order:"
Code A: Test accordion
Code B: Calculate sum
Code C: Show preview
→ One page with markdown + 3 code cells (all grouped together)
```

*Example 3: More than 3 code cells*
```
Markdown: "Run these examples:"
Code 1, Code 2, Code 3, Code 4
→ One page with markdown + Code 1, 2, 3
→ Separate page with Code 4
```

### Overlay Preview System

**How it works:**

**Creates overlay element**:
   ```javascript
   const overlay = document.createElement('div');
   overlay.className = 'ipynb-preview-overlay';
   // Full-screen overlay with inline styles
   ```

**Minimal DOM structure** (EDS-compatible):
   ```html
   <div class="ipynb-preview-overlay">
     <div class="ipynb-preview-backdrop"></div>
     <div class="ipynb-preview-container">
       <div class="ipynb-preview-header">
         <button class="ipynb-preview-close">×</button>
       </div>
       <div class="ipynb-preview-content">
         <div class="blockname block">
           <!-- block content as direct children -->
         </div>
       </div>
     </div>
   </div>
   ```

**Appends to document body**:
   ```javascript
   document.body.appendChild(overlay);
   ```

**Decorates block**:
   ```javascript
   const block = overlay.querySelector(`.${blockName}.block`);
   const module = await import(`/blocks/${blockName}/${blockName}.js`);
   await module.default(block);
   ```

**Why overlay is better than popup windows:**

No popup blockers. Stays on the same page. Better UX (ESC or backdrop click to close). Direct CSS access (no blob URL issues). Simpler implementation.

**Overlay Controls (NEW):**

**Close button (×)** always visible in top-right corner for all modes (including notebook variation).
**Responsive view buttons** switch between Mobile, Tablet, and Desktop views.
**ESC key support** pressing ESC closes the preview overlay (unless a paged/manual overlay is open).
**Overlay hierarchy** ESC key respects overlay stack - closes paged/manual overlays first, then preview.
**Click backdrop** clicking outside the preview container closes the overlay.

**Why minimal DOM structure is critical:**

EDS blocks expect specific DOM patterns where they can iterate over `block.children` directly to find content rows. Many blocks (accordion, tabs, cards) use patterns like:

```javascript
[...block.children].forEach((row) => {
  // Process each content row
});
```

**Solution:**

Block is properly structured within preview content area. No extra wrapper divs between content area and block. Blocks decorate correctly with full styling. See [Raw EDS Blocks Guide](../../docs/for-ai/implementation/raw-eds-blocks-guide.md) for detailed patterns.

### Markdown Parser (Enhanced)

The block includes a comprehensive markdown parser that supports:

**Processing Order:**

Code blocks (extracted first with placeholders). Tables (multi-line processing with header detection). Headers (H1, H2, H3). Bold and italic text. Inline code. Links. Lists (unordered and ordered). Code block restoration. Line break conversion.

**Key Features:**

**Code block protection** prevents markdown processing inside code blocks. 
**Table parsing** supports markdown tables with `|` delimiters and header rows. 
**List handling** properly closes and nests `<ul>` and `<ol>` tags. 
**HTML escaping** safely escapes `<` and `>` in code blocks. 
**Language tagging** preserves language hints from code fences.

### Security Considerations

Code execution happens in the user's browser context. Be cautious with untrusted notebook files. Code has access to the global scope and DOM. Consider implementing additional sandboxing for public sites.

### Supported Code

Standard JavaScript (ES6+). Console methods (log, error). DOM manipulation. Async code (with await). Return values.

### Limitations

Only JavaScript code cells are executable. Python or other language cells are displayed but not executed. No persistent state between page reloads.

## Styling

The block uses CSS custom properties for theming:

```css
--background-color: Background color
--text-color: Text color
--primary-color: Primary accent (buttons, links, pagination)
--primary-hover-color: Hover state for primary buttons
--success-color: Success indicators
--error-color: Error indicators
--code-background: Code cell background
--light-color: Border colors
--disabled-color: Disabled button background
--focus-color: Focus outline color
```

### Reusable Content Styling Classes (NEW)

The ipynb-viewer block includes **opt-in CSS classes** for creating visually consistent educational notebooks, tutorials, and presentations. These classes provide 85-90% reduction in inline styles for notebooks using similar patterns.

**Color Variables:**
```css
--ipynb-card-gradient-start: #e3f2fd (light blue)
--ipynb-card-gradient-end: #bbdefb (medium blue)
--ipynb-card-accent: #0288d1 (blue accent)
--ipynb-card-text-dark: #212121 (dark text)
--ipynb-card-heading: #0d47a1 (heading color)
```

**Available Classes:**

**Component Classes:**

| Class | Purpose | Styling |
|-------|---------|---------|
| `.ipynb-hero-cell` | Hero/title sections | Blue gradient, 48px padding, centered text, shadow |
| `.ipynb-content-card` | Standard content cards | Blue gradient, 32px padding, 6px left border |
| `.ipynb-content-card-thin` | Content cards (thin border) | Blue gradient, 32px padding, 4px left border |
| `.ipynb-transition-card` | Transition/divider sections | Blue gradient, 24px padding, centered text |
| `.ipynb-section-header` | Section headers (H2 level) | 28px font, flex layout with icons |
| `.ipynb-subsection-header` | Subsection headers (H3 level) | 26px font, flex layout with icons |
| `.ipynb-body-text` | Body text | 16px font, 1.8 line-height |
| `.ipynb-icon-list` | List container | No bullets, removes padding |
| `.ipynb-icon-list-item` | List items with icons | Flex layout, 12px gap, bottom border |
| `.ipynb-code-inline` | Inline code snippets | Grey background, monospace font |

**Icon Sizing:**

| Class | Font Size |
|-------|-----------|
| `.ipynb-icon-emoji-small` | 20px |
| `.ipynb-icon-emoji` | 28px |
| `.ipynb-icon-emoji-large` | 56px |

**Typography Utilities:**

| Class | Purpose |
|-------|---------|
| `.ipynb-text-center` | Center align text |
| `.ipynb-font-light` | Font weight 300 |
| `.ipynb-font-medium` | Font weight 500 |
| `.ipynb-font-semibold` | Font weight 600 |
| `.ipynb-font-bold` | Font weight 700 |
| `.ipynb-font-extrabold` | Font weight 800 |
| `.ipynb-text-16` | Font size 16px |
| `.ipynb-text-18` | Font size 18px |
| `.ipynb-text-20` | Font size 20px |
| `.ipynb-text-26` | Font size 26px |
| `.ipynb-text-28` | Font size 28px |
| `.ipynb-text-48` | Font size 48px |
| `.ipynb-text-56` | Font size 56px |

**Layout Utilities:**

| Class | Purpose |
|-------|---------|
| `.ipynb-flex` | Display flex |
| `.ipynb-flex-center` | Flex with center alignment (both axes) |
| `.ipynb-flex-align-center` | Flex with vertical center alignment |
| `.ipynb-gap-8` | Gap 8px |
| `.ipynb-gap-12` | Gap 12px |
| `.ipynb-gap-16` | Gap 16px |

**Spacing Utilities:**

| Class | Purpose |
|-------|---------|
| `.ipynb-m-0` | Margin 0 |
| `.ipynb-mb-16` | Margin bottom 16px |
| `.ipynb-mb-20` | Margin bottom 20px |
| `.ipynb-mb-24` | Margin bottom 24px |
| `.ipynb-my-16` | Margin top/bottom 16px |

**Visual Effects:**

| Class | Purpose |
|-------|---------|
| `.ipynb-opacity-85` | Opacity 0.85 |
| `.ipynb-opacity-95` | Opacity 0.95 |
| `.ipynb-rounded-4` | Border radius 4px |

**Usage Examples:**

**NEW - Minimal inline styles (recommended):**

```html
<!-- Hero cell -->
<div class="ipynb-hero-cell">
  <h1 class="ipynb-text-48 ipynb-font-extrabold ipynb-m-0 ipynb-mb-16 ipynb-flex-center ipynb-gap-16">
    <span class="ipynb-icon-emoji-large">🗺️</span>
    <span>EDS Documentation Navigator</span>
  </h1>
  <p class="ipynb-text-20 ipynb-my-16 ipynb-opacity-95 ipynb-font-light">
    <strong class="ipynb-font-semibold">Lost in documentation?</strong> Not anymore!
  </p>
</div>

<!-- Content card -->
<div class="ipynb-content-card">
  <h3 class="ipynb-subsection-header">
    <span class="ipynb-icon-emoji">📚</span>
    What You'll Learn
  </h3>
  <ul class="ipynb-icon-list">
    <li class="ipynb-icon-list-item">
      <span class="ipynb-icon-emoji-small">📂</span>
      <span>Documentation structure and organization</span>
    </li>
    <li class="ipynb-icon-list-item">
      <span class="ipynb-icon-emoji-small">🔍</span>
      <span>How to find the right doc for your task</span>
    </li>
  </ul>
</div>

<!-- Transition card -->
<div class="ipynb-transition-card">
  <p class="ipynb-text-18 ipynb-font-medium ipynb-m-0">
    Now that you understand the structure, let's explore navigation...
  </p>
</div>
```

**OLD - With inline styles (still works):**

```html
<!-- Hero cell -->
<div class="ipynb-hero-cell">
  <h1 style="font-size: 48px; font-weight: 800;">
    <span class="ipynb-icon-emoji-large">🗺️</span>
    <span>EDS Documentation Navigator</span>
  </h1>
  <p style="font-size: 20px;">
    Lost in documentation? Not anymore!
  </p>
</div>

<!-- Content card -->
<div class="ipynb-content-card">
  <h3 class="ipynb-section-header">
    <span class="ipynb-icon-emoji">📚</span>
    What You'll Learn
  </h3>
  <ul class="ipynb-icon-list">
    <li class="ipynb-icon-list-item">
      <span class="ipynb-icon-emoji-small">📂</span>
      <span>Documentation structure and organization</span>
    </li>
  </ul>
</div>
```

**Features:**
- ✅ **Opt-in** - Only applies when you use the classes (backward compatible)
- ✅ **Responsive** - Automatically adjusts padding and font sizes on mobile
- ✅ **Overlay compatible** - Works in paged, notebook, and autorun modes
- ✅ **Themeable** - Change colors via CSS variables
- ✅ **Consistent** - Based on 92% styling commonality analysis

**Examples:**
See [docs-navigation.ipynb](../../docs-navigation.ipynb) for a complete example using all reusable classes.

### Auto-Wrapping in Notebook Mode (NEW)

When using the **notebook variation** (`| IPynb Viewer (notebook) |`), the block automatically wraps markdown cells with appropriate styling classes based on content patterns. This means you can write **pure markdown** without any HTML wrappers!

**How It Works:**

The viewer automatically detects cell types based on content patterns:

1. **Hero Cell** - First cell (index 0) with `# ` heading → wrapped with `ipynb-hero-cell`
2. **Intro Cell** - Early cells (index ≤ 2) with `## ` heading → wrapped with `ipynb-content-card` (thick 6px border)
3. **Transition Cell** - Short cells (≤3 lines) without headers → wrapped with `ipynb-transition-card`
4. **Content Cell** - All other cells → wrapped with `ipynb-content-card-thin` (thin 4px border)

**Usage Example:**

Instead of writing HTML wrappers manually:

```html
<!-- OLD: Manual HTML wrapping -->
<div class="ipynb-hero-cell">
  <h1 class="ipynb-text-48 ipynb-font-extrabold...">
    🗺️ EDS Documentation Navigator
  </h1>
  <p class="ipynb-text-20...">
    Lost in documentation? Not anymore!
  </p>
</div>
```

Just write **pure markdown** in notebook mode:

```markdown
# 🗺️ EDS Documentation Navigator

**Lost in documentation?** Not anymore! This guide helps you navigate comprehensive EDS documentation.
```

The viewer automatically:
- Detects this is the first cell with `# ` heading (hero pattern)
- Wraps it with `<div class="ipynb-hero-cell">...</div>`
- Applies all CSS styling from the class

**Benefits:**

✅ **90% less authoring work** - Write pure markdown, no HTML wrappers
✅ **Automatic styling** - Pattern-based detection handles wrapping
✅ **Maintainable** - Change styles in CSS, not in every notebook
✅ **Clean content** - Notebooks are pure markdown, easier to read/edit
✅ **Version control friendly** - Smaller diffs, clearer changes
✅ **Backward compatible** - Existing HTML-wrapped cells still work
✅ **Smart TOC integration** - Hamburger menu detects cells via CSS classes, works seamlessly with auto-wrapped content

**More Examples:**

```markdown
## 📍 What is This?

The `docs/for-ai` directory contains detailed guides...
```
→ Auto-wrapped with `ipynb-content-card` (intro cell)

```markdown
### 📚 What You'll Learn

- Documentation structure
- Navigation strategies
- Pro tips
```
→ Auto-wrapped with `ipynb-content-card-thin` (content cell)

```markdown
Now let's explore navigation based on YOUR role...
```
→ Auto-wrapped with `ipynb-transition-card` (short transition cell)

**When to Use:**

- ✅ Educational notebooks and tutorials
- ✅ Documentation navigation guides
- ✅ Multi-section content with transitions
- ✅ Any notebook in **notebook mode**
- ✅ Can mix with custom HTML for specific cells needing special styling

**Mixing Auto-Wrapping with Custom HTML:**

You can combine both approaches in the same notebook for maximum flexibility:

```markdown
<!-- Most cells: pure markdown (auto-wrapped) -->
# Section Title

Regular content that gets auto-wrapped...

## Subsection

More content here...

<!-- Special cell: custom HTML for unique styling -->
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 48px; margin: 0; text-align: center; color: white;">

<h2 style="font-size: 36px; font-weight: 800; margin: 0;">🎯 Special Highlight</h2>

<p style="font-size: 20px; margin: 16px 0;">This cell has custom purple gradient for emphasis</p>

</div>
```

**This hybrid approach gives you:**
- ✅ Speed of pure markdown for most content (90% less code)
- ✅ Flexibility of custom HTML where you need it
- ✅ Works for both educational AND presentation style notebooks

**Note:** Auto-wrapping only activates in **notebook mode**. In default, paged, or autorun modes, use manual HTML wrappers as shown in the examples above.

### Customizing Auto-Wrap Styles

Developers can customize the appearance of auto-wrapped cells by modifying the CSS classes in `ipynb-viewer.css`. All auto-wrap styling is controlled through four main CSS classes:

**CSS Classes for Auto-Wrapping:**

```css
/* Hero Cell - First cell with # heading */
.ipynb-hero-cell {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 48px 32px;
  margin: 0 0 32px 0;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

/* Intro/Content Card - Early cells with ## heading (thick border) */
.ipynb-content-card {
  background: white;
  border-left: 6px solid #1976d2;
  border-radius: 8px;
  padding: 24px;
  margin: 0 0 24px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Content Card Thin - Standard cells with ### heading (thin border) */
.ipynb-content-card-thin {
  background: white;
  border-left: 4px solid #42a5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 0 0 20px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* Transition Card - Short cells without headings */
.ipynb-transition-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  padding: 20px;
  margin: 0 0 24px 0;
  text-align: center;
  font-style: italic;
  color: #555;
}
```

**How to Customize:**

1. **Locate the CSS file:** `/blocks/ipynb-viewer/ipynb-viewer.css`

2. **Find the class you want to modify:** Search for `.ipynb-hero-cell`, `.ipynb-content-card`, `.ipynb-content-card-thin`, or `.ipynb-transition-card`

3. **Modify the styles:** Change colors, spacing, borders, shadows, etc.

**Example Customizations:**

```css
/* Example: Change hero cell to solid color instead of gradient */
.ipynb-hero-cell {
  background: #1976d2; /* Solid blue instead of gradient */
  padding: 60px 40px; /* More padding */
}

/* Example: Use right border instead of left for content cards */
.ipynb-content-card-thin {
  border-left: none;
  border-right: 4px solid #42a5f5;
}

/* Example: Remove shadows for flat design */
.ipynb-content-card,
.ipynb-content-card-thin {
  box-shadow: none;
  border: 1px solid #e0e0e0; /* Add subtle border instead */
}

/* Example: Change transition card styling */
.ipynb-transition-card {
  background: #fff3e0; /* Light orange */
  border-top: 2px dashed #ff9800;
  border-bottom: 2px dashed #ff9800;
  font-weight: 600;
}
```

**Detection Logic Location:**

The pattern detection that determines which class to apply is in `ipynb-viewer.js`:

```javascript
// Function: detectCellType(content, index)
// Lines: ~168-188

// Patterns:
// - Hero: index === 0 && content.includes('# ')
// - Intro: index <= 2 && content.includes('## ')
// - Transition: lines.length <= 3 && no headers
// - Content: everything else
```

**Customizing Detection Patterns:**

If you want to change WHEN cells get certain classes, modify the `detectCellType()` function in `ipynb-viewer.js`:

```javascript
function detectCellType(content, index) {
  // Example: Make first 5 cells use intro styling instead of 2
  if (index <= 4 && content.includes('## ')) {
    return 'intro';
  }

  // Example: Longer transition cells (5 lines instead of 3)
  const lines = content.trim().split('\n').filter(line => line.trim());
  if (lines.length <= 5 && !content.includes('##') && !content.includes('###')) {
    return 'transition';
  }

  // ... rest of function
}
```

**Important Notes:**

- ✅ Changes apply to ALL notebooks using notebook mode
- ✅ Styles are centralized - change once, affects all auto-wrapped notebooks
- ✅ Use CSS variables for easy theming across multiple classes
- ⚠️ Detection logic changes require JavaScript modification
- ⚠️ Test changes with multiple notebooks to ensure consistency

**CSS Variables for Theming:**

For easier customization, consider using CSS variables:

```css
:root {
  --hero-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-border-thick: 6px;
  --card-border-thin: 4px;
  --card-border-color: #1976d2;
  --transition-bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.ipynb-hero-cell {
  background: var(--hero-bg);
}

.ipynb-content-card {
  border-left: var(--card-border-thick) solid var(--card-border-color);
}

.ipynb-content-card-thin {
  border-left: var(--card-border-thin) solid var(--card-border-color);
}
```

### Action Cards (NEW)

Action cards provide a beautiful, interactive way to display navigation links in any markdown cell. Use pure markdown with a special HTML comment marker to automatically style a list of links as colored action cards.

**Usage Examples:**

In a hero cell:
```markdown
# 🗺️ Documentation Navigator

Lost in documentation? Not anymore! This interactive guide helps you navigate comprehensive documentation like a pro.

<!-- action-cards -->

- [Getting Started](#)
- [Navigation Strategies](#)
- [Best Practices](#)
```

In a content cell:
```markdown
### 📚 Quick Links

<!-- action-cards -->

- [View Source Code](https://github.com/...)
- [Run Live Demo](#)
- [Read API Docs](#)
```

**How It Works:**

1. Add an HTML comment `<!-- action-cards -->` in your markdown cell
2. Follow it with a markdown list of links
3. Use simple link text that matches heading text in other cells
4. **Links are automatically resolved at runtime** - JavaScript finds matching headings and updates hrefs
5. All cards use consistent blue styling

**Features:**

- ✅ **Pure markdown** - No manual HTML required
- ✅ **Works in any cell type** - Hero cells, content cells, intro cells, transition cells
- ✅ **Smart link resolution** - Automatically finds matching headings at runtime
- ✅ **No hardcoded cell IDs** - Just use descriptive link text
- ✅ **Consistent blue design** - Professional, clean appearance
- ✅ **Hover effects** - Cards lift up and arrow slides right on hover
- ✅ **Auto-styled links** - Links become full-width interactive elements
- ✅ **Right arrows** - Automatically added arrow (→) on the right side

**CSS Classes:**

Action card styling is controlled by these CSS classes in `ipynb-viewer.css`:

```css
/* Action Cards Container */
.ipynb-action-cards {
  list-style: none;
  padding: 0;
  margin: 24px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Individual Action Card */
.ipynb-action-card {
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Blue styling for all action cards */
.ipynb-action-card-blue {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid #2196f3;
}
```

**Link Resolution:**

Action cards use smart link resolution at runtime:
- Link text is matched against heading text in all cells
- JavaScript automatically finds the target cell and updates the href
- No need to hardcode cell IDs or indices
- Just use descriptive link text that matches your headings

**Example:**
```markdown
- [Getting Started](#)  →  Finds cell with heading containing "Getting Started"
- [Best Practices](#)   →  Finds cell with heading containing "Best Practices"
```

**Customization:**

You can customize action card appearance by modifying `.ipynb-action-card-blue` in `ipynb-viewer.css`:
- Change gradient colors in the background property
- Adjust border-left color and width
- Modify padding, gap, and border-radius
- Customize hover effects (transform, box-shadow)
- Change arrow style in `.ipynb-action-card a::after`

**Note:** Action cards work in all display modes (default, paged, autorun, notebook), in any cell type (hero, intro, content, transition), and complement the auto-wrapping system perfectly.

### Header Styles

The header section includes CSS classes for metadata display:

```css
.ipynb-viewer-header: Header container (centered, padded, bordered)
.ipynb-viewer-title: Notebook title (1.8rem, bold, #333)
.ipynb-viewer-description: Description (1.1rem, italic, #555)
.ipynb-viewer-author: Author name (1rem, italic, #666)
.ipynb-viewer-date: Publication date (0.9rem, #999)
.ipynb-viewer-version: Version number (0.85rem, #888, bold)
.ipynb-viewer-meta-row: Container for badges (flexbox, centered)
.ipynb-viewer-category: Category badge (blue background, #1565c0)
.ipynb-viewer-difficulty: Difficulty badge (orange background, #e65100)
.ipynb-viewer-duration: Duration badge (purple background, #6a1b9a)
.ipynb-viewer-tags: Tags container (flexbox, centered)
.ipynb-viewer-tag: Individual tag (gray background, #555)
.ipynb-viewer-license: License text (0.8rem, #888)
```

### Paged Variation Styles

The paged variation adds overlay-specific CSS:

```css
.ipynb-paged-start-button: Start Reading button
.ipynb-paged-overlay: Full-screen overlay container
.ipynb-paged-overlay-content: Content area (90vw × 90vh)
.ipynb-paged-close: Close button (top-right)
.ipynb-paged-cell-area: Scrollable cell content area
.ipynb-pagination: Pagination controls (in overlay footer)
.ipynb-pagination-button: Previous/Next button styles
.ipynb-page-indicator: Page number display
```

Overlay is fully responsive with breakpoints at 768px and 480px. **Desktop** uses 90vw × 90vh with border radius. **Tablet** uses 95vw × 95vh. **Mobile** uses 100vw × 100vh (full screen, no border radius).

## Accessibility

Semantic HTML structure. ARIA labels on interactive buttons. Keyboard navigation support. Focus indicators on buttons. Screen reader friendly.

## Mobile Support

Responsive layout for all screen sizes. Touch-friendly buttons. Horizontal scrolling for long code. Stacked layout on small screens.

## Browser Compatibility

Modern browsers with ES6+ support. Fetch API required. CSS custom properties support. No IE11 support.

## File Structure

```
blocks/ipynb-viewer/
├── ipynb-viewer.js       # Main block logic
├── ipynb-viewer.css      # Block styles
├── README.md             # This file
├── EXAMPLE.md            # Usage examples
└── test.html             # Development test file
```

## Development

### Testing Locally

1. Start the development server:
   ```bash
   npm run debug
   ```

2. Access the test file:
   ```
   http://localhost:3000/blocks/ipynb-viewer/test.html
   ```

### Creating Test Notebooks

Create a `.ipynb` file in JSON format:

```json
{
  "cells": [
    {
      "cell_type": "markdown",
      "source": ["# Test\n", "Content here"]
    },
    {
      "cell_type": "code",
      "source": ["console.log('test');\n", "return 123;"]
    }
  ],
  "metadata": {
    "title": "Test Notebook"
  }
}
```

## Related Documentation

See [EDS Block Development](../../.claude/skills/eds-block-development/SKILL.md), [Jupyter Notebook Testing](../../docs/for-ai/explaining-jupyter.md), and [EDS Native Testing](../../docs/for-ai/testing/eds-native-testing-standards.md).

## Tips

**Test your notebooks** by verifying notebook JSON structure is valid. 
**Keep code simple** since complex dependencies may not work in browser context. 
**Use console.log** to help debug execution issues. 
**Mobile testing** checks layout on different screen sizes. 
**Error handling** wraps risky code in try-catch blocks.

## Common Issues

### Notebook Won't Load

Check file path is correct. Verify JSON structure is valid. Check browser console for fetch errors. Ensure CORS headers allow notebook file access.

### Code Won't Execute

Verify code is JavaScript (not Python/other languages). Check for syntax errors in code cells. Look for console errors during execution. Ensure code doesn't rely on Node.js-specific APIs.

### Styling Issues

Check CSS custom properties are defined. Verify block CSS is loaded. Test with different viewport sizes. Check for CSS conflicts with site styles.

## Future Enhancements

Potential improvements for future versions:

**Implemented ✅:**
- ~~URL hash support for deep linking~~ (DONE - Link navigation implemented)
- ~~Autorun mode for automatic execution~~ (DONE - Autorun variation implemented)
- ~~Combined variations~~ (DONE - Notebook variation implemented)

**Planned:**
- Syntax highlighting for code cells
- Cell execution order tracking
- Persistent cell outputs across page reloads
- Export results to file (JSON, HTML)
- Support for cell metadata (collapsed, hidden)
- Image output support (PNG, SVG)
- Rich output display (HTML, SVG, tables)
- Group cells by headers (e.g., one H2 section per page)
- Page jump navigation with dropdown selector

## Recent Changes

### 2025-01-20 - Auto-Wrapping in Notebook Mode (v7)

**Added Automatic Content Wrapping for Educational Notebooks:**
- ✅ **Pure markdown authoring** - Write plain markdown, no HTML wrappers needed
- ✅ **Pattern-based detection** - Automatically detects hero, intro, transition, and content cells
- ✅ **Smart wrapping** - Applies appropriate CSS classes based on cell patterns
- ✅ **90% less code** - Eliminates need for manual HTML div wrappers
- ✅ **Notebook mode only** - Auto-wrapping activates in `notebook` variation
- ✅ **Backward compatible** - Existing HTML-wrapped cells continue to work

**Detection Patterns:**
- **Hero Cell**: First cell (index 0) with `# ` heading → `ipynb-hero-cell`
- **Intro Cell**: Early cells (index ≤ 2) with `## ` heading → `ipynb-content-card` (thick border)
- **Transition Cell**: Short cells (≤3 lines) without headers → `ipynb-transition-card`
- **Content Cell**: All other cells with headers → `ipynb-content-card-thin` (thin border)

**Technical Implementation:**
- `ipynb-viewer.js` lines 162-207: Added `detectCellType()` and `wrapMarkdownContent()` functions
- `ipynb-viewer.js` line 218: Modified `createMarkdownCell()` to accept `autoWrap` parameter
- `ipynb-viewer.js` line 1164: Pass `isNotebook` flag to enable auto-wrapping

**Usage Example:**

Before (manual wrapping):
```html
<div class="ipynb-hero-cell">
  <h1 class="ipynb-text-48...">Title</h1>
  <p class="ipynb-text-20...">Description</p>
</div>
```

After (pure markdown):
```markdown
# Title

**Description** - Just write markdown!
```

**Benefits:**
- Cleaner notebook files - pure markdown is easier to read and edit
- Version control friendly - smaller diffs, clearer changes
- Faster authoring - no need to remember HTML class names
- Consistent styling - automatic pattern matching ensures uniformity

### 2025-01-20 - Reusable Content Styling Classes (v6)

**Added Opt-In CSS Classes for Visual Consistency:**
- ✅ **45+ reusable classes** - Component, typography, layout, and utility classes
- ✅ **CSS variables** - Themeable color scheme (blue gradient palette)
- ✅ **90-95% style reduction** - Dramatically reduces inline styles in notebooks
- ✅ **Backward compatible** - Opt-in classes don't affect existing notebooks
- ✅ **Responsive** - Mobile breakpoints adjust padding and font sizes
- ✅ **Overlay support** - Works in paged, notebook, and autorun modes
- ✅ **Based on data** - Extracted from 92% styling commonality analysis

**Component Classes (13):**
- `.ipynb-hero-cell` - Hero/title sections with gradient and shadow
- `.ipynb-content-card` - Standard content cards (6px border)
- `.ipynb-content-card-thin` - Content cards with thin border (4px)
- `.ipynb-transition-card` - Transition sections with centered text
- `.ipynb-section-header` / `.ipynb-subsection-header` - Styled headers with icon support
- `.ipynb-body-text` - Consistent body text styling
- `.ipynb-icon-list` / `.ipynb-icon-list-item` - Icon lists with flex layout
- `.ipynb-code-inline` - Inline code styling
- `.ipynb-icon-emoji` / `-large` / `-small` - Icon emoji sizing utilities

**Typography Utilities (13):**
- Text alignment: `.ipynb-text-center`
- Font weights: `.ipynb-font-light` / `-medium` / `-semibold` / `-bold` / `-extrabold`
- Font sizes: `.ipynb-text-16` / `-18` / `-20` / `-26` / `-28` / `-48` / `-56`

**Layout Utilities (6):**
- Flexbox: `.ipynb-flex` / `.ipynb-flex-center` / `.ipynb-flex-align-center`
- Gaps: `.ipynb-gap-8` / `-12` / `-16`

**Spacing Utilities (5):**
- Margins: `.ipynb-m-0` / `.ipynb-mb-16` / `-20` / `-24` / `.ipynb-my-16`

**Visual Effects (3):**
- Opacity: `.ipynb-opacity-85` / `-95`
- Border radius: `.ipynb-rounded-4`

**Technical Implementation:**
- `ipynb-viewer.css` lines 4-11: Added color CSS variables
- `ipynb-viewer.css` lines 279-519: Added 45+ component and utility classes
- `ipynb-viewer.css` lines 695-756: Mobile responsive adjustments for all classes
- `ipynb-viewer.css` lines 922-938: Overlay mode overrides for font inheritance
- `README.md` lines 715-870: Complete documentation with both old and new usage examples

**Example Usage:**
```html
<div class="ipynb-content-card">
  <h3 class="ipynb-section-header">
    <span class="ipynb-icon-emoji">📚</span>
    Section Title
  </h3>
  <div class="ipynb-body-text">Content here</div>
</div>
```

**Benefits:**
- Consistent visual design across educational notebooks
- Easy theming via CSS variables
- Significantly smaller HTML payloads
- Maintainable - change styles in one place

**See:** [docs-navigation.ipynb](../../docs-navigation.ipynb) for complete implementation example

### 2025-01-20 - Action Cards for Pure Markdown Navigation (v9)

**Added Action Card Feature:**
- ✅ **Pure markdown action cards** - Convert lists to styled navigation cards with HTML comment marker (`<!-- action-cards -->`)
- ✅ **Smart link resolution** - Automatically finds matching headings at runtime, no hardcoded cell IDs needed
- ✅ **Consistent blue design** - Professional appearance without emoji clutter
- ✅ **Interactive hover effects** - Cards lift up and arrows slide right on hover
- ✅ **Auto-styled arrows** - Right-pointing arrows (→) automatically added to all action card links
- ✅ **In-notebook navigation** - JavaScript resolves links by matching text to headings
- ✅ **All display modes** - Compatible with default, paged, autorun, and notebook modes

**Technical Implementation:**
- `ipynb-viewer.js` (lines 267-271): Added action card detection in `createMarkdownCell()` after rendering HTML
- `ipynb-viewer.js` (lines 210-263): New `styleActionCards()` function with smart link resolution
  - Finds `<!-- action-cards -->` comment in rendered HTML
  - Locates following `<ul>` element
  - Adds `.ipynb-action-cards` and `.ipynb-action-card-blue` classes
  - **Runtime link resolution**: Searches all cells for headings matching link text
  - Automatically updates href to point to correct cell (`#cell-{index}`)
  - No hardcoded cell IDs required - just descriptive link text
- `ipynb-viewer.css` (lines 332-381): New CSS classes for action card styling
  - Container styling with flexbox layout and gap spacing
  - Card styling with blue gradients, borders, shadows, and hover effects
  - Left-aligned text with `justify-content: flex-start` and `width: 100%`
  - Auto-generated arrows with smooth slide animation on hover

**Benefits:**
- Write pure markdown, no manual HTML required
- No fragile hardcoded cell IDs or indices
- Links automatically adapt to heading changes
- Beautiful visual navigation without complexity
- Consistent styling across all notebooks
- Gracefully degrades (links work without JavaScript)

**Usage Example:**
```markdown
# Hero Title

<!-- action-cards -->

- [Getting Started](#)
- [Navigation Strategies](#)
- [Best Practices](#)
```

Link text is matched against headings at runtime - no cell IDs needed!

### 2025-01-20 - Auto-Wrapping Pattern Detection Updates (v8)

**Improved TOC Generation for Auto-Wrapped Notebooks:**
- ✅ **Class-based detection** - TOC now detects hero/transition cells via CSS classes (`.ipynb-hero-cell`, `.ipynb-transition-card`)
- ✅ **Removed hardcoded text patterns** - No longer relies on specific content like "Now that you understand"
- ✅ **Cleaner TOC** - Cells without headings are skipped entirely (no more "Cell X" entries)
- ✅ **Reduced whitespace** - TOC menu now shows only relevant items with proper dividers
- ✅ **Full auto-wrap compatibility** - Works seamlessly with pure markdown notebooks using auto-wrapping

**Technical Implementation:**
- `ipynb-viewer.js` (lines 558-586): Updated TOC extraction to use class-based detection
  - Hero cells: Detected by `.ipynb-hero-cell` wrapper (previously looked for `h1[style*="font-size: 48px"]`)
  - Transition cells: Detected by `.ipynb-transition-card` wrapper (previously checked hardcoded text)
  - Cells without headings: Now skipped with `itemType = 'skip'` (previously showed as "Cell X")
- Removed hardcoded transition text patterns: "Now that you understand", "Individual tasks are important", etc.

**Benefits:**
- Works with any auto-wrapped notebook regardless of content
- No maintenance needed when notebook text changes
- Consistent with auto-wrapping pattern detection in `detectCellType()`
- Cleaner, more focused table of contents

**Migration:** Notebooks using manual HTML wrappers should convert to pure markdown with auto-wrapping for best results. See "Auto-Wrapping in Notebook Mode" section below.

### 2025-01-19 - Hamburger Menu Navigation for Notebook Mode (v5)

**Added Table of Contents Navigation:**
- ✅ **Hamburger menu button** - Positioned left of close button in notebook mode overlay
- ✅ **Dropdown TOC** - Lists all cells with headings for quick navigation
- ✅ **Smart filtering** - Excludes hero cells (title slides) from TOC
- ✅ **Visual dividers** - Shows horizontal rules where transition cells appear
- ✅ **Jump navigation** - Click any item to jump directly to that cell/page
- ✅ **Click-outside to close** - Dropdown closes when clicking elsewhere
- ✅ **Keyboard accessible** - Full ARIA support with role="menu" and menuitem

**Technical Implementation:**
- `ipynb-viewer.js`: Added hamburger button creation and TOC extraction logic (lines 477-567)
- `ipynb-viewer.css`: Added styles for `.ipynb-hamburger-menu`, `.ipynb-toc-dropdown`, `.ipynb-toc-item`, `.ipynb-toc-divider`
- Detects hero cells by `.ipynb-hero-cell` class (updated in v8 for auto-wrap compatibility)
- Detects transition cells by `.ipynb-transition-card` class (updated in v8 for auto-wrap compatibility)
- Extracts titles from h1, h2, h3 elements for TOC entries

**Visual Structure:**
- Hamburger button: Circular, positioned at `top: 1rem; right: 5rem`
- Dropdown: White background, rounded corners, scrollable up to 400px height
- Menu items: Full-width buttons with hover effects
- Dividers: 2px grey horizontal rules with margin

### 2025-01-19 - Cell Structure Consistency for Overlay Stability (v4)

**Fixed Content-Level Jumping in Paged Overlay:**
- ✅ **Root cause identified** - `<section>` tags and inconsistent H2/H3 structure caused height differences
- ✅ **Standardized cell structure** - Removed all semantic HTML wrappers from notebook cells
- ✅ **Consistent margins** - H2: 24px, H3: 20px (was mixed with 24px)
- ✅ **Border hierarchy** - H2 major sections: 6px, H3 subsections: 4px
- ✅ **Documentation updated** - All presentation templates and guides now enforce consistent structure

**Updated Documentation & Templates:**
- ✅ **presentation-template.ipynb** - Removed `<section>` tags, standardized margins
- ✅ **docs-navigation.ipynb** - Fixed all 44 cells for identical structure
- ✅ **create-presentation skill** - Updated with NO section tags guidance
- ✅ **explaining-presentation-notebooks.md** - Added structure consistency requirements

**Technical Changes:**
- `docs-navigation.ipynb`: Removed 6 `<section>` tags and H2 headers from "Part X" cells
- `docs/for-ai/templates/ipynb/presentation-template.ipynb`: Removed `<section>` tags, fixed H3 margins
- `.claude/commands/create-presentation.md`: Added section tag warning and border hierarchy
- `.claude/skills/create-presentation/SKILL.md`: Version 1.0.4 with structure standards
- `docs/for-ai/explaining-presentation-notebooks.md`: Added border hierarchy and common mistakes

**Migration:** Existing notebooks with `<section>` tags or inconsistent margins may show slight visual jumping. For best results:
1. Remove all `<section id="...">` wrappers from cells
2. Ensure H3 headings use `margin-bottom: 20px` (not 24px)
3. Use border hierarchy: H2 cells 6px, H3 cells 4px

### 2025-01-19 - Presentation Overlay Stability & Consistency Fixes (v3)

**Fixed Multiple Overlays Stacking (Critical):**
- ✅ **Cleanup on creation** - Remove existing overlays before creating new ones
- ✅ **No duplicates** - Prevents multiple overlays from stacking on page re-renders
- ✅ **Stable behavior** - Eliminates unpredictable sizing from overlay multiplication
- ✅ **Memory efficient** - Old overlays properly removed from DOM

**Fixed Inconsistent Font Sizes in Paged Overlay:**
- ✅ **Respect inline styles** - Added `font-size: revert !important` for h1/h2/h3 in overlay
- ✅ **Preserve cell styling** - Inline font-size values (26px, 28px) now display correctly
- ✅ **Consistent typography** - All slides show same font sizes regardless of heading level
- ✅ **No CSS override** - Base heading sizes no longer override inline styles in overlay

**Fixed Overlay Jumping Between Slides:**
- ✅ **Vertically centered** - Changed back to `align-items: center` for better positioning
- ✅ **Absolutely locked height** - Used `!important` on all height properties (85vh)
- ✅ **Fixed flex layout** - Cell area uses `flex: 1 1 0 !important` with explicit constraints
- ✅ **Scroll containment** - Content scrolls inside cell area, overlay never resizes
- ✅ **Zero movement** - Overlay maintains exact size regardless of content length

**Fixed Navigation Hover Effects:**
- ✅ **No inline JavaScript** - Replaced `onmouseover`/`onmouseout` with CSS `:hover`
- ✅ **Security compliant** - Browsers block inline JavaScript with `innerHTML`
- ✅ **Consistent hover** - Background changes to #f5f5f5 on hover for all nav links

**Technical Changes:**
- `blocks/ipynb-viewer/ipynb-viewer.js` lines 443-445: Remove existing overlays on creation
- `blocks/ipynb-viewer/ipynb-viewer.css` lines 499-511: Overlay centered with `align-items: center`
- `blocks/ipynb-viewer/ipynb-viewer.css` lines 532-536: Content box locked at 85vh with `!important`
- `blocks/ipynb-viewer/ipynb-viewer.css` lines 572-578: Cell area flex properties with `!important`
- `blocks/ipynb-viewer/ipynb-viewer.css` lines 603-608: Heading font-size uses `revert !important`
- `blocks/ipynb-viewer/ipynb-viewer.css` line 653: Pagination flex-shrink with `!important`

**Affected Use Cases:**
- All presentation notebooks with paged overlay mode
- Notebooks with varying content heights between slides
- Pages that re-render or re-decorate the ipynb-viewer block
- Any paged variation with inline styled headings

**Migration:** No action required - fixes apply automatically. The overlay is now completely stable with consistent sizing, typography, and no duplicate instances.

### 2025-01-18 - Notebook Variation & Overlay Improvements

**Notebook Variation Behavior Changes:**
- ❌ **Removed autorun** - Notebook variation no longer auto-executes code cells on page load
- ✅ **Added close button** - Close (×) button now visible in paged overlay for notebook variation
- ✅ **Manual execution** - Users must click "Run" buttons to execute code cells
- ✅ **Improved UX** - Consistent behavior with better user control

**Preview Overlay Enhancements (`showPreview()`):**
- ✅ **Always show controls** - Header with close button and responsive view buttons always visible
- ✅ **Removed notebook-mode hiding** - Preview overlays display consistently in all modes
- ✅ **ESC key hierarchy** - ESC key respects overlay stack (closes paged/manual overlays before preview)
- ✅ **Global ESC support** - ESC key works from anywhere on page, not just when overlay has focus
- ✅ **Proper cleanup** - Event listeners properly removed when overlay closes

**Technical Changes:**
- `blocks/ipynb-viewer/ipynb-viewer.js` line 946: Removed `isNotebook` from autorun condition
- `blocks/ipynb-viewer/ipynb-viewer.js` lines 461-462: Removed close button hiding logic
- `scripts/ipynb-helpers.js` lines 152-167: Added overlay hierarchy detection for ESC key
- `scripts/ipynb-helpers.js` line 184: Changed ESC handler from overlay to document level

**Migration Guide:**
If you're using the notebook variation and expecting autorun behavior, you'll need to:
1. Update your content to instruct users to click Run buttons
2. Or use the `autorun` variation explicitly if you need automatic execution
3. Update any documentation referencing hidden close buttons in notebook mode
