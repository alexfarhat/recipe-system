

<?php
// ============================================================
// Saffron — Shared DB + HTTP helpers used by every endpoint
//
// On the very first request this file will silently:
//   1. Create the `users` and `dishes` tables if they don't exist
//   2. Seed them with the demo data if they're empty
//
// No manual install step required.
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $cfg = require __DIR__ . '/config.php';
    $dsn = "mysql:host={$cfg['host']};dbname={$cfg['database']};charset={$cfg['charset']}";
    try {
        $pdo = new PDO($dsn, $cfg['username'], $cfg['password'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed', 'detail' => $e->getMessage()]);
        exit;
    }

    ensure_installed($pdo);
    return $pdo;
}

/**
 * Idempotent. Runs once per request, no-op once tables + seed are in place.
 * Cheap: CREATE TABLE IF NOT EXISTS + one COUNT query.
 */
function ensure_installed(PDO $pdo): void {
    static $checked = false;
    if ($checked) return;
    $checked = true;

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id          VARCHAR(64) PRIMARY KEY,
            username    VARCHAR(64) NOT NULL UNIQUE,
            password    VARCHAR(255) NOT NULL,
            role        VARCHAR(16) NOT NULL DEFAULT 'user',
            created_at  VARCHAR(40) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS dishes (
            id                  VARCHAR(64) PRIMARY KEY,
            title               VARCHAR(255) NOT NULL,
            description         TEXT,
            category            VARCHAR(32) NOT NULL,
            cook_time           INT NOT NULL DEFAULT 0,
            calories            INT NOT NULL DEFAULT 0,
            image               LONGTEXT,
            tags                JSON,
            ingredients         JSON,
            instructions        JSON,
            chef_notes          TEXT,
            additional_details  TEXT,
            created_by          VARCHAR(64),
            created_at          VARCHAR(40) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Seed users only if the table is empty
    $userCount = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($userCount === 0) {
        $seedUsers = [
            ['user-1', 'admin',         'admin123',  'admin', '2026-02-20T10:00:00Z'],
            ['user-2', 'chef_maria',    'changeme',  'admin', '2026-03-15T14:30:00Z'],
            ['user-3', 'foodie_sam',    'changeme',  'user',  '2026-04-01T09:00:00Z'],
            ['user-4', 'recipe_lover',  'changeme',  'user',  '2026-04-10T16:45:00Z'],
        ];
        $stmt = $pdo->prepare("INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)");
        foreach ($seedUsers as [$id, $username, $pwd, $role, $createdAt]) {
            $hash = password_hash($pwd, PASSWORD_DEFAULT);
            $stmt->execute([$id, $username, $hash, $role, $createdAt]);
        }
    }

    // Seed dishes only if the table is empty
    $dishCount = (int)$pdo->query("SELECT COUNT(*) FROM dishes")->fetchColumn();
    if ($dishCount === 0 && is_file(__DIR__ . '/seed_dishes_data.php')) {
        $seedDishes = require __DIR__ . '/seed_dishes_data.php';
        $stmt = $pdo->prepare("
            INSERT INTO dishes (id, title, description, category, cook_time, calories, image, tags, ingredients, instructions, chef_notes, additional_details, created_by, created_at)
            VALUES (:id, :title, :description, :category, :cook_time, :calories, :image, :tags, :ingredients, :instructions, :chef_notes, :additional_details, :created_by, :created_at)
        ");
        foreach ($seedDishes as $d) {
            $row = dish_to_row($d);
            $stmt->execute($row);
        }
    }
}

function read_json_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function send_json($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function send_error(string $message, int $status = 400): void {
    send_json(['error' => $message], $status);
}

function method(): string {
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

// ---------- Dish row <-> JSON ----------
function dish_to_row(array $d): array {
    return [
        'id'                => (string)($d['id'] ?? ''),
        'title'             => (string)($d['title'] ?? ''),
        'description'       => (string)($d['description'] ?? ''),
        'category'          => (string)($d['category'] ?? 'Dinner'),
        'cook_time'         => (int)($d['cookTime'] ?? 0),
        'calories'          => (int)($d['calories'] ?? 0),
        'image'             => (string)($d['image'] ?? ''),
        'tags'              => json_encode($d['tags'] ?? [], JSON_UNESCAPED_UNICODE),
        'ingredients'       => json_encode($d['ingredients'] ?? [], JSON_UNESCAPED_UNICODE),
        'instructions'      => json_encode($d['instructions'] ?? [], JSON_UNESCAPED_UNICODE),
        'chef_notes'        => (string)($d['chefNotes'] ?? ''),
        'additional_details'=> (string)($d['additionalDetails'] ?? ''),
        'created_by'        => (string)($d['createdBy'] ?? ''),
        'created_at'        => (string)($d['createdAt'] ?? gmdate('Y-m-d\TH:i:s\Z')),
    ];
}

function row_to_dish(array $r): array {
    return [
        'id'                => $r['id'],
        'title'             => $r['title'],
        'description'       => $r['description'],
        'category'          => $r['category'],
        'cookTime'          => (int)$r['cook_time'],
        'calories'          => (int)$r['calories'],
        'image'             => $r['image'],
        'tags'              => json_decode($r['tags'] ?? '[]', true) ?: [],
        'ingredients'       => json_decode($r['ingredients'] ?? '[]', true) ?: [],
        'instructions'      => json_decode($r['instructions'] ?? '[]', true) ?: [],
        'chefNotes'         => $r['chef_notes'] ?? '',
        'additionalDetails' => $r['additional_details'] ?? '',
        'accessGroups'      => [], // legacy field, unused
        'createdBy'         => $r['created_by'] ?? '',
        'createdAt'         => $r['created_at'] ?? '',
    ];
}

// ---------- User row <-> JSON (password is NEVER returned) ----------
function row_to_user(array $r): array {
    return [
        'id'        => $r['id'],
        'username'  => $r['username'],
        'password'  => '', // never expose
        'role'      => $r['role'],
        'createdAt' => $r['created_at'] ?? '',
    ];
}

