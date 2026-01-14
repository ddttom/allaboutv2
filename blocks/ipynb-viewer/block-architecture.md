# ipynb-viewer Block Architecture

## Overview

The ipynb-viewer block is a sophisticated component for displaying and interacting with Jupyter notebooks (.ipynb files) in Adobe Edge Delivery Services (EDS) environments. It provides multiple viewing modes, interactive JavaScript execution, markdown rendering, and tree-based navigation.

**Version:** 3.0 (Unified Overlay Architecture)
**Last Updated:** 2026-01-14
**Lines of Code:** 3,786 (main block) + ~2,000 (unified overlay modules)

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

### 0. Unified Overlay Architecture (Version 3.0)

**Status**: ✅ Complete implementation in branch `refactor/ipynb-viewer-unified-overlay`

**Problem Solved:** The original implementation used three separate overlay types (`createPagedOverlay()`, `createGitHubMarkdownOverlay()`, `createManualOverlay()`) which caused context confusion, duplicate navigation systems, and complex state management.

**Solution:** Single unified overlay with mode switching instead of multiple separate overlays.

**Location:** `blocks/ipynb-viewer/overlay/` (8 core modules)

**Key Modules:**

1. **hash-manager.js** - URL hash management (parse, update, clear, matches)
2. **navigation.js** - Unified navigation with history, home, back, mode switching
3. **unified-overlay.js** - Core overlay with single state and DOM structure
4. **renderers/notebook.js** - Notebook cell renderer (markdown/code/outputs)
5. **renderers/markdown.js** - Markdown file renderer with smart links
6. **tree.js** - Unified navigation tree (notebook/repository/help sections)
7. **integration.js** - Clean API (`createNotebookOverlay`, `createMarkdownOverlay`)
8. **example-usage.js** - Usage examples

**Architecture Benefits:**

- ✅ **Single overlay, single state** - Eliminates "where am I?" confusion
- ✅ **Mode switching** - Change modes (notebook/markdown/manual) without creating new overlays
- ✅ **Unified navigation** - One navigation system for all content types
- ✅ **Centralized hash management** - Single system for URL state (`#mode/identifier`)
- ✅ **Consistent home button** - Always does the same thing regardless of mode

**Usage Example:**

```javascript
import { createNotebookOverlay } from './overlay/integration.js';

const overlay = createNotebookOverlay(cells, {
  title: 'My Notebook',
  repo: 'https://github.com/user/repo',
  autorun: false,
});

overlay.show();

// Switch to markdown mode
overlay.updateMode('markdown');
overlay.navigate({
  mode: 'markdown',
  identifier: 'docs/README.md',
  title: 'README',
});
```

**Complete Documentation:** See [overlay/README.md](overlay/README.md) for comprehensive 525-line guide covering:

- Module documentation with API reference
- Usage examples and code samples
- State management and event handling
- Debugging guide and testing strategy

**Architecture Comparison:**

**Before (Multiple Overlays):**

```javascript
// Three separate overlay implementations
createPagedOverlay(...)      // Notebook cells
createGitHubMarkdownOverlay(...)  // Markdown files
createManualOverlay(...)     // Help pages
```

**After (Unified Overlay):**

```javascript
// Single overlay with modes
const overlay = createUnifiedOverlay({ mode: 'notebook' });
overlay.updateMode('markdown');  // Switch modes
overlay.updateMode('manual');
```

**Related Documentation:**

- [ipynb-viewer-overlay-refactor-proposal.md](../../docs/for-ai/ipynb-viewer-overlay-refactor-proposal.md) - Original proposal
- [ipynb-viewer-refactor-progress.md](../../docs/for-ai/ipynb-viewer-refactor-progress.md) - Progress tracking
- [ipynb-viewer-unified-overlay-summary.md](../../docs/for-ai/ipynb-viewer-unified-overlay-summary.md) - Complete summary

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

### 2. Unified Tree Handler System

