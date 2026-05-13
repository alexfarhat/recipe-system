
# cPanel Hosting & Database Connection

How Saffron is deployed on cPanel shared hosting at **afarhat.net**, with the PHP API connected to a MySQL database. This is the exact recipe used for the live deployment at [recipes.afarhat.net](https://recipes.afarhat.net).

---

## Overview

```
┌────────────────────────────────────────────────────────┐
│                    cPanel Account                       │
│                                                         │
│   public_html/                  ← React SPA lives here  │
│   ├── index.html                                        │
│   ├── assets/                                           │
│   └── api/                      ← PHP REST API          │
│       ├── config.php            ← DB credentials        │
│       ├── db.php                                        │
│       ├── dishes.php                                    │
│       ├── users.php                                     │
│       ├── seed_dishes_data.php                          │
│       └── .htaccess             ← blocks config.php     │
│                                                         │
│   MySQL Databases                                       │
│   └── afarhat1_saffron          ← schema + data         │
│         user: afarhat1_saffuser                         │
└────────────────────────────────────────────────────────┘
```

---

## Step 1 — Create the MySQL database in cPanel

1. Log into cPanel.
2. Open **MySQL® Databases** (under the Databases section).
3. **Create New Database:**
   - Name: `saffron`
   - cPanel will prefix it automatically → final name: `afarhat1_saffron`
   - Click **Create Database**.
4. **Create a MySQL user:**
   - Username: `saffuser`
   - Final name: `afarhat1_saffuser`
   - Set a strong password (use cPanel's password generator and **save it somewhere safe** — you'll need it once).
   - Click **Create User**.
5. **Add the user to the database:**
   - In the **Add User To Database** section, select the user and database, click **Add**.
   - On the privileges page, check **ALL PRIVILEGES**, then **Make Changes**.

You now have:
- Database: `afarhat1_saffron`
- User: `afarhat1_saffuser`
- Password: (whatever you generated)
- Host: `localhost` (always, for cPanel-local connections)

---

## Step 2 — Bake credentials into `api/config.php`

Open `api/config.php` locally and edit the four constants:

```php
<?php
// api/config.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'afarhat1_saffron');
define('DB_USER', 'afarhat1_saffuser');
define('DB_PASS', 'YOUR_PASSWORD_HERE');
```

> **Why bake them in?** Shared cPanel hosting doesn't let you set environment variables reliably. Hardcoding them in `config.php` means you upload once and never touch the server again. The accompanying `api/.htaccess` blocks `config.php` from direct web access.

---

## Step 3 — Build the frontend

In your local project folder:

```bash
npm install
npm run build
```

This produces a `dist/` (or `build/`) folder containing `index.html` and an `assets/` subfolder.

---

## Step 4 — Upload everything to cPanel

### Option A: cPanel File Manager (browser)

1. cPanel → **File Manager** → navigate into `public_html/`.
2. **Delete** the default `index.html` or any placeholder files (but keep `cgi-bin/` if present).
3. Click **Upload**, drag in the contents of your local `dist/` folder:
   - `index.html`
   - `assets/` folder
4. Create a folder named `api` inside `public_html/`.
5. Upload all files from your local `api/` folder into `public_html/api/`:
   - `config.php`
   - `db.php`
   - `dishes.php`
   - `users.php`
   - `seed_dishes_data.php`
   - `.htaccess`

### Option B: FTP (FileZilla, Cyberduck)

1. Connect using your cPanel FTP credentials.
2. Upload to `/public_html/` and `/public_html/api/` mirroring the structure above.

---

## Step 5 — Verify the auto-install

Visit `https://recipes.afarhat.net/api/dishes.php` in a browser.

You should see a JSON array of 10 seeded dishes. On this very first request:

1. `api/db.php` runs `ensure_installed()`.
2. `CREATE TABLE IF NOT EXISTS` runs for both `dishes` and `users`.
3. The script checks `SELECT COUNT(*) FROM users`. It's zero, so it seeds 10 dishes and 4 users.
4. JSON dishes are returned.

If you see JSON dishes, **the database connection is working and the schema is installed.** No further server-side action is needed.

If you see a 500 error, see Troubleshooting below.

---

## Step 6 — Open the app

Visit [https://recipes.afarhat.net](https://recipes.afarhat.net).

- The React SPA loads `index.html`.
- React Router (HashRouter) takes over — URLs look like `recipes.afarhat.net/#/login`.
- On boot, `db.init()` fires `fetch('/api/dishes.php')` and `fetch('/api/users.php')` to populate the cache.
- The login screen appears.

Log in with the default admin:

---

## Why HashRouter (and not pretty URLs)

The first deploy attempt used `BrowserRouter` with an SPA-rewrite `.htaccess` (rewrite all non-file requests to `index.html`). This **500-errored** because cPanel's Apache config has `AllowOverride` restrictions on shared hosting plans — the rewrite rules were rejected.

The fix: switch `App.tsx` to `HashRouter`. URLs become `recipes.afarhat.net/#/browse` instead of `recipes.afarhat.net/browse`. The server only ever serves `index.html` regardless of the hash, so **zero server config is needed**.

The `public/.htaccess` file is still in the project but is harmless — it does nothing under the current setup.

---

## How the API connects to MySQL

In `api/db.php`:

```php
require_once __DIR__ . '/config.php';

function db() {
  static $pdo = null;
  if ($pdo === null) {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
  }
  return $pdo;
}
```

Key points:
- `localhost` works because the PHP and MySQL services run on the same cPanel server.
- The PDO instance is cached in a static variable — one connection per request.
- `ERRMODE_EXCEPTION` means failures throw `PDOException` (caught by the endpoint handlers and returned as JSON errors).
- `EMULATE_PREPARES => false` enables real prepared statements (SQL injection safe).

The first endpoint hit calls `ensure_installed()`:

```php
function ensure_installed() {
  static $done = false;
  if ($done) return;
  $done = true;

  $pdo = db();
  $pdo->exec("CREATE TABLE IF NOT EXISTS dishes (...);");
  $pdo->exec("CREATE TABLE IF NOT EXISTS users  (...);");

  $count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
  if ($count == 0) {
    seed_dishes($pdo);
    seed_users($pdo);
  }
}
```

This is **idempotent**: re-uploading the API or hitting it after a fresh DB does the right thing every time.

---

## Securing `config.php`

`api/.htaccess` contains:

```apache
<Files "config.php">
  Order allow,deny
  Deny from all
</Files>
```

Verify it works: visit `https://recipes.afarhat.net/api/config.php`. You should see a **403 Forbidden**. If you see PHP source or the page loads, the `.htaccess` isn't being applied — contact your host.

---

## Updating the deployed site

### Just frontend changes
1. `npm run build`
2. Re-upload `dist/index.html` and `dist/assets/` to `public_html/` (overwriting).

### Just an API file change
1. Upload the changed PHP file to `public_html/api/`.

### Database schema change
1. Either:
   - **Manual:** Open phpMyAdmin → run `ALTER TABLE ...` yourself.
   - **Wipe & re-seed:** Drop both tables, hit the API once, auto-install recreates them. **You lose all data.**

---

## Troubleshooting

### `500 Internal Server Error` on `/api/dishes.php`
- Check cPanel → **Error Logs**.
- Most likely: wrong DB credentials in `config.php`. Verify the database name, user, and password in cPanel → MySQL Databases.
- Also check: PHP version. cPanel → **MultiPHP Manager** → ensure PHP 7.4 or higher.

### `SQLSTATE[HY000] [1045] Access denied for user`
- Wrong password in `config.php`, or the user isn't attached to the database with full privileges. Re-run **Add User to Database** in cPanel.

### Site loads but stuck on "Connecting to the kitchen…"
- Frontend can't reach the API. Open DevTools → Network and look at the failing request.
- Common causes:
  - `api/` folder not uploaded
  - `.htaccess` in `api/` is blocking too much (try renaming it temporarily)
  - HTTPS mixed-content: ensure the site is loaded over `https://`, not `http://`

### Login says "Invalid credentials" with `admin@saffron.app` / `admin123`
- Either the seed didn't run, or the password was changed.
- In phpMyAdmin → `users` table → confirm the row exists.
- If the seed didn't run, truncate the `users` table and reload the site. The seed will fire because count is zero.

### Need to start completely over
1. phpMyAdmin → `afarhat1_saffron` → drop both tables.
2. Visit `recipes.afarhat.net/api/dishes.php` — auto-install recreates and re-seeds.

---

## Security checklist post-deploy

- [ ] Confirm `https://recipes.afarhat.net/api/config.php` returns **403**
- [ ] Change `admin@saffron.app` password in the app (default `admin123` → strong unique)
- [ ] If the MySQL password was ever shared (chat, email, screenshot), rotate it:
   1. cPanel → MySQL Databases → **Change Password** for `afarhat1_saffuser`
   2. Update `api/config.php` locally with the new password
   3. Re-upload just `config.php` to `public_html/api/`
- [ ] Enable cPanel two-factor authentication on your hosting account
- [ ] Keep PHP version current (cPanel → MultiPHP Manager)
- [ ] Schedule regular backups (cPanel → Backup)
