# Unified Overlay System

**Status**: ✅ Complete and ready for use
**Branch**: `refactor/ipynb-viewer-unified-overlay`

## Overview

The unified overlay system provides a single, consistent overlay architecture for displaying all content types (notebook cells, markdown files, help pages) with seamless navigation and mode switching.

## Architecture

### Core Concept

**One overlay with multiple modes** instead of multiple separate overlays.

```
┌─────────────────────────────────────┐
│      Unified Overlay                │
│  ┌────────────────────────────────┐ │
│  │  Mode: notebook | markdown     │ │
│  │  State: history, tree, content │ │
│  │  Navigation: unified system    │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Benefits

- **Single state** - One source of truth for overlay state
- **Mode switching** - Change modes without creating new overlays
- **Unified navigation** - One navigation system for all content
- **Consistent behavior** - Home button always does the same thing
- **Centralized hash management** - One system for URL hashes

## Modules

### 1. Hash Manager (`hash-manager.js`)

Manages URL hashes for navigation.

**Format**: `#mode/identifier`

**Examples**:

- `#notebook/cell-5`
- `#markdown/docs/README.md`

**API**:

```javascript
import hashManager from './hash-manager.js';

// Update hash
hashManager.update({ mode: 'notebook', identifier: 'cell-5' });

// Parse hash
const target = hashManager.parse(); // { mode, identifier }

// Clear hash
hashManager.clear();

// Check if matches
const matches = hashManager.matches(target);
```

### 2. Navigation System (`navigation.js`)

Unified navigation for all content types.

**API**:

```javascript
import createUnifiedNavigation from './navigation.js';

const navigation = createUnifiedNavigation(state, overlay, renderers);

// Navigate to content
navigation.navigate({
  mode: 'notebook',
  type: 'cell',
  identifier: 'cell-5',
  title: 'Introduction',
});

// Go home (first page)
navigation.home();

// Go back in history
navigation.back();

// Navigate to hash from URL
navigation.navigateToHash();

// Switch mode
navigation.updateMode('markdown');
```

### 3. Unified Overlay (`unified-overlay.js`)

Core overlay implementation.

**API**:

```javascript
import createUnifiedOverlay from './unified-overlay.js';

const overlay = createUnifiedOverlay({
  mode: 'notebook',
  content: { cells: [...] },
  metadata: { title: 'My Notebook', repo: '...', branch: 'main' },
  renderers: { notebook, markdown },
});

// Show overlay
overlay.show();

// Navigate
overlay.navigate({ mode: 'markdown', identifier: 'README.md' });

// Go home
overlay.home();

// Hide overlay
overlay.hide();
```

### 4. Notebook Renderer (`renderers/notebook.js`)

Renders notebook cells.

**Features**:

- Markdown cell rendering
- Code cell rendering
- Output display
- Cell execution
- Run buttons

### 5. Markdown Renderer (`renderers/markdown.js`)

Renders markdown files.

**Features**:

- Fetch from GitHub or local
- Parse markdown to HTML
- Smart links (.md files)
- Inline code escaping
- Loading indicators

### 6. Navigation Tree (`tree.js`)

Unified tree showing all content.

**Sections**:

- Notebook (cells grouped by parts)
- Repository (files and folders)
- Help (manual pages)

**API**:

```javascript
import createUnifiedNavigationTree from './tree.js';

const tree = createUnifiedNavigationTree(state, treePanel, (target) => {
  overlay.navigate(target);
});

// Render tree
tree.render();

// Select node
tree.select('cell-5');

// Toggle expansion
tree.toggle('part-1');
```

### 7. Integration Module (`integration.js`)

Simple API for creating overlays.

**API**:

```javascript
import { createNotebookOverlay, createMarkdownOverlay } from './integration.js';

// Create notebook overlay
const notebook = createNotebookOverlay(cells, {
  title: 'My Notebook',
  repo: 'https://github.com/user/repo',
  branch: 'main',
  autorun: false,
});

notebook.show();

// Create markdown overlay
const markdown = createMarkdownOverlay(
  'https://github.com/user/repo/blob/main/docs/README.md',
  'README',
  {
    repo: 'https://github.com/user/repo',
    branch: 'main',
  },
);

// Automatically shows and navigates to the file
```

