<script setup lang="ts">
defineProps<{
  brands: string[]
  categories: string[]
}>()
const q = defineModel<string>("q", { default: "" })
const brand = defineModel<string>("brand", { default: "" })
const category = defineModel<string>("category", { default: "" })
</script>

<template>
  <aside class="border-[3px] border-black bg-white neo-shadow p-4 flex flex-col gap-4">
    <h3 class="text-label-lg text-black border-b-2 border-black pb-2">Filter</h3>
    <VgInput v-model="q" label="Cari SKU / Nama" placeholder="Mis. Brembo, 09.8901..." />
    <VgSelect v-model="brand" label="Merek" placeholder="Semua merek" :options="brands.map(b=>({label:b,value:b}))" />
    <VgSelect v-model="category" label="Kategori" placeholder="Semua kategori" :options="categories.map(c=>({label:c,value:c}))" />
    <slot />
  </aside>
</template>
