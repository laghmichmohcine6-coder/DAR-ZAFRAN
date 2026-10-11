<?php
/**
 * Dar Zafran API — Entry Point & Router
 * All requests to /api/* are routed here via .htaccess
 */

declare(strict_types=1);

// ── 1. Load .env ──────────────────────────────────────────────────────────────
function loadEnv(string $path): void {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
        [$name, $value] = explode('=', $line, 2);
        $name  = trim($name);
        $value = trim(trim($value), "\"'");
        if ($name && !getenv($name)) {
            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
        }
    }
}

loadEnv(__DIR__ . '/../.env');

// ── 2. Load config ───────────────────────────────────────────────────────────
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';

// ── 3. Load utilities ────────────────────────────────────────────────────────
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Security.php';
require_once __DIR__ . '/utils/Pagination.php';

// ── 4. Load middleware ───────────────────────────────────────────────────────
require_once __DIR__ . '/middleware/CorsMiddleware.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';
require_once __DIR__ . '/middleware/RateLimitMiddleware.php';

// ── 5. Load models ───────────────────────────────────────────────────────────
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Reservation.php';
require_once __DIR__ . '/models/Category.php';
require_once __DIR__ . '/models/Dish.php';
require_once __DIR__ . '/models/Message.php';
require_once __DIR__ . '/models/Settings.php';
require_once __DIR__ . '/models/AuditLog.php';
require_once __DIR__ . '/models/Media.php';

// ── 6. Load services ─────────────────────────────────────────────────────────
require_once __DIR__ . '/services/ImageService.php';

// ── 7. Load controllers ──────────────────────────────────────────────────────
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ReservationController.php';
require_once __DIR__ . '/controllers/MenuController.php';
require_once __DIR__ . '/controllers/CategoryController.php';
require_once __DIR__ . '/controllers/MessageController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/DashboardController.php';
require_once __DIR__ . '/controllers/AuditController.php';

// ── 8. Apply CORS ────────────────────────────────────────────────────────────
CorsMiddleware::handle();

