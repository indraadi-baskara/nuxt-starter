<script setup lang="ts">
defineProps<{
  sku: string
  title: string
  subtitle?: string
  price: string
  compareAt?: string
  badge?: string
  image?: string
  specs?: Array<{ label: string; value: string }>
  to?: string
  b2bTier?: string
}>()
</script>

<template>
  <VgCard hover class="flex flex-col overflow-hidden">
    <div class="flex items-center justify-between border-b-[3px] border-black bg-black px-3 py-1.5">
      <span class="font-mono text-[10px] tracking-widest text-white">{{ sku }}</span>
      <VgBadge v-if="badge" variant="ember">{{ badge }}</VgBadge>
    </div>
    <NuxtLink :to="to ?? '#'" class="block border-b-2 border-black bg-[#f3f3f4] p-3">
      <img v-if="image" :src="image" :alt="title" class="aspect-[4/3] w-full object-contain border-2 border-black bg-white" />
      <img v-else :src="`https://picsum.photos/seed/vg-fallback-${sku}/600/450`" :alt="title" class="aspect-[4/3] w-full object-cover border-2 border-black bg-white" loading="lazy" />
    </NuxtLink>
    <div class="p-3 flex flex-col gap-3 flex-1">
      <div>
        <h3 class="text-headline-sm text-black uppercase leading-tight line-clamp-2">{{ title }}</h3>
        <p v-if="subtitle" class="text-body-sm text-[#444748] mt-1">{{ subtitle }}</p>
      </div>
      <VgSpecTable v-if="specs?.length" :rows="specs" />
      <div class="mt-auto flex items-end justify-between gap-3 pt-3 border-t-2 border-black">
        <div>
          <div class="text-label-sm text-black/60 line-through" v-if="compareAt">{{ compareAt }}</div>
          <div class="text-headline-sm text-black">{{ price }}</div>
          <div v-if="b2bTier" class="text-[10px] font-bold uppercase bg-emerald-600 text-white px-1.5 py-0.5 mt-1 inline-block">B2B {{ b2bTier }}</div>
        </div>
        <VgButton variant="ember" size="sm">Tambah</VgButton>
      </div>
    </div>
  </VgCard>
</template>
