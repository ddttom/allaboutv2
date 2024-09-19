# imagerotate

## Tom Cranstoun, 12 Sep v1.00

Create a franklin block with images, named imagecycle

the first cell in the table is the table name, subsequent rows contain a picture element or an href element , only one image per cell, extract the path to the image and use it as an image.  
The images are fully qualified urls, do not use  createOptimizedPicture(). use as is.
ensure that the image fit 400 px wide, on loading the images randomize them, make the background light blue in color.
read all of the rows when creating the block
only display one image at a time
it should rotate through each image every 5 seconds. provide a placement indicator. if the user hovers over the image stop rotating.
when the user moves off the image start rotating again, immediately move to next image
Add keyboard navigation (left/right arrow keys) for manual image rotation




**Demo Page**
    * Create a demo page in Franklin format, in the demos folder that showcases the imported design. Add text describing the Demo
    * Generate appropriate metadata for the recreated design, including title, description, and other relevant fields.