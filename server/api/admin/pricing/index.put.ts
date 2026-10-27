import { getDb } from "../../../db";
import { bengkelPricing } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
const Body = z.object({ sku: z.string().min(1), tier: z.string().min(1), price: z.number().int().min(0) });
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (!["admin"].includes(auth.user.role)) throw createError({ statusCode: 403, message: "Admin only" });
  const { sku, tier, price } = Body.parse(await readBody(event));
  const db = getDb();
  const existing = await db.select().from(bengkelPricing).where(and(eq(bengkelPricing.sku, sku), eq(bengkelPricing.tier, tier))) as any[];
  const id = existing[0]?.id ?? `bp_${sku}_${tier}_${Date.now()}`;
  if (existing.length) {
    await db.update(bengkelPricing).set({ price }).where(and(eq(bengkelPricing.sku, sku), eq(bengkelPricing.tier, tier)));
  } else {
    await db.insert(bengkelPricing).values({ id, sku, tier, price });
  }
  return { ok: true, sku, tier, price };
});
