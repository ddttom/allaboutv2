# u3A block

## AI Prompt, (c) Tom Cranstoun, October 2024, V 1.0

**Goal:** Create a Franklin block named u3a that contains a list of images with associated metadata in the rows


The markdown is similar to

| u3a           | By    | Description           | Classification | Tag     | Image | Image2   | Image 3 |
| :------------ | :---- | :-------------------- | :------------- | :------ | :---- | :------- |:------- |
| Profile Image | Tom   | Professional headshot | Portrait       | Profile |       |          |         |
| Sample Art    | Chris | Abstract artwork      | Art            | Gallery |       |          |         |
| Nature Photo  |       | Landscape view        | Photography    | Nature  |       |          |         |


The first cell in the table is the table name, subsequent rows contain:
1. A note
2. by (Author Name)
3. A textual description
4. A classification name
5. A tagname
6. A picture element or an href element in the fifth, sixth and seventh cell
7. Any cell may be blank, or missing, or null - handle gracefully

## JavaScript (dam.js)

Create a `u3a.js` file with the following functionality:
- Export a default `decorate` function that takes a `block` parameter
- Iterate through the block's children (rows), skipping the header
- Extract data from each row: note, description, classification, tag, image path, and additional info
- Create a JSON object with the extracted data
- read the image, get the metadata out of the images, date time taken, camera used, fstop used, lens used, focal length used, location, copyright info and merge with the json, extrapolate all metadata to cover all images


## Display rules

for each row in the json count the images, this is called an image set

display each row as a an image set with the metadata to the right, have left right markers and keystrokes to advance to next previous image set

if there are two images, place a sliding cursor that shows image1 on left image two on right, the image with most pixels displayed should be used in the metadata

if there are three images place two sliding cursors showing image 1 on the left, 2 in the middle and three on the right, the image with the most pixels displayed should be used in the metadata 


## CSS (dam.css)

Create a `dam.css` file with the following styles:
- Add responsive styles for different screen sizes
- Use CSS variables for theming and consistency

## Additional Requirements

- Ensure the JavaScript code follows the Airbnb style guide
- Use `async/await` for any asynchronous operations
- Include error handling for potential issues (e.g., missing image elements)
- Add comments to explain complex logic or important steps
- Optimize for performance and accessibility

Remember to create README.md and EXAMPLE.md files for the block, following the structure guidelines provided earlier.

## README.md Structure

The README.md should include:
1. Component name as the main heading
2. Brief description of the component's purpose
3. Usage section explaining how to use the component
4. Authoring section describing content creation in Google Docs or Microsoft Word
5. Styling section mentioning CSS classes or variables for customization
6. Behavior section explaining the JSON output generation
7. Accessibility section highlighting relevant features

## EXAMPLE.md Structure

The EXAMPLE.md should include:
1. Block name as the main heading
2. A sample table demonstrating how to structure the input in Google Docs or Microsoft Word
3. Use realistic examples with varied content to showcase the block's capabilities

Ensure all files (dam.js, dam.css, README.md, and EXAMPLE.md) are created and placed in the `/blocks/u3a/` directory.