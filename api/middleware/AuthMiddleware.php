<?php
/**
 * Session-based authentication middleware.
 */

class AuthMiddleware {

    /** Require authentication. Returns admin info array or sends 401. */
    public static function requireAuth(): array {
        self::startSession();

        if (empty($_SESSION['admin_id'])) {
            Response::unauthorized('Authentication required. Please log in.');
        }

        return [
            'id'    => (int) $_SESSION['admin_id'],
            'name'  => $_SESSION['admin_name']  ?? '',
            'role'  => $_SESSION['admin_role']  ?? 'admin',
            'email' => $_SESSION['admin_email'] ?? '',
        ];
    }

    public static function isAuthenticated(): bool {
        self::startSession();
        return !empty($_SESSION['admin_id']);
    }

    public static function setSession(array $user): void {
        self::startSession();
        session_regenerate_id(true);
        $_SESSION['admin_id']    = $user['id'];
        $_SESSION['admin_name']  = $user['name'];
        $_SESSION['admin_role']  = $user['role'];
        $_SESSION['admin_email'] = $user['email'];
        $_SESSION['login_time']  = time();
    }

    public static function clearSession(): void {
        self::startSession();
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(
                session_name(), '', time() - 42000,
                $p['path'], $p['domain'], $p['secure'], $p['httponly']
            );
        }
        session_destroy();
    }

    private static function startSession(): void {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_set_cookie_params([
                'lifetime' => SESSION_LIFETIME,
                'path'     => '/',
                'secure'   => (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            session_name(SESSION_NAME);
            session_start();
        }
    }
}
