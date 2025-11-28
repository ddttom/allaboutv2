# Footer Block

## Overview

The footer block provides site-wide footer functionality with fragment-based content loading. It is typically placed at the bottom of the page and is consistent across all pages.

## Features

- **Fragment-based loading** - Loads footer content from `/footer` or custom path via metadata
- **Centralized content management** - Footer content maintained in a single document
- **Flexible structure** - Supports any content layout via fragment document
- **Responsive design** - Adapts to all viewport sizes
- **Minimal footprint** - Lightweight implementation using fragment pattern
- **Site-wide consistency** - Same footer content across all pages

## Usage

The footer block is typically placed at the bottom of the page and loads footer content from a separate document.

### Basic Implementation

In your document, add:

```markdown
| Footer |
|--------|
```

### Custom Footer Path

To specify a custom footer document, add metadata:

```markdown
---
footer: /custom-footer
---
```

### Regional Footer

For multi-language or regional sites, specify different footer documents:

```markdown
---
footer: /footer/en-us
---
```

## Footer Content Structure

The footer document (e.g., `/footer`) can contain any content structure you need. Common patterns include:

### Simple Footer

```markdown
© 2024 Company Name. All rights reserved.

[Privacy Policy](/privacy) | [Terms of Service](/terms)
```

### Multi-Column Footer

```markdown
| Company | Products | Resources | Legal |
|---------|----------|-----------|-------|
| [About Us](/about)<br>[Careers](/careers)<br>[Contact](/contact) | [Product A](/product-a)<br>[Product B](/product-b)<br>[Pricing](/pricing) | [Blog](/blog)<br>[Documentation](/docs)<br>[Support](/support) | [Privacy](/privacy)<br>[Terms](/terms)<br>[Cookies](/cookies) |

---

© 2024 Company Name. All rights reserved.
```

### Footer with Social Links

```markdown
| Company | Connect |
|---------|---------|
| **Company Name**<br>123 Street<br>City, State 12345<br>contact@company.com | [Facebook](https://facebook.com/company)<br>[Twitter](https://twitter.com/company)<br>[LinkedIn](https://linkedin.com/company) |

---

© 2024 Company Name. All rights reserved. | [Privacy Policy](/privacy) | [Terms of Service](/terms)
```

## Document-Level Operations

⚠️ **This block uses standard EDS patterns and does not require global selectors.**

This block:
1. **Loads footer content via fragment pattern** - Uses `loadFragment()` from fragment block
2. **Appends to block element** - Standard EDS block decoration
3. **No global side effects** - All operations scoped to block element

Unlike the header block, the footer does not need to control document-level behavior like body scrolling or global keyboard events.

## Configuration

### Footer Path

Default footer path is `/footer`. Override via metadata:

```markdown
---
footer: /path/to/custom-footer
---
```

### Styling

The footer uses CSS variables from global styles:
- `--light-color` - Background color (from `/styles/styles.css`)
- `--body-font-size-s` - Font size (from `/styles/styles.css`)

Override in your theme or custom styles as needed.

## Accessibility

The footer block implements accessibility best practices:

- **Semantic HTML** - Uses `<footer>` landmark element
- **Readable text** - Appropriate font sizes and contrast ratios
- **Keyboard accessible** - All links are keyboard navigable with Tab key
- **Screen reader friendly** - Footer content properly announced by screen readers
- **Focus indicators** - Visible focus states on interactive elements

## Browser Support

- **Modern browsers** - Chrome, Firefox, Safari, Edge (last 2 versions)
- **ES6 modules** - Requires module support
- **Fragment loading** - Uses EDS fragment pattern
- **CSS Grid/Flexbox** - Modern layout support (depends on footer content structure)

## Customization

### Styling

Edit `/blocks/footer/footer.css` to customize:

- Background color (default: `var(--light-color)`)
- Font size (default: `var(--body-font-size-s)`)
- Padding and spacing (default: `2rem`)
- Maximum width (default: `1200px`)
- Text alignment and layout

### Behavior

Edit `/blocks/footer/footer.js` to customize:

- Default footer path (default: `/footer`)
- Fragment loading behavior
- Content transformation
- Additional decoration logic

## Related Blocks

- **[Fragment Block](../fragment/)** - Used to load footer content
- **[Header Block](../header/)** - Companion block for site-wide navigation

## Performance

- **Fragment loading** - Footer loads asynchronously
- **Minimal JavaScript** - Simple implementation with small footprint
- **CSS-driven layout** - Uses CSS for responsive behavior
- **Cached content** - Fragment content cached by browser

## Security

- **No inline scripts** - All JavaScript in external modules
- **Sanitized content** - Fragment content is safely parsed
- **No user input** - Footer content is static from fragment document
- **Content Security Policy compatible** - No eval or inline scripts

## Troubleshooting

### Footer doesn't appear

- Check that `/footer` document exists
- Verify footer document has content
- Check browser console for fragment loading errors
- Ensure footer path is correct (check metadata if using custom path)

