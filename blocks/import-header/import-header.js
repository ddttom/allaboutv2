import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'import-header';

  const profilePicture = createOptimizedPicture('https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg', 'Lars Trieloff', false, [200]);
  profilePicture.className = 'profile-picture';
  container.appendChild(profilePicture);

  const nameElement = document.createElement('h1');
  nameElement.className = 'profile-name';
  nameElement.textContent = block.children[0].children[0].textContent;
  container.appendChild(nameElement);

  const titleElement = document.createElement('p');
  titleElement.className = 'profile-title';
  titleElement.textContent = block.children[1].children[0].textContent;
  container.appendChild(titleElement);

  const locationElement = document.createElement('p');
  locationElement.className = 'profile-location';
  locationElement.textContent = block.children[2].children[0].textContent;
  container.appendChild(locationElement);

  block.textContent = '';
  block.appendChild(container);
}