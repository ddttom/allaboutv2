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

  function rotateImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function startRotation() {
    if (!intervalId) {
      intervalId = setInterval(rotateImage, 5000);
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

  // Event listeners
  imageContainer.addEventListener('mouseenter', stopRotation);
  imageContainer.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
      stopRotation();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
      stopRotation();
    }
  });

  // Start rotation
  startRotation();
}