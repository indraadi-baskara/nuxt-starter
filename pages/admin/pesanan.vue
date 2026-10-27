<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "staff" })
useHead({ title: "Admin — Kelola Pesanan — Vems Garage" })
const auth = useAuth()
const orders = ref<any[]>([])
const filter = ref('')
const busy = ref<string | null>(null)
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }
async function load() {
  try { const r: any = await $fetch('/api/admin/orders', { credentials: 'include' as any, query: filter.value ? { status: filter.value } : {} }); orders.value = r?.items ?? [] } catch (e: any) { alert(e?.data?.message || e?.message) }
}
async function updateStatus(id: string, status: string) {
  busy.value = id; try { await $fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { status }, credentials: 'include' as any }); await load() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = null }
}
watch(filter, load)
onMounted(async () => { await auth.fetchMe(); await load() })
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="ADMIN // PESANAN — PACKING → SHIPPED → DELIVERED" />
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <h1 class="text-headline-xl uppercase tracking-tighter">KELOLA PESANAN</h1>
        <p class="text-body-sm text-on-surface-variant mt-1">Update status dispatch dari Depot Pengapon — sinkron ke tracking pembeli.</p>

        <div class="mt-4 flex flex-wrap gap-2 items-center">
          <select v-model="filter" class="border-2 border-black px-3 py-2 text-body-sm bg-white"><option value="">Semua status</option><option value="created">Created</option><option value="packing">Packing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select>
          <VgButton size="sm" @click="load">Refresh</VgButton>
          <span class="text-body-sm text-on-surface-variant">{{ orders.length }} pesanan</span>
        </div>

        <div v-if="!orders.length" class="mt-6 border-2 border-dashed border-black p-6 text-center text-body-sm">Tidak ada pesanan untuk filter ini.</div>
        <div v-else class="mt-6 space-y-3">
          <div v-for="o in orders" :key="o.id" class="border-[3px] border-black bg-white p-4 flex flex-wrap items-center gap-3">
            <div class="flex-1 min-w-[220px]">
              <div class="font-mono text-xs font-bold">{{ o.id }}</div>
              <div class="text-body-sm">{{ fmt(o.total) }} · {{ o.courier }}</div>
              <div class="text-xs text-[#444748] mt-1">Status: <span class="font-bold uppercase bg-black text-white px-1">{{ o.status }}</span> · {{ o.createdAt ? new Date((o.createdAt as number)*1000).toLocaleString('id-ID') : '' }}</div>
            </div>
            <div class="flex gap-1 flex-wrap">
              <VgButton size="sm" :disabled="busy===o.id" @click="updateStatus(o.id,'packing')">Packing</VgButton>
              <VgButton size="sm" :disabled="busy===o.id" @click="updateStatus(o.id,'shipped')">Shipped</VgButton>
              <VgButton size="sm" :disabled="busy===o.id" @click="updateStatus(o.id,'delivered')">Delivered</VgButton>
              <VgButton size="sm" variant="ember" :disabled="busy===o.id" @click="updateStatus(o.id,'cancelled')">Cancel</VgButton>
              <NuxtLink :to="`/pesanan/${o.id}`" class="border-2 border-black px-3 py-1 text-label-sm underline bg-white">Detail</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
