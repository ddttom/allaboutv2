# LinkedIn Profile Block

This block creates a LinkedIn-style profile section using content provided in a Franklin document.

## Usage

To use this block, add the following structure to your Franklin document:

| LinkedIn Profile |
|------------------|
| [Profile Picture URL] |
| [Name] |
| [Title] |
| [Location] |
| [Connections] |
| Contact info |

## Example

| LinkedIn Profile |
|------------------|
| https://example.com/profile-picture.jpg |
| John Doe |
| Software Engineer at Tech Company |
| San Francisco Bay Area, California, United States |
| 500+ connections |
| Contact info |

## Styling

The block uses custom CSS classes for styling. You can customize the appearance by modifying the `linkedin-profile.css` file.

## Features

- Displays a profile picture
- Shows name, title, location, and connection information
- Includes a "Contact info" button
- Responsive design for both desktop and mobile views

## Customization

To customize the appearance of the LinkedIn Profile block:

1. Modify the CSS in `linkedin-profile.css`
2. Adjust the JavaScript in `linkedin-profile.js` for structural changes

## Accessibility

- The profile picture includes an alt text for screen readers
- Semantic HTML structure is used for better accessibility

## Dependencies

This block relies on the following files:

- `linkedin-profile.js`
- `linkedin-profile.css`

## Notes

- Ensure that the profile picture URL is accessible and valid
- The "Contact info" text will be automatically converted to a button
