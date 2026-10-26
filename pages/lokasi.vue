<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Lokasi Semarang & Sentral Depot Pengapon — Vems Garage" })
</script>

<template>
  <div class="space-y-4 max-w-4xl">
    <h1 class="text-headline-lg uppercase text-black">Lokasi Semarang &amp; Sentral Depot Pengapon</h1>
    <VgCard class="p-4">
      <div class="aspect-[16/9] border-[3px] border-black overflow-hidden bg-[#f3f3f4]"><img src="https://picsum.photos/seed/vg-map-pengapon/900/500" alt="Peta Depot SMG-01 — Pengapon Semarang" class="size-full object-cover" loading="lazy" /></div>
      <div class="mt-4 grid md:grid-cols-2 gap-4 text-body-sm">
        <div class="border-2 border-black p-3"><div class="text-label-sm">Alamat Depot</div><div>Jl. Pengapon No. 12, Semarang — Same-day se-Jateng</div></div>
        <div class="border-2 border-black p-3"><div class="text-label-sm">Jam Operasional</div><div>Senin–Sabtu 08:00–17:00 WIB</div></div>
      </div>
    </VgCard>
  </div>
</template>
