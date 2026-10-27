<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Pusat Bantuan, SOP Garansi & Retur — Vems Garage" })
const faqs = [
  { q: "Bagaimana klaim garansi orisinal?", a: "Bawa faktur + kemasan ber-serial ke Depot Pengapon. Verifikasi via /cek-keaslian. Garansi 100% orisinal." },
  { q: "Berapa lama retur fisik?", a: "Maksimal 7 hari setelah terima, kondisi segel utuh. Hanya di Depot Pengapon Jl. Pengapon No.12." },
  { q: "Apakah bengkel rekanan dapat harga B2B?", a: "Ya — daftar di /verifikasi dengan NIB. Setelah approved, akun Anda naik tier dan harga B2B aktif." },
  { q: "e-Faktur B2B diterbitkan kapan?", a: "Otomatis saat pesanan packing — fakturNo tercantum di detail pesanan dan invoice PDF." },
]
const open = ref<number | null>(0)
</script>

<template>
  <div class="space-y-4 max-w-4xl">
    <h1 class="text-headline-lg uppercase text-black">Pusat Bantuan, SOP Garansi &amp; Retur Fisik Depot Pengapon</h1>
    <VgCard class="p-4">
      <h2 class="text-label-lg border-b-2 border-black pb-2">SOP Garansi</h2>
      <ul class="mt-3 space-y-2 text-body-sm list-disc pl-5">
        <li>Garansi 100% orisinal — klaim dengan faktur &amp; serial kemasan.</li>
        <li>Retur fisik hanya di Depot Pengapon — maksimal 7 hari setelah terima.</li>
        <li>e-Faktur resmi DJP diterbitkan untuk setiap transaksi B2B.</li>
      </ul>
    </VgCard>
    <VgCard class="p-4">
      <h2 class="text-label-lg border-b-2 border-black pb-2">FAQ</h2>
      <div class="mt-3 divide-y-2 divide-black border-2 border-black">
        <div v-for="(f,i) in faqs" :key="f.q">
          <button class="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#f3f3f4]" @click="open = open === i ? null : i">
            <span class="text-body-sm font-bold">{{ f.q }}</span>
            <Icon :name="open===i ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-4 shrink-0" />
          </button>
          <div v-if="open===i" class="px-4 pb-3 text-body-sm text-[#444748]">{{ f.a }}</div>
        </div>
      </div>
    </VgCard>
    <VgCard class="p-4">
      <h2 class="text-label-lg border-b-2 border-black pb-2">Hubungi Kami</h2>
      <p class="text-body-md mt-2">Hotline: (024) 7692-8800 — Senin–Sabtu 08:00–17:00 WIB</p>
      <div class="flex gap-2 mt-3"><NuxtLink to="/lokasi"><VgButton size="sm">Lihat Lokasi Depot</VgButton></NuxtLink><NuxtLink to="/cek-keaslian"><VgButton size="sm" variant="ember">Cek Keaslian</VgButton></NuxtLink></div>
    </VgCard>
  </div>
</template>
