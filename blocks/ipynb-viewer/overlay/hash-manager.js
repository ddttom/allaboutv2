/**
 * Hash Manager
 * Single source of truth for URL hash management across all overlay modes
 */

/**
 * Hash format: #mode/identifier
 * Examples:
 * - #notebook/cell-5
 * - #markdown/docs/README.md
 * - #manual/help
 */

const hashManager = {
  /**
   * Update hash based on navigation target
   * @param {Object} target - Navigation target
   * @param {string} target.mode - Mode ('notebook' | 'markdown' | 'manual')
   * @param {string} target.identifier - Content identifier
   */
  update(target) {
    if (!target || !target.mode || !target.identifier) {
      console.warn('[HASH] Invalid target:', target);
      return;
    }

    const { mode, identifier } = target;
    const hash = `#${mode}/${identifier}`;

    // eslint-disable-next-line no-console
    console.log(`[HASH] Updating to: ${hash}`);

    window.history.replaceState(null, '', hash);
  },

  /**
   * Clear hash from URL
   */
  clear() {
    // eslint-disable-next-line no-console
    console.log('[HASH] Clearing hash');

    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search,
    );
  },

  /**
   * Parse hash to navigation target
   * @returns {Object|null} Navigation target or null if no hash
   */
  parse() {
    const { hash } = window.location;

    if (!hash || hash === '#') {
      return null;
    }

    // Remove leading # and split by /
    const parts = hash.substring(1).split('/');

    if (parts.length < 2) {
      console.warn('[HASH] Invalid hash format:', hash);
      return null;
    }

    const [mode, ...identifierParts] = parts;
    const identifier = identifierParts.join('/'); // Rejoin in case path has slashes

    // eslint-disable-next-line no-console
    console.log(`[HASH] Parsed: mode=${mode}, identifier=${identifier}`);

    return { mode, identifier };
  },

  /**
   * Get current hash (raw)
   * @returns {string} Current hash with # prefix
   */
  getCurrent() {
    return window.location.hash;
  },

  /**
   * Check if hash matches target
   * @param {Object} target - Navigation target
   * @returns {boolean} True if hash matches target
   */
  matches(target) {
    const current = this.parse();
    if (!current || !target) return false;

    return current.mode === target.mode && current.identifier === target.identifier;
  },
};

export default hashManager;
