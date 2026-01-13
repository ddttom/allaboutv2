# Footer Block - Usage Examples

The footer block is a document-level component that provides site-wide footer content. It is typically placed at the bottom of the page and is consistent across all pages.

## Note on Footer Block Usage

Unlike most content blocks, the footer block is typically not added to individual pages in EDS. Instead, it is:

1. **Automatically loaded** by the EDS framework as part of the page template
2. **Site-wide** - appears on all pages without explicit declaration
3. **Metadata-driven** - controlled by page metadata for custom footer paths

However, for documentation purposes, here are the markdown patterns if you need to explicitly add or test a footer block.

## Basic Usage

### Standard Footer

The footer block in its simplest form loads the default footer from `/footer`:

| Footer |
|--------|

### Custom Footer Path

To specify a custom footer document path, use metadata:

```
---
footer: /custom-footer
---
```

| Footer |
|--------|

### Regional Footer

For multi-language or regional sites, specify different footer documents:

```
---
footer: /footer/en-us
---
```

| Footer |
|--------|

## Footer Document Structure

The footer document (e.g., `/footer.md`) can contain any content structure. Here are common patterns:

### Simple Text Footer

`/footer.md`:

© 2024 Tom Cranstoun. All rights reserved.

[Privacy Policy](/privacy) | [Terms of Service](/terms) | [Contact](/contact)

### Multi-Column Footer

`/footer.md`:

| Company | Products | Support |
|---------|----------|---------|
| [About Us](/about)<br>[Team](/team)<br>[Careers](/careers)<br>[Press](/press) | [Product A](/products/a)<br>[Product B](/products/b)<br>[Pricing](/pricing)<br>[Roadmap](/roadmap) | [Help Center](/help)<br>[Documentation](/docs)<br>[API](/api)<br>[Status](/status) |

---

© 2024 Company Name. All rights reserved. | [Privacy](/privacy) | [Terms](/terms)

### Footer with Contact Information

`/footer.md`:

