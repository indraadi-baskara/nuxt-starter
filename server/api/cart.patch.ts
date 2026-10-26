import { getDb } from "../db";
import { cart } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
const Body = z.object({ id: z.string().optional(), sku: z.string().optional(), qty: z.number().int().min(0).max(99), op: z.enum(["set", "inc", "dec", "remove"]).optional() });
export default defineEventHandler(async (event) => {
  const b = Body.parse(await readBody(event));
  const db = getDb();
  let row: any = null;
  if (b.id) [row] = await db.select().from(cart).where(eq(cart.id, b.id));
  else if (b.sku) [row] = await db.select().from(cart).where(eq(cart.sku, b.sku));
  if (!row) throw createError({ statusCode: 404, message: "Cart item not found" });
  if (b.op === "remove" || b.qty === 0) await db.delete(cart).where(eq(cart.id, row.id));
  else if (b.op === "inc") await db.update(cart).set({ qty: row.qty + 1 }).where(eq(cart.id, row.id));
  else if (b.op === "dec") await db.update(cart).set({ qty: Math.max(1, row.qty - 1) }).where(eq(cart.id, row.id));
  else await db.update(cart).set({ qty: b.qty }).where(eq(cart.id, row.id));
  return { ok: true };
});
