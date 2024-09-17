export default async function decorate(block) {
  const images = [];
  let currentIndex = 0;
  let intervalId = null;

  // Extract images from the block
  block.querySelectorAll('img, a').forEach((element) => {
    if (element.tagName === 'IMG') {
      images.push(element.src);
    } else if (element.tagName === 'A') {
      const img = element.querySelector('img');
      if (img) images.push(img.src);
    }
  });

  // Clear the block content
  block.innerHTML = '';

  // Create container for images
  const imageContainer = document.createElement('div');
  imageContainer.className = 'imagecycle-container';
  block.appendChild(imageContainer);

  // Create image element
  const imgElement = document.createElement('img');
  imgElement.className = 'imagecycle-image';
  imageContainer.appendChild(imgElement);

  // Create left arrow
  const leftArrow = document.createElement('button');
  leftArrow.className = 'imagecycle-arrow imagecycle-arrow-left';
  leftArrow.innerHTML = '&#10094;';
  leftArrow.setAttribute('aria-label', 'Previous image');
  imageContainer.appendChild(leftArrow);

  // Create right arrow
  const rightArrow = document.createElement('button');
  rightArrow.className = 'imagecycle-arrow imagecycle-arrow-right';
  rightArrow.innerHTML = '&#10095;';
  rightArrow.setAttribute('aria-label', 'Next image');
  imageContainer.appendChild(rightArrow);

  // Create indicators
  const indicatorContainer = document.createElement('div');
  indicatorContainer.className = 'imagecycle-indicators';
  block.appendChild(indicatorContainer);

  images.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.className = 'imagecycle-indicator';
    indicator.addEventListener('click', () => showImage(index));
    indicatorContainer.appendChild(indicator);
  });

  function showImage(index) {
    imgElement.src = images[index];
    currentIndex = index;
    updateIndicators();
  }

  function updateIndicators() {
    indicatorContainer.querySelectorAll('.imagecycle-indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }

  function rotateImage(direction = 1) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    showImage(currentIndex);
  }

  function startRotation() {
    if (!intervalId) {
      intervalId = setInterval(() => rotateImage(1), 5000);
    }
  }

  function stopRotation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Randomize initial image
  currentIndex = Math.floor(Math.random() * images.length);
  showImage(currentIndex);

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'imagecycle-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close image cycle');
  imageContainer.appendChild(closeButton);

  function hideImageCycle() {
    block.style.display = 'none';
    stopRotation();
  }

  // Event listeners
  imageContainer.addEventListener('mouseenter', stopRotation);
  imageContainer.addEventListener('mouseleave', () => {
    rotateImage(1);
    startRotation();
  });

  leftArrow.addEventListener('click', () => {
    rotateImage(-1);
    stopRotation();
  });

  rightArrow.addEventListener('click', () => {
    rotateImage(1);
    stopRotation();
  });

  closeButton.addEventListener('click', hideImageCycle);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      rotateImage(-1);
      stopRotation();
    } else if (e.key === 'ArrowRight') {
      rotateImage(1);
      stopRotation();
    }
  });

  // Start rotation
  startRotation();
}