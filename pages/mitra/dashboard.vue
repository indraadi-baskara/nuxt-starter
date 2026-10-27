<script setup lang="ts">
definePageMeta({ layout: "account", middleware: "auth" })
useHead({ title: "Mitra Bengkel — Portal Harga B2B & TOP — Vems Garage" })
const auth = useAuth()
const status = ref<any>(null)
const loading = ref(true)
const orders = ref<any[]>([])
const pricing = ref<any[]>([])
const pricingQuery = ref('')
const ordersCount = computed(() => orders.value.length)
const role = computed(() => auth.user.value?.role ?? 'customer')
const isPartner = computed(() => role.value === 'bengkel_partner')
const plafon = usePlafon()
const plafonData = computed(() => {
  if (!isPartner.value) return null
  const tier = (status.value?.tier as string) ?? 'tier-1'
  return plafon.compute(orders.value as any, tier)
})
const filteredPricing = computed(() => {
  const q = pricingQuery.value.toLowerCase().trim()
  if (!q) return pricing.value
  return pricing.value.filter((p: any) => [p.sku, p.product?.title ?? '', p.product?.brand ?? ''].join(' ').toLowerCase().includes(q))
})
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }

async function load() {
  await auth.fetchMe()
  if (!auth.user.value) return
  try {
    const r: any = await $fetch('/api/bengkel/me', { credentials: 'include' as any })
    status.value = r?.latest ?? null
  } catch {}
  try { const r: any = await $fetch('/api/orders', { credentials: 'include' as any }); orders.value = r?.items ?? [] } catch {}
  if (isPartner.value) {
    try { const r: any = await $fetch('/api/bengkel/pricing', { credentials: 'include' as any }); pricing.value = r?.items ?? [] } catch {}
  }
  loading.value = false
}
onMounted(load)
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="MITRA BENGKEL // PORTAL B2B — HARGA, TOP & DISPATCH" />
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap items-center gap-2 text-label-sm uppercase">
          <span class="bg-black text-white px-2 py-1">MITRA RESMI</span>
          <span class="bg-[#ff5722] text-white border-2 border-black px-2 py-1">B2B 8/12/18% · TOP 14/30 HARI</span>
          <span class="bg-white border-2 border-black px-2 py-1">DEPOT PENGAPON SMG-01 — DOK D-04</span>
        </div>
        <h1 class="text-headline-xl uppercase tracking-tighter mt-4 leading-none">PORTAL MITRA BENGKEL</h1>
        <p class="text-body-sm text-on-surface-variant mt-1">Harga termin otomatis, plafon kredit live, dan prioritas dispatch — sinkron per NIB terverifikasi.</p>

        <div v-if="loading" class="mt-6 border-2 border-black bg-white p-6 text-body-sm">Memuat status mitra…</div>
        <template v-else>
          <!-- Not partner yet -->
          <div v-if="!isPartner && !status" class="mt-6 border-[3px] border-black bg-[#fff4d6] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p class="text-label-lg uppercase font-bold">Belum mitra B2B</p>
              <p class="text-body-sm mt-1">Verifikasi NIB 1×24 jam — upgrade role otomatis ke <span class="font-mono bg-black text-white px-1">bengkel_partner</span> dan harga B2B aktif seketika.</p>
            </div>
            <NuxtLink to="/verifikasi"><VgButton variant="ember">Ajukan Verifikasi NIB →</VgButton></NuxtLink>
          </div>

          <div v-else-if="status && status.status === 'pending'" class="mt-6 border-[3px] border-black bg-[#fff4d6] p-6">
            <p class="text-label-lg uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-clock" class="size-5" /> Pengajuan pending</p>
            <p class="text-body-sm mt-2 font-mono text-xs">{{ status.name }} · NIB {{ status.nib }} · {{ status.tier }} · {{ status.depotId }}</p>
            <p class="text-body-sm mt-2">Tim Vems memverifikasi 1×24 jam. Anda akan mendapat WhatsApp dan upgrade otomatis.</p>
          </div>

          <div v-else-if="status && status.status === 'rejected'" class="mt-6 border-[3px] border-black bg-[#ffdbd1] p-6">
            <p class="text-label-lg uppercase font-bold">Ditolak — cek NIB</p>
            <p class="text-body-sm mt-1">{{ status.nib }} ditolak. Periksa dokumen dan ajukan ulang.</p>
            <NuxtLink to="/verifikasi" class="inline-block mt-3"><VgButton variant="ember">Ajukan Ulang →</VgButton></NuxtLink>
          </div>

          <!-- Partner active -->
          <template v-if="isPartner && plafonData">
            <div class="mt-6 grid md:grid-cols-3 gap-3">
              <VgCard class="p-4 bg-black text-white">
                <div class="text-label-sm text-[#ffb5a0] uppercase">Tier Aktif — {{ plafonData.discount }}% OFF</div>
                <div class="text-headline-md uppercase mt-1">{{ status?.tier ?? 'tier-1' }}</div>
                <div class="text-body-sm text-white/60">TOP {{ plafonData.top }} hari · auto di katalog, keranjang & checkout</div>
              </VgCard>
              <VgCard class="p-4"><div class="text-label-sm uppercase">Pesanan Mitra</div><div class="text-headline-md">{{ ordersCount ?? '—' }}</div><NuxtLink to="/pesanan" class="text-label-sm underline font-bold">Riwayat →</NuxtLink></VgCard>
              <VgCard class="p-4 bg-white border-[3px] border-black">
                <div class="text-label-sm uppercase">Plafon B2B Live</div>
                <div class="text-headline-sm mt-1">{{ fmt(plafonData.remaining) }} <span class="text-label-sm text-on-surface-variant">sisa</span></div>
                <div class="mt-2 h-2 bg-black/10 border border-black"><div class="h-full bg-[#ff5722] transition-all" :style="{ width: plafonData.pct + '%' }"></div></div>
                <div class="text-body-sm text-on-surface-variant mt-1">Limit {{ fmt(plafonData.limit) }} · {{ plafonData.pct }}% terpakai · tagihan outstanding {{ fmt(plafonData.used) }}</div>
              </VgCard>
            </div>

            <div class="mt-6 grid lg:grid-cols-2 gap-4">
              <VgCard class="p-4">
                <h2 class="text-label-lg uppercase border-b-2 border-black pb-2">Keuntungan Mitra</h2>
                <ul class="mt-3 space-y-2 text-body-sm list-disc pl-4">
                  <li>Diskon termin {{ plafonData.discount }}% otomatis di <NuxtLink to="/katalog" class="underline">katalog</NuxtLink> & checkout</li>
                  <li>Van/Motor dedicated dispatch — estimasi 30 menit Ring 1</li>
                  <li>E-Faktur DJP sync E-Nofa — unduh di <NuxtLink to="/pesanan" class="underline">pesanan</NuxtLink></li>
                  <li>TOP {{ plafonData.top }} hari — hubungi (024) 7692-8800 untuk naik limit ke {{ status?.tier === 'tier-1' ? 'Rp 75jt' : 'Rp 150jt' }}</li>
                </ul>
              </VgCard>
              <VgCard class="p-4">
                <h2 class="text-label-lg uppercase border-b-2 border-black pb-2">Bengkel Terverifikasi</h2>
                <div class="mt-3 text-body-sm space-y-1">
                  <div><span class="font-bold">Nama:</span> {{ status?.name ?? auth.user.value?.name }}</div>
                  <div><span class="font-bold">NIB:</span> <span class="font-mono text-xs">{{ status?.nib ?? '—' }}</span></div>
                  <div><span class="font-bold">Depot:</span> {{ status?.depotId ?? 'SMG-01' }}</div>
                  <div><span class="font-bold">Status:</span> <span class="bg-emerald-600 text-white px-1.5 py-0.5 text-[10px] uppercase">{{ status?.status ?? 'verified' }}</span></div>
                </div>
                <div class="mt-4 flex gap-2">
                  <NuxtLink to="/katalog"><VgButton variant="ember" size="sm">Belanja B2B →</VgButton></NuxtLink>
                  <NuxtLink to="/pesanan" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">Riwayat</NuxtLink>
                </div>
              </VgCard>
            </div>

            <!-- Harga B2B read-only for mitra -->
            <VgCard class="p-4 mt-6">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3">
                <h2 class="text-label-lg uppercase">Daftar Harga B2B Anda — {{ (status?.tier ?? 'tier-1').toUpperCase() }} ({{ plafonData.discount }}% OFF)</h2>
                <input v-model="pricingQuery" placeholder="Cari SKU / nama / brand…" class="border-2 border-black px-3 py-1.5 text-body-sm bg-white min-w-[220px]" />
              </div>
              <div v-if="!pricing.length" class="mt-4 border-2 border-dashed border-black p-4 text-body-sm text-center">Harga B2B belum tersedia — hubungi admin.</div>
              <div v-else class="mt-4 space-y-2 max-h-[480px] overflow-auto pr-1">
                <div v-for="p in filteredPricing" :key="p.sku" class="border-2 border-black p-3 flex flex-wrap items-center gap-3 bg-white">
                  <img v-if="p.product?.image" :src="p.product.image" :alt="p.product?.title" class="size-12 border-2 border-black object-cover shrink-0" />
                  <div class="flex-1 min-w-[200px]">
                    <div class="font-mono text-[11px] font-bold">{{ p.sku }} · {{ p.product?.brand }}</div>
                    <div class="text-body-sm font-bold line-clamp-1">{{ p.product?.title }}</div>
                    <div class="text-label-sm">Retail {{ fmt(p.product?.price ?? 0) }} → <span class="font-bold text-emerald-700">{{ fmt(p.price) }}</span> <span class="bg-black text-white px-1 text-[10px]">HEMAT {{ fmt((p.product?.price ?? 0) - p.price) }}</span></div>
                  </div>
                  <NuxtLink :to="`/produk/${p.sku}`" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold shrink-0">Lihat →</NuxtLink>
                </div>
              </div>
              <p class="text-body-sm text-on-surface-variant mt-3">Harga otomatis dipakai di keranjang & checkout. Butuh tier upgrade? Hubungi (024) 7692-8800.</p>
            </VgCard>
          </template>

          <div v-if="isPartner" class="mt-6 flex flex-wrap gap-2">
            <NuxtLink to="/katalog"><VgButton variant="ember">Belanja Harga B2B →</VgButton></NuxtLink>
            <NuxtLink to="/pesanan"><VgButton>Riwayat Pesanan</VgButton></NuxtLink>
            <NuxtLink to="/cek-keaslian" class="border-2 border-black bg-white px-4 py-2 text-label-sm font-bold">Cek Keaslian Serial</NuxtLink>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
