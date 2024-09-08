export default async function decorate(block) {
  // eslint-disable-next-line no-console
  console.log('Initializing imageslider');

  const links = block.querySelectorAll('a');
  // eslint-disable-next-line no-console
  console.log('Links found:', links.length);

  // Log the HTML content of the block for debugging
  // eslint-disable-next-line no-console
  console.log('Block HTML:', block.innerHTML);

  const images = [...links].map((a) => {
    // eslint-disable-next-line no-console
    console.log('Link href:', a.href);
    return a.href;
  });
  // eslint-disable-next-line no-console
  console.log('Images found:', images);

  if (images.length === 0) {
    // eslint-disable-next-line no-console
    console.error('No images found in the imageslider block');
    return; // Exit the function if no images are found
  }

  const container = document.createElement('div');
  container.className = 'imageslider-container';

  const imageElement = document.createElement('img');
  imageElement.className = 'imageslider-image';
  container.appendChild(imageElement);

  const indicators = document.createElement('div');
  indicators.className = 'imageslider-indicators';
  container.appendChild(indicators);

  block.textContent = '';
  block.appendChild(container);

  let currentIndex = 0;
  let intervalId;
  let isHovering = false;

  function showImage(index) {
    imageElement.src = images[index];
    // eslint-disable-next-line no-console
    console.log('Showing image:', index, images[index]);
    updateIndicators();
  }

  function updateIndicators() {
    indicators.innerHTML = images.map((_, i) => 
      `<span class="indicator ${i === currentIndex ? 'active' : ''}"></span>`
    ).join('');
    // eslint-disable-next-line no-console
    console.log('Indicators updated');
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
    // eslint-disable-next-line no-console
    console.log('Next image shown');
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
    // eslint-disable-next-line no-console
    console.log('Previous image shown');
  }

  function startRotation() {
    if (!isHovering) {
      intervalId = setInterval(nextImage, 5000);
      // eslint-disable-next-line no-console
      console.log('Rotation started');
    }
  }

  function stopRotation() {
    clearInterval(intervalId);
    // eslint-disable-next-line no-console
    console.log('Rotation stopped');
  }

  // Shuffle images
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  // eslint-disable-next-line no-console
  console.log('Images shuffled:', images);

  showImage(currentIndex);
  startRotation();

  container.addEventListener('mouseenter', () => {
    isHovering = true;
    stopRotation();
    // eslint-disable-next-line no-console
    console.log('Mouse entered, rotation paused');
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;
    nextImage();
    startRotation();
    // eslint-disable-next-line no-console
    console.log('Mouse left, rotation resumed');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevImage();
      // eslint-disable-next-line no-console
      console.log('Left arrow pressed');
    } else if (e.key === 'ArrowRight') {
      nextImage();
      // eslint-disable-next-line no-console
      console.log('Right arrow pressed');
    }
  });

  // eslint-disable-next-line no-console
  console.log('Imageslider initialization complete');
}