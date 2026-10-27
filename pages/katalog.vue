<script setup lang="ts">
const { q, brand, category, filtered, brands, categories } = useCatalog()
const cart = useCart()
definePageMeta({ layout: "default" })
useHead({ title: "Katalog Suku Cadang — Vems Garage" })
const route = useRoute()
watchEffect(() => { if (route.query.q) q.value = String(route.query.q) })
const garasiLabel = ref("HONDA CR-V 1.5 TURBO (RW)")
function onGarasiChange(v: any) {
  garasiLabel.value = `${v.make} ${v.model} ${v.engine}`.toUpperCase()
  // soft filter hint: map make to brand if matches
  if (v.make && brands.value.includes(v.make.slice(0,1)+v.make.slice(1).toLowerCase())) brand.value = v.make.slice(0,1)+v.make.slice(1).toLowerCase()
}
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="SISTEM PENGEREMAN & KAKI-KAKI" />
    <InventoryHeader
      title="KATALOG SUKU CADANG SEMARANG DEPOT"
      subtitle="Inventori bersertifikasi ATPM Genuine Parts, Brembo High-Carbon, dan komponen heavy-duty siap kirim same-day area Semarang Raya & Jawa Tengah."
      code="PLP-BRK-CHASSIS-04"
      live
      cutoff="16:30 WIB"
    />
    <GarasiSaya @change="onGarasiChange" />

    <section class="w-full max-w-7xl mx-auto px-4 lg:px-10 py-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <aside class="lg:col-span-3 flex flex-col gap-4">
          <FilterPanel v-model:q="q" v-model:brand="brand" v-model:category="category" :brands="brands" :categories="categories">
            <div class="border-t-2 border-black pt-3 mt-2">
              <p class="text-label-sm uppercase font-bold">Garasi aktif</p>
              <p class="text-body-sm font-mono bg-black text-white px-2 py-1 mt-1">{{ garasiLabel }}</p>
              <p class="text-body-sm text-on-surface-variant mt-2">Garansi fitment 100% uang kembali untuk kompatibilitas terverifikasi.</p>
            </div>
          </FilterPanel>
          <div class="border-2 border-black bg-[#fff4d6] p-3">
            <p class="text-label-sm uppercase font-bold flex items-center gap-1"><Icon name="i-lucide-headset" class="size-4" /> Butuh verifikasi teknis?</p>
            <p class="text-body-sm mt-1">Konsultasikan foto VIN/STNK dengan Kepala Mekanik Depot Pengapon.</p>
            <a href="https://wa.me/6281128900000" target="_blank" class="mt-2 inline-flex items-center gap-2 bg-[#25d366] text-white border-2 border-black px-3 py-1.5 text-label-sm font-bold"><Icon name="i-lucide-message-circle" class="size-4" /> WHATSAPP MEKANIK DEPOT</a>
          </div>
        </aside>

        <div class="lg:col-span-9">
          <div class="flex items-center justify-between border-2 border-black bg-white px-3 py-2 mb-3">
            <span class="text-label-sm uppercase font-bold">{{ filtered.length }} HASIL • {{ garasiLabel }}</span>
            <span class="text-label-sm uppercase text-on-surface-variant">Sorted: Relevansi Depot</span>
          </div>
          <div v-if="filtered.length" class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <ProductCard
              v-for="p in filtered"
              :key="p.id"
              :sku="p.sku"
              :title="p.title"
              :subtitle="p.subtitle"
              :price="p.price"
              :compare-at="p.compareAt"
              :badge="p.badge"
              :specs="p.specs"
              :b2b-tier="p.b2bTier"
              :to="`/produk/${p.id}`"
              @add="cart.add($event.sku, $event.title, $event.price, $event.image)"
            />
          </div>
          <div v-else class="border-[3px] border-black bg-white p-8 text-center">
            <p class="text-body-md">Tidak ada hasil untuk filter ini.</p>
            <VgButton class="mt-4" @click="q=''; brand=''; category=''">Reset Filter</VgButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
