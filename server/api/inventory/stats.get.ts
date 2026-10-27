import { getDb } from "../../db";
import { inventoryLot, product } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb();
  const activeProducts = await db.select().from(product).where(eq(product.active, true)) as any[];
  const lots = await db.select().from(inventoryLot) as any[];

  const totalSku = activeProducts.length;
  let totalQty = 0;
  let reserved = 0;
  for (const l of lots) {
    totalQty += l.qty ?? 0;
    reserved += l.reserved ?? 0;
  }
  const available = Math.max(0, totalQty - reserved);
  const readyRatio = totalQty > 0 ? (available / totalQty) * 100 : 100;
  const readyRatioFormatted = `${readyRatio.toFixed(1)}%`;

  const byDepot = new Map<string, { depotId: string; totalQty: number; reserved: number; skus: number }>();
  for (const l of lots) {
    if (!byDepot.has(l.depotId)) byDepot.set(l.depotId, { depotId: l.depotId, totalQty: 0, reserved: 0, skus: 0 });
    const d = byDepot.get(l.depotId)!;
    d.totalQty += l.qty ?? 0;
    d.reserved += l.reserved ?? 0;
  }
  for (const d of byDepot.values()) {
    d.skus = new Set(lots.filter((l) => l.depotId === d.depotId).map((l) => l.sku)).size;
  }

  return {
    totalSku,
    totalSkuFormatted: new Intl.NumberFormat("id-ID").format(totalSku),
    totalQty,
    reserved,
    available,
    readyRatio,
    readyRatioFormatted,
    depots: [...byDepot.values()],
    updatedAt: new Date().toISOString(),
  };
});
