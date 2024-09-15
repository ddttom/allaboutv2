# WordCloud Demo

## Introduction

This demo showcases the WordCloud block, which generates a visually appealing word cloud based on the content provided. The word cloud highlights frequently used words or phrases, with the most common term displayed prominently in the center.

## Sample

| WordCloud |
|-----------|
| Franklin, Adobe, Edge Delivery Services, Serverless, Performance |
| JavaScript, CSS, HTML, Responsive Design, User Experience |
| Accessibility, SEO, Web Development, Content Management |
| Blocks, Components, Metadata, GitHub, Version Control |
| Lazy Loading, Optimization, Scalability, Cloud Computing |
| Franklin, Adobe, JavaScript, HTML, CSS, Performance |
| Edge Delivery Services, Serverless, Responsive Design |
| Web Development, Content Management, Version Control |
| Franklin, Adobe, Performance, JavaScript, HTML, CSS |

## How It Works

1. The block processes the content within div elements with the class "wordcloud".
2. It splits the content by commas and counts the frequency of each word or phrase.
3. The words are displayed in a cloud formation, with font sizes proportional to their frequency.
4. The most frequent word is centered and bolded.
5. Words are randomly rotated and colored for visual appeal.

## Customization Options

- Color palette: Modify the `colors` array in the JavaScript file.
- Maximum words displayed: Adjust the slice value in the `sortedWords` variable.
- Font sizes: Modify the font size calculation in the `createWordElement` function.

## Potential Use Cases

1. Summarizing key topics in a blog post or article.
2. Visualizing frequently used terms in a product description.
3. Displaying popular tags or categories in a content management system.
4. Summarizing feedback or survey responses.

## Metadata

| metadata |  |
|----------|------|
| title | WordCloud Demo |
| description | A demonstration of the WordCloud block for Franklin |
| json-ld | article |
| image | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
| author | Tom Cranstoun |
| longdescription | This page showcases the WordCloud block functionality in Franklin, visualizing common web development concepts and technologies. |