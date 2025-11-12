# Building Interactive Notebooks for EDS: A Journey in Context-Aware Design

## The Challenge

When developing Adobe Edge Delivery Services (EDS) blocks, developers face a common frustration: the feedback loop is too slow. Make a change, refresh the browser, check the console, repeat. What if we could test blocks interactively, see results immediately, and even share executable examples with end users?

This is the story of how we built a dual-purpose Jupyter notebook integration that transformed both our development workflow and how we share EDS knowledge with others.

## The Vision: Two Audiences, One Solution

We set out to solve two distinct problems:

**For Developers:**
- Test EDS blocks rapidly without browser refreshes
- Experiment with different content structures
- Generate styled HTML previews instantly
- Debug block decoration logic interactively

**For End Users:**
- Share interactive tutorials on our EDS sites
- Let visitors run JavaScript examples in their browser
- Provide executable documentation
- Create engaging educational content

The solution? A context-aware Jupyter notebook system that works seamlessly in both Node.js (for development) and the browser (for end users).

## The Technical Innovation: Context-Aware Execution

Most code is written for one environment. We wanted notebooks that work identically in **two completely different contexts**:

1. **JSLab/Node.js**: For developers using VS Code with jsdom virtual DOM
2. **Browser (ipynb-viewer)**: For end users viewing notebooks on our EDS site

### The Magic: One-Line Initialization

We started with a problem: the setup code for notebooks was massive—220 lines of boilerplate that developers had to paste into every notebook's first cell. It was intimidating and error-prone.

Our breakthrough was extracting all the complexity into an external module ([scripts/ipynb-helpers.js](scripts/ipynb-helpers.js)) and exposing a single function:

```javascript
// The ENTIRE setup (works in both Node.js and browser!)
return (async () => {
  const isNode = typeof process !== 'undefined' && process.versions?.node;
  const helpersPath = isNode ? './scripts/ipynb-helpers.js' : '/scripts/ipynb-helpers.js';
  const { initialize } = await import(helpersPath);
  await initialize();

  const context = isNode ? 'Node.js' : 'Browser';
  return `✅ Environment (${context}) setup`;
})();
```

That's it. **13 lines instead of 220—a 96% reduction.** The `initialize()` function detects the environment and sets up everything automatically:

- Global environment flags (`isNode`, `isBrowser`)
- Virtual DOM (jsdom in Node.js, native in browser)
- Unified API that works identically everywhere
- Helper functions for testing and previewing

### The Unified API: No More Ternary Operators

Before our refactoring, every cell needed conditional logic:

```javascript
// OLD WAY (verbose and error-prone)
const doc = isNode ? global.document : document;
const testBlockFn = isNode ? global.testBlock : window.testBlock;
const block = await testBlockFn('accordion', content);
```

After initialization, we set up a **unified API** that works the same in both environments:

```javascript
// NEW WAY (clean and simple!)
const block = await testBlockFn('accordion', content);
await showPreview('accordion', content);
const div = doc.createElement('div');
```

No conditionals. No ternary operators. Just write code that works everywhere.

## The ipynb-viewer Block: Bringing Notebooks to the Browser

While developers test with JSLab, we wanted end users to experience the same interactivity. Enter the **ipynb-viewer block**—an EDS block that renders and executes Jupyter notebooks directly in the browser.

### Key Features

