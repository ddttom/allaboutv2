# Create Presentation Command

You are tasked with creating or converting a Jupyter notebook into presentation mode.

## Your Task

Create a beautiful, non-interactive presentation notebook using:
- **Markdown cells only** (no executable code cells)
- **Embedded EDS blocks** for visual appeal
- **Inline JavaScript** in markdown for block initialization
- **Convert any existing code cells** to informative markdown text

## User Request

The user wants to create a presentation about: {{prompt}}

## Requirements

### 1. Notebook Structure

**Metadata (required):**
```json
{
  "metadata": {
    "title": "Presentation Title",
    "description": "Brief description",
    "author": "Tom Cranstoun",
    "date": "2025-01-19",
    "category": "presentation",
    "difficulty": "beginner",
    "duration": "10 minutes",
    "repo": "https://github.com/ddttom/allaboutV2"
  }
}
```

**Cell Structure:**
1. Title cell with overview
2. Table of contents (if >5 sections)
3. Content cells with embedded blocks
4. Conclusion or call-to-action

### 2. No Executable Code Cells

**Convert code cells like this:**

Original code cell:
```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
```

Becomes markdown cell:
```markdown
### Code Example: Testing Accordion

**Original code** (for reference):
\```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
\```

**What it does:** Tests the accordion block with provided content

**Result:** See the working accordion below

<div class="accordion block">
  <!-- actual accordion content -->
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

### 3. Use EDS Blocks

Choose from available blocks based on content type:

**Available blocks:**
- `accordion` - Collapsible sections (FAQs, feature lists)
- `cards` - Card layouts (features, team, products)
- `tabs` - Tabbed content (code examples, comparisons)
- `hero` - Hero banners (title sections)
- `grid` - Grid layouts (flexible arrangements)
- `table` - Data tables (pricing, comparisons)
- `quote` - Pull quotes (testimonials, highlights)
- `columns` - Multi-column text
- `modal` - Dialog overlays
- `counter` - Animated counters

### 4. Block Embedding Pattern

For each block, use this pattern:

```markdown
<div class="block-name block">
  <!-- Block content structure -->
</div>

<script type="module">
  const block = document.querySelector('.block-name.block');
  const module = await import('/blocks/block-name/block-name.js');
  await module.default(block);
</script>
```

### 5. Visual Design

- Use emojis in headers (🎯, 📊, 🚀, ✨, 💡, ❓, 💰)
- Break content into chunks (don't overwhelm)
- Use horizontal rules (`---`) between sections
- Bold and italic for emphasis
- Clear heading hierarchy (# → ## → ###)

### 6. Navigation

- Add table of contents for presentations with >5 sections
- Use hash links: `[Section Name](#section-name)`
- H2 headers automatically get IDs (lowercase, hyphens)

## Block Structure Examples

### Accordion Example

```markdown
## ❓ Frequently Asked Questions

<div class="accordion block">
  <div>
    <div>How does this work?</div>
    <div>This presentation uses embedded EDS blocks in markdown cells...</div>
  </div>
  <div>
    <div>Can users run code?</div>
    <div>No, this is presentation-only. All code is converted to text...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

### Cards Example

```markdown
## 🚀 Key Features

<div class="cards block">
  <div>
    <div><strong>📊 Feature 1</strong></div>
    <div>Description of first feature with details...</div>
  </div>
  <div>
    <div><strong>⚡ Feature 2</strong></div>
    <div>Description of second feature with details...</div>
  </div>
  <div>
    <div><strong>🎨 Feature 3</strong></div>
    <div>Description of third feature with details...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  const module = await import('/blocks/cards/cards.js');
  await module.default(block);
</script>
```

### Table Example

```markdown
## 💰 Pricing Plans

<div class="table block">
  <div>
    <div>Plan</div>
    <div>Price</div>
    <div>Features</div>
  </div>
  <div>
    <div>Basic</div>
    <div>$10/month</div>
    <div>Core features included</div>
  </div>
  <div>
    <div>Pro</div>
    <div>$29/month</div>
    <div>All features + priority support</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.table.block');
  const module = await import('/blocks/table/table.js');
  await module.default(block);
</script>
```

## Workflow

1. **Analyze the request** - Identify topic, sections, appropriate blocks
2. **Create/update notebook** - Set up metadata and cell structure
3. **Convert code cells** - Transform to informative markdown
4. **Add blocks** - Embed EDS blocks with inline scripts
5. **Add navigation** - Table of contents and hash links
6. **Verify** - Ensure no executable code cells remain

## Output

Create or update the .ipynb file with:
- Proper JSON structure
- All markdown cells (no code cells with language "javascript")
- Embedded blocks with initialization scripts
- Complete metadata
- Beautiful visual design

## Important Notes

- **No code cells with `"cell_type": "code"` and `"language": "javascript"`**
- All interactivity must be in `<script>` tags within markdown
- Convert existing code cells to explanatory markdown
- Use blocks to make content visually engaging
- Test that the notebook works in both default and paged modes

Now proceed with creating the presentation notebook based on the user's request!
