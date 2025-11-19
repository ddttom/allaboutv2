# Explaining Presentation Notebooks

## Overview

Presentation notebooks are Jupyter notebooks designed for **viewing and presentation** rather than code execution. They transform complex content into beautiful, interactive experiences using embedded HTML, inline styling, and EDS blocks—all within markdown cells. No executable code cells, just pure presentation.

**Key Distinction:**
- **Educational Notebooks** (`explaining-educational-notebooks.md`) - Interactive, executable, for learning
- **Presentation Notebooks** (this guide) - Non-executable, for presenting, showcasing, and client demos

## Purpose

Create stunning visual presentations using Jupyter notebooks that:
- Display content beautifully with inline HTML/CSS styling
- Embed interactive EDS blocks directly in markdown
- Present information without user-executable code
- Work perfectly with the ipynb-viewer block for web display
- Provide consistent, professional design across all cells

## When to Use Presentation Notebooks

### Perfect For:
- **Client presentations** - Professional demos without code execution risk
- **Product showcases** - Feature highlights with beautiful visuals
- **Documentation presentations** - Navigable guides with interactive elements
- **Marketing materials** - Branded content with consistent styling
- **Training slides** - Non-technical presentations with interactivity
- **Status reports** - Visual updates with data displays

### NOT For:
- Developer testing (use `test.ipynb` instead)
- Interactive tutorials where users run code (use educational notebooks)
- Live code demonstrations (use educational notebooks with `autorun`)

## Core Concepts

### 1. Markdown-Only Cells

**All content lives in markdown cells**—no code cells with executable JavaScript:

```markdown
## Section Title

Content with **formatting** and [links](url)

<div class="cards block">
  <!-- EDS block HTML -->
</div>

<script type="module">
  // Inline script for block initialization
  const block = document.querySelector('.cards.block');
  const module = await import('/blocks/cards/cards.js');
  await module.default(block);
</script>
```

### 2. Inline HTML Styling

Every cell gets beautiful inline styling for consistency:

```html
<div style="background: white; border-radius: 12px; padding: 28px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
<h3 style="color: #1976d2; font-size: 24px; font-weight: 700; margin-bottom: 20px;">
Section Title
</h3>
<div style="color: #212121; line-height: 1.8; font-size: 16px;">
Your content with proper typography and spacing
</div>
</div>
```

### 3. EDS Blocks in Markdown

Embed fully functional EDS blocks directly:

```markdown
<div class="accordion block">
  <div>
    <div>Question or Title</div>
    <div>Answer or detailed content</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

### 4. Converting Educational to Presentation

Transform existing educational notebooks:

**Educational (Code Cell):**
```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
```

**Presentation (Markdown Cell):**
```markdown
### Code Example: Testing Accordion Block

This demonstrates testing the accordion block:

**Original code:**
\```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
\```

**Result:** See the live demonstration below:

<div class="accordion block">
  <!-- Working accordion HTML -->
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

## Design System

### Color Palette (Material Design-Inspired)

```javascript
{
  primary: '#1976d2',      // Material Blue
  secondary: '#dc004e',    // Material Pink
  success: '#2e7d32',      // Green
  warning: '#ed6c02',      // Orange
  info: '#0288d1',         // Light Blue
  background: '#f5f5f5',   // Light Gray
  surface: '#ffffff',      // White
  text_primary: '#212121', // Dark Gray
  text_secondary: '#757575' // Medium Gray
}
```

### Typography Hierarchy

| Element | Size | Weight | Use Case |
|---------|------|--------|----------|
| Hero Title | 48px | 800 | Main presentation title |
| H2 Section | 28-32px | 700 | Major sections |
| H3 Subsection | 24px | 700 | Subsections |
| Body Text | 16-18px | 400 | Paragraphs, line-height: 1.8 |
| Small Text | 14px | 400 | Captions, notes |
| Code | 14px | - | Courier New, monospace |

### Spacing System

- **Section Margin:** 24-32px
- **Card Padding:** 24-32px (outer), 20-28px (inner)
- **Content Gap:** 12-16px
- **Border Radius:** 8-16px (larger for containers, smaller for buttons)
- **Box Shadow:** `0 2px 8px rgba(0,0,0,0.08)` (subtle depth)

## Styling Patterns

### Pattern 1: Hero Header

Use at the top of your presentation for maximum impact:

```html
<div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; border-radius: 16px; padding: 48px; text-align: center; margin: 32px 0; box-shadow: 0 8px 16px rgba(0,0,0,0.2);">
<h1 style="font-size: 48px; font-weight: 800; margin: 0 0 16px 0; display: flex; align-items: center; justify-content: center; gap: 16px;">
<span style="font-size: 56px;">🎯</span>
<span>Your Presentation Title</span>
</h1>
<p style="font-size: 20px; margin: 16px 0; opacity: 0.95; font-weight: 300;">
<strong style="font-weight: 600;">Compelling tagline</strong> with additional context
</p>
</div>
```

**Result:** Full-width gradient header with large title and emoji

### Pattern 2: Content Card

Use for standard content sections:

```html
<div style="background: white; border-radius: 12px; padding: 28px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
<h3 style="color: #1976d2; font-size: 24px; font-weight: 700; margin-bottom: 20px;">
Section Title
</h3>
<div style="color: #212121; line-height: 1.8; font-size: 16px;">

