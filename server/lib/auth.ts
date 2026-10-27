import bcrypt from "bcryptjs";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function requireEnvSessionPassword(): string {
  // Prefer Nitro runtimeConfig (NUXT_SESSION_PASSWORD at runtime),
  // fall back to bare env for parity with Netlify dashboard naming
  try {
    const cfg = useRuntimeConfig() as any;
    if (cfg.sessionPassword && String(cfg.sessionPassword).length >= 32) return String(cfg.sessionPassword);
  } catch {}
  const v = process.env.NUXT_SESSION_PASSWORD || process.env.BETTER_AUTH_SECRET;
  if (!v || v.length < 32) throw new Error("NUXT_SESSION_PASSWORD must be >= 32 chars (set in .env / Netlify env)");
  return v;
}
