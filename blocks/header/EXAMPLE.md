# Header Block - Usage Examples

The header block is a document-level component that provides site-wide navigation. It is typically placed at the top of the page and is consistent across all pages.

## Note on Header Block Usage

Unlike most content blocks, the header block is typically not added to individual pages in EDS. Instead, it is:

1. **Automatically loaded** by the EDS framework as part of the page template
2. **Site-wide** - appears on all pages without explicit declaration
3. **Metadata-driven** - controlled by page metadata for custom navigation paths

However, for documentation purposes, here are the markdown patterns if you need to explicitly add or test a header block.

## Basic Usage

### Standard Header

The header block in its simplest form loads the default navigation from `/nav`:

| Header |
|--------|

### Custom Navigation Path

To specify a custom navigation document path, use metadata:

---

nav: /custom-nav
---

| Header |
|--------|

### Regional Navigation

For multi-language or regional sites, specify different navigation documents:

---

nav: /navigation/en-us
---

| Header |
|--------|

## Navigation Document Structure

The navigation document (e.g., `/nav.md`) should be a separate markdown file with three columns:

### Basic Navigation Document

| Brand | Sections | Tools |
|-------|----------|-------|
| ![Logo](/images/logo.png) | - [Home](/)<br>- [About](/about)<br>- [Contact](/contact) | [Search](/search) |

### Navigation with Dropdowns

For dropdown menus, use nested lists in the Sections column:

| Brand | Sections | Tools |
|-------|----------|-------|
| ![Logo](/images/logo.png) | - [Products](/products)<br>  - [Software](/products/software)<br>  - [Hardware](/products/hardware)<br>- [Services](/services)<br>  - [Consulting](/services/consulting)<br>  - [Support](/services/support)<br>- [About](/about) | - [Search](/search)<br>- [Login](/login) |

### Multiple Dropdown Sections

| Brand | Sections | Tools |
|-------|----------|-------|
| ![Company](/images/brand.png) | - [Products](/products)<br>  - [Category A](/products/a)<br>  - [Category B](/products/b)<br>  - [Category C](/products/c)<br>- [Solutions](/solutions)<br>  - [Enterprise](/solutions/enterprise)<br>  - [Small Business](/solutions/smb)<br>- [Resources](/resources)<br>  - [Blog](/blog)<br>  - [Docs](/docs)<br>  - [Support](/support)<br>- [Company](/company)<br>  - [About](/about)<br>  - [Careers](/careers)<br>  - [Contact](/contact) | - [Search](/search)<br>- [Account](/account)<br>- [Cart](/cart) |

## Advanced Examples

### Brand with Logo and Text

| Brand | Sections | Tools |
|-------|----------|-------|
| [![Company Logo](/images/logo.png)](/)<br>**Company Name** | - [Home](/)<br>- [Products](/products)<br>- [Contact](/contact) | [Sign In](/signin) |

### Navigation with Icons

| Brand | Sections | Tools |
|-------|----------|-------|
| ![Logo](/images/logo.svg) | - [Home](/)<br>- [Products](/products)<br>- [About](/about) | - [:mag: Search](/search)<br>- [:bust_in_silhouette: Account](/account) |

### Minimal Navigation

For landing pages or simple sites:

| Brand | Sections | Tools |
|-------|----------|-------|
| **Site Name** | - [Features](/features)<br>- [Pricing](/pricing) | [Sign Up](/signup) |

### E-commerce Navigation

| Brand | Sections | Tools |
|-------|----------|-------|
| ![Store](/images/store-logo.png) | - [Shop](/shop)<br>  - [New Arrivals](/shop/new)<br>  - [Men](/shop/men)<br>  - [Women](/shop/women)<br>  - [Sale](/shop/sale)<br>- [Collections](/collections)<br>- [About](/about) | - [Search](/search)<br>- [Account](/account)<br>- [Cart (0)](/cart) |

### Documentation Site Navigation

