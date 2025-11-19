---
name: create-presentation
description: Create or update presentation notebooks with embedded HTML and JavaScript in markdown cells using EDS blocks. Convert executable code cells to informative text. Build presentations, slides, demos, showcases with accordion, cards, tabs, hero, grid, table blocks. No runnable JavaScript cells - only visual markdown with inline scripts for presentation mode.
---

# Create Presentation Skill

## Purpose

Transform Jupyter notebooks into beautiful presentation-mode experiences using embedded HTML and JavaScript within markdown cells. Leverages EDS blocks for visual appeal while preventing code execution by users.

## When to Use

- Creating presentation notebooks
- Building interactive demos without executable code
- Converting educational notebooks to presentation format
- Creating showcases, tutorials, or product demos
- Building slide-like experiences with EDS blocks
- Updating existing notebooks to presentation mode

## Key Concepts

### Presentation Mode vs Interactive Mode

**Interactive Notebooks** (e.g., test.ipynb):
- Users can run JavaScript code cells
- Code cells have "Run" buttons
- For developers and testing

**Presentation Notebooks** (e.g., demo.ipynb):
- No executable code cells
- All interactivity via inline scripts in markdown
- For end users, clients, presentations
- Beautiful visual layouts with EDS blocks

### Core Approach

1. **All content in markdown cells** - No code cells with executable JavaScript
2. **Inline scripts in markdown** - Use `<script>` tags within markdown for interactivity
3. **EDS blocks via HTML** - Embed block HTML directly in markdown
4. **Conversion of existing code cells** - Transform to informative markdown text

## Available EDS Blocks

See [resources/blocks-reference.md](resources/blocks-reference.md) for complete details on all blocks.

**Visual Layout Blocks:**
- `accordion` - Collapsible sections
- `cards` - Card grid layouts
- `tabs` - Tabbed content
- `grid` - Flexible grid layouts
- `hero` - Hero banners
- `table` - Data tables

**Content Blocks:**
- `quote` - Pull quotes
- `columns` - Multi-column layouts
- `modal` - Dialog overlays
- `video` - Embedded videos

**Interactive Blocks:**
- `code-expander` - Expandable code snippets
- `counter` - Animated counters
- `floating-alert` - Dismissible alerts

## Quick Start

### Creating a New Presentation

```markdown
Use /create-presentation command with:
- Topic or title
- Key sections/topics
- Desired blocks (accordion, cards, tabs, etc.)
```

**Example:**
```
/create-presentation "Product Demo" with sections: Features, Benefits, Pricing
Use cards for features, accordion for benefits, table for pricing
```

### Converting Existing Notebook

```markdown
Use /create-presentation with path to existing .ipynb file
All code cells will be converted to informative markdown
```

**Example:**
```
/create-presentation convert education.ipynb
Keep structure but make it presentation-only
```

## Structure Pattern

### Metadata Setup

Every presentation notebook should have:

```json
{
  "metadata": {
    "title": "Presentation Title",
    "description": "Brief description",
    "author": "Author Name",
    "date": "2025-01-19",
    "category": "presentation",
    "repo": "https://github.com/username/repo"
  }
}
```

### Cell Structure

**Title Cell (Markdown):**
```markdown
# 🎯 Presentation Title

**Subtitle or tagline**

---

## Overview

Brief introduction to the presentation
```

**Content Cells (Markdown with Embedded Blocks):**
```markdown
## Section Title

<div class="accordion block">
  <div>
    <div>Feature 1</div>
    <div>Description of feature 1 with details...</div>
  </div>
  <div>
    <div>Feature 2</div>
    <div>Description of feature 2 with details...</div>
  </div>
</div>

<script type="module">
  // Initialize block
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

**Navigation Cell (Markdown):**
```markdown
---

