import { getDb } from "../../../db";
import { inventoryLot, product } from "../../../db/schema";
import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing depot id" });
  const db = getDb();
  const lots = await db.select().from(inventoryLot).where(eq(inventoryLot.depotId, id)) as any[];
  const enriched: any[] = [];
  for (const l of lots) {
    const [p] = await db.select().from(product).where(eq(product.sku, l.sku)) as any[];
    enriched.push({ ...l, product: p ? { sku: p.sku, title: p.title, brand: p.brand, price: p.price, image: p.image } : null, available: (l.qty ?? 0) - (l.reserved ?? 0) });
  }
  return { depotId: id, lots: enriched };
});
