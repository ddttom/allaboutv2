export default async function decorate(block) {
  const images = [];
  const rows = [...block.children];
  
  // Extract images and remove rows from DOM
  rows.forEach((row) => {
    const img = row.querySelector('img');
    if (img) {
      images.push(img.src);
    }
    row.remove();
  });

  // Shuffle images
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  // Create carousel structure
  const carousel = document.createElement('div');
  carousel.className = 'imagecycle-carousel';
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'imagecycle-image-container';
  
  const indicators = document.createElement('div');
  indicators.className = 'imagecycle-indicators';

  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Carousel image ${index + 1}`;
    img.style.display = index === 0 ? 'block' : 'none';
    imageContainer.appendChild(img);

    const indicator = document.createElement('span');
    indicator.className = index === 0 ? 'active' : '';
    indicators.appendChild(indicator);
  });

  carousel.appendChild(imageContainer);
  carousel.appendChild(indicators);
  block.appendChild(carousel);

  let currentIndex = 0;
  let intervalId;

  function rotateImage(direction = 1) {
    imageContainer.children[currentIndex].style.display = 'none';
    indicators.children[currentIndex].className = '';
    
    currentIndex = (currentIndex + direction + images.length) % images.length;
    
    imageContainer.children[currentIndex].style.display = 'block';
    indicators.children[currentIndex].className = 'active';
  }

  function startRotation() {
    intervalId = setInterval(() => rotateImage(), 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  carousel.addEventListener('mouseenter', stopRotation);
  carousel.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopRotation();
      rotateImage(-1);
    } else if (e.key === 'ArrowRight') {
      stopRotation();
      rotateImage(1);
    }
  });

  startRotation();
}