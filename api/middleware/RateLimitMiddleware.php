<?php
/**
 * Simple database-backed rate limiter.
 */

class RateLimitMiddleware {

    /**
     * Check rate limit for an endpoint.
     * Sends 429 response if limit exceeded.
     */
    public static function check(string $endpoint, int $maxAttempts, int $windowSeconds = RATE_LIMIT_WINDOW): void {
        try {
            $db  = Database::getInstance()->getConnection();
            $ip  = Security::getIp();
            $now = date('Y-m-d H:i:s');
            $windowStart = date('Y-m-d H:i:s', time() - $windowSeconds);

            // Clean stale records
            $db->prepare("DELETE FROM rate_limits WHERE ip_address = ? AND endpoint = ? AND window_start < ?")
               ->execute([$ip, $endpoint, $windowStart]);

            // Count current attempts
            $stmt = $db->prepare("SELECT id, attempts FROM rate_limits WHERE ip_address = ? AND endpoint = ? AND window_start >= ? LIMIT 1");
            $stmt->execute([$ip, $endpoint, $windowStart]);
            $record = $stmt->fetch();

            if ($record) {
                if ((int)$record['attempts'] >= $maxAttempts) {
                    header('Retry-After: ' . $windowSeconds);
                    Response::json(['success' => false, 'message' => 'Too many requests. Please try again later.'], 429);
                }
                $db->prepare("UPDATE rate_limits SET attempts = attempts + 1 WHERE id = ?")
                   ->execute([$record['id']]);
            } else {
                $db->prepare("INSERT INTO rate_limits (ip_address, endpoint, attempts, window_start) VALUES (?, ?, 1, ?)")
                   ->execute([$ip, $endpoint, $now]);
            }
        } catch (Exception $e) {
            // If rate limit table fails, allow request through (non-fatal)
        }
    }
}
