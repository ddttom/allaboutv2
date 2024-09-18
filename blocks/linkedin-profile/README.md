# LinkedIn Profile Block

This block creates a LinkedIn-style profile display for use in Franklin projects.

## Usage

The LinkedIn Profile block displays a user's profile information in a format similar to LinkedIn.

## Authoring

To use this block in your Franklin project, create a table with the following structure in your Google Docs or Microsoft Word document:

| LinkedIn Profile |                                                |
|------------------|------------------------------------------------|
| Profile Picture  | URL or path to the profile picture             |
| Name             | Full name of the profile owner                 |
| Title            | Professional title or current position         |
| Location         | Geographic location                            |
| Connections      | Number of connections (e.g., "500+ connections") |

## Styling

The block uses custom CSS classes for styling. The main classes are:

- `.linkedin-profile`: The main container
- `.background-image`: The blue background at the top
- `.profile-picture-container`: Contains the profile picture
- `.profile-picture`: The actual profile picture
- `.profile-name-content`: The name of the profile owner
- `.profile-title-content`: The professional title
- `.profile-location-content`: The location information
- `.profile-connections-content`: The number of connections
- `.contact-button`: The "Contact info" button

You can customize these classes in the `linkedin-profile.css` file to adjust the appearance of the block.

## Behavior

The block is static and does not have any interactive features beyond the "Contact info" button, which can be customized to perform an action when clicked.

## Accessibility

The block uses semantic HTML elements and includes an alt text for the profile picture to ensure accessibility.

## Dependencies

This block does not have any external dependencies beyond the core Franklin libraries.
