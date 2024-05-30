// Get the content of the "author" meta tag
const author = document.querySelector('meta[name="author"]').getAttribute('content');

// Create a new <strong> element to hold the author name
const authorElement = document.createElement('strong');
authorElement.textContent = author;

// Find the .bio-wrapper element
const bioWrapper = document.querySelector('.bio-wrapper');

// Insert the author element after the .bio-wrapper element
bioWrapper.insertAdjacentElement('afterend', authorElement);