# Careers Hero

This component displays a hero banner for a careers section, featuring a title, description, two call-to-action buttons, and an image.

## Usage

To use the Careers Hero component, add the following structure to your page:

| Careers Hero |
|--------------|
| Image URL    |

## Authoring

When creating content for the Careers Hero in Google Docs or Microsoft Word:

1. Add a table with one row and one column.
2. Set the first cell's content to "Careers Hero".
3. In the second row, add the URL for the hero image.

## Styling

The component uses custom CSS classes for styling. You can customize the appearance by modifying the `careers-hero.css` file.

## Behavior

The component is static, with clickable buttons that can be linked to relevant pages or actions. The image is optimized using the `createOptimizedPicture` function from the AEM scripts.

## Accessibility

- The image includes an alt text for screen readers.
- The buttons are keyboard accessible and use semantic HTML (anchor tags).

## Dependencies

This component depends on the `createOptimizedPicture` function from the AEM scripts.

## Suggestions for Improvement

1. Add functionality to dynamically update the text content and button links.
2. Implement a content management system to easily update the content without modifying the code.
3. Add animations or transitions to enhance the visual appeal of the component.
4. Implement lazy loading for the image to improve performance.
5. Add more customization options, such as the ability to change colors or fonts through a configuration file.
6. Implement localization support for multi-language websites.