## Usage Examples

### Example 1: Basic Notebook

```javascript
import { createNotebookOverlay } from './overlay/integration.js';

const cells = [
  {
    cell_type: 'markdown',
    source: ['# Welcome'],
    metadata: {},
  },
  {
    cell_type: 'code',
    source: ['console.log("Hello!");'],
    metadata: {},
    outputs: [],
  },
];

const overlay = createNotebookOverlay(cells, {
  title: 'Demo Notebook',
  autorun: true,
});

overlay.show();
```

### Example 2: Navigate Between Cells

```javascript
const overlay = createNotebookOverlay(cells, { title: 'Demo' });
overlay.show();

// Navigate to cell 5
overlay.navigate({
  mode: 'notebook',
  type: 'cell',
  identifier: 'cell-5',
});

// Go home (back to cell 0)
overlay.home();
```

### Example 3: Switch to Markdown

```javascript
const overlay = createNotebookOverlay(cells, {
  title: 'Notebook',
  repo: 'https://github.com/user/repo',
});

overlay.show();

// Switch to markdown mode
overlay.updateMode('markdown');

// Navigate to markdown file
overlay.navigate({
  mode: 'markdown',
  identifier: 'docs/README.md',
  title: 'README',
});
```

### Example 4: Markdown with Smart Links

```javascript
const overlay = createMarkdownOverlay(
  'https://github.com/user/repo/blob/main/docs/guide.md',
  'Guide',
  {
    repo: 'https://github.com/user/repo',
    branch: 'main',
  },
);

// Overlay shows guide.md
// User clicks link to another.md
// Overlay navigates to another.md (same overlay, no nesting)
```

## State Management

### State Object

```javascript
{
  mode: 'notebook',           // Current mode
  currentMode: 'notebook',    // Active mode
  currentIdentifier: 'cell-5', // Current content
  history: [                  // Navigation history
    { mode, type, identifier, title, timestamp },
    ...
  ],
  content: { cells: [...] },  // Content data
  metadata: { title, repo, branch }, // Metadata
  isOpen: false,              // Overlay visibility
  tree: treeAPI,              // Tree instance
  overlay: overlayAPI,        // Overlay instance
}
```

### Navigation Target

```javascript
{
  mode: 'notebook',      // 'notebook' | 'markdown' | 'manual'
  type: 'cell',          // 'cell' | 'part' | 'file' | 'folder' | 'page'
  identifier: 'cell-5',  // Unique identifier
  title: 'Introduction', // Display title
}
```

## File Structure

```
overlay/
├── unified-overlay.js      # Core overlay
├── navigation.js           # Navigation system
├── hash-manager.js         # Hash management
├── tree.js                # Navigation tree
├── integration.js          # Simple API
├── example-usage.js        # Usage examples
├── renderers/
│   ├── notebook.js        # Notebook renderer
│   └── markdown.js        # Markdown renderer
└── README.md              # This file
```

## CSS Classes

### Overlay Structure

```html
<div class="ipynb-unified-overlay" data-mode="notebook">
  <div class="ipynb-overlay-content">
    <div class="ipynb-overlay-top-bar">
      <div class="ipynb-overlay-controls ipynb-overlay-controls-left">
        <button class="ipynb-overlay-button ipynb-home-button">🏠</button>
        <button class="ipynb-overlay-button ipynb-tree-toggle-button">◄</button>
      </div>
      <div class="ipynb-overlay-title">Title</div>
      <div class="ipynb-overlay-controls ipynb-overlay-controls-right">
        <button class="ipynb-overlay-button ipynb-history-button">🕘</button>
        <button class="ipynb-overlay-button ipynb-close-button">×</button>
      </div>
    </div>
    <div class="ipynb-overlay-main">
      <div class="ipynb-nav-tree-panel"><!-- Tree --></div>
      <div class="ipynb-overlay-content-area"><!-- Content --></div>
    </div>
  </div>
</div>
```

### Mode-Specific Styling

