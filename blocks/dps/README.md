# Dynamic Presentation System (DPS) Block

A powerful presentation system that transforms structured content into an interactive presentation with features like image sequences, presenter notes, and timer controls.

## Features
- Full-screen presentation mode
- Keyboard-based navigation
- Multiple images per slide with arrow key navigation
- Image sequence support
- Full viewport height image support
- Presenter notes with toggle functionality
- Dedicated presenter mode for tablet viewing
- Timer with warning system
- Responsive design
- Print-friendly handout mode
- Flexible iframe support with smart URL handling
- Improved icon handling with SVG support
- Simplified iframe format for easier authoring

## Content Structure
| Title | Subtitle | Timer (minutes) | Content | Presenter Notes |
| :---- | :------- | :-------------- | :------ | :-------------- |
| Presentation Title | Optional subtitle | 25 | Main content | Presenter notes |
| Slide Title | Introduction text | | Bullet points | Notes for this slide |
| | | | Multiple images | Additional guidance |
| | | | SVG illustrations | Key points to cover |
| | | | iframes | Additional notes |

## Navigation
- **Arrow Keys**: Navigate between slides and within image sequences
- **Space**: Toggle timer pause/play
- **Escape**: Toggle navigation bar
- **Plus (+)**: Show presenter notes
- **Minus (-)**: Hide presenter notes
- **R**: Refresh viewport while maintaining current slide and sub-slide state
- **P**: Toggle enlarged presenter notes (2/3 scale)

### Image Sequence Navigation
- Use left/right arrow keys to navigate through multiple images
- Images maintain aspect ratio and use full viewport height
- Smooth transitions between images with 300ms fade effect
- Navigation wraps around at sequence ends
- Sequence navigation works with mixed content types (icons, iframes, images, SVGs)

### Icon Support
The fourth column supports icon spans with specific class names:

```html
<span class="icon icon-methods"></span>
```

Icons are automatically transformed into proper image references:
- Extracts the icon name from the class (e.g., "methods" from "icon-methods")
- Creates an image tag pointing to `/icons/[icon-name].svg`
- Sets proper alt text as "[icon-name] Illustration"
- Preserves sequence order when mixed with other content types

For example, this icon span:
```html
<span class="icon icon-explode"></span>
```

Will be converted to:
```html
<img src="/icons/explode.svg" alt="explode Illustration" class="sequence-image icon-image" data-icon-name="explode">
```

Icons are treated as sequence items and can be navigated through with arrow keys alongside other content types. The system properly maintains display state for all content types during navigation.

### Mixed Content Support
The DPS block now properly handles mixed content in any order:
- Icons followed by pictures
- Pictures followed by icons
- Multiple icons in sequence
- Any combination of icons, pictures, SVGs, and iframes

All content elements maintain their proper sequence order and can be navigated through with the arrow keys.

### iframe Support
The fourth column supports embedded iframes with flexible URL handling:

#### Supported URL Formats
1. **Simplified author-friendly format (recommended):**
```
iframe https://example.com/embed
```
This is the easiest way for authors to add iframes - just type "iframe" followed by the URL.

2. Standard iframe format:
```html
<iframe src="https://example.com/embed"></iframe>
```

3. URL without src attribute:
```html
<iframe https://example.com/embed>
```

4. Franklin link format (automatically converted):
```html
<a href="https://example.com/embed">Link</a>
```

5. Plain URL:
```
https://example.com/embed
```

6. HTML encoded content:
```html
&lt;iframe src="https://example.com/embed"&gt;
```

7. Paragraph wrapped HTML encoded iframe:
```html
<p>&#x3C;iframe https://example.com/embed</p>
```

#### HTML Entity Handling for iframes
The system intelligently handles HTML entities in iframe definitions:
- Supports both numeric (`&#x3C;`) and named (`&lt;`) entity references
- Automatically decodes entity references to proper characters
- Correctly extracts URLs from mixed content containing HTML entities
- Maintains proper display when entities are present in sequence items
- Works with paragraph-wrapped entity content seamlessly

