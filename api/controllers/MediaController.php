<?php

class MediaController {
    private Media $model;
    private AuditLog $auditLog;

    public function __construct() {
        $this->model    = new Media();
        $this->auditLog = new AuditLog();
    }

    public function list(): never {
        AuthMiddleware::requireAuth();
        ['page' => $page, 'perPage' => $perPage] = Pagination::params(40);
        ['data' => $data, 'total' => $total] = $this->model->list($page, $perPage);
        Response::paginated($data, $total, $page, $perPage);
    }

    public function upload(): never {
        $admin = AuthMiddleware::requireAuth();
        if (empty($_FILES['file'])) Response::error('No file provided.');
        try {
            $uploaded = ImageService::upload($_FILES['file']);
            $media    = $this->model->create([...$uploaded, 'uploaded_by' => $admin['id']]);
            $this->auditLog->log('media_uploaded', $admin['id'], $admin['name'], 'media', $media['id'], ['filename' => $media['filename']]);
            Response::created($media, 'File uploaded successfully.');
        } catch (RuntimeException $e) {
            Response::error($e->getMessage());
        }
    }

    public function delete(int $id): never {
        $admin = AuthMiddleware::requireAuth();
        $path  = $this->model->delete($id);
        if ($path === null) Response::notFound('Media file not found.');
        ImageService::delete($path);
        $this->auditLog->log('media_deleted', $admin['id'], $admin['name'], 'media', $id);
        Response::success(null, 'Media deleted.');
    }
}
