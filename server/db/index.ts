import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { Pool } from "pg";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzlePg> | ReturnType<typeof drizzleHttp> | null = null;
let dbMode: "pg" | "http" | null = null;

function getDatabaseUrl(): string {
  try {
    const cfg = useRuntimeConfig() as any;
    if (cfg.databaseUrl) return cfg.databaseUrl;
  } catch {}
  const env = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
  if (!env) throw new Error("Missing DATABASE_URL (set NUXT_DATABASE_URL or DATABASE_URL env)");
  return env;
}

export async function getDbAsync() {
  const { ensureMigrated } = await import("../utils/migrate");
  await ensureMigrated();
  return getDb();
}

export function getDb() {
  if (db) return db as any;
  const url = getDatabaseUrl();
  // Sync path: use HTTP driver (works over 443, no pg pool needed).
  // Async pg path available via getDbPg() if caller needs transactions.
  const client = neon(url);
  (client as any).__isNeonHttp = true;
  db = drizzleHttp(client as any, { schema }) as any;
  dbMode = "http";
  return db as any;
}

// Optional: pg-backed DB for transactions / heavy writes
export async function getDbPg() {
  const url = getDatabaseUrl();
  if (db && dbMode === "pg") return db as any;
  if (db && dbMode === "http") {
    // Already on HTTP — return it; callers that require pg must handle this
    return db as any;
  }
  pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 30000,
    max: 5,
  });
  pool.on("error", (err) => console.error("[db] pool error", (err as any)?.message ?? err));
  db = drizzlePg(pool, { schema }) as any;
  dbMode = "pg";
  return db as any;
}

export type Db = ReturnType<typeof getDb>;
