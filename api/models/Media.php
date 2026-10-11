<?php

class Media {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data): array {
        $stmt = $this->db->prepare("
            INSERT INTO media (filename, original_name, mime_type, size, path, url, alt_text, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['filename'],
            $data['original_name'],
            $data['mime_type'],
            (int) $data['size'],
            $data['path'],
            $data['url'],
            $data['alt_text'] ?? null,
            $data['uploaded_by'] ?? null,
        ]);
        return $this->findById((int) $this->db->lastInsertId());
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM media WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function list(int $page = 1, int $perPage = 40): array {
        $offset = ($page - 1) * $perPage;
        $total  = (int) $this->db->query("SELECT COUNT(*) FROM media")->fetchColumn();
        $stmt   = $this->db->prepare("SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([$perPage, $offset]);
        return ['data' => $stmt->fetchAll(), 'total' => $total];
    }

    public function delete(int $id): ?string {
        $media = $this->findById($id);
        if (!$media) return null;
        $this->db->prepare("DELETE FROM media WHERE id = ?")->execute([$id]);
        return $media['path'];
    }
}
