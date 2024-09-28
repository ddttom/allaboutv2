# Showcaser Block Demo

This page demonstrates the functionality of the Showcaser block, which creates an interactive display for code snippets.

## Usage

To use the Showcaser block, simply add the following to your Franklin document:

| Showcaser |
|-----------|

For a compact version:

| Showcaser (compact) |
|---------------------|

## Sample Code Snippets

`HTML Example
<!DOCTYPE html>
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
</html>`

`CSS Example
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

h1 {
    color: #2c3e50;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}`

`JavaScript Example
function greet(name) {
    return `Hello, ${name}!`;
}

const result = greet('Franklin Developer');
console.log(result);

// Output: Hello, Franklin Developer!`

## How It Works

1. The Showcaser block collects all code blocks (enclosed in single backticks) from the page.
2. It creates an interactive "book" interface with a left panel for titles and a right panel for code display.
3. Clicking on a title in the left panel displays the corresponding code in the right panel.
4. The block is responsive and adjusts its layout for different screen sizes.
5. The compact variation stacks the left and right panels vertically.

## Customization

You can customize the appearance of the Showcaser block by modifying the CSS variables in your project's stylesheet. Refer to the README.md file for a list of available variables.

| metadata |  |
|----------|--|
| title | Showcaser Block Demo |
| description | Demonstration of the Showcaser block for Franklin |
| json-ld | article |
| image | |
| author | Tom Cranstoun |
| longdescription | This page showcases the Showcaser block functionality in Franklin, demonstrating how it creates an interactive display for code snippets with an easy-to-use interface. It includes both standard and compact variations. |
