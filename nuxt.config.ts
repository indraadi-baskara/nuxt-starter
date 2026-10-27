// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  components: [{ path: "~/components", pathPrefix: false }],
  vite: {
    plugins: [tailwindcss() as any],
  },
  nitro: {
    preset: process.env.NETLIFY ? "netlify" : undefined,
    experimental: { openAPI: true },
    serverAssets: [{ baseName: "migrations", dir: "server/db/migrations" }],
  },
  runtimeConfig: {
    // Secrets are NEVER inlined — read from NUXT_* env at runtime via Nitro applyEnv.
    // DB: NUXT_DATABASE_URL (preferred) or DATABASE_URL (fallback in server/db/index.ts:15)
    // Session: NUXT_SESSION_PASSWORD — consumed by nuxt-auth-utils via runtimeConfig.session.password
    databaseUrl: "",
    session: { password: "" },
  },
  experimental: { appManifest: false },
  modules: ["@nuxt/icon", "@nuxt/image", "nuxt-auth-utils"],
  compatibilityDate: "2024-12-18",
});
