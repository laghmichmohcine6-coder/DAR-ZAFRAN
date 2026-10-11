<?php

class AuthController {
    private User $userModel;
    private AuditLog $auditLog;

    public function __construct() {
        $this->userModel = new User();
        $this->auditLog  = new AuditLog();
    }

    public function login(): never {
        RateLimitMiddleware::check('login', RATE_LIMIT_LOGIN);

        $email    = trim((string) Security::input('email', ''));
        $password = (string) Security::input('password', '');

        if (!$email || !$password) {
            Response::error('Email and password are required.');
        }

        $user = $this->userModel->findByEmail($email);

        if (!$user || !Security::verifyPassword($password, $user['password_hash'])) {
            $this->auditLog->log('login_failed', null, $email, 'auth', null, ['email' => $email]);
            Response::error('Invalid email or password.', 401);
        }

        if (!$user['is_active']) {
            Response::error('This account is disabled. Contact the administrator.', 403);
        }

        AuthMiddleware::setSession($user);
        $this->userModel->updateLastLogin($user['id']);
        $this->auditLog->log('login', $user['id'], $user['name'], 'user', $user['id']);

        Response::success([
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ], 'Logged in successfully.');
    }

    public function logout(): never {
        if (AuthMiddleware::isAuthenticated()) {
            $this->auditLog->log('logout', $_SESSION['admin_id'], $_SESSION['admin_name'], 'user', $_SESSION['admin_id']);
        }
        AuthMiddleware::clearSession();
        Response::success(null, 'Logged out successfully.');
    }

    public function me(): never {
        $admin = AuthMiddleware::requireAuth();
        $user  = $this->userModel->findById($admin['id']);
        if (!$user) Response::unauthorized();
        Response::success($user);
    }

    public function changePassword(): never {
        $admin  = AuthMiddleware::requireAuth();
        $current = (string) Security::input('current_password', '');
        $new     = (string) Security::input('new_password', '');

        if (!$current || !$new) {
            Response::error('Current and new passwords are required.');
        }
        if (strlen($new) < 8) {
            Response::error('New password must be at least 8 characters.');
        }

        // Fetch full user to get password hash
        $stmt = Database::getInstance()->getConnection()->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$admin['id']]);
        $row = $stmt->fetch();

        if (!$row || !Security::verifyPassword($current, $row['password_hash'])) {
            Response::error('Current password is incorrect.', 401);
        }

        $this->userModel->updatePassword($admin['id'], Security::hashPassword($new));
        $this->auditLog->log('password_changed', $admin['id'], $admin['name'], 'user', $admin['id']);
        Response::success(null, 'Password changed successfully.');
    }

    public function updateProfile(): never {
        $admin = AuthMiddleware::requireAuth();
        $name  = trim((string) Security::input('name', ''));
        $email = trim((string) Security::input('email', ''));

        if (!$name)  Response::error('Name is required.');
        if (!$email || !Security::isValidEmail($email)) Response::error('Valid email is required.');

        $this->userModel->updateProfile($admin['id'], $name, $email);
        // Keep session in sync so audit logs use the updated name
        $_SESSION['admin_name']  = $name;
        $_SESSION['admin_email'] = $email;
        $this->auditLog->log('profile_updated', $admin['id'], $name, 'user', $admin['id']);
        $updated = $this->userModel->findById($admin['id']);
        Response::success([
            'id'    => $updated['id'],
            'name'  => $updated['name'],
            'email' => $updated['email'],
            'role'  => $updated['role'],
        ], 'Profile updated successfully.');
    }
}