// ── 9. Global error handling ─────────────────────────────────────────────────
set_exception_handler(function (Throwable $e) {
    if (APP_DEBUG) {
        Response::serverError($e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    }
    error_log('[DarZafran API] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    Response::serverError('An internal server error occurred.');
});

// ── 10. Parse request ────────────────────────────────────────────────────────
$method     = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';

// Strip query string and decode
$path = parse_url($requestUri, PHP_URL_PATH);
$path = rawurldecode($path);

// Normalize: remove script directory prefix to get just the path after /api
// e.g. /Moroccan%20luxury%20restaurant%20template/api/reservations → /reservations
$scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/\\');
if ($scriptDir && str_starts_with($path, $scriptDir)) {
    $path = substr($path, strlen($scriptDir));
}
$path = '/' . ltrim($path, '/');

// ── 11. Route table ──────────────────────────────────────────────────────────

// Helper to match route with named parameter extraction
function matchRoute(string $pattern, string $path, array &$params): bool {
    $regex = preg_replace('/\{(\w+)\}/', '([^/]+)', $pattern);
    $regex = '@^' . $regex . '$@';
    if (!preg_match($regex, $path, $matches)) return false;
    // Extract param names from pattern
    preg_match_all('/\{(\w+)\}/', $pattern, $names);
    foreach ($names[1] as $i => $name) {
        $params[$name] = $matches[$i + 1];
    }
    return true;
}

$params = [];

// Health check
if ($method === 'GET' && $path === '/health') {
    Response::json(['status' => 'ok', 'timestamp' => date('c'), 'service' => 'Dar Zafran API']);
}

// Auth
if ($method === 'POST' && $path === '/auth/login') {
    (new AuthController())->login();
}
if ($method === 'POST' && $path === '/auth/logout') {
    (new AuthController())->logout();
}
if ($method === 'GET' && $path === '/auth/me') {
    (new AuthController())->me();
}
if ($method === 'POST' && $path === '/auth/change-password') {
    (new AuthController())->changePassword();
}
if (in_array($method, ['PUT', 'PATCH']) && $path === '/auth/profile') {
    (new AuthController())->updateProfile();
}

// Dashboard
if ($method === 'GET' && $path === '/dashboard/stats') {
    (new DashboardController())->stats();
}
if ($method === 'GET' && $path === '/dashboard/recent') {
    (new DashboardController())->recent();
}

// Public reservation submission
if ($method === 'POST' && $path === '/reservations/public') {
    (new ReservationController())->publicCreate();
}

// Reservations (admin)
if ($method === 'GET' && $path === '/reservations/export') {
    (new ReservationController())->export();
}
if ($method === 'GET' && $path === '/reservations') {
    (new ReservationController())->list();
}
if ($method === 'GET' && matchRoute('/reservations/{id}', $path, $params)) {
    (new ReservationController())->get((int)$params['id']);
}
if (in_array($method, ['PUT', 'PATCH']) && matchRoute('/reservations/{id}', $path, $params)) {
    (new ReservationController())->updateStatus((int)$params['id']);
}
if ($method === 'DELETE' && matchRoute('/reservations/{id}', $path, $params)) {
    (new ReservationController())->delete((int)$params['id']);
}

// Categories
if ($method === 'GET' && $path === '/categories') {
    (new CategoryController())->list();
}
if ($method === 'POST' && $path === '/categories') {
    (new CategoryController())->create();
}
if ($method === 'GET' && matchRoute('/categories/{id}', $path, $params)) {
    (new CategoryController())->get((int)$params['id']);
}
if (in_array($method, ['PUT', 'PATCH']) && matchRoute('/categories/{id}', $path, $params)) {
    (new CategoryController())->update((int)$params['id']);
}
if ($method === 'DELETE' && matchRoute('/categories/{id}', $path, $params)) {
    (new CategoryController())->delete((int)$params['id']);
}

// Public menu
if ($method === 'GET' && $path === '/menu/public') {
    (new MenuController())->publicMenu();
}

// Dishes (admin)
if ($method === 'GET' && $path === '/dishes') {
    (new MenuController())->listDishes();
}
if ($method === 'POST' && $path === '/dishes') {
    (new MenuController())->createDish();
}
if ($method === 'GET' && matchRoute('/dishes/{id}', $path, $params)) {
    (new MenuController())->getDish((int)$params['id']);
}
if (in_array($method, ['PUT', 'PATCH']) && matchRoute('/dishes/{id}/availability', $path, $params)) {
    (new MenuController())->toggleAvailability((int)$params['id']);
}
if (in_array($method, ['PUT', 'PATCH']) && matchRoute('/dishes/{id}', $path, $params)) {
    (new MenuController())->updateDish((int)$params['id']);
}
if ($method === 'DELETE' && matchRoute('/dishes/{id}', $path, $params)) {
    (new MenuController())->deleteDish((int)$params['id']);
}

// Messages — public contact form submission
if ($method === 'POST' && $path === '/messages/public') {
    (new MessageController())->publicCreate();
}

// Messages (admin)
if ($method === 'GET' && $path === '/messages') {
    (new MessageController())->list();
}
if ($method === 'GET' && matchRoute('/messages/{id}', $path, $params)) {
    (new MessageController())->get((int)$params['id']);
}
if (in_array($method, ['PUT', 'PATCH']) && matchRoute('/messages/{id}', $path, $params)) {
    (new MessageController())->updateStatus((int)$params['id']);
}
if ($method === 'DELETE' && matchRoute('/messages/{id}', $path, $params)) {
    (new MessageController())->delete((int)$params['id']);
}

// Settings
if ($method === 'GET' && $path === '/settings/public') {
    (new SettingsController())->getPublic();
}
if ($method === 'GET' && $path === '/settings') {
    (new SettingsController())->getAll();
}
if (in_array($method, ['PUT', 'PATCH']) && $path === '/settings') {
    (new SettingsController())->update();
}

// Media
if ($method === 'GET' && $path === '/media') {
    (new MediaController())->list();
}
if ($method === 'POST' && $path === '/media') {
    (new MediaController())->upload();
}
if ($method === 'DELETE' && matchRoute('/media/{id}', $path, $params)) {
    (new MediaController())->delete((int)$params['id']);
}

// Audit logs
if ($method === 'GET' && $path === '/audit-logs') {
    (new AuditController())->list();
}

// ── 12. 404 fallback ─────────────────────────────────────────────────────────
Response::notFound("API endpoint not found: {$method} {$path}");
