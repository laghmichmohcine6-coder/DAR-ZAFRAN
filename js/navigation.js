/* ============================================
   DAR ZAFRAN — NAVIGATION
   Scroll behavior · Mobile menu · Active states
   ============================================ */

'use strict';

(function () {

  const nav        = document.getElementById('nav');
  const toggle     = document.getElementById('navToggle');
  const overlay    = document.getElementById('navOverlay');
  const body       = document.body;

  if (!nav) return;


  /* ---- Scroll: add .is-scrolled when past threshold ---- */

  const SCROLL_THRESHOLD = 60;

  function onScroll() {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    nav.classList.toggle('is-scrolled', scrolled);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init


  /* ---- Mobile menu toggle ---- */

  const FOCUSABLE_IN_OVERLAY = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openMenu() {
    toggle.classList.add('is-open');
    overlay.classList.add('is-open');
    body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');

    // Move focus into overlay after paint (CSS visibility transition)
    requestAnimationFrame(() => {
      const first = overlay.querySelector(FOCUSABLE_IN_OVERLAY);
      if (first) first.focus();
    });
  }

  function closeMenu() {
    toggle.classList.remove('is-open');
    overlay.classList.remove('is-open');
    body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');

    // Return focus to the trigger button
    toggle.focus();
  }

  // Focus trap — keep Tab/Shift-Tab inside overlay while open
  if (overlay) {
    overlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (!toggle.classList.contains('is-open')) return;

      const focusable = Array.from(overlay.querySelectorAll(FOCUSABLE_IN_OVERLAY));
      if (!focusable.length) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  function toggleMenu() {
    const isOpen = toggle.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  }

  if (toggle) {
    toggle.addEventListener('click', toggleMenu);
  }

  // Close on overlay link click
  const overlayLinks = overlay ? overlay.querySelectorAll('a') : [];
  overlayLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle?.classList.contains('is-open')) {
      closeMenu();
    }
  });


  /* ---- Active link highlighting ---- */

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link[href]');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

})();
