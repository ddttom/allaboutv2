# Spectrum Card Block

A modern, accessible card component built using Adobe's Spectrum Web Components. This block provides a consistent, branded card interface that follows Adobe's design system guidelines.

## Features

- Responsive card layout with customizable content
- Built using Adobe's Spectrum Web Components
- Accessible by default with proper ARIA attributes
- Supports light theme (Spectrum design system)
- Customizable title, description, and action button
- Interactive button with click handling
- Consistent styling with Adobe's design system

## Usage

| Spectrum-Card |
| ------------- |
| Card Title    |
| Card description text goes here |
| Action Button |

## Configuration

### CSS Variables
The block uses Spectrum's design tokens through CSS variables:
- `--spectrum-global-color-gray-50`: Background color
- `--spectrum-global-color-gray-800`: Text color
- `--spectrum-global-color-blue-600`: Accent color for button

### Content Structure
The block expects a table with three rows:
1. First row: Card title
2. Second row: Card description
3. Third row: Button text

## Authoring

To create a Spectrum Card in your document:

1. Create a table with the block name in the first cell
2. Add your content in the following rows:
   - Title (required)
   - Description (required)
   - Button text (required)
3. The block will automatically style and structure the content

Example in Google Docs:
```
| Spectrum-Card |
| ------------- |
| Welcome Card  |
| This is a sample card description that explains the card's purpose. |
| Learn More    |
```

## Styling

The card uses Spectrum's design system with the following characteristics:
- Quiet variant for subtle appearance
- Maximum width of 400px
- Proper spacing and typography
- Responsive design
- Accessible color contrast

## Behavior

- The card displays content in a structured layout
- The action button is interactive and logs clicks to the console
- The component is fully responsive
- Supports keyboard navigation
- Maintains proper focus states for accessibility

## Dependencies

- @spectrum-web-components/theme (v1.6.0)
- @spectrum-web-components/card (v1.6.0)
- @spectrum-web-components/button (v1.6.0)
- @spectrum-web-components/icons-workflow (v1.6.0)

## External Components

This block loads several external [Adobe Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) from the CDN. Each is responsible for a specific part of the UI or theming:

| Component         | Package/Source                        | Purpose/Role in Block                |
|-------------------|---------------------------------------|--------------------------------------|
| sp-theme.js       | @spectrum-web-components/theme        | Theme context (color/scale)          |
| scale-medium.js   | @spectrum-web-components/theme        | Medium sizing                        |
| theme-light.js    | @spectrum-web-components/theme        | Light color palette                  |
| sp-card.js        | @spectrum-web-components/card         | Card UI element                      |
| sp-button.js      | @spectrum-web-components/button       | Button UI element                    |
| icons/Info.js     | @spectrum-web-components/icons-workflow| Info icon (optional)                 |

**Details:**

- **sp-theme.js**: Provides the `<sp-theme>` element, which sets the color scheme and scale for all Spectrum components inside it.
- **scale-medium.js**: Loads the "medium" sizing scale for consistent padding, font size, etc.
- **theme-light.js**: Loads the "light" color palette for all Spectrum components.
- **sp-card.js**: Registers the `<sp-card>` custom element, used for the main card container.
- **sp-button.js**: Registers the `<sp-button>` custom element, used for the action button in the card.
- **icons/Info.js**: Registers the Info icon as a web component (not currently used in the UI, but available for use).

