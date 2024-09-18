# Import Activity Block

This block creates the activity section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Activity block generates an "Activity" section with follower count and a recent post.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-activity |
| :---- |
| [Follower count] |
| [Post metadata] |
| [Post content] |

## Styling

The block includes styles for the activity section layout and typography. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block displays the follower count and a recent post with its metadata.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- Proper heading hierarchy is maintained for screen readers.

## Customization

To customize the appearance of the activity section:
1. Modify the CSS in `import-activity.css` to adjust styles.
2. Update the HTML structure in `import-activity.js` if needed.