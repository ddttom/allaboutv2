import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const logo = document.createElement('div');
  logo.classList.add('bbc-logo');
  logo.innerHTML = '<img src="https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png" alt="BBC Logo">';

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">News</a></li>
      <li><a href="#">Sport</a></li>
      <li><a href="#">More</a></li>
    </ul>
  `;

  block.append(logo, nav);
}