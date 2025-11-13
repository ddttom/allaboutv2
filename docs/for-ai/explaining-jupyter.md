# Jupyter Notebook Testing for EDS Blocks

*Related: [EDS Native Testing Standards](testing/eds-native-testing-standards.md) | [Block Architecture Standards](implementation/block-architecture-standards.md) | [Debug Guide](testing/debug.md)*

> **⚠️ NOTE**: This document has been partially updated to reflect browser-only execution. Some sections below may still reference Node.js/JSLab which is no longer supported. The notebook system now runs exclusively in the browser via the ipynb-viewer block. Key updated sections: Overview, Architecture, Browser Execution, Live Preview Feature.

## Overview

This document explains the Jupyter notebook implementation for **interactive testing of EDS blocks using JavaScript in the browser**. Notebooks are executed via the ipynb-viewer block for end-user interaction and testing.

**CURRENT STATE**: The test.ipynb notebook features **browser-only execution**, **simple initialization** with `initialize()` function, **helper functions** (`testBlockFn`, `showPreview`) on window object, and **popup window previews** with `<base>` tag for proper CSS/JS loading.

## What This Is

**Jupyter Notebook Testing** provides an interactive browser-based environment for testing Adobe Edge Delivery Services (EDS) blocks using:
- **JavaScript** (NOT Python)
- **Browser execution** via ipynb-viewer block
- **Native browser APIs** (document, window)
- **Simple initialization** (`initialize()` function sets up helpers)
- **Helper functions** (`window.testBlockFn`, `window.showPreview`)
- **Popup window preview** (isolated preview with full styling via `<base>` tag)
- **Minimal DOM structure** (block as direct child of `<main>`, no wrappers)
- **Interactive execution** (run code cells individually with click)

This allows you to test EDS blocks interactively in the browser and share executable notebooks for end-user interaction. The popup preview system uses the `<base>` tag to properly load CSS and JavaScript from blob URLs, and the minimal DOM structure ensures proper EDS block decoration.

---

## Architecture Overview

### Core Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Jupyter Notebook                                      │
│                       (.ipynb file)                                         │
│                     BROWSER EXECUTION                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │                    ipynb-viewer Block                        │          │
│  │                    (EDS)                                     │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              ↓                                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │              Native Browser APIs                             │          │
│  │              - document                                      │          │
│  │              - window                                        │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              ↓                                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │              Helper Functions:                               │          │
│  │              scripts/ipynb-helpers.js                        │          │
│  │              - initialize()                                  │          │
│  │              - testBlockFn() → window.testBlockFn            │          │
│  │              - showPreview() → window.showPreview            │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              ↓                                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │              EDS Block Decoration                            │          │
│  │              JavaScript Execution                            │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              ↓                                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │              POPUP WINDOW                                    │          │
│  │              Blob URL                                        │          │
│  │              (no files)                                      │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                              ↓                                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │              LIVE PREVIEW UI                                 │          │
│  │  ┌────────────────────────────────────────────────────────┐  │          │
│  │  │  [blockname] Block Preview  [↻ Refresh]  [✕ Close]    │  │          │
│  │  └────────────────────────────────────────────────────────┘  │          │
│  │  ┌────────────────────────────────────────────────────────┐  │          │
│  │  │                                                        │  │          │
│  │  │           Block Content (scrollable)                  │  │          │
│  │  │                                                        │  │          │
│  │  └────────────────────────────────────────────────────────┘  │          │
│  │                                                               │          │
│  │  Features:                                                    │          │
│  │  - Dark themed professional UI                                │          │
│  │  - Refresh button (reload content)                            │          │
│  │  - Close button or ESC key                                    │          │
│  │  - Fullscreen with scrolling                                  │          │
│  │  - Base tag for proper CSS/JS loading                         │          │
│  └───────────────────────────────────────────────────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why Jupyter Notebooks?

**Traditional test.html approach:**
- Requires running development server
- Browser refresh for each change
- Manual testing only
- No inline documentation

**Jupyter notebook approach:**
- Interactive cell-by-cell execution in browser
- Test multiple scenarios in one file
- Inline documentation with Markdown
- Generate styled popup previews
- No server required for testing
- Iterative development with immediate feedback
- Shareable executable notebooks for end users

---

## Browser Execution

The test.ipynb notebook is designed for **browser execution** via the ipynb-viewer block:

### Browser Features

**Purpose:** Interactive block testing and end-user demonstrations

**Features:**
- Native browser APIs (document, window)
- Direct JavaScript execution
- Console output display
- Popup window previews with blob URLs
- Helper functions: `window.testBlockFn()`, `window.showPreview()`

**When to use:**
- Testing EDS blocks interactively
- Sharing executable demos
- Interactive tutorials
- Client presentations
- Live coding examples

### Setup

Simply run Cell 1 which calls `initialize()` to set up the helper functions on the window object:

```javascript
return (async () => {
  const { initialize } = await import('/scripts/ipynb-helpers.js');
  await initialize();
  return '✅ Browser environment ready';
})();
```

