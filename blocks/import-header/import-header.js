export default async function decorate(block) {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="header-content">
      <div class="logo">
        <img src="https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png" alt="LinkedIn Logo" width="40" height="40">
      </div>
      <button class="mobile-menu-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav aria-label="Main navigation">
        <ul role="menubar">
          <li role="none"><a href="#home" role="menuitem">Home</a></li>
          <li role="none"><a href="#network" role="menuitem">My Network</a></li>
          <li role="none"><a href="#jobs" role="menuitem">Jobs</a></li>
          <li role="none"><a href="#messaging" role="menuitem">Messaging</a></li>
          <li role="none"><a href="#notifications" role="menuitem">Notifications</a></li>
        </ul>
      </nav>
      <div class="profile-icon">
        <img src="https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png" alt="Profile" width="24" height="24">
      </div>
    </div>
  `;
  block.textContent = '';
  block.appendChild(header);

  const mobileMenuToggle = header.querySelector('.mobile-menu-toggle');
  const nav = header.querySelector('nav');

  mobileMenuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    const isExpanded = nav.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    // Improve accessibility by changing focus when menu is opened
    if (isExpanded) {
      nav.querySelector('a').focus();
    }
  });
}