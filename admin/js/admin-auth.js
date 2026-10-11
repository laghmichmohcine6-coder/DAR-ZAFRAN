/**
 * Dar Zafran Admin — Auth
 * Handles login form, session check, and logout.
 */

// ── Session check: redirect to login if not authenticated ────────────────────
(async function checkAuth() {
  const page = document.body.dataset.page;
  if (page === 'login') return; // Login page handles itself

  try {
    const res = await API.get('/auth/me');
    const admin = res.data;
    // Populate username in topbar
    const nameEl = document.getElementById('adminName');
    if (nameEl && admin?.name) nameEl.textContent = admin.name;
    // Store admin info globally for other scripts
    window._admin = admin;
  } catch {
    window.location.href = 'login.html';
  }
})();

// ── Logout button ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      try {
        await API.post('/auth/logout');
      } catch { /* ignore */ }
      window.location.href = 'login.html';
    });
  }

  // ── Login form ──────────────────────────────────────────────────────────────
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // If already authenticated, redirect to dashboard
    API.get('/auth/me').then(() => {
      window.location.href = 'index.html';
    }).catch(() => { /* not logged in — show form */ });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn   = document.getElementById('loginBtn');
      const alert = document.getElementById('loginAlert');
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      alert.classList.add('hidden');
      btn.disabled   = true;
      btn.textContent = 'Signing in…';

      try {
        await API.post('/auth/login', { email, password });
        window.location.href = 'index.html';
      } catch (err) {
        alert.textContent = err.message || 'Login failed.';
        alert.classList.remove('hidden');
        btn.disabled    = false;
        btn.textContent = 'Sign in';
      }
    });
  }
});
