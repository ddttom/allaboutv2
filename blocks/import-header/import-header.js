export default async function decorate(block) {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="header-content">
      <div class="logo">
        <a href="#home">
          <img src="https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png" alt="LinkedIn" width="34" height="34">
        </a>
      </div>
      <div class="search-bar">
        <input type="text" placeholder="Search" aria-label="Search">
      </div>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="#home" class="nav-icon-home"><span>Home</span></a></li>
          <li><a href="#network" class="nav-icon-network"><span>My Network</span></a></li>
          <li><a href="#jobs" class="nav-icon-jobs"><span>Jobs</span></a></li>
          <li><a href="#messaging" class="nav-icon-messaging"><span>Messaging</span></a></li>
          <li><a href="#notifications" class="nav-icon-notifications"><span>Notifications</span></a></li>
          <li class="profile-menu">
            <button aria-haspopup="true" aria-expanded="false">
              <img src="https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png" alt="Me" width="24" height="24">
              <span>Me<i class="nav-icon-dropdown"></i></span>
            </button>
          </li>
        </ul>
      </nav>
      <div class="work-menu">
        <button aria-haspopup="true" aria-expanded="false">
          <i class="nav-icon-work"></i>
          <span>Work<i class="nav-icon-dropdown"></i></span>
        </button>
      </div>
      <a href="#premium" class="premium-link">Try Premium for free</a>
    </div>
  `;
  block.textContent = '';
  block.appendChild(header);

  // Mobile menu toggle functionality
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.className = 'mobile-menu-toggle';
  mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
  mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';
  header.querySelector('.header-content').prepend(mobileMenuToggle);

  const nav = header.querySelector('nav');

  mobileMenuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    const isExpanded = nav.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    if (isExpanded) {
      nav.querySelector('a').focus();
    }
  });
}