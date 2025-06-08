# Using Spectrum Components in Adobe Edge Delivery Services Blocks

 
## Adobe Spectrum Web Components \- A Natural Fit

For Adobe-centric projects,  [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/guides/adding-component/) offer an even more natural choice. These components follow Adobe's design system, ensuring visual consistency across Adobe products and experiences. Since they're built on web standards, they integrate smoothly with EDS's architecture while providing the familiar look and feel users expect from Adobe applications.

Spectrum Web Components bring several advantages to EDS development. They're built with accessibility at their core, supporting keyboard navigation, screen readers, and high contrast modes out of the box. The components handle complex interactions \- think date pickers, colour selectors, and data tables \- that would take considerable time to build from scratch. They also support Adobe's theming system, allowing your blocks to adapt to light and dark modes automatically.

Here's a practical example showing how to create a feature card block using Spectrum Web Components:  
![][image3]

Live Example

| spectrum-card |
| :---- |
| Product Feature |
| Transform your workflow with our latest innovation |
| Learn More |

The implementation combines Spectrum's design language with EDS's block structure:

 
This example shows how Spectrum Web Components provide sophisticated UI elements with minimal code. The card component handles focus states, hover effects, and responsive behaviour automatically. You get Adobe's design language without writing custom CSS or managing complex state.

 
These libraries also solve common development challenges. They provide accessibility features out of the box, handle browser inconsistencies, and offer comprehensive theming systems that integrate well with EDS's approach to styling. Since they're built on web standards, they'll continue working as browsers evolve.

 
For projects requiring Adobe's design language, start with Spectrum Web Components. They provide a complete design system that works perfectly with EDS's architecture. The components are well-documented and actively maintained, making them a reliable choice for production applications.

## Wrapping Up

| metadata |  |
| :---- | :---- |
| title | Using Web Components in Adobe Edge Delivery Services Blocks |
| description | A comprehensive guide to implementing web components in EDS blocks, including best practices. |
| json-ld | article |
| image |  |
| author | Tom Cranstoun |
| longdescription | An in-depth guide to implementing web components in Adobe Edge Delivery Services blocks. Covers best practices, testing strategies, performance optimization, troubleshooting, and browser compatibility. Includes detailed sections on component lifecycle, accessibility, and real-world implementation examples. Features practical examples using custom components, Shoelace, and Adobe Spectrum Web Components. Provides solutions for common issues. |

# Building and Deploying the Spectrum Card Block in EDS

## How to Build and Deploy

1. **Install dependencies**

   In the `build/spectrum-card` directory, run:
   ```sh
   npm install
   ```

2. **Build and Deploy**

   Run:
   ```sh
   npm run build
   ```
   This will:
   - Build the Spectrum Card block using Vite
   - Automatically create the `/blocks/spectrum-card/` directory if it doesn't exist
   - Copy the built JS file to `/blocks/spectrum-card/spectrum-card.js`
   - Create a blank `/blocks/spectrum-card/spectrum-card.css` file (required by EDS)

3. **Author Content in EDS/Franklin**

   In your document (Google Doc, Word, or Markdown), use a table like this:

   | spectrum-card |
   | ------------- |
   | Card Title    |
   | Card description text goes here |
   | Action Button |

   - The block name goes in the first cell.
   - The next rows are: title, description, and button text.

4. **Publish and Test**

   - Publish your document/page.
   - EDS/Franklin will automatically load `/blocks/spectrum-card/spectrum-card.js` and `/blocks/spectrum-card/spectrum-card.css` and run the block's `decorate` function.

## Benefits of This Workflow

- **Automation:** The build script handles bundling, copying, and CSS creation in one step, reducing manual errors.
- **Maintainability:** Source and build files are separated, keeping your `/blocks/` directory clean and production-ready.
- **EDS Compatibility:** Ensures all required files are present and in the correct structure for EDS/Franklin to auto-detect and load the block.
- **Scalability:** This approach can be reused for other blocks, making it easy to manage a growing library of custom components.
- **No Manual Script Tags:** EDS/Franklin automatically loads block JS and CSS based on block names and file structure—no need to edit HTML or add `<script>` tags.

## Summary Table

| Step         | Command / Action                                      |
|--------------|------------------------------------------------------|
| Install      | `npm install` in `build/spectrum-card`               |
| Build/Deploy | `npm run build` in `build/spectrum-card`             |
| Author       | Use a table with `spectrum-card` as the block name   |
| Publish      | Publish your document/page in EDS/Franklin           |
| Test         | EDS auto-loads the block and applies your changes    |

This workflow streamlines development and deployment for custom blocks in Adobe Edge Delivery Services.
