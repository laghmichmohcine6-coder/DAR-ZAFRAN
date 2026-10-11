/**
 * Dar Zafran Admin — Categories Management
 */

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();

  document.getElementById('addCategoryBtn')?.addEventListener('click', () => openCategoryModal(null));

  document.getElementById('catModalClose')?.addEventListener('click',  () => closeModal('categoryModal'));
  document.getElementById('catModalCancel')?.addEventListener('click', () => closeModal('categoryModal'));

  document.getElementById('categoryForm')?.addEventListener('submit', saveCategory);
});

async function loadCategories() {
  const tbody = document.getElementById('categoriesBody');
  tbody.innerHTML = '<tr><td colspan="8"><div class="loading-overlay"><div class="loading-spinner"></div></div></td></tr>';

  try {
    const res = await API.get('/categories');
    renderTable(res.data);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="alert alert-error" style="margin:16px">${esc(err.message)}</div></td></tr>`;
  }
}

function renderTable(rows) {
  const tbody = document.getElementById('categoriesBody');
  if (!rows || !rows.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state">
      <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg></div>
      <p class="empty-state-title">No categories yet</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(c => `
    <tr>
      <td class="font-medium">${esc(c.name_en)}</td>
      <td>${esc(c.name_fr || '—')}</td>
      <td dir="rtl">${esc(c.name_ar || '—')}</td>
      <td><code class="text-xs">${esc(c.slug)}</code></td>
      <td>${c.dish_count ?? '—'}</td>
      <td>${c.sort_order}</td>
      <td>${c.is_active
        ? '<span class="badge badge-confirmed">Active</span>'
        : '<span class="badge badge-cancelled">Inactive</span>'}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-icon" title="Edit" onclick="openCategoryModal(${c.id})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn btn-ghost btn-icon" title="Delete" style="color:var(--color-danger)" onclick="deleteCategory(${c.id}, '${esc(c.name_en).replace(/'/g, "\\'")}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function openCategoryModal(id) {
  const form  = document.getElementById('categoryForm');
  const alert = document.getElementById('catAlert');
  form.reset();
  alert.classList.add('hidden');
  document.getElementById('catId').value = '';
  document.getElementById('catActive').checked = true;
  document.getElementById('catSort').value = '0';

  if (!id) {
    document.getElementById('catModalTitle').textContent = 'Add Category';
    openModal('categoryModal');
    return;
  }

  document.getElementById('catModalTitle').textContent = 'Edit Category';
  openModal('categoryModal');

  try {
    const res = await API.get('/categories/' + id);
    const c   = res.data;
    document.getElementById('catId').value       = c.id;
    document.getElementById('catNameEn').value   = c.name_en  || '';
    document.getElementById('catNameFr').value   = c.name_fr  || '';
    document.getElementById('catNameAr').value   = c.name_ar  || '';
    document.getElementById('catSort').value     = c.sort_order ?? 0;
    document.getElementById('catActive').checked = !!c.is_active;
  } catch (err) {
    alert.textContent = err.message;
    alert.className = 'alert alert-error';
    alert.classList.remove('hidden');
  }
}

async function saveCategory(e) {
  e.preventDefault();
  const btn   = e.submitter;
  const alert = document.getElementById('catAlert');
  alert.classList.add('hidden');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  const id   = document.getElementById('catId').value;
  const body = {
    name_en:    document.getElementById('catNameEn').value.trim(),
    name_fr:    document.getElementById('catNameFr').value.trim(),
    name_ar:    document.getElementById('catNameAr').value.trim(),
    sort_order: parseInt(document.getElementById('catSort').value) || 0,
    is_active:  document.getElementById('catActive').checked,
  };

  try {
    if (id) {
      await API.put('/categories/' + id, body);
    } else {
      await API.post('/categories', body);
    }
    closeModal('categoryModal');
    loadCategories();
  } catch (err) {
    alert.textContent = err.message;
    alert.className = 'alert alert-error';
    alert.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Category';
  }
}

async function deleteCategory(id, name) {
  if (!confirm(`Delete category "${name}"? This will fail if dishes are assigned to it.`)) return;
  try {
    await API.delete('/categories/' + id);
    loadCategories();
  } catch (err) {
    showAlert('categoriesAlert', err.message, 'error');
  }
}
