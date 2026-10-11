/**
 * Dar Zafran Admin — Messages Management
 */

let currentPage    = 1;
let currentFilters = {};

document.addEventListener('DOMContentLoaded', () => {
  loadMessages();

  document.getElementById('filterStatus')?.addEventListener('change', () => {
    currentPage = 1; applyFilters();
  });

  document.getElementById('msgModalClose')?.addEventListener('click', () => closeModal('messageModal'));
});

function applyFilters() {
  currentFilters = {
    status: document.getElementById('filterStatus')?.value || '',
  };
  loadMessages();
}

async function loadMessages() {
  const tbody = document.getElementById('messagesBody');
  tbody.innerHTML = '<tr><td colspan="6"><div class="loading-overlay"><div class="loading-spinner"></div></div></td></tr>';

  const params = new URLSearchParams({
    page:   currentPage,
    status: currentFilters.status || '',
  });

  try {
    const res = await API.get('/messages?' + params);
    renderTable(res.data);
    renderPagination('messagesPagination', res.pagination, (p) => {
      currentPage = p;
      loadMessages();
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="alert alert-error" style="margin:16px">${esc(err.message)}</div></td></tr>`;
  }
}

function renderTable(rows) {
  const tbody = document.getElementById('messagesBody');
  if (!rows || !rows.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state">
      <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg></div>
      <p class="empty-state-title">No messages found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(m => `
    <tr style="${m.status === 'unread' ? 'font-weight:600' : ''}">
      <td>${esc(m.name)}</td>
      <td><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></td>
      <td>${esc(m.subject || '—')}</td>
      <td>${statusBadge(m.status)}</td>
      <td class="text-xs text-muted">${formatDateTime(m.created_at)}</td>
      <td>
        <button class="btn btn-ghost btn-icon" title="View" onclick="viewMessage(${m.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

async function viewMessage(id) {
  openModal('messageModal');
  document.getElementById('msgModalBody').innerHTML = '<div class="loading-overlay"><div class="loading-spinner"></div></div>';
  document.getElementById('msgModalFooter').innerHTML = '';

  try {
    const res = await API.get('/messages/' + id);
    const m   = res.data;

    document.getElementById('msgModalTitle').textContent = m.subject || 'Message from ' + m.name;

    document.getElementById('msgModalBody').innerHTML = `
      <div class="form-row">
        <div><p class="form-label text-xs text-muted">From</p><p class="font-medium">${esc(m.name)}</p></div>
        <div><p class="form-label text-xs text-muted">Email</p><p><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p></div>
      </div>
      ${m.phone ? `<div><p class="form-label text-xs text-muted">Phone</p><p>${esc(m.phone)}</p></div>` : ''}
      <div class="form-row" style="margin-top:8px">
        <div><p class="form-label text-xs text-muted">Received</p><p class="text-sm">${formatDateTime(m.created_at)}</p></div>
        <div><p class="form-label text-xs text-muted">Status</p><p>${statusBadge(m.status)}</p></div>
      </div>
      <div style="margin-top:16px;padding:16px;background:var(--color-bg-sidebar);border-radius:var(--radius-md)">
        <p class="form-label text-xs text-muted" style="margin-bottom:8px">Message</p>
        <p style="white-space:pre-wrap;line-height:1.6">${esc(m.message)}</p>
      </div>
      <div class="form-group" style="margin-top:16px">
        <label class="form-label" for="msgStatus">Status</label>
        <select class="form-select" id="msgStatus" style="max-width:200px">
          ${['unread','read','replied','archived'].map(s =>
            `<option value="${s}" ${m.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
          ).join('')}
        </select>
      </div>
    `;

    document.getElementById('msgModalFooter').innerHTML = `
      <button class="btn btn-secondary" onclick="closeModal('messageModal')">Close</button>
      <button class="btn btn-danger btn-sm" onclick="deleteMessage(${m.id})">Delete</button>
      <button class="btn btn-primary" id="saveMsgBtn">Save Status</button>
    `;

    document.getElementById('saveMsgBtn').addEventListener('click', async () => {
      const status = document.getElementById('msgStatus').value;
      try {
        await API.patch('/messages/' + m.id, { status });
        closeModal('messageModal');
        loadMessages();
      } catch (err) {
        alert(err.message);
      }
    });

    // Mark as read automatically if unread
    if (m.status === 'unread') {
      API.patch('/messages/' + m.id, { status: 'read' }).catch(() => {});
    }

  } catch (err) {
    document.getElementById('msgModalBody').innerHTML = `<div class="alert alert-error">${esc(err.message)}</div>`;
  }
}

async function deleteMessage(id) {
  if (!confirm('Permanently delete this message?')) return;
  try {
    await API.delete('/messages/' + id);
    closeModal('messageModal');
    loadMessages();
  } catch (err) {
    alert(err.message);
  }
}
