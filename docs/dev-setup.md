# Dev Setup — Vem Garage

> `docs/` is the knowledge base. Start here for local setup; deploy details live in `docs/deployment.md`.

## Prereqs

- Node `22` (see `.nvmrc:1` / `.node-version:1` / `package.json:42-45` `engines`) — `nvm use && pnpm -v` (expects `pnpm@11.20.0` `package.json:41`)
- Neon Postgres branch (one per dev — see [Database](#database))

## 1. Clone & env

```bash
git clone git@github.com:indraadi-baskara/nuxt-starter.git vem-garage && cd vem-garage
cp .env.example .env
```

Fill `.env` (never commit — `.gitignore:21-24`):

```ini
# either is fine locally — server/db/index.ts:13 checks NUXT_DATABASE_URL first, then DATABASE_URL
NUXT_DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
NUXT_SESSION_PASSWORD=  # openssl rand -base64 32  (≥32 chars, server/lib/auth.ts:9-10 guards)
STITCH_API_KEY=         # optional — only if you use Stitch MCP (opencode.json:7)
```

`nuxt.config.ts:16-22` keeps `runtimeConfig.databaseUrl/session.password` empty in the bundle — secrets are injected only at runtime via `NUXT_*`.

## 2. Install & DB

```bash
./scripts/setup.sh
# equivalent manual:
# corepack enable && corepack prepare pnpm@11.20.0 --activate
# pnpm install
# pnpm db:setup   # = pnpm db:migrate && pnpm db:seed
```

`scripts/setup.sh:1-8` is the canonical path.

## 3. Run

```bash
pnpm dev   # http://localhost:3002 (custom port — not 3000)
```

Verify: `katalog → produk → keranjang → checkout → pesanan/[id]` with a test account. B2B tier pricing only appears after `verifikasi` → admin approves in `dashboard` → role becomes `bengkel_partner`.

## Database

- Schema: `server/db/schema.ts:1-146` (`user`, `session`, `product`, `inventory_lot`, `cart`, `order`, `orderItem`, `bengkelProfile`, `bengkelPricing`, `serial`, …)
- Config: `drizzle.config.ts:1-9` reads `NUXT_DATABASE_URL || DATABASE_URL`
- Workflow:

```bash
# after editing server/db/schema.ts:
pnpm db:generate      # writes server/db/migrations/*.sql — commit these
pnpm db:migrate      # apply locally
```

Migrations also run on Netlify (`netlify.toml:2`) and lazily at runtime via `server/utils/migrate.ts` → `server/db/index.ts:19` `ensureMigrated()`.

Seed (`server/db/seed.ts`) is idempotent — safe to re-run.

## Auth & roles

- `nuxt-auth-utils` session backed by `NUXT_SESSION_PASSWORD`
- Roles in `server/db/schema.ts:13`: `customer` (default) → `bengkel_partner` (after NIB verified) → `gudang_picker` / `admin` (manual)
- `composables/useAuth.ts` handles sign-in/out; guards in `server/api/*`

## Stitch (optional)

Stitch MCP is not required to build — only to regenerate neo-brutalist screens.

```bash
# .env: STITCH_API_KEY="AQ.Ab8..."
opencode  # opencode.json:3-12 exposes remote MCP https://stitch.googleapis.com/mcp
```

Project `Vems Garage Neo-Brutalist Storefront` `10326246268030541000` — see `docs/design.md`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Missing DATABASE_URL` | Set `NUXT_DATABASE_URL` in `.env` (or `DATABASE_URL`) |
| `NUXT_SESSION_PASSWORD must be >= 32 chars` | Regenerate `openssl rand -base64 32` |
| `pnpm` version error | `corepack prepare pnpm@11.20.0 --activate` |
| Port conflict | `pnpm dev` uses `3002` — check `nuxt.config.ts` or `PORT` env |
| Hydration warnings | Normal in dev — verify with `pnpm build && pnpm preview` |
