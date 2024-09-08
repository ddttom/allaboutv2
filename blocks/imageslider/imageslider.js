export default async function decorate(block) {
  const images = [];
  const rows = [...block.children];
  rows.forEach((row) => {
    const img = row.querySelector('img, a');
    if (img) {
      images.push(img.src || img.href);
    }
  });

  if (images.length === 0) return;

  const container = document.createElement('div');
  container.className = 'imageslider-container';
  
  const imageElement = document.createElement('img');
  imageElement.className = 'imageslider-image';
  container.appendChild(imageElement);

  const indicators = document.createElement('div');
  indicators.className = 'imageslider-indicators';
  container.appendChild(indicators);

  images.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'imageslider-dot';
    dot.addEventListener('click', () => showImage(index));
    indicators.appendChild(dot);
  });

  block.textContent = '';
  block.appendChild(container);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    imageElement.src = images[index];
    currentIndex = index;
    updateIndicators();
  }

  function updateIndicators() {
    [...indicators.children].forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  function startRotation() {
    stopRotation();
    intervalId = setInterval(nextImage, 5000);
  }

  function stopRotation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleArray(images);
  showImage(0);
  startRotation();

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    nextImage();
    startRotation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevImage();
      stopRotation();
    } else if (e.key === 'ArrowRight') {
      nextImage();
      stopRotation();
    }
  });
}