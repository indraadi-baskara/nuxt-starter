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
    // Secrets are NEVER inlined — read from NUXT_* env at runtime via applyEnv.
    // Set via Netlify env vars: NUXT_DATABASE_URL, NUXT_SESSION_PASSWORD
    // (or bare DATABASE_URL / NUXT_SESSION_PASSWORD — both work, see server code)
    databaseUrl: "",
    sessionPassword: "",
  },
  experimental: { appManifest: false },
  modules: ["@nuxt/icon", "@nuxt/image", "nuxt-auth-utils"],
  compatibilityDate: "2024-12-18",
});