Your content with **markdown formatting** supported:
- Bullet points work
- [Links work](url)
- **Bold** and *italic* work

</div>
</div>
```

**Result:** Clean white card with shadow and proper typography

### Pattern 3: EDS Block Wrapper

Use to highlight and explain EDS blocks:

```html
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #0288d1;">

### What this demonstrates

Explanatory text before the block explaining what users will see.

---

<div class="cards block">
  <div>
    <div><strong>Feature 1</strong></div>
    <div>Description of feature 1</div>
  </div>
  <div>
    <div><strong>Feature 2</strong></div>
    <div>Description of feature 2</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  if (block) {
    const module = await import('/blocks/cards/cards.js');
    await module.default(block);
  }
</script>

</div>
```

**Result:** Light blue gradient background with left border accent containing EDS block

### Pattern 4: Interactive Navigation

Use for table of contents or section navigation:

```html
<div style="background: white; border-radius: 12px; padding: 32px; margin: 24px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-top: 4px solid #1976d2;">
<h2 style="color: #1976d2; font-size: 28px; font-weight: 700; margin-bottom: 24px;">
📋 Table of Contents
</h2>
<nav aria-label="Presentation navigation">
  <ul style="list-style: none; padding: 0; margin: 0;">
    <li style="margin: 12px 0;">
      <a href="#section-1" style="color: #1976d2; text-decoration: none; font-size: 18px; font-weight: 500; display: flex; align-items: center; gap: 8px; padding: 12px; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
        <span style="font-size: 20px;">🌍</span>
        Section 1 Title
      </a>
    </li>
    <li style="margin: 12px 0;">
      <a href="#section-2" style="color: #1976d2; text-decoration: none; font-size: 18px; font-weight: 500; display: flex; align-items: center; gap: 8px; padding: 12px; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
        <span style="font-size: 20px;">📊</span>
        Section 2 Title
      </a>
    </li>
  </ul>
</nav>
</div>
```

**Result:** Interactive navigation with hover effects and emoji icons

### Pattern 5: Highlight Box (Info/Warning/Success)

Use for callouts and important information:

```html
<!-- Info Box -->
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 6px solid #0288d1;">
<h4 style="color: #0288d1; font-size: 20px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
<span style="font-size: 24px;">ℹ️</span>
Information
</h4>
<p style="color: #212121; line-height: 1.8; margin: 0;">
Your informational content here
</p>
</div>

<!-- Warning Box -->
<div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 6px solid #ed6c02;">
<h4 style="color: #ed6c02; font-size: 20px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
<span style="font-size: 24px;">⚠️</span>
Warning
</h4>
<p style="color: #212121; line-height: 1.8; margin: 0;">
Your warning content here
</p>
</div>

