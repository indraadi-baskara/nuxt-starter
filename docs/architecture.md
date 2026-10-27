# Architecture — Vem Garage

## Stack

- **Nuxt `4.6.1` / Nitro `2.13.5` / Vite `8.3` / Vue `3.5`** — SSR with file-based routing (`pages/`), auto-imported `components/` (`nuxt.config.ts:7` `pathPrefix: false`), `composables/` and `layouts/default.vue`.
- **Tailwind `4.x`** via `@tailwindcss/vite` (`nuxt.config.ts:8-9`, `assets/css/main.css`) — neo-brutalist tokens (black borders, `neo-shadow`, `surface-container` palette from Stitch).
- **DB**: Neon Postgres + `drizzle-orm` + `neon-http`/`pg` dual driver (`server/db/index.ts:1-36`).
- **Auth**: `nuxt-auth-utils` + `bcryptjs` + `jose`, session encrypted with `NUXT_SESSION_PASSWORD`.
- **Deploy**: Netlify SSR (`nitro.preset: netlify` only when `NETLIFY=1` — `nuxt.config.ts:12`).

## Project structure

```
app.vue / app.config.ts
pages/
  index.vue                 # TelemetryTicker + HeroSukuCadang + FeaturedCatalog + VinWorkshopSection
  katalog.vue               # PLP + FilterPanel + GarasiSaya (VIN 4-cascade)
  produk/[id].vue           # PDP: metrology table, compatibility, bundle, VIN-check
  keranjang.vue             # cart optimizer + B2B summary
  checkout.vue              # address + courier + fee → POST /api/orders → /pesanan/[id]
  pesanan/[id].vue + index.vue
  cek-keaslian.vue          # serial verify → POST /api/cek-keaslian
  lokasi.vue                # depot picker → GET /api/depot + /api/depot/:id lots
  bantuan.vue               # SOP retur, 4 pillars, ticket form
  verifikasi.vue            # B2B NIB → POST /api/bengkel/verify
  layanan-bengkel.vue       # directory → GET /api/bengkel
  dashboard.vue             # account + GarasiSaya + staff panel (orders/bengkel/pricing)
  auth/login.vue + register.vue
components/
  atoms/       VgButton, VgCard, VgInput, VgSelect, ...
  molecules/   AppHeader (3-layer), AppTopBar, AppNav, BreadcrumbTelemetry, FilterPanel, CheckoutSteps ...
  organisms/   GarasiSaya, InventoryHeader, FeaturedCatalog, HeroSukuCadang, TelemetryTicker ...
layouts/default.vue
composables/   useAuth, useCart, useCatalog, useOrder (+ utils/)
server/
  db/          schema.ts, migrations/, index.ts (dual driver), seed.ts
  api/         cart.*, catalog.get, cek-keaslian.post, depot/*, bengkel/*, orders.*, docs/*, admin/*
  lib/auth.ts  hash/verify + requireEnvSessionPassword guard
  utils/migrate.ts  ensureMigrated() called by getDbAsync()
  middleware/  auth guard
  plugins/     startup seed/migrate
public/        favicon, images/hero.jpg, person-*.jpg
netlify.toml   build cmd + publish = dist
```

## Request flow (E2E)

```
Browser → AppHeader (cartCount via useCart) → page (useCatalog/useAuth)
  → $fetch /api/*
    → server/middleware (session) → server/api/* handler
      → server/db/index.ts getDb()/getDbAsync() → drizzle → Neon
      → server/lib/auth.ts (hash guard)
  ← JSON → composable state → page render
```

Checkout happy path:

1. `checkout.vue:18-51` validates `form` + falls back to `cart.items` if DB cart empty, sends `Idempotency-Key`, `credentials: include`.
2. `server/api/orders.post.ts` inserts `order` + `orderItem`, reserves `inventory_lot.reserved`, sets `fakturNo`/`suratJalanNo`.
3. Client `cart.clear()` → `navigateTo(/pesanan/:id)`.
4. `pesanan/[id].vue:20-54` fetches `/api/orders/:id`, normalizes `address` JSON (Neon HTTP returns text), fetches PDFs via `GET /api/docs/invoice?orderId=` / `surat-jalan`.

## State

- `composables/useCart.ts` — single source for cart count, subtotal, fmt, toast; syncs anonId → userId on login; B2B pricing override via `GET /api/bengkel/pricing?tier=`.
- `composables/useAuth.ts` — `fetchMe()`, `signIn/out`, `user` ref with `role`.
- `composables/useCatalog.ts` — `GET /api/catalog?q=&category=&vin=&page=`; VIN from `GarasiSaya`.
- `GarasiSaya.vue` — 4-cascade (brand → model → year → engine) + 17-digit VIN input → fitment guarantee; used in `katalog`, `produk/[id]`, `dashboard`.

## Key pages

- **katalog** — FACeted filter panel (`FilterPanel.vue`) + `InventoryHeader` telemetry (1,482 SKU strip) + `BreadcrumbTelemetry` + GarasiSaya sidebar.
- **produk/[id]** — image gallery, metrology table (HRC, GG20, Mitutoyo), compatibility check, bundle, related.
- **keranjang** — idempotency, B2B subtotal vs retail strikethrough, courier fee computed.
- **lokasi** — depot picker preserved from initial impl; added zonation Rings 1-4, dispatch telemetry, `inventory_lot` per SKU.
- **dashboard** — 3 views by role: customer (orders count + GarasiSaya), `gudang_picker`/`admin` (order status patch, bengkel approve/reject, pricing editor per tier).

## API surface (selected)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/catalog` | filtered product list |
| GET/POST/PATCH | `/api/cart*` | anon + auth cart |
| POST | `/api/orders` | create order (idempotent) |
| GET | `/api/orders` / `/api/orders/:id` | list/detail |
| POST | `/api/cek-keaslian` | serial → product |
| GET | `/api/depot` / `/api/depot/:id` | depot + lots |
| GET/POST | `/api/bengkel` / `/api/bengkel/verify` / `/api/bengkel/me` | B2B |
| GET | `/api/docs/invoice` / `surat-jalan` | PDF blobs |
| GET/PUT/PATCH | `/api/admin/orders` / `/status` / `/pricing` | staff |

## Conventions

- `Vg*` atoms are dumb (no fetch) — page/composable owns data.
- Border-2/3 black + `neo-shadow` + mono SKU is the brand — don't soften to Tailwind defaults.
- Keep `pages/*` full-bleed (`-m-6` + inner `max-w-7xl mx-auto`) for Stitch alignment.
