/**
 * Dar Zafran Admin — Menu Management
 */

let currentPage    = 1;
let currentFilters = {};
let editingDishId  = null;

document.addEventListener('DOMContentLoaded', () => {
  loadCategories().then(() => loadDishes());

  // Filter bar
  document.getElementById('filterCategory')?.addEventListener('change', () => {
    currentPage = 1; applyFilters();
  });
  document.getElementById('filterAvailable')?.addEventListener('change', () => {
    currentPage = 1; applyFilters();
  });

  let searchTimer;
  document.getElementById('filterSearch')?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { currentPage = 1; applyFilters(); }, 350);
  });

  // Add dish
  document.getElementById('addDishBtn')?.addEventListener('click', () => openDishModal(null));

  // Modal close/cancel
  document.getElementById('dishModalClose')?.addEventListener('click', () => closeModal('dishModal'));
  document.getElementById('dishModalCancel')?.addEventListener('click', () => closeModal('dishModal'));
  document.getElementById('deleteModalClose')?.addEventListener('click', () => closeModal('deleteModal'));
  document.getElementById('deleteCancel')?.addEventListener('click', () => closeModal('deleteModal'));

  // Image preview
  document.getElementById('dishImage')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreviewEl');
    if (file && preview) {
      preview.src = URL.createObjectURL(file);
      preview.classList.remove('hidden');
    }
  });

  // Form submit
  document.getElementById('dishForm')?.addEventListener('submit', saveDish);
});

async function loadCategories() {
  try {
    const res = await API.get('/categories');
    const cats = res.data || [];

    // Populate filter dropdown
    const filterSel = document.getElementById('filterCategory');
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name_en;
      filterSel?.appendChild(opt);
    });

    // Populate form dropdown
    const formSel = document.getElementById('dishCategory');
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name_en;
      formSel?.appendChild(opt);
    });
  } catch { /* non-fatal */ }
}

function applyFilters() {
  currentFilters = {
    category_id: document.getElementById('filterCategory')?.value || '',
    available:   document.getElementById('filterAvailable')?.value || '',
    search:      document.getElementById('filterSearch')?.value    || '',
  };
  loadDishes();
}

