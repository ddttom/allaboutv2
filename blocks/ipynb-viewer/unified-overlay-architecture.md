---
title: "Unified Overlay Architecture Design"
description: "Architecture for the unified overlay system in the ipynb-viewer block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Unified Overlay Architecture Design

## Current Problems

1. **Nested overlays** - Each markdown file creates a new overlay on top of the existing one
2. **Duplicate toolbars** - Every overlay has its own toolbar with duplicate buttons
3. **Memory leaks** - Overlays are created but not properly destroyed
4. **Navigation confusion** - Multiple overlays with separate state management
5. **Maintenance burden** - Two separate overlay creation functions with duplicate code

## Proposed Architecture

### Single Overlay Container

```
┌─────────────────────────────────────────────────────┐
│ Unified Overlay (ipynb-unified-overlay)             │
│                                                      │
│ ┌─────────────────────────────────────────────────┐│
│ │ Toolbar (ipynb-overlay-toolbar)                 ││
│ │ [Home] [Help] [History] [Bookmarks] [TOC]       ││
│ │ [Tree Toggle]                    Title  [Close] ││
│ └─────────────────────────────────────────────────┘│
│                                                      │
│ ┌──────────┬────────────────────────────────────┐  │
│ │   Tree   │   Content Area                     │  │
│ │  Panel   │   (swappable views)                │  │
│ │          │                                     │  │
│ │ Notebook │   • Notebook View (paged cells)    │  │
│ │  ├─ Ch1  │   • Markdown View (single file)    │  │
│ │  ├─ Ch2  │   • Help View (help.md)            │  │
│ │  └─ Ch3  │                                     │  │
│ │          │   [Pagination controls if needed]   │  │
│ │ Repo     │                                     │  │
│ │  ├─ Chs  │                                     │  │
│ │  ├─ Apps │                                     │  │
│ │  └─ Misc │                                     │  │
│ └──────────┴────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Core Components

#### 1. Unified Overlay Manager
```javascript
function createUnifiedOverlay({
  notebook,        // Notebook data
  config,          // Configuration
  repoUrl,         // Repository URL
  branch,          // Git branch
  notebookTitle,   // Title for toolbar
}) {
  // Creates single overlay with:
  // - One toolbar
  // - One navigation tree panel
  // - One content area (swappable)
  // - Shared state management

  return {
    openOverlay,      // Show overlay
    closeOverlay,     // Hide overlay
    navigateTo,       // Switch content view
    updateToolbar,    // Update toolbar state
    updateTree,       // Update tree state
  };
}
```

#### 2. Content Renderers
```javascript
// Notebook Content Renderer
function renderNotebookContent(contentArea, {
  cells,
  currentPage,
  paginationState,
  config,
}) {
  // Renders paged notebook cells
  // Returns: { updatePage, navigateToCell, ... }
}

// Markdown Content Renderer
function renderMarkdownContent(contentArea, {
  markdownUrl,
  title,
  repoUrl,
  branch,
  config,
}) {
  // Fetches and renders markdown file
  // Returns: { scrollTo, updateLinks, ... }
}

// Help Content Renderer (extends markdown renderer)
function renderHelpContent(contentArea, config) {
  // Specialized markdown renderer for help.md
}
```

#### 3. Navigation State Manager
```javascript
const navigationState = {
  currentView: 'notebook',  // 'notebook' | 'markdown' | 'help'
  currentData: {
    // View-specific data
    pageIndex: 0,           // For notebook view
    markdownUrl: null,      // For markdown view
    scrollPosition: 0,      // For all views
  },
  history: [],              // Navigation history
  bookmarks: [],            // Bookmarks

  // Methods
  switchView(viewType, data) {
    // Save current view state
    // Load new view
    // Update toolbar
    // Update tree selection
  },

  goBack() {
    // Navigate to previous view from history
  },

  addToHistory(entry) {
    // Add current view to history
  },
};
```

#### 4. Toolbar Manager
```javascript
function createToolbar({ config, navigationState, overlayContext }) {
  // Creates single toolbar with all buttons
  // Buttons adapt behavior based on currentView:

  // Home button:
  // - Notebook view: Go to opening page
  // - Markdown view: Return to notebook view

  // History dropdown:
  // - Shows combined history (cells + markdown)
  // - Clicking item switches view appropriately

  // Bookmarks dropdown:
  // - Shows bookmarks from all views
  // - Clicking switches view to bookmarked content

  // TOC dropdown:
  // - Notebook view: Show part/chapter structure
  // - Markdown view: Show heading structure

  // Help button:
  // - Always loads help.md in markdown view

  return {
    updateTitle,
    updateButtonStates,
    refreshDropdowns,
  };
}
```

### Navigation Flow Examples

#### Opening Markdown from Tree
```javascript
// OLD (nested overlay):
treeNode.onClick = () => {
  const mdOverlay = createGitHubMarkdownOverlay(...);
  mdOverlay.openOverlay();  // Creates new overlay!
};

