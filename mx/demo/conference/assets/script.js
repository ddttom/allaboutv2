/**
 * MX Summit Conference - Shared JavaScript
 * N-Language Architecture: Language-agnostic, shared across all versions
 */

(function() {
  'use strict';

  // === LANGUAGE DETECTION ===
  // Auto-detect current language from URL path
  function getCurrentLanguage() {
    const match = window.location.pathname.match(/\/([a-z]{2}(?:-[a-z]{2})?)\//i);
    return match ? match[1].toLowerCase() : 'en';
  }

  // Available languages (configured per site)
  const availableLanguages = ['en', 'de'];

  // === HAMBURGER MENU ===
  const isDesktop = window.matchMedia('(min-width: 900px)');

  function toggleMenu(nav, forceExpanded = null) {
    const expanded = forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute('aria-expanded') === 'true';

    const button = nav.querySelector('.nav-hamburger');

    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }

  function closeOnEscape(e) {
    if (e.code === 'Escape') {
      const nav = document.getElementById('nav');
      if (nav && nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav);
        nav.querySelector('.nav-hamburger').focus();
      }
    }
  }

  function closeOnOverlayClick(e) {
    const nav = document.getElementById('nav');
    if (nav && e.target === nav && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav);
    }
  }

  function initHamburger() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const hamburger = nav.querySelector('.nav-hamburger');
    if (!hamburger) return;

    hamburger.addEventListener('click', () => toggleMenu(nav));
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('click', closeOnOverlayClick);

    isDesktop.addEventListener('change', () => {
      if (isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav, true);
      }
    });

    // Close menu when clicking nav links
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
          toggleMenu(nav);
        }
      });
    });
  }

  // === LANGUAGE SELECTOR ===
  function initLanguageSelector() {
    const langSelect = document.querySelector('.language-select');
    if (!langSelect) return;

    // Set current language as selected
    const currentLang = getCurrentLanguage();
    langSelect.value = currentLang;

    // Handle language change
    langSelect.addEventListener('change', (e) => {
      const targetLang = e.target.value;
      const currentPath = window.location.pathname;

      // Replace language code in path
      let newPath;
      const langMatch = currentPath.match(/\/([a-z]{2}(?:-[a-z]{2})?)\//i);
      if (langMatch) {
        newPath = currentPath.replace(langMatch[0], `/${targetLang}/`);
      } else {
        // No language in path, prepend it
        newPath = `/${targetLang}${currentPath}`;
      }

      window.location.href = newPath;
    });
  }

  // === SMOOTH SCROLL ===
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // === FORM HANDLING ===
  function initRegistrationForm() {
    const form = document.querySelector('.registration-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // In production, send to registration API
      console.log('Registration submitted:', data);

      // Show success message
      const lang = getCurrentLanguage();
      const messages = {
        en: 'Thank you for registering! We will send you a confirmation email.',
        de: 'Vielen Dank für Ihre Anmeldung! Wir senden Ihnen eine Bestätigungsmail.'
      };

      alert(messages[lang] || messages.en);
      form.reset();
    });
  }

  // === WEBMCP TOOLS ===
  window.mcp_tools = {
    'get-conference-info': {
      name: 'get-conference-info',
      description: 'Get information about the MX Summit conference',
      inputSchema: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            enum: ['overview', 'speakers', 'schedule', 'venue', 'registration'],
            description: 'Which section of conference info to retrieve'
          }
        }
      },
      execute: async function(params) {
        const lang = getCurrentLanguage();
        const info = {
          name: 'MX Summit 2026',
          date: '2026-05-12',
          location: 'Frankfurt, Germany',
          venue: 'Messe Frankfurt',
          language: lang,
          url: window.location.href
        };

        if (params.section === 'speakers') {
          info.speakers = Array.from(document.querySelectorAll('.speaker-card')).map(card => ({
            name: card.querySelector('.speaker-name')?.textContent,
            role: card.querySelector('.speaker-role')?.textContent,
            company: card.querySelector('.speaker-company')?.textContent
          }));
        }

        if (params.section === 'schedule') {
          info.schedule = Array.from(document.querySelectorAll('.schedule-item')).map(item => ({
            time: item.querySelector('.schedule-time')?.textContent,
            title: item.querySelector('h3')?.textContent,
            description: item.querySelector('p')?.textContent
          }));
        }

        return info;
      }
    },

    'toggle-language': {
      name: 'toggle-language',
      description: 'Switch to a different language version',
      inputSchema: {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            enum: availableLanguages,
            description: 'Target language code'
          }
        },
        required: ['language']
      },
      execute: async function(params) {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(/\/([a-z]{2}(?:-[a-z]{2})?)\//i, `/${params.language}/`);
        window.location.href = newPath;
        return { success: true, newPath };
      }
    },

    'get-language-info': {
      name: 'get-language-info',
      description: 'Get current and available languages',
      inputSchema: { type: 'object', properties: {} },
      execute: async function() {
        return {
          current: getCurrentLanguage(),
          available: availableLanguages,
          htmlLang: document.documentElement.lang
        };
      }
    }
  };

  // === COUNTDOWN TIMER ===
  function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    const eventDate = new Date('2026-05-12T09:00:00+02:00');

    function updateCountdown() {
      const now = new Date();
      const diff = eventDate - now;

      if (diff <= 0) {
        countdownEl.innerHTML = '<span class="countdown-live">Event is live!</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const lang = getCurrentLanguage();
      const labels = {
        en: { days: 'Days', hours: 'Hours', minutes: 'Minutes' },
        de: { days: 'Tage', hours: 'Stunden', minutes: 'Minuten' }
      };
      const l = labels[lang] || labels.en;

      countdownEl.innerHTML = `
        <div class="countdown-item"><span class="countdown-number">${days}</span><span class="countdown-label">${l.days}</span></div>
        <div class="countdown-item"><span class="countdown-number">${hours}</span><span class="countdown-label">${l.hours}</span></div>
        <div class="countdown-item"><span class="countdown-number">${minutes}</span><span class="countdown-label">${l.minutes}</span></div>
      `;
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  // === INITIALIZATION ===
  function init() {
    initHamburger();
    initLanguageSelector();
    initSmoothScroll();
    initRegistrationForm();
    initCountdown();

    console.log(`[MX Conference] Language: ${getCurrentLanguage()}, Available: ${availableLanguages.join(', ')}`);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
