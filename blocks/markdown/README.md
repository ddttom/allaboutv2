# Markdown Block

The Markdown block is a Franklin component that renders Markdown content as HTML, utilizing styles from the Showcaser block.

## Usage

To use the Markdown block, create a block in your Franklin document with the class "markdown". The content within this block will be treated as Markdown and rendered as HTML.

| Markdown |
| :--- |
| # Heading 1 |
| ## Heading 2 |
| This is a paragraph with **bold** and *italic* text. |
| - List item 1 |
| - List item 2 |
| [Link text](https://example.com) |
| ```javascript |
| console.log('Hello, world!'); |
| ``` |

## Styling

The Markdown block uses styles from the Showcaser block, ensuring consistency across your Franklin project. You can customize the appearance by modifying the `markdown.css` file.

## Behavior

The Markdown block converts Markdown syntax to HTML and applies syntax highlighting to code blocks. It supports basic Markdown elements such as headings, paragraphs, bold, italic, links, and code blocks.

## Accessibility

The rendered HTML maintains semantic structure, ensuring good accessibility for screen readers and other assistive technologies.

## Dependencies

This block depends on the `lib-franklin.js` file for syntax highlighting functionality.

## Limitations

The current implementation supports basic Markdown syntax. For more advanced Markdown features, consider integrating a full Markdown parser library.
