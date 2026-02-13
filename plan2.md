---
title: "EDS Block Library Integration for SaaS Enhancement"
description: "Plan for leveraging the EDS block library as standalone web components in the SaaS platform"
author: Tom Cranstoun
created: 2024-12-01
modified: 2026-02-09
version: "1.0"
status: active
---

# Section 19: EDS Block Library Integration for SaaS Enhancement

## 19.1 Executive Summary

### Overview

The Bright Sparks Management System will leverage the existing Adobe Edge Delivery Services (EDS) block library as standalone web components to enhance contractor websites. This integration enables:

- **Universal Block Compatibility**: All current and future EDS blocks work WITHOUT modification in both EDS and SaaS contexts
- **Zero-Code Integration**: Contractors create rich, interactive web pages using markdown syntax
- **AI-Assisted Adaptation**: AI assistants automatically adapt blocks to the SaaS environment following defined patterns
- **Dual-Environment Architecture**: Single block codebase serves both EDS websites and contractor SaaS pages

### Key Benefits

**For Contractors:**

- Professional web components without custom development
- Familiar markdown-based content creation (hybrid GUI + direct editing)
- Rich interactive features (accordions, tabs, cards, modals, galleries)
- Consistent design system across all pages
- Mobile-responsive by default

**For DDT (Development Team):**

- Leverage 48+ pre-built, tested blocks from allaboutV2 codebase
- No ongoing block maintenance (EDS team maintains upstream)
- AI assistants handle block adaptation automatically
- Minimal infrastructure: ~200 lines of shim code + Cloudflare Workers
- Future blocks automatically compatible via defined patterns

**For System:**

- Server-side rendering via Cloudflare Workers (fast first paint)
- Cloudflare Image Resizing (automatic optimization)
- Both subdomain and custom domain support
- Tenant-specific branding (logos, colors, staff names)
- Cost-effective infrastructure (no EDS licensing)

### Architecture Principles

1. **Block Independence**: Blocks are self-contained (JS + CSS + README), no platform coupling
2. **Universal Patterns**: All blocks follow CONFIG object + decorate() function pattern
3. **Minimal Shim**: ~200 lines of code provide EDS-compatible functions for SaaS
4. **AI Enforcement**: Clear rules enable AI assistants to adapt any block automatically
5. **Configuration Override**: Tenant config.json customizes blocks without code changes

---

## 19.2 Block Compatibility Architecture

### What Makes EDS Blocks Universal

EDS blocks are inherently portable because they follow strict architectural patterns:

**Pattern 1: Self-Contained Components**

```
/blocks/cards/
├── cards.js           ← Pure JavaScript, framework-free
├── cards.css          ← Scoped styles, no external dependencies
├── README.md          ← Usage documentation
└── example.md         ← Example markdown content
```

**Pattern 2: Standard Decoration Function**

```javascript
// Every block exports default decorate function
export default async function decorate(block) {
  // Receives: <div class="cards block" data-block-name="cards">
  // Transforms: DOM structure to final component
  // Returns: void (transforms in-place)
}
```

**Pattern 3: Configuration at Top**

```javascript
const CARDS_CONFIG = {
  ERROR_MESSAGE: 'Failed to load cards',
  DEFAULT_LAYOUT: 'grid',
  CARD_CLASSES: ['card', 'card-image', 'card-body'],
};

export default async function decorate(block) {
  // Use CARDS_CONFIG throughout
}
```

**Pattern 4: Variation Support**

```javascript
export default async function decorate(block) {
  // Detect variations via CSS classes
  const isDark = block.classList.contains('dark');
  const isWide = block.classList.contains('wide');

  // Apply variation-specific logic
  if (isDark) block.style.setProperty('--bg-color', '#000');
}
```

### Block Dependency Levels

**Tier 1: Zero Dependencies (15 blocks)**

These blocks require NO adaptation - copy and use directly:

- `accordion` - Collapsible content sections
- `cards` - Grid of content cards
- `tabs` - Tabbed content panels
- `columns` - Multi-column layouts
- `table` - Enhanced data tables
- `hero` - Hero banner sections
- `text` - Rich text content
- `quote` - Styled quotations
- `counter` - Animated number counters
- `centreblock` - Centered content container
- `helloworld` - Simple demo block
- `returntotop` - Back to top button
- `floating-alert` - Floating notification
- `remove-icon-styles` - Icon style reset
- `raw` - Unstyled content passthrough

**Implementation:** Direct copy to SaaS `/blocks/` directory. No changes required.

**Tier 2: Minimal Dependencies (20 blocks)**

These blocks import 1-3 EDS functions, easily shimmed:

**Common Dependencies:**

- `createOptimizedPicture()` - Responsive image generation (8 blocks use this)
- `getMetadata()` - Read page metadata (5 blocks use this)
- `toClassName()` - String to kebab-case conversion (3 blocks use this)

**Blocks in this tier:**

- `blogroll` - Blog post listings
- `embed` - Video/iframe embeds
- `footer` - Site footer
- `header` - Site header/navigation
- `index` - Auto-generated page index
- `modal` - Modal dialogs
- `overlay` - Overlay panels
- `search` - Content search
- `video` - Enhanced video player
- `grid` - Masonry grid layout
- `fragment` - Content fragments
- `showcaser` - Code snippet showcase
- `bio` - Author bio cards
- `comment` - Comment sections
- `dashboard` - Analytics dashboard
- `dynamic` - Dynamic content loader
- `tags` - Tag filtering
- `view-myblog` - Blog viewer
- `inline-svg` - SVG icon loader
- `markdown` - Markdown renderer

**Implementation:** Replace EDS imports with shim library imports. AI assistant handles automatically.

**Tier 3: Complex Integration (13 blocks)**

These blocks require more substantial adaptation:

**External Library Dependencies:**

- `shoelace-card` - Uses Shoelace web components
- `shoelace` - Shoelace component library
- `spectrum-card` - Adobe Spectrum components
- `react-slide-builder` - React-based slide builder
- `vue-slide-builder` - Vue-based slide builder

**Complex Logic Dependencies:**

- `ipynb-viewer` - Jupyter notebook renderer (custom markdown parsing + overlays)
- `code-expander` - Expandable code blocks with syntax highlighting
- `slide-builder` - Presentation slide builder
- `3dcube` - 3D CSS animations
- `dam` - Digital asset management integration
- `dfs` - Document file system integration
- `dps` - Document processing service
- `fortunecookie` - Random content generator with API calls

**Implementation:** Requires case-by-case evaluation. May need alternative libraries or custom SaaS implementations.

### Block Anatomy

Every EDS block follows this structure:

**JavaScript File (`{blockname}.js`):**

```javascript
// 1. Configuration Object (top of file)
const BLOCKNAME_CONFIG = {
  // All constants, error messages, thresholds
  ERROR_MESSAGE: 'Failed to load content',
  API_ENDPOINT: '/api/data.json',
  ANIMATION_DURATION: 300,
};

// 2. Main Decoration Function (required export)
export default async function decorate(block) {
  // Transform block DOM
  const rows = block.children;
  // ... implementation
}

// 3. Sub-component Builders (optional)
function createCard(data) {
  const card = document.createElement('div');
  // ... create component
  return card;
}

// 4. Helper Functions (optional)
function formatDate(dateString) {
  // ... utility logic
  return formatted;
}
```

**CSS File (`{blockname}.css`):**

```css
/* 1. Block-level CSS variables */
.blockname {
  --block-spacing: 1rem;
  --block-color: var(--color-primary, #000);
  --block-radius: 0.5rem;
}

/* 2. Base block styles */
.blockname-content {
  padding: var(--block-spacing);
  color: var(--block-color);
  border-radius: var(--block-radius);
}

/* 3. Variation styles */
.blockname.dark {
  --block-color: #fff;
  background-color: #000;
}

/* 4. Responsive adjustments */
@media (min-width: 768px) {
  .blockname {
    --block-spacing: 2rem;
  }
}
```

**README.md Documentation:**

- Block purpose and features
- Usage examples (markdown syntax)
- Configuration options
- Variation descriptions
- Browser compatibility
- Dependencies and requirements

---

## 19.3 AI Assistant Enforcement Rules

### Overview

AI assistants (Claude, Cursor, GitHub Copilot, etc.) automatically adapt EDS blocks to SaaS environment by following these rules. This enables **any current or future block** to work without manual integration.

### Rule 1: Dependency Detection Pattern

**Purpose:** Automatically identify which EDS functions a block requires.

**Implementation:**

```javascript
// AI Assistant scans block JS file for imports
import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';

// Detection algorithm:
const imports = extractImports(blockJsFile);
const edsImports = imports.filter(imp => imp.from.includes('aem.js'));
const requiredShimFunctions = edsImports.flatMap(imp => imp.names);

// Result: ['createOptimizedPicture', 'getMetadata']
```

**AI Assistant Checklist:**

1. ✅ Read block JavaScript file
2. ✅ Extract all `import` statements
3. ✅ Filter imports from `../../scripts/aem.js` or `lib-franklin.js`
4. ✅ List imported function names
5. ✅ Verify shim library provides these functions
6. ✅ Report if shim function missing (block requires Tier 3 integration)

**Example Output:**

```
Block: cards
Dependencies Detected: createOptimizedPicture
Shim Required: ✅ Available in eds-shim.js
Tier: 2 (Minimal Dependencies)
Adaptation: Replace import path
```

### Rule 2: Import Replacement Strategy

**Purpose:** Replace EDS core imports with SaaS shim library imports.

**Original Block Code:**

```javascript
// cards.js (from EDS)
import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const img = block.querySelector('img');
  const picture = createOptimizedPicture(img.src, img.alt);
  img.closest('picture').replaceWith(picture);
}
```

**AI Assistant Transformation:**

```javascript
// cards.js (adapted for SaaS)
import { createOptimizedPicture } from '/lib/eds-shim.js';

export default async function decorate(block) {
  const img = block.querySelector('img');
  const picture = createOptimizedPicture(img.src, img.alt);
  img.closest('picture').replaceWith(picture);
}
```

**AI Assistant Algorithm:**

```python
def adapt_block_imports(block_js_path):
    content = read_file(block_js_path)

    # Pattern 1: Replace relative EDS imports
    content = content.replace(
        "from '../../scripts/aem.js'",
        "from '/lib/eds-shim.js'"
    )

    # Pattern 2: Replace lib-franklin imports (legacy)
    content = content.replace(
        "from '../../scripts/lib-franklin.js'",
        "from '/lib/eds-shim.js'"
    )

    # Pattern 3: Preserve all other imports unchanged
    # (external libraries, relative paths to sub-components)

    return content
```

**AI Assistant Checklist:**

1. ✅ Identify all EDS core imports (aem.js, lib-franklin.js)
2. ✅ Replace import path with `/lib/eds-shim.js`
3. ✅ Preserve imported function names (no renaming)
4. ✅ Leave non-EDS imports unchanged
5. ✅ Verify import statement syntax remains valid
6. ✅ Test adapted block in SaaS context

