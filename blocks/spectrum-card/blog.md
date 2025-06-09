# Spectrum Card Block: Blog

The Spectrum Card block is a modern, responsive card component for Franklin/EDS projects, leveraging Adobe Spectrum Web Components for consistent design and accessibility. It is ideal for displaying images, titles, descriptions, and action buttons in a visually appealing and accessible way.

## Recent Update
- The block now ensures the theme context is always present via `<sp-theme>`, so Spectrum styling is consistent in all environments.
- All layout and card CSS is injected from JS; **no external CSS file is needed**.
- Responsive grid layout is automatically applied in both EDS and test environments.

## Features
- Responsive image support (WebP/PNG/JPEG)
- Spectrum design system integration
- Always-visible footer and action button
- Accessible and keyboard-navigable
- Lazy loading for images
- Customizable via CSS variables
- **Theme context and grid layout are auto-injected for consistent appearance**

## Usage
| Spectrum Card |
| :------------ |
| Image URL     |
| Title         |
| Description   |
| Action Text   |

## Troubleshooting
- **Action button not visible?** Ensure the card variant is set to `standard`. The `quiet` variant does not display the footer slot.
- **Cards not styled or grid not applied?** Ensure the JS is loaded and running; all CSS and grid layout are injected from JS. Theme context is auto-injected via `<sp-theme>` if missing.
- Check that all Spectrum Web Components are properly imported and available in your build.

## Summary
The Spectrum Card block is a robust, accessible, and visually consistent solution for card-based layouts in Franklin/EDS projects. With the latest updates, it now guarantees consistent styling and layout in all environments, with no need for external CSS files. 
