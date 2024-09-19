# Imagecycle

## Tom Cranstoun, 12 Sep v1.00

This document describes the Imagecycle block, a Franklin component for displaying a rotating image carousel.

## Block Specifications

1. Name: imagecycle
2. Structure: Table with one column
   - First cell contains the block name "imagecycle"
   - Subsequent cells contain one image each
3. Image handling:
   - Use fully qualified URLs
   - Do not use createOptimizedPicture()
   - Images should fit within 400px width
4. Behavior:
   - Randomize image order on load
   - Display one image at a time
   - Rotate through images every 5 seconds
   - Provide placement indicators
   - Pause rotation on hover
   - Resume rotation when mouse leaves, immediately moving to the next image
   - Support keyboard navigation (left/right arrow keys)
5. Styling:
   - Background color: light blue

Create the blocks, css, js, readme.md example.md and the demo.md file.  demo.md file showcases the component, describes the component, lists use cases,  with metadata
