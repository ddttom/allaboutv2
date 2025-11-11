---
name: jupyter-notebook-testing
description: Create and manage Jupyter notebooks for testing Adobe Edge Delivery Services (EDS) blocks interactively using JavaScript with jsdom and JSLab kernel. Context-aware execution (Node.js and browser), ultra-simple one-line initialization, unified API (doc, testBlockFn, showPreview), popup window previews with base tag, minimal DOM structure requirements, ipynb-viewer block integration. Use when creating notebooks, testing blocks with ipynb files, using jslab kernel, generating HTML previews, showPreview popup windows, or working with interactive block testing.
---

# Jupyter Notebook Testing for EDS Blocks

Interactive testing environment for EDS blocks using Jupyter notebooks with **context-aware execution** (Node.js and Browser).

## When to Use This Skill

Use this skill when:
- Creating new Jupyter notebooks (`.ipynb` files) for EDS block testing
- Setting up one-line initialization with `initialize()` function
- Using unified API (`doc`, `testBlockFn`, `showPreview`) in notebooks
- Testing blocks in both JSLab (Node.js) and browser (ipynb-viewer) environments
- Generating popup window previews with `showPreview()`
- Debugging blocks with different content structures
- Creating executable documentation for blocks
- Working with minimal DOM structure requirements
- Troubleshooting preview styling or decoration issues

## Overview

Test EDS blocks rapidly with Jupyter notebooks using **context-aware execution**:

- **JSLab (Node.js)**: Full testing environment with jsdom virtual DOM and file generation
- **Browser (ipynb-viewer)**: End-user executable notebooks with native APIs
- **One-line setup**: Ultra-simple `initialize()` function (96% smaller Cell 1)
- **Unified API**: Same functions work in both environments (`doc`, `testBlockFn`, `showPreview`)
- **Popup previews**: Visual previews with blob URL + base tag for proper CSS/JS loading
- **Minimal DOM**: Critical EDS-compatible structure (block as direct child of `<main>`)

### Key Benefits

- **Context-aware**: Same notebook works in Node.js AND browser
- **Ultra-simple setup**: One-line initialization (9 lines vs 220 lines)
- **Unified API**: No ternary operators needed (`doc`, `testBlockFn`, `showPreview`)
- **Instant feedback**: Test blocks immediately without build steps
- **Visual previews**: Popup windows with full styling via base tag
- **Clean DOM structure**: Block is direct child of main, no wrapper interference
- **EDS-compatible**: Follows EDS block decoration patterns

### Technology Stack

- **jslab**: JavaScript kernel for Jupyter (Node.js execution)
- **jsdom**: JavaScript implementation of DOM APIs (Node.js virtual DOM)
- **ipynb-viewer**: EDS block for executing notebooks in browser
- **VS Code Jupyter extension**: Notebook editing in your IDE
- **scripts/ipynb-helpers.js**: External helper module with all functions

## Quick Start

### 1. Create or Open Notebook

**Option A: Copy existing template**
```bash
cp test.ipynb my-block-tests.ipynb
# Open in VS Code
```

**Option B: Create from scratch**
- VS Code: Command Palette → "Jupyter: Create New Blank Notebook"
- Select "jslab" kernel
- Copy the first code cell from `test.ipynb`

### 2. Run Setup Cell (Always First)

**NEW: Ultra-Simple One-Line Initialization!**

```javascript
// First code cell: One-line initialization (works in both JSLab and Browser)
(async () => {
  const isNode = typeof process !== 'undefined' && process.versions?.node;
  const helpersPath = isNode ? './scripts/ipynb-helpers.js' : '/scripts/ipynb-helpers.js';
  const { initialize } = await import(helpersPath);
  return await initialize();
})();
```

