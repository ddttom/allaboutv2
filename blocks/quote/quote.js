/* eslint-disable no-use-before-define, max-len, no-plusplus, no-console, no-restricted-syntax, no-continue, no-loop-func, radix, no-lonely-if, no-restricted-globals, no-alert, prefer-destructuring, brace-style, no-param-reassign, no-return-assign, no-await-in-loop, no-shadow, no-nested-ternary, func-names, no-void, no-sequences, no-unused-expressions, no-useless-escape */
function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default async function decorate(block) {
  const [quotation, attribution] = [...block.children].map((c) => c.firstElementChild);
  const blockquote = document.createElement('blockquote');
  // decorate quotation
  quotation.className = 'quote-quotation';
  if (!hasWrapper(quotation)) {
    quotation.innerHTML = `<p>${quotation.innerHTML}</p>`;
  }
  blockquote.append(quotation);
  // decoration attribution
  if (attribution) {
    attribution.className = 'quote-attribution';
    if (!hasWrapper(attribution)) {
      attribution.innerHTML = `<p>${attribution.innerHTML}</p>`;
    }
    blockquote.append(attribution);
    const ems = attribution.querySelectorAll('em');
    ems.forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
  }
  block.innerHTML = '';
  block.append(blockquote);
}
