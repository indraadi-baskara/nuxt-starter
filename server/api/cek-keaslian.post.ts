import { getDb } from "../db";
import { serial } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
const Body = z.object({ code: z.string().min(4) });
export default defineEventHandler(async (event) => {
  const { code } = Body.parse(await readBody(event));
  const db = getDb();
  const [row] = await db.select().from(serial).where(eq(serial.code, code.trim().toUpperCase()));
  if (!row) return { ok: false, message: "Serial tidak dikenali. Hubungi Depot SMG-01." };
  return { ok: true, message: `Serial ${row.code} TER VERIFIKASI — produk orisinal Vems Garage (SKU ${row.sku}).` };
});
