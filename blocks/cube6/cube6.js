export default async function decorate(block) {
  const cube = document.createElement('div');
  cube.className = 'cube';

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const rows = [...block.querySelectorAll('tr')];

  faces.forEach((face, index) => {
    const img = rows[index].querySelector('img');
    const link = rows[index].querySelector('a');

    if (img && link) {
      const faceDiv = document.createElement('div');
      faceDiv.className = `face ${face}`;
      
      const imgClone = img.cloneNode(true);
      imgClone.setAttribute('draggable', 'false');
      
      faceDiv.appendChild(imgClone);
      faceDiv.setAttribute('data-href', link.href);
      
      cube.appendChild(faceDiv);
    }
  });

  block.innerHTML = '';
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

  const handleMouseDown = (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  const handleDoubleClick = (e) => {
    const face = e.target.closest('.face');
    if (face) {
      const href = face.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    }
  };

  cube.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  cube.addEventListener('dblclick', handleDoubleClick);

  // Position image 1 correctly on page load
  cube.style.transform = 'rotateX(0deg) rotateY(0deg)';
}