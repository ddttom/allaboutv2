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

            // Set the initial slide to be visible
            if (index === 0) {
                slideItem.classList.add('slide-down');
            } else {
                slideItem.classList.add('slide-up');
            }

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
        const slideHeight = window.innerHeight; // Get viewport height once

        function updateSlideClasses() {
            const slideItems = document.querySelectorAll('.slide-builder-item');

            slideItems.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.classList.remove('slide-up');
                    slide.classList.add('slide-down');
                } else {
                    slide.classList.remove('slide-down');
                    slide.classList.add('slide-up');
                }
            });
        }

        updateSlideClasses(); // Initial call to set up the first slide as visible

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Use Math.round to round the value to the nearest integer.
            const newCurrentSlide = Math.round(scrollTop / slideHeight);

            // Check if currentSlide has changed
            if (newCurrentSlide !== currentSlide) {
                currentSlide = newCurrentSlide;

                // Update slide classes only if the current slide has changed
                updateSlideClasses();
            }

            // Update lastScrollTop after each scroll to keep track
            lastScrollTop = scrollTop; 
        });
    } else {
        console.error('No slides found or error fetching slide data.');
    }
}
