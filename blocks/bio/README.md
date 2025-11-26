# Bio Block

The bio block displays author information with an image and bio text. It supports automatic image link conversion, responsive layouts, and multiple variants.

## How It Works

The `decorate` function takes a `block` parameter and performs the following steps:

**🔴 CRITICAL:** All DOM queries use the `block` parameter to ensure proper scoping when multiple bio blocks exist on the same page. Never use `document.querySelector('.bio')` - always query from the `block` parameter.

## Processing Logic

If the bio block doesn't have the class 'hide-author', the function performs both image link processing and author name extraction:

### Image Link Processing

The block automatically converts image links to actual images:

1. **Image Link Detection**: The function checks if the first cell of the bio block contains a link to an image file.

2. **Image Link Conversion**: If a link pointing to an image file (.jpg, .jpeg, .png, .gif, .webp, .svg) is found, it automatically replaces the link element with an actual `<img>` element using `.replaceWith()`, preserving the link's text content as the image's `alt` attribute.

**Why `.replaceWith()`?**
- **Surgical precision**: Only replaces the link element, not the entire cell
- **Atomic operation**: Single DOM mutation is more efficient
- **Preserves siblings**: Other content in the cell remains intact
- **Modern best practice**: Follows patterns used in other EDS blocks

### Author Name Processing

The block extracts and displays the author's name:

1. **Search for image**: Queries for an `<img>` element within the current block using `block.querySelector('img')`.

2. **Extract from alt attribute**: If the `<img>` element is found and has a non-empty `alt` attribute, the function extracts the author name from the `alt` attribute (highest priority).

3. **Fallback to meta tag**: If the author name is not found in the `alt` attribute or if the `<img>` element doesn't exist, the function looks for a `<meta>` tag with the `name` attribute set to `"author"`. If found, it retrieves the author name from the `content` attribute of the `<meta>` tag.

4. **Create author element**: The function creates a new `<strong>` element and sets its text content to the author name.

5. **Append to block**: The function appends the newly created `<strong>` element containing the author name as the last child of the current block using `block.appendChild(authorElement)`.

**Author name priority:**
1. Image `alt` attribute (recommended)
2. Page `<meta name="author">` tag (fallback)

## Variants

### Default (Standard)
Standard bio block with image, text, and author name.

```
| bio                                    |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://example.com/author-image.jpg   | Jane Doe is a senior developer with 10 years experience. |
```

### Hide Author (`hide-author`)
Does NOT convert image links or add author name.

```
| bio (hide-author)                      |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://example.com/author-image.jpg   | Brief bio without author name displayed below.            |
```

**Important:** When `hide-author` class is present:
- Image links remain as links (not converted to images)
- No author name is added to the block

### Highlighted (`highlighted`)
Adds a 2px blue border around the image.

```
| bio (highlighted)                      |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://example.com/vip-author.jpg     | Dr. Emily Roberts is the lead researcher in AI.          |
```

## Mobile Responsiveness

The bio block includes responsive CSS that:
- **Desktop (>768px)**: 80px circular images, horizontal layout, 20px gap
- **Tablet (≤768px)**: 60px circular images, vertical layout, 15px gap
- **Mobile (≤480px)**: 50px circular images, vertical centered layout, 12px gap

## Expression Processing

The block supports dynamic expressions through the expressions plugin. If a `.bio-wrapper` element exists (in production), expressions are processed on that wrapper.

**Supported expressions:**
- `{{expand,$NAMESPACE:VARIABLE$}}` - Expands profile variables

**Requirements:**
- `$system:enableprofilevariables$` must be set to 'y'
- Profile variables must be defined

**Note:** The expressions plugin is optional. If the wrapper doesn't exist (e.g., in test environments), the block functions normally without expression processing.

## Testing

Test the bio block using:
- **Test file**: [test.html](test.html) - Comprehensive test suite with 7 test cases
- **Test script**: [/tmp/test_bio_block.py](/tmp/test_bio_block.py) - Automated Playwright tests
- **Examples**: [EXAMPLE.md](EXAMPLE.md) - Google Docs authoring examples

### Running Tests

```bash
# Start debug server
npm run debug

# Open test page in browser
open http://localhost:3000/blocks/bio/test.html

# Run automated tests (requires Playwright)
python /tmp/test_bio_block.py
```

## Common Issues

### Image links not converting
- **Cause**: Using `hide-author` class or link doesn't end in image extension
- **Fix**: Remove `hide-author` class or ensure link ends in .jpg, .png, etc.

### Multiple blocks showing same content
- **Cause**: Using global selectors (`document.querySelector('.bio')`) in decorate function
- **Fix**: Always use `block.querySelector()` to query within the current block

### No author name appears
- **Cause**: Image has no alt text and no meta tag on page
- **Fix**: Add alt text to image or add `<meta name="author" content="Name">` to page head

## Related Documentation

- **[Complete examples](EXAMPLE.md)** - Google Docs authoring guide with best practices
- **[EDS Block Guide](../../docs/for-ai/implementation/raw-eds-blocks-guide.md)** - Critical patterns and pitfalls
- **[Block Architecture Standards](../../docs/for-ai/implementation/block-architecture-standards.md)** - EDS block development standards
