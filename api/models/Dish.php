<?php

class Dish {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT d.*, c.name_en as category_name_en, c.name_fr as category_name_fr, c.name_ar as category_name_ar
            FROM dishes d
            LEFT JOIN categories c ON c.id = d.category_id
            WHERE d.id = ? LIMIT 1
        ");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) $row['dietary_tags'] = json_decode($row['dietary_tags'] ?? '[]', true);
        return $row ?: null;
    }

    public function list(array $filters = [], int $page = 1, int $perPage = 20): array {
        $where  = ['1=1'];
        $params = [];

        if (isset($filters['category_id']) && $filters['category_id'] !== '') {
            $where[]  = 'd.category_id = ?';
            $params[] = (int) $filters['category_id'];
        }
        if (isset($filters['is_available']) && $filters['is_available'] !== '') {
            $where[]  = 'd.is_available = ?';
            $params[] = (int) $filters['is_available'];
        }
        if (!empty($filters['search'])) {
            $s        = '%' . $filters['search'] . '%';
            $where[]  = '(d.name_en LIKE ? OR d.name_fr LIKE ? OR d.name_ar LIKE ?)';
            $params   = array_merge($params, [$s, $s, $s]);
        }

        $whereStr = implode(' AND ', $where);
        $offset   = ($page - 1) * $perPage;

        $cStmt = $this->db->prepare("SELECT COUNT(*) FROM dishes d WHERE {$whereStr}");
        $cStmt->execute($params);
        $total = (int) $cStmt->fetchColumn();

        $stmt = $this->db->prepare("
            SELECT d.*, c.name_en as category_name_en
            FROM dishes d
            LEFT JOIN categories c ON c.id = d.category_id
            WHERE {$whereStr}
            ORDER BY d.category_id ASC, d.sort_order ASC, d.id ASC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([...$params, $perPage, $offset]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            $row['dietary_tags'] = json_decode($row['dietary_tags'] ?? '[]', true);
        }

        return ['data' => $rows, 'total' => $total];
    }

    public function create(array $data): array {
        $stmt = $this->db->prepare("
            INSERT INTO dishes
                (category_id, name_en, name_fr, name_ar,
                 description_en, description_fr, description_ar,
                 price, currency, dietary_tags, image_path,
                 is_featured, is_available, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            (int)   $data['category_id'],
            Security::clean($data['name_en']),
            isset($data['name_fr'])        ? Security::clean($data['name_fr'])        : null,
            isset($data['name_ar'])        ? Security::clean($data['name_ar'])        : null,
            isset($data['description_en']) ? Security::clean($data['description_en']) : null,
            isset($data['description_fr']) ? Security::clean($data['description_fr']) : null,
            isset($data['description_ar']) ? Security::clean($data['description_ar']) : null,
            (float) $data['price'],
            $data['currency'] ?? 'MAD',
            json_encode($data['dietary_tags'] ?? []),
            $data['image_path'] ?? null,
            !empty($data['is_featured'])  ? 1 : 0,
            !isset($data['is_available']) || $data['is_available'] ? 1 : 0,
            (int) ($data['sort_order'] ?? 0),
        ]);
        return $this->findById((int) $this->db->lastInsertId());
    }

    public function update(int $id, array $data): bool {
        $fields  = [];
        $params  = [];
        $allowed = ['category_id', 'name_en', 'name_fr', 'name_ar',
                    'description_en', 'description_fr', 'description_ar',
                    'price', 'currency', 'image_path', 'is_featured', 'is_available', 'sort_order'];

        foreach ($allowed as $f) {
            if (!array_key_exists($f, $data)) continue;
            $fields[] = "{$f} = ?";
            $v = $data[$f];
            if (is_string($v) && in_array($f, ['name_en','name_fr','name_ar','description_en','description_fr','description_ar'])) {
                $v = Security::clean($v);
            }
            $params[] = $v;
        }
        if (array_key_exists('dietary_tags', $data)) {
            $fields[] = 'dietary_tags = ?';
            $params[] = json_encode($data['dietary_tags']);
        }
        if (empty($fields)) return false;
        $fields[] = 'updated_at = NOW()';
        $params[] = $id;
        return $this->db->prepare("UPDATE dishes SET " . implode(', ', $fields) . " WHERE id = ?")
                        ->execute($params);
    }

    public function delete(int $id): ?string {
        $dish = $this->findById($id);
        if (!$dish) return null;
        $this->db->prepare("DELETE FROM dishes WHERE id = ?")->execute([$id]);
        return $dish['image_path'];
    }

    public function setAvailability(int $id, bool $available): bool {
        return $this->db->prepare("UPDATE dishes SET is_available = ?, updated_at = NOW() WHERE id = ?")
                        ->execute([$available ? 1 : 0, $id]);
    }

    public function getCount(): int {
        return (int) $this->db->query("SELECT COUNT(*) FROM dishes WHERE is_available = 1")->fetchColumn();
    }

    public function getPublicMenu(): array {
        $rows = $this->db->query("
            SELECT d.id, d.name_en, d.name_fr, d.name_ar,
                   d.description_en, d.description_fr, d.description_ar,
                   d.price, d.currency, d.dietary_tags, d.image_path, d.is_featured,
                   c.id as cat_id, c.name_en as cat_name_en, c.name_fr as cat_name_fr,
                   c.name_ar as cat_name_ar, c.slug as cat_slug
            FROM dishes d
            JOIN categories c ON c.id = d.category_id AND c.is_active = 1
            WHERE d.is_available = 1
            ORDER BY c.sort_order ASC, d.sort_order ASC
        ")->fetchAll();

        $menu = [];
        foreach ($rows as $row) {
            $catId = $row['cat_id'];
            if (!isset($menu[$catId])) {
                $menu[$catId] = [
                    'id'      => $catId,
                    'name_en' => $row['cat_name_en'],
                    'name_fr' => $row['cat_name_fr'],
                    'name_ar' => $row['cat_name_ar'],
                    'slug'    => $row['cat_slug'],
                    'dishes'  => [],
                ];
            }
            $row['dietary_tags'] = json_decode($row['dietary_tags'] ?? '[]', true);
            unset($row['cat_id'], $row['cat_name_en'], $row['cat_name_fr'], $row['cat_name_ar'], $row['cat_slug']);
            $menu[$catId]['dishes'][] = $row;
        }

        return array_values($menu);
    }
}
