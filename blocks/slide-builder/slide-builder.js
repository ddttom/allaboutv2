export default async function decorate(block) {
    const container = document.querySelector('.slide-builder');

    async function fetchSlides() {
        try {
            const response = await fetch('/slides/query-index.json');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const slides = await fetchSlides();

    if (slides) {
        slides.forEach((slideData, index) => {
            const imageUrl = slideData.image.split('?')[0]; // Remove querystring
            const title = slideData.title;
            const description = slideData.description;

            const slideItem = document.createElement('div');
            slideItem.classList.add('slide-builder-item');
            slideItem.style.backgroundImage = `url(${imageUrl})`;

            if (index === 0) {
                slideItem.classList.add('slide-down'); // Initial slide should be visible
            } else {
                slideItem.classList.add('slide-up'); // Other slides should be hidden initially
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

        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const slideItems = document.querySelectorAll('.slide-builder-item');

            slideItems.forEach((slide, index) => {
                const slideHeight = slide.offsetHeight;
                const slideOffsetTop = index * slideHeight;

                if (scrollTop < lastScrollTop) {
                    // Scroll down (reverse)
                    if (scrollTop >= slideOffsetTop - slideHeight / 2 && scrollTop < slideOffsetTop + slideHeight / 2) {
                        slide.classList.remove('slide-up');
                        slide.classList.add('slide-down');
                    }
                } else {
                    // Scroll up (reverse)
                    if (scrollTop < slideOffsetTop + slideHeight / 2 && scrollTop >= slideOffsetTop - slideHeight / 2) {
                        slide.classList.remove('slide-down');
                        slide.classList.add('slide-up');
                    }
                }
            });

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });
    }    
}
