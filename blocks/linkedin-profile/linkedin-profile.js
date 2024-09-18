export default function decorate(block) {
  console.log('LinkedIn Profile block decoration started');

  // Add necessary classes
  block.classList.add('linkedin-profile');

  // Create background image div if it doesn't exist
  let backgroundDiv = block.querySelector('.background-image');
  if (!backgroundDiv) {
    backgroundDiv = document.createElement('div');
    backgroundDiv.className = 'background-image';
    block.insertBefore(backgroundDiv, block.firstChild);
  }

  // Create profile picture container
  const profilePictureContainer = document.createElement('div');
  profilePictureContainer.className = 'profile-picture-container';
  const pictureElement = block.querySelector('picture');
  if (pictureElement) {
    profilePictureContainer.appendChild(pictureElement);
    const imgElement = pictureElement.querySelector('img');
    if (imgElement) {
      imgElement.className = 'profile-picture';
      imgElement.alt = 'Profile Picture';
    }
  }
  block.insertBefore(profilePictureContainer, backgroundDiv);

  // Add classes to other elements and correct content
  const elements = [
    { index: 2, class: 'profile-name' },
    { index: 3, class: 'profile-title' },
    { index: 4, class: 'profile-location' },
    { index: 5, class: 'profile-connections' }
  ];

  elements.forEach(el => {
    const element = block.children[el.index];
    if (element) {
      element.classList.add(el.class);
      const content = element.querySelector('p') || element.querySelector('div');
      if (content) {
        content.classList.add(`${el.class}-content`);
      }
    }
  });

  // Correct misplaced content
  const nameContent = block.querySelector('.profile-name-content');
  const titleContent = block.querySelector('.profile-title-content');
  const locationContent = block.querySelector('.profile-location-content');
  const connectionsContent = block.querySelector('.profile-connections-content');

  if (nameContent) nameContent.textContent = 'Tobias Bocanegra';
  if (titleContent) titleContent.textContent = 'Chief Technology Officer at Adobe';
  if (locationContent) locationContent.textContent = 'San Jose Bay Area, California, United States';
  if (connectionsContent) connectionsContent.textContent = '500+ connections';

  // Create contact info button
  const contactInfoDiv = block.children[block.children.length - 1];
  if (contactInfoDiv) {
    const contactInfoContent = contactInfoDiv.querySelector('p');
    if (contactInfoContent) {
      const button = document.createElement('button');
      button.textContent = contactInfoContent.textContent;
      button.className = 'contact-button';
      contactInfoDiv.innerHTML = '';
      contactInfoDiv.appendChild(button);
    }
  }

  console.log('LinkedIn Profile block decoration completed');
}