export default async function decorate(block) {
  const container = document.createElement('div');
  container.className = 'betty-container';
  const slides = [...block.children];
  
  slides.forEach((slide, index) => {
    slide.className = 'betty-slide';
    slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    container.appendChild(slide);
  });

  const prevButton = document.createElement('button');
  prevButton.className = 'betty-nav betty-prev';
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.innerHTML = '&lt;';

  const nextButton = document.createElement('button');
  nextButton.className = 'betty-nav betty-next';
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.innerHTML = '&gt;';

  container.appendChild(prevButton);
  container.appendChild(nextButton);

  block.appendChild(container);

  let currentSlide = 0;

  const showSlide = (index) => {
    slides[currentSlide].setAttribute('aria-hidden', 'true');
    slides[index].setAttribute('aria-hidden', 'false');
    currentSlide = index;
  };

  const nextSlide = () => {
    showSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);

  // Auto-advance slides every 5 seconds
  setInterval(nextSlide, 5000);

  block.classList.add('betty--initialized');
}