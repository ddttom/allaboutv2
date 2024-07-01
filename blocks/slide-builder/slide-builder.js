export default async function decorate(block) {
    const supportsWebP = window.createImageBitmap && window.createImageBitmap.toString().includes('native code');
  
    async function fetchSlides() {
      const response = await fetch("/slides/query-index.json");
      const json = await response.json();
      return json.data;
    }
  
    async function fetchSupportingText(path) {
        // Check viewport width before proceeding
        if (window.innerWidth < 800) {
          return null; 
        }
      
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
      
  
    function setSlideBackground(slideItem, imageUrl) {
      const finalImageUrl = supportsWebP 
        ? `${imageUrl}?width=2000&format=webply&optimize=medium`
        : imageUrl;
  
      const img = new Image();
      img.src = finalImageUrl;
  
      img.onload = () => {
        slideItem.style.backgroundImage = `url(${finalImageUrl})`;
        slideItem.classList.add('loaded');
      };
  
      img.onerror = () => {
        console.error(`Failed to load image: ${finalImageUrl}`);
        // Optionally, set a default background image or display an error message
      };
    }
  
    const container = document.querySelector(".slide-builder");
    const slides = await fetchSlides();
  
    // --- Lazy Loading Logic ---
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const slideItem = entry.target;
          const imageUrl = slideItem.dataset.bg; 
          setSlideBackground(slideItem, imageUrl);
          observer.unobserve(slideItem); 
        }
      });
    }, {
      rootMargin: '100px' 
    });
  
    for (const slideData of slides) {
      const imageUrl = slideData.image.split("?")[0];
      const title = slideData.title;
      const description = slideData.description;
      const relativePath = slideData.path;
  
      const slideItem = document.createElement("div");
      slideItem.classList.add("slide-builder-item");
      slideItem.setAttribute("data-bg", imageUrl);
  
      // --- Click Event Listener ---
      slideItem.addEventListener("click", () => {
        if (relativePath) {
          window.location.href = relativePath;
        }
      });
  
      // --- Text Container Creation ---
      const textContainer = document.createElement("div");
      textContainer.classList.add("text-container");
  
      const slideTitle = document.createElement("h2");
      slideTitle.innerText = title;
  
      const slideDescription = document.createElement("p");
      const strongTag = document.createElement("strong");
      strongTag.innerText = description;
      slideDescription.appendChild(strongTag);
  
      textContainer.appendChild(slideTitle);
      textContainer.appendChild(slideDescription);
  
      // Fetch and append supporting text (if available)
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
  
      slideItem.appendChild(textContainer); // Append the text container
      slideItem.setAttribute("data-slidenum", slides.indexOf(slideData) + 1);
      
      observer.observe(slideItem); // Start observing the slide item
      container.appendChild(slideItem);
    }
  }
  