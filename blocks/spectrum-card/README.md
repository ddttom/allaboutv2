# Spectrum Card Block

A modern, accessible card component built using Adobe's Spectrum Web Components. This block provides a consistent, branded card interface that follows Adobe's design system guidelines.

## Features

- Responsive card layout with customizable content
- Built using Adobe's Spectrum Web Components
- Accessible by default with proper ARIA attributes
- Supports light theme (Spectrum design system)
- Customizable title, description, and action button
- Interactive button with click handling
- Consistent styling with Adobe's design system

## Usage

| Spectrum-Card |
| ------------- |
| Card Title    |
| Card description text goes here |
| Action Button |

## Configuration

### CSS Variables
The block uses Spectrum's design tokens through CSS variables:
- `--spectrum-global-color-gray-50`: Background color
- `--spectrum-global-color-gray-800`: Text color
- `--spectrum-global-color-blue-600`: Accent color for button

### Content Structure
The block expects a table with three rows:
1. First row: Card title
2. Second row: Card description
3. Third row: Button text

## Authoring

To create a Spectrum Card in your document:

1. Create a table with the block name in the first cell
2. Add your content in the following rows:
   - Title (required)
   - Description (required)
   - Button text (required)
3. The block will automatically style and structure the content

Example in Google Docs:
```
| Spectrum-Card |
| ------------- |
| Welcome Card  |
| This is a sample card description that explains the card's purpose. |
| Learn More    |
```

## Styling

The card uses Spectrum's design system with the following characteristics:
- Quiet variant for subtle appearance
- Maximum width of 400px
- Proper spacing and typography
- Responsive design
- Accessible color contrast

## Behavior

- The card displays content in a structured layout
- The action button is interactive and logs clicks to the console
- The component is fully responsive
- Supports keyboard navigation
- Maintains proper focus states for accessibility

## Dependencies

- @spectrum-web-components/theme (v1.6.0)
- @spectrum-web-components/card (v1.6.0)
- @spectrum-web-components/button (v1.6.0)
- @spectrum-web-components/icons-workflow (v1.6.0)

## External Components

This block loads several external [Adobe Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) from the CDN. Each is responsible for a specific part of the UI or theming:

| Component         | Package/Source                        | Purpose/Role in Block                |
|-------------------|---------------------------------------|--------------------------------------|
| sp-theme.js       | @spectrum-web-components/theme        | Theme context (color/scale)          |
| scale-medium.js   | @spectrum-web-components/theme        | Medium sizing                        |
| theme-light.js    | @spectrum-web-components/theme        | Light color palette                  |
| sp-card.js        | @spectrum-web-components/card         | Card UI element                      |
| sp-button.js      | @spectrum-web-components/button       | Button UI element                    |
| icons/Info.js     | @spectrum-web-components/icons-workflow| Info icon (optional)                 |

**Details:**

- **sp-theme.js**: Provides the `<sp-theme>` element, which sets the color scheme and scale for all Spectrum components inside it.
- **scale-medium.js**: Loads the "medium" sizing scale for consistent padding, font size, etc.
- **theme-light.js**: Loads the "light" color palette for all Spectrum components.
- **sp-card.js**: Registers the `<sp-card>` custom element, used for the main card container.
- **sp-button.js**: Registers the `<sp-button>` custom element, used for the action button in the card.
- **icons/Info.js**: Registers the Info icon as a web component (not currently used in the UI, but available for use).

All components are loaded from the [jsDelivr CDN](https://cdn.jsdelivr.net/) at version 1.6.0.

## Accessibility

- Proper semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## Troubleshooting

Common issues and solutions:

1. Card not displaying properly:
   - Check that the table structure is correct
   - Verify all required rows are present
   - Ensure proper content in each cell

2. Styling issues:
   - Verify Spectrum Web Components are loading
   - Check browser console for any CSS loading errors
   - Ensure proper theme initialization

3. Button not working:
   - Check browser console for JavaScript errors
   - Verify click event handler is properly attached
   - Ensure proper button text is provided

## Performance Considerations

- Components are loaded asynchronously
- CSS is loaded efficiently through Spectrum's design system
- Shadow DOM usage for style encapsulation
- Minimal DOM manipulation
- Efficient event handling

## Browser Compatibility

Tested and supported in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The card uses Spectrum's light theme by default
- Maximum card width is set to 400px for optimal readability
- Button uses accent treatment for emphasis
- All text content is properly escaped for security

## Suggestions

- Consider adding image support for richer cards
- Add support for dark theme
- Implement custom click handlers for the action button
- Add support for multiple buttons
- Consider adding card variations (e.g., elevated, quiet)

## Example

Here's a complete example of how to use the block:

| Spectrum-Card |
| ------------- |
| Welcome to Our Platform |
| Discover the power of modern web components with Adobe's Spectrum design system. |
| Get Started |

This will create a card with:
- Title: "Welcome to Our Platform"
- Description: "Discover the power of modern web components with Adobe's Spectrum design system."
- Button: "Get Started"

## Metadata

| metadata        |                                                                                |
| :-------------- | :----------------------------------------------------------------------------- |
| title           | Spectrum Card Block Documentation                                              |
| description     | A modern, accessible card component using Adobe's Spectrum Web Components      |
| json-ld         | article                                                                        |
| image           |                                                                                |
| author          | Tom Cranstoun                                                                  |
| longdescription | Comprehensive documentation for the Spectrum Card block, including usage, configuration, and best practices for implementation in Adobe Edge Delivery Services projects. | 
