# Spectrum Card Examples

This document provides examples for content authors on how to use the Spectrum Card block in Adobe Edge Delivery Services.

## Basic Usage

### Single Card

The simplest way to create a Spectrum card:

| spectrum-card |
| :------------ |
| https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
| Amazing Features |
| Discover incredible features that make our product stand out from the competition |
| Learn More |

This creates a single card with:
- Product image at the top
- Bold title text
- Descriptive paragraph
- Action button at the bottom

### Dynamic Card Loading

Load multiple cards from a data source:

| spectrum-card |
| :------------ |
| /products/query-index.json |

This will:
- Fetch card data from the query-index.json endpoint
- Render multiple cards automatically
- Apply numbered badges to each card
- Enable modal overlays for detailed content

## Content Structure Examples

### Product Showcase Card

| spectrum-card |
| :------------ |
| https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg |
| Professional Laptop |
| High-performance computing for demanding workflows with all-day battery life |
| View Specs |

### Team Member Profile Card

| spectrum-card |
| :------------ |
| https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png |
| John Doe |
| Senior Developer with 10+ years of experience in web technologies |
| View Profile |

### Service Offering Card

| spectrum-card |
| :------------ |
| https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg |
| Consulting Services |
| Expert guidance to transform your digital presence and drive growth |
| Get Started |

### Case Study Card

| spectrum-card |
| :------------ |
| https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg |
| ACME Corp Success |
| 300% increase in productivity using our integrated solution |
| Read Case Study |

## Page Integration Examples

### Marketing Page

`Marketing Content Page`
`# Our Products`
`Discover our innovative solutions that transform the way you work.`
`| spectrum-card |`
`| :------------ |`
`| https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |`
`| Enterprise Suite |`
`| Complete business solution with advanced features |`
`| Explore Features |`
`## Why Choose Us`
`Industry-leading technology with exceptional support.`

### Product Gallery Page

`Product Showcase`
`# Product Lineup`
`| spectrum-card |`
`| :------------ |`
`| /products/query-index.json |`
`Browse our complete product catalog with detailed specifications.`

### Team Page

`Team Directory`
`# Meet Our Team`
`Our talented professionals are here to help you succeed.`
`| spectrum-card |`
`| :------------ |`
`| https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png |`
`| Jane Smith |`
`| UX Designer passionate about creating delightful user experiences |`
`| View Bio |`

### Services Page

`Services Overview`
`# Our Services`
`Professional services tailored to your business needs.`
`| spectrum-card |`
`| :------------ |`
`| /services/query-index.json |`

## Query Index Structure

For dynamic card loading, create a query-index.xlsx file:

### Required Columns

| path | title | description | image | buttonText |
|------|-------|-------------|-------|------------|
| /products/laptop-pro | Laptop Pro | Professional performance for demanding workflows | /products/media/laptop.jpg | View Specs |
| /products/tablet-air | Tablet Air | Lightweight design meets powerful functionality | /products/media/tablet.jpg | Explore Features |
| /products/phone-max | Phone Max | Maximum performance in a compact design | /products/media/phone.jpg | See Details |

### Content Organization

`Directory Structure`
`/products/`
`├── laptop-pro.md`
`├── tablet-air.md`
`├── phone-max.md`
`├── query-index.xlsx`
`└── media/`
`    ├── laptop.jpg`
`    ├── tablet.jpg`
`    └── phone.jpg`

## Content Guidelines

### Image Requirements

**Dimensions**: Minimum 400px wide, 16:9 or 4:3 aspect ratio recommended
**Format**: WebP (recommended), PNG, or JPEG
**Size**: Under 500KB for optimal performance
**Quality**: High resolution for clarity, compressed for web

### Title Guidelines

**Length**: 2-6 words ideal
**Style**: Title case capitalization
**Clarity**: Clear and descriptive
**Action**: Use compelling language

