import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const images = [...block.querySelectorAll('img')];
  const container = document.createElement('div');
  container.className = 'imagecycle-container';
  const indicators = document.createElement('div');
  indicators.className = 'imagecycle-indicators';

  // Randomize image order
  images.sort(() => Math.random() - 0.5);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    images.forEach((img, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'imagecycle-image';
      wrapper.style.display = i === index ? 'block' : 'none';
      wrapper.appendChild(img);
      container.appendChild(wrapper);

      const indicator = document.createElement('span');
      indicator.className = 'imagecycle-indicator';
      indicator.setAttribute('aria-label', `Image ${i + 1}`);
      indicator.addEventListener('click', () => showImage(i));
      indicators.appendChild(indicator);
    });
    updateIndicators();
  }

  function updateIndicators() {
    const indicatorElements = indicators.querySelectorAll('.imagecycle-indicator');
    indicatorElements.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentIndex);
    });
  }

  function rotateImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function startRotation() {
    intervalId = setInterval(rotateImage, 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  showImage(currentIndex);
  startRotation();

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }
  });

  block.textContent = '';
  block.appendChild(container);
  block.appendChild(indicators);
}