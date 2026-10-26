<script setup lang="ts">
const vin = ref("")
const result = ref<null | { title: string; detail: string }>(null)
function submit() {
  if (vin.value.trim().length < 8) { result.value = null; return }
  result.value = { title: "TOYOTA INNOVA REBORN 2.4 G M/T DIESEL (2018)", detail: "Engine: 2GD-FTV • Chasis: GUN142R • Direct Parts Match: 98 komponen tersedia di Gudang Pengapon." }
}
</script>

<template>
  <section id="vin-decoder-section" class="w-full bg-[#2f3131] text-white px-4 lg:px-10 py-10 border-t-4 border-black">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-7 bg-white text-black border-4 border-black neo-shadow-lg p-6" style="box-shadow: 8px 8px 0 0 #ff5722">
        <div class="flex items-center gap-2 mb-1"><Icon name="i-lucide-map-pin" class="size-6 text-[#ff5722]" /><span class="text-label-sm uppercase tracking-widest text-[#b02f00] font-bold">RADAR PART NUMBER RESMI</span></div>
        <h3 class="text-headline-lg uppercase tracking-tight">BINGUNG KODE PART? CEK NOMOR RANGKA (VIN)</h3>
        <p class="text-body-md text-[#444748] mt-2">Ketik 17 digit VIN di STNK — database bedah katalog micro-fiche ATPM dalam 3 detik.</p>
        <form class="mt-4 space-y-3" @submit.prevent="submit">
          <label class="block text-label-sm uppercase font-bold">NOMOR RANGKA KENDARAAN (17 DIGIT STNK):</label>
          <div class="flex flex-col sm:flex-row gap-2">
            <input v-model="vin" maxlength="17" placeholder="Contoh: MHFE3BA31J0001892" class="flex-1 bg-[#f3f3f4] border-[3px] border-black p-3 text-label-lg uppercase tracking-widest focus:outline-none" />
            <VgButton variant="ember" type="submit">DECODE VIN <Icon name="i-lucide-zap" class="size-4" /></VgButton>
          </div>
          <div v-if="result" class="bg-[#eeeeee] border-2 border-black p-3 flex items-start gap-3">
            <Icon name="i-lucide-badge-check" class="size-6 text-[#ff5722] shrink-0 mt-0.5" />
            <div><div class="text-headline-sm uppercase">{{ result.title }}</div><div class="text-body-sm text-[#444748] mt-1">{{ result.detail }}</div><NuxtLink to="/katalog" class="inline-block mt-2 text-label-sm uppercase font-bold text-[#ff5722] underline">Buka Katalog Khusus Mobil Ini →</NuxtLink></div>
          </div>
        </form>
        <div class="mt-4 pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-2 text-label-sm text-[#444748]">
          <span>✓ DATA ENKRIPSI SISTEM ATPM RESMI</span>
          <a href="https://wa.me/6281234567890" target="_blank" class="text-[#ff5722] font-bold hover:underline inline-flex items-center gap-1">BANTUAN VIA WHATSAPP MEKANIK <Icon name="i-lucide-external-link" class="size-3" /></a>
        </div>
      </div>
      <div class="lg:col-span-5 flex flex-col gap-4">
        <div class="border-l-4 border-[#ff5722] pl-4"><span class="text-label-sm uppercase tracking-widest text-[#ff5722] font-bold">KEMITRAAN BENGKEL SEMARANG</span><h4 class="text-headline-md uppercase tracking-tight mt-1">SUPPLIER RESMI 120+ BENGKEL DI JAWA TENGAH</h4></div>
        <p class="text-body-md leading-relaxed text-white/70">Daftarkan workshop untuk akun <strong class="text-white">Vems B2B Partner</strong> — termin konsinyasi, harga grosir tier-1, prioritas kurir 30 menit.</p>
        <div class="grid grid-cols-2 gap-3 text-label-sm uppercase">
          <div class="bg-white/10 border-2 border-white/20 p-3"><div class="text-[#ff5722] font-bold text-headline-sm">30 MENIT</div><div class="text-white/60">Maks. Kirim Part Bengkel</div></div>
          <div class="bg-white/10 border-2 border-white/20 p-3"><div class="text-[#ff5722] font-bold text-headline-sm">TIER-1</div><div class="text-white/60">Harga Langsung Distributor</div></div>
        </div>
        <NuxtLink to="/verifikasi" class="inline-flex items-center justify-center gap-2 bg-white text-black px-4 py-3 border-[3px] border-black text-label-md uppercase font-bold tracking-wider neo-shadow"> <Icon name="i-lucide-handshake" class="size-5" /> DAFTARKAN BENGKEL PARTNER SMG</NuxtLink>
      </div>
    </div>
  </section>
</template>
