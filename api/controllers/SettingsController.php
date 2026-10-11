<?php

class SettingsController {
    private Settings $model;
    private AuditLog $auditLog;

    public function __construct() {
        $this->model    = new Settings();
        $this->auditLog = new AuditLog();
    }

    public function getPublic(): never {
        Response::success($this->model->getPublic());
    }

    public function getAll(): never {
        AuthMiddleware::requireAuth();
        Response::success($this->model->all());
    }

    public function update(): never {
        $admin = AuthMiddleware::requireAuth();
        $data  = Security::getJsonBody();
        if (empty($data)) Response::error('No settings data provided.');
        $this->model->bulkUpdate($data);
        $this->auditLog->log('settings_updated', $admin['id'], $admin['name'], 'settings', null, ['keys' => array_keys($data)]);
        Response::success($this->model->all(), 'Settings saved successfully.');
    }
}
