import { getDb } from "../../db";
import { order } from "../../db/schema";
import { eq } from "drizzle-orm";
import { makeSuratJalanPdf } from "../../lib/pdf";
export default defineEventHandler(async (event) => {
  const q = getQuery(event) as any;
  const orderId = q.orderId as string;
  if (!orderId) throw createError({ statusCode: 400, message: "orderId required" });
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const db = getDb();
  const [o] = await db.select().from(order).where(eq(order.id, orderId));
  if (!o) throw createError({ statusCode: 404, message: "Order not found" });
  if (o.userId !== auth.user.id) throw createError({ statusCode: 403, message: "Forbidden" });
  const pdf = await makeSuratJalanPdf({ sjNo: o.suratJalanNo!, orderId: o.id, customer: o.address as any, courier: o.courier });
  setHeader(event, "Content-Type", "application/pdf");
  setHeader(event, "Content-Disposition", `attachment; filename="surat-jalan-${orderId}.pdf"`);
  return Buffer.from(pdf);
});
