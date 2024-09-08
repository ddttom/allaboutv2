import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const images = [...block.querySelectorAll(':scope > div > div')];
  const container = document.createElement('div');
  container.className = 'slider-container';
  const indicators = document.createElement('div');
  indicators.className = 'slider-indicators';

  // Randomize images
  const shuffledImages = images.sort(() => 0.5 - Math.random());

  shuffledImages.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.className = 'slider-slide';
    const picture = createOptimizedPicture(img.querySelector('img').src, img.querySelector('img').alt, false, [{ width: '750' }]);
    slide.appendChild(picture);
    container.appendChild(slide);

    const indicator = document.createElement('button');
    indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
    indicator.addEventListener('click', () => goToSlide(index));
    indicators.appendChild(indicator);
  });

  block.textContent = '';
  block.appendChild(container);
  block.appendChild(indicators);

  let currentSlide = 0;
  let intervalId;

  function goToSlide(index) {
    container.style.transform = `translateX(-${index * 100}%)`;
    currentSlide = index;
    updateIndicators();
  }

  function updateIndicators() {
    indicators.querySelectorAll('button').forEach((btn, index) => {
      btn.classList.toggle('active', index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % shuffledImages.length;
    goToSlide(currentSlide);
  }

  function startAutoPlay() {
    intervalId = setInterval(nextSlide, 15000);
  }

  function stopAutoPlay() {
    clearInterval(intervalId);
  }

  container.addEventListener('mouseenter', stopAutoPlay);
  container.addEventListener('mouseleave', startAutoPlay);

  goToSlide(0);
  startAutoPlay();
}