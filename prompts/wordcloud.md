# Word Cloud Block

## Generic Info

My name is Tom Cranstoun, I am an AEM Consultant, my Company is Digital Domain Technologies Ltd

## AI Prompt, (c) Tom Cranstoun, September 2024, V 1.0

**Goal:** Create an advanced Franklin block named "wordcloud" that generates a visually appealing word cloud based on the content of table cells with the header "wordcloud".

## variables

the demo folder is to be /blocks/{blockname} where blockname is replaced by the name of the block

## Content Processing

* Identify the table with the header "wordcloud" in the document
* Iterate through all table cells within this table
* Parse each cell's content, splitting phrases or words by commas
* Build a list of words or phrases, tracking their frequency

## Word Cloud Generation

* Create a container for the word cloud
* For each unique word or phrase:
  * Create a span element
  * Set font size based on frequency (more frequent = larger font)
  * Apply random rotation (-15 to 15 degrees) for visual interest
* Place the most frequently used word/phrase in the center, styled in bold

## Display

* Background: Light gray (#f5f5f5)
* surrounded with an enlarged cloud icon generated from unicode
* Dimensions: Responsive, with a max-width of 800px
* Position: Centered within its container
* Text Display:
  * Font: Sans-serif (e.g., Arial, Helvetica)
  * Colors: Use a predefined color palette (5-7 colors) for variety
  * Most frequent word:
    * Largest font size (up to 48px)
    * Bold weight
    * Centered position

## Interactivity

* Hover effect:
  * Slight increase in size (scale 1.1)
  * Change in opacity (0.8)
* Click effect:
  * Display a tooltip with the word's frequency count

## Styling

* Use CSS Flexbox for layout
* Ensure proper spacing between words (margin: 5px, padding: 5px)
* Apply subtle transitions for hover and click effects

## Performance

* Limit the number of displayed words (top 100) for large datasets
* Use efficient DOM manipulation techniques

## Accessibility

* Ensure proper contrast ratios for text visibility
* Add aria-labels to provide context for screen readers

## Additional Features

* Implement a simple filtering system to exclude common words (e.g., "the", "and", "or")
* Allow customization of color palette through CSS variables

## Error Handling

* Display a message if no valid wordcloud data is found

## Responsiveness

* Adjust font sizes and layout for different screen sizes
* Ensure readability on mobile devices (minimum font size: 14px)

## Implementation Notes

* The block should be invoked in the markdown file using the "wordcloud" keyword
* The table containing the words/phrases for the word cloud should have "wordcloud" as its header
* The block's JavaScript should look for a table with the "wordcloud" header, rather than relying on a specific heading structure

## Demo Page Structure

When creating a demo page, use the following structure:

1. Title: "Word Cloud Demo"
2. Brief introduction
3. Section: "Web Development Concepts"
4. Table with header "wordcloud" containing web development-related words/phrases
5. Metadata table at the end

## Scrap Demo File

Create a file named `wordcloud-demo.md` in the demo folder with the following content:

1. Title: "Word Cloud Demo"
2. Introduction explaining the Word Cloud concept
3. Sample table with web development terms to generate the word cloud
4. Explanation of how the Word Cloud block works
5. Information on customization options
6. Potential use cases for Word Clouds
7. Metadata section

Ensure that the demo file includes all necessary elements to showcase the Word Cloud block's functionality and usage within a Franklin project.

## Metadata Example

| metadata |  |
| :---- | :---- |
| title | Word Cloud Demo |
| description | A demonstration of the Word Cloud block for Franklin |
| json-ld | article |
| image | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |
| author | Tom Cranstoun |
| longdescription | This page showcases the Word Cloud block functionality in Franklin, visualizing common web development concepts and technologies. |

Remember to create appropriate README.md, EXAMPLE.md, .json, and .csv files for the block, following the guidelines provided earlier.
