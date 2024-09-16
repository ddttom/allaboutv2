export default function decorate(block) {
  const backgroundImage = document.createElement('img');
  backgroundImage.className = 'background-image';
  backgroundImage.src = 'https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg';
  backgroundImage.alt = 'Profile background';

  const profileContent = document.createElement('div');
  profileContent.className = 'profile-content';

  const profileImage = document.createElement('img');
  profileImage.className = 'profile-image';
  profileImage.src = 'https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg';
  profileImage.alt = 'Profile picture';

  const name = document.createElement('h1');
  name.className = 'name';
  name.textContent = block.children[0].children[0].textContent;

  const headline = document.createElement('p');
  headline.className = 'headline';
  headline.textContent = block.children[1].children[0].textContent;

  const location = document.createElement('p');
  location.className = 'location';
  location.textContent = block.children[2].children[0].textContent;

  const connections = document.createElement('p');
  connections.className = 'connections';
  connections.textContent = block.children[3].children[0].textContent;

  profileContent.appendChild(profileImage);
  profileContent.appendChild(name);
  profileContent.appendChild(headline);
  profileContent.appendChild(location);
  profileContent.appendChild(connections);

  block.textContent = '';
  block.appendChild(backgroundImage);
  block.appendChild(profileContent);
}