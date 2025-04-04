# Dynamic Presentation System (DPS) Block

A powerful presentation system that transforms structured content into an interactive presentation with features like image sequences, presenter notes, and timer controls.

## Features
- Full-screen presentation mode
- Keyboard-based navigation
- Multiple images per slide with arrow key navigation
- Image sequence support with visual labels
- Full viewport height image support
- Presenter notes with toggle functionality
- Dedicated presenter mode for tablet viewing
- Timer with warning system
- Responsive design
- Print-friendly handout mode
- Flexible iframe support with smart URL handling
- Icon handling with SVG support
- Simplified iframe format for easier authoring
- System Info button for debugging and diagnostics

## Content Structure
| Title | Subtitle | Timer (minutes) | Content | Presenter Notes |
| :---- | :------- | :-------------- | :------ | :-------------- |
| Presentation Title | Optional subtitle | 25 | Main content | Presenter notes |
| Slide Title | Introduction text | | Bullet points | Notes for this slide |
| | | | Multiple images | Additional guidance |
| | | | SVG illustrations | Key points to cover |
| | | | iframes | Additional notes |

## Navigation

### Keyboard Controls
- **Arrow Keys**: Navigate between slides and within image sequences
- **Space**: Toggle timer pause/play
- **Escape**: Toggle navigation bar
- **Plus (+)**: Show presenter notes
- **Minus (-)**: Hide presenter notes
- **P**: Toggle enlarged presenter notes (shows only notes content)
- **System Info Button**: Copy debug information to clipboard

### Image Sequence Navigation
- Use left/right arrow keys to navigate through multiple images
- Images maintain aspect ratio and use full viewport height
- Smooth transitions between images with 300ms fade effect
- Navigation lock prevents rapid consecutive clicks causing state conflicts
- Enhanced CSS-based visibility management ensures consistent display behavior
- Improved boundary handling at sequence beginning/end prevents navigation issues
- Robust state verification prevents UI inconsistencies during rapid navigation
- Sequence navigation works with mixed content types (icons, iframes, images, SVGs)

### Container-Based Navigation System
- Navigation operates at the container level rather than individual image level
- Each sequence item is contained in its own `.sequence-item-container`
- Containers maintain proper state for all child elements during navigation
- Eliminates doubled labels and inconsistent layouts during transitions
- State verification ensures consistent visibility between classes and style properties
- Sequence navigation works with mixed content types (icons, iframes, images, SVGs)

## Visual Navigation Labels

The navigation system provides a better user experience when a slide contains multiple illustrations (like icons, images, and iframes) by adding visual cues and organization to the content.

### Visual Labels for Navigation
When a slide has illustration items (including single items), the navigation adds clear labels to each item showing:

- The type of content (Icon, Iframe, Image, etc.)
- The current position and total count (e.g., "1/3", "2/3", "3/3", or "1/1" for single items)

This helps users understand:

- What type of content they're currently viewing
- How many total items are in the sequence
- Which position they're currently at in the sequence
- That a single item is still part of the navigation system (shown as "1/1")

### Consistent Interface
The labels appear in a small, semi-transparent black box in the top-left corner of each illustration. This provides:

- Consistent placement across all slides
- Minimal visual interference with the actual content
- Clear visibility against any background

### Visual Example
Without visual labels, a user might see this sequence with no indication of what's happening:

[Icon appears]
[Press right arrow]
[Iframe appears] - User might wonder "Why did the content change?"

With visual labels, they would instead see:

[Icon appears with label "Icon 1/2"]
[Press right arrow]
[Iframe appears with label "Iframe 2/2"] - Clear indication of navigation progress

Even for single items, the label provides context:
[Single icon appears with label "Icon 1/1"] - Clearly indicates this is a standalone item

## Content Types

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
The DPS block handles mixed content in any order:
- Icons followed by pictures
- Pictures followed by icons
- Multiple icons in sequence
- Any combination of icons, pictures, SVGs, and iframes
- Multiple icon spans within a single paragraph

All content elements maintain their proper sequence order based on their original position in the DOM and can be navigated through with the arrow keys. The system uses a sophisticated position tracking mechanism to ensure content appears in the correct order regardless of content type.

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

8. iframe with anchor tag pattern:
```
iframe <a href="https://example.com/embed">Link text</a>
```
This format allows authors to use the simplified iframe keyword with Franklin's link format.

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
- When using 'P' key, only the notes are shown (no title or bullet points)
- When using the note icon, the notes are shown with slide title and bullet points

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

