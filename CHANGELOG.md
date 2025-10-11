# Changelog

This document summarizes the recent changes pushed to `main` so you can quickly see what changed and why.

## 2025-10-11

- Auth UI overhaul
  - Added `src/components/AuthLayout.jsx` for a clean, consistent auth shell.
  - Rebuilt `Login` and `Register` screens with validation, clear CTAs, and footer links.
  - Fixed links: “Create account” and “Have account? Login” always navigate correctly under Drawer.
  - Safe navigation after submit: if no back stack, Login → `HomeTabs`; Register → `Welcome`.

- Drawer everywhere (web + mobile)
  - Drawer is available across all stacks (Home, Search, Admin) with a header-left menu button.
  - Web Drawer initial route switches by auth: `Welcome` (logged-out) vs `HomeTabs` (logged-in).
  - Web Drawer shows `Login` + `Register` only when logged out, `Logout` when logged in.
  - Mobile Drawer now includes `Welcome`, `Login`, `Register` when logged out, and `Logout` when logged in.

- Admin improvements
  - Added `AdminCategoriesScreen` and `AdminSettingsScreen`.
  - Fixed scrolling issues by avoiding nested ScrollViews; switched to FlatList where needed.
  - Stabilized selectors in `AdminDashboardScreen` to remove memoization warnings.

- Navigation fixes and cleanup
  - Introduced `App.web.js` to avoid legacy Drawer warnings and tailor web navigation.
  - Added header-left menu button across stacks (web + mobile) to open the Drawer reliably.
  - Removed unused code and temp files; strengthened `.gitignore`.

- Known development-only warnings
  - RN Web warnings like “shadow* deprecated” and “pointerEvents deprecated” are benign in dev and don’t impact behavior.

## How to verify

1) Logged out (web/mobile):
   - Drawer shows `Welcome`, `Login`, `Register`, `Messages`, `Admin`, `HomeTabs`.
   - From `Login` → submit → lands on `HomeTabs` if no back history.
   - From `Register` → submit → lands on `Welcome` if no back history.

2) Logged in:
   - Drawer hides `Welcome`, `Login`, `Register`, and shows `Logout`.
   - Header-left menu button opens Drawer on Home/Search/Admin stacks.
