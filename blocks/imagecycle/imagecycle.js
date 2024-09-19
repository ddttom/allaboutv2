export default async function decorate(block) {
  const images = [...block.querySelectorAll('img, a')].map((el) => {
    if (el.tagName === 'A') {
      const img = el.querySelector('img');
      return img ? { src: img.src, link: el.href } : null;
    }
    return { src: el.src };
  }).filter(Boolean);

  if (images.length === 0) return;

  const container = document.createElement('div');
  container.className = 'imagecycle-container';
  
  const imageElement = document.createElement('img');
  imageElement.className = 'imagecycle-image';
  imageElement.alt = 'Cycling image';
  container.appendChild(imageElement);

  const indicators = document.createElement('div');
  indicators.className = 'imagecycle-indicators';
  images.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'imagecycle-indicator';
    dot.setAttribute('data-index', index);
    indicators.appendChild(dot);
  });
  container.appendChild(indicators);

  block.textContent = '';
  block.appendChild(container);

  let currentIndex = Math.floor(Math.random() * images.length);
  let intervalId;

  const showImage = (index) => {
    imageElement.src = images[index].src;
    imageElement.style.cursor = images[index].link ? 'pointer' : 'default';
    indicators.querySelectorAll('.imagecycle-indicator').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };

  const nextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  };

  const startRotation = () => {
    clearInterval(intervalId);
    intervalId = setInterval(nextImage, 5000);
  };

  const stopRotation = () => {
    clearInterval(intervalId);
  };

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    nextImage();
    startRotation();
  });

  imageElement.addEventListener('click', () => {
    const link = images[currentIndex].link;
    if (link) window.location.href = link;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  showImage(currentIndex);
  startRotation();
}