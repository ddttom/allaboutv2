const TAGS_CONFIG = {
  META_KEYS: {
    CONTENT_TECHNOLOGY: '$meta:contenttechnology$',
    CATEGORY: '$meta:category$',
  },
  CSS_CLASSES: {
    TAG: 'card-tag',
    TAG_ALT: 'card-tag alt',
  },
};

export default function decorate(block) {
  // INTENTIONAL: window.siteConfig is a global configuration object
  // Use block parameter instead of document.querySelector
  let tagsHTML = '';
  if (window.siteConfig && window.siteConfig[TAGS_CONFIG.META_KEYS.CONTENT_TECHNOLOGY]) {
    tagsHTML += `<span class='${TAGS_CONFIG.CSS_CLASSES.TAG}'>${window.siteConfig[TAGS_CONFIG.META_KEYS.CONTENT_TECHNOLOGY]}</span>`;
  }
  if (window.siteConfig && window.siteConfig[TAGS_CONFIG.META_KEYS.CATEGORY]) {
    tagsHTML += `<span class='${TAGS_CONFIG.CSS_CLASSES.TAG_ALT}'>${window.siteConfig[TAGS_CONFIG.META_KEYS.CATEGORY]}</span>`;
  }
  if (tagsHTML) {
    block.innerHTML = tagsHTML;
  }
}
