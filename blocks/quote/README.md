# Quote Block

## Overview

The Quote block displays quotations with optional author attribution in a clean, semantically correct format using HTML `<blockquote>` elements. It automatically adds typographic quotation marks and proper citation markup.

## Features

- **Semantic HTML**: Uses proper `<blockquote>` and `<cite>` elements
- **Automatic Quotation Marks**: Styled curly quotes ("") added via CSS
- **Author Attribution**: Optional attribution with em-dash prefix
- **Citation Support**: Converts emphasized text to proper `<cite>` markup
- **Centered Layout**: Clean, centered design with max-width constraint
- **Responsive**: Works on all screen sizes
- **Simple Structure**: Two-cell format (quote + optional attribution)
- **Zero Configuration**: Works out of the box with sensible defaults

## Usage

### In Google Docs

**Basic quote (no attribution):**

```
| Quote |
|-------|
| This is a profound statement about development. |
```

**Quote with attribution:**

```
| Quote |
|-------|
| This is a profound statement about development. |
| Author Name |
```

**Quote with citation (use italic/em for author name):**

```
| Quote |
|-------|
| The best way to predict the future is to invent it. |
| *Alan Kay* |
```

### In HTML

The markdown tables above get transformed by EDS into this HTML structure:

```html
<div class="quote">
  <div>
    <div>This is a profound statement about development.</div>
  </div>
  <div>
    <div>Author Name</div>
  </div>
</div>
```

After the block's `decorate()` function runs, it becomes:

```html
<div class="quote">
  <blockquote>
    <div class="quote-quotation">
      <p>This is a profound statement about development.</p>
    </div>
    <div class="quote-attribution">
      <p><cite>Author Name</cite></p>
    </div>
  </blockquote>
</div>
```

## Behavior

### Quotation Processing

