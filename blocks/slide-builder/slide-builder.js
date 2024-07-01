export default async function decorate(block) {
    const container = document.querySelector('.slide-builder');
  
    async function fetchSlides() {
      try {
        const response = await fetch('/slides/query-index.json');
        const data = await response.json();
        return data.data; // Ensure the returned data is an array
      } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array in case of an error
      }
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
        container.appendChild(slideItem);
      });
  
      let currentSlide = 0; 
      let lastScrollTop = 0;
  
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const slideHeight = window.innerHeight; // Use viewport height
  
        // Use Math.round to round the value to the nearest integer.
        const newCurrentSlide = Math.round(scrollTop / slideHeight);
  
        // Update slides only if the current slide has changed
        if (newCurrentSlide !== currentSlide) {
          currentSlide = newCurrentSlide;
  
          // Get all slide items
          const slideItems = document.querySelectorAll('.slide-builder-item');
  
          // Loop through each slide item and update classes
          slideItems.forEach((slide, index) => {
            // Check if the current index is equal to the current slide, then add or remove classes accordingly
            if (index === currentSlide) {
              slide.classList.remove('slide-up');
              slide.classList.add('slide-down');
            } else {
              slide.classList.remove('slide-down');
              slide.classList.add('slide-up');
            }
          });
        }
  
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
      });
    } else {
      console.error('No slides found or error fetching slide data.');
    }
  }
  