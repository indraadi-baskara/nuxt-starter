import { getDb } from "../db";
import { product, serial } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getClientIp, rateLimit } from "../utils/ratelimit";
const Body = z.object({ code: z.string().min(4) });
export default defineEventHandler(async (event) => {
  const { code } = Body.parse(await readBody(event));
  const ip = getClientIp(event);
  const rl = rateLimit(`cek:${ip}`, 20, 60_000);
  if (!rl.ok) throw createError({ statusCode: 429, message: "Terlalu banyak percobaan — coba lagi 1 menit." });
  const db = getDb();
  const normalized = code.trim().toUpperCase();
  const [row] = await db.select().from(serial).where(eq(serial.code, normalized));
  if (!row) return { ok: false, code: normalized, message: "Serial tidak dikenali. Periksa kembali atau hubungi Depot SMG-01 (024) 7692-8800.", product: null };
  const [prod] = await db.select().from(product).where(eq(product.sku, row.sku));
  if (!row.verified) return { ok: false, code: row.code, sku: row.sku, message: "Serial terdeteksi tapi belum diverifikasi depot — hubungi penjual.", product: prod ?? null };
  return { ok: true, code: row.code, sku: row.sku, message: `Serial ${row.code} TER VERIFIKASI — produk orisinal Vems Garage (SKU ${row.sku}).`, product: prod ?? null };
});
