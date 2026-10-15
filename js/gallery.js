/* ============================================
   DAR ZAFRAN — GALLERY
   Accessible lightbox: keyboard nav, focus trap,
   ESC to close, focus restoration. No dependencies.
   ============================================ */

'use strict';

(function () {

  const lightbox  = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbCounter = document.getElementById('lightboxCounter');
  const lbClose   = document.getElementById('lightboxClose');
  const lbPrev    = document.getElementById('lightboxPrev');
  const lbNext    = document.getElementById('lightboxNext');

  // All gallery trigger buttons, in DOM order
  const triggers = Array.from(document.querySelectorAll('.gallery-item__btn'));
  if (!triggers.length) return;

  let currentIndex = 0;
  let returnFocus  = null; // restore focus on close


  /* ============================================
     OPEN / CLOSE
     ============================================ */

  function openLightbox(index) {
    currentIndex = index;
    const trigger = triggers[index];

    const imgEl   = trigger.querySelector('img');
    const imgSrc  = trigger.dataset.full  || imgEl?.src   || '';
    const caption = trigger.dataset.caption || imgEl?.alt || '';

    lbImg.src         = imgSrc;
    lbImg.alt         = caption;
    lbCaption.textContent = caption;
    updateCounter();

    lightbox.removeAttribute('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const lenis = window.DarZafran?.lenis?.();
    if (lenis) lenis.stop();

    // Focus close button after paint
    requestAnimationFrame(() => {
      lbClose.focus();
    });
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const lenis = window.DarZafran?.lenis?.();
    if (lenis) lenis.start();

    // Clear src to avoid stale image flash on next open
    setTimeout(() => {
      lbImg.src = '';
      lbImg.alt = '';
      lbCaption.textContent = '';
    }, 200);

    // Restore focus to the triggering element
    if (returnFocus) {
      returnFocus.focus();
      returnFocus = null;
    }
  }


  /* ============================================
     NAVIGATION
     ============================================ */

  function showImage(index) {
    currentIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[currentIndex];

    const imgEl   = trigger.querySelector('img');
    const imgSrc  = trigger.dataset.full  || imgEl?.src   || '';
    const caption = trigger.dataset.caption || imgEl?.alt || '';

    // Fade effect: brief opacity transition
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = imgSrc;
      lbImg.alt = caption;
      lbCaption.textContent = caption;
      lbImg.style.opacity = '1';
    }, 120);

    updateCounter();
  }

  function updateCounter() {
    if (lbCounter) {
      lbCounter.textContent = `${currentIndex + 1} / ${triggers.length}`;
    }
  }


  /* ============================================
     EVENT BINDING — Triggers
     ============================================ */

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      returnFocus = trigger;
      openLightbox(index);
    });
  });


  /* ============================================
     EVENT BINDING — Lightbox Controls
     ============================================ */

  lbClose.addEventListener('click', closeLightbox);

  lbPrev.addEventListener('click', () => {
    showImage(currentIndex - 1);
  });

  lbNext.addEventListener('click', () => {
    showImage(currentIndex + 1);
  });

  // Backdrop click closes (only when clicking the lightbox bg, not content)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });


  /* ============================================
     KEYBOARD NAVIGATION
     ============================================ */

  lightbox.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showImage(currentIndex - 1);
        break;
      case 'ArrowRight':
        showImage(currentIndex + 1);
        break;
      default:
        break;
    }
  });


  /* ============================================
     FOCUS TRAP
     Keeps tab focus inside the lightbox
     ============================================ */

  const FOCUSABLE = 'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])';

  lightbox.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusable = Array.from(lightbox.querySelectorAll(FOCUSABLE));
    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if at first focusable, jump to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if at last focusable, jump to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });


  /* ============================================
     IMAGE TRANSITION STYLE
     Smooth fade between images
     ============================================ */

  lbImg.style.transition = 'opacity 0.12s ease';

})();
