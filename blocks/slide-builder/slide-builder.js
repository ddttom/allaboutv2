export default async function decorate(block) {
    async function fetchSlides() {
      const response = await fetch("/slides/query-index.json");
      const json = await response.json();
      return json.data;
    }
  
    async function fetchSupportingText(path) {
      const response = await fetch(`${path}.plain.html`);
      if (!response.ok) {
        throw new Error(`Failed to fetch HTML for slide: ${path}`);
      }
  
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
  
      const h2 = doc.querySelector('h2');
      let firstParagraph = h2 ? h2.nextElementSibling : doc.querySelector('p');
  
      while (firstParagraph && firstParagraph.tagName.toLowerCase() !== 'p') {
        firstParagraph = firstParagraph.nextElementSibling;
      }
      return (firstParagraph ? firstParagraph.textContent : null).trim();
    }
  
    const container = document.querySelector(".slide-builder");
    const slides = await fetchSlides();
  
    for (const slideData of slides) {
      const imageUrl = slideData.image.split("?")[0];
      const title = slideData.title;
      const description = slideData.description;
      const relativePath = slideData.path;
  
      const slideItem = document.createElement("div");
      slideItem.classList.add("slide-builder-item");
      slideItem.style.backgroundImage = `url(${imageUrl})`;
  
      slideItem.addEventListener("click", () => {
        if (relativePath) {
          window.location.href = relativePath;
        }
      });
  
      const textContainer = document.createElement("div");
      const slideTitle = document.createElement("h2");
      slideTitle.innerText = title;
      
      // Create the description with <strong> tag
      const slideDescription = document.createElement("p");
      const strongTag = document.createElement("strong");
      strongTag.innerText = description;
      slideDescription.appendChild(strongTag); 
  
      textContainer.appendChild(slideTitle);
      textContainer.appendChild(slideDescription);
  
      try {
        const supportingText = await fetchSupportingText(slideData.path);
        if (supportingText.trim) {
          const slideSupportingText = document.createElement("p");
          slideSupportingText.classList.add("supporting-text");
          slideSupportingText.textContent = supportingText;
          textContainer.appendChild(slideSupportingText);
        }
      } catch (error) {
        console.error(error.message);
      }
  
      slideItem.appendChild(textContainer);
      slideItem.setAttribute("data-slidenum", slides.indexOf(slideData) + 1);
  
      container.appendChild(slideItem);
    }
  }
  