| About | Contact | Follow Us |
|-------|---------|-----------|
| **Company Name**<br>Leading provider of innovative solutions.<br><br>[Learn More](/about)<br>[Our Story](/story) | **Get in Touch**<br>Email: hello@company.com<br>Phone: (555) 123-4567<br>123 Main Street<br>City, State 12345 | [Facebook](https://facebook.com/company)<br>[Twitter](https://twitter.com/company)<br>[LinkedIn](https://linkedin.com/company)<br>[Instagram](https://instagram.com/company) |

---

© 2024 Company Name. All rights reserved.

### E-commerce Footer

`/footer.md`:

| Shop | Customer Service | Company | Connect |
|------|------------------|---------|---------|
| [New Arrivals](/shop/new)<br>[Best Sellers](/shop/bestsellers)<br>[Sale](/shop/sale)<br>[Gift Cards](/gifts)<br>[Collections](/collections) | [Order Tracking](/orders)<br>[Shipping & Delivery](/shipping)<br>[Returns & Exchanges](/returns)<br>[Size Guide](/sizing)<br>[FAQ](/faq) | [About Us](/about)<br>[Careers](/careers)<br>[Sustainability](/sustainability)<br>[Press](/press)<br>[Affiliate Program](/affiliates) | [Newsletter Signup](/newsletter)<br>[Instagram](https://instagram.com/store)<br>[Pinterest](https://pinterest.com/store)<br>[YouTube](https://youtube.com/store) |

---

Payment methods: Visa, Mastercard, American Express, PayPal, Apple Pay

© 2024 Store Name. All rights reserved. | [Privacy Policy](/privacy) | [Terms of Service](/terms) | [Cookie Policy](/cookies)

### Blog Footer

`/footer.md`:

| Categories | Popular Posts | About |
|------------|---------------|-------|
| [Web Development](/category/webdev)<br>[Design](/category/design)<br>[JavaScript](/category/javascript)<br>[CSS](/category/css)<br>[Performance](/category/performance) | [Getting Started with EDS](/posts/getting-started-eds)<br>[Building Custom Blocks](/posts/custom-blocks)<br>[Performance Optimization](/posts/performance)<br>[Accessibility Best Practices](/posts/a11y) | ![Profile](https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png)<br>**Tom Cranstoun**<br>Sharing thoughts on web development and design.<br>[About Me](/about)<br>[Contact](/contact) |

---

**Subscribe to Newsletter**

Get weekly updates on web development and design.

[Subscribe](/subscribe)

---

© 2024 Tom Cranstoun. All rights reserved. | [Privacy](/privacy) | [RSS Feed](/feed.xml)

### Documentation Site Footer

`/footer.md`:

| Documentation | Resources | Community | Legal |
|---------------|-----------|-----------|-------|
| [Getting Started](/docs/getting-started)<br>[Guides](/docs/guides)<br>[API Reference](/docs/api)<br>[Examples](/docs/examples)<br>[FAQ](/docs/faq) | [Blog](/blog)<br>[Tutorials](/tutorials)<br>[Videos](/videos)<br>[Downloads](/downloads)<br>[Changelog](/changelog) | [GitHub](https://github.com/org/repo)<br>[Discord](https://discord.gg/community)<br>[Forum](/forum)<br>[Contribute](/contribute)<br>[Code of Conduct](/code-of-conduct) | [License](/license)<br>[Privacy](/privacy)<br>[Terms](/terms)<br>[Security](/security) |

---

Built with [Adobe Edge Delivery Services](https://www.aem.live/)

© 2024 Project Name. Licensed under MIT. | [Edit this page](https://github.com/org/repo)

### Minimal Footer

`/footer.md`:

---

© 2024 Site Name. [Privacy](/privacy) | [Terms](/terms)

### Footer with Newsletter Signup

`/footer.md`:

| Quick Links | Newsletter |
|-------------|------------|
| [Home](/)<br>[About](/about)<br>[Services](/services)<br>[Blog](/blog)<br>[Contact](/contact) | **Stay Updated**<br>Subscribe to our newsletter for the latest news and updates.<br><br>[Subscribe Now](/subscribe) |

---

© 2024 Company Name. All rights reserved. | [Privacy Policy](/privacy) | [Terms of Service](/terms)

## Advanced Examples

### Footer with Embedded Blocks

You can include other blocks in your footer document:

`/footer.md`:

| Links | Social |
|-------|--------|
| [About](/about)<br>[Contact](/contact)<br>[Blog](/blog) | [Twitter](https://twitter.com)<br>[LinkedIn](https://linkedin.com)<br>[GitHub](https://github.com) |

| Cards |
|-------|
| https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
| https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg |
| https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg |

---

© 2024 Company Name. All rights reserved.

### Footer with Multiple Sections

`/footer.md`:

| Products | Solutions | Resources |
|----------|-----------|-----------|
| [Product Overview](/products)<br>[Features](/features)<br>[Pricing](/pricing)<br>[Integrations](/integrations) | [For Enterprise](/solutions/enterprise)<br>[For Small Business](/solutions/smb)<br>[For Developers](/solutions/developers)<br>[For Education](/solutions/education) | [Documentation](/docs)<br>[API Reference](/api)<br>[Blog](/blog)<br>[Case Studies](/case-studies) |

---

| Support | Company | Legal |
|---------|---------|-------|
| [Help Center](/help)<br>[Contact Support](/support)<br>[System Status](/status)<br>[Release Notes](/releases) | [About Us](/about)<br>[Careers](/careers)<br>[Press Kit](/press)<br>[Partners](/partners) | [Privacy Policy](/privacy)<br>[Terms of Service](/terms)<br>[Cookie Policy](/cookies)<br>[GDPR](/gdpr) |

---

**Trusted by over 10,000 companies worldwide**

© 2024 Company Name. All rights reserved. | Made with [Adobe Edge Delivery Services](https://www.aem.live/)

## Footer Document Locations

### Default Location

By default, the footer loads from `/footer`:

```
/footer.md
```

### Custom Locations

Specify custom paths via metadata:

```
/footer/corporate.md
/en-us/footer.md
/regions/europe/footer.md
```

## Metadata Configuration

### Setting Footer Path

In your page markdown, add metadata at the top:

```markdown
---
footer: /path/to/footer
---

# Page Title

Page content here...

| Footer |
|--------|
```

### Multiple Language Footers

```markdown
---
footer: /footer/en-gb
---

# UK Page

Content...

| Footer |
|--------|
```

## Responsive Behavior

The footer automatically adapts to viewport width based on your footer document structure:

### Mobile (< 768px typically)

- Stacks columns vertically
- Full-width layout
- Touch-friendly links
- Readable font sizes

### Desktop (>= 768px)

- Multi-column layout (if using tables)
- Horizontal navigation
- Optimized spacing
- Desktop-optimized typography

Note: Exact responsive behavior depends on your footer document structure and global CSS.

## Testing the Footer

To test the footer block in isolation, use the `test.html` file:

```bash
npm run debug
```

Then navigate to:

```
http://localhost:3000/blocks/footer/test.html
```

## Common Use Cases

### Corporate Website

```markdown
---
footer: /footer/corporate
---
```

Footer document (`/footer/corporate.md`):

| Company | Solutions | Support | Legal |
|---------|-----------|---------|-------|
| [About](/about)<br>[Leadership](/leadership)<br>[Investors](/investors)<br>[Press](/press) | [Enterprise](/solutions/enterprise)<br>[Mid-Market](/solutions/midmarket)<br>[Small Business](/solutions/smb) | [Help Center](/help)<br>[Contact](/contact)<br>[Professional Services](/services) | [Privacy](/privacy)<br>[Terms](/terms)<br>[Compliance](/compliance) |

---

© 2024 Corporate Inc. All rights reserved.

### SaaS Product

```markdown
---
footer: /footer/saas
---
```

Footer document (`/footer/saas.md`):

| Product | Resources | Company | Connect |
|---------|-----------|---------|---------|
| [Features](/features)<br>[Pricing](/pricing)<br>[Integrations](/integrations)<br>[Security](/security) | [Documentation](/docs)<br>[API](/api)<br>[Blog](/blog)<br>[Changelog](/changelog) | [About](/about)<br>[Careers](/careers)<br>[Contact](/contact) | [Twitter](https://twitter.com)<br>[GitHub](https://github.com)<br>[Discord](https://discord.gg) |

---

© 2024 SaaS Company. [Privacy](/privacy) | [Terms](/terms) | [Status](https://status.company.com)

### Portfolio/Personal Site

```markdown
---
footer: /footer/personal
---
```

Footer document (`/footer/personal.md`):

---

**Tom Cranstoun**

Web Developer & Designer

[About](/about) | [Projects](/projects) | [Blog](/blog) | [Contact](/contact)

[GitHub](https://github.com/tomcranstoun) | [LinkedIn](https://linkedin.com/in/tomcranstoun) | [Twitter](https://twitter.com/tomcranstoun)

© 2024 Tom Cranstoun. All rights reserved.

## Metadata Reference

| Metadata Key | Description | Example | Default |
|--------------|-------------|---------|---------|
| `footer` | Path to footer document | `/custom-footer` | `/footer` |

## Related Documentation

- [Fragment Block](../fragment/) - Used to load footer content
- [Header Block](../header/) - Companion block for site-wide navigation
- [README.md](./README.md) - Complete technical documentation

## Troubleshooting

### Footer doesn't appear

- Verify `/footer.md` exists or metadata `footer` path is correct
- Check browser console for fragment loading errors
- Ensure footer document is published

### Wrong footer displays

- Check page metadata for `footer` value
- Verify path doesn't include `.md` extension
- Ensure path starts with `/`

### Footer styling incorrect

- Check that `/blocks/footer/footer.css` is loading
- Verify global CSS variables are defined
- Inspect element to check applied classes

### Footer content truncated

- Verify footer document markdown is valid
- Check for unclosed tables or malformed markdown
- Test footer document independently
