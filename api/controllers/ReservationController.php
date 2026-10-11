<?php

class ReservationController {
    private Reservation $model;
    private AuditLog $auditLog;

    public function __construct() {
        $this->model    = new Reservation();
        $this->auditLog = new AuditLog();
    }

    // ---- PUBLIC endpoint (no auth) ----

    public function publicCreate(): never {
        RateLimitMiddleware::check('reservation_public', RATE_LIMIT_PUBLIC);

        $data   = Security::getJsonBody();
        $errors = [];

        $required = ['first_name', 'last_name', 'email', 'reservation_date', 'reservation_time', 'guests'];
        foreach ($required as $field) {
            if (empty(trim((string) ($data[$field] ?? '')))) {
                $errors[$field] = "'{$field}' is required.";
            }
        }

        if (!empty($data['email']) && !Security::isValidEmail($data['email'])) {
            $errors['email'] = 'Invalid email address.';
        }
        if (!empty($data['reservation_date'])) {
            if (!Security::isValidDate($data['reservation_date'])) {
                $errors['reservation_date'] = 'Invalid date format (expected YYYY-MM-DD).';
            } elseif ($data['reservation_date'] < date('Y-m-d')) {
                $errors['reservation_date'] = 'Reservation date cannot be in the past.';
            }
        }
        if (!empty($data['reservation_time']) && !Security::isValidTime($data['reservation_time'])) {
            $errors['reservation_time'] = 'Invalid time format (expected HH:MM).';
        }
        if (isset($data['guests'])) {
            $g = (int) $data['guests'];
            if ($g < 1 || $g > 20) {
                $errors['guests'] = 'Number of guests must be between 1 and 20.';
            }
        }

        if (!empty($errors)) {
            Response::error('Validation failed. Please check the submitted fields.', 422, $errors);
        }

        $data['ip_address'] = Security::getIp();
        $reservation        = $this->model->create($data);

        Response::created([
            'reference' => $reservation['reference'],
            'status'    => $reservation['status'],
        ], 'Your reservation has been submitted. We will confirm it shortly.');
    }

    // ---- ADMIN endpoints (auth required) ----

    public function list(): never {
        AuthMiddleware::requireAuth();
        ['page' => $page, 'perPage' => $perPage] = Pagination::params();

        $filters = [
            'status'    => $_GET['status']    ?? '',
            'date'      => $_GET['date']      ?? '',
            'date_from' => $_GET['date_from'] ?? '',
            'date_to'   => $_GET['date_to']   ?? '',
            'search'    => $_GET['search']    ?? '',
        ];

        ['data' => $data, 'total' => $total] = $this->model->list($filters, $page, $perPage);
        Response::paginated($data, $total, $page, $perPage);
    }

    public function get(int $id): never {
        AuthMiddleware::requireAuth();
        $reservation = $this->model->findById($id);
        if (!$reservation) Response::notFound('Reservation not found.');
        Response::success($reservation);
    }

    public function updateStatus(int $id): never {
        $admin  = AuthMiddleware::requireAuth();
        $status = (string) Security::input('status', '');
        $notes  = Security::input('admin_notes', null);

        $allowed = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'];
        if (!in_array($status, $allowed)) {
            Response::error('Invalid status. Allowed: ' . implode(', ', $allowed));
        }

        $reservation = $this->model->findById($id);
        if (!$reservation) Response::notFound('Reservation not found.');

        $this->model->updateStatus($id, $status, $notes);
        $this->auditLog->log('reservation_status_changed', $admin['id'], $admin['name'], 'reservation', $id, [
            'from' => $reservation['status'],
            'to'   => $status,
        ]);

        Response::success(null, 'Status updated successfully.');
    }

    public function delete(int $id): never {
        $admin = AuthMiddleware::requireAuth();
        if (!$this->model->findById($id)) Response::notFound('Reservation not found.');
        $this->model->delete($id);
        $this->auditLog->log('reservation_deleted', $admin['id'], $admin['name'], 'reservation', $id);
        Response::success(null, 'Reservation deleted.');
    }

    public function export(): never {
        AuthMiddleware::requireAuth();

        $filters = [
            'status'    => $_GET['status']    ?? '',
            'date_from' => $_GET['date_from'] ?? '',
            'date_to'   => $_GET['date_to']   ?? '',
        ];

        ['data' => $rows] = $this->model->list($filters, 1, 5000);

        $filename = 'reservations-' . date('Y-m-d') . '.csv';
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: no-cache, no-store, must-revalidate');

        $out = fopen('php://output', 'w');
        // UTF-8 BOM for Excel
        fputs($out, "\xEF\xBB\xBF");
        fputcsv($out, ['Reference', 'First Name', 'Last Name', 'Email', 'Phone', 'Date', 'Time', 'Guests', 'Occasion', 'Special Requests', 'Status', 'Created At']);

        foreach ($rows as $r) {
            fputcsv($out, [
                $r['reference'],    $r['first_name'],       $r['last_name'],
                $r['email'],        $r['phone'],            $r['reservation_date'],
                $r['reservation_time'], $r['guests'],       $r['occasion'],
                $r['special_requests'], $r['status'],       $r['created_at'],
            ]);
        }
        fclose($out);
        exit;
    }
}
