# Jupyter Notebook Testing for EDS Blocks - Browser Only

*Related: [EDS Native Testing Standards](testing/eds-native-testing-standards.md) | [Block Architecture Standards](implementation/block-architecture-standards.md) | [Debug Guide](testing/debug.md)*

## Overview

This document explains the Jupyter notebook implementation for **interactive testing of EDS blocks using JavaScript in the browser**. Notebooks are executed via the ipynb-viewer block on EDS sites.

**BROWSER-ONLY EXECUTION**: The test.ipynb notebook runs exclusively in the browser with:
- **Simple async pattern** - Direct `await` and `return` statements (no IIFE wrappers)
- **Simple initialization** - `initialize()` function sets up helpers
- **Helper functions** - `window.testBlockFn()` and `window.showPreview()` on window object
- **Popup window previews** - Isolated preview with `<base>` tag for proper CSS/JS loading
- **Native browser APIs** - Direct use of `document`, `window`, `fetch`

## What This Is

**Jupyter Notebook Testing** provides an interactive browser-based environment for testing Adobe Edge Delivery Services (EDS) blocks using:
- **JavaScript** (NOT Python) executed in the browser
- **Browser execution** via ipynb-viewer block on EDS sites
- **Native browser APIs** (`document`, `window`, `fetch`)
- **Simple async pattern** - Write code naturally with `await` and `return`
- **Simple initialization** - `initialize()` sets up helpers on window object
- **Helper functions** - `window.testBlockFn()` and `window.showPreview()`
- **Popup window preview** - Isolated preview with `<base>` tag for CSS/JS
- **Minimal DOM structure** - Block as direct child of `<main>` (no wrappers)
- **Interactive execution** - Run code cells individually with click

Test EDS blocks interactively in the browser and share executable notebooks for end-user interaction. The popup preview system uses `<base>` tag to properly load CSS and JavaScript from blob URLs. Minimal DOM structure ensures proper EDS block decoration.

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
- Requires development server
- Browser refresh for each change
- Manual testing only
- No inline documentation

**Jupyter notebook approach (browser-only):**
- Interactive cell-by-cell execution in browser
- Test multiple scenarios in one file
- Inline documentation with Markdown
- Generate styled popup previews instantly
- Simple async pattern (no complex wrappers)
- Iterative development with immediate feedback
- Shareable executable notebooks for end users
- Runs on EDS pages via ipynb-viewer block

---

## Browser Execution

The test.ipynb notebook runs **exclusively in the browser** via the ipynb-viewer block.

### Features

**Purpose:** Interactive block testing and end-user demonstrations

**Features:**
- Native browser APIs (`document`, `window`, `fetch`)
- Direct JavaScript execution with async/await support
- Console output display in cell output
- Popup window previews with blob URLs and `<base>` tag
- Helper functions on window object after initialization
- Simple async pattern - write code naturally

**When to use:**
- Testing EDS blocks interactively on EDS sites
- Sharing executable demos with end users
- Interactive tutorials and documentation
- Client presentations
- Live coding examples

### Setup (Always Run Cell 1 First!)

Run Cell 1 to initialize the helper functions on the window object:

```javascript
const { initialize } = await import('/scripts/ipynb-helpers.js');
await initialize();
return '✅ Browser environment ready';
```

**After initialization, these are available:**
- `window.testBlockFn(blockName, innerHTML)` - Test block decoration
- `window.showPreview(blockName, innerHTML)` - Open popup preview
- `window.doc` - Reference to document object

**Important:** Cell code runs in async context automatically (via `AsyncFunction`). Just write code naturally with `await` and `return` - no IIFE wrapper needed!

---

## Live Preview Feature

The notebook supports **visual popup previews** in the browser!

### Popup Window Preview

When using `window.showPreview()`, a popup window opens with the styled block:

**Example:**
```javascript
// Test and preview a block
await window.showPreview('accordion', accordionContent);
return '✓ Preview window opened';
```

