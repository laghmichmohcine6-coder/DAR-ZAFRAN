<?php

class AuditLog {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function log(
        string  $action,
        ?int    $userId     = null,
        ?string $userName   = null,
        ?string $entityType = null,
        ?int    $entityId   = null,
        array   $details    = []
    ): void {
        try {
            $this->db->prepare("
                INSERT INTO audit_logs (user_id, user_name, action, entity_type, entity_id, details, ip_address)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ")->execute([
                $userId,
                $userName,
                $action,
                $entityType,
                $entityId,
                empty($details) ? null : json_encode($details),
                Security::getIp(),
            ]);
        } catch (Exception $e) {
            // Audit log failures are non-fatal
        }
    }

    public function list(int $page = 1, int $perPage = 50): array {
        $offset = ($page - 1) * $perPage;
        $total  = (int) $this->db->query("SELECT COUNT(*) FROM audit_logs")->fetchColumn();
        $stmt   = $this->db->prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([$perPage, $offset]);
        return ['data' => $stmt->fetchAll(), 'total' => $total];
    }
}
