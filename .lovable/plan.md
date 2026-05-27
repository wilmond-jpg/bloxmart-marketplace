## BloxMart — Build Plan

Frontend-only static site. No backend, no real auth, no payments. All data is mock; auth is faked via localStorage.

### Design tokens (locked from chosen direction)

- Background `#09090b`, surfaces `zinc-900`, borders `zinc-800`
- Brand red `#E2231A`, brand blue `#00A2FF`, foreground `zinc-100`
- Font: Inter (400/500/600), tight tracking on headings
- Card pattern: `rounded-2xl`, `ring-1 ring-white/5`, hover lift `-translate-y-1`
- Tokens written into `src/styles.css` as semantic variables (no hard-coded colors in components)

### Routes (TanStack file-based, under `src/routes/`)

1. `index.tsx` — Home (hero, trending grid, How It Works, payment partners, footer)
2. `marketplace.tsx` — Browse grid + filter sidebar (price range, item type, sort) + client-side search
3. `item.$id.tsx` — Item detail (gallery, description, seller card, Buy Now → "create account" modal, reviews)
4. `user.$username.tsx` — Profile (avatar, rating, badges, tabs: Listings/Sales/Reviews)
5. `login.tsx` — Email form + Discord/Facebook UI-only buttons
6. `signup.tsx` — Registration form + same OAuth UI
7. `payments.tsx` — GCash / Maya / PayPal explainer cards with "coming soon"
8. `messages.tsx` — Chat sidebar + thread view + simulated input

### Shared infrastructure

- `src/routes/__root.tsx` — wraps with `<Navbar />` + `<Outlet />` + `<Footer />` + currency provider
- `src/components/Navbar.tsx` — logo, search, PHP/USD toggle, Login/Sign Up (or avatar when "logged in")
- `src/components/Footer.tsx` — links + Roblox disclaimer
- `src/components/ItemCard.tsx` — reused on home + marketplace
- `src/components/BuyModal.tsx` — "Create an account to purchase"
- `src/context/CurrencyContext.tsx` — PHP/USD toggle, formats both, persists to localStorage
- `src/context/AuthContext.tsx` — fake auth (`isLoggedIn`, `user`), persists to localStorage; any input → logged in
- `src/data/` — `items.ts` (~20 dummy listings), `users.ts` (sellers + profiles), `reviews.ts`, `conversations.ts`, `messages.ts`
- `src/lib/format.ts` — currency formatter (PHP ₱ / USD $ with FX const)

### Item images

Generate ~8 unique Roblox-style item renders (crowns, wings, swords, masks, etc.) saved to `src/assets/items/`, imported into the mock data. Used across home, marketplace, and detail pages.

### Simulated interactions

- Login/Signup form submit → set localStorage flag → redirect to home; navbar swaps to avatar menu
- Currency toggle → updates all prices live
- Marketplace search/filters → pure client-side filter on the mock array
- Buy Now → opens modal (no purchase)
- Messages → typing sends to local state, appears in thread; no persistence beyond session

### Responsiveness & polish

- Mobile-first; navbar collapses, sidebar filters become a sheet on mobile, chat collapses to single-pane
- shadcn `Sheet`, `Dialog`, `Tabs`, `Slider`, `Input`, `Button` reused
- Smooth card hover, currency toggle micro-interaction

### Out of scope (explicit)

- No Lovable Cloud, no DB, no real auth/OAuth, no payment SDKs, no admin dashboard

### Technical notes

- All semantic colors via `src/styles.css` tokens — components reference `bg-card`, `text-foreground`, `text-brand-red`, etc.
- Every route file defines its own `head()` with unique title + description + OG tags
- `index.tsx` placeholder is fully replaced
- Image placeholders from the chosen prototype are realized as generated images, not stock photos