async function loadDishes() {
  const tbody = document.getElementById('dishesBody');
  tbody.innerHTML = '<tr><td colspan="7"><div class="loading-overlay"><div class="loading-spinner"></div></div></td></tr>';

  const params = new URLSearchParams({
    page:        currentPage,
    category_id: currentFilters.category_id || '',
    available:   currentFilters.available   || '',
    search:      currentFilters.search      || '',
  });

  try {
    const res = await API.get('/dishes?' + params);
    renderTable(res.data);
    renderPagination('dishesPagination', res.pagination, (p) => {
      currentPage = p;
      loadDishes();
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="alert alert-error" style="margin:16px">${esc(err.message)}</div></td></tr>`;
  }
}

function renderTable(rows) {
  const tbody = document.getElementById('dishesBody');
  if (!rows || !rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg></div>
      <p class="empty-state-title">No dishes found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(d => `
    <tr>
      <td>${d.image_path
        ? `<img src="${esc(d.image_path)}" alt="${esc(d.name_en)}" style="width:48px;height:48px;object-fit:cover;border-radius:4px">`
        : `<div style="width:48px;height:48px;background:var(--color-bg-sidebar);border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--color-text-muted)"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>`
      }</td>
      <td>
        <span class="font-medium">${esc(d.name_en)}</span>
        ${d.name_ar ? `<div class="text-xs text-muted" dir="rtl">${esc(d.name_ar)}</div>` : ''}
      </td>
      <td>${esc(d.category_name_en || '—')}</td>
      <td class="font-medium">${Number(d.price).toFixed(2)} MAD</td>
      <td>${d.is_available
        ? '<span class="badge badge-confirmed">Yes</span>'
        : '<span class="badge badge-cancelled">No</span>'}</td>
      <td>${d.is_featured
        ? '<span class="badge badge-pending">Featured</span>'
        : '—'}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-icon" title="Edit" onclick="openDishModal(${d.id})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn btn-ghost btn-icon" title="Delete" style="color:var(--color-danger)" onclick="confirmDelete(${d.id}, '${esc(d.name_en).replace(/'/g, "\\'")}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function openDishModal(id) {
  editingDishId = id;
  const title = document.getElementById('dishModalTitle');
  const form  = document.getElementById('dishForm');
  const alert = document.getElementById('dishAlert');

  form.reset();
  alert.classList.add('hidden');
  document.getElementById('imagePreviewEl').classList.add('hidden');
  document.getElementById('dishId').value = '';
  document.getElementById('dishAvailable').checked = true;
  document.getElementById('dishFeatured').checked   = false;
  ['tagVeg','tagVegan','tagGf','tagSig'].forEach(id => {
    document.getElementById(id).checked = false;
  });

  if (!id) {
    title.textContent = 'Add Dish';
    openModal('dishModal');
    return;
  }

  title.textContent = 'Edit Dish';
  openModal('dishModal');

  try {
    const res = await API.get('/dishes/' + id);
    const d   = res.data;

    document.getElementById('dishId').value    = d.id;
    document.getElementById('nameEn').value    = d.name_en || '';
    document.getElementById('nameFr').value    = d.name_fr || '';
    document.getElementById('nameAr').value    = d.name_ar || '';
    document.getElementById('descEn').value    = d.description_en || '';
    document.getElementById('descFr').value    = d.description_fr || '';
    document.getElementById('descAr').value    = d.description_ar || '';
    document.getElementById('dishPrice').value    = d.price;
    document.getElementById('dishCategory').value = d.category_id;
    document.getElementById('dishAvailable').checked = !!d.is_available;
    document.getElementById('dishFeatured').checked  = !!d.is_featured;

    const tags = d.dietary_tags || [];
    document.getElementById('tagVeg').checked   = tags.includes('vegetarian');
    document.getElementById('tagVegan').checked = tags.includes('vegan');
    document.getElementById('tagGf').checked    = tags.includes('gluten_free');
    document.getElementById('tagSig').checked   = tags.includes('signature');

    if (d.image_path) {
      const preview = document.getElementById('imagePreviewEl');
      preview.src = d.image_path;
      preview.classList.remove('hidden');
    }
  } catch (err) {
    document.getElementById('dishAlert').textContent = err.message;
    document.getElementById('dishAlert').className = 'alert alert-error';
    document.getElementById('dishAlert').classList.remove('hidden');
  }
}

async function saveDish(e) {
  e.preventDefault();
  const btn   = document.getElementById('dishSaveBtn');
  const alert = document.getElementById('dishAlert');
  alert.classList.add('hidden');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    const tags = [];
    if (document.getElementById('tagVeg').checked)   tags.push('vegetarian');
    if (document.getElementById('tagVegan').checked) tags.push('vegan');
    if (document.getElementById('tagGf').checked)    tags.push('gluten_free');
    if (document.getElementById('tagSig').checked)   tags.push('signature');

    const imageFile = document.getElementById('dishImage').files[0];

    if (imageFile) {
      // Use multipart/form-data when there's an image
      const fd = new FormData();
      fd.append('name_en',          document.getElementById('nameEn').value.trim());
      fd.append('name_fr',          document.getElementById('nameFr').value.trim());
      fd.append('name_ar',          document.getElementById('nameAr').value.trim());
      fd.append('description_en',   document.getElementById('descEn').value.trim());
      fd.append('description_fr',   document.getElementById('descFr').value.trim());
      fd.append('description_ar',   document.getElementById('descAr').value.trim());
      fd.append('price',            document.getElementById('dishPrice').value);
      fd.append('category_id',      document.getElementById('dishCategory').value);
      fd.append('is_available',     document.getElementById('dishAvailable').checked ? '1' : '0');
      fd.append('is_featured',      document.getElementById('dishFeatured').checked  ? '1' : '0');
      fd.append('dietary_tags',     JSON.stringify(tags));
      fd.append('image',            imageFile);

      if (editingDishId) {
        await API.putForm('/dishes/' + editingDishId, fd);
      } else {
        await API.upload('/dishes', fd);
      }
    } else {
      // JSON when no new image
      const body = {
        name_en:        document.getElementById('nameEn').value.trim(),
        name_fr:        document.getElementById('nameFr').value.trim(),
        name_ar:        document.getElementById('nameAr').value.trim(),
        description_en: document.getElementById('descEn').value.trim(),
        description_fr: document.getElementById('descFr').value.trim(),
        description_ar: document.getElementById('descAr').value.trim(),
        price:          parseFloat(document.getElementById('dishPrice').value),
        category_id:    parseInt(document.getElementById('dishCategory').value),
        is_available:   document.getElementById('dishAvailable').checked,
        is_featured:    document.getElementById('dishFeatured').checked,
        dietary_tags:   tags,
      };

      if (editingDishId) {
        await API.put('/dishes/' + editingDishId, body);
      } else {
        await API.post('/dishes', body);
      }
    }

    closeModal('dishModal');
    loadDishes();
  } catch (err) {
    alert.textContent = err.message;
    alert.className = 'alert alert-error';
    alert.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Dish';
  }
}

let deletingDishId = null;

function confirmDelete(id, name) {
  deletingDishId = id;
  document.getElementById('deleteDishName').textContent = name;
  openModal('deleteModal');

  document.getElementById('deleteConfirm').onclick = async () => {
    try {
      await API.delete('/dishes/' + deletingDishId);
      closeModal('deleteModal');
      loadDishes();
    } catch (err) {
      alert(err.message);
    }
  };
}
