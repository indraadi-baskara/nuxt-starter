# Dev Setup — Vem Garage (Neon)
1. `git clone && cd vem-garage`
2. `cp .env.example .env` — paste Neon branch URL + `BETTER_AUTH_SECRET=$(openssl rand -base64 32)`
3. `./scripts/setup.sh` — or `pnpm install && pnpm db:setup`
4. `pnpm dev` → http://localhost:3002
Rules: edit `server/db/schema.ts:1` → `pnpm db:generate` → commit `server/db/migrations/*` → `pnpm db:migrate`. Seed is idempotent.
