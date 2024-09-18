# Import Styling Block

This block provides global styling and layout structure for the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Styling block sets up CSS variables, global styles, and the overall layout structure to be used across the LinkedIn profile recreation. It doesn't require any specific content in the Franklin document.

## Authoring

No specific authoring is required for this block in Google Docs or Microsoft Word.

## Styling

The block defines CSS variables for colors, fonts, and layout measurements used throughout the LinkedIn profile recreation. It also sets up global styles for the body, buttons, and section cards. Additionally, it provides a responsive two-column layout for desktop views and a single-column layout for mobile devices.

## Behavior

This block includes JavaScript functionality to:
- Organize the content into main and side columns
- Implement lazy loading for images
- Add smooth scrolling for anchor links
- Apply fade-in animations to newly visible elements

## Dependencies

None

## Accessibility

The defined styles ensure proper color contrast and readable font sizes for improved accessibility. The responsive layout enhances the user experience across different devices. Smooth scrolling and fade-in animations improve the overall user experience without compromising accessibility.

## Customization

To customize the overall look and feel of the LinkedIn profile recreation:
1. Modify the CSS variables in `import-styling.css` to change colors, fonts, and layout measurements.
2. Adjust the layout structure in `import-styling.js` if needed.
3. Modify animation timings and behaviors in both CSS and JavaScript files.