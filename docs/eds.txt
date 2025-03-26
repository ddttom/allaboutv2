# Adobe Edge Delivery Services (EDS) Knowledge Base

## Core Concepts

### What is Edge Delivery Services?
Edge Delivery Services (EDS, formerly known as Franklin or Project Helix) is a paradigm-shifting content management system that adapts to how authors naturally create content, rather than forcing authors to adapt to rigid system structures. EDS transforms documents created in familiar tools like Google Docs or Microsoft Word into high-performance websites while maintaining perfect Core Web Vitals scores.

### Content-First Philosophy
EDS embraces a content-first approach that radically simplifies the authoring process:
- Content creators work in familiar tools (Google Docs, Microsoft Word)
- The system handles technical transformation into structured web pages
- Clear separation of concerns allows content and development teams to work simultaneously
- Developers enhance document transformation rather than building websites from scratch

### Development Requirements and Constraints
EDS follows deliberate design choices that prioritize simplicity, performance, and maintainability:
- Modern JavaScript without TypeScript (no transpilation complexity)
- Pure CSS without preprocessors (simple and performant)
- No build-heavy frameworks (React, Vue, etc.)
- Focus on simplicity and performance (100/100/100/100 Core Web Vitals)
- Clear code organization
- No dependencies and no build steps

## Document Transformation Process

### Stage 1: Document Creation
Authors create content in Google Docs or Microsoft Word using:
- Headings/subheadings (H1-H6) for hierarchical organization
- Rich text formatting (bold, italic, underline)
- Lists (ordered and unordered)
- Embedded images
- Links (internal and external)
- Section breaks (horizontal rules with ---)
- Tables with specific headers for specialized blocks
- Metadata tables for page properties

### Stage 2: Document to Markdown Conversion (Server-Side)
When an author initiates preview:
1. Document is retrieved via API (Google Docs, SharePoint)
2. System analyzes document structure
3. Content is converted to Markdown format
4. Tables are processed as potential block components
5. Images are extracted and stored separately
6. Markdown is stored in the "content bus" as the source of truth

### Stage 3: Markdown to Initial HTML Generation (Server-Side)
The server transforms Markdown into basic HTML:
1. HTML structure created with semantic elements
2. Metadata extracted and applied to `<head>`
3. Content divided into sections based on horizontal rules
4. Tables marked as blocks converted to `<div>` elements with appropriate classes

### Stage 4: Initial HTML Delivery and Browser Processing
The browser receives the basic HTML and enhances it:
1. Browser renders initial HTML with critical CSS
2. Core scripts (aem.js and scripts.js) are loaded
3. DOM is enhanced through client-side JavaScript:
   - decorateTemplateAndTheme() applies page-level structure
   - decorateSections() processes each section
   - decorateBlocks() identifies blocks for enhancement
   - wrapTextNodes() wraps text nodes in appropriate elements
   - decorateButtons() transforms links into buttons where appropriate
4. Each block loads its CSS and JavaScript

### Stage 5: Final DOM Transformation and Rendering
The page undergoes significant transformation:
1. Block status tracking and wrapper elements are added
2. Sections are enhanced with container-specific classes
3. Links are styled as buttons where appropriate
4. Images are transformed into optimized, responsive picture elements
5. Metadata is expanded into comprehensive SEO and social tags
6. Resources are loaded with sophisticated optimization strategies

## Table Transformation Process

### Table Structure in Documents
Authors create tables with rows and columns for:
- Structured data presentation
- Layout organization
- Creating specialized block components

### Table-to-Div Transformation
Tables in documents are converted to nested div structures:
```
| Block Name |        |        |
| ---------- | ------ | ------ |
| Cell 1     | Cell 2 | Cell 3 |
| Cell 4     | Cell 5 | Cell 6 |
```

Becomes:
```html
<div class="block-name">
  <div>
    <div>Cell 1</div>
    <div>Cell 2</div>
    <div>Cell 3</div>
  </div>
  <div>
    <div>Cell 4</div>
    <div>Cell 5</div>
    <div>Cell 6</div>
  </div>
</div>
```

