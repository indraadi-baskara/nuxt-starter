<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "staff" })
useHead({ title: "Admin — Harga B2B per Tier — Vems Garage" })
const auth = useAuth()
const tier = ref('tier-1')
const items = ref<any[]>([])
const busy = ref(false)
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }
async function load() {
  try { const r: any = await $fetch('/api/admin/pricing', { credentials: 'include' as any, query: { tier: tier.value } }); items.value = r?.items ?? [] } catch (e: any) { alert(e?.data?.message || e?.message) }
}
async function save(sku: string, price: number) {
  busy.value = true
  try { await $fetch('/api/admin/pricing', { method: 'PUT', body: { sku, tier: tier.value, price }, credentials: 'include' as any }); await load() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = false }
}
watch(tier, load)
onMounted(async () => { await auth.fetchMe(); await load() })
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="ADMIN // HARGA B2B — 8% / 12% / 18% PER TIER" />
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <h1 class="text-headline-xl uppercase tracking-tighter">HARGA B2B PER TIER</h1>
        <p class="text-body-sm text-on-surface-variant mt-1">Atur harga termin per SKU — otomatis dipakai di katalog, keranjang, dan checkout untuk role <span class="font-mono bg-black text-white px-1">bengkel_partner</span>.</p>

        <div class="mt-4 flex flex-wrap gap-2 items-center">
          <select v-model="tier" class="border-2 border-black px-3 py-2 text-body-sm bg-white"><option value="tier-1">Tier-1 — 8% OFF</option><option value="tier-2">Tier-2 — 12% OFF</option><option value="tier-3">Tier-3 — 18% OFF</option></select>
          <VgButton size="sm" @click="load">Refresh</VgButton>
          <span v-if="busy" class="text-body-sm">Menyimpan…</span>
          <span class="text-body-sm text-on-surface-variant">{{ items.length }} entri untuk {{ tier }}</span>
        </div>

        <div v-if="!items.length" class="mt-6 border-2 border-dashed border-black p-6 text-center text-body-sm">
          Belum ada harga B2B untuk tier ini. Seed default tersedia — harga retail otomatis dipakai jika entri kosong.
        </div>
        <div v-else class="mt-6 space-y-3">
          <div v-for="p in items" :key="p.sku + p.tier" class="border-2 border-black p-3 flex flex-wrap items-center gap-3 bg-white">
            <div class="flex-1 min-w-[220px]">
              <div class="font-mono text-xs font-bold">{{ p.sku }} — {{ p.product?.title ?? p.sku }}</div>
              <div class="text-body-sm">Retail {{ fmt(p.product?.price ?? 0) }} → B2B <span class="font-bold">{{ fmt(p.price) }}</span></div>
              <div class="text-xs text-[#444748]">Brand {{ p.product?.brand ?? '—' }}</div>
            </div>
            <div class="flex gap-2 items-center">
              <input :id="'price-'+p.sku" type="number" :value="p.price" class="border-2 border-black px-2 py-1 w-32 text-body-sm font-mono bg-white" @change="(e:any)=> save(p.sku, Number((e.target as HTMLInputElement).value))" />
              <span class="text-xs">IDR</span>
            </div>
          </div>
        </div>

        <div class="mt-6 border-2 border-black bg-[#fff4d6] p-3 text-body-sm">
          Tip: kosongkan entri → sistem fallback ke harga retail. Edit langsung simpan (on change).
        </div>
      </div>
    </section>
  </div>
</template>