---

## Live Preview Feature

The notebook supports **visual popup previews** in the browser!

### Browser Preview

When using `showPreview()`, a popup window opens with the styled block:

**Example:**
```javascript
// Test and preview a block
return (async () => {
  await window.showPreview('accordion', accordionContent);
  return '✓ Preview window opened';
})();
```

**Features:**
- Dark themed professional UI
- Opens in new popup window (1200x800)
- Uses Blob URL (no file system access needed)
- ↻ Refresh button to reload preview
- ✕ Close button (or press ESC)
- Fullscreen with scrolling
- Base tag for proper CSS/JS loading

### Live Preview System with Popup Window (NEW)

**Live previews now use popup windows with `<base>` tag for proper resource loading!**

The preview system opens blocks in a new window using blob URLs, with a `<base>` tag that ensures CSS and JavaScript load correctly from the parent page's origin.

**How it works:**

1. **Creates HTML with base tag**:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <base href="https://main--allaboutv2--ddttom.aem.page/">
     <link rel="stylesheet" href="styles/styles.css">
     <link rel="stylesheet" href="blocks/accordion/accordion.css">
   </head>
   ```

2. **Minimal DOM structure** (no wrapper interference):
   ```html
   <body>
     <div class="preview-header">...</div>  <!-- Fixed position -->
     <main>
       <div class="accordion block" data-block-name="accordion">
         <!-- undecorated block content as direct children -->
       </div>
     </main>
   </body>
   ```

3. **Automatically decorates the block**:
   - Block is direct child of `<main>` - no wrapper interference
   - Dynamically imports `/blocks/blockname/blockname.js` using detected origin
   - Executes the block's default export (decoration function)
   - Runs after DOM is ready with full error handling
   - CSS loads via `<base>` tag, JavaScript via dynamic import

**Key Benefits:**
- ✅ **Base tag solves blob URL issues** - CSS/JS load from correct origin
- ✅ **Clean DOM structure** - Block is direct child of main, no wrappers
- ✅ **EDS-compatible structure** - Follows EDS block decoration patterns
- ✅ **Full styling** - All CSS loads properly via base href
- ✅ **Perfect JavaScript execution** - Module imports work correctly
- ✅ **Fixed header controls** - Don't interfere with block structure
- ✅ **Origin detection** - Automatically uses parent page's origin

**Features:**
- Fixed position dark header with live indicator (pulsing red dot)
- Clean main content area with no wrapper divs
- Refresh and close buttons
- ESC key to close
- Separate window isolation

**Example:**
```javascript
// This creates a fully interactive popup preview
await showPreview('accordion', accordionContent);
// A new window opens with:
// - Full accordion styling from accordion.css
// - Interactive <details> elements
// - Base styles from styles.css
// - Press ESC or click close button to dismiss
```

**How base tag solves blob URL issues:**
Blob URLs (`blob://...`) have a null origin and can't load external resources. The `<base href="https://your-origin/">` tag tells the browser to resolve all relative URLs against the parent page's origin, so `styles/styles.css` becomes `https://your-origin/styles/styles.css`.

**Why minimal DOM structure matters (CRITICAL):**

EDS blocks expect specific DOM structures. Many blocks (like accordion, tabs, cards) look for content rows as direct children of the block element using `block.children`. Extra wrapper divs break the child selection logic.

**Common Issue:**
If preview shows **colored boxes** instead of proper styled elements, even though decoration runs successfully, the cause is **wrapper divs** between `<main>` and the block element.

