# System Patterns

This file documents recurring patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2024-03-20 20:57:00 - Log of updates made.

*

## Coding Patterns

* **Language Detection in code-expander**: The code-expander block uses a series of pattern checks to identify programming languages. These checks are organized in a priority order, with more specific patterns checked first (like shebangs) and more general patterns checked later. This pattern allows for extensible language detection.

* **Comment-based Language Detection**: Added detection for language-specific patterns:
  * `//` or `/*` for JavaScript
  * `<link` for HTML
  * Single `/` at the start of a line for shell scripts
  * `.` or `@` at the start of a line for CSS
  
  This pattern improves language identification accuracy by recognizing common syntax elements.

## Architectural Patterns

* **Block-based Development**: Following Adobe Edge Delivery Services (EDS) pattern of organizing functionality into self-contained blocks.

* **Progressive Enhancement**: The code-expander block enhances existing code snippets with additional functionality (syntax highlighting, copy buttons, etc.) without requiring changes to the original content.

## Testing Patterns

* **Manual Testing with Sample Code**: Testing language detection with various code snippets that start with different patterns to ensure correct identification.

* **Edge Case Testing**: Ensuring that language detection works correctly even with minimal code snippets or snippets with mixed patterns.