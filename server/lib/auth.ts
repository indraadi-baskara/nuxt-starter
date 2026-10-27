import bcrypt from "bcryptjs";
export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
export function requireEnvSessionPassword(): string {
  const v = process.env.NUXT_SESSION_PASSWORD || process.env.BETTER_AUTH_SECRET;
  if (!v || v.length < 32) throw new Error("NUXT_SESSION_PASSWORD must be >= 32 chars (set in .env / Netlify env)");
  return v;
}
