# ipynb-viewer Overlay Architecture Refactor Proposal

## Problem Statement

The current ipynb-viewer block has multiple separate overlay implementations:
- Paged overlay (notebook cells)
- GitHub markdown overlay (repository files)
- Manual overlay (help content)

This creates:
- Context confusion ("where am I?")
- Duplicate code (even after refactoring)
- Complex navigation logic
- Difficult debugging
- Inconsistent behavior between overlays

## Proposed Solution: Single Overlay with Modes

### Core Concept

**One overlay, multiple modes** instead of multiple overlays.

```javascript
const overlay = createUnifiedOverlay({
  mode: 'notebook' | 'markdown' | 'manual',
  // ... mode-specific config
});
```

### Architecture

#### 1. Single Overlay Container

```javascript
/**
 * Create unified overlay that handles all content types
 */
function createUnifiedOverlay(config) {
  const {
    mode,           // 'notebook' | 'markdown' | 'manual'
    content,        // Content to display
    metadata,       // Metadata (title, repo, etc.)
    parentOverlay,  // Optional parent overlay reference
  } = config;

  // Single overlay element
  const overlay = document.createElement('div');
  overlay.className = 'ipynb-unified-overlay';
  overlay.setAttribute('data-mode', mode); // Track current mode

  // Single state object
  const state = {
    mode,
    currentPage: null,
    history: [],
    navigation: null,
    tree: null,
  };

  // Mode-specific renderers
  const renderers = {
    notebook: renderNotebookContent,
    markdown: renderMarkdownContent,
    manual: renderManualContent,
  };

  // Unified navigation system
  const navigation = createUnifiedNavigation(state, overlay);

  return {
    show: () => showOverlay(overlay),
    hide: () => hideOverlay(overlay),
    navigate: (target) => navigation.navigate(target),
    updateMode: (newMode) => updateOverlayMode(overlay, state, newMode),
  };
}
```

#### 2. Unified Navigation System

```javascript
/**
 * Single navigation system for all modes
 */
function createUnifiedNavigation(state, overlay) {
  return {
    // Navigate to content (cell, markdown file, manual page)
    navigate: (target) => {
      const { mode, type, identifier } = target;

      // Update state
      state.currentPage = identifier;
      state.history.push({ mode, type, identifier, timestamp: Date.now() });

      // Update URL hash (single source of truth)
      updateHash(target);

      // Render content based on mode
      renderContent(overlay, state, target);
    },

    // Go home (always clear hash, return to first page)
    home: () => {
      clearHash();
      const firstPage = state.history[0] || { mode: state.mode, identifier: 'home' };
      navigate(firstPage);
    },

    // Go back in history
    back: () => {
      if (state.history.length > 1) {
        state.history.pop(); // Remove current
        const previous = state.history[state.history.length - 1];
        navigate(previous);
      }
    },
  };
}
```

#### 3. Mode-Specific Renderers

```javascript
/**
 * Render notebook content (cells)
 */
function renderNotebookContent(overlay, state, target) {
  const { identifier } = target; // cell-index
  const cell = state.content.cells[identifier];

  // Render cell
  overlay.contentArea.innerHTML = renderCell(cell);

  // Update navigation tree selection
  state.tree.select(`cell-${identifier}`);
}

/**
 * Render markdown content (GitHub files)
 */
function renderMarkdownContent(overlay, state, target) {
  const { identifier } = target; // file-path

  // Fetch and render markdown
  fetch(identifier)
    .then(res => res.text())
    .then(markdown => {
      overlay.contentArea.innerHTML = parseMarkdown(markdown);
      state.tree.select(identifier);
    });
}

/**
 * Render manual content (help pages)
 */
function renderManualContent(overlay, state, target) {
  const { identifier } = target; // help-page-id
  const content = state.content.pages[identifier];

  overlay.contentArea.innerHTML = content;
}
```

#### 4. Single Navigation Tree

```javascript
/**
 * Unified navigation tree for all content types
 */
function createNavigationTree(state, overlay) {
  const tree = {
    notebook: [], // Cell nodes
    repository: [], // Markdown file nodes
    help: [], // Help page nodes
  };

  // Build tree from state
  if (state.mode === 'notebook') {
    tree.notebook = buildCellTree(state.content.cells);
  }
  if (state.metadata.repo) {
    tree.repository = buildRepoTree(state.metadata.repo);
  }
  if (state.metadata.help) {
    tree.help = buildHelpTree(state.metadata.help);
  }

  // Render unified tree
  return renderUnifiedTree(tree, (node) => {
    // Single click handler for all node types
    overlay.navigate({
      mode: node.mode,
      type: node.type,
      identifier: node.id,
    });
  });
}
```

#### 5. Single Hash Management