### Working with Table-Originated Content
When processing table-originated divs in JavaScript:
```javascript
export default function decorate(block) {
  // Each row of the original table is a direct child div
  const rows = block.children;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.children;
    
    // Process each cell
    for (let j = 0; j < cells.length; j++) {
      const cellContent = cells[j].textContent.trim();
      // Process cell content
    }
  }
}
```

### Special Considerations for Table Content
1. Lists in tables become proper `<ul>` or `<ol>` elements
2. Rich text formatting is preserved
3. Images in tables are wrapped in `<picture>` elements
4. Complex content structure is maintained

## EDS's Three-Phase Loading Strategy (E-L-D)

### Phase E (Eager)
- Purpose: Loads critical content needed for Largest Contentful Paint (LCP)
- Timeline: Begins immediately on page load
- Components: First section (typically hero), main heading, hero image, critical CSS, core scripts
- Goal: Keep aggregate payload before LCP below 100KB

### Phase L (Lazy)
- Purpose: Loads important but non-critical elements
- Timeline: Begins after first section is loaded
- Components: Remaining sections, header, footer, non-critical CSS, below-the-fold images, additional fonts

### Phase D (Delayed)
- Purpose: Handles lowest-priority elements
- Timeline: Begins after a 3-second delay
- Components: Analytics, third-party scripts, marketing tools, social widgets, chat functionality
- Implementation: Loaded through delayed.js

## Core JavaScript Components

### aem.js
Foundation of EDS functionality providing utility functions and core behavior:
- Initial setup (init() function)
- Core utility functions (toClassName(), readBlockConfig(), loadCSS(), getMetadata())
- Image handling (createOptimizedPicture())
- DOM manipulation (decorating templates, wrapping text nodes, processing buttons)
- Section and block handling (decorating, building, loading)
- Performance monitoring (RUM sampling and tracking)

### scripts.js
Orchestrates the page loading process:
- Imports useful functions from aem.js
- Auto blocking functions (programmatically creating blocks from content patterns)
- Loading phases (loadEager(), loadLazy(), loadDelayed())
- Page load coordination

### delayed.js
Simple file for custom delayed code:
- Designed for non-critical functionality
- Loads after a 3-second delay
- Appropriate for analytics, personalization, cookies, etc.

## Understanding Blocks in EDS

### Block Creation in Documents
Authors create blocks using tables:
- First cell in first row defines block type (e.g., "Columns")
- Remaining cells provide block content
- Variations specified in parentheses: "Columns (wide)"

### Autoblocking
System automatically applies styling to common content patterns:
- Pattern recognition identifies content combinations (e.g., image + heading)
- Automatic transformation into appropriate blocks
- Consistent styling without author intervention

### Block Development in Code
Each block has a specific folder structure:
```
/blocks/{blockname}/
├── {blockname}.js           # Core block functionality
├── {blockname}.css          # Block styles
├── README.md                # Documentation
├── example.md               # Usage examples
├── demo.md                  # Demo content
└── example files            # Sample data if needed
```

Basic block implementation:
```javascript
export default function decorate(block) {
  // Transform the block DOM as needed
  // 'block' is a DOM element with the class 'blockname'
}
```

### Block Variations
Authors can create variations with minimal code:
- Options in parentheses: `| Columns (dark, wide) |`
- These become additional CSS classes: `<div class="columns dark wide">`
- Variations handled through CSS without additional JavaScript

## Best Practices

### CSS Best Practices
1. Block Isolation: CSS selectors should only apply to specific blocks
2. Use modern layout techniques (Flexbox/Grid)
3. Follow mobile-first approach
4. Maintain consistent class naming (.blockname-element-state)
5. Use CSS variables for theming
6. Never style container elements (.blockname-container)
7. Support variations through class combinations
8. Ensure responsiveness for different screen sizes

### JavaScript Best Practices
1. Follow Airbnb's JavaScript Style Guide
2. Place configuration variables at the top
3. Use async/await for asynchronous code
4. Break logic into focused functions
5. Include robust error handling
6. Use modern browser features
7. Keep code simple and performant

