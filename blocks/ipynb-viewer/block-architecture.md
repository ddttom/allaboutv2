# ipynb-viewer Block Architecture

## Overview

The ipynb-viewer block is a sophisticated component for displaying and interacting with Jupyter notebooks (.ipynb files) in Adobe Edge Delivery Services (EDS) environments. It provides multiple viewing modes, interactive JavaScript execution, markdown rendering, and tree-based navigation.

**Version:** 2.0 (Event Delegation Architecture)
**Last Updated:** 2026-01-13
**Lines of Code:** ~3,500

## Core Capabilities

1. **Multiple Viewing Modes**
   - Basic (inline)
   - Paged (full-screen with navigation)
   - Autorun (auto-execute code cells)
   - Notebook (persistent navigation tree)

2. **Interactive Features**
   - JavaScript code execution in browser
   - Markdown rendering with GitHub integration
   - Tree-based navigation (notebook structure + repository files)
   - Smart links (relative paths, GitHub URLs)
   - Code cell run buttons
   - Copy-to-clipboard functionality

3. **GitHub Integration**
   - Fetch markdown files from repository
   - Display in overlay with navigation
   - Auto-discover repository structure
   - Smart link resolution

## Architecture Principles

### 1. Event Delegation Pattern (Critical)

**Problem Solved:** Event listeners were being destroyed during tree re-renders when using `container.innerHTML = ''`.

**Implementation:** Single delegated event listener attached to container instead of individual tree nodes.

**Location:** `renderNavigationTree()` function (lines 1584-1634)

**Key Code:**
```javascript
container._treeClickHandler = (e) => {
  // Handle expand/collapse icon clicks
  const icon = e.target.closest('.ipynb-nav-tree-icon');
  if (icon && icon.textContent.trim()) {
    const { nodeId } = icon.parentElement.dataset;
    if (nodeId) {
      e.stopPropagation();
      toggleTreeNode(nodeId, treeState, container, onNodeClick);
      return;
    }
  }

  // Handle tree node clicks
  const treeItem = e.target.closest('.ipynb-nav-tree-item');
  if (treeItem) {
    const { nodeId } = treeItem.dataset;
    const node = findNodeById(tree, nodeId);  // Uses tree parameter (closure)
    if (node) {
      onNodeClick(node);
    }
  }
};

container.addEventListener('click', container._treeClickHandler);
```

**Benefits:**
- Survives DOM replacement (innerHTML clears)
- Better performance (one listener vs. N listeners)
- Handles dynamically added/removed nodes
- Simpler code maintenance

