# Database — Neon Postgres + Drizzle

## Choice

SQLite → Neon Postgres (`d48429a`): managed Postgres, branchable per dev, works over 443 via `@neondatabase/serverless` `neon()` HTTP driver — avoids `pg` pool egress issues on Netlify.

## Connection

- `server/db/index.ts:1-36` dual driver:
  - **HTTP (default)**: `neon(url)` + `drizzleHttp` — used by all handlers via `getDb()` (sync, no pool).
  - **PG pool (optional)**: `drizzlePg(new Pool({ connectionString }))` via `getDbPg()` for transactions.
- `getDatabaseUrl()` `server/db/index.ts:10-18` checks `runtimeConfig.databaseUrl` (`NUXT_DATABASE_URL`) first, then `NUXT_DATABASE_URL` / `DATABASE_URL` env. Throws if missing.
- `drizzle.config.ts:7` uses the same env for `drizzle-kit generate/migrate`.

## Schema

`server/db/schema.ts:1-146`:

| Table | PK | Notes |
|-------|----|-------|
| `user` | `id` | `role: customer|bengkel_partner|gudang_picker|admin`, `email` unique |
| `session` | `id` | `token` unique, `userId` FK cascade |
| `account` | `id` | `providerId: credential|wa-otp`, `password` hashed |
| `product` | `sku` | `price` IDR int, `specs` json, `active` |
| `inventory_lot` | `id` | `sku` FK, `depotId` default `SMG-01`, `rak`, `qty`, `reserved` |
| `cart` | `id` | `userId` or `anonId`, `sku` FK |
| `order` | `id` (`VG-ORD-...-SMG`) | `status: created|packing|shipped|delivered|cancelled`, `subtotal/fee/total`, `courier`, `address` json, `fakturNo`, `suratJalanNo`, `idempotencyKey` unique |
| `order_item` | `id` | `orderId` FK, `sku`, `price`, `qty` |
| `bengkel_profile` | `id` | `userId` FK, `nib`, `status: pending|verified|rejected`, `tier: tier-1..3` |
| `bengkel_pricing` | `id` | `sku` FK + `tier`, `price` B2B |
| `serial` | `code` | `sku` FK, `verified`, `orderId`, `assignedAt` |
| `verification` | `id` | OTP flows |
| `auth_event` | `id` | audit |

Indexes: `server/db/schema.ts:16,26,68,77` etc.

## Migrations

```
server/db/migrations/
  0000_deep_dreaming_celestial/  # initial pg
  0001_daffy_quasimodo/           # b2b_pricing
  0002_optimal_clint_barton/      # serial orderId+assignedAt (3d03120)
```

- After editing `server/db/schema.ts`:

```bash
pnpm db:generate   # writes new 00xx_*/meta + snapshot.json — commit all
pnpm db:migrate   # apply locally
```

- Build-time: `netlify.toml:2` `pnpm db:migrate` (soft-fail → runtime guard)
- Runtime: `server/utils/migrate.ts` `ensureMigrated()` called from `server/db/index.ts:19` `getDbAsync()` — lazily applies `server/db/migrations` bundled via `serverAssets: [{ baseName: "migrations", dir: "server/db/migrations" }]` `nuxt.config.ts:14`.

Seed: `server/db/seed.ts` `pnpm db:seed` / `pnpm db:setup` — idempotent; auto-seeds B2B tiers (`ada958c`) and depot inventory.

## Branching (Neon)

- Create a Neon branch per feature → `NUXT_DATABASE_URL` points at branch URL → `pnpm db:migrate && pnpm db:seed`.
- Merges: migrations are additive; if two branches add same `00xx` prefix, re-run `pnpm db:generate` on `main` to de-duplicate.

## Operations

- Inspect: `psql $NUXT_DATABASE_URL -c "\d product"`
- Reset locally: drop Neon branch, repoint URL, `pnpm db:setup`
- `pg` SSL warning (`verify-ca treated as verify-full`) is expected with `sslmode=require` — see `server/db/migrations` deploy log; set `verify-full` explicitly to silence.