All components are loaded from the [jsDelivr CDN](https://cdn.jsdelivr.net/) at version 1.6.0.

## Accessibility

- Proper semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## Troubleshooting

Common issues and solutions:

1. Card not displaying properly:
   - Check that the table structure is correct
   - Verify all required rows are present
   - Ensure proper content in each cell

2. Styling issues:
   - Verify Spectrum Web Components are loading
   - Check browser console for any CSS loading errors
   - Ensure proper theme initialization

3. Button not working:
   - Check browser console for JavaScript errors
   - Verify click event handler is properly attached
   - Ensure proper button text is provided

## Performance Considerations

- Components are loaded asynchronously
- CSS is loaded efficiently through Spectrum's design system
- Shadow DOM usage for style encapsulation
- Minimal DOM manipulation
- Efficient event handling

## Browser Compatibility

Tested and supported in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The card uses Spectrum's light theme by default
- Maximum card width is set to 400px for optimal readability
- Button uses accent treatment for emphasis
- All text content is properly escaped for security

## Suggestions

- Consider adding image support for richer cards
- Add support for dark theme
- Implement custom click handlers for the action button
- Add support for multiple buttons
- Consider adding card variations (e.g., elevated, quiet)

## Example

Here's a complete example of how to use the block:

| Spectrum-Card |
| ------------- |
| Welcome to Our Platform |
| Discover the power of modern web components with Adobe's Spectrum design system. |
| Get Started |

This will create a card with:
- Title: "Welcome to Our Platform"
- Description: "Discover the power of modern web components with Adobe's Spectrum design system."
- Button: "Get Started"

## Build & Usage

### 1. Install dependencies

In the `build/spectrum-card` directory, run:

    npm install

### 2. Build the bundle

    npm run build

This will output a browser-ready `dist/spectrum-card.js` file.

### 3. Use in Franklin/EDS

- Copy `dist/spectrum-card.js` to your `/scripts/` directory or a CDN location.
- In your Franklin project, load the script in your page or block:

    <script type="module" src="/scripts/spectrum-card.js"></script>

- The block will now work with Spectrum Web Components in the browser.

**Note:** This build step is required because Spectrum Web Components use bare module imports that browsers cannot resolve directly from CDN.

## Example: Minimal EDS-Ready spectrum-card.js

Below is a minimal, EDS/Franklin-ready `spectrum-card.js` entry file for Vite. This file imports the required Spectrum Web Components, defines the `decorate` function for Franklin, and ensures the theme is set up correctly:

`// spectrum-card.js (for Vite build)`  
`import '@spectrum-web-components/theme/sp-theme.js';`
`import '@spectrum-web-components/theme/scale-medium.js';`
`import '@spectrum-web-components/theme/theme-light.js';`
`import '@spectrum-web-components/card/sp-card.js';`
`import '@spectrum-web-components/button/sp-button.js';`
`import '@spectrum-web-components/icons-workflow/icons/Info.js';`

`export default function decorate(block) {`
`  const rows = Array.from(block.children);`
`  const title = rows[0]?.textContent.trim() || 'Card Title';`
`  const description = rows[1]?.textContent.trim() || 'Card description';`
`  const buttonText = rows[2]?.textContent.trim() || 'Action';`

`  block.textContent = '';`

`  let themeElement = document.querySelector('sp-theme');`
`  if (!themeElement) {`
`    themeElement = document.createElement('sp-theme');`
`    themeElement.setAttribute('color', 'light');`
`    themeElement.setAttribute('scale', 'medium');`
`    document.body.insertBefore(themeElement, document.body.firstChild);`
`  }`

`  const card = document.createElement('sp-card');`
`  card.setAttribute('heading', title);`
`  card.setAttribute('variant', 'quiet');`
`  card.style.maxWidth = '400px';`

`  const descriptionDiv = document.createElement('div');`
`  descriptionDiv.setAttribute('slot', 'description');`
`  descriptionDiv.textContent = description;`

`  const footerDiv = document.createElement('div');`
`  footerDiv.setAttribute('slot', 'footer');`

`  const button = document.createElement('sp-button');`
`  button.setAttribute('treatment', 'accent');`
`  button.setAttribute('size', 'm');`
`  button.textContent = buttonText;`

`  button.addEventListener('click', () => {`
`    // eslint-disable-next-line no-console`
`    console.log('Card action clicked');`
`  });`

`  footerDiv.appendChild(button);`
`  card.appendChild(descriptionDiv);`
`  card.appendChild(footerDiv);`
`  block.appendChild(card);`
`}`

**How it works:**
- Imports all required Spectrum Web Components (these will be bundled by Vite).
- Exports a `decorate` function for Franklin/EDS to call.
- Ensures a single `<sp-theme>` is present on the page.
- Builds the card using DOM APIs for security and clarity.

After building with Vite, the output in `dist/spectrum-card.js` will be browser-ready and can be loaded as a module in your Franklin/EDS project.

## Metadata

| metadata        |                                                                                |
| :-------------- | :----------------------------------------------------------------------------- |
| title           | Spectrum Card Block Documentation                                              |
| description     | A modern, accessible card component using Adobe's Spectrum Web Components      |
| json-ld         | article                                                                        |
| image           |                                                                                |
| author          | Tom Cranstoun                                                                  |
| longdescription | Comprehensive documentation for the Spectrum Card block, including usage, configuration, and best practices for implementation in Adobe Edge Delivery Services projects. | 

# Spectrum Card Build Instructions

This folder contains the build setup for the Spectrum Card block using Vite. The build process bundles the Spectrum Web Components and outputs a browser-ready file for use in Adobe Edge Delivery Services (EDS/Franklin).

## Build Steps

1. **Install dependencies**

   In this directory, run:
   ```sh
   npm install
   ```

2. **Build and Auto-Copy**

   Run:
   ```sh
   npm run build
   ```
   This will:
   - Build the bundle using Vite
   - **Automatically copy the output (`dist/spectrum-card.js`) to the EDS blocks folder as `../../blocks/spectrum-card/spectrum-card.js`**

   **You do NOT need to copy the file manually.**

3. **Usage in EDS/Franklin**

   - Author your content using the `spectrum-card` block table in your document (Google Doc, Word, or Markdown):

     | spectrum-card |
     | ------------- |
     | Card Title    |
     | Card description text goes here |
     | Action Button |

   - Publish your document/page.
   - EDS/Franklin will automatically load `/blocks/spectrum-card/spectrum-card.js` and run its `decorate` function for the block.

## Notes

- You do **not** need to manually add `<script>` tags to your HTML. EDS/Franklin handles block JS loading based on block names and file structure.
- If you update the block code, always re-run `npm run build` to ensure the latest version is copied to the EDS blocks folder.
- You can further automate or customize the build/copy process in `package.json` as needed.
