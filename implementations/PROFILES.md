---
name: User Profiles & Navbar Avatar Dropdown
overview: Create a private /profile page for logged-in users to view/manage their profile, and update the navbar dropdown to show avatar images and link to the new profile page.
todos: []
isProject: false
---

# User Profiles & Navbar Avatar Dropdown

This plan adds a dedicated **private profile page** (`/profile`) where any logged-in user (regardless of role) can view their identity, trading stats, and edit their display name/bio. It also updates the navbar's user dropdown to show the real avatar image (or a fallback) and link to the new profile page.

Assumptions:
- Supabase Auth + `AuthContext` are already wired (per the prior implementation).
- The `user` object from `useAuth()` includes `id`, `username`, `display_name`, `avatar_url`, `bio`, `account_status`, `roles[]`.
- Navbar dropdown and logout already work — those are not touched.

---

## 1) New `/profile` route (private, logged-in only)

Layout: **Single-page profile hub with inline editing** (no tabs).

### Section A — Profile Header (always visible)

```
┌─────────────────────────────────────────────┐
│  [Avatar]   Display Name         [Edit]     │
│             @username                        │
│             Bio text here...                 │
│             buyer • seller                   │
│             Member since Jan 2025            │
├─────────────────────────────────────────────┤
│  Trades: 12    Rating: ★ 4.8    Status: Act.│
├─────────────────────────────────────────────┤
│  (if editing)                               │
│  Display Name: [________]                   │
│  Bio:         [________]                    │
│  Avatar:      [Upload]                      │
│  [Save] [Cancel]                            │
└─────────────────────────────────────────────┘
```

1. **Avatar section**
   - If `avatar_url` exists, render `<img>` with rounded styling.
   - Otherwise, fallback to the first-letter circle (current behavior in navbar).
   - In edit mode: a file input that uploads to Supabase Storage (`user-avatars/{userId}/avatar.png`), then updates `user_profiles.avatar_url`.

2. **Identity section**
   - Display name (editable when in edit mode)
   - @username (always visible, not editable)
   - Bio (editable when in edit mode; textarea, max ~200 chars)
   - Roles as badge pills (same styling as dashboard: `bg-brand-red/10 ring-1 ring-brand-red/20 text-brand-red`)
   - "Member since" — formatted from `created_at`

3. **Stats row** — small stat cards (same style as dashboard's `StatCard`):
   - Trades completed (0 for now — placeholder until trades are real)
   - Average rating (— for now)
   - Account status (Active / Suspended / Banned)
   - Link to `/user/$username` ("View Public Profile →")

4. **Edit mode** — toggled by an "Edit Profile" button in the header:
   - Inline form for `display_name` and `bio`
   - Avatar upload button
   - Save calls Supabase: `update user_profiles set display_name = $1, bio = $2, avatar_url = $3 where id = $4`
   - Cancel reverts to original values
   - Toast on success/failure

### Route implementation details

- File: `src/routes/profile.tsx`
- Guard: wrap in `<AuthGuard>` (imported from `@/components/RouteGuards`)
- Data: all from `useAuth().user` (already loaded by AuthContext) — no extra loader needed
- Edit mutations: use `supabase.from('user_profiles').update(...)` directly or via a server function

---

## 2) Update Navbar dropdown (`src/components/Navbar.tsx`)

### Avatar button
- Current: `<div className="size-7 rounded-full bg-brand-red grid place-items-center text-xs font-bold text-white">{user?.username.slice(0, 1).toUpperCase()}</div>`
- New: if `user?.avatar_url` exists, render `<img src={avatar_url} className="size-7 rounded-full object-cover" />`. Otherwise keep the fallback letter.

### Dropdown menu items
- Change "My Profile" → link to `/profile` (instead of `/user/$username`)
- Add a secondary item "View Public Profile" → `/user/$username` (below Profile)
- Keep "Messages", separator, "Log out" — unchanged

Before:
```
My Profile  →  /user/$username
Messages
---
Log out
```

After:
```
Profile        →  /profile
View Public Profile  →  /user/$username
Messages
---
Log out
```

---

## 3) Supabase Storage for avatars (if not already set up)

- Bucket: `user-avatars` (already listed in the prior plan but may not exist)
- Upload path: `{userId}/avatar.{ext}`
- RLS: authenticated users can INSERT/UPDATE in `user-avatars` only where path prefix matches own `auth.uid()`
- On upload: get public URL, write to `user_profiles.avatar_url`

If the bucket doesn't exist, create it via Supabase dashboard or migration. This step is small and can be done alongside the code.

---

## 4) Checklist (PHASE_1 update)

- [x] Create `src/routes/profile.tsx` with AuthGuard
- [x] Profile header: avatar (image or fallback), display name, username, bio, roles, member since
- [x] Stats row: trades, rating, account status
- [x] View Public Profile link
- [x] Edit mode toggle with inline fields for display_name, bio
- [x] Avatar upload (file picker → Supabase Storage → update avatar_url)
- [x] Save mutation against `user_profiles` table
- [x] Toast notifications for save success/failure
- [x] Navbar avatar: show real image when `avatar_url` exists
- [x] Navbar dropdown: "Profile" → /profile, add "View Public Profile" → /user/$username
- [x] Verify bucket `user-avatars` exists and RLS is configured
- [ ] Test: log in, visit /profile, see data, edit fields, upload avatar, see navbar update
- [ ] Test: avatar fallback still works for users without avatar_url

---

## 5) Future considerations (not in scope)

- `/user/$username` public profile: replace mock data with real DB queries
- Trades count and rating: wire to real trades/reviews tables when those are built
- Avatar cropping/resizing before upload
- Email verification badge, linked Roblox account badge
- Profile tabs if more sections are added later (e.g., activity feed, reviews given)
