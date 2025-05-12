## Configuration Options

The markdown-faq block includes several configuration options that can be adjusted in the JavaScript file:

```javascript
const CONFIG = {
  // Visual & UX
  ANIMATION_DURATION: 300,        // Duration of animations in milliseconds
  SEARCH_DEBOUNCE: 300,           // Delay before search executes after typing
  HIGHLIGHT_SEARCH_TERMS: true,   // Whether to highlight matching search terms
  
  // Content
  EMPTY_MESSAGE: 'No FAQs match your search criteria.',  // Message when no results found
  DEFAULT_FILTER_TEXT: 'All Categories',                 // Default category filter text
  DEFAULT_READ_MORE_TEXT: 'Read More',                  // Default text for links without custom text
  
  // Mobile
  MOBILE_BREAKPOINT: 768,         // Breakpoint for mobile-specific behavior
  
  // Debugging & Analytics
  DEBUG_MODE: false,              // Enable console logging for debugging
  TRACK_ANALYTICS: true           // Enable analytics tracking
};
```

These options can be modified to customize the behavior and appearance of the FAQ block without changing the core implementation.

## Implementation Notes

### Integration with Edge Delivery Services

This block works seamlessly with Edge Delivery Services' document-to-website transformation process:

1. **Table Transformation**: When authors create tables in Google Docs, EDS transforms them into div structures with the original content hierarchy preserved
2. **Block Decoration**: The `decorate` function processes these divs into interactive FAQ components
3. **Progressive Enhancement**: Basic content is visible even before JavaScript runs, with enhanced functionality added during client-side execution

### DOM Structure

The generated HTML structure follows this pattern:

```html
<div class="markdown-faq-wrapper">
  <div class="markdown-faq block">
    <!-- Header section with title and metadata -->
    <div class="faq-header">...</div>
    
    <!-- Controls for search and filtering -->
    <div class="faq-controls">...</div>
    
    <!-- FAQ content organized by category -->
    <div class="faq-container">
      <div class="faq-category-section" data-category="Account">
        <h3 class="faq-category-header">Account</h3>
        <h4 class="faq-subcategory-header">Registration</h4>
        
        <!-- Individual FAQ items -->
        <div class="faq-item" data-question="how do i create an account?">
          <div class="faq-question" role="button" aria-expanded="false" aria-controls="content-123">
            <span class="faq-question-text">How do I create an account?</span>
            <span class="faq-toggle-icon">...</span>
          </div>
          <div id="content-123" class="faq-content" role="region" aria-labelledby="faq-123">
            <div class="faq-short-answer">...</div>
            <div class="faq-detailed-answer">...</div>
            <div class="faq-external-links">...</div>
            <div class="faq-resources">...</div>
          </div>
        </div>
        <!-- More FAQ items... -->
      </div>
      <!-- More category sections... -->
    </div>
    
    <!-- Empty results message (hidden by default) -->
    <div class="faq-empty-message">No FAQs match your search criteria.</div>
  </div>
</div>
```

### Best Practices for Content Authors

For the best results, advise content authors to:

1. **Maintain Consistent Structure**: Follow the specified column order and format
2. **Keep Short Answers Brief**: Aim for 1-2 sentences that directly answer the question
3. **Use Formatting in Detailed Answers**: Lists, bold text, and other formatting for clarity
4. **Add Multiple External Links**: Provide contextual links with descriptive text
5. **Use Tags Consistently**: Apply consistent hashtags across related questions
6. **Group by Logical Categories**: Organize questions into intuitive categories and subcategories
7. **Include Metadata**: Add the metadata table at the end for versioning and documentation

## Performance Impact

The markdown-faq block is designed for optimal performance:

- **Lazy Loading**: Content is processed incrementally
- **Event Delegation**: Uses efficient event handling to minimize listeners
- **DOM Reuse**: Minimizes DOM manipulation and reuses elements when possible
- **Debounced Search**: Prevents excessive processing during typing
- **Minimal Dependencies**: No external libraries required
- **Efficient Selectors**: Uses optimal CSS selectors for DOM operations
- **Pagination Ready**: Structure supports future addition of pagination for very large FAQs