#### iframe Features
- Automatic resizing to fit the illustration area
- Maintains 16:9 aspect ratio
- Responsive design that works on all screen sizes
- Supports any valid iframe source
- High contrast mode support
- Smart URL extraction and cleaning
- Preserves original attributes while ensuring required ones
- Handles HTML entities and paragraph wrapping

#### iframe Best Practices
1. Use the simplified "iframe URL" format for easier authoring
2. Ensure the URL is accessible and supports embedding
3. Test embedded content on both desktop and mobile devices
4. Use secure URLs (https) for all embedded content
5. Consider fallback content for cases where embedding fails

### Presenter Notes
- Appears in bottom left third of viewport (31.25% width) by default
- Can be enlarged to 50% width with 'P' key while staying pinned to the left
- Always stays pinned to the left of the viewport and grows to the right when enlarged
- Font size increases by 50% when enlarged for better readability
- Light grey background with dark text for readability
- Supports HTML formatting:
  - Bullet points
  - Bold text (highlighted in blue)
  - Code blocks
  - Line breaks
- Toggle visibility with + and - keys

## Styling
- Modern, clean design
- Responsive layout
- Consistent typography
- Smooth transitions
- Print-optimized handouts

## Performance
- Optimized image loading
- Efficient DOM updates
- Smooth animations
- Minimal dependencies
- Smart iframe URL handling

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Authoring Guidelines
1. Start with a configuration row containing title, subtitle, and timer duration
2. Each subsequent row represents a slide
3. Use the fourth column for images, icons, or illustrations
4. Add presenter notes in the fifth column
5. Multiple items in the fourth column will create an image sequence
6. Use HTML formatting in presenter notes for better organization
7. For iframes, simply type "iframe" followed by the URL (e.g., `iframe https://example.com/embed`)
8. For icon spans, use the format `<span class="icon icon-name"></span>` - they will be automatically converted to SVG images

## Content Detection Mechanisms
The system uses sophisticated detection methods to identify different content types:

1. **Icon Spans**: Detected via regexes and class name analysis
2. **Picture Elements**: Detected by querying for `<picture>` elements
3. **Images**: Identified via `<img>` tags
4. **SVGs**: Recognized both as `<svg>` elements and by analyzing element innerHTML
5. **iframes**: 
   - Simplified "iframe URL" format detection
   - Standard iframe tag detection
   - HTML encoded iframe detection
   - Plain URL detection
6. **URLs**: Extracted using pattern matching for http/https URL strings

Content type detection follows a priority order with more specific formats being checked before more general ones.

## Animation and Transition Behavior
The system applies smooth transitions between items in sequences:

- **Fade Effect**: 300ms ease-in-out opacity transition between sequence items
- **Display Property**: Toggled between 'block' and 'none' after opacity changes
- **Active Class**: Added/removed to track currently displayed item
- **Z-Index Management**: Ensures proper stacking of sequence items
- **Background Transitions**: Background colors transition smoothly for visual feedback
- **Timer Warning Effects**: Visual flash effect when time is running low

## Mixed Content Sequence Behavior
When Column 4 contains multiple different content types:

1. All items are added to the same sequence regardless of type
2. Left/right arrow keys navigate through all items in order
3. The system maintains proper display state for each content type
4. Smooth transitions apply between all content types
5. The active item receives proper styling based on its content type
6. Content rendering adapts to maintain optimal display for each type
7. Sequence navigation wraps appropriately at sequence boundaries

## Icon Processing Details

### Icon Detection
The system detects icon spans using multiple techniques:
1. **Regex pattern matching**: Identifies spans with icon classes directly in HTML
2. **Class name analysis**: Extracts specific icon name from class strings
3. **Element traversal**: Finds nested icon spans within other elements

### Icon Transformation
Icons undergo a specific transformation process:
1. The icon span is identified via its class (e.g., `<span class="icon icon-explode"></span>`)
2. The specific icon name is extracted (e.g., "explode" from "icon-explode")
3. An image path is constructed using the icon name: `/icons/[icon-name].svg`
4. An alt text is created as "[icon-name] Illustration"
5. The span is converted to an image tag with proper attributes and classes

