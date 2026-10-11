/* ============================================
   DAR ZAFRAN — VIDEO MANAGER
   Hero prefers-reduced-motion · IntersectionObserver
   for viewport-aware below-fold video playback.
   Only one below-fold video plays at a time.
   ============================================ */

'use strict';

(function () {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ============================================
     HERO VIDEO — prefers-reduced-motion
     When motion is reduced, pause and hide video
     so the poster (static image) shows instead.
     ============================================ */

  const heroVideo = document.querySelector('.hero__video');

  if (heroVideo) {
    if (prefersReducedMotion) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
      // Hide the video element; the poster attribute image shows naturally
      heroVideo.style.display = 'none';
    } else {
      // Resume play if tab becomes visible again
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      });
    }
  }


  /* ============================================
     BELOW-FOLD VIDEO MANAGEMENT
     Observe .js-video-autoplay elements.
     Play when entering viewport, pause when leaving.
     Ensures only one below-fold video plays at a time.
     ============================================ */

  const managedVideos = document.querySelectorAll('.js-video-autoplay');

  if (!managedVideos.length) return;

  // Track which video is currently playing below-fold
  let activeVideo = null;

  function playVideo(video) {
    if (prefersReducedMotion) return;
    if (activeVideo && activeVideo !== video) {
      activeVideo.pause();
    }
    activeVideo = video;
    video.play().catch(() => {});
  }

  function pauseVideo(video) {
    video.pause();
    if (activeVideo === video) {
      activeVideo = null;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          playVideo(video);
        } else {
          pauseVideo(video);
        }
      });
    },
    {
      // Start loading when within 200px of viewport
      rootMargin: '200px 0px 200px 0px',
      threshold: 0.25,
    }
  );

  managedVideos.forEach((video) => {
    // Ensure below-fold videos don't autoplay on load
    video.removeAttribute('autoplay');
    observer.observe(video);
  });

})();
