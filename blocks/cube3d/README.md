# 3D Cube Block

## Overview

The 3D Cube Block is a Franklin component that creates an interactive, rotatable 3D cube. Each face of the cube displays an image that serves as a clickable link. This block provides an engaging way to present visual content with associated links in a compact, interactive format.

## Features

- Six-sided 3D cube with images on each face
- Each image acts as a clickable link
- Smooth 360-degree rotation using mouse drag
- Responsive design that adapts to different screen sizes
- Built with vanilla JavaScript and CSS3, requiring no external dependencies

## Usage

To implement the 3D Cube Block in your Franklin project:

1. Create a table in your content document with exactly six rows.
2. In each row, place an image in the first column and a link in the second column.
3. Enclose the entire table within the `[cube3d]` block syntax.

The order of the rows in the table corresponds to the cube faces in this sequence: front, back, right, left, top, bottom.

## Customization

The appearance and behavior of the cube can be customized by modifying the `cube3d.css` file. Key customizable properties include:

- Cube dimensions
- Perspective depth
- Face positioning
- Rotation speed
- Responsive breakpoints

Refer to the CSS file comments for specific customization instructions.

## Accessibility Considerations

While the 3D Cube Block offers an interactive visual experience, it's crucial to ensure that all content remains accessible. Consider providing alternative navigation methods or content displays for users who may have difficulty interacting with the 3D interface.

## Performance Optimization

To enhance the performance of the 3D Cube Block:

1. Optimize all images used in the cube faces:
   - Use appropriate file formats
   - Resize images to the display dimensions
   - Apply compression to reduce file sizes

2. Implement lazy loading techniques for images to improve initial page load times.

## Browser Compatibility

The 3D Cube Block is compatible with modern browsers that support CSS 3D transforms and contemporary JavaScript features. For specific browser version support, refer to the compatibility notes in the CSS and JavaScript files.

## Troubleshooting

If you encounter issues with the 3D Cube Block:

1. Ensure you have provided exactly six rows in the content table.
2. Verify that each row contains both an image and a link.
3. Check the browser console for any JavaScript errors.
4. Confirm that both the CSS and JavaScript files are correctly loaded.

## Contributing

Contributions to improve the 3D Cube Block are welcome. Please submit pull requests or open issues in the project repository for bug reports, feature requests, or general improvements.

## License

The 3D Cube Block is released under the MIT License. For full license details, please refer to the LICENSE file in the project repository.
