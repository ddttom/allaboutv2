import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('profile-header');

  const backgroundImage = document.createElement('div');
  backgroundImage.classList.add('profile-header-background');
  container.appendChild(backgroundImage);

  const profileInfo = document.createElement('div');
  profileInfo.classList.add('profile-info');

  const profilePicture = createOptimizedPicture('https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png', 'Profile Picture', false, [200, 200]);
  profileInfo.appendChild(profilePicture);

  const nameElement = document.createElement('h1');
  nameElement.textContent = block.children[0].children[0].textContent;
  profileInfo.appendChild(nameElement);

  const titleElement = document.createElement('p');
  titleElement.classList.add('profile-title');
  titleElement.textContent = block.children[1].children[0].textContent;
  profileInfo.appendChild(titleElement);

  const locationElement = document.createElement('p');
  locationElement.classList.add('profile-location');
  locationElement.textContent = block.children[2].children[0].textContent;
  profileInfo.appendChild(locationElement);

  container.appendChild(profileInfo);
  block.textContent = '';
  block.appendChild(container);
}