**Good Examples**:
- "Professional Laptop"
- "Expert Consulting"
- "Customer Success Story"

**Avoid**:
- Very long titles that wrap multiple lines
- ALL CAPS text
- Special characters that may not display

### Description Guidelines

**Length**: 1-2 sentences, 15-25 words
**Focus**: Key benefits or value proposition
**Clarity**: Clear and compelling language
**Grammar**: Proper punctuation and spelling

**Good Examples**:
- "High-performance computing for demanding workflows with all-day battery life"
- "Expert guidance to transform your digital presence and drive growth"
- "300% increase in productivity using our integrated solution"

**Avoid**:
- Very long paragraphs
- Technical jargon without context
- Vague or generic descriptions

### Button Text Guidelines

**Length**: 1-3 words
**Action**: Use action verbs
**Clarity**: Clear what happens when clicked

**Good Examples**:
- "Learn More"
- "View Specs"
- "Get Started"
- "Read Story"
- "See Details"

**Avoid**:
- Generic "Click Here"
- Very long button text
- Unclear actions

## Advanced Usage Patterns

### Multi-Section Page

Combine cards with other content:

`Comprehensive Page`
`# Product Center`
`## Overview`
`Our innovative solutions for modern businesses.`
`| hero |`
`| :---- |`
`| Transform Your Business | Get Started |`
`## Featured Products`
`| spectrum-card |`
`| :------------ |`
`| /products/query-index.json |`
`## Customer Reviews`
`| cards |`
`| :---- |`
`| Testimonials | Success Stories | Case Studies |`

### Before and After Context

Provide helpful context around cards:

`Structured Content`
`# Solutions Catalog`
`## Browse Our Solutions`
`Find the perfect solution for your business needs.`
`### What You'll Find`
`- Enterprise software`
`- Cloud services`
`- Professional consulting`
`## Available Solutions`
`| spectrum-card |`
`| :------------ |`
`| /solutions/query-index.json |`
`## Need Help Choosing?`
`Contact our sales team for personalized recommendations.`

### Category Pages

Organize content by category:

`Category Structure`
`# Software Solutions`
`## Business Applications`
`| spectrum-card |`
`| :------------ |`
`| /software/business/query-index.json |`
`## Developer Tools`
`| spectrum-card |`
`| :------------ |`
`| /software/developer/query-index.json |`

## Use Case Examples

### E-Commerce Product Listing

| spectrum-card |
| :------------ |
| /shop/products/query-index.json |

**Query Index Content**:
| path | title | description | image | buttonText |
|------|-------|-------------|-------|------------|
| /shop/laptop-pro | Laptop Pro 16 | Professional laptop with M3 chip and 32GB RAM | /shop/media/laptop.jpg | Buy Now |
| /shop/wireless-mouse | Wireless Mouse | Ergonomic design with precision tracking | /shop/media/mouse.jpg | Add to Cart |

### Portfolio Showcase

| spectrum-card |
| :------------ |
| /portfolio/projects/query-index.json |

**Query Index Content**:
| path | title | description | image | buttonText |
|------|-------|-------------|-------|------------|
| /portfolio/website-redesign | Website Redesign | Modern responsive design for Fortune 500 client | /portfolio/media/web.jpg | View Project |
| /portfolio/mobile-app | Mobile App | Award-winning iOS app with 4.8 star rating | /portfolio/media/mobile.jpg | See Details |

### Knowledge Base

| spectrum-card |
| :------------ |
| /help/articles/query-index.json |

**Query Index Content**:
| path | title | description | image | buttonText |
|------|-------|-------------|-------|------------|
| /help/getting-started | Getting Started | Learn the basics in under 10 minutes | /help/media/start.jpg | Read Guide |
| /help/advanced-features | Advanced Features | Unlock powerful capabilities for power users | /help/media/advanced.jpg | Learn More |

## Spectrum Design Benefits

### Professional Appearance

