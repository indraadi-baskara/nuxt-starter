# Security — Secrets & History

> Secrets were once inlined with fallbacks (`dev-secret-change-me-32chars!!`). They were purged from git history and replaced with runtime-only injection. This doc explains the contract and how to stay safe.

## The contract

1. **Never commit `.env`.** `.gitignore:21-24` covers `.env` + `.env.*` (except `!.env.example`). If you see `.env` in `git status`, stop — don't `git add -f`.
2. **Never inline fallbacks.** `nuxt.config.ts:16-22` keeps `runtimeConfig.databaseUrl` + `session.password` as empty strings. Real values come only from `NUXT_*` env at runtime.
3. **Guards at the edges.** `server/db/index.ts:10-18` throws `Missing DATABASE_URL` if no URL. `server/lib/auth.ts:9-24` enforces `NUXT_SESSION_PASSWORD ≥ 32 chars`. No “dev-change-me” fallback.

## Env vars

| Var | Example | Where |
|-----|---------|-------|
| `NUXT_DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` | Netlify env + local `.env` |
| `DATABASE_URL` | same | local fallback alias (also used by `drizzle.config.ts:7`) |
| `NUXT_SESSION_PASSWORD` | `openssl rand -base64 32` | Netlify env + local `.env` — min `32` chars |
| `BETTER_AUTH_SECRET` | legacy alias | accepted as fallback in `server/lib/auth.ts:18` — prefer `NUXT_SESSION_PASSWORD` |
| `STITCH_API_KEY` | `AQ.Ab8RN6...` | local `.env` only — `opencode.json:7` `X-Goog-Api-Key: ${STITCH_API_KEY}` |

`.env.example:1-7` is canonical. Copy and fill — don't paste real values into docs or commits.

## How secrets flow

```
Build time: nuxt.config.ts runtimeConfig = { databaseUrl: "", session: { password: "" } }
            → bundle contains no secret literal, only key names

Runtime:    Nitro applyEnv maps NUXT_DATABASE_URL → runtimeConfig.databaseUrl
            → server/db/index.ts:11 cfg.databaseUrl || env.NUXT_DATABASE_URL || env.DATABASE_URL
            → server/lib/auth.ts:12 cfg.session.password || env.NUXT_SESSION_PASSWORD
```

Netlify injects `NUXT_*` from **Site Settings → Environment variables** — never bake them into `netlify.toml`.

## History purge (done — don't recreate fallbacks)

From commit `2e2c891` forward, 24 commits were rewritten to strip hardcoded `dev-secret-change-me-32chars!!` / `dev-change-me-32-chars-minimum!!!!` fallbacks:

- Edited `662db83` / `df2c631` / `44efde2` → `BETTER_AUTH_SECRET= # openssl rand -base64 32` → `0f2d391` empty strings
- `.gitignore:26` adds `.netlify` (build cache)
- Force-pushed `31c323d..865e348` with `--force-with-lease`, deleted `backup/main-before-purge`

Verification after purge:

```bash
git log 2e2c891..HEAD -p | grep -E "dev-secret-change-me|dev-change-me|npg_dOG3zkm|ep-aged-fog|AQ\.Ab8RN6" # 0 hits
git ls-remote origin main | cut -f1 # == HEAD on origin (865e348 lineage)
ls .env 2>&1; git ls-files -- .env  # .env exists locally, never tracked
```

Old commits remain in reflog for 90 days (`git reflog`) but contain no real secrets (only placeholders that were stripped).

## Checklist before pushing

```bash
git diff --cached -p | grep -E "NUXT_DATABASE_URL|NUXT_SESSION_PASSWORD|STITCH_API_KEY|npg_|AQ\.Ab8" # must be 0
pnpm build                # ensures no missing-env throw at bundle time (guards still run)
git log -1 -p --stat      # eyeball — no .env, no secret literal
```

## If you leak again

1. Rotate the secret at source (Neon → new branch URL, `NUXT_SESSION_PASSWORD` → fresh `openssl rand -base64 32` + invalidate sessions).
2. `git filter-repo` or `git rebase -i` the offending commits (like the prior purge), force-push with `--force-with-lease`.
3. Verify: `git log origin/main -p | grep <leaked>` → 0, Netlify env rotated.

## Secrets scanning

Netlify build log includes `Scanning for secrets in code and build output. ... 125 file(s) scanned. No secrets detected` — keep `runtimeConfig` empty so this stays green.
