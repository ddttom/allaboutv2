# Integrating the LinkedIn Profile Recreation into a Franklin Project

This document provides a step-by-step guide on how to integrate the LinkedIn profile recreation blocks into a larger Franklin (Adobe Edge Delivery Services) project.

## Prerequisites

- A Franklin project set up and running
- Basic understanding of Franklin's block structure and authoring model

## Integration Steps

1. **Copy Block Files**
   Copy all the block folders from this project's `blocks` directory into your Franklin project's `blocks` directory. This includes:
   - `import-styling`
   - `import-header`
   - `import-profile-summary`
   - `import-experience`
   - `import-education`
   - `import-skills`
   - `import-footer`

2. **Update Your Project's CSS**
   In your project's main CSS file (usually `styles/styles.css`), import the `import-styling` CSS:

   ```css
   @import url('/blocks/import-styling/import-styling.css');
   ```

3. **Add Blocks to Your Content**
   In your Franklin document (e.g., `index.md`), add the LinkedIn profile blocks in the desired order:

   ```markdown
   # Your Page Title

   Other content...

   | import-header |
   | --- |

   | import-profile-summary |
   | --- |
   | [Profile Picture URL] |
   | [Name] |
   | [Title] |
   | [Location] |
   | [Connections] |

   | import-experience |
   | --- |
   | [Company Logo URL] | [Job Title] | [Company Name] | [Employment Period] |
   | ... (repeat for each experience) |

   | import-education |
   | --- |
   | [School Logo URL] | [Institution Name] | [Degree/Field of Study] | [Study Period] |
   | ... (repeat for each education entry) |

   | import-skills |
   | --- |
   | [Skill 1] |
   | [Skill 2] |
   | ... (repeat for each skill) |

   | import-footer |
   | --- |

   Other content...
   ```

4. **Customize Content**
   Replace the placeholder content in brackets with your actual LinkedIn profile information.

5. **Adjust Styling (Optional)**
   If needed, you can customize the appearance by modifying the CSS files in each block's directory.

6. **Handle Dependencies**
   Ensure that your project includes any necessary dependencies. In this case, the blocks are self-contained and don't require external libraries.

7. **Test and Debug**
   After integration, thoroughly test your page to ensure all blocks are rendering correctly and functioning as expected.

## Dynamic Data Integration

To use dynamic data instead of hardcoded content:

1. Create a JSON file (e.g., `linkedin-profile.json`) based on the structure in `samples/linkedin-profile.json`.

2. Use Franklin's data fetching capabilities to load this JSON file.

3. Modify the block JavaScript files to accept and use this dynamic data.

## Accessibility Considerations

- Ensure all images have appropriate alt text.
- Maintain proper heading hierarchy throughout your page.
- Test keyboard navigation and screen reader compatibility.

## Performance Optimization

- The `import-styling` block includes lazy loading for images. Ensure `data-src` is used for image URLs instead of `src` to leverage this feature.
- Consider implementing lazy loading for the "See more" content in experience and education sections if not already present.

## Troubleshooting

- If blocks are not rendering, check the browser console for any JavaScript errors.
- Verify that all necessary files have been correctly copied to your project's `blocks` directory.
- Ensure your Franklin project's configuration allows for these custom blocks.

## Further Customization

For additional customization or feature requests, refer to the README files in each block's directory for specific customization options.