**Problem Solved:** Original implementation had duplicate tree handler code for paged overlay and markdown overlay. When clicking a cell from within a markdown overlay, navigation would fail due to timing issues with handler availability.

**Solution:** Factory pattern with lazy handler resolution that creates context-specific handlers from a single source of truth.

**Location:** Lines 1621-1731

**Architecture:**

1. **Factory Function:** `createTreeNodeClickHandler(context)` creates handlers based on context type
2. **Specialized Handlers:**
   - `handleNotebookNodeClick(node, context)` - Navigate to cells/parts in notebook
   - `handleMarkdownNodeClick(node, context)` - Open markdown files from repository
3. **Lazy Resolution:** Handler availability checked at click time, not creation time

**Key Code:**

```javascript
// Factory creates context-specific handler
function createTreeNodeClickHandler(context) {
  const handler = (node) => {
    switch (node.type) {
      case 'cell':
      case 'part':
        handleNotebookNodeClick(node, context);
        break;
      case 'markdown':
        handleMarkdownNodeClick(node, context);
        break;
    }
  };
  context.handler = handler;
  return handler;
}

// Notebook node handler with lazy resolution
function handleNotebookNodeClick(node, context) {
  if (context.type === 'paged') {
    // Paged overlay: direct navigation
    context.navigateToCell(node);
  } else if (context.type === 'markdown-overlay') {
    // Markdown overlay: close overlay first
    context.closeOverlay();

    // LAZY RESOLUTION: Check at click time (not creation time)
    if (context.parentHistory?.handleTreeNodeClick) {
      context.parentHistory.handleTreeNodeClick(node);
    }
  }
}
```

**Context Object Structure:**

```javascript
{
  type: 'paged' | 'markdown-overlay',
  closeOverlay: Function,           // Close current overlay
  navigateToCell: Function,         // Navigate to cell (paged only)
  openMarkdownOverlay: Function,    // Open markdown overlay
  treeState: Object,                // Tree state (expandedNodes, selectedNode)
  navTreePanel: HTMLElement,        // Tree container element
  helpRepoUrl: string,              // GitHub repo URL
  branch: string,                   // Git branch
  parentHistory: Object,            // Parent overlay's context (for markdown overlays)
  handler: Function                 // Self-reference (for recursive calls)
}
```

**Parent History Context:**

```javascript
const parentHistoryContext = {
  historyArray: navigationHistory,    // Navigation history array
  navigationTree: tree,               // Tree structure
  navTreePanel: element,              // Tree panel element
  treeState: state,                   // Tree state object
  handleTreeNodeClick: handler        // Click handler function
};
```

**Flow:**

1. **Paged Overlay Creation:**
   - Create `parentHistoryContext` object (handler initially null)
   - Create unified handler using factory
   - Store handler in `parentHistoryContext.handleTreeNodeClick`
   - Return overlay object with `parentHistoryContext` exposed

2. **Markdown Overlay Creation:**
   - Receive `parentHistoryContext` from paged overlay
   - Use parent's `handleTreeNodeClick` directly (no fallback creation)
   - Tree clicks navigate through parent's handler

3. **Tree Navigation:**
   - User clicks tree node
   - Handler checks node type and context type
   - For markdown overlay clicking cell: close overlay, call parent handler
   - For paged overlay: navigate directly to cell

**Benefits:**

- **Single source of truth:** Only paged overlay creates handlers
- **Lazy resolution:** Handler availability checked at click time
- **Fail-fast debugging:** Errors logged when architecture is violated
- **Cleaner code:** No duplicate handler creation logic
- **Maintainability:** Changes to navigation logic happen in one place

**Testing Notes:**

- Tree navigation tested from both paged and markdown overlays
- Clicking cells from markdown overlay correctly navigates to cells
- Clicking markdown files from either overlay opens new markdown overlay
- Event propagation controlled with `e.stopPropagation()` and `e.preventDefault()`

