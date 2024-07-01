export default async function decorate(block) {
    const container = document.querySelector('.slide-builder');
  
    async function fetchSlides() {
      // Replace with your actual data fetching logic
      // This is a simple example using local JSON data
      const response = await fetch('/slides/query-index.json'); // Adjust the path if needed
      const data = await response.json();
      return data.data; // Assuming the data is in the 'data' property of the response
    }
  
    const slides = await fetchSlides();
  
    if (slides.length > 0) {
      slides.forEach((slideData, index) => {
        const imageUrl = slideData.image.split('?')[0];
        const title = slideData.title;
        const description = slideData.description;
  
        const slideItem = document.createElement('div');
        slideItem.classList.add('slide-builder-item');
        slideItem.style.backgroundImage = `url(${imageUrl})`;
  
        const textContainer = document.createElement('div');
        const slideTitle = document.createElement('h2');
        slideTitle.innerText = title;
        const slideDescription = document.createElement('p');
        slideDescription.innerText = description;
  
        textContainer.appendChild(slideTitle);
        textContainer.appendChild(slideDescription);
        slideItem.appendChild(textContainer);
        slideItem.setAttribute('data-slidenum', index + 1); // Set roundel numbers
  
        container.appendChild(slideItem);
      });
    } else {
      console.error('No slides found or error fetching slide data.');
    }
  }
  