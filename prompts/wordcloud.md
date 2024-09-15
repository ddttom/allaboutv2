# Word Cloud Block

## Generic Info

My name is Tom Cranstoun, I am an AEM Consultant, my Company is Digital Domain Technologies Ltd

## AI Prompt, (c) Tom Cranstoun, September 2024, V 1.2

**Goal:** Create an advanced Franklin block named "wordcloud" that generates a visually appealing word cloud based on the content of p elements within div structures with the class "wordcloud".

## Variables

The demo folder is to be /blocks/{blockname} where blockname is replaced by the name of the block

## Content Processing

* Identify the parameters in the franklin block
* Parse each text content, splitting phrases or words by commas
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
* Surrounded with an enlarged cloud icon generated from unicode
* Dimensions: Responsive, with a max-width of 800px
* Position: Centered within its container
* Text Display:
  * Font: Sans-serif (e.g., Arial, Helvetica)
  * Colors: Use a predefined color palette (6 colors) for variety
  * Most frequent word:
    * Largest font size (48px)
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
