# Raw Block

The Raw block processes HTML content within a cell, removing it from the DOM and reinserting it in-place, with added security and validation measures.

## Usage

Use this block when you want to insert raw HTML content into your Franklin page without any additional processing or wrapping, while ensuring the content is safe and valid.

## Authoring

In your Google Docs or Microsoft Word document, create a table with two rows:
1. The first row should contain "Raw" in the first cell.
2. The second row should contain the raw HTML content you want to insert.

| Raw |
|-----|
| <Your raw HTML content here> |

## Behavior

The JavaScript for this block does the following:
1. Extracts the HTML content from the block.
2. Sanitizes the content to remove potentially harmful elements and attributes.
3. Validates the HTML structure.
4. If valid, inserts the sanitized HTML content back into the block.
5. Logs and reports any issues encountered during the process.

This process allows for the insertion of raw HTML without additional wrapping or processing by Franklin, while maintaining security and structural integrity.

## Accessibility

Ensure that any raw HTML content you insert is accessible and follows web accessibility guidelines (WCAG).

## Security

The block implements the following security measures:
1. HTML sanitization to remove potentially harmful elements and attributes.
2. HTML structure validation to ensure only well-formed HTML is inserted.
3. Error handling and reporting for any issues encountered during processing.

## Limitations

- Some complex HTML structures or advanced features may be affected by the sanitization process.
- JavaScript within the raw HTML will be removed for security reasons.

## Suggestions for Further Improvement

1. Implement a more robust HTML sanitization library for enhanced security.
2. Add configuration options to allow certain tags or attributes based on specific use cases.
3. Integrate with a centralized logging or monitoring system for better issue tracking.