**Enhanced Markdown Parser:**
We built a comprehensive markdown parser that handles:
- Code blocks with syntax highlighting (` ```javascript `)
- Tables with proper formatting
- Lists (ordered and unordered)
- Inline formatting (bold, italic, code, links)
- Headers (H1, H2, H3)

The parser processes content in a specific order to avoid conflicts:

1. Extract code blocks (with placeholders)
2. Parse tables (multi-line processing)
3. Convert headers
4. Apply inline formatting
5. Restore code blocks
6. Convert line breaks

**Interactive Code Execution:**
Each code cell has a "Run" button that:
- Checks if initialization has occurred (warns if skipped)
- Executes JavaScript with async/await support
- Captures console output (`console.log`, `console.error`)
- Displays return values
- Shows visual indicators for success/error

**Automatic Initialization Check:**
If users try to run code cells without first running the initialization cell, they see a helpful warning explaining that the first JavaScript cell must be run first to set up the environment. This prevents confusing errors about undefined functions.

### The Architecture

```javascript
// ipynb-viewer.js - Core decoration logic
export default async function decorate(block) {
  // Extract notebook path from block content
  const notebookPath = /* extract from first cell */;

  // Load notebook JSON
  const notebook = await loadNotebook(notebookPath);

  // Process each cell
  notebook.cells.forEach((cell, index) => {
    if (cell.cell_type === 'markdown') {
      // Parse and render markdown
      cellElement = createMarkdownCell(cell, index);
    } else if (cell.cell_type === 'code') {
      // Create executable code cell with Run button
      cellElement = createCodeCell(cell, index);
    }
  });
}
```

The block fetches `.ipynb` files, parses the JSON structure, and renders both markdown and code cells with full interactivity.

## The Popup Preview System: Solving Blob URL Challenges

One of our biggest technical challenges was creating visual previews that properly load CSS and JavaScript. The problem? Blob URLs.

### The Problem

When you create an HTML file as a Blob and open it in a new window, it gets a `blob://` URL with a **null origin**. This means:
- Relative paths don't work (`styles/styles.css` → nowhere)
- CSS files won't load
- JavaScript modules can't import
- Blocks appear as colored boxes without styling

### The Solution: Base Tag to the Rescue

We discovered that the HTML `<base>` tag tells the browser where to resolve relative URLs:

```html
<!DOCTYPE html>
<html>
<head>
  <base href="https://your-site.com/">
  <link rel="stylesheet" href="styles/styles.css">
  <link rel="stylesheet" href="blocks/accordion/accordion.css">
</head>
```

Now `styles/styles.css` resolves to `https://your-site.com/styles/styles.css`—perfect!

### Critical: Minimal DOM Structure

EDS blocks expect specific DOM patterns. Many blocks iterate over `block.children` directly:

```javascript
[...block.children].forEach((row) => {
  // Process each content row
});
```

**The problem:** Extra wrapper divs between `<main>` and the block break this pattern. The block finds wrapper divs instead of content rows, producing incorrect output (often just colored boxes).

**The solution:** Block must be a **direct child of `<main>`** with no intermediary wrappers:

```html
<main>
  <div class="accordion block">
    <!-- content rows as direct children -->
  </div>
</main>
```

We use a fixed-position header (48px height) with `main` padding (68px top) to prevent overlap without disrupting the document flow.

## How the Unified API Adapts to Each Environment

The beauty of our system is how `showPreview()` behaves differently based on context:

**In Node.js (JSLab):**
```javascript
await showPreview('accordion', content);
// → Saves two HTML files to ipynb-tests/
//   1. accordion-preview.html (styled block)
//   2. accordion-live-preview.html (iframe with controls)
// → Console shows file locations
// → User opens file in browser
```

**In Browser (ipynb-viewer):**
```javascript
await showPreview('accordion', content);
// → Creates HTML with base tag for origin resolution
// → Generates blob URL
// → Opens popup window (1200x800)
// → Block decorates automatically with full styling
// → Console shows popup opened
```

Same function call, completely different behavior, seamless experience.

## Real-World Usage: Testing an Accordion Block

Let's walk through a complete testing session:

### Step 1: Create a Notebook

Open [test.ipynb](../test.ipynb) in VS Code with the JSLab kernel selected.

### Step 2: Run Setup Cell

```javascript
// First code cell - initializes everything
return (async () => {
  const isNode = typeof process !== 'undefined' && process.versions?.node;
  const helpersPath = isNode ? './scripts/ipynb-helpers.js' : '/scripts/ipynb-helpers.js';
  const { initialize } = await import(helpersPath);
  await initialize();

  const context = isNode ? 'Node.js' : 'Browser';
  return `✅ Environment (${context}) setup`;
})();
```

**Output:** `✅ Environment (Node.js) setup`

### Step 3: Test Block Structure

```javascript
// Test accordion with Q&A content
(async () => {
  const content = `
    <div>
      <div>What is EDS?</div>
      <div>Edge Delivery Services is Adobe's modern web platform.</div>
    </div>
    <div>
      <div>How do blocks work?</div>
      <div>Blocks transform DOM elements using JavaScript decoration.</div>
    </div>
  `;

  const block = await testBlockFn('accordion', content);
  console.log('✓ Block created');
  console.log('Details elements:', block.querySelectorAll('details').length);
  return block.outerHTML;
})();
```

**Output:**
```
=== Testing: accordion ===
✓ Loaded styles for accordion
Before: <div>...</div>
After: <details><summary>What is EDS?</summary>...
✓ Block created
Details elements: 2
```

### Step 4: Generate Visual Preview

```javascript
// Create styled preview with controls
(async () => {
  const content = `...`; // same content
  return await showPreview('accordion', content);
})();
```

**Output:**
```
✅ FILES CREATED (Node.js):
📂 ipynb-tests/accordion-preview.html - Styled block
📂 ipynb-tests/accordion-live-preview.html - Iframe with controls
🎨 Open accordion-live-preview.html in your browser!
```

Open the file and see your fully-styled, interactive accordion with a dark-themed control bar featuring Refresh and Close buttons (ESC key works too).

## For End Users: Publishing Interactive Notebooks

To share this notebook with site visitors, simply add the ipynb-viewer block to a Google Doc:

```
| IPynb Viewer |
|--------------|
| /notebooks/accordion-tutorial.ipynb |
```

When published, users can:
- Read markdown explanations
- Click "Run" on code cells
- See console output and results inline
- Experiment with the code
- Learn by doing

The first code cell displays `✅ Environment (Browser) setup` and everything works identically to the developer experience.

## The Development Workflow

Our Jupyter integration transformed how we build blocks:

1. **Create notebook:** `cp test.ipynb my-block-test.ipynb`
2. **Write test content:** Define HTML structures in markdown cells
3. **Run tests:** Execute code cells with `testBlockFn()`
4. **Generate previews:** Use `showPreview()` for visual feedback
5. **Iterate on CSS:** Edit block CSS, refresh preview (no regeneration needed!)
6. **Share results:** Commit notebook or use ipynb-viewer for demonstrations

The CSS workflow is particularly elegant: since previews link to your block's CSS file (not embedded styles), you can edit the CSS, refresh the browser, and see changes immediately—no need to rerun notebook cells or regenerate HTML.

## Try It Yourself

Ready to build your own interactive notebooks?

1. **Install dependencies:**
   ```bash
   npm install jsdom
   npm install -g jslab
   jslab install --python=python3
   ```

2. **Create a notebook:**
   Copy [test.ipynb](../test.ipynb) and open in VS Code with the JSLab kernel.

3. **Run the first cell:**
   Initialize the environment with the one-line setup.

4. **Start testing:**
   Use `testBlockFn()` and `showPreview()` to test your blocks.

See [.claude/skills/jupyter-notebook-testing/INSTALLATION.md](.claude/skills/jupyter-notebook-testing/INSTALLATION.md) for detailed setup instructions.

## Conclusion

Building this Jupyter notebook integration taught us that the best tools adapt to their users, not the other way around. By creating a context-aware system that works identically in development and production environments, we:

- Reduced setup code by 96%
- Eliminated conditional logic in tests
- Enabled interactive tutorials for end users
- Accelerated our development workflow
- Made EDS block development more accessible

The key innovations—external helpers, unified API, one-line initialization, base tag previews, and context-aware execution—combined to create something greater than the sum of its parts: a genuinely useful tool that developers want to use and end users can benefit from.

Whether you're testing a complex accordion block or teaching JavaScript to newcomers, the same notebook works beautifully. That's the power of context-aware design.

---

**Resources:**
- [ipynb-viewer Block](blocks/ipynb-viewer/README.md) - Block documentation
- [Jupyter Testing Skill](.claude/skills/jupyter-notebook-testing/SKILL.md) - Developer guide
- [Helper Functions](scripts/ipynb-helpers.js) - Implementation details
- [Example Notebook](test.ipynb) - Working examples
- [Installation Guide](.claude/skills/jupyter-notebook-testing/INSTALLATION.md) - Setup steps
