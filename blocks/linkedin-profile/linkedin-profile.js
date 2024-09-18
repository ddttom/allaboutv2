export default function decorate(block) {
  // eslint-disable-next-line no-console
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
  } else {
    const imgLink = block.querySelector('a[href*="/media_"]');
    if (imgLink) {
      const img = document.createElement('img');
      img.src = imgLink.href;
      img.alt = 'Profile Picture';
      img.className = 'profile-picture';
      profilePictureContainer.appendChild(img);
      imgLink.parentElement.remove();
    }
  }
  block.insertBefore(profilePictureContainer, backgroundDiv.nextSibling);

  // Add classes to other elements and preserve content
  const elements = [
    { class: 'profile-name' },
    { class: 'profile-title' },
    { class: 'profile-location' },
    { class: 'profile-connections' }
  ];

  elements.forEach((el, index) => {
    const element = block.children[index + 2];
    if (element) {
      element.classList.add(el.class);
      const content = element.querySelector('div');
      if (content) {
        content.classList.add(`${el.class}-content`);
        // Preserve the content
        if (content.textContent.trim() === '') {
          content.textContent = element.textContent.trim();
        }
      } else if (element.textContent.trim() !== '') {
        const newContent = document.createElement('div');
        newContent.classList.add(`${el.class}-content`);
        newContent.textContent = element.textContent.trim();
        element.textContent = '';
        element.appendChild(newContent);
      }
    }
  });

  // Create contact info button if it doesn't exist
  let contactButton = block.querySelector('.contact-button');
  if (!contactButton) {
    const contactDiv = block.querySelector('div:last-child');
    if (contactDiv && contactDiv.textContent.trim().toLowerCase() === 'contact info') {
      contactButton = document.createElement('button');
      contactButton.textContent = contactDiv.textContent;
      contactButton.className = 'contact-button';
      contactDiv.parentElement.replaceChild(contactButton, contactDiv);
    }
  }

  // eslint-disable-next-line no-console
  console.log('LinkedIn Profile block decoration completed');
}