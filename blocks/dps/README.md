# Dynamic Presentation System (DPS) Block

A powerful presentation system that transforms structured content into an interactive presentation with features like image sequences, presenter notes, and timer controls.

## Features
- Full-screen presentation mode
- Keyboard and click-based navigation
- Multiple images per slide with arrow key navigation
- Image sequence support
- Full viewport height image support
- Presenter notes with toggle functionality
- Timer with warning system
- Responsive design
- Print-friendly handout mode
- Flexible iframe support with smart URL handling

## Content Structure
| Title | Subtitle | Timer (minutes) | Content | Presenter Notes |
| :---- | :------- | :-------------- | :------ | :-------------- |
| Presentation Title | Optional subtitle | 25 | Main content | Presenter notes |
| Slide Title | Introduction text | | Bullet points | Notes for this slide |
| | | | Multiple images | Additional guidance |
| | | | SVG illustrations | Key points to cover |
| | | | iframes | Additional notes |

## Navigation
- **Arrow Keys**: Navigate between slides
- **Space**: Toggle timer pause/play
- **Escape**: Toggle navigation bar
- **Plus (+)**: Show presenter notes
- **Minus (-)**: Hide presenter notes
- **R**: Refresh viewport while maintaining current slide and sub-slide state
- **Click Navigation**: Use left/right arrow buttons in footer

### Image Sequence Navigation
- Use left/right arrow keys to navigate through multiple images
- Images maintain aspect ratio and use full viewport height
- Smooth transitions between images
- Navigation wraps around at sequence ends

### iframe Support
The fourth column supports embedded iframes with flexible URL handling:

#### Supported URL Formats
1. Standard iframe format:
```html
<iframe src="https://example.com/embed"></iframe>
```

2. URL without src attribute:
```html
<iframe https://example.com/embed>
```

3. Franklin link format (automatically converted):
```html
<a href="https://example.com/embed">Link</a>
```

4. Plain URL:
```
https://example.com/embed
```

5. HTML encoded content:
```html
&lt;iframe src="https://example.com/embed"&gt;
```

6. Paragraph wrapped HTML encoded iframe:
```html
<p>&#x3C;iframe https://example.com/embed</p>
```

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
1. Always include a descriptive title attribute
2. Use appropriate allow attributes for functionality
3. Set loading="lazy" for better performance
4. Ensure the iframe source is secure (https)
5. Test the iframe in both desktop and mobile views
6. If using HTML entities, ensure proper encoding

### Presenter Notes
- Appears in bottom left third of viewport (31.25% width)
- Light grey background with dark text for readability
- Supports HTML formatting:
  - Bullet points
  - Bold text (highlighted in blue)
  - Code blocks
  - Line breaks
- Toggle visibility with + and - keys
- State persists across slide changes
- Hidden by default on startup
- Excluded from print mode

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
3. Use the fourth column for images or illustrations
4. Add presenter notes in the fifth column
5. Multiple images in the fourth column will create an image sequence
6. Use HTML formatting in presenter notes for better organization
7. Add iframes using any supported format - the system will handle the conversion

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

6. **Simple iframe Format**
```
iframe = https://example.com/embed
```

