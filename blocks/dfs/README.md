# DFS Block (Dynamic FAQ System)

## 1. Overview

The DFS (Dynamic FAQ System) block transforms structured markdown tables into an interactive, searchable FAQ component with advanced filtering capabilities. Content authors can create comprehensive FAQ sections using simple table syntax, while end users enjoy a polished experience with real-time search, category filtering, expandable answers, and smooth interactions.

**Key capabilities:**
- Real-time search across all FAQ content with term highlighting
- Category-based filtering with multi-level organization
- Expandable/collapsible Q&A sections with accessibility support
- Multiple external documentation links per question
- Analytics integration for tracking user interactions
- Responsive design optimized for mobile and desktop
- Built-in metadata display for versioning and documentation management

**Block name:** `DFS`

**Use cases:**
- Product documentation and support pages
- Knowledge base articles
- Help center content
- Customer service resources
- Internal wiki and documentation

## 2. Content Structure

### Required Table Columns

Content authors structure FAQ data using a markdown table with these columns:

1. **Category** - Main topic grouping (e.g., "Account", "Billing", "Technical")
2. **Subcategory** - Optional secondary organization level (e.g., "Registration", "Password Reset")
3. **Question** - The user's question as a clear, concise statement
4. **Short Answer** - Brief 1-2 sentence answer displayed first
5. **Detailed Answer** - Complete response with formatting, lists, and examples
6. **External Link** - One or more links to related documentation (supports custom text)
7. **Related Resources/Tags** - Additional links, related questions, and hashtags

### Example Markdown Table

`Basic FAQ Table Structure`
`| Category | Subcategory | Question | Short Answer | Detailed Answer | External Link | Related Resources/Tags |`
`| Account | Registration | How do I create an account? | Visit our homepage and click "Sign Up" | To create an account: 1) Navigate to example.com, 2) Click the "Sign Up" button in the top right corner, 3) Fill out your information including email and password, 4) Verify your email address, 5) Complete your profile setup | Complete Guide: https://docs.example.com/account/create<br>Video Tutorial: https://videos.example.com/signup | [Getting Started](https://example.com/start) #account #setup |`

### Optional Metadata Table

Add an optional metadata table at the end of your document to display version information and last update date:

`Metadata Table Format`
`| metadata     |                    |`
`| title        | Product FAQ v2.0   |`
`| version      | 2.0                |`
`| last_updated | 2025-11-28         |`

## 3. Usage Examples

### Basic Implementation

`Single Category FAQ`
`| Category | Subcategory | Question | Short Answer | Detailed Answer | External Link | Related Resources/Tags |`
`| Account | Profile | How do I edit my profile? | Click the profile icon and select "Edit Profile" | Navigate to your profile by clicking your avatar in the top right. Select "Edit Profile" from the dropdown menu. Update your information and click "Save Changes". | /help/profile-editing | #profile #settings |`

### Multi-Category Implementation

`Multiple Categories with Subcategories`
`| Category | Subcategory | Question | Short Answer | Detailed Answer | External Link | Related Resources/Tags |`
`| Account | Registration | How do I sign up? | Click "Sign Up" on the homepage | Visit our website and click the "Sign Up" button. Fill in your details and verify your email. | https://docs.example.com/signup | #account #registration |`
`| Billing | Payment | What payment methods do you accept? | We accept major credit cards and PayPal | We currently accept Visa, Mastercard, American Express, Discover, and PayPal. All payments are processed securely through Stripe. | https://docs.example.com/payments | #billing #payment |`
`| Technical | API | How do I get an API key? | Generate one in your account settings | Navigate to Settings > API Keys. Click "Generate New Key" and copy your key immediately as it will only be shown once. | https://api.example.com/docs/auth | #api #authentication |`

### Advanced: Multiple External Links

`Question with Multiple Documentation Links`
`| Category | Subcategory | Question | Short Answer | Detailed Answer | External Link | Related Resources/Tags |`
`| Technical | Integration | How do I integrate your API? | Follow our API documentation | Our API uses REST architecture with JSON responses. Authentication requires an API key passed in the header. Rate limits apply to all endpoints. | Getting Started: https://api.example.com/docs/start<br>Code Examples: https://github.com/example/samples<br>API Reference: https://api.example.com/reference | [SDK Downloads](https://example.com/sdk) #api #integration #developer |`

## 4. Features

### Search Functionality
- **Real-time filtering** - Search results update as users type (300ms debounce)
- **Comprehensive search** - Searches across questions, answers, categories, links, and resources
- **Search highlighting** - Matching terms highlighted in yellow for easy scanning
- **Auto-expand results** - Matching FAQs automatically expand when search is active

