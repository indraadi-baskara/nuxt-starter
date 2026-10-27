import { getDb } from "../../../../db";
import { inventoryLot, order, orderItem } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
const Body = z.object({ status: z.enum(["packing","shipped","delivered","cancelled"]) });
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (!["admin","gudang_picker"].includes(auth.user.role)) throw createError({ statusCode: 403, message: "Forbidden" });
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const { status } = Body.parse(await readBody(event));
  const db = getDb();
  const [existing] = await db.select().from(order).where(eq(order.id, id));
  if (!existing) throw createError({ statusCode: 404, message: "Order not found" });
  const prev = existing.status;
  await db.update(order).set({ status }).where(eq(order.id, id));
  // inventory lifecycle: on shipped/delivered decrement qty and release reserved; on cancelled release reserved
  if (['shipped','delivered','cancelled'].includes(status) && prev !== status) {
    try {
      const items = await db.select().from(orderItem).where(eq(orderItem.orderId, id)) as any[];
      for (const it of items) {
        let need = it.qty;
        const lots = await db.select().from(inventoryLot).where(eq(inventoryLot.sku, it.sku)) as any[];
        // prefer lots with reserved first
        for (const lot of lots.sort((a: any,b: any)=> (b.reserved ?? 0) - (a.reserved ?? 0))) {
          if (need <= 0) break;
          const take = Math.min(need, Math.max(0, lot.reserved ?? 0));
          if (take <= 0 && status !== 'cancelled') {
            // fallback: direct qty deduct if no reserved (legacy orders)
            const avail = lot.qty;
            const take2 = Math.min(need, avail);
            if (take2 > 0) await db.update(inventoryLot).set({ qty: lot.qty - take2 }).where(eq(inventoryLot.id, lot.id));
            need -= take2;
            continue;
          }
          if (status === 'cancelled') {
            await db.update(inventoryLot).set({ reserved: Math.max(0, (lot.reserved ?? 0) - take) }).where(eq(inventoryLot.id, lot.id));
          } else {
            await db.update(inventoryLot).set({ qty: Math.max(0, lot.qty - take), reserved: Math.max(0, (lot.reserved ?? 0) - take) }).where(eq(inventoryLot.id, lot.id));
          }
          need -= take;
        }
      }
    } catch (e: any) { console.warn('[inventory] status side-effect warn:', e.message?.slice(0,200)) }
  }
  return { ok: true, status };
});
