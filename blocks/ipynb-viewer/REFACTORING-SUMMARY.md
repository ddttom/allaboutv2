# Unified Overlay Architecture - Refactoring Summary

## What Was Built

### New Module Structure

```
blocks/ipynb-viewer/overlay/
├── navigation-state.js           ✅ Complete - View switching & state management
├── toolbar.js                    ✅ Complete - Adaptive toolbar with dropdowns
├── unified-overlay.js            ✅ Complete - Main overlay controller
└── renderers/
    ├── notebook-renderer.js      ✅ Complete - Paged notebook view
    └── markdown-renderer.js      ✅ Complete - Markdown file view
```

## Key Architecture Changes

### Before (Nested Overlays)
```
createPagedOverlay()
  ├─ Creates overlay with toolbar
  └─ Opens markdown file:
       createGitHubMarkdownOverlay()
         ├─ Creates ANOTHER overlay with ANOTHER toolbar
         └─ Stacks on top of first overlay
```

**Problems:**
- Duplicate toolbars
- Nested overlay stacking
- Complex state management
- Memory leaks
- Duplicate code

### After (Unified Overlay)
```
createUnifiedOverlay()
  ├─ Single overlay container
  ├─ Single toolbar (adapts to view)
  └─ Content area (swaps views):
       ├─ Notebook view (paged cells)
       ├─ Markdown view (single file)
       └─ Help view (help.md)
```

**Benefits:**
- ✅ One toolbar, no duplication
- ✅ Content switching, no nesting
- ✅ Unified state management
- ✅ Better memory management
- ✅ Single source of truth

## How It Works

### 1. Navigation State Manager (`navigation-state.js`)

Manages:
- Current view type (notebook/markdown/help)
- View-specific data (page index, markdown URL, etc.)
- Navigation history (combined cells + markdown)
- Bookmarks (localStorage)
- State preservation (for back navigation)

```javascript
navigationState.switchView('markdown', {
  markdownUrl: 'chapter-01.md',
  markdownTitle: 'Chapter 1',
});
// Automatically saves current view state
// Loads markdown view
// Triggers onViewChange callback
```

### 2. Toolbar Manager (`toolbar.js`)

Creates single toolbar that adapts to current view:

**Home Button:**
- Notebook view: Go to opening page
- Markdown view: Return to notebook

**TOC Button:**
- Notebook view: Show parts/chapters
- Markdown view: Show headings

**History/Bookmarks:**
- Combined across all views
- Clicking switches to appropriate view

### 3. Content Renderers

**Notebook Renderer** (`notebook-renderer.js`):
- Renders paged cells
- Handles pagination
- Cell execution
- Returns: `{ updatePage, navigateToCell, navigateToHeading }`

**Markdown Renderer** (`markdown-renderer.js`):
- Fetches from GitHub
- Converts markdown to HTML
- Handles links (internal .md files switch view)
- Returns: `{ scrollTo, getHeadings }`

### 4. Unified Overlay (`unified-overlay.js`)

Main controller:
- Creates single overlay container
- Manages toolbar
- Switches content renderers based on navigationState
- Handles tree node clicks
- Coordinates everything

## Navigation Flow Examples

### Clicking Markdown File in Tree

```javascript
// OLD (nested overlay):
treeNode.onClick = () => {
  const overlay = createGitHubMarkdownOverlay(...);
  overlay.openOverlay(); // New overlay on top!
};

// NEW (content switching):
treeNode.onClick = () => {
  navigationState.switchView('markdown', {
    url: node.path,
    title: node.label,
  });
  // Same overlay, swapped content
};
```

### Going Back from Markdown to Notebook

```javascript
// OLD (close nested overlay):
homeButton.onClick = () => {
  closeOverlay(); // Closes markdown, reveals notebook
};

// NEW (switch view):
homeButton.onClick = () => {
  navigationState.switchView('notebook', {
    pageIndex: savedPageIndex,
  });
  // Switches content, preserves state
};
```

## What Still Needs to Be Done

### Remaining Tasks:

1. **Extract Helper Functions** - Move these from main file to utils or make them importable:
   - `createPageGroups()` - Groups cells into pages
   - `buildNavigationTree()` - Builds tree structure
   - `renderNavigationTree()` - Renders tree to DOM
   - `executeCodeCell()` - Executes code cells

2. **Update `decorate()` Function** - Replace old overlay calls:
   ```javascript
   // OLD:
   const overlay = createPagedOverlay(...);

   // NEW:
   import { createUnifiedOverlay } from './overlay/unified-overlay.js';
   const overlay = createUnifiedOverlay(...);
   ```

3. **Delete Legacy Code** - Remove:
   - `createPagedOverlay()` function (~700 lines)
   - `createGitHubMarkdownOverlay()` function (~600 lines)
   - `hideTopbar` parameter (no longer needed)

4. **Test in Browser** - Verify all flows work:
   - Opening notebook
   - Navigating pages
   - Clicking tree nodes (cells + markdown)
   - History navigation
   - Bookmark navigation
   - Help button
   - Markdown links
   - Home button behavior

## File Size Comparison

**Before:**
- `ipynb-viewer.js`: ~4,700 lines
- All in one file

**After:**
- `ipynb-viewer.js`: ~3,400 lines (after removing legacy)
- `overlay/navigation-state.js`: ~250 lines
- `overlay/toolbar.js`: ~350 lines
- `overlay/unified-overlay.js`: ~350 lines
- `overlay/renderers/notebook-renderer.js`: ~200 lines
- `overlay/renderers/markdown-renderer.js`: ~200 lines

**Total:** Same lines, but organized and maintainable!

## Benefits Summary

1. **No More Duplicate Toolbars** - Single toolbar shared across views
2. **Simpler Navigation** - Just switch content, no overlay stacking
3. **Better State Management** - Single NavigationState instance
4. **Cleaner Code** - Modular, separated concerns
5. **Easier Testing** - Each module can be tested independently
6. **Better Memory** - No accumulating overlays
7. **Maintainable** - Changes in one place, not duplicated

## Next Steps

Ready to:
1. Extract remaining helper functions
2. Wire up the unified overlay in `decorate()`
3. Test everything in the browser
4. Delete legacy code once confirmed working

This is the proper architectural fix that eliminates maintenance burden!
