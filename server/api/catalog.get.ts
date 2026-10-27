import { ensureMigrated } from "../utils/migrate";
import { getDb } from "../db";
import { product } from "../db/schema";
import { like, or, and, eq } from "drizzle-orm";
import { logRouteError } from "../utils/logError";
export default defineEventHandler(async (event) => {
  try {
    await ensureMigrated();
    const q = getQuery(event) as Record<string, string>;
    const db = getDb();
  let rows = await db.select().from(product).where(eq(product.active, true));
  const term = (q.q || "").toLowerCase();
  if (term) rows = rows.filter((r) => [r.sku, r.title, r.subtitle ?? "", r.brand].join(" ").toLowerCase().includes(term));
    if (q.brand) rows = rows.filter((r) => r.brand === q.brand);
    if (q.category) rows = rows.filter((r) => r.category === q.category);
    // Neon HTTP returns json-mode columns as strings — normalize specs
    const norm = (v: any) => {
      if (!v) return v
      if (typeof v === 'string') { try { const p = JSON.parse(v); return typeof p === 'string' ? JSON.parse(p) : p } catch { return v } }
      return v
    }
    const items = (rows as any[]).map((r: any) => ({ ...r, specs: norm(r.specs) }));
    return { items, total: items.length };
  } catch (err: any) {
    if (err?.statusCode) throw err;
    logRouteError("catalog", err);
    throw createError({ statusCode: 500, message: err instanceof Error ? err.message : "Server Error" });
  }
});
