// Get the content of the "author" meta tag
const author = document.querySelector('meta[name="author"]').getAttribute('content');

// Create a new <strong> element to hold the author name
const authorElement = document.createElement('strong');
authorElement.textContent = author;

// Find the .bio.block element
const bioBlock = document.querySelector('.bio.block');

// Insert the author element as the last child of the .bio.block element
bioBlock.appendChild(authorElement);