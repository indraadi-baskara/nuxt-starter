import { z } from "zod";
import { verifyPassword } from "../../lib/auth";
import { getDb } from "../../db";
import { account, user } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { logRouteError } from "../../utils/logError";

const Body = z.object({ email: z.string().email(), password: z.string().min(1) });

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = Body.parse(await readBody(event));
    const db = getDb();
  const normalized = email.trim().toLowerCase();
  const [u] = await db.select().from(user).where(eq(user.email, normalized));
  if (!u) throw createError({ statusCode: 401, message: "Invalid email or password" });
  const [acc] = await db.select().from(account).where(and(eq(account.userId, u.id), eq(account.providerId, "credential")));
  if (!acc?.password) throw createError({ statusCode: 401, message: "Invalid email or password" });
  const ok = await verifyPassword(password, acc.password);
  if (!ok) throw createError({ statusCode: 401, message: "Invalid email or password" });
    const safeUser = { id: u.id, name: u.name, email: u.email, role: (u as any).role ?? "customer", phone: (u as any).phone ?? null, image: u.image ?? null };
    await setUserSession(event, { user: safeUser } as any);
    return { user: safeUser };
  } catch (err: any) {
    if (err?.statusCode) throw err;
    logRouteError("auth/login", err);
    throw createError({ statusCode: 500, message: err instanceof Error ? err.message : "Server Error" });
  }
});
