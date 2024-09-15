import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const grid = document.createElement('div');
  grid.classList.add('import-gallery-grid');

  const images = [
    'https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg',
    'https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg',
    'https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg',
    'https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png',
  ];

  images.forEach((src, index) => {
    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('import-gallery-item');
    const img = createOptimizedPicture(src, `Gallery Image ${index + 1}`, false, [{ width: '300' }]);
    imgWrapper.appendChild(img);
    grid.appendChild(imgWrapper);
  });

  block.appendChild(grid);
}