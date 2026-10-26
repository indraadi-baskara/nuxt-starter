import { getDb } from "../db";
import { order } from "../db/schema";
import { eq, desc } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const db = getDb();
  const rows = await db.select().from(order).where(eq(order.userId, auth.user.id)).orderBy(desc(order.createdAt));
  return { items: rows };
});