### 3. Part Heading Tree Building (Raw Markdown Access)

**Problem Solved:** Tree navigation showing flat structure instead of hierarchical Part nodes after "Part X:" heading stripping was implemented.

**Root Cause:** Timing issue where `createMarkdownCell` strips "Part X:" from H2 headings (line 711) BEFORE cells are added to DOM, then `buildNavigationTree` tries to detect "Part X:" by reading already-rendered cells with `extractHeading`, but they've already been stripped.

**Solution:** Access raw notebook JSON source via `notebookData.cells` array for Part heading detection instead of rendered HTML.

**Location:**

- `buildNavigationTree()` function (lines 1406-1731)
- `extractHeadingFromRaw()` helper function (lines 1461-1480)
- `createPagedOverlay()` function signature (line 1833)

**Implementation:**

**1. Raw Markdown Detection (First Pass):**

```javascript
// Check raw notebook cell data, NOT rendered HTML
if (notebookData && notebookData.cells) {
  notebookData.cells.forEach((cell, index) => {
    if (cell.cell_type === 'markdown') {
      const markdownText = Array.isArray(cell.source)
        ? cell.source.join('')
        : cell.source;
      const lines = markdownText.split('\n');
      lines.forEach((line) => {
        const cleaned = line.trim().replace(/^##\s*/, '');
        if (partRegex.test(cleaned)) {
          hasPartHeadings = true;
        }
      });
    }
  });
}
```

**2. Helper Function for Raw Heading Extraction:**

```javascript
const extractHeadingFromRaw = (cellData) => {
  if (!cellData || cellData.cell_type !== 'markdown') return null;
  const markdownText = Array.isArray(cellData.source)
    ? cellData.source.join('')
    : cellData.source;
  const lines = markdownText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('###')) {
      return { text: trimmed.replace(/^###\s*/, ''), level: 3 };
    }
    if (trimmed.startsWith('##')) {
      return { text: trimmed.replace(/^##\s*/, ''), level: 2 };
    }
    if (trimmed.startsWith('#')) {
      return { text: trimmed.replace(/^#\s*/, ''), level: 1 };
    }
  }
  return null;
};
```

**3. Second Pass Uses Raw Markdown:**

```javascript
cells.forEach((cell, index) => {
  if (cell.classList.contains('ipynb-markdown-cell')) {
    let heading = null;
    let headingText = '';

    // Extract from raw markdown source
    if (notebookData && notebookData.cells && notebookData.cells[index]) {
      heading = extractHeadingFromRaw(notebookData.cells[index]);
      if (heading) {
        headingText = heading.text.trim();
      }
    } else {
      // Fallback to rendered HTML if raw data not available
      heading = extractHeading(cell);
      if (heading) {
        headingText = heading.text.trim();
      }
    }

    // Part regex can now match "Part X:" from raw markdown
    const partMatch = headingText.match(partRegex);
    if (partMatch) {
      // Create Part node
    }
  }
});
```

**4. Parameter Threading:**

```javascript
// Pass notebookData through function call chain
function buildNavigationTree(cells, cellsContainer, _helpRepoUrl, notebookData = null)
function createPagedOverlay(..., notebook = null)

// In decorate() function:
const overlay = createPagedOverlay(container, cellsContainer, shouldAutorun,
  isNotebook, repoUrl, notebookTitle, helpRepoUrl, githubBranch, isNoTopbar, notebook);
```

**Result:**

- **Tree Part nodes:** Display "Part 2: Understanding Invisible Failures" (full text from raw markdown)
- **Tree child cell nodes:** Display "Understanding Invisible Failures" (split on colon)
- **Content pane H2 headings:** Display "Understanding Invisible Failures" (regex stripped)
- **Tree structure:** Hierarchical with Part nodes as parents, cells as children

**Benefits:**

