export default async function decorate(block) {
  const images = [...block.querySelectorAll('a')].map((a) => a.href);
  const container = document.createElement('div');
  container.className = 'slider-container';

  const imageElements = images.map((src) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.style.objectFit = 'cover';
    img.style.width = '100%';
    img.style.height = '400px';
    return img;
  });

  // Randomize image order
  for (let i = imageElements.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [imageElements[i], imageElements[j]] = [imageElements[j], imageElements[i]];
  }

  imageElements.forEach((img) => container.appendChild(img));

  const indicators = document.createElement('div');
  indicators.className = 'slider-indicators';
  imageElements.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'slider-indicator';
    dot.setAttribute('data-index', index);
    indicators.appendChild(dot);
  });

  block.textContent = '';
  block.appendChild(container);
  block.appendChild(indicators);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    container.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.slider-indicator').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % imageElements.length;
    showImage(currentIndex);
  }

  function startRotation() {
    intervalId = setInterval(nextImage, 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', startRotation);

  showImage(currentIndex);
  startRotation();
}