**Features:**
- Dark themed professional UI
- Opens in new popup window (1200x800)
- Uses Blob URL (no file system access needed)
- ↻ Refresh button to reload preview
- ✕ Close button (or press ESC)
- Fullscreen with scrolling
- `<base>` tag for proper CSS/JS loading from parent origin

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

## Helper Functions

Helper functions are defined in [scripts/ipynb-helpers.js](../../scripts/ipynb-helpers.js) and loaded in Cell 1. This keeps the notebook clean and makes helpers reusable.

### Initialize Function

#### `initialize()`

Master initialization function that sets up the browser environment.

**What it does:**
- Registers helper functions on window object
- Sets up `window.testBlockFn()` for testing blocks
- Sets up `window.showPreview()` for popup previews
- Sets up `window.doc` as reference to document
- Logs setup completion

**Usage (Cell 1):**
```javascript
const { initialize } = await import('/scripts/ipynb-helpers.js');
await initialize();
return '✅ Browser environment ready';
```

### Testing Functions

#### `window.testBlockFn(blockName, innerHTML)`

Tests a block's decoration function with provided content in the browser.

**Parameters:**
- `blockName`: Name of the block (e.g., 'accordion')
- `innerHTML`: HTML content structure (EDS table format)

**Returns:** The decorated block element

**Example:**
```javascript
const block = await window.testBlockFn('accordion', `
  <div>
    <div>Question 1</div>
    <div>Answer 1</div>
  </div>
`);
console.log(block.outerHTML);
return block.outerHTML;
```

#### `window.showPreview(blockName, innerHTML)`

Opens a popup window with the styled, decorated block.

**Parameters:**
- `blockName`: Name of the block
- `innerHTML`: HTML content structure

**Returns:** Success message

**Example:**
```javascript
await window.showPreview('accordion', accordionContent);
return '✓ Preview window opened';
```

**What it creates:**
- Popup window (1200x800) with blob URL
- Full HTML document with `<base>` tag for CSS/JS loading
- Fixed header with refresh and close buttons
- Block as direct child of `<main>` for proper decoration
- Automatic block decoration on load

---

## File Structure

```
project/
├── test.ipynb                      # Main browser-only test notebook
├── scripts/
│   └── ipynb-helpers.js           # Helper functions module
├── blocks/                         # EDS blocks
│   ├── accordion/
│   │   ├── accordion.js           # Block JavaScript
│   │   ├── accordion.css          # Block styles
│   │   └── README.md              # Block documentation
│   ├── ipynb-viewer/              # Notebook viewer block
│   │   ├── ipynb-viewer.js        # Displays and executes notebooks
│   │   ├── ipynb-viewer.css       # Viewer styles
│   │   └── README.md              # Usage documentation
│   └── [other blocks]/
└── styles/                         # EDS core styles
    ├── styles.css
    ├── fonts.css
    └── lazy-styles.css
```

---

## Workflow

### 1. Open the Notebook

Open [test.ipynb](../../test.ipynb) on an EDS page using the ipynb-viewer block:

**In your Google Doc:**
```
| IPynb Viewer |
|--------------|
| /test.ipynb  |
```

### 2. Run Cell 1 First!

**Always run the first code cell to initialize:**

```javascript
const { initialize } = await import('/scripts/ipynb-helpers.js');
await initialize();
return '✅ Browser environment ready';
```

This sets up:
- `window.testBlockFn()` - Test block decoration
- `window.showPreview()` - Open popup previews
- `window.doc` - Reference to document

### 3. Test Blocks

**Simple pattern - write code naturally:**

```javascript
// Test a block
const block = await window.testBlockFn('accordion', `
  <div>
    <div>Question</div>
    <div>Answer</div>
  </div>
`);
console.log(block.outerHTML);
return block.outerHTML;
```

### 4. Generate Previews

**Open popup window with styled preview:**

