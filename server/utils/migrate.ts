import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { useStorage } from "#internal/nitro";

let migrated = false;
let migrating: Promise<void> | null = null;

export async function ensureMigrated(): Promise<void> {
  if (migrated) return;
  if (migrating) return migrating;
  migrating = (async () => {
    const url = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) {
      console.warn("[migrate] skip: no DATABASE_URL");
      return;
    }
    // Use drizzle-kit migrate via direct SQL so we don't shell out
    // Minimal: check if expected table exists; if not, run the SQL migration file(s)
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
    try {
      const check = await pool.query("SELECT to_regclass('public.\"user\"') as exists_col");
      if (check.rows[0]?.exists_col) {
        console.log("[migrate] tables already present, skip");
        migrated = true;
        return;
      }
      console.log("[migrate] tables missing — running initial migration");
      let sql: string | null = null;
      for (const key of ["assets:migrations", "assets:server", "raw"] as const) {
        try {
          const storage = useStorage(key as any);
          sql = (await storage.getItem("0000_deep_dreaming_celestial.sql")) as string | null;
          if (sql) break;
        } catch {}
      }
      if (!sql) {
        const sqlFile = join(process.cwd(), "server/db/migrations/0000_deep_dreaming_celestial.sql");
        sql = await readFile(sqlFile, "utf8");
      }
      // Split on drizzle breakpoints and exec each statement batch
      const chunks = sql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);
      for (const chunk of chunks) {
        if (!chunk) continue;
        try { await pool.query(chunk); } catch (e: any) {
          // Ignore already-exists errors (idempotent on redeploy)
          if (!/already exists/i.test(e.message)) throw e;
        }
      }
      console.log("[migrate] done");
      migrated = true;
    } catch (e: any) {
      console.error("[migrate] failed:", e.message?.slice(0, 500));
      throw e;
    } finally {
      await pool.end().catch(() => {});
    }
  })();
  return migrating;
}
