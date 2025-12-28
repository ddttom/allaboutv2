# Bio Block - Google Docs Examples

This document shows how to create bio blocks in Google Docs. The bio block displays author information with an image and bio text.

## Table of Contents
- [Basic Example](#basic-example)
- [Example with Image Link](#example-with-image-link)
- [Example with "Picture Here" Placeholder](#example-with-picture-here-placeholder)
- [Example with Direct Image](#example-with-direct-image)
- [Variations](#variations)
- [Best Practices](#best-practices)

---

## Basic Example

Create a simple two-column table in Google Docs:

```
| bio                                    |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://example.com/author-image.jpg   | Jane Doe is a senior developer with 10 years experience  |
|                                        | in web technologies and EDS.                              |
```

**Result:**
- First column: Image (will be converted from link to `<img>` element)
- Second column: Bio text
- Author name: Extracted from image alt text or fallback to page meta tag

---

## Example with Image Link

The bio block automatically converts image links to actual images:

```
| bio                                    |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://cdn.example.com/profile.png    | Sarah Johnson is a UX designer specializing in           |
|                                        | accessible web applications and inclusive design.         |
```

**How it works:**
1. The block detects the link points to an image (.jpg, .jpeg, .png, .gif, .webp, .svg)
2. Converts the link to an `<img>` element using `replaceWith()`
3. The original `<a>` tag is completely removed from the DOM
4. Uses the link text as the image's alt attribute (if link text is not a URL)
5. If link text is a URL, ignores it and uses the page's `<meta name="author">` tag

**💡 TIP:** For best results, use the author name as the link text in Google Docs:
- ✅ **Best**: Hyperlink text "Tom Cranstoun" → URL "https://example.com/photo.jpg"
- ✅ **Also works**: Hyperlink text "https://example.com/photo.jpg" → URL "https://example.com/photo.jpg" (will use meta tag)

**Supported image extensions:**
- .jpg / .jpeg
- .png
- .gif
- .webp
- .svg

---

## Example with "Picture Here" Placeholder

**Important:** The "Picture Here" placeholder functionality is now handled by the Cloudflare worker (v1.1.0+), not by the bio block. This provides site-wide placeholder replacement for all blocks.

```
| bio                                    |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| Picture Here                           | Web development doesn't need complex tooling - this       |
|                                        | framework proves you can build production-ready Adobe     |
|                                        | Edge Delivery Services components with nothing but       |
|                                        | vanilla JavaScript and precise documentation.             |
```

**How it works:**
1. Type "Picture Here" (case-sensitive) in the first cell in Google Docs
2. EDS converts to: `<div><div>Picture Here</div></div>`
3. **Cloudflare worker** detects this pattern and replaces with author image (server-side)
4. Bio block receives the already-transformed HTML with `<img>` tag
5. Author name is extracted from the image alt attribute or page's `<meta name="author">` tag

**Replacement image:**
The worker uses this configured image:
```
https://allabout.network/dam/media_126e99d56f06caf788bee715aff92281d2e31a206.png
Alt text: "Author: Tom Cranstoun"
```

**When to use this:**
- 🚀 **Quick prototyping**: Create multiple bios quickly without sourcing images
- 📝 **Content-first workflow**: Focus on bio text first, add specific images later
- 👥 **Team pages**: Use consistent placeholder during development
- 🔄 **Review phases**: Easy to identify which bios need final images

**Important notes:**
- **Case-sensitive**: Must be exactly "Picture Here" (not "picture here" or "PICTURE HERE")
- **Production only**: Placeholder replacement only works on pages served through Cloudflare worker
- **Local development**: The text "Picture Here" will remain visible when testing on localhost:3000
- **Testing**: Use production URL (https://allabout.network/your-page) to see replacement in action

**Configuration:**
The default image is configured in the Cloudflare worker at `cloudflare/files/cloudflare-worker.js`:

```javascript
export const PICTURE_PLACEHOLDER_CONFIG = {
  TRIGGER_TEXT: 'Picture Here',
  IMAGE_URL: 'https://allabout.network/dam/media_126e99d56f06caf788bee715aff92281d2e31a206.png',
  IMAGE_ALT: 'Author: Tom Cranstoun',
  MATCH_CASE_SENSITIVE: true,
  TRIM_WHITESPACE: true,
};
```

**💡 TIP:** This is perfect for creating multiple bios in bulk - just use "Picture Here" in all of them, then come back and replace with specific images once you have them ready! Remember to test on production/staging, not localhost.

---

## Example with Direct Image

You can also paste images directly into Google Docs:

```
| bio                                    |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| [Paste image here in Google Docs]      | Michael Chen is a full-stack engineer with expertise     |
|                                        | in JavaScript, React, and Node.js.                        |
```

**Note:** When you paste an image in Google Docs, add alt text by:
1. Right-click the image
2. Select "Alt text"
3. Enter the author name
4. This will be used for the author name display

---

## Variations

### Highlighted Bio

Add a blue border around the image:

```
| bio (highlighted)                      |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://example.com/vip-author.jpg     | Dr. Emily Roberts is the lead researcher in AI and       |
|                                        | machine learning applications.                            |
```

**Result:** Image will have a 2px blue border.

---

### Hide Author Name

Don't display the author name (only show image and bio):

```
| bio (hide-author)                      |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://example.com/profile.jpg        | A brief description without showing the author name      |
|                                        | explicitly below the bio.                                 |
```

**Result:**
- Image link is NOT converted (remains as link)
- No author name is added to the block
- Use this for contributor bios where names are already in the text

---

## Best Practices

### 1. Image Requirements

**Recommended image specifications:**
- Format: JPG, PNG, or WebP
- Dimensions: 200×200px (square)
- File size: < 50KB for optimal performance
- The block will automatically:
  - Apply circular border-radius (50%)
  - Set width/height to 80px (desktop)
  - Adjust for mobile: 60px (tablet), 50px (mobile)

### 2. Author Name Priority

The block determines the author name in this order:
1. **Image alt text** (highest priority)
2. **Meta tag author** (fallback if no alt text)
   ```html
   <meta name="author" content="Author Name">
   ```

**Best practice:** Always add alt text to images with the author's name.

### 3. Bio Text Length

**Recommended:**
- Desktop: 2-3 sentences (100-150 words)
- Mobile: 1-2 sentences (50-100 words)

The bio block is responsive and will stack vertically on mobile devices.

### 4. Image Link Format

When using image links:
- ✅ **DO:** Use direct links to image files
  ```
  https://example.com/images/author.jpg
  https://cdn.site.com/photos/profile.png
  ```
- ❌ **DON'T:** Use page URLs or non-image links
  ```
  https://example.com/profile  (won't be converted)
  https://site.com/about.html   (won't be converted)
  ```

### 5. Mobile Considerations

The bio block automatically adjusts for mobile:
- Layout changes from horizontal to vertical stack (≤768px)
- Image size reduces (60px on tablet, 50px on mobile)
- Text becomes centered
- Gap between elements adjusts for better spacing

**Test your content:**
- Keep bio text concise for mobile readability
- Ensure images look good at small sizes (50px)
- Check that author names aren't too long

---

## Complete Examples

### Example 1: Blog Author Bio

```
| bio                                    |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://cdn.blog.com/authors/jane.jpg  | Jane Smith is a technical writer specializing in web     |
|                                        | development and cloud architecture. Follow her on         |
|                                        | Twitter @janesmith.                                       |
```

### Example 2: Guest Contributor (Highlighted)

```
| bio (highlighted)                      |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://guest.photos/contributor.png   | Guest contributor: Alex Rivera is a DevOps engineer       |
|                                        | with 15 years of experience in scalable infrastructure.   |
```

### Example 3: Team Member (No Image Link)

```
| bio                                    |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| [Paste image with alt text: "Tom Lee"] | Tom Lee leads our frontend team. He's passionate about   |
|                                        | creating accessible and performant user experiences.      |
```

### Example 4: Anonymous Contributor

```
| bio (hide-author)                      |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://site.com/anon-avatar.jpg       | This article was contributed by a community member        |
|                                        | who wishes to remain anonymous.                           |
```

---

## Styling Notes

The bio block includes:
- **Desktop (>768px):**
  - Horizontal layout with flexbox
  - Image: 80×80px, circular
  - Gap: 20px between image and text

- **Tablet (≤768px):**
  - Vertical layout (centered)
  - Image: 60×60px, circular
  - Gap: 15px

- **Mobile (≤480px):**
  - Vertical layout (centered)
  - Image: 50×50px, circular
  - Gap: 12px

All responsive adjustments happen automatically - no additional configuration needed!

---

## Testing Your Bio

After creating your bio in Google Docs:

1. **Preview on the staging site** to verify:
   - Image loads correctly
   - Image link is converted (check browser DevTools - no `<a>` tag should exist)
   - Author name appears (if not hidden)
   - Text wraps properly
   - Mobile layout works

2. **Test image link conversion:**
   - Open browser DevTools (F12)
   - Find the bio block element
   - Verify no `<a>` tags exist in the first cell
   - Verify `<img>` tag exists with correct src and alt

3. **Check responsive behavior:**
   - Resize browser window
   - Verify layout changes at breakpoints
   - Check image sizes adjust properly

---

## Troubleshooting

### Issue: Image link not converting

**Possible causes:**
- Link doesn't point to an image file (must end in .jpg, .png, etc.)
- Using the `hide-author` class (intentionally skips conversion)
- Link is malformed or broken

**Solution:** Ensure the link ends with a valid image extension.

### Issue: No author name appears

**Possible causes:**
- Image has no alt text
- No meta tag with author in page head
- Using `hide-author` class

**Solution:**
1. Add alt text to the image in Google Docs
2. Or add a meta tag to your page:
   ```html
   <meta name="author" content="Your Name">
   ```

### Issue: Image too large or small

**Note:** The CSS automatically sizes images to 80px (desktop), 60px (tablet), 50px (mobile).

If images look pixelated, upload higher resolution images (at least 200×200px).

---

## Expression Processing

The bio block supports the expressions plugin. You can use dynamic variables in the bio text:

```
| bio                                    |                                                           |
|----------------------------------------|-----------------------------------------------------------|
| https://example.com/author.jpg         | {{expand,$profile:name$}} is a developer at              |
|                                        | {{expand,$profile:company$}}.                             |
```

**Requirements:**
- `$system:enableprofilevariables$` must be set to 'y'
- Profile variables must be defined

See the expressions plugin documentation for more details.