Use `[data-mode]` attribute for mode-specific styles:

```css
/* Notebook mode */
.ipynb-unified-overlay[data-mode="notebook"] {
  /* Styles */
}

/* Markdown mode */
.ipynb-unified-overlay[data-mode="markdown"] {
  /* Styles */
}
```

## Event Handling

### Built-in Events

The overlay handles these events automatically:

- **Home button** - Clears hash, navigates to first page
- **Close button** - Hides overlay, clears hash
- **Tree toggle** - Shows/hides navigation tree
- **Escape key** - Closes overlay
- **Hash change** - Navigates to hash target
- **Overlay background click** - Closes overlay

### Custom Events

To add custom event handling:

```javascript
const overlay = createNotebookOverlay(cells, { title: 'Demo' });
const state = overlay.getState();

// Access DOM elements
state.element.querySelector('.ipynb-home-button').addEventListener('click', () => {
  console.log('Custom home handler');
});
```

## Debugging

### Enable Logging

All modules use `console.log()` with prefixes:

- `[HASH]` - Hash manager
- `[NAV]` - Navigation
- `[OVERLAY]` - Overlay core
- `[NOTEBOOK RENDERER]` - Notebook renderer
- `[MARKDOWN RENDERER]` - Markdown renderer

### Inspect State

```javascript
const overlay = createNotebookOverlay(cells, { title: 'Demo' });
overlay.show();

// Get state
const state = overlay.getState();
console.log('Current mode:', state.currentMode);
console.log('History:', state.history);
console.log('Is open:', state.isOpen);

// Get navigation
const navigation = overlay.getNavigation();
console.log('Current identifier:', navigation.getCurrentIdentifier());
```

## Testing

### Manual Testing

1. **Create overlay**

   ```javascript
   const overlay = createNotebookOverlay(cells, { title: 'Test' });
   overlay.show();
   ```

2. **Test navigation**
   - Click tree items
   - Use home button
   - Navigate between cells
   - Check hash updates

3. **Test mode switching**

   ```javascript
   overlay.updateMode('markdown');
   overlay.navigate({ mode: 'markdown', identifier: 'README.md' });
   ```

4. **Test history**
   - Navigate to multiple pages
   - Use back button
   - Check history dropdown

### Integration Testing

```javascript
// Test notebook → markdown → home flow
const overlay = createNotebookOverlay(cells, {
  title: 'Test',
  repo: 'https://github.com/user/repo',
});

overlay.show(); // Should show cell 0
overlay.navigate({ mode: 'markdown', identifier: 'docs/guide.md' }); // Should load markdown
overlay.home(); // Should return to cell 0
```

## Performance

### Optimizations

- **Lazy rendering** - Content rendered only when navigated to
- **DOM reuse** - Overlay DOM created once, content swapped
- **Mode switching** - No overlay destruction/recreation
- **Tree caching** - Tree structure built once

### Memory Management

- **History limit** - Max 50 entries (configurable in navigation.js)
- **Event cleanup** - Event listeners managed by overlay
- **DOM cleanup** - Overlay removed from DOM on destruction

## Future Enhancements

### Planned Features

- [ ] Keyboard shortcuts (arrow keys for navigation)
- [ ] Search functionality
- [ ] Bookmarks persistence
- [ ] Slide mode (presentation)
- [ ] Print mode
- [ ] Dark theme support
- [ ] Full-screen mode
- [ ] Split view (notebook + markdown side-by-side)

### Parser Integration

Currently uses simple parsers. Future integration:

- Full `parseMarkdown()` from main block
- `inlineSVGIllustrations()` support
- JSLab integration for code execution
- Syntax highlighting (Prism/highlight.js)

## Contributing

When extending the overlay system:

1. **Maintain single overlay** - Don't create additional overlay types
2. **Use mode switching** - Add new modes instead of new overlays
3. **Centralize navigation** - Use navigation system, not custom handlers
4. **Follow patterns** - Match existing renderer patterns
5. **Add logging** - Use console.log with module prefixes
6. **Document changes** - Update this README

## License

Same as project root (see repository LICENSE file)
