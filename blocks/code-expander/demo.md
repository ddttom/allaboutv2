# Code Expander Demo

This page demonstrates the Code Expander block, which enhances code snippets with syntax highlighting, copy functionality, expandable views, raw code viewing, and download capabilities.

## JavaScript Example

| code-expander |
| :------------ |
| ```javascript
// Example JavaScript function
function calculateFactorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * calculateFactorial(n - 1);
}

// Usage example
const result = calculateFactorial(5);
console.log(`Factorial of 5 is: ${result}`);
``` |

## HTML Example

| code-expander |
| :------------ |
| ```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section>
      <h2>About Us</h2>
      <p>This is a sample website created to demonstrate the Code Expander block.</p>
    </section>
  </main>
  <footer>
    <p>&copy; 2025 Example Company</p>
  </footer>
</body>
</html>
``` |

## CSS Example

| code-expander |
| :------------ |
| ```css
/* Base styles */
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  background-color: #f4f4f4;
  padding: 20px;
  margin-bottom: 20px;
}

nav ul {
  display: flex;
  list-style: none;
  padding: 0;
}

nav ul li {
  margin-right: 20px;
}

nav ul li a {
  text-decoration: none;
  color: #333;
}

nav ul li a:hover {
  color: #0066cc;
}

footer {
  background-color: #f4f4f4;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
}

/* Responsive styles */
@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
  }
  
  nav ul li {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
``` |

## Python Example

| code-expander |
| :------------ |
| ```python
# A simple Python class example
class Calculator:
    def __init__(self, initial_value=0):
        self.value = initial_value
        
    def add(self, x):
        self.value += x
        return self
        
    def subtract(self, x):
        self.value -= x
        return self
        
    def multiply(self, x):
        self.value *= x
        return self
        
    def divide(self, x):
        if x == 0:
            raise ValueError("Cannot divide by zero")
        self.value /= x
        return self
    
    def get_result(self):
        return self.value

# Usage example
calc = Calculator(10)
result = calc.add(5).multiply(2).subtract(8).divide(2).get_result()
print(f"Result: {result}")  # Output: Result: 6.0
``` |

## Shell/Terminal Example

| code-expander |
| :------------ |
| ```shell
#!/bin/bash
# A simple shell script to create a backup of a directory

# Define variables
SOURCE_DIR="/path/to/source"
BACKUP_DIR="/path/to/backup"
DATETIME=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_$DATETIME.tar.gz"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory does not exist!"
  exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create the backup
echo "Creating backup of $SOURCE_DIR..."
tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$(dirname "$SOURCE_DIR")" "$(basename "$SOURCE_DIR")"

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup created successfully: $BACKUP_DIR/$BACKUP_FILE"
else
  echo "Error: Backup failed!"
  exit 1
fi
``` |

## JSON Example

| code-expander |
| :------------ |
| ```json
{
  "name": "code-expander",
  "version": "1.0.0",
  "description": "A block that enhances code snippets with syntax highlighting and interactive features",
  "features": [
    "Syntax highlighting",
    "Copy to clipboard",
    "Expandable long code blocks",
    "Line numbering",
    "Raw code view",
    "Download code with custom filename"
  ],
  "languages": [
    "JavaScript",
    "HTML",
    "CSS",
    "Python",
    "Shell",
    "JSON",
    "Markdown"
  ],
  "settings": {
    "longDocumentThreshold": 40,
    "copyButtonResetDelay": 2000,
    "defaultFilename": "code-snippet"
  },
  "author": "Tom Cranstoun",
  "license": "MIT"
}
``` |

## Global Code Block Processing

The Code Expander block can now automatically find and process all code blocks on a page, even if they're not explicitly placed within the block. This is done by adding an empty code-expander block anywhere on your page:

| code-expander |
| :------------ |
|  |

When this empty block is present, it will automatically:
1. Find all `<pre><code>` elements on the page
2. Process them with syntax highlighting and interactive features
3. Move them into the code-expander block

This makes it much easier to enhance all code snippets on a page without having to manually wrap each one in a code-expander block.

## How It Works

The Code Expander block automatically enhances any code block on your page with the following features:

1. **Syntax Highlighting**: Automatically detects the language and applies appropriate syntax highlighting.
2. **Copy Button**: Allows users to easily copy the code to their clipboard.
3. **Expandable View**: For long code blocks (more than 40 lines), provides expand/collapse functionality.
4. **Line Numbers**: Adds line numbers to make it easier to reference specific parts of the code.
5. **Raw View**: Allows users to toggle between formatted and raw code views.
6. **Download Code**: Enables users to download the code as a file with a custom filename.
7. **Global Processing**: Can automatically find and enhance all code blocks on the page.

## Customization Options

The Code Expander block can be customized through CSS variables defined in the `:root` selector. Key customization variables include:

- `--code-expander-button-bg`: Background color for buttons
- `--code-expander-code-bg`: Background color for code blocks
- `--code-expander-line-number-bg`: Background color for line numbers
- `--code-expander-line-number-color`: Text color for line numbers
- `--code-expander-line-number-width`: Width of the line numbers column

## Use Cases

- **Documentation**: Enhance code examples in technical documentation.
- **Tutorials**: Make code snippets in tutorials more interactive and easier to use.
- **Blogs**: Improve the presentation of code in technical blog posts.
- **Knowledge Bases**: Provide better code sharing capabilities in knowledge bases.
- **Educational Content**: Make learning materials more interactive and accessible.
- **Legacy Content**: Easily enhance code blocks in existing content without manual updates.

| metadata        |                                                                                                                                   |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| title           | Code Expander Demo                                                                                                                |
| description     | A demonstration of the Code Expander block for Franklin                                                                           |
| json-ld         | article                                                                                                                           |
| image           |                                                                                                                                   |
| author          | Tom Cranstoun                                                                                                                     |
| longdescription | This page showcases the Code Expander block functionality in Franklin, enhancing code snippets with interactive features and tools. |
