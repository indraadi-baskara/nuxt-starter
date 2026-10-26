import { getDb } from "../db";
import { product } from "../db/schema";
import { like, or, and, eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, string>;
  const db = getDb();
  let rows = await db.select().from(product).where(eq(product.active, true));
  const term = (q.q || "").toLowerCase();
  if (term) rows = rows.filter((r) => [r.sku, r.title, r.subtitle ?? "", r.brand].join(" ").toLowerCase().includes(term));
  if (q.brand) rows = rows.filter((r) => r.brand === q.brand);
  if (q.category) rows = rows.filter((r) => r.category === q.category);
  return { items: rows, total: rows.length };
});