- Separation of concerns: Title stripping for display, raw data for structure
- Hierarchical navigation: Parts contain their child cells
- Consistent behavior: Tree structure matches notebook logical organization
- No timing issues: Raw data always available regardless of render state

**Testing Notes:**

- Tested with notebooks containing "Part X:" and "Chapter X:" prefixes
- Verified Part nodes create proper hierarchy
- Confirmed child cells nest under correct Part parent
- Validated content pane shows stripped headings as intended

### 4. Configuration Object Pattern

**Pattern:** All configurable values centralized at top of file in `IPYNB_CONFIG` object.

**Location:** Lines 1-45

**Structure:**

```javascript
const IPYNB_CONFIG = {
  // Error messages
  LOAD_ERROR_MESSAGE: 'Error loading notebook',

  // File paths
  DEFAULT_HELP_FILE: '/docs/help.md',  // Fetches from allaboutv2 repo main branch

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
- **Repository node:** Contains categorized folders for markdown files from GitHub
  - **Chapters:** preface.md (always first) and chapter-*.md files (alphabetical, expanded by default)
  - **Appendix:** appendix-*.md files (alphabetical, collapsed by default)
  - **Miscellaneous:** Only advice.md, for-ai.md, glossary.md (hardcoded whitelist, alphabetical, collapsed by default)

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
},
{
  id: 'repository',
  label: 'Repository',
  type: 'root',
  level: 0,
  children: [
    {
      id: 'folder-chapters',
      label: 'Chapters',
      type: 'folder',
      level: 1,
      children: [
        { id: 'preface.md', label: 'preface.md', type: 'markdown', level: 2 },
        { id: 'chapter-01.md', label: 'chapter-01.md', type: 'markdown', level: 2 }
      ]
    },
    {
      id: 'folder-appendix',
      label: 'Appendix',
      type: 'folder',
      level: 1,
      children: [
        { id: 'appendix-a.md', label: 'appendix-a.md', type: 'markdown', level: 2 }
      ]
    },
    {
      id: 'folder-miscellaneous',
      label: 'Miscellaneous',
      type: 'folder',
      level: 1,
      children: [
        { id: 'readme.md', label: 'readme.md', type: 'markdown', level: 2 }
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

**Help Button Behavior:**

- Help button fetches `docs/help.md` from fallback repository (allaboutv2)
- Uses `main` branch after refactor merge (not feature branch)
- Opens help overlay on top of current overlay (doesn't close current)
- Preserves tree navigation if help fails to load
- Two help button locations: paged overlay (line 2348) and GitHub overlay (line 3322)

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

**Purpose:** Render markdown content with enhanced features, matching GitHub's behavior.

**Features:**

- GitHub Flavored Markdown (GFM) support
- Smart link transformation (.md → GitHub URLs)
- Code syntax highlighting
- Table rendering
- Image handling
- **Inline HTML escaping** - All inline HTML tags displayed as literal text
- **All six heading levels** - H1 through H6 support (h4, h5, h6 added in v2.1)
- **Bold/italic in lists** - Correct processing order (lists before bold/italic)

**Function:** `parseMarkdown(html)` (lines 19-377 in ipynb-viewer.js)

**Processing Order (Critical):**

1. **Code blocks** - Extract and protect with placeholders
2. **Inline code** - Extract and protect with placeholders
3. **Escaped HTML** - Handle `\<` and `\>` characters
4. **Angle-bracket URLs** - Detect `<https://...>` patterns and convert to markdown link format (BEFORE HTML escaping)
5. **HTML escaping** - Escape remaining `<` and `>` (not in code blocks/inline code)
6. **Tables** - Multi-line processing with header detection
7. **Headers** - H6 → H5 → H4 → H3 → H2 → H1 (largest to smallest)
8. **Lists** - Unordered and ordered lists (BEFORE bold/italic)
9. **Bold** - `**text**` to `<strong>` (AFTER lists)
10. **Italic** - `*text*` to `<em>` (AFTER bold)
11. **Links** - `[text](url)` to `<a href>` including external links with `target="_blank"`
12. **Paragraph wrapping** - Split by double newlines, wrap in `<p>` tags (skip block elements AND placeholders)
13. **Code block restoration** - Replace placeholders with `<pre><code>` (AFTER paragraph processing)
14. **Inline code restoration** - Replace placeholders with `<code>`

