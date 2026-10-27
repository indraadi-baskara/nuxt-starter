import { getDb } from "../../../db";
import { bengkelPricing, product } from "../../../db/schema";
import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (!["admin","gudang_picker"].includes(auth.user.role)) throw createError({ statusCode: 403, message: "Forbidden" });
  const db = getDb();
  const q = getQuery(event) as any;
  const tier = q.tier as string | undefined;
  const rows = tier ? await db.select().from(bengkelPricing).where(eq(bengkelPricing.tier, tier)) : await db.select().from(bengkelPricing) as any[];
  const enriched = [];
  for (const r of rows as any[]) {
    const [p] = await db.select().from(product).where(eq(product.sku, r.sku)) as any[];
    enriched.push({ ...r, product: p ? { sku: p.sku, title: p.title, price: p.price, brand: p.brand } : null });
  }
  return { items: enriched };
});
