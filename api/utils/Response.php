<?php
/**
 * Centralized JSON response helper.
 */

class Response {

    public static function json(mixed $data, int $status = 200): never {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(mixed $data = null, string $message = 'OK', int $status = 200): never {
        self::json(['success' => true, 'message' => $message, 'data' => $data], $status);
    }

    public static function error(string $message, int $status = 400, mixed $errors = null): never {
        $payload = ['success' => false, 'message' => $message];
        if ($errors !== null) $payload['errors'] = $errors;
        self::json($payload, $status);
    }

    public static function created(mixed $data, string $message = 'Created'): never {
        self::success($data, $message, 201);
    }

    public static function notFound(string $message = 'Not found'): never {
        self::error($message, 404);
    }

    public static function unauthorized(string $message = 'Unauthorized'): never {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden'): never {
        self::error($message, 403);
    }

    public static function serverError(string $message = 'Internal server error'): never {
        self::error($message, 500);
    }

    public static function paginated(array $data, int $total, int $page, int $perPage): never {
        self::json([
            'success'    => true,
            'data'       => $data,
            'pagination' => [
                'total'       => $total,
                'page'        => $page,
                'per_page'    => $perPage,
                'total_pages' => (int) ceil($total / max($perPage, 1)),
                'has_more'    => ($page * $perPage) < $total,
            ],
        ]);
    }
}
