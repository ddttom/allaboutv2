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
  
        // No initial classes needed here
      });
  
      let currentSlide = 0;
      const slideHeight = window.innerHeight; // Get viewport height
  
      function updateSlideClasses() {
        const slideItems = document.querySelectorAll('.slide-builder-item');
  
        // Iterate through all slide items and update classes based on currentSlide
        slideItems.forEach((slide, index) => {
          if (index < currentSlide) { // Show only slides BEFORE the current one
            slide.classList.remove('slide-up', 'slide-down'); // Remove both classes first
            slide.classList.add('slide-down'); 
          } else if (index === currentSlide) { // Show the current slide
            slide.classList.remove('slide-up', 'slide-down'); // Remove both classes first
            slide.classList.add('slide-down'); 
          } else { // Hide slides AFTER the current one
            slide.classList.remove('slide-up', 'slide-down'); // Remove both classes first
            slide.classList.add('slide-up'); 
          }
        });
      }
  
      updateSlideClasses(); // Initial call to set up the first slide as visible
  
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
        // More accurate current slide calculation
        let newCurrentSlide = Math.floor(scrollTop / slideHeight);
  
        // Correct the newCurrentSlide if it exceeds the number of slides
        if (newCurrentSlide >= slides.length) {
          newCurrentSlide = slides.length - 1;
        }
  
        if (newCurrentSlide !== currentSlide) {
          currentSlide = newCurrentSlide;
          updateSlideClasses();
        }
      });
    } else {
      console.error('No slides found or error fetching slide data.');
    }
  }
  