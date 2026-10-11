<?php
/**
 * Security utilities: input reading, sanitization, validation.
 */

class Security {

    /** Parse JSON body from request (cached). */
    public static function getJsonBody(): array {
        static $body = null;
        if ($body === null) {
            $raw  = file_get_contents('php://input');
            $body = json_decode($raw ?: '{}', true) ?? [];
        }
        return $body;
    }

    /** Get a value from JSON body, POST, or GET. */
    public static function input(string $key, mixed $default = null): mixed {
        $body = self::getJsonBody();
        if (array_key_exists($key, $body))  return $body[$key];
        if (array_key_exists($key, $_POST)) return $_POST[$key];
        if (array_key_exists($key, $_GET))  return $_GET[$key];
        return $default;
    }

    /** Get client IP (REMOTE_ADDR only — no proxy header trust). */
    public static function getIp(): string {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    /** Strip tags and trim a string. */
    public static function clean(string $input): string {
        return trim(strip_tags($input));
    }

    /** Validate email format. */
    public static function isValidEmail(string $email): bool {
        return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /** Validate date in YYYY-MM-DD format. */
    public static function isValidDate(string $date): bool {
        $d = \DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }

    /** Validate time in HH:MM format. */
    public static function isValidTime(string $time): bool {
        return (bool) preg_match('/^\d{2}:\d{2}$/', $time);
    }

    /** Generate a unique reservation reference. Format: DZ-YEAR-XXXXXX */
    public static function generateReference(): string {
        $year   = date('Y');
        $random = strtoupper(bin2hex(random_bytes(3)));
        return "DZ-{$year}-{$random}";
    }

    /** Hash a password using bcrypt. */
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /** Verify a password against a hash. */
    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
}
