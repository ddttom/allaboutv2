# DAM Block

The DAM (Digital Asset Management) block is designed to display a list of images with associated metadata in JSON format.

## Usage

The DAM block takes a table input and converts it into a JSON structure, displaying the output within a code block.

## Authoring

In Google Docs or Microsoft Word, create a table with the following structure:

| DAM | Description | Classification | Tag | Image | Additional Info |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Note | Image description | Classification | Tag | Image | Extra details |

- The first row is the header and should contain the column names as shown above.
- Subsequent rows contain the data for each image.
- The "Image" column should contain an image or a link to the image.

## Styling

The block uses CSS variables for theming:

- `--body-font-family`: Font for the overall block
- `--overlay-background-color`: Background color for the code block
- `--border-color`: Border color for the code block
- `--fixed-font-family`: Font for the code text

## Behavior

The block processes the input table and generates a JSON output containing the following information for each image:

- note
- description
- classification
- tag
- path (extracted from the image source)
- additionalInfo

## Accessibility

The block presents information in a structured JSON format, which can be read by screen readers. The use of semantic HTML elements (`<pre>` and `<code>`) ensures proper interpretation of the content.

## Suggestions for Improvement

1. Add error handling for missing or malformed data in the input table.
2. Implement a toggle feature to switch between JSON view and a more visual representation of the data.
3. Add a search or filter functionality for larger datasets.
4. Implement lazy loading for images in the JSON output to improve performance.
5. Add a copy-to-clipboard button for the JSON output.