# Jupyter Notebook Testing for EDS Blocks

*Related: [EDS Native Testing Standards](testing/eds-native-testing-standards.md) | [Block Architecture Standards](implementation/block-architecture-standards.md) | [Debug Guide](testing/debug.md)*

## Overview

This document explains the Jupyter notebook implementation for **interactive testing of EDS blocks using JavaScript**. This is NOT Python-based testing—it uses JavaScript with jsdom for virtual DOM manipulation and the JSLab kernel for running JavaScript code in Jupyter notebooks.

**NEW**: The test.ipynb notebook is now **context-aware** and works in both Node.js (JSLab) and browser environments, with built-in **live preview** functionality featuring an interactive iframe wrapper with controls.

## What This Is

**Jupyter Notebook Testing** provides an interactive development environment for testing Adobe Edge Delivery Services (EDS) blocks using:
- **JavaScript** (NOT Python)
- **JSLab kernel** (JavaScript execution in Jupyter)
- **jsdom** (Virtual DOM for simulating browser environment)
- **VS Code** (Notebook editing with Jupyter extension)
- **Context-aware execution** (automatically detects Node.js vs browser)
- **Live preview** (interactive iframe wrapper with refresh/close controls)
- **ipynb-viewer block** (execute notebooks interactively in the browser)

This allows you to test EDS blocks interactively without running a full browser or development server, AND share executable notebooks for end-user interaction.

---

## Architecture Overview

### Core Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Jupyter Notebook                                      │
│                       (.ipynb file)                                         │
│                     CONTEXT-AWARE                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  NODE.JS PATH (JSLab)          │      BROWSER PATH (ipynb-viewer)          │
│  ┌──────────────────────┐      │      ┌──────────────────────────┐         │
│  │  JSLab Kernel        │      │      │  ipynb-viewer Block      │         │
│  │  (JavaScript in      │      │      │  (EDS)                   │         │
│  │   Node.js)           │      │      │                          │         │
│  └──────────────────────┘      │      └──────────────────────────┘         │
│           ↓                     │             ↓                             │
│  ┌──────────────────────┐      │      ┌──────────────────────────┐         │
│  │  jsdom Virtual DOM   │      │      │  Native Browser APIs     │         │
│  │  (Simulated)         │      │      │  - document, window      │         │
│  └──────────────────────┘      │      └──────────────────────────┘         │
│           ↓                     │             ↓                             │
│  ┌──────────────────────┐      │      ┌──────────────────────────┐         │
│  │  External Helpers:   │      │      │  Inline Helpers:         │         │
│  │  scripts/            │      │      │  - window.testBlock()    │         │
│  │  ipynb-helpers.js    │      │      │  - window.displayBlock() │         │
│  │  - testBlock()       │      │      │  - window.               │         │
│  │  - saveBlockHTML()   │      │      │    createIframePreview() │         │
│  │  - loadBlockStyles() │      │      │  - window.               │         │
│  │  - createIframe...() │      │      │    openIframePreview()   │         │
│  └──────────────────────┘      │      └──────────────────────────┘         │
│           ↓                     │             ↓                             │
│  ┌──────────────────────┐      │      ┌──────────────────────────┐         │
│  │  EDS Block JS        │      │      │  JavaScript Code         │         │
│  │  Decoration          │      │      │  Execution               │         │
│  └──────────────────────┘      │      └──────────────────────────┘         │
│           ↓                     │             ↓                             │
│  ┌──────────────────────┐      │      ┌──────────────────────────┐         │
│  │  FILE OUTPUT:        │      │      │  POPUP WINDOW:           │         │
│  │  1. preview.html     │      │      │  Blob URL                │         │
│  │  2. live-preview.html│      │      │  (no files)              │         │
│  │  → ipynb-tests/      │      │      │                          │         │
│  └──────────────────────┘      │      └──────────────────────────┘         │
│           ↓                     │             ↓                             │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │              LIVE PREVIEW UI (Both Modes)                    │          │
│  │  ┌────────────────────────────────────────────────────────┐  │          │
│  │  │  🔴 LIVE PREVIEW: [blockname] Block                    │  │          │
│  │  │  [Interactive Preview]  [↻ Refresh]  [✕ Close]        │  │          │
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
│  │  - Status bar showing context                                 │          │
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
- Interactive cell-by-cell execution
- Test multiple scenarios in one file
- Inline documentation with Markdown
- Generate styled HTML previews
- No server required for basic testing
- Iterative development with immediate feedback

**NEW: Context-aware approach:**
- Same notebook works in Node.js AND browser
- Automatic environment detection
- JSLab for development and testing
- Browser execution for end-user interaction
- Live preview with iframe controls
- Shareable interactive notebooks

---

## Context-Aware Execution (NEW)

The test.ipynb notebook now supports **dual execution modes**:

### Node.js Mode (JSLab)
**Purpose:** Development and block testing