| Brand | Sections | Tools |
|-------|----------|-------|
| ![Docs](/images/docs-logo.svg)<br>Documentation | - [Getting Started](/docs/getting-started)<br>- [Guides](/docs/guides)<br>  - [Installation](/docs/guides/installation)<br>  - [Configuration](/docs/guides/configuration)<br>  - [Deployment](/docs/guides/deployment)<br>- [API Reference](/docs/api)<br>- [Examples](/docs/examples) | - [Search](/search)<br>- [GitHub](https://github.com/org/repo) |

## Navigation Document Locations

### Default Location

By default, the header loads from `/nav`:

```
/nav.md
```

### Custom Locations

Specify custom paths via metadata:

```
/navigation/main-nav.md
/en-us/navigation.md
/docs/doc-nav.md
```

## Responsive Behavior

The header automatically adapts to viewport width:

### Mobile (< 900px)

- Hamburger menu icon appears
- Full-screen navigation overlay
- Vertical layout
- All dropdowns expanded by default
- Body scroll locked when menu is open

### Desktop (>= 900px)

- Horizontal navigation bar
- Hover-based dropdown menus
- Click to open/close dropdowns
- Only one dropdown open at a time
- No scroll locking

## Accessibility Features

The header implements WCAG 2.1 Level AA accessibility:

- **Keyboard Navigation**: Full keyboard access with Tab, Enter, Space, Escape
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators and logical tab order
- **Mobile**: Touch-friendly targets (minimum 44x44px)

## Testing the Header

To test the header block in isolation, use the `test.html` file:

```bash
npm run debug
```

Then navigate to:

```
http://localhost:3000/blocks/header/test.html
```

## Common Use Cases

### Corporate Website

```markdown
---
nav: /navigation/corporate
---
```

Navigation document (`/navigation/corporate.md`):

| Brand | Sections | Tools |
|-------|----------|-------|
| ![Corp](/logo.png) | - [Solutions](/solutions)<br>- [Industries](/industries)<br>- [Resources](/resources)<br>- [Company](/company) | [Contact](/contact) |

### SaaS Product

```markdown
---
nav: /navigation/saas
---
```

Navigation document (`/navigation/saas.md`):

| Brand | Sections | Tools |
|-------|----------|-------|
| ![Product](/product-logo.svg) | - [Features](/features)<br>- [Pricing](/pricing)<br>- [Customers](/customers)<br>- [Docs](/docs) | - [Login](/login)<br>- [Start Free Trial](/signup) |

### Blog

```markdown
---
nav: /navigation/blog
---
```

Navigation document (`/navigation/blog.md`):

| Brand | Sections | Tools |
|-------|----------|-------|
| **Blog Name** | - [Latest](/blog)<br>- [Categories](/categories)<br>  - [Technology](/category/tech)<br>  - [Design](/category/design)<br>  - [Business](/category/business)<br>- [About](/about) | - [Search](/search)<br>- [Subscribe](/subscribe) |

## Metadata Reference

| Metadata Key | Description | Example |
|--------------|-------------|---------|
| `nav` | Path to navigation document | `/custom-nav` |

## Related Documentation

- [Fragment Block](../fragment/) - Used to load navigation content
- [Footer Block](../footer/) - Companion block for site-wide footer
- [README.md](./README.md) - Complete technical documentation

## Troubleshooting

### Navigation doesn't appear

- Verify `/nav.md` exists or metadata `nav` path is correct
- Check browser console for fragment loading errors
- Ensure navigation document has proper three-column structure

### Dropdowns don't work

- Desktop: Verify nested list structure in markdown
- Check that nested items are indented under parent
- Verify JavaScript is enabled

### Mobile menu doesn't open

- Check viewport width is below 900px
- Verify hamburger button is clickable
- Check browser console for errors

### Custom navigation path not working

- Verify metadata syntax: `nav: /path` (no quotes, no .md extension)
- Ensure custom navigation document exists
- Check that path starts with `/`
