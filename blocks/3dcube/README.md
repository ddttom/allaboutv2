# 3D Cube Block

This block creates a 6-sided 3D cube with images and links on each face.

## Features

- Rotatable 3D cube
- Images on each face linked to specified URLs
- Mouse rotation without clicking when hovering over the cube
- Double-click action to navigate to the linked page
- Responsive design

## Usage

To use this block, create a table in your content with 6 rows (one for each face of the cube). Each row should have two cells:

1. The first cell should contain an image.
2. The second cell should contain the URL for the link.

Example:

| Image | Link |
|-------|------|
| [Image 1] | <https://example.com/page1> |
| [Image 2] | <https://example.com/page2> |
| [Image 3] | <https://example.com/page3> |
| [Image 4] | <https://example.com/page4> |
| [Image 5] | <https://example.com/page5> |
| [Image 6] | <https://example.com/page6> |

## Behavior

- The cube is rotatable in all directions using mouse movement.
- Hovering over the cube allows rotation without clicking.
- Double-clicking on a face navigates to the associated link.
- On page load, the first image (front face) is positioned correctly.

## Styling

The cube is styled to be responsive and visually appealing. It has a default size of 200x200 pixels, which reduces to 150x150 pixels on smaller screens. The faces have a slight opacity effect that increases on hover for better visibility.

## Accessibility and SEO

- Images use alt text for better accessibility and SEO.
- The cube is keyboard navigable for accessibility.
- Semantic HTML is used where appropriate.

## Performance

The block is designed to be performant, using CSS transforms for smooth animations and minimal DOM manipulation. Images are loaded as part of the initial content, ensuring they're available when the cube is created.
