<?php

class Category {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function all(bool $activeOnly = false): array {
        $where = $activeOnly ? 'WHERE is_active = 1' : '';
        return $this->db->query("SELECT * FROM categories {$where} ORDER BY sort_order ASC")->fetchAll();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function withDishCount(): array {
        return $this->db->query("
            SELECT c.*, COUNT(d.id) as dish_count
            FROM categories c
            LEFT JOIN dishes d ON d.category_id = c.id
            GROUP BY c.id
            ORDER BY c.sort_order ASC
        ")->fetchAll();
    }

    public function create(array $data): array {
        $slug = $this->uniqueSlug($this->makeSlug($data['name_en']));
        $stmt = $this->db->prepare("
            INSERT INTO categories (name_en, name_fr, name_ar, slug, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            Security::clean($data['name_en']),
            isset($data['name_fr']) ? Security::clean($data['name_fr']) : null,
            isset($data['name_ar']) ? Security::clean($data['name_ar']) : null,
            $slug,
            (int) ($data['sort_order'] ?? 0),
            isset($data['is_active']) ? (int) $data['is_active'] : 1,
        ]);
        return $this->findById((int) $this->db->lastInsertId());
    }

    public function update(int $id, array $data): bool {
        $fields  = [];
        $params  = [];
        $allowed = ['name_en', 'name_fr', 'name_ar', 'sort_order', 'is_active'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $fields[]  = "{$f} = ?";
                $params[]  = is_string($data[$f]) ? Security::clean($data[$f]) : $data[$f];
            }
        }
        if (empty($fields)) return false;
        $fields[] = 'updated_at = NOW()';
        $params[] = $id;
        return $this->db->prepare("UPDATE categories SET " . implode(', ', $fields) . " WHERE id = ?")
                        ->execute($params);
    }

    public function delete(int $id): bool {
        // Refuse if dishes exist
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM dishes WHERE category_id = ?");
        $stmt->execute([$id]);
        if ((int) $stmt->fetchColumn() > 0) return false;

        return $this->db->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    }

    private function makeSlug(string $name): string {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name));
        return trim($slug, '-');
    }

    private function uniqueSlug(string $base): string {
        $slug = $base;
        $i    = 1;
        while (true) {
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM categories WHERE slug = ?");
            $stmt->execute([$slug]);
            if ((int) $stmt->fetchColumn() === 0) break;
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
}