## Technical Details

### Styling
- Modern, clean design
- Responsive layout
- Consistent typography
- Smooth transitions
- Print-optimized handouts

### Performance
- Optimized image loading
- Efficient DOM updates
- Smooth animations
- Minimal dependencies
- Smart iframe URL handling

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Implementation Files
- `dps.js` - JavaScript implementation
- `dps.css` - CSS styling
- `README.md` - Documentation (this file)

## Authoring Guidelines

### Column Definitions

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
   - Multiple icon spans within a paragraph are properly processed
   - Single images show appropriate labels (e.g., "Icon 1/1")
   - Duplicate icons are deduplicated to prevent redundant display
5. **Fifth column**: Presenter notes
   - Private notes visible only to the presenter
   - Toggle visibility with + and - keys
   - Notes state (hidden/visible) persists across slides
   - Appears in bottom left quarter of viewport
   - Automatically updates when changing slides
   - 'P' key shows only notes content
   - Note icon shows notes with slide title and bullet points

### Usage Guide for Authors

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
   - You can also use `iframe <a href="URL">Link text</a>` format
   - The system handles iframe URLs in text content

### Content Structure Example

```
| DPS                |                       |            |                         |                     |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Presentation Title | Presentation Subtitle | 25 (timer) |                         |                     |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Slide 1 Title      | Slide 1 Introduction  | Bullets    | Image(s) or Icon(s)     | Presenter Notes 1   |
| ------------------ | --------------------- | ---------- | ----------------------- | ------------------- |
| Slide 2 Title      | Slide 2 Introduction  | Bullets    | iframe youtube.com/xyz  | Presenter Notes 2   |
```

## Author-Friendly Formats

To simplify the authoring experience, DPS provides these easy-to-use formats:

### Simplified iframe
```
iframe https://example.com/embed
```
Just type "iframe" followed by the URL - no HTML tags needed!

You can also use the anchor tag pattern:
```
iframe <a href="https://example.com/embed">Link text</a>
```
This combines the simplified iframe keyword with Franklin's link format for better integration.

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
- 'P' key shows only notes content for focused reading
- Note icon shows enhanced content with slide title and bullet points for comprehensive view
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

## System Info Button

The DPS block includes a System Info button in the footer for debugging and diagnostics purposes. This feature provides comprehensive information about the presentation state.

### Button Location
- Located in the footer next to the presenter toggle button
- Displays an information icon (i)

### Functionality
When clicked, the System Info button:
1. Collects comprehensive debug information about the presentation
2. Formats it as a JSON object
3. Copies it to the clipboard
4. Displays a "System Info Copied!" tooltip for confirmation

### Debug Information Included
The copied JSON object contains:
- **Timestamp**: When the information was copied
- **Slides**: Complete array of all slides discovered during the presentation run
  - Index
  - Title
  - Type
  - Whether it has illustrations
  - Discovery timestamp
- **Illustrations**: Detailed log of every illustration and slideshow
  - Slide title and index
  - Illustration type
  - Content summary
  - Discovery timestamp
- **Navigation State**:
  - Current slide index
  - Current navigation index
  - Total slides count
  - Total navigation points
- **Timer State**:
  - Remaining time
  - Whether timer has started
  - Whether timer is currently running
- **Presenter State**:
  - Whether presenter mode is active
  - Whether notes are visible

### Usage
- Use during development or troubleshooting
- Helpful for diagnosing issues with slide or illustration discovery
- Provides insights into the presentation's internal state
- Paste the copied JSON into a text editor or developer console for analysis

## Troubleshooting

If you encounter any issues with your presentations:

### System Info Button
- Located in the footer next to the presenter toggle button
- Click to copy detailed system information to your clipboard
- Provides comprehensive data about your presentation's state
- Useful when reporting issues or seeking help

### Common Issues
- If images appear duplicated, try refreshing the page
- For navigation issues, ensure you're not clicking too rapidly
- If content appears out of order, check your document structure
- For iframe loading problems, ensure the URL is accessible and supports embedding

## Known Limitations and Compatibility

### Limitations
- Very complex nested content (like iframes with multiple elements) may require special handling
- In rare cases where navigation becomes inconsistent, use Ctrl+Alt+F to reset the presentation state

### Compatibility
- All features are fully compatible with existing content
- No changes to your documents are needed to benefit from all features
- Existing presentations will automatically use the enhanced navigation and sequence handling