```javascript
/**
 * Single hash management system
 */
const hashManager = {
  // Update hash based on navigation
  update: (target) => {
    const { mode, identifier } = target;
    const hash = `#${mode}/${identifier}`;
    window.history.replaceState(null, '', hash);
  },

  // Clear hash
  clear: () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  },

  // Parse hash to navigation target
  parse: (hash) => {
    if (!hash || hash === '#') return null;

    const [mode, identifier] = hash.substring(1).split('/');
    return { mode, identifier };
  },

  // Navigate to hash on page load
  navigateToHash: (overlay) => {
    const target = hashManager.parse(window.location.hash);
    if (target) {
      overlay.navigate(target);
    }
  },
};
```

### Benefits

#### 1. Single Source of Truth

```javascript
// Before (confusing):
const pagedOverlay = createPagedOverlay(...);
const githubOverlay = createGitHubMarkdownOverlay(...);
// Which overlay am I in? Which state object? Which home button?

// After (clear):
const overlay = createUnifiedOverlay({ mode: 'notebook' });
overlay.updateMode('markdown'); // Switch modes in same overlay
// Always one overlay, one state, one navigation system
```

#### 2. Simplified Home Button

```javascript
// Before (complex context detection):
if (isNotebookMode) {
  // Home = first cell
} else if (hasParentNotebook) {
  // Home = close overlay, return to notebook
} else {
  // Home = scroll to top
}

// After (always same):
overlay.navigation.home(); // Always goes to first page, always clears hash
```

#### 3. Unified History

```javascript
// Before:
// - Notebook has navigationHistory array
// - GitHub overlay has parentHistory context object
// - Manual overlay has no history?

// After:
overlay.state.history; // Single history for all modes
overlay.navigation.back(); // Works everywhere
```

#### 4. Mode Switching Instead of Nesting

```javascript
// Before (nested overlays):
pagedOverlay.open();
  githubOverlay.open(); // New overlay on top
    manualOverlay.open(); // Another overlay?

// After (mode switching):
overlay.show({ mode: 'notebook' });
overlay.updateMode('markdown'); // Switch mode in same overlay
overlay.updateMode('manual'); // Switch again
```

### Migration Strategy

#### Phase 1: Create Unified Overlay (New Code)

1. Create `createUnifiedOverlay()` function
2. Create unified navigation system
3. Create mode-specific renderers
4. Add comprehensive tests

#### Phase 2: Update Block to Use Unified Overlay

1. Replace `createPagedOverlay()` calls with `createUnifiedOverlay({ mode: 'notebook' })`
2. Replace `createGitHubMarkdownOverlay()` calls with `overlay.updateMode('markdown')`
3. Update smart link handlers to use `overlay.navigate()`

#### Phase 3: Remove Old Code

1. Delete `createPagedOverlay()` function
2. Delete `createGitHubMarkdownOverlay()` function
3. Delete duplicate navigation code
4. Update documentation

### File Structure

```
blocks/ipynb-viewer/
├── ipynb-viewer.js           # Main entry point
├── overlay/
│   ├── unified-overlay.js    # Single overlay system
│   ├── navigation.js         # Unified navigation
│   ├── hash-manager.js       # Single hash management
│   ├── renderers/
│   │   ├── notebook.js       # Notebook cell renderer
│   │   ├── markdown.js       # Markdown file renderer
│   │   └── manual.js         # Manual content renderer
│   └── tree.js              # Unified navigation tree
├── ipynb-viewer.css
└── README.md
```

## Impact Assessment

### Code Reduction

- **Estimate**: 40% reduction in overlay-related code
- Remove ~800 lines of duplicate code
- Simplify remaining code

### Debugging Improvements

- Single breakpoint location for all navigation
- Clear state inspection (`overlay.state`)
- No "which overlay?" confusion

### Maintenance Benefits

- Fix bugs once instead of per-overlay
- Add features to all modes simultaneously
- Consistent behavior everywhere

### Testing Improvements

- Test one overlay instead of three
- Mock one state object instead of three
- Write tests that cover all modes

## Risks and Mitigation

### Risk: Big Bang Refactor

**Mitigation**:
- Keep old code during migration
- Use feature flag to switch between old/new
- Incremental migration per mode

### Risk: Breaking Changes

**Mitigation**:
- Comprehensive test suite before refactor
- Visual regression testing
- User acceptance testing

### Risk: Performance Impact

**Mitigation**:
- Benchmark before/after
- Lazy load mode renderers
- Cache rendered content

## Recommendation

**I recommend proceeding with this refactor** because:

1. **Current architecture is causing bugs** - We've hit multiple issues with overlays, home buttons, hash management
2. **Confusion will continue** - Every new feature will face "which overlay?" questions
3. **Code duplication persists** - Even after unifying home button, logic is still duplicated
4. **Clear path forward** - Proposal provides concrete implementation strategy
5. **Long-term maintainability** - Unified architecture much easier to maintain

## Next Steps

If you approve this approach:

1. I can create the unified overlay implementation
2. Migrate notebook mode first (lowest risk)
3. Migrate markdown mode next
4. Remove old code and clean up
5. Update documentation and LEARNINGS.md

Estimated effort: 4-6 hours of focused work.

Would you like me to proceed with this refactor?
