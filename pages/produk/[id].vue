<script setup lang="ts">
definePageMeta({ layout: "default" })
const route = useRoute()
const { products } = useCatalog()
const cart = useCart()
const product = computed(() => products.value.find(p => p.id === route.params.id as string))
const qty = ref(1)
useHead({ title: () => product.value ? `${product.value.title} — Vems Garage` : "Produk — Vems Garage" })
function addToCart() { if (!product.value) return; for (let i=0;i<qty.value;i++) cart.add(product.value.sku, product.value.title, product.value.price, product.value.image) }
function buyNow() { addToCart(); navigateTo('/keranjang') }
</script>

<template>
  <div v-if="product" class="space-y-4">
    <div class="flex items-center gap-2 text-label-sm">
      <NuxtLink to="/katalog" class="underline">Katalog</NuxtLink>
      <span>/</span>
      <span class="text-black">{{ product.sku }}</span>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <VgCard class="p-3">
        <div class="aspect-[4/3] border-2 border-black bg-[#f3f3f4] overflow-hidden"><img v-if="product.image" :src="product.image" :alt="product.title" class="size-full object-cover" /><span v-else class="grid place-items-center size-full"><Icon name="i-lucide-image-off" class="size-8 text-black/20" /></span></div>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <img v-for="i in 3" :key="i" :src="`https://picsum.photos/seed/vg-pdp-${product.id}-${i}/300/300`" :alt="`${product.title} detail ${i}`" class="aspect-square w-full object-cover border-2 border-black bg-white" loading="lazy" />
        </div>
      </VgCard>

      <div class="space-y-4">
        <VgCard class="p-4">
          <div class="flex items-center gap-2 mb-2">
            <VgBadge variant="charcoal">{{ product.sku }}</VgBadge>
            <VgBadge v-if="product.badge" variant="ember">{{ product.badge }}</VgBadge>
          </div>
          <h1 class="text-headline-lg uppercase text-black leading-none">{{ product.title }}</h1>
          <p class="text-body-md text-[#444748] mt-2">{{ product.subtitle }}</p>
          <VgSpecTable :rows="product.specs" class="mt-4" />
          <div class="flex items-end justify-between mt-4 pt-4 border-t-2 border-black">
            <div>
              <div v-if="product.compareAt" class="text-body-sm line-through text-black/50">{{ product.compareAt }}</div>
              <div class="text-headline-md text-black">{{ product.price }}</div>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center border-2 border-black"><button class="px-3 py-2 hover:bg-black hover:text-white" @click="qty=Math.max(1,qty-1)">−</button><span class="w-10 text-center font-mono text-sm">{{ qty }}</span><button class="px-3 py-2 hover:bg-black hover:text-white" @click="qty++">+</button></div>
              <VgButton variant="ember" @click="addToCart">Tambah ke Keranjang</VgButton>
              <VgButton variant="primary" @click="buyNow">Beli Sekarang</VgButton>
            </div>
          </div>
        </VgCard>

        <VgCard class="p-4 bg-[#ffdbd1] border-black">
          <p class="text-label-sm text-black">Garansi 100% orisinal — retur fisik Depot Pengapon. Cek keaslian via serial.</p>
          <NuxtLink to="/cek-keaslian" class="inline-block mt-2 text-label-sm underline text-black">Cek Keaslian →</NuxtLink>
        </VgCard>
      </div>
    </div>
  </div>
  <div v-else class="border-[3px] border-black bg-white p-8 text-center">
    <p class="text-body-md">Produk tidak ditemukan.</p>
    <NuxtLink to="/katalog" class="inline-block mt-4"><VgButton>Kembali ke Katalog</VgButton></NuxtLink>
  </div>
</template>
