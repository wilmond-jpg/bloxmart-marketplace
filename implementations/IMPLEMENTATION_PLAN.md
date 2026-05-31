---
name: Supabase Auth Refactor
overview: Replace localStorage fake auth with Supabase Auth + a real user/profile/roles system, and wire the existing login/signup + auth-aware UI through a refactored AuthContext. Also propose the Supabase schema, RLS policies, and required marketplace pages/routes.
todos: []
isProject: false
---

# Supabase Auth + Roles Implementation Plan

This plan replaces the current fake `localStorage`-based authentication in BloxMarket with real Supabase-powered auth (email/password + Google OAuth), and introduces a secure Supabase-backed user/profile + role system used throughout the app via the existing `AuthContext`.

Assumptions:
- You selected **SSR/Cloudflare** deployment for TanStack Start, so server-rendered loaders/routes must be able to read the Supabase session (cookie-based).
- Existing UI conventions must stay intact (shadcn/ui, Lucide icons, semantic Tailwind classes from `src/styles.css`, Sonner toasts).

---

## 1) Target architecture (what will exist after the change)

- `src/context/AuthContext.tsx` remains the single source of auth state in the React tree, but its implementation becomes Supabase-backed.
- Supabase session persistence is handled by `@supabase/ssr` (server client) and its cookie adapter.
- App identity is represented by a **profile row** (linked 1:1 to `auth.users`) rather than by the Supabase auth user object alone.
- Roles are stored in Supabase tables and enforced via Postgres RLS (plus optional UI gating by `AuthContext`).

```mermaid
flowchart LR
  Browser[Browser React App] -->|uses AuthContext| AuthContext[AuthProvider]
  AuthContext -->|signIn/signUp/signOut| SupabaseAuth[Supabase Auth (email/password + Google OAuth)]
  AuthContext -->|fetches profile| ProfileTable[public.user_profiles]
  ProfileTable -->|role flags / role history| RolesTable[public.user_roles + public.user_role_history]
  ServerLoaders[SSR route loaders / server functions] -->|read cookies| CookieAdapter[Supabase SSR cookie adapter]
  CookieAdapter --> SupabaseServer[Supabase Server Client]
  SupabaseServer --> ProfileTable
```

---

## 2) Supabase project setup (one-time)

### 2.1 Configure Auth providers
1. In Supabase, enable **Email & Password**.
2. Configure **Google OAuth**:
   - Add Google as an OAuth provider.
   - Use the proper **redirect URL(s)** for your TanStack Start app.
   - Ensure the redirect target we implement in the app matches Supabase's allowed redirect URLs.

### 2.2 Storage buckets (for item images and avatars)
Create buckets (example):
- `item-images`
- `user-avatars`

Decide naming strategy:
- Avatar object path prefix: `avatars/{user_id}/avatar.png`
- Item image object path prefix: `listings/{listing_id}/{filename}`

### 2.3 Enable auth audit logs (for login history)
1. Enable Supabase **Auth audit logs**.
2. Use `auth.audit_log_entries` as the canonical source for "login history" (per-user sign-in events), unless you explicitly prefer a custom table.

---

## 3) Add Supabase client + env configuration to the app

### 3.1 Add dependencies
Add (recommended):
- `@supabase/supabase-js`
- `@supabase/ssr`

