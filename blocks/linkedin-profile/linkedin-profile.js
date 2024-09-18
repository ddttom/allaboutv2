export default function decorate(block) {
  console.log('LinkedIn Profile block decoration started');

  // Add necessary classes
  block.classList.add('linkedin-profile');

  // Create background image div
  const backgroundDiv = document.createElement('div');
  backgroundDiv.className = 'background-image';
  block.insertBefore(backgroundDiv, block.firstChild);

  // Process profile picture
  const profilePictureContainer = block.querySelector('.profile-name');
  if (profilePictureContainer) {
    profilePictureContainer.classList.add('profile-picture-container');
    const pictureElement = profilePictureContainer.querySelector('picture');
    if (pictureElement) {
      const imgElement = pictureElement.querySelector('img');
      if (imgElement) {
        imgElement.className = 'profile-picture';
        imgElement.alt = 'Profile Picture';
      }
    }
  }

  // Correct the classes for other elements
  const elements = [
    { selector: '.profile-title p', class: 'profile-name-content' },
    { selector: '.profile-location p', class: 'profile-title-content' },
    { selector: '.profile-connections p', class: 'profile-location-content' },
    { selector: '.contact-info button', class: 'profile-connections-content' }
  ];

  elements.forEach(el => {
    const element = block.querySelector(el.selector);
    if (element) {
      element.className = el.class;
    }
  });

  // Convert the last div to a contact info button
  const lastDiv = block.children[block.children.length - 1];
  if (lastDiv) {
    const contactInfoContent = lastDiv.querySelector('p');
    if (contactInfoContent) {
      const button = document.createElement('button');
      button.textContent = contactInfoContent.textContent;
      button.className = 'contact-button';
      lastDiv.innerHTML = '';
      lastDiv.appendChild(button);
    }
  }

  console.log('LinkedIn Profile block decoration completed');
}