<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Layanan Bengkel & Jaringan Rekanan — Vems Garage" })
const q = ref("")
const partners = ref<any[]>([])
const loading = ref(true)
const err = ref<string | null>(null)
async function load() {
  loading.value = true; err.value = null
  try {
    const res: any = await $fetch("/api/bengkel", { query: q.value ? { q: q.value } : {} })
    let items = res?.items ?? []
    if (q.value) {
      const term = q.value.toLowerCase()
      items = items.filter((p: any) => `${p.name} ${p.nib} ${p.tier}`.toLowerCase().includes(term))
    }
    partners.value = items
  } catch (e: any) { err.value = e?.data?.message || e?.message || "Gagal memuat" }
  finally { loading.value = false }
}
onMounted(load)
watch(q, () => load())
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="LAYANAN BENGKEL REKANAN // SEMARANG RAYA" />
    <!-- Hero -->
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap gap-2 text-label-sm">
          <span class="bg-black text-white px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-network" class="size-3" /> JARINGAN 14 BENGKEL TERVERIFIKASI</span>
          <span class="bg-[#ff5722] text-white px-2 py-1">COVERAGE 35 KM DARI PENGAPON</span>
          <span class="bg-white border-2 border-black px-2 py-1">GARANSI PASANG 30 HARI</span>
          <span class="bg-emerald-600 text-white px-2 py-1">VOUCHER JASA 20% AKTIF</span>
        </div>
        <div class="mt-4 grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
          <div>
            <h1 class="text-headline-xl uppercase tracking-tighter leading-none">PASANG DI BENGKEL REKANAN — GARANSI PEMASANGAN BERLAKU</h1>
            <p class="text-body-md text-on-surface-variant mt-3">Beli part, pilih bengkel rekanan terdekat — jasa pasang diskon 20% + garansi 30 hari. Teknisi tersertifikasi, booking via WhatsApp, antrian < 2 jam.</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <NuxtLink to="/verifikasi" class="bg-[#ff5722] text-white border-2 border-black px-4 py-2 text-label-sm font-bold">DAFTAR JADI REKANAN →</NuxtLink>
              <a href="https://maps.google.com/?q=Jl+Pengapon+No+88+Semarang" target="_blank" class="bg-white border-2 border-black px-4 py-2 text-label-sm font-bold flex items-center gap-1"><Icon name="i-lucide-map-pinned" class="size-4" /> LIHAT PETA SEMARANG RAYA</a>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-2 text-center">
              <div class="border-2 border-black bg-black text-white p-3"><div class="text-headline-md">14</div><div class="text-label-sm uppercase">Bengkel Aktif</div></div>
              <div class="border-2 border-black bg-white p-3"><div class="text-headline-md">≤45'</div><div class="text-label-sm uppercase">SLA Kurir</div></div>
              <div class="border-2 border-black bg-emerald-600 text-white p-3"><div class="text-headline-md">30 Hari</div><div class="text-label-sm uppercase">Garansi Pasang</div></div>
            </div>
          </div>
          <VgCard class="p-0 overflow-hidden h-fit">
            <div class="aspect-[4/3] border-b-2 border-black bg-[#f3f3f4]"><img src="https://picsum.photos/seed/vg-bengkel-network/800/600" alt="Jaringan bengkel" class="size-full object-cover" /></div>
            <div class="p-3 text-body-sm">
              <p class="font-bold uppercase text-label-sm">Protokol Serah — Voucher 20%</p>
              <p class="text-on-surface-variant mt-1">Tunjukkan faktur VG + plat nomor di bengkel rekanan — potongan jasa otomatis.</p>
            </div>
          </VgCard>
        </div>
      </div>
    </section>

    <!-- Search + grid -->
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-headline-md uppercase">DIREKTORI BENGKEL REKANAN</h2>
          <VgInput v-model="q" placeholder="Cari bengkel / NIB / tier…" class="max-w-sm" />
        </div>
        <div v-if="loading" class="mt-6 border-2 border-black bg-white p-8 text-center text-body-sm">Memuat jaringan…</div>
        <div v-else-if="err" class="mt-6 border-2 border-black bg-[#ffdbd1] p-4 text-body-sm">{{ err }}</div>
        <div v-else-if="!partners.length" class="mt-6 border-2 border-black bg-[#fff4d6] p-8 text-center">
          <p class="text-body-md">Belum ada bengkel terverifikasi. Jadilah yang pertama!</p>
          <NuxtLink to="/verifikasi" class="inline-block mt-3"><VgButton variant="ember">Ajukan Verifikasi</VgButton></NuxtLink>
        </div>
        <div v-else class="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <VgCard v-for="p in partners" :key="p.id" class="p-4 flex flex-col">
            <div class="flex items-center gap-2"><Icon name="i-lucide-badge-check" class="size-4 text-emerald-600" /><span class="text-label-sm font-bold uppercase text-emerald-700">Terverifikasi</span><span class="ml-auto font-mono text-[11px] bg-black text-white px-2 py-0.5">{{ p.tier }}</span></div>
            <div class="text-label-md text-black mt-3 font-bold leading-tight">{{ p.name }}</div>
            <div class="text-body-sm text-[#444748] mt-1 font-mono text-xs">NIB {{ p.nib }} • {{ p.depotId }}</div>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span class="bg-[#ff5722] text-white px-2 py-0.5 text-[10px] font-bold uppercase">REM & KAKI-KAKI</span>
              <span class="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">MESIN</span>
            </div>
            <div class="mt-3 text-body-sm flex items-center gap-1"><Icon name="i-lucide-map-pin" class="size-3" /> {{ p.address ?? 'Semarang Raya — hub Pengapon' }}</div>
            <div class="mt-auto pt-3 flex gap-2">
              <a :href="`https://wa.me/6281228000000?text=Halo%20${encodeURIComponent(p.name)}`" target="_blank" class="flex-1 bg-[#25d366] text-white border-2 border-black px-3 py-1.5 text-label-sm font-bold text-center">WA Bengkel</a>
              <NuxtLink :to="`/verifikasi`" class="flex-1 bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold text-center">Detail</NuxtLink>
            </div>
          </VgCard>
        </div>
        <!-- CTA join -->
        <VgCard class="p-4 mt-6 bg-black text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 class="text-label-lg uppercase">Punya Bengkel di Semarang Raya?</h3>
            <p class="text-body-sm text-white/70 mt-1">Daftar rekanan — diskon B2B 8/12/18% + TOP 14 hari + prioritas kurir.</p>
          </div>
          <NuxtLink to="/verifikasi" class="bg-[#ff5722] text-white border-2 border-white px-4 py-2 text-label-sm font-bold whitespace-nowrap">AJUKAN NIB SEKARANG →</NuxtLink>
        </VgCard>
      </div>
    </section>
  </div>
</template>
