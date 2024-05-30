export default function decorate(block) {
  // Get the content of the "author" meta tag
  const author = document
    .querySelector('meta[name="author"]')
    .getAttribute("content");
  // Create a new <strong> element to hold the author name
  const authorElement = document.createElement("strong");
  authorElement.textContent = author;
  // Find the image element within the .bio-wrapper .bio.block
  const bioImage = document.querySelector(".bio-wrapper .bio.block img");
  // Insert the author element after the image
  bioImage.insertAdjacentElement("afterend", authorElement);
}
