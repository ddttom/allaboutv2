export default async function decorate(block) {
    
  const cube = document.createElement('div');
  cube.className = 'cube6';

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const rows = [...block.children];

  faces.forEach((face, index) => {
    const faceElement = document.createElement('div');
    faceElement.className = `cube6-face cube6-face-${face}`;

    const img = rows[index].querySelector('img');
    const link = rows[index].querySelector('a');

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
  let previousMousePosition = { x: 0, y: 0 };
  let rotationX = 0;
  let rotationY = 0;

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y,
    };

    rotationY += deltaMove.x * 0.5;
    rotationX -= deltaMove.y * 0.5;

    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    previousMousePosition = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  cube.addEventListener('mouseenter', () => {
    isDragging = true;
    cube.style.cursor = 'grab';
  });

  cube.addEventListener('mouseleave', () => {
    isDragging = false;
    cube.style.cursor = 'default';
  });

  cube.addEventListener('mousemove', handleMouseMove);

  cube.addEventListener('dblclick', (e) => {
    const face = e.target.closest('.cube6-face');
    if (face) {
      const href = face.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    }
  });

  // Prevent default drag behavior on images
  cube.querySelectorAll('img').forEach((img) => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });
}