<!-- Success Box -->
<div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 6px solid #2e7d32;">
<h4 style="color: #2e7d32; font-size: 20px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
<span style="font-size: 24px;">✅</span>
Success
</h4>
<p style="color: #212121; line-height: 1.8; margin: 0;">
Your success content here
</p>
</div>
```

## Available EDS Blocks

All blocks from the EDS system work in presentation notebooks:

### Visual Layout Blocks
- **accordion** - Collapsible sections (FAQs, features)
- **cards** - Grid card layouts (features, team, products)
- **tabs** - Tabbed content (organize related info)
- **grid** - Flexible grid layouts (custom arrangements)
- **hero** - Hero banners (prominent headers)
- **table** - Data tables (pricing, comparisons)

### Content Blocks
- **quote** - Pull quotes (testimonials, highlights)
- **columns** - Multi-column layouts (side-by-side content)
- **modal** - Dialog overlays (detailed info on demand)
- **video** - Embedded videos (demos, tutorials)

### Interactive Blocks
- **code-expander** - Expandable code snippets
- **counter** - Animated counters (statistics)
- **floating-alert** - Dismissible alerts (notifications)

**See:** `.claude/skills/create-presentation/resources/blocks-reference.md` for complete details

## Block Usage Examples

### Accordion for FAQs

```markdown
## ❓ Frequently Asked Questions

<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #0288d1;">

### Common questions about our product

---

<div class="accordion block">
  <div>
    <div>How does it work?</div>
    <div>Detailed explanation of how the product works with technical details...</div>
  </div>
  <div>
    <div>What are the pricing options?</div>
    <div>Complete pricing breakdown with different tiers...</div>
  </div>
  <div>
    <div>Is there a free trial?</div>
    <div>Yes! We offer a 30-day free trial with full features...</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  if (block) {
    const module = await import('/blocks/accordion/accordion.js');
    await module.default(block);
  }
</script>

</div>
```

### Cards for Features

```markdown
## 🚀 Key Features

<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #0288d1;">

### What makes our solution unique

---

<div class="cards block">
  <div>
    <div><strong>📊 Real-Time Analytics</strong></div>
    <div>Get instant insights with our powerful analytics dashboard that updates in real-time.</div>
  </div>
  <div>
    <div><strong>⚡ Lightning Fast</strong></div>
    <div>Optimized performance ensures your users get results in milliseconds, not seconds.</div>
  </div>
  <div>
    <div><strong>🔒 Enterprise Security</strong></div>
    <div>Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.</div>
  </div>
  <div>
    <div><strong>🌍 Global Scale</strong></div>
    <div>Deploy across 15+ regions worldwide with automatic failover and load balancing.</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  if (block) {
    const module = await import('/blocks/cards/cards.js');
    await module.default(block);
  }
</script>

</div>
```

### Tabs for Product Comparison

```markdown
## 📋 Product Tiers

<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #0288d1;">

### Compare our pricing tiers

---

<div class="tabs block">
  <div>
    <div>Starter</div>
    <div>
      <h3>$29/month</h3>
      <ul>
        <li>Up to 1,000 users</li>
        <li>5GB storage</li>
        <li>Email support</li>
        <li>Basic analytics</li>
      </ul>
    </div>
  </div>
  <div>
    <div>Professional</div>
    <div>
      <h3>$99/month</h3>
      <ul>
        <li>Up to 10,000 users</li>
        <li>50GB storage</li>
        <li>Priority support</li>
        <li>Advanced analytics</li>
        <li>Custom integrations</li>
      </ul>
    </div>
  </div>
  <div>
    <div>Enterprise</div>
    <div>
      <h3>Contact Sales</h3>
      <ul>
        <li>Unlimited users</li>
        <li>Unlimited storage</li>
        <li>24/7 dedicated support</li>
        <li>Real-time analytics</li>
        <li>White-label options</li>
        <li>SLA guarantee</li>
      </ul>
    </div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.tabs.block');
  if (block) {
    const module = await import('/blocks/tabs/tabs.js');
    await module.default(block);
  }
</script>

