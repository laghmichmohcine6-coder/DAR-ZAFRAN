/* ============================================
   DAR ZAFRAN — HERO
   Video fallback · Parallax overlay on scroll
   ============================================ */

'use strict';

(function () {

  const hero    = document.getElementById('hero');
  const video   = hero?.querySelector('.hero__video');
  const overlay = hero?.querySelector('.hero__overlay');

  if (!hero) return;


  /* ---- Video: handle load error gracefully ---- */

  if (video) {
    video.addEventListener('error', () => {
      // If video fails, the poster (fallback image) is already shown by the browser.
      // Ensure the video element doesn't block the poster display.
      video.style.display = 'none';
    });

    // Pause video when tab is hidden (performance)
    document.addEventListener('visibilitychange', () => {
      document.hidden ? video.pause() : video.play().catch(() => {});
    });
  }


  /* ---- Subtle parallax on hero overlay on scroll ---- */
  // Shift the overlay slightly as user scrolls — adds depth
  // Skipped for users who prefer reduced motion

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function onScroll() {
      const scrollY = window.scrollY;
      const heroH   = hero.offsetHeight;

      if (scrollY > heroH) return;

      const progress = scrollY / heroH;

      // Translate hero content slightly upward (creates subtle depth)
      const content = hero.querySelector('.hero__content');
      if (content) {
        content.style.transform = `translateY(${progress * -40}px)`;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

})();