### Rule 3: Configuration Extraction

**Purpose:** Extract block configuration for tenant customization.

**Block Configuration Pattern:**

```javascript
// Every block has CONFIG object at top
const CARDS_CONFIG = {
  // Error messages (tenant can translate)
  ERROR_MESSAGE: 'Failed to load cards',
  LOADING_MESSAGE: 'Loading cards...',

  // UI text (tenant can customize)
  BUTTON_LABEL: 'View More',
  EMPTY_STATE_MESSAGE: 'No cards to display',

  // Thresholds and limits (tenant can adjust)
  CARDS_PER_PAGE: 12,
  ANIMATION_DURATION: 300,

  // Paths (tenant can override)
  DEFAULT_IMAGE: '/assets/card-placeholder.jpg',
  ICON_PATH: '/icons/',

  // Feature flags (tenant can enable/disable)
  ENABLE_LAZY_LOAD: true,
  ENABLE_ANIMATIONS: true,
};
```

**AI Assistant Extraction:**

```javascript
// Extract configuration to tenant config schema
function extractBlockConfig(blockJsContent) {
  const configRegex = /const (\w+)_CONFIG = \{([\s\S]*?)\};/;
  const match = blockJsContent.match(configRegex);

  if (!match) return null;

  const blockName = match[1].toLowerCase();
  const configContent = match[2];

  return {
    blockName,
    configurableFields: parseConfigFields(configContent),
    tenantOverrides: generateTenantSchema(configContent),
  };
}
```

**Generated Tenant Config Schema:**

```json
{
  "blocks": {
    "cards": {
      "errorMessage": "Failed to load cards",
      "loadingMessage": "Loading cards...",
      "buttonLabel": "View More",
      "emptyStateMessage": "No cards to display",
      "cardsPerPage": 12,
      "animationDuration": 300,
      "defaultImage": "/assets/card-placeholder.jpg",
      "iconPath": "/icons/",
      "enableLazyLoad": true,
      "enableAnimations": true
    }
  }
}
```

**AI Assistant Checklist:**

1. ✅ Locate CONFIG object in block JavaScript (top of file)
2. ✅ Extract all key-value pairs
3. ✅ Categorize by type (messages, UI text, thresholds, paths, flags)
4. ✅ Generate tenant config schema (JSON)
5. ✅ Document which fields are customizable
6. ✅ Provide default values
7. ✅ Test config override mechanism

### Rule 4: Testing & Validation

**Purpose:** Ensure adapted block works correctly in SaaS environment.

**AI Assistant Testing Protocol:**

```javascript
// 1. Structural Test: Block loads and renders
async function testBlockStructure(blockName) {
  const block = document.createElement('div');
  block.className = `${blockName} block`;
  block.dataset.blockName = blockName;

  // Add sample content (from example.md)
  block.innerHTML = getExampleContent(blockName);

  // Load and execute block
  await loadBlock(block);

  // Verify:
  assert(block.children.length > 0, 'Block has content');
  assert(!block.querySelector('.error'), 'No error state');
  assert(block.dataset.blockStatus === 'loaded', 'Block loaded');
}

// 2. Dependency Test: Shim functions work
async function testBlockDependencies(blockName) {
  const dependencies = detectDependencies(blockName);

  for (const funcName of dependencies) {
    // Verify shim provides function
    const shimFunc = shimLibrary[funcName];
    assert(typeof shimFunc === 'function', `${funcName} exists in shim`);

    // Test function execution
    const result = await shimFunc(...getTestArgs(funcName));
    assert(result !== undefined, `${funcName} returns value`);
  }
}

// 3. Configuration Test: Tenant overrides work
async function testBlockConfiguration(blockName, tenantConfig) {
  const block = createBlock(blockName);

  // Apply tenant config
  applyTenantConfig(block, tenantConfig);

  // Verify config applied
  const actualConfig = getBlockConfig(block);
  for (const [key, value] of Object.entries(tenantConfig)) {
    assert(actualConfig[key] === value, `Config ${key} overridden`);
  }
}

// 4. Variation Test: All variations render correctly
async function testBlockVariations(blockName) {
  const variations = getBlockVariations(blockName); // from README.md

  for (const variation of variations) {
    const block = createBlock(blockName);
    block.classList.add(...variation.classes);

    await loadBlock(block);

    // Verify variation-specific styling applied
    const styles = window.getComputedStyle(block);
    assert(styles.length > 0, `${variation.name} has styles`);
  }
}
```

**AI Assistant Test Report:**

```markdown
## Block Adaptation Test Report: cards

### ✅ Structural Test
- Block renders with sample content
- No errors in console
- Block status: loaded

### ✅ Dependency Test
- createOptimizedPicture: ✅ Available in shim, returns <picture> element
- All dependencies satisfied

### ✅ Configuration Test
- Tenant override: buttonLabel = "Read More" ✅ Applied
- Tenant override: cardsPerPage = 6 ✅ Applied
- Config injection successful

### ✅ Variation Test
- Base: ✅ Renders correctly
- Dark: ✅ Dark styles applied
- Wide: ✅ Width increased
- Dark + Wide: ✅ Both variations combined

### 🎯 Result: PASS
Block is ready for production use in SaaS environment.
```

**AI Assistant Checklist:**

1. ✅ Run structural test (block renders)
2. ✅ Run dependency test (shim functions work)
3. ✅ Run configuration test (tenant overrides apply)
4. ✅ Run variation test (all variations render)
5. ✅ Test in multiple viewports (mobile, tablet, desktop)
6. ✅ Test with real contractor content
7. ✅ Verify accessibility (WCAG 2.1 AA)
8. ✅ Performance test (Lighthouse score)
9. ✅ Generate test report
10. ✅ Document any limitations or edge cases

### Rule 5: Documentation Requirements

**Purpose:** Ensure contractors know how to use adapted blocks.

**AI Assistant Documentation Template:**

```markdown
# {Block Name} - Contractor Documentation

## Overview
{Brief description of what the block does}

## Usage in Markdown

### Basic Example
\`\`\`markdown
| {Block Name} |
|--------------|
| Your content here |
| More content |
\`\`\`

### With Variations
\`\`\`markdown
| {Block Name} (dark, wide) |
|---------------------------|
| Content with dark theme and wide layout |
\`\`\`

## Configuration Options

Customize this block in your `config.json`:

\`\`\`json
{
  "blocks": {
    "{blockname}": {
      "optionName": "value",
      "anotherOption": true
    }
  }
}
\`\`\`

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| {option} | {type} | {default} | {description} |

## Variations

| Variation | Description | Example |
|-----------|-------------|---------|
| {variation} | {description} | `| {Block Name} ({variation}) |` |

## Examples

### {Use Case 1}
{Description and markdown example}

### {Use Case 2}
{Description and markdown example}

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Limitations
{Any known limitations or edge cases}

## Related Blocks
- {Related block 1}
- {Related block 2}
```

**AI Assistant Checklist:**

1. ✅ Generate documentation from README.md
2. ✅ Adapt EDS-specific syntax to SaaS context
3. ✅ Include all variations
4. ✅ Document configuration options
5. ✅ Provide practical examples
6. ✅ Note any limitations
7. ✅ Add screenshots (if available)
8. ✅ Include troubleshooting section
9. ✅ Link to related blocks
10. ✅ Keep documentation under 500 lines (contractor-friendly length)

---

## 19.4 Core Infrastructure Components

### Minimal EDS Shim Library

**Purpose:** Provide EDS-compatible functions in SaaS environment.

**File:** `/lib/eds-shim.js` (~200 lines)

