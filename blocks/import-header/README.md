# Import Header Block

This block creates the header section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Header block generates a header with a logo, search bar, navigation menu, and profile icon.

## Authoring

No specific authoring is required for this block in Google Docs or Microsoft Word. The content is generated dynamically.

## Styling

The block includes styles for the header layout, search bar, navigation menu, and profile icon. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block creates a sticky header with navigation links and implements a mobile menu toggle for responsive design.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Navigation menu items are properly structured for screen readers.
- The profile icon and mobile menu toggle include appropriate ARIA attributes.
- Keyboard navigation is supported for all interactive elements.

## Customization

To customize the appearance and behavior of the header:
1. Modify the CSS in `import-header.css` to adjust styles.
2. Update the HTML structure and event listeners in `import-header.js` if needed.
3. Replace placeholder icons with actual SVG icons or an icon font.
