import { getDb } from "../../db";
import { bengkelProfile } from "../../db/schema";
import { eq, desc } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const db = getDb();
  const rows = await db.select().from(bengkelProfile).where(eq(bengkelProfile.userId, auth.user.id)).orderBy(desc(bengkelProfile.createdAt));
  return { items: rows, latest: rows[0] ?? null };
});