```javascript
/**
 * EDS Shim Library for SaaS Environment
 *
 * Provides EDS-compatible functions for blocks that depend on EDS core.
 * Implements Cloudflare-optimized versions of common EDS utilities.
 */

// ============================================================================
// IMAGE OPTIMIZATION (via Cloudflare Image Resizing)
// ============================================================================

/**
 * Create optimized picture element using Cloudflare Image Resizing
 *
 * EDS version: Generates <picture> with multiple srcsets and webp/fallback
 * SaaS version: Simplified using Cloudflare Image Resizing API
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {boolean} eager - Load eagerly (default: lazy)
 * @returns {HTMLPictureElement}
 */
export function createOptimizedPicture(src, alt = '', eager = false) {
  const picture = document.createElement('picture');

  // Cloudflare Image Resizing URL format:
  // /cdn-cgi/image/{options}/{src}

  // Desktop: 1200px width
  const desktopSrc = `/cdn-cgi/image/width=1200,quality=85,format=auto/${src}`;
  const desktopSource = document.createElement('source');
  desktopSource.media = '(min-width: 768px)';
  desktopSource.srcset = desktopSrc;

  // Mobile: 600px width
  const mobileSrc = `/cdn-cgi/image/width=600,quality=85,format=auto/${src}`;
  const mobileSource = document.createElement('source');
  mobileSource.srcset = mobileSrc;

  // Fallback img
  const img = document.createElement('img');
  img.src = mobileSrc;
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';

  picture.appendChild(desktopSource);
  picture.appendChild(mobileSource);
  picture.appendChild(img);

  return picture;
}

// ============================================================================
// METADATA READING (from page <head>)
// ============================================================================

/**
 * Get metadata value from page <head>
 *
 * Reads from:
 * 1. <meta name="{name}" content="{value}">
 * 2. <meta property="og:{name}" content="{value}">
 * 3. Tenant config.json defaults
 *
 * @param {string} name - Metadata field name
 * @returns {string} Metadata value or empty string
 */
export function getMetadata(name) {
  // Try standard meta tag
  const metaTag = document.head.querySelector(`meta[name="${name}"]`);
  if (metaTag) return metaTag.content;

  // Try Open Graph property
  const ogTag = document.head.querySelector(`meta[property="og:${name}"]`);
  if (ogTag) return ogTag.content;

  // Try tenant config defaults
  const tenantConfig = window.TENANT_CONFIG || {};
  if (tenantConfig.metadata && tenantConfig.metadata[name]) {
    return tenantConfig.metadata[name];
  }

  return '';
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Convert string to kebab-case class name
 *
 * Examples:
 * - "Block Name" → "block-name"
 * - "Multi Word Example" → "multi-word-example"
 * - "already-kebab" → "already-kebab"
 *
 * @param {string} str - Input string
 * @returns {string} Kebab-case string
 */
export function toClassName(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert string to camelCase
 *
 * Examples:
 * - "block-name" → "blockName"
 * - "multi word example" → "multiWordExample"
 *
 * @param {string} str - Input string
 * @returns {string} camelCase string
 */
export function toCamelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''));
}

// ============================================================================
// BLOCK CONFIGURATION PARSING
// ============================================================================

/**
 * Parse block configuration from metadata table
 *
 * EDS blocks often have metadata tables like:
 * | config | |
 * |--------|--|
 * | key1   | value1 |
 * | key2   | value2 |
 *
 * @param {HTMLElement} block - Block element
 * @returns {Object} Configuration object
 */
export function readBlockConfig(block) {
  const config = {};

  // Find metadata table (usually first or last child)
  const metadataTable = Array.from(block.children).find(child => {
    const firstCell = child.querySelector('div');
    return firstCell && firstCell.textContent.trim().toLowerCase() === 'config';
  });

  if (!metadataTable) return config;

  // Parse key-value pairs from remaining rows
  Array.from(metadataTable.children).slice(1).forEach(row => {
    const cells = Array.from(row.children);
    if (cells.length >= 2) {
      const key = toCamelCase(cells[0].textContent.trim());
      const value = cells[1].textContent.trim();
      config[key] = value;
    }
  });

  return config;
}

// ============================================================================
// DYNAMIC LOADING
// ============================================================================

/**
 * Load CSS file dynamically
 *
 * @param {string} href - CSS file URL
 * @returns {Promise<void>}
 */
export function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (document.head.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * Load JavaScript file dynamically
 *
 * @param {string} src - JavaScript file URL
 * @param {Object} options - Script options (type, async, defer)
 * @returns {Promise<void>}
 */
export function loadScript(src, options = {}) {
  return new Promise((resolve, reject) => {
    if (document.head.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    Object.assign(script, options);
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ============================================================================
// ICON DECORATION (optional, for blocks that use icon paths)
// ============================================================================

/**
 * Decorate icon elements
 *
 * Converts <span class="icon icon-name"></span> to <img> with icon path
 *
 * @param {HTMLElement} element - Element to search for icons
 */
export function decorateIcons(element = document) {
  const iconPath = window.TENANT_CONFIG?.iconPath || '/icons/';

  element.querySelectorAll('.icon').forEach(icon => {
    const iconName = Array.from(icon.classList)
      .find(cls => cls.startsWith('icon-'))
      ?.replace('icon-', '');

    if (iconName) {
      const img = document.createElement('img');
      img.src = `${iconPath}${iconName}.svg`;
      img.alt = iconName;
      img.className = 'icon-img';
      icon.replaceWith(img);
    }
  });
}

// ============================================================================
// BUTTON DECORATION (optional, for auto-styling links as buttons)
// ============================================================================

/**
 * Decorate buttons
 *
 * Converts links in <p><strong><a> or <p><em><a> to styled buttons
 *
 * @param {HTMLElement} element - Element to search for buttons
 */
export function decorateButtons(element = document) {
  element.querySelectorAll('a').forEach(link => {
    const parent = link.parentElement;
    const grandparent = parent?.parentElement;

    // Check if link is in <p><strong><a> or <p><em><a>
    if (grandparent?.tagName === 'P') {
      if (parent.tagName === 'STRONG') {
        link.classList.add('button', 'button-primary');
      } else if (parent.tagName === 'EM') {
        link.classList.add('button', 'button-secondary');
      }
    }
  });
}

// ============================================================================
// BLOCK LOADING ORCHESTRATION
// ============================================================================

/**
 * Load and execute block
 *
 * 1. Load block CSS
 * 2. Import block JavaScript module
 * 3. Call default export (decorate function)
 * 4. Update block status
 *
 * @param {HTMLElement} block - Block element
 * @returns {Promise<void>}
 */
export async function loadBlock(block) {
  const blockName = block.dataset.blockName;
  if (!blockName) return;

  block.dataset.blockStatus = 'loading';

  try {
    // Load CSS
    await loadCSS(`/blocks/${blockName}/${blockName}.css`);

    // Load JavaScript module
    const module = await import(`/blocks/${blockName}/${blockName}.js`);

    // Call decorate function
    if (module.default) {
      await module.default(block);
    }

    block.dataset.blockStatus = 'loaded';
  } catch (error) {
    console.error(`Failed to load block: ${blockName}`, error);
    block.dataset.blockStatus = 'error';
  }
}

/**
 * Decorate all blocks on page
 *
 * Finds all elements with class "block" and loads them
 *
 * @param {HTMLElement} main - Main content element
 * @returns {Promise<void>}
 */
export async function decorateBlocks(main = document.querySelector('main')) {
  if (!main) return;

  const blocks = Array.from(main.querySelectorAll('.block'));

  // Load blocks in parallel
  await Promise.all(blocks.map(block => loadBlock(block)));
}
```

### Markdown Processor with Dual Metadata Support

**Purpose:** Transform markdown to HTML with YAML + EDS table metadata.

**File:** `/lib/markdown-processor.js` (~300 lines)

```javascript
/**
 * Markdown Processor for SaaS Environment
 *
 * Supports:
 * - YAML frontmatter (default metadata)
 * - EDS table metadata (additional/override)
 * - Markdown to HTML conversion
 * - Block table transformation
 */

import { marked } from 'marked'; // Standard markdown parser
import yaml from 'js-yaml'; // YAML parser

// ============================================================================
// METADATA EXTRACTION
// ============================================================================

/**
 * Extract and merge metadata from markdown
 *
 * Priority (highest to lowest):
 * 1. YAML frontmatter
 * 2. EDS metadata table
 * 3. Tenant config.json defaults
 *
 * @param {string} markdown - Raw markdown content
 * @param {Object} tenantDefaults - Tenant config defaults
 * @returns {Object} { metadata, content }
 */
export function extractMetadata(markdown, tenantDefaults = {}) {
  let content = markdown;
  let yamlMetadata = {};
  let tableMetadata = {};

  // 1. Extract YAML frontmatter
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (yamlMatch) {
    try {
      yamlMetadata = yaml.load(yamlMatch[1]);
      content = content.slice(yamlMatch[0].length);
    } catch (error) {
      console.error('Failed to parse YAML frontmatter:', error);
    }
  }

  // 2. Extract EDS metadata table
  const metadataTableMatch = content.match(
    /\| metadata \|[\s\S]*?\n((?:\|[^\n]+\n)+)/
  );
  if (metadataTableMatch) {
    tableMetadata = parseMetadataTable(metadataTableMatch[0]);
    // Remove metadata table from content
    content = content.replace(metadataTableMatch[0], '');
  }

  // 3. Merge metadata (YAML overrides table overrides defaults)
  const metadata = {
    ...tenantDefaults,
    ...tableMetadata,
    ...yamlMetadata,
  };

  return { metadata, content: content.trim() };
}

/**
 * Parse EDS metadata table to object
 *
 * Format:
 * | metadata | |
 * |----------|--|
 * | key1     | value1 |
 * | key2     | value2 |
 *
 * @param {string} tableMarkdown - Metadata table markdown
 * @returns {Object} Parsed metadata
 */
function parseMetadataTable(tableMarkdown) {
  const metadata = {};
  const lines = tableMarkdown.split('\n').filter(line => line.trim());

  // Skip header rows (first 2 lines)
  lines.slice(2).forEach(line => {
    const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
    if (cells.length >= 2) {
      const key = cells[0];
      const value = cells[1];
      metadata[key] = value;
    }
  });

  return metadata;
}

// ============================================================================
// BLOCK TABLE TRANSFORMATION
// ============================================================================

/**
 * Transform markdown tables to block HTML
 *
 * Markdown:
 * | Hero (dark) |
 * |-------------|
 * | Content 1   |
 * | Content 2   |
 *
 * HTML:
 * <div class="hero dark block" data-block-name="hero">
 *   <div><div>Content 1</div></div>
 *   <div><div>Content 2</div></div>
 * </div>
 *
 * @param {string} markdown - Markdown content
 * @returns {string} Transformed markdown
 */
export function transformBlockTables(markdown) {
  // Regex to match tables
  const tableRegex = /\|([^\n]+)\|\n\|[-\s|]+\|\n((?:\|[^\n]+\|\n?)+)/g;

  return markdown.replace(tableRegex, (match, headerRow, bodyRows) => {
    // Parse header to detect block name and variations
    const headerCells = headerRow.split('|').map(c => c.trim()).filter(Boolean);
    const firstCell = headerCells[0];

    // Check if this is a block table (first cell is block name)
    const blockMatch = firstCell.match(/^([A-Z][a-zA-Z0-9-]*)\s*(?:\(([^)]+)\))?$/);
    if (!blockMatch) {
      // Not a block table, return unchanged
      return match;
    }

    const blockName = toKebabCase(blockMatch[1]);
    const variations = blockMatch[2]
      ? blockMatch[2].split(',').map(v => v.trim())
      : [];

    // Build block HTML
    const classes = [blockName, ...variations, 'block'].join(' ');
    let blockHtml = `<div class="${classes}" data-block-name="${blockName}">\n`;

    // Parse body rows
    const rows = bodyRows.split('\n').filter(line => line.trim());
    rows.forEach(row => {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean);
      blockHtml += '  <div>\n';
      cells.forEach(cell => {
        blockHtml += `    <div>${cell}</div>\n`;
      });
      blockHtml += '  </div>\n';
    });

    blockHtml += '</div>';

    return blockHtml;
  });
}

/**
 * Convert string to kebab-case
 *
 * @param {string} str - Input string
 * @returns {string} Kebab-case string
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================================
// MARKDOWN TO HTML CONVERSION
// ============================================================================

/**
 * Convert markdown to HTML
 *
 * Includes:
 * - Block table transformation
 * - Standard markdown parsing
 * - Section wrapping (--- becomes section breaks)
 *
 * @param {string} markdown - Markdown content
 * @param {Object} options - Conversion options
 * @returns {string} HTML output
 */
export function markdownToHtml(markdown, options = {}) {
  let content = markdown;

  // 1. Transform block tables to HTML
  content = transformBlockTables(content);

  // 2. Split by section breaks (---)
  const sections = content.split(/^---$/m);

  // 3. Convert each section to HTML
  const htmlSections = sections.map(section => {
    const html = marked(section.trim());
    return `<div class="section">\n  <div class="default-content-wrapper">\n${html}\n  </div>\n</div>`;
  });

  return htmlSections.join('\n');
}

// ============================================================================
// COMPLETE PROCESSOR
// ============================================================================

/**
 * Process markdown file completely
 *
 * @param {string} markdown - Raw markdown content
 * @param {Object} tenantConfig - Tenant configuration
 * @returns {Object} { metadata, html }
 */
export function processMarkdown(markdown, tenantConfig = {}) {
  // Extract metadata
  const { metadata, content } = extractMetadata(
    markdown,
    tenantConfig.metadata || {}
  );

  // Convert to HTML
  const html = markdownToHtml(content);

  return { metadata, html };
}
```

### Block Loader & Registry

**Purpose:** Manage block loading and lifecycle.

**File:** `/lib/block-loader.js` (~150 lines)

