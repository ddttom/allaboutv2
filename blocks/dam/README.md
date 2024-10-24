# DAM Block

A block for displaying Digital Asset Management (DAM) metadata in JSON format. This block processes tabular data containing image information and presents it as formatted JSON output.

## Features
- Converts tabular data into structured JSON format
- Extracts image paths from both image and link elements
- Supports additional metadata fields
- Responsive design with proper code formatting

## Usage
| DAM | Note | Description | Classification | Tag | Image | Additional Info |
| --- | ---- | ----------- | -------------- | --- | ----- | --------------- |
| | Sample | Image desc | Category | Tag1 | [Image] | Extra details |

## Authoring
In Google Docs or Microsoft Word:
1. Create a table with 7 columns
2. First cell must contain "DAM"
3. Subsequent rows should contain:
   - Note
   - Description
   - Classification
   - Tag
   - Image (insert image or link)
   - Additional Information (optional)

## Styling
The block uses CSS variables for customization:
- `--dam-background`: Background color for the code block
- `--dam-text-color`: Text color for the JSON output
- `--dam-font-family`: Font family for the code
- `--dam-padding`: Padding around the code block
- `--dam-border-radius`: Border radius of the code block

## Behavior
1. Processes table rows after the header
2. Extracts image paths from image or link elements
3. Generates formatted JSON output
4. Displays result in a pre/code block

## Accessibility
- Semantic HTML structure using pre and code elements
- Proper color contrast for readability
- Responsive design for various screen sizes
