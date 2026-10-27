<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Lokasi Semarang & Sentral Depot Pengapon — Vems Garage" })
const depots = ref<any[]>([])
const lots = ref<any[]>([])
const selected = ref<string>("SMG-01")
const loading = ref(true)
const loadingLots = ref(false)
const ongkirZone = ref("Ring 1")
async function loadDepots() {
  loading.value = true
  try {
    const res: any = await $fetch("/api/depot")
    depots.value = res?.depots ?? []
    if (depots.value.length) selected.value = depots.value[0].id
  } catch {} finally { loading.value = false }
  await loadLots()
}
async function loadLots() {
  loadingLots.value = true
  try {
    const res: any = await $fetch(`/api/depot/${selected.value}`)
    lots.value = res?.lots ?? []
  } catch { lots.value = [] } finally { loadingLots.value = false }
}
watch(selected, loadLots)
onMounted(loadDepots)
function fmt(n: number) { return new Intl.NumberFormat("id-ID").format(n ?? 0) }
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="SENTRAL DEPOT PENGAPON" />
    <!-- Hero — Stitch 6f64c445 SEC1 -->
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap items-center gap-2 text-label-sm">
          <span class="bg-black text-white px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-warehouse" class="size-3" /> SENTRAL LOGISTIK & DISTRIBUSI OEM JAWA TENGAH</span>
          <span class="bg-emerald-600 text-white px-2 py-1">TERMINAL STATUS NORMAL</span>
          <span class="bg-white border-2 border-black px-2 py-1">DOK LOADING AKTIF 12/12</span>
          <span class="bg-white border-2 border-black px-2 py-1">IKLIM 24.2°C / 48% RH</span>
          <span class="bg-[#ff5722] text-white px-2 py-1">DISPATCH 14 MENIT</span>
        </div>
        <h1 class="text-headline-xl uppercase tracking-tighter mt-3 leading-none">SENTRAL DEPOT LOGISTIK PENGAPON & COVERAGE SEMARANG RAYA</h1>
        <p class="text-body-md text-on-surface-variant max-w-3xl mt-2">Pusat 184.920 SKU OEM anti-korosi. Self-Pickup Dok D-04 instan 15 menit & armada same-day radius 35 KM.</p>
        <div class="mt-4 flex flex-wrap gap-2 text-body-sm">
          <span class="border-2 border-black bg-white px-3 py-1">Stasiun Tawang: 850 M</span>
          <span class="border-2 border-black bg-white px-3 py-1">Pelabuhan Tj. Emas: 2.1 KM</span>
          <span class="border-2 border-black bg-white px-3 py-1">Tol Muktiharjo: 3.4 KM</span>
          <a href="https://maps.google.com/?q=Jl+Pengapon+No+88+Semarang" target="_blank" class="bg-black text-white border-2 border-black px-3 py-1 flex items-center gap-1"><Icon name="i-lucide-navigation" class="size-4" /> BUKA DI GOOGLE MAPS / WAZE</a>
        </div>
      </div>
    </section>

    <!-- Depot picker (preserve API) -->
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-4">
        <div v-if="loading" class="border-2 border-black bg-white p-6 text-center text-body-sm">Memuat depot…</div>
        <template v-else>
          <div class="flex gap-2 flex-wrap">
            <button v-for="d in depots" :key="d.id" class="border-[3px] border-black px-4 py-2 text-label-sm font-bold uppercase" :class="selected === d.id ? 'bg-black text-white' : 'bg-white text-black'" @click="selected = d.id">{{ d.name }} — {{ d.id }}</button>
          </div>
          <template v-for="d in depots.filter(x => x.id === selected)" :key="d.id">
            <div class="mt-4 grid md:grid-cols-3 gap-3">
              <VgCard class="p-0 overflow-hidden"><div class="aspect-[16/9] border-b-2 border-black bg-[#f3f3f4]"><img :src="`https://picsum.photos/seed/vg-map-${d.id}/900/500`" :alt="`Peta ${d.name}`" class="size-full object-cover" /></div><div class="p-3 text-body-sm"><p class="text-label-sm font-bold">ALAMAT PRESISI</p><p class="mt-1">{{ d.address }}</p><p class="text-xs text-on-surface-variant mt-1">Gate Timur Pengapon — zona parkir bongkar muat.</p></div></VgCard>
              <VgCard class="p-3"><p class="text-label-sm font-bold">JAM BUKA DOK D-04</p><p class="text-body-md mt-2">{{ d.hours }}</p><p class="text-xs text-on-surface-variant mt-1">{{ d.phone }}</p><div class="mt-3 border-2 border-black p-2 bg-[#fff4d6] text-label-sm">DARURAT MALAM B2B: 21:00-08:00 WIB — ambulans part.</div></VgCard>
              <VgCard class="p-3 bg-black text-white"><p class="text-label-sm text-[#ffb5a0]">STOK LIVE</p><p class="text-headline-lg mt-1">{{ fmt(d.inventory?.available ?? 0) }} <span class="text-label-md text-white/60">unit</span></p><p class="text-body-sm text-white/70">{{ d.inventory?.skus ?? 0 }} SKU • {{ (d.inventory?.raks ?? []).length }} rak • {{ fmt(d.inventory?.reserved ?? 0) }} reserved</p></VgCard>
            </div>
          </template>
        </template>
      </div>
    </section>

    <!-- Coverage rings — Stitch SEC2 -->
    <section class="w-full bg-surface-container border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <h2 class="text-headline-md uppercase flex items-center gap-2"><Icon name="i-lucide-map-pinned" class="size-5" /> PETA ZONASI ARMADA 14 VAN + 22 MOTOR — RADIUS 35 KM</h2>
        <div class="mt-4 grid md:grid-cols-4 gap-3">
          <VgCard class="p-3 border-l-4 border-l-emerald-600"><p class="text-label-sm font-bold">RING 1 — &lt;30 MENIT</p><p class="text-body-sm text-on-surface-variant mt-1">Kuningan, Pengapon, Simpang Lima, Johar, Gajah.</p><p class="text-label-sm mt-2 bg-emerald-600 text-white px-2 py-0.5 inline-block">RUNNER MOTOR INSTAN</p></VgCard>
          <VgCard class="p-3 border-l-4 border-l-[#ff5722]"><p class="text-label-sm font-bold">RING 2 — &lt;45 MENIT</p><p class="text-body-sm text-on-surface-variant mt-1">Semarang Barat, Pedurungan, Genuk, Gayamsari.</p><p class="text-label-sm mt-2 bg-black text-white px-2 py-0.5 inline-block">FLEET VAN 6 RUN/HARI</p></VgCard>
          <VgCard class="p-3 border-l-4 border-l-black"><p class="text-label-sm font-bold">RING 3 — &lt;60 MENIT</p><p class="text-body-sm text-on-surface-variant mt-1">Banyumanik, Tembalang, Ngaliyan, Gunungpati.</p><p class="text-label-sm mt-2 bg-white border border-black px-2 py-0.5 inline-block">ARMADA BOX 4W</p></VgCard>
          <VgCard class="p-3 border-l-4 border-l-outline"><p class="text-label-sm font-bold">RING 4 — &lt;4 JAM</p><p class="text-body-sm text-on-surface-variant mt-1">Kendal, Demak, Ungaran hinterland.</p><p class="text-label-sm mt-2 bg-white border border-black px-2 py-0.5 inline-block">SAME-DAY HINTERLAND</p></VgCard>
        </div>
      </div>
    </section>

    <!-- Dock telemetry + ongkir -->
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6 grid lg:grid-cols-2 gap-4">
        <VgCard class="p-4">
          <h3 class="text-label-md uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-activity" class="size-4" /> REAL-TIME DOCK TELEMETRY — 14:02 WIB LINK OK</h3>
          <div class="mt-3 space-y-2 text-body-sm">
            <div class="flex justify-between border-2 border-black p-2"><span>D-01 Bongkar Brembo IT BATCH #8492</span><span class="bg-black text-white px-2 py-0.5">UNLOADING 68%</span></div>
            <div class="flex justify-between border-2 border-black p-2"><span>D-02 Armada Barat (Ngaliyan-Kendal)</span><span class="bg-emerald-600 text-white px-2 py-0.5">READY 8 ORDERS</span></div>
            <div class="flex justify-between border-2 border-black p-2"><span>D-04 Self-Pickup Publik</span><span class="bg-[#ff5722] text-white px-2 py-0.5">LOKET TERBUKA — 2 antrean</span></div>
          </div>
        </VgCard>
        <VgCard class="p-4 bg-surface-container">
          <h3 class="text-label-md uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-calculator" class="size-4" /> SIMULASI ONGKIR KILAT</h3>
          <label class="text-label-sm uppercase mt-3 block">Pilih Kecamatan</label>
          <select v-model="ongkirZone" class="mt-1 w-full border-2 border-black px-3 py-2 bg-white">
            <option>Ring 1</option><option>Ring 2</option><option>Ring 3</option><option>Ring 4 Hinterland</option>
          </select>
          <div class="mt-3 grid grid-cols-3 gap-2 text-center text-label-sm">
            <span class="border-2 border-black bg-white p-2">Ringan &lt;5kg<br /><strong>Rp 15k</strong></span>
            <span class="border-2 border-black bg-white p-2">Menengah 5-20kg<br /><strong>Rp 25k</strong></span>
            <span class="border-2 border-black bg-black text-white p-2">Heavy &gt;25kg<br /><strong>Rp 45k</strong></span>
          </div>
          <p class="text-body-sm mt-2">Estimasi {{ ongkirZone }}: <strong v-if="ongkirZone==='Ring 1'">&lt;30 menit</strong><strong v-else-if="ongkirZone==='Ring 2'">&lt;45 menit</strong><strong v-else-if="ongkirZone==='Ring 3'">&lt;60 menit</strong><strong v-else>&lt;4 jam</strong> — Vems Express Pengapon.</p>
        </VgCard>
      </div>
    </section>

    <!-- Lots -->
    <section class="w-full bg-surface-container-lowest">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <VgCard class="p-4">
          <h2 class="text-label-lg border-b-2 border-black pb-2">RAK & STOK PER SKU — BLOK C-08 RACK OTOMATIS</h2>
          <div v-if="loadingLots" class="text-body-sm mt-3">Memuat stok…</div>
          <div v-else-if="!lots.length" class="text-body-sm mt-3">Belum ada stok tercatat untuk depot ini.</div>
          <div v-else class="mt-3 grid md:grid-cols-2 gap-3">
            <div v-for="l in lots" :key="l.id" class="border-2 border-black p-3 bg-white flex gap-3">
              <img :src="l.product?.image || `https://picsum.photos/seed/${l.sku}/200/200`" :alt="l.sku" class="size-12 border-2 border-black object-cover shrink-0" />
              <div class="min-w-0 flex-1"><div class="font-mono text-[11px]">{{ l.sku }} • {{ l.rak }}</div><div class="text-body-sm font-bold leading-tight truncate">{{ l.product?.title ?? l.sku }}</div><div class="text-xs mt-1"><span class="bg-black text-white px-2 py-0.5 font-mono">{{ l.available }} tersedia</span> <span class="text-[#444748] ml-1">{{ l.qty }} total</span></div></div>
            </div>
          </div>
        </VgCard>
        <VgCard class="p-4 mt-4 bg-black text-white flex flex-wrap gap-3 items-center justify-between">
          <p class="text-label-sm">HOTLINE DISPATCH: (024) 7692-8800 • WA +62 812-2800-VEMS • VIN-DIRECT-SMG konsultasi sasis</p>
          <a href="https://wa.me/6281228000000" class="bg-[#25d366] text-white border-2 border-white px-3 py-1.5 text-label-sm font-bold">Kirim Foto Part →</a>
        </VgCard>
      </div>
    </section>
  </div>
</template>
