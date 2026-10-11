/* ============================================
   DAR ZAFRAN — ANIMATIONS
   GSAP ScrollTrigger · Parallax · Menu tabs
   ============================================ */

'use strict';

(function () {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ============================================
     MENU TAB SWITCHING
     Accessible: ARIA attributes + keyboard nav
     ============================================ */

  const tabs   = document.querySelectorAll('.menu-tab[role="tab"]');
  const panels = document.querySelectorAll('.menu-panel[role="tabpanel"]');

  function activateTab(tab) {
    const target = tab.dataset.tab;

    // Update all tabs
    tabs.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });

    // Update all panels
    panels.forEach((p) => {
      p.classList.remove('is-active');
      p.setAttribute('hidden', '');
    });

    // Activate selected tab
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');

    // Activate matching panel
    const panel = document.querySelector(`[data-panel="${target}"]`);
    if (panel) {
      panel.classList.add('is-active');
      panel.removeAttribute('hidden');
    }

    // Scroll the active tab into view within its horizontal scroll container.
    // block:'nearest' prevents the PAGE from scrolling vertically;
    // inline:'nearest' scrolls only the .menu-tabs overflow container.
    tab.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }

  if (tabs.length && panels.length) {
    // Click
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab));
    });

    // Keyboard: Arrow keys navigate between tabs
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        let newIndex;

        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = tabs.length - 1;
        } else {
          return;
        }

        e.preventDefault();
        activateTab(tabs[newIndex]);
        tabs[newIndex].focus();
      });
    });
  }


  /* ============================================
     GSAP SCROLL ANIMATIONS
     Only runs if GSAP is available
     ============================================ */

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) return;


  /* ---- Atmosphere: parallax on desktop only ---- */
  // Disabled on mobile (<= 768px) — background-image parallax is janky on touch

  const atmBg   = document.querySelector('.atmosphere__bg');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (atmBg && !isMobile) {
    gsap.to(atmBg, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.atmosphere',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }


  /* ---- Story section: image subtle lift ---- */

  const storyImage = document.querySelector('.story__image-wrap');

  if (storyImage) {
    gsap.from(storyImage, {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.story',
        start: 'top 75%',
      },
    });
  }


  /* ---- Dish items: stagger reveal ---- */

  const dishItems = document.querySelectorAll('.dish-item');

  if (dishItems.length) {
    gsap.from(dishItems, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: {
        trigger: '.dishes__grid',
        start: 'top 82%',
      },
    });
  }


  /* ---- Manifesto quote reveal ---- */

  const manifestoQuote = document.querySelector('.manifesto__quote');

  if (manifestoQuote) {
    gsap.from(manifestoQuote, {
      y: 40,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.manifesto',
        start: 'top 78%',
      },
    });
  }


})();
