export default async function decorate(block) {
  async function fetchSlides() {
    const response = await fetch("/slides/query-index.json"); // Adjust the path if needed
    const json = await response.json();
    return json.data;
  }

  const container = document.querySelector(".slide-builder");
  const slides = await fetchSlides();

  if (slides.length > 0) {
    slides.forEach((slideData, index) => {
      const imageUrl = slideData.image.split("?")[0];
      const title = slideData.title;
      const description = slideData.description;

      const relativePath = slideData.path; 

      const slideItem = document.createElement("div");
      slideItem.classList.add("slide-builder-item");
      slideItem.style.backgroundImage = `url(${imageUrl})`;

      // Add event listener to the slide item (the image background)
      slideItem.addEventListener("click", () => {
        if (relativePath) {
          window.location.href = relativePath;
        }
      });

      const textContainer = document.createElement("div");
      const slideTitle = document.createElement("h2");
      slideTitle.innerText = title;
      const slideDescription = document.createElement("p");
      slideDescription.innerText = description;

      textContainer.appendChild(slideTitle);
      textContainer.appendChild(slideDescription);
      slideItem.appendChild(textContainer);
      slideItem.setAttribute("data-slidenum", index + 1); // Set roundel numbers

      container.appendChild(slideItem);
    });
  } else {
    console.error("No slides found or error fetching slide data.");
  }
}