**Benefits:**
- **96% smaller**: 9 lines vs 220 lines
- **One function call**: `initialize()` does everything
- **Context-aware**: Automatically detects Node.js or browser
- **Informative**: Displays context and setup status with emojis (🔧📍⚙️✓✅)
- **Sets global flags**: `isNode`, `isBrowser` available in all cells
- **Sets unified API**: `doc`, `testBlockFn`, `showPreview` available everywhere
- **Success confirmation**: Returns "✅ Setup complete! Ready to test EDS blocks."
- **Maintainable**: All logic in external module

### 3. Test Your Block

**Using Unified API (No Ternary Operators!):**

```javascript
// Cell 2: Simple test (works in both environments!)
(async () => {
  const block = await testBlockFn('accordion', `
    <div>
      <div>Question 1</div>
      <div>Answer 1</div>
    </div>
  `);
  console.log('✓ Block created');
  return block.outerHTML;
})();
```

### 4. Generate Visual Preview

**Using Unified showPreview (Adapts to Environment!):**

```javascript
// Cell 3: Visual preview (one function, both environments!)
(async () => {
  const content = `
    <div>
      <div>Question 1</div>
      <div>Answer 1</div>
    </div>
  `;

  // Node.js: Saves files to ipynb-tests/
  // Browser: Opens popup window with blob URL
  return await showPreview('accordion', content);
})();
```

## Context-Aware Execution

The notebook supports **dual execution modes**:

### Node.js Mode (JSLab)

**Purpose:** Development and block testing

**Features:**
- Full jsdom virtual DOM
- Block decoration testing
- HTML file generation (`saveBlockHTML()`)
- Live preview creation
- Helper functions: `global.testBlock()`, `global.saveBlockHTML()`

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

## Helper Functions

All helper functions are in **scripts/ipynb-helpers.js**, loaded by Cell 1's `initialize()`.

### initialize() - Master Setup (NEW)

**One function does everything:** Detects environment, sets global flags (`isNode`, `isBrowser`), and registers unified API.

### Unified API

After Cell 1, these globals are available in all cells:

```javascript
doc              // Document (no ternary needed!)
testBlockFn      // Test block function
showPreview      // Preview (Node: saves files, Browser: opens popup)
createPreviewFn  // Create iframe preview HTML
isNode           // Environment flag
isBrowser        // Environment flag
```

### testBlockFn(blockName, innerHTML)

Tests block decoration:

```javascript
const block = await testBlockFn('accordion', content);
```

### showPreview(blockName, innerHTML)

Opens visual preview (adapts automatically):
- **Node.js**: Saves HTML files to `ipynb-tests/`
- **Browser**: Opens popup with blob URL + base tag

```javascript
await showPreview('accordion', content);
```

### saveBlockHTML(blockName, innerHTML, filename, options) - Node.js Only

Saves HTML files (creates both preview and live-preview):

```javascript
await global.saveBlockHTML('accordion', content);
```

## Popup Preview System (NEW)

Live previews use popup windows with `<base>` tag to solve blob URL resource loading issues.

### How It Works

1. **Base tag resolves paths**: `<base href="https://your-origin/">` makes `styles/styles.css` → `https://your-origin/styles/styles.css`
2. **Minimal DOM** (EDS-compatible): Block is direct child of `<main>`, no wrapper divs
3. **Auto-decoration**: Dynamically imports and executes block JavaScript

### Key Benefits

✅ Base tag solves blob URL issues | ✅ Clean DOM (no wrappers) | ✅ EDS-compatible | ✅ Full styling | ✅ Fixed header controls

## DOM Structure Requirements (CRITICAL)

### Minimal Structure

Block must be direct child of `<main>` (no wrapper divs):

```html
<main>
  <div class="blockname block"><!-- content rows --></div>
</main>
```

### Why This Matters

EDS blocks iterate over `block.children` directly. Extra wrappers break child selection → incorrect output.

**Never:** Add wrapper divs between `<main>` and block | Nest controls in content area | Use relative positioning for headers

## Troubleshooting

