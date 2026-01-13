# DAM Block (Digital Asset Management)

A specialized block for extracting and displaying digital asset metadata in structured JSON format. Converts tabular asset data into a formatted code display, ideal for metadata documentation, asset catalogs, and content auditing workflows.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Usage](#usage)
5. [Content Structure](#content-structure)
6. [Styling & Customization](#styling--customization)
7. [Responsive Behavior](#responsive-behavior)
8. [Accessibility](#accessibility)
9. [Performance](#performance)
10. [Browser Support](#browser-support)
11. [Troubleshooting](#troubleshooting)
12. [Testing](#testing)
13. [Dependencies](#dependencies)
14. [Future Enhancements](#future-enhancements)

---

## Overview

The DAM block transforms structured tabular data about digital assets into a formatted JSON display. It extracts image paths from URLs, processes metadata fields, and presents the information in a readable, monospace code block format.

**Primary Use Cases:**

- Digital asset metadata documentation
- Content inventory and auditing
- Asset catalog generation
- Media library documentation
- Image path extraction and validation
- Structured data export for APIs

**Block Name:** `dam`

**Location:** `/blocks/dam/`

**Files:**

- `dam.js` - Core decoration logic with JSON generation
- `dam.css` - Code display styling with monospace font
- `README.md` - Technical documentation (this file)
- `EXAMPLE.md` - Content author guide
- `demo.md` - Demonstration page with metadata
- `test.html` - Browser-based testing

---

## Features

### Core Capabilities

1. **Automatic Path Extraction**
   - Extracts image paths from `<img>` src attributes
   - Handles link `<a>` href attributes
   - URL parsing and pathname isolation
   - Supports both relative and absolute URLs

2. **Structured JSON Output**
   - Converts table rows to JSON array
   - Pretty-printed with 2-space indentation
   - Preserves all metadata fields
   - Clean, readable format

3. **Metadata Field Support**
   - Note field for asset identification
   - Description field for asset details
   - Classification field for categorization
   - Tag field for grouping and filtering
   - Image path extraction from picture elements
   - Additional info field for extra metadata

4. **Error Handling**
   - Graceful handling of invalid block structure
   - User-friendly error messages
   - Console logging for debugging
   - ARIA error announcements

5. **Accessible Code Display**
   - Semantic `<pre>` and `<code>` elements
   - ARIA region labeling
   - Keyboard focusable with tabindex
   - Screen reader compatible

---

## Technical Architecture

### JavaScript Structure

The `decorate()` function performs these transformations:

1. **Validation**: Checks for valid block structure with children
2. **Data Extraction**: Processes each row (excluding header) into JSON object
3. **Path Extraction**: Uses `extractPath()` helper to get image/link URLs
4. **JSON Generation**: Creates formatted JSON string with `JSON.stringify()`
5. **DOM Replacement**: Replaces block content with code display
6. **Error Handling**: Catches errors and displays user-friendly messages

### Key Functions

**extractPath(element)**
Extracts the pathname from image or link elements:

`Purpose: Extract Path`
`function extractPath(element) {`
`const img = element.querySelector('img');`
`const link = element.querySelector('a');`
`if (img) {`
`const url = new URL(img.src);`
`return url.pathname;`
`}`
`if (link) {`
`const url = new URL(link.href);`
`return url.pathname;`
`}`
`return '';`
`}`

**createDamJson(block)**
Converts block rows to JSON array:

`Purpose: Create JSON`
`function createDamJson(block) {`
`const rows = Array.from(block.children).slice(1);`
`const damData = rows.map((row) => {`
`const [, note, description, classification, tag, imageCell, additionalInfo] = Array.from(row.children);`
`return {`
`note: note?.textContent?.trim() || '',`
`description: description?.textContent?.trim() || '',`
`classification: classification?.textContent?.trim() || '',`
`tag: tag?.textContent?.trim() || '',`
`path: extractPath(imageCell),`
`additionalInfo: additionalInfo?.textContent?.trim() || '',`
`};`
`});`
`return JSON.stringify(damData, null, 2);`
`}`

**createCodeDisplay(jsonString)**
Creates the visual code display element:

`Purpose: Create Display`
`function createCodeDisplay(jsonString) {`
`const pre = document.createElement('pre');`
`const code = document.createElement('code');`
`pre.setAttribute('role', 'region');`
`pre.setAttribute('aria-label', 'DAM metadata JSON output');`
`pre.setAttribute('tabindex', '0');`
`code.textContent = jsonString;`
`pre.appendChild(code);`
`pre.className = 'dam-code';`
`return pre;`
`}`

### CSS Architecture

The dam block uses CSS variables for theming and responsive monospace display:

**CSS Variables:**

- `--dam-background` - Background color for code display (default: #f5f5f5)
- `--dam-text-color` - Text color for code (default: #333)
- `--dam-border-color` - Border color for container (default: #ddd)
- `--dam-padding` - Internal padding (default: 1rem)
- `--dam-margin` - External margin (default: 1rem)
- `--dam-font-family` - Font family (default: monospace)
- `--dam-font-size` - Font size (default: 14px)
- `--dam-line-height` - Line height (default: 1.5)
- `--dam-border-radius` - Border radius (default: 4px)

**Code Display:**

- `overflow-x: auto` - Horizontal scrolling for long lines
- `border-radius` - Rounded corners for modern appearance
- `border: 1px solid` - Subtle border for definition
- `focus-visible` outline - Clear keyboard focus indicator

### Data Flow

```
Markdown Table with Asset Data
    ↓
EDS Initial DOM (block.children = rows)
    ↓
decorate() function validates structure
    ↓
Extract header row, process data rows
    ↓
For each row: extract fields + image path
    ↓
createDamJson() generates JSON array
    ↓
createCodeDisplay() wraps in <pre><code>
    ↓
Replace block content with code display
    ↓
Final DOM: <div class="dam"><pre class="dam-code"><code>...</code></pre></div>
```

### Configuration Object

The `DAM_CONFIG` object centralizes all configuration:

`Configuration Object`
`const DAM_CONFIG = {`
`ERROR_MESSAGES: {`
`MISSING_IMAGE: 'Image element is missing or invalid',`
`JSON_PARSE: 'Error parsing DAM data',`
`INVALID_BLOCK: 'Invalid DAM block structure',`
`},`
`SELECTORS: {`
`IMAGE: 'img',`
`LINK: 'a',`
`},`
`CLASS_NAMES: {`
`CODE_WRAPPER: 'dam-code',`
`},`
`ARIA_LABELS: {`
`CODE_SECTION: 'DAM metadata JSON output',`
`ERROR_MESSAGE: 'Error in DAM block',`
`},`
`};`

**Why this pattern:**

- All configuration in one place at the top
- Easy to find and modify settings
- Facilitates translation and localization
- Improves maintainability

---

## Usage

### Basic Markdown Syntax

`Basic Usage`
`| DAM | Note | Description | Classification | Tag | Image | Additional Info |`
`| --- | ---- | ----------- | -------------- | --- | ----- | -------------- |`
`| | Profile | Headshot | Portrait | Profile | [Image URL] | Main photo |`
`| | Product | Item photo | Product | Catalog | [Image URL] | Featured |`

### Real-World Example

`Real Example`
`| DAM | Note | Description | Classification | Tag | Image | Additional Info |`
`| :---- | :---- | :---- | :---- | :---- | :---- | :---- |`
`| | Profile Image | Professional headshot | Portrait | Profile | https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png | Main profile photo |`
`| | Sample Art | Abstract artwork | Art | Gallery | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | Featured piece |`
`| | Nature Photo | Landscape view | Photography | Nature | https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg | Scenic vista |`

### Expected Output

The block generates a JSON array like this:

`JSON Output`
`[`
`{`
`"note": "Profile Image",`
`"description": "Professional headshot",`
`"classification": "Portrait",`
`"tag": "Profile",`
`"path": "/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png",`
`"additionalInfo": "Main profile photo"`
`},`
`{`
`"note": "Sample Art",`
`"description": "Abstract artwork",`
`"classification": "Art",`
`"tag": "Gallery",`
`"path": "/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png",`
`"additionalInfo": "Featured piece"`
`}`
`]`

---

## Content Structure

### Markdown Table Format

The DAM block requires a 7-column table structure:

| Column | Purpose | Required | Example |
|--------|---------|----------|---------|
| 1 | Block identifier (always "DAM") | Yes | DAM |
| 2 | Note/identifier | No | "Profile Image" |
| 3 | Description | No | "Professional headshot" |
| 4 | Classification | No | "Portrait" |
| 5 | Tag | No | "Profile" |
| 6 | Image URL | Yes | Image link or URL |
| 7 | Additional info | No | "Main profile photo" |

### Header Row

First row is always the header and is skipped during processing:

`Header Row`
`| DAM | Note | Description | Classification | Tag | Image | Additional Info |`
`| --- | ---- | ----------- | -------------- | --- | ----- | -------------- |`

### Data Rows

Each subsequent row becomes a JSON object in the output array. All fields are optional except the block identifier column.

### Image URL Formats

The block supports multiple image URL formats:

1. **Direct URL in cell**: `https://example.com/image.jpg`
2. **Markdown link**: `[Image](https://example.com/image.jpg)`
3. **Image element**: `![Alt text](https://example.com/image.jpg)`

The `extractPath()` function automatically extracts the pathname from any of these formats.

---

## Styling & Customization

### CSS Variable Overrides

Override default styles by setting CSS variables:

`Custom Styling`
`.dam {`
`--dam-background: #2d2d2d;`
`--dam-text-color: #f8f8f2;`
`--dam-border-color: #555;`
`--dam-font-family: 'Fira Code', monospace;`
`--dam-font-size: 16px;`
`--dam-border-radius: 8px;`
`}`

### Dark Mode Support

Create a dark theme variant:

`Dark Mode`
`@media (prefers-color-scheme: dark) {`
`.dam {`
`--dam-background: #1e1e1e;`
`--dam-text-color: #d4d4d4;`
`--dam-border-color: #3e3e3e;`
`}`
`}`

### Custom Code Styling

Add syntax highlighting or custom formatting:

`Syntax Highlighting`
`.dam-code code {`
`/* Add custom code styling */`
`font-weight: 400;`
`letter-spacing: 0.5px;`
`}`
`.dam-code code::selection {`
`background: rgba(100, 149, 237, 0.3);`
`}`

---

## Responsive Behavior

### Mobile (< 768px)

- Reduced padding: `calc(var(--dam-padding) / 2)`
- Horizontal scrolling enabled for wide JSON
- Font size defaults to `--dam-font-size` (14px)
- Touch-friendly scrolling

### Tablet (768px - 1024px)

- Standard padding and margins
- Comfortable reading width
- Horizontal scrolling as needed

### Desktop (> 1024px)

- Full padding: `var(--dam-padding)` (1rem)
- Maximum readability
- Horizontal scrolling for very wide content

### Scrolling Behavior

- `overflow-x: auto` - Horizontal scrolling for long lines
- `tabindex="0"` - Keyboard scrollable with arrow keys
- No fixed width - adapts to container

---

## Accessibility

### Semantic HTML

- `<pre>` element for preformatted code
- `<code>` element for code content
- Proper nesting and hierarchy

### ARIA Attributes

- `role="region"` - Identifies code section
- `aria-label="DAM metadata JSON output"` - Descriptive label
- `tabindex="0"` - Keyboard focusable
- `role="alert"` - Error message announcements

### Keyboard Navigation

- **Tab**: Focus on code block
- **Arrow Keys**: Scroll horizontally/vertically
- **Ctrl/Cmd + C**: Copy code content (browser default)

### Screen Reader Support

- ARIA labels announce purpose of code section
- Error messages use `role="alert"` for immediate announcement
- Semantic structure provides context

### Focus Management

- Visible focus outline with `outline: 2px solid`
- `outline-offset: 2px` for clear separation
- `:focus-visible` for keyboard-only focus indicator

---

## Performance

### Loading Characteristics

- **JavaScript Size**: ~2KB minified
- **CSS Size**: ~1KB minified
- **Execution Time**: < 10ms for typical content
- **No External Dependencies**: Zero HTTP requests

### Optimization Techniques

1. **Minimal DOM Manipulation**
   - Single content replacement operation
   - No complex DOM traversal
   - Efficient array mapping

2. **Efficient Data Extraction**
   - Array destructuring for field extraction
   - Optional chaining (`?.`) prevents errors
   - Single-pass processing of rows

3. **No External Libraries**
   - Native JSON.stringify for formatting
   - Native DOM APIs only
   - No polyfills required

### Best Practices

- Keep row count under 100 for optimal performance
- Use reasonable image URL lengths
- Avoid extremely long text in fields
- Consider pagination for large asset collections

---

## Browser Support

### Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Opera | 76+ | Full support |

### Required Features

- **ES6 Syntax**: Arrow functions, const/let, destructuring
- **Optional Chaining** (`?.`): Requires modern browser
- **Array Methods**: Array.from(), map(), slice()
- **URL API**: For pathname extraction
- **CSS Variables**: For theming
- **Flexbox**: For responsive behavior

### Polyfills

No polyfills required for supported browsers. For older browsers:

- Use Babel to transpile ES6 syntax
- Add optional chaining polyfill
- Use CSS custom property polyfill

---

## Troubleshooting

### Common Issues

**Issue: "Invalid DAM block structure" error**

- **Cause**: Missing table rows or invalid HTML structure
- **Solution**: Ensure markdown table has header row and at least one data row
- **Check**: Verify table syntax in markdown source

**Issue: Image paths not extracted**

- **Cause**: Image URL not in recognized format
- **Solution**: Use direct URL, markdown link, or image element
- **Check**: Inspect cell in browser DevTools to verify image element exists

**Issue: JSON not displaying**

- **Cause**: JavaScript error during decoration
- **Solution**: Check browser console for error messages
- **Check**: Verify block has class "dam" and proper structure

**Issue: Styling not applied**

- **Cause**: CSS file not loaded or variables not defined
- **Solution**: Verify dam.css is loaded in page head
- **Check**: Inspect element to see computed styles

**Issue: Text wrapping incorrectly**

- **Cause**: Long unbroken strings in JSON
- **Solution**: Use `word-break` CSS property
- **Check**: Add custom CSS for specific fields

### Debugging Tips

1. **Check Console Logs**
   - Look for error messages with stack traces
   - Verify block structure before decoration
   - Check extracted data values

2. **Inspect DOM Structure**
   - Verify block has correct class names
   - Check that rows are present before decoration
   - Inspect generated code element

3. **Validate Markdown**
   - Ensure proper table syntax
   - Check column alignment
   - Verify header row is present

4. **Test with Minimal Example**
   - Start with single row
   - Add complexity incrementally
   - Isolate problematic rows

---

## Testing

### Manual Testing

Use the provided test.html file:

`Test Command`
`# Start local development server`
`npm run debug`
`# Open browser to:`
`http://localhost:3000/blocks/dam/test.html`

### Test Scenarios

1. **Basic Functionality**
   - Single row with all fields
   - Multiple rows with varying data
   - Empty optional fields

2. **Image Path Extraction**
   - Direct image URLs
   - Markdown links
   - Image elements with picture tags

3. **Error Handling**
   - Empty block (no rows)
   - Missing columns
   - Invalid URLs

4. **Responsive Behavior**
   - Mobile viewport (375px)
   - Tablet viewport (768px)
   - Desktop viewport (1920px)

5. **Accessibility**
   - Keyboard navigation with Tab
   - Screen reader announcements
   - Focus indicators

### Automated Testing

For CI/CD integration:

`Automated Tests`
`// Unit test example`
`import decorate from './dam.js';`
`test('extracts image path from URL', () => {`
`const mockBlock = createMockBlock();`
`decorate(mockBlock);`
`const json = JSON.parse(mockBlock.textContent);`
`expect(json[0].path).toBe('/media_test.png');`
`});`

---

## Dependencies

### EDS Core Dependencies

- **aem.js**: Not required (no decorateIcons or other EDS utilities used)
- **styles.css**: Global styles for EDS site

### External Dependencies

- **None**: Block is completely self-contained
- No npm packages required
- No external JavaScript libraries
- No font dependencies (uses system monospace)

### Browser APIs Used

- `document.createElement()` - DOM element creation
- `JSON.stringify()` - JSON formatting
- `URL` constructor - Path extraction
- `querySelector()` - Element selection
- `Array.from()` - Array conversion

---

## Future Enhancements

### Planned Features

1. **Copy to Clipboard**
   - Add copy button above code display
   - Toast notification on successful copy
   - Keyboard shortcut support

2. **Syntax Highlighting**
   - Color-coded JSON properties
   - Syntax highlighting library integration
   - Theme customization options

3. **Export Functionality**
   - Download JSON as .json file
   - CSV export option
   - API integration for external tools

4. **Filtering and Search**
   - Client-side search within JSON
   - Filter by classification or tag
   - Highlight search results

5. **Sorting Options**
   - Sort by note, classification, or tag
   - Ascending/descending toggle
   - Multi-field sorting

6. **Advanced Metadata**
   - File size extraction
   - Image dimension detection
   - MIME type identification
   - Last modified dates

7. **Bulk Operations**
   - Select multiple assets
   - Batch edit metadata
   - Bulk export functionality

### Community Contributions

Contributions welcome! Please follow these guidelines:

1. Review existing code structure and patterns
2. Maintain EDS coding standards (Airbnb style guide)
3. Add tests for new features
4. Update documentation accordingly
5. Follow commit message conventions

### Performance Improvements

- Lazy loading for large asset lists
- Virtual scrolling for thousands of rows
- Debounced search/filter operations
- Pagination for massive datasets

---

## Related Blocks

- **markdown** - Display raw markdown content
- **raw** - Display raw HTML/text content
- **table** - Enhanced table display with sorting
- **fragment** - Include external content fragments

---

## Version History

- **1.0.0** (Current) - Initial release with core functionality
  - JSON generation from tabular data
  - Image path extraction
  - Error handling and validation
  - Accessible code display
  - Responsive design
  - CSS variable theming

---

## License

This block is part of the AllAboutV2 project and follows the project's licensing terms.

---

## Author

**Developer**: Tom Cranstoun
**Company**: tom
**Project**: AllAboutV2

---

## Support

For issues, questions, or contributions:

1. Check this documentation first
2. Review the EXAMPLE.md file for usage guidance
3. Test with test.html to isolate issues
4. Check browser console for error messages
5. Verify EDS core is properly configured
