/**
 * Dar Zafran Admin — Account & Audit Log
 */

let auditPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  // Populate profile from already-fetched admin data (set by admin-auth.js)
  await populateProfile();

  document.getElementById('profileForm')?.addEventListener('submit', saveProfile);
  document.getElementById('passwordForm')?.addEventListener('submit', changePassword);

  loadAuditLog();
});

async function populateProfile() {
  try {
    const res   = await API.get('/auth/me');
    const admin = res.data;

    document.getElementById('profileName').value  = admin.name  || '';
    document.getElementById('profileEmail').value = admin.email || '';

    if (admin.last_login_at) {
      const el = document.getElementById('profileLastLogin');
      if (el) el.textContent = 'Last login: ' + formatDateTime(admin.last_login_at);
    }
  } catch { /* auth.js handles redirect */ }
}

async function saveProfile(e) {
  e.preventDefault();
  const btn = e.submitter;
  hideAlert('profileAlert');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  const name  = document.getElementById('profileName').value.trim();
  const email = document.getElementById('profileEmail').value.trim();

  try {
    const res = await API.put('/auth/profile', { name, email });
    // Update topbar name
    const nameEl = document.getElementById('adminName');
    if (nameEl && res.data?.name) nameEl.textContent = res.data.name;
    showAlert('profileAlert', 'Profile updated.', 'success');
  } catch (err) {
    showAlert('profileAlert', err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Update Profile';
  }
}

async function changePassword(e) {
  e.preventDefault();
  const btn = e.submitter;
  hideAlert('passwordAlert');

  const current = document.getElementById('currentPassword').value;
  const newPw   = document.getElementById('newPassword').value;
  const confirm = document.getElementById('confirmPassword').value;

  if (newPw !== confirm) {
    showAlert('passwordAlert', 'New passwords do not match.', 'error');
    return;
  }
  if (newPw.length < 8) {
    showAlert('passwordAlert', 'Password must be at least 8 characters.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    await API.post('/auth/change-password', {
      current_password: current,
      new_password:     newPw,
    });
    document.getElementById('passwordForm').reset();
    showAlert('passwordAlert', 'Password changed successfully.', 'success');
  } catch (err) {
    showAlert('passwordAlert', err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Change Password';
  }
}

async function loadAuditLog() {
  const tbody = document.getElementById('auditBody');
  tbody.innerHTML = '<tr><td colspan="4"><div class="loading-overlay"><div class="loading-spinner"></div></div></td></tr>';

  try {
    const res = await API.get('/audit-logs?page=' + auditPage);
    renderAuditTable(res.data);
    renderPagination('auditPagination', res.pagination, (p) => {
      auditPage = p;
      loadAuditLog();
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="alert alert-error" style="margin:16px">${esc(err.message)}</div></td></tr>`;
  }
}

function renderAuditTable(rows) {
  const tbody = document.getElementById('auditBody');
  if (!rows || !rows.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
      <p class="empty-state-title">No activity recorded yet</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>
        <span class="font-medium text-sm">${esc(r.action)}</span>
        ${r.details ? `<div class="text-xs text-muted">${esc(typeof r.details === 'object' ? JSON.stringify(r.details) : r.details)}</div>` : ''}
      </td>
      <td>${r.entity_type ? `<span class="text-sm">${esc(r.entity_type)}${r.entity_id ? ' #' + r.entity_id : ''}</span>` : '—'}</td>
      <td class="text-sm">${esc(r.user_name || '—')}</td>
      <td class="text-xs text-muted">${formatDateTime(r.created_at)}</td>
    </tr>
  `).join('');
}
