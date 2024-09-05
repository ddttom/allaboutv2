export default async function decorate(block) {
  const cube = document.createElement('div');
  cube.className = 'cube';

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const rows = [...block.children];

  faces.forEach((face, index) => {
    const faceElement = document.createElement('div');
    faceElement.className = `face ${face}`;

    const img = rows[index].children[0].querySelector('img');
    const link = rows[index].children[1].querySelector('a');

    if (img && link) {
      const imgClone = img.cloneNode(true);
      imgClone.setAttribute('draggable', 'false');
      faceElement.appendChild(imgClone);
      faceElement.setAttribute('data-href', link.href);
    }

    cube.appendChild(faceElement);
  });

  block.textContent = '';
  block.appendChild(cube);

  let isDragging = false;
  let previousX, previousY;
  let rotateX = 0, rotateY = 0;

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;

    rotateY += deltaX * 0.5;
    rotateX -= deltaY * 0.5;

    cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    previousX = e.clientX;
    previousY = e.clientY;
  };

  cube.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  cube.addEventListener('mousemove', handleMouseMove);

  cube.addEventListener('dblclick', (e) => {
    const face = e.target.closest('.face');
    if (face) {
      const href = face.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    }
  });

  // Apply grey background to the page
  document.body.style.backgroundColor = '#f0f0f0';
}