</div>
```

## Notebook Structure

### Required Metadata

Every presentation notebook should have proper metadata:

```json
{
  "metadata": {
    "title": "Your Presentation Title",
    "description": "Brief description of the presentation",
    "author": "Your Name",
    "date": "2025-01-19",
    "category": "presentation",
    "repo": "https://github.com/username/repo",
    "manual-path": "docs/for-ai/your-documentation.md"
  }
}
```

**Metadata Fields:**

- **`title`** (required) - Main presentation title
- **`description`** (optional) - One-line summary
- **`author`** (optional) - Author name
- **`date`** (optional) - Publication date
- **`category`** (optional) - Content category (e.g., "presentation", "demo")
- **`repo`** (optional) - Repository URL for linking .md files automatically
- **`manual-path`** (optional) - Path to documentation for "Read the Manual" button
  - **REQUIRED for button:** The "Read the Manual" button only appears if `manual-path` is provided
  - **Plain .md filename:** With `repo` set, creates GitHub link: `{repo}/blob/main/{manual-path}`
  - **Absolute path:** Paths starting with `/` are used as-is (e.g., `/blocks/ipynb-viewer/README.mdc`)
  - **Relative path:** Other paths are made absolute from root (e.g., `docs/guide.md` → `/docs/guide.md`)
  - **Full URL:** Paths starting with `http://` or `https://` are used as-is
  - **No default:** If omitted, "Read the Manual" button will not appear (even with `manual` or `notebook` variations)
  - **Example:** `"manual-path": "docs/for-ai/explaining-presentation-notebooks.md"` with `repo` set creates GitHub link

### Recommended Cell Flow

**Cell 0: Hero Header**
- Large gradient background
- Main title with emoji
- Compelling subtitle

**Cell 1: What You'll Learn / Overview**
- Key takeaways
- Icon-enhanced list
- Sets expectations

**Cell 2: Table of Contents**
- Interactive navigation
- Hash links to sections
- Hover effects

**Cells 3+: Content Sections**
- One topic per cell
- Mix of content cards and EDS blocks
- Clear section headers
- Proper spacing

**Final Cell: Conclusion / Call to Action**
- Summary of key points
- Next steps
- Contact information or links

## Best Practices

### Visual Design

✅ **DO:**
- Use emojis for section headers (🎯, 📊, 🚀, ✨, 💡)
- Break content into digestible chunks (3-5 paragraphs per card)
- Use EDS blocks for interactive elements
- Add horizontal rules (`---`) between major sections
- Use **bold** and *italic* for emphasis
- Maintain consistent spacing throughout

❌ **DON'T:**
- Overcrowd cells with too much content
- Use more than 3 blocks per cell
- Mix too many colors or fonts
- Forget hover states on interactive elements
- Skip accessibility attributes

### Content Organization

✅ **DO:**
- Start with title and overview
- Include table of contents for presentations >10 cells
- Group related content in blocks
- End with call-to-action or summary
- Use hash links for internal navigation
- Add "Back to top" links in long presentations

❌ **DON'T:**
- Put multiple unrelated topics in one cell
- Create overly deep section hierarchies
- Skip section headers
- Forget to link sections together

### Performance

✅ **DO:**
- Limit to 1-3 blocks per cell
- Use simple inline scripts
- Keep markdown cells focused (one topic per cell)
- Test in paged mode for smooth navigation
- Check loading times on slower connections

❌ **DON'T:**
- Embed heavy libraries in inline scripts
- Create overly complex DOM structures
- Use high-resolution images without optimization
- Add unnecessary animations

### Accessibility

✅ **DO:**
- Use semantic HTML in blocks
- Provide alt text for images
- Maintain clear heading hierarchy (H1 → H2 → H3)
- Use descriptive link text
- Include ARIA attributes on navigation
- Ensure proper color contrast (WCAG AA minimum)

❌ **DON'T:**
- Skip heading levels (H1 → H3)
- Use color alone to convey meaning
- Create keyboard traps
- Forget focus indicators on interactive elements

## Creating Presentation Notebooks

### Method 1: Using Slash Command

```bash
/create-notebook "Presentation Title"
# Follow prompts to specify:
# - Main sections
# - Which EDS blocks to use
# - Styling preferences
```

