# Deployment — Netlify + Nitro

> Fixes the #1 foot-gun in this repo: **`netlify.toml:3` `publish` must be `dist`** when Nitro uses preset `netlify`. See [The `dist` vs `.output/public` gotcha](#the-dist-vs-outputpublic-gotcha).

## How it works

- `nuxt.config.ts:11-15`:

```ts
nitro: {
  preset: process.env.NETLIFY ? "netlify" : undefined,
  // ...
}
```

- On Netlify, `NETLIFY=1` is set by the platform → `preset: "netlify"` → Nitro emits:
  - **public** → `dist/` (`_nuxt/`, `images/`, `favicon.ico`, `_headers`, `_redirects`)
  - **functions** → `.netlify/functions-internal/server/` (`server.mjs`, `chunks/`, `nitro.json:preset=netlify`)
- Locally (`pnpm build` without `NETLIFY=1`) → `preset: undefined` → `preset: "node-server"` → `.output/public` + `.output/server` (`nitro.json:preset=node-server`). That's why `ls .output/public` works locally but not on Netlify.

- `netlify.toml:1-6`:

```toml
[build]
  command = "pnpm --silent db:migrate || echo \"[migrate] build-time migrate failed — runtime guard will retry\"; pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

Do **not** add `[functions].directory` — Netlify auto-discovers `.netlify/functions-internal`.

## Build command

`netlify.toml:2` does two steps:

1. `pnpm --silent db:migrate` — applies `server/db/migrations/*.sql` via `drizzle-kit` + `drizzle.config.ts:7` `NUXT_DATABASE_URL || DATABASE_URL`. If `DATABASE_URL` is missing/unreachable at build time (Neon cold-start), it fails softly and prints `[migrate] build-time migrate failed — runtime guard will retry`.
2. `pnpm build` — `nuxt build` → Nitro build.

Migrations also run **at runtime** on first DB hit: `server/db/index.ts:19` `getDbAsync()` → `server/utils/migrate.ts:ensureMigrated()`, so the app self-heals even if the build-time migrate bounced.

## Env vars

Set in **Netlify → Site → Environment variables** (never in `netlify.toml`):

| Var | Required | Notes |
|-----|----------|-------|
| `NUXT_DATABASE_URL` | yes | Neon URL `postgresql://...@ep-...neon.tech/neondb?sslmode=require`. `DATABASE_URL` also accepted as fallback (`server/db/index.ts:13`). |
| `NUXT_SESSION_PASSWORD` | yes | `openssl rand -base64 32` — ≥32 chars (`server/lib/auth.ts:9-10` guards) |
| `NUXT_DATABASE_URL` must include `sslmode=require` (or `verify-full`; `server/db/index.ts` logs the pg `verify-ca` warning) |

Local `.env` mirrors these (`docs/dev-setup.md`).

## Deploy checklist

- [ ] Netlify env has `NUXT_DATABASE_URL` + `NUXT_SESSION_PASSWORD`
- [ ] `netlify.toml:3` is `publish = "dist"` (not `.output/public`)
- [ ] No `[functions]` block overriding `.netlify/functions-internal`
- [ ] `NODE_VERSION = "22"` (matches `.nvmrc:1`)
- [ ] Migrations committed: `server/db/migrations/*.sql` after any `pnpm db:generate`

## The `dist` vs `.output/public` gotcha

Commit `9a0cd59` set `publish = "dist"` correctly for `preset: netlify`. Commit `ea5bc7b` regressed to `publish = ".output/public"` (correct for `preset: node-server` locally). Result on Netlify (`d26f0fd` fix):

```
Functions bundling: The Netlify Functions setting targets a non-existing directory: .output/server
Deploy directory '.output/public' does not exist
```

Fix was `d26f0fd`: restore `publish = "dist"` and remove any explicit `functionsDirectory`. If you reintroduce `.output/public`, Netlify will fail again — keep `dist` for `NETLIFY=1`.

## Observing a deploy

- Build log should show:
  - `Nitro preset: netlify` (not `node-server`)
  - `[nitro] Generated public dist`
  - `Σ Total size: ~14 MB` then `Packaging Functions from .netlify/functions-internal`
  - `Secrets scanning complete. No secrets detected`
- If you see `Nitro preset: node-server` on Netlify, `nuxt.config.ts:12` guard is not seeing `NETLIFY=1` — check Netlify build image.

## Rollback

Netlify → Deploys → pick previous `d26f0fd`-descendant. Locally:

```bash
git log --oneline -- netlify.toml
git show 9a0cd59:netlify.toml   # known-good
```

## Related

- `docs/dev-setup.md` — local Neon branch + `pnpm dev`
- `docs/security.md` — secrets never inlined, history purge
