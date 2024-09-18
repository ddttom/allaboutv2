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
      let content = element.querySelector('p') || element.querySelector('div');
      if (!content) {
        content = document.createElement('p');
        element.appendChild(content);
      }
      content.classList.add(`${el.class}-content`);
      // Keep the original content instead of overwriting it
      if (!content.textContent.trim()) {
        content.textContent = `[${el.class.replace('profile-', '').toUpperCase()}]`;
      }
    }
  });

  // Remove any extra elements that might contain duplicate information
  const extraElements = block.querySelectorAll('div:not(.profile-name):not(.profile-title):not(.profile-location):not(.profile-connections):not(.background-image):not(.profile-picture-container)');
  extraElements.forEach(el => {
    if (!el.classList.contains('contact-button')) {
      el.remove();
    }
  });

  // Create contact info button if it doesn't exist
  let contactButton = block.querySelector('.contact-button');
  if (!contactButton) {
    contactButton = document.createElement('button');
    contactButton.textContent = 'Contact info';
    contactButton.className = 'contact-button';
    block.appendChild(contactButton);
  }

  console.log('LinkedIn Profile block decoration completed');
}