### Preview Shows Colored Boxes (Decoration Runs But Looks Wrong)

**Cause:** Wrapper divs between `<main>` and block. **Check DevTools Elements tab** for extra wrappers. **Fix:** Remove wrappers—block must be direct child of `<main>`.

### Preview Shows Empty/Blank Content

**Causes:** CSS not loading (incorrect base tag), JS module errors, decoration errors. **Check DevTools Console + Network tab** for 404s and errors. **Fix:** Verify origin detection.

### Kernel Not Found

**Solution:** Install JSLab (`npm install -g jslab`), select "jslab" kernel in VS Code, reload notebook.

### Header Overlaps Block Content

**Symptom:** Fixed header covers top of block content in preview. **Cause:** Insufficient padding. **Fix:** Ensure `<main>` has top padding (68px) to clear fixed header (48px height + 20px gap).

## When to Use Notebooks

**✅ Use For:** Quick validation, content experimentation, debugging, prototyping, documentation, `showPreview()` testing, HTML generation

**❌ Don't Use For:** Complex interactions, cross-browser testing, full integration, Web Components, performance profiling

## Best Practices

1. **Always use `initialize()` in the first code cell** (see Quick Start above)
2. **Use unified API** - `doc`, `testBlockFn`, `showPreview` (no ternaries!)
3. **Wrap async in IIFE** (browser): `(async () => { await testBlockFn(...); })()`
4. **Test visual output** - Always use `showPreview()` for verification
5. **Structure notebooks** - First code cell: Setup | Next cells: Tests | Final cells: Previews

## Integration with ipynb-viewer Block

The **ipynb-viewer** EDS block executes notebooks in browser:

```
| IPynb Viewer |
|--------------|
| /path/to/notebook.ipynb |
```

**Features:** Interactive execution (async/await support), automatic initialization check, console capture, markdown rendering (tables, code blocks, lists), error handling

**Key Points:** First code cell auto-detects environment | Automatic warning if first code cell skipped | Browser uses native APIs | Same unified API works everywhere

## Reference Files

For detailed information, see:

- **[INSTALLATION.md](INSTALLATION.md)** - Setup guide with jslab, Jupyter, jsdom installation
- **[EXAMPLES.md](EXAMPLES.md)** - Content structure patterns and complete examples
- **[ADVANCED_TECHNIQUES.md](ADVANCED_TECHNIQUES.md)** - Performance testing, batch testing, validation
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solutions for kernel issues, module errors, styling issues

## Related Documentation

- **[docs/for-ai/explaining-jupyter.md](../../docs/for-ai/explaining-jupyter.md)** - Comprehensive Jupyter notebook documentation
- **[blocks/ipynb-viewer/README.md](../../blocks/ipynb-viewer/README.md)** - ipynb-viewer block documentation
- **[scripts/ipynb-helpers.js](../../scripts/ipynb-helpers.js)** - Helper functions implementation
- **[test.ipynb](../../test.ipynb)** - Reference notebook with examples

## Summary

Jupyter notebooks with JSLab provide a powerful, interactive testing environment for EDS blocks that:

- **Ultra-simple setup**: One-line `initialize()` function (96% smaller)
- **Context-aware execution**: Same notebook works in Node.js AND browser
- **Unified API**: No ternary operators (`doc`, `testBlockFn`, `showPreview`)
- **Popup previews**: Visual feedback with blob URL + base tag
- **Minimal DOM structure**: EDS-compatible (block as direct child of main)
- **ipynb-viewer integration**: End-user executable notebooks
- **Instant feedback**: No server or build overhead
- **VS Code integration**: Seamless development experience

Use this skill whenever you need to rapidly test, debug, or document EDS blocks without the ceremony of full development environments.

---

**Skill Status**: ✅ Complete - Following Anthropic 500-line rule
**Line Count**: < 500 lines
**Progressive Disclosure**: Detailed content in reference files
