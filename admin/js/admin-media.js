/**
 * Dar Zafran Admin — Media Library
 */

let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  loadMedia();

  const input    = document.getElementById('uploadInput');
  const dropZone = document.getElementById('dropZone');

  // Button + hidden input
  document.getElementById('uploadBtn')?.addEventListener('click', () => input?.click());
  document.getElementById('dropZoneClick')?.addEventListener('click', () => input?.click());

  input?.addEventListener('change', (e) => {
    if (e.target.files.length) uploadFiles(e.target.files);
  });

  // Drag-and-drop
  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('is-active');
  });
  dropZone?.addEventListener('dragleave', () => {
    dropZone.classList.remove('is-active');
  });
  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('is-active');
    const files = e.dataTransfer.files;
    if (files.length) uploadFiles(files);
  });
});

async function loadMedia() {
  const grid = document.getElementById('mediaGrid');
  grid.innerHTML = '<div class="loading-overlay" style="grid-column:1/-1"><div class="loading-spinner"></div></div>';

  try {
    const res = await API.get('/media?page=' + currentPage);
    renderGrid(res.data);
    renderPagination('mediaPagination', res.pagination, (p) => {
      currentPage = p;
      loadMedia();
    });
  } catch (err) {
    grid.innerHTML = `<div class="alert alert-error" style="grid-column:1/-1;margin:0">${esc(err.message)}</div>`;
  }
}

function renderGrid(items) {
  const grid = document.getElementById('mediaGrid');
  if (!items || !items.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>
      <p class="empty-state-title">No media uploaded yet</p>
      <p class="empty-state-desc">Drag images here or click Upload Images above</p>
    </div>`;
    return;
  }

  grid.innerHTML = items.map(m => `
    <div class="media-item" data-id="${m.id}">
      <div class="media-item-img-wrap">
        <img src="${esc(m.url)}" alt="${esc(m.original_name)}" loading="lazy">
      </div>
      <div class="media-item-info">
        <p class="media-item-name" title="${esc(m.original_name)}">${esc(m.original_name)}</p>
        <p class="media-item-meta">${formatBytes(m.size || 0)}</p>
      </div>
      <div class="media-item-actions">
        <button class="btn btn-ghost btn-icon btn-sm" title="Copy URL" onclick="copyMediaUrl('${esc(m.url)}', this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        </button>
        <button class="btn btn-ghost btn-icon btn-sm" title="Delete" style="color:var(--color-danger)" onclick="deleteMedia(${m.id}, this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

async function uploadFiles(files) {
  const alert = document.getElementById('mediaAlert');
  hideAlert('mediaAlert');

  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;

  let successCount = 0;
  let errors = [];

  for (const file of files) {
    if (!allowed.includes(file.type)) {
      errors.push(`${file.name}: unsupported type`);
      continue;
    }
    if (file.size > maxSize) {
      errors.push(`${file.name}: exceeds 5 MB`);
      continue;
    }

    try {
      const fd = new FormData();
      fd.append('file', file);
      await API.upload('/media', fd);
      successCount++;
    } catch (err) {
      errors.push(`${file.name}: ${err.message}`);
    }
  }

  // Reset file input so same files can be re-uploaded if needed
  document.getElementById('uploadInput').value = '';

  if (errors.length) {
    showAlert('mediaAlert', errors.join(' · '), 'error');
  } else if (successCount > 0) {
    showAlert('mediaAlert', `${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully.`, 'success');
  }

  if (successCount > 0) {
    currentPage = 1;
    loadMedia();
  }
}

function copyMediaUrl(url, btn) {
  navigator.clipboard.writeText(url).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
    setTimeout(() => { btn.innerHTML = orig; }, 1500);
  }).catch(() => {
    prompt('Copy this URL:', url);
  });
}

async function deleteMedia(id, btn) {
  if (!confirm('Delete this image permanently?')) return;
  btn.disabled = true;
  try {
    await API.delete('/media/' + id);
    const item = btn.closest('.media-item');
    item?.remove();
    // If grid is now empty, reload to show empty state
    if (!document.querySelector('.media-item')) loadMedia();
  } catch (err) {
    btn.disabled = false;
    showAlert('mediaAlert', err.message, 'error');
  }
}
