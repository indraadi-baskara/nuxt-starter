<script setup lang="ts">
defineProps<{ rows: Array<{ label: string; value: string }> }>()
</script>

<template>
  <div class="border-[3px] border-black overflow-hidden">
    <div
      v-for="(r, i) in rows"
      :key="r.label"
      class="grid grid-cols-[1fr_1fr] border-b last:border-b-0 border-black/20"
      :class="i % 2 === 1 ? 'bg-[#f4f4f4]' : 'bg-white'"
    >
      <span class="px-3 py-2 text-label-sm text-black border-r border-black/20">{{ r.label }}</span>
      <span class="px-3 py-2 text-body-sm font-bold text-black font-['Space_Grotesk']">{{ r.value }}</span>
    </div>
  </div>
</template>
