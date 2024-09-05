export default async function decorate(block) {
  const cube = document.createElement('div');
  cube.className = 'cube';

  const sides = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const rows = [...block.querySelectorAll('tr')];

  sides.forEach((side, index) => {
    const face = document.createElement('div');
    face.className = `face ${side}`;

    const imgCell = rows[index].querySelector('td:first-child');
    const linkCell = rows[index].querySelector('td:last-child');

    if (imgCell && linkCell) {
      const img = document.createElement('img');
      img.src = imgCell.textContent.trim();
      img.alt = `Cube face ${side}`;

      const link = document.createElement('a');
      link.href = linkCell.textContent.trim();
      link.appendChild(img);

      face.appendChild(link);
    }

    cube.appendChild(face);
  });

  block.textContent = '';
  block.appendChild(cube);

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotationX = 0;
  let rotationY = 0;

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    rotationY += deltaX * 0.5;
    rotationX -= deltaY * 0.5;

    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  cube.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  cube.addEventListener('mouseup', () => {
    isDragging = false;
  });

  cube.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  cube.addEventListener('mousemove', handleMouseMove);

  cube.addEventListener('dblclick', (e) => {
    const link = e.target.closest('a');
    if (link) {
      window.location.href = link.href;
    }
  });

  // Add initialized class for potential styling or JS hooks
  block.classList.add('cube6--initialized');
}