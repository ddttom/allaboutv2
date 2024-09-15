# WordCloud

This demo showcases the WordCloud block, which generates a visually appealing word cloud based on the provided content.

## Example

| WordCloud |
|-----------|
| AEM, Franklin, Edge Delivery Services, Content Management, Digital Experience, AEM, Franklin |
| Web Development, JavaScript, CSS, HTML, Responsive Design, AEM, Content Management |
| User Experience, SEO, Performance, Accessibility, Franklin, Edge Delivery Services |
| Headless CMS, API-first, Microservices, Cloud-native, Serverless, AEM |
| Component-based, Reusable, Modular, Scalable, Flexible, Customizable |
| Mobile-first, Cross-platform, Progressive Enhancement, Adaptive Design |
| Version Control, Git, GitHub, Continuous Integration, Continuous Deployment |
| Content Authoring, WYSIWYG, Drag-and-drop, Templates, Workflows |
| Analytics, Personalization, A/B Testing, Conversion Optimization |
| Security, Authentication, Authorization, Data Privacy, Compliance |

## How it works

1. The WordCloud block processes the content provided in the table rows.
2. It counts the frequency of each word or phrase, excluding common words like "the" and "and".
3. The words are then displayed in a cloud formation, with more frequent words appearing larger.
4. The most frequent word is centered and styled in bold.
5. Words are randomly rotated and colored for visual interest.
6. Hovering over a word slightly increases its size and changes opacity.
7. Clicking a word displays its frequency count in a tooltip for 2 seconds.

## Customization

The appearance of the WordCloud can be customized by modifying the CSS in the `wordcloud.css` file. You can adjust colors, fonts, sizes, and layout as needed.

## Potential Use Cases

1. Visualizing key topics in a blog post or article
2. Summarizing frequently used terms in a product description
3. Highlighting popular tags or categories in a content management system
4. Presenting survey results or feedback in a visually engaging way
5. Showcasing skills or technologies on a portfolio website

## Accessibility

The WordCloud block is designed with accessibility in mind. Each word has an aria-label that provides its frequency information for screen readers, ensuring that the content is accessible to all users.

| metadata |  |
|----------|------|
| title | WordCloud Demo |
| description | A demonstration of the WordCloud block for Franklin |
| json-ld | article |
| image | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
| author | Tom Cranstoun |
| longdescription | This page showcases the WordCloud block functionality in Franklin, visualizing common web development concepts and technologies related to Adobe Experience Manager (AEM) and Edge Delivery Services. |
