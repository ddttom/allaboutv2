import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const images = [...block.querySelectorAll('a')].map((a) => a.href);
  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'slider-container';
  const imageContainer = document.createElement('div');
  imageContainer.className = 'slider-image-container';
  const indicators = document.createElement('div');
  indicators.className = 'slider-indicators';

  // Shuffle images
  const shuffledImages = images.sort(() => Math.random() - 0.5);

  shuffledImages.forEach((src, index) => {
    const img = createOptimizedPicture(src, '', false, [{ width: '750' }]);
    img.className = index === 0 ? 'active' : '';
    imageContainer.appendChild(img);

    const indicator = document.createElement('span');
    indicator.className = index === 0 ? 'active' : '';
    indicators.appendChild(indicator);
  });

  container.appendChild(imageContainer);
  container.appendChild(indicators);
  block.appendChild(container);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    imageContainer.querySelectorAll('picture').forEach((pic, i) => {
      pic.className = i === index ? 'active' : '';
    });
    indicators.querySelectorAll('span').forEach((span, i) => {
      span.className = i === index ? 'active' : '';
    });
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % shuffledImages.length;
    showImage(currentIndex);
  }

  function startRotation() {
    intervalId = setInterval(nextImage, 15000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', startRotation);

  startRotation();
}