### Icon Display
Icons in the sequence are displayed with these properties:
1. Added to the sequence in their original document order
2. Styled with the "icon-image" class for specialized CSS
3. Include a "data-icon-name" attribute for potential scripting
4. Maintain the sequence-image class for navigation handling
5. Participate in the active/inactive states within sequence navigation

## iframe Simplified Format

### How It Works
The simplified iframe format makes it much easier for content authors to add embedded content:

1. Authors simply type `iframe` followed by a URL in the fourth column
2. The system detects this format and extracts the URL
3. A proper iframe element is created with appropriate attributes
4. The iframe is added to the sequence maintaining the correct order

### Benefits for Content Authors
1. **Simplicity**: No need to remember HTML tag syntax
2. **Readability**: Easier to read and edit in the document
3. **Consistency**: Ensures all iframes have the same attributes
4. **Reliability**: Reduces chances of invalid HTML syntax
5. **Efficiency**: Faster to type than full iframe tags

### Example Usage

In the document's fourth column:
```
iframe https://example.com/embed
```

Will be converted to:
```html
<iframe src="https://example.com/embed" loading="lazy" title="Embedded Content" allowfullscreen></iframe>
```

## Image Handling

### Supported Image Formats
The fourth column supports various image formats and sources:

1. **Picture Elements**
```html
<picture>
  <source type="image/webp" srcset="/path/to/image.webp" media="(min-width: 600px)">
  <source type="image/webp" srcset="/path/to/image.webp">
  <source type="image/jpeg" srcset="/path/to/image.jpg" media="(min-width: 600px)">
  <img loading="lazy" alt="" src="/path/to/image.jpg" width="1200" height="1600">
</picture>
```

2. **Direct Images**
```html
<img src="/path/to/image.jpg" alt="Description">
```

3. **Direct Image URLs**
```
/path/to/image.jpg
```

4. **URLs in Anchor Tags (Franklin Format)**
```html
<a href="https://example.com/path/to/image.jpg">https://example.com/path/to/image.jpg</a>
```

5. **SVG Content**
```html
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="200" cy="100" rx="150" ry="80" fill="#BBDEFB" stroke="#3498db" stroke-width="2"/>
  <text x="200" y="105" font-size="24" text-anchor="middle">Sample SVG</text>
</svg>
```

6. **Icon Spans**
```html
<span class="icon icon-methods"></span>
```

