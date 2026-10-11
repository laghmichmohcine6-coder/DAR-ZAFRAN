/**
 * Dar Zafran Admin — Reservations Management
 */

let currentPage   = 1;
let currentFilters = {};

document.addEventListener('DOMContentLoaded', () => {
  loadReservations();

  // Filters
  ['filterStatus', 'filterDate'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
      currentPage = 1;
      applyFilters();
    });
  });

  let searchTimer;
  document.getElementById('filterSearch')?.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentPage = 1;
      applyFilters();
    }, 350);
  });

  document.getElementById('filterReset')?.addEventListener('click', () => {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterDate').value   = '';
    document.getElementById('filterSearch').value = '';
    currentFilters = {};
    currentPage = 1;
    loadReservations();
  });

  // Modal close
  document.getElementById('modalClose')?.addEventListener('click', () => closeModal('reservationModal'));

  // Export CSV
  document.getElementById('exportBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      status:    currentFilters.status    || '',
      date_from: currentFilters.date_from || '',
      date_to:   currentFilters.date_to   || '',
    });
    window.open(API.BASE + '/reservations/export?' + params, '_blank');
  });
});

function applyFilters() {
  currentFilters = {
    status: document.getElementById('filterStatus')?.value || '',
    date:   document.getElementById('filterDate')?.value   || '',
    search: document.getElementById('filterSearch')?.value || '',
  };
  loadReservations();
}

async function loadReservations() {
  const tbody = document.getElementById('reservationsBody');
  tbody.innerHTML = '<tr><td colspan="8"><div class="loading-overlay"><div class="loading-spinner"></div></div></td></tr>';

  const params = new URLSearchParams({
    page:   currentPage,
    status: currentFilters.status || '',
    date:   currentFilters.date   || '',
    search: currentFilters.search || '',
  });

  try {
    const res = await API.get('/reservations?' + params);
    renderTable(res.data);
    renderPagination('reservationsPagination', res.pagination, (p) => {
      currentPage = p;
      loadReservations();
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="alert alert-error" style="margin:16px">${esc(err.message)}</div></td></tr>`;
  }
}

function renderTable(rows) {
  const tbody = document.getElementById('reservationsBody');
  if (!rows || !rows.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state">
      <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg></div>
      <p class="empty-state-title">No reservations found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><span class="font-medium text-sm">${esc(r.reference)}</span></td>
      <td>
        <span class="font-medium">${esc(r.first_name)} ${esc(r.last_name)}</span>
        <div class="text-xs text-muted">${esc(r.email)}</div>
      </td>
      <td>
        <span class="font-medium">${formatDate(r.reservation_date)}</span>
        <div class="text-xs text-muted">${r.reservation_time?.slice(0,5) ?? ''}</div>
      </td>
      <td>${r.guests}</td>
      <td>${r.occasion !== 'none' ? esc(r.occasion) : '—'}</td>
      <td>${statusBadge(r.status)}</td>
      <td class="text-xs text-muted">${formatDateTime(r.created_at)}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-icon" title="View" onclick="viewReservation(${r.id})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function viewReservation(id) {
  openModal('reservationModal');
  document.getElementById('modalBody').innerHTML = '<div class="loading-overlay"><div class="loading-spinner"></div></div>';
  document.getElementById('modalFooter').innerHTML = '';

  try {
    const res = await API.get('/reservations/' + id);
    const r   = res.data;
    document.getElementById('modalTitle').textContent = 'Reservation ' + r.reference;

    document.getElementById('modalBody').innerHTML = `
      <div class="form-row">
        <div><p class="form-label text-xs text-muted">Guest</p><p class="font-medium">${esc(r.first_name)} ${esc(r.last_name)}</p></div>
        <div><p class="form-label text-xs text-muted">Email</p><p><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></p></div>
      </div>
      <div class="form-row">
        <div><p class="form-label text-xs text-muted">Phone</p><p>${esc(r.phone) || '—'}</p></div>
        <div><p class="form-label text-xs text-muted">Language</p><p>${esc(r.lang?.toUpperCase())}</p></div>
      </div>
      <div class="form-row">
        <div><p class="form-label text-xs text-muted">Date</p><p class="font-medium">${formatDate(r.reservation_date)}</p></div>
        <div><p class="form-label text-xs text-muted">Time</p><p class="font-medium">${r.reservation_time?.slice(0,5) ?? ''}</p></div>
      </div>
      <div class="form-row">
        <div><p class="form-label text-xs text-muted">Guests</p><p>${r.guests}</p></div>
        <div><p class="form-label text-xs text-muted">Occasion</p><p>${r.occasion !== 'none' ? esc(r.occasion) : '—'}</p></div>
      </div>
      ${r.special_requests ? `<div><p class="form-label text-xs text-muted">Special Requests</p><p>${esc(r.special_requests)}</p></div>` : ''}
      <div class="form-row" style="align-items:flex-end">
        <div class="form-group">
          <label class="form-label" for="statusSelect">Status</label>
          <select class="form-select" id="statusSelect">
            ${['pending','confirmed','cancelled','completed','no_show'].map(s =>
              `<option value="${s}" ${r.status === s ? 'selected' : ''}>${s.replace('_', ' ')}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group flex-1">
          <label class="form-label" for="adminNotes">Admin Notes</label>
          <textarea class="form-textarea" id="adminNotes" rows="2">${esc(r.admin_notes || '')}</textarea>
        </div>
      </div>
    `;

    document.getElementById('modalFooter').innerHTML = `
      <button class="btn btn-secondary" onclick="closeModal('reservationModal')">Close</button>
      <button class="btn btn-danger btn-sm" onclick="deleteReservation(${r.id})">Delete</button>
      <button class="btn btn-primary" id="saveStatusBtn">Save Changes</button>
    `;

    document.getElementById('saveStatusBtn').addEventListener('click', async () => {
      const status = document.getElementById('statusSelect').value;
      const notes  = document.getElementById('adminNotes').value;
      try {
        await API.patch('/reservations/' + r.id, { status, admin_notes: notes });
        closeModal('reservationModal');
        loadReservations();
      } catch (err) {
        alert(err.message);
      }
    });

  } catch (err) {
    document.getElementById('modalBody').innerHTML = `<div class="alert alert-error">${esc(err.message)}</div>`;
  }
}

async function deleteReservation(id) {
  if (!confirm('Permanently delete this reservation?')) return;
  try {
    await API.delete('/reservations/' + id);
    closeModal('reservationModal');
    loadReservations();
  } catch (err) {
    alert(err.message);
  }
}
