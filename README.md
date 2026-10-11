# Dar Zafran — Premium Moroccan Restaurant Template

A production-ready full-stack restaurant website template with PHP backend, MySQL database, REST API, and admin dashboard. Built for XAMPP (Apache + PHP + MySQL).

---

## Features

**Frontend**
- 6 multilingual pages (EN / FR / AR with RTL support)
- 5-step reservation wizard with live API integration
- Video hero, parallax, smooth scroll (Lenis)
- GSAP ScrollTrigger animations
- Fully responsive, mobile-first

**Backend (PHP + MySQL)**
- REST API (`/api/…`) with JSON responses
- Session-based admin authentication
- Rate limiting (login: 5/15min, public: 20/15min)
- File upload handling (JPEG/PNG/WebP, 5 MB max)
- CSV export for reservations
- Audit logging

**Admin Dashboard**
- Overview with live stats
- Reservations: filter, search, status updates, CSV export
- Menu: dish CRUD with multilingual fields + image upload
- Categories: full CRUD
- Messages: inbox with status tracking
- Media library: drag-and-drop upload
- Restaurant Settings: all public info configurable without touching code
- Account: profile, password change, activity log

---

## Requirements

- PHP 8.0+
- MySQL 5.7+ / MariaDB 10.4+
- Apache with `mod_rewrite` enabled
- XAMPP 8.x recommended

---

## Quick Start

### 1. Place files

Copy the project folder into your XAMPP `htdocs` directory:

```
C:\xampp\htdocs\dar-zafran\
```

### 2. Create database

