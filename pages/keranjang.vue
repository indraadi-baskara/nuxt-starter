<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Keranjang Belanja — Vems Garage" })
const cart = useCart()
</script>

<template>
  <div class="grid lg:grid-cols-[1fr_380px] gap-4 max-w-[1400px] mx-auto">
    <VgCard class="p-4">
      <h1 class="text-headline-md uppercase text-black border-b-[3px] border-black pb-3 mb-4">Keranjang Belanja <span class="text-label-sm normal-case">({{ cart.count.value }} item)</span></h1>
      <div v-if="!cart.items.value.length" class="py-12 text-center">
        <p class="text-body-md">Keranjang kosong.</p>
        <NuxtLink to="/katalog" class="inline-block mt-3"><VgButton>Belanja sekarang</VgButton></NuxtLink>
      </div>
      <div v-for="it in cart.items.value" :key="it.sku" class="flex items-center gap-3 border-2 border-black p-3 mb-3 bg-white">
        <div class="size-16 border-2 border-black bg-[#f3f3f4] shrink-0 overflow-hidden grid place-items-center text-[10px]">
          <img v-if="it.image" :src="it.image" :alt="it.title" class="size-full object-cover" />
          <img v-else :src="`https://picsum.photos/seed/${it.sku}/200/200`" :alt="it.title" class="size-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-mono text-[11px] tracking-widest">{{ it.sku }}</div>
          <div class="text-body-sm font-bold truncate">{{ it.title }}</div>
          <div class="text-label-sm">{{ it.price }}</div>
        </div>
        <div class="flex items-center gap-2">
          <button class="size-8 border-2 border-black grid place-items-center hover:bg-black hover:text-white" @click="cart.dec(it.sku)">−</button>
          <span class="w-8 text-center font-mono text-sm">{{ it.qty }}</span>
          <button class="size-8 border-2 border-black grid place-items-center hover:bg-black hover:text-white" @click="cart.inc(it.sku)">+</button>
        </div>
        <button class="border-2 border-black p-2 hover:bg-black hover:text-white" @click="cart.remove(it.sku)"><Icon name="i-lucide-trash-2" class="size-4" /></button>
      </div>
      <div v-if="cart.items.value.length" class="flex justify-end mt-2">
        <button class="text-label-sm underline" @click="cart.clear()">Kosongkan keranjang</button>
      </div>
    </VgCard>

    <VgCard class="p-4 h-fit">
      <h2 class="text-label-lg text-black border-b-2 border-black pb-2">Ringkasan</h2>
      <div class="mt-4 space-y-2 text-body-sm">
        <div class="flex justify-between"><span>Subtotal</span><span class="font-bold">{{ cart.fmt(cart.subtotal.value) }}</span></div>
        <div class="flex justify-between"><span>Pengiriman</span><span class="font-bold">Dihitung di checkout</span></div>
        <div class="flex justify-between border-t-2 border-black pt-2 text-body-md font-bold"><span>Total</span><span>{{ cart.fmt(cart.subtotal.value) }}</span></div>
      </div>
      <NuxtLink :to="cart.items.value.length ? '/checkout' : '/keranjang'" class="block mt-4">
        <VgButton variant="ember" class="w-full" :disabled="!cart.items.value.length">Checkout</VgButton>
      </NuxtLink>
      <p class="text-body-sm text-center mt-3 text-[#444748]">Garansi 100% orisinal — e-Faktur resmi DJP.</p>
    </VgCard>
  </div>
</template>
