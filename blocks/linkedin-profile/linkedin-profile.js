export default function decorate(block) {
  console.log('LinkedIn Profile block decoration started');

  // Add necessary classes
  block.classList.add('linkedin-profile');

  // Create background image div
  const backgroundDiv = document.createElement('div');
  backgroundDiv.className = 'background-image';
  block.insertBefore(backgroundDiv, block.firstChild);

  // Process profile picture
  const profilePictureLink = block.children[0]?.querySelector('a');
  if (profilePictureLink) {
    const profilePictureContainer = document.createElement('div');
    profilePictureContainer.className = 'profile-picture-container';
    const profilePicture = document.createElement('img');
    // Remove domain and protocol from the image URL
    profilePicture.src = profilePictureLink.href.split('/').slice(-1)[0];
    profilePicture.alt = 'Profile Picture';
    profilePicture.className = 'profile-picture';
    profilePictureContainer.appendChild(profilePicture);
    block.replaceChild(profilePictureContainer, block.children[0]);
  }

  // Add classes to other elements
  const elements = [
    { index: 1, class: 'profile-name' },
    { index: 2, class: 'profile-title' },
    { index: 3, class: 'profile-location' },
    { index: 4, class: 'profile-connections' },
    { index: 5, class: 'contact-info' }
  ];

  elements.forEach(el => {
    const element = block.children[el.index];
    if (element) {
      element.classList.add(el.class);
      const content = element.firstElementChild;
      if (content) {
        content.classList.add(`${el.class}-content`);
      }
    }
  });

  // Convert contact info to a button
  const contactInfo = block.querySelector('.contact-info-content');
  if (contactInfo) {
    const button = document.createElement('button');
    button.textContent = contactInfo.textContent;
    button.className = 'contact-button';
    contactInfo.parentNode.replaceChild(button, contactInfo);
  }

  console.log('LinkedIn Profile block decoration completed');
}