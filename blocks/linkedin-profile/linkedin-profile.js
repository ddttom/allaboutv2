alert('LinkedIn Profile script loaded');

(function() {
  console.log('LinkedIn Profile script loaded');

  function decorate(block) {
    console.log('LinkedIn Profile decorate function called', block);
    
    console.log('LinkedIn Profile block decoration started');
    console.log('Initial block structure:', block.innerHTML);

    // Add necessary classes and structure
    block.classList.add('linkedin-profile');
    console.log('Added linkedin-profile class to block');

    // Create background image div
    const backgroundDiv = document.createElement('div');
    backgroundDiv.className = 'background-image';
    block.insertBefore(backgroundDiv, block.firstChild);
    console.log('Added background image div');

    // Wrap profile picture in a container
    const profilePictureLink = block.children[1]?.querySelector('a');
    console.log('Profile picture link:', profilePictureLink);
    if (profilePictureLink) {
      const profilePictureContainer = document.createElement('div');
      profilePictureContainer.className = 'profile-picture-container';
      const profilePicture = document.createElement('img');
      profilePicture.src = profilePictureLink.href;
      profilePicture.alt = 'Profile Picture';
      profilePicture.className = 'profile-picture';
      profilePictureContainer.appendChild(profilePicture);
      block.replaceChild(profilePictureContainer, block.children[1]);
      console.log('Wrapped profile picture in container');
    } else {
      console.log('Profile picture link not found');
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
      const element = block.children[el.index];
      console.log(`Processing element at index ${el.index}:`, element);
      if (element) {
        element.classList.add(el.class);
        const content = element.firstElementChild;
        if (content) {
          content.classList.add(`${el.class}-content`);
          console.log(`Added class ${el.class} to element and ${el.class}-content to its child`);
        } else {
          console.log(`No child element found for ${el.class}`);
        }
      } else {
        console.log(`Element at index ${el.index} not found`);
      }
    });

    // Convert contact info to a button
    const contactInfo = block.querySelector('.contact-info-content');
    console.log('Contact info element:', contactInfo);
    if (contactInfo) {
      const button = document.createElement('button');
      button.textContent = contactInfo.textContent;
      button.className = 'contact-button';
      contactInfo.parentNode.replaceChild(button, contactInfo);
      console.log('Converted contact info to button');
    } else {
      console.log('Contact info element not found');
    }

    console.log('LinkedIn Profile block decoration completed');
    console.log('Final block structure:', block.innerHTML);
  }

  // Attach the decorate function to the window object
  window.decorateLinkedInProfile = decorate;
})();