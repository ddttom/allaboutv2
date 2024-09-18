export default function decorate(block) {
  console.log('LinkedIn Profile block decoration started');

  // Add necessary classes and structure
  block.classList.add('linkedin-profile');

  // Create background image div
  const backgroundDiv = document.createElement('div');
  backgroundDiv.className = 'background-image';
  block.insertBefore(backgroundDiv, block.firstChild);

  // Wrap profile picture in a container
  const profilePictureLink = block.children[1].querySelector('a');
  if (profilePictureLink) {
    const profilePictureContainer = document.createElement('div');
    profilePictureContainer.className = 'profile-picture-container';
    const profilePicture = document.createElement('img');
    profilePicture.src = profilePictureLink.href;
    profilePicture.alt = 'Profile Picture';
    profilePicture.className = 'profile-picture';
    profilePictureContainer.appendChild(profilePicture);
    block.replaceChild(profilePictureContainer, block.children[1]);
  }

  // Add classes to other elements
  const elements = [
    { index: 2, class: 'profile-name' },
    { index: 3, class: 'profile-title' },
    { index: 4, class: 'profile-location' },
    { index: 5, class: 'profile-connections' },
    { index: 6, class: 'contact-info' }
  ];

  elements.forEach(el => {
    if (block.children[el.index]) {
      block.children[el.index].classList.add(el.class);
      const content = block.children[el.index].firstElementChild;
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