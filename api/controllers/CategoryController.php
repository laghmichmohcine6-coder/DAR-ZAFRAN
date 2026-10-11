<?php

class CategoryController {
    private Category $model;
    private AuditLog $auditLog;

    public function __construct() {
        $this->model    = new Category();
        $this->auditLog = new AuditLog();
    }

    public function list(): never {
        AuthMiddleware::requireAuth();
        Response::success($this->model->withDishCount());
    }

    public function get(int $id): never {
        AuthMiddleware::requireAuth();
        $category = $this->model->findById($id);
        if (!$category) Response::notFound('Category not found.');
        Response::success($category);
    }

    public function create(): never {
        $admin = AuthMiddleware::requireAuth();
        $data  = Security::getJsonBody();
        if (empty($data['name_en'])) Response::error('English name is required.');
        $category = $this->model->create($data);
        $this->auditLog->log('category_created', $admin['id'], $admin['name'], 'category', $category['id'], ['name' => $category['name_en']]);
        Response::created($category, 'Category created.');
    }

    public function update(int $id): never {
        $admin = AuthMiddleware::requireAuth();
        if (!$this->model->findById($id)) Response::notFound('Category not found.');
        $data = Security::getJsonBody();
        $this->model->update($id, $data);
        $this->auditLog->log('category_updated', $admin['id'], $admin['name'], 'category', $id);
        Response::success($this->model->findById($id), 'Category updated.');
    }

    public function delete(int $id): never {
        $admin   = AuthMiddleware::requireAuth();
        $category = $this->model->findById($id);
        if (!$category) Response::notFound('Category not found.');
        $deleted = $this->model->delete($id);
        if (!$deleted) Response::error('Cannot delete category: it has dishes associated. Move or delete dishes first.', 409);
        $this->auditLog->log('category_deleted', $admin['id'], $admin['name'], 'category', $id, ['name' => $category['name_en']]);
        Response::success(null, 'Category deleted.');
    }
}
