<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "staff" })
useHead({ title: "Admin — Ringkasan Operasional — Vems Garage" })
const auth = useAuth()
const q = useRoute().query as any
const tab = ref<'orders'|'bengkel'>((q.tab as any) || 'orders')
const orders = ref<any[]>([])
const bengkel = ref<any[]>([])
const busy = ref<string | null>(null)
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }
async function load() {
  try { const r: any = await $fetch('/api/admin/orders', { credentials: 'include' as any }); orders.value = r?.items ?? [] } catch {}
  try { const r: any = await $fetch('/api/admin/bengkel', { credentials: 'include' as any, query: { status: 'pending' } }); bengkel.value = r?.items ?? [] } catch {}
}
async function updateOrderStatus(id: string, status: string) {
  busy.value = id; try { await $fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { status }, credentials: 'include' as any }); await load() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = null }
}
async function verifyBengkel(id: string, action: 'approve'|'reject') {
  busy.value = id; try { await $fetch(`/api/bengkel/${encodeURIComponent(id)}/verify`, { method: 'POST', body: { action }, credentials: 'include' as any }); await load() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = null }
}
onMounted(async () => { await auth.fetchMe(); await load() })
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="ADMIN // RINGKASAN OPERASIONAL — DEPOT PENGAPON SMG-01" />
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h1 class="text-headline-xl uppercase tracking-tighter">RINGKASAN OPERASIONAL</h1>
          <div class="flex gap-2">
            <VgButton size="sm" @click="load">Refresh</VgButton>
            <NuxtLink to="/admin/pesanan"><VgButton size="sm" variant="ember">Kelola Pesanan →</VgButton></NuxtLink>
          </div>
        </div>

        <div class="mt-6 grid md:grid-cols-3 gap-3">
          <VgCard class="p-4"><div class="text-label-sm uppercase">Pesanan Masuk (all)</div><div class="text-headline-md">{{ orders.length }}</div><div class="text-body-sm text-on-surface-variant">Filter detail di tab Pesanan</div></VgCard>
          <VgCard class="p-4"><div class="text-label-sm uppercase">Verifikasi Pending</div><div class="text-headline-md">{{ bengkel.length }}</div><NuxtLink to="/admin/verifikasi" class="text-label-sm underline font-bold">Tinjau NIB →</NuxtLink></VgCard>
          <VgCard class="p-4 bg-black text-white"><div class="text-label-sm text-[#ffb5a0] uppercase">Depot</div><div class="text-body-sm font-mono mt-1">PENGAPON SMG-01 · DOK D-04 · OPERATIONAL</div><div class="text-body-sm text-white/60 mt-1">Same-day 45 menit Ring 1</div></VgCard>
        </div>

        <div class="mt-6 flex gap-2">
          <button class="border-2 border-black px-3 py-1.5 text-label-sm font-bold" :class="tab==='orders'?'bg-black text-white':'bg-white'" @click="tab='orders'">Pesanan Terbaru ({{ orders.slice(0,5).length }})</button>
          <button class="border-2 border-black px-3 py-1.5 text-label-sm font-bold" :class="tab==='bengkel'?'bg-black text-white':'bg-white'" @click="tab='bengkel'">Verifikasi ({{ bengkel.length }})</button>
        </div>

        <div v-if="tab==='orders'" class="mt-4 space-y-3">
          <div v-if="!orders.length" class="border-2 border-dashed border-black p-4 text-body-sm">Belum ada pesanan.</div>
          <div v-for="o in orders.slice(0,5)" :key="o.id" class="border-2 border-black p-3 flex flex-wrap items-center gap-3 bg-white">
            <div class="flex-1 min-w-[200px]"><div class="font-mono text-xs">{{ o.id }}</div><div class="text-body-sm">{{ fmt(o.total) }} · {{ o.courier }}</div><div class="text-xs text-[#444748]">Status: <span class="font-bold uppercase">{{ o.status }}</span></div></div>
            <div class="flex gap-1 flex-wrap">
              <VgButton size="sm" :disabled="busy===o.id" @click="updateOrderStatus(o.id,'packing')">Packing</VgButton>
              <VgButton size="sm" :disabled="busy===o.id" @click="updateOrderStatus(o.id,'shipped')">Shipped</VgButton>
              <VgButton size="sm" :disabled="busy===o.id" @click="updateOrderStatus(o.id,'delivered')">Delivered</VgButton>
              <NuxtLink :to="`/pesanan/${o.id}`" class="border-2 border-black px-3 py-1 text-label-sm underline">Detail</NuxtLink>
            </div>
          </div>
          <NuxtLink to="/admin/pesanan" class="inline-block text-label-sm underline font-bold">Lihat semua pesanan →</NuxtLink>
        </div>

        <div v-else class="mt-4 space-y-3">
          <div v-if="!bengkel.length" class="border-2 border-dashed border-black p-4 text-body-sm">Tidak ada pengajuan pending.</div>
          <div v-for="b in bengkel" :key="b.id" class="border-2 border-black p-3 flex items-center gap-3 bg-white">
            <div class="flex-1"><div class="text-body-sm font-bold">{{ b.name }}</div><div class="font-mono text-xs">NIB {{ b.nib }} · {{ b.tier }} · {{ b.depotId }}</div></div>
            <div class="flex gap-2"><VgButton size="sm" variant="ember" :disabled="busy===b.id" @click="verifyBengkel(b.id,'approve')">Approve</VgButton><VgButton size="sm" :disabled="busy===b.id" @click="verifyBengkel(b.id,'reject')">Reject</VgButton></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
