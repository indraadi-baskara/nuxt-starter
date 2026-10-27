import { getDb } from "../../db";
import { order, orderItem } from "../../db/schema";
import { eq } from "drizzle-orm";
import { makeInvoicePdf } from "../../lib/pdf";
export default defineEventHandler(async (event) => {
  const q = getQuery(event) as any;
  const orderId = q.orderId as string;
  if (!orderId) throw createError({ statusCode: 400, message: "orderId required" });
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const db = getDb();
  const [o] = await db.select().from(order).where(eq(order.id, orderId));
  if (!o) throw createError({ statusCode: 404, message: "Order not found" });
  const isStaff = ['admin','gudang_picker'].includes(auth.user.role)
  if (o.userId !== auth.user.id && !isStaff) throw createError({ statusCode: 403, message: "Forbidden" });
  const items = await db.select().from(orderItem).where(eq(orderItem.orderId, orderId));
  const pdf = await makeInvoicePdf({ fakturNo: o.fakturNo!, orderId: o.id, customer: o.address as any, items: items.map(i=>({ title: i.title, qty: i.qty, price: i.price })), total: o.total });
  setHeader(event, "Content-Type", "application/pdf");
  setHeader(event, "Content-Disposition", `attachment; filename="e-faktur-${orderId}.pdf"`);
  return Buffer.from(pdf);
});
