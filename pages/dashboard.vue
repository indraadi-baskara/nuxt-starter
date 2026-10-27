<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Dashboard Akun & Portal Mitra B2B — Vems Garage" })
const auth = useAuth()
const me = ref<any>(null)
const ordersCount = ref<number | null>(null)
const adminOrders = ref<any[]>([])
const adminBengkel = ref<any[]>([])
const adminTab = ref<'orders'|'bengkel'>('orders')
const orderFilter = ref<string>('')
const busy = ref<string | null>(null)
const role = computed(() => auth.user.value?.role ?? 'customer')
const isStaff = computed(() => ['admin','gudang_picker'].includes(role.value))
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }
async function load() {
  await auth.fetchMe()
  if (!auth.user.value) return
  try { me.value = await $fetch('/api/me', { credentials: 'include' } as any) } catch {}
  try { const r: any = await $fetch('/api/orders', { credentials: 'include' } as any); ordersCount.value = r?.items?.length ?? 0 } catch {}
  if (isStaff.value) await loadAdmin()
}
async function loadAdmin() {
  try { const r: any = await $fetch('/api/admin/orders', { credentials: 'include' as any, query: orderFilter.value ? { status: orderFilter.value } : {} }); adminOrders.value = r?.items ?? [] } catch {}
  try { const r: any = await $fetch('/api/admin/bengkel', { credentials: 'include' as any, query: { status: 'pending' } }); adminBengkel.value = r?.items ?? [] } catch {}
}
async function updateOrderStatus(id: string, status: string) {
  busy.value = id; try { await $fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { status }, credentials: 'include' as any }); await loadAdmin() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = null }
}
async function verifyBengkel(id: string, action: 'approve'|'reject') {
  busy.value = id; try { await $fetch(`/api/bengkel/${encodeURIComponent(id)}/verify`, { method: 'POST', body: { action }, credentials: 'include' as any }); await loadAdmin() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = null }
}
watch(orderFilter, loadAdmin)
async function logout() { await auth.signOut(); navigateTo('/') }
onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-headline-lg uppercase text-black">Dashboard Akun<span v-if="auth.user.value"> — {{ auth.user.value.name }}</span></h1>
    <div v-if="!auth.user.value" class="border-[3px] border-black bg-[#fff4d6] p-6 flex flex-wrap items-center justify-between gap-4">
      <p class="text-body-md font-bold">Masuk untuk melihat dashboard & pesanan Anda.</p>
      <div class="flex gap-2">
        <NuxtLink to="/auth/login"><VgButton>Masuk</VgButton></NuxtLink>
        <NuxtLink to="/auth/register"><VgButton variant="ember">Daftar</VgButton></NuxtLink>
      </div>
    </div>
    <template v-else>
      <div class="grid md:grid-cols-3 gap-4">
        <VgCard class="p-4"><div class="text-label-sm">Pesanan</div><div class="text-headline-md">{{ ordersCount ?? '—' }}</div><NuxtLink to="/pesanan" class="text-label-sm underline">Lihat semua</NuxtLink></VgCard>
        <VgCard class="p-4"><div class="text-label-sm">Akun</div><div class="text-body-md font-bold mt-1">{{ auth.user.value.email }}</div><div class="text-label-sm mt-1 capitalize">Role: {{ auth.user.value.role }}</div></VgCard>
        <VgCard class="p-4"><div class="text-label-sm">Bengkel Terverifikasi</div><div class="text-headline-md flex items-center gap-2"><Icon name="i-lucide-badge-check" class="size-5 text-emerald-600" /> {{ role === 'bengkel_partner' ? 'Aktif' : '—' }}</div><NuxtLink to="/verifikasi" class="text-label-sm underline">Ajukan verifikasi</NuxtLink></VgCard>
      </div>

      <!-- Staff panel -->
      <template v-if="isStaff">
        <VgCard class="p-4">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-label-lg uppercase">Panel Gudang / Admin</h2>
            <div class="flex gap-2">
              <button class="border-2 border-black px-3 py-1 text-label-sm font-bold" :class="adminTab==='orders'?'bg-black text-white':'bg-white'" @click="adminTab='orders'">Pesanan ({{ adminOrders.length }})</button>
              <button class="border-2 border-black px-3 py-1 text-label-sm font-bold" :class="adminTab==='bengkel'?'bg-black text-white':'bg-white'" @click="adminTab='bengkel'">Verifikasi ({{ adminBengkel.length }})</button>
            </div>
          </div>
          <div v-if="adminTab==='orders'" class="mt-4 space-y-3">
            <div class="flex gap-2"><select v-model="orderFilter" class="border-2 border-black px-3 py-2 text-body-sm"><option value="">Semua status</option><option value="created">Created</option><option value="packing">Packing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select><VgButton size="sm" @click="loadAdmin">Refresh</VgButton></div>
            <div v-if="!adminOrders.length" class="text-body-sm text-[#444748] p-3 border-2 border-dashed border-black">Belum ada pesanan.</div>
            <div v-for="o in adminOrders" :key="o.id" class="border-2 border-black p-3 flex flex-wrap items-center gap-3">
              <div class="flex-1 min-w-[200px]"><div class="font-mono text-xs">{{ o.id }}</div><div class="text-body-sm">{{ fmt(o.total) }} • {{ o.courier }}</div><div class="text-xs text-[#444748]">Status: <span class="font-bold uppercase">{{ o.status }}</span> • {{ new Date((o.createdAt??0)*1000).toLocaleString('id-ID') }}</div></div>
              <div class="flex gap-1 flex-wrap">
                <VgButton size="sm" :disabled="busy===o.id" @click="updateOrderStatus(o.id,'packing')">Packing</VgButton>
                <VgButton size="sm" :disabled="busy===o.id" @click="updateOrderStatus(o.id,'shipped')">Shipped</VgButton>
                <VgButton size="sm" :disabled="busy===o.id" @click="updateOrderStatus(o.id,'delivered')">Delivered</VgButton>
                <NuxtLink :to="`/pesanan/${o.id}`" class="border-2 border-black px-3 py-1 text-label-sm underline">Detail</NuxtLink>
              </div>
            </div>
          </div>
          <div v-else class="mt-4 space-y-3">
            <div v-if="!adminBengkel.length" class="text-body-sm text-[#444748] p-3 border-2 border-dashed border-black">Tidak ada pengajuan pending.</div>
            <div v-for="b in adminBengkel" :key="b.id" class="border-2 border-black p-3 flex items-center gap-3">
              <div class="flex-1"><div class="text-body-sm font-bold">{{ b.name }}</div><div class="font-mono text-xs">NIB {{ b.nib }} • {{ b.tier }} • {{ b.depotId }}</div></div>
              <div class="flex gap-2"><VgButton size="sm" variant="ember" :disabled="busy===b.id" @click="verifyBengkel(b.id,'approve')">Approve</VgButton><VgButton size="sm" :disabled="busy===b.id" @click="verifyBengkel(b.id,'reject')">Reject</VgButton></div>
            </div>
          </div>
        </VgCard>
      </template>

      <VgCard class="p-4">
        <h2 class="text-label-lg border-b-2 border-black pb-2 mb-3">Akun</h2>
        <div class="text-body-sm space-y-1">
          <div><span class="font-bold">ID:</span> <span class="font-mono text-xs">{{ auth.user.value.id }}</span></div>
          <div><span class="font-bold">Nama:</span> {{ auth.user.value.name }}</div>
          <div><span class="font-bold">Email verified:</span> {{ me?.user?.emailVerified ? 'Ya' : 'Belum' }}</div>
        </div>
        <VgButton class="mt-4" @click="logout">Keluar</VgButton>
      </VgCard>
    </template>
  </div>
</template>
