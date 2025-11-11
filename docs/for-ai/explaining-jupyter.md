# Jupyter Notebook Testing for EDS Blocks

*Related: [EDS Native Testing Standards](testing/eds-native-testing-standards.md) | [Block Architecture Standards](implementation/block-architecture-standards.md) | [Debug Guide](testing/debug.md)*

## Overview

This document explains the Jupyter notebook implementation for **interactive testing of EDS blocks using JavaScript**. This is NOT Python-based testing—it uses JavaScript with jsdom for virtual DOM manipulation and the JSLab kernel for running JavaScript code in Jupyter notebooks.

## What This Is

**Jupyter Notebook Testing** provides an interactive development environment for testing Adobe Edge Delivery Services (EDS) blocks using:
- **JavaScript** (NOT Python)
- **JSLab kernel** (JavaScript execution in Jupyter)
- **jsdom** (Virtual DOM for simulating browser environment)
- **VS Code** (Notebook editing with Jupyter extension)

This allows you to test EDS blocks interactively without running a full browser or development server.

---

## Architecture Overview

### Core Components

```
┌─────────────────────────────────────────────────────┐
│                  Jupyter Notebook                   │
│                    (.ipynb file)                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │         JSLab Kernel (JavaScript)         │    │
│  │    Executes JavaScript code in notebook   │    │
│  └───────────────────────────────────────────┘    │
│                        ↓                            │
│  ┌───────────────────────────────────────────┐    │
│  │      jsdom (Virtual DOM Environment)      │    │
│  │   Simulates browser: document, window     │    │
│  └───────────────────────────────────────────┘    │
│                        ↓                            │
│  ┌───────────────────────────────────────────┐    │
│  │         Your EDS Block JavaScript         │    │
│  │     (e.g., blocks/your-block/*.js)        │    │
│  └───────────────────────────────────────────┘    │
│                        ↓                            │
│  ┌───────────────────────────────────────────┐    │
│  │      Helper Functions (testBlock)         │    │
│  │  - testBlock(): Run block decoration      │    │
│  │  - saveBlockHTML(): Generate preview      │    │
│  │  - loadBlockStyles(): Link CSS            │    │
│  └───────────────────────────────────────────┘    │
│                        ↓                            │
│  ┌───────────────────────────────────────────┐    │
│  │           HTML Preview Output             │    │
│  │    Styled HTML file with live CSS         │    │
│  └───────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
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

### 3. Helper Functions

Custom utility functions for testing EDS blocks:

#### `testBlock(blockName, contentHTML, blockConfig)`
Tests a block's decoration function with provided content.

**Parameters:**
- `blockName`: Name of the block (e.g., 'hero')
- `contentHTML`: HTML content structure (EDS table format)
- `blockConfig`: Optional configuration object

**Returns:** The decorated block element

**Example:**
```javascript
const block = await testBlock('hero', `
  <div>
    <div>Welcome to Our Site</div>
    <div>Discover amazing content</div>
  </div>
`);
console.log(block.outerHTML);
```

#### `saveBlockHTML(block, blockName, filename)`
Saves the decorated block as a styled HTML file.

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

**Cell 1: Setup jsdom**
```javascript
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Create virtual DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

console.log('✓ Virtual DOM initialized');
```

**Cell 2: Define Helper Functions**
```javascript
async function testBlock(blockName, contentHTML, blockConfig = {}) {
  // Import block JavaScript
  const blockPath = path.join(__dirname, '..', 'blocks', blockName, `${blockName}.js`);
  delete require.cache[require.resolve(blockPath)];
  const blockModule = require(blockPath);
  const decorate = blockModule.default || blockModule;

  // Create block element with EDS structure
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = contentHTML;

  const block = document.createElement('div');
  block.className = `${blockName} block`;
  Array.from(tempDiv.children).forEach(child => block.appendChild(child));

  // Apply configuration
  Object.keys(blockConfig).forEach(key => {
    block.dataset[key] = blockConfig[key];
  });

  // Decorate the block
  await decorate(block);

  return block;
}

