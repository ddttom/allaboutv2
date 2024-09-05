export default async function decorate(block) {
  const cube = document.createElement('div');
  cube.className = 'cube';

  const rows = [...block.children];
  if (rows.length !== 6) {
    // eslint-disable-next-line no-console
    console.error('Block6 requires exactly 6 rows for each face of the cube');
    return;
  }

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

  rows.forEach((row, index) => {
    const [imageCell, linkCell] = row.children;
    const face = document.createElement('div');
    face.className = `face ${faces[index]}`;

    const link = document.createElement('a');
    link.href = linkCell.textContent.trim();

    const img = document.createElement('img');
    img.src = imageCell.textContent.trim();
    img.alt = `Face ${index + 1}`;

    link.appendChild(img);
    face.appendChild(link);
    cube.appendChild(face);
  });

  block.textContent = '';
  block.appendChild(cube);

  let isDragging = false;
  let previousX = 0;
  let previousY = 0;
  let rotateX = 0;
  let rotateY = 0;

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

  document.addEventListener('mousemove', handleMouseMove);

  cube.addEventListener('dblclick', (e) => {
    const link = e.target.closest('a');
    if (link) {
      window.location.href = link.href;
    }
  });
}