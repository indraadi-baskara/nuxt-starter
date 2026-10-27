import { verifyPassword, hashPassword } from "../../lib/auth";
import { getDb } from "../../db";
import { account, user } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const path = url.pathname;
  const method = getMethod(event);
  const db = getDb();
  // POST /api/auth/sign-in/email  (legacy frontend)
  if (path.includes("/sign-in") && method === "POST") {
    const body = await readBody(event);
    const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(body);
    const normalized = String(email).trim().toLowerCase();
    const [u] = await db.select().from(user).where(eq(user.email, normalized));
    if (!u) throw createError({ statusCode: 401, message: "Invalid email or password" });
    const [acc] = await db.select().from(account).where(and(eq(account.userId, u.id), eq(account.providerId, "credential")));
    if (!acc?.password) throw createError({ statusCode: 401, message: "Invalid email or password" });
    if (!(await verifyPassword(String(password), acc.password))) throw createError({ statusCode: 401, message: "Invalid email or password" });
    const safeUser = { id: u.id, name: u.name, email: u.email, role: (u as any).role ?? "customer", phone: (u as any).phone ?? null, image: u.image ?? null };
    await setUserSession(event, { user: safeUser } as any);
    return { user: safeUser };
  }
  if (path.includes("/sign-up") && method === "POST") {
    const body = await readBody(event);
    const { name, email, password } = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8).max(128) }).parse(body);
    const normalized = String(email).trim().toLowerCase();
    const [existing] = await db.select().from(user).where(eq(user.email, normalized));
    if (existing) throw createError({ statusCode: 409, message: "Email already registered" });
    const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await db.insert(user).values({ id, name: String(name).trim(), email: normalized } as any);
    await db.insert(account).values({ id: `acc_${id}`, userId: id, accountId: normalized, providerId: "credential", password: await hashPassword(String(password)) } as any);
    const safeUser = { id, name: String(name).trim(), email: normalized, role: "customer" as const } as any;
    await setUserSession(event, { user: safeUser } as any);
    return { user: safeUser };
  }
  if (path.includes("/sign-out") && method === "POST") {
    await clearUserSession(event);
    return { ok: true };
  }
  // let explicit login.post.ts / register.post.ts handle /api/auth/login etc; this is fallback
  throw createError({ statusCode: 404, message: "Unknown auth route" });
});