The command will:
1. Create properly structured notebook
2. Add metadata
3. Apply inline styling to all cells
4. Set up EDS blocks with proper initialization
5. Create table of contents with navigation

### Method 2: Using Skill Directly

```markdown
Use the create-presentation skill to create a presentation notebook about:
- Topic: Product Launch
- Sections: Overview, Features, Pricing, Demo, Contact
- Use cards for features, accordion for FAQ, table for pricing
- Apply Material Design styling throughout
```

### Method 3: Converting Educational Notebook

If you have an existing educational notebook:

```markdown
Convert education-notebook.ipynb to presentation format:
- Remove all executable code cells
- Convert code examples to markdown with explanations
- Add inline HTML styling
- Keep EDS blocks but embed in markdown
- Add table of contents
```

## Converting Code Cells to Markdown

When converting educational notebooks to presentation format:

### Step 1: Show the Code

Display original code in fenced code block:

````markdown
### Code Example: Testing Block

This demonstrates how to test a block programmatically:

**Original code:**
```javascript
const { testBlock } = await import('/scripts/ipynb-helpers.js');
const block = await testBlock('accordion', content);
return block.outerHTML;
```
````

### Step 2: Explain the Purpose

```markdown
**What it does:**
1. Imports the testBlock helper function
2. Tests the accordion block with provided content
3. Returns the rendered HTML for display
```

### Step 3: Show the Result

```markdown
**Result:** The accordion block is decorated and ready for display.

---

**Live Demonstration:**

<div class="accordion block">
  <!-- Actual working accordion HTML -->
</div>

<script type="module">
  const block = document.querySelector('.accordion.block');
  const module = await import('/blocks/accordion/accordion.js');
  await module.default(block);
</script>
```

### Step 4: Add Context

```markdown
**Note:** In presentation mode, code is shown for reference only.
The working result is embedded directly in the presentation.
```

## Workflow

### Step 1: Plan Structure

Identify:
- **Main topic and title** - What's the core message?
- **Key sections** (3-7 sections ideal for presentations)
- **Which blocks fit each section** - accordion, cards, tabs?
- **Navigation needs** - Table of contents? Section links?

### Step 2: Create Metadata

Set up notebook metadata with:
- Title
- Description
- Author
- Date
- Category: "presentation"
- Repository URL

### Step 3: Build Cells

