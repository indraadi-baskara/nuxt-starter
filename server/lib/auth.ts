import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";
import * as schema from "../db/schema";

let _auth: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
  if (_auth) return _auth;
  const db = getDb() as any;
  _auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verification },
    }),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3002",
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      requireEmailVerification: false, // flip true in prod
    },
    session: {
      cookieCache: { enabled: true },
      expiresIn: 60 * 60 * 24 * 7, // 7d
      updateAge: 60 * 60 * 24, // 1d
      cookieName: "vg_session",
    },
    advanced: {
      cookiePrefix: "vg",
      // Secure=false so cookies survive http://localhost dev; prod Nitro forces Secure via proxy
      useSecureCookies: false,
      crossSubDomainCookies: { enabled: false },
    },
    user: {
      additionalFields: {
        role: { type: "string", defaultValue: "customer", required: false },
        phone: { type: "string", required: false },
        phoneVerified: { type: "boolean", defaultValue: false, required: false },
      },
    },
    rateLimit: { enabled: true, window: 60, max: 20 },
    trustedOrigins: ["http://localhost:3000", "http://localhost:3002", "http://localhost:3001"],
  });
  return _auth;
}
