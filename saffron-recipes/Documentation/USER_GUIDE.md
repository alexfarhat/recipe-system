
# User Guide

## Getting in

1. Go to [recipes.afarhat.net](https://recipes.afarhat.net)
2. You'll land on the login screen
3. Default admin credentials


---

## As a regular user (role: `user`)

### Browse recipes
- Click **Browse** in the top nav
- Use the search box to filter by name, ingredient, or tag
- Use category / cuisine / difficulty dropdowns to narrow results
- Click any card to open the full recipe

### Read a recipe
- The detail page shows the hero image, ingredients sidebar, and step-by-step instructions
- Use your browser's print function for a printable layout
- Click **Back** or the logo to return to browse

### Find dishes by ingredient (Dish Finder)
- Click **Dish Finder** in the top nav
- Type ingredients you have on hand (one per line or comma-separated)
- Click **Find Dishes**
- Results are ranked by how many of your ingredients match

---

## As an admin (role: `admin`)

Admins see additional **Manage** links in the nav.

### Dashboard
- **Manage → Dashboard** shows a quick overview: total dishes, total users, recent activity

### Add a new dish
1. **Manage → Dishes**
2. Click **+ New Dish**
3. Fill in title, image URL, category, cuisine, etc.
4. **Ingredients tab:** add rows with quantity, unit, and ingredient name
5. **Instructions tab:** add numbered steps
6. **Or click "AI Parser"** to paste a full recipe blob — the parser extracts title, ingredients, and steps automatically. Review and tweak as needed.
7. Click **Save**

### Edit an existing dish
1. **Manage → Dishes**
2. Click the dish row or the edit icon
3. Make changes
4. Click **Save**

### Delete a dish
1. **Manage → Dishes**
2. Click the delete (trash) icon
3. Confirm in the modal

### Add a user
1. **Manage → Users**
2. Click **+ New User**
3. Enter name, email, password, role (`admin` or `user`)
4. Click **Save**

### Reset a user's password
1. **Manage → Users**
2. Click edit on the user
3. Enter a new password
4. Click **Save** — the new password is hashed and stored

### Change your own admin password
Same as resetting any user's password — edit your own account from Manage → Users.

**Do this immediately after first login.**

---

## Tips

- **Image URLs:** use Unsplash, your own CDN, or any direct image link. The app does not host uploads.
- **Recipe AI Parser:** works best with cleanly formatted text (one ingredient per line, numbered steps). Always review the parsed result before saving.
- **Search is fuzzy:** typing "tom" will match "tomato", "tomato paste", and any tag containing "tom".
- **Logging out:** click your name in the top right → Logout. This clears the session.

---

## Security checklist (for the site owner)

- [ ] Change admin password from default `admin123`
- [ ] Rotate the MySQL user password if it was ever exposed
- [ ] Verify `api/.htaccess` is blocking direct access to `config.php` (try visiting `recipes.afarhat.net/api/config.php` — should 403)
- [ ] Keep PHP version up to date in cPanel
