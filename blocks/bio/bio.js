export default async function decorate(block) {
  // Find the <img> element within the .bio.block
  const imgElement = document.querySelector(".bio.block img");

  let author = "";

  // Check if the <img> element has a non-empty alt attribute
  if (imgElement && imgElement.getAttribute("alt")) {
    author = imgElement.getAttribute("alt");
  }

  // If the alt attribute is empty or not present, fall back to the <meta> tag's author content
  if (!author) {
    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) {
      author = metaAuthor.getAttribute("content");
    }
  }

  let bioConfig = author;
  if (author.includes(":")) {
    bioConfig = author.split(":")[1].trim();
  }
  bioConfig = bioConfig.replaceAll(" ", "-").toLowerCase();

  // Create a new <a> element to hold the author name
  const authorElement = document.createElement("a");
  authorElement.textContent = author;
  authorElement.href = "#"; // Set the href attribute to '#' to make it a valid hyperlink

  // Add a click event listener to the author element
  authorElement.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent the default behavior of the hyperlink

    try {
      // Fetch the JSON data from the specified URL
      const response = await fetch(`/bio/${bioConfig}.json`);
      const data = await response.json();

      // Create a popup window with the JSON content
      const popup = window.open("", "Popup", "width=400,height=300");
      popup.document.write(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
    } catch (error) {
      console.error("Error fetching JSON data:", error);
    }
  });

  // Find the .bio.block element
  const bioBlock = document.querySelector(".bio.block");

  // Insert the author element as the last child of the .bio.block element
  bioBlock.appendChild(authorElement);
}