1. **First cell**: Contains the quote text
   - Wrapped in `.quote-quotation` class
   - If not already in a paragraph, wrapped in `<p>` tag
   - Typographic opening quote (") added before first paragraph
   - Typographic closing quote (") added after last paragraph
   - First paragraph has negative text-indent for hanging quote

2. **Second cell** (optional): Contains attribution
   - Wrapped in `.quote-attribution` class
   - If not already in a paragraph, wrapped in `<p>` tag
   - Em-dash (—) automatically prepended
   - Right-aligned text
   - Any emphasized (`<em>`) text converted to `<cite>` for semantic correctness

### Citation Markup

When you use italics/emphasis in the attribution cell, it's automatically converted to a proper `<cite>` element:

**Markdown input:**

```
| Quote |
|-------|
| Quote text here |
| *Author Name* |
```

**Becomes:**

```html
<cite>Author Name</cite>
```

This is semantically correct HTML for citing the author of a quotation.

## Styling

The block includes clean, minimal CSS:

### Layout

- **Max-width**: 700px
- **Padding**: 32px horizontal
- **Centering**: Automatic margin centering
- **Font size**: 120% of base font size for quotation

### Typography

- **Quotation marks**: Curly quotes ("") via CSS pseudo-elements
- **Attribution prefix**: Em-dash (—) automatically added
- **Alignment**: Quote left-aligned, attribution right-aligned
- **Indentation**: Negative indent on first paragraph for hanging quote mark

### Visual Structure

```
┌─────────────────────────────────────────────┐
│                                             │
│   "This is a profound statement about      │
│   development and best practices."         │
│                                             │
│                        —Author Name         │
│                                             │
└─────────────────────────────────────────────┘
```

## Customization

### Styling

Modify `quote.css` to customize:

**Colors:**

```css
.quote blockquote {
  color: var(--text-color, #333);
  border-left: 4px solid var(--accent-color, #667eea);
  padding-left: 2rem;
}
```

**Typography:**

```css
.quote blockquote .quote-quotation {
  font-size: 150%;  /* Larger quotes */
  font-style: italic;  /* Italic quotes */
  font-family: Georgia, serif;  /* Serif font */
}
```

**Layout:**

```css
.quote blockquote {
  max-width: 900px;  /* Wider quotes */
  padding: 2rem;  /* More spacing */
}
```

### Quote Marks

The quotation marks are added via CSS pseudo-elements. To change them:

```css
/* Use single quotes instead */
.quote blockquote .quote-quotation > :first-child::before {
  content: "'";
}

.quote blockquote .quote-quotation > :last-child::after {
  content: "'";
}

/* Remove quotes entirely */
.quote blockquote .quote-quotation > :first-child::before,
.quote blockquote .quote-quotation > :last-child::after {
  content: "";
}
```

## Use Cases

### Testimonials

```
| Quote |
|-------|
| Working with this team transformed our digital presence. |
| *Sarah Johnson, CEO at TechCorp* |
```

### Pull Quotes

Use within article content to highlight key statements:

```
| Quote |
|-------|
| The most important finding from our research was the impact of early intervention. |
```

### Citations

```
| Quote |
|-------|
| Programs must be written for people to read, and only incidentally for machines to execute. |
| *Structure and Interpretation of Computer Programs* |
```

### Inspirational Quotes

```
| Quote |
|-------|
| The best time to plant a tree was 20 years ago. The second best time is now. |
| *Chinese Proverb* |
```

## Development

### Local Testing

1. Start the development server:

   ```bash
   npm run debug
   ```

2. Open the test file:

   ```
   http://localhost:3000/blocks/quote/test.html
   ```

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (Chromium)
- Firefox
- Safari

Verify:

- Quotation marks display correctly
- Attribution appears with em-dash
- Text is properly centered
- Responsive layout works

## Accessibility

- **Semantic HTML**: Uses proper `<blockquote>` and `<cite>` elements
- **Screen readers**: Blockquote element announces content as a quotation
- **Citation markup**: Proper `<cite>` element for author attribution
- **Keyboard accessible**: No interactive elements, fully accessible by default
- **Visual indicators**: Clear visual distinction from surrounding content

## Performance

- **Minimal JavaScript**: Simple DOM manipulation only
- **No dependencies**: Pure vanilla JavaScript
- **Fast rendering**: Synchronous decoration (no async operations)
- **Small footprint**: ~30 lines of JavaScript, ~35 lines of CSS
- **No external resources**: All styling in local CSS file

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript (arrow functions, destructuring)
- CSS pseudo-elements (::before, ::after)
- No polyfills required

## Technical Details

### JavaScript Structure

The block uses a simple decoration pattern:

1. **Extract cells**: Gets quotation and attribution from block children
2. **Create blockquote**: Creates semantic `<blockquote>` element
3. **Process quotation**: Adds class, wraps in paragraph if needed
4. **Process attribution**: Adds class, wraps in paragraph, converts `<em>` to `<cite>`
5. **Replace content**: Replaces block content with decorated blockquote

### CSS Patterns

- **Pseudo-elements**: For quotation marks and em-dash
- **Text indentation**: Negative indent for hanging quote
- **Flexbox/alignment**: Right-aligned attribution
- **Max-width constraint**: Readable line length

## Common Issues

### Quotation marks not showing

**Cause**: CSS pseudo-elements not supported or overridden
**Solution**: Check browser support and inspect CSS cascade

### Attribution not right-aligned

**Cause**: CSS not loaded or conflicting styles
**Solution**: Verify `quote.css` is loaded and inspect computed styles

### Em/cite conversion not working

**Cause**: Content structure doesn't match expected format
**Solution**: Ensure attribution uses `<em>` or italic formatting in Google Docs

## Related Files

- **JavaScript**: `quote.js` - Block decoration logic
- **CSS**: `quote.css` - Block styles
- **Test**: `test.html` - Local development test file
- **Example**: `EXAMPLE.md` - Usage examples for authors

## Notes

- Part of Adobe's EDS block collection
- Not included in boilerplate, but commonly used
- Simple, reliable pattern for quotations
- No variations or configuration needed
- Semantic HTML ensures accessibility and SEO benefits

## Origin

This block is part of Adobe's standard EDS blocks collection. It's widely used across EDS projects for displaying quotations, testimonials, and pull quotes with proper semantic markup and accessible structure.
