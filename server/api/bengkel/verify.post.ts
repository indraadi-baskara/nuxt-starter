import { getDb } from "../../db";
import { bengkelProfile } from "../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
const Body = z.object({ name: z.string().min(3), nib: z.string().min(8) });
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Login required" });
  const { name, nib } = Body.parse(await readBody(event));
  const db = getDb();
  const existing = await db.select().from(bengkelProfile).where(eq(bengkelProfile.nib, nib));
  if (existing.length) throw createError({ statusCode: 409, message: "NIB sudah diajukan — cek status di portal verifikasi." });
  const mine = await db.select().from(bengkelProfile).where(eq(bengkelProfile.userId, auth.user.id));
  if (mine.some((m: any) => m.status === "pending")) throw createError({ statusCode: 409, message: "Anda sudah memiliki pengajuan pending — tunggu verifikasi." });
  const id = `bengkel_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  await db.insert(bengkelProfile).values({ id, userId: auth.user.id, name, nib, status: "pending", tier: "tier-1", depotId: "SMG-01" });
  return { ok: true, id, message: `Pengajuan verifikasi untuk ${name} (NIB ${nib}) diterima. Tim Vems akan verifikasi 1x24 jam.` };
});
