import { z } from "zod";
import { hashPassword } from "../../lib/auth";
import { ensureMigrated } from "../../utils/migrate";
import { getDb } from "../../db";
import { account, user } from "../../db/schema";
import { eq } from "drizzle-orm";
import { logRouteError } from "../../utils/logError";

const Body = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8).max(128) });

export default defineEventHandler(async (event) => {
  try {
    await ensureMigrated();
    const { name, email, password } = Body.parse(await readBody(event));
    const db = getDb();
  const normalized = email.trim().toLowerCase();
  const [existing] = await db.select().from(user).where(eq(user.email, normalized));
  if (existing) throw createError({ statusCode: 409, message: "Email already registered" });
  const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const pwHash = await hashPassword(password);
  await db.insert(user).values({ id, name: name.trim(), email: normalized } as any);
  await db.insert(account).values({
    id: `acc_${id}`, userId: id, accountId: normalized, providerId: "credential", password: pwHash,
  } as any);
    const safeUser = { id, name: name.trim(), email: normalized, role: "customer" as const };
    await setUserSession(event, { user: safeUser } as any);
    return { user: safeUser };
  } catch (err: any) {
    if (err?.statusCode) throw err;
    logRouteError("auth/register", err);
    throw createError({ statusCode: 500, message: err instanceof Error ? err.message : "Server Error" });
  }
});
