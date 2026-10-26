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
    experimental: { openAPI: true },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || "./data/app.db",
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3002",
  },
  experimental: { appManifest: false },
  modules: ["@nuxt/icon", "@nuxt/image"],
  compatibilityDate: "2024-12-18",
});
