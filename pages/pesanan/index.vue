<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Pesanan Saya — Vems Garage" })
const auth = useAuth()
const orders = ref<any[]>([])
const loading = ref(true)
const err = ref<string | null>(null)
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }

async function load() {
  loading.value = true
  err.value = null
  try {
    await auth.fetchMe()
    if (!auth.user.value) { orders.value = []; loading.value = false; return }
    const res: any = await $fetch('/api/orders', { credentials: 'include' } as any)
    orders.value = (res?.items ?? []).map((o: any) => ({
      id: o.id,
      createdAt: o.createdAt,
      total: o.total,
      courier: o.courier,
      status: o.status,
      // keep raw for link
      _raw: o,
    }))
  } catch (e: any) {
    err.value = e?.data?.message || e?.message || 'Gagal memuat pesanan'
  } finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-4">
    <div class="border-[3px] border-black bg-white p-4 flex items-center justify-between">
      <h1 class="text-headline-md uppercase">Pesanan Saya</h1>
      <VgBadge variant="charcoal">{{ orders.length }} pesanan</VgBadge>
    </div>
    <div v-if="!auth.user.value" class="border-[3px] border-black bg-[#fff4d6] p-6 text-center">
      <p class="text-body-md">Masuk untuk melihat pesanan & e-Faktur Anda.</p>
      <div class="flex justify-center gap-2 mt-4">
        <NuxtLink to="/auth/login"><VgButton>Masuk</VgButton></NuxtLink>
        <NuxtLink to="/auth/register"><VgButton variant="ember">Daftar</VgButton></NuxtLink>
      </div>
    </div>
    <div v-else-if="loading" class="border-[3px] border-black bg-white p-8 text-center text-body-sm">Memuat…</div>
    <div v-else-if="err" class="border-2 border-black bg-[#ffdbd1] p-4 text-body-sm">{{ err }}</div>
    <div v-else-if="!orders.length" class="border-[3px] border-black bg-white p-8 text-center">
      <p class="text-body-md">Belum ada pesanan.</p>
      <NuxtLink to="/katalog" class="inline-block mt-4"><VgButton>Mulai Belanja</VgButton></NuxtLink>
    </div>
    <div v-else class="space-y-3">
      <NuxtLink v-for="o in orders" :key="o.id" :to="`/pesanan/${o.id}`" class="block border-[3px] border-black bg-white p-4 hover:bg-[#f9f9f9]">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div><div class="font-mono text-label-sm font-bold">{{ o.id }}</div><div class="text-body-sm text-[#444748]">{{ new Date(o.createdAt).toLocaleString("id-ID") }} • {{ o.courier }} • {{ o.status }}</div></div>
          <div class="text-right"><div class="text-body-md font-bold">{{ fmt(o.total) }}</div><span class="inline-block mt-1 bg-[#ff5722] text-white border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase">SUKSES</span></div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
