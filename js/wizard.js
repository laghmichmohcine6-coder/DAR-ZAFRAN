/* ============================================
   DAR ZAFRAN — RESERVATION WIZARD
   5-step booking flow state machine.
   Demo-honest: no data transmitted.
   Connect a booking provider for production.
   ============================================ */

'use strict';

(function () {

  var wizard   = document.getElementById('reservationWizard');
  var statusEl = document.getElementById('reservationStatus');
  if (!wizard || !statusEl) return;

  var submitBtn = document.getElementById('wizardSubmit');


  /* ============================================
     STATE
     ============================================ */

  var state = {
    step: 1,
    data: {
      date:     '',
      time:     '',
      guests:   '',
      name:     '',
      email:    '',
      phone:    '',
      occasion: '',
      requests: ''
    }
  };


  /* ============================================
     i18n HELPER
     ============================================ */

  function t(key) {
    var i18n = window.DarZafran && window.DarZafran.i18n;
    return i18n ? i18n.t(key) : key;
  }


  /* ============================================
     DATE INPUT — set min to today
     ============================================ */

  var dateInput = document.getElementById('wizardDate');

  if (dateInput) {
    var today = new Date();
    var yyyy  = today.getFullYear();
    var mm    = String(today.getMonth() + 1).padStart(2, '0');
    var dd    = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);

    /* Re-validate live once marked invalid */
    dateInput.addEventListener('change', function () {
      clearError('wizardDateError');
    });
  }


  /* ============================================
     VALIDATION HELPERS
     ============================================ */

  function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.removeAttribute('hidden');
    }
  }

  function clearError(id) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = '';
    }
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }


  /* ============================================
     VALIDATION — per step
     ============================================ */

  function validateStep(step) {
    switch (step) {

      case 1: {
        clearError('wizardDateError');
        var val = dateInput ? dateInput.value : '';
        if (!val) {
          showError('wizardDateError', t('wizard.error.date-required'));
          return false;
        }
        var selected = new Date(val + 'T00:00:00');
        var now      = new Date(); now.setHours(0, 0, 0, 0);
        if (selected < now) {
          showError('wizardDateError', t('wizard.error.date-past'));
          return false;
        }
        if (selected.getDay() === 1) {   /* Monday */
          showError('wizardDateError', t('wizard.error.date-monday'));
          return false;
        }
        state.data.date = val;
        return true;
      }

      case 2: {
        clearError('wizardTimeError');
        if (!state.data.time) {
          showError('wizardTimeError', t('wizard.error.time-required'));
          return false;
        }
        return true;
      }

      case 3: {
        clearError('wizardGuestsError');
        if (!state.data.guests) {
          showError('wizardGuestsError', t('wizard.error.guests-required'));
          return false;
        }
        return true;
      }

      case 4: {
        var nameEl  = document.getElementById('wizardName');
        var emailEl = document.getElementById('wizardEmail');
        var ok = true;

        clearError('wizardNameError');
        clearError('wizardEmailError');

        if (!nameEl || !nameEl.value.trim()) {
          showError('wizardNameError', t('wizard.error.name-required'));
          ok = false;
        }
        if (!emailEl || !emailEl.value.trim()) {
          showError('wizardEmailError', t('wizard.error.email-required'));
          ok = false;
        } else if (!isValidEmail(emailEl.value.trim())) {
          showError('wizardEmailError', t('wizard.error.email-invalid'));
          ok = false;
        }

        if (ok) {
          var phoneEl    = document.getElementById('wizardPhone');
          var occasionEl = document.getElementById('wizardOccasion');
          var reqEl      = document.getElementById('wizardRequests');

          state.data.name     = nameEl.value.trim();
          state.data.email    = emailEl.value.trim();
          state.data.phone    = phoneEl    ? phoneEl.value.trim()    : '';
          state.data.occasion = occasionEl ? occasionEl.value        : '';
          state.data.requests = reqEl      ? reqEl.value.trim()      : '';
        } else {
          /* Focus first invalid */
          var firstInvalid = wizard.querySelector('[aria-invalid="true"]');
          if (!firstInvalid) {
            firstInvalid = (nameEl && !nameEl.value.trim()) ? nameEl : emailEl;
          }
          if (firstInvalid) firstInvalid.focus();
        }

        return ok;
      }

      default:
        return true;
    }
  }


  /* ============================================
     PROGRESS INDICATOR
     ============================================ */

  function updateProgress(step) {
    document.querySelectorAll('.wizard-progress__step').forEach(function (item, idx) {
      var n = idx + 1;
      item.classList.toggle('is-active', n === step);
      item.classList.toggle('is-done',   n < step);
      if (n === step) {
        item.setAttribute('aria-current', 'step');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }


  /* ============================================
     PANEL TRANSITIONS
     ============================================ */

  function showPanel(n) {
    document.querySelectorAll('.wizard-panel').forEach(function (p) {
      p.setAttribute('hidden', '');
      p.classList.remove('is-active');
    });

    var panel = document.getElementById('wizardStep' + n);
    if (!panel) return;

    panel.removeAttribute('hidden');
    /* Force reflow so animation re-triggers */
    void panel.offsetWidth;
    panel.classList.add('is-active');

    /* Scroll wizard into view — use Lenis if available, native fallback */
    var lenisInst = window.DarZafran && window.DarZafran.lenis && window.DarZafran.lenis();
    if (lenisInst) {
      lenisInst.scrollTo(wizard, { offset: 0 });
    } else {
      wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* Inform Lenis of potential height change */
    if (window.DarZafran && window.DarZafran.lenis) {
      var lenis = window.DarZafran.lenis();
      if (lenis) setTimeout(function () { lenis.resize(); }, 80);
    }
  }


  /* ---- Navigate to next step ---- */
  function goToStep(target) {
    if (!validateStep(state.step)) return;
    state.step = target;
    updateProgress(target);
    if (target === 5) buildReview();
    showPanel(target);
  }

  /* ---- Navigate back ---- */
  function goBack(target) {
    state.step = target;
    updateProgress(target);
    showPanel(target);
  }


  /* ============================================
     TIME SLOT SELECTION
     ============================================ */

  wizard.querySelectorAll('.wizard-time-slot').forEach(function (btn) {
    btn.addEventListener('click', function () {
      wizard.querySelectorAll('.wizard-time-slot').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('is-selected');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('is-selected');
      state.data.time = btn.dataset.time;
    });
  });


  /* ============================================
     GUEST COUNT SELECTION
     ============================================ */

  wizard.querySelectorAll('.wizard-guest-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      wizard.querySelectorAll('.wizard-guest-btn').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('is-selected');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('is-selected');
      state.data.guests = btn.dataset.guests;
    });
  });


  /* ============================================
     REVIEW PANEL — build summary
     ============================================ */

  function formatDate(dateStr) {
    if (!dateStr) return '\u2014';
    try {
      var d    = new Date(dateStr + 'T00:00:00');
      var lang = document.documentElement.getAttribute('lang') || 'en';
      return d.toLocaleDateString(lang, {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }

  function buildReview() {
    var dl = document.getElementById('wizardReview');
    if (!dl) return;

    var rows = [
      { label: t('wizard.review.date'),     val: formatDate(state.data.date), step: 1 },
      { label: t('wizard.review.time'),     val: state.data.time || '\u2014', step: 2 },
      { label: t('wizard.review.guests'),   val: state.data.guests || '\u2014', step: 3 },
      { label: t('wizard.review.name'),     val: state.data.name || '\u2014',   step: 4 },
      { label: t('wizard.review.email'),    val: state.data.email || '\u2014',  step: 4 },
      { label: t('wizard.review.phone'),    val: state.data.phone || '\u2014',  step: 4 },
      { label: t('wizard.review.occasion'), val: state.data.occasion || '\u2014', step: 4 },
      { label: t('wizard.review.requests'), val: state.data.requests || '\u2014', step: 4 }
    ];

    var editLabel = t('wizard.review.edit');

    dl.innerHTML = rows.map(function (row) {
      return '<div class="wizard-review__row">' +
        '<dt class="wizard-review__label">' + escapeHTML(row.label) + '</dt>' +
        '<dd class="wizard-review__value">' +
          '<span>' + escapeHTML(row.val) + '</span>' +
          '<button class="wizard-review__edit" ' +
            'data-back="' + row.step + '" ' +
            'aria-label="' + escapeHTML(editLabel) + ' ' + escapeHTML(row.label) + '">' +
            escapeHTML(editLabel) +
          '</button>' +
        '</dd>' +
      '</div>';
    }).join('');

    /* Wire edit buttons in the review panel */
    dl.querySelectorAll('.wizard-review__edit').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goBack(parseInt(btn.dataset.back, 10));
      });
    });
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }


  /* ============================================
     SUBMIT
     ============================================ */

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      if (submitBtn.disabled) return;

      submitBtn.disabled = true;
      submitBtn.textContent = t('wizard.btn.submitting');

      // Build API base URL from current page path (strips filename, appends /api)
      var apiBase = window.location.origin +
        window.location.pathname.split('/').slice(0, -1).join('/') + '/api';

      // Split full name into first / last
      var nameParts = state.data.name.split(' ');
      var firstName = nameParts[0] || state.data.name;
      var lastName  = nameParts.slice(1).join(' ') || '';

      var payload = {
        first_name:       firstName,
        last_name:        lastName,
        email:            state.data.email,
        phone:            state.data.phone || '',
        reservation_date: state.data.date,
        reservation_time: state.data.time,
        guests:           parseInt(state.data.guests, 10),
        occasion:         state.data.occasion || 'none',
        special_requests: state.data.requests || '',
        lang:             document.documentElement.getAttribute('lang') || 'en'
      };

      fetch(apiBase + '/reservations/public', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, status: res.status, data: data };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.data.message || 'Submission failed (' + result.status + ').');
        }

        var confirmHeading = document.getElementById('confirmHeading');
        var confirmBody1   = document.getElementById('confirmBody1');
        var confirmBody2   = document.getElementById('confirmBody2');
        var confirmDemo    = document.getElementById('confirmDemo');
        var confirmRef     = document.getElementById('confirmRef');

        if (confirmHeading) confirmHeading.innerHTML = t('confirm.heading');
        if (confirmBody1)   confirmBody1.textContent  = t('confirm.body1');
        if (confirmBody2)   confirmBody2.textContent  = t('confirm.body2');
        if (confirmDemo)    confirmDemo.hidden         = true;
        if (confirmRef && result.data && result.data.data && result.data.data.reference) {
          confirmRef.textContent = result.data.data.reference;
          confirmRef.hidden = false;
        }

        wizard.setAttribute('hidden', '');
        wizard.setAttribute('aria-hidden', 'true');

        statusEl.removeAttribute('hidden');
        statusEl.setAttribute('aria-hidden', 'false');
        statusEl.focus();
      })
      .catch(function (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = t('wizard.btn.submit');
        var errorEl = document.getElementById('wizardSubmitError');
        if (errorEl) {
          errorEl.textContent = err.message || 'Something went wrong. Please try again.';
          errorEl.removeAttribute('hidden');
        }
      });
    });
  }


  /* ============================================
     EVENT DELEGATION — Next / Back buttons
     ============================================ */

  wizard.addEventListener('click', function (e) {
    var nextBtn = e.target.closest('.wizard-next');
    if (nextBtn) {
      var next = parseInt(nextBtn.dataset.next, 10);
      if (!isNaN(next)) goToStep(next);
      return;
    }

    var backBtn = e.target.closest('.wizard-back');
    if (backBtn) {
      var back = parseInt(backBtn.dataset.back, 10);
      if (!isNaN(back)) goBack(back);
    }
  });


  /* ============================================
     RE-APPLY i18n on LANG CHANGE
     Wizard re-renders review labels on each
     language switch if currently on step 5.
     ============================================ */

  document.addEventListener('DOMContentLoaded', function () {
    /* Observe language changes via MutationObserver on <html lang> */
    var observer = new MutationObserver(function () {
      if (state.step === 5) buildReview();
      /* Update submit button text */
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.textContent = t('wizard.btn.submit');
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });
  });

})();
