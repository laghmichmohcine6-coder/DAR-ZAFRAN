<?php
/**
 * Pagination helper.
 */

class Pagination {

    public static function params(int $defaultPerPage = 20, int $maxPerPage = 100): array {
        $page    = max(1, (int) ($_GET['page']     ?? 1));
        $perPage = min($maxPerPage, max(1, (int) ($_GET['per_page'] ?? $defaultPerPage)));
        $offset  = ($page - 1) * $perPage;
        return compact('page', 'perPage', 'offset');
    }
}
