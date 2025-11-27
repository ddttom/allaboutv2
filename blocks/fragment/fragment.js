/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

import {
  decorateMain,
} from '/scripts/scripts.js';

import {
  loadBlocks,
} from '/scripts/aem.js';

const FRAGMENT_CONFIG = {
  PLAIN_HTML_EXTENSION: '.plain.html',
  MEDIA_PREFIX: './media_',
  SECTION_SELECTOR: ':scope .section',
};

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}${FRAGMENT_CONFIG.PLAIN_HTML_EXTENSION}`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="${FRAGMENT_CONFIG.MEDIA_PREFIX}"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(FRAGMENT_CONFIG.SECTION_SELECTOR);
    if (fragmentSection) {
      const section = block.closest('.section');
      if (section) {
        section.classList.add(...fragmentSection.classList);
      }
      // Use block parameter instead of class selector
      block.replaceWith(...fragment.childNodes);
    }
  }
}