### Image Path Handling
- Relative paths are preserved exactly as provided
- No automatic domain addition to relative paths
- Franklin's image optimization system handles all image processing
- Picture elements maintain their original structure and attributes
- SVG content is preserved exactly as provided
- URLs in anchor tags are extracted and used as-is
- Full URLs (starting with http:// or https://) are preserved exactly as provided
- Icon spans are converted to image paths in the format `/icons/[icon-name].svg`

### Image Best Practices
1. Use relative paths for all images
2. Include appropriate alt text for accessibility
3. Use picture elements for responsive images
4. Set proper width and height attributes
5. Use appropriate image formats (webp, jpeg, png)
6. Optimize images before uploading
7. Test images across different screen sizes
8. For icon spans, ensure the icon SVG exists in the /icons/ directory

## Notes
- Presenter notes support HTML formatting for better organization
- Can be enlarged to 50% width with 'P' key for better visibility while staying pinned to the left
- Presenter notes always stay pinned to the left of the viewport and grow to the right when enlarged
- Font size increases by 50% when enlarged for better readability
- Images maintain aspect ratio while using available space
- Timer starts automatically after first slide
- Print mode excludes presenter notes and navigation elements
- iframes are contained within a styled container for better presentation
- Icons are automatically converted to image references
- The system handles various content types in any order
- Multiple content types can be combined in a sequence
- For iframes, use the simplified "iframe URL" format for easiest authoring

## Implementation

### Files

- `dps.js` - JavaScript implementation
- `dps.css` - CSS styling
- `README.md` - Documentation (this file)

### Content Structure

Content authors should structure their content as follows:

```
| DPS                |                       |            |                         |                     |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Presentation Title | Presentation Subtitle | 25 (timer) |                         |                     |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Slide 1 Title      | Slide 1 Introduction  | Bullets    | Image(s) or Icon(s)     | Presenter Notes 1   |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Slide 2 Title      | Slide 2 Introduction  | Bullets    | iframe youtube.com/xyz  | Presenter Notes 2   |
```

#### Column Definitions

1. **First column**: Slide titles
2. **Second column**: Slide introduction text or subtitle
3. **Third column**: Bullet points and plain text
   - Use document list formatting for bullet points
   - Plain text will be displayed without bullets
   - Line breaks in plain text are preserved
   - HTML formatting (like `<code>` and `<strong>`) is supported
4. **Fourth column**: Images, icons, SVG, or iframes for illustrations
   - Can contain multiple items that will be shown in sequence
   - Images use full viewport height while maintaining aspect ratio
   - Icons use the format `<span class="icon icon-name"></span>`
   - iframes use the format `iframe URL` (simplified format)
   - Navigate between images using arrow keys
   - When reaching the last item, right arrow advances to next slide
   - When on first item, left arrow goes to previous slide
   - Items can be in any order (icons, images, iframes)
   - All items maintain their sequence order for navigation
5. **Fifth column**: Presenter notes
   - Private notes visible only to the presenter
   - Toggle visibility with + and - keys
   - Notes state (hidden/visible) persists across slides
   - Appears in bottom left quarter of viewport
   - Automatically updates when changing slides

## Usage Guide for Authors

1. Create a table in your Google Doc
2. First cell must contain "DPS"
3. Second row contains configuration:
   - Presentation title
   - Subtitle
   - Timer duration in minutes (default: 25)
4. Each subsequent row represents a slide:
   - Title (required)
   - Introduction text (optional)
   - Bullet points and plain text (use document's list formatting for bullets)
   - Icon spans, images, SVGs, or iframes (optional)
   - Presenter notes (optional)
5. For icon spans, use the format `<span class="icon icon-name"></span>`
   - Make sure the corresponding SVG file exists in the /icons/ directory
   - The icon name must match the SVG filename (without the .svg extension)
6. For iframes, use the format `iframe URL`
   - Simply type the word "iframe" followed by a space and then the URL
   - This is the easiest way to add embedded content to your slides

## Author-Friendly Formats

To simplify the authoring experience, DPS provides these easy-to-use formats:

### Simplified iframe
```
iframe https://example.com/embed
```
Just type "iframe" followed by the URL - no HTML tags needed!

### Icon Spans
```html
<span class="icon icon-methods"></span>
```
Use a simple span with the correct classes to reference SVG icons.
### Franklin Icons

```bash
:methods: 
```
The Franklin icon system is a simple way to add icons to your slides.


### Plain URLs
```
https://example.com/image.jpg
```
For images, you can simply paste the URL directly.

### Benefits of Simplified Formats
- Reduced complexity for non-technical authors
- Fewer syntax errors in content
- More readable content in the document
- Consistent output in the presentation
- Easier editing and maintenance

## Presenter Mode
The DPS system includes a dedicated presenter mode that:
- Extracts and displays only the presenter notes from slides
- Supports toggling between normal (31.25% width) and enlarged (50% width) views while staying pinned to the left
- Increases font size by 50% when enlarged for better readability
- Provides a clean, tablet-optimized interface
- Matches the existing DPS styling for consistency
- Supports all the same navigation methods as DPS
- Automatically advances through notes in sequence
- Maintains the same HTML formatting support as regular presenter notes

### Activating Presenter Mode
To use presenter mode:
1. Add `?presenter=true` to the presentation URL
2. The system will automatically:
   - Hide all slide content
   - Display only the presenter notes
   - Format notes for optimal tablet viewing
   - Enable touch navigation

### Presenter Mode Features
- Full-screen notes display
- Touch and keyboard navigation
- Automatic slide advancement
- Consistent styling with main DPS interface
- Responsive layout for all tablet sizes
- Dark/light mode support
- Print-friendly formatting