## 📋 Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)
- [Conclusion](#conclusion)
```

## Block Usage Patterns

### Accordion Block (Collapsible Sections)

**Best For:** FAQs, feature lists, detailed explanations

```markdown
<div class="accordion block">
  <div>
    <div>Question or Title</div>
    <div>Answer or detailed content here...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

### Cards Block (Grid Layout)

**Best For:** Features, team members, product showcase

```markdown
<div class="cards block">
  <div>
    <div><strong>📊 Card Title</strong></div>
    <div>Card content with description...</div>
  </div>
  <div>
    <div><strong>🚀 Another Card</strong></div>
    <div>More content here...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  const module = await import('/blocks/cards/cards.js');
  await module.default(block);
</script>
```

### Tabs Block (Tabbed Content)

**Best For:** Organizing related information, code examples, comparisons

```markdown
<div class="tabs block">
  <div>
    <div>Tab 1</div>
    <div>Content for tab 1...</div>
  </div>
  <div>
    <div>Tab 2</div>
    <div>Content for tab 2...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.tabs.block');
  const module = await import('/blocks/tabs/tabs.js');
  await module.default(block);
</script>
```

See [resources/blocks-reference.md](resources/blocks-reference.md) for all block patterns.

## Converting Code Cells

### Original Code Cell

```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
```

### Converted to Markdown

```markdown
### Code Example: Testing Accordion Block

This example demonstrates how to test the accordion block programmatically:

**Original code:**
\```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
\```

**What it does:**
1. Imports the testBlock helper function
2. Tests the accordion block with provided content
3. Returns the rendered HTML

**Result:** The accordion block is decorated and ready for display.

---

**Note:** In presentation mode, code is shown for reference only. See the live accordion demonstration below:

<div class="accordion block">
  <!-- Actual working accordion here -->
</div>
```

### Conversion Rules

1. **Show the code** - Display original code in fenced code block
2. **Explain the purpose** - What does this code do?
3. **Describe the result** - What was the expected outcome?
4. **Provide alternative** - Show the working result via embedded block

## Best Practices

### Visual Design

- Use emojis for section headers (🎯, 📊, 🚀, ✨, 💡)
- Break content into digestible chunks
- Use blocks for interactive elements
- Add horizontal rules (`---`) between major sections
- Use **bold** and *italic* for emphasis

### Content Organization

- Start with title and overview
- Table of contents for long presentations
- Group related content in blocks
- End with call-to-action or summary
- Use hash links for navigation

### Performance

- Limit to 1-3 blocks per cell (avoid overwhelming)
- Use simple inline scripts (no heavy libraries)
- Keep markdown cells focused (one topic per cell)
- Test in paged mode for smooth navigation

### Accessibility

- Use semantic HTML in blocks
- Provide alt text for images
- Clear heading hierarchy (H1 → H2 → H3)
- Descriptive link text

## Examples

See [resources/complete-examples.md](resources/complete-examples.md) for full presentation notebook examples.

## Workflow

### Step 1: Plan Structure

Identify:
- Main topic and title
- Key sections (3-7 sections ideal)
- Which blocks fit each section
- Navigation needs

### Step 2: Create Metadata

Set up notebook metadata with title, description, author, etc.

### Step 3: Build Cells

For each section:
1. Markdown header
2. Content explanation
3. Embedded block (if needed)
4. Inline script to activate block

### Step 4: Add Navigation

- Table of contents at start
- Hash links between sections
- "Back to top" or "Next section" links

### Step 5: Test

- View in default mode (scrollable)
- View in paged mode (with "Start Reading")
- Test all interactive blocks
- Verify links work

## Common Patterns

### Product Features Section

```markdown
## 🚀 Key Features

<div class="cards block">
  <div>
    <div><strong>📊 Feature 1</strong></div>
    <div>Description...</div>
  </div>
  <div>
    <div><strong>⚡ Feature 2</strong></div>
    <div>Description...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  const module = await import('/blocks/cards/cards.js');
  await module.default(block);
</script>
```

### FAQ Section

```markdown
## ❓ Frequently Asked Questions

<div class="accordion block">
  <div>
    <div>How does it work?</div>
    <div>Detailed explanation...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

### Pricing Table

```markdown
## 💰 Pricing

<div class="table block">
  <div>
    <div>Plan</div>
    <div>Price</div>
    <div>Features</div>
  </div>
  <div>
    <div>Basic</div>
    <div>$10/mo</div>
    <div>Core features</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.table.block');
  const module = await import('/blocks/table/table.js');
  await module.default(block);
</script>
```

## Technical Details

### Block Initialization Pattern

All blocks follow this pattern:

1. **HTML structure** in markdown
2. **Inline script** with module import
3. **Decoration** by calling default export

```javascript
const block = document.querySelector('.block-name.block');
const module = await import('/blocks/block-name/block-name.js');
await module.default(block);
```

### Styling

Blocks automatically load their CSS. For custom styling:

```markdown
<style>
.custom-class {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
}
</style>

<div class="custom-class">
  Custom styled content
</div>
```

### Loading CSS

If needed, manually load CSS:

```javascript
<script>
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/blocks/block-name/block-name.css';
document.head.appendChild(link);
</script>
```

## Related Skills

- `jupyter-educational-notebook` - For creating interactive educational content
- `jupyter-notebook-testing` - For testing EDS blocks
- `frontend-dev-guidelines` - For styling and best practices
- `eds-block-development` - For understanding block architecture

## Related Commands

- `/create-notebook` - Creates educational (interactive) notebooks
- `/create-presentation` - Creates presentation (non-interactive) notebooks

---

**Skill Status**: Complete - Ready for creating beautiful presentation notebooks ✅
