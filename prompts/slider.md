# carousel

Create a franklin image slider with images, named slider. it should behave like a carousel

the first cell in the franklin table is the table name, subsequent rows contain an href to an image, extract the path to the image and use it as an image.  The images are fully qualified urls, do not use  createOptimizedPicture(). use as is, ensure that they fit in 400 pixels tall space
on loading the images randomize them
read all of the rows when creating the slider. when creating the example select 6 images at random, the slider should not have a text tile, side by side images only
it should rotate through each image every 5 seconds. provide a placement indicator. if the user hovers over the image stop rotating. when the user moves off the image start rotating again
