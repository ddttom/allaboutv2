export default function decorate(block) {
  const footerContent = `
    <div class="footer-links">
      <h3>BBC</h3>
      <ul>
        <li><a href="#">Terms of Use</a></li>
        <li><a href="#">About the BBC</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Cookies</a></li>
        <li><a href="#">Accessibility Help</a></li>
        <li><a href="#">Contact the BBC</a></li>
      </ul>
    </div>
    <div class="footer-social">
      <h3>Follow the BBC</h3>
      <div class="social-icons">
        <a href="#" class="social-icon">Facebook</a>
        <a href="#" class="social-icon">Twitter</a>
        <a href="#" class="social-icon">Instagram</a>
      </div>
    </div>
  `;

  block.innerHTML = footerContent;
}