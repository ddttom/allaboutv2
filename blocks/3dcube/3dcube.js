export default async function decorate(block) {
  const cube = document.createElement('div');
  cube.className = 'cube';
  
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  const rows = [...block.children];
  
  faces.forEach((face, index) => {
    if (rows[index]) {
      const [imageCell, linkCell] = rows[index].children;
      const faceDiv = document.createElement('div');
      faceDiv.className = `cube__face cube__face--${face}`;
      
      const link = document.createElement('a');
      link.href = linkCell.textContent.trim();
      
      const img = document.createElement('img');
      img.src = imageCell.querySelector('img').src;
      img.alt = imageCell.querySelector('img').alt;
      
      link.appendChild(img);
      faceDiv.appendChild(link);
      cube.appendChild(faceDiv);
    }
  });
  
  block.textContent = '';
  block.appendChild(cube);
  
  let isMouseDown = false;
  let startX, startY, rotX = 0, rotY = 0;
  
  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    rotY += deltaX * 0.5;
    rotX -= deltaY * 0.5;
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    startX = e.clientX;
    startY = e.clientY;
  };
  
  cube.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  
  document.addEventListener('mouseup', () => {
    isMouseDown = false;
  });
  
  cube.addEventListener('mousemove', handleMouseMove);
  
  cube.addEventListener('dblclick', (e) => {
    const link = e.target.closest('a');
    if (link) {
      window.location.href = link.href;
    }
  });
  
  // Position image 1 on load
  cube.style.transform = 'rotateY(0deg)';
}