**The preview uses a clean structure:**
- **Fixed position header** (height: 48px, z-index: 1000, doesn't affect layout flow)
- **`<main>` with top padding** (68px to clear fixed header without overlap)
- **Block as direct child with no intermediary wrappers** ← CRITICAL

**Never do this (BROKEN):**
```html
<main>
  <div class="preview-wrapper">        <!-- ❌ Extra wrapper -->
    <div class="preview-content">      <!-- ❌ Extra wrapper -->
      <div class="accordion block">
        <!-- content -->
      </div>
    </div>
  </div>
</main>
```

**Always do this (WORKS):**
```html
<main>
  <div class="accordion block">
    <!-- content rows as direct children -->
  </div>
</main>
```

**Double-Decoration Prevention:**
The `showPreview()` function passes **undecorated HTML** to the popup. The popup decorates it once after the DOM loads, ensuring proper block behavior without double-processing.

---

## Enhanced Markdown Rendering (NEW)

The **ipynb-viewer block** now supports comprehensive markdown rendering when viewing notebooks in the browser:

### Supported Markdown Features

**Code Blocks (NEW):**
```javascript
// Triple backtick code blocks now render properly
const example = 'with syntax highlighting';
```

**Tables (NEW):**
| Feature | JSLab | Browser |
|---------|-------|---------|
| DOM Creation | ✅ jsdom | ✅ Native |

**Lists (NEW):**
- Unordered lists with `-` or `*`
- Ordered lists with `1.`
- Proper nesting and spacing

**Inline Formatting:**
- **Bold** text with `**text**`
- *Italic* text with `*text*`
- `Inline code` with backticks
- [Links](url) with `[text](url)`

**Headers:**
- `#` H1
- `##` H2
- `###` H3

**Why this matters:**
The Quick Reference sections in test.ipynb now display beautifully in the browser with properly formatted code examples, tables, and lists!

---

## Key Technologies

### 1. JSLab Kernel

**What it is:** A Jupyter kernel that executes JavaScript code instead of Python.

**Installation:**
```bash
npm install -g jslab
```

**Purpose:**
- Runs JavaScript in Jupyter notebook cells
- Provides Node.js environment
- Enables `require()` for Node modules (jsdom, fs, path)

**Alternative:** `tslab` (TypeScript Lab) - similar but supports TypeScript

### 2. jsdom

**What it is:** A pure JavaScript implementation of web standards that simulates a browser DOM.

**Purpose:**
- Creates `document` and `window` objects in Node.js
- Allows DOM manipulation without a real browser
- Enables testing of EDS blocks that manipulate the DOM

**Example:**
```javascript
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
```

### 3. Helper Functions (Context-Aware)

Custom utility functions that adapt to the execution environment.

**NEW: External Helper Module**
Helper functions are now defined in [scripts/ipynb-helpers.js](../../scripts/ipynb-helpers.js) and loaded dynamically in the first code cell. This keeps the notebook clean and makes the helpers reusable across multiple notebooks.

**Benefits:**
- **55% reduction in first code cell size** - From ~220 lines to ~45 lines
- Cleaner notebook experience
- Easier to maintain and update
- Reusable across multiple notebooks
- Better separation of concerns
- Context-aware execution (Node.js and Browser)

**Available Helper Functions:**

**Setup Functions:**
- `setupNodeEnvironment()` - Initialize Node.js/JSLab environment with jsdom and output directory
- `setupBrowserEnvironment()` - Initialize browser environment with helper functions

**Testing Functions:**
- `loadBlockStyles(blockName)` - Load CSS for a block (Node.js only)
- `testBlockFn(blockName, innerHTML)` - Test block decoration (works in both environments)
- `showPreview(blockName, innerHTML, filename, options)` - Visual preview (adapts to environment)

**Preview Functions:**
- `createIframePreview(blockName, blockHTML)` - Generate iframe preview HTML (Node.js and Browser)
- `openIframePreview(blockName, blockHTML)` - Open preview in popup (Browser only - via setupBrowserEnvironment)

#### Setup Functions

##### `initialize()` (Recommended - Works Everywhere!)

**NEW:** Master initialization function that detects environment and does everything automatically.

**What it does:**
- Automatically detects Node.js vs Browser environment
- Calls appropriate setup function (`setupNodeEnvironment` or `setupBrowserEnvironment`)
- **Sets global environment flags** (`isNode`, `isBrowser`)
- **Sets unified API** (doc, testBlockFn, showPreview, createPreviewFn)
- Registers all helper functions globally
- Logs setup completion

**Usage:**
```javascript
const isNode = typeof process !== 'undefined' && process.versions?.node;
const helpersPath = isNode ? './scripts/ipynb-helpers.js' : '/scripts/ipynb-helpers.js';
const { initialize } = await import(helpersPath);
await initialize();
```

**This is now the recommended way to set up notebooks!**

##### `setupNodeEnvironment()` (Node.js only)

Initializes the complete Node.js/JSLab testing environment.

**What it does:**
- Loads and configures jsdom for virtual DOM
- Sets up global DOM objects (document, window, HTMLElement, etc.)
- **Sets global environment flags** (`global.isNode = true`, `global.isBrowser = false`)
- Creates output directory (`ipynb-tests/`) if it doesn't exist
- Logs initialization status

**Usage:**
```javascript
const helpers = await import('./scripts/ipynb-helpers.js');
await helpers.setupNodeEnvironment();
```

**No parameters needed** - automatically configures everything.

##### `setupBrowserEnvironment()` (Browser only)

Initializes browser helper functions for interactive testing.

**What it does:**
- **Sets global environment flags** (`window.isNode = false`, `window.isBrowser = true`)
- Defines `testBlockFn()` - Test blocks with native APIs
- Defines `window.displayBlock()` - Create styled containers
- Defines `window.createIframePreview()` - Generate iframe HTML
- Defines `window.openIframePreview()` - Open preview in popup
- Logs available functions

**Usage:**
```javascript
const helpers = await import('./scripts/ipynb-helpers.js');
helpers.setupBrowserEnvironment();
```

**No parameters needed** - automatically configures everything.

---

#### Testing Functions

##### Unified API: `testBlockFn(blockName, innerHTML)`
Tests a block's decoration function with provided content.

**Parameters:**
- `blockName`: Name of the block (e.g., 'accordion')
- `innerHTML`: HTML content structure (EDS table format)

**Returns:** The decorated block element (jsdom)

**Example:**
```javascript
const block = await global.testBlock('accordion', `
  <div>
    <div>Question 1</div>
    <div>Answer 1</div>
  </div>
`);
console.log(block.outerHTML);
```

#### Unified API: `showPreview(blockName, innerHTML, filename, options)`
Saves the decorated block as styled HTML file(s).

**Parameters:**
- `blockName`: Name of the block
- `innerHTML`: HTML content structure
- `filename`: Optional custom filename (default: `${blockName}-preview.html`)
- `options`: Configuration object
  - `livePreview`: Boolean (default: true) - Create live preview wrapper

**Returns:** Path to the saved preview file

**Creates TWO files by default:**
1. `blockname-preview.html` - Actual styled block
2. `blockname-live-preview.html` - Interactive iframe wrapper

**Example:**
```javascript
// Creates both preview and live-preview files
await showPreview('accordion', accordionContent);

// Disable live preview (only creates preview.html)
await showPreview('accordion', accordionContent, null, { livePreview: false });
```

#### Node.js Mode: `global.loadBlockStyles(blockName)`
Loads CSS styles for a block into the virtual DOM.

**Parameters:**
- `blockName`: Name of the block

**Returns:** CSS content string or null

**Example:**
```javascript
await global.loadBlockStyles('accordion');
```

#### Browser Mode: `window.testBlock(blockName, innerHTML)`
Creates a block element (does not decorate).

**Parameters:**
- `blockName`: Name of the block
- `innerHTML`: HTML content

**Returns:** Basic block element

**Example:**
```javascript
const block = await testBlockFn('test', '<div>Content</div>');
console.log(block);
```

**Parameters:**
- `block`: The decorated block element
- `blockName`: Name of the block (for CSS linking)
- `filename`: Output HTML file name

**Output:** HTML file with:
- Linked EDS core styles
- Linked block-specific CSS
- The decorated block content
- Live CSS reload (file watching)

**Example:**
```javascript
showPreview(block, 'hero', 'hero-preview.html');
// Creates ipynb-tests/hero-preview.html with live CSS
```

#### `loadBlockStyles(blockName)`
Returns the CSS link tags for a block.

**Purpose:** Manually link block styles in generated HTML

---

## File Structure

```
project/
├── ipynb-tests/                    # Notebook test directory
│   ├── test-hero.ipynb            # Test notebook for hero block
│   ├── test-cards.ipynb           # Test notebook for cards block
│   ├── hero-preview.html          # Generated preview (with CSS)
│   └── cards-preview.html         # Generated preview
│
├── blocks/                         # EDS blocks
│   ├── hero/
│   │   ├── hero.js                # Block JavaScript
│   │   ├── hero.css               # Block styles
│   │   └── test.html              # Traditional test file
│   └── cards/
│       ├── cards.js
│       ├── cards.css
│       └── test.html
│
└── styles/                         # EDS core styles
    ├── styles.css
    ├── fonts.css
    └── lazy-styles.css
```

---

## Workflow

### 1. Setup (One-time)

```bash
# Install JSLab kernel globally
npm install -g jslab

# Install jsdom in project
npm install jsdom --save-dev

# Install VS Code Jupyter extension
# (if not already installed)
```

### 2. Create Test Notebook

Create `ipynb-tests/test-your-block.ipynb` in VS Code:

**First Code Cell: One-Line Initialization (NEW - ULTRA SIMPLE!)**
```javascript
// ============================================================================
// SETUP: One-line initialization! (works in both JSLab and Browser)
// ============================================================================

return (async () => {
  const isNode = typeof process !== 'undefined' && process.versions?.node;
  const helpersPath = isNode ? './scripts/ipynb-helpers.js' : '/scripts/ipynb-helpers.js';
  const { initialize } = await import(helpersPath);
  await initialize();

  // Return simple success message
  const context = isNode ? 'Node.js' : 'Browser';
  return `✅ Environment (${context}) setup`;
})();
```

**Benefits of New First Code Cell:**
- **96% smaller** - Reduced from original ~220 lines to just 13 lines!
- **One function call** - `initialize()` does everything automatically
- **Ultra simple** - Easiest possible setup with clean output
- **Context-aware** - Automatically detects and adapts to Node.js or browser
- **Clean messages** - Simple success message shows context without verbosity
- **Sets global flags** - `isNode` and `isBrowser` available in all subsequent cells
- **Sets unified API** - `doc`, `testBlockFn`, `showPreview` available everywhere
- **Success confirmation** - Returns `✅ Environment (Node.js) setup` or `✅ Environment (Browser) setup`
- **Maintainable** - All logic in external module

**Example Output:**
```
✅ Environment (Node.js) setup
```

Or in browser:
```
✅ Environment (Browser) setup
```

**Global Environment Flags:**

The first code cell sets global environment flags that are available in ALL subsequent cells:

**Node.js (JSLab):**
```javascript
global.isNode      // true
global.isBrowser   // false
```

**Browser (ipynb-viewer):**
```javascript
window.isNode      // false
window.isBrowser   // true
```

**Usage:** Simply reference `isNode` or `isBrowser` directly in any cell - no need to re-detect!

### Context-Aware Access Pattern (CRITICAL)

**IMPORTANT:** To access the unified API in subsequent cells, you MUST use the context-aware pattern:

```javascript
const g = getGlobal();
```

**Why this is required:**
- In JSLab/Node.js: Each cell has its own scope, must access functions via `global.*`
- In Browser/ipynb-viewer: Each cell has its own scope, must access functions via `window.*`
- You cannot use bare identifiers like `doc`, `testBlockFn`, `showPreview` directly
- The `getGlobal()` helper automatically picks the right global object (`window` or `global`)

**Pattern to use in EVERY cell (after Cell 1):**

```javascript
return (async () => {
  // Step 1: Get context-aware reference (REQUIRED!)
  const g = getGlobal();

  // Step 2: Use the unified API through g
  const block = await g.testBlockFn('blockname', '<div>content</div>');
  await g.showPreview('blockname', '<div>content</div>');
  const div = g.doc.createElement('div');

  // Step 3: Check environment if needed
  if (g.isNode) {
    console.log('Running in Node.js/JSLab');
  }

  return block.outerHTML;
})();
```

**What's available through `g`:**
- `g.getGlobal()` - Helper function to get global object
- `g.doc` - Document object (jsdom or native DOM)
- `g.isNode` - Environment flag (true in Node.js)
- `g.isBrowser` - Environment flag (true in Browser)
- `g.testBlockFn()` - Test block decoration
- `g.showPreview()` - Create/show preview (adapts to environment)
- `g.createPreviewFn()` - Create iframe preview HTML

**Cell 2: Test Your Block (Using Global G)**
```javascript
// Just use G - no setup code needed!
return (async () => {
  const block1 = await G.testBlockFn('your-block', `
    <div>
      <div>Title 1</div>
      <div>Description 1</div>
    </div>
    <div>
      <div>Title 2</div>
      <div>Description 2</div>
    </div>
  `);

  console.log('Basic test:');
  console.log(block1.outerHTML);
  return block1.outerHTML;
})();
```

**Cell 3: Generate Preview with Live Iframe (Using Global G)**
```javascript
// Just use G - one function automatically adapts to environment!
return (async () => {
  const content = `
    <div>
      <div>Title 1</div>
      <div>Description 1</div>
    </div>
    <div>
      <div>Title 2</div>
      <div>Description 2</div>
    </div>
  `;

  return await G.showPreview('your-block', content);
})();
```

### 3. Run and Iterate

1. Execute cells sequentially (Shift+Enter)
2. View output inline
3. Make changes to block JavaScript
4. Re-run cells to test changes
5. Open generated HTML previews in browser
6. CSS changes reload automatically (file watching)

---

## Content Structure Patterns

### EDS Table Format

EDS blocks expect content in a table structure (rows and columns):

```javascript
// Two-column structure (common)
const contentHTML = `
  <div><!-- Row 1 -->
    <div>Column 1 content</div>
    <div>Column 2 content</div>
  </div>
  <div><!-- Row 2 -->
    <div>Column 1 content</div>
    <div>Column 2 content</div>
  </div>
`;
```

### With Images

```javascript
const contentHTML = `
  <div>
    <div>
      <picture>
        <img src="../images/hero.jpg" alt="Hero image">
      </picture>
    </div>
    <div>Hero text content</div>
  </div>
`;
```

### With Links

```javascript
const contentHTML = `
  <div>
    <div>
      <a href="https://example.com">Click here</a>
    </div>
    <div>Link description</div>
  </div>
`;
```

---

## Advantages Over test.html

| Feature | test.html | Jupyter Notebook |
|---------|-----------|------------------|
| **Setup** | Development server required | No server needed |
| **Iteration** | Browser refresh | Run cell |
| **Multiple Tests** | Multiple files or sections | Multiple cells |
| **Documentation** | Comments only | Markdown + code |
| **Output** | Browser console | Inline display |
| **Debugging** | Browser DevTools | Console logs inline |
| **HTML Preview** | Manual creation | Auto-generated with CSS |
| **Experimentation** | Reload page | Rerun cell |

---

## Common Use Cases

### 1. Rapid Prototyping

Test block logic without setting up a full environment:

```javascript
// Quick test of content extraction
return (async () => {
  const block = await G.testBlockFn('hero', `<div><div>Title</div></div>`);
  console.log('Extracted title:', block.querySelector('h1')?.textContent);
})();
```

### 2. Multiple Scenarios

Test different configurations in separate cells:

```javascript
// Cell 1: Default layout
return (async () => {
  const defaultBlock = await G.testBlockFn('cards', contentHTML);
  return defaultBlock.outerHTML;
})();

// Cell 2: Grid layout
return (async () => {
  const gridBlock = await G.testBlockFn('cards', contentHTML, { layout: 'grid' });
  return gridBlock.outerHTML;
})();

// Cell 3: List layout
return (async () => {
  const listBlock = await G.testBlockFn('cards', contentHTML, { layout: 'list' });
  return listBlock.outerHTML;
})();
```

### 3. Edge Cases

Test error handling and edge cases:

```javascript
// Empty content
return (async () => {
  const emptyBlock = await G.testBlockFn('hero', '');
  console.log('Empty content handled:', emptyBlock.innerHTML);
  return emptyBlock.outerHTML;
})();

// Invalid structure
return (async () => {
  const invalidBlock = await G.testBlockFn('hero', '<div>Only one cell</div>');
  console.log('Invalid structure handled:', invalidBlock.innerHTML);
  return invalidBlock.outerHTML;
})();
```

### 4. Documentation

Combine Markdown cells with code cells for living documentation:

```markdown
## Hero Block Tests

The hero block displays a large heading and supporting text.
It supports both single and double-column layouts.

### Test 1: Basic Usage
```

```javascript
const block = await testBlockFn('hero', basicContent);
showPreview(block, 'hero', 'hero-basic.html');
```

---

## IPynb Viewer Block (NEW)

The **ipynb-viewer** EDS block allows you to display and execute Jupyter notebooks directly on your website.

### Features

- **Parse .ipynb files**: Loads and displays Jupyter notebook JSON format
- **Markdown rendering**: Converts markdown cells to formatted HTML with tables, code blocks, lists
- **Interactive execution**: Run JavaScript code cells with a click (async/await support)
- **Automatic initialization check**: Warns if the first code cell hasn't been run first
- **Console capture**: Shows console.log() and console.error() output
- **Result display**: Shows return values from code execution
- **Error handling**: Catches and displays errors with styling
- **Sequential execution**: Encourages running the first code cell first for proper setup

### Usage in EDS

Add the block to your Google Doc:

```
| IPynb Viewer |
|--------------|
| /notebooks/test.ipynb |
```

### What Gets Executed

When users click "Run" on a code cell:
- **Initialization check** runs first (skipped for first code cell)
- If not the first code cell and not initialized, shows warning to run the first code cell first
- Code executes in the browser using `AsyncFunction` constructor (supports await)
- Console methods are captured during execution
- Results display inline below the cell
- Errors are caught and shown in red
- Successful execution turns the cell border green

**Important:** Always run the first code cell first! It sets up the environment (`doc`, `testBlockFn`, `showPreview`).

### Use Cases

1. **Interactive Tutorials**: Step-by-step coding lessons
2. **Documentation with Examples**: Combine explanations with runnable code
3. **Data Exploration**: Allow users to run calculations
4. **Testing Tools**: Provide interactive testing utilities
5. **Client Demos**: Share executable examples

### Security Considerations

- Code runs in the user's browser context
- Has access to the global scope and DOM
- Be cautious with untrusted notebook files
- Consider additional sandboxing for public sites

### Related Files

- **Block implementation**: [blocks/ipynb-viewer/ipynb-viewer.js](../../blocks/ipynb-viewer/ipynb-viewer.js)
- **Block styles**: [blocks/ipynb-viewer/ipynb-viewer.css](../../blocks/ipynb-viewer/ipynb-viewer.css)
- **Block documentation**: [blocks/ipynb-viewer/README.md](../../blocks/ipynb-viewer/README.md)
- **Example notebook**: [notebooks/example.ipynb](../../notebooks/example.ipynb)
- **Context-aware notebook**: [test.ipynb](../../test.ipynb)

---

## Limitations

### What Notebooks CAN'T Do (in JSLab)

1. **Real Browser Testing**
   - No actual rendering in JSLab
   - CSS computed styles not available
   - No browser-specific behaviors
   - **Solution**: Use live preview or ipynb-viewer for visual testing

2. **User Interactions** (in JSLab)
   - Can't test clicks, hovers, focus
   - No event simulation
   - **Solution**: Use ipynb-viewer block for interactive testing in browser

3. **Network Requests** (in JSLab)
   - fetch() won't work in jsdom
   - Need to mock or stub API calls
   - **Solution**: Test network features in browser mode

4. **Browser APIs**
   - IntersectionObserver, ResizeObserver not available
   - localStorage, sessionStorage limited
   - window.matchMedia not fully supported

### What Notebooks CAN Do

1. **DOM Manipulation** (JSLab)
   - Test decorate functions
   - Verify element creation
   - Check HTML structure

2. **Content Extraction** (JSLab)
   - Parse EDS table structure
   - Extract text, images, links
   - Test data transformation

3. **Logic Testing** (Both modes)
   - Configuration handling
   - Conditional rendering
   - Content processing

4. **HTML Generation** (JSLab)
   - Create styled previews with live preview wrapper
   - Visual verification in browser
   - Documentation artifacts

5. **Interactive Execution** (Browser mode)
   - Run pure JavaScript calculations
   - Execute code cells in ipynb-viewer
   - Display results inline
   - Interactive tutorials and demos

---

## Quick Start Guide

### For Development (JSLab)

1. **Install dependencies:**
   ```bash
   npm install -g jslab
   npm install jsdom
   ```

2. **Open the notebook:**
   ```bash
   code test.ipynb  # Opens in VS Code with Jupyter extension
   ```

3. **Run the first code cell** to initialize the environment

4. **Test a block:**
   ```javascript
   await showPreview('accordion', '<div><div>Q</div><div>A</div></div>');
   ```

5. **Open the live preview:**
   - Open `ipynb-tests/accordion-live-preview.html` in your browser
   - Use refresh button to reload after changes
   - Press ESC to close

### For End Users (Browser)

1. **Add ipynb-viewer block** to your EDS page:
   ```
   | IPynb Viewer |
   |--------------|
   | /notebooks/test.ipynb |
   ```

2. **Important: Run the first code cell in browser!**
   - The first code cell works in both Node.js/JSLab AND browser
   - It automatically detects the environment and sets up accordingly
   - In browser, it will show helpful messages and confirm successful setup
   - Start executing from Cell 2 onwards
   - All other cells work perfectly in browser

3. **Users can:**
   - Read markdown documentation
   - Click "Run" on code cells (starting from Cell 2)
   - See console output and results
   - Execute JavaScript interactively
   - Learn through runnable examples

---

## Best Practices

### 1. Choose the Right Mode

- **JSLab Mode**: Block development, testing, HTML generation
- **Browser Mode (ipynb-viewer)**: End-user interaction, demos, tutorials
- **Live Preview**: Visual verification of styled blocks
- **test.html**: Full browser testing with EDS core loaded

### 2. Use the Global G Object

Write code that works in both environments using the global G object:

```javascript
// No setup code needed - just use G!
const div = G.doc.createElement('div');

// Conditional features
if (G.isNode) {
  // JSLab-specific code (file I/O, block testing)
  await G.showPreview('myblock', content);
} else {
  // Browser-specific code (pure JavaScript)
  console.log('Result:', 42);
}
```

### 2. Structure Your Notebooks

```
First code cell: Setup (jsdom, helpers)
Cell 2: Helper functions
Cell 3-N: Test cases (one per cell)
Cell N+1: Generate previews
Cell N+2: Cleanup/summary
```

### 3. Add Markdown Documentation

Explain what each test does and why:

```markdown
### Test Case 3: Grid Layout with 3 Columns

This tests the block's ability to display items in a grid
with a configurable number of columns using data attributes.
```

### 4. Save Previews for Visual Verification

Always generate HTML previews for visual checks:

```javascript
return (async () => {
  await G.showPreview('your-block', content);
  // In Node.js: Files saved to ipynb-tests/
  // In Browser: Opens popup window
})();
```

### 5. Keep Tests Focused

One test scenario per cell for clarity:

```javascript
// ❌ BAD - Multiple tests in one cell
return (async () => {
  const block1 = await G.testBlockFn('hero', content1);
  const block2 = await G.testBlockFn('hero', content2);
  const block3 = await G.testBlockFn('hero', content3);
})();

// ✅ GOOD - Separate cells for each test
// Cell 1:
return (async () => {
  const block1 = await G.testBlockFn('hero', content1);
  return block1.outerHTML;
})();

// Cell 2:
return (async () => {
  const block2 = await G.testBlockFn('hero', content2);
  return block2.outerHTML;
})();
```

---

## Troubleshooting

### Issue: Module Not Found

**Error:** `Cannot find module './blocks/your-block/your-block.js'`

**Solution:**
```javascript
// Use path.join with __dirname
const blockPath = path.join(__dirname, '..', 'blocks', blockName, `${blockName}.js`);
```

### Issue: require() Not Working

**Error:** `require is not defined`

**Solution:** Make sure JSLab kernel is selected, not Python kernel.

In VS Code:
1. Click kernel selector (top right)
2. Choose "jslab" or "JavaScript"
3. Reload notebook

### Issue: Changes Not Reflected

**Error:** Code changes don't appear when rerunning cell

**Solution:** Clear require cache:
```javascript
delete require.cache[require.resolve(blockPath)];
const blockModule = require(blockPath);
```

### Issue: CSS Not Loading in Preview

**Error:** Generated HTML has no styles

**Solution:** Check relative paths:
```javascript
// Make sure paths are relative to the HTML file location
<link rel="stylesheet" href="../blocks/${blockName}/${blockName}.css">
```

---

## Integration with Claude Code

The Jupyter notebook testing system integrates with Claude Code through:

### Slash Command

```bash
/jupyter-notebook <block-name>
```

Creates a new notebook for testing the specified block with:
- Pre-configured jsdom setup
- Helper functions included
- Example test cases
- Proper file structure

### Skill Activation

The `jupyter-notebook-testing` skill activates when:
- Working with `.ipynb` files
- Using keywords: "jupyter", "notebook", "testBlock"
- Creating interactive tests

This provides:
- Guidance on notebook structure
- Helper function documentation
- Troubleshooting tips
- Best practices

---

## Comparison with Other Testing Approaches

| Feature | test.html | Jupyter (JSLab) | Live Preview | ipynb-viewer | Automated Tests |
|---------|-----------|-----------------|--------------|--------------|-----------------|
| **Real rendering** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| **Server required** | ✅ Yes | ❌ No | ❌ No | ✅ Yes | ❌ No |
| **Interactive** | ✅ Yes | ✅ Yes | ⚠️ Limited | ✅ Yes | ❌ No |
| **Multiple scenarios** | ❌ No | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Documentation** | ❌ No | ✅ Inline | ❌ No | ✅ Inline | ⚠️ Separate |
| **Visual feedback** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| **Block decoration** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Browser APIs** | ✅ Full | ⚠️ Limited | ✅ Full | ✅ Full | ⚠️ Mocked |
| **Refresh controls** | ⚠️ Manual | ⚠️ Rerun | ✅ Button | ✅ Button | ❌ No |
| **Closeable UI** | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **CI/CD** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **End-user facing** | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No |

### test.html (Browser-based)

**Best for:** Visual testing, interactions, browser-specific behavior, final validation

**Pros:**
- Real browser rendering
- Full browser APIs
- User interaction testing
- Browser DevTools

**Cons:**
- Requires dev server
- Manual refresh workflow
- One scenario per file
- No inline documentation

### Jupyter Notebooks - JSLab Mode

**Best for:** Block development, logic testing, rapid prototyping, documentation

**Pros:**
- No server required
- Interactive iteration
- Multiple scenarios in one file
- Inline markdown documentation
- Generates HTML previews

**Cons:**
- No real rendering
- Limited browser APIs
- No interaction testing
- Node.js environment only

### Live Preview (NEW)

**Best for:** Visual verification of styled blocks during development

**Pros:**
- Professional dark-themed UI
- Refresh button for quick updates
- ESC/Close button for convenience
- Fullscreen iframe display
- No manual file management

**Cons:**
- Static preview only
- No interactivity with block code
- Requires opening in browser

### ipynb-viewer Block (NEW)

**Best for:** End-user interaction, tutorials, demos, documentation

**Pros:**
- Interactive code execution in browser
- Runs on actual EDS pages
- Shareable executable notebooks
- Perfect for tutorials
- Real browser environment

**Cons:**
- Requires publishing notebook
- Security considerations with user code
- Can't test block decoration
- Browser-only features

### Automated Tests (Jest/Mocha)

**Best for:** Regression testing, CI/CD, coverage

**Pros:**
- CI/CD integration
- Regression testing
- Coverage reports
- Fast execution

**Cons:**
- Setup complexity
- No visual feedback
- Not interactive
- Mocked environments

---

## Related Documentation

- **[EDS Native Testing Standards](testing/eds-native-testing-standards.md)** - Traditional test.html approach
- **[Block Architecture Standards](implementation/block-architecture-standards.md)** - Block development patterns
- **[Debug Guide](testing/debug.md)** - Debugging workflows
- **[Jupyter Notebook Skill](.claude/skills/jupyter-notebook-testing.md)** - Claude Code skill

---

## Conclusion

The Jupyter notebook testing system now provides a **complete testing and interaction ecosystem** with multiple modes:

### Development Workflow
1. **JSLab Mode**: Develop and test blocks with jsdom
2. **Live Preview**: Verify visual styling with interactive controls
3. **test.html**: Validate browser behavior and interactions
4. **ipynb-viewer**: Share executable notebooks with end users

### Key Benefits

**Context-Aware Execution:**
- Same notebook works in Node.js AND browser
- Automatic environment detection
- No code duplication
- External helper module for maintainability

**Live Preview (NEW - Both Environments):**
- Professional iframe wrapper with controls
- Node.js: Saves to files (ipynb-tests/)
- Browser: Opens in popup window (Blob URL)
- Instant visual feedback
- Dark themed UI with refresh/close buttons
- ESC key support

**End-User Interaction:**
- Share executable notebooks via ipynb-viewer block
- Interactive tutorials and demos
- Real browser execution
- Same live preview UI available

**Comprehensive Testing:**
- Logic testing in JSLab with jsdom
- Visual testing with live preview (both modes)
- Browser testing with test.html
- Interactive testing with ipynb-viewer
- Automated testing with Jest/Mocha (future)

### Recommended Workflow

1. **Develop** in JSLab with `testBlock()` and `showPreview()`
2. **Preview** with the generated live-preview.html file
3. **Validate** in browser with test.html
4. **Share** interactive demos with ipynb-viewer block
5. **Automate** with Jest/Mocha for CI/CD

This comprehensive approach gives you **speed, interactivity, visual feedback, and shareability** all in one cohesive system.
