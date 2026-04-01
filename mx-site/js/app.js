/**
 * MX Bookshop — Application Script
 * @description Interactive behaviours for the MX book-sale website
 * @version 1.0
 * @author Tom Cranstoun
 * @mx:status active
 * @mx:contentType script
 */

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initSmoothScroll();
  initHeaderScroll();
});

/** Mobile navigation toggle */
function initMobileMenu() {
  var btn = document.querySelector('.mobile-menu-btn');
  var nav = document.querySelector('.header-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.textContent = isOpen ? '\u2715' : '\u2630';
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '\u2630';
    });
  });
}

/** Smooth scroll for anchor links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/** Header background solidifies on scroll */
function initHeaderScroll() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var scrollThreshold = 50;
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > scrollThreshold) {
          header.style.background = 'rgba(10, 22, 40, 0.98)';
        } else {
          header.style.background = 'rgba(10, 22, 40, 0.95)';
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}
