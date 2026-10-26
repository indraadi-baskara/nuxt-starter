<script setup lang="ts">
export type FeaturedItem = {
  sku: string; title: string; desc: string; price: string
  brandLabel: string; stockLabel: string; img: string; badge: string
  specs: Array<{ k: string; v: string }>; category: string
}
defineProps<{ items: FeaturedItem[]; activeCategory: string }>()
defineEmits<{ add: [item: FeaturedItem]; filter: [cat: string] }>()
const cats = [
  { id: "all", label: "Semua Kategori (14.820)" },
  { id: "brake", label: "Sistem Pengereman" },
  { id: "filter", label: "Filtrasi & Oli" },
  { id: "suspension", label: "Suspensi & Kemudi" },
  { id: "ignition", label: "Pengapian & Kelistrikan" },
  { id: "engine", label: "Engine Parts" },
]
</script>

<template>
  <section id="katalog-grid" class="w-full bg-[#f9f9f9] px-4 lg:px-10 py-10">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1"><span class="inline-block size-3 bg-black" /><span class="text-label-sm uppercase tracking-widest text-[#444748] font-bold">DEPOT STOK AKTIF SEMARANG</span></div>
          <h2 class="text-[32px] lg:text-[48px] font-bold uppercase tracking-tighter leading-none">KATALOG SUKU CADANG UNGGULAN</h2>
        </div>
        <div class="bg-white border-[3px] border-black neo-shadow p-3 flex items-center gap-3">
          <span class="relative inline-flex h-3 w-3 bg-[#ff5722] border border-black"><span class="animate-ping absolute inline-flex h-full w-full bg-[#ff5722] opacity-75" /></span>
          <div><div class="text-label-md uppercase font-bold tracking-wider">VERIFIED LOCAL SEMARANG INVENTORY</div><div class="text-label-sm uppercase text-[#444748]">DEPOT SMG-01 • 50132 JAWA TENGAH</div></div>
        </div>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        <button
          v-for="c in cats" :key="c.id"
          class="shrink-0 px-4 py-2 border-2 border-black text-label-md uppercase font-bold tracking-wider neo-shadow-sm"
          :class="activeCategory===c.id ? 'bg-black text-white shadow-[3px_3px_0px_0px_#ff5722]' : 'bg-white text-black hover:bg-[#eeeeee]'"
          @click="$emit('filter', c.id)"
        >{{ c.label }}</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="it in items" :key="it.sku" class="bg-white border-4 border-black neo-shadow-lg flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 hover:neo-shadow-lg transition-all">
          <div>
            <div class="bg-[#e2e2e2] border-b-[3px] border-black px-3 py-1.5 flex items-center justify-between text-label-sm uppercase font-bold">
              <span class="text-[#ff5722]">{{ it.brandLabel }}</span><span class="bg-black text-white px-1.5 py-0.5">{{ it.stockLabel }}</span>
            </div>
            <div class="p-3">
              <div class="w-full h-48 border-2 border-black bg-[#eeeeee] relative overflow-hidden">
                <img :src="it.img" :alt="it.title" class="w-full h-full object-cover contrast-110" loading="lazy" />
                <span class="absolute bottom-2 left-2 bg-white text-black text-label-sm font-bold uppercase px-1.5 py-0.5 border border-black">{{ it.badge }}</span>
              </div>
            </div>
            <div class="px-3 pb-3">
              <div class="text-label-sm uppercase font-mono text-[#747878] mb-1">SKU: {{ it.sku }}</div>
              <h3 class="text-headline-sm uppercase leading-snug">{{ it.title }}</h3>
              <p class="text-body-sm uppercase text-[#444748] mt-1">{{ it.desc }}</p>
              <div class="bg-[#f9f9f9] border border-black divide-y divide-black text-label-sm mt-3">
                <div v-for="s in it.specs" :key="s.k" class="flex justify-between px-2 py-1"><span class="text-[#444748]">{{ s.k }}</span><span class="font-bold">{{ s.v }}</span></div>
              </div>
            </div>
          </div>
          <div class="border-t-[3px] border-black p-3 bg-[#eeeeee]">
            <div class="flex items-baseline justify-between mb-3"><span class="text-label-sm uppercase font-bold text-[#444748]">HARGA NETTO DEPOT</span><span class="text-headline-md font-bold">{{ it.price }}</span></div>
            <button class="w-full bg-white text-black hover:bg-black hover:text-white border-[3px] border-black py-2.5 text-label-md uppercase font-bold tracking-wider neo-shadow-sm" @click="$emit('add', it)">TAMBAH KE KERANJANG</button>
            <NuxtLink to="/keranjang" class="block text-center text-label-sm uppercase font-bold text-[#ff5722] hover:underline py-1 mt-1">Beli Langsung (Instant Courier SMG) →</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
