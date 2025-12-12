/* eslint-disable no-use-before-define, max-len, no-plusplus, no-console, no-restricted-syntax, no-continue, no-loop-func, radix, no-lonely-if, no-restricted-globals, no-alert, prefer-destructuring, brace-style, no-param-reassign, no-return-assign, no-await-in-loop, no-shadow, no-nested-ternary, func-names, no-void, no-sequences, no-unused-expressions, no-useless-escape */
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
