
# Development Guide

## Project structure

```
.
├── index.tsx               # React entry
├── App.tsx                 # Router + global providers + loading gate
├── index.css               # Tailwind imports + Google Fonts + tokens
├── tailwind.config.js      # Custom design tokens
├── types.ts                # Shared TypeScript types
│
├── lib/
│   ├── db.ts               # In-memory cache + PHP API fetch wrappers
│   ├── auth.ts             # Session management
│   └── recipeParser.ts     # Recipe text parsing
│
├── hooks/
│   ├── useDb.ts            # Reactive db snapshot + isReady
│   ├── useAuth.ts          # Session hook
│   └── useToast.ts         # Toast notifications
│
├── components/
│   ├── ui/                 # Primitives: Button, Input, Card, Modal, etc.
│   ├── layout/             # TopNav, ManageSidebar, ManageLayout, PublicLayout
│   ├── auth/               # ProtectedRoute
│   └── dishes/             # DishCard, DishRow, AiParserModal, IngredientEditor, InstructionEditor
│
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── BrowseRecipes.tsx
│   ├── RecipeDetail.tsx
│   ├── DishFinder.tsx
│   ├── ManageDashboard.tsx
│   ├── ManageDishes.tsx
│   ├── CreateEditDish.tsx
│   └── ManageUsers.tsx
│
├── data/                   # Seed data (TypeScript copies for reference)
│   ├── seedDishes.ts
│   ├── seedUsers.ts
│   └── seedActivity.ts
│
├── api/                    # PHP backend
│   ├── config.php          # DB credentials
│   ├── db.php              # PDO + ensure_installed()
│   ├── dishes.php          # Dishes REST endpoint
│   ├── users.php           # Users REST endpoint + login
│   ├── seed_dishes_data.php # Initial seed data (PHP)
│   └── .htaccess           # Blocks config.php from web
│
├── public/
│   └── .htaccess           # Not strictly needed with HashRouter
│
└── docs/                   # This documentation
```

---

## Conventions

### TypeScript
- Strict types — no `any`
- Shared types live in `types.ts`
- Named exports only (no default exports)

### File naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Libraries: `camelCase.ts`

### Imports order
1. React + third-party (`react`, `react-router-dom`, `framer-motion`, `lucide-react`)
2. Local components (`./components/...`)
3. Hooks (`./hooks/...`)
4. Libraries (`./lib/...`)
5. Types (`./types`)

### State pattern
- Global data (dishes, users) → `lib/db.ts` cache, accessed via `useDb()`
- Session → `lib/auth.ts`, accessed via `useAuth()`
- UI state → local `useState` / `useReducer`

### Styling
- Tailwind utility classes
- Design tokens (colors, fonts) in `tailwind.config.js`
- No CSS modules, no styled-components

---

## Local development

The project ships from Magic Patterns as a self-contained React app.

### Running the frontend
1. Install deps: `npm install`
2. Start dev server: `npm run dev`
3. Open `http://localhost:5173` (or whatever Vite reports)

### Running the API locally
You need a local PHP + MySQL stack (XAMPP, MAMP, or Laravel Herd).

1. Copy the `api/` folder into your local web root
2. Create a local MySQL database (e.g. `saffron_dev`)
3. Edit `api/config.php` to point at your local DB:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'saffron_dev');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```
4. Visit `http://localhost/api/dishes.php` — tables auto-create and seed
5. In the frontend, point `lib/db.ts` `API_BASE` at `http://localhost/api` for local testing

### CORS in local dev
The frontend (Vite on :5173) and PHP (Apache on :80) are different origins. CORS headers in `api/db.php` allow this.

---

## Building for production

1. `npm run build` — produces a `dist/` folder
2. Upload contents of `dist/` to `public_html/` on cPanel
3. Upload `api/` to `public_html/api/`
4. See [HOSTING.md](./HOSTING.md) for full deploy walkthrough

---

## Adding a new feature

### New page
1. Create `pages/MyPage.tsx`
2. Add the route in `App.tsx`
3. If it needs auth, wrap in `<ProtectedRoute>`
4. Add nav link in `components/layout/TopNav.tsx` or `ManageSidebar.tsx`

### New data field on dishes
1. Add column to `dishes` table — update CREATE TABLE in `api/db.php`
2. Update `Dish` type in `types.ts`
3. Update `api/dishes.php` GET/POST/PUT to include the field
4. Update `lib/db.ts` cache shape
5. Update `CreateEditDish.tsx` form

### New entity (e.g. categories table)
1. Add CREATE TABLE in `api/db.php` `ensure_installed()`
2. Create `api/categories.php` REST endpoint
3. Add cache + fetch wrappers in `lib/db.ts`
4. Add type in `types.ts`
5. Build the UI

---

## Debugging

### "Connecting to the kitchen…" stuck forever
- Open browser DevTools → Network
- Look for failed requests to `/api/dishes.php` or `/api/users.php`
- Common causes: API folder not uploaded, wrong DB credentials in `config.php`, PHP version too old (need 7.4+)

### 500 error on API call
- Check cPanel → Error Logs
- Usually a DB connection issue or PHP syntax error
- Verify `api/config.php` credentials match cPanel MySQL

### Login fails with correct password
- The seed runs only when `users` is empty
- If you manually edited a user, the password column must be a valid `password_hash()` output, not plaintext
- Use Manage → Users in the app to reset (it hashes correctly)
