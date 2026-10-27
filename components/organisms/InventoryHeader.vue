<template>
  <section class="w-full bg-surface-container-lowest border-b-2 border-primary">
    <div class="max-w-7xl mx-auto px-4 lg:px-10 py-4">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div class="flex flex-col gap-1">
          <div class="inline-flex items-center gap-2">
            <span class="bg-secondary-container text-on-secondary px-2 py-0.5 font-label-sm uppercase font-bold border border-primary neo-shadow-sm">SPEC-SHEET VEMS</span>
            <span class="font-label-sm uppercase text-on-surface-variant font-mono">CODE: {{ code }}</span>
          </div>
          <h1 class="font-headline-xl text-headline-xl uppercase tracking-tighter text-primary mt-1 leading-none">
            {{ title }}
          </h1>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">{{ subtitle }}</p>
        </div>
        <div class="flex flex-wrap items-stretch gap-2 shrink-0">
          <div class="bg-surface border-2 border-primary p-2.5 neo-shadow-sm flex flex-col justify-between min-w-[140px]">
            <span class="font-label-sm uppercase text-on-surface-variant">TOTAL PART TERSEDIA</span>
            <span class="font-headline-md text-primary font-bold">{{ totalSku }} <span class="font-label-md font-normal text-on-surface-variant">SKU</span></span>
          </div>
          <div class="bg-primary text-on-primary border-2 border-primary p-2.5 neo-shadow-sm flex flex-col justify-between min-w-[140px]">
            <span class="font-label-sm uppercase text-tertiary-fixed-dim">DEPOT READY RATIO</span>
            <span class="font-headline-md text-secondary-container font-bold">{{ readyRatio }}</span>
          </div>
          <div class="bg-secondary-container text-on-secondary border-2 border-primary p-2.5 neo-shadow-sm flex flex-col justify-between min-w-[130px]">
            <span class="font-label-sm uppercase text-on-secondary-container font-bold">SAME-DAY CUTOFF</span>
            <span class="font-headline-md font-bold">{{ cutoff }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title: string; subtitle: string; code?: string; totalSku?: string; readyRatio?: string; cutoff?: string }>(), {
  code: "PLP-GEN-01",
  totalSku: "1,482",
  readyRatio: "94.2%",
  cutoff: "16:30 WIB",
})
</script>
