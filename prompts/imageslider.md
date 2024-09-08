# imageslider

Create a franklin image slider with images, named imageslider. it should behave like a carousel

the first cell in the franklin table is the table name, subsequent rows contain an href to an image, extract the path to the image and use it as an image.  
The images are fully qualified urls, do not use  createOptimizedPicture(). use as is.
ensure that the image fit in 400 pixels tall space by clipping the images, on loading the images randomize them
read all of the rows when creating the slider. when creating the example select images from my list of samples silently
only display one image at a time
it should rotate through each image every 5 seconds. provide a placement indicator. if the user hovers over the image stop rotating.
when the user moves off the image start rotating again, immediately move to next image
Add keyboard navigation (left/right arrow keys) for manual image switching
