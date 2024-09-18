export default function decorate(block) {
  console.log('LinkedIn Profile block decoration started');

  // Add necessary classes
  block.classList.add('linkedin-profile');

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
  block.insertBefore(profilePictureContainer, block.children[1]);

  // Add classes to other elements
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
      const content = element.querySelector('p');
      if (content) {
        content.classList.add(`${el.class}-content`);
      }
    }
  });

  console.log('LinkedIn Profile block decoration completed');
}