### Category Filtering
- **Dropdown filter** - Filter by main category when multiple categories exist
- **Dynamic visibility** - Only relevant category sections shown based on filter
- **Combined filtering** - Search and category filters work together
- **Smart UI** - Filter dropdown only appears when multiple categories exist

### Interactive Q&A
- **Expandable sections** - Click questions to reveal/hide answers
- **Visual indicators** - Rotating chevron icon shows expand/collapse state
- **Keyboard navigation** - Full support for Enter and Space keys
- **ARIA compliance** - Proper roles, states, and properties for screen readers

### Link Management
- **Multiple links per question** - Support for unlimited external documentation links
- **Custom link text** - Format as "Link Text: URL" for descriptive labels
- **Link type indicators** - Visual distinction between internal (→) and external (↗) links
- **Smart target handling** - External links open in new tabs with proper security attributes
- **Fragment link support** - Hash links scroll smoothly to page sections

### Accessibility Features
- **ARIA attributes** - Proper roles, expanded states, and control relationships
- **Keyboard support** - Full keyboard navigation without mouse
- **Focus indicators** - Clear visual focus states for all interactive elements
- **Screen reader announcements** - Live regions announce search results and state changes
- **Touch-friendly** - Enhanced touch targets on mobile devices (minimum 44px)
- **Semantic HTML** - Proper heading hierarchy and landmark regions

### Analytics Integration
- **Google Tag Manager support** - Pushes events to dataLayer
- **Rich event data** - Captures question, category, link type, and URL
- **Custom event name** - Uses 'faq_link_click' event
- **Link click tracking** - Tracks all external and internal link interactions

### Responsive Design
- **Mobile-first approach** - Optimized for small screens
- **Flexible layouts** - Controls stack vertically on mobile, horizontal on desktop
- **Touch optimization** - Larger touch targets and spacing on mobile
- **Breakpoint** - 768px mobile/desktop threshold

## 5. DOM Structure

The block transforms the markdown table into this HTML structure:

`Generated DOM Structure`
`<div class="block dfs">`
`  <!-- Header with title and version info -->`
`  <div class="faq-header">`
`    <h2>Product FAQ</h2>`
`    <div class="faq-meta-info">`
`      <span class="faq-version">Version 2.0</span>`
`      <span class="faq-date">Updated: 2025-11-28</span>`
`    </div>`
`  </div>`
`  `
`  <!-- Search and filter controls -->`
`  <div class="faq-controls">`
`    <div class="faq-search-container">`
`      <span class="faq-search-icon">🔍</span>`
`      <input type="text" class="faq-search" placeholder="Search FAQs...">`
`    </div>`
`    <div class="faq-filter-container">`
`      <label for="faq-category-filter">Filter by:</label>`
`      <select id="faq-category-filter" class="faq-category-filter">`
`        <option value="">All Categories</option>`
`        <option value="Account">Account</option>`
`      </select>`
`    </div>`
`  </div>`
`  `
`  <!-- FAQ content organized by category -->`
`  <div class="faq-container">`
`    <div class="faq-category-section" data-category="Account">`
`      <h3 class="faq-category-header">Account</h3>`
`      <h4 class="faq-subcategory-header">Registration</h4>`
`      `
`      <div class="faq-item" data-question="how do i create an account?">`
`        <div class="faq-question" role="button" aria-expanded="false" tabindex="0">`
`          <span class="faq-question-text">How do I create an account?</span>`
`          <span class="faq-toggle-icon">▼</span>`
`        </div>`
`        <div class="faq-content" role="region" style="display: none;">`
`          <div class="faq-short-answer">Visit our homepage and click "Sign Up"</div>`
`          <div class="faq-detailed-answer">To create an account: 1) Navigate to...</div>`
`          <div class="faq-external-links">`
`            <div class="faq-read-more">`
`              <a href="https://docs.example.com" class="faq-read-more-link external-link" target="_blank">Complete Guide</a>`
`            </div>`
`          </div>`
`          <div class="faq-resources">#account #setup</div>`
`        </div>`
`      </div>`
`    </div>`
`  </div>`
`  `
`  <!-- Empty message shown when no results -->`
`  <div class="faq-empty-message" style="display: none;">No FAQs match your search criteria.</div>`
`</div>`

## 6. Styling

### CSS Variables

The block supports customization through CSS variables:

`CSS Variable Configuration`
`.dfs {`
`  --body-font-family: 'Helvetica Neue', Arial, sans-serif;`
`  --heading-font-size-l: 1.8rem;`
`  --heading-font-size-m: 1.5rem;`
`  --heading-font-size-s: 1.2rem;`
`  --text-color: #333;`
`  --link-color: #0066cc;`
`}`

### Visual Design