**Why Processing Order Matters:**

- **Angle-bracket URLs before escaping:** Allows `<https://...>` to be detected and converted before `<` and `>` are escaped to HTML entities
- **Lists before bold/italic:** Allows `1. **Bold text**` to render as list with bold item
- **Blank lines in lists:** Parser ignores blank lines between items, maintaining continuous numbering (CommonMark/GFM compliance)
- **Code protection:** Prevents markdown processing inside code blocks and inline code
- **HTML escaping after code extraction:** Inline HTML tags become literal text
- **Paragraph wrapping before code restoration:** CRITICAL - Code blocks must be restored AFTER paragraph processing to prevent splitting
- **Placeholder protection:** Block element pattern must recognize `__CODEBLOCK_` placeholders to prevent wrapping in `<p>` tags

**Code Block Restoration Timing (Critical Fix - 2026-01-14):**

The order of code block restoration vs paragraph processing is CRITICAL:

**❌ WRONG - Early Restoration (Original Bug):**

```
1. Extract code blocks → placeholders
2. Restore code blocks → <pre><code>line1\n\nline2</code></pre>
3. Paragraph processing splits by \n\n → BREAKS CODE BLOCKS
   Result: <p><pre><code>line1</p><p>line2</code></pre></p>
```

**✅ CORRECT - Deferred Restoration (Fix):**

```
1. Extract code blocks → placeholders
2. Paragraph processing splits by \n\n → placeholders remain intact (single tokens)
3. Restore code blocks → <pre><code>line1\n\nline2</code></pre> inserted safely
```

**Why this matters:**

- Code blocks often contain blank lines (`\n\n`) for readability
- If restored before paragraph splitting, these blank lines cause the code block to be split into fragments
- Split fragments don't match the `/^<pre/` block element pattern
- Paragraph wrapper then wraps fragments in `<p>` tags, creating invalid HTML
- Result: Code displays on one line with visible `<p>` tags

**Implementation Details:**

The `blockElementPattern` regex must recognize BOTH actual block elements AND placeholders:

```javascript
// ✅ Correct pattern - protects placeholders
const blockElementPattern = /^<(h[1-6]|table|ul|ol|blockquote|pre|hr)|^__CODEBLOCK_/;

// Paragraph processing
html = paragraphs.map((para) => {
  if (blockElementPattern.test(para.trim())) {
    return para.trim();  // Don't wrap block elements or placeholders
  }
  return `<p>${para.trim()}</p>`;
}).join('\n\n');
```

**See:** LEARNINGS.md - "Code Block Rendering Requires Deferred Restoration" for complete analysis

**Paragraph Rendering:**

Double newlines (`\n\n`) indicate paragraph boundaries. The parser:

1. Splits content by double newlines
2. Wraps each paragraph in `<p>` tags
3. Skips wrapping block elements (headers, tables, lists, blockquotes, pre, hr)
4. Converts single newlines within paragraphs to spaces (natural text flow)

**CSS Spacing:**

- GitHub overlay paragraphs: `margin: 1rem 0`, `line-height: 1.6`
- Notebook cell paragraphs: `margin: 0.75rem 0`, `line-height: 1.6`

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

**Inline HTML Escaping Implementation:**

