# Viewer - User Guide

Welcome to the **Documentation Viewer** interactive help guide! This document will help you understand all the features and how to use them effectively.
## Table of Contents
[Getting Started](#getting-started)
[Navigation Controls](#navigation-controls)
[Overlay Types](#overlay-types)
[Bookmarks](#bookmarks)
[History](#history)
[Keyboard Shortcuts](#keyboard-shortcuts)
[Tips & Tricks](#tips--tricks)
---
## Getting Started
The Viewer displays Jupyter notebooks (.ipynb files) directly in your browser with interactive features. You can read through cells, execute code, and navigate seamlessly between content.
### Opening a Notebook
Click the **"Start Reading"** button to open the paged overlay
Use **Previous/Next** buttons to navigate between pages
Each page may contain one or more cells (markdown or code)
### Understanding the Interface
The overlay has several key areas:
**Top Bar** -Header with notebook title and control buttons
**Content Area** - Displays the current page's cells
**Navigation Controls** - Previous/Next buttons and page indicator at bottom
**Control Buttons** - Home, History, Bookmarks, TOC, Help, and Close buttons
---

## Navigation Controls
### Top Bar Buttons
The top bar contains all your navigation and utility controls:

| Button | Icon | Function |
|--------|------|----------|
| **Home** | 🏠 | Jump to the first page/cell |
| **History** | 🕘 | View your navigation history (last 25 items) |
| **Bookmarks** | 🔖 | View and manage your saved bookmarks |
| **Table of Contents** | ☰ | Quick navigation to any section |
| **Help** | ❓ | Open this help guide |
| **Close** | × | Close the overlay |

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

### 2. Manual Overlay (Documentation)

**How to open:** Click "Read the Manual" button (if available)

**Features:**
- Continuous scrolling (no pagination)
- Displays markdown documentation
- Same top bar controls

**Best for:** Reference material, API docs

### 3. GitHub Markdown Overlay

**How to open:** Click any .md file link in markdown cells

**Features:**
- Fetches markdown from GitHub
- Displays in overlay without leaving the app
- Full markdown rendering
- Loading states and error handling

**Best for:** Cross-referencing documentation, exploring related guides

### 4. Preview Overlay (Code Results)

**How to open:** Click "Run" on code cells that use `showPreview()`

**Features:**
- Displays visual output from code execution
- Responsive testing buttons (Mobile, Tablet, Desktop)
- Shows rendered HTML/CSS

**Best for:** Testing UI components, visual demos

---

## Bookmarks

**New Feature!** Save your favorite pages for quick access later.

### Adding a Bookmark

1. Navigate to the page you want to bookmark
2. Click the **Bookmark** button (🔖) in the top bar
3. The current page will be saved with its title
4. You'll see a confirmation (button changes appearance briefly)

### Viewing Bookmarks

1. Click the **Bookmark** button (🔖) to open the bookmark dropdown
2. See all your saved bookmarks with page indicators
3. Click any bookmark to jump to that page instantly

### Bookmark Features

- **Persistent Storage** - Bookmarks saved in browser localStorage
- **Per-Notebook** - Each notebook has separate bookmarks
- **Auto-Titles** - Uses first heading from the page
- **Smart Deduplication** - Re-bookmarking updates the existing bookmark
- **Visual Indicators** - Shows page number and title

### Managing Bookmarks

- **Remove Individual** - Click the × button next to any bookmark
- **Clear All** - Click "Clear All Bookmarks" at the bottom of the list
- **Automatic Cleanup** - Invalid bookmarks are removed automatically

### Bookmark Storage

Bookmarks are stored in your browser's localStorage using the pattern:
```
ipynb-bookmarks-{notebook-path}
```

This means:
- Bookmarks persist across browser sessions
- Each notebook has its own bookmark list
- Bookmarks are specific to your browser
- No server storage required

---

## History

The Viewer automatically tracks your navigation history.

### How History Works

- **Automatic Tracking** - Every page you visit is recorded
- **Maximum 25 Entries** - Keeps only the most recent 25 items
- **Two Types** - Tracks both cells (📄) and markdown files (📝)
- **Smart Deduplication** - Revisiting content moves it to the top

### Using History

1. Click the **History** button (🕘) in the top bar
2. See your recent navigation as a dropdown list
3. Click any entry to return to that page
4. History updates automatically as you navigate

### What Gets Tracked

- **Cells** - Pages with headings (uses first H1, H2, or H3)
- **Markdown Files** - GitHub .md files opened via links
- **Timestamp** - Most recent visit time for sorting

### History vs Bookmarks

| Feature | History | Bookmarks |
|---------|---------|-----------|
| **Automatic** | ✅ Yes | ❌ No (manual) |
| **Limit** | 25 items | Unlimited |
| **Persistence** | Session only | Permanent (localStorage) |
| **Purpose** | Recent navigation | Important pages |
| **Best For** | Retracing steps | Favorite sections |

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
- ESC closes overlays in order (preview → manual → paged)

---

## Tips & Tricks

### Efficient Navigation

1. **Use TOC for Big Jumps** - Table of Contents (☰) is fastest for skipping to specific sections
2. **Use History for Recent Pages** - Quickly revisit pages you just read
3. **Use Bookmarks for Favorites** - Save important reference pages
4. **Use Home for Reset** - Start over from the beginning anytime

### Workflow Examples

**Learning a Tutorial:**
- Read sequentially with Previous/Next
- Bookmark key concepts for review
- Use History to revisit tricky sections
- Use TOC to skip to exercises

**Using as Reference:**
- Bookmark frequently used sections
- Use TOC for quick lookups
- Use History to jump between related topics

**Exploring Documentation:**
- Click .md links to open related docs in overlay
- Keep main notebook open while reading related docs
- Use ESC to close doc overlay and return to main content

### Best Practices

1. **Bookmark Early** - Save pages as you find them useful
2. **Check History** - Before bookmarking, check if it's in history
3. **Use Descriptive Headings** - First heading becomes bookmark/history title
4. **Keep Organized** - Clear old bookmarks periodically
5. **Keyboard Shortcuts** - Learn Arrow Left/Right for faster navigation

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

### Bookmarks Not Saving?

- Check browser allows localStorage
- Verify not in private/incognito mode
- Check browser storage quota

### Keyboard Shortcuts Not Working?

- Click inside the overlay to focus it
- Check you're not typing in an input field
- Verify overlay is the topmost layer

### Navigation Issues?

- Reload page if buttons become unresponsive
- Check browser console for errors
- Verify notebook JSON is valid

**Happy Reading!** 📚✨

This help guide is always accessible via the **Help** button (❓) in the top bar.