### Content Structure Best Practices
1. Minimize blocks (use only when necessary)
2. Avoid nested blocks
3. Use full URLs
4. Reuse standards from EDS Block Collection
5. Follow progressive enhancement principles

### Documentation Best Practices
Each block should include:
- Comprehensive README.md (purpose, options, instructions)
- Simple example.md for quick reference
- Complete demo.md for real-world usage

## Extending Functionality

### The Expander Block Pattern
Instead of modifying core files, create blocks that enhance specific elements:
- Non-invasive approach preserves core files
- Configuration values defined as constants
- Clear documentation explains purpose and function
- Error handling prevents failures from breaking the page
- Modularity keeps each function focused

### Common Implementation Challenges and Solutions

#### Analytics Implementation
Use delayed.js for analytics scripts:
```javascript
// In delayed.js
(function() {
  // Create script element
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X';
  document.head.appendChild(script);

  // Initialize analytics
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXXXX-X');
})();
```

#### Dynamic Content from External APIs
Create specialized blocks for fetching and formatting content:
```javascript
export default async function decorate(block) {
  const config = readBlockConfig(block);
  const apiUrl = config.apiUrl || 'https://api.example.com/data';
  try {
    // Clear initial content and show loading state
    // Fetch data from API
    // Render dynamic content
  } catch (error) {
    // Display error state
  }
}
```

#### Cookie Consent Implementation
Create a cookie-consent block in the template:
```javascript
export default function decorate(block) {
  // Hide original block
  // Check for existing consent
  // Create and display consent banner
  // Add event listeners for user choices
}
```

#### Personalization
Use local storage for simple personalization:
```javascript
export default function decorate(block) {
  // Get or create user profile from localStorage
  // Track page visits
  // Determine interests based on browsing patterns
  // Generate personalized content
}
```

## Icon System and SVG Handling

### Icon Syntax and Transformation
When authors use `:iconname:` in documents:
1. System identifies icon name
2. Creates span with classes `icon` and `icon-{name}`
3. Looks for corresponding SVG in icons folder
4. Replaces span with image tag

### Implementation Notes
1. Create `/icons/` directory at project root
2. Place SVG icons in this directory
3. Optimize SVGs for web use
4. Document available icons for authors
5. Consider creating an icon library page

## Handling Bullet Points in EDS

- If bullet points are continuous in the document, EDS generates a single `<ul>` with multiple `<li>` elements
- If bullet points have blank lines between them, EDS generates separate `<ul>` elements
- Best practice: Query for all `<li>` elements directly rather than making assumptions about the structure

## Block Validation Best Practices

- Unnecessary to check if a block has the correct class name
- System only calls your block's `decorate` function for matching elements
- Focus validation on required content rather than structure
- Avoid redundant checks that can lead to false negatives

## Styling Rules

- Never apply styling to elements with -container suffix
- Apply styles to either -wrapper elements or the block class itself
- Container elements (.blockname-container) are structural only
- Wrapper elements (.blockname-wrapper) are for layout and positioning
- Block elements (.blockname) are for block-specific styling

## Advanced Techniques

### Dynamic Content with Query Index
EDS provides an indexing system for content:
```javascript
async function loadContent() {
  try {
    // Fetch indexed content
    const response = await fetch('/query-index.json');
    const data = await response.json();
    
    // Filter and process data
    const filteredItems = data.data.filter(criteria);
    
    // Generate HTML and update DOM
  } catch (error) {
    console.error('Error loading content:', error);
  }
}
```

### Auto Blocking
Programmatically create blocks based on content patterns:
```javascript
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  if (conditions_met) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}
```

## Key Principles

1. **Document-First Content Management**: Authors use familiar tools without needing to understand web technologies
2. **Simplicity Over Complexity**: No build process, no dependencies, clear structure
3. **Performance by Design**: Three-phase loading, resource optimization, minimal JavaScript
4. **Author and Developer Empowerment**: Both teams work simultaneously without blocking each other
5. **Expander Pattern for Extension**: Add functionality without modifying core files
6. 