# Code Expander

The Code Expander block adds a copy-to-clipboard functionality to all `<code>` elements in the document.

## Usage

This block automatically enhances all `<code>` elements on the page, so no specific usage in the content is required.

## Authoring

Authors can continue to use the standard `<code>` element in their content. The Code Expander block will automatically add the copy-to-clipboard functionality.

## Styling

The block uses the following CSS classes:

- `.code-expander-wrapper`: Wraps the code element and copy button
- `.code-expander-copy`: Styles the copy button

## Behavior

- A clipboard icon (📋) is added to the top-right corner of each `<code>` element.
- Clicking the icon copies the code content to the clipboard.
- The icon changes to a checkmark (✅) for 2 seconds after successful copying.

## Accessibility

- The copy button has appropriate `aria-label` attributes for screen readers.
- The button's state changes are reflected in the `aria-label` for accessibility.

## Dependencies

This block has no external dependencies.

## Suggestions for Improvement

1. Add error handling for browsers that don't support the Clipboard API.
2. Implement syntax highlighting for code elements.
3. Add an option to expand/collapse long code snippets.
4. Provide configuration options for button placement and icons.
