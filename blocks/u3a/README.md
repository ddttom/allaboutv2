# U3A Block

A Franklin block for displaying image sets with associated metadata and slider functionality.

## Features
- Display multiple images in a slider format
- Show associated metadata for each image set
- Responsive design for various screen sizes
- Keyboard navigation support
- Image metadata extraction

## Usage
Create a table in your document with the following structure:

| u3a | By | Description | Classification | Tag | Image | Image2 | Image3 |
|-----|-------|-------------|----------------|-----|--------|---------|---------|
| Note | Author | Description text | Class type | Tag name | Image1 | Image2 | Image3 |

## Configuration
### CSS Variables
- `--u3a-spacing`: Controls spacing between elements
- `--u3a-border-radius`: Controls border radius of components
- `--u3a-transition`: Controls animation timing
- `--u3a-shadow`: Controls shadow effects

## Accessibility
- Keyboard navigation using arrow keys
- ARIA labels for interactive elements
- Screen reader friendly content structure

## Performance
- Lazy loading of images
- Optimized transitions and animations
- Efficient DOM manipulation

## Browser Compatibility
- Works in all modern browsers
- Fallback support for older browsers

## Troubleshooting
- Ensure images are properly linked in the document
- Check image paths are correct
- Verify metadata is properly formatted