// NEW (content switching):
treeNode.onClick = () => {
  navigationState.switchView('markdown', {
    url: node.path,
    title: node.label,
  });
  // Same overlay, different content
};
```

#### Going Back from Markdown to Notebook
```javascript
// OLD (close overlay):
homeButton.onClick = () => {
  closeOverlay();  // Closes markdown overlay, reveals notebook
};

// NEW (switch view):
homeButton.onClick = () => {
  if (navigationState.currentView === 'markdown') {
    navigationState.switchView('notebook', {
      pageIndex: navigationState.lastNotebookPage,
    });
  } else {
    // Already in notebook, go to opening page
    navigationState.switchView('notebook', {
      pageIndex: getHomePageIndex(),
    });
  }
};
```

### State Preservation

When switching views, preserve state for back navigation:

```javascript
const viewStates = {
  notebook: {
    currentPage: 5,
    scrollPosition: 0,
    expandedCells: [1, 3, 5],
  },
  markdown: {
    url: 'chapter-01.md',
    scrollPosition: 1200,
  },
};

// When switching away, save state
// When returning, restore state
```

## Implementation Strategy

### Phase 1: Create New Infrastructure (No Breaking Changes)
1. Create `createUnifiedOverlay()` function
2. Create content renderer functions
3. Create navigation state manager
4. Test in parallel with existing code

### Phase 2: Migrate Gradually
1. Update `decorate()` to use `createUnifiedOverlay()` instead of `createPagedOverlay()`
2. Update tree node handlers to use `switchView()` instead of creating overlays
3. Update all navigation handlers (history, bookmarks, links)

### Phase 3: Remove Legacy Code
1. Delete `createPagedOverlay()`
2. Delete `createGitHubMarkdownOverlay()`
3. Remove `hideTopbar` parameter (no longer needed)
4. Clean up duplicate code

## Benefits

1. **Single source of truth** - One overlay, one state
2. **No duplicate toolbars** - Toolbar is always the same instance
3. **Better memory management** - No nested overlay accumulation
4. **Simpler navigation** - Just switch content, no overlay stacking
5. **Easier maintenance** - One overlay creation function instead of two
6. **Better UX** - Consistent toolbar behavior across all views
7. **Faster transitions** - No overlay creation overhead

## File Structure

```
blocks/ipynb-viewer/
├── ipynb-viewer.js (main entry point)
├── overlay/
│   ├── unified-overlay.js          (main overlay manager)
│   ├── toolbar.js                  (toolbar creation & management)
│   ├── navigation-state.js         (state management)
│   ├── renderers/
│   │   ├── notebook-renderer.js    (paged notebook view)
│   │   ├── markdown-renderer.js    (markdown file view)
│   │   └── help-renderer.js        (help.md view)
│   └── utils/
│       ├── history-manager.js      (history operations)
│       ├── bookmark-manager.js     (bookmark operations)
│       └── tree-manager.js         (tree operations)
└── ipynb-viewer.css
```

## Migration Path

Since this is a major refactoring, we can:

1. **Build new architecture alongside old code**
2. **Use feature flag** to toggle between old and new
3. **Test thoroughly** with both systems
4. **Switch flag** when ready
5. **Remove old code** after validation

This allows incremental development without breaking the current working system.
