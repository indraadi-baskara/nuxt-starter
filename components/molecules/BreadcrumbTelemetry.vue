<template>
  <section class="w-full bg-surface-container border-b-2 border-primary">
    <div class="max-w-7xl mx-auto px-4 lg:px-10 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 font-label-sm text-label-sm uppercase">
      <div class="flex items-center gap-2 tracking-wider text-on-surface">
        <NuxtLink to="/" class="text-on-surface-variant hover:text-primary">BERANDA</NuxtLink>
        <span class="text-secondary-container font-bold">/</span>
        <NuxtLink to="/katalog" class="hover:underline">KATALOG SUKU CADANG</NuxtLink>
        <span v-if="trail" class="text-secondary-container font-bold">/</span>
        <span v-if="trail" class="bg-primary text-on-primary px-1.5 py-0.5 font-bold">{{ trail }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 border border-primary px-2 py-0.5 bg-surface-container-lowest">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span class="hidden sm:inline">DEPOT CENTRAL JAVA (PENGAPON)</span>
          <span class="sm:hidden">PENGAPON</span>
        </span>
        <span class="text-secondary font-bold">SYNC: LIVE 0.8s</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ trail?: string }>()
</script>
