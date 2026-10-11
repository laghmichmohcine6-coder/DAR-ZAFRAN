/**
 * Dar Zafran Admin — Dashboard
 */

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('statTodayDate').textContent =
    new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  try {
    const [statsRes, recentRes] = await Promise.all([
      API.get('/dashboard/stats'),
      API.get('/dashboard/recent'),
    ]);

    const stats  = statsRes.data;
    const recent = recentRes.data;

    // Stats
    document.getElementById('statToday').textContent    = stats.reservations_today;
    document.getElementById('statPending').textContent  = stats.pending_count;
    document.getElementById('statMessages').textContent = stats.messages_unread;
    document.getElementById('statDishes').textContent   = stats.dishes_count;

    // Recent reservations
    renderRecentReservations(recent.reservations);

    // Recent messages
    renderRecentMessages(recent.messages);

  } catch (err) {
    console.error('Dashboard load failed:', err);
  }
});

function renderRecentReservations(reservations) {
  const el = document.getElementById('recentReservations');
  if (!reservations || !reservations.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg></div>
      <p class="empty-state-title">No reservations yet</p>
    </div>`;
    return;
  }

  const rows = reservations.map(r => `
    <tr>
      <td><span class="text-sm font-medium">${esc(r.reference)}</span></td>
      <td>${esc(r.first_name)} ${esc(r.last_name)}</td>
      <td>${formatDate(r.reservation_date)} ${r.reservation_time?.slice(0,5) ?? ''}</td>
      <td>${r.guests}</td>
      <td>${statusBadge(r.status)}</td>
    </tr>
  `).join('');

  el.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Ref</th><th>Guest</th><th>Date</th><th>Guests</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderRecentMessages(messages) {
  const el = document.getElementById('recentMessages');
  if (!messages || !messages.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div>
      <p class="empty-state-title">No messages</p>
    </div>`;
    return;
  }

  const items = messages.map(m => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid var(--border)">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="font-medium text-sm">${esc(m.name)}</span>
          ${statusBadge(m.status)}
        </div>
        <p class="text-sm text-muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(m.subject || m.email)}</p>
      </div>
      <span class="text-xs text-muted">${formatDateTime(m.created_at)}</span>
    </div>
  `).join('');

  el.innerHTML = items;
}