```javascript
/**
 * Block Loader & Registry
 *
 * Manages block loading, caching, and lifecycle.
 */

// Block registry (caches loaded modules)
const blockRegistry = new Map();

// Block status tracking
const blockStatus = new Map();

/**
 * Register block module
 *
 * @param {string} blockName - Block name
 * @param {Object} module - Block module (default export = decorate function)
 */
export function registerBlock(blockName, module) {
  blockRegistry.set(blockName, module);
}

/**
 * Get registered block module
 *
 * @param {string} blockName - Block name
 * @returns {Object|null} Block module or null
 */
export function getBlock(blockName) {
  return blockRegistry.get(blockName) || null;
}

/**
 * Load block CSS
 *
 * @param {string} blockName - Block name
 * @returns {Promise<void>}
 */
async function loadBlockCSS(blockName) {
  const href = `/blocks/${blockName}/${blockName}.css`;

  // Check if already loaded
  if (document.head.querySelector(`link[href="${href}"]`)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * Load block JavaScript module
 *
 * @param {string} blockName - Block name
 * @returns {Promise<Object>} Block module
 */
async function loadBlockJS(blockName) {
  // Check cache first
  if (blockRegistry.has(blockName)) {
    return blockRegistry.get(blockName);
  }

  const modulePath = `/blocks/${blockName}/${blockName}.js`;
  const module = await import(modulePath);

  // Cache module
  blockRegistry.set(blockName, module);

  return module;
}

/**
 * Decorate block element
 *
 * @param {HTMLElement} block - Block element
 * @returns {Promise<void>}
 */
export async function decorateBlock(block) {
  const blockName = block.dataset.blockName || block.className.split(' ')[0];

  if (!blockName) {
    console.error('Block has no name:', block);
    return;
  }

  // Set dataset
  block.dataset.blockName = blockName;
  block.dataset.blockStatus = 'loading';

  try {
    // Load CSS and JS in parallel
    const [, module] = await Promise.all([
      loadBlockCSS(blockName),
      loadBlockJS(blockName),
    ]);

    // Call decorate function
    if (module.default && typeof module.default === 'function') {
      await module.default(block);
    } else {
      console.warn(`Block ${blockName} has no default export`);
    }

    block.dataset.blockStatus = 'loaded';
  } catch (error) {
    console.error(`Failed to load block ${blockName}:`, error);
    block.dataset.blockStatus = 'error';

    // Show error state
    block.innerHTML = `
      <div class="block-error">
        <p>Failed to load ${blockName} block</p>
      </div>
    `;
  }
}

/**
 * Decorate all blocks in element
 *
 * @param {HTMLElement} element - Container element (default: main)
 * @returns {Promise<void>}
 */
export async function decorateBlocks(element = document.querySelector('main')) {
  if (!element) return;

  const blocks = Array.from(element.querySelectorAll('.block'));

  // Decorate all blocks in parallel
  await Promise.all(blocks.map(block => decorateBlock(block)));
}

/**
 * Observe and decorate dynamically added blocks
 *
 * @param {HTMLElement} element - Container to observe
 */
export function observeBlocks(element = document.body) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('block')) {
            decorateBlock(node);
          } else {
            // Check children for blocks
            const blocks = node.querySelectorAll('.block');
            blocks.forEach(block => decorateBlock(block));
          }
        }
      });
    });
  });

  observer.observe(element, {
    childList: true,
    subtree: true,
  });

  return observer;
}
```

### Cloudflare Workers Reverse Proxy Architecture

**Purpose:** Server-side markdown processing and HTML generation.

**File:** `cloudflare-workers/page-renderer.js` (~400 lines)

```javascript
/**
 * Cloudflare Worker: Page Renderer
 *
 * Server-side markdown processing with:
 * - Dual metadata support (YAML + EDS tables)
 * - Tenant config injection
 * - Cloudflare Image Resizing integration
 * - Block CSS/JS preloading
 */

import { processMarkdown } from '../lib/markdown-processor.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // R2 bucket for markdown content
  R2_BUCKET: 'contractor-content',

  // R2 bucket for tenant configs
  CONFIG_BUCKET: 'tenant-configs',

  // Default metadata
  DEFAULT_METADATA: {
    author: 'Bright Sparks Management System',
    generator: 'BSMS',
  },

  // Image optimization defaults
  IMAGE_DEFAULTS: {
    quality: 85,
    format: 'auto', // Let Cloudflare choose (webp, avif, etc.)
  },
};

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Extract tenant from subdomain or custom domain
    const tenant = getTenantFromHost(url.hostname);

    // Load tenant config
    const tenantConfig = await loadTenantConfig(tenant, env);

    // Handle different request types
    if (url.pathname.startsWith('/blocks/')) {
      return handleBlockAsset(request, env);
    } else if (url.pathname.startsWith('/lib/')) {
      return handleLibraryAsset(request, env);
    } else {
      return handlePageRequest(request, env, tenant, tenantConfig);
    }
  },
};

// ============================================================================
// PAGE RENDERING
// ============================================================================

/**
 * Handle page request
 *
 * 1. Fetch markdown from R2
 * 2. Process markdown (metadata + HTML)
 * 3. Inject tenant config
 * 4. Generate complete HTML page
 * 5. Return response
 *
 * @param {Request} request - Request object
 * @param {Object} env - Environment bindings
 * @param {string} tenant - Tenant identifier
 * @param {Object} tenantConfig - Tenant configuration
 * @returns {Response}
 */
async function handlePageRequest(request, env, tenant, tenantConfig) {
  const url = new URL(request.url);

  // Construct R2 key
  const path = url.pathname === '/' ? '/index' : url.pathname;
  const r2Key = `${tenant}${path}.md`;

  try {
    // Fetch markdown from R2
    const markdown = await fetchMarkdown(r2Key, env);

    // Process markdown
    const { metadata, html } = processMarkdown(markdown, tenantConfig);

    // Generate complete HTML page
    const fullHtml = generateHtmlPage(html, metadata, tenantConfig);

    return new Response(fullHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 min cache
      },
    });
  } catch (error) {
    console.error('Page rendering error:', error);
    return new Response('Page not found', { status: 404 });
  }
}

/**
 * Fetch markdown from R2
 *
 * @param {string} key - R2 object key
 * @param {Object} env - Environment bindings
 * @returns {Promise<string>} Markdown content
 */
async function fetchMarkdown(key, env) {
  const object = await env[CONFIG.R2_BUCKET].get(key);

  if (!object) {
    throw new Error(`Markdown not found: ${key}`);
  }

  return await object.text();
}

/**
 * Load tenant configuration
 *
 * @param {string} tenant - Tenant identifier
 * @param {Object} env - Environment bindings
 * @returns {Promise<Object>} Tenant config
 */
async function loadTenantConfig(tenant, env) {
  const key = `${tenant}/config.json`;

  try {
    const object = await env[CONFIG.CONFIG_BUCKET].get(key);
    if (object) {
      const text = await object.text();
      return JSON.parse(text);
    }
  } catch (error) {
    console.error('Failed to load tenant config:', error);
  }

  // Return default config
  return {
    metadata: CONFIG.DEFAULT_METADATA,
    theme: {},
    blocks: {},
  };
}

/**
 * Extract tenant from hostname
 *
 * Examples:
 * - brightsparks.bsms.com → brightsparks
 * - brightsparks-york.com → brightsparks (from custom domain mapping)
 *
 * @param {string} hostname - Request hostname
 * @returns {string} Tenant identifier
 */
function getTenantFromHost(hostname) {
  // Check for subdomain pattern
  const subdomainMatch = hostname.match(/^([^.]+)\.bsms\.com$/);
  if (subdomainMatch) {
    return subdomainMatch[1];
  }

  // Check custom domain mapping (stored in KV)
  // TODO: Implement custom domain → tenant mapping lookup

  return 'default';
}

/**
 * Generate complete HTML page
 *
 * @param {string} bodyHtml - Main content HTML
 * @param {Object} metadata - Page metadata
 * @param {Object} tenantConfig - Tenant configuration
 * @returns {string} Complete HTML document
 */
function generateHtmlPage(bodyHtml, metadata, tenantConfig) {
  const title = metadata.title || tenantConfig.metadata?.title || 'Bright Sparks';
  const description = metadata.description || tenantConfig.metadata?.description || '';
  const author = metadata.author || tenantConfig.metadata?.author || '';

  // Extract tenant theme variables
  const themeVars = generateThemeCSS(tenantConfig.theme || {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${author ? `<meta name="author" content="${escapeHtml(author)}">` : ''}

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  ${metadata['og:image'] ? `<meta property="og:image" content="${metadata['og:image']}">` : ''}

  <!-- Tenant Branding -->
  ${tenantConfig.logo ? `<link rel="icon" href="${tenantConfig.logo}">` : ''}

  <!-- Core Styles -->
  <link rel="stylesheet" href="/lib/base-styles.css">

  <!-- Theme Variables -->
  <style>${themeVars}</style>

  <!-- Tenant Config (JavaScript access) -->
  <script>
    window.TENANT_CONFIG = ${JSON.stringify(tenantConfig)};
  </script>

  <!-- Core Library -->
  <script type="module" src="/lib/eds-shim.js"></script>
  <script type="module" src="/lib/block-loader.js"></script>

  <!-- Initialize blocks on load -->
  <script type="module">
    import { decorateBlocks, observeBlocks } from '/lib/block-loader.js';

    document.addEventListener('DOMContentLoaded', async () => {
      await decorateBlocks();
      observeBlocks(); // Watch for dynamic blocks
    });
  </script>
</head>
<body>
  <main>
${bodyHtml}
  </main>

  ${tenantConfig.byline ? `<footer><p>${escapeHtml(tenantConfig.byline)}</p></footer>` : ''}
</body>
</html>`;
}

/**
 * Generate theme CSS from tenant config
 *
 * @param {Object} theme - Theme configuration
 * @returns {string} CSS variables
 */
function generateThemeCSS(theme) {
  if (!theme || Object.keys(theme).length === 0) {
    return '';
  }

  const vars = Object.entries(theme)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');

  return `:root {\n${vars}\n}`;
}

/**
 * Escape HTML entities
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(text).replace(/[&<>"']/g, char => entities[char]);
}

// ============================================================================
// ASSET HANDLING
// ============================================================================

/**
 * Handle block asset requests
 *
 * Serves block CSS/JS files from R2 or origin
 *
 * @param {Request} request - Request object
 * @param {Object} env - Environment bindings
 * @returns {Response}
 */
async function handleBlockAsset(request, env) {
  // Forward to origin (blocks are static assets)
  return fetch(request);
}

/**
 * Handle library asset requests
 *
 * Serves shim library and core scripts from R2 or origin
 *
 * @param {Request} request - Request object
 * @param {Object} env - Environment bindings
 * @returns {Response}
 */
async function handleLibraryAsset(request, env) {
  // Forward to origin (library files are static assets)
  return fetch(request);
}
```

---

## 19.5 Metadata Strategy

### YAML Frontmatter Structure

**Purpose:** Provide default metadata in contractor-friendly YAML format.

**Benefits of YAML:**

- Human-readable and writable
- Standard in static site generators (Jekyll, Hugo, Eleventy)
- Supports complex data structures
- Easy to parse and validate

**Standard YAML Frontmatter:**

```yaml
---
# Page Identity
title: Electrical Services in York
description: Professional electrical installations, repairs, and testing by NICEIC registered electricians in York and surrounding areas.
author: Frankie

