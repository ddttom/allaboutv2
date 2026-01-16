# Viewer - User Guide

Welcome to the **Documentation Viewer** interactive help guide! This document will help you understand all the features and how to use them effectively.

## Table of Contents

[Getting Started](#getting-started) |
[Navigation Controls](#navigation-controls) |
[Overlay Types](#overlay-types) |
[Navigation Tree](#navigation-tree) |
[History](#history) |
[Keyboard Shortcuts](#keyboard-shortcuts) |
[Tips & Tricks](#tips--tricks)

---

## Getting Started

The Viewer displays Jupyter notebooks (.ipynb files) directly in your browser with interactive features. You can read through cells, execute code, and navigate seamlessly between content.

### Opening a Notebook

Click the **"Start Reading"** button to open the overlay. A splash screen may appear briefly while the notebook loads, then you'll see the interactive interface with:

- **Navigation Tree** - Left panel showing notebook structure and linked files
- **Content Area** - Center panel displaying notebook cells
- **Footer Navigation** - Bottom bar with Previous/Next buttons and page indicator

Use **Previous/Next** buttons in the footer to navigate between pages. Each page may contain one or more cells (markdown or code).

### Understanding the Interface

The overlay has several key areas:

- **Top Bar** - Header with notebook title and control buttons
- **Navigation Tree** - Left panel for exploring structure (can be hidden with ◄/► button)
- **Content Area** - Main panel displaying the current page's cells
- **Footer Navigation** - Bottom bar with Previous/Next buttons and page indicator
- **Control Buttons** - Home, Tree Toggle, History, and Table of Contents in the top bar

---

## Navigation Controls

### Navigation Tree Panel

A powerful new navigation panel appears on the left side of the overlay:

**Features:**

- **Notebook Section** - Shows all cells organized by Parts (or flat structure if no Parts)
- **Repository Section** - Categorized folders: Chapters, Appendix, Miscellaneous
- **Expandable/Collapsible** - Click triangles (▶) to expand folders and sections
- **Click to Navigate** - Click any cell or file to jump directly to it
- **Smart Categorization** - Files automatically sorted into appropriate folders
- **Toggle Visibility** - Use the tree toggle button (◄/►) to hide/show the panel

**Structure:**

- **Frontmatter** - Cells before first Part (only if Parts exist)
- **Part N** - Each numbered Part with its cells
- **Summary** - Cells after completion (only if Parts exist)
- **Repository** - Categorized into Chapters (expanded), Appendix, Miscellaneous folders (auto-hidden if empty)

### Top Bar Buttons

The top bar contains all your navigation and utility controls:

| Button | Icon | Position | Function |
|--------|------|----------|----------|
| **Home** | 🏠 | Left | Jump to the first page/cell or markdown file |
| **Tree Toggle** | ◄/► | Left | Hide/show the navigation tree panel |
| **History** | 🕘 | Right | View your navigation history (last 25 items) |
| **Table of Contents** | ☰ | Right | Quick navigation to any section |

**Note:** Help documentation is now integrated into the navigation tree as a "Help" folder, rather than a separate button.

**Tree Toggle Button:**

- **◄ (Left Arrow)** - Tree is visible, click to hide
- **► (Right Arrow)** - Tree is hidden, click to show
- Content area automatically expands when tree is hidden

### Previous/Next Navigation

**Previous Button** (←) - Go to the previous page
**Next Button** (→) - Go to the next page
**Page Indicator** - Shows current page number (e.g., "3 / 8")

### Home Button

Click the **Home** button (🏠) to instantly return to the first page of the notebook. This is useful when you're deep in the content and want to start over.

---

## Overlay Types

The Viewer uses multiple overlay types for different purposes:

### 1. Paged Overlay (Reading Mode)

**How to open:** Click "Start Reading" button

**Features:**
Navigate one page at a time
Full control buttons in top bar
Keyboard shortcuts for navigation
Page indicator shows progress

**Best for:** Sequential reading, tutorials, guided content

### 2. GitHub Markdown Overlay

**How to open:** Click any .md file link in markdown cells

**Features:**

- Fetches markdown from GitHub
- Displays in overlay without leaving the app
- Full markdown rendering
- Loading states and error handling

**Best for:** Cross-referencing documentation, exploring related guides

### 3. Preview Overlay (Code Results)

**How to open:** Click "Run" on code cells that use `showPreview()`

**Features:**

- Displays visual output from code execution
- Responsive testing buttons (Mobile, Tablet, Desktop)
- Shows rendered HTML/CSS

**Best for:** Testing UI components, visual demos

---

## Navigation Tree

**New Feature!** A powerful tree-based navigation panel for exploring notebook structure.

### Overview

The Navigation Tree appears on the left side of the overlay and provides:

- **Hierarchical view** of all notebook cells and linked files
- **Quick navigation** - click any item to jump directly to it
- **Visual organization** - see the complete structure at a glance
- **Smart hiding** - empty sections auto-hide (e.g., Repository with no .md files)

### Tree Structure

#### Notebook Section

Shows all cells in the notebook:

**With Part Headings:**

- **Frontmatter** - Cells before the first "Part N" heading
- **Part 1, Part 2, etc.** - Grouped cells under each Part
- **Summary** - Cells after a heading containing "completed" and "final"

**Without Part Headings:**

- Cells are listed directly under "Notebook" (flat structure)
- No Frontmatter or Summary sections created

#### Repository Section

Shows all markdown files linked in the notebook, organized into three categorized folders:

**Chapters Folder** (expanded by default):
- Contains files matching: `preface.md` or `chapter-N.md` patterns
- `preface.md` always appears first
- Chapters sorted alphabetically after preface
- Example: `preface.md`, `chapter-1.md`, `chapter-2.md`

**Appendix Folder** (collapsed by default):
- Contains files matching: `appendix-X.md` pattern
- Automatically sorted alphabetically
- Example: `appendix-a.md`, `appendix-b.md`

**Miscellaneous Folder** (collapsed by default):
- Restricted to specific files only: `advice.md`, `for-ai.md`, `glossary.md`
- All other files are automatically ignored
- Hardcoded inclusion list for essential reference files

**Features:**
- **Automatically populated** from .md links in cells
- **Smart categorization** - files automatically sorted into correct folders
- **Auto-hidden** - Repository section hidden if no .md files referenced
- **Deduplication** - same filename only appears once (uses first occurrence)
- **Alphabetical sorting** - files sorted within each folder

### Using the Tree

**Expand/Collapse Sections:**

- Click the triangle icon (▶) next to folders or sections
- Expanded state: ▼ (downward triangle)
- Collapsed state: ▶ (right-pointing triangle)
- Tree state persists when switching between overlays

**Navigate to Content:**

- Click any cell item to jump to that page
- Click any .md file to open it in GitHub overlay
- Currently selected item is highlighted

**Toggle Visibility:**

- Click the tree toggle button (◄/►) in top-left
- Hidden state gives more reading space
- Content area expands to fill available width

### Tree Features

**Smart Detection:**

- Automatically finds Part headings (pattern: `Part \d+`)
- Detects Summary section (contains "completed" AND "final")
- Extracts all .md links from notebook cells
- Categorizes files into Chapters (preface.md, chapter-N.md)
- Categorizes files into Appendix (appendix-X.md)
- Restricts Miscellaneous to: advice.md, for-ai.md, glossary.md
- Ignores all other files automatically

**Visual Feedback:**

- Selected item has highlight
- Hover effect on clickable items
- Indentation shows hierarchy level
- Icons indicate node type (folder/file)
- Auto-scroll to expanded folders near bottom (keeps newly revealed items visible)

**State Management:**

- Expansion state shared across both overlays
- Tree structure updates when new .md links discovered
- Duplicate files automatically filtered out

---

## History

The Viewer automatically tracks your navigation history for each notebook session.

### How History Works

- **Automatic Tracking** - Every page you visit is recorded
- **Per-Notebook** - Each notebook has its own isolated history
- **Maximum 25 Entries** - Keeps only the most recent 25 items per notebook
- **Two Types** - Tracks both cells (📄) and markdown files (📝)
- **Smart Deduplication** - Revisiting content moves it to the top
- **Session-Based** - History resets when you close and reopen the notebook

### Using History

1. Click the **History** button (🕘) in the top bar
2. See your recent navigation as a dropdown list
3. Click any entry to return to that page
4. History updates automatically as you navigate

### What Gets Tracked

- **Cells** - Pages with headings (uses first H1, H2, or H3)
- **Markdown Files** - GitHub .md files opened via links
- **Timestamp** - Most recent visit time for sorting

---

## Keyboard Shortcuts

Make navigation faster with keyboard shortcuts:

### Paged Overlay

| Key | Action |
|-----|--------|
| **Arrow Left** (←) | Previous page |
| **Arrow Right** (→) | Next page |
| **Escape** | Close overlay |

### All Overlays

| Key | Action |
|-----|--------|
| **Escape** | Close the topmost overlay |

### Tips

- Keyboard shortcuts work when overlay is focused
- Shortcuts don't interfere with typing in code cells
- ESC closes overlays in order (preview → GitHub markdown → paged)

---

## Tips & Tricks

### Efficient Navigation

1. **Use Navigation Tree** - Fastest way to see structure and jump anywhere
2. **Use TOC for Big Jumps** - Table of Contents (☰) for quick section access
3. **Use History for Recent Pages** - Quickly revisit pages you just read
4. **Use Home for Reset** - Start over from the beginning anytime
5. **Toggle Tree for Focus** - Hide tree (►) to maximize reading space

### Workflow Examples

**Learning a Tutorial:**

- Use Navigation Tree to see overall structure
- Read sequentially with Previous/Next
- Use History to revisit tricky sections
- Collapse Parts in tree you've completed

**Using as Reference:**

- Keep Navigation Tree open to see all sections
- Click tree items to jump directly to content
- Use History to jump between related topics
- Toggle tree (►) when deep reading

**Exploring Documentation:**

- Click .md links to open related docs in overlay
- Navigation Tree shows all linked markdown files
- Click files in Repository section to view them
- Keep main notebook open while reading related docs
- Use ESC to close doc overlay and return to main content
- Tree state persists across GitHub overlays

### Best Practices

1. **Use Descriptive Headings** - First heading becomes history title
2. **Check History** - Quickly revisit recent pages
3. **Keyboard Shortcuts** - Learn Arrow Left/Right for faster navigation
4. **Use Tree for Structure** - Navigation tree shows overall organization

---

## Advanced Features

### Link Navigation

Click links with hash targets to jump between pages:

```markdown
[Go to Installation](#installation)
```

### Action Cards

In notebook mode, markdown lists with emojis automatically become beautiful action cards:

```markdown
<!-- action-cards -->
- 🎯 **Getting Started** - Learn the basics
- 📚 **Advanced Topics** - Deep dive into features
- 🔧 **Configuration** - Customize your setup
```

### GitHub Integration

When `repo` metadata is set, .md links automatically:

- Convert to full GitHub URLs
- Open in overlay instead of navigating away
- Fetch and render markdown beautifully

---

## Troubleshooting

### Keyboard Shortcuts Not Working?

- Click inside the overlay to focus it
- Check you're not typing in an input field
- Verify overlay is the topmost layer

### Navigation Issues?

- Reload page if buttons become unresponsive
- Check browser console for errors
- Verify notebook JSON is valid

**Happy Reading!** 📚✨

This help guide is always accessible via the **Help** folder in the navigation tree.
