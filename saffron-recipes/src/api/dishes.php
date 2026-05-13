
<?php
// ============================================================
// Saffron — Dishes API
// GET    /api/dishes.php           → list all dishes
// POST   /api/dishes.php           → create dish (body: dish JSON)
// PUT    /api/dishes.php?id=...    → update dish
// DELETE /api/dishes.php?id=...    → delete dish
// ============================================================

require __DIR__ . '/db.php';

$pdo = db();
$method = method();
$id = $_GET['id'] ?? null;

try {
    switch ($method) {
        case 'GET': {
            $rows = $pdo->query("SELECT * FROM dishes ORDER BY created_at DESC")->fetchAll();
            send_json(array_map('row_to_dish', $rows));
        }

        case 'POST': {
            $d = read_json_body();
            if (empty($d['id']) || empty($d['title'])) send_error('Missing id or title');
            $row = dish_to_row($d);
            $stmt = $pdo->prepare("
                INSERT INTO dishes (id, title, description, category, cook_time, calories, image, tags, ingredients, instructions, chef_notes, additional_details, created_by, created_at)
                VALUES (:id, :title, :description, :category, :cook_time, :calories, :image, :tags, :ingredients, :instructions, :chef_notes, :additional_details, :created_by, :created_at)
            ");
            $stmt->execute($row);
            send_json(row_to_dish($pdo->query("SELECT * FROM dishes WHERE id = " . $pdo->quote($d['id']))->fetch()));
        }

        case 'PUT': {
            if (!$id) send_error('Missing id');
            $d = read_json_body();
            $d['id'] = $id;
            $row = dish_to_row($d);
            $stmt = $pdo->prepare("
                UPDATE dishes SET
                    title = :title,
                    description = :description,
                    category = :category,
                    cook_time = :cook_time,
                    calories = :calories,
                    image = :image,
                    tags = :tags,
                    ingredients = :ingredients,
                    instructions = :instructions,
                    chef_notes = :chef_notes,
                    additional_details = :additional_details,
                    created_by = :created_by,
                    created_at = :created_at
                WHERE id = :id
            ");
            $stmt->execute($row);
            send_json(row_to_dish($pdo->query("SELECT * FROM dishes WHERE id = " . $pdo->quote($id))->fetch()));
        }

        case 'DELETE': {
            if (!$id) send_error('Missing id');
            $stmt = $pdo->prepare("DELETE FROM dishes WHERE id = ?");
            $stmt->execute([$id]);
            send_json(['ok' => true]);
        }

        default:
            send_error('Method not allowed', 405);
    }
} catch (Throwable $e) {
    send_error($e->getMessage(), 500);
}
