import { getDb } from "../../../db";
import { order } from "../../../db/schema";
import { desc } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (!["admin","gudang_picker"].includes(auth.user.role)) throw createError({ statusCode: 403, message: "Forbidden" });
  const db = getDb();
  const rows = await db.select().from(order).orderBy(desc(order.createdAt)) as any[];
  const q = getQuery(event) as any;
  const status = q.status as string | undefined;
  const items = status ? rows.filter((r: any) => r.status === status) : rows;
  return { items, total: items.length };
});