(Keep versions pinned to what your project tooling resolves; don't guess versions in this plan.)

### 3.2 Add environment variables
Create an env example (if not present):
- `VITE_SUPABASE_URL` (public)
- `VITE_SUPABASE_ANON_KEY` (public)

If you need additional secrets for privileged server flows, keep them **server-only** (e.g., service-role key), and load via server env (non-`VITE_` variables).

### 3.3 Create Supabase client modules
Add modules under `src/lib/`:
- `src/lib/supabase/browserClient.ts`
- `src/lib/supabase/serverClient.ts`
- `src/lib/supabase/types.ts` (optional: shared TS types)

Implementation outline:
1. **Browser client**: uses Supabase browser auth and exposes `getUser()` / session detection.
2. **Server client**: uses `@supabase/ssr` `createServerClient` with a TanStack Start cookie adapter.
   - Implement cookie adapter using TanStack Start server helpers (`getRequestHeader`, `setResponseHeader(s)`) so `@supabase/ssr` can read/write refresh/session cookies.

---

## 4) Refactor AuthContext to be Supabase-backed (no parallel auth system)

### 4.1 Update the AuthContext contract
Replace the current fake contract in `[src/context/AuthContext.tsx](src/context/AuthContext.tsx)`:
- Remove `FakeUser` and localStorage persistence logic.
- Keep these exports stable for the rest of the app:
  - `useAuth()`
  - `AuthProvider`
- Update `AuthContext` values to represent real identity:
  - `user`: derived from `public.user_profiles` (id, username, email, avatar URL, roles summary)
  - `isLoggedIn`: derived from Supabase session state
  - `login`, `signup`, `logout`: become async and call Supabase auth methods
  - Add `signInWithGoogle()` (or a generic `oauthLogin('google')`) for Google OAuth

### 4.2 Client session bootstrap
In `AuthProvider` (client side):
1. Create a Supabase browser client.
2. Load the session via Supabase (initial `getSession()` / `getUser()` and/or `onAuthStateChange`).
3. When a user is present, fetch the corresponding profile row:
   - `select * from public.user_profiles where id = auth.uid()`
4. Subscribe to `onAuthStateChange`:
   - Update `user` on `SIGNED_IN`, `TOKEN_REFRESHED`, `SIGNED_OUT`.

### 4.3 SSR session availability (for loaders)
To ensure SSR route loaders can query user-specific data:
1. Implement server helpers that create a Supabase server client per-request.
2. Expose a small server API (via `createServerFn` or server-route) that returns:
   - the current Supabase auth user (or null)
   - the user profile + roles

This is where server cookie adaptation matters (per your SSR selection).

---

## 5) Wire login & signup routes to Supabase

Update `[src/routes/login.tsx](src/routes/login.tsx)` and `[src/routes/signup.tsx](src/routes/signup.tsx)`.

### 5.1 Login (email/password)
1. Replace the current `login(email)` fake call with Supabase `signInWithPassword({ email, password })`.
2. Handle errors:
   - show `toast.error(message)`
3. On success:
   - show a success toast
   - navigate to a post-login destination (e.g., `/` or a redirect param)

### 5.2 Signup (email/password)
1. Replace fake `signup(username, email)` with Supabase `signUp`:
   - include `options.data` (or a follow-up profile update) so the username can be stored.
2. Determine whether email confirmation is required:
   - If enabled, handle the UI state ("check your inbox").
3. Default role assignment is handled in DB (see schema section), not in the client.

### 5.3 Google OAuth
1. Replace/remove Discord/Facebook "UI-only demo" OAuth buttons.
2. Add a "Continue with Google" button that calls:
   - `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`
3. Add an auth callback route if needed (recommended for clean navigation):
   - e.g. `src/routes/auth/callback.tsx` (or similar)
   - it triggers session detection and then navigates to redirect target.

---

## 6) Replace Navbar user display with real profile

Update `[src/components/Navbar.tsx](src/components/Navbar.tsx)`:
- Keep the same UI structure, but source:
  - username/avatar from `useAuth().user`
  - log out from `useAuth().logout()`

Also ensure there are no assumptions about `user` being non-null when logged out.

---

## 7) Build the Supabase user system: profiles + roles + role history

### 7.1 Core tables (minimum for auth integration)
Create (at least) the following tables:

1. `public.user_profiles`
   - `id uuid primary key references auth.users(id) on delete cascade`
   - `username text unique not null`
   - `display_name text`
   - `avatar_url text`
   - `bio text`
   - `account_status text` (e.g., `active|suspended|banned`)
   - `created_at timestamptz`

2. Role system (supports multiple roles + history):
   - `public.roles`
     - `key text primary key` (e.g., `buyer`, `seller`, `verified_trader`, `moderator`, `admin`)
     - `label text`
   - `public.user_role_history`
     - `id bigserial pk`
     - `user_id uuid references auth.users(id) on delete cascade`
     - `role_key text references public.roles(key)`
     - `status text` (e.g., `granted`, `revoked`)
     - `assigned_by uuid null references auth.users(id)`
     - `reason text null`
     - `created_at timestamptz default now()`
   - A view or function `public.user_roles_current` that returns the latest active roles per user.

3. Seller approval flow tables:
   - `public.seller_applications`
     - `user_id`, submitted data, admin review status, timestamps

### 7.2 Business rules encoding

1. Default Buyer role on signup
   - Implement with a trigger that runs when `user_profiles` is created.
   - The trigger should grant `buyer` in `user_role_history`.

2. Seller approval
   - New users start as `buyer`.
   - They request seller role by creating a row in `seller_applications`.
   - Admin/moderator approves by granting `seller`.

3. Verified Trader computation
   - Implement thresholds based on trade + review history.
   - Recommended defaults (editable later via admin settings):
     - minimum completed trades: `>= 25`
     - minimum average review rating: `>= 4.6`
     - dispute/chargeback count: `= 0` (or below a small threshold)
   - When thresholds are met, automatically grant `verified_trader`.
   - When thresholds no longer hold (if you support demotion), revoke.

4. Admin capabilities
   - Admin can grant/revoke any role.
   - Admin can suspend/ban any user via `user_profiles.account_status`.
   - Suspended/banned users should be denied access via RLS checks (and optionally client-side guards).

---

## 8) Add marketplace data models that connect to real users

Your current app uses mock `src/data/*` for listings/items, reviews, and seller profiles.
To tie "mock user references" to real users, you'll need real tables that relate to `user_profiles`.

### 8.1 Recommended tables for a Roblox trading marketplace

Core marketplace:
- `public.listings`
  - `id uuid`
  - `seller_id uuid references auth.users(id)`
  - `title text`, `description text`
  - `item_type` (Hat/Face/Accessory/Gear/Bundle)
  - `price_php numeric`, (and optional pricing fields)
  - `rap numeric`
  - `status text` (draft|published|hidden|sold)
  - `created_at`, `updated_at`

- `public.trades`
  - represents a purchase/trade lifecycle
  - `buyer_id`, `seller_id`
  - `listing_id`
  - `status text` (pending|escrowed|completed|cancelled|disputed)
  - `escrow_reference` (optional)
  - `completed_at`

- `public.reviews`
  - `trade_id` or `completed_trade_id`
  - `reviewer_id` and `reviewed_id` (or derive from trade)
  - `rating int`, `comment text`, `created_at`

Trust & dispute:
- `public.flags`
  - `listing_id` / `user_id`
  - `reported_by`, `reason`, `status` (open|reviewing|resolved|hidden)

- `public.disputes`
  - `trade_id`, `initiator_id`, `status`, `moderator_id`, resolution notes

Buyer UX:
- `public.watchlists`
  - `user_id`, listing ids (normalize via `watchlist_items`)
- `public.notifications`
  - user_id, type, payload, read/unread

### 8.2 Migration path for current mock pages
Phase 1 (ship auth + profile):
- Keep marketplace listings UI but replace seller + user profile parts.

Phase 2 (migrate items fully):
- Replace `src/data/items.ts`, `src/data/users.ts`, `src/data/reviews.ts` with Supabase queries.

---

## 9) Replace the user profile route to use Supabase

Update `[src/routes/user.$username.tsx](src/routes/user.$username.tsx)`:
- Convert the loader to fetch:
  - public profile by `username`
  - seller's listings
  - seller's reviews/ratings

Security:
- Public profile reads should not expose sensitive fields (email, account status, etc.).
- Only show public-facing fields based on RLS.

---

## 10) RLS (Row Level Security) policy design

### 10.1 Add SQL helper functions
Create Postgres functions used in policies:
- `public.has_role(role_key text)` returns boolean for `auth.uid()`
- `public.is_admin()`
- `public.is_moderator()`
- `public.is_seller_owner(listing_id)` (or policy checks directly)

### 10.2 RLS policies per table (high-level)

- `public.user_profiles`
  - SELECT: public can read public fields (or allow SELECT on a view)
  - SELECT: user can read full own profile
  - UPDATE: user can update own editable fields (avatar_url, bio, display_name)
  - INSERT: only server/admin via triggers (client inserts should be disallowed)

- `public.user_role_history` / `public.user_roles_current`
  - SELECT: user can read own history
  - INSERT/UPDATE: only admin (or a dedicated security definer RPC)

- `public.seller_applications`
  - INSERT: authenticated user
  - SELECT: user can read own; admin/moderator can read all
  - UPDATE: admin/moderator can change review status

- `public.listings`
  - SELECT: public can browse
  - INSERT: authenticated users with `seller` role
  - UPDATE: only listing owner (seller) and if listing is not sold/disputed
  - DELETE: avoid permanent deletes for audit; prefer status change (`hidden`, `cancelled`)

- `public.trades`
  - SELECT: participants (buyer/seller)
  - UPDATE: only allowed transitions via server-side privileged functions

- `public.reviews`
  - INSERT: only participants after trade completion
  - SELECT: public read or buyer/seller read (choose to match UI)

- `public.flags` and `public.disputes`
  - INSERT: authenticated users
  - UPDATE: moderators/admin can transition status; user can only create/cancel their own flag if still open

- `public.notifications`
  - SELECT/UPDATE: user can access only own notifications

### 10.3 "Cache safety" for auth-related SSR responses
- Ensure SSR endpoints that write cookies are never publicly cached.
- When using `@supabase/ssr`, apply the cache headers in `setAll(cookiesToSet, headers)`.

---

## 11) Privileged operations: Edge Functions / server RPC

Use Supabase Edge Functions and/or server-side SQL RPCs for operations that require privilege escalation:
- Grant/revoke roles (admin-only)
- Resolve disputes and finalize trades
- Hide listings flagged as severe (moderator/admin)

Recommendation:
- Keep permission checks in SQL (RLS + `security definer` functions), and use Edge/server functions as orchestration.

---

## 12) Add the role-based pages (suggested routes)

All pages are under `src/routes/` (file-based routing; do not edit `routeTree.gen.ts`).

### 12.1 General user pages
- `GET /profile` (public view)
- `GET /settings/profile` (private editable)
- `GET /login`, `GET /signup`
- `POST /logout` (or handle in component)

### 12.2 Buyer pages
- `GET /buyer/purchases`
- `GET /buyer/watchlist`
- `GET /buyer/disputes` (if applicable)

### 12.3 Seller pages
- `GET /seller/dashboard`
- `GET /seller/listings`
- `GET /seller/listings/new`
- `GET /seller/listings/$listingId` (edit)
- `POST /seller/listings/:id/delete` (or use status=hidden instead of delete)
- `GET /seller/sales`

### 12.4 Moderator pages
- `GET /moderator/queue` (flagged listings + dispute review)

### 12.5 Admin pages
- `GET /admin/dashboard`
- `GET /admin/users` (roles, verification, ban/suspend)
- `GET /admin/moderation` (global controls)
- `GET /admin/reports` (flag/dispute triage)
- `GET /admin/settings`

Implementation note:
- UI can hide inaccessible navigation, but RLS must be authoritative.

---

## 13) Step-by-step implementation sequence (recommended)

This sequence avoids breaking auth and lets you verify each layer incrementally.

1. **Supabase provisioning**
   - Create project, enable email/password.
   - Configure Google OAuth.
   - Create buckets.
   - Enable auth audit logs.

2. **Database schema + RLS**
   - Create `user_profiles` + role tables + seller applications.
   - Add default buyer trigger.
   - Add helper functions and RLS policies for profiles/roles.
   - Add minimal "marketplace" tables needed by profile page (listings + reviews) if you want the seller profile page to become real in the same iteration.

3. **App dependencies + Supabase clients**
   - Add `@supabase/supabase-js` + `@supabase/ssr`.
   - Add `.env.example` and wire config reading.
   - Create `browserClient` and `serverClient`.

4. **Refactor AuthContext**
   - Replace localStorage logic in `[src/context/AuthContext.tsx](src/context/AuthContext.tsx)`.
   - Implement session bootstrap + profile loading.
   - Keep `AuthProvider` wrapper in `[src/routes/__root.tsx](src/routes/__root.tsx)`.

5. **Wire login/signup**
   - Update `[src/routes/login.tsx](src/routes/login.tsx)` and `[src/routes/signup.tsx](src/routes/signup.tsx)` to call Supabase.
   - Update OAuth UI to Google OAuth (remove UI-only providers).

6. **Add auth callback route (if needed)**
   - Create `src/routes/auth/callback.tsx` to resolve OAuth redirect and navigate.

7. **Update Nav + profile route**
   - Update `[src/components/Navbar.tsx](src/components/Navbar.tsx)` to show profile data.
   - Update `[src/routes/user.$username.tsx](src/routes/user.$username.tsx)` to load from Supabase.

8. **Replace mock user-backed data**
   - Replace `src/data/users.ts`, `src/data/items.ts`, `src/data/reviews.ts` calls with real Supabase queries behind typed client functions.
   - Ensure `ItemCard` + `item.$id` show real seller/profile data.

9. **Implement role upgrade flows**
   - Add seller request UI (likely under `/settings` or `/seller/apply`).
   - Add admin page UI to review applications and grant `seller`.

10. **Implement Verified Trader logic**
    - Add trade completion counting + review rating aggregation.
    - Implement role grant/revoke based on thresholds.

11. **Add moderator/admin moderation + RLS hardening**
    - Create flags/disputes tables.
    - Add moderator queue UI.
    - Add admin user management UI.

12. **Verification & security QA**
    - Manually test: sign up, login, refresh persistence, logout.
    - Test Google OAuth redirect.
    - Verify RLS: unauthorized users cannot write/see restricted data.

---

## 13.5) Admin & Marketplace Database Tables (completed)

Created `supabase/migrations/002_admin_tables.sql` with 7 tables:

| Table | Purpose |
|---|---|
| `public.listings` | Item listings with seller FK, type enum, price/rap, status |
| `public.trades` | Trade lifecycle with buyer/seller/listing FKs |
| `public.reviews` | Post-trade ratings linked to trades |
| `public.flags` | Reported content (targets listing OR user) |
| `public.disputes` | Trade dispute resolution flow |
| `public.notifications` | Per-user notification queue |
| `public.platform_settings` | Key/value config with defaults |

Includes: RLS policies, updated_at triggers, indexes, helper function `set_updated_at()`.

---

## 14) UI/UX conventions to follow during implementation

- Use Sonner (`toast.success`, `toast.error`, etc.)—the app already mounts `Toaster` in `[src/routes/__root.tsx](src/routes/__root.tsx)`.
- Do not add modals for user-specific flows; use routes under `src/routes/`.
- Keep color tokens semantic (use classes like `text-brand-red`, `bg-surface`, `border-zinc-800`).
- All new UI should use shadcn/ui components + Lucide icons.

---

## 15) Explicit open decisions to confirm during implementation

These are not blocking for the plan, but they must be chosen before coding:
- Email verification: required or not.
- Verified Trader thresholds and whether demotion is supported.
- Seller approval workflow UX (request form fields; required proof).
- Whether we create a dedicated `/profile` route (public) in addition to `/user/$username`.

---

## 16) Deliverables (what will be "done" when this implementation completes)

1. AuthContext is Supabase-backed (no localStorage fake auth).
2. `/login` and `/signup` perform real Supabase auth.
3. Google OAuth works end-to-end (redirect + session restoration).
4. Supabase tables exist for:
   - `user_profiles`
   - roles + role history
   - role workflows for buyer/seller/verified_trader
5. RLS policies ensure users only access permitted data.
6. Existing auth-aware UI (Navbar, messages gate) works with real session state.
7. At least the seller/public profile flow (`/user/$username`) is backed by Supabase instead of mock `src/data/*`.

---

## 17) Admin UI — Layout, Sidebar & Mock Pages

### 17.1 Create admin layout route

- Create `src/routes/admin.tsx` as a layout route with:
  - Left sidebar (using existing `ui/sidebar` shadcn component)
  - Admin top bar with profile avatar + username + dropdown (reuse Navbar's dropdown style)
  - Main content area with `<Outlet />`
  - `AdminGuard` wrapper at layout level (remove per-page guards from child routes)
  - This replaces the root `Navbar + Footer` for all `/admin/*` routes

### 17.2 Build sidebar navigation

Links:

| Label | Path | Icon | Access |
|---|---|---|---|
| Dashboard | `/admin/dashboard` | `LayoutDashboard` | admin + moderator |
| User Management | `/admin/users` | `Users` | admin only |
| Seller Applications | `/admin/seller-applications` | `FileText` | admin + moderator |
| Listings | `/admin/listings` | `Package` | admin + moderator |
| Trades | `/admin/trades` | `ShoppingBag` | admin + moderator |
| Moderation | `/admin/moderation` | `ShieldCheck` | admin + moderator |
| Settings | `/admin/settings` | `Settings` | admin only |

### 17.3 Build admin top bar

- Mobile sidebar toggle (hamburger, uses `SidebarTrigger` from shadcn/ui)
- Page title or breadcrumb in the center area
- Right side: profile avatar + username button (exact same style as `Navbar.tsx`: `bg-surface ring-1 ring-zinc-800 rounded-full pl-1 pr-3 py-1`)
- Dropdown menu: Profile, View Public Profile, separator, Log out
- Branding: dark theme, `text-brand-red`, `bg-surface`, `border-zinc-800`

### 17.4 Enhance dashboard with quick actions

- Keep existing 4 stat cards with mock counts
- Add a "Quick Actions" section below stats with shortcut buttons:
  - "Review Pending Approvals" → `/admin/seller-applications`
  - "Review Open Reports" → `/admin/moderation`
  - "View All Listings" → `/admin/listings`
- Keep the Role Reference section
- Keep the Setup Admin SQL section

### 17.5 Populate remaining admin pages with mock data

**`/admin/users`** — User Management
- shadcn/ui `Table` with columns: Avatar, Username, Email, Roles (badges), Status, Actions
- Actions: Grant/Revoke role dropdown, Suspend/Ban button
- Mock 8–10 user rows

**`/admin/seller-applications`** — Seller Applications
- Table with columns: Username, Full Name, Reason, Submitted Date, Status, Actions
- Actions: Approve / Reject buttons
- Mock 4–5 application rows (mix of pending/approved/rejected)

**`/admin/listings`** — Listings Management (new page)
- Table with columns: Title, Seller, Type, Price, RAP, Status, Actions
- Actions: Hide / Publish toggle button
- Mock 6–8 listing rows

**`/admin/trades`** — Trades Management (new page)
- Table with columns: ID, Buyer, Seller, Listing, Status, Created Date, Actions
- Actions: Cancel trade, Mark dispute
- Mock 5–6 trade rows

**`/admin/moderation`** — Moderation
- Two tabs: Flags | Disputes
- Flags table: Reported By, Target (listing/user), Reason, Status, Actions
- Disputes table: Initiator, Trade ID, Status, Moderator, Resolution
- Mock 3–4 rows per tab

**`/admin/settings`** — Platform Settings
- Form fields (mock, no save logic yet):
  - Verified Trader Min Trades (text input, default `25`)
  - Verified Trader Min Rating (text input, default `4.6`)
  - Seller Commission % (text input, default `5.0`)
- Save button (shows toast, stores in-memory state)

### 17.6 Files to create/modify

| Action | File |
|---|---|
| **Create** | `src/routes/admin.tsx` (layout route with sidebar + top bar + Outlet) |
| **Create** | `src/components/AdminSidebar.tsx` (sidebar navigation content) |
| **Create** | `src/components/AdminTopBar.tsx` (top bar with profile dropdown) |
| **Create** | `src/lib/admin/mockData.ts` (centralized mock data arrays) |
| **Modify** | `src/routes/admin/dashboard.tsx` (add quick actions section) |
| **Modify** | `src/routes/admin/users.tsx` (replace placeholder with table) |
| **Modify** | `src/routes/admin/seller-applications.tsx` (replace placeholder with table) |
| **Create** | `src/routes/admin/listings.tsx` (new listings management page) |
| **Create** | `src/routes/admin/trades.tsx` (new trades management page) |
| **Modify** | `src/routes/admin/moderation.tsx` (replace placeholder with tabs + tables) |
| **Modify** | `src/routes/admin/settings.tsx` (replace placeholder with form) |
| **Check** | `src/routeTree.gen.ts` (auto-generated, verify admin routes nest under admin layout) |

### 17.7 Design decisions

- `item_type` stays a hardcoded enum (`Hat`, `Face`, `Accessory`, `Gear`, `Bundle`) — no dynamic categories table needed yet.
- Mock data lives in `src/lib/admin/mockData.ts` for now; will be replaced with Supabase queries in Phase 5.
- Admin layout replaces the root `Navbar` and `Footer` entirely — no duplicate nav when in `/admin/*`.
- Sidebar uses shadcn/ui `Sidebar` component (already exists at `src/components/ui/sidebar.tsx`).
- Profile dropdown in admin top bar reuses the same visual style as `Navbar.tsx` for branding consistency.

---

## 17) Admin UI — Layout, Sidebar & Mock Pages

### 17.1 Overview

Replace placeholder admin pages with a dedicated admin layout (sidebar + top bar) that replaces the root Navbar/Footer for all `/admin/*` routes. Populate each page with shadcn/ui components using mock data.

### 17.2 Files to create

| File | Purpose |
|---|---|
| `src/lib/admin/mockData.ts` | Centralized mock data for all admin pages |
| `src/components/AdminSidebar.tsx` | Left sidebar with navigation links |
| `src/components/AdminTopBar.tsx` | Top bar with profile avatar + dropdown |
| `src/routes/admin.tsx` | Layout route wrapping sidebar + top bar + `<Outlet />` |
| `src/routes/admin/listings.tsx` | Listings management page (new) |
| `src/routes/admin/trades.tsx` | Trades management page (new) |

### 17.3 Files to modify

| File | Change |
|---|---|
| `src/routes/admin/dashboard.tsx` | Add Quick Actions section below stat cards |
| `src/routes/admin/users.tsx` | Replace placeholder with user table + role actions |
| `src/routes/admin/seller-applications.tsx` | Replace placeholder with applications table |
| `src/routes/admin/moderation.tsx` | Replace placeholder with Flags / Disputes tabs |
| `src/routes/admin/settings.tsx` | Replace placeholder with config form |

### 17.4 Sidebar navigation

| Label | Path | Icon | Guard |
|---|---|---|---|
| Dashboard | `/admin/dashboard` | `LayoutDashboard` | AdminGuard |
| User Management | `/admin/users` | `Users` | AdminOnlyGuard |
| Seller Applications | `/admin/seller-applications` | `FileText` | AdminGuard |
| Listings | `/admin/listings` | `Package` | AdminGuard |
| Trades | `/admin/trades` | `ShoppingBag` | AdminGuard |
| Moderation | `/admin/moderation` | `ShieldCheck` | AdminGuard |
| Settings | `/admin/settings` | `Settings` | AdminOnlyGuard |

### 17.5 Layout architecture

```
src/routes/admin.tsx (layout route)
├── <AdminGuard> (at layout level)
│   ├── <SidebarProvider>
│   │   ├── <AdminSidebar /> (left)
│   │   ├── <AdminTopBar /> (top right of content area)
│   │   └── <Outlet /> (page content)
│   └── </SidebarProvider>
└── </AdminGuard>
```

- Remove per-page `AdminGuard` / `AdminOnlyGuard` wrappers; enforce at layout level
- `/admin/users` and `/admin/settings` redirect non-admin users via layout-level check
- Sidebar hides nav items the user doesn't have access to

### 17.6 Mock data structure

Centralized in `src/lib/admin/mockData.ts`:

- `MOCK_USERS` (10 users) — id, username, email, avatar_url, roles[], account_status, created_at
- `MOCK_SELLER_APPLICATIONS` (5 apps) — id, user_id, user_name, full_name, reason, status, created_at
- `MOCK_LISTINGS` (8 listings) — id, seller_id, seller_name, title, item_type, price_php, rap, status, created_at
- `MOCK_TRADES` (6 trades) — id, listing_id, listing_title, buyer_id, buyer_name, seller_id, seller_name, status, created_at
- `MOCK_FLAGS` (4 flags) — id, listing_id, listing_title, reported_by_name, reason, status, created_at
- `MOCK_DISPUTES` (3 disputes) — id, trade_id, initiator_name, status, created_at

### 17.7 UI conventions (same as root)

- shadcn/ui components (`Table`, `Button`, `Badge`, `Tabs`, `Card`, `Input`, `Select`, `Avatar`, `DropdownMenu`)
- Lucide icons
- Semantic Tailwind classes: `bg-surface`, `ring-1 ring-zinc-800`, `text-brand-red`, `border-zinc-800`
- Dropdown menu in top bar matches root Navbar exactly: `bg-surface ring-1 ring-zinc-800 rounded-full pl-1 pr-3 py-1`
- Sonner toasts for actions
- Dark theme throughout
