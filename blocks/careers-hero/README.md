# Careers Hero

The Careers Hero block is a prominent banner section designed for career pages. It features a compelling headline, description, and call-to-action buttons alongside an image.

## Usage

To use the Careers Hero block, add the following markdown structure to your page:

| Careers Hero |
|--------------|
| Work with us |
| At Amica, we work hard to enrich the lives of others and grow as a company. We believe in teamwork, compassion, and always learning and improving. |
| Explore jobs |
| Volunteer |
| /path/to/your/image.jpg |

## Authoring

1. The first row contains the block name.
2. The second row is the main heading.
3. The third row is the description text.
4. The fourth and fifth rows are the button labels. You can include links in these rows.
5. The last row is the path to the hero image.

## Styling

The block uses custom CSS for layout and styling. The design is responsive and adapts to different screen sizes.

## Behavior

The block is mostly static, with clickable buttons that can be linked to relevant pages.

## Accessibility

- The heading structure uses an `<h1>` tag for the main title.
- Buttons are implemented as `<a>` tags for proper keyboard navigation.
- The image includes an `alt` attribute for screen readers.

## Dependencies

This block relies on the `createOptimizedPicture` function from the `aem.js` script for optimized image loading.

## Customization

You can easily customize the content of this block by modifying the markdown structure. Change the heading, description, button labels, and image path to suit your needs.
