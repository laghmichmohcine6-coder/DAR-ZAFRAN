<?php
/**
 * Database connection singleton using PDO.
 */

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $host   = getenv('DB_HOST')     ?: '127.0.0.1';
        $port   = getenv('DB_PORT')     ?: '3306';
        $dbname = getenv('DB_NAME')     ?: 'dar_zafran';
        $user   = getenv('DB_USER')     ?: 'root';
        $pass   = getenv('DB_PASSWORD') ?: '';

        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";

        try {
            $this->pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_FOUND_ROWS   => true,
            ]);
        } catch (PDOException $e) {
            if (defined('APP_DEBUG') && APP_DEBUG) {
                throw new RuntimeException('Database connection failed: ' . $e->getMessage());
            }
            throw new RuntimeException('Database connection failed. Check configuration.');
        }
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): PDO {
        return $this->pdo;
    }

    private function __clone() {}
    public function __wakeup(): never { throw new \Exception('Cannot unserialize singleton.'); }
}
