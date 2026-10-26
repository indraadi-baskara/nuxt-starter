import { getDb } from "../../db";
import { bengkelProfile } from "../../db/schema";
import { z } from "zod";
const Body = z.object({ name: z.string().min(3), nib: z.string().min(8) });
export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Login required" });
  const { name, nib } = Body.parse(await readBody(event));
  const db = getDb();
  const id = `bengkel_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  await db.insert(bengkelProfile).values({ id, userId: auth.user.id, name, nib, status: "pending", tier: "tier-1", depotId: "SMG-01" });
  return { ok: true, id, message: `Pengajuan verifikasi untuk ${name} (NIB ${nib}) diterima. Tim Vems akan verifikasi 1x24 jam.` };
});