function saveBlockHTML(block, blockName, filename) {
  const outputPath = path.join(__dirname, filename);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${blockName} Preview</title>

    <!-- EDS Core Styles -->
    <link rel="stylesheet" href="../styles/styles.css">
    <link rel="stylesheet" href="../styles/fonts.css">

    <!-- Block Styles -->
    <link rel="stylesheet" href="../blocks/${blockName}/${blockName}.css">

    <style>
        body {
            padding: 2rem;
            background: var(--light-color);
        }
        body.appear { display: block; }
    </style>
</head>
<body class="appear">
    ${block.outerHTML}
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  console.log(\`✓ Saved to \${filename}\`);
}

console.log('✓ Helper functions loaded');
```

**Cell 3: Test Your Block**
```javascript
// Test case 1: Basic usage
const block1 = await testBlock('your-block', `
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
```

**Cell 4: Generate Preview**
```javascript
saveBlockHTML(block1, 'your-block', 'your-block-preview.html');
console.log('Open ipynb-tests/your-block-preview.html in browser');
```

**Cell 5: Test with Configuration**
```javascript
// Test case 2: With data attributes
const block2 = await testBlock('your-block', `
  <div>
    <div>Title 1</div>
    <div>Description 1</div>
  </div>
`, {
  layout: 'grid',
  columns: '3'
});

console.log('With config:');
console.log(block2.outerHTML);
saveBlockHTML(block2, 'your-block', 'your-block-grid-preview.html');
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

## Limitations

### What Notebooks CAN'T Do

1. **Real Browser Testing**
   - No actual rendering
   - CSS computed styles not available
   - No browser-specific behaviors

2. **User Interactions**
   - Can't test clicks, hovers, focus
   - No event simulation

3. **Network Requests**
   - fetch() won't work in jsdom
   - Need to mock or stub API calls

4. **Browser APIs**
   - IntersectionObserver, ResizeObserver not available
   - localStorage, sessionStorage limited
   - window.matchMedia not fully supported

### What Notebooks CAN Do

1. **DOM Manipulation**
   - Test decorate functions
   - Verify element creation
   - Check HTML structure

2. **Content Extraction**
   - Parse EDS table structure
   - Extract text, images, links
   - Test data transformation

3. **Logic Testing**
   - Configuration handling
   - Conditional rendering
   - Content processing

4. **HTML Generation**
   - Create styled previews
   - Visual verification in browser
   - Documentation artifacts

---

## Best Practices

### 1. Use Both test.html AND Notebooks

- **Notebooks**: Quick iteration, logic testing, documentation
- **test.html**: Visual testing, interactions, browser-specific behavior

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

### test.html (Browser-based)

**Pros:**
- Real browser rendering
- Visual feedback
- User interaction testing
- Browser DevTools

**Cons:**
- Requires dev server
- Manual refresh
- One scenario per file (usually)
- No inline documentation

**Use for:** Visual testing, interactions, browser-specific behavior

### Jupyter Notebooks (jsdom-based)

**Pros:**
- No server required
- Interactive iteration
- Multiple scenarios in one file
- Inline documentation
- Generated HTML previews

**Cons:**
- No real rendering
- Limited browser APIs
- No interaction testing

**Use for:** Logic testing, rapid prototyping, documentation

### Automated Tests (Jest/Mocha)

**Pros:**
- CI/CD integration
- Regression testing
- Coverage reports
- Fast execution

**Cons:**
- Setup complexity
- No visual feedback
- Not interactive

**Use for:** Regression testing, CI/CD, coverage

---

## Related Documentation

- **[EDS Native Testing Standards](testing/eds-native-testing-standards.md)** - Traditional test.html approach
- **[Block Architecture Standards](implementation/block-architecture-standards.md)** - Block development patterns
- **[Debug Guide](testing/debug.md)** - Debugging workflows
- **[Jupyter Notebook Skill](.claude/skills/jupyter-notebook-testing.md)** - Claude Code skill

---

## Conclusion

Jupyter notebook testing provides an **interactive, documented approach** to testing EDS blocks using JavaScript and jsdom. It complements traditional test.html files by offering:

- Faster iteration cycles
- Better documentation
- Multiple test scenarios in one place
- Generated HTML previews

Use notebooks for **logic testing and rapid prototyping**, then validate with test.html in a real browser for **visual and interaction testing**.

This hybrid approach gives you the best of both worlds: speed and interactivity from notebooks, with real-world validation from browser testing.