```javascript
const content = `
  <div>
    <div>Question</div>
    <div>Answer</div>
  </div>
`;

await window.showPreview('accordion', content);
return '✓ Preview window opened';
```

### 5. Iterate

1. Run cells sequentially (click Run buttons)
2. View output inline in cell output areas
3. Make changes to block JavaScript/CSS
4. Re-run cells to test changes
5. Use popup preview refresh button to see CSS updates

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

Test block logic interactively:

```javascript
// Quick test of content extraction
const block = await window.testBlockFn('hero', `<div><div>Title</div></div>`);
console.log('Extracted title:', block.querySelector('h1')?.textContent);
return block.outerHTML;
```

### 2. Multiple Scenarios

Test different configurations in separate cells:

```javascript
// Cell 1: Basic accordion
const content1 = `<div><div>Q1</div><div>A1</div></div>`;
const block1 = await window.testBlockFn('accordion', content1);
return block1.outerHTML;
```

```javascript
// Cell 2: Multiple items
const content2 = `
  <div><div>Q1</div><div>A1</div></div>
  <div><div>Q2</div><div>A2</div></div>
  <div><div>Q3</div><div>A3</div></div>
`;
const block2 = await window.testBlockFn('accordion', content2);
return block2.outerHTML;
```

### 3. Edge Cases

Test error handling and edge cases:

```javascript
// Empty content
const emptyBlock = await window.testBlockFn('hero', '');
console.log('Empty content handled:', emptyBlock.innerHTML);
return emptyBlock.outerHTML;
```

```javascript
// Invalid structure
const invalidBlock = await window.testBlockFn('hero', '<div>Only one cell</div>');
console.log('Invalid structure handled:', invalidBlock.innerHTML);
return invalidBlock.outerHTML;
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
const content = `<div><div>Hero Title</div><div>Hero description</div></div>`;
const block = await window.testBlockFn('hero', content);
await window.showPreview('hero', content);
return '✓ Hero block tested';
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

### What Notebooks CAN'T Do

1. **Block-Only Testing**
   - Can only test individual blocks in isolation
   - No full page context with EDS core loaded
   - No interaction with other blocks on the page
   - **Solution**: Use traditional test.html for full page testing

2. **Limited Browser APIs in Popup**
   - Popup window has blob URL (null origin)
   - Some security-restricted APIs may not work
   - localStorage/sessionStorage limited in popup
   - **Solution**: Test these features with test.html

3. **Automated Testing**
   - No CI/CD integration
   - No regression testing
   - Manual execution only
   - **Solution**: Use Jest/Mocha for automated tests

### What Notebooks CAN Do

1. **DOM Manipulation**
   - Test block decorate functions
   - Verify element creation
   - Check HTML structure with native browser APIs

2. **Content Extraction**
   - Parse EDS table structure
   - Extract text, images, links
   - Test data transformation

3. **Logic Testing**
   - Configuration handling
   - Conditional rendering
   - Content processing
   - JavaScript calculations

4. **Visual Previews**
   - Generate styled popup previews
   - Visual verification with real CSS
   - Interactive block testing
   - Instant feedback loop

5. **Interactive Execution**
   - Run JavaScript code cells
   - Execute code in browser
   - Display results inline
   - Interactive tutorials and demos
   - Share executable notebooks

---

## Quick Start Guide

### For End Users and Testing (Browser)

1. **Add ipynb-viewer block** to your EDS page:
   ```
   | IPynb Viewer |
   |--------------|
   | /test.ipynb  |
   ```

2. **Run Cell 1 first** to initialize:
   ```javascript
   const { initialize } = await import('/scripts/ipynb-helpers.js');
   await initialize();
   return '✅ Browser environment ready';
   ```
   This sets up `window.testBlockFn()` and `window.showPreview()`.

3. **Test a block** (Cell 2+):
   ```javascript
   const block = await window.testBlockFn('accordion', '<div><div>Q</div><div>A</div></div>');
   return block.outerHTML;
   ```

4. **Generate preview** (Cell 3+):
   ```javascript
   await window.showPreview('accordion', '<div><div>Q</div><div>A</div></div>');
   return '✓ Preview window opened';
   ```

5. **Features:**
   - Read markdown documentation
   - Click "Run" on code cells
   - See console output and results
   - Open popup previews with styled blocks
   - Execute JavaScript interactively
   - Learn through runnable examples

---

## Best Practices

### 1. Always Run Cell 1 First

The first code cell initializes the helper functions. Always run it before any other cells:

```javascript
const { initialize } = await import('/scripts/ipynb-helpers.js');
await initialize();
return '✅ Browser environment ready';
```

### 2. Use Simple Async Pattern

Cell code runs in async context automatically - write code naturally:

```javascript
// ✅ GOOD - Simple and clean
const block = await window.testBlockFn('accordion', content);
await window.showPreview('accordion', content);
return block.outerHTML;
```

```javascript
// ❌ BAD - Unnecessary IIFE wrapper (don't do this!)
return (async () => {
  const block = await window.testBlockFn('accordion', content);
  return block.outerHTML;
})();
```

### 3. Structure Your Notebooks

```
Cell 1: Setup (initialize helpers)
Cell 2+: Markdown documentation and test cases
  - One test scenario per cell
  - Use markdown cells for explanations
  - Generate previews inline
