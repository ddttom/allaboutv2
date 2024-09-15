import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('profile-header');

  const profilePic = createOptimizedPicture('https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png', 'Profile Picture', false, [{ width: '200' }]);
  container.appendChild(profilePic);

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('profile-info');

  const name = document.createElement('h1');
  name.textContent = block.children[0].children[0].textContent;
  infoContainer.appendChild(name);

  const headline = document.createElement('p');
  headline.textContent = block.children[1].children[0].textContent;
  infoContainer.appendChild(headline);

  const location = document.createElement('p');
  location.textContent = block.children[2].children[0].textContent;
  infoContainer.appendChild(location);

  container.appendChild(infoContainer);
  block.textContent = '';
  block.appendChild(container);
}