import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const profileHeader = document.createElement('div');
  profileHeader.classList.add('profile-header');

  const coverImage = createOptimizedPicture('https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg', 'Cover Image', false, [{ width: '1128' }]);
  coverImage.classList.add('cover-image');

  const profileInfo = document.createElement('div');
  profileInfo.classList.add('profile-info');

  const profilePicture = createOptimizedPicture('https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png', 'Profile Picture', false, [{ width: '200' }]);
  profilePicture.classList.add('profile-picture');

  const nameTitle = document.createElement('div');
  nameTitle.classList.add('name-title');
  nameTitle.innerHTML = `
    <h1>${block.children[0].children[0].textContent}</h1>
    <h2>${block.children[0].children[1].textContent}</h2>
    <p>${block.children[0].children[2].textContent}</p>
  `;

  const actions = document.createElement('div');
  actions.classList.add('profile-actions');
  actions.innerHTML = `
    <button class="button button-primary">Connect</button>
    <button class="button">Message</button>
    <button class="button">More</button>
  `;

  profileInfo.appendChild(profilePicture);
  profileInfo.appendChild(nameTitle);
  profileInfo.appendChild(actions);

  profileHeader.appendChild(coverImage);
  profileHeader.appendChild(profileInfo);

  block.textContent = '';
  block.appendChild(profileHeader);
}
