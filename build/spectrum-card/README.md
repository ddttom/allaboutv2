# Spectrum Card Block

A modern, accessible card component built using Adobe's Spectrum Web Components. This block provides a consistent, branded card interface that follows Adobe's design system guidelines, now with image support.

## Features

- Responsive card layout with customizable content
- Built using Adobe's Spectrum Web Components
- Accessible by default with proper ARIA attributes
- Supports light theme (Spectrum design system)
- Customizable title, description, image, and action button
- Interactive button with click handling
- Consistent styling with Adobe's design system
- Image slot for richer cards

## Usage

| spectrum-card |
| ------------- |
| Card Title    |
| Card description text goes here |
| Action Button |
| https://example.com/image.png |

## Configuration

### CSS Variables
The block uses Spectrum's design tokens through CSS variables:
- `--spectrum-global-color-gray-50`: Background color
- `--spectrum-global-color-gray-800`: Text color
- `--spectrum-global-color-blue-600`: Accent color for button

### Content Structure
The block expects a table with up to four rows:
1. First row: Card title (required)
2. Second row: Card description (required)
3. Third row: Button text (required)
4. Fourth row: Image URL (optional, but recommended for best appearance)

## Authoring

To create a Spectrum Card in your document:

1. Create a table with the block name in the first cell
2. Add your content in the following rows:
   - Title (required)
   - Description (required)
   - Button text (required)
   - Image URL (optional)
3. The block will automatically style and structure the content

Example in Google Docs:
```
| spectrum-card |
| ------------- |
| Welcome Card  |
| This is a sample card description that explains the card's purpose. |
| Learn More    |
| https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
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
- If an image URL is provided, it is shown in the card's preview slot

## Dependencies

- @spectrum-web-components/theme (v1.6.0)
- @spectrum-web-components/card (v1.6.0)
- @spectrum-web-components/button (v1.6.0)
- @spectrum-web-components/icons-workflow (v1.6.0)

## External Components

This block loads several external [Adobe Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) from npm. Each is responsible for a specific part of the UI or theming:

| Component         | Package/Source                        | Purpose/Role in Block                |
|-------------------|---------------------------------------|--------------------------------------|
| sp-theme.js       | @spectrum-web-components/theme        | Theme context (color/scale/system)   |
| scale-medium.js   | @spectrum-web-components/theme        | Medium sizing                        |
| theme-light.js    | @spectrum-web-components/theme        | Light color palette                  |
| sp-card.js        | @spectrum-web-components/card         | Card UI element                      |
| sp-button.js      | @spectrum-web-components/button       | Button UI element                    |
| icons/arrow-right.js | @spectrum-web-components/icons-workflow| Arrow icon for button               |

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
   - **If you see a warning about <sp-theme>, add `system="spectrum"` to your <sp-theme> element.**

3. Button not working:
   - Check browser console for JavaScript errors
   - Verify click event handler is properly attached
   - Ensure proper button text is provided

4. Gray box appears:
   - Add an image URL as the fourth cell in your block table

## Performance Considerations

- Components are tree-shaken and optimized by Vite
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

## Example

Here's a complete example of how to use the block:

| spectrum-card |
| ------------- |
| Welcome to Our Platform |
| Discover the power of modern web components with Adobe's Spectrum design system. |
| Get Started |
| https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |

This will create a card with:
- Title: "Welcome to Our Platform"
- Description: "Discover the power of modern web components with Adobe's Spectrum design system."
- Button: "Get Started"
- Image: (shown in the card preview)

## Build & Usage

### 1. Install dependencies

In the `build/spectrum-card` directory, run:

    npm install

### 2. Build the bundle

    npm run build

This will output a browser-ready `dist/spectrum-card.js` file and copy it to your EDS blocks folder.

### 3. Use in Franklin/EDS

- Author your content using the `spectrum-card` block table in your document (Google Doc, Word, or Markdown)
- Publish your document/page
- EDS/Franklin will automatically load `/blocks/spectrum-card/spectrum-card.js` and run its `decorate` function for the block

**Note:** You do **not** need to manually add `<script>` tags to your HTML. EDS/Franklin handles block JS loading based on block names and file structure.

## Example: spectrum-card.js (latest)

```js
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-arrow-right.js';

const SPECTRUM_CARD_CONFIG = {
  CARD_VARIANT: 'quiet',
  BUTTON_TREATMENT: 'accent',
  BUTTON_SIZE: 'm',
  MAX_WIDTH: '400px',
  DEFAULT_TITLE: 'Card Title',
  DEFAULT_DESCRIPTION: 'Card description',
  DEFAULT_BUTTON_TEXT: 'Action',
};

export default function decorate(block) {
  const rows = Array.from(block.children);
  const title = rows[0]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_TITLE;
  const description = rows[1]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
  const buttonText = rows[2]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_BUTTON_TEXT;
  const imageUrl = rows[3]?.textContent.trim();

  block.textContent = '';

  const card = document.createElement('sp-card');
  card.setAttribute('heading', title);
  card.setAttribute('variant', SPECTRUM_CARD_CONFIG.CARD_VARIANT);
  card.style.maxWidth = SPECTRUM_CARD_CONFIG.MAX_WIDTH;

  if (imageUrl) {
    const img = document.createElement('img');
    img.setAttribute('slot', 'preview');
    img.src = imageUrl;
    img.alt = title;
    img.style.width = '100%';
    img.style.height = 'auto';
    card.appendChild(img);
  }

  const descriptionDiv = document.createElement('div');
  descriptionDiv.setAttribute('slot', 'description');
  descriptionDiv.textContent = description;

  const footerDiv = document.createElement('div');
  footerDiv.setAttribute('slot', 'footer');
  footerDiv.style.display = 'flex';
  footerDiv.style.justifyContent = 'flex-end';

  const button = document.createElement('sp-button');
  button.setAttribute('treatment', SPECTRUM_CARD_CONFIG.BUTTON_TREATMENT);
  button.setAttribute('size', SPECTRUM_CARD_CONFIG.BUTTON_SIZE);
  button.textContent = buttonText;
  const icon = document.createElement('sp-icon-arrow-right');
  icon.setAttribute('slot', 'icon');
  button.appendChild(icon);
  button.addEventListener('click', () => {
    // eslint-disable-next-line no-console
    console.log('Card action clicked:', { title, description });
  });
  footerDiv.appendChild(button);
  card.appendChild(descriptionDiv);
  card.appendChild(footerDiv);
  block.appendChild(card);
}
```

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
     | https://example.com/image.png |

   - Publish your document/page.
   - EDS/Franklin will automatically load `/blocks/spectrum-card/spectrum-card.js` and run its `decorate` function for the block.

## Notes

- You do **not** need to manually add `<script>` tags to your HTML. EDS/Franklin handles block JS loading based on block names and file structure.
- If you update the block code, always re-run `npm run build` to ensure the latest version is copied to the EDS blocks folder.
- You can further automate or customize the build/copy process in `package.json` as needed.
