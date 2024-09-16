# News Tabs Block

This block creates a set of tabs for different news categories.

## Usage

The News Tabs block displays a horizontal list of clickable tabs representing different news categories.

## Authoring

No specific authoring is required in Google Docs or Microsoft Word for this block. The categories are fetched from a JSON file.

## Styling

The block uses the following CSS classes for styling:
- `.news-tabs`: Main container for the tabs
- `.tabs-container`: Flex container for the tabs
- `.tab`: Individual tab button
- `.tab.active`: Active tab styling

## Behavior

Clicking on a tab marks it as active and triggers an event to update the news articles displayed.

## Dependencies

- Requires a JSON file (`news-tabs.json`) with category data

## Accessibility

Tabs are implemented as buttons for keyboard accessibility. Focus states should be added for better keyboard navigation.

## Suggestions for Improvement

1. Implement keyboard navigation between tabs (left/right arrow keys).
2. Add ARIA attributes for better screen reader support.
3. Implement a mobile-friendly dropdown for smaller screens.
4. Add animations for smoother tab transitions.
5. Implement lazy loading for tab content to improve performance.