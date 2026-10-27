<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Lokasi Semarang & Sentral Depot Pengapon — Vems Garage" })
const depots = ref<any[]>([])
const lots = ref<any[]>([])
const selected = ref<string>("SMG-01")
const loading = ref(true)
const loadingLots = ref(false)
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
  <div class="space-y-4 max-w-4xl">
    <h1 class="text-headline-lg uppercase text-black">Lokasi Semarang &amp; Sentral Depot Pengapon</h1>
    <div v-if="loading" class="border-2 border-black bg-white p-6 text-center text-body-sm">Memuat depot…</div>
    <template v-else>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="d in depots" :key="d.id"
          class="border-[3px] border-black px-4 py-2 text-label-sm font-bold uppercase"
          :class="selected === d.id ? 'bg-black text-white' : 'bg-white text-black'"
          @click="selected = d.id"
        >
          {{ d.name }} — {{ d.id }}
        </button>
      </div>
      <template v-for="d in depots.filter(x => x.id === selected)" :key="d.id">
        <VgCard class="p-4">
          <div class="aspect-[16/9] border-[3px] border-black overflow-hidden bg-[#f3f3f4]"><img :src="`https://picsum.photos/seed/vg-map-${d.id}/900/500`" :alt="`Peta ${d.name}`" class="size-full object-cover" loading="lazy" /></div>
          <div class="mt-4 grid md:grid-cols-3 gap-3 text-body-sm">
            <div class="border-2 border-black p-3"><div class="text-label-sm">Alamat Depot</div><div class="mt-1">{{ d.address }}</div><div class="text-xs text-[#444748] mt-1">Same-day se-Jateng</div></div>
            <div class="border-2 border-black p-3"><div class="text-label-sm">Jam Operasional</div><div class="mt-1">{{ d.hours }}</div><div class="text-xs text-[#444748] mt-1">{{ d.phone }}</div></div>
            <div class="border-2 border-black p-3 bg-[#f3f3f4]"><div class="text-label-sm">Stok Live</div><div class="text-headline-md mt-1">{{ fmt(d.inventory?.available ?? 0) }} unit</div><div class="text-xs mt-1">{{ d.inventory?.skus ?? 0 }} SKU • {{ (d.inventory?.raks ?? []).length }} rak • {{ fmt(d.inventory?.reserved ?? 0) }} reserved</div></div>
          </div>
        </VgCard>
      </template>
      <VgCard class="p-4">
        <h2 class="text-label-lg border-b-2 border-black pb-2">Rak &amp; Stok per SKU</h2>
        <div v-if="loadingLots" class="text-body-sm mt-3">Memuat stok…</div>
        <div v-else-if="!lots.length" class="text-body-sm mt-3">Belum ada stok tercatat untuk depot ini.</div>
        <div v-else class="mt-3 grid md:grid-cols-2 gap-3">
          <div v-for="l in lots" :key="l.id" class="border-2 border-black p-3 bg-white flex gap-3">
            <img :src="l.product?.image || `https://picsum.photos/seed/${l.sku}/200/200`" :alt="l.sku" class="size-12 border-2 border-black object-cover shrink-0" />
            <div class="min-w-0 flex-1"><div class="font-mono text-[11px]">{{ l.sku }} • {{ l.rak }}</div><div class="text-body-sm font-bold leading-tight truncate">{{ l.product?.title ?? l.sku }}</div><div class="text-xs mt-1"><span class="bg-black text-white px-2 py-0.5 font-mono">{{ l.available }} tersedia</span> <span class="text-[#444748] ml-1">{{ l.qty }} total</span></div></div>
          </div>
        </div>
      </VgCard>
    </template>
  </div>
</template>
