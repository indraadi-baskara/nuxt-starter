<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Layanan Bengkel & Jaringan Rekanan — Vems Garage" })
const partners = [
  { name: "Bengkel Maju Jaya — Semarang Tengah", layanan: "Rem, Kaki-kaki" },
  { name: "Auto Mitra Pengapon", layanan: "Oli, Tune-up" },
  { name: "Bengkel Sumber Rejeki — Ungaran", layanan: "Kopling, Transmisi" },
]
</script>

<template>
  <div class="space-y-4 max-w-4xl">
    <h1 class="text-headline-lg uppercase text-black">Layanan Bengkel &amp; Jaringan Rekanan Pemasangan</h1>
    <p class="text-body-md text-[#444748]">Pasang suku cadang di bengkel rekanan terverifikasi — garansi pemasangan berlaku.</p>
    <div class="grid md:grid-cols-2 gap-4">
      <VgCard v-for="p in partners" :key="p.name" class="p-4">
        <div class="text-label-md text-black">{{ p.name }}</div>
        <div class="text-body-sm text-[#444748] mt-1">{{ p.layanan }}</div>
        <VgButton size="sm" class="mt-3">Lihat Detail</VgButton>
      </VgCard>
    </div>
  </div>
</template>
