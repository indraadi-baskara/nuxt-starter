<script setup lang="ts">
const { q, brand, category, filtered, brands, categories } = useCatalog()
definePageMeta({ layout: "default" })
useHead({ title: "Katalog Suku Cadang — Vems Garage" })
const route = useRoute()
watchEffect(() => { if (route.query.q) q.value = String(route.query.q) })
</script>

<template>
  <div class="space-y-4">
    <div class="border-[3px] border-black bg-white p-4 flex items-center justify-between gap-4">
      <h1 class="text-headline-md uppercase text-black">Katalog Suku Cadang</h1>
      <VgBadge variant="charcoal">{{ filtered.length }} SKU</VgBadge>
    </div>

    <div class="grid lg:grid-cols-[300px_1fr] gap-4">
      <FilterPanel v-model:q="q" v-model:brand="brand" v-model:category="category" :brands="brands" :categories="categories" />

      <div>
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
          />
        </div>
        <div v-else class="border-[3px] border-black bg-white p-8 text-center">
          <p class="text-body-md">Tidak ada hasil untuk filter ini.</p>
          <VgButton class="mt-4" @click="q=''; brand=''; category=''">Reset Filter</VgButton>
        </div>
      </div>
    </div>
  </div>
</template>