**Features:**
- Full jsdom virtual DOM
- Block decoration testing
- HTML file generation
- Live preview creation
- Helper functions: `global.testBlock()`, `global.saveBlockHTML()`, `global.loadBlockStyles()`

**When to use:**
- Developing and testing EDS blocks
- Generating HTML previews
- Interactive experimentation
- Debugging block logic

### Browser Mode (ipynb-viewer)
**Purpose:** End-user interaction and presentations

**Features:**
- Native browser APIs
- Direct JavaScript execution
- Console output display
- No file system access
- Helper function: `window.testBlock()`

**When to use:**
- Sharing executable demos
- Interactive tutorials
- Client presentations
- Live coding examples

### Automatic Detection

The notebook automatically detects the environment:

```javascript
const isNode = typeof process !== 'undefined' && process.versions?.node;
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Use appropriate APIs
const doc = isNode ? global.document : document;
```

---

## Live Preview Feature (NEW)

The notebook now supports **visual iframe previews** in both Node.js and Browser environments!

### Node.js Mode (JSLab)

When using `saveBlockHTML()`, **two files** are automatically created:

#### 1. Preview HTML (`blockname-preview.html`)
The actual styled block content with CSS links.

#### 2. Live Preview HTML (`blockname-live-preview.html`)
An interactive iframe wrapper with controls:

**Features:**
- 🔴 Dark themed professional UI
- ↻ Refresh button to reload preview
- ✕ Close button (or press ESC)
- Status bar showing file location
- Fullscreen iframe display with scrolling
- Keyboard shortcut: ESC to close

**Example:**
```javascript
// In JSLab, this creates BOTH files automatically:
await global.saveBlockHTML('accordion', accordionContent);

// Output:
// ✓ Saved: ipynb-tests/accordion-preview.html
// ✓ Live preview: ipynb-tests/accordion-live-preview.html
//   → Open in browser for live preview with controls
```

**Disable live preview:**
```javascript
await global.saveBlockHTML('accordion', content, null, { livePreview: false });
```

### Browser Mode (ipynb-viewer)

When running in a browser, use `openIframePreview()` to create a popup window:

**Example:**
```javascript
// Test the block
const block = await window.testBlock('accordion', accordionContent);

// Open iframe preview in new window
window.openIframePreview('accordion', block.outerHTML);
```

**Features:**
- Same dark themed UI as Node.js version
- Opens in new popup window (1200x800)
- Uses Blob URL (no file I/O required)
- All iframe controls available
- ESC key to close

### createIframePreview() Function

Both environments support generating the iframe preview HTML:

**Node.js:**
```javascript
const previewHTML = global.createIframePreview('blockname', '<div>block html</div>');
// Use for custom file saving or processing
```

**Browser:**
```javascript
const previewHTML = window.createIframePreview('blockname', '<div>block html</div>');
// Use for custom display or download
```

### Block JavaScript Execution (NEW)

**Live previews now automatically execute block JavaScript!**

When you create a live preview, the preview HTML includes:

1. **Proper block structure** with EDS classes and data attributes:
   ```html
   <div class="blockname block" data-block-name="blockname" data-block-status="initialized">
     <!-- your block content -->
   </div>
   ```

2. **Automatic block decoration** via module script:
   - Dynamically imports `/blocks/blockname/blockname.js`
   - Executes the block's default export (decoration function)
   - Runs after DOM is ready
   - Error handling with console logging

**What this means:**
- Accordion blocks are actually interactive
- Carousel blocks actually cycle through slides
- Any block behavior works in the preview
- No manual decoration required

**Example:**
```javascript
// This creates a fully interactive accordion preview
await showPreview('accordion', accordionContent);
// The preview will have clickable accordion sections!
```

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
Helper functions are now defined in [scripts/ipynb-helpers.js](../../scripts/ipynb-helpers.js) and loaded dynamically in Cell 1. This keeps the notebook clean and makes the helpers reusable across multiple notebooks.

**Benefits:**
- **55% reduction in Cell 1 size** - From ~220 lines to ~45 lines
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
- `testBlock(blockName, innerHTML)` - Test block decoration (Node.js and Browser)
- `saveBlockHTML(blockName, innerHTML, filename, options)` - Save with live preview (Node.js only)

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
- Defines `window.testBlock()` - Test blocks with native APIs
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

##### Node.js Mode: `global.testBlock(blockName, innerHTML)`
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

#### Node.js Mode: `global.saveBlockHTML(blockName, innerHTML, filename, options)`
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
await global.saveBlockHTML('accordion', accordionContent);

// Disable live preview (only creates preview.html)
await global.saveBlockHTML('accordion', accordionContent, null, { livePreview: false });
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
const block = await window.testBlock('test', '<div>Content</div>');
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
saveBlockHTML(block, 'hero', 'hero-preview.html');
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

**Cell 1: One-Line Initialization (NEW - ULTRA SIMPLE!)**
```javascript
// ============================================================================
// SETUP: One-line initialization! (works in both JSLab and Browser)
// ============================================================================

(async () => {
  const isNode = typeof process !== 'undefined' && process.versions?.node;
  const helpersPath = isNode ? './scripts/ipynb-helpers.js' : '/scripts/ipynb-helpers.js';
  const { initialize } = await import(helpersPath);
  return await initialize();
})();
```

