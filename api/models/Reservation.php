<?php

class Reservation {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data): array {
        // Generate unique reference
        do {
            $ref = Security::generateReference();
            $check = $this->db->prepare("SELECT id FROM reservations WHERE reference = ?");
            $check->execute([$ref]);
        } while ($check->fetch());

        $stmt = $this->db->prepare("
            INSERT INTO reservations
                (reference, first_name, last_name, email, phone,
                 reservation_date, reservation_time, guests, occasion,
                 special_requests, lang, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $ref,
            Security::clean($data['first_name']),
            Security::clean($data['last_name']),
            strtolower(trim($data['email'])),
            isset($data['phone']) ? Security::clean($data['phone']) : null,
            $data['reservation_date'],
            $data['reservation_time'],
            (int) $data['guests'],
            $data['occasion'] ?? 'none',
            isset($data['special_requests']) ? Security::clean($data['special_requests']) : null,
            $data['lang'] ?? 'en',
            $data['ip_address'] ?? null,
        ]);
        return $this->findById((int) $this->db->lastInsertId());
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM reservations WHERE id = ? LIMIT 1");
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
        if (!empty($filters['date'])) {
            $where[]  = 'reservation_date = ?';
            $params[] = $filters['date'];
        }
        if (!empty($filters['date_from'])) {
            $where[]  = 'reservation_date >= ?';
            $params[] = $filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $where[]  = 'reservation_date <= ?';
            $params[] = $filters['date_to'];
        }
        if (!empty($filters['search'])) {
            $s        = '%' . $filters['search'] . '%';
            $where[]  = '(email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR reference LIKE ?)';
            $params   = array_merge($params, [$s, $s, $s, $s]);
        }

        $whereStr = implode(' AND ', $where);
        $offset   = ($page - 1) * $perPage;

        $cStmt = $this->db->prepare("SELECT COUNT(*) FROM reservations WHERE {$whereStr}");
        $cStmt->execute($params);
        $total = (int) $cStmt->fetchColumn();

        $stmt = $this->db->prepare("
            SELECT * FROM reservations
            WHERE {$whereStr}
            ORDER BY reservation_date DESC, reservation_time DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([...$params, $perPage, $offset]);

        return ['data' => $stmt->fetchAll(), 'total' => $total];
    }

    public function updateStatus(int $id, string $status, ?string $adminNotes = null): bool {
        return $this->db->prepare(
            "UPDATE reservations SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?"
        )->execute([$status, $adminNotes, $id]);
    }

    public function delete(int $id): bool {
        return $this->db->prepare("DELETE FROM reservations WHERE id = ?")->execute([$id]);
    }

    public function getTodayCount(): int {
        return (int) $this->db->query("SELECT COUNT(*) FROM reservations WHERE reservation_date = CURDATE()")->fetchColumn();
    }

    public function getPendingCount(): int {
        return (int) $this->db->query("SELECT COUNT(*) FROM reservations WHERE status = 'pending'")->fetchColumn();
    }

    public function getRecentForDashboard(int $limit = 5): array {
        $stmt = $this->db->prepare("
            SELECT id, reference, first_name, last_name, email,
                   reservation_date, reservation_time, guests, status
            FROM reservations
            ORDER BY created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    }
}
