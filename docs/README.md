# Vem Garage — Knowledge Base

> Start with `README.md` (quick start). This folder is the long-form reference.

| Doc | What it answers |
|-----|-----------------|
| `dev-setup.md` | Clone → `.env` → `./scripts/setup.sh` → `pnpm dev` on `:3002` |
| `architecture.md` | Stack, `pages/`/`server/api` map, composables, checkout flow |
| `deployment.md` | Netlify Nitro `dist` vs `.output/public`, `NETLIFY=1` preset, env, build command |
| `database.md` | Neon branching, Drizzle schema/migrations/seed |
| `security.md` | Secrets contract (empty `runtimeConfig`), history purge, rotation |
| `design.md` | Stitch `10326246268030541000` → repo mapping, neo-brutalist tokens |

## Key invariants (don't break)

1. **Secrets empty in bundle**: `nuxt.config.ts:16-22` `runtimeConfig.databaseUrl = ""` — real values only from `NUXT_DATABASE_URL` / `NUXT_SESSION_PASSWORD` (`server/db/index.ts:13`, `server/lib/auth.ts:9-10`).
2. **Publish is `dist`**: `netlify.toml:3` must stay `dist` for `preset: netlify` (`nuxt.config.ts:12`). Local `.output/public` is for `node-server` only — see `deployment.md#the-dist-vs-outputpublic-gotcha`.
3. **Migrations committed**: after `server/db/schema.ts` edit → `pnpm db:generate` → commit `server/db/migrations/*`.

## Changing the knowledge base

Edit `docs/*.md` directly (no build step). Keep `file_path:line_number` refs accurate — check before PR.