```

### 4. Add Markdown Documentation

Explain what each test does and why:

```markdown
### Test Case 3: Grid Layout with 3 Columns

This tests the block's ability to display items in a grid
with a configurable number of columns using data attributes.
```

### 5. Use Popup Previews for Visual Verification

Always generate popup previews for visual checks:

```javascript
await window.showPreview('your-block', content);
return '✓ Preview window opened';
```

The popup opens in a new window with:
- Full block styling (CSS)
- Interactive JavaScript
- Refresh button to reload
- Close button or ESC key

### 6. Keep Tests Focused

One test scenario per cell for clarity:

```javascript
// ❌ BAD - Multiple tests in one cell
const block1 = await window.testBlockFn('hero', content1);
const block2 = await window.testBlockFn('hero', content2);
const block3 = await window.testBlockFn('hero', content3);
```

```javascript
// ✅ GOOD - Separate cells for each test
// Cell 2:
const block1 = await window.testBlockFn('hero', content1);
return block1.outerHTML;
```

```javascript
// Cell 3:
const block2 = await window.testBlockFn('hero', content2);
return block2.outerHTML;
```

---

## Troubleshooting

### Issue: No Output Displayed

**Error:** Cell runs successfully (green checkmark) but output cell is empty

**Solution:** Make sure you're using `return` to display results:
```javascript
// ✅ GOOD - Shows output
const block = await window.testBlockFn('accordion', content);
return block.outerHTML;