For each section:
1. Markdown header (## or ###)
2. Content explanation with inline styling
3. Embedded EDS block (if needed)
4. Inline script to activate block

### Step 4: Add Navigation

- Table of contents at start
- Hash links between sections
- "Back to top" or "Next section" links
- Hover effects on navigation elements

### Step 5: Apply Styling

Use design system consistently:
- Hero header at top
- Content cards for sections
- EDS block wrappers for blocks
- Interactive navigation for TOC
- Highlight boxes for callouts

### Step 6: Test

- **View in default mode** (scrollable)
- **View in paged mode** (with "Start Reading")
- **Test all interactive blocks** (click, expand, navigate)
- **Verify links work** (hash navigation, external links)
- **Check on mobile** (responsive design)
- **Test accessibility** (keyboard navigation, screen reader)

## ipynb-viewer Integration

Presentation notebooks work perfectly with the ipynb-viewer block:

### Display Modes

**Paged Mode (Recommended for Presentations):**
```markdown
<div class="ipynb-viewer block" data-mode="paged">
  <div>
    <div>path/to/presentation.ipynb</div>
  </div>
</div>
```

Benefits:
- "Start Reading" button
- Page-by-page navigation
- Smooth transitions
- Focus on one section at a time

**Basic Mode (For Full Scrolling):**
```markdown
<div class="ipynb-viewer block">
  <div>
    <div>path/to/presentation.ipynb</div>
  </div>
</div>
```

Benefits:
- See entire presentation at once
- Scroll through content
- Better for quick reference

**See:** `blocks/ipynb-viewer/README.md` for complete display options

## Examples

### Complete Presentation Notebook

**Real example:** `docs-navigation-presentation-enhanced.ipynb`

This notebook demonstrates:
- Hero header with gradient and large typography
- Interactive table of contents with hover effects
- Content cards with consistent styling
- EDS block wrappers with light blue gradients
- Accordion blocks for navigation paths
- Cards blocks for statistics
- Tab blocks for comparisons
- Proper spacing and typography throughout

### Minimal Presentation Template

```markdown
# Cell 0: Hero Header
<div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; border-radius: 16px; padding: 48px; text-align: center; margin: 32px 0; box-shadow: 0 8px 16px rgba(0,0,0,0.2);">
<h1 style="font-size: 48px; font-weight: 800; margin: 0 0 16px 0;">
🎯 Presentation Title
</h1>
<p style="font-size: 20px; margin: 16px 0; opacity: 0.95;">
Your compelling subtitle
</p>
</div>

# Cell 1: Overview
<div style="background: white; border-radius: 12px; padding: 28px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
<h3 style="color: #1976d2; font-size: 24px; font-weight: 700; margin-bottom: 20px;">
What You'll Learn
</h3>
<div style="color: #212121; line-height: 1.8; font-size: 16px;">

- Key point 1
- Key point 2
- Key point 3

</div>
</div>

# Cell 2: Content Section
<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #0288d1;">

## Section Title

Content explanation before the block

---

<div class="cards block">
  <div>
    <div><strong>Point 1</strong></div>
    <div>Description</div>
  </div>
</div>

<script type="module">
  const block = document.querySelector('.cards.block');
  if (block) {
    const module = await import('/blocks/cards/cards.js');
    await module.default(block);
  }
</script>

</div>
```

## Troubleshooting

### Blocks Not Rendering

**Problem:** EDS blocks show as plain HTML

**Solution:**
```javascript
// Check script tag is present and correct
<script type="module">
  const block = document.querySelector('.block-name.block');
  if (block) {
    const module = await import('/blocks/block-name/block-name.js');
    await module.default(block);
  }
</script>
```

### Styling Not Applied

**Problem:** Inline styles not showing

**Solution:**
- Check for unclosed HTML tags
- Verify style attribute syntax: `style="property: value;"`
- Ensure quotes are properly escaped in nested HTML

### Links Not Working

**Problem:** Hash links don't navigate

**Solution:**
- Use proper markdown heading IDs: `## My Section` becomes `#my-section`
- Or add explicit IDs: `<h2 id="custom-id">My Section</h2>`
- Test in ipynb-viewer on actual page (not just VS Code)

### Paged Mode Not Working

**Problem:** "Start Reading" button doesn't appear

**Solution:**
- Ensure `data-mode="paged"` attribute is set on ipynb-viewer block
- Check notebook has multiple cells (paged mode needs >1 cell)
- Verify ipynb-viewer block JavaScript is loading

## Related Documentation

- **Educational Notebooks:** `docs/for-ai/explaining-educational-notebooks.md` - Interactive, executable notebooks
- **Jupyter Testing:** `docs/for-ai/explaining-jupyter.md` - Testing EDS blocks with Jupyter
- **ipynb-viewer Block:** `blocks/ipynb-viewer/README.md` - Displaying notebooks on web pages
- **EDS Block Development:** `docs/for-ai/core/block-decoration.md` - How blocks work
- **Create Presentation Skill:** `.claude/skills/create-presentation/SKILL.md` - Skill documentation

## Related Skills

- **create-presentation** - Create or update presentation notebooks
- **jupyter-educational-notebook** - Create interactive educational content
- **frontend-dev-guidelines** - Styling and design best practices
- **eds-block-development** - Understanding block architecture

## Related Commands

- `/create-notebook` - Creates educational (interactive) notebooks
- `/create-presentation` - Creates presentation (non-interactive) notebooks (planned)

---

**Quick Tips:**

1. **Start with hero header** - Make first impressions count
2. **One topic per cell** - Keep focus clear
3. **Use blocks wisely** - 1-3 per cell maximum
4. **Test in paged mode** - Best presentation experience
5. **Consistent styling** - Use design system throughout
6. **Accessible navigation** - Hash links and hover effects
7. **Mobile-friendly** - Test responsive design

**Remember:** Presentation notebooks are about **viewing**, not **executing**. Beautiful visuals + embedded interactivity = compelling presentations.
