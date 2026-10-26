import { getDb } from "../db";
import { cart } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
const Body = z.object({ sku: z.string().min(1), qty: z.number().int().min(1).max(99).default(1) });
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  const body = Body.parse(await readBody(event));
  let anonId = getCookie(event, "vg_anon") || getHeader(event, "x-anon-id") as string | undefined;
  if (!auth?.user && !anonId) {
    anonId = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setCookie(event, "vg_anon", anonId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  const db = getDb();
  const whereOwner: any = auth?.user ? eq(cart.userId, auth!.user.id) : eq(cart.anonId, anonId!);
  const existing = (await db.select().from(cart).where(whereOwner)).find((r) => r.sku === body.sku);
  if (existing) {
    await db.update(cart).set({ qty: existing.qty + body.qty }).where(eq(cart.id, existing.id));
  } else {
    await db.insert(cart).values({ id: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, userId: auth?.user?.id ?? null, anonId: anonId ?? null, sku: body.sku, qty: body.qty });
  }
  return { ok: true, anonId };
});
