---
title: "Tags Block - Google Docs Example"
description: "Usage examples for the tags EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Tags Block - Google Docs Example

## How to Use in Google Docs

### Basic Usage

The tags block displays metadata-driven tags that are automatically populated from the page's metadata. Simply add the block to your page:

| Tags |
|------|

The block will automatically:

- Read the page metadata from `window.siteConfig`
- Display Content Technology tag (if defined)
- Display Category tag (if defined)
- Only render if at least one metadata value exists

### Metadata Configuration

Tags are populated from page metadata defined at the bottom of your Google Doc:

| metadata        | value                    |
|:--------------- |:------------------------ |
| title           | My Article Title         |
| description     | Article description      |
| contenttechnology | AEM                    |
| category        | Tutorial                 |

**Supported Metadata Keys:**

- `contenttechnology` - Displayed as primary tag (red border, left position)
- `category` - Displayed as secondary tag (blue border, right position)

### Expected Output

When you use this block with metadata defined, it will render:

```
┌─────────────────────────────────┐
│  [AEM]  [Tutorial]              │
└─────────────────────────────────┘
```

- **AEM** - Red bordered tag (contenttechnology)
- **Tutorial** - Blue bordered tag (category)

## Visual Examples

### Example 1: Both Tags Present

**Google Doc Metadata:**

```
| metadata        | value          |
|:--------------- |:-------------- |
| contenttechnology | Edge Delivery |
| category        | Guide          |
```

**Rendered Output:**

```
[Edge Delivery]  [Guide]
```

### Example 2: Only Content Technology

**Google Doc Metadata:**

```
| metadata        | value          |
|:--------------- |:-------------- |
| contenttechnology | JavaScript   |
```

**Rendered Output:**

```
[JavaScript]
```

### Example 3: Only Category

**Google Doc Metadata:**

```
| metadata        | value          |
|:--------------- |:-------------- |
| category        | Blog Post      |
```

**Rendered Output:**

```
[Blog Post]
```

### Example 4: No Metadata

If neither `contenttechnology` nor `category` is defined, the block will not render any output (block remains empty).

## Common Usage Patterns

### In Article Headers

Place the tags block near the top of your content to categorize the article:

| Tags |
|------|

# Article Title

Your article content starts here...

### In Card Layouts

Tags work well with card-based layouts to show content categories:

| Tags |
|------|

## Card Title

Card description and content...

### In Blog Posts

Use tags to show post categories and technologies:

| Tags |
|------|

# Blog Post Title

**Published:** November 2025

Blog post content...

## Styling Notes

- Tags use CSS variables for theming
- Primary tag (contenttechnology): `--color-heart-red`
- Secondary tag (category): `--color-dark-blue`
- Responsive design with proper spacing
- Text is automatically capitalized

## Notes for Authors

- **Zero Configuration**: Just add the block, tags populate from metadata
- **Automatic Display**: Block only appears if metadata is present
- **No Manual Updates**: Edit page metadata to update tags
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessible**: Semantic HTML with proper styling

## Common Issues

### Tags Not Appearing

**Problem:** Block is present but no tags display

**Solutions:**

- Verify metadata table exists at bottom of Google Doc
- Check spelling: use `contenttechnology` and `category` (lowercase, no spaces)
- Ensure metadata values are not empty
- Publish the page and clear cache

### Wrong Tag Colors

**Problem:** Tags appear but colors are incorrect

**Solution:**

- Verify CSS variables are defined in your theme
- Check `--color-heart-red` for primary tag
- Check `--color-dark-blue` for secondary tag

### Tags Not Updating

**Problem:** Changed metadata but tags still show old values

**Solution:**

- Republish the page in Google Docs
- Clear browser cache
- Check that `window.siteConfig` is loading correctly

## For Developers

### Metadata Access

Tags are read from the global configuration object:

`JavaScript Example`
`// Content technology tag`
`const techTag = window.siteConfig['$meta:contenttechnology$'];`
`// Category tag`
`const categoryTag = window.siteConfig['$meta:category$'];`

### CSS Customization

To customize tag appearance, override these CSS variables:

`CSS Variables`
`:root {`
`--color-heart-red: #e74c3c;`
`--color-dark-blue: #2c3e50;`
`--spacing-s: 1rem;`
`--spacing-xxs: 0.25rem;`
`--heading-font-size-xs: 0.875rem;`
`}`

### HTML Structure

The block generates this structure:

`HTML Output`
`<div class="tags block">`
`<span class="card-tag">Edge Delivery</span>`
`<span class="card-tag alt">Tutorial</span>`
`</div>`

## Advanced Usage

### Dynamic Filtering

Tags can be used with JavaScript to filter content:

`Filter by Tag Example`
`const filterByTag = (tag) => {`
`const cards = document.querySelectorAll('.card');`
`cards.forEach(card => {`
`const tagBlock = card.querySelector('.tags');`
`const hasTag = tagBlock?.textContent.includes(tag);`
`card.style.display = hasTag ? 'block' : 'none';`
`});`
`};`

### Tag Analytics

Track which tags are most popular:

`Analytics Example`
`const trackTags = () => {`
`const allTags = document.querySelectorAll('.card-tag');`
`allTags.forEach(tag => {`
`tag.addEventListener('click', () => {`
`console.log('Tag clicked:', tag.textContent);`
`});`
`});`
`};`

| metadata        |                                                                 |
| :-------------- | :-------------------------------------------------------------- |
| title           | Tags Block Examples                                             |
| description     | Examples demonstrating the Tags block with various metadata configurations |
| json-ld         | article                                                         |
| author          | Tom Cranstoun                                                   |
| contenttechnology | EDS                                                           |
| category        | Documentation                                                   |
| longdescription | This page demonstrates various usage examples of the Tags block, showing how it reads metadata and displays content technology and category tags. Includes configuration examples, troubleshooting, and developer customization options. |
