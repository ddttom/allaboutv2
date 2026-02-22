/**
 * Los Granainos Restaurant - N-Language MX Reference Implementation
 * Shared JavaScript for all language versions
 *
 * Architecture: /assets/script.js shared across /es/, /en/, /fr/, etc.
 * Zero inline JS - all scripts in this single file
 *
 * Features:
 * - N-language support (auto-detects available languages from DOM/path)
 * - Hamburger menu with slide-in drawer
 * - Language selector (dropdown for n-languages)
 * - WebMCP tool definitions
 * - Smooth scroll for anchor links
 */

(function() {
  'use strict';

  // ============================================
  // N-LANGUAGE UTILITIES
  // ============================================

  /**
   * Detect current language from URL path
   * Supports any language code: /es/, /en/, /fr/, /de/, /es-mx/, etc.
   * @returns {string} Language code (e.g., 'es', 'en', 'fr')
   */
  function getCurrentLanguage() {
    const match = window.location.pathname.match(/\/([a-z]{2}(?:-[a-z]{2})?)\//i);
    return match ? match[1].toLowerCase() : 'es'; // Default to Spanish
  }

  /**
   * Get available languages from language selector options
   * @returns {string[]} Array of available language codes
   */
  function getAvailableLanguages() {
    const select = document.querySelector('.language-select');
    if (!select) return ['es', 'en']; // Default fallback

    return Array.from(select.options).map(opt => opt.value);
  }

  /**
   * Navigate to a different language version
   * @param {string} targetLang - Target language code
   */
  function navigateToLanguage(targetLang) {
    const currentLang = getCurrentLanguage();
    const currentPath = window.location.pathname;

    // Replace language segment in path
    // Handles both simple (es) and regional (es-mx) codes
    const newPath = currentPath.replace(
      new RegExp(`/${currentLang}/`, 'i'),
      `/${targetLang}/`
    );

    if (newPath !== currentPath) {
      window.location.href = newPath;
    }
  }

  // ============================================
  // HAMBURGER MENU
  // ============================================

  const isDesktop = window.matchMedia('(min-width: 900px)');

  function toggleMenu(nav, forceExpanded = null) {
    const expanded = forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute('aria-expanded') === 'true';

    const button = nav.querySelector('.nav-hamburger');

    // Toggle body scroll
    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';

    // Update ARIA state
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    if (button) {
      button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    }
  }

  function closeOnEscape(e) {
    if (e.code === 'Escape') {
      const nav = document.getElementById('nav');
      if (nav && nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav);
        const hamburger = nav.querySelector('.nav-hamburger');
        if (hamburger) hamburger.focus();
      }
    }
  }

  function closeOnOverlayClick(e) {
    const nav = document.getElementById('nav');
    // Check if click is on the overlay (::before pseudo-element area)
    if (nav && e.target === nav && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav);
    }
  }

  function initHamburger() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const hamburger = nav.querySelector('.nav-hamburger');
    if (!hamburger) return;

    // Hamburger click
    hamburger.addEventListener('click', () => toggleMenu(nav));

    // Escape key
    window.addEventListener('keydown', closeOnEscape);

    // Overlay click
    nav.addEventListener('click', closeOnOverlayClick);

    // Close on resize to desktop
    isDesktop.addEventListener('change', () => {
      if (isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav, true);
      }
    });

    // Close drawer when clicking nav links (mobile)
    nav.querySelectorAll('.nav-sections a').forEach(link => {
      link.addEventListener('click', () => {
        if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
          toggleMenu(nav);
        }
      });
    });
  }

  // ============================================
  // LANGUAGE SELECTOR
  // ============================================

  function initLanguageSelector() {
    const nav = document.getElementById('nav');
    const langSelect = nav ? nav.querySelector('.language-select') : null;

    if (langSelect) {
      // Set selected option based on current path
      const currentLang = getCurrentLanguage();
      langSelect.value = currentLang;

      // Handle language change
      langSelect.addEventListener('change', (e) => {
        navigateToLanguage(e.target.value);
      });
    }
  }

  // ============================================
  // DESKTOP LANGUAGE TOGGLE
  // ============================================

  function initLanguageToggle() {
    const toggle = document.querySelector('.language-toggle');
    if (!toggle) return;

    // Determine which language to navigate to
    // Toggle between available languages (for 2-language sites)
    toggle.addEventListener('click', () => {
      const available = getAvailableLanguages();
      const current = getCurrentLanguage();

      // Find next language in rotation
      const currentIndex = available.indexOf(current);
      const nextIndex = (currentIndex + 1) % available.length;
      const nextLang = available[nextIndex];

      navigateToLanguage(nextLang);
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // WEBMCP TOOLS
  // ============================================

  function initWebMCPTools() {
    window.mcpTools = {
      'toggle-language': {
        name: 'toggle-language',
        description: 'Switch to a different language version',
        inputSchema: {
          type: 'object',
          properties: {
            lang: {
              type: 'string',
              description: 'Target language code (e.g., es, en, fr)'
            }
          },
          required: ['lang']
        },
        execute: async (params) => {
          const { lang } = params;
          const available = getAvailableLanguages();

          if (!available.includes(lang)) {
            return {
              success: false,
              error: `Language '${lang}' not available. Available: ${available.join(', ')}`
            };
          }

          navigateToLanguage(lang);
          return { success: true, targetLang: lang };
        }
      },

      'menu-query': {
        name: 'menu-query',
        description: 'Query menu items by category or search term',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['fish', 'paella', 'salads', 'gazpacho'],
              description: 'Menu category to query'
            },
            search: {
              type: 'string',
              description: 'Search term for menu items'
            }
          }
        },
        execute: async (params) => {
          const menuItems = Array.from(document.querySelectorAll('.menu-item')).map(item => ({
            name: item.querySelector('.menu-item-name')?.textContent || '',
            price: item.querySelector('.menu-item-price')?.textContent || '',
            description: item.querySelector('.menu-item-description')?.textContent || '',
            specialty: item.classList.contains('specialty')
          }));
          return { success: true, items: menuItems, language: getCurrentLanguage() };
        }
      },

      'reservation-info': {
        name: 'reservation-info',
        description: 'Get restaurant contact and reservation information',
        inputSchema: {
          type: 'object',
          properties: {}
        },
        execute: async () => {
          return {
            success: true,
            info: {
              phone: '+34 952 XXX XXX',
              email: 'reservas@losgranainos.es',
              hours: '12:00-16:00 and 19:00-23:30 (Daily)',
              address: 'Paseo Marítimo de la Cala, 29649 Cala de Mijas, Málaga, Spain',
              coordinates: { lat: 36.5167, lng: -4.6333 }
            },
            language: getCurrentLanguage()
          };
        }
      },

      'location-info': {
        name: 'location-info',
        description: 'Get geographic location and directions information',
        inputSchema: {
          type: 'object',
          properties: {}
        },
        execute: async () => {
          return {
            success: true,
            location: {
              address: 'Paseo Marítimo de la Cala, 29649 Cala de Mijas, Málaga, Spain',
              coordinates: { lat: 36.5167, lng: -4.6333 },
              region: 'Andalusia',
              nearbyLandmarks: ['Cala de Mijas Beach', 'Costa del Sol', 'Málaga City']
            }
          };
        }
      },

      'show-map': {
        name: 'show-map',
        description: 'Navigate to interactive map and show contact info popup',
        inputSchema: {
          type: 'object',
          properties: {}
        },
        execute: async () => {
          const currentLang = getCurrentLanguage();
          const contactSection = document.querySelector(
            currentLang === 'es' ? '#contacto-es' : '#contact-en'
          );

          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Open the map popup after scrolling
            setTimeout(() => {
              const marker = currentLang === 'es' ? window.mapMarkerES : window.mapMarkerEN;
              if (marker) {
                marker.openPopup();
              }
            }, 1000);

            return { success: true, action: 'navigated to map and opened contact popup' };
          }
          return { success: false, error: 'contact section not found' };
        }
      },

      'get-language-info': {
        name: 'get-language-info',
        description: 'Get current language and available languages',
        inputSchema: {
          type: 'object',
          properties: {}
        },
        execute: async () => {
          return {
            success: true,
            currentLanguage: getCurrentLanguage(),
            availableLanguages: getAvailableLanguages()
          };
        }
      }
    };
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    initHamburger();
    initLanguageSelector();
    initLanguageToggle();
    initSmoothScroll();
    initWebMCPTools();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // EXPORTS (for external access)
  // ============================================

  window.salvaApp = {
    getCurrentLanguage,
    getAvailableLanguages,
    navigateToLanguage,
    toggleMenu
  };

})();
