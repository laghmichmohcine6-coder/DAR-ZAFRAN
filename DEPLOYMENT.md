# Deployment Guide — Dar Zafran

Step-by-step instructions for deploying to a live server (shared hosting or VPS).

---

## Shared Hosting (cPanel / Plesk)

Most shared hosts run Apache + PHP + MySQL, which is exactly what this template requires.

### 1. Upload files

Upload all files to your `public_html` directory (or a subdirectory like `public_html/restaurant`).

You can use FTP (FileZilla) or the cPanel File Manager.

**Do not upload:**
- `.env` — see step 3 below
- `api/database/seed.php` — only needed for first-run setup

### 2. Create the database

In cPanel → MySQL Databases:
1. Create a new database (e.g. `mysite_darzafran`)
2. Create a database user with a strong password
3. Grant the user ALL PRIVILEGES on that database
4. Import `api/database/schema.sql` via phpMyAdmin

### 3. Create `.env`

Create `.env` in the project root (same location as `.env.example`):

```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_HOST=localhost
DB_PORT=3306
DB_NAME=mysite_darzafran
DB_USER=mysite_dbuser
DB_PASSWORD=YourStrongPassword

CORS_ORIGIN=https://yourdomain.com

# First-run admin account (used only by seed.php — see step 4)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=ChooseAStrongPassword
```

> Never commit `.env` to version control — it contains credentials.

### 4. Run the seeder

The seeder creates the admin account only on its **first run**. If any admin or super_admin account already exists in the database, the admin creation block is skipped automatically — the seeder cannot overwrite or reset an existing account.

**`ADMIN_EMAIL`** (required) — the seeder exits with an error if it is missing or not a valid email address.

**`ADMIN_PASSWORD`** (optional):
- If set (8+ characters), that password is used.
- If left empty or shorter than 8 characters, a 16-character cryptographically random password is **generated at runtime and printed once** to the terminal. Save it immediately — it will not be shown again.

Run via PHP CLI (SSH into your server):

```bash
cd /path/to/your/project
php api/database/seed.php
```

> **Note:** The seeder cannot be run via browser URL — the `.htaccess` routing sends all `/api/*` requests through `index.php`, so `seed.php` is never executed that way. You must use the CLI.

**Delete `api/database/seed.php` immediately after first run.**

### 5. Set file permissions

The uploads directory must be writable by the web server:

```bash
chmod 755 api/uploads/
chmod 755 api/uploads/dishes/
chmod 755 api/uploads/media/
```

In cPanel File Manager, right-click the `uploads` folder → Change Permissions → `755`.

### 6. Verify `.htaccess`

The included `.htaccess` handles URL routing. If the site returns 404 on API requests, check that `mod_rewrite` is enabled on your host (it is on virtually all cPanel hosts).

If the project is in a subdirectory (e.g. `public_html/restaurant/`), the `.htaccess` routing is relative and will work automatically.

---

## VPS / Dedicated Server (Ubuntu + Apache)

### Prerequisites

```bash
sudo apt update
sudo apt install apache2 php8.2 php8.2-mysql php8.2-gd php8.2-mbstring mysql-server
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### Apache virtual host

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/dar-zafran

    <Directory /var/www/dar-zafran>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Enable and restart:

```bash
sudo a2ensite dar-zafran.conf
sudo systemctl reload apache2
```

### HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d yourdomain.com
```

### File permissions

```bash
sudo chown -R www-data:www-data /var/www/dar-zafran
sudo chmod -R 755 /var/www/dar-zafran
sudo chmod -R 755 /var/www/dar-zafran/api/uploads
```

---

## Subdirectory Deployment

If the template is not at the domain root (e.g. `https://example.com/restaurant/`):

1. Set `APP_URL` in `.env` to the full path: `https://example.com/restaurant`
2. Set `CORS_ORIGIN` to match: `https://example.com/restaurant`
3. The URL routing in `.htaccess` and `api/index.php` auto-detects the path — no changes needed.

---

## Post-Deployment Checklist

- [ ] `.env` created with production values
- [ ] `APP_DEBUG=false` in production
- [ ] Database imported from `schema.sql`
- [ ] Seeder run once, admin account created, `seed.php` deleted
- [ ] Admin password changed after first login (or was set via `ADMIN_PASSWORD` in `.env`)
- [ ] `api/uploads/` directories are writable
- [ ] HTTPS configured (strongly recommended)
- [ ] Test reservation form end-to-end
- [ ] Test admin login and all CRUD operations
- [ ] Verify CSV export works
- [ ] Update restaurant settings via Admin → Settings

---

## Environment Variables Reference

| Variable         | Example                        | Description                                      |
|-----------------|--------------------------------|--------------------------------------------------|
| APP_ENV         | `production`                   | `development` or `production`                    |
| APP_DEBUG       | `false`                        | Show error details (false in prod)               |
| APP_URL         | `https://yourdomain.com`       | Full URL with no trailing slash                  |
| DB_HOST         | `localhost`                    | MySQL host                                       |
| DB_PORT         | `3306`                         | MySQL port                                       |
| DB_NAME         | `dar_zafran`                   | Database name                                    |
| DB_USER         | `db_user`                      | Database username                                |
| DB_PASSWORD     | `strong_password`              | Database password                                |
| CORS_ORIGIN     | `https://yourdomain.com`       | Allowed origin for API requests                  |
| ADMIN_EMAIL     | `admin@yourdomain.com`         | Seeder only — admin account email (first run)    |
| ADMIN_PASSWORD  | *(set locally, never commit)*  | Seeder only — admin password; auto-generated if blank |

---

## Troubleshooting

**API returns 404**
- Check `mod_rewrite` is enabled
- Check `.htaccess` is present in the project root
- Ensure `AllowOverride All` is set in your Apache config

**API returns 500**
- Set `APP_DEBUG=true` temporarily to see the error
- Check PHP error logs: `/var/log/apache2/error.log` or cPanel → Error Logs
- Common cause: missing `.env` file or wrong database credentials

**Uploads not saving**
- Check `api/uploads/` and subdirectories have `755` permissions
- On Linux: `chown www-data:www-data api/uploads/ -R`

**CORS errors in browser**
- Ensure `CORS_ORIGIN` in `.env` exactly matches the site URL (no trailing slash)
- If using HTTPS, make sure CORS_ORIGIN starts with `https://`

**Session not persisting (login immediately redirects)**
- PHP session save path must be writable
- On shared hosting this is usually fine; on VPS: `sudo chmod 1777 /var/lib/php/sessions`