- **Question headers** - Solid grey (#777) background with white text, clear affordance
- **Toggle icons** - Rotating chevron with smooth 300ms transition
- **Search highlighting** - Yellow (#ffeb3b) background for matched terms
- **Link styling** - Pills with background colors (blue for internal, grey for external)
- **Shadows** - Subtle box shadows for depth (1px default, 3px when expanded)
- **Border radius** - 4-6px rounded corners throughout

### Responsive Breakpoints

- **Mobile** - Below 768px: Stacked controls, full-width inputs, larger touch targets
- **Desktop** - 768px and above: Horizontal controls, search/filter side-by-side

## 7. JavaScript Configuration

### CONFIG Object

All configuration options are defined at the top of dfs.js:

`Configuration Options`
`const CONFIG = {`
`  // Visual & UX`
`  ANIMATION_DURATION: 300,         // Animation timing in milliseconds`
`  SEARCH_DEBOUNCE: 300,            // Search delay after typing stops`
`  HIGHLIGHT_SEARCH_TERMS: true,   // Enable/disable term highlighting`
`  `
`  // Content`
`  EMPTY_MESSAGE: 'No FAQs match your search criteria.',`
`  DEFAULT_FILTER_TEXT: 'All Categories',`
`  DEFAULT_READ_MORE_TEXT: 'Read More',`
`  `
`  // Mobile`
`  MOBILE_BREAKPOINT: 768,          // Pixel width for mobile/desktop switch`
`  `
`  // Debugging & Analytics`
`  DEBUG_MODE: false,               // Console logging for development`
`  TRACK_ANALYTICS: true            // Google Tag Manager integration`
`};`

### Key Functions

**extractFaqData(block)** - Parses markdown table into structured FAQ data
**buildFaqUI(data)** - Constructs interactive DOM from FAQ data
**createFaqItem(faq)** - Generates individual FAQ elements with ARIA attributes
**toggleFaqItem(question)** - Handles expand/collapse with display block/none
**filterFaqs(block, searchTerm, category)** - Real-time filtering logic
**highlightSearchTerm(item, searchTerm)** - Highlights matching text
**trackLinkClick(link)** - Pushes analytics events to dataLayer

## 8. External Links Format

The External Link column supports multiple formats:

### Simple URL

`Just the URL`
`https://docs.example.com/topic`

Displays as "Read More" button

### Custom Text with URL

`Format: "Text: URL"`
`Complete Guide: https://docs.example.com/guide`

Displays as "Complete Guide" button

### Multiple Links

`Separate with line breaks`
`User Guide: https://docs.example.com/user-guide`
`Advanced Tutorial: https://docs.example.com/advanced`
`API Reference: https://api.example.com/reference`

Each link becomes a separate button

### Relative URLs

`Internal site links`
`/help/topic`
`/documentation/advanced#section-3`

Links to pages on the same domain, open in new tab

### Fragment Links

`Same-page anchors`
`#related-section`

Smooth scroll to section on same page, no new tab

## 9. Accessibility

The DFS block follows WCAG 2.1 AA standards:

### Keyboard Navigation
- **Tab** - Navigate between interactive elements
- **Enter or Space** - Expand/collapse FAQ items
- **Focus indicators** - 2px solid outline with link color

### Screen Reader Support
- **ARIA roles** - button, region for proper element identification
- **ARIA states** - aria-expanded tracks collapse state
- **ARIA relationships** - aria-controls and aria-labelledby connect questions and answers
- **Live regions** - Announces search results to screen readers
- **SR-only text** - Hidden helper text for context

### Visual Accessibility
- **Color contrast** - Grey headers (#777) meet AA standards against white text
- **Touch targets** - Minimum 44x44px on mobile devices
- **Focus states** - Clear 2px outlines on all interactive elements
- **Alt text** - All decorative icons marked aria-hidden="true"

### Link Accessibility
- **Target labels** - External links include "(opens in a new tab)" in aria-label
- **Keyboard access** - All links accessible via keyboard
- **Visual indicators** - Icons show link type (→ internal, ↗ external)

## 10. Analytics Integration

### Google Tag Manager

When a user clicks an FAQ link, the block pushes this event to dataLayer:

`GTM Event Structure`
`{`
`  'event': 'faq_link_click',`
`  'faq_question': 'How do I create an account?',`
`  'faq_category': 'Account',`
`  'link_type': 'external',  // or 'internal'`
`  'link_url': 'https://docs.example.com/account/create'`
`}`

### Custom Analytics

You can extend tracking by adding custom event listeners:

`Custom Analytics Example`
`document.addEventListener('DOMContentLoaded', () => {`
`  const block = document.querySelector('.dfs');`
`  `
`  // Track FAQ expansions`
`  block.querySelectorAll('.faq-question').forEach(question => {`
`    question.addEventListener('click', () => {`
`      const questionText = question.querySelector('.faq-question-text').textContent;`
`      console.log('FAQ expanded:', questionText);`
`    });`
`  });`
`});`

## 11. Browser Compatibility

### Supported Browsers

- **Chrome** - Last 2 versions
- **Firefox** - Last 2 versions
- **Safari** - Last 2 versions
- **Edge** - Last 2 versions
- **Mobile Safari** - iOS 12+
- **Chrome Mobile** - Android 8+

### Required Features

- CSS Grid and Flexbox
- ES6 JavaScript (const, let, arrow functions, template literals)
- Array methods (map, filter, reduce)
- querySelector and querySelectorAll
- addEventListener
- CSS custom properties (CSS variables)

### Progressive Enhancement

- JavaScript disabled: Content remains readable as structured table
- CSS disabled: Semantic HTML maintains logical content order
- No ES6: Transpilation required for older browsers

## 12. Performance Optimization

### Search Debouncing

Search input uses 300ms debounce to prevent excessive filtering operations during typing.

### Event Delegation

Event listeners attached at block level where possible to reduce memory footprint.

### Display Toggle Strategy

Uses simple `display: block` and `display: none` instead of CSS animations for instant response and better performance.

### Lazy Highlighting

Search term highlighting only applies to visible/matched FAQ items, not all content.

### Efficient Filtering

- Category filter uses CSS `display: none` on sections
- Search filter combines category filtering for optimal performance
- Subcategory visibility calculated only after filtering changes

## 13. Troubleshooting

### Search not working

**Problem:** Search input doesn't filter FAQ items

**Solutions:**
1. Check browser console for JavaScript errors
2. Ensure FAQ items have data-question attributes
3. Verify CONFIG.SEARCH_DEBOUNCE is set (default 300ms)
4. Check that faq-search input exists in DOM

### Category filter missing

**Problem:** Category dropdown doesn't appear

**Cause:** Filter only shows when multiple categories exist

**Solution:** Add FAQs from at least 2 different categories

### FAQs won't expand

**Problem:** Clicking question doesn't reveal answer

**Solutions:**
1. Check that faq-content elements exist
2. Verify JavaScript loaded correctly
3. Ensure no CSS conflicts with .faq-content
4. Check browser console for errors

### External links not clickable

**Problem:** External link buttons don't navigate

**Solutions:**
1. Verify link format in External Link column
2. Check that URLs are properly formatted (http:// or https://)
3. Ensure no JavaScript errors preventing event handlers
4. Verify anchor elements generated with href attribute

### Search highlighting not appearing

**Problem:** Matched search terms not highlighted

**Solutions:**
1. Check CONFIG.HIGHLIGHT_SEARCH_TERMS is true
2. Ensure search term is at least 3 characters
3. Verify .search-highlight CSS class exists
4. Check that matching content is in expanded FAQ

### Analytics not tracking

**Problem:** Link clicks not appearing in GTM

**Solutions:**
1. Verify window.dataLayer exists (GTM loaded)
2. Check CONFIG.TRACK_ANALYTICS is true
3. Enable CONFIG.DEBUG_MODE to see console logs
4. Ensure GTM container has 'faq_link_click' trigger configured

## 14. Best Practices

### For Content Authors

**Question writing:**
- Write questions from the user's perspective
- Use natural language and common terminology
- Keep questions concise (under 15 words ideal)
- Start with question words (How, What, Why, When, Where)

**Answer structure:**
- Short Answer: 1-2 sentences, direct response only
- Detailed Answer: Step-by-step instructions with formatting
- Use numbered lists for sequential processes
- Use bulleted lists for options or features
- Bold important terms and actions

**Organization:**
- Group related questions under logical categories
- Use subcategories for fine-grained organization (max 2 levels)
- Aim for 5-10 questions per category
- Order questions from basic to advanced

**Links and resources:**
- Provide descriptive link text ("Complete Setup Guide" not "Click here")
- Link to related documentation for deeper dives
- Use relative URLs for internal content
- Include related question cross-references
- Apply consistent hashtags across related topics

**Metadata:**
- Always include metadata table for versioned documentation
- Update last_updated date when making changes
- Increment version number for significant updates

### For Developers

**Customization:**
- Use CSS variables for theme customization
- Modify CONFIG object for behavior changes
- Extend analytics tracking via custom event listeners
- Add custom link handlers for special URL patterns

**Performance:**
- Limit FAQ sets to under 100 questions per page
- Consider pagination for very large FAQ sets
- Use async/defer for GTM script loading
- Minimize CSS custom property overrides

**Accessibility:**
- Always test with keyboard navigation
- Run automated accessibility audits (axe, WAVE)
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify color contrast ratios

**Testing:**
- Test all link formats (internal, external, fragment)
- Verify search with various term lengths and special characters
- Test category filtering with 1, 2, and many categories
- Validate responsive behavior at multiple breakpoints
- Check analytics events fire correctly
