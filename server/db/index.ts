import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function getDatabaseUrl(): string {
  // Prefer Nitro runtimeConfig (populated from NUXT_DATABASE_URL at runtime),
  // fall back to bare env for local dev / drizzle-kit CLI
  try {
    const cfg = useRuntimeConfig() as any;
    if (cfg.databaseUrl) return cfg.databaseUrl;
  } catch {}
  const env = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
  if (!env) throw new Error("Missing DATABASE_URL (set NUXT_DATABASE_URL or DATABASE_URL env)");
  return env;
}

export function getDb() {
  if (db) return db;
  const url = getDatabaseUrl();
  pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 30000,
    max: 5,
  });
  pool.on("error", (err) => console.error("[db] pool error", (err as any)?.message ?? err));
  db = drizzle(pool, { schema });
  return db;
}
export type Db = ReturnType<typeof getDb>;
