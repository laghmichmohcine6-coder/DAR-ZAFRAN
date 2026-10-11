<?php
/**
 * CORS middleware.
 */

class CorsMiddleware {

    public static function handle(): void {
        $origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = defined('CORS_ORIGIN') ? CORS_ORIGIN : '*';

        if ($allowed === '*' || $origin === $allowed) {
            header('Access-Control-Allow-Origin: ' . ($origin ?: $allowed));
        } else {
            header('Access-Control-Allow-Origin: ' . $allowed);
        }

        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Max-Age: 86400');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
