# Import Design Block

## Goal

Create a set of Franklin blocks that can create a style guide for the given website URL, following normal Franklin development rules.

## Functionality

1. **URL Input**
   The URL is given in the prompt.

2. **Design Analysis**
   * Fetch the HTML/CSS  content of the provided URL.
   * Analyze the structure and identify main components, colors, backgrounds, heading styles
   
   Analyze and document these key elements:

Color scheme: Note primary, secondary, and accent colors
Typography: Identify fonts used for headings and body text
Layout: Observe the overall structure and grid system
Imagery: Look at the style of images, icons, and graphics
Spacing: Note consistency in margins, padding, and whitespace
Navigation: Examine the menu style and placement
Buttons and forms: Observe their design and interaction states
Responsiveness: Check how the design adapts to different screen sizes
  
  Create appriopriate franklin blocks to showcase the following

  Logo Usage
Color Palette
Typography
Layout and Grid System
Imagery and Icons
UI Elements
Spacing and Alignment
Interactive Elements
Accessibility Guidelines
Voice and Tone
Code Snippets and Assets

look through the Current blocks folder and see if they can be used in a DEMO.md

1. **Block Creation**
   * For each identified component, create a corresponding Franklin block, use blocks named {styleguide}-blockname where {styleguide} is replaced by the name of the styleguide, do not use block names that already exist in the repo.
   * Generate the necessary JavaScript, CSS, and markdown files for each block. do not place text in the parameter rows, just placeholder names, 

1. **Layout Recreation**
   * create using Franklin's block structure.
   * Ensure responsive design principles are followed.

2. **Asset Handling**
   * Use sample assets from the .cursorrules.md file.
   * Update references in the created blocks to use the local assets.

3. **Styling**
   * extract overarching styling and associate it with the block import-styling
   * Extract and adapt the CSS styles from the original design.
   * Create a cohesive set of CSS variables for easy theming, in the blocks.

4. **Interactivity**
   * Identify and recreate interactive elements (e.g., dropdowns, sliders, modals).
   * Implement necessary JavaScript functionality for these elements, in the blocks.

5. **Accessibility**
   * Ensure all created blocks maintain or improve the accessibility of the site
   * Add appropriate ARIA labels and roles where necessary.

6. **Performance Optimization**
   * Implement lazy loading for images and non-critical content.
   * Optimize asset sizes and formats for web delivery.

7. **Franklin Metadata**
    * Generate appropriate metadata for the recreated design, including title, description, and other relevant fields.

8. **Demo Page**
    * Create a demo page in Franklin format, in the scrap folder that showcases the styleguide.
    * Include all recreated blocks in their appropriate layout.
    * Represent each block as a single-cell table with the block name inside, add parameters in the rows that follow.

## Error Handling

* Gracefully handle errors.
* Provide clear error messages for any issues encountered.

## Best Practices

* Adhere to Franklin (Adobe Edge Delivery Services) development best practices.
* Ensure all created blocks are modular and reusable.
* Follow Airbnb JavaScript Style Guide for code consistency.
* Use async/await for asynchronous operations.

## Demo Page Structure

1. Title: "Style Guide"
2. import-styling as a table
3. Recreated Header (as a table)
4. Recreated Navigation (as a table, if separate from header)
5. Recreated Main Content Areas (as tables)
6. list primary and secondary colors as blocks
7. list other colors available as a list in a block
8. list each of h1,h2,h3,h4,h5,h6 in a block
9. 

# GreenTech Solutions Website Style Guide

## 1. Logo Usage

- Primary logo: Full color on white background
* Minimum size: 100px width
* Clear space: Equal to 'G' height around all sides
* Don't: Stretch, change colors, or use on busy backgrounds

## 2. Color Palette

- Primary: 
  * Green: #2ECC71 (RGB: 46, 204, 113)
  * Blue: #3498DB (RGB: 52, 152, 219)
* Secondary:
  * Light Gray: #ECF0F1 (RGB: 236, 240, 241)
  * Dark Gray: #34495E (RGB: 52, 73, 94)
* Accent: 
  * Orange: #E67E22 (RGB: 230, 126, 34)

## 3. Typography

- Headings: Montserrat (Bold)
  * H1: 36px
  * H2: 30px
  * H3: 24px
* Body: Open Sans (Regular)
  * Paragraph: 16px
  * Small text: 14px
* Line height: 1.5
* Letter spacing: 0.5px for headings

## 4. Layout and Grid System

- Max-width: 1200px
* Columns: 12-column grid
* Gutter: 20px
* Breakpoints:
  * Mobile: < 768px
  * Tablet: 768px - 1024px
  * Desktop: > 1024px

## 5. Imagery and Icons

- Photography: High-contrast, nature-focused imagery
* Icons: Custom line icons, 2px stroke, rounded corners
* Illustrations: Flat design, using primary color palette

## 6. UI Elements

- Buttons:
  * Primary: Green background, white text
  * Secondary: White background, green border and text
  * Hover: 10% darker shade
* Forms:
  * Input fields: 2px border radius, light gray background
  * Checkboxes: Custom green checkmark

## 7. Spacing and Alignment

- Section padding: 80px top/bottom
* Element margin: 20px bottom
* Text alignment: Left-aligned, centered for short headings

## 8. Interactive Elements

- Hover animations: 0.3s ease transition
* Page transitions: Fade effect, 0.5s duration
* Micro-interactions: Subtle scale effect on buttons (1.05)

## 9. Accessibility Guidelines

- Color contrast: Minimum 4.5:1 for normal text, 3:1 for large text
* Focus states: Blue outline (2px) on interactive elements
* Alt text: Descriptive alt text for all images

## 10. Voice and Tone

- Writing style: Clear, concise, and optimistic
* Terminology: Use "sustainable" instead of "green", "innovative" over "cutting-edge"

## 11. Code Snippets

```css
:root {
  --primary-green: #2ECC71;
  --primary-blue: #3498DB;
  --secondary-light: #ECF0F1;
  --secondary-dark: #34495E;
  --accent-orange: #E67E22;
}

body {
  font-family: 'Open Sans', sans-serif;
  line-height: 1.5;
  color: var(--secondary-dark);
}

h1, h2, h3 {
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
}
```

## 12. Version Control

- Current version: 1.0
* Last updated: September 15, 2024
* Update frequency: Quarterly
9. Recreated Sidebar (as a table, if applicable)
10. Recreated Footer (as a table)
11. Metadata Table (at the end)

Example of how to represent a block in the demo page:

| block-name |
| :---- |
| |

Remember to create README.md, EXAMPLE.md, and sample JSON/CSV files for each created block as needed. Ensure all markdown files end with a newline and lists are surrounded by blank lines.

## Additional Considerations

1. **EXAMPLE.md Creation**
    * Create EXAMPLE.md files for each block, demonstrating how to use the block in a Franklin document.
    * Include various configuration options and use cases in the examples.

2. **Version Control**
    * Commit changes to version control after creating or modifying blocks.
    * Use meaningful commit messages describing the changes made.

3. **Testing**
    * Test each created block individually to ensure it functions as expected.
    * Test the entire demo page to verify the overall layout and interactions.
    * Consider creating automated tests for complex blocks.

4. **Documentation**
    * Provide thorough documentation in README.md files for each block.
    * Include information on block purpose, usage, configuration options, and any dependencies.

5. **Customization Options**
    * Where appropriate, include customization options in blocks to increase their flexibility.
    * Document these options clearly in the block's README.md file.

Remember to balance faithfulness to the original design with the need for modularity and reusability in the Franklin ecosystem.
