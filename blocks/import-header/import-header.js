export default function decorate(block) {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="header-content">
      <div class="logo">
        <img src="https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png" alt="LinkedIn Logo" width="40" height="40">
      </div>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">My Network</a></li>
          <li><a href="#">Jobs</a></li>
          <li><a href="#">Messaging</a></li>
          <li><a href="#">Notifications</a></li>
        </ul>
      </nav>
      <div class="profile-icon">
        <img src="https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png" alt="Profile" width="24" height="24">
      </div>
    </div>
  `;
  block.appendChild(header);
}