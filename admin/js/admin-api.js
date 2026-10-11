/**
 * Dar Zafran Admin — API Client
 * Thin fetch wrapper around the PHP REST API.
 */

const API = (() => {
  // Detect API base URL from current page location
  function getBase() {
    const origin = window.location.origin;
    // Walk up from /admin/ to project root, then append /api
    const parts = window.location.pathname.split('/');
    // Remove 'admin' segment and trailing file
    const adminIdx = parts.lastIndexOf('admin');
    const baseParts = parts.slice(0, adminIdx);
    return origin + baseParts.join('/') + '/api';
  }

  const BASE = getBase();

  async function request(method, endpoint, data = null, isFormData = false) {
    const url = BASE + endpoint;
    const options = {
      method,
      credentials: 'include',
      headers: {},
    };

    if (data !== null) {
      if (isFormData) {
        options.body = data; // FormData — let browser set Content-Type
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
      }
    }

    let res;
    try {
      res = await fetch(url, options);
    } catch (networkErr) {
      throw new Error('Network error — check your connection and try again.');
    }

    // CSV / binary downloads
    const contentType = res.headers.get('Content-Type') || '';
    if (contentType.includes('text/csv') || contentType.includes('application/octet-stream')) {
      return res; // caller handles blob download
    }

    let json;
    try {
      json = await res.json();
    } catch {
      throw new Error('Server returned an unexpected response.');
    }

    if (!res.ok) {
      // 401 → redirect to login unless already on login page
      if (res.status === 401 && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
      }
      const err = new Error(json.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.errors = json.errors || null;
      err.json   = json;
      throw err;
    }

    return json;
  }

  return {
    get:    (endpoint)              => request('GET',    endpoint),
    post:   (endpoint, data)        => request('POST',   endpoint, data),
    put:    (endpoint, data)        => request('PUT',    endpoint, data),
    patch:  (endpoint, data)        => request('PATCH',  endpoint, data),
    delete: (endpoint)              => request('DELETE', endpoint),
    upload: (endpoint, formData)    => request('POST',   endpoint, formData, true),
    putForm:(endpoint, formData)    => request('PUT',    endpoint, formData, true),
    BASE,
  };
})();
