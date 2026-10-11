<?php
/**
 * Image upload service.
 */

class ImageService {

    /**
     * Handle an uploaded image file.
     * Returns array with filename, path, url, mime_type, size, original_name.
     * Throws RuntimeException on failure.
     */
    public static function upload(array $file, string $subdir = ''): array {
        if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            throw new RuntimeException('No file uploaded or upload failed.');
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new RuntimeException('Upload error code: ' . $file['error']);
        }

        $mimeType = mime_content_type($file['tmp_name']);
        if (!in_array($mimeType, ALLOWED_IMAGE_TYPES)) {
            throw new RuntimeException('Invalid file type. Allowed: JPEG, PNG, WebP, GIF.');
        }

        if ($file['size'] > MAX_UPLOAD_SIZE) {
            throw new RuntimeException('File too large. Maximum size: 5 MB.');
        }

        $ext = match($mimeType) {
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'image/gif'  => 'gif',
            default      => 'bin',
        };

        $filename = bin2hex(random_bytes(16)) . '.' . $ext;
        $dir      = UPLOAD_PATH . ($subdir ? '/' . trim($subdir, '/') : '');

        if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
            throw new RuntimeException('Failed to create upload directory.');
        }

        $fullPath = $dir . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
            throw new RuntimeException('Failed to move uploaded file.');
        }

        $urlPath = ($subdir ? '/' . trim($subdir, '/') . '/' : '/') . $filename;

        return [
            'filename'      => $filename,
            'original_name' => basename($file['name']),
            'mime_type'     => $mimeType,
            'size'          => $file['size'],
            'path'          => $fullPath,
            'url'           => UPLOAD_URL . $urlPath,
        ];
    }

    public static function delete(string $path): void {
        if ($path && file_exists($path) && is_file($path)) {
            unlink($path);
        }
    }
}