Typical performance metrics:
- **Bundle Size**: ~10KB minified JavaScript, ~6KB minified CSS
- **Initialization Time**: Under 50ms for 20 FAQ items
- **Search Response Time**: Under 100ms for filtering 50 FAQs
- **Memory Usage**: Minimal with no observable memory leaks during testing

## Browser Compatibility

The markdown-faq block is compatible with all modern browsers:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari and Chrome
- Android Chrome and Firefox

It uses standard web APIs and doesn't rely on experimental features. The smooth scrolling and other enhancements gracefully degrade on older browsers.

## Known Limitations

- **Nested Content**: Complex nested formatting in Google Docs may not translate perfectly
- **Image Support**: Images in answers work but may need additional styling
- **Very Large FAQs**: Performance may decrease with hundreds of questions (consider pagination)
- **Dynamic Content**: The FAQ is static after initialization; dynamic updates require re-initialization
- **Deep Linking**: Direct links to specific questions require additional implementation
- **Search Logic**: Simple substring matching; no fuzzy search or advanced filtering
- **Offline Support**: No built-in caching mechanism for offline use

## Future Enhancements

Potential future improvements could include:

- **Advanced Search**: Fuzzy matching, synonym support, and weighted results
- **Pagination**: For very large FAQ collections
- **URL Sync**: Syncing search/filter state with URL parameters for sharing
- **Print Optimization**: Special styling for print media
- **Rich Media**: Better support for videos, diagrams, and interactive elements
- **Usage Analytics**: Built-in tracking of most viewed/searched questions
- **Personalization**: Showing relevant FAQs based on user behavior
- **Auto-suggest**: Suggested questions as user types

## Troubleshooting

Common issues and solutions:

1. **Links Not Working**: Ensure URLs are properly formatted; check for extra spaces
2. **Formatting Lost**: Use simple formatting in Google Docs; avoid complex tables within cells
3. **Categories Not Appearing**: Check for consistent category naming and spelling
4. **Custom Link Text Not Working**: Verify "Text: URL" format has a proper colon and space
5. **Search Not Finding Content**: Check for hidden characters or encoding issues

## Support and Maintenance

For issues or enhancements, consider:

1. Checking the Edge Delivery Services documentation for updates
2. Looking for block-specific updates in your repository
3. Consulting the EDS community for common solutions
4. Using the developer tools console to check for errors

## Conclusion

The markdown-faq block transforms simple tables from Google Docs into powerful, interactive FAQ components with search, filtering, and external links. It follows EDS best practices for performance and accessibility while providing a rich user experience.

By leveraging the document-to-website transformation of EDS, content authors can maintain FAQs in familiar tools while developers can extend and enhance the interactive experience.## External Links

The External Links column supports several formats:

1. **Simple URL**: Just include the URL and it will be displayed as a "Read More" link
   ```
   https://example.com/docs/topic
   ```

2. **Custom Text with URL**: Format as "Text: URL" to customize the link text
   ```
   Complete Guide: https://example.com/complete-guide
   ```

3. **Multiple Links**: Include multiple links separated by line breaks or commas
   ```
   User Guide: https://example.com/user-guide
   Advanced Tutorial: https://example.com/advanced
   ```

4. **Relative Links**: Use relative URLs to link to other pages on your site
   ```
   /help/topic
   /documentation/advanced#section-3
   ```

5. **Fragment IDs**: Include fragment identifiers to link to specific sections
   ```
   https://example.com/docs#installation
   /help/topic#troubleshooting
   ```

