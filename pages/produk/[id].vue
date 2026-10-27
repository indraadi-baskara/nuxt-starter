<script setup lang="ts">
definePageMeta({ layout: "default" })
const route = useRoute()
const { products } = useCatalog()
const cart = useCart()
const param = computed(() => route.params.id as string)
const product = computed(() => {
  const id = param.value
  return products.value.find(p => p.id === id || p.sku === id) ?? null
})
// fallback: fetch directly if not in client list (SSR / deep link)
const fetched = ref<any>(null)
watchEffect(async () => {
  if (product.value || !param.value) return
  try {
    const res: any = await $fetch('/api/catalog', { params: { q: param.value } as any })
    const hit = (res?.items ?? []).find((r: any) => r.sku === param.value || r.sku.replace(/[^A-Za-z0-9]/g,'').slice(-4) === param.value)
    if (hit) {
      const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
      fetched.value = {
        id: hit.sku.replace(/[^A-Za-z0-9]/g,'').slice(-4),
        sku: hit.sku, title: hit.title, subtitle: hit.subtitle ?? '', brand: hit.brand, price: hit.b2bPrice ? fmt(Number(hit.b2bPrice)) : fmt(Number(hit.price)),
        compareAt: hit.b2bPrice ? fmt(Number(hit.price)) : (hit.compareAt ? fmt(Number(hit.compareAt)) : undefined),
        badge: hit.badge, image: hit.image, specs: hit.specs ?? [], b2bTier: hit.b2bTier,
      }
    }
  } catch {}
})
const resolved = computed(() => product.value ?? fetched.value)
const qty = ref(1)
useHead({ title: () => resolved.value ? `${resolved.value.title} — Vems Garage` : "Produk — Vems Garage" })
function addToCart() { const p = resolved.value; if (!p) return; for (let i=0;i<qty.value;i++) cart.add(p.sku, p.title, p.price, p.image) }
function buyNow() { addToCart(); navigateTo('/keranjang') }
</script>

<template>
  <div v-if="resolved" class="space-y-4">
    <div class="flex items-center gap-2 text-label-sm">
      <NuxtLink to="/katalog" class="underline">Katalog</NuxtLink>
      <span>/</span>
      <span class="text-black">{{ resolved.sku }}</span>
      <span v-if="resolved.b2bTier" class="bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase">B2B {{ resolved.b2bTier }}</span>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <VgCard class="p-3">
        <div class="aspect-[4/3] border-2 border-black bg-[#f3f3f4] overflow-hidden"><img v-if="resolved.image" :src="resolved.image" :alt="resolved.title" class="size-full object-cover" /><span v-else class="grid place-items-center size-full"><Icon name="i-lucide-image-off" class="size-8 text-black/20" /></span></div>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <img v-for="i in 3" :key="i" :src="`https://picsum.photos/seed/vg-pdp-${resolved.id}-${i}/300/300`" :alt="`${resolved.title} detail ${i}`" class="aspect-square w-full object-cover border-2 border-black bg-white" loading="lazy" />
        </div>
      </VgCard>

      <div class="space-y-4">
        <VgCard class="p-4">
          <div class="flex items-center gap-2 mb-2">
            <VgBadge variant="charcoal">{{ resolved.sku }}</VgBadge>
            <VgBadge v-if="resolved.badge" variant="ember">{{ resolved.badge }}</VgBadge>
          </div>
          <h1 class="text-headline-lg uppercase text-black leading-none">{{ resolved.title }}</h1>
          <p class="text-body-md text-[#444748] mt-2">{{ resolved.subtitle }}</p>
          <VgSpecTable :rows="resolved.specs" class="mt-4" />
          <div class="flex items-end justify-between mt-4 pt-4 border-t-2 border-black">
            <div>
              <div v-if="resolved.compareAt" class="text-body-sm line-through text-black/50">{{ resolved.compareAt }}</div>
              <div class="text-headline-md text-black">{{ resolved.price }}</div>
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
