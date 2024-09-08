export default async function decorate(block) {
  const container = document.createElement('div');
  container.className = 'imagerotate-container';
  const images = [];
  const indicators = document.createElement('div');
  indicators.className = 'imagerotate-indicators';
  let currentIndex = 0;
  let intervalId;

  // Extract images from the block
  block.querySelectorAll(':scope > div').forEach((row, index) => {
    if (index === 0) return; // Skip the first row (table name)
    const img = row.querySelector('img, a');
    if (img) {
      const imgSrc = img.tagName === 'A' ? img.href : img.src;
      images.push(imgSrc);
      const indicator = document.createElement('span');
      indicator.className = 'imagerotate-indicator';
      indicators.appendChild(indicator);
    }
  });

  // Create image element
  const imgElement = document.createElement('img');
  imgElement.className = 'imagerotate-image';
  container.appendChild(imgElement);
  container.appendChild(indicators);

  // Function to update the displayed image
  const updateImage = (index) => {
    imgElement.src = images[index];
    indicators.querySelectorAll('.imagerotate-indicator').forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
  };

  // Function to rotate to the next image
  const rotateImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage(currentIndex);
  };

  // Function to start rotation
  const startRotation = () => {
    clearInterval(intervalId);
    intervalId = setInterval(rotateImage, 5000);
  };

  // Function to stop rotation
  const stopRotation = () => {
    clearInterval(intervalId);
  };

  // Event listeners
  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage(currentIndex);
      stopRotation();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage(currentIndex);
      stopRotation();
    }
  });

  // Initialize
  updateImage(currentIndex);
  startRotation();

  // Randomize initial image
  currentIndex = Math.floor(Math.random() * images.length);
  updateImage(currentIndex);

  block.textContent = '';
  block.appendChild(container);
}