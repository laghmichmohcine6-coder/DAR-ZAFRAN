<?php

class Settings {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function all(): array {
        $rows   = $this->db->query("SELECT `key`, `value`, `type`, `group` FROM settings ORDER BY `group`, `key`")->fetchAll();
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = $this->cast($row['value'], $row['type']);
        }
        return $result;
    }

    public function get(string $key, mixed $default = null): mixed {
        $stmt = $this->db->prepare("SELECT `value`, `type` FROM settings WHERE `key` = ? LIMIT 1");
        $stmt->execute([$key]);
        $row = $stmt->fetch();
        return $row ? $this->cast($row['value'], $row['type']) : $default;
    }

    public function set(string $key, mixed $value, string $type = 'string', string $group = 'general'): void {
        $serialized = is_array($value) || is_object($value) ? json_encode($value) : (string) $value;
        $this->db->prepare("
            INSERT INTO settings (`key`, `value`, `type`, `group`)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_at = NOW()
        ")->execute([$key, $serialized, $type, $group]);
    }

    /** Only update keys that already exist in the database. */
    public function bulkUpdate(array $data): void {
        foreach ($data as $key => $value) {
            $stmt = $this->db->prepare("SELECT `type`, `group` FROM settings WHERE `key` = ? LIMIT 1");
            $stmt->execute([$key]);
            $row = $stmt->fetch();
            if ($row) {
                $this->set($key, $value, $row['type'], $row['group']);
            }
        }
    }

    /** Return only public-safe settings. */
    public function getPublic(): array {
        $publicKeys = [
            'restaurant_name', 'tagline', 'phone', 'email', 'address',
            'city', 'country', 'whatsapp_number', 'google_maps_url',
            'instagram_url', 'facebook_url', 'opening_hours',
            'reservation_enabled', 'max_guests', 'min_advance_hours',
            'max_advance_days', 'reservation_times_lunch', 'reservation_times_dinner',
            'currency', 'default_language', 'supported_languages',
        ];
        $ph   = implode(',', array_fill(0, count($publicKeys), '?'));
        $stmt = $this->db->prepare("SELECT `key`, `value`, `type` FROM settings WHERE `key` IN ({$ph})");
        $stmt->execute($publicKeys);
        $result = [];
        foreach ($stmt->fetchAll() as $row) {
            $result[$row['key']] = $this->cast($row['value'], $row['type']);
        }
        return $result;
    }

    private function cast(mixed $value, string $type): mixed {
        return match($type) {
            'integer' => (int)    $value,
            'boolean' => (bool) (int) $value,
            'json'    => json_decode($value, true),
            default   => $value,
        };
    }
}
