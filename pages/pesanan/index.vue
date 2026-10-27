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
      _raw: o,
    }))
  } catch (e: any) {
    err.value = e?.data?.message || e?.message || 'Gagal memuat pesanan'
  } finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="PESANAN SAYA // RIWAYAT TRANSAKSI" />
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 class="text-headline-xl uppercase tracking-tighter">RIWAYAT PESANAN & E-FAKTUR</h1>
            <p class="text-body-sm text-on-surface-variant mt-1">Semua transaksi DJP E-Nofa sync — unduh e-Faktur & surat jalan per pesanan.</p>
          </div>
          <VgBadge variant="charcoal">{{ orders.length }} pesanan</VgBadge>
        </div>

        <div v-if="!auth.user.value" class="mt-6 border-[3px] border-black bg-[#fff4d6] p-6 flex flex-wrap items-center justify-between gap-4">
          <p class="text-body-md font-bold">Masuk untuk melihat pesanan & e-Faktur Anda.</p>
          <div class="flex gap-2">
            <NuxtLink to="/auth/login"><VgButton>Masuk</VgButton></NuxtLink>
            <NuxtLink to="/auth/register"><VgButton variant="ember">Daftar</VgButton></NuxtLink>
          </div>
        </div>
        <div v-else-if="loading" class="mt-6 border-[3px] border-black bg-white p-8 text-center text-body-sm">Memuat riwayat…</div>
        <div v-else-if="err" class="mt-6 border-2 border-black bg-[#ffdbd1] p-4 text-body-sm">{{ err }}</div>
        <div v-else-if="!orders.length" class="mt-6 border-[3px] border-black bg-white p-8 text-center">
          <p class="text-body-md">Belum ada pesanan — mulai dari katalog OEM.</p>
          <NuxtLink to="/katalog" class="inline-block mt-4"><VgButton variant="ember">Mulai Belanja →</VgButton></NuxtLink>
        </div>
        <div v-else class="mt-6 space-y-3">
          <NuxtLink v-for="o in orders" :key="o.id" :to="`/pesanan/${o.id}`" class="block border-[3px] border-black bg-white p-4 hover:bg-surface-container flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="font-mono text-label-sm font-bold">{{ o.id }}</div>
              <div class="text-body-sm text-[#444748]">{{ new Date(o.createdAt).toLocaleString("id-ID") }} • {{ o.courier }} • <span class="font-bold uppercase">{{ o.status }}</span></div>
            </div>
            <div class="text-right">
              <div class="text-body-md font-bold">{{ fmt(o.total) }}</div>
              <span class="inline-block mt-1 bg-black text-white border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase">LIHAT DETAIL →</span>
            </div>
          </NuxtLink>
        </div>
        <div class="mt-6 flex flex-wrap gap-2">
          <NuxtLink to="/katalog" class="bg-white border-2 border-black px-4 py-2 text-label-sm font-bold">Kembali ke Katalog</NuxtLink>
          <NuxtLink to="/dashboard" class="bg-black text-white border-2 border-black px-4 py-2 text-label-sm font-bold">Dashboard</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
