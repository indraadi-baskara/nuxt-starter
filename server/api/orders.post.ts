import { getDb } from "../db";
import { bengkelPricing, bengkelProfile, order, orderItem, cart, product, inventoryLot } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { rateLimit, getClientIp } from "../utils/ratelimit";
const Body = z.object({
  customer: z.object({ name: z.string().min(2), phone: z.string().min(8), address: z.string().min(8), note: z.string().optional() }),
  courier: z.string().min(1),
  items: z.array(z.object({ sku: z.string(), qty: z.number().int().min(1) })).optional(),
});
const courierFee: Record<string, number> = { "SAME-DAY SMG (45 MENIT)": 25000, "REGULER J&T / JNE (1-2 HARI)": 15000, "AMBIL DI DEPOT PENGAPON": 0 };
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Login required" });
  const ip = getClientIp(event);
  const rl = rateLimit(`order:${auth.user.id}:${ip}`, 5, 60_000);
  if (!rl.ok) throw createError({ statusCode: 429, message: "Too many orders, retry later" });
  const body = Body.parse(await readBody(event));
  const idempotencyKey = getHeader(event, "idempotency-key") || getHeader(event, "Idempotency-Key") as string | undefined;
  const db = getDb();
  if (idempotencyKey) {
    const [existing] = await db.select().from(order).where(eq(order.idempotencyKey, idempotencyKey));
    if (existing) return existing;
  }
  let items = body.items;
  if (!items) {
    const rows = await db.select().from(cart).where(eq(cart.userId, auth.user.id));
    items = rows.map((r) => ({ sku: r.sku, qty: r.qty }));
  }
  if (!items?.length) throw createError({ statusCode: 400, message: "Cart empty" });
  // resolve B2B tier if partner
  let b2bTier: string | null = null;
  let b2bBySku = new Map<string, number>();
  if (auth.user.role === 'bengkel_partner') {
    try {
      const [bp] = await db.select().from(bengkelProfile).where(eq(bengkelProfile.userId, auth.user.id)) as any[];
      if (bp?.tier) b2bTier = bp.tier; else b2bTier = 'tier-1';
      const rows = await db.select().from(bengkelPricing).where(eq(bengkelPricing.tier, b2bTier)) as any[];
      b2bBySku = new Map(rows.map((r: any) => [r.sku, r.price]));
    } catch {}
  }
  let subtotal = 0;
  const enriched: Array<{ sku: string; title: string; price: number; qty: number; image?: string }> = [];
  for (const it of items) {
    const [p] = await db.select().from(product).where(eq(product.sku, it.sku));
    if (!p) throw createError({ statusCode: 400, message: `SKU not found: ${it.sku}` });
    const unit = b2bBySku.get(p.sku) ?? p.price;
    subtotal += unit * it.qty;
    enriched.push({ sku: p.sku, title: p.title, price: unit, qty: it.qty, image: p.image ?? undefined });
  }
  const fee = courierFee[body.courier] ?? 0;
  const total = subtotal + fee;
  const id = `VG-ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-SMG`;
  const fakturNo = `010.${id.slice(-3)}/${new Date().getFullYear()}/DJP`;
  const sjNo = `SJ-${id.replace("VG-ORD-", "")}`;
  await db.insert(order).values({ id, userId: auth.user.id, status: "created", subtotal, fee, total, courier: body.courier, address: body.customer as any, fakturNo, suratJalanNo: sjNo, idempotencyKey: idempotencyKey ?? null });
  for (const e of enriched) {
    await db.insert(orderItem).values({ id: `oi_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, orderId: id, sku: e.sku, title: e.title, price: e.price, qty: e.qty, image: e.image ?? null });
  }
  // clear cart
  const cartRows = await db.select().from(cart).where(eq(cart.userId, auth.user.id));
  for (const r of cartRows) await db.delete(cart).where(eq(cart.id, r.id));
  const [created] = await db.select().from(order).where(eq(order.id, id));
  return created;
});
