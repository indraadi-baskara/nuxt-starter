import { getDb } from "../../../db";
import { bengkelProfile, user } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
const Body = z.object({ action: z.enum(["approve", "reject"]), tier: z.string().optional() });
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (auth.user.role !== "admin" && auth.user.role !== "gudang_picker") {
    throw createError({ statusCode: 403, message: "Forbidden: admin only" });
  }
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const { action, tier } = Body.parse(await readBody(event));
  const db = getDb();
  const [existing] = await db.select().from(bengkelProfile).where(eq(bengkelProfile.id, id));
  if (!existing) throw createError({ statusCode: 404, message: "Bengkel not found" });
  const nextStatus = action === "approve" ? "verified" : "rejected";
  await db.update(bengkelProfile).set({ status: nextStatus, tier: tier ?? existing.tier }).where(eq(bengkelProfile.id, id));
  if (action === "approve") {
    await db.update(user).set({ role: "bengkel_partner" }).where(eq(user.id, existing.userId));
  }
  return { ok: true, status: nextStatus };
});
