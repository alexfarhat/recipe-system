
<?php
// ============================================================
// Saffron — Users API
// GET    /api/users.php                 → list all users (no passwords)
// POST   /api/users.php                 → create user (body: { username, password, role, id?, createdAt? })
// POST   /api/users.php?action=login    → verify { username, password } → returns user
// PUT    /api/users.php?id=...          → update user (password optional)
// DELETE /api/users.php?id=...          → delete user
// ============================================================

require __DIR__ . '/db.php';

$pdo = db();
$method = method();
$id = $_GET['id'] ?? null;
$action = $_GET['action'] ?? null;

try {
    // ---- LOGIN ----
    if ($method === 'POST' && $action === 'login') {
        $body = read_json_body();
        $username = trim((string)($body['username'] ?? ''));
        $password = (string)($body['password'] ?? '');
        if ($username === '' || $password === '') {
            send_error('Please enter both username and password', 400);
        }
        $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1");
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        if (!$row || !password_verify($password, $row['password'])) {
            send_error('Invalid username or password', 401);
        }
        send_json(row_to_user($row));
    }

    switch ($method) {
        case 'GET': {
            $rows = $pdo->query("SELECT * FROM users ORDER BY created_at ASC")->fetchAll();
            send_json(array_map('row_to_user', $rows));
        }

        case 'POST': {
            $u = read_json_body();
            $username = trim((string)($u['username'] ?? ''));
            $password = (string)($u['password'] ?? '');
            $role = ($u['role'] ?? 'user') === 'admin' ? 'admin' : 'user';
            if ($username === '' || $password === '') send_error('Username and password required');

            $exists = $pdo->prepare("SELECT 1 FROM users WHERE LOWER(username) = LOWER(?)");
            $exists->execute([$username]);
            if ($exists->fetch()) send_error('Username already exists', 409);

            $id = (string)($u['id'] ?? ('user-' . bin2hex(random_bytes(6))));
            $createdAt = (string)($u['createdAt'] ?? gmdate('Y-m-d\TH:i:s\Z'));
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$id, $username, $hash, $role, $createdAt]);
            send_json(row_to_user(['id' => $id, 'username' => $username, 'password' => '', 'role' => $role, 'created_at' => $createdAt]));
        }

        case 'PUT': {
            if (!$id) send_error('Missing id');
            $u = read_json_body();
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            if (!$existing) send_error('User not found', 404);

            $username = trim((string)($u['username'] ?? $existing['username']));
            $role = ($u['role'] ?? $existing['role']) === 'admin' ? 'admin' : 'user';
            $newPassword = (string)($u['password'] ?? '');

            if ($newPassword !== '') {
                $hash = password_hash($newPassword, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?");
                $stmt->execute([$username, $hash, $role, $id]);
            } else {
                $stmt = $pdo->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
                $stmt->execute([$username, $role, $id]);
            }
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            send_json(row_to_user($stmt->fetch()));
        }

        case 'DELETE': {
            if (!$id) send_error('Missing id');
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            send_json(['ok' => true]);
        }

        default:
            send_error('Method not allowed', 405);
    }
} catch (Throwable $e) {
    send_error($e->getMessage(), 500);
}
