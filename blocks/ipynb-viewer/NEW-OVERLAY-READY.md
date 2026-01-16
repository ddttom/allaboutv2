# New Unified Overlay System - Ready to Integrate

## ✅ Complete - All Modules Built

```
overlay/
├── navigation-state.js       ✅ 100 lines - View switching & history
├── toolbar.js                ✅ 160 lines - Adaptive toolbar
├── unified-overlay.js        ✅ 220 lines - Main controller
└── renderers/
    ├── notebook-renderer.js  ✅ 110 lines - Paged notebook view
    └── markdown-renderer.js  ✅ 160 lines - Markdown file view
```

**Total: ~750 lines** of clean, modular code

## Architecture

### Single Overlay with Content Switching

```
┌─────────────────────────────────────────┐
│  Unified Overlay (ONE INSTANCE)         │
│  ┌────────────────────────────────────┐ │
│  │ Toolbar (ONE INSTANCE)             │ │
│  │ [Home][Help][History][TOC][Close]  │ │
│  └────────────────────────────────────┘ │
│  ┌──────┬───────────────────────────┐   │
│  │ Tree │ Content Area (SWAPS)      │   │
│  │      │ • Notebook View           │   │
│  │      │ • Markdown View           │   │
│  │      │ • Help View               │   │
│  └──────┴───────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Key Point:** Content swaps, overlays DON'T nest!

## What to Delete from ipynb-viewer.js

### Function 1: `createPagedOverlay()`
- **Location:** Around line 2351
- **Size:** ~700 lines
- **Search for:** `function createPagedOverlay(`
- **Delete:** Entire function until closing `}`

### Function 2: `createGitHubMarkdownOverlay()`
- **Location:** Around line 3686
- **Size:** ~600 lines
- **Search for:** `function createGitHubMarkdownOverlay(`
- **Delete:** Entire function until closing `}`

**Total to delete:** ~1,300 lines of legacy code

## How to Integrate

### Step 1: Add Import (Top of File)

```javascript
import { createUnifiedOverlay } from './overlay/unified-overlay.js';
```

### Step 2: Find Where Paged Overlay is Created

Search for where the notebook is rendered (around line 4650 in `decorate()`).

Look for code that creates cells and processes the notebook.

### Step 3: Replace with Unified Overlay

After cells are created and `cellsContainer` is populated:

```javascript
// Create pages
const pages = createPageGroups(cells, config.maxCodeGroupSize);

// Build navigation tree
const navigationTree = buildNavigationTree(cells, cellsContainer, null, notebook, config);
const treeState = {
  tree: navigationTree,
  expandedNodes: new Set(['notebook', 'repository', 'folder-chapters']),
  selectedNode: null,
};

// Create unified overlay
const overlay = createUnifiedOverlay({
  notebook,
  pages,
  navigationTree,
  treeState,
  config,
  repoUrl: notebook.metadata?.repo || null,
  branch: notebook.metadata?.['github-branch'] || 'main',
  notebookTitle: notebook.metadata?.title || 'Jupyter Notebook',
  renderNavigationTree, // Use existing function
});

// Show it
if (isPaged || isNotebook || isIndex) {
  overlay.openOverlay();
}
```

### Step 4: Make executeCodeCell Global

The renderer needs access to `executeCodeCell`. Add this near the top of the file:

```javascript
// Make executeCodeCell global for overlay renderer
window.ipynbExecuteCell = executeCodeCell;
```

## Benefits

✅ **No Duplicate Toolbars** - Single toolbar shared across all views
✅ **No Nested Overlays** - Content swaps instead of stacking
✅ **Better Memory** - No accumulating overlay instances
✅ **Cleaner Code** - Modular, separated concerns
✅ **Easier Maintenance** - Changes in one place
✅ **Better UX** - Consistent behavior, smooth transitions

## Testing Checklist

After integration, test:

- [ ] Open notebook - should show paged view
- [ ] Navigate pages with arrows
- [ ] Click tree nodes (cells) - should navigate to page
- [ ] Click tree nodes (markdown files) - should SWITCH content (not create new overlay!)
- [ ] Click markdown links - should SWITCH content
- [ ] Click help button - should SWITCH to help view
- [ ] Click home button - should return to notebook or opening page
- [ ] History dropdown - should show combined history
- [ ] TOC dropdown - should adapt to current view
- [ ] NO duplicate toolbars anywhere!

## File Size Reduction

**Before:**
- ipynb-viewer.js: ~4,700 lines (with old overlay code)

**After:**
- ipynb-viewer.js: ~3,400 lines (removed createPagedOverlay + createGitHubMarkdownOverlay)
- overlay/ modules: ~750 lines (new, modular)

**Net:** Same total lines, but organized and maintainable!

## Next Steps

1. Find `createPagedOverlay()` function - mark for deletion
2. Find `createGitHubMarkdownOverlay()` function - mark for deletion
3. Add import statement
4. Integrate `createUnifiedOverlay()` in `decorate()`
5. Delete legacy functions
6. Test in browser

The proper fix is ready to go!
