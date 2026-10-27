import { getDb } from "../../db";
import { order, orderItem } from "../../db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing order id" });
  const db = getDb();
  const [o] = await db.select().from(order).where(eq(order.id, id));
  if (!o) throw createError({ statusCode: 404, message: "Order not found" });
  if (o.userId !== auth.user.id) throw createError({ statusCode: 403, message: "Forbidden" });
  const items = await db.select().from(orderItem).where(eq(orderItem.orderId, id));
  // Neon HTTP returns json-mode text columns as strings — parse for the client
  let address: any = (o as any).address
  if (typeof address === 'string') { try { address = JSON.parse(address) } catch {} }
  return { ...o, address, items };
});
