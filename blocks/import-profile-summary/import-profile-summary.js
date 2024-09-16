import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const profileSummary = document.createElement('div');
  profileSummary.classList.add('profile-summary', 'section-card');

  const coverImage = createOptimizedPicture('https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg', 'Cover Image', false, [{ width: '800' }]);
  coverImage.classList.add('cover-image');

  const profileImage = createOptimizedPicture('https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg', 'Lars Trieloff', false, [{ width: '200' }]);
  profileImage.classList.add('profile-image');

  const name = document.createElement('h1');
  name.textContent = block.children[0].children[0].textContent;

  const headline = document.createElement('p');
  headline.classList.add('headline');
  headline.textContent = block.children[0].children[1].textContent;

  const location = document.createElement('p');
  location.classList.add('location');
  location.textContent = block.children[0].children[2].textContent;

  const connectButton = document.createElement('button');
  connectButton.classList.add('button', 'connect-button');
  connectButton.textContent = 'Connect';

  profileSummary.appendChild(coverImage);
  profileSummary.appendChild(profileImage);
  profileSummary.appendChild(name);
  profileSummary.appendChild(headline);
  profileSummary.appendChild(location);
  profileSummary.appendChild(connectButton);

  block.textContent = '';
  block.appendChild(profileSummary);
}