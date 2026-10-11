<?php

class MessageController {
    private Message $model;
    private AuditLog $auditLog;

    public function __construct() {
        $this->model    = new Message();
        $this->auditLog = new AuditLog();
    }

    public function publicCreate(): never {
        RateLimitMiddleware::check('public_contact', RATE_LIMIT_PUBLIC);

        $data = Security::getJsonBody();

        $errors = [];
        if (empty($data['name']))                          $errors['name']    = 'Name is required.';
        if (empty($data['email']) || !Security::isValidEmail($data['email'])) $errors['email'] = 'Valid email is required.';
        if (empty($data['body']))                          $errors['body']    = 'Message body is required.';

        if (!empty($errors)) Response::error('Validation failed.', 422, $errors);

        $message = $this->model->create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'phone'      => $data['phone']   ?? null,
            'subject'    => $data['subject'] ?? null,
            'body'       => $data['body'],
            'lang'       => $data['lang']    ?? 'en',
            'ip_address' => Security::getIp(),
        ]);

        Response::created(['id' => $message['id']], 'Message sent successfully.');
    }

    public function list(): never {
        AuthMiddleware::requireAuth();
        ['page' => $page, 'perPage' => $perPage] = Pagination::params();
        $filters = ['status' => $_GET['status'] ?? ''];
        ['data' => $data, 'total' => $total] = $this->model->list($filters, $page, $perPage);
        Response::paginated($data, $total, $page, $perPage);
    }

    public function get(int $id): never {
        AuthMiddleware::requireAuth();
        $message = $this->model->findById($id);
        if (!$message) Response::notFound('Message not found.');
        // Auto-mark as read on first view
        if ($message['status'] === 'unread') {
            $this->model->updateStatus($id, 'read');
            $message['status'] = 'read';
        }
        Response::success($message);
    }

    public function updateStatus(int $id): never {
        $admin   = AuthMiddleware::requireAuth();
        $status  = (string) Security::input('status', '');
        $allowed = ['unread', 'read', 'replied', 'archived'];
        if (!in_array($status, $allowed)) Response::error('Invalid status. Allowed: ' . implode(', ', $allowed));
        if (!$this->model->findById($id)) Response::notFound('Message not found.');
        $this->model->updateStatus($id, $status);
        $this->auditLog->log('message_status_changed', $admin['id'], $admin['name'], 'message', $id, ['to' => $status]);
        Response::success(null, 'Status updated.');
    }

    public function delete(int $id): never {
        $admin = AuthMiddleware::requireAuth();
        if (!$this->model->findById($id)) Response::notFound('Message not found.');
        $this->model->delete($id);
        $this->auditLog->log('message_deleted', $admin['id'], $admin['name'], 'message', $id);
        Response::success(null, 'Message deleted.');
    }
}
