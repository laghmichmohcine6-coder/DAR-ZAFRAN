/**
 * Dar Zafran Admin — Restaurant Settings
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();

  document.getElementById('settingsForm')?.addEventListener('submit', saveSettings);
});

async function loadSettings() {
  try {
    const res  = await API.get('/settings');
    const data = res.data; // object keyed by setting key

    // General
    setVal('sRestaurantName', data.restaurant_name);
    setVal('sTagline',        data.tagline);
    setVal('sCurrency',       data.currency);
    setVal('sTimezone',       data.timezone);

    // Contact
    setVal('sPhone',      data.phone);
    setVal('sEmail',      data.email);
    setVal('sAddress',    data.address);
    setVal('sCity',       data.city);
    setVal('sWhatsapp',   data.whatsapp_number);
    setVal('sGoogleMaps', data.google_maps_url);

    // Social
    setVal('sInstagram', data.instagram_url);
    setVal('sFacebook',  data.facebook_url);

    // Reservations
    setVal('sMaxGuests',  data.max_guests);
    setVal('sMinAdvance', data.min_advance_hours);
    setVal('sMaxDays',    data.max_advance_days);
    setChecked('sReservationEnabled', data.reservation_enabled);

  } catch (err) {
    showAlert('settingsAlert', 'Failed to load settings: ' + err.message, 'error');
  }
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.value = value;
}

function setChecked(id, value) {
  const el = document.getElementById(id);
  if (el) el.checked = value === true || value === 1 || value === '1' || value === 'true';
}

async function saveSettings(e) {
  e.preventDefault();
  const btn = document.getElementById('saveSettingsBtn');
  const status = document.getElementById('settingsSaveStatus');
  hideAlert('settingsAlert');
  btn.disabled = true;
  btn.textContent = 'Saving…';
  if (status) status.textContent = '';

  const payload = {
    restaurant_name:    document.getElementById('sRestaurantName')?.value.trim() || '',
    tagline:            document.getElementById('sTagline')?.value.trim()        || '',
    currency:           document.getElementById('sCurrency')?.value.trim()       || '',
    timezone:           document.getElementById('sTimezone')?.value.trim()       || '',
    phone:              document.getElementById('sPhone')?.value.trim()          || '',
    email:              document.getElementById('sEmail')?.value.trim()          || '',
    address:            document.getElementById('sAddress')?.value.trim()        || '',
    city:               document.getElementById('sCity')?.value.trim()           || '',
    whatsapp_number:    document.getElementById('sWhatsapp')?.value.trim()       || '',
    google_maps_url:    document.getElementById('sGoogleMaps')?.value.trim()     || '',
    instagram_url:      document.getElementById('sInstagram')?.value.trim()      || '',
    facebook_url:       document.getElementById('sFacebook')?.value.trim()       || '',
    max_guests:         document.getElementById('sMaxGuests')?.value             || '',
    min_advance_hours:  document.getElementById('sMinAdvance')?.value            || '',
    max_advance_days:   document.getElementById('sMaxDays')?.value               || '',
    reservation_enabled: document.getElementById('sReservationEnabled')?.checked ? '1' : '0',
  };

  try {
    await API.put('/settings', payload);
    if (status) {
      status.textContent = 'Saved successfully.';
      setTimeout(() => { status.textContent = ''; }, 3000);
    }
  } catch (err) {
    showAlert('settingsAlert', err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save All Settings';
  }
}