### Image Path Handling
- Relative paths are preserved exactly as provided
- No automatic domain addition to relative paths
- Franklin's image optimization system handles all image processing
- Picture elements maintain their original structure and attributes
- SVG content is preserved exactly as provided
- URLs in anchor tags are extracted and used as-is
- Full URLs (starting with http:// or https://) are preserved exactly as provided
- Simple iframe format is supported with 'iframe =' prefix

### Image Best Practices
1. Use relative paths for all images
2. Include appropriate alt text for accessibility
3. Use picture elements for responsive images
4. Set proper width and height attributes
5. Use appropriate image formats (webp, jpeg, png)
6. Optimize images before uploading
7. Test images across different screen sizes
8. When using anchor tags, ensure the href and content match

### Troubleshooting Images
- If images don't load, check:
  - Image paths are correct and relative
  - Image files exist in the specified location
  - Image permissions are set correctly
  - Franklin's image optimization is working
  - Browser console for any 404 errors
  - For anchor tag URLs, verify both href and content match
- For picture elements:
  - Verify all source elements have correct paths
  - Check media queries are appropriate
  - Ensure fallback img element is present
- For SVG content:
  - Verify SVG code is valid
  - Check for proper namespace declarations
  - Ensure viewBox attribute is set

## Notes
- Presenter notes support HTML formatting for better organization
- Images maintain aspect ratio while using available space
- Timer starts automatically after first slide
- Print mode excludes presenter notes and navigation elements
- iframes are contained within a styled container for better presentation
- The system automatically handles various URL formats and HTML encodings
- Paragraph wrapped iframes with HTML entities are supported

## Implementation

### Files

- `dps.js` - JavaScript implementation
- `dps.css` - CSS styling
- `README.md` - Documentation (this file)

### Content Structure

Content authors should structure their content as follows:

```
| DPS                |                       |            |                    |                     |
| ------------------ | --------------------- | ---------- | ------------------ | ------------------- |
| Presentation Title | Presentation Subtitle | 25 (timer) |                    |                     |
| ------------------ | --------------------- | ---------- | ------------------ | ------------------- |
| Slide 1 Title      | Slide 1 Introduction  | Bullets    | Image(s) or SVG(s) | Presenter Notes 1   |
| ------------------ | --------------------- | ---------- | ------------------ | ------------------- |
| Slide 2 Title      | Slide 2 Introduction  | Bullets    | Image(s) or SVG(s) | Presenter Notes 2   |
```

#### Column Definitions

1. **First column**: Slide titles
2. **Second column**: Slide introduction text or subtitle
3. **Third column**: Bullet points and plain text
   - Use document list formatting for bullet points
   - Plain text will be displayed without bullets
   - Line breaks in plain text are preserved
   - HTML formatting (like `<code>` and `<strong>`) is supported
4. **Fourth column**: Images, SVG, or iframes for illustrations
   - Can contain multiple images that will be shown in sequence
   - Images use full viewport height while maintaining aspect ratio
   - Navigate between images using arrow keys
   - When reaching the last image, right arrow advances to next slide
   - When on first image, left arrow goes to previous slide
   - iframes are automatically sized and styled
   - Supports various URL formats and HTML encodings
5. **Fifth column**: Presenter notes
   - Private notes visible only to the presenter
   - Toggle visibility with + and - keys
   - Notes state (hidden/visible) persists across slides
   - Appears in bottom left quarter of viewport
   - Automatically updates when changing slides

## Slide Layout

Each slide follows a consistent layout:

1. **Title Area** (Full width)
   - Large title with bottom border
   - Optional subtitle or introduction text

2. **Content Area** (40% width)
   - Introduction text (if provided)
   - Bullet points with optimized spacing
   - Plain text with preserved formatting
   - Sub-bullet points (if used)

3. **Illustration Area** (60% width)
   - SVG illustrations or images
   - Multiple images shown in sequence
   - Images use full viewport height
   - Maintains aspect ratio
   - Smooth transitions between images
   - iframes with proper sizing and styling
   - Smart URL handling for various formats

## Content Formatting

### Bullet Points and Text

The third column supports both bullet points and plain text:

1. **Bullet Points**
   - Use document's list formatting
   - Optimized spacing between items
   - Consistent bullet styling
   - Supports sub-bullets

2. **Plain Text**
   - No bullet styling
   - Preserves line breaks
   - Supports HTML formatting
   - Can be mixed with bullet points

3. **Mixed Content**
   - Bullet points and plain text can be used together
   - Maintains original content order
   - Preserves all formatting and spacing

### HTML Support

The following HTML elements are supported in the content:
- `<code>` - Monospace text
- `<strong>` - Bold text
- `<br>` - Line breaks
- `<iframe>` - Embedded content
- Other HTML formatting elements

## Special Slides

### Q&A Slide
- Automatically added as the last slide
- Includes:
  - "Questions & Answers" title
  - "Your feedback and questions are valuable" subtitle
  - Centered question mark icon
  - "Thank You For Your Attention" message

## EDS Best Practices

This block follows these important EDS development principles:

1. **Proper Namespacing**: All class names follow the pattern `blockname-feature-state`
2. **No Container Styling**: Container elements have no styles applied
3. **Semantic Structure**: Uses appropriate semantic elements
4. **Consistent Layout**: Maintains consistent spacing and alignment
5. **Flexible Content Handling**: Supports various content formats and encodings

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
   - SVG content, image, or iframe (optional)
   - Presenter notes (optional)

## Advanced Features

### SVG Support

Authors can include SVG code directly in the fourth column. Example:

```svg
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="200" cy="100" rx="150" ry="80" fill="#BBDEFB" stroke="#3498db" stroke-width="2"/>
  <text x="200" y="105" font-size="24" text-anchor="middle">Sample SVG</text>
</svg>
```

### iframe Support

Authors can include iframes in the fourth column using any of these formats:

1. Standard iframe:
```html
<iframe src="https://example.com/embed"></iframe>
```

2. URL without src:
```html
<iframe https://example.com/embed>
```

3. Franklin link:
```html
<a href="https://example.com/embed">Link</a>
```

4. Plain URL:
```
https://example.com/embed
```

5. HTML encoded:
```html
&lt;iframe src="https://example.com/embed"&gt;
```

### Timer Functionality

- Timer starts automatically when advancing past the first slide
- Space bar toggles timer on/off after it has started
- Visual warning (red flash) when 2 minutes remain
- Timer display in MM:SS format
- Timer shows "Time Up!" in red when finished
- Timer state persists during slide navigation

### Navigation

#### Keyboard Controls
- Left Arrow: Previous image in sequence or previous slide if no more images
- Right Arrow: Next image in sequence or next slide if no more images
- Space Bar: Toggle timer (after first slide)
- Escape: Exit fullscreen mode
- Plus (+) key: Show presenter notes
- Minus (-) key: Hide presenter notes
- R key: Refresh viewport while maintaining current slide and sub-slide state

#### Click Navigation
- Left/Right arrow buttons in footer for slide navigation
- Buttons are styled for clear visibility and interaction
- Supports both desktop and mobile devices
- Maintains accessibility with proper ARIA labels
- Visual feedback on hover and click
- High contrast mode support

#### Image Sequence Navigation
- Right arrow shows next image in the sequence
- Left arrow shows previous image in the sequence
- When reaching the last image, right arrow advances to next slide
- When at the first image, left arrow goes to previous slide
- Smooth fade transition between images

#### Presenter Notes
- Notes appear in bottom left third of viewport (31.25% of viewport width)
- Semi-transparent background for readability
- Toggle visibility with + and - keys
- State persists across slide changes
- Hidden by default on startup
- Not included in print mode

### Responsive Design

- Adapts to all screen sizes
- Mobile-optimized layout
- Maintains readability on small screens
- Adjusts illustration sizes automatically
- iframes maintain aspect ratio and responsiveness

### Print Mode

- Optimized for handouts
- Each slide on a separate page
- Clean layout without navigation elements
- Preserves all content and illustrations

## Compatibility

- Works in all modern browsers
- Follows WCAG accessibility guidelines
- Supports high-DPI displays
- Touch-friendly interface
- iframe support across major browsers
- Handles various URL formats and encodings

## Styling

The block uses a consistent color scheme:
- Primary Blue: #3498db
- Dark Blue: #2c3e50
- Light Gray: #ecf0f1
- Warning Red: #e74c3c

All colors and spacing can be customized through CSS variables.

### Performance Optimizations

The block implements several performance optimizations:
- Efficient DOM manipulation
- Optimized image sequence transitions
- Minimal reflows and repaints
- Event delegation for improved interaction handling
- Smart state management for presentation controls
- Lazy loading for iframes
- Smart URL handling and cleaning

### Fourth Column Content Types
The fourth column supports various types of content for illustrations:

#### 1. Responsive Images (Picture Element)
```html
<picture>
  <source type="image/webp" srcset="/path/to/image.webp" media="(min-width: 600px)">
  <source type="image/webp" srcset="/path/to/image.webp">
  <source type="image/jpeg" srcset="/path/to/image.jpg" media="(min-width: 600px)">
  <img loading="lazy" alt="" src="/path/to/image.jpg" width="1200" height="1600">
</picture>
```

#### 2. Direct Images
```html
<img src="/path/to/image.jpg" alt="Description">
```

#### 3. iframes (Multiple Formats)
1. Standard iframe:
```html
<iframe src="https://example.com/embed"></iframe>
```

2. URL without src:
```html
<iframe https://example.com/embed>
```

3. Franklin link:
```html
<a href="https://example.com/embed">Link</a>
```

4. Plain URL:
```
https://example.com/embed
```

5. HTML encoded:
```html
&lt;iframe src="https://example.com/embed"&gt;
```

6. Paragraph wrapped HTML encoded iframe:
```html
<p>&#x3C;iframe https://example.com/embed</p>
```

7. Mixed content with anchor tags:
```html
<p>&#x3C;iframe <a href="https://example.com/embed">https://example.com/embed</a>>&#x3C;/iframe></p>
```

#### 4. SVG Content
1. SVG Element:
```html
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="200" cy="100" rx="150" ry="80" fill="#BBDEFB" stroke="#3498db" stroke-width="2"/>
  <text x="200" y="105" font-size="24" text-anchor="middle">Sample SVG</text>
</svg>
```

2. Raw SVG Content:
```html
<svg>...</svg>
```

#### Mixed Content Support
The fourth column supports mixing different types of content in sequence:

1. Multiple iframes:
```html
<p>&#x3C;iframe src="https://example1.com"></iframe></p>
<p>&#x3C;iframe src="https://example2.com"></iframe></p>
```

2. Mixed iframes and images:
```html
<p>&#x3C;iframe src="https://example.com"></iframe></p>
<p>
  <picture>
    <source type="image/webp" srcset="/path/to/image.webp" media="(min-width: 600px)">
    <source type="image/webp" srcset="/path/to/image.webp">
    <source type="image/jpeg" srcset="/path/to/image.jpg" media="(min-width: 600px)">
    <img loading="lazy" alt="" src="/path/to/image.jpg" width="1200" height="1600">
  </picture>
</p>
```

3. Mixed content with HTML entities:
```html
<p>&#x3C;iframe <a href="https://example.com">https://example.com</a>>&#x3C;/iframe></p>
<p>
  <picture>
    <source type="image/webp" srcset="/path/to/image.webp" media="(min-width: 600px)">
    <source type="image/webp" srcset="/path/to/image.webp">
    <source type="image/jpeg" srcset="/path/to/image.jpg" media="(min-width: 600px)">
    <img loading="lazy" alt="" src="/path/to/image.jpg" width="1200" height="1600">
  </picture>
</p>
```

#### Content Features
- All content types maintain proper aspect ratio
- Responsive design that works on all screen sizes
- Smooth transitions between content in sequences
- Navigation between mixed content types using arrow keys
- High contrast mode support
- Proper handling of HTML entities and encodings
- Preservation of original attributes and structure

#### Best Practices
1. For responsive images:
   - Use appropriate media queries
   - Include multiple formats (webp, jpeg)
   - Set proper width and height attributes
   - Include descriptive alt text

2. For iframes:
   - Always include a descriptive title attribute
   - Use appropriate allow attributes
   - Set loading="lazy" for better performance
   - Ensure the source is secure (https)

3. For SVG content:
   - Include proper viewBox attribute
   - Use semantic elements and attributes
   - Optimize SVG code for performance
   - Consider accessibility with ARIA attributes

4. For mixed content:
   - Use separate paragraph elements for each item
   - Test sequence navigation
   - Ensure consistent sizing across content types
   - Verify responsive behavior

#### Troubleshooting
- If images don't load, check:
  - Image paths are correct and relative
  - Image files exist in the specified location
  - Image permissions are set correctly
  - Franklin's image optimization is working
  - Browser console for any 404 errors
- For picture elements:
  - Verify all source elements have correct paths
  - Check media queries are appropriate
  - Ensure fallback img element is present
- For SVG content:
  - Verify SVG code is valid
  - Check for proper namespace declarations
  - Ensure viewBox attribute is set
- For iframe issues:
  - Check if the source URL is accessible
  - Verify iframe permissions
  - Ensure the source supports embedding
  - Check browser console for security policy errors
  - Try different URL formats if one doesn't work
- For mixed content:
  - Ensure each item is in its own paragraph
  - Test sequence navigation with mixed content types
  - Verify proper display order
- For HTML entities:
  - Ensure proper encoding
  - Check for missing closing tags
  - Verify entity decoding

### Image Handling
The block preserves all image paths exactly as they are in the original content, without any path manipulation or conversion. This ensures compatibility with Franklin's image handling system:

1. **Direct Images**
```html
<img src="/path/to/image.jpg" alt="Description">
```

2. **Picture Elements**
```html
<picture>
  <source type="image/webp" srcset="/path/to/image.webp" media="(min-width: 600px)">
  <source type="image/webp" srcset="/path/to/image.webp">
  <source type="image/jpeg" srcset="/path/to/image.jpg" media="(min-width: 600px)">
  <img loading="lazy" alt="" src="/path/to/image.jpg" width="1200" height="1600">
</picture>
```

3. **SVG Content**
```html
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="200" cy="100" rx="150" ry="80" fill="#BBDEFB" stroke="#3498db" stroke-width="2"/>
  <text x="200" y="105" font-size="24" text-anchor="middle">Sample SVG</text>
</svg>
```

Key points about image handling:
- All image paths are preserved exactly as they are in the original content
- No path manipulation or conversion is performed
- Franklin's image optimization system handles all image processing
- Relative paths work as expected
- Picture elements maintain their original structure and attributes
- SVG content is preserved exactly as provided