```javascript
// Extract inline code and protect it with placeholders
const inlineCodePlaceholders = [];
html = html.replace(/`([^`]+)`/g, (match, code) => {
  const placeholder = `__INLINECODE_${inlineCodePlaceholders.length}__`;
  inlineCodePlaceholders.push(code);
  return placeholder;
});

// Escape all remaining HTML tags (not in code blocks or inline code)
html = html.replace(/</g, '&lt;');
html = html.replace(/>/g, '&gt;');

// Later: Restore inline code as <code> elements with full entity escaping
inlineCodePlaceholders.forEach((code, index) => {
  const escapedCode = code
    .replace(/&/g, '&amp;')   // Must be first - escape existing ampersands
    .replace(/</g, '&lt;')    // Escape less-than
    .replace(/>/g, '&gt;')    // Escape greater-than
    .replace(/"/g, '&quot;')  // Escape double quotes
    .replace(/'/g, '&#39;');  // Escape single quotes
  html = html.replace(`__INLINECODE_${index}__`, `<code>${escapedCode}</code>`);
});
```

**Why Entity Escaping Order Matters:**
The ampersand (`&`) must be escaped first because other replacements introduce ampersands (like `&lt;`). If we escaped `&` last, we'd double-escape and get `&amp;lt;` instead of `&lt;`.

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

### 5. FOUC Prevention (Flash of Unstyled Content)

- **Pattern:** DocumentFragment for page transitions
- **Implementation:** Build new content off-screen in fragment, then replace in single atomic operation
- **Benefit:** Eliminates visible flash when switching pages
- **Code:** `updatePageDisplay()` function uses `document.createDocumentFragment()`

### 6. Tree State Optimization

- Only Chapters folder expanded by default
- Appendix and Miscellaneous collapsed initially
- Miscellaneous limited to 3 files (advice.md, for-ai.md, glossary.md)
- Reduces initial render complexity

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
   - Basic GFM support (no math equations or LaTeX)
   - Limited image optimization
   - Inline HTML completely escaped (matches GitHub, by design)

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

### Version 3.0 (2026-01-14)

- **Added:** Unified Overlay Architecture (branch: `refactor/ipynb-viewer-unified-overlay`, merged to main)
  - Complete refactor to eliminate multiple overlay confusion
  - Single overlay with mode switching (notebook/markdown/manual)
  - 8 core modules implementing unified navigation system
  - Centralized hash management and state
  - Module documentation in overlay/README.md (525 lines)
  - Architecture benefits: eliminates context confusion, unified navigation, consistent home button
  - Clean API: `createNotebookOverlay()` and `createMarkdownOverlay()`
  - Fresh implementation (no legacy code or migration)
  - Status: Complete and production-ready, merged to main
  - Documentation: See overlay/README.md for comprehensive guide
- **Fixed:** Help button behavior improvements
  - Changed fallback branch from 'refactor/ipynb-viewer-unified-overlay' to 'main' after merge
  - Removed closeOverlay() call to prevent tree disappearing on errors
  - Help overlay now opens on top instead of replacing current overlay
  - Updated docs/help.md to match current implementation (categorized folders)
  - Removed redundant invisible-users/docs/ directory
  - Single source of truth: docs/help.md in allaboutv2 repository
- **Fixed:** Tree ordering for logical reading flow
  - preface.md now always appears first in Chapters folder
  - Other chapters sorted alphabetically after preface
  - Provides logical reading order: preface → chapter-1 → chapter-2, etc.
- **Fixed:** Markdown paragraph rendering and spacing
  - Changed line break handling to wrap paragraphs in `<p>` tags
  - Split content by double newlines to identify paragraphs
  - Block elements (headers, tables, lists) not wrapped
  - Updated CSS spacing: GitHub overlay (1rem margin), notebook cells (0.75rem margin)
  - Added line-height: 1.6 for better readability
  - Removed obsolete `<br>` tag rules
- **Documentation:** Added comprehensive documentation across all project files
  - Updated CHANGELOG.md with unified overlay entry and help button fixes
  - Updated CLAUDE.md with new critical section
  - Updated README.md with unified overlay reference and help button requirements
  - Updated block-architecture.md with help button behavior details
  - Updated docs/for-ai/index.md with dedicated section
  - Created ipynb-viewer-unified-overlay-summary.md (complete summary)
  - Created ipynb-viewer-refactor-progress.md (progress tracking)
  - Created ipynb-viewer-overlay-refactor-proposal.md (original proposal)

### Version 2.3 (2026-01-14)

- **Added:** Part heading tree building from raw notebook JSON source
  - Fixed flat tree structure by accessing raw markdown instead of rendered HTML
  - Created `extractHeadingFromRaw()` helper function to extract headings from notebook cells
  - Modified `buildNavigationTree()` to accept `notebookData` parameter
  - Updated first pass to detect Part headings from raw cell source
  - Updated second pass to use raw markdown for Part regex matching
  - Threaded `notebookData` parameter through call chain (decorate → createPagedOverlay → buildNavigationTree)
  - Result: Hierarchical tree with Part nodes as parents, cells as children
- **Cleanup:** Removed all console.log statements for production cleanliness
  - Removed 51 logging console.log statements throughout codebase
  - Preserved 4 functional console.log statements for code execution capture
  - Removed 1 orphaned object literal that caused syntax error
  - Final line count: 3,786 lines (down from 3,838 lines)
  - Validated syntax with `node -c ipynb-viewer.js`
- **Documentation:** Added comprehensive entry to LEARNINGS.md about console.log removal context
  - Documented "Removing Console.log Statements - Context Matters" (lines 631-795)
  - Explained why simple line deletion breaks code (orphaned object literals)
  - Provided safe removal strategy with pattern matching
  - Real examples of mistakes and their symptoms

### Version 2.2 (2026-01-14)

- **Added:** Unified Tree Handler System
  - Factory pattern with lazy handler resolution for context-specific handlers
  - Created `createTreeNodeClickHandler(context)` factory function
  - Specialized handlers: `handleNotebookNodeClick()` and `handleMarkdownNodeClick()`
  - Single source of truth: Only paged overlay creates handlers
  - Parent history context for markdown overlays
  - Fixed navigation from markdown overlays to notebook cells
  - Fail-fast debugging with logged errors when architecture violated

### Version 2.1 (2026-01-14)

- **Added:** Inline HTML escaping in markdown rendering (matches GitHub behavior)
  - Inline HTML tags like `<div>`, `<img>`, `<script>` now display as literal text
  - Inline code protection with placeholder pattern
  - Escape all `<` and `>` characters not in code blocks or inline code
  - Result: `<div>tag</div>` displays as visible text, not rendered HTML
- **Added:** Support for h4, h5, h6 heading levels
  - Previously only h1-h3 were supported
  - Now all six heading levels (H1-H6) render correctly
  - Processing order: h6 → h5 → h4 → h3 → h2 → h1
- **Fixed:** Bold/italic text in lists not rendering correctly
  - Root cause: Bold/italic processing happened before list processing
  - Solution: Moved list processing before bold/italic processing
  - Result: `1. **Bold text**` now renders correctly as bold list item
- **Fixed:** Ordered lists with blank lines showing restarted numbering
  - Root cause: Parser closed lists when encountering blank lines between items
  - Impact: Lists like "1. Item\n\n2. Item" rendered as two separate `<ol>` elements, both showing "1."
  - Solution: Ignore blank lines within lists, keep list open for sequential numbering
  - Result: Blank lines between items now work correctly (matches CommonMark/GFM spec)
- **Added:** `opening-page` metadata support for automatic navigation
  - Specify markdown file to auto-open when notebook loads
  - Format: `"opening-page": "preface.md"` or `"opening-page": "#preface.md"`
  - URL hash takes precedence (allows user override)
  - Graceful degradation when metadata omitted (opens on first cell)
- **Documentation:** Updated README.md with inline HTML behavior and opening-page examples
- **Testing:** Created test-inline-html.md for verification of all markdown features

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
