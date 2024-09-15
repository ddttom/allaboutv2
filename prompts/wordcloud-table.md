# Word Cloud Block

## Generic Info

My name is Tom Cranstoun, I am an AEM Consultant, my Company is Digital Domain Technologies Ltd

## AI Prompt, (c) Tom Cranstoun, September 2024, V 1.1

**Goal:** Create an advanced Franklin block named "wordcloud" that generates a visually appealing word cloud based on the content of table cells with the header "wordcloud".

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

* Background: Light gray or white
* Dimensions: Responsive, with a max-width of 800px
* Position: Centered within its container
* Text Display:
  * Font: Sans-serif (e.g., Arial, Helvetica)
  * Colors: Use a predefined color palette (5-7 colors) for variety
  * Most frequent word:
    * Largest font size (e.g., 48px)
    * Bold weight
    * Centered position

## Interactivity

* Hover effect:
  * Slight increase in size
  * Change in color or opacity
* Click effect:
  * Display a tooltip with the word's frequency count

## Styling

* Use CSS Grid or Flexbox for layout
* Ensure proper spacing between words
* Apply subtle transitions for hover and click effects

## Performance

* Limit the number of displayed words (e.g., top 100) for large datasets
* Use requestAnimationFrame for smooth animations

## Accessibility

* Ensure proper contrast ratios for text visibility
* Add aria-labels to provide context for screen readers

## Additional Features

* Implement a simple filtering system to exclude common words (e.g., "the", "and", "or")
* Allow customization of color palette through CSS variables

## Error Handling

* Display a message if no content is available for the word cloud
* Handle cases where all words have the same frequency

## Responsiveness

* Adjust font sizes and layout for different screen sizes
* Ensure readability on mobile devices

## Implementation Notes

* The block should be invoked in the markdown file using the "wordcloud" keyword
* The table containing the words/phrases for the word cloud should have "wordcloud" as its header
* The block's JavaScript should look for a table with the "wordcloud" header, rather than relying on a specific heading structure

## Demo Page Structure

When creating a demo page, use the following structure:

1. Title (e.g., "Word Cloud Demo")
2. Brief introduction
3. Section explaining the content (e.g., "Web Development Concepts")
4. Table with header "wordcloud" containing the words/phrases, ensure that there are some repetitions in the table to exercise the code
5. Section for Word Cloud Visualization
6. Metadata table at the end

## Example Usage

| wordcloud |
|-----------|
| Web Development, JavaScript, CSS, HTML, Responsive Design |
| User Experience, Accessibility, Performance, SEO |
| Frontend, Backend, Full Stack, DevOps, Cloud Computing |
| React, Vue, Angular, Node.js, Express |
| Database, SQL, NoSQL, API, RESTful |
| Version Control, Git, GitHub, CI/CD, Agile |
| Mobile First, Cross-Browser Compatibility, Progressive Enhancement |


Remember to create appropriate README.md, EXAMPLE.md, .json, and .csv files for the block, following the guidelines provided earlier.