# SEO & Social
tags: electrician, electrical services, York, NICEIC, rewiring, fuse box
og:image: /assets/hero-electrical.jpg
og:type: article
canonical: https://brightsparks-york.com/services/electrical

# Tenant Branding (overrides config.json)
logo: /assets/brightsparks-logo.png
byline: "Bright Sparks York - Your Local Electrical Experts"

# Page Configuration
layout: service-page
template: default
published: true
publishDate: 2024-01-15

# Staff Attribution
contactPerson: Frankie
contactEmail: frankie@brightsparks-york.com
contactPhone: 01904 123456

# Structured Data Hints
schema: LocalBusiness
businessType: Electrician
serviceArea: York, North Yorkshire
---
```

**Processing Rules:**

1. YAML must be first thing in file (before any content)
2. Delimited by `---` on separate lines
3. Invalid YAML falls back to EDS table metadata
4. All fields optional (fallback to tenant config.json)

### EDS Table Format Support

**Purpose:** Maintain compatibility with existing EDS authoring patterns.

**Standard EDS Metadata Table:**

```markdown
| metadata | |
|----------|--|
| title | Electrical Services in York |
| description | Professional electrical work |
| author | Frankie |
| og:image | /assets/hero-electrical.jpg |
| keywords | electrician, York, NICEIC |
| published | 2024-01-15 |
```

**Processing Rules:**

1. Must start with `| metadata |` in first cell
2. Subsequent rows are key-value pairs
3. Keys can include colons (e.g., `og:image`)
4. Values are plain text (no markdown)
5. Table removed from content after parsing

### Merge Algorithm (YAML Overrides Tables)

**Priority Order:**

1. **YAML frontmatter** (highest priority)
2. **EDS metadata table** (medium priority)
3. **Tenant config.json** (fallback defaults)

**Merge Example:**

**config.json (Tenant Defaults):**

```json
{
  "metadata": {
    "author": "Default Author",
    "businessType": "Contractor",
    "logo": "/assets/default-logo.png"
  }
}
```

**Markdown with Both YAML and Table:**

```markdown
---
title: Electrical Services
author: Frankie
---

# Electrical Services

| metadata | |
|----------|--|
| og:image | /assets/hero.jpg |
| keywords | electrician, York |

Content here...
```

**Merged Result:**

```json
{
  "title": "Electrical Services",          // From YAML
  "author": "Frankie",                     // From YAML (overrides tenant default)
  "og:image": "/assets/hero.jpg",          // From EDS table
  "keywords": "electrician, York",         // From EDS table
  "businessType": "Contractor",            // From tenant config (not overridden)
  "logo": "/assets/default-logo.png"       // From tenant config (not overridden)
}
```

**Implementation:**

```javascript
function mergeMetadata(tenantConfig, edsTable, yamlFrontmatter) {
  return {
    ...tenantConfig.metadata,  // Start with defaults
    ...edsTable,               // Override with table
    ...yamlFrontmatter,        // Override with YAML (highest priority)
  };
}
```

### Tenant-Specific Defaults

**Purpose:** Reduce repetition in contractor markdown files.

**Tenant config.json Structure:**

```json
{
  "tenant": "brightsparks",
  "domain": "brightsparks-york.com",

  "metadata": {
    "author": "Frankie",
    "businessType": "Electrical Contractor",
    "serviceArea": "York, North Yorkshire",
    "logo": "/assets/brightsparks-logo.png",
    "byline": "Bright Sparks York - Your Local Electrical Experts",
    "contactEmail": "info@brightsparks-york.com",
    "contactPhone": "01904 123456",
    "schema": "LocalBusiness"
  },

  "theme": {
    "color-primary": "#FF6B00",
    "color-secondary": "#FFA500",
    "color-accent": "#FFD700",
    "font-family": "Inter, sans-serif",
    "logo-url": "/assets/brightsparks-logo.png"
  },

  "staff": [
    {
      "name": "Frankie",
      "role": "Lead Electrician",
      "email": "frankie@brightsparks-york.com",
      "phone": "01904 123456",
      "photo": "/assets/staff/frankie.jpg",
      "certifications": ["NICEIC Approved", "City & Guilds 2391"]
    }
  ],

  "blocks": {
    "cards": {
      "buttonLabel": "Learn More",
      "cardsPerPage": 6
    },
    "hero": {
      "defaultImage": "/assets/hero-default.jpg",
      "height": "400px"
    }
  }
}
```

**Usage in Markdown:**

```markdown
---
title: Our Services
# No need to repeat author, logo, byline - inherited from config.json
---

# Our Services

| Cards |
|-------|
| Service 1 |
| Service 2 |
```

**Result:** All tenant defaults automatically applied.

---

## 19.6 Image Optimization via Cloudflare

### Cloudflare Image Resizing API

**Overview:** Cloudflare Image Resizing transforms images on-the-fly at the edge.

**Key Features:**

- Automatic format selection (WebP, AVIF, JPEG)
- Responsive sizing (width, height, fit modes)
- Quality control
- No external image service required
- Pay-per-request pricing

**URL Format:**

```
/cdn-cgi/image/{options}/{source-url}
```

**Common Options:**

- `width=X` - Resize to width X pixels
- `height=X` - Resize to height X pixels
- `fit=scale-down` - Never scale up, only down
- `quality=85` - JPEG/WebP quality (1-100)
- `format=auto` - Automatic format selection
- `sharpen=1` - Apply sharpening

**Example URLs:**

```
Original: /assets/hero.jpg

Desktop (1200px):
/cdn-cgi/image/width=1200,quality=85,format=auto/assets/hero.jpg

Tablet (768px):
/cdn-cgi/image/width=768,quality=85,format=auto/assets/hero.jpg

Mobile (600px):
/cdn-cgi/image/width=600,quality=85,format=auto/assets/hero.jpg

Thumbnail (300px square):
/cdn-cgi/image/width=300,height=300,fit=cover,quality=85,format=auto/assets/hero.jpg
```

### URL Transformation Pattern

**In EDS Shim Library:**

```javascript
export function createOptimizedPicture(src, alt = '', eager = false) {
  const picture = document.createElement('picture');

  // Cloudflare Image Resizing transforms
  const transforms = {
    desktop: 'width=1200,quality=85,format=auto',
    mobile: 'width=600,quality=85,format=auto',
  };

  // Desktop source
  const desktopSrc = `/cdn-cgi/image/${transforms.desktop}/${src}`;
  const desktopSource = document.createElement('source');
  desktopSource.media = '(min-width: 768px)';
  desktopSource.srcset = desktopSrc;

  // Mobile source
  const mobileSrc = `/cdn-cgi/image/${transforms.mobile}/${src}`;
  const mobileSource = document.createElement('source');
  mobileSource.srcset = mobileSrc;

  // Fallback img
  const img = document.createElement('img');
  img.src = mobileSrc;
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';

  picture.appendChild(desktopSource);
  picture.appendChild(mobileSource);
  picture.appendChild(img);

  return picture;
}
```

**Generated HTML:**

```html
<picture>
  <source
    media="(min-width: 768px)"
    srcset="/cdn-cgi/image/width=1200,quality=85,format=auto/assets/hero.jpg">
  <source
    srcset="/cdn-cgi/image/width=600,quality=85,format=auto/assets/hero.jpg">
  <img
    src="/cdn-cgi/image/width=600,quality=85,format=auto/assets/hero.jpg"
    alt="Electrical work"
    loading="lazy">
</picture>
```

### Responsive Breakpoints

**Standard Breakpoints:**

| Device | Min Width | Image Width | Use Case |
|--------|-----------|-------------|----------|
| Mobile Portrait | 0px | 600px | Phone screens |
| Mobile Landscape | 600px | 900px | Phone landscape, small tablets |
| Desktop | 900px | 1200px | Desktop, large tablets |
| Large Desktop | 1440px | 1920px | High-res displays (optional) |

**Implementation:**

```javascript
const RESPONSIVE_BREAKPOINTS = [
  { media: '(min-width: 1440px)', width: 1920 },
  { media: '(min-width: 900px)', width: 1200 },
  { media: '(min-width: 600px)', width: 900 },
  { media: null, width: 600 }, // Default (mobile)
];

