/* ============================================
   DAR ZAFRAN — CORE
   Init · Lenis smooth scroll · IntersectionObserver
   ============================================ */

'use strict';

/* ---- Utility: debounce ---- */
function debounce(fn, wait = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* ---- Utility: lerp ---- */
function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}


/* ============================================
   LENIS SMOOTH SCROLL
   ============================================ */

let lenis;

function initLenis() {
  // Skip smooth scroll for users who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Lenis is loaded via CDN — check it's available
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  // Use GSAP ticker when available — avoids double-updating lenis.raf()
  // from both a manual requestAnimationFrame loop and the GSAP ticker.
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback: manual RAF when GSAP is not available
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}


/* ============================================
   REVEAL ON SCROLL
   IntersectionObserver for .reveal elements
   ============================================ */

function initReveal() {
  const elements = document.querySelectorAll('.reveal, .line-draw');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}


/* ============================================
   IMAGE FALLBACK
   Hides broken-image icon; container gradient
   remains as intentional design placeholder
   ============================================ */

function initImageFallback() {
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      img.style.opacity = '0';
    }
    img.addEventListener('error', () => {
      img.style.opacity = '0';
    });
  });
}


/* ============================================
   PAGE LOAD — apply is-loaded to body
   Triggers CSS hero entrance sequence
   ============================================ */

function initPageLoad() {
  // Small delay ensures fonts are rendered
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.classList.add('is-loaded');
    }, 120);
  });
}


/* ============================================
   INIT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initLenis();
  initReveal();
  initImageFallback();
});

/* Export for use in other modules */
window.DarZafran = window.DarZafran || {};
window.DarZafran.lenis = () => lenis;
window.DarZafran.lerp = lerp;
window.DarZafran.debounce = debounce;
