export default async function decorate(block) {
  const container = document.createElement('div');
  container.className = 'block9-container';
  
  const cube = document.createElement('div');
  cube.className = 'block9-cube';

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom', 'front-top', 'back-top', 'right-top'];
  
  faces.forEach((face, index) => {
    const faceElement = document.createElement('div');
    faceElement.className = `block9-face block9-${face}`;
    
    const link = document.createElement('a');
    const img = document.createElement('img');
    
    // Get the image source and href from the table
    const row = block.children[index];
    if (row) {
      const [imgCell, hrefCell] = row.children;
      img.src = imgCell.textContent.trim();
      link.href = hrefCell.textContent.trim();
    }
    
    img.alt = `Face ${index + 1}`;
    link.appendChild(img);
    faceElement.appendChild(link);
    cube.appendChild(faceElement);
  });

  container.appendChild(cube);
  block.textContent = '';
  block.appendChild(container);

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

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  container.addEventListener('mousemove', handleMouseMove);

  container.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  container.addEventListener('dblclick', (e) => {
    const link = e.target.closest('a');
    if (link) {
      window.location.href = link.href;
    }
  });
}