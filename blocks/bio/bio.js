// Get the content of the "author" meta tag
const author = document.querySelector('meta[name="author"]').getAttribute('content');

// Create a new <strong> element to hold the author name
const authorElement = document.createElement('strong');
authorElement.textContent = author;

// Find the <picture> element within the .bio-wrapper .bio.block
const pictureElement = document.querySelector('.bio-wrapper .bio.block picture');

// Insert the author element after the <picture> element
pictureElement.insertAdjacentElement('afterend', authorElement);