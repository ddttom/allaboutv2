# WordCloud Demo

This page demonstrates the WordCloud block, which generates a visually appealing word cloud based on the content provided.

## Basic Usage

Here's a simple example of the WordCloud block in action:

| WordCloud |                                                                   |
|-----------|-------------------------------------------------------------------|
|           | Franklin, AEM, Edge Delivery Services, content, authoring         |
|           | blocks, JavaScript, CSS, responsive, performance, SEO             |
|           | Franklin, serverless, GitHub, modern web, accessibility           |
|           | content, blocks, Edge Delivery Services, performance, Franklin    |
|           | AEM, authoring, JavaScript, responsive, GitHub, Franklin          |

## How It Works

The WordCloud block processes the text in each row, splitting words and phrases by commas. It then calculates the frequency of each word or phrase and displays them in a cloud formation. The size of each word is proportional to its frequency, with more frequent words appearing larger.

## Customization

The appearance of the word cloud can be customized through CSS. The block uses a light gray background (#f5f5f5) by default, and words are displayed in various colors from a predefined palette.

## Interactivity

- Hover over a word to see it increase slightly in size and change opacity.
- Click on a word to display a tooltip showing its frequency count.

## Extended Example

Here's a more comprehensive example to showcase the block's capabilities:

| WordCloud |                                                                                     |
|-----------|-------------------------------------------------------------------------------------|
|           | Adobe, Experience Manager, Franklin, Edge Delivery Services, content management     |
|           | serverless, performance, scalability, modern web development, GitHub integration    |
|           | blocks, components, responsive design, mobile-first, accessibility, SEO optimization|
|           | JavaScript, CSS, HTML, document-based authoring, Google Docs, Microsoft Word        |
|           | content delivery, caching, CDN, global reach, personalization, A/B testing          |
|           | Franklin, AEM, headless CMS, API-first, microservices, cloud-native architecture    |
|           | version control, continuous integration, continuous deployment, agile development   |
|           | content authoring, WYSIWYG, markdown, rich text editing, collaborative editing      |
|           | Franklin, Edge Delivery Services, performance optimization, lazy loading, Franklin  |
|           | analytics, insights, user engagement, conversion rate optimization, Franklin        |

## Potential Use Cases

1. **Topic Visualization**: Quickly understand the main themes of a document or dataset.
2. **Keyword Analysis**: Identify the most frequently used terms in marketing materials or content strategies.
3. **Feedback Summary**: Visualize common themes from customer feedback or survey responses.
4. **Content Tagging**: Generate tags for articles or blog posts based on their content.
5. **Trend Analysis**: Display trending topics or hashtags in social media data.

## Accessibility Considerations

The WordCloud block is designed with accessibility in mind:
- Each word has an aria-label providing its frequency for screen readers.
- The block ensures proper contrast ratios for text visibility.
- The minimum font size is set to 14px to maintain readability.

## Performance Note

For optimal performance, the block limits the display to the top 50 most frequent words. This ensures quick rendering and smooth interaction, even with large datasets.

| metadata |  |
| :---- | :---- |
| title | WordCloud Block Demo |
| description | Demonstration of the WordCloud block functionality in Franklin |
| json-ld | article |
| image | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
| author | Tom Cranstoun |
| longdescription | This page showcases the WordCloud block functionality in Franklin, visualizing common web development concepts and technologies used in Adobe Experience Manager (AEM) with Edge Delivery Services. |