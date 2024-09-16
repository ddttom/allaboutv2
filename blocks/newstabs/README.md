# News Tabs Block

This block creates a set of tabs for different news categories.

## Usage

The News Tabs block displays a row of clickable tabs representing different news categories.

## Authoring

No specific authoring is required in Google Docs or Microsoft Word for this block.

## Styling

The block uses the following CSS classes for styling:
- `.tabs-container`: Container for all tabs
- `.tab-button`: Individual tab button
- `.tab-button.active`: Styling for the currently active tab

## Behavior

1. Tabs are created dynamically based on predefined categories.
2. Clicking a tab marks it as active and triggers a custom 'tabchange' event.
3. The block is responsive and adjusts layout for smaller screens.

## Dependencies

None

## Accessibility

- Tabs are keyboard navigable.
- Active state is visually distinct.

## Suggestions for Improvement

1. Make tabs data-driven instead of hardcoded.
2. Add aria labels for better screen reader support.
3. Implement keyboard navigation between tabs.
4. Add option for custom tab colors or themes.
5. Include a "More" dropdown for additional categories on smaller screens.