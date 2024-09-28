# Showcaser Block Demo

This page demonstrates the functionality of the Showcaser block, which displays code snippets in an interactive, book-like interface.

## Standard Showcaser

| Showcaser |
| :---- |
| `HTML Example` |
| `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML document.</p>
</body>
</html>` |
| `CSS Example` |
| `body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #007bff;
}` |
| `JavaScript Example` |
| `function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet('Franklin Developer'));

// Output: Hello, Franklin Developer!` |

## Compact Showcaser

| Showcaser (compact) |
| :---- |
| `Compact HTML` |
| `<h1>Compact Example</h1>
<p>This is a compact showcaser demo.</p>` |
| `Compact CSS` |
| `.compact {
    font-size: 14px;
    padding: 10px;
}` |

## How It Works

The Showcaser block collects all code snippets enclosed in single backticks from the markdown table. It then creates an interactive interface with a left panel showing the titles (first line of each snippet) and a right panel displaying the selected code snippet.

Clicking on a title in the left panel updates the right panel with the corresponding code snippet. The block is responsive and adjusts its layout for different screen sizes.

The compact variation provides a more condensed layout, suitable for displaying smaller code snippets or when space is limited.

| metadata |  |
| :---- | :---- |
| title | Showcaser Block Demo |
| description | Demonstration of the Showcaser block for displaying code snippets |
| json-ld | article |
| image | |
| author | Tom Cranstoun |
| longdescription | This page showcases the Showcaser block functionality in Franklin, demonstrating how it can be used to display code snippets in an interactive, book-like interface. |
