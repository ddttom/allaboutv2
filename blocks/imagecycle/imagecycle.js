export default async function decorate(block) {
  const images = [];
  block.querySelectorAll('tr').forEach((row, index) => {
    if (index > 0) {
      const imgSrc = row.querySelector('td').textContent.trim();
      images.push(imgSrc);
    }
  });

  let currentIndex = 0;
  const container = document.createElement('div');
  container.classList.add('imagecycle-container');
  block.appendChild(container);

  const imgElement = document.createElement('img');
  imgElement.src = images[currentIndex];
  imgElement.style.width = '400px';
  container.appendChild(imgElement);

  const indicator = document.createElement('div');
  indicator.classList.add('imagecycle-indicator');
  block.appendChild(indicator);

  images.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === currentIndex) dot.classList.add('active');
    indicator.appendChild(dot);
  });

  const updateImage = (index) => {
    imgElement.src = images[index];
    indicator.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };

  const nextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage(currentIndex);
  };

  let interval = setInterval(nextImage, 5000);

  container.addEventListener('mouseover', () => clearInterval(interval));
  container.addEventListener('mouseout', () => {
    nextImage();
    interval = setInterval(nextImage, 5000);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage(currentIndex);
    } else if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage(currentIndex);
    }
  });

  block.classList.add('imagecycle--initialized');
}