export function createResponsivePicture(src, alt = '', eager = false) {
  const picture = document.createElement('picture');

  RESPONSIVE_BREAKPOINTS.forEach(({ media, width }) => {
    const url = `/cdn-cgi/image/width=${width},quality=85,format=auto/${src}`;

    if (media) {
      const source = document.createElement('source');
      source.media = media;
      source.srcset = url;
      picture.appendChild(source);
    } else {
      // Default (img tag)
      const img = document.createElement('img');
      img.src = url;
      img.alt = alt;
      img.loading = eager ? 'eager' : 'lazy';
      picture.appendChild(img);
    }
  });

  return picture;
}
```

### Cost Analysis

**Cloudflare Image Resizing Pricing (as of 2024):**

- Included: 5,000 unique transformations/month (free tier)
- Overage: $5.00 per 1,000 unique transformations
- Bandwidth: Standard Cloudflare bandwidth pricing

**Cost Estimation:**

**Scenario: Bright Sparks York (100 pages, 5 images per page)**

- Total images: 500 images
- Transformations per image: 3 (mobile, tablet, desktop)
- Unique transformations: 500 × 3 = 1,500

**Monthly Cost:** FREE (under 5,000 threshold)

**Scenario: Growing SaaS (50 tenants, 100 pages each, 5 images per page)**

- Total images: 50 × 100 × 5 = 25,000 images
- Transformations per image: 3
- Unique transformations: 75,000

**Monthly Cost:**

- First 5,000: FREE
- Remaining 70,000: 70 × $5.00 = $350.00

**Comparison to Third-Party Services:**

- **Cloudinary** (similar volume): ~$450/month
- **imgix** (similar volume): ~$500/month
- **AWS CloudFront + Lambda@Edge**: ~$400/month

**Cloudflare Advantage:** Integrated with existing infrastructure, no separate service.

---

## 19.7 Tenant Configuration System

### config.json Structure

**Purpose:** Centralized tenant customization without code changes.

**Complete config.json Schema:**

```json
{
  // ========================================
  // TENANT IDENTITY
  // ========================================
  "tenant": "brightsparks",
  "domain": "brightsparks-york.com",
  "tier": "premium",

  // ========================================
  // METADATA DEFAULTS
  // ========================================
  "metadata": {
    // Business Information
    "businessName": "Bright Sparks Electrical",
    "businessType": "Electrical Contractor",
    "author": "Frankie",
    "serviceArea": "York, North Yorkshire, UK",

    // Contact Information
    "contactEmail": "info@brightsparks-york.com",
    "contactPhone": "01904 123456",
    "contactAddress": "123 Electric Ave, York, YO1 1AA",

    // SEO Defaults
    "siteTitle": "Bright Sparks - Electrical Services York",
    "siteDescription": "NICEIC registered electricians providing professional electrical services in York and surrounding areas.",
    "keywords": "electrician, electrical services, York, NICEIC, rewiring, testing",

    // Social Media
    "twitter": "@brightsparksyk",
    "facebook": "facebook.com/brightsparksyork",
    "linkedin": "linkedin.com/company/brightsparks-york",

    // Structured Data
    "schema": "LocalBusiness",
    "priceRange": "££",
    "openingHours": "Mo-Fr 08:00-17:00",

    // Branding
    "logo": "/assets/brightsparks-logo.png",
    "favicon": "/assets/favicon.ico",
    "byline": "Bright Sparks York - Your Local Electrical Experts"
  },

  // ========================================
  // THEME VARIABLES
  // ========================================
  "theme": {
    // Brand Colors
    "color-primary": "#FF6B00",
    "color-secondary": "#FFA500",
    "color-accent": "#FFD700",
    "color-text": "#333333",
    "color-background": "#FFFFFF",
    "color-border": "#E0E0E0",

    // Typography
    "font-family": "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    "font-family-heading": "Poppins, sans-serif",
    "font-size-base": "16px",
    "font-size-h1": "3rem",
    "font-size-h2": "2.5rem",
    "font-size-h3": "2rem",

    // Spacing
    "spacing-unit": "8px",
    "spacing-small": "16px",
    "spacing-medium": "24px",
    "spacing-large": "48px",

    // Layout
    "max-width": "1200px",
    "border-radius": "8px",
    "box-shadow": "0 2px 8px rgba(0,0,0,0.1)",

    // Buttons
    "button-bg-primary": "#FF6B00",
    "button-bg-secondary": "#FFA500",
    "button-text-color": "#FFFFFF",
    "button-border-radius": "30px",

    // Branding Assets
    "logo-url": "/assets/brightsparks-logo.png",
    "logo-height": "60px",
    "favicon-url": "/assets/favicon.ico"
  },

  // ========================================
  // STAFF INFORMATION
  // ========================================
  "staff": [
    {
      "id": "frankie",
      "name": "Frankie",
      "role": "Lead Electrician",
      "email": "frankie@brightsparks-york.com",
      "phone": "01904 123456",
      "photo": "/assets/staff/frankie.jpg",
      "bio": "NICEIC registered electrician with 15+ years experience",
      "certifications": [
        "NICEIC Approved Contractor",
        "City & Guilds 2391 Test & Inspect",
        "18th Edition Wiring Regulations"
      ],
      "specialties": ["Rewiring", "Fuse Boxes", "EV Chargers"]
    }
  ],

  // ========================================
  // BLOCK CONFIGURATION OVERRIDES
  // ========================================
  "blocks": {
    "cards": {
      "buttonLabel": "Learn More",
      "cardsPerPage": 6,
      "enableLazyLoad": true,
      "defaultImage": "/assets/card-placeholder.jpg"
    },
    "hero": {
      "defaultImage": "/assets/hero-default.jpg",
      "height": "400px",
      "overlayOpacity": 0.4
    },
    "accordion": {
      "expandFirstItem": true,
      "animationDuration": 300
    },
    "tabs": {
      "position": "top",
      "enableDeepLinks": true
    },
    "blogroll": {
      "postsPerPage": 10,
      "showExcerpts": true,
      "excerptLength": 150
    }
  },

  // ========================================
  // FEATURE FLAGS
  // ========================================
  "features": {
    "enableSearch": true,
    "enableComments": false,
    "enableAnalytics": true,
    "enableCookieConsent": true,
    "enableLiveChat": false
  },

  // ========================================
  // INTEGRATIONS
  // ========================================
  "integrations": {
    "analytics": {
      "provider": "google",
      "trackingId": "G-XXXXXXXXXX"
    },
    "maps": {
      "provider": "google",
      "apiKey": "AIza..."
    }
  },

  // ========================================
  // NAVIGATION (optional)
  // ========================================
  "navigation": {
    "header": [
      { "label": "Home", "url": "/" },
      { "label": "Services", "url": "/services" },
      { "label": "About", "url": "/about" },
      { "label": "Contact", "url": "/contact" }
    ],
    "footer": [
      { "label": "Privacy Policy", "url": "/privacy" },
      { "label": "Terms of Service", "url": "/terms" }
    ]
  }
}
```

### Logo, Byline, Staff Customization

**Logo Customization:**

```json
{
  "theme": {
    "logo-url": "/assets/brightsparks-logo.png",
    "logo-height": "60px",
    "logo-alt": "Bright Sparks Electrical Logo"
  }
}
```

**Usage in Templates:**

```html
<header>
  <img
    src="{{ TENANT_CONFIG.theme.logo-url }}"
    alt="{{ TENANT_CONFIG.theme.logo-alt }}"
    style="height: {{ TENANT_CONFIG.theme.logo-height }}">
</header>
```

**Byline Customization:**

```json
{
  "metadata": {
    "byline": "Bright Sparks York - Your Local Electrical Experts"
  }
}
```

**Usage in Footer:**

```html
<footer>
  <p>{{ TENANT_CONFIG.metadata.byline }}</p>
</footer>
```

**Staff Customization:**

```json
{
  "staff": [
    {
      "id": "frankie",
      "name": "Frankie",
      "role": "Lead Electrician",
      "photo": "/assets/staff/frankie.jpg",
      "bio": "15+ years experience, NICEIC registered"
    }
  ]
}
```

**Usage in Bio Block:**

```javascript
// In blocks/bio/bio.js
export default async function decorate(block) {
  const staffId = block.dataset.staffId;
  const staff = window.TENANT_CONFIG.staff.find(s => s.id === staffId);

  if (staff) {
    block.innerHTML = `
      <div class="bio">
        <img src="${staff.photo}" alt="${staff.name}">
        <h3>${staff.name}</h3>
        <p class="role">${staff.role}</p>
        <p class="bio-text">${staff.bio}</p>
      </div>
    `;
  }
}
```

### Self-Service vs DDT-Managed

**Two Configuration Approaches:**

**1. Self-Service (Free/Low-Cost Tier)**

Contractors edit config.json directly via:

- Web-based JSON editor
- File upload interface
- GitHub integration (advanced users)

**Benefits:**

- Immediate updates
- Full control
- No waiting for DDT

**Limitations:**

- Requires JSON knowledge
- Risk of syntax errors
- No validation until deployment

**2. DDT-Managed (Premium Tier)**

DDT creates/updates config.json for contractor:

- Guided form interface
- Pre-validated inputs
- Professional design consultation
- Custom theme development

**Benefits:**

- No technical knowledge required
- Guaranteed valid configuration
- Professional guidance
- Custom design options

**Pricing:**

- Self-service: £0-20/month (included in base tier)
- DDT-managed: £50-150/month (premium tier)
- One-time setup: £200-500 (custom themes)

**Workflow Comparison:**

| Step | Self-Service | DDT-Managed |
|------|-------------|-------------|
| 1. Request change | Edit JSON in dashboard | Submit form with requirements |
| 2. Validation | Automatic on save | DDT reviews and validates |
| 3. Preview | Instant preview | DDT sends preview link |
| 4. Approval | Auto-publish | Contractor approves |
| 5. Deployment | Immediate | DDT deploys |
| **Total Time** | **1-5 minutes** | **1-3 business days** |

### Theme Variables for Blocks

**How Theme Variables Work:**

1. Tenant config.json defines CSS custom properties
2. Cloudflare Worker injects variables as inline `<style>` in page `<head>`
3. All blocks use CSS variables for colors, spacing, etc.
4. Changing config.json instantly changes all block styling

**Example:**

**config.json:**

```json
{
  "theme": {
    "color-primary": "#FF6B00",
    "color-secondary": "#FFA500",
    "button-border-radius": "30px"
  }
}
```

**Injected CSS (generated by Worker):**

```css
:root {
  --color-primary: #FF6B00;
  --color-secondary: #FFA500;
  --button-border-radius: 30px;
}
```

**Block CSS (uses variables):**

```css
/* blocks/cards/cards.css */
.cards .card {
  border-color: var(--color-primary);
}

.cards .button {
  background-color: var(--color-primary);
  border-radius: var(--button-border-radius);
}

.cards .button:hover {
  background-color: var(--color-secondary);
}
```

**Result:** All card blocks across all pages instantly use tenant colors.

---

## 19.8 Domain Strategy & Pricing

### Subdomain Pattern (Free/Basic Tier)

**Format:** `{tenant}.bsms.com`

**Examples:**

- brightsparks.bsms.com
- aplus-plumbing.bsms.com
- york-heating.bsms.com

**Features:**

- Automatic SSL via Cloudflare
- Instant provisioning
- No DNS configuration
- Unlimited subdomains

**Pricing:** Included in all tiers (£0-20/month)

**Setup Process:**

1. Contractor chooses subdomain name
2. System validates availability
3. Cloudflare Worker routes subdomain to tenant
4. SSL automatically provisioned
5. Contractor can use immediately

**Implementation:**

```javascript
// In Cloudflare Worker
function getTenantFromHost(hostname) {
  const subdomainMatch = hostname.match(/^([^.]+)\.bsms\.com$/);
  if (subdomainMatch) {
    const tenant = subdomainMatch[1];
    return tenant;
  }
  return null;
}
```

### Custom Domain (Premium Tier)

**Format:** Any custom domain contractor owns

**Examples:**

- brightsparks-york.com
- frankieelectrical.co.uk
- aplusplumbing.com

**Features:**

- Full brand control
- SEO benefits (own domain authority)
- Professional appearance
- Email addresses on same domain possible

**Pricing:**

- Setup fee: £50 (one-time)
- Monthly: £30-50/month (premium tier)
- Domain registration: Contractor's responsibility

**Requirements:**

1. Contractor must own domain
2. Contractor must update DNS settings
3. SSL certificate provisioning via Cloudflare

**Setup Process:**

**Step 1: Contractor Purchases Domain**

- Use registrar of choice (GoDaddy, Namecheap, etc.)
- Provide domain to DDT

**Step 2: DNS Configuration**

- Contractor updates DNS CNAME records
- Points domain to Cloudflare Worker

**Example DNS Records:**

```
Type: CNAME
Name: @
Value: bsms-proxy.cloudflare.com
TTL: Auto
```

**Step 3: Domain Mapping (DDT)**

- Add mapping to Cloudflare KV store

```javascript
// cloudflare-kv: domain-mappings
{
  "brightsparks-york.com": "brightsparks",
  "aplusplumbing.com": "aplus-plumbing"
}
```

**Step 4: SSL Provisioning**

- Cloudflare auto-provisions SSL certificate
- Typically takes 5-15 minutes
- Validates via DNS challenge

**Step 5: Verification**

- System verifies domain resolves correctly
- Contractor receives confirmation email
- Domain live

**Implementation:**

```javascript
// In Cloudflare Worker
async function getTenantFromCustomDomain(hostname, env) {
  // Check KV store for custom domain mapping
  const tenant = await env.DOMAIN_MAPPINGS.get(hostname);
  if (tenant) {
    return tenant;
  }
  return null;
}

