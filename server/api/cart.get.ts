import { getDb } from "../db";
import { bengkelPricing, bengkelProfile, cart, product } from "../db/schema";
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
  // enrich with product + B2B pricing if partner
  let b2bBySku = new Map<string, number>();
  if (auth?.user?.role === 'bengkel_partner') {
    try {
      const [bp] = await db.select().from(bengkelProfile).where(eq(bengkelProfile.userId, auth.user.id)) as any[];
      const tier = bp?.tier ?? 'tier-1';
      const pr = await db.select().from(bengkelPricing).where(eq(bengkelPricing.tier, tier)) as any[];
      b2bBySku = new Map(pr.map((r: any) => [r.sku, r.price]));
    } catch {}
  }
  const enriched = [];
  for (const c of rows) {
    const [p] = await db.select().from(product).where(eq(product.sku, c.sku));
    if (!p) { enriched.push({ ...c, product: p }); continue; }
    const b2b = b2bBySku.get(c.sku);
    enriched.push({ ...c, product: b2b ? { ...p, b2bPrice: b2b, priceOriginal: p.price, b2bTier: b2bBySku.size ? 'tier' : undefined } : p });
  }
  return { items: enriched };
});
