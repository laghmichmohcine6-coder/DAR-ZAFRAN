<?php

class Message {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data): array {
        $stmt = $this->db->prepare("
            INSERT INTO messages (name, email, phone, subject, body, lang, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            Security::clean($data['name']),
            strtolower(trim($data['email'])),
            isset($data['phone'])   ? Security::clean($data['phone'])   : null,
            isset($data['subject']) ? Security::clean($data['subject']) : null,
            Security::clean($data['body']),
            $data['lang'] ?? 'en',
            $data['ip_address'] ?? null,
        ]);
        return $this->findById((int) $this->db->lastInsertId());
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM messages WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function list(array $filters = [], int $page = 1, int $perPage = 20): array {
        $where  = ['1=1'];
        $params = [];
        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }
        $whereStr = implode(' AND ', $where);
        $offset   = ($page - 1) * $perPage;

        $cStmt = $this->db->prepare("SELECT COUNT(*) FROM messages WHERE {$whereStr}");
        $cStmt->execute($params);
        $total = (int) $cStmt->fetchColumn();

        $stmt = $this->db->prepare("SELECT * FROM messages WHERE {$whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([...$params, $perPage, $offset]);

        return ['data' => $stmt->fetchAll(), 'total' => $total];
    }

    public function updateStatus(int $id, string $status): bool {
        return $this->db->prepare("UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ?")
                        ->execute([$status, $id]);
    }

    public function delete(int $id): bool {
        return $this->db->prepare("DELETE FROM messages WHERE id = ?")->execute([$id]);
    }

    public function getUnreadCount(): int {
        return (int) $this->db->query("SELECT COUNT(*) FROM messages WHERE status = 'unread'")->fetchColumn();
    }

    public function getRecentForDashboard(int $limit = 5): array {
        $stmt = $this->db->prepare("
            SELECT id, name, email, subject, status, created_at
            FROM messages
            ORDER BY created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    }
}
