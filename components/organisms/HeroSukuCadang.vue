<script setup lang="ts">
const emit = defineEmits<{ search: [q: string] }>()
const q = ref("")
function submit() { emit("search", q.value.trim()) }
</script>

<template>
  <section class="w-full bg-white border-b-4 border-black px-4 lg:px-10 py-10 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none opacity-[0.035]" style="background-size: 24px 24px; background-image: linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)" />
    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Left -->
        <div class="lg:col-span-7 flex flex-col items-start">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#e2e2e2] border-2 border-black neo-shadow-sm mb-4 text-label-sm uppercase font-bold tracking-wider">
            <Icon name="i-lucide-badge-check" class="size-4 text-[#b02f00]" />
            SEMARANG AUTO DEPOT • ZERO-TOLERANCE AUTHENTICITY
          </div>
          <h1 class="font-bold uppercase leading-none tracking-tighter text-black text-[40px] lg:text-[72px]">
            SUKU CADANG ASLI.<br />
            <span class="text-[#ff5722] underline decoration-4 decoration-black">TANPA KOMPROMI.</span>
          </h1>
          <p class="text-body-lg text-[#444748] max-w-2xl mt-4 leading-relaxed">
            Jangan pertaruhkan nyawa dan performa kendaraan dengan part tiruan. Vems Garage menyediakan 100% onderdil resmi distributor langsung ke tangan Anda dalam hitungan jam di Semarang tanpa perantara.
          </p>

          <div class="w-full max-w-2xl bg-[#f9f9f9] border-4 border-black neo-shadow-lg p-2 mt-6">
            <div class="flex flex-col sm:flex-row items-stretch gap-2">
              <div class="relative flex-1">
                <Icon name="i-lucide-car-front" class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#747878]" />
                <input v-model="q" class="w-full bg-white border-2 border-black pl-10 pr-3 py-3 text-label-md uppercase tracking-wider placeholder:text-black/40 focus:outline-none focus:border-[#ff5722]" placeholder="Masukkan Nomor Rangka (VIN) atau Kode Part..." @keydown.enter="submit" />
              </div>
              <VgButton variant="primary" class="shrink-0" @click="submit">VERIFIKASI <Icon name="i-lucide-search" class="size-4" /></VgButton>
            </div>
            <div class="flex items-center justify-between mt-1 px-1 text-[11px] text-label-sm text-[#444748] tracking-wider uppercase">
              <span>CONTOH: MHK123456789 (17 DIGIT) ATAU 04465-0K140</span>
              <span class="text-[#b02f00] font-bold">SMG FAST RADAR v4.2</span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4 mt-6">
            <NuxtLink to="/katalog" class="bg-[#ff5722] text-white px-6 py-4 border-4 border-black text-label-lg uppercase font-bold neo-shadow-lg brutist-interactive inline-flex items-center gap-2">
              CARI ONDERDIL SEKARANG <Icon name="i-lucide-arrow-right" class="size-5" />
            </NuxtLink>
            <NuxtLink to="/cek-keaslian" class="bg-white text-black px-6 py-4 border-4 border-black text-label-lg uppercase font-bold neo-shadow brutist-interactive inline-flex items-center gap-2">
              <Icon name="i-lucide-badge" class="size-5" /> KONSULTASI NOMOR RANGKA (VIN)
            </NuxtLink>
          </div>

          <div class="grid grid-cols-3 gap-2 w-full max-w-2xl mt-8 border-t-2 border-black pt-4">
            <div><div class="text-headline-sm uppercase text-black">0%</div><div class="text-label-sm uppercase text-[#444748] font-bold">Toleransi Palsu</div></div>
            <div class="border-l-2 border-black pl-3"><div class="text-headline-sm uppercase text-[#ff5722]">45 MENIT</div><div class="text-label-sm uppercase text-[#444748] font-bold">Instant Courier SMG</div></div>
            <div class="border-l-2 border-black pl-3"><div class="text-headline-sm uppercase text-black">12 BULAN</div><div class="text-label-sm uppercase text-[#444748] font-bold">Garansi Distributor</div></div>
          </div>
        </div>

        <!-- Right: Dispatch card -->
        <div class="lg:col-span-5 flex flex-col gap-4">
          <div class="bg-[#f9f9f9] border-4 border-black neo-shadow-lg p-4">
            <div class="flex items-center justify-between pb-3 border-b-2 border-black mb-3">
              <div class="flex items-center gap-2"><span class="inline-block size-3 bg-[#ff5722] border border-black" /><span class="text-label-sm uppercase font-bold tracking-widest">DISPATCH UNIT: SMG-CENTRAL</span></div>
              <span class="text-label-sm uppercase bg-[#e2e2e2] px-2 py-0.5 border border-black">SPEC: CERTIFIED</span>
            </div>
            <div class="relative w-full h-64 border-[3px] border-black overflow-hidden bg-black mb-4">
              <img src="https://picsum.photos/seed/vg-depot-pengapon-hero/800/600" alt="Depot blueprint" class="w-full h-full object-cover grayscale contrast-125" loading="lazy" />
              <div class="absolute bottom-2 left-2 bg-black text-white border border-white px-2 py-1 text-label-sm tracking-wider uppercase">INSPEKSI LOT: #2025-SMG-GENUINE</div>
            </div>
            <div class="bg-white border-2 border-black divide-y-2 divide-black text-label-sm">
              <div class="flex justify-between items-center px-3 py-1.5"><span class="text-[#444748] uppercase">Pusat Distribusi</span><span class="font-bold uppercase">Kawasan Industri Pengapon, Semarang</span></div>
              <div class="flex justify-between items-center px-3 py-1.5"><span class="text-[#444748] uppercase">Jangkauan Same-Day</span><span class="font-bold uppercase text-[#ff5722]">Semarang Kota, Ungaran, Kendal, Demak</span></div>
              <div class="flex justify-between items-center px-3 py-1.5"><span class="text-[#444748] uppercase">Sertifikasi Legal</span><span class="font-bold uppercase">ATPM Direct Authorized Lot</span></div>
            </div>
            <div class="mt-4 flex items-center justify-between p-3 bg-[#e2e2e2] border-2 border-black">
              <div class="flex items-center gap-3">
                <Icon name="i-lucide-shield-check" class="size-7 text-[#ff5722]" />
                <div><div class="text-headline-sm uppercase leading-tight">GARANSI 100% ORISINIL</div><div class="text-body-sm uppercase text-[#444748]">Uang kembali 300% jika terbukti replika.</div></div>
              </div>
              <div class="border-2 border-black px-2 py-1 text-label-sm font-bold uppercase bg-white">AUTHENTIC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
