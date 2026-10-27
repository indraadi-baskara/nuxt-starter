import { getDb } from "../../../../db";
import { order } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
const Body = z.object({ status: z.enum(["packing","shipped","delivered","cancelled"]) });
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (!["admin","gudang_picker"].includes(auth.user.role)) throw createError({ statusCode: 403, message: "Forbidden" });
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const { status } = Body.parse(await readBody(event));
  const db = getDb();
  const [existing] = await db.select().from(order).where(eq(order.id, id));
  if (!existing) throw createError({ statusCode: 404, message: "Order not found" });
  await db.update(order).set({ status }).where(eq(order.id, id));
  return { ok: true, status };
});