**Related Documentation:** See [CLAUDE.md](../../CLAUDE.md#critical-event-listeners-and-dom-cloning) for event listener best practices.

### 2. Configuration Object Pattern

**Pattern:** All configurable values centralized at top of file in `IPYNB_CONFIG` object.

**Location:** Lines 1-45

**Structure:**
```javascript
const IPYNB_CONFIG = {
  // Error messages
  LOAD_ERROR_MESSAGE: 'Error loading notebook',

  // File paths
  DEFAULT_HELP_FILE: '/docs/help.md',

  // UI text
  RUN_BUTTON_LABEL: '▶ Run',
  COPY_BUTTON_LABEL: '📋 Copy',

  // Thresholds
  LONG_DOCUMENT_THRESHOLD: 40,
  COPY_BUTTON_RESET_DELAY: 2000
};
```

**Why:** Easy localization, maintainability, single source of truth for all configuration.

### 3. Functional Organization

**Structure:** Code organized into three main sections:

1. **decorate** - Main block decoration function (export default)
2. **sub-components** - Reusable component builders
3. **helpers** - Utility functions

**Example:**
```javascript
// 1. Main decorate function
export default async function decorate(block) {
  // Block decoration logic
}

// 2. Sub-components
function createPagedOverlay(container, cellsContainer, autorun) {
  // Create overlay component
}

function createNavigationTree(tree, container, treeState) {
  // Create tree component
}

// 3. Helpers
function findNodeById(tree, nodeId) {
  // Utility function
}

function parseNotebookData(data) {
  // Data processing
}
```

## Key Components

### Navigation Tree

**Purpose:** Hierarchical navigation for notebook structure and GitHub repository files.

**Architecture:** Two-level tree structure:
- **Notebook node:** Contains parts, cells from notebook
- **Repository node:** Contains folders, markdown files from GitHub

**State Management:**
```javascript
const treeState = {
  tree: [],              // Full tree structure
  expandedNodes: Set,    // Set of expanded node IDs
  selectedNode: string   // Currently selected node ID
};
```

**Functions:**
- `buildNavigationTree(cells, repoUrl, branch)` - Construct initial tree
- `renderNavigationTree(tree, container, treeState, onNodeClick)` - Render tree with event delegation
- `renderTreeNode(node, parentElement, treeContainer, treeState, onNodeClick)` - Recursive node rendering
- `toggleTreeNode(nodeId, treeState, container, onNodeClick)` - Expand/collapse nodes
- `selectTreeNode(nodeId, treeState, container, onNodeClick)` - Highlight selected node
- `findNodeById(tree, nodeId)` - Helper to find node by ID

**Data Structure:**
```javascript
{
  id: 'notebook',
  label: 'Notebook',
  type: 'root',
  level: 0,
  children: [
    {
      id: 'part-1',
      label: 'Part 1: Introduction',
      type: 'part',
      level: 1,
      children: [
        {
          id: 'cell-1',
          label: 'Cell 1',
          type: 'cell',
          level: 2,
          cellIndex: 0
        }
      ]
    }
  ]
}
```

### GitHub Integration

**Purpose:** Fetch and display markdown files from GitHub repository.

**Functions:**
- `discoverRepositoryStructure(repoUrl, branch)` - Scan repo for .md files
- `addMarkdownPathsToTree(paths, repoNode)` - Add discovered files to tree
- `createGitHubMarkdownOverlay(markdownPath, repoUrl, branch, parentHistory)` - Display markdown in overlay

**Smart Link Pattern:**
- All `.md` links use GitHub repo URL from notebook metadata
- Fetch from `raw.githubusercontent.com` (converted from blob URL)
- No local path fallback - single source of truth
- See [LEARNINGS.md](../../LEARNINGS.md) for documented pattern

**URL Transformation:**
```javascript
// GitHub blob URL → raw URL
https://github.com/user/repo/blob/main/docs/file.md
→ https://raw.githubusercontent.com/user/repo/main/docs/file.md
```

### Overlay System

**Three Types of Overlays:**

1. **Paged Overlay** - Full notebook with pagination
   - Navigation controls (prev/next/close)
   - Auto-grouping of cells into pages
   - Optional autorun mode
   - Function: `createPagedOverlay()`

2. **GitHub Markdown Overlay** - Display repository markdown
   - Tree navigation panel
   - Content area with markdown rendering
   - Smart links for .md files
   - Function: `createGitHubMarkdownOverlay()`

3. **Help Overlay** - Context-sensitive help
   - Fetches from repo or default location
   - Markdown rendering
   - Close button
   - Function: `createHelpOverlay()`

**Overlay State Management:**
```javascript
const parentHistory = {
  navigationTree: [],
  treeState: {
    tree: [],
    expandedNodes: Set,
    selectedNode: string
  },
  repoUrl: string,
  branch: string
};
```

### Code Execution Engine

**Purpose:** Execute JavaScript code cells in browser context.

**Architecture:**
- Each code cell has isolated execution context
- Uses `Function()` constructor for code evaluation
- Captures console output and return values
- Error handling with try/catch

**Function:** `attachRunButtons(container, autorun)`

**Execution Flow:**
```javascript
// 1. Find code cell
const codeContent = codeBlock.textContent;

// 2. Create execution context
const executeCode = new Function(codeContent);

// 3. Capture output
let output = '';
const originalLog = console.log;
console.log = (...args) => {
  output += args.join(' ') + '\n';
};

// 4. Execute
try {
  const result = executeCode();
  if (result !== undefined) {
    output += result;
  }
} catch (error) {
  output = `Error: ${error.message}`;
} finally {
  console.log = originalLog;
}

// 5. Display output
outputDiv.textContent = output;
```

### Markdown Rendering

**Purpose:** Render markdown content with enhanced features.

**Features:**
- GitHub Flavored Markdown (GFM) support
- Smart link transformation (.md → GitHub URLs)
- Code syntax highlighting
- Table rendering
- Image handling

**Function:** `renderMarkdownToHTML(markdown, repoUrl, branch)`

**Smart Link Implementation:**
```javascript
// Transform .md links to GitHub URLs
html = html.replace(
  /<a href="([^"]+\.md)">/g,
  (match, path) => {
    const githubUrl = convertToGitHubUrl(path, repoUrl, branch);
    return `<a href="${githubUrl}" class="smart-link">`;
  }
);
```

**Event Delegation for Smart Links:**
```javascript
// Attach delegated listener to markdown container
container.addEventListener('click', (e) => {
  const link = e.target.closest('.smart-link');
  if (link) {
    e.preventDefault();
    const url = link.getAttribute('href');
    openGitHubMarkdownOverlay(url, repoUrl, branch, parentHistory);
  }
});
```

## Performance Optimizations

### 1. Event Delegation
- **Before:** N event listeners (one per tree node)
- **After:** 1 event listener (on container)
- **Benefit:** Reduced memory usage, faster re-renders

### 2. Lazy Tree Rendering
- Only render visible nodes
- Expand children on demand
- Collapse unused branches

### 3. Markdown Caching
- Cache fetched markdown content
- Avoid redundant network requests
- Store in overlay state

### 4. DOM Manipulation Optimization
- Use `innerHTML` for bulk updates
- Minimize reflows/repaints
- Batch DOM operations

## CSS Architecture

**File:** `ipynb-viewer.css`

**Organization:**
1. Base block styles
2. Variation styles (.paged, .autorun, .notebook)
3. Component styles (tree, overlay, cells)
4. Responsive breakpoints

**CSS Variables:**
```css
.ipynb-viewer {
  --ipynb-bg-color: #fff;
  --ipynb-text-color: #333;
  --ipynb-border-color: #ddd;
  --ipynb-accent-color: #0366d6;
  --ipynb-spacing: 1rem;
}
```

**Variation Pattern:**
```css
/* Base styles */
.ipynb-viewer {
  /* default styles */
}

/* Paged variation */
.ipynb-viewer.paged {
  /* paged-specific styles */
}

/* Autorun variation */
.ipynb-viewer.autorun {
  /* autorun-specific styles */
}
```

## Data Flow

### 1. Initial Load
```
User visits page
  ↓
EDS loads ipynb-viewer block
  ↓
decorate() function called
  ↓
Fetch notebook JSON from data-ipynb attribute
  ↓
Parse notebook structure
  ↓
Build navigation tree (if notebook mode)
  ↓
Render cells with markdown + code
  ↓
Attach event listeners (run buttons, smart links)
  ↓
Ready for interaction
```

### 2. Tree Navigation Click
```
User clicks tree node
  ↓
Event delegation captures click
  ↓
Identify clicked element (icon or node)
  ↓
Icon: toggleTreeNode() → re-render tree
  ↓
Node: onNodeClick() → scroll to cell or open overlay
  ↓
Update tree state (expanded/selected)
  ↓
Re-render tree with event delegation intact
```

### 3. GitHub Markdown Overlay
```
User clicks .md link
  ↓
Smart link click captured by delegation
  ↓
createGitHubMarkdownOverlay() called
  ↓
Fetch markdown from GitHub raw URL
  ↓
Render markdown to HTML
  ↓
Create overlay with tree navigation
  ↓
Attach delegated listeners for links
  ↓
Display overlay with content
  ↓
User navigates tree or closes overlay
```

### 4. Code Cell Execution
```
User clicks Run button
  ↓
attachRunButtons() captures click
  ↓
Extract code from cell
  ↓
Create execution context
  ↓
Capture console output
  ↓
Execute code with try/catch
  ↓
Display result or error
  ↓
Reset output on next run
```

## Error Handling

### 1. Network Errors
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('Failed to fetch:', error);
  showErrorMessage(IPYNB_CONFIG.LOAD_ERROR_MESSAGE);
}
```

### 2. Code Execution Errors
```javascript
try {
  const result = executeCode();
  displayOutput(result);
} catch (error) {
  displayError(`Error: ${error.message}`);
}
```

### 3. Tree Navigation Errors
```javascript
const node = findNodeById(treeState.tree, nodeId);
if (!node) {
  console.warn('Node not found:', nodeId);
  return; // Graceful degradation
}
onNodeClick(node);
```

## Testing Strategy

### Manual Testing Checklist
- [ ] Initial tree render (all nodes clickable)
- [ ] Expand/collapse notebook sections
- [ ] Click repository items (open overlays)
- [ ] Click notebook items after repository interaction
- [ ] Alternate between notebook and repository clicks
- [ ] Multiple re-renders (verify event listeners persist)
- [ ] Smart links navigation (.md files)
- [ ] Code cell execution (run buttons)
- [ ] Help overlay (context-sensitive)
- [ ] Copy-to-clipboard functionality

### Browser Testing
- Chrome (primary)
- Safari (vendor prefix considerations)
- Firefox (compatibility)
- Mobile browsers (responsive design)

### Performance Testing
- Page load time
- Tree re-render speed
- Memory usage (event listeners)
- Network requests (markdown fetching)

## Known Limitations

1. **JavaScript Execution Scope**
   - Limited to browser context
   - No Node.js APIs available
   - No external module imports

2. **GitHub API Rate Limiting**
   - Unauthenticated requests: 60/hour
   - Consider caching strategy

3. **Markdown Rendering**
   - Basic GFM support
   - No math equations (LaTeX)
   - Limited image optimization

4. **Tree Navigation**
   - Maximum depth: ~5 levels (performance)
   - Large repositories may be slow to scan

## Future Enhancements

### Short-term
- [ ] Add keyboard navigation (arrow keys)
- [ ] Implement search functionality (find in tree)
- [ ] Add breadcrumb navigation (current path)
- [ ] Improve mobile responsiveness (tree panel)

### Medium-term
- [ ] Cache GitHub repository structure (localStorage)
- [ ] Add markdown editing capabilities (inline)
- [ ] Implement code cell output persistence
- [ ] Add export functionality (PDF, HTML)

### Long-term
- [ ] Support for Jupyter kernels (Python, R)
- [ ] Real-time collaboration (WebSockets)
- [ ] Version control integration (git)
- [ ] Advanced markdown features (LaTeX, diagrams)

## Maintenance Guidelines

### Code Reviews
- Verify event delegation pattern maintained
- Check for memory leaks (event listeners)
- Ensure CSS follows naming conventions
- Test all variations (paged, autorun, notebook)

### Adding New Features
1. Update IPYNB_CONFIG if new configuration needed
2. Follow functional organization (decorate → components → helpers)
3. Use event delegation for interactive elements
4. Document in block-architecture.md
5. Update README.md with usage examples

### Performance Monitoring
- Monitor bundle size (target: <100KB)
- Check event listener count (use Chrome DevTools)
- Profile re-render performance (aim: <16ms)
- Test with large notebooks (100+ cells)

## References

### Internal Documentation
- [README.md](README.md) - Usage and features guide
- [EXAMPLE.md](EXAMPLE.md) - Markdown examples
- [CLAUDE.md](../../CLAUDE.md) - Project guidelines
- [LEARNINGS.md](../../LEARNINGS.md) - Documented patterns

### External Resources
- [Jupyter Notebook Format](https://nbformat.readthedocs.io/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Event Delegation Pattern](https://javascript.info/event-delegation)
- [EDS Block Development](https://www.aem.live/developer/block-collection)

## Changelog

### Version 2.0.2 (2026-01-13)
- **Fixed:** Fallback click handler in GitHub markdown overlay now handles all node types
- **Impact:** Clicking notebook items (parts/cells) from within markdown overlay now works correctly
- **Root Cause:** Fallback handler only processed markdown nodes, ignoring part/cell clicks
- **Solution:** Enhanced fallback handler to close overlay for notebook nodes, revealing parent paged overlay
- **Behavior:**
  - Cell/part clicks → Close overlay (user sees notebook)
  - Markdown clicks → Navigate to markdown file
  - Root/folder clicks → Handled by expand/collapse icon only

### Version 2.0.1 (2026-01-13)
- **Fixed:** Event delegation now uses `tree` parameter (closure) instead of `treeState.tree`
- **Impact:** Notebook area clicks now work correctly in all contexts (paged overlay, GitHub markdown overlay)
- **Root Cause:** `treeState.tree` was undefined in some contexts (GitHub overlay fallback case)
- **Solution:** Use function parameter captured in closure instead of state property

### Version 2.0 (2026-01-13)
- **Breaking:** Implemented event delegation pattern for tree navigation
- **Added:** `findNodeById()` helper function
- **Modified:** `renderNavigationTree()` to use delegated listeners
- **Removed:** Direct event listeners from `renderTreeNode()`
- **Fixed:** Tree navigation losing event listeners after re-renders
- **Performance:** Reduced event listener count from N to 1

### Version 1.x (Legacy)
- Initial implementation with direct event listeners
- Basic tree navigation
- GitHub integration
- Code execution engine
- Multiple viewing modes

## Contributors

- **Tom Cranstoun** - Original implementation
- **Claude (Anthropic)** - Event delegation refactoring (2026-01-13)

## License

Same as project root (see repository LICENSE file)
