export default async function decorate(block) {
  const images = [];
  const rows = [...block.children];
  
  // Extract images from the table
  rows.forEach((row, index) => {
    if (index === 0) return; // Skip the header row
    const img = row.querySelector('img');
    if (img) {
      images.push(img.src);
    }
  });

  // Remove original content
  block.textContent = '';

  // Shuffle images
  const shuffledImages = images.sort(() => Math.random() - 0.5);

  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'imagecycle-container';
  block.appendChild(imageContainer);

  // Create indicator container
  const indicatorContainer = document.createElement('div');
  indicatorContainer.className = 'imagecycle-indicators';
  block.appendChild(indicatorContainer);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    imageContainer.innerHTML = `<img src="${shuffledImages[index]}" alt="Carousel image ${index + 1}">`;
    updateIndicators();
  }

  function updateIndicators() {
    indicatorContainer.innerHTML = shuffledImages.map((_, index) => 
      `<span class="indicator${index === currentIndex ? ' active' : ''}"></span>`
    ).join('');
  }

  function rotateImage() {
    currentIndex = (currentIndex + 1) % shuffledImages.length;
    showImage(currentIndex);
  }

  function startRotation() {
    clearInterval(intervalId);
    intervalId = setInterval(rotateImage, 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  // Event listeners
  imageContainer.addEventListener('mouseenter', stopRotation);
  imageContainer.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + shuffledImages.length) % shuffledImages.length;
      showImage(currentIndex);
      stopRotation();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % shuffledImages.length;
      showImage(currentIndex);
      stopRotation();
    }
  });

  // Initial setup
  showImage(currentIndex);
  startRotation();
}