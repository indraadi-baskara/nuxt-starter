import { getDb } from "../../db";
import { bengkelPricing, bengkelProfile, product } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const db = getDb();
  const q = getQuery(event) as any;
  // determine tier: partner locked to own tier unless admin; others can query any via ?tier=
  let tier: string | undefined = q.tier as string | undefined;
  if (auth.user.role === 'bengkel_partner') {
    try {
      const [bp] = await db.select().from(bengkelProfile).where(eq(bengkelProfile.userId, auth.user.id)) as any[];
      const own = (bp as any)?.tier as string | undefined;
      if (own) tier = own; // partner always sees own tier regardless of query
      else if (!tier) tier = 'tier-1';
    } catch { if (!tier) tier = 'tier-1'; }
  } else if (auth.user.role !== 'admin' && auth.user.role !== 'gudang_picker') {
    // customer: allow preview of tier-1 only
    tier = 'tier-1';
  }
  const rows = tier
    ? await db.select().from(bengkelPricing).where(eq(bengkelPricing.tier, tier)) as any[]
    : await db.select().from(bengkelPricing) as any[];
  const enriched = [];
  for (const r of rows) {
    const [p] = await db.select().from(product).where(eq(product.sku, r.sku)) as any[];
    enriched.push({ ...r, product: p ? { sku: p.sku, title: p.title, subtitle: p.subtitle, brand: p.brand, category: p.category, price: p.price, image: p.image } : null });
  }
  return { items: enriched, tier: tier ?? null, limit: tier ? ({ 'tier-1': 45_000_000, 'tier-2': 75_000_000, 'tier-3': 150_000_000 } as any)[tier] ?? 45_000_000 : null };
});
