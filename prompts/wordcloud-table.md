# Word Cloud Block

## Generic Info

My name is Tom Cranstoun, I am an AEM Consultant, my Company is Digital Domain Technologies Ltd

## AI Prompt, (c) Tom Cranstoun, September 2024, V 1.0

**Goal:** Create an advanced Franklin block named "wordcloud" that generates a visually appealing word cloud based on the content of table cells below a specified starting point.

## Content Processing

* Identify the starting point in the document (e.g., a specific heading or marker)
* Iterate through all table cells below the starting point
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

## Demo Page

Generate a demo markdown page in Franklin format in the scrap folder, using the wordcloud block with a title, the block, and sample text containing a table with various phrases about web development. Place the metadata table at the end, do not use sections '---'
