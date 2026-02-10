---
title: "Integration Instructions - Complete Refactoring"
description: "Integration documentation for the ipynb-viewer block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Integration Instructions - Complete Refactoring

## Status: Ready to Integrate

✅ Old overlay/ directory deleted
✅ New unified overlay modules created (~750 lines)
✅ Legacy functions identified for deletion (~1,300 lines)

## New Modules Created

```
overlay/
├── navigation-state.js       - View switching & history management
├── toolbar.js                - Single adaptive toolbar
├── unified-overlay.js        - Main overlay controller
└── renderers/
    ├── notebook-renderer.js  - Paged notebook view
    └── markdown-renderer.js  - Markdown file view
```

## Legacy Code to Delete

### 1. createPagedOverlay()
- **Line:** 2351
- **Size:** ~700 lines
- **Delete from:** Line 2351
- **Delete to:** End of function (find matching closing brace)

### 2. createGitHubMarkdownOverlay()
- **Line:** 3687
- **Size:** ~600 lines
- **Delete from:** Line 3687
- **Delete to:** End of function (find matching closing brace)

## Integration Steps

### Step 1: Add Import at Top of File

Add after the `DEFAULT_CONFIG` constant:

```javascript
import { createUnifiedOverlay } from './overlay/unified-overlay.js';
```

### Step 2: Make executeCodeCell Global

Add near line 1220 (where `executeCodeCell` is defined):

```javascript
// Export for overlay renderer
window.ipynbExecuteCell = executeCodeCell;
```

### Step 3: Find the Notebook Rendering Section

Search for: `if (isPaged || isNotebook)`

This is around line 4650 in `decorate()`.

### Step 4: Replace Old Overlay Creation

The old code calls `createPagedOverlay()`. Replace that entire section with:

```javascript
// OLD CODE (DELETE THIS):
// const pagedOverlay = createPagedOverlay(...);

// NEW CODE (ADD THIS):
if (isPaged || isNotebook) {
  // Create pages from cells
  const cells = Array.from(cellsContainer.querySelectorAll('.ipynb-cell'));
  const pages = createPageGroups(cells, config.maxCodeGroupSize);

  // Build navigation tree
  const navigationTree = buildNavigationTree(cells, cellsContainer, null, notebook, config);

  // Tree state
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
    renderNavigationTree, // Use existing function from main file
  });

  // Open overlay
  if (isIndex) {
    // Auto-open for index mode
    setTimeout(() => {
      overlay.openOverlay();
    }, 100);
  } else {
    // Add button to open
    const openButton = document.createElement('button');
    openButton.className = 'ipynb-open-button';
    openButton.textContent = config.buttonLabels.startReading;
    openButton.addEventListener('click', () => {
      overlay.openOverlay();
    });
    block.appendChild(openButton);
  }
}
```

### Step 5: Delete Legacy Functions

Delete these two functions completely:

1. **Delete lines 2351-3686** (createPagedOverlay and everything inside it)
2. **Delete the createGitHubMarkdownOverlay function** (starts at line 3687)

**Important:** Be careful to match braces correctly!

### Step 6: Test

Open your notebook in the browser and test:

- Open notebook
- Navigate pages
- Click tree nodes (should switch content, NOT create nested overlays)
- Click markdown links (should switch content)
- Check toolbar (should only be ONE toolbar, no duplicates!)
- Test history dropdown
- Test TOC dropdown
- Test help button

## Expected Results

✅ **Single toolbar** - No duplicates
✅ **Content switching** - Markdown files switch content, don't create new overlays
✅ **Smooth navigation** - Tree nodes switch views seamlessly
✅ **Better memory** - No overlay accumulation
✅ **Clean code** - ~1,300 lines removed, modular structure added

## If Something Breaks

The old code is still there until you delete it. If the new overlay doesn't work:

1. Check browser console for errors
2. Verify import path is correct
3. Verify `renderNavigationTree` function exists in main file
4. Verify `createPageGroups` function exists in main file
5. Check that `executeCodeCell` is accessible as `window.ipynbExecuteCell`

## File Size Impact

**Before:** ipynb-viewer.js = ~4,700 lines
**After:** ipynb-viewer.js = ~3,400 lines + overlay/ modules = ~750 lines

**Net:** Same functionality, better organization, no duplication!

---

Ready to proceed with integration!
