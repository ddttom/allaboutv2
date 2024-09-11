# Code Expander

The Code Expander block adds a copy-to-clipboard functionality to all `<code>` elements in the document.

## Usage

This block automatically enhances all `<code>` elements on the page, so no specific usage in the content is required.

## Authoring

Authors can continue to use the standard `<code>` element in their content. The Code Expander block will automatically add the copy-to-clipboard functionality.

## Styling

The block uses the following CSS classes:
- `.code-expander-wrapper`: Wraps the entire component (copy button and code) and provides the border
- `.code-expander-copy`: Styles the copy button
- `.code-expander-copy-text`: Styles the "Copy code" text
- `.code-expander-code`: Wraps the code element for additional styling control

## Behavior

- A "Copy code" button with a clipboard icon (📋) is added on the top left line of each `<code>` element.
- The code is wrapped in a 2px wide bordered box.
- Clicking the button copies the code content to the clipboard.
- The button text changes to "Copied!" with a checkmark (✅) for 2 seconds after successful copying.

## Accessibility

- The copy button has appropriate `aria-label` attributes for screen readers.
- The button's state changes are reflected in the `aria-label` for accessibility.

## Dependencies

This block has no external dependencies.

## Suggestions for Improvement

1. Add error handling for browsers that don't support the Clipboard API.
2. Implement syntax highlighting for code elements.
3. Add an option to expand/collapse long code snippets.
4. Provide configuration options for button placement and text.
5. Add visual feedback for hover and focus states on the copy button.
6. Allow customization of the border color and style.
