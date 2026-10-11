# Security Guide — Dar Zafran

Security measures built into the template and recommended practices for production deployment.

---

## Built-in Security Measures

### Authentication

- Session-based authentication using PHP sessions
- `session_regenerate_id(true)` on login to prevent session fixation
- Session cookie flags: `HttpOnly`, `SameSite=Lax`, `Secure` (when HTTPS)
- All admin API endpoints check for an active session before executing

### Rate Limiting

Database-backed rate limiting protects against brute-force attacks:

| Endpoint type | Limit    | Window  |
|--------------|----------|---------|
| Login        | 5 tries  | 15 min  |
| Public API   | 20 calls | 15 min  |

Exceeded limits return `429 Too Many Requests` with a `Retry-After` header.

### Input Validation

- All JSON bodies parsed through `Security::getJsonBody()`
- SQL queries use PDO prepared statements — no string interpolation
- File uploads validated by MIME type (via `finfo`) and extension, not just Content-Type
- Upload filenames replaced with random UUIDs — no user-supplied filenames stored

### Output Encoding

- All admin HTML renders use `esc()` (HTML entity encoding) before insertion
- Frontend wizard uses `escapeHTML()` on all user-supplied values
- API responses are JSON-encoded by `json_encode()` (safe by default)

### File Upload Protection

- Only JPEG, PNG, WebP, and GIF accepted (checked by actual file content via `finfo`, not extension)
- 5 MB maximum file size
- Uploads stored in `api/uploads/`; PHP execution in that directory is blocked by a `RewriteRule` in the root `.htaccess` (the rule runs before the API catch-all)
- Original filenames never used — stored as `{uuid}.{ext}`

### HTTP Security Headers

Set by `.htaccess` on all responses:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Sensitive File Protection

`.htaccess` denies direct access to:
- `.env` — environment credentials
- `*.sql` — database dumps
- `*.log`, `*.sh`, `*.bak` — server files
- All files in `api/uploads/` with PHP extensions

### CORS

API requests are restricted to the origin configured in `CORS_ORIGIN` (`.env`). Preflight OPTIONS requests are handled automatically.

---

## Production Hardening Checklist

### Before going live

- [ ] Set `APP_DEBUG=false` — never expose stack traces in production
- [ ] Set `APP_ENV=production`
- [ ] Use a strong, unique `DB_PASSWORD` (16+ chars, mixed case, symbols)
- [ ] Set `ADMIN_EMAIL` and optionally `ADMIN_PASSWORD` in `.env` before running the seeder — never commit `.env`
- [ ] Run the seeder exactly once to create the admin account, then delete `api/database/seed.php`
- [ ] Change the admin password after first login via **Admin → Account → Change Password**
- [ ] Ensure `.env` is not accessible via browser (`.htaccess` blocks it, but verify)

> **Seeder protection:** `seed.php` checks whether any admin account already exists before creating one. If an admin is found, the creation block is skipped entirely. This prevents the seeder from being used to add unauthorized accounts or to reset credentials after initial setup.

### HTTPS

- Always use HTTPS in production — session cookies are marked `Secure` when the connection is HTTPS
- Get a free certificate from Let's Encrypt (see `DEPLOYMENT.md`)
- After enabling HTTPS, update `APP_URL` and `CORS_ORIGIN` to use `https://`

### PHP Configuration

Recommended `php.ini` settings for production:

```ini
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log
expose_php = Off
session.cookie_secure = 1
session.cookie_httponly = 1
session.cookie_samesite = Lax
session.use_strict_mode = 1
```

### MySQL

- Use a dedicated database user with only the permissions it needs (`SELECT`, `INSERT`, `UPDATE`, `DELETE` on the app database — no `GRANT`, no `DROP DATABASE`)
- Never use `root` for the application database connection

### File Permissions (Linux)

```bash
# Project files — readable by web server, not writable
find /var/www/dar-zafran -type f -exec chmod 644 {} \;
find /var/www/dar-zafran -type d -exec chmod 755 {} \;

# Uploads — writable by web server
chmod -R 755 /var/www/dar-zafran/api/uploads
chown -R www-data:www-data /var/www/dar-zafran/api/uploads

# .env — readable only by owner
chmod 640 /var/www/dar-zafran/.env
```

---

## Known Limitations

**No CSRF protection on state-changing API calls**

The admin API uses session auth without a CSRF token. This is acceptable because:
- The API is AJAX-only (no HTML form POST)
- `SameSite=Lax` cookies provide browser-level CSRF protection for the majority of cases
- CORS is restricted to the configured origin

If you require CSRF tokens (e.g. for a stricter security posture), add a CSRF middleware that validates a token stored in the session against a token sent in request headers.

**No brute-force lockout beyond rate limiting**

The rate limiter uses a 15-minute sliding window, not an account lockout. For higher-security deployments, consider adding a progressive delay or account lockout after N failed attempts.

**Single admin role**

All admin users have full access. There is no role-based access control (RBAC). If multiple staff need different access levels, this would require adding a role/permission system.

---

## Reporting Issues

This is a commercial template. For security concerns related to the template code, contact the developer directly through the marketplace where you purchased it.