Spectrum cards provide:
- **Consistent Design**: Adobe's design system ensures visual coherence
- **Enterprise Quality**: Professional appearance suitable for corporate sites
- **Brand Alignment**: Matches Adobe products and services
- **Modern Aesthetics**: Contemporary design patterns

### Accessibility Built-in

Spectrum components include:
- **Keyboard Navigation**: Full keyboard support out of the box
- **Screen Reader Support**: Tested with NVDA, JAWS, VoiceOver
- **ARIA Attributes**: Comprehensive accessibility markup
- **Focus Management**: Clear visual focus indicators

### Responsive Design

Cards automatically adapt to:
- **Desktop**: Full-width cards in grid layout
- **Tablet**: Responsive grid with appropriate spacing
- **Mobile**: Single column stacked layout
- **Large Screens**: Optimal multi-column layout

## Troubleshooting for Authors

### Cards Not Displaying

If cards don't appear:
1. Check that the block syntax is correct
2. Verify image URLs are absolute and accessible
3. Ensure all required rows are present
4. Check browser console for errors

### Images Not Showing

If images don't load:
1. Verify image URLs are correct
2. Check that images are published
3. Ensure proper file formats (WebP, PNG, JPEG)
4. Test image URLs in browser address bar

### Formatting Issues

If cards look incorrect:
1. Check that table structure is correct
2. Verify no extra blank rows
3. Ensure proper markdown syntax
4. Test in preview mode

### Dynamic Loading Issues

If query-index cards don't load:
1. Verify query-index.xlsx is published
2. Check that all required columns are present
3. Ensure paths are absolute and correct
4. Verify JSON endpoint is accessible

## Best Practices

### Content Creation

- **Consistent Images**: Use similar aspect ratios and quality
- **Concise Text**: Keep titles and descriptions brief
- **Clear Actions**: Use specific, action-oriented button text
- **Regular Updates**: Keep content fresh and relevant

### Image Optimization

- **Format**: Use WebP with fallback to PNG/JPEG
- **Compression**: Optimize images for web delivery
- **Dimensions**: Use appropriate sizes (not too large)
- **Alt Text**: Provide descriptive alt text in linked pages

### Performance

- **Limit Cards**: 10-20 cards per page optimal
- **Optimize Images**: Compress and resize images
- **Test Loading**: Verify load times on slow connections
- **Monitor Size**: Keep total page size reasonable

### Accessibility

- **Meaningful Titles**: Use descriptive card titles
- **Descriptive Text**: Provide clear descriptions
- **Button Clarity**: Clear button text indicating action
- **Test with Screen Readers**: Verify accessibility

## Technical Notes for Authors

### Browser Requirements

Works best on:
- Chrome 67+
- Firefox 63+
- Safari 12.1+
- Edge 79+

**Note**: Requires modern browser with Web Components support

### Mobile Considerations

- Cards stack vertically on small screens
- Touch-friendly button sizes
- Responsive images adapt to screen size
- Optimized for mobile performance

### Content Publishing

1. Create card content in document
2. Add images to DAM or media folder
3. Publish individual pages (for dynamic loading)
4. Publish query-index.xlsx (for dynamic loading)
5. Verify cards display correctly

## Support

For questions about using Spectrum Card:
- See [Block Documentation](README.md) for technical details
- Check browser console for error messages
- Verify content structure matches examples
- Contact support for assistance

## Framework Information

### Why Spectrum?

The Spectrum Card block uses Adobe Spectrum for:
- **Professional Design**: Enterprise-grade design system
- **Accessibility**: Built-in accessibility features
- **Consistency**: Matches Adobe product ecosystem
- **Quality**: Battle-tested components
- **Support**: Well-documented and maintained

### Author Benefits

As a content author, you benefit from:
- **Easy Creation**: Simple table structure
- **Professional Appearance**: High-quality design
- **Accessibility**: Built-in for all users
- **Consistency**: Matches Adobe standards
- **Reliability**: Tested components
