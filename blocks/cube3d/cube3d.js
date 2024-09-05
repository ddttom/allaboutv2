export default async function decorate(block) {
  const cube = document.createElement('div');
  cube.className = 'cube';

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const rows = [...block.children];

  faces.forEach((face, index) => {
    if (rows[index]) {
      const img = rows[index].querySelector('img');
      const link = rows[index].querySelector('a');
      
      if (img && link) {
        const faceSide = document.createElement('div');
        faceSide.className = `cube__face cube__face--${face}`;
        
        const linkElement = document.createElement('a');
        linkElement.href = link.href;
        linkElement.appendChild(img.cloneNode(true));
        
        faceSide.appendChild(linkElement);
        cube.appendChild(faceSide);
      }
    }
  });

  const scene = document.createElement('div');
  scene.className = 'scene';
  scene.appendChild(cube);

  block.textContent = '';
  block.appendChild(scene);

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotationX = 0;
  let rotationY = 0;

  scene.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y,
    };

    rotationY += deltaMove.x * 0.5;
    rotationX -= deltaMove.y * 0.5;

    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // eslint-disable-next-line no-console
  console.log('3D Cube block initialized');
}