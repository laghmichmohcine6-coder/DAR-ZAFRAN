<?php

class AuditController {
    private AuditLog $model;

    public function __construct() {
        $this->model = new AuditLog();
    }

    public function list(): never {
        AuthMiddleware::requireAuth();
        ['page' => $page, 'perPage' => $perPage] = Pagination::params(50);
        ['data' => $data, 'total' => $total] = $this->model->list($page, $perPage);
        Response::paginated($data, $total, $page, $perPage);
    }
}
