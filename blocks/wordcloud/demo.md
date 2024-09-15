# WordCloud Demo

This demo showcases the functionality of the WordCloud block, which generates a visually appealing word cloud based on the content provided.

## Sample WordCloud

| WordCloud |
|-----------|
| Adobe, Experience Manager, Edge Delivery Services, Franklin, Helix |
| Content, Authoring, Serverless, Performance, Scalability |
| GitHub, Integration, Block-based, Development, JavaScript |
| CSS, Responsive, Design, Mobile-first, Accessibility |
| SEO, E-L-D, Loading, Pattern, Optimization |
| AEM, CMS, Web Development, Cloud Services, Content Management |
| Headless, API-first, Microservices, Composable, Architecture |
| Version Control, Collaboration, Continuous Integration, Deployment |
| User Experience, Interface Design, Branding, Typography, Layout |
| Analytics, Personalization, A/B Testing, Conversion Rate, Metrics |

## How the WordCloud Block Works

1. **Content Processing**: The block reads the content from the table rows, splitting each cell by commas to extract individual words or phrases.

2. **Frequency Calculation**: It calculates the frequency of each word or phrase across all the provided content.

3. **Visualization**: The block creates a word cloud where:
   - Words are displayed with varying font sizes based on their frequency.
   - The most frequent word is centered and displayed in bold.
   - Words are colored using a predefined color palette.

4. **Interactivity**: 
   - Hovering over a word slightly increases its size and changes opacity.
   - Clicking on a word displays a tooltip showing its frequency count.

## Customization Options

1. **Color Palette**: You can customize the colors used in the word cloud by modifying the CSS variables in your project's stylesheet.

2. **Max Words**: By default, the cloud displays up to 100 words. This can be adjusted in the JavaScript file.

3. **Font Sizes**: The font sizes are calculated based on word frequency. You can adjust the base and maximum font sizes in the JavaScript file.

4. **Container Size**: The maximum width of the word cloud container can be adjusted in the CSS file.

## Potential Use Cases

1. **Content Summary**: Quickly visualize the main topics or themes in a large body of text.
2. **Keyword Analysis**: Identify the most frequently used keywords in your content for SEO optimization.
3. **Feedback Visualization**: Display common terms from user feedback or reviews.
4. **Tag Clouds**: Represent the popularity of tags in a tagging system.
5. **Concept Mapping**: Visualize related concepts in educational or brainstorming contexts.

## Metadata

| metadata | |
|----------|--|
| title | WordCloud Demo |
| description | A demonstration of the WordCloud block for Franklin |
| json-ld | article |
| image | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
| author | Tom Cranstoun |
| longdescription | This page showcases the WordCloud block functionality in Franklin, visualizing common web development concepts and technologies related to Adobe Experience Manager (AEM) with Edge Delivery Services. |