async function getTenant(hostname, env) {
  // Try subdomain first
  let tenant = getTenantFromSubdomain(hostname);
  if (tenant) return tenant;

  // Try custom domain
  tenant = await getTenantFromCustomDomain(hostname, env);
  if (tenant) return tenant;

  return 'default';
}
```

### SSL Automation

**Cloudflare Universal SSL:**

- Free SSL certificates for all domains
- Automatic renewal
- Supports wildcard (*.bsms.com) for subdomains
- DV (Domain Validated) certificates

**Process:**

1. Domain added to Cloudflare
2. Cloudflare issues SSL certificate
3. Certificate auto-renews before expiration
4. Zero maintenance required

**Certificate Types:**

- Subdomains: Wildcard certificate (*.bsms.com)
- Custom domains: Individual DV certificates per domain

**Security Features:**

- TLS 1.2 minimum
- Strong cipher suites
- HSTS (HTTP Strict Transport Security)
- Automatic HTTP → HTTPS redirect

### Pricing Model

**Free Tier (Subdomain Only):**

- Domain: {tenant}.bsms.com
- Storage: 100MB
- Pages: Up to 10
- Support: Community forum
- Price: £0/month

**Basic Tier (Subdomain):**

- Domain: {tenant}.bsms.com
- Storage: 1GB
- Pages: Unlimited
- Blocks: All Tier 1 + Tier 2 blocks
- Support: Email support
- Price: £20/month

**Premium Tier (Custom Domain):**

- Domain: Custom domain + subdomain
- Storage: 10GB
- Pages: Unlimited
- Blocks: All blocks (including Tier 3)
- Support: Priority email + phone
- DDT-managed config: Optional (+£50/month)
- Custom theme: Optional (+£200-500 one-time)
- Price: £50/month + £50 setup fee

**Enterprise Tier:**

- Domains: Multiple custom domains
- Storage: Unlimited
- Pages: Unlimited
- Blocks: All blocks + custom development
- Support: Dedicated account manager
- White-label: Remove BSMS branding
- Price: Custom quote (£200+/month)

**Comparison Table:**

| Feature | Free | Basic | Premium | Enterprise |
|---------|------|-------|---------|------------|
| **Domain** | Subdomain | Subdomain | Custom + Subdomain | Multiple Custom |
| **Storage** | 100MB | 1GB | 10GB | Unlimited |
| **Pages** | 10 | Unlimited | Unlimited | Unlimited |
| **Blocks** | Tier 1 only | Tier 1 + 2 | All blocks | All + Custom |
| **Config** | Self-service | Self-service | Self or DDT-managed | DDT-managed |
| **Support** | Community | Email | Priority | Dedicated Manager |
| **SSL** | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| **Analytics** | Basic | Standard | Advanced | Custom |
| **Setup Fee** | £0 | £0 | £50 | Custom |
| **Monthly** | £0 | £20 | £50 | £200+ |

---

## 19.9 AI Assistant Rules (Summary & Examples)

### Complete AI Assistant Workflow

**When asked to integrate an EDS block into SaaS environment:**

**Step 1: Dependency Analysis**

```
1. Read block JavaScript file
2. Extract all import statements
3. Identify EDS core imports (from aem.js or lib-franklin.js)
4. List required functions
5. Check if shim library provides these functions
6. Report dependency tier (1, 2, or 3)
```

**Step 2: Import Replacement**

```
1. Replace "from '../../scripts/aem.js'" with "from '/lib/eds-shim.js'"
2. Replace "from '../../scripts/lib-franklin.js'" with "from '/lib/eds-shim.js'"
3. Leave all other imports unchanged
4. Verify syntax remains valid
```

**Step 3: Configuration Extraction**

```
1. Locate CONFIG object at top of file
2. Extract all key-value pairs
3. Generate tenant config schema (JSON)
4. Document customizable fields
5. Provide default values
```

**Step 4: Testing**

```
1. Run structural test (block renders)
2. Run dependency test (shim functions work)
3. Run configuration test (tenant overrides apply)
4. Run variation test (all variations work)
5. Test responsive behavior
6. Generate test report
```

**Step 5: Documentation**

```
1. Generate contractor documentation from README.md
2. Adapt EDS-specific syntax to SaaS context
3. Include usage examples with markdown syntax
4. Document configuration options
5. Note any limitations
```

### Example: Integrating "Cards" Block

**Scenario:** AI assistant asked to integrate the `cards` block into SaaS.

**AI Assistant Response:**

```
## Block Integration Report: cards

### Step 1: Dependency Analysis

**Block:** cards
**Location:** /blocks/cards/cards.js

**Detected Imports:**
```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
```

**Dependency Analysis:**

- Function: `createOptimizedPicture`
- Shim Status: ✅ Available in /lib/eds-shim.js
- Tier: 2 (Minimal Dependencies)

### Step 2: Import Replacement

**Original Code:**

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  // ... block logic
}
```

**Adapted Code:**

```javascript
import { createOptimizedPicture } from '/lib/eds-shim.js';

export default async function decorate(block) {
  // ... block logic (unchanged)
}
```

**Changes:** 1 line modified (import path only)

### Step 3: Configuration Extraction

**Detected Configuration:**

```javascript
const CARDS_CONFIG = {
  ERROR_MESSAGE: 'Failed to load cards',
  LOADING_MESSAGE: 'Loading cards...',
  BUTTON_LABEL: 'View More',
  CARDS_PER_PAGE: 12,
  DEFAULT_IMAGE: '/assets/card-placeholder.jpg',
};
```

**Generated Tenant Config Schema:**

```json
{
  "blocks": {
    "cards": {
      "errorMessage": "Failed to load cards",
      "loadingMessage": "Loading cards...",
      "buttonLabel": "View More",
      "cardsPerPage": 12,
      "defaultImage": "/assets/card-placeholder.jpg"
    }
  }
}
```

### Step 4: Testing

**Structural Test:** ✅ PASS

- Block renders with 3 sample cards
- No console errors
- Block status: loaded

**Dependency Test:** ✅ PASS

- createOptimizedPicture: Returns <picture> element with 2 sources + img
- Cloudflare Image Resizing URLs generated correctly

**Configuration Test:** ✅ PASS

- Tenant override: buttonLabel = "Learn More" ✅ Applied
- Tenant override: cardsPerPage = 6 ✅ Applied

**Variation Test:** ✅ PASS

- Base: ✅ Grid layout (3 columns)
- Dark: ✅ Dark background, white text
- Wide: ✅ 4 columns instead of 3
- Dark + Wide: ✅ Both variations combined

**Responsive Test:** ✅ PASS

- Mobile (375px): 1 column
- Tablet (768px): 2 columns
- Desktop (1200px): 3 columns (or 4 with wide variation)

### Step 5: Documentation

**Generated Contractor Documentation:**

# Cards Block

Display content in a responsive card grid layout.

## Usage

### Basic Example

```markdown
| Cards |
|-------|
| Card 1 Title |
| Card 1 description |
| Card 2 Title |
| Card 2 description |
```

### With Variations

```markdown
| Cards (dark) |
|--------------|
| Dark-themed cards |

| Cards (wide) |
|--------------|
| 4-column layout instead of 3 |
```

## Configuration

Customize in config.json:

```json
{
  "blocks": {
    "cards": {
      "buttonLabel": "Learn More",
      "cardsPerPage": 6
    }
  }
}
```

## Variations

| Variation | Description |
|-----------|-------------|
| dark | Dark background, white text |
| wide | 4 columns on desktop instead of 3 |

## Browser Support

- ✅ All modern browsers
- ✅ Mobile responsive

---

## Integration Result: ✅ SUCCESS

**Files to Deploy:**

1. /blocks/cards/cards.js (modified import)
2. /blocks/cards/cards.css (no changes)
3. /docs/blocks/cards.md (contractor documentation)

**Tenant Action Required:**

- Optional: Customize buttonLabel in config.json

**Estimated Time:** Integration complete in < 5 minutes

```

### Example: Handling Tier 3 Block (Complex)

**Scenario:** AI assistant asked to integrate `ipynb-viewer` block (Jupyter notebook renderer).

**AI Assistant Response:**

```

## Block Integration Report: ipynb-viewer

### Step 1: Dependency Analysis

**Block:** ipynb-viewer
**Location:** /blocks/ipynb-viewer/ipynb-viewer.js

**Detected Imports:**

```javascript
import { getMetadata, decorateIcons } from '../../scripts/aem.js';
```

**Dependency Analysis:**

- Functions: `getMetadata`, `decorateIcons`
- Shim Status: ✅ Both available in /lib/eds-shim.js
- **Additional Dependencies:**
  - Custom markdown parser (marked.js)
  - Syntax highlighter (highlight.js)
  - MathJax (for equations)
  - Complex overlay system
- Tier: 3 (Complex Integration)

### Step 2: Complexity Assessment

**Block Characteristics:**

- **File Size:** 2,847 lines (very large)
- **Custom Logic:** Jupyter notebook parsing, cell execution simulation, overlay system
- **External Libraries:** marked.js, highlight.js, MathJax
- **Interactive Features:** Code execution UI, notebook navigation, smart links

**Integration Challenges:**

1. Large codebase requires thorough testing
2. External library CDN dependencies
3. Complex state management (active cells, overlays)
4. Custom markdown parsing (differs from standard)
5. GitHub integration (smart links to .md files)

### Step 3: Recommended Approach

**Option 1: Full Integration (Recommended)**

- Replace EDS imports with shim
- Add external library loading to shim
- Test all features (code cells, overlays, navigation)
- Adapt GitHub integration for tenant context
- Estimated effort: 4-8 hours

**Option 2: Simplified Version**

- Basic notebook display only
- Remove interactive features
- Static code cells (no execution UI)
- Simpler overlay system
- Estimated effort: 2-4 hours

**Option 3: Alternative Solution**

- Use third-party notebook viewer (nbviewer, JupyterLite)
- Embed via iframe
- Lose customization but gain stability
- Estimated effort: 1-2 hours

### Step 4: Recommended Action

**Question for User:**
Which approach do you prefer for ipynb-viewer integration?

1. Full integration (all features, most effort)
2. Simplified version (basic display, less effort)
3. Third-party alternative (minimal effort, less control)

**Recommendation:** Option 2 (Simplified) for initial release. Add advanced features later if contractors request them.

### Step 5: If Proceeding with Full Integration

**Implementation Plan:**

1. Replace EDS imports ✅
2. Add library loading to shim:

   ```javascript
   // In /lib/eds-shim.js
   export async function loadNotebookLibraries() {
     await Promise.all([
       loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js'),
       loadScript('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/highlight.min.js'),
       loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'),
     ]);
   }
   ```

3. Test notebook rendering with sample .ipynb files
4. Test overlay system (help, markdown, images)
5. Test navigation modes (basic, paged, autorun, notebook)
6. Adapt smart link resolution for SaaS context
7. Performance testing (large notebooks)
8. Generate documentation

**Testing Checklist:**

- ✅ Basic notebook display
- ✅ Code cells with syntax highlighting
- ✅ Markdown cells with formatting
- ✅ Math equations (MathJax)
- ✅ Images and media
- ✅ Overlays (help, external content)
- ✅ Navigation (page forward/back)
- ✅ Autorun mode
- ✅ Smart links to .md files
- ✅ Mobile responsive

**Estimated Timeline:**

- Import replacement: 10 minutes
- Library integration: 1 hour
- Feature testing: 3-4 hours
- Documentation: 1 hour
- **Total:** 5-6 hours

---

## Integration Result: ⚠️ PENDING USER DECISION

**Next Step:** Choose integration approach (Options 1, 2, or 3)

**If approved, AI assistant will proceed with detailed implementation.**

```

