<script setup lang="ts">
definePageMeta({ layout: "default" })
const route = useRoute()
const { products } = useCatalog()
const cart = useCart()
const param = computed(() => route.params.id as string)
const product = computed(() => {
  const id = param.value
  return products.value.find(p => p.id === id || p.sku === id) ?? null
})
const fetched = ref<any>(null)
watchEffect(async () => {
  if (product.value || !param.value) return
  try {
    const res: any = await $fetch('/api/catalog', { params: { q: param.value } as any })
    const hit = (res?.items ?? []).find((r: any) => r.sku === param.value || r.sku.replace(/[^A-Za-z0-9]/g,'').slice(-4) === param.value)
    if (hit) {
      const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
      fetched.value = {
        id: hit.sku.replace(/[^A-Za-z0-9]/g,'').slice(-4),
        sku: hit.sku, title: hit.title, subtitle: hit.subtitle ?? '', brand: hit.brand, price: hit.b2bPrice ? fmt(Number(hit.b2bPrice)) : fmt(Number(hit.price)),
        compareAt: hit.b2bPrice ? fmt(Number(hit.price)) : (hit.compareAt ? fmt(Number(hit.compareAt)) : undefined),
        badge: hit.badge, image: hit.image, specs: hit.specs ?? [], b2bTier: hit.b2bTier,
      }
    }
  } catch {}
})
const resolved = computed(() => product.value ?? fetched.value)
const qty = ref(1)
const vinInput = ref("")
const vinOk = ref<boolean | null>(null)
function checkVin() { vinOk.value = vinInput.value.trim().length >= 10 }
useHead({ title: () => resolved.value ? `${resolved.value.title} — Vems Garage` : "Produk — Vems Garage" })
function addToCart() { const p = resolved.value; if (!p) return; for (let i=0;i<qty.value;i++) cart.add(p.sku, p.title, p.price, p.image) }
function buyNow() { addToCart(); navigateTo('/keranjang') }
</script>

