# 0) pin toolchain — every dev same node + pnpm
echo "20" > .nvmrc && cp .nvmrc .node-version
corepack enable
corepack prepare pnpm@11.20.0 --activate
pnpm --version; node --version

# 1) deps: Neon Postgres (drop better-sqlite3)
pnpm add pg
pnpm add -D @types/pg
pnpm remove better-sqlite3 2>/dev/null; true

# pin packageManager + engines + db scripts in package.json:5
python3 <<'PY'
import json, pathlib
p = pathlib.Path("package.json")
d = json.loads(p.read_text())
d["packageManager"] = "pnpm@11.20.0"
d["engines"] = {"node": ">=20", "pnpm": ">=11"}
d.setdefault("scripts", {}).update({
  "dev": "nuxt dev",
  "build": "nuxt build",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:seed": "tsx server/db/seed.ts",
  "db:setup": "pnpm db:migrate && pnpm db:seed",
  "postinstall": "nuxt prepare",
})
p.write_text(json.dumps(d, indent=2)+"\n")
print("package.json patched")
PY

# 2) Drizzle → Neon PG
cat > drizzle.config.ts <<'EOF'
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
EOF

cat > server/db/index.ts <<'EOF'
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;
export function getDb() {
  if (db) return db;
  pool = new Pool({ connectionString: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
  db = drizzle(pool, { schema });
  return db;
}
export type Db = ReturnType<typeof getDb>;
EOF

# 3) schema sqliteTable → pgTable
sed -i '' 's/sqliteTable/pgTable/g; s#drizzle-orm/sqlite-core#drizzle-orm/pg-core#g' server/db/schema.ts 2>/dev/null || sed -i 's/sqliteTable/pgTable/g; s#drizzle-orm/sqlite-core#drizzle-orm/pg-core#g' server/db/schema.ts
# then open server/db/schema.ts:1 — ensure import is:
# import { pgTable, text, integer, boolean, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core"
# and replace integer(...,{mode:"boolean"}) → boolean(...) and integer(...,{mode:"timestamp"}) → timestamp(...)

# 3b) Better Auth provider → pg
# in server/lib/auth.ts:12 change provider: "sqlite" → provider: "pg"

mkdir -p scripts docs
cat > scripts/setup.sh <<'EOF'
#!/bin/sh
set -e
[ -f .env ] || { cp .env.example .env; echo "→ Fill .env DATABASE_URL + BETTER_AUTH_SECRET"; }
corepack enable
corepack prepare pnpm@11.20.0 --activate
pnpm install
pnpm db:setup
echo "✓ Ready — pnpm dev → http://localhost:3002"
EOF
chmod +x scripts/setup.sh

cat > netlify.toml <<'EOF'
[build]
  command = "pnpm build"
  publish = ".output/public"
[build.environment]
  NODE_VERSION = "20"
EOF

cat > docs/dev-setup.md <<'EOF'
# Dev Setup — Vem Garage (Neon)
1. `git clone && cd vem-garage`
2. `cp .env.example .env` — paste Neon branch URL + `BETTER_AUTH_SECRET=$(openssl rand -base64 32)`
3. `./scripts/setup.sh` — or `pnpm install && pnpm db:setup`
4. `pnpm dev` → http://localhost:3002
Rules: edit `server/db/schema.ts:1` → `pnpm db:generate` → commit `server/db/migrations/*` → `pnpm db:migrate`. Seed is idempotent.
EOF

cat > .env.example <<'EOF'
DATABASE_URL=postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET= # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3002
STITCH_API_KEY= # per-dev GCP key — opencode.json:7 uses ${STITCH_API_KEY}
EOF

# 4) Neon: create project at neon.tech → copy pooled URL into .env
cp -n .env.example .env 2>/dev/null; echo "→ edit .env DATABASE_URL now"

# 5) migrate + seed Neon before build
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm build && echo "BUILD_OK"
