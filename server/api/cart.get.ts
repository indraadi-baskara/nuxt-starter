import { getDb } from "../db";
import { cart, product } from "../db/schema";
import { eq, or } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  const anonId = getCookie(event, "vg_anon") || getHeader(event, "x-anon-id");
  const db = getDb();
  let rows: any[] = [];
  if (auth?.user) {
    rows = await db.select().from(cart).where(eq(cart.userId, auth.user.id));
    // merge anon cart if present
    if (anonId) {
      const anonRows = await db.select().from(cart).where(eq(cart.anonId, anonId));
      for (const r of anonRows) {
        await db.update(cart).set({ userId: auth.user.id, anonId: null }).where(eq(cart.id, r.id));
      }
      if (anonRows.length) rows = await db.select().from(cart).where(eq(cart.userId, auth.user.id));
    }
  } else if (anonId) {
    rows = await db.select().from(cart).where(eq(cart.anonId, anonId));
  }
  // enrich with product
  const enriched = [];
  for (const c of rows) {
    const [p] = await db.select().from(product).where(eq(product.sku, c.sku));
    enriched.push({ ...c, product: p });
  }
  return { items: enriched };
});