// ❌ BAD - No output
const block = await window.testBlockFn('accordion', content);
```

### Issue: Helper Functions Not Defined

**Error:** `window.testBlockFn is not defined`

**Solution:** Run Cell 1 first to initialize the environment:
```javascript
const { initialize } = await import('/scripts/ipynb-helpers.js');
await initialize();
return '✅ Browser environment ready';
```

### Issue: Popup Window Blocked

**Error:** `showPreview()` runs but no window appears

**Solution:**
1. Allow popups for your domain in browser settings
2. Look for blocked popup indicator in address bar
3. Click to allow popups and retry

### Issue: CSS Not Loading in Preview

**Error:** Popup preview shows unstyled content

**Solution:**
- Check that block CSS file exists: `blocks/blockname/blockname.css`
- Check browser console for 404 errors
- Verify the `<base>` tag is using correct origin
- Try clicking the refresh button in the popup header

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

| Feature | test.html | Jupyter Notebooks | Automated Tests |
|---------|-----------|-------------------|-----------------|
| **Real rendering** | ✅ Yes | ✅ Yes (popup) | ❌ No |
| **Server required** | ✅ Yes | ✅ Yes (EDS page) | ❌ No |
| **Interactive** | ✅ Yes | ✅ Yes | ❌ No |
| **Multiple scenarios** | ❌ No | ✅ Yes | ✅ Yes |
| **Documentation** | ❌ No | ✅ Inline markdown | ⚠️ Separate |
| **Visual feedback** | ✅ Yes | ✅ Yes (popup) | ❌ No |
| **Block decoration** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Browser APIs** | ✅ Full | ✅ Full | ⚠️ Mocked |
| **Popup previews** | ❌ No | ✅ Yes | ❌ No |
| **CI/CD** | ❌ No | ❌ No | ✅ Yes |
| **End-user facing** | ❌ No | ✅ Yes | ❌ No |

### test.html (Browser-based)

**Best for:** Full page testing with EDS core, interactions, browser-specific behavior

**Pros:**
- Real browser rendering with full EDS core
- Full browser APIs available
- User interaction testing
- Browser DevTools integration
- Multiple blocks on same page

**Cons:**
- Requires development server
- Manual refresh workflow
- One scenario per file
- No inline documentation

### Jupyter Notebooks (Browser-only)

**Best for:** Interactive block testing, tutorials, demos, documentation

**Pros:**
- Interactive code execution in browser
- Multiple scenarios in one file
- Inline markdown documentation
- Popup window previews with styling
- Simple async pattern (no complex wrappers)
- Shareable executable notebooks
- Perfect for end-user tutorials

**Cons:**
- Block-only testing (no EDS core context)
- Requires publishing on EDS page
- Limited popup window capabilities
- No CI/CD integration

### Automated Tests (Jest/Mocha)

**Best for:** Regression testing, CI/CD, coverage

**Pros:**
- CI/CD integration
- Regression testing
- Coverage reports
- Fast execution
- Consistent results

**Cons:**
- Setup complexity
- No visual feedback
- Not interactive
- Mocked environments
- No end-user facing

---

## Related Documentation

- **[EDS Native Testing Standards](testing/eds-native-testing-standards.md)** - Traditional test.html approach
- **[Block Architecture Standards](implementation/block-architecture-standards.md)** - Block development patterns
- **[Debug Guide](testing/debug.md)** - Debugging workflows
- **[Jupyter Notebook Skill](.claude/skills/jupyter-notebook-testing.md)** - Claude Code skill

---

## Conclusion

The Jupyter notebook testing system provides **interactive browser-based testing** for EDS blocks with a simple, elegant approach.

### Key Benefits

**Browser-Only Execution:**
- Native browser APIs (`document`, `window`, `fetch`)
- Real DOM manipulation and testing
- No Node.js setup required
- Runs on EDS pages via ipynb-viewer block

**Simple Async Pattern:**
- Write code naturally with `await` and `return`
- No complex IIFE wrappers
- Cell code runs in async context automatically
- Clean, readable test code

**Popup Window Previews:**
- Instant visual feedback with styled blocks
- `<base>` tag for proper CSS/JS loading
- Refresh and close buttons
- ESC key support
- Minimal DOM structure (no wrapper interference)

**Interactive and Shareable:**
- Multiple test scenarios in one file
- Inline markdown documentation
- Executable by end users on EDS pages
- Perfect for tutorials and demos

**Helper Functions:**
- `window.testBlockFn()` - Test block decoration
- `window.showPreview()` - Generate popup previews
- Simple `initialize()` setup

### Recommended Workflow

1. **Develop** in browser with `testBlockFn()` and `showPreview()`
2. **Preview** with popup windows for instant visual feedback
3. **Validate** in test.html for full EDS core context
4. **Share** executable notebooks with end users
5. **Automate** with Jest/Mocha for CI/CD (future)

This approach gives you **speed, simplicity, visual feedback, and shareability** - all with native browser APIs and no complex setup.
