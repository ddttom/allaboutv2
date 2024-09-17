export default async function decorate(block) {
  const profileCover = document.createElement('div');
  profileCover.className = 'import-profile-cover';

  const profileInfo = document.createElement('div');
  profileInfo.className = 'import-profile-info';

  const profilePicture = document.createElement('img');
  profilePicture.src = 'https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png';
  profilePicture.alt = 'Profile Picture';
  profilePicture.className = 'import-profile-picture';

  const name = document.createElement('h1');
  name.className = 'import-profile-name';
  name.textContent = block.children[0].children[0].textContent;

  const headline = document.createElement('p');
  headline.className = 'import-profile-headline';
  headline.textContent = block.children[1].children[0].textContent;

  const location = document.createElement('p');
  location.className = 'import-profile-location';
  location.textContent = block.children[2].children[0].textContent;

  const connections = document.createElement('p');
  connections.className = 'import-profile-connections';
  connections.textContent = block.children[3].children[0].textContent;

  const buttons = document.createElement('div');
  buttons.className = 'import-profile-buttons';

  const connectButton = document.createElement('button');
  connectButton.className = 'button button-primary';
  connectButton.textContent = 'Connect';

  const messageButton = document.createElement('button');
  messageButton.className = 'button button-secondary';
  messageButton.textContent = 'Message';

  buttons.appendChild(connectButton);
  buttons.appendChild(messageButton);

  profileInfo.appendChild(profilePicture);
  profileInfo.appendChild(name);
  profileInfo.appendChild(headline);
  profileInfo.appendChild(location);
  profileInfo.appendChild(connections);
  profileInfo.appendChild(buttons);

  block.innerHTML = '';
  block.appendChild(profileCover);
  block.appendChild(profileInfo);
}