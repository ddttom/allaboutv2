export default function decorate(block) {
  const profileSummary = document.createElement('div');
  profileSummary.className = 'section-card profile-summary';
  profileSummary.innerHTML = `
    <div class="profile-header">
      <img src="https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png" alt="Profile Picture" class="profile-picture">
      <h1 class="profile-name">${block.querySelector('.name').textContent}</h1>
      <p class="profile-headline">${block.querySelector('.headline').textContent}</p>
      <p class="profile-location">${block.querySelector('.location').textContent}</p>
    </div>
    <div class="profile-actions">
      <button class="button">Connect</button>
      <button class="button secondary">Message</button>
    </div>
    <div class="profile-about">
      <h2 class="section-title">About</h2>
      <p>${block.querySelector('.about').textContent}</p>
    </div>
  `;
  block.textContent = '';
  block.appendChild(profileSummary);
}