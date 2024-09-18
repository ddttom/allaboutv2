export default async function decorate(block) {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-content">
      <img src="https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png" alt="LinkedIn Logo" width="56" height="14">
      <p>&copy; ${new Date().getFullYear()} LinkedIn Corporation</p>
      <nav>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#accessibility">Accessibility</a></li>
          <li><a href="#user-agreement">User Agreement</a></li>
          <li><a href="#privacy-policy">Privacy Policy</a></li>
          <li><a href="#cookie-policy">Cookie Policy</a></li>
          <li><a href="#copyright-policy">Copyright Policy</a></li>
          <li><a href="#brand-policy">Brand Policy</a></li>
          <li><a href="#guest-controls">Guest Controls</a></li>
          <li><a href="#community-guidelines">Community Guidelines</a></li>
        </ul>
      </nav>
    </div>
  `;
  block.appendChild(footer);
}