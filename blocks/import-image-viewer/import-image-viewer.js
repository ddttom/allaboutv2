import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const viewer = document.createElement('div');
  viewer.classList.add('import-image-viewer');

  const img = createOptimizedPicture('https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg', 'Viewed Image', false, [{ width: '800' }]);
  viewer.appendChild(img);

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('import-image-viewer-close');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => {
    viewer.classList.remove('active');
  });

  viewer.appendChild(closeBtn);
  block.appendChild(viewer);

  // For demo purposes, let's add a button to show the viewer
  const showViewerBtn = document.createElement('button');
  showViewerBtn.textContent = 'Show Image Viewer';
  showViewerBtn.addEventListener('click', () => {
    viewer.classList.add('active');
  });
  block.appendChild(showViewerBtn);
}