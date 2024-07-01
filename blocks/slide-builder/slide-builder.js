export default async function decorate(block) {
    const container = document.querySelector('.slide-builder');

    async function fetchSlides() {
        try {
            const response = await fetch('/slides/query-index.json');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    const slides = await fetchSlides();

    if (slides.length > 0) {
        slides.forEach((slideData) => {
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
    } else {
        console.error('No slides found or error fetching slide data.');
    }
}
