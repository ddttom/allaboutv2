# Spectrum Card Block: Blog

The Spectrum Card block is a modern, responsive card component for Franklin/EDS projects, leveraging Adobe Spectrum Web Components for consistent design and accessibility. It is ideal for displaying images, titles, descriptions, and action buttons in a visually appealing and accessible way.

## Recent Update
The block now uses the `standard` variant of `<sp-card>` by default. This ensures that the footer slot and action button are always visible, addressing previous issues where the button would not appear with the `quiet` variant.

## Features
- Responsive image support (WebP/PNG/JPEG)
- Spectrum design system integration
- Always-visible footer and action button
- Accessible and keyboard-navigable
- Lazy loading for images
- Customizable via CSS variables

## Usage
| Spectrum Card |
| :------------ |
| Image URL     |
| Title         |
| Description   |
| Action Text   |

## Troubleshooting
- **Action button not visible?** Ensure the card variant is set to `standard`. The `quiet` variant does not display the footer slot.
- Check that all Spectrum Web Components are properly imported and available in your build.

## Summary
The Spectrum Card block is a robust, accessible, and visually consistent solution for card-based layouts in Franklin/EDS projects. With the recent update to use the `standard` variant, it now guarantees the action button is always visible and interactive. 
