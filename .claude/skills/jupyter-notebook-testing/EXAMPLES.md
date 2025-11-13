# Jupyter Notebook Testing Examples - Browser Only

Complete examples and patterns for testing EDS blocks with Jupyter notebooks in the browser.

## Table of Contents

- [Quick Start Examples](#quick-start-examples)
- [Content Structure Patterns](#content-structure-patterns)
- [Block-Specific Examples](#block-specific-examples)
- [Testing Workflows](#testing-workflows)
- [Best Practices Examples](#best-practices-examples)

## Quick Start Examples

### Basic Block Test

```javascript
// Simple test without content
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('helloworld');
return block.outerHTML;
```

### Test with Content

```javascript
// Test with HTML content
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const content = `
  <div>
    <div>Test content</div>
  </div>
`;
const block = await testBlock('accordion', content);
return block.outerHTML;
```

### Generate Visual Preview

```javascript
// Create visual preview in overlay
const { showPreview } = await import('/scripts/ipynb-helpers.js');
const content = `
  <div>
    <div>Test content</div>
  </div>
`;
await showPreview('accordion', content);
return '✓ Preview overlay opened';
```

## Content Structure Patterns

### Accordion Block

```javascript
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const accordionContent = `
  <div>
    <div>What is EDS?</div>
    <div>Edge Delivery Services is Adobe's modern platform for creating high-performance websites.</div>
  </div>
  <div>
    <div>How do blocks work?</div>
    <div>Blocks transform DOM elements using JavaScript decoration patterns.</div>
  </div>
  <div>
    <div>Why use notebooks?</div>
    <div>Jupyter notebooks provide instant feedback without build steps or deployments.</div>
  </div>
`;

const block = await testBlock('accordion', accordionContent);
console.log('Created sections:', block.querySelectorAll('details').length);
await showPreview('accordion', accordionContent);

return `Created ${block.querySelectorAll('details').length} accordion sections`;
```

### Tabs Block

```javascript
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const tabsContent = `
  <div>
    <div>Overview</div>
    <div>
      <h3>Getting Started</h3>
      <p>Welcome to EDS blocks development.</p>
    </div>
  </div>
  <div>
    <div>Features</div>
    <div>
      <h3>Key Features</h3>
      <ul>
        <li>Fast performance</li>
        <li>Easy authoring</li>
        <li>Composable blocks</li>
      </ul>
    </div>
  </div>
  <div>
    <div>Examples</div>
    <div>
      <h3>Code Examples</h3>
      <pre>export default function decorate(block) { ... }</pre>
    </div>
  </div>
`;

const block = await testBlock('tabs', tabsContent);
await showPreview('tabs', tabsContent);

return '✓ Tabs block tested';
```

### Cards Block

```javascript
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const cardsContent = `
  <div>
    <div>
      <picture>
        <source type="image/webp" srcset="image1.webp">
        <img src="image1.jpg" alt="Feature 1" width="300" height="200">
      </picture>
    </div>
    <div>
      <h3>Fast Performance</h3>
      <p>Lightning-fast page loads with optimized delivery.</p>
      <p><a href="/learn-more">Learn more</a></p>
    </div>
  </div>
  <div>
    <div>
      <picture>
        <source type="image/webp" srcset="image2.webp">
        <img src="image2.jpg" alt="Feature 2" width="300" height="200">
      </picture>
    </div>
    <div>
      <h3>Easy Authoring</h3>
      <p>Author content in familiar tools like Google Docs.</p>
      <p><a href="/docs">Documentation</a></p>
    </div>
  </div>
`;

const block = await testBlock('cards', cardsContent);
console.log('Created cards:', block.querySelectorAll('.card').length);
await showPreview('cards', cardsContent);

return `Created ${block.querySelectorAll('.card').length} cards`;
```

### Hero Block

```javascript
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const heroContent = `
  <div>
    <div>
      <h1>Welcome to EDS</h1>
      <p>Build blazing-fast websites with Adobe Edge Delivery Services.</p>
      <p><a href="/get-started">Get Started</a></p>
    </div>
    <div>
      <picture>
        <source type="image/webp" srcset="hero.webp">
        <img src="hero.jpg" alt="Hero image" width="1200" height="600">
      </picture>
    </div>
  </div>
`;

const block = await testBlock('hero', heroContent);
await showPreview('hero', heroContent);

return '✓ Hero block tested';
```

### Columns Block

```javascript
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const columnsContent = `
  <div>
    <div>
      <h3>Column 1</h3>
      <p>First column content with text and formatting.</p>
    </div>
    <div>
      <h3>Column 2</h3>
      <p>Second column with different content.</p>
    </div>
    <div>
      <h3>Column 3</h3>
      <p>Third column completes the layout.</p>
    </div>
  </div>
`;

const block = await testBlock('columns', columnsContent);
await showPreview('columns', columnsContent);

return '✓ Columns block tested';
```

## Block-Specific Examples

### Form Block

```javascript
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const formContent = `
  <div>
    <div>
      <label>Name</label>
      <input type="text" name="name" required>
    </div>
    <div>
      <label>Email</label>
      <input type="email" name="email" required>
    </div>
    <div>
      <label>Message</label>
      <textarea name="message" rows="5"></textarea>
    </div>
    <div>
      <button type="submit">Send</button>
    </div>
  </div>
`;

const block = await testBlock('form', formContent);
console.log('Form fields:', block.querySelectorAll('input, textarea').length);
await showPreview('form', formContent);

return '✓ Form block tested';
```

### Quote Block

```javascript
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const quoteContent = `
  <div>
    <div>
      <p>The best way to predict the future is to invent it.</p>
      <p>— Alan Kay</p>
    </div>
  </div>
`;

const block = await testBlock('quote', quoteContent);
await showPreview('quote', quoteContent);

return '✓ Quote block tested';
```

## Testing Workflows

### Complete Test Session

```javascript
// Test basic structure
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion');
console.log('Basic test:', block.className);
return '✓ Basic structure tested';
```

```javascript
// Test with content
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const content = `
  <div>
    <div>Question</div>
    <div>Answer</div>
  </div>
`;
const block = await testBlock('accordion', content);
console.log('Items:', block.querySelectorAll('details').length);
return `✓ Created ${block.querySelectorAll('details').length} items`;
```

```javascript
// Generate preview
const { showPreview } = await import('/scripts/ipynb-helpers.js');
const content = `
  <div>
    <div>Question</div>
    <div>Answer</div>
  </div>
`;
await showPreview('accordion', content);
return '✓ Preview generated';
```

### Edge Case Testing

```javascript
// Empty content
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const empty = '';
const emptyBlock = await testBlock('accordion', empty);
console.log('Empty:', emptyBlock.children.length);
return `✓ Empty test: ${emptyBlock.children.length} children`;
```

```javascript
// Single item
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const single = '<div><div>Q</div><div>A</div></div>';
const singleBlock = await testBlock('accordion', single);
console.log('Single:', singleBlock.querySelectorAll('details').length);
return `✓ Single item: ${singleBlock.querySelectorAll('details').length} details`;
```

```javascript
// Nested HTML
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');
const nested = `
  <div>
    <div>Question with <strong>bold</strong> text</div>
    <div>Answer with <a href="#">links</a> and <em>emphasis</em></div>
  </div>
`;
const nestedBlock = await testBlock('accordion', nested);
await showPreview('accordion', nested);
return '✓ Nested HTML tested';
```

### Multiple Blocks in Sequence

```javascript
// Test multiple blocks
const { testBlock } = await import('/scripts/ipynb-helpers.js');

const blocks = ['accordion', 'cards', 'columns', 'hero'];
const results = [];

for (const blockName of blocks) {
  try {
    const block = await testBlock(blockName);
    results.push(`✓ ${blockName}: ${block.children.length} children`);
  } catch (error) {
    results.push(`✗ ${blockName}: ${error.message}`);
  }
}

console.log(results.join('\n'));
return results;
```

## Best Practices Examples

### Good Test with Clear Expectations

```javascript
// ✅ Good: Clear explanation and expectations

// Testing accordion with 3 Q&A pairs
// Expected: Should create 3 <details> elements with <summary> headers

const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

const content = `
  <div>
    <div>What is EDS?</div>
    <div>Edge Delivery Services is a composable platform for creating high-performance websites.</div>
  </div>
  <div>
    <div>How does it work?</div>
    <div>It transforms simple HTML content into interactive blocks using JavaScript decoration.</div>
  </div>
  <div>
    <div>Why test in notebooks?</div>
    <div>Jupyter notebooks provide instant feedback without build steps or browser refreshes.</div>
  </div>
`;

const block = await testBlock('accordion', content);

// Verify expectations
const details = block.querySelectorAll('details');
console.log('✓ Created sections:', details.length, '(expected: 3)');

details.forEach((detail, i) => {
  const summary = detail.querySelector('summary');
  console.log(`✓ Section ${i + 1}: "${summary?.textContent}"`);
});

// Save for visual inspection
await showPreview('accordion', content);

return `✓ Test complete: ${details.length} sections created`;
```

### Error Handling Example

```javascript
// ✅ Good: Handle potential errors
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');

try {
  const content = '<div><div>Test</div></div>';
  const block = await testBlock('myblock', content);
  console.log('✓ Success');
  console.log('  Children:', block.children.length);
  console.log('  Classes:', block.className);

  await showPreview('myblock', content);
  console.log('✓ Preview opened');

  return '✓ Test passed';
} catch (error) {
  console.error('✗ Failed:', error.message);
  return `✗ Test failed: ${error.message}`;
}
```

### Organized Test Pattern

```markdown
## Test: Accordion Block

Testing the accordion block with various content structures and edge cases.

**No initialization required** - just import what you need in each cell.

### What's Tested
- Empty accordion
- Single item accordion
- Multiple items (2, 3, 5)
- Nested HTML in questions/answers
- Malformed content handling
```

```javascript
// Test empty accordion
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const empty = '';
const emptyBlock = await testBlock('accordion', empty);
console.log('Empty result:', emptyBlock.children.length, 'children');
return `✓ Empty test: ${emptyBlock.children.length} children`;
```

```javascript
// Test single item
const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');
const single = '<div><div>Question</div><div>Answer</div></div>';
const singleBlock = await testBlock('accordion', single);
console.log('Single item:', singleBlock.querySelectorAll('details').length, 'details');
await showPreview('accordion', single);
return `✓ Single item: ${singleBlock.querySelectorAll('details').length} details`;
```

## Complete Example Notebook Flow

```markdown
# Complete Testing Session: Accordion Block
Testing accordion functionality end-to-end in the browser.
```

```javascript
// Define test content
const testContent = `
  <div>
    <div>What is EDS?</div>
    <div>Adobe Edge Delivery Services platform.</div>
  </div>
  <div>
    <div>How to use?</div>
    <div>Create blocks with JavaScript decoration.</div>
  </div>
`;
testContent
```

```javascript
// Test transformation
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', testContent);
console.log('✓ Block created');
console.log('  Details elements:', block.querySelectorAll('details').length);
return `✓ Created ${block.querySelectorAll('details').length} sections`;
```

```javascript
// Generate styled preview
const { showPreview } = await import('/scripts/ipynb-helpers.js');
await showPreview('accordion', testContent);
console.log('✓ Preview opened as overlay');
return '✓ Preview overlay opened';
```

```markdown
## Results
- Block creates 2 `<details>` elements ✓
- Each has proper `<summary>` ✓
- Content preserved ✓
- Preview available in overlay ✓

## Next Steps
- Edit `blocks/accordion/accordion.css` to adjust styling
- Re-run preview cell to see CSS changes
- Test with more complex content
```

## Tips for Browser Testing

```javascript
// ✅ Import what you need in each cell
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('blockname', content);
return block.outerHTML;
```

```javascript
// ✅ Check console for debugging
const { testBlock } = await import('/scripts/ipynb-helpers.js');
console.log('Starting test...');
const block = await testBlock('blockname', content);
console.log('Block created:', block);
console.log('Children:', block.children.length);
return '✓ Check console for details';
```

```javascript
// ✅ Use overlay previews
const { showPreview } = await import('/scripts/ipynb-helpers.js');
await showPreview('blockname', content);
return '✓ Preview overlay opened (no popup blockers!)';
```

```javascript
// ✅ No initialization required - any cell can run independently
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('blockname', content);
return block.outerHTML;
```
