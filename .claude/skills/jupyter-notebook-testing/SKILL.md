---
name: jupyter-notebook-testing
description: Create and manage Jupyter notebooks for testing Adobe Edge Delivery Services (EDS) blocks interactively in the browser using the ipynb-viewer block. Interactive JavaScript execution, popup window previews with base tag, minimal DOM structure requirements. Use when creating notebooks, testing blocks with ipynb files in browser, generating popup previews, or creating executable documentation.
---

# Jupyter Notebook Testing for EDS Blocks

Interactive testing environment for EDS blocks using Jupyter notebooks **in the browser** via the ipynb-viewer block.

## When to Use This Skill

Use this skill when:
- Creating new Jupyter notebooks (`.ipynb` files) for EDS block testing
- Setting up browser-based initialization with `initialize()` function
- Using helper functions (`testBlockFn`, `showPreview`) in notebooks
- Testing blocks in browser environment with ipynb-viewer block
- Generating popup window previews with `showPreview()`
- Debugging blocks with different content structures
- Creating executable documentation for blocks
- Working with minimal DOM structure requirements
- Troubleshooting preview styling or decoration issues

## Overview

Test EDS blocks rapidly with Jupyter notebooks using **browser execution**:

- **Browser execution only**: Notebooks run via ipynb-viewer block on your EDS site
- **Simple setup**: Ultra-simple `initialize()` function sets up helpers
- **Helper functions**: `testBlockFn` and `showPreview` for block testing
- **Popup previews**: Visual previews with blob URL + base tag for proper CSS/JS loading
- **Minimal DOM**: Critical EDS-compatible structure (block as direct child of `<main>`)

### Key Benefits

- **Browser-native**: Uses native browser APIs directly
- **No build steps**: Test blocks immediately without compilation
- **Visual previews**: Popup windows with full styling via base tag
- **Clean DOM structure**: Block is direct child of main, no wrapper interference
- **EDS-compatible**: Follows EDS block decoration patterns
- **Executable docs**: Share interactive notebooks with end users

### Technology Stack

- **ipynb-viewer**: EDS block for executing notebooks in browser
- **Browser native APIs**: Direct DOM manipulation
- **scripts/ipynb-helpers.js**: External helper module with browser functions

## Quick Start

### 1. Create or Open Notebook

**Option A: Copy existing template**
```bash
cp test.ipynb my-block-tests.ipynb
# View on EDS site using ipynb-viewer block
```

**Option B: Create from scratch**
- Create new `.ipynb` file
- Copy the first code cell from `test.ipynb`
- Add to EDS page via ipynb-viewer block

### 2. View Notebook on EDS Site

Add ipynb-viewer block to your page:

```
| IPynb Viewer |
|--------------|
| /test.ipynb |
```

### 3. Run Setup Cell (Always First)

**Simple Browser Initialization:**

```javascript
// First code cell: Initialize browser environment
const { initialize } = await import('/scripts/ipynb-helpers.js');
await initialize();
return '✅ Browser environment ready';
```

**Note:** Cell code executes in async context automatically - no IIFE wrapper needed!

**Benefits:**
- **One function call**: `initialize()` sets up everything
- **Browser-only**: No Node.js complexity
- **Sets helper functions**: `testBlockFn`, `showPreview` available on window
- **Clean output**: Simple success message
- **Maintainable**: All logic in external module

### 4. Test Your Block

**Simple pattern:**

```javascript
// Cell 2: Test a block
const block = await window.testBlockFn('accordion', `
  <div>
    <div>Question 1</div>
    <div>Answer 1</div>
  </div>
`);
console.log('✓ Block created');
return block.outerHTML;
```

**Note:** Just write your code naturally with `await` and `return` - it runs in async context.

### 5. Generate Visual Preview

**Opens popup window:**

```javascript
// Cell 3: Visual preview in popup window
const content = `
  <div>
    <div>Question 1</div>
    <div>Answer 1</div>
  </div>
`;

// Opens popup window with blob URL
await window.showPreview('accordion', content);

return '✓ Preview window opened';
```

## Browser Execution

### Purpose

End-user interaction and presentations with executable notebooks.

### Features

- Native browser APIs
- Direct JavaScript execution
- Console output display
- Popup window previews
- Interactive block decoration
- No file system access

### When to Use

