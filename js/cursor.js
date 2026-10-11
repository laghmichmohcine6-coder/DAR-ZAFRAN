/* ============================================
   DAR ZAFRAN — CURSOR
   Custom cursor: dot + lagging ring
   Fine-pointer devices only (desktop)
   ============================================ */

'use strict';

(function () {

  // Only on non-touch devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;
  let idleTimer = null;

  const RING_LERP  = 0.12; // lower = more lag = more premium
  const IDLE_DELAY = 2000; // ms — pause RAF after 2s of no movement

  /* ---- Ring animation — starts/stops with mouse movement ---- */
  function animateRing() {
    ringX = ringX + (mouseX - ringX) * RING_LERP;
    ringY = ringY + (mouseY - ringY) * RING_LERP;

    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    rafId = requestAnimationFrame(animateRing);
  }

  function startRing() {
    if (!rafId) animateRing();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      cancelAnimationFrame(rafId);
      rafId = null;
    }, IDLE_DELAY);
  }

  /* ---- Track mouse ---- */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

    startRing();
  });

  // Kick off ring on first move
  startRing();

  /* ---- Hover states ---- */
  const hoverTargets = 'a, button, [role="button"], .dish-item, .menu-tab, .nav__overlay-link';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('is-hovering');
      ring.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    }
  });

  /* ---- Hide when cursor leaves window ---- */
  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  });

})();
