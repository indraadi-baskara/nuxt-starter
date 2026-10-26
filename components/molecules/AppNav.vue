<script setup lang="ts">
const links = [
  { label: "Katalog", to: "/katalog" },
  { label: "Cek Keaslian", to: "/cek-keaslian" },
  { label: "Layanan Bengkel", to: "/layanan-bengkel" },
  { label: "Lokasi", to: "/lokasi" },
  { label: "Bantuan", to: "/bantuan" },
]
</script>

<template>
  <nav class="hidden lg:flex items-center gap-1">
    <NuxtLink
      v-for="l in links"
      :key="l.to"
      :to="l.to"
      class="px-3 py-2 text-label-md text-black border-2 border-transparent hover:border-black hover:bg-black hover:text-white"
      active-class="!border-black !bg-black !text-white"
    >{{ l.label }}</NuxtLink>
  </nav>
</template>
