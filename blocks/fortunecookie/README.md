# Fortune Cookie Block

A simple, lightweight block that displays random fortune messages fetched from a JSON data source. Perfect for adding a touch of delight to footer sections or any part of your EDS pages.

## Features

- Fetches random fortunes from a JSON data file
- Simple, clean display format with key-value structure
- Graceful error handling
- Lightweight with no external dependencies
- Works seamlessly in footer or any page section

## Usage

To use the Fortune Cookie block in your EDS project, create a block with the following structure in your markdown:

| Fortune Cookie |
|----------------|
|                |

The block will automatically fetch and display a random fortune from `/data/cookies.json`.

## Authoring

When creating content for the Fortune Cookie block in Google Docs or Microsoft Word:

1. Create a table with two rows
2. In the first cell, type "Fortune Cookie"
3. Leave the second cell empty (content is dynamically loaded)
4. The block will automatically fetch and display a random fortune

## Data Structure

The block fetches fortune data from `/data/cookies.json`. The JSON file follows the EDS standard data structure:

```json
{
  "total": 10,
  "offset": 0,
  "limit": 10,
  "data": [
    {
      "key": "Fortune",
      "value": "Your hard work will soon pay off."
    }
  ],
  "type": "sheet"
}
```

Each fortune consists of:

- `key`: The label displayed before the fortune (typically "Fortune")
- `value`: The fortune message text

## Display Format

The block displays fortunes in a simple, semantic format:

**Fortune:** Your hard work will soon pay off.

The key is rendered in bold (`<strong>` tag) followed by the fortune message.

## Styling

The Fortune Cookie block inherits styles from your global CSS. You can customize its appearance by targeting the `.fortunecookie` class in your stylesheets:

```css
.fortunecookie {
  padding: 1rem;
  border-radius: 8px;
  background: var(--background-color, #f9f9f9);
}

.fortunecookie strong {
  color: var(--accent-color, #007bff);
}

.fortunecookie p {
  font-style: italic;
  margin: 0;
}
```

## Behavior

The Fortune Cookie block:

1. Fetches data from `/data/cookies.json` on page load
2. Randomly selects one fortune from the available data array
3. Displays the fortune in a clean, readable format
4. Shows an error message in the console if fetch fails (no user-facing error to maintain clean UI)

## Performance

The block is optimized for performance:

- Single async fetch request
- Minimal DOM manipulation
- No external dependencies
- Lightweight JSON payload
- Fast random selection algorithm

## Browser Support

This block uses modern web standards and works in all modern browsers that support:

- Fetch API
- Async/await
- ES6 modules
- Template literals

## Configuration

The block uses a simple configuration pattern with the data source URL defined in the code:

```javascript
const url = '/data/cookies.json';
```

To use a different data source, modify this URL in the `fortunecookie.js` file.

## Error Handling

The block includes graceful error handling:

- Failed fetch requests are logged to the console
- No user-facing error messages (maintains clean UI)
- Block container remains empty if data cannot be loaded

## Accessibility

The Fortune Cookie block follows accessibility best practices:

- Uses semantic HTML elements (`<p>`, `<strong>`)
- Provides meaningful content structure
- Maintains proper text contrast
- Supports screen readers

## Integration

This block is designed to work in footer sections but can be placed anywhere on an EDS page:

**In Footer:**

```markdown
| Fortune Cookie |
|----------------|
|                |
```

**As Standalone:**

```markdown
# Daily Inspiration

| Fortune Cookie |
|----------------|
|                |
```

## Maintenance

To update fortune messages:

1. Edit `/data/cookies.json`
2. Add or modify entries in the `data` array
3. Ensure each entry has `key` and `value` properties
4. Update the `total` count to match the number of fortunes

## Troubleshooting

Common issues and solutions:

1. **No fortune displays**
   - Check that `/data/cookies.json` exists and is accessible
   - Verify the JSON structure matches the expected format
   - Check browser console for fetch errors

2. **Same fortune appears repeatedly**
   - This is expected behavior - random selection may produce duplicates
   - The selection is truly random on each page load

3. **Styling not applying**
   - Ensure your CSS targets the `.fortunecookie` class
   - Check for CSS specificity conflicts
   - Verify global styles are loading correctly

## Technical Details

**Block Type:** Simple EDS block (no build process required)

**Dependencies:** None

**Data Source:** `/data/cookies.json`

**Implementation:**

- **JavaScript:** `/blocks/footer/fortunecookie/fortunecookie.js`
- **CSS:** `/blocks/footer/fortunecookie/fortunecookie.css`

**Key Function:**

```javascript
export default async function decorate(block)
```

The decorate function:

1. Accepts the block element as a parameter
2. Fetches fortune data asynchronously
3. Randomly selects one fortune
4. Updates the block innerHTML with formatted content
5. Handles errors gracefully with console logging

## Future Enhancements

Potential improvements for future versions:

- Add fade-in animation for fortune display
- Support for multiple fortune categories
- Option to cycle through fortunes on button click
- Share fortune functionality (social media integration)
- User-facing error messages with retry capability
- Local storage to avoid showing same fortune in short timespan
- Support for fortune translations/internationalization

## Examples

See `example.md` for complete usage examples and variations.

## Related Blocks

- **Quote Block:** For displaying static quotes
- **Text Block:** For standard text content
- **Bio Block:** For author attributions

## Version History

- **v1.0.0** (2024) - Initial release with basic random fortune display
- **v1.1.0** (2024-11-28) - Fixed to use `block` parameter instead of `document.querySelector`

## Support

For questions or issues with the Fortune Cookie block, refer to the main project documentation or check the browser console for error messages during development.