**Benefits of New Cell 1:**
- **96% smaller** - Reduced from original ~220 lines to just 9 lines!
- **One function call** - `initialize()` does everything automatically
- **Ultra simple** - Easiest possible setup
- **Context-aware** - Automatically detects and adapts to Node.js or browser
- **Sets global flags** - `isNode` and `isBrowser` available in all subsequent cells
- **Sets unified API** - `doc`, `testBlockFn`, `showPreview` available everywhere
- **Maintainable** - All logic in external module

**Global Environment Flags:**

Cell 1 sets global environment flags that are available in ALL subsequent cells:

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

**Cell 2: Test Your Block (Using Unified API - Even Simpler!)**
```javascript
// No ternary operators needed - unified API just works!
(async () => {
  const block1 = await testBlockFn('your-block', `
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

**Cell 3: Generate Preview with Live Iframe (Super Simple!)**
```javascript
// One function works in both environments!
(async () => {
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

  // One function automatically adapts to environment!
  return await showPreview('your-block', content);
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
const block = await testBlock('hero', `<div><div>Title</div></div>`);
console.log('Extracted title:', block.querySelector('h1')?.textContent);
```

### 2. Multiple Scenarios

Test different configurations in separate cells:

```javascript
// Cell 1: Default layout
const defaultBlock = await testBlock('cards', contentHTML);

// Cell 2: Grid layout
const gridBlock = await testBlock('cards', contentHTML, { layout: 'grid' });

// Cell 3: List layout
const listBlock = await testBlock('cards', contentHTML, { layout: 'list' });
```

### 3. Edge Cases

Test error handling and edge cases:

```javascript
// Empty content
const emptyBlock = await testBlock('hero', '');
console.log('Empty content handled:', emptyBlock.innerHTML);

// Invalid structure
const invalidBlock = await testBlock('hero', '<div>Only one cell</div>');
console.log('Invalid structure handled:', invalidBlock.innerHTML);
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
const block = await testBlock('hero', basicContent);
saveBlockHTML(block, 'hero', 'hero-basic.html');
```

---

## IPynb Viewer Block (NEW)

The **ipynb-viewer** EDS block allows you to display and execute Jupyter notebooks directly on your website.

### Features

- **Parse .ipynb files**: Loads and displays Jupyter notebook JSON format
- **Markdown rendering**: Converts markdown cells to formatted HTML
- **Interactive execution**: Run JavaScript code cells with a click
- **Console capture**: Shows console.log() and console.error() output
- **Result display**: Shows return values from code execution
- **Error handling**: Catches and displays errors with styling
- **Run All**: Execute all code cells in sequence

### Usage in EDS

Add the block to your Google Doc:

```
| IPynb Viewer |
|--------------|
| /notebooks/test.ipynb |
```

### What Gets Executed

When users click "Run" on a code cell:
- Code executes in the browser using `Function()` constructor
- Console methods are captured during execution
- Results display inline below the cell
- Errors are caught and shown in red
- Successful execution turns the cell border green

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

3. **Run Cell 1** to initialize the environment

4. **Test a block:**
   ```javascript
   await global.saveBlockHTML('accordion', '<div><div>Q</div><div>A</div></div>');
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

2. **Important: Skip Cell 1 in browser!**
   - Cell 1 is only for Node.js/JSLab setup (requires `require()`)
   - In browser, Cell 1 will show helpful messages and skip gracefully
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

### 2. Use Context-Aware Code

Write code that works in both environments:

```javascript
// Detect environment
const isNode = typeof process !== 'undefined' && process.versions?.node;

// Use appropriate DOM
const doc = isNode ? global.document : document;

// Conditional features
if (isNode) {
  // JSLab-specific code (file I/O, block testing)
  await global.saveBlockHTML('myblock', content);
} else {
  // Browser-specific code (pure JavaScript)
  console.log('Result:', 42);
}
```

### 2. Structure Your Notebooks

```
Cell 1: Setup (jsdom, helpers)
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
saveBlockHTML(block, 'your-block', 'your-block-test1.html');
// Open in browser to verify styling
```

### 5. Keep Tests Focused

One test scenario per cell for clarity:

```javascript
// ❌ BAD - Multiple tests in one cell
const block1 = await testBlock('hero', content1);
const block2 = await testBlock('hero', content2);
const block3 = await testBlock('hero', content3);

// ✅ GOOD - Separate cells for each test
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

1. **Develop** in JSLab with `testBlock()` and `saveBlockHTML()`
2. **Preview** with the generated live-preview.html file
3. **Validate** in browser with test.html
4. **Share** interactive demos with ipynb-viewer block
5. **Automate** with Jest/Mocha for CI/CD

This comprehensive approach gives you **speed, interactivity, visual feedback, and shareability** all in one cohesive system.
