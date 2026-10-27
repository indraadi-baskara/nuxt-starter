import bcrypt from "bcryptjs";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function requireEnvSessionPassword(): string {
  // Kept for backwards compat; canonical session secret is nuxt-auth-utils's
  // runtimeConfig.session.password (NUXT_SESSION_PASSWORD). This helper is
  // unused in normal flow — callers should use nuxt-auth-utils session APIs.
  try {
    const cfg = useRuntimeConfig() as any;
    const pw = cfg.session?.password ?? cfg.sessionPassword;
    if (pw && String(pw).length >= 32) return String(pw);
  } catch {}
  const v = process.env.NUXT_SESSION_PASSWORD || process.env.BETTER_AUTH_SECRET;
  if (!v || v.length < 32) throw new Error("NUXT_SESSION_PASSWORD must be >= 32 chars (set in .env / Netlify env)");
  return v;
}
