/* ============================================
   DAR ZAFRAN — RESERVATION
   Client-side form validation.
   Per-field blur + full submit pass.
   aria-invalid / aria-describedby error pattern.
   Demo-honest: shows confirmation message only —
   no data is transmitted. Connect a booking
   provider (e.g. OpenTable, Resy, Formspree)
   for production use.
   ============================================ */

'use strict';

(function () {

  const form   = document.getElementById('reservationForm');
  const status = document.getElementById('reservationStatus');
  if (!form || !status) return;

  const submitBtn = form.querySelector('[type="submit"]');


  /* ============================================
     VALIDATION HELPERS
     ============================================ */

  function showError(input, message) {
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // Returns true if validation passes, false otherwise
  function validateField(input) {
    const value = input.value.trim();
    const id    = input.id;

    clearError(input);

    // Required check
    if (input.required && !value) {
      showError(input, 'This field is required.');
      return false;
    }

    // Email format
    if (id === 'guestEmail' && value && !isValidEmail(value)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }

    // Date: future only, Tue–Sun only
    if (id === 'reservationDate' && value) {
      const selected = new Date(value + 'T00:00:00');
      const today    = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        showError(input, 'Please select a future date.');
        return false;
      }

      // getDay(): 0=Sun, 1=Mon, 2=Tue ... 6=Sat
      if (selected.getDay() === 1) {
        showError(input, 'We are closed on Mondays. Please choose another day.');
        return false;
      }
    }

    return true;
  }


  /* ============================================
     DATE INPUT — set minimum to today
     ============================================ */

  const dateInput = document.getElementById('reservationDate');

  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }


  /* ============================================
     PER-FIELD VALIDATION ON BLUR / INPUT
     ============================================ */

  const allFields = form.querySelectorAll('input, select, textarea');

  allFields.forEach((field) => {
    // Validate on blur
    field.addEventListener('blur', () => {
      if (field.required || field.value.trim()) {
        validateField(field);
      }
    });

    // Re-validate on input once marked invalid (live correction feedback)
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });
  });


  /* ============================================
     FORM SUBMIT
     ============================================ */

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Prevent double-submission
    if (submitBtn.disabled) return;

    // Validate all required fields in one pass
    const required = Array.from(
      form.querySelectorAll('input[required], select[required], textarea[required]')
    );

    const allValid = required.reduce((acc, field) => {
      const fieldValid = validateField(field);
      return acc && fieldValid;
    }, true);

    if (!allValid) {
      // Move focus to the first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Lock submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Simulate async processing (800ms),
    // then reveal the demo confirmation message.
    // Replace this block with a real API call for production.
    setTimeout(() => {
      form.setAttribute('hidden', '');
      form.setAttribute('aria-hidden', 'true');

      status.removeAttribute('hidden');
      status.setAttribute('aria-hidden', 'false');

      // Move focus to the status region for screen reader announcement
      status.focus();
    }, 800);
  });

})();
