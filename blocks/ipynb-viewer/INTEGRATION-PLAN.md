# Integration Plan - Use Existing Unified Overlay

## Discovery

✅ **Complete unified overlay system ALREADY EXISTS** in `/blocks/ipynb-viewer/overlay/`

**Status**: Built and documented, but **NEVER INTEGRATED** into main code

## What Exists

```
overlay/
├── README.md                    ✅ Complete documentation
├── integration.js               ✅ Clean API: createNotebookOverlay(), createMarkdownOverlay()
├── unified-overlay.js           ✅ Main controller with mode switching
├── navigation.js                ✅ Navigation state management
├── hash-manager.js              ✅ URL hash handling
├── tree.js                      ✅ Navigation tree
└── renderers/
    ├── notebook.js              ✅ Notebook renderer
    └── markdown.js              ✅ Markdown renderer
```

## The Problem

The main `ipynb-viewer.js` file STILL uses:
- `createPagedOverlay()` - Old nested overlay approach (~700 lines)
- `createGitHubMarkdownOverlay()` - Old nested overlay approach (~600 lines)

These create duplicate toolbars and nest overlays.

## The Solution (Simple!)

Just **replace the old overlay calls with the new API**:

```javascript
// OLD (in decorate()):
const pagedOverlay = createPagedOverlay(
  block,
  cellsContainer,
  autorun,
  isNotebookMode,
  repoUrl,
  notebookTitle,
  branch,
  isNoTopbar,
  notebook,
  config,
  splashDuration
);

// NEW (simple!):
import { createNotebookOverlay } from './overlay/integration.js';

const overlay = createNotebookOverlay(cells, notebook.metadata);
overlay.show();
```

## Integration Steps

### Step 1: Add Import
Add at top of `ipynb-viewer.js`:
```javascript
import { createNotebookOverlay, createMarkdownOverlay } from './overlay/integration.js';
```

### Step 2: Replace in decorate()
Find where `createPagedOverlay()` is called and replace with:
```javascript
const overlay = createNotebookOverlay(
  Array.from(cellsContainer.querySelectorAll('.ipynb-cell')),
  {
    title: notebookTitle,
    repo: repoUrl,
    branch: branch,
    autorun: isAutorun,
    help: notebook.metadata?.help,
  }
);

overlay.show();
```

### Step 3: Delete Legacy Code
Remove these functions (they're no longer needed):
- `createPagedOverlay()` (~700 lines, starts around line 2351)
- `createGitHubMarkdownOverlay()` (~600 lines, starts around line 3686)
- All the duplicate toolbar/dropdown code

### Step 4: Test
- Open notebook → should work
- Click tree nodes → should switch content (not create nested overlays)
- Click markdown links → should switch content
- History/bookmarks → should work
- No duplicate toolbars!

## Why This Works

The existing unified overlay system:
1. ✅ Has single overlay with mode switching
2. ✅ Has clean API (`createNotebookOverlay`, `createMarkdownOverlay`)
3. ✅ Handles all navigation (tree, links, history, bookmarks)
4. ✅ No toolbar duplication
5. ✅ Already complete and documented

We just need to **USE IT** instead of the old code!

## File Size Impact

**Before:**
- `ipynb-viewer.js`: ~4,700 lines (with old overlay code)

**After:**
- `ipynb-viewer.js`: ~3,400 lines (delete createPagedOverlay + createGitHubMarkdownOverlay)
- Existing `overlay/` modules: Already written!

Net result: **~1,300 lines removed**, cleaner code, no duplication!

## Next Action

Just need to:
1. Find where `createPagedOverlay()` is called in `decorate()`
2. Replace with `createNotebookOverlay()` import and call
3. Delete the legacy functions
4. Test in browser

That's it! The hard work was already done - now just wire it up!
