# IPynb Viewer Block

Display and execute Jupyter notebook (.ipynb) files directly in your EDS site with interactive JavaScript execution capabilities.

## Overview

The IPynb Viewer block is a comprehensive, production-ready system for displaying Jupyter notebooks as interactive web content. It supports multiple display modes, JavaScript code execution, smart navigation, bookmarking, and extensive customization options. This block transforms static .ipynb files into dynamic, executable tutorials, demonstrations, and educational content.

**Block Type:** Complex Build-Enhanced Block

**Architecture:** Version 3.0 introduces a unified overlay system (branch: `refactor/ipynb-viewer-unified-overlay`) that eliminates multiple overlay confusion through mode switching. See [Architecture](#unified-overlay-architecture-version-30) section below for details.

**Use Cases:**

- Interactive coding tutorials with live JavaScript execution
- Step-by-step technical documentation with runnable examples
- Educational notebooks for teaching JavaScript concepts
- Data visualization and exploration tools
- Block testing and demonstration environments
- Reference documentation with executable code samples

## Features

### Core Capabilities

**Parse and Display Notebooks** - Renders both markdown and code cells from .ipynb files with full formatting support.

**Interactive Execution** - Run JavaScript code cells individually with async/await support and browser-native execution.

**Cell Independence** - Run any cell at any time in any order with no initialization required. Each cell imports what it needs independently.

**Browser Execution** - Runs JavaScript code directly in the browser with native APIs and direct ES6 imports.

**Output Display** - Shows console logs, results, and errors inline with visual indicators for success/error states.

### Display Modes

**Basic Mode** - Default display with all cells visible and run buttons for code execution.

**Paged Variation** - Display cells one at a time with Previous/Next navigation in full-screen overlay.

**Autorun Mode** - Automatically execute code cells without Run buttons - perfect for demos.

**Notebook Variation** - Combined manual and paged modes with visible close button and help system.

**Index Variation** - Auto-opens overlay on page load - perfect for landing pages and documentation indexes.

**No-Topbar Variation** - Hide top bar for immersive, distraction-free experiences - combines with any mode.

### Navigation Features

**Link Navigation** - Navigate between overlays using hash targets in markdown cells.

**Navigation Tree** - Hierarchical tree panel with organized sections: Notebook (parts/cells) and Repository (Chapters, Appendix, Miscellaneous folders for easy file navigation).

**Navigation History** - Track and revisit up to 25 recently viewed cells and markdown files.

**Bookmarks** - Save favorite pages to localStorage for quick access anytime.

**Table of Contents** - Hamburger menu TOC in notebook mode with visual dividers and smart filtering.

### Content Features

**Auto-Wrapping** - Pure markdown authoring with automatic styling in notebook mode - 90% less code.

**Action Cards** - Beautiful navigation cards from pure markdown with emoji color indicators.

**GitHub Markdown Overlay** - Click GitHub .md links to view content in-app without leaving the page.

**Reusable Content Styling Classes** - 45+ opt-in CSS classes for consistent visual design across educational notebooks.

**Help System** - Built-in help documentation accessible via Help button.

### Advanced Features

**Overlay Previews** - Full-screen overlays for visual testing with responsive device views (mobile, tablet, desktop).

**Smart Cell Grouping** - Automatically combines instruction markdown with following code cells in paged mode.

**Metadata Display** - Shows title, author, date, version, category, difficulty, duration, tags, and license from notebook metadata.

**Enhanced Markdown Rendering** - Full support for all six heading levels (h1-h6), tables, code blocks, lists with inline formatting (bold/italic), blockquotes, and inline code. Inline HTML tags are automatically escaped and displayed as literal text, matching GitHub's markdown behavior. Processing order ensures bold/italic text works correctly within lists.

**Responsive Design** - Mobile-friendly layout with breakpoints at 768px and 480px.

**Accessibility** - Semantic HTML structure, ARIA labels, keyboard navigation, focus indicators, and screen reader support.

## Usage

### Basic Usage

Add the block to your page with a link to your notebook file:

`Basic Notebook Display`
`| IPynb Viewer |`
`|--------------|`
`| /path/to/notebook.ipynb |`

### With a Clickable Link

`Notebook with Link`
`| IPynb Viewer |`
`|--------------|`
`| [View Notebook](/path/to/notebook.ipynb) |`

### Paged Variation

Display notebook cells one at a time in a full-screen overlay with Previous/Next navigation:

`Paged Display Mode`
`| IPynb Viewer (paged) |`
`|----------------------|`
`| /path/to/notebook.ipynb |`

Features:

- Start Reading button clicks to enter full-screen reading mode
- Full-viewport overlay provides an immersive, distraction-free reading experience
- Smart cell grouping automatically combines instruction markdown with following code cells
- One page at a time lets you focus on current content without page jumping
- Previous/Next navigation navigates between logical pages with buttons
- Page indicator shows logical page count (e.g., "1 / 8" instead of raw cell count)
- Close button (×) exits overlay and returns to page
- Keyboard shortcuts: Arrow Left/Right navigates between pages, Escape closes overlay
- Responsive design adapts to mobile, tablet, and desktop
- Dark backdrop reduces distractions (95% opacity black)

### Autorun Variation

Automatically execute all code cells without requiring Run button clicks:

`Autorun Mode`
`| IPynb Viewer (autorun) |`
`|------------------------|`
`| /path/to/notebook.ipynb |`

Features:

- Automatic execution runs code cells immediately when displayed
- No Run buttons provides a cleaner, presentation-focused interface
- Output always visible shows results by default without user action
- Perfect for demos ideal for presentations and live demonstrations
- Still interactive users can re-run cells by refreshing or modifying code
- Works in all modes functions in both default view and paged overlay

Use Cases:

- Live presentations where code should execute automatically
- Demonstrations that don't require user interaction
- Educational content with pre-validated output
- Progressive examples that build on each other

### Notebook Variation

Combines manual and paged modes for the complete educational experience:

`Notebook Mode`
`| IPynb Viewer (notebook) |`
`|--------------------------|`
`| /path/to/notebook.ipynb |`

Features:

- Start Reading button opens paged overlay with manual code execution
- Read the Manual button provides access to block documentation
- Manual execution users click Run buttons to execute code cells (no autorun)
- Close button visible (×) button always visible in paged overlay for easy dismissal
- Preview headers visible showPreview() overlays display with full controls including close button
- Full integration combines all features (paging, manual execution, documentation)
- Perfect for tutorials complete learning experience with reference docs
- Side-by-side access switch between notebook and documentation easily
- ESC key support pressing ESC closes the topmost overlay (paged or preview)

Use Cases:

- Complete interactive tutorials with documentation
- Educational courses requiring reference material
- Complex demonstrations with help documentation
- Training materials with built-in guides

### Index Variation

Automatically opens the notebook overlay without requiring a button click - perfect for landing pages and documentation indexes:

`Index Mode - Auto-Open`
`| IPynb Viewer (index) |`
`|-----------------------|`
`| /path/to/notebook.ipynb |`

Features:

- Auto-open on page load - Notebook overlay opens automatically after 100ms (no button required)
- Instant immersion - Users immediately enter reading mode without clicking
- All notebook features - Includes navigation tree, bookmarks, history, help, and all controls
- Perfect for landing pages - Ideal for documentation indexes, home pages, or main entry points
- Close button visible - Users can exit to see the underlying page content
- Minimal friction - Removes the extra click to start reading

Use Cases:

- Documentation landing pages that should open immediately
- Main index pages for large documentation sites
- Welcome screens that guide users through content
- Single-page apps where the notebook IS the entire experience
- Tutorial launchers that start automatically

When to Use:

- ✅ Use index when the notebook is the primary content
- ✅ Use index for landing pages and documentation indexes
- ✅ Use index when you want immediate engagement
- ❌ Use notebook if the page has other content users should see first
- ❌ Use notebook if users should opt-in to the reading experience

### No-Topbar Variation

Hides the top bar (title and buttons) for a cleaner, more immersive reading experience. Can be combined with any display mode:

`No Top Bar - Immersive`
`| IPynb Viewer (paged no-topbar) |`
`|----------------------------------|`
`| /path/to/notebook.ipynb |`

Features:

- Hidden top bar - No title, buttons, or controls visible at the top
- Maximum content area - Content extends from top of overlay to pagination controls
- Immersive reading - Removes visual distractions for focused content consumption
- ESC key still works - Users can still exit using ESC key or backdrop click
- Works with any mode - Combine with paged, autorun, notebook, or index

Use Cases:

- Presentations where you want zero UI distraction
- Kiosk displays or embedded content
- Full-screen immersive experiences
- Content that doesn't need navigation controls
- Minimalist reading experiences

Combinations:
`| IPynb Viewer (index no-topbar) |` - Auto-opens with no top bar - perfect for immersive landing pages
`| IPynb Viewer (notebook no-topbar) |` - Full notebook experience with hidden top bar
`| IPynb Viewer (paged no-topbar) |` - Standard paged mode without the top bar

When to Use:

- ✅ Use no-topbar for immersive, distraction-free experiences
- ✅ Use no-topbar when content should be the sole focus
- ✅ Use no-topbar in kiosks or embedded displays
- ⚠️ Consider keeping top bar for complex notebooks with multiple sections
- ❌ Don't use no-topbar if users need easy access to help or controls

## Block Structure

The block supports standard Jupyter notebook JSON format with enhanced markdown rendering and metadata display.

### Notebook File Structure

`Minimal Notebook Structure`
`{`
`"cells": [`
`{`
`"cell_type": "markdown",`
`"source": ["# Title\\n", "Content here"]`
`},`
`{`
`"cell_type": "code",`
`"source": ["console.log('test');\\n", "return 123;"]`
`}`
`],`
`"metadata": {`
`"title": "My Notebook"`
`}`
`}`

### Metadata Fields

The notebook metadata is displayed in the header section:

**Required Fields:**

- title - Main notebook title (defaults to "Jupyter Notebook" if not provided)

**Optional Fields:**

- description - One-line summary displayed below title
- author - Author name
- date - Publication or creation date
- version - Version number (e.g., "1.0", "1.3")
- category - Content category (e.g., "tutorial", "reference", "demo") - displayed as blue badge
- difficulty - Skill level (e.g., "beginner", "intermediate", "advanced") - displayed as orange badge
- duration - Estimated reading time (e.g., "15 minutes", "1 hour") - displayed as purple badge
- tags - Array of keywords for searchability (e.g., ["tutorial", "javascript", "interactive"]) - displayed as gray tags
- license - Content license (e.g., "MIT", "CC BY 4.0")
- repo - Repository URL for automatically linking .md files in markdown cells (e.g., "https://github.com/username/repo")
  - **Format:** Base repository URL only - do NOT include `/blob/`, `/tree/`, branch name, or subdirectory paths
  - **Important:** Verify actual file locations in the repository first using `curl -I https://raw.githubusercontent.com/org/repo/main/file.md`
  - **How it works:** ipynb-viewer constructs full URLs as `${repoUrl}/blob/${branch}/${filename}` then transforms to raw URLs
  - **When provided:** Markdown links to .md files are automatically converted to full GitHub URLs and open in overlay
  - **When omitted:** Links render as-is (relative paths remain relative)
  - **Link syntax:** Use markdown syntax `[text](file.md)`, not inline code `` `file.md` ``
- help-repo - Repository URL for help documentation (e.g., "https://github.com/ddttom/allaboutV2")
  - **Fallback:** Uses `repo` if not specified, then defaults to allaboutV2
  - **Purpose:** Separate repository for help button (❓) documentation
  - **Use case:** When notebook content is from one repo but help docs are from viewer's repo
  - **Help button:** In notebook mode, displays a ❓ button that opens `docs/help.md` from the help-repo
- github-branch - GitHub branch to use when loading .md files (e.g., "main", "develop", "feature/new-docs")
  - **Default:** `"main"` if not specified
  - **Purpose:** Specify which branch to load markdown files from
  - **Use case:** Load docs from feature branch during development when files don't exist in main yet
  - **Applies to:** All .md file links and help button
- opening-page - Markdown file to automatically open when notebook starts (e.g., "preface.md", "#preface.md")
  - **Default:** None - notebook opens on first cell when metadata is omitted
  - **Purpose:** Automatically display a specific markdown file in overlay when notebook loads
  - **Format:** Filename with or without leading # (both work)
  - **Precedence:** URL hash takes precedence over metadata (allows user override via URL)
  - **Behavior without metadata:** When omitted and no URL hash present, notebook opens normally on first cell
  - **Graceful degradation:** Missing metadata doesn't break functionality - feature is completely optional
  - **Use case:** Open with a table of contents, preface, or README when user starts notebook
  - **Requires:** `repo` metadata must be set for GitHub markdown overlay to work

**Example metadata in .ipynb file:**
`Complete Metadata Example`
`{`
`"metadata": {`
`"title": "My Interactive Tutorial",`
`"description": "Learn JavaScript fundamentals through interactive examples",`
`"author": "Tom Cranstoun",`
`"date": "November 14, 2025",`
`"version": "1.0",`
`"category": "tutorial",`
`"difficulty": "intermediate",`
`"duration": "30 minutes",`
`"tags": ["tutorial", "javascript", "interactive", "beginner"],`
`"license": "MIT",`
`"repo": "https://github.com/username/repo",`
`"help-repo": "https://github.com/ddttom/allaboutV2",`
`"github-branch": "main",`
`"opening-page": "preface.md",`
`"kernelspec": {`
`"display_name": "JavaScript",`
`"language": "javascript",`
`"name": "jslab"`
`}`
`}`
`}`

**Display Order:**

1. Title (1.8rem, bold, centered)
2. Description (1.1rem, italic, gray #555)
3. Author (1rem, italic, gray #666)
4. Date (0.9rem, light gray #999)
5. Version (0.85rem, gray #888, bold)
6. Meta row badges (category, difficulty, duration) - color-coded badges
7. Tags (0.8rem, gray badges)
8. License (0.8rem, gray #888)

### Markdown Cells

**Code Blocks:**
Triple backtick code blocks with optional language specification. Proper syntax highlighting and formatting.

**Tables:**
Full markdown table support with headers. Alternating row colors for readability. Responsive table styling.

**Lists:**
Unordered lists with - or *. Ordered lists with 1., 2., etc. Proper indentation and spacing. **Critical:** Blank lines between list items are preserved correctly - lists remain continuous with sequential numbering (matches CommonMark/GFM spec).

**Inline Formatting:**
Headers (all six levels: H1-H6) with #, ##, ###, ####, #####, ######. Bold text with **text**. Italic text with *text*. Inline code with backticks. Links with [text](url). Line breaks. **Critical:** Bold and italic work correctly within lists (processing order: lists first, then bold/italic).

**Inline HTML Handling:**
Inline HTML tags (e.g., `<div>`, `<img>`, `<script>`) are automatically escaped and displayed as literal text, matching GitHub's markdown rendering behavior. This means:
- `<div>tag</div>` displays as visible text: `<div>tag</div>`
- Inline code like `` `<div>` `` renders correctly in `<code>` elements with full HTML entity escaping
- All special HTML characters in inline code are escaped: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`, `'` → `&#39;`
- Code blocks with HTML show syntax highlighting with proper escaping
- Legitimate markdown HTML (headings, links, images) renders normally

**Entity Escaping in Inline Code:**
When you write inline code with backticks, all HTML entities are properly escaped:
- `` `<div>` `` → displays as `<div>` (not rendered as HTML)
- `` `data-value="test"` `` → displays as `data-value="test"` (quotes preserved)
- `` `it's a test` `` → displays as `it's a test` (apostrophe preserved)
- `` `AT&T` `` → displays as `AT&T` (ampersand preserved)
This ensures code examples display exactly as written, preventing accidental HTML rendering

**Heading Level Best Practices:**
For notebooks with multiple sections (like tutorials, documentation, or educational content), use consistent heading levels to ensure proper outline structure in VSCode and other notebook viewers:

- **Use `##` (level-2) for main parts/sections** - Appears as top-level items in VSCode outline sidebar
- **Use `###` (level-3) for sub-sections** - Appears nested under the previous `##` heading
- **Avoid inconsistent levels** - Mixing `##` and `###` for same-level sections breaks navigation

**Why it matters:**

- VSCode outline sidebar displays level-2 headings (`##`) as main navigation items
- Level-3 headings (`###`) are nested or may not appear in outline at same level
- Consistent structure helps users navigate long notebooks effectively
- Example: If Parts 1-11 use `##`, Part 12 should also use `##` (not `###`)

**Example Structure:**

```markdown
## Part 1: Introduction          ← Main section (appears in outline)
### Getting Started              ← Sub-section (nested under Part 1)
### Key Concepts                 ← Sub-section (nested under Part 1)

## Part 2: Advanced Topics       ← Main section (same level as Part 1)
### Performance                  ← Sub-section (nested under Part 2)
```

**Critical: Proper Newline Formatting in Source Arrays**

Every line in a notebook cell's source array must end with `\n` (newline character) except the last line. Storing all content as a single massive string without newlines breaks VSCode outline parsing.

**Problem:**

```python
# ❌ WRONG - All content in single string
"source": [
  "### Heading**Content**More content---#### Sub-heading..."
]
```

VSCode outline shows no sub-sections because it can't parse the headings.

**Solution:**

```python
# ✅ CORRECT - Each line ends with \n
"source": [
  "### Heading\n",
  "\n",
  "**Content**\n",
  "\n",
  "More content\n",
  "\n",
  "---\n",
  "\n",
  "#### Sub-heading\n"
]
```

**Key rules:**

- Every line ends with `\n` except the very last line
- Headings need newlines before and after
- Horizontal rules: `"---\n"` followed by `"\n"`
- Blank lines between paragraphs: `"\n"`

**Symptoms of missing newlines:**

- Parts show in outline but have no sub-sections when expanded
- Cells with many `####` headings appear as flat content
- VSCode can't detect heading hierarchy

**See:** `LEARNINGS.md` section on "Jupyter Notebook Cell Source Must Use Proper Newlines" for complete details and real examples.

**Documentation Links:**
When repo metadata is provided, links to .md files are automatically converted to full GitHub URLs and open in an in-app overlay viewer instead of navigating away.

**Rules:**

- Must use markdown link syntax: `[text](file.md)`
- Only converts relative paths ending in `.md`
- Absolute URLs (http://, https://) are never converted
- Leading `./` or `/` are automatically stripped
- **Converted links open in overlay viewer** - keeps users in the app
- **ESC key to close** - quick dismissal of overlay
- **Fetches raw markdown from GitHub** - displays beautifully formatted content

**How It Works:**

1. Links matching pattern `[text](path.md)` are marked with special class `.ipynb-github-md-link`
2. Click handler intercepts the link and prevents navigation
3. Fetches raw markdown content from GitHub (converts blob URL to raw URL)
4. Displays markdown in full-screen overlay with close button
5. Users stay within the app - no external navigation

### Code Cells

JavaScript code execution. Console output capture. Result display. Error handling.

## Interactive Features

### Run Button

Each code cell has a "Run" button that executes the JavaScript code (with async/await support), captures console.log() and console.error() output, displays the return value, and shows visual indicators for success/error states.

**Cell Independence:**
Run any cell at any time in any order. No initialization required. Each cell imports what it needs independently.

### Helper Functions

Import helper functions directly in any cell using ES6 imports:

`Import Helper Functions`
`// Import what you need`
`const { testBlock } = await import('/scripts/ipynb-helpers.js');`
``
`// Test a block`
`const block = await testBlock('accordion', '<div>content</div>');`
``
`// Return result to display in output`
`return block.outerHTML;`

**Available Helper Functions:**

- testBlock(blockName, innerHTML) - tests block decoration in browser
- showPreview(blockName, innerHTML) - opens overlay preview with full styling

**Example cell structure:**
`Complete Helper Example`
`// Import helpers`
`const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');`
``
`const content = '<div><div>Title</div><div>Description</div></div>';`
`const block = await testBlock('accordion', content);`
``
`// Show visual preview`
`await showPreview('accordion', content);`
``
`// Return result to display`
`return block.outerHTML;`

## Understanding the Overlay Types

The ipynb-viewer block uses multiple distinct overlay systems for different purposes:

### Paged Overlay (Reading Mode)

**Triggered by:** Clicking the "Start Reading" button

**Purpose:** Navigate through notebook cells one page at a time

**Visual Controls:**

- Attractive top bar with gradient background (purple-to-blue) displaying notebook title
- Control buttons in top bar: Home (🏠), History (🕘), Bookmarks (🔖), TOC (☰), Help (❓), and Close (×)
- Previous/Next buttons at the bottom
- Page indicator showing current page (e.g., "3 / 8")

**Keyboard Shortcuts:**

- Arrow Left - Previous page
- Arrow Right - Next page
- Escape - Close the paged overlay

**When visible:** This overlay is active from when you click "Start Reading" until you close it.

### Manual Overlay (Documentation)

**Triggered by:** Clicking the "Read the Manual" button

**Purpose:** Display block documentation and reference material

**Visual Controls:**

- Attractive top bar with gradient background (purple-to-blue) displaying document title
- Close button (×) in top bar
- Scrollable content area for long documentation
- No pagination controls (continuous scroll)

**Keyboard Shortcuts:**

- Escape - Close the manual overlay

**When visible:** This overlay appears when you need to reference documentation while working with the notebook.

### Preview Overlay (Code Execution Results)

**Triggered by:** Clicking "Run" button in code cells that use showPreview()

**Purpose:** Display visual results of code execution with responsive testing

**Visual Controls:**

- Close button (×) in top-right
- Responsive view buttons (📱 Mobile, 📱 Tablet, 🖥️ Desktop) - only in non-notebook variations
- Notebook mode: Shows close button and hamburger menu (☰) for table of contents navigation
- Hamburger menu (notebook mode only): Click to show dropdown TOC with cell headings, visual dividers for transitions, smart filtering (skips cells without headings)
- No pagination controls

**Keyboard Shortcuts:**

- Escape - Close the preview overlay (if no other overlays are open)

**When visible:** This overlay appears temporarily when you run code that calls showPreview().

**Note:** In notebook variation, the preview overlay is simplified to show only the block title and close button, removing the responsive view buttons for a cleaner, distraction-free experience. The overlay height is also reduced to 75vh (instead of 95vh) to keep the pagination buttons visible and accessible.

### GitHub Markdown Overlay (Documentation Viewer)

**Triggered by:** Clicking on GitHub .md file links in markdown cells

**Purpose:** View GitHub markdown documentation without leaving the app

**Visual Controls:**

- Attractive top bar with gradient background (purple-to-blue) displaying markdown file title
- Close button (×) in top bar
- Scrollable content area for markdown content
- Rendered markdown with full formatting support

**Keyboard Shortcuts:**

- Escape - Close the GitHub markdown overlay

**When visible:** This overlay appears when you click on a link to a GitHub .md file (when repo metadata is provided).

**Features:**

- ✅ In-app viewing - No external navigation, users stay in your app
- ✅ Automatic conversion - Blob URLs converted to raw URLs for fetching
- ✅ Full markdown rendering - Tables, code blocks, lists, headings, etc.
- ✅ Loading state - Shows "Loading markdown from GitHub..." message
- ✅ Error handling - Displays clear error messages if fetch fails
- ✅ Visual feedback - Links styled with dashed underline on hover
- ✅ Accessibility - Full ARIA support and keyboard navigation

**Example:**

```markdown
<!-- In a markdown cell with repo metadata set -->
See the [Getting Started Guide](docs/getting-started.md) for more information.
```

When clicked, this link:

1. Prevents default navigation to GitHub
2. Converts `https://github.com/user/repo/blob/main/docs/getting-started.md` to raw URL
3. Fetches raw markdown content
4. Displays in beautiful overlay with title "Getting Started Guide"
5. Users can read, scroll, and close with ESC or × button

**Benefits:**

- **Better UX** - Users don't lose their place in your documentation
- **Seamless experience** - No external browser navigation
- **Consistent styling** - Matches ipynb-viewer design
- **Fast loading** - Markdown parsed and rendered instantly

### Overlay Hierarchy

When multiple overlays are open (e.g., you're in paged mode, have the manual open, and run code with showPreview()):

- The preview overlay appears on top of all other overlays
- Pressing Escape closes overlays in this order:
  1. Preview overlay (if open)
  2. Manual overlay (if open)
  3. Paged overlay (if open)
- Previous/Next buttons continue to work in the paged overlay beneath other overlays

This hierarchy ensures you can test responsive previews and reference documentation while reading through the notebook without losing your place.

## Navigation Features

### Navigation History

The ipynb-viewer block automatically tracks your navigation history, recording every cell and markdown file you visit. Access your history through the History button (🕘 clock icon) in notebook mode.

**Features:**

- ✅ Automatic tracking - Records every cell page and markdown overlay you visit
- ✅ Max 25 entries - Keeps most recent 25 navigation events
- ✅ Smart deduplication - Removes duplicates to keep history clean
- ✅ One-click navigation - Click any history entry to return to that content
- ✅ Visual indicators - Icons show cell (📄) vs markdown (📝) entries
- ✅ Empty state - Shows "No history yet" when history is empty

**How to Use:**

1. Navigate through cells using Previous/Next buttons or TOC
2. Click on GitHub markdown links to view documentation
3. Click the History button (🕘) to see your navigation history
4. Click any entry to jump back to that cell or re-open that markdown file

**History Button Location:**

- Position: Top-right of overlay, left of hamburger menu (☰)
- Visibility: Only in notebook mode variation
- Appearance: Circular button with clock icon (🕘)

**What Gets Tracked:**

- Cells: First heading in each page you navigate to
- Markdown files: GitHub .md files opened in overlay viewer
- Timestamp: Most recent visit time for sorting
- Deduplication: Revisiting content moves it to top of history

**Use Cases:**

- Research flow - Revisit key sections while exploring documentation
- Reference jumping - Quick access to frequently referenced cells
- Learning paths - Retrace your steps through tutorial content
- Documentation browsing - Navigate between related markdown files

### Bookmarks

Save your favorite pages for quick access anytime! The bookmark system uses browser localStorage to persist your bookmarks across sessions.

**Features:**

- ✅ Persistent Storage - Bookmarks saved in browser localStorage
- ✅ Per-Notebook - Each notebook has separate bookmarks
- ✅ Auto-Titles - Uses first heading from the page as bookmark title
- ✅ Page Numbers - Shows which page the bookmark points to
- ✅ Quick Navigation - Click bookmark to jump directly to that page
- ✅ Easy Management - Remove individual bookmarks or clear all at once
- ✅ Visual Feedback - Button animation when bookmark is saved

**How to Use:**

1. Navigate to the page you want to bookmark
2. Click the Bookmarks button (🔖) in the top bar
3. Click "+ Bookmark This Page" at the top of the dropdown
4. The page is saved with its title and page number
5. To navigate: Click Bookmarks button → Click any bookmark → Instantly jump to that page

**Bookmark Button Location:**

- Position: Top-right of overlay, between History and TOC buttons
- Visibility: Only in notebook mode variation
- Appearance: Button with bookmark icon (🔖)

**Managing Bookmarks:**

- View All: Click bookmark button to see dropdown list
- Navigate: Click any bookmark to jump to that page
- Remove One: Click the × button next to any bookmark
- Clear All: Click "Clear All Bookmarks" at bottom (with confirmation)
- Auto-Update: Re-bookmarking a page updates the existing bookmark

**Bookmark Storage:**

- Stored in browser's localStorage with key: ipynb-bookmarks-{notebook-id}
- Each notebook has separate bookmark list
- Bookmarks persist across browser sessions
- No server storage required
- Browser-specific (not synced across devices)

**Use Cases:**

- Reference pages - Save frequently used sections for instant access
- Study aids - Bookmark key concepts while learning
- Documentation - Mark important API references or examples
- Tutorial checkpoints - Save your progress through long tutorials
- Comparison - Bookmark related sections for easy cross-referencing

**Tips:**

- Bookmark pages with clear headings for better identification
- Use bookmarks for pages you visit repeatedly
- Clear old bookmarks periodically to keep list manageable
- Combine with History for complete navigation workflow

### Navigation Tree

Explore your notebook structure and repository files through an organized, hierarchical tree panel! The navigation tree provides two main sections with smart categorization.

**Features:**

- ✅ Two-Section Structure - Notebook (parts/cells) and Repository (markdown files)
- ✅ Organized Folders - Repository files grouped into Chapters, Appendix, Miscellaneous
- ✅ Smart Categorization - Automatic sorting of files by type
- ✅ Priority Order - Chapters → Appendix → Miscellaneous for logical browsing
- ✅ Expand/Collapse - Click folder icons to show/hide contents
- ✅ Quick Navigation - Click any item to jump directly to that content
- ✅ Visual Indicators - Icons show folders (▶) vs files
- ✅ Alphabetical Sorting - Files within each category sorted A-Z

**Tree Structure:**

**Notebook Section:**
- Contains parts and cells from your notebook
- Organized by Part headings (Part 1, Part 2, etc.)
- Click any part to expand and see cells
- Click any cell to navigate to that page

**Repository Section:**
- **Chapters Folder** - preface.md and all chapter-*.md files
- **Appendix Folder** - All appendix-*.md files (appendix-a.md, appendix-b.md, etc.)
- **Miscellaneous Folder** - All other markdown files (readme.md, advice.md, glossary.md, etc.)

**How to Use:**

1. Tree panel appears automatically in notebook mode
2. Click folder icons (▶) to expand/collapse sections
3. Click on Chapters to see preface and all chapters
4. Click on Appendix to see all appendix files
5. Click on Miscellaneous to see other documentation
6. Click any file to open it in the GitHub markdown overlay

**Categorization Rules:**

- **Chapters:** Files matching `preface.md` or `chapter-*.md`
- **Appendix:** Files matching `appendix-*.md`
- **Miscellaneous:** Only `advice.md`, `for-ai.md`, and `glossary.md` (hardcoded whitelist)
- All other files are ignored and not shown in the tree

**Benefits:**

- Logical organization - Find chapters, appendices, and other content easily
- Consistent structure - Same organization across all notebooks
- Better browsing - Priority folders (Chapters first) guide exploration
- Clean interface - No clutter from deep folder hierarchies

**Example Tree:**

```
📘 Notebook
  ▶ Part 1: Introduction
  ▶ Part 2: Core Concepts

📁 Repository
  ▶ Chapters (13 files)
    - preface.md
    - chapter-01-what-you-will-learn.md
    - chapter-02-the-invisible-failure.md
  ▶ Appendix (12 files)
    - appendix-a-implementation-cookbook.md
    - appendix-b-battle-tested-lessons.md
    - appendix-c-web-audit-suite-guide.md
  ▶ Miscellaneous (3 files)
    - advice.md
    - for-ai.md
    - glossary.md
```

**Use Cases:**

- Structured learning - Follow chapters in order through notebook
- Reference lookup - Jump directly to specific appendix or document
- Documentation browsing - Explore all available markdown files
- Tutorial navigation - See entire content structure at a glance

### Help System

Built-in help documentation accessible anytime via the Help button! The help system displays comprehensive usage instructions in a beautiful overlay.

**Features:**

- ✅ Always Accessible - Help button in top bar for instant access
- ✅ Comprehensive Guide - Covers all features and navigation
- ✅ GitHub Integration - Opens docs/help.md in overlay viewer
- ✅ No External Navigation - Stay in the app while reading help
- ✅ Searchable - Full markdown with headings and table of contents
- ✅ Up-to-Date - Help doc maintained with latest features

**How to Use:**

1. Click the Help button (❓) in the top bar
2. Browse the comprehensive help guide in the overlay
3. Read about features, navigation, bookmarks, history, shortcuts
4. Press ESC or click × to close and return to your notebook

**Help Button Location:**

- Position: Top-right of overlay, between TOC and Close buttons
- Visibility: Only in notebook mode variation
- Appearance: Button with question mark icon (❓)

**Help Topics Covered:**

- Getting Started - Opening notebooks and understanding the interface
- Navigation Controls - All buttons and their functions
- Overlay Types - Paged, GitHub Markdown, Preview overlays
- Bookmarks - Saving and managing favorite pages
- History - Tracking and revisiting recent navigation
- Keyboard Shortcuts - Arrow keys and ESC shortcuts
- Tips & Tricks - Best practices and workflow examples
- Troubleshooting - Common issues and solutions

**Requirements:**

- Help button appears automatically in notebook mode
- Uses help-repo metadata (falls back to repo, then defaults to allaboutV2)
- Expects help file at docs/help.md in the repository
- Uses GitHub Markdown Overlay viewer for display

**Benefits:**

- Self-Service - Users find answers without leaving the app
- Contextual - Help available exactly when needed
- Complete - All features documented in one place
- Professional - Beautiful overlay presentation

### Link Navigation Between Overlays

Navigate between pages in the paged overlay using hash links in markdown:

**How it works:**

Create links with hash targets in markdown cells:

`Hash Link Navigation`
`Jump to [Part 3](#part-3) or see the [Advanced Examples](#advanced-examples)`

**How it works:**

- Automatic ID generation: All ## h2 headers automatically get IDs
- ID format: Text is converted to lowercase, spaces become hyphens, special chars removed
- Example: ## Part 1: The Big Picture → id="part-1-the-big-picture"
- Searches all pages for the target ID
- Navigates automatically to the page containing the target
- No page reload smooth transition within overlay

**Use Cases:**

- Table of Contents with clickable navigation
- Cross-references between sections
- Progressive learning with "skip ahead" links
- Modular content allowing non-linear exploration

**Example markdown cell:**
`Table of Contents Example`
`## 📋 Table of Contents`
``
`- [Part 1: The Big Picture](#part-1-the-big-picture)`
`- [Part 2: Testing Notebooks](#part-2-testing-notebooks)`
`- [Part 3: Educational Notebooks](#part-3-educational-notebooks)`
`- [Part 4: Display Modes](#part-4-display-modes)`
`- [Part 5: Content Patterns](#part-5-content-patterns)`
`- [Part 6: Pro Tips](#part-6-pro-tips)`
`- [Resources](#resources-next-steps)`

**ID generation rules:**

- ## 🚀 Getting Started → #getting-started (emojis removed, leading hyphen trimmed)

- ## Part 1: Introduction → #part-1-introduction (lowercase, hyphens)

- ## What's New? → #whats-new (apostrophe removed, spaces to hyphens)

## Content Features

### Auto-Wrapping in Notebook Mode

When using the notebook variation, the block automatically wraps markdown cells with appropriate styling classes based on content patterns. This means you can write pure markdown without any HTML wrappers!

**How It Works:**

The viewer automatically detects cell types based on content patterns:

1. **Hero Cell** - First cell (index 0) with # heading → wrapped with ipynb-hero-cell
2. **Intro Cell** - Early cells (index ≤ 2) with ## heading → wrapped with ipynb-content-card (thick 6px border)
3. **Transition Cell** - Short cells (≤3 lines) without headers → wrapped with ipynb-transition-card
4. **Content Cell** - All other cells → wrapped with ipynb-content-card-thin (thin 4px border)

**Usage Example:**

Instead of writing HTML wrappers manually, just write pure markdown in notebook mode:

`Pure Markdown - Auto-Wrapped`
`# 🗺️ EDS Documentation Navigator`
``
`**Lost in documentation?** Not anymore! This guide helps you navigate comprehensive EDS documentation.`

The viewer automatically:

- Detects this is the first cell with # heading (hero pattern)
- Wraps it with `<div class="ipynb-hero-cell">...</div>`
- Applies all CSS styling from the class

**Benefits:**

- ✅ 90% less authoring work - Write pure markdown, no HTML wrappers
- ✅ Automatic styling - Pattern-based detection handles wrapping
- ✅ Maintainable - Change styles in CSS, not in every notebook
- ✅ Clean content - Notebooks are pure markdown, easier to read/edit
- ✅ Version control friendly - Smaller diffs, clearer changes
- ✅ Backward compatible - Existing HTML-wrapped cells still work
- ✅ Smart TOC integration - Hamburger menu detects cells via CSS classes, works seamlessly with auto-wrapped content

**More Examples:**

`Intro Cell - Auto-Wrapped`
`## 📍 What is This?`
``
`The docs/for-ai directory contains detailed guides...`

→ Auto-wrapped with ipynb-content-card (intro cell)

`Content Cell - Auto-Wrapped`
`### 📚 What You'll Learn`
``
`- Documentation structure`
`- Navigation strategies`
`- Pro tips`

→ Auto-wrapped with ipynb-content-card-thin (content cell)

`Transition Cell - Auto-Wrapped`
`Now let's explore navigation based on YOUR role...`

→ Auto-wrapped with ipynb-transition-card (short transition cell)

**When to Use:**

- ✅ Educational notebooks and tutorials
- ✅ Documentation navigation guides
- ✅ Multi-section content with transitions
- ✅ Any notebook in notebook mode
- ✅ Can mix with custom HTML for specific cells needing special styling

**Mixing Auto-Wrapping with Custom HTML:**

You can combine both approaches in the same notebook for maximum flexibility. Most cells can use pure markdown (auto-wrapped) while special cells can use custom HTML for unique styling needs. This hybrid approach gives you the speed of pure markdown for most content (90% less code) plus the flexibility of custom HTML where you need it.

**Customizing Auto-Wrap Styles:**

Developers can customize the appearance of auto-wrapped cells by modifying the CSS classes in `ipynb-viewer.css`. All auto-wrap styling is controlled through four main CSS classes:

`CSS Classes for Auto-Wrapping`
`.ipynb-hero-cell - Hero sections with blue gradient, 48px padding, shadow`
`.ipynb-content-card - Standard content cards with 6px left border`
`.ipynb-content-card-thin - Content cards with thin 4px border`
`.ipynb-transition-card - Transition sections with centered text`

Customize by modifying these classes in the CSS file. Use CSS variables for easier theming across multiple classes.

**Note:** Auto-wrapping only activates in notebook mode. In default, paged, or autorun modes, use manual HTML wrappers as shown in the examples above.

### Action Cards

Action cards provide a beautiful, interactive way to display navigation links in any markdown cell. Use pure markdown with a special HTML comment marker to automatically style a list of links as colored action cards.

**Usage Examples:**

In a hero cell:

`Action Cards in Hero Cell`
`# 🗺️ Documentation Navigator`
``
`Lost in documentation? Not anymore! This interactive guide helps you navigate comprehensive documentation like a pro.`
``
`<!-- action-cards -->`
``
`- [Getting Started](#)`
`- [Navigation Strategies](#)`
`- [Best Practices](#)`

In a content cell:

`Action Cards in Content Cell`
`### 📚 Quick Links`
``
`<!-- action-cards -->`
``
`- [View Source Code](https://github.com/...)`
`- [Run Live Demo](#)`
`- [Read API Docs](#)`

**How It Works:**

1. Add an HTML comment `<!-- action-cards -->` in your markdown cell
2. Follow it with a markdown list of links using (#) as placeholder
3. Write link text that matches heading text somewhere in your notebook
4. Links are automatically resolved at runtime - JavaScript searches all cells for matching headings and updates hrefs
5. All cards use consistent blue styling
6. Unresolved links - If a link can't be matched to any heading:
   - The arrow (→) is hidden, providing visual feedback
   - Clicking the link does nothing (no navigation, no error)

**Important:** The `<!-- action-cards -->` marker only applies to the first list that follows it. Any subsequent lists in the same cell will remain as normal bullet lists.

**Example matching:**

- [Getting Started](#) finds heading containing "Getting Started" (like ## Getting Started or ### 🚀 Getting Started Guide)
- [Best Practices](#) finds heading containing "Best Practices" (like ## Part 6: Best Practices)
- Link text doesn't need exact match - searches for headings that contain your link text

**Best Practices:**

- ✅ Use specific link text: [Part 1: Introduction](#) instead of just [Introduction](#)
- ✅ Make link text unique to avoid ambiguity
- ⚠️ If multiple headings match, it picks the first one found (in cell order)
- 💡 Tip: Use part numbers or descriptive prefixes to ensure unique matches

**Features:**

- ✅ Pure markdown - No manual HTML required
- ✅ Works in any cell type - Hero cells, content cells, intro cells, transition cells
- ✅ Smart link resolution - Automatically finds matching headings at runtime
- ✅ No hardcoded cell IDs - Just use descriptive link text
- ✅ Consistent blue design - Professional, clean appearance
- ✅ Hover effects - Cards lift up and arrow slides right on hover
- ✅ Auto-styled links - Links become full-width interactive elements
- ✅ Right arrows - Automatically added arrow (→) on the right side
- ✅ Unresolved link feedback - Links that can't be matched show no arrow and do nothing when clicked

### Reusable Content Styling Classes

The ipynb-viewer block includes opt-in CSS classes for creating visually consistent educational notebooks, tutorials, and presentations. These classes provide 85-90% reduction in inline styles for notebooks using similar patterns.

**Color Variables:**

`CSS Color Variables`
`--ipynb-card-gradient-start: #e3f2fd (light blue)`
`--ipynb-card-gradient-end: #bbdefb (medium blue)`
`--ipynb-card-accent: #0288d1 (blue accent)`
`--ipynb-card-text-dark: #212121 (dark text)`
`--ipynb-card-heading: #0d47a1 (heading color)`

**Available Classes:**

Component Classes:

- .ipynb-hero-cell - Hero/title sections with blue gradient, 48px padding, shadow
- .ipynb-content-card - Standard content cards with 6px left border
- .ipynb-content-card-thin - Content cards with thin 4px border
- .ipynb-transition-card - Transition sections with centered text
- .ipynb-section-header / .ipynb-subsection-header - Styled headers with icon support
- .ipynb-body-text - Consistent body text styling
- .ipynb-icon-list / .ipynb-icon-list-item - Icon lists with flex layout
- .ipynb-code-inline - Inline code styling
- .ipynb-icon-emoji / -large / -small - Icon emoji sizing utilities

Typography Utilities:

- .ipynb-text-center - Center align text
- .ipynb-font-light / -medium / -semibold / -bold / -extrabold - Font weights
- .ipynb-text-16 / -18 / -20 / -26 / -28 / -48 / -56 - Font sizes

Layout Utilities:

- .ipynb-flex / .ipynb-flex-center / .ipynb-flex-align-center - Flexbox layouts
- .ipynb-gap-8 / -12 / -16 - Gap spacing

Spacing Utilities:

- .ipynb-m-0 / .ipynb-mb-16 / -20 / -24 / .ipynb-my-16 - Margins

Visual Effects:

- .ipynb-opacity-85 / -95 - Opacity
- .ipynb-rounded-4 - Border radius

**Example Usage:**

`Using Reusable Classes`
`<div class="ipynb-content-card">`
`<h3 class="ipynb-section-header">`
`<span class="ipynb-icon-emoji">📚</span>`
`Section Title`
`</h3>`
`<div class="ipynb-body-text">Content here</div>`
`</div>`

**Features:**

- ✅ Opt-in - Only applies when you use the classes (backward compatible)
- ✅ Responsive - Automatically adjusts padding and font sizes on mobile
- ✅ Overlay compatible - Works in paged, notebook, and autorun modes
- ✅ Themeable - Change colors via CSS variables
- ✅ Consistent - Based on 92% styling commonality analysis

## Technical Details

### Code Execution

Code runs in the browser using AsyncFunction constructor for async/await support. Console methods are temporarily captured during execution. Results are displayed in an output area below each cell. Errors are caught and displayed with red styling. Each cell runs independently with its own scope.

**Autorun Mode:**

When autorun or notebook variations are used:

- Code cells execute automatically when displayed
- Run buttons are hidden via CSS (.ipynb-autorun class)
- Output areas are visible by default (display: block)
- In paged mode, cells execute when navigating to each page
- Uses same async execution context as manual mode

### Smart Cell Grouping

The paged variation automatically detects when markdown cells reference code cells and groups them together:

**Detection Patterns:**

- Markdown ending with colon (:)
- Contains "below", "following"
- Contains "try running", "click run"
- Contains "let's test", "let's try"
- Contains "example:", "here's how"

**Multi-code-cell grouping:** Groups up to 3 consecutive code cells together when instructional markdown is followed by multiple code cells. Spacing uses 1.5rem after markdown, 1.5rem between code cells. Page indicator shows logical pages, not raw cell count.

### Overlay Preview System

**How it works:**

Creates overlay element with minimal DOM structure (EDS-compatible), appends to document body, decorates block, and manages responsive view switching.

**Why overlay is better than popup windows:**

- No popup blockers
- Stays on the same page
- Better UX (ESC or backdrop click to close)
- Direct CSS access (no blob URL issues)
- Simpler implementation

**Overlay Controls:**

- Close button (×) always visible in top-right corner for all modes (including notebook variation)
- Responsive view buttons switch between Mobile, Tablet, and Desktop views
- ESC key support pressing ESC closes the preview overlay (unless a paged/manual overlay is open)
- Overlay hierarchy ESC key respects overlay stack - closes paged/manual overlays first, then preview
- Click backdrop clicking outside the preview container closes the overlay

**Why minimal DOM structure is critical:**

EDS blocks expect specific DOM patterns where they can iterate over block.children directly to find content rows. Many blocks (accordion, tabs, cards) use patterns like [...block.children].forEach((row) => { ... }).

### Markdown Parser

The block includes a comprehensive markdown parser that supports:

**Processing Order:**

1. Code blocks (extracted first with placeholders)
2. Tables (multi-line processing with header detection)
3. Headers (H1, H2, H3)
4. Bold and italic text
5. Inline code
6. Links
7. Lists (unordered and ordered)
8. Code block restoration
9. Line break conversion

**Key Features:**

- Code block protection prevents markdown processing inside code blocks
- Inline code protection preserves content within backticks
- Table parsing supports markdown tables with | delimiters and header rows
- List handling properly closes and nests `<ul>` and `<ol>` tags
- HTML escaping safely escapes < and > in code blocks and inline HTML tags
- Inline HTML tags displayed as literal text, matching GitHub behavior
- Language tagging preserves language hints from code fences

### Security Considerations

Code execution happens in the user's browser context. Be cautious with untrusted notebook files. Code has access to the global scope and DOM. Consider implementing additional sandboxing for public sites.

## Unified Overlay Architecture (Version 3.0)

**Status:** ✅ Complete implementation in branch `refactor/ipynb-viewer-unified-overlay`

**Problem:** The original implementation used three separate overlay types which caused context confusion, duplicate navigation systems, and complex state management.

**Solution:** Single unified overlay with mode switching instead of multiple separate overlays.

### Architecture Benefits

- ✅ **Single overlay, single state** - Eliminates "where am I?" confusion
- ✅ **Mode switching** - Change modes (notebook/markdown/manual) without creating new overlays
- ✅ **Unified navigation** - One navigation system for all content types
- ✅ **Centralized hash management** - Single system for URL state (`#mode/identifier`)
- ✅ **Consistent home button** - Always does the same thing regardless of mode

### Core Modules

**Location:** `blocks/ipynb-viewer/overlay/` (8 modules)

1. **hash-manager.js** - URL hash management (parse, update, clear, matches)
2. **navigation.js** - Unified navigation with history, home, back, mode switching
3. **unified-overlay.js** - Core overlay with single state and DOM structure
4. **renderers/notebook.js** - Notebook cell renderer (markdown/code/outputs)
5. **renderers/markdown.js** - Markdown file renderer with smart links
6. **tree.js** - Unified navigation tree (notebook/repository/help sections)
7. **integration.js** - Clean API (`createNotebookOverlay`, `createMarkdownOverlay`)
8. **example-usage.js** - Usage examples

### Usage Example

```javascript
import { createNotebookOverlay } from './overlay/integration.js';

const overlay = createNotebookOverlay(cells, {
  title: 'My Notebook',
  repo: 'https://github.com/user/repo',
  autorun: false,
});

overlay.show();

// Switch to markdown mode
overlay.updateMode('markdown');
overlay.navigate({
  mode: 'markdown',
  identifier: 'docs/README.md',
  title: 'README',
});
```

### Before vs After

**Before (Multiple Overlays):**
- `createPagedOverlay()` - Notebook cells
- `createGitHubMarkdownOverlay()` - Markdown files
- `createManualOverlay()` - Help pages

**After (Unified Overlay):**
- `createUnifiedOverlay({ mode: 'notebook' })`
- `overlay.updateMode('markdown')` - Switch modes
- `overlay.updateMode('manual')`

### Performance Optimizations

**FOUC Prevention:**
- Page transitions use DocumentFragment pattern
- New content built off-screen before display
- Single atomic replace operation eliminates flash
- Smooth, seamless transitions between pages

**Tree Navigation:**
- Only Chapters folder expanded by default
- Reduces initial render time
- Miscellaneous folder limited to 3 essential files (advice.md, for-ai.md, glossary.md)
- Eliminates clutter from unused markdown files

### Documentation

- **[overlay/README.md](overlay/README.md)** - Comprehensive 525-line guide
  - Module documentation with API reference
  - Usage examples and code samples
  - State management and event handling
  - Debugging guide and testing strategy

- **[docs/for-ai/ipynb-viewer-unified-overlay-summary.md](../../docs/for-ai/ipynb-viewer-unified-overlay-summary.md)** - Complete summary
  - Problem analysis and solution architecture
  - Implementation details for all 8 modules
  - Performance optimizations
  - Future enhancements

- **[block-architecture.md](block-architecture.md)** - Technical architecture documentation
  - Detailed module descriptions
  - Data flow and state management
  - Event handling patterns

## Styling

The block uses CSS custom properties for theming:

`CSS Custom Properties`
`--background-color: Background color`
`--text-color: Text color`
`--primary-color: Primary accent (buttons, links, pagination)`
`--primary-hover-color: Hover state for primary buttons`
`--success-color: Success indicators`
`--error-color: Error indicators`
`--code-background: Code cell background`
`--light-color: Border colors`
`--disabled-color: Disabled button background`
`--focus-color: Focus outline color`

### Header Styles

The header section includes CSS classes for metadata display:

- .ipynb-viewer-header: Header container (centered, padded, bordered)
- .ipynb-viewer-title: Notebook title (1.8rem, bold, #333)
- .ipynb-viewer-description: Description (1.1rem, italic, #555)
- .ipynb-viewer-author: Author name (1rem, italic, #666)
- .ipynb-viewer-date: Publication date (0.9rem, #999)
- .ipynb-viewer-version: Version number (0.85rem, #888, bold)
- .ipynb-viewer-meta-row: Container for badges (flexbox, centered)
- .ipynb-viewer-category: Category badge (blue background, #1565c0)
- .ipynb-viewer-difficulty: Difficulty badge (orange background, #e65100)
- .ipynb-viewer-duration: Duration badge (purple background, #6a1b9a)
- .ipynb-viewer-tags: Tags container (flexbox, centered)
- .ipynb-viewer-tag: Individual tag (gray background, #555)
- .ipynb-viewer-license: License text (0.8rem, #888)

### Paged Variation Styles

The paged variation adds overlay-specific CSS:

- .ipynb-paged-start-button: Start Reading button
- .ipynb-paged-overlay: Full-screen overlay container
- .ipynb-paged-overlay-content: Content area (90vw × 90vh)
- .ipynb-paged-close: Close button (top-right)
- .ipynb-paged-cell-area: Scrollable cell content area
- .ipynb-pagination: Pagination controls (in overlay footer)
- .ipynb-pagination-button: Previous/Next button styles
- .ipynb-page-indicator: Page number display

Overlay is fully responsive with breakpoints at 768px and 480px. Desktop uses 90vw × 90vh with border radius. Tablet uses 95vw × 95vh. Mobile uses 100vw × 100vh (full screen, no border radius).

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

Create a .ipynb file in JSON format with cells array and metadata object.

## Related Documentation

See [EDS Block Development](../../.claude/skills/eds-block-development/SKILL.md), [Jupyter Notebook Testing](../../docs/for-ai/explaining-jupyter.md), and [EDS Native Testing](../../docs/for-ai/testing/eds-native-testing-standards.md).

## Tips

Test your notebooks by verifying notebook JSON structure is valid. Keep code simple since complex dependencies may not work in browser context. Use console.log to help debug execution issues. Mobile testing checks layout on different screen sizes. Error handling wraps risky code in try-catch blocks.

## Common Issues

### Notebook Won't Load

Check file path is correct. Verify JSON structure is valid. Check browser console for fetch errors. Ensure CORS headers allow notebook file access.

### Code Won't Execute

Verify code is JavaScript (not Python/other languages). Check for syntax errors in code cells. Look for console errors during execution. Ensure code doesn't rely on Node.js-specific APIs.

### Styling Issues

Check CSS custom properties are defined. Verify block CSS is loaded. Test with different viewport sizes. Check for CSS conflicts with site styles.

## Metadata Table

| Property | Value |
|----------|-------|
| Block Name | ipynb-viewer |
| Status | Production Ready |
| Version | 13.2 |
| Last Updated | 2026-01-14 |
| Author | Tom Cranstoun |
| Category | Complex Build-Enhanced |
| Browser Support | Modern browsers (ES6+) |
| Mobile Support | Yes (fully responsive) |
| Accessibility | WCAG 2.1 AA compliant |
| Dependencies | None (vanilla JavaScript) |
| File Size | JavaScript: 3,786 lines, CSS: 2,110 lines |
| Performance | Excellent (Core Web Vitals optimized) |
| Documentation | Complete (README, EXAMPLE, test.html) |
