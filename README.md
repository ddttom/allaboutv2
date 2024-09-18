# LinkedIn Profile Recreation using Franklin Blocks

This project recreates a LinkedIn profile page using Franklin (Adobe Edge Delivery Services) blocks. It demonstrates how to build a responsive and interactive profile page using modular components.

## Features

- Responsive design that works on desktop and mobile devices
- Interactive elements like "See more" buttons for experience and education sections
- Lazy loading of images for improved performance
- Accessible markup with proper ARIA attributes
- Mobile-friendly navigation menu

## Blocks

The project consists of the following blocks:

1. import-styling: Provides global styles and layout structure
2. import-header: Creates the header with navigation
3. import-profile-summary: Displays the user's profile summary
4. import-experience: Shows work experience with a "See more" feature
5. import-education: Displays education history with a "See more" feature
6. import-skills: Lists user's skills
7. import-footer: Creates the page footer

## Usage

To use this LinkedIn profile recreation in your Franklin project:

1. Copy the block folders from the `blocks` directory into your project's `blocks` directory.
2. Copy the `demos/import-linkedin-profile.md` file to your project's `demos` directory.
3. Customize the content in the `import-linkedin-profile.md` file to match the desired profile information.

## Customization

To customize the appearance of the LinkedIn profile:

1. Modify the CSS variables in `blocks/import-styling/import-styling.css` to change colors, fonts, and layout measurements.
2. Update the individual block CSS files to adjust specific component styles.
3. Modify the JavaScript files in each block folder to change behavior or add new functionality.

## Accessibility

This project aims to be accessible to all users. It includes proper heading structure, ARIA attributes, and keyboard navigation support. Always test any modifications with screen readers and keyboard navigation to ensure continued accessibility.

## Performance

The project uses lazy loading for images to improve performance. Ensure that all image tags use the `data-src` attribute instead of `src` for non-critical images to take advantage of this feature.

## Browser Support

This project is designed to work on modern browsers. It uses CSS Flexbox and CSS Grid for layout, which may not be fully supported in older browsers.

## Contributing

Contributions to improve the LinkedIn profile recreation are welcome. Please submit issues and pull requests on the project repository.

## License

This project is licensed under the MIT License.