- Sharing executable demos
- Interactive tutorials
- Client presentations
- Live coding examples
- Block testing and experimentation

## Helper Functions

All helper functions are in **scripts/ipynb-helpers.js**, loaded by the first code cell's `initialize()`.

### initialize() - Browser Setup

**One function does everything:** Sets up browser environment and registers helper functions on window object.

### Available Helper Functions

After running the first code cell, these functions are available:

| Function | Purpose | Behavior |
|----------|---------|----------|
| `window.testBlockFn()` | Test block decoration | Uses native browser DOM |
| `window.showPreview()` | Visual preview | Opens popup window with blob URL |
| `window.doc` | Document shorthand | Reference to `document` |

**Usage Pattern:**

```javascript
// After Cell 1 initialization, just write async code naturally
const block = await window.testBlockFn('accordion', '<div>content</div>');
await window.showPreview('accordion', '<div>content</div>');
const div = window.doc.createElement('div');

// Or use document directly
const div2 = document.createElement('div');

return block.outerHTML; // Return value to display in output
```

## Popup Preview System

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

### Popup Blocked

**Symptom:** Preview doesn't open, browser shows popup blocked message. **Cause:** Browser popup blocker. **Fix:** Allow popups for your EDS site domain.

### First Cell Not Run

**Symptom:** Other cells fail with "testBlockFn is not defined". **Cause:** Cell 1 not run first. **Fix:** Always run Cell 1 before other cells.

## When to Use Notebooks

**✅ Use For:** Quick validation, content experimentation, debugging, prototyping, executable documentation, `showPreview()` testing, interactive demos

**❌ Don't Use For:** Complex interactions requiring Node.js, file system operations, automated testing, CI/CD pipelines

## Best Practices

1. **Always run Cell 1 first** to initialize the environment
2. **Write async code naturally**: Use `await` directly - cells run in async context
3. **Return values**: Use `return` to display results in output cell
4. **Use window helpers**: `window.testBlockFn`, `window.showPreview`
5. **Test visual output**: Always use `showPreview()` for verification
6. **Allow popups**: Enable popups for your domain to see previews
7. **Structure notebooks**: Cell 1: Setup | Other cells: Tests and previews

## Integration with ipynb-viewer Block

The **ipynb-viewer** EDS block executes notebooks in browser:

```
| IPynb Viewer |
|--------------|
| /path/to/notebook.ipynb |
```

**Features:** Interactive execution (async/await support), automatic initialization check, console capture, markdown rendering (tables, code blocks, lists), error handling

**Key Points:** Cell 1 sets up environment | Automatic warning if Cell 1 skipped | Browser uses native APIs | Helper functions on window object

## Reference Files

For detailed information, see:

- **[EXAMPLES.md](EXAMPLES.md)** - Content structure patterns and complete examples
- **[ADVANCED_TECHNIQUES.md](ADVANCED_TECHNIQUES.md)** - Performance testing, batch testing, validation
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solutions for popup issues, styling issues

## Related Documentation

- **[docs/for-ai/explaining-jupyter.md](../../docs/for-ai/explaining-jupyter.md)** - Comprehensive Jupyter notebook documentation
- **[blocks/ipynb-viewer/README.md](../../blocks/ipynb-viewer/README.md)** - ipynb-viewer block documentation
- **[scripts/ipynb-helpers.js](../../scripts/ipynb-helpers.js)** - Helper functions implementation
- **[test.ipynb](../../test.ipynb)** - Reference notebook with examples

## Summary

Jupyter notebooks with browser execution provide an interactive testing environment for EDS blocks that:

- **Browser-native execution**: Direct browser APIs, no Node.js complexity
- **Simple setup**: One-line `initialize()` function
- **Helper functions**: `window.testBlockFn`, `window.showPreview` available everywhere
- **Popup previews**: Visual feedback with blob URL + base tag
- **Minimal DOM structure**: EDS-compatible (block as direct child of main)
- **ipynb-viewer integration**: End-user executable notebooks
- **Instant feedback**: No server or build overhead
- **Shareable**: Create interactive demos and documentation

Use this skill whenever you need to rapidly test, debug, or document EDS blocks in the browser without the ceremony of traditional development environments.

---

**Skill Status**: ✅ Complete - Browser-only execution
**Line Count**: < 500 lines
**Progressive Disclosure**: Detailed content in reference files
