<?php

class User {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ? AND is_active = 1 LIMIT 1");
        $stmt->execute([strtolower(trim($email))]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT id, name, email, role, is_active, last_login_at, created_at, updated_at FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function updateLastLogin(int $id): void {
        $this->db->prepare("UPDATE users SET last_login_at = NOW() WHERE id = ?")
                 ->execute([$id]);
    }

    public function updatePassword(int $id, string $hash): bool {
        return $this->db->prepare("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?")
                        ->execute([$hash, $id]);
    }

    public function updateProfile(int $id, string $name, string $email): bool {
        return $this->db->prepare("UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?")
                        ->execute([$name, strtolower(trim($email)), $id]);
    }
}
