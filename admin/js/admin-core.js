/**
 * Dar Zafran Admin — Core UI
 * Sidebar toggle, active nav, badge counts, modals, utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── Active nav link ─────────────────────────────────────────────────────────
  const page = document.body.dataset.page;
  document.querySelectorAll('.sidebar-nav-link[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.classList.add('is-active');
  });

  // ── Sidebar toggle (mobile) ─────────────────────────────────────────────────
  const sidebar  = document.getElementById('adminSidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');

  function openSidebar() {
    sidebar?.classList.add('is-open');
    overlay?.classList.add('is-visible');
  }
  function closeSidebar() {
    sidebar?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
  }

  toggleBtn?.addEventListener('click', openSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // ── Dashboard badge counts ───────────────────────────────────────────────────
  if (page !== 'login') {
    loadBadgeCounts();
  }

  async function loadBadgeCounts() {
    try {
      const res = await API.get('/dashboard/stats');
      const data = res.data;
      const pendingBadge = document.getElementById('pendingBadge');
      const unreadBadge  = document.getElementById('unreadBadge');

      if (pendingBadge && data.pending_count > 0) {
        pendingBadge.textContent = data.pending_count;
        pendingBadge.classList.remove('hidden');
      }
      if (unreadBadge && data.messages_unread > 0) {
        unreadBadge.textContent = data.messages_unread;
        unreadBadge.classList.remove('hidden');
      }
    } catch { /* non-fatal */ }
  }
});

// ── Shared utilities ──────────────────────────────────────────────────────────

/** Render a status badge */
function statusBadge(status) {
  const labels = {
    pending:   'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    no_show:   'No Show',
    unread:    'Unread',
    read:      'Read',
    replied:   'Replied',
    archived:  'Archived',
  };
  const label = labels[status] || status;
  return `<span class="badge badge-${status}">${label}</span>`;
}

/** Format date string to readable */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Format datetime */
function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' +
         d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** Escape HTML for safe insertion */
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Render pagination controls */
function renderPagination(containerId, pagination, onPage) {
  const el = document.getElementById(containerId);
  if (!el || !pagination) return;

  const { total, page, per_page, total_pages } = pagination;
  const from = total === 0 ? 0 : (page - 1) * per_page + 1;
  const to   = Math.min(page * per_page, total);

  el.innerHTML = `
    <span class="pagination-info">Showing ${from}–${to} of ${total}</span>
    <div class="pagination-btns">
      <button class="btn btn-secondary btn-sm" id="pagePrev" ${page <= 1 ? 'disabled' : ''}>← Previous</button>
      <span class="text-sm" style="padding:0 8px;align-self:center">Page ${page} of ${total_pages}</span>
      <button class="btn btn-secondary btn-sm" id="pageNext" ${page >= total_pages ? 'disabled' : ''}>Next →</button>
    </div>
  `;

  el.querySelector('#pagePrev')?.addEventListener('click', () => onPage(page - 1));
  el.querySelector('#pageNext')?.addEventListener('click', () => onPage(page + 1));
}

/** Show alert in an element */
function showAlert(elId, message, type = 'error') {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = message;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** Hide alert */
function hideAlert(elId) {
  const el = document.getElementById(elId);
  if (el) el.classList.add('hidden');
}

/** Open/close modals */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('is-open');
    el.querySelector('[autofocus], input, button:not([disabled])')?.focus();
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('is-open');
}

// Close modal on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.classList.remove('is-open');
  });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.is-open').forEach(m => m.classList.remove('is-open'));
  }
});

/** Format file size */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
