<script setup lang="ts">
defineProps<{ current: number }>()
const steps = ["Keranjang", "Data Pengiriman", "Pembayaran", "Konfirmasi"]
</script>

<template>
  <div class="flex items-center gap-0 border-2 border-black overflow-hidden">
    <div
      v-for="(s, i) in steps"
      :key="s"
      class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-label-sm uppercase font-bold border-r-2 border-black last:border-r-0"
      :class="i + 1 === current ? 'bg-black text-white' : i + 1 < current ? 'bg-[#ff5722] text-white' : 'bg-white text-black'"
    >
      <span class="size-5 grid place-items-center border border-current text-[11px] leading-none">{{ i + 1 }}</span>
      <span class="hidden sm:inline">{{ s }}</span>
    </div>
  </div>
</template>
