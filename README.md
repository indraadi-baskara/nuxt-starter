# Vem Garage — Suku Cadang Asli Semarang

Depot Pengapon SMG-01 · OEM neo-brutalist storefront · Neon Postgres · Netlify SSR.

> Starter was `netlify-templates/nuxt-starter`. This repo is now Vem Garage: catalog with VIN-fitment (`GarasiSaya`), B2B tiers 8/12/18%, depot inventory reservations, serial verification, PDF e-Faktur/surat jalan.

## Stack

| Layer | Choice |
|-------|--------|
| Runtime | Nuxt `4.6.1` · Vue `3.5` · Vite `8.3` · Nitro `2.13` |
| Styling | Tailwind CSS `4.x` via `@tailwindcss/vite` `nuxt.config.ts:8-9` |
| Icons/Images | `@nuxt/icon` + `@nuxt/image` |
| Auth | `nuxt-auth-utils` + `bcryptjs` · session via `runtimeConfig.session.password` `nuxt.config.ts:21` |
| DB | Neon Postgres · `drizzle-orm` `0.45` + `drizzle-kit` `0.31` · `pg` + `@neondatabase/serverless` |
| PDF | `pdf-lib` (e-Faktur, surat jalan) |
| Deploy | Netlify SSR (`Nitro preset: netlify` `nuxt.config.ts:12`) — see `docs/deployment.md` |
| Design | Google Stitch MCP `opencode.json:3-12` → `components/*` neo-brutalist |

## Quick start

```bash
cp .env.example .env          # fill NUXT_DATABASE_URL + NUXT_SESSION_PASSWORD
./scripts/setup.sh            # or: pnpm install && pnpm db:setup
pnpm dev                      # http://localhost:3002
```

`scripts/setup.sh:1-8` does `pnpm install → db:migrate → db:seed`. Seed is idempotent.

## Project map

```
pages/           # katalog, produk/[id], keranjang, checkout, pesanan/[id], lokasi, cek-keaslian, bantuan, verifikasi, dashboard, layanan-bengkel, auth/*
components/      # atoms (VgButton, VgCard...), molecules (AppHeader, BreadcrumbTelemetry...), organisms (GarasiSaya, InventoryHeader...)
composables/     # useAuth, useCart, useCatalog, useOrder
server/
  db/            # schema.ts, migrations/, index.ts, seed.ts
  api/           # cart, catalog, orders, depot, cek-keaslian, bengkel, docs/*
  utils/migrate.ts # runtime migrate guard (also build-time via netlify.toml)
  plugins/       # auth, seed guard
layouts/         # default (AppHeader + AppTopBar + AppFooter)
assets/css/main.css
netlify.toml     # publish = dist (netlify preset) · Node 22
```

Full structure and flows: `docs/architecture.md`.

## Env (never commit `.env`)

`.env.example:1-7` is the source of truth. Secrets are empty strings in `nuxt.config.ts:16-22` and read only from `NUXT_*` at runtime (`server/db/index.ts:13`, `server/lib/auth.ts:9-10`).

| Var | Where set | Purpose |
|-----|-----------|---------|
| `NUXT_DATABASE_URL` (or `DATABASE_URL` fallback) | Netlify env · local `.env` | Neon connection — `server/db/index.ts:13` guards missing → throw |
| `NUXT_SESSION_PASSWORD` (min 32 chars) | Netlify env · local `.env` | `runtimeConfig.session.password` → `nuxt-auth-utils` |
| `STITCH_API_KEY` | local `.env` only | Stitch MCP `opencode.json:7` `X-Goog-Api-Key: ${STITCH_API_KEY}` |

Details + history purge: `docs/security.md`.

## Common commands

```bash
pnpm dev            # local SSR
pnpm build          # prod build (NETLIFY=1 → netlify preset, else node-server)
pnpm preview        # preview .output/server
pnpm db:generate    # after editing server/db/schema.ts
pnpm db:migrate     # apply server/db/migrations/*
pnpm db:seed        # idempotent seed
pnpm db:setup       # migrate + seed
```

## Deploy

Netlify: `netlify.toml:2-3` `command = pnpm db:migrate || ... ; pnpm build` → `publish = dist` (see `docs/deployment.md` for the `dist` vs `.output/public` gotcha).

## Docs

- `docs/dev-setup.md` — local setup, branch Neon, migrations
- `docs/architecture.md` — stack, routing, state, API surface
- `docs/deployment.md` — Netlify preset, build, env, troubleshooting
- `docs/security.md` — secrets discipline, history rewrite
- `docs/design.md` — Stitch project `10326246268030541000`

## Support

Issues live in this repo. Before filing, run `pnpm build` locally and check `docs/deployment.md#troubleshooting`.
