# Cube6 Block

This block creates a 3D cube with 6 faces, each containing an image that links to a specified URL. The cube is rotatable in all directions when the mouse hovers over it, and double-clicking a face navigates to the corresponding link.

## Block Structure

The block should be structured as a table with 6 rows, each row representing a face of the cube:

| Image | Link |
|-------|------|
| image1.jpg | https://example1.com |
| image2.jpg | https://example2.com |
| ... | ... |

## Behavior

- The cube rotates freely when the mouse hovers over it.
- Double-clicking a face navigates to the corresponding link.
- The cube is responsive and adjusts its size based on the viewport.

## Customization

You can customize the cube's appearance by modifying the CSS variables in the `cube6.css` file.