<template>
  <div v-if="resolved" class="-m-6">
    <!-- Breadcrumb -->
    <div class="w-full bg-surface-container border-b-2 border-black px-4 lg:px-10 py-2">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center gap-2 text-label-sm uppercase">
        <NuxtLink to="/katalog" class="text-on-surface-variant hover:text-black">KATALOG</NuxtLink><span class="text-secondary-container">›</span>
        <span class="text-on-surface-variant">SISTEM PENGEREMAN</span><span class="text-secondary-container">›</span>
        <span class="bg-black text-white px-1.5 py-0.5 font-bold">{{ resolved.sku }}</span>
        <span class="hidden md:inline-flex items-center gap-1 ml-auto bg-white border border-black px-2 py-0.5"><span class="w-2 h-2 bg-emerald-500 animate-pulse rounded-full" /> CHASSIS: HONDA CIVIC FC/FK 1.5 TURBO</span>
      </div>
    </div>

    <!-- Trust strip -->
    <div class="w-full bg-surface-container-lowest border-b-2 border-black px-4 lg:px-10 py-2">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center gap-2 text-label-sm">
        <span class="inline-flex items-center gap-1 bg-black text-white px-2 py-1"><Icon name="i-lucide-badge-check" class="size-3" /> OEM CERTIFIED #8020584 — QC PASS</span>
        <span class="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-1"><Icon name="i-lucide-warehouse" class="size-3" /> STOK: 4 SET DI RAK B-04 DEPOT PENGAPON</span>
        <span class="inline-flex items-center gap-1 bg-[#ff5722] text-white px-2 py-1"><Icon name="i-lucide-shield-check" class="size-3" /> GARANSI 300% UANG KEMBALI OTENTIK</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 lg:px-10 py-4 grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
      <!-- Gallery -->
      <VgCard class="p-3 h-fit">
        <div class="aspect-[4/3] border-2 border-black bg-[#f3f3f4] overflow-hidden relative">
          <img v-if="resolved.image" :src="resolved.image" :alt="resolved.title" class="size-full object-cover" />
          <span v-else class="grid place-items-center size-full"><Icon name="i-lucide-image-off" class="size-8 text-black/20" /></span>
          <span class="absolute top-2 left-2 bg-white border-2 border-black px-2 py-1 text-label-sm font-bold">{{ resolved.badge ?? 'GENUINE' }}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <img v-for="i in 3" :key="i" :src="`https://picsum.photos/seed/vg-pdp-${resolved.id}-${i}/300/300`" :alt="`${resolved.title} detail ${i}`" class="aspect-square w-full object-cover border-2 border-black bg-white" loading="lazy" />
        </div>
        <div class="mt-3 bg-black text-white p-3 border-2 border-black">
          <p class="text-label-sm uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-ruler" class="size-4" /> Toleransi presisi ±0.015mm — QC batch 2025/Q1</p>
          <p class="text-body-sm text-white/70 mt-1">Cross-reference: HONDA 45251-TBA-A00 / BREMBO 09.C306.11 — 100% direct interchange.</p>
        </div>
      </VgCard>

      <!-- Meta -->
      <div class="space-y-4">
        <VgCard class="p-4">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <VgBadge variant="charcoal">{{ resolved.sku }}</VgBadge>
            <VgBadge v-if="resolved.badge" variant="ember">{{ resolved.badge }}</VgBadge>
            <span v-if="resolved.b2bTier" class="bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase">B2B {{ resolved.b2bTier }}</span>
          </div>
          <h1 class="text-headline-lg uppercase text-black leading-none">{{ resolved.title }}</h1>
          <p class="text-body-md text-[#444748] mt-2">{{ resolved.subtitle }}</p>

          <!-- VIN check -->
          <div class="mt-4 border-2 border-black p-3 bg-surface-container">
            <p class="text-label-sm uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-scan-search" class="size-4" /> LIVE VIN COMPATIBILITY CHECK</p>
            <div class="mt-2 flex border-2 border-black">
              <input v-model="vinInput" placeholder="MASUKKAN 17 DIGIT VIN…" class="flex-1 px-3 py-2 text-body-sm font-mono uppercase focus:outline-none bg-white" maxlength="17" />
              <button class="bg-black text-white px-4 text-label-sm font-bold border-l-2 border-black" @click="checkVin">CEK</button>
            </div>
            <p v-if="vinOk===true" class="mt-2 text-body-sm bg-emerald-50 border border-emerald-600 text-emerald-800 px-2 py-1">✓ Kompatibel — garansi fitment 100% untuk VIN ini.</p>
            <p v-if="vinOk===false" class="mt-2 text-body-sm bg-[#ffdbd1] border border-black px-2 py-1">Digit kurang — 17 digit diperlukan.</p>
          </div>

          <VgSpecTable :rows="resolved.specs" class="mt-4" />

          <div class="flex items-end justify-between mt-4 pt-4 border-t-2 border-black gap-3">
            <div>
              <div v-if="resolved.compareAt" class="text-body-sm line-through text-black/50">{{ resolved.compareAt }}</div>
              <div class="text-headline-md text-black">{{ resolved.price }}</div>
              <p class="text-label-sm text-on-surface-variant">Termasuk PPN • Cicilan 0%</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center border-2 border-black"><button class="px-3 py-2 hover:bg-black hover:text-white" @click="qty=Math.max(1,qty-1)">−</button><span class="w-10 text-center font-mono text-sm">{{ qty }}</span><button class="px-3 py-2 hover:bg-black hover:text-white" @click="qty++">+</button></div>
              <div class="flex gap-2">
                <VgButton variant="ember" @click="addToCart">Tambah ke Keranjang</VgButton>
                <VgButton variant="primary" @click="buyNow">Beli Sekarang</VgButton>
              </div>
            </div>
          </div>
          <p class="text-body-sm text-center mt-2 text-on-surface-variant">Same-day SMG 45 menit • Ambil di Depot Pengapon gratis.</p>
        </VgCard>

        <!-- Bundle -->
        <VgCard class="p-4 bg-surface-container">
          <h3 class="text-label-md uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-package" class="size-4" /> BUNDLE REKOMENDASI PEMASANGAN LENGKAP</h3>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <div class="border-2 border-black bg-white p-2 text-center"><img src="https://picsum.photos/seed/vg-bundle-brake/200/200" class="w-full aspect-square object-cover border border-black" /><p class="text-label-sm mt-1">Kampas Rem Bendix CT</p><p class="text-label-sm font-bold">Rp 465.000</p></div>
            <div class="border-2 border-black bg-white p-2 text-center"><img src="https://picsum.photos/seed/vg-bundle-oil/200/200" class="w-full aspect-square object-cover border border-black" /><p class="text-label-sm mt-1">Minyak Rem DOT4</p><p class="text-label-sm font-bold">Rp 85.000</p></div>
            <div class="border-2 border-black bg-white p-2 text-center"><img src="https://picsum.photos/seed/vg-bundle-clean/200/200" class="w-full aspect-square object-cover border border-black" /><p class="text-label-sm mt-1">Cleaner + Grease</p><p class="text-label-sm font-bold">Rp 45.000</p></div>
          </div>
          <VgButton variant="outline" class="w-full mt-3" @click="addToCart">Tambah Bundle Hemat — Rp 595.000</VgButton>
        </VgCard>

        <VgCard class="p-4 bg-[#ffdbd1] border-black">
          <p class="text-label-sm text-black font-bold">Garansi 100% orisinal — retur fisik Depot Pengapon. Cek keaslian via serial.</p>
          <NuxtLink to="/cek-keaslian" class="inline-block mt-2 text-label-sm underline text-black">Cek Keaslian →</NuxtLink>
        </VgCard>
      </div>
    </div>

    <!-- Specs metrology -->
    <section class="max-w-7xl mx-auto px-4 lg:px-10 pb-6">
      <VgCard class="p-0 overflow-hidden">
        <div class="bg-black text-white px-4 py-3 flex items-center justify-between">
          <h2 class="text-label-lg uppercase">SPESIFIKASI TEKNIS & TOLERANSI FISIK — METRIC (MM) • BATCH 2025/Q1</h2>
          <span class="font-mono text-[11px] bg-white text-black px-2 py-0.5">DIN EN ISO 9001</span>
        </div>
        <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-black">
          <div class="p-4">
            <h3 class="text-label-sm font-bold uppercase border-b-2 border-black pb-2">PARAMETER DIMENSI</h3>
            <div class="mt-3 space-y-2 text-body-sm">
              <div class="flex justify-between border-b border-black/10 pb-1"><span>Diameter Luar Nominal</span><span class="font-mono font-bold">282.00 mm</span></div>
              <div class="flex justify-between border-b border-black/10 pb-1"><span>Ketebalan Rotor Baru</span><span class="font-mono font-bold">23.00 mm</span></div>
              <div class="flex justify-between border-b border-black/10 pb-1"><span>Batas Servis Minimum (Min TH)</span><span class="font-mono font-bold text-error">21.00 mm</span></div>
              <div class="flex justify-between"><span>Tinggi Total Rotor (Hat Height)</span><span class="font-mono font-bold">47.20 mm</span></div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-label-sm font-bold uppercase border-b-2 border-black pb-2">METROLOGI HUB & TOLERANSI</h3>
            <div class="mt-3 space-y-2 text-body-sm">
              <div class="flex justify-between border-b border-black/10 pb-1"><span>Run-out Aksial Maksimal</span><span class="font-mono font-bold">≤ 0.015 mm</span></div>
              <div class="flex justify-between border-b border-black/10 pb-1"><span>Variasi Ketebalan (DTV)</span><span class="font-mono font-bold">≤ 0.008 mm</span></div>
              <div class="flex justify-between border-b border-black/10 pb-1"><span>PCD & Jumlah Lubang</span><span class="font-mono font-bold">5 × 114.3 mm</span></div>
              <div class="flex justify-between"><span>Diameter Hub Tengah</span><span class="font-mono font-bold">64.10 mm</span></div>
            </div>
          </div>
        </div>
        <div class="bg-surface-container border-t-2 border-black p-3 text-body-sm flex flex-wrap gap-4">
          <span><span class="font-bold">Material:</span> GG20 HC High-Carbon Alloy</span>
          <span><span class="font-bold">Venting:</span> PVT +40% dissipation</span>
          <span><span class="font-bold">Torsi roda:</span> 108 Nm (OEM Honda)</span>
        </div>
      </VgCard>

      <div class="grid md:grid-cols-3 gap-3 mt-4">
        <VgCard class="p-4"><h3 class="text-label-sm font-bold uppercase">PROSEDUR BEDDING-IN 200 KM</h3><p class="text-body-sm mt-2">Hindari hard braking 200 km pertama — biarkan transfer lapisan karbon merata ke kampas.</p></VgCard>
        <VgCard class="p-4"><h3 class="text-label-sm font-bold uppercase">BUBUT PRESISI GARANSI RUN-OUT NOL</h3><p class="text-body-sm mt-2">Pasang di bengkel rekanan Vems — dial-indicator alignment gratis, anti deformasi hub.</p><NuxtLink to="/layanan-bengkel" class="text-label-sm underline">Cek rekanan SMG →</NuxtLink></VgCard>
        <VgCard class="p-4"><h3 class="text-label-sm font-bold uppercase">RETUR 14 HARI — INSTANT SWAP</h3><p class="text-body-sm mt-2">Jika rotor tidak presisi untuk VIN terverifikasi, tukar baru 2 jam area SMG.</p></VgCard>
      </div>
    </section>
  </div>
  <div v-else class="border-[3px] border-black bg-white p-8 text-center max-w-2xl mx-auto mt-6">
    <p class="text-body-md">Produk tidak ditemukan.</p>
    <NuxtLink to="/katalog" class="inline-block mt-4"><VgButton>Kembali ke Katalog</VgButton></NuxtLink>
  </div>
</template>