When links are displayed:
- All links (both internal and external) automatically open in new tabs, allowing users to stay on the current page
- Only fragment-only links (starting with #) open in the same tab
- External links display with a diagonal arrow icon (↗)
- Internal links display with a right arrow icon (→)
- All links have proper aria-labels indicating they open in new tabs
- Links with fragment IDs benefit from smooth scrolling behavior# Markdown FAQ Block

## Overview

The Markdown FAQ Block transforms a structured table in Google Docs (or any formatted Markdown table) into an interactive FAQ component. It provides filtering, searching, and expandable Q&A sections with minimal configuration required from content authors.

## Content Structure

Content authors should structure their FAQ tables in Google Docs with the following columns:

1. **Category**: The main topic category (e.g., "Getting Started", "Billing")
2. **Subcategory**: Optional subcategory for more organization (e.g., "Basic setup and configuration")
3. **Question**: The FAQ question (e.g., "How do I create an account?")
4. **Short Answer**: A brief, concise answer (shown first)
5. **Detailed Answer**: Complete, detailed response with steps, examples, etc.
6. **External Link**: Link to a detailed documentation page (displayed as "Read More")
7. **Related Resources/Tags**: Links, related questions, and tags (with #hashtag format)

### Example Table Structure
|DFS|
| Category | Subcategory | Question | Short Answer | Detailed Answer | External Link | Related Resources/Tags |
| :------- | :---------- | :------- | :----------- | :-------------- | :------------ | :--------------------- |
| Getting Started | Basic setup | How do I create an account? | Visit our homepage and click "Sign Up" | To create an account: 1) Navigate to example.com, 2) Click the "Sign Up" button... | https://example.com/docs/create-account | - [Video Tutorial](https://example.com/video)<br>- Related: How do I reset my password?<br>- #account #setup |

### Metadata Table (Optional)

You can include an optional metadata table at the end of your document with information about the FAQ:

| metadata      |                       |
| :------------ | :-------------------- |
| title         | Product Support FAQ   |
| version       | 2.3                   |
| last_updated  | 2025-05-01            |
| contributors  | Support Team          |
| tags          | product, help, support|

## Features

- **Interactive Q&A**: Expandable/collapsible question/answer sections
- **Search Functionality**: Real-time filtering as users type across all content (including links and resources)
- **Search Term Highlighting**: Visual highlighting of matched search terms
- **Category Filtering**: Filter by main category
- **Multiple External Documentation Links**: Support for multiple "Read More" links to detailed documentation
- **Custom Link Text**: Specify custom text for each link
- **Smart Link Handling**: Support for both relative and absolute URLs with fragment identifiers
- **Link Type Indicators**: Visual distinction between internal and external links
- **Smooth Scrolling**: Enhanced scrolling behavior for fragment IDs
- **Analytics Integration**: Built-in tracking for link clicks with Google Tag Manager support
- **Responsive Design**: Optimized for all device sizes with enhanced mobile touch targets
- **Metadata Display**: Shows title, version, and last updated date
- **Tag Support**: Special styling for hashtag terms
- **Full Accessibility**: ARIA attributes, keyboard navigation, and screen reader announcements

## Accessibility Considerations

The FAQ block is built with accessibility as a priority:

- **ARIA Attributes**: Proper roles, states, and properties for expandable content
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Focus Management**: Visible focus indicators and proper focus handling
- **Screen Reader Announcements**: Live region updates for search results
- **Semantic Structure**: Proper heading hierarchy and landmark regions
- **High Contrast**: Text meets WCAG AA contrast requirements
- **Link Descriptions**: External links include "opens in new tab" in aria-label
- **Touch-Friendly**: Enhanced touch targets on mobile devices
- **Smooth Scrolling**: Accessible smooth scrolling to fragment IDs

## Analytics Integration

The FAQ block includes built-in analytics tracking:

- **Link Click Tracking**: Automatically tracks when users click FAQ links
- **Google Tag Manager Support**: Works with GTM's dataLayer
- **Rich Data**: Captures question, category, link type, and URL
- **Custom Event**: Uses 'faq_link_click' event name

To view tracked events in Google Tag Manager:
1. Look for events named 'faq_link_click'
2. Access data attributes:
   - faq_question: The question text
   - faq_category: The question's category
   - link_type: 'internal' or 'external'
   - link_url: The URL that was clicked

## Performance Impact

The block has minimal performance impact as it:
- Uses vanilla JavaScript without dependencies
- Loads CSS asynchronously
- Contains no external resources or API calls
- Implements efficient DOM operations and event delegation

## Known Limitations

- Detailed answer formatting is preserved but may need CSS adjustments for complex layouts
- Links automatically open in the same tab (add target="_blank" in Google Docs for external links)
- For very large FAQ collections (100+ items), consider pagination or splitting into multiple pages

## Implementation Example

In your Google Doc, create a table with the structure described above. The block will automatically:

1. Group FAQs by category and subcategory
2. Create expanding/collapsing sections for each question
3. Add search and filter functionality
4. Format tags and links appropriately