### Footer content incorrect

- Verify the correct footer document is being loaded
- Check metadata `footer` value if using custom path
- Ensure footer fragment path doesn't have `.md` extension
- Check that fragment document is published and accessible

### Styling issues

- Verify `/blocks/footer/footer.css` is loading correctly
- Check that global CSS variables are defined in `/styles/styles.css`
- Inspect element in DevTools to verify classes are applied
- Ensure footer fragment content uses proper markup

### Fragment not loading

- Check network tab in DevTools for 404 errors
- Verify fragment path starts with `/`
- Ensure fragment document exists at `{path}.plain.html`
- Check console for JavaScript errors from fragment block

## Examples

### Basic Footer

```markdown
| Footer |
|--------|
```

### Footer with Custom Path

```markdown
---
footer: /footer/corporate
---

| Footer |
|--------|
```

### Regional Footer

```markdown
---
footer: /footer/en-gb
---

| Footer |
|--------|
```

## Technical Details

### DOM Structure

Generated DOM structure:

```html
<div class="footer block">
  <div>
    <!-- Footer fragment content inserted here -->
    <!-- Structure depends on footer document content -->
  </div>
</div>
```

### Class Names

- `.footer` - Block wrapper (automatically added by EDS)
- `.footer > div` - Footer content container

Additional classes depend on the content structure in the footer fragment document.

### Metadata Reference

| Metadata Key | Description | Example |
|--------------|-------------|---------|
| `footer` | Path to footer document | `/custom-footer` |

### Fragment Loading Process

1. Block checks for `footer` metadata
2. Falls back to `/footer` if no metadata
3. Calls `loadFragment(footerPath)` from fragment block
4. Fragment block fetches `{footerPath}.plain.html`
5. Fragment content is decorated and blocks are loaded
6. Decorated content is appended to footer block
7. Footer block is displayed

## Footer Content Patterns

### Corporate Footer

```markdown
| About | Products | Support | Legal |
|-------|----------|---------|-------|
| [Company](/company)<br>[Leadership](/leadership)<br>[News](/news) | [Solutions](/solutions)<br>[Industries](/industries)<br>[Partners](/partners) | [Help Center](/help)<br>[Documentation](/docs)<br>[Contact](/contact) | [Privacy](/privacy)<br>[Terms](/terms)<br>[Security](/security) |

---

© 2024 Company Name. All rights reserved. | [Sitemap](/sitemap)
```

### E-commerce Footer

```markdown
| Shop | Customer Service | Company | Follow Us |
|------|------------------|---------|-----------|
| [New Arrivals](/new)<br>[Best Sellers](/bestsellers)<br>[Sale](/sale)<br>[Gift Cards](/gifts) | [Order Status](/orders)<br>[Shipping Info](/shipping)<br>[Returns](/returns)<br>[Size Guide](/sizing) | [About Us](/about)<br>[Careers](/careers)<br>[Sustainability](/sustainability) | [Instagram](https://instagram.com)<br>[Facebook](https://facebook.com)<br>[Twitter](https://twitter.com) |

---

© 2024 Store Name. All rights reserved. | [Privacy Policy](/privacy) | [Terms](/terms)

Payment methods accepted: Visa, MasterCard, American Express, PayPal
```

### Blog Footer

```markdown
| Categories | Popular Posts | About |
|------------|---------------|-------|
| [Technology](/category/tech)<br>[Design](/category/design)<br>[Business](/category/business)<br>[Lifestyle](/category/lifestyle) | [Top 10 Tips](/posts/top-10-tips)<br>[Getting Started Guide](/posts/getting-started)<br>[Advanced Techniques](/posts/advanced) | **Blog Name**<br>Sharing insights and stories.<br>[About the Author](/about)<br>[Contact](/contact) |

---

Subscribe to newsletter: [Subscribe](/subscribe)

© 2024 Blog Name. All rights reserved.
```

### Minimal Footer

```markdown
© 2024 Site Name. All rights reserved.

[Privacy](/privacy) | [Terms](/terms) | [Contact](/contact)
```

## Implementation Notes

### Fragment Pattern

The footer block relies on the fragment block pattern:

- Fragment block handles content fetching
- Fragment block decorates loaded content
- Fragment block loads any nested blocks
- Footer block simply appends the result

This separation of concerns keeps the footer block simple and maintainable.

### Metadata Precedence

The footer path is determined by:

1. Page metadata `footer` value (if present)
2. Default path `/footer` (if no metadata)

There is no global configuration - each page can specify its own footer path if needed.

### Content Updates

To update footer content:

1. Edit the footer document (e.g., `/footer.md`)
2. Publish the document
3. Changes appear automatically on all pages using that footer
4. No need to edit individual pages

This centralized approach makes site-wide footer updates efficient.

## Version History

- **Initial Release** - Basic fragment-based footer loading
- **Current** - Stable implementation with comprehensive documentation
