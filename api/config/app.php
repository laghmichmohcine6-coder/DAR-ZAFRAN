<?php
/**
 * Application configuration.
 * Values are read from .env or environment variables with sensible defaults.
 */

define('APP_ENV',   getenv('APP_ENV')   ?: 'production');
define('APP_DEBUG', getenv('APP_DEBUG') === 'true');

// Detect base URL automatically if not set
$detectedUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http')
             . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost')
             . rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/\\');

define('APP_URL',      rtrim(getenv('APP_URL') ?: $detectedUrl, '/'));
define('API_URL',      APP_URL . '/api');

// Filesystem paths
define('ROOT_PATH',    dirname(__DIR__));
define('API_PATH',     __DIR__ . '/..');
define('UPLOAD_PATH',  realpath(__DIR__ . '/..') . '/uploads');
define('UPLOAD_URL',   APP_URL . '/api/uploads');

// Upload limits
define('MAX_UPLOAD_SIZE',       5 * 1024 * 1024); // 5 MB
define('ALLOWED_IMAGE_TYPES',   ['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// Session
define('SESSION_NAME',     'dz_admin');
define('SESSION_LIFETIME', 3600 * 8); // 8 hours

// Rate limiting
define('RATE_LIMIT_LOGIN',   5);   // max login attempts per window
define('RATE_LIMIT_PUBLIC',  20);  // max public form submissions per window
define('RATE_LIMIT_WINDOW',  900); // 15 minutes in seconds

// CORS — override via .env
define('CORS_ORIGIN', getenv('CORS_ORIGIN') ?: APP_URL);
