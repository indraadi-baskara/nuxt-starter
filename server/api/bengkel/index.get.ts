import { getDb } from "../../db";
import { bengkelProfile } from "../../db/schema";
import { desc } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const q = getQuery(event) as any;
  const status = q.status as string | undefined;
  const db = getDb();
  const rows = await (db.select().from(bengkelProfile).orderBy(desc(bengkelProfile.createdAt)) as any);
  // public view: only verified partners visible unless admin
  const auth: any = (event.context as any).auth;
  const isAdmin = auth?.user?.role === "admin";
  if (!isAdmin && !status) {
    return { items: (rows as any[]).filter((r: any) => r.status === "verified") };
  }
  if (status) return { items: (rows as any[]).filter((r: any) => r.status === status) };
  return { items: rows };
});
