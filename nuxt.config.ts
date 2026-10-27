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
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || "./data/app.db",
    sessionPassword: process.env.NUXT_SESSION_PASSWORD || process.env.BETTER_AUTH_SECRET,
  },
  experimental: { appManifest: false },
  modules: ["@nuxt/icon", "@nuxt/image", "nuxt-auth-utils"],
  compatibilityDate: "2024-12-18",
});
