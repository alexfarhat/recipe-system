
# Architecture

## Tech stack

### Frontend
- **React 18** + **TypeScript** — component model and type safety
- **Tailwind CSS** — utility-first styling with custom design tokens
- **React Router v6** (HashRouter) — client-side routing
- **Framer Motion** — page transitions and micro-interactions
- **Lucide React** — icon set
- **Vite** (or equivalent bundler from Magic Patterns export) — build tooling

### Backend
- **PHP 7.4+** — REST API endpoints
- **PDO (MySQL)** — database access with prepared statements
- **MySQL 5.7+ / MariaDB 10+** — relational store

### Hosting
- **cPanel shared hosting** (afarhat.net)
- Apache web server
- Static frontend served from `public_html/`
- PHP API served from `public_html/api/`
- MySQL database `afarhat1_saffron`

---

## High-level data flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                       │
│                                                              │
│   Components ──► db.dishes.getAll()  (synchronous, cache)   │
│        │                                                     │
│        └── reads from in-memory cache in lib/db.ts          │
│                                                              │
│   On boot:                                                   │
│   db.init() ──► fetch('/api/dishes.php')                    │
│             ──► fetch('/api/users.php')                     │
│             ──► populates cache, fires 'ready' event        │
└──────────────────┬──────────────────────────────────────────┘
                   │  HTTP (fetch)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              PHP REST API (public_html/api/)                 │
│                                                              │
│   dishes.php   GET / POST / PUT / DELETE                    │
│   users.php    GET / POST / PUT / DELETE + ?action=login    │
│                                                              │
│   db.php       PDO connection + ensure_installed()          │
│                  ├─ CREATE TABLE IF NOT EXISTS              │
│                  └─ if users empty → seed data              │
│                                                              │
│   config.php   DB credentials (blocked from web access)     │
└──────────────────┬──────────────────────────────────────────┘
                   │  PDO
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              MySQL: afarhat1_saffron                         │
│                                                              │
│   dishes (id, title, image, ingredients JSON, ...)          │
│   users  (id, email, password_hash, role, ...)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Key design decisions

### 1. HashRouter, not BrowserRouter
cPanel's `AllowOverride` restrictions blocked the SPA rewrite rules needed for clean URLs. Switching to `HashRouter` removes the need for any server config — URLs become `recipes.afarhat.net/#/browse` and the server only ever serves `index.html`.

### 2. In-memory cache + sync component reads
Components call `db.dishes.getAll()` synchronously. The cache is populated once on app boot by `db.init()`. This preserves the original component API (no async refactor across the entire tree) while still using a real backend.

### 3. Auto-install on first request
`api/db.php` runs `ensure_installed()` on every request, guarded by a PHP static variable so it only executes once per process. It runs `CREATE TABLE IF NOT EXISTS` (idempotent) and checks if `users` is empty — if so, it seeds dishes and users. **No manual install step required.**

### 4. Loading gate in ProtectedRoute
During the brief cold-start window (before `db.init()` completes), the cache is empty. `ProtectedRoute` checks `db.isReady()` and shows a "Connecting to the kitchen…" loader rather than redirecting a valid session to `/login`.

### 5. Activity log stays local
Per-session analytics live in `localStorage`. Only shared, critical data (dishes, users) is in MySQL.

### 6. Credentials baked into `config.php`
The MySQL user/password are hardcoded in `api/config.php`. The user uploads once and never edits files on the server. `api/.htaccess` blocks direct web access to `config.php`.

---

## Frontend module map

```
App.tsx                  ── HashRouter + route definitions + db loading gate
index.tsx                ── React entry point
index.css                ── Tailwind imports + Google Fonts + design tokens
tailwind.config.js       ── Custom colors, fonts, spacing

lib/
  db.ts                  ── In-memory cache + fetch wrappers for PHP API
  auth.ts                ── Session management + login() against PHP API
  recipeParser.ts        ── AI/regex-based recipe text parser

hooks/
  useDb.ts               ── Subscribes to db emitter, returns reactive snapshot
  useAuth.ts             ── Current session + login/logout
  useToast.ts            ── Toast notifications

components/
  ui/                    ── Button, Input, Modal, Card, Badge, Select, Textarea
  layout/                ── TopNav, ManageSidebar, ManageLayout, PublicLayout
  auth/                  ── ProtectedRoute
  dishes/                ── DishCard, DishRow, AiParserModal, IngredientEditor, InstructionEditor

pages/
  Login.tsx              ── Authentication
  Dashboard.tsx          ── Logged-in landing (role-aware)
  BrowseRecipes.tsx      ── Public grid with search/filter
  RecipeDetail.tsx       ── Magazine editorial layout
  DishFinder.tsx         ── AI-style dish discovery
  ManageDashboard.tsx    ── Admin overview
  ManageDishes.tsx       ── Dish CRUD list
  CreateEditDish.tsx     ── Dish form with AI parser
  ManageUsers.tsx        ── User CRUD list

api/
  config.php             ── DB credentials
  db.php                 ── PDO + auto-install
  dishes.php             ── REST endpoint
  users.php              ── REST endpoint + login
  seed_dishes_data.php   ── Initial seed data
  .htaccess              ── Blocks config.php from web
```

---

## Request lifecycle (example: editing a dish)

1. User navigates to `/#/manage/dishes/123/edit`
2. `CreateEditDish.tsx` reads `db.dishes.getById(123)` synchronously from cache
3. User edits fields, clicks Save
4. Component calls `await db.dishes.update(123, payload)`
5. `lib/db.ts` issues `PUT /api/dishes.php?id=123` with JSON body
6. `api/dishes.php` validates, runs PDO `UPDATE`, returns updated row
7. `lib/db.ts` updates cache, fires `change` event
8. `useDb` subscribers re-render
9. Toast: "Dish updated"
