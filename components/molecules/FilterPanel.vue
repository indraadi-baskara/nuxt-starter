<script setup lang="ts">
defineProps<{
  brands: string[]
  categories: string[]
}>()
defineEmits<{ apply: [] }>()
const q = defineModel<string>("q", { default: "" })
const brand = defineModel<string>("brand", { default: "" })
const category = defineModel<string>("category", { default: "" })
</script>

<template>
  <aside class="border-[3px] border-black bg-surface-container-lowest neo-shadow p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between border-b-2 border-black pb-2">
      <h3 class="text-label-lg text-black flex items-center gap-2"><Icon name="i-lucide-filter" class="size-4" /> FILTER TEKNIS</h3>
      <span class="bg-black text-white px-1.5 py-0.5 text-[11px] font-mono font-bold">{{ brands.length + categories.length }} FACETS</span>
    </div>

    <div class="space-y-3">
      <div class="bg-white border-2 border-black p-3">
        <p class="text-label-sm uppercase font-bold mb-1">SISTEM MEKANIKAL</p>
        <VgSelect v-model="category" label="" placeholder="Semua kategori" :options="[{label:'Semua sistem', value:''}, ...categories.map(c=>({label:c,value:c}))]" />
        <div class="mt-2 flex flex-wrap gap-1">
          <span v-for="c in categories" :key="c" class="text-[11px] px-2 py-1 border border-black" :class="category===c?'bg-black text-white':'bg-white text-black'">{{ c }}</span>
        </div>
      </div>

      <div class="bg-white border-2 border-black p-3">
        <p class="text-label-sm uppercase font-bold mb-1">BRAND OEM & PERFORMANCE</p>
        <VgSelect v-model="brand" label="" placeholder="Semua merek" :options="[{label:'Semua brand', value:''}, ...brands.map(b=>({label:b,value:b}))]" />
      </div>

      <VgInput v-model="q" label="Cari SKU / Nama" placeholder="Mis. Brembo, 09.8901..." />

      <div class="bg-primary text-on-primary border-2 border-black p-3">
        <p class="text-label-sm uppercase font-bold text-white">KETERSEDIAAN SEMARANG</p>
        <label class="mt-2 flex items-center gap-2 text-body-sm"><input type="radio" checked class="accent-black" /> READY DEPOT PENGAPON — Same-Day</label>
        <label class="flex items-center gap-2 text-body-sm mt-1"><input type="radio" class="accent-black" /> Semua sumber (indent 1-2 hari)</label>
      </div>

      <div class="flex gap-2">
        <VgButton variant="ember" class="flex-1" @click="$emit('apply')">Terapkan</VgButton>
        <VgButton variant="outline" @click="q=''; brand=''; category=''">Reset</VgButton>
      </div>
    </div>
    <slot />
  </aside>
</template>
