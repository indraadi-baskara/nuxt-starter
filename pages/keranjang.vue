<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Keranjang Belanja — Vems Garage" })
const cart = useCart()
const auth = useAuth()
onMounted(() => auth.fetchMe())
const tierHint = computed(() => auth.user.value?.role === 'bengkel_partner' ? 'B2B TIER HARGA AKTIF' : 'DAFTAR B2B HEMAT 8-18%')
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="KERANJANG BELANJA" />
    <div class="max-w-7xl mx-auto px-4 lg:px-10 py-4">
      <CheckoutSteps :current="1" class="mb-4" />
      <div class="grid lg:grid-cols-[1fr_380px] gap-4">
        <VgCard class="p-0 overflow-hidden">
          <div class="bg-black text-white px-4 py-3 flex items-center justify-between">
            <h1 class="text-headline-md uppercase leading-none">KERANJANG BELANJA <span class="text-label-sm normal-case text-white/70">({{ cart.count.value }} ITEM)</span></h1>
            <span class="hidden sm:inline-flex items-center gap-1 bg-secondary-container text-white px-2 py-1 text-label-sm font-bold border border-white">{{ tierHint }}</span>
          </div>
          <div class="p-4">
            <div v-if="!cart.items.value.length" class="py-12 text-center border-2 border-dashed border-black">
              <Icon name="i-lucide-shopping-cart" class="size-10 mx-auto text-black/20" />
              <p class="text-body-md mt-3">Keranjang kosong.</p>
              <NuxtLink to="/katalog" class="inline-block mt-3"><VgButton>Belanja sekarang</VgButton></NuxtLink>
            </div>
            <div v-for="it in cart.items.value" :key="it.sku" class="flex items-center gap-3 border-2 border-black p-3 mb-3 bg-white neo-shadow-sm">
              <div class="size-16 border-2 border-black bg-[#f3f3f4] shrink-0 overflow-hidden">
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
            <div v-if="cart.items.value.length" class="flex justify-between items-center mt-2 border-t-2 border-black pt-3">
              <button class="text-label-sm underline" @click="cart.clear()">Kosongkan keranjang</button>
              <span class="text-body-sm text-on-surface-variant">Vems Express Pengapon — 45 menit SMG</span>
            </div>
          </div>

          <!-- Bundling optimizer (Stitch) -->
          <div v-if="cart.items.value.length" class="bg-[#ffdbd1] border-t-2 border-black p-3">
            <p class="text-label-sm uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-lightbulb" class="size-4" /> BUNDLING OPTIMIZER — HEMAT ONGKIR</p>
            <p class="text-body-sm mt-1">Tambah <strong>Rp 150.000</strong> lagi untuk gratis ongkir Same-Day SMG (hemat Rp 25.000). Tambahkan filter oli / busi?</p>
            <div class="mt-2 flex gap-2">
              <NuxtLink to="/katalog" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">Tambah Part →</NuxtLink>
              <span class="text-label-sm px-2 py-1 bg-black text-white">Sisa Rp 150.000 ke gratis ongkir</span>
            </div>
          </div>
        </VgCard>

        <VgCard class="p-4 h-fit sticky top-[120px]">
          <h2 class="text-label-lg text-black border-b-2 border-black pb-2">RINGKASAN BUNDLING</h2>
          <div class="mt-4 space-y-2 text-body-sm">
            <div class="flex justify-between"><span>Subtotal ({{ cart.count.value }} item)</span><span class="font-bold">{{ cart.fmt(cart.subtotal.value) }}</span></div>
            <div class="flex justify-between"><span>Pengiriman</span><span class="font-bold">Dihitung di checkout</span></div>
            <div class="flex justify-between text-emerald-700 font-bold"><span>Hemat B2B (estimasi)</span><span>- Rp 0</span></div>
            <div class="flex justify-between border-t-2 border-black pt-2 text-body-md font-bold"><span>Total</span><span>{{ cart.fmt(cart.subtotal.value) }}</span></div>
          </div>
          <NuxtLink :to="cart.items.value.length ? '/checkout' : '/keranjang'" class="block mt-4">
            <VgButton variant="ember" class="w-full" :disabled="!cart.items.value.length">LANJUT CHECKOUT →</VgButton>
          </NuxtLink>
          <p class="text-body-sm text-center mt-3 text-[#444748]">Garansi 100% orisinal — e-Faktur resmi DJP otomatis terbit.</p>
          <div class="mt-3 border-2 border-black bg-black text-white p-3 text-label-sm">
            <p class="font-bold">B2B BENGKEL PARTNER</p>
            <p class="text-white/70 mt-1">Diskon tier 8/12/18% + TOP 14 hari otomatis. <NuxtLink to="/verifikasi" class="underline text-[#ff5722]">Verifikasi bengkel →</NuxtLink></p>
          </div>
        </VgCard>
      </div>
    </div>
  </div>
</template>
