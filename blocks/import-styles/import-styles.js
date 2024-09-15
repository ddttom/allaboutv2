export default function decorate(block) {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --linkedin-blue: #0a66c2;
      --linkedin-light-blue: #e8f3ff;
      --linkedin-black: #000000;
      --linkedin-dark-gray: #333333;
      --linkedin-gray: #666666;
      --linkedin-light-gray: #f3f2ef;
      --linkedin-white: #ffffff;
      --linkedin-border-color: #e0e0e0;
      --linkedin-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      --linkedin-font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Fira Sans', Ubuntu, Oxygen, 'Oxygen Sans', Cantarell, 'Droid Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Lucida Grande', Helvetica, Arial, sans-serif;
    }

    body {
      font-family: var(--linkedin-font-family);
      background-color: var(--linkedin-light-gray);
      color: var(--linkedin-dark-gray);
      line-height: 1.5;
    }

    .section {
      background-color: var(--linkedin-white);
      border-radius: 8px;
      box-shadow: var(--linkedin-shadow);
      margin-bottom: 20px;
      padding: 20px;
    }

    h1, h2, h3, h4, h5, h6 {
      color: var(--linkedin-black);
    }

    a {
      color: var(--linkedin-blue);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .button {
      background-color: var(--linkedin-blue);
      color: var(--linkedin-white);
      padding: 10px 20px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      border: none;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #004182;
    }

    .button.secondary {
      background-color: var(--linkedin-white);
      color: var(--linkedin-blue);
      border: 1px solid var(--linkedin-blue);
    }

    .button.secondary:hover {
      background-color: var(--linkedin-light-blue);
    }
  `;

  document.head.appendChild(style);
}