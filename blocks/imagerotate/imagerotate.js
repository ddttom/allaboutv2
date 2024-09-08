export default async function decorate(block) {
  const images = [];
  const rows = [...block.children];
  rows.shift(); // Remove the first row (table name)

  // Extract image URLs from the rows
  rows.forEach((row) => {
    const img = row.querySelector('img');
    if (img) {
      images.push(img.src);
    }
  });

  // Create image rotation container
  const container = document.createElement('div');
  container.className = 'imagerotate-container';
  block.textContent = '';
  block.appendChild(container);

  // Create image element
  const imgElement = document.createElement('img');
  imgElement.className = 'imagerotate-image';
  container.appendChild(imgElement);

  // Create placement indicators
  const indicatorContainer = document.createElement('div');
  indicatorContainer.className = 'imagerotate-indicators';
  container.appendChild(indicatorContainer);

  images.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.className = 'imagerotate-indicator';
    indicatorContainer.appendChild(indicator);
  });

  let currentIndex = 0;
  let intervalId = null;

  function updateImage() {
    imgElement.src = images[currentIndex];
    imgElement.style.opacity = '0';
    setTimeout(() => {
      imgElement.style.opacity = '1';
    }, 50);
    updateIndicators();
  }

  function updateIndicators() {
    const indicators = indicatorContainer.querySelectorAll('.imagerotate-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }

  function rotateImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
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

  function handleKeyNavigation(e) {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
      stopRotation();
      startRotation();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
      stopRotation();
      startRotation();
    }
  }

  // Initialize the first image
  updateImage();

  // Start rotation
  startRotation();

  // Event listeners
  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });
  document.addEventListener('keydown', handleKeyNavigation);

  // Cleanup function
  return () => {
    stopRotation();
    document.removeEventListener('keydown', handleKeyNavigation);
  };
}