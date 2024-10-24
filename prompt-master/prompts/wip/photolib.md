# U3A Block

## AI Prompt, (c) Tom Cranstoun, October 2024, V 1.0

**Goal:** Create a Franklin block named u3a that displays a list of images with associated metadata in a slider format, allowing for interactive navigation and full-screen viewing.

### Markdown Structure

The markdown should be structured as follows:

| u3a           | By    | Description           | Classification | Tag     | Image | Image2   | Image3   |
| :------------ | :---- | :-------------------- | :------------- | :------ | :---- | :------- | :------- |
| Profile Image | Tom   | Professional headshot | Portrait       | Profile |       |          |          |
| Sample Art    | Chris | Abstract artwork      | Art            | Gallery |       |          |          |
| Nature Photo  |       | Landscape view        | Photography    | Nature  |       |          |          |

### JavaScript (u3a.js)

Create a `u3a.js` file with the following functionality:

- Export a default `decorate` function that takes a `block` parameter.
- Iterate through the block's children (rows), skipping the header.
- Extract data from each row: note, description, classification, tag, image path, and additional info.
- Create a JSON object with the extracted data.
- Implement an image slider with navigation controls and indicators.
- Allow images to be viewed in full-screen mode with zoom and pan capabilities.
- Use arrow keys for navigation and `+`/`-` keys for zooming in full-screen mode.
- Exit full-screen mode with `Esc` or a single click.
- Include error handling for potential issues (e.g., missing image elements).
- Add comments to explain complex logic or important steps.
- Optimize for performance and accessibility.

### CSS (u3a.css)

Create a `u3a.css` file with the following styles:

- Add responsive styles for different screen sizes.
- Use CSS variables for theming and consistency.
- Style the image slider and navigation controls.
- Ensure indicators are visible and active indicators are highlighted.
- Style full-screen mode with appropriate transitions and background.

### Additional Requirements

- Ensure the JavaScript code follows the Airbnb style guide.
- Use `async/await` for any asynchronous operations.
- Add comments to explain complex logic or important steps.
- Optimize for performance and accessibility.

### README.md Structure

The README.md should include:

1. Component name as the main heading.
2. Brief description of the component's purpose.
3. Usage section explaining how to use the component.
4. Authoring section describing content creation in Google Docs or Microsoft Word.
5. Styling section mentioning CSS classes or variables for customization.
6. Behavior section explaining the JSON output generation.
7. Accessibility section highlighting relevant features.

### EXAMPLE.md Structure

The EXAMPLE.md should include:

1. Block name as the main heading.
2. A sample table demonstrating how to structure the input in Google Docs or Microsoft Word.
3. Use realistic examples with varied content to showcase the block's capabilities.

Ensure all files (u3a.js, u3a.css, README.md, and EXAMPLE.md) are created and placed in the `/blocks/u3a/` directory.
