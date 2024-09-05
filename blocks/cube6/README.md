# Cube6 Block

The Cube6 block creates a 3D rotatable cube with 6 faces, each containing an image that links to a specified URL.

## Block Structure

The block should be structured as a table with 6 rows, where each row represents a face of the cube:

| Image | Link |
|-------|------|
| image1.jpg | https://example.com/link1 |
| image2.jpg | https://example.com/link2 |
| image3.jpg | https://example.com/link3 |
| image4.jpg | https://example.com/link4 |
| image5.jpg | https://example.com/link5 |
| image6.jpg | https://example.com/link6 |

## Features

- 3D rotatable cube
- Each face contains an image linked to a URL
- Rotation starts on mouse hover
- Double-click to navigate to the linked page
- Image 1 is positioned correctly on page load

## Customization

You can customize the cube size and rotation speed by modifying the CSS variables in `cube6.css`.