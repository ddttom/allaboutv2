# Import Profile Summary Block

This block creates the profile summary section of the LinkedIn profile recreation using Franklin (Adobe Edge Delivery Services).

## Usage

The Import Profile Summary block generates a profile summary section with a background image, profile picture, name, title, location, and connection information.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| import-profile-summary |
| :---- |
| [Profile Picture URL] |
| [Name] |
| [Title] |
| [Location] |
| [Connection Info] |

## Styling

The block includes styles for the profile summary layout, including the background image, profile picture, and text elements. It uses CSS variables defined in the import-styling block for consistent theming.

## Behavior

The block dynamically generates the profile summary based on the provided content. It also includes a "Connect" button, which is currently non-functional.

## Dependencies

- Relies on CSS variables defined in the import-styling block.

## Accessibility

- The profile picture includes an alt text for screen readers.
- Heading hierarchy is properly structured for screen readers.