Open phpMyAdmin (http://localhost/phpmyadmin) and create a new database:

```sql
CREATE DATABASE dar_zafran CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Run schema

Import `api/database/schema.sql` into the new database via phpMyAdmin **Import** tab, or run:

```bash
mysql -u root dar_zafran < api/database/schema.sql
```

### 4. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```ini
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost/dar-zafran

DB_HOST=localhost
DB_PORT=3306
DB_NAME=dar_zafran
DB_USER=root
DB_PASSWORD=

CORS_ORIGIN=http://localhost/dar-zafran
```

### 5. Seed default data

Run from the project root via PHP CLI:

```bash
php api/database/seed.php
```

> **Note:** The seeder cannot be run via browser — all `/api/*` requests are routed through `index.php` and seed.php is never executed that way.

Before running the seeder, set `ADMIN_EMAIL` (and optionally `ADMIN_PASSWORD`) in your `.env`:

```ini
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=ChooseAStrongPassword   # optional — omit to auto-generate
```

This creates:
- Admin account (email and password from `.env`)
- Default restaurant settings
- 7 menu categories
- 9 sample dishes

> **Delete `api/database/seed.php` after first run.**

### 6. Open the site

- **Website:** http://localhost/dar-zafran/
- **Admin:** http://localhost/dar-zafran/admin/

---

## Project Structure

```
dar-zafran/
├── index.html              ← Homepage
├── menu.html               ← Menu page
├── story.html              ← Our Story page
├── gallery.html            ← Gallery page
├── reservation.html        ← Reservation wizard
├── 404.html                ← Error page
│
├── css/                    ← Frontend CSS
├── js/                     ← Frontend JS (core, navigation, i18n, wizard)
├── assets/                 ← Images and videos
│
├── api/                    ← PHP REST API
│   ├── index.php           ← Router / entry point
│   ├── config/             ← App config, database connection
│   ├── controllers/        ← Request handlers
│   ├── models/             ← Database models
│   ├── middleware/         ← Auth, CORS, rate limiting
│   ├── services/           ← File upload service
│   ├── utils/              ← Response, security, pagination helpers
│   ├── uploads/            ← Uploaded images (must be writable)
│   └── database/
│       ├── schema.sql      ← Database schema
│       └── seed.php        ← Default data seeder (delete after first run)
│
├── admin/                  ← Admin dashboard
│   ├── login.html
│   ├── index.html          ← Dashboard overview
│   ├── reservations.html
│   ├── menu.html
│   ├── categories.html
│   ├── messages.html
│   ├── media.html
│   ├── settings.html
│   ├── account.html
│   ├── css/
│   └── js/
│
├── .htaccess               ← Apache routing + security headers
├── .env                    ← Environment config (create from .env.example)
├── .env.example
└── .gitignore
```

---

## Admin Login

The admin email and password are set by you in `.env` before running the seeder (see **Quick Start → step 5**). No default password exists in the source code.

Change the password any time via **Admin → Account → Change Password**.

---

## API Endpoints

All endpoints are under `/api/`. Endpoints marked ✓ require an active admin session.

| Method | Endpoint               | Auth | Description                     |
|--------|------------------------|------|---------------------------------|
| GET    | /health                | —    | Health check                    |
| POST   | /auth/login            | —    | Admin login                     |
| POST   | /auth/logout           | ✓    | Admin logout                    |
| GET    | /auth/me               | ✓    | Current admin profile           |
| PUT    | /auth/profile          | ✓    | Update name/email               |
| POST   | /auth/change-password  | ✓    | Change password                 |
| GET    | /dashboard/stats       | ✓    | Overview counts                 |
| GET    | /dashboard/recent      | ✓    | Recent reservations + messages  |
| POST   | /reservations/public   | —    | Submit reservation (frontend)   |
| GET    | /reservations          | ✓    | List reservations               |
| GET    | /reservations/{id}     | ✓    | Single reservation              |
| PATCH  | /reservations/{id}     | ✓    | Update status/notes             |
| DELETE | /reservations/{id}     | ✓    | Delete reservation              |
| GET    | /reservations/export   | ✓    | CSV export                      |
| GET    | /menu/public           | —    | Public menu by category         |
| GET    | /dishes                | ✓    | List dishes (admin)             |
| GET    | /dishes/{id}           | ✓    | Single dish                     |
| POST   | /dishes                | ✓    | Create dish                     |
| PUT    | /dishes/{id}           | ✓    | Update dish                     |
| DELETE | /dishes/{id}           | ✓    | Delete dish                     |
| GET    | /categories            | ✓    | List categories                 |
| POST   | /categories            | ✓    | Create category                 |
| PUT    | /categories/{id}       | ✓    | Update category                 |
| DELETE | /categories/{id}       | ✓    | Delete category                 |
| GET    | /messages              | ✓    | List messages                   |
| GET    | /messages/{id}         | ✓    | Single message                  |
| PATCH  | /messages/{id}         | ✓    | Update status                   |
| DELETE | /messages/{id}         | ✓    | Delete message                  |
| GET    | /settings              | ✓    | All settings                    |
| GET    | /settings/public       | —    | Public-safe settings            |
| PUT    | /settings              | ✓    | Update settings                 |
| GET    | /media                 | ✓    | List media                      |
| POST   | /media                 | ✓    | Upload image                    |
| DELETE | /media/{id}            | ✓    | Delete media                    |
| GET    | /audit-logs            | ✓    | Admin activity log              |

---

## Customisation

### Restaurant info

All public-facing restaurant details (name, phone, address, social links, opening hours, reservation rules) are managed through **Admin → Settings**. No code changes required.

### Colours and typography

Design tokens are in `css/base.css`. The primary brand colour is `--color-terracotta: #B85C38`.

### Adding menu items

Use **Admin → Menu → Add Dish**. Supports English, French, and Arabic names/descriptions, dietary tags, and a photo upload.

### Email notifications

The API stores data only — it does not send emails out of the box. To add email:

1. Add PHPMailer via Composer, or use PHP's built-in `mail()`
2. Hook into `api/controllers/ReservationController.php` in `createPublic()` after the record is saved
3. Use the `restaurant_name` and `email` settings as sender details

---

## License

Commercial use license. One installation per purchase. Redistribution or resale of the template source is prohibited.