---

## 19.10 Implementation Timeline

### Phase 1: Core Infrastructure (Week 1)

**Objective:** Build foundation for block integration.

**Tasks:**

**Day 1-2: Minimal EDS Shim Library**
- Write `/lib/eds-shim.js` (~200 lines)
- Implement core functions:
  - `createOptimizedPicture()` with Cloudflare Image Resizing
  - `getMetadata()` with tenant config fallback
  - `toClassName()` and `toCamelCase()`
  - `loadCSS()` and `loadScript()`
  - `readBlockConfig()`
  - `decorateIcons()` and `decorateButtons()`
  - `loadBlock()` and `decorateBlocks()`
- Write unit tests for each function
- Deploy to staging environment

**Day 3: Markdown Processor**
- Write `/lib/markdown-processor.js` (~300 lines)
- Implement:
  - YAML frontmatter parser
  - EDS metadata table parser
  - Metadata merge algorithm
  - Block table transformation
  - Markdown to HTML conversion
- Write integration tests
- Test with sample markdown files

**Day 4: Block Loader & Registry**
- Write `/lib/block-loader.js` (~150 lines)
- Implement:
  - Block registry (module cache)
  - CSS loading
  - JavaScript module loading
  - Block decoration orchestration
  - MutationObserver for dynamic blocks
- Test with sample blocks

**Day 5: Cloudflare Worker**
- Write `cloudflare-workers/page-renderer.js` (~400 lines)
- Implement:
  - Request routing (subdomain detection)
  - R2 markdown fetching
  - Tenant config loading
  - Markdown processing
  - HTML page generation
  - Asset handling
- Deploy to Cloudflare staging
- Test end-to-end flow

**Day 6-7: Testing & Refinement**
- Integration testing (all components together)
- Performance testing (page load times)
- Error handling
- Documentation
- Bug fixes

**Deliverables:**
- ✅ Minimal EDS shim library (tested)
- ✅ Markdown processor (tested)
- ✅ Block loader (tested)
- ✅ Cloudflare Worker (deployed to staging)
- ✅ Developer documentation

### Phase 2: Tier 1 Blocks (Week 2)

**Objective:** Integrate zero-dependency blocks (immediate value).

**Blocks to Integrate (15 blocks):**
1. accordion
2. cards
3. tabs
4. columns
5. table
6. hero
7. text
8. quote
9. counter
10. centreblock
11. helloworld
12. returntotop
13. floating-alert
14. remove-icon-styles
15. raw

**Day 1-2: Direct Copy & Test**
- Copy block files (JS + CSS + README.md) to SaaS `/blocks/` directory
- No modifications needed (zero dependencies)
- Test each block:
  - Structural test (renders correctly)
  - Variation test (all variations work)
  - Responsive test (mobile, tablet, desktop)
  - Accessibility test (WCAG 2.1 AA)

**Day 3-4: Documentation**
- Generate contractor documentation for each block
- Markdown usage examples
- Configuration options (if any)
- Screenshots/demos
- Troubleshooting tips

**Day 5: Integration Testing**
- Test multiple blocks on single page
- Test block interactions
- Performance testing (Lighthouse scores)
- Cross-browser testing

**Day 6-7: Staging Deployment**
- Deploy all Tier 1 blocks to staging
- Create demo tenant site with all blocks
- User acceptance testing
- Bug fixes

**Deliverables:**
- ✅ 15 Tier 1 blocks deployed and tested
- ✅ Contractor documentation for all blocks
- ✅ Demo site showcasing all blocks
- ✅ Test reports

### Phase 3: Tier 2 Blocks (Week 3)

**Objective:** Integrate blocks with minimal dependencies.

**Blocks to Integrate (20 blocks):**
1. blogroll
2. embed
3. footer
4. header
5. index
6. modal
7. overlay
8. search
9. video
10. grid
11. fragment
12. showcaser
13. bio
14. comment
15. dashboard
16. dynamic
17. tags
18. view-myblog
19. inline-svg
20. markdown

**Day 1-2: AI-Assisted Adaptation**
- Run AI assistant workflow for each block:
  - Dependency analysis
  - Import replacement (aem.js → eds-shim.js)
  - Configuration extraction
  - Testing
- Batch process blocks with same dependencies

**Day 3-4: Testing**
- Structural tests
- Dependency tests (shim functions work)
- Configuration override tests
- Variation tests
- Responsive tests
- Integration tests (multiple blocks)

**Day 5: Documentation**
- Generate contractor documentation
- Configuration examples
- Usage examples
- Integration examples

**Day 6-7: Staging Deployment**
- Deploy all Tier 2 blocks
- Update demo site
- User acceptance testing
- Bug fixes

**Deliverables:**
- ✅ 20 Tier 2 blocks deployed and tested
- ✅ Contractor documentation
- ✅ Updated demo site
- ✅ Test reports

### Phase 4: Advanced Features (Week 4+)

**Objective:** Add tenant customization, domain management, and Tier 3 blocks.

**Week 4: Tenant Configuration System**

**Day 1-2: Config.json Infrastructure**
- Design complete config.json schema
- Implement config validation
- Build config editor UI (web-based JSON editor)
- Implement config storage (R2 bucket)
- Tenant config loading in Worker

**Day 3-4: Theme System**
- Implement CSS variable injection
- Test theme customization across all blocks
- Build theme preview system
- Create default themes (5-10 options)

**Day 5-7: Staff & Branding**
- Staff management UI
- Logo upload and management
- Byline customization
- Integration with blocks (bio, header, footer)

**Week 5: Domain Management**

**Day 1-2: Subdomain System**
- Implement subdomain routing in Worker
- Subdomain availability checking
- Automatic subdomain provisioning
- SSL for subdomains (Cloudflare Universal SSL)

**Day 3-5: Custom Domain System**
- Custom domain mapping (KV store)
- DNS validation
- SSL provisioning for custom domains
- Domain verification workflow
- Admin UI for domain management

**Day 6-7: Domain Testing**
- Test subdomain routing
- Test custom domain routing
- Test SSL provisioning
- Test multi-tenant isolation

**Week 6+: Tier 3 Blocks (Optional)**

**Approach:** Evaluate each Tier 3 block individually:

**Option A: Full Integration**
- Blocks with external libraries (shoelace, spectrum)
- Complex logic (ipynb-viewer, code-expander)
- Estimated: 4-8 hours per block

**Option B: Simplified Versions**
- Strip advanced features
- Core functionality only
- Estimated: 2-4 hours per block

**Option C: Alternative Solutions**
- Third-party alternatives
- Iframe embeds
- Estimated: 1-2 hours per block

**Priority Order (if pursuing Tier 3):**
1. shoelace-card (external library)
2. code-expander (syntax highlighting)
3. ipynb-viewer (notebook display)
4. slide-builder (presentations)
5. Others as requested by contractors

**Deliverables:**
- ✅ Tenant configuration system (web UI)
- ✅ Theme customization (CSS variables)
- ✅ Staff and branding management
- ✅ Subdomain system (tested)
- ✅ Custom domain system (tested)
- ✅ Selected Tier 3 blocks (as prioritized)

### Success Metrics

**Phase 1 (Core Infrastructure):**
- ✅ All shim functions tested and working
- ✅ Markdown processor handles YAML + EDS tables
- ✅ Cloudflare Worker renders pages in < 100ms
- ✅ Zero console errors in developer tools

**Phase 2 (Tier 1 Blocks):**
- ✅ All 15 blocks render correctly
- ✅ Lighthouse scores: 90+ across the board
- ✅ Zero accessibility violations (WCAG 2.1 AA)
- ✅ Mobile responsive (tested on 5+ devices)

**Phase 3 (Tier 2 Blocks):**
- ✅ All 20 blocks adapted and tested
- ✅ Shim functions provide identical behavior to EDS
- ✅ Configuration overrides work for all blocks
- ✅ AI assistant workflow documented

**Phase 4 (Advanced Features):**
- ✅ Tenant config system live and usable
- ✅ Theme changes apply instantly across all blocks
- ✅ Subdomain provisioning < 1 minute
- ✅ Custom domain setup < 24 hours (including DNS propagation)
- ✅ 90%+ contractor satisfaction with customization options

**Overall Project Success:**
- ✅ 35+ blocks available to contractors (Tier 1 + 2)
- ✅ 10+ demo sites built by contractors
- ✅ 95%+ uptime (Cloudflare reliability)
- ✅ < 200ms average page load time
- ✅ Zero code changes to existing EDS blocks
- ✅ AI assistant can integrate new blocks in < 30 minutes

---

## 19.11 Conclusion

This EDS Block Library Integration strategy provides Bright Sparks Management System with:

1. **Universal Block Compatibility**: Any current or future EDS block works in SaaS with minimal AI-assisted adaptation
2. **Zero-Modification Architecture**: Blocks remain unchanged, integration handled by shim layer
3. **Dual-Environment Support**: Single codebase serves both EDS and SaaS platforms
4. **AI Assistant Enforcement**: Clear patterns enable automated block adaptation
5. **Tenant Customization**: Logos, colors, staff, domains all configurable
6. **Cost-Effective Infrastructure**: Cloudflare Workers + R2 + Image Resizing < £50/month at scale
7. **Fast Time-to-Market**: 35+ blocks available in 4 weeks
8. **Future-Proof**: New EDS blocks automatically compatible via established patterns

**Next Steps:**
1. Approve approach and timeline
2. Provision Cloudflare infrastructure
3. Begin Phase 1 (Core Infrastructure)
4. Iterate based on contractor feedback

**Key Success Factor:** The AI assistant rules ensure that blocks remain a living, evolving library that grows with EDS, requiring minimal ongoing effort from the DDT team.
