<?php

class MenuController {
    private Dish $dishModel;
    private AuditLog $auditLog;

    public function __construct() {
        $this->dishModel = new Dish();
        $this->auditLog  = new AuditLog();
    }

    // ---- PUBLIC ----

    public function publicMenu(): never {
        $menu = $this->dishModel->getPublicMenu();
        Response::success($menu);
    }

    // ---- ADMIN: Dishes ----

    public function listDishes(): never {
        AuthMiddleware::requireAuth();
        ['page' => $page, 'perPage' => $perPage] = Pagination::params();
        $filters = [
            'category_id'  => $_GET['category_id'] ?? '',
            'is_available' => $_GET['available']    ?? '',
            'search'       => $_GET['search']       ?? '',
        ];
        ['data' => $data, 'total' => $total] = $this->dishModel->list($filters, $page, $perPage);
        Response::paginated($data, $total, $page, $perPage);
    }

    public function getDish(int $id): never {
        AuthMiddleware::requireAuth();
        $dish = $this->dishModel->findById($id);
        if (!$dish) Response::notFound('Dish not found.');
        Response::success($dish);
    }

    public function createDish(): never {
        $admin = AuthMiddleware::requireAuth();

        // Accept both multipart (file upload) and JSON
        $data = !empty($_POST) ? $_POST : Security::getJsonBody();

        $errors = [];
        if (empty($data['name_en']))    $errors['name_en']    = 'English name is required.';
        if (empty($data['category_id'])) $errors['category_id'] = 'Category is required.';
        if (!isset($data['price']) || !is_numeric($data['price'])) $errors['price'] = 'Valid price is required.';

        if (!empty($errors)) Response::error('Validation failed.', 422, $errors);

        // Handle image upload
        if (!empty($_FILES['image'])) {
            try {
                $uploaded = ImageService::upload($_FILES['image'], 'dishes');
                $data['image_path'] = $uploaded['url'];
                // Register in media library
                (new Media())->create([...$uploaded, 'uploaded_by' => $admin['id']]);
            } catch (RuntimeException $e) {
                Response::error('Image upload failed: ' . $e->getMessage());
            }
        }

        // Decode dietary_tags if sent as string
        if (isset($data['dietary_tags']) && is_string($data['dietary_tags'])) {
            $data['dietary_tags'] = json_decode($data['dietary_tags'], true) ?? [];
        }

        $dish = $this->dishModel->create($data);
        $this->auditLog->log('dish_created', $admin['id'], $admin['name'], 'dish', $dish['id'], ['name' => $dish['name_en']]);
        Response::created($dish, 'Dish created.');
    }

    public function updateDish(int $id): never {
        $admin      = AuthMiddleware::requireAuth();
        $existingDish = $this->dishModel->findById($id);
        if (!$existingDish) Response::notFound('Dish not found.');

        $data = !empty($_POST) ? $_POST : Security::getJsonBody();

        if (!empty($_FILES['image'])) {
            try {
                $uploaded = ImageService::upload($_FILES['image'], 'dishes');
                $data['image_path'] = $uploaded['url'];
                (new Media())->create([...$uploaded, 'uploaded_by' => $admin['id']]);
                // Delete old image file when replaced
                $oldPath = $existingDish['image_path'] ?? null;
                if ($oldPath && str_starts_with($oldPath, UPLOAD_URL)) {
                    ImageService::delete(UPLOAD_PATH . substr($oldPath, strlen(UPLOAD_URL)));
                }
            } catch (RuntimeException $e) {
                Response::error('Image upload failed: ' . $e->getMessage());
            }
        }

        if (isset($data['dietary_tags']) && is_string($data['dietary_tags'])) {
            $data['dietary_tags'] = json_decode($data['dietary_tags'], true) ?? [];
        }

        $this->dishModel->update($id, $data);
        $this->auditLog->log('dish_updated', $admin['id'], $admin['name'], 'dish', $id);
        Response::success($this->dishModel->findById($id), 'Dish updated.');
    }

    public function deleteDish(int $id): never {
        $admin = AuthMiddleware::requireAuth();
        $dish  = $this->dishModel->findById($id);
        if (!$dish) Response::notFound('Dish not found.');

        $oldPath = $this->dishModel->delete($id);
        // image_path stores a URL; convert to filesystem path before deleting
        if ($oldPath && str_starts_with($oldPath, UPLOAD_URL)) {
            $relPath = substr($oldPath, strlen(UPLOAD_URL));
            ImageService::delete(UPLOAD_PATH . $relPath);
        }

        $this->auditLog->log('dish_deleted', $admin['id'], $admin['name'], 'dish', $id, ['name' => $dish['name_en']]);
        Response::success(null, 'Dish deleted.');
    }

    public function toggleAvailability(int $id): never {
        $admin = AuthMiddleware::requireAuth();
        if (!$this->dishModel->findById($id)) Response::notFound('Dish not found.');
        $available = (bool) Security::input('is_available', false);
        $this->dishModel->setAvailability($id, $available);
        $this->auditLog->log('dish_availability', $admin['id'], $admin['name'], 'dish', $id, ['is_available' => $available]);
        Response::success(null, 'Availability updated.');
    }
}
