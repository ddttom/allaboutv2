export default async function decorate(block) {
  const profileSummary = document.createElement('div');
  profileSummary.className = 'section-card profile-summary';
  profileSummary.innerHTML = `
    <div class="background-image"></div>
    <div class="profile-info">
      <div class="profile-picture-container">
        <img src="${block.children[0].children[0].textContent}" alt="Profile Picture" class="profile-picture">
      </div>
      <div class="profile-details">
        <h1>${block.children[1].children[0].textContent}</h1>
        <h2>${block.children[2].children[0].textContent}</h2>
        <p>${block.children[3].children[0].textContent}</p>
        <p>${block.children[4].children[0].textContent}</p>
        <button class="button connect-button">Connect</button>
      </div>
    </div>
  `;
  block.textContent = '';
  block.appendChild(profileSummary);
}