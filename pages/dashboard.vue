<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Dashboard Akun & Portal Mitra B2B — Vems Garage" })
const auth = useAuth()
const me = ref<any>(null)
const ordersCount = ref<number | null>(null)
const adminOrders = ref<any[]>([])
const adminBengkel = ref<any[]>([])
const adminTab = ref<'orders'|'bengkel'|'pricing'>('orders')
const orderFilter = ref<string>('')
const pricingTier = ref<string>('tier-1')
const pricing = ref<any[]>([])
const pricingBusy = ref(false)
const busy = ref<string | null>(null)
const role = computed(() => auth.user.value?.role ?? 'customer')
const isStaff = computed(() => ['admin','gudang_picker'].includes(role.value))
const isAdmin = computed(() => role.value === 'admin')
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
  if (isAdmin.value) await loadPricing()
}
async function loadPricing() {
  try { const r: any = await $fetch('/api/admin/pricing', { credentials: 'include' as any, query: { tier: pricingTier.value } }); pricing.value = r?.items ?? [] } catch {}
}
async function savePrice(sku: string, price: number) {
  pricingBusy.value = true
  try { await $fetch('/api/admin/pricing', { method: 'PUT', body: { sku, tier: pricingTier.value, price }, credentials: 'include' as any }); await loadPricing() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { pricingBusy.value = false }
}
async function updateOrderStatus(id: string, status: string) {
  busy.value = id; try { await $fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { status }, credentials: 'include' as any }); await loadAdmin() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = null }
}
async function verifyBengkel(id: string, action: 'approve'|'reject') {
  busy.value = id; try { await $fetch(`/api/bengkel/${encodeURIComponent(id)}/verify`, { method: 'POST', body: { action }, credentials: 'include' as any }); await loadAdmin() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = null }
}
watch(orderFilter, loadAdmin)
watch(pricingTier, loadPricing)
async function logout() { await auth.signOut(); navigateTo('/') }
onMounted(load)
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry :trail="`PORTAL AKUN // ${auth.user.value?.name ?? 'TAMU'}`.toUpperCase()" />
    <!-- header strip -->
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap items-center gap-2 text-label-sm uppercase">
          <span class="bg-black text-white px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-factory" class="size-3" /> DEPOT PENGAPON SMG-01</span>
          <span class="bg-emerald-600 text-white px-2 py-1">OPERATIONAL</span>
          <span class="bg-white border-2 border-black px-2 py-1">DISPATCH SIAP — JL. PENGAPON NO.44</span>
          <a href="tel:+622476928800" class="bg-[#ff5722] text-white border-2 border-black px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-phone" class="size-3" /> (024) 7692-8800</a>
        </div>

        <h1 class="text-headline-xl uppercase tracking-tighter mt-4 leading-none">PORTAL MEKANIK & ORDER TERMINAL</h1>
        <p class="text-body-sm text-on-surface-variant mt-1">Operasional Depot Pengapon SMG-01 — sinkronisasi VIN, plafon B2B, dan dispatch radar.</p>

        <div v-if="!auth.user.value" class="mt-6 border-[3px] border-black bg-[#fff4d6] p-6 flex flex-wrap items-center justify-between gap-4">
          <p class="text-body-md font-bold">Masuk untuk melihat dashboard, GarasiSaya, dan e-Faktur Anda.</p>
          <div class="flex gap-2">
            <NuxtLink to="/auth/login"><VgButton>Masuk</VgButton></NuxtLink>
            <NuxtLink to="/auth/register"><VgButton variant="ember">Daftar</VgButton></NuxtLink>
          </div>
        </div>
        <template v-else>
          <!-- Summary cards — Stitch d8f1fb89 style -->
          <div class="mt-6 grid md:grid-cols-4 gap-3">
            <VgCard class="p-4"><div class="text-label-sm uppercase">Pesanan</div><div class="text-headline-md">{{ ordersCount ?? '—' }}</div><NuxtLink to="/pesanan" class="text-label-sm underline font-bold">Lihat semua →</NuxtLink></VgCard>
            <VgCard class="p-4"><div class="text-label-sm uppercase">Akun</div><div class="text-body-sm font-bold mt-1 truncate">{{ auth.user.value.email }}</div><div class="text-label-sm mt-1 capitalize">Role: <span class="font-mono bg-black text-white px-1">{{ auth.user.value.role }}</span></div></VgCard>
            <VgCard class="p-4"><div class="text-label-sm uppercase">Bengkel Terverifikasi</div><div class="text-headline-sm flex items-center gap-2 mt-1"><Icon name="i-lucide-badge-check" class="size-5 text-emerald-600" /> {{ role === 'bengkel_partner' ? 'Aktif — B2B' : 'Belum' }}</div><NuxtLink to="/verifikasi" class="text-label-sm underline font-bold mt-1 inline-block">Ajukan verifikasi →</NuxtLink></VgCard>
            <VgCard class="p-4 bg-black text-white"><div class="text-label-sm text-[#ffb5a0] uppercase">Plafon B2B</div><div class="text-headline-sm mt-1">Rp 28,5jt <span class="text-label-sm text-white/60">sisa</span></div><div class="text-body-sm text-white/60">Limit 45jt • 36% terpakai</div></VgCard>
          </div>
          <!-- GarasiSaya inline -->
          <div class="mt-6">
            <GarasiSaya />
          </div>
        </template>
      </div>
    </section>
    <template v-if="auth.user.value">
      <section class="w-full bg-white border-b-2 border-black">
        <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
          <!-- quick nav -->
          <div class="flex flex-wrap gap-2">
            <NuxtLink to="/pesanan" class="bg-black text-white border-2 border-black px-3 py-1.5 text-label-sm font-bold flex items-center gap-1"><Icon name="i-lucide-receipt" class="size-4" /> RIWAYAT PESANAN</NuxtLink>
            <NuxtLink to="/katalog" class="bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold">KATALOG OEM</NuxtLink>
            <NuxtLink to="/cek-keaslian" class="bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold">CEK KEASLIAN</NuxtLink>
            <NuxtLink to="/bantuan" class="bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold">KLAIM GARANSI</NuxtLink>
            <NuxtLink to="/lokasi" class="bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold">LOKASI DEPOT</NuxtLink>
          </div>

      <!-- Staff panel -->
      <template v-if="isStaff">
        <VgCard class="p-4">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-label-lg uppercase">Panel Gudang / Admin</h2>
            <div class="flex gap-2">
              <button class="border-2 border-black px-3 py-1 text-label-sm font-bold" :class="adminTab==='orders'?'bg-black text-white':'bg-white'" @click="adminTab='orders'">Pesanan ({{ adminOrders.length }})</button>
              <button class="border-2 border-black px-3 py-1 text-label-sm font-bold" :class="adminTab==='bengkel'?'bg-black text-white':'bg-white'" @click="adminTab='bengkel'">Verifikasi ({{ adminBengkel.length }})</button>
              <button v-if="isAdmin" class="border-2 border-black px-3 py-1 text-label-sm font-bold" :class="adminTab==='pricing'?'bg-black text-white':'bg-white'" @click="adminTab='pricing'">B2B Harga</button>
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
          <div v-else-if="adminTab==='bengkel'" class="mt-4 space-y-3">
            <div v-if="!adminBengkel.length" class="text-body-sm text-[#444748] p-3 border-2 border-dashed border-black">Tidak ada pengajuan pending.</div>
            <div v-for="b in adminBengkel" :key="b.id" class="border-2 border-black p-3 flex items-center gap-3">
              <div class="flex-1"><div class="text-body-sm font-bold">{{ b.name }}</div><div class="font-mono text-xs">NIB {{ b.nib }} • {{ b.tier }} • {{ b.depotId }}</div></div>
              <div class="flex gap-2"><VgButton size="sm" variant="ember" :disabled="busy===b.id" @click="verifyBengkel(b.id,'approve')">Approve</VgButton><VgButton size="sm" :disabled="busy===b.id" @click="verifyBengkel(b.id,'reject')">Reject</VgButton></div>
            </div>
          </div>
          <div v-else class="mt-4 space-y-3">
            <div class="flex gap-2 items-center">
              <select v-model="pricingTier" class="border-2 border-black px-3 py-2 text-body-sm"><option value="tier-1">Tier-1 (-8%)</option><option value="tier-2">Tier-2 (-12%)</option><option value="tier-3">Tier-3 (-18%)</option></select>
              <VgButton size="sm" @click="loadPricing">Refresh</VgButton>
              <span v-if="pricingBusy" class="text-body-sm">Menyimpan…</span>
            </div>
            <div v-if="!pricing.length" class="text-body-sm text-[#444748] p-3 border-2 border-dashed border-black">Belum ada harga B2B untuk tier ini.</div>
            <div v-for="p in pricing" :key="p.sku + p.tier" class="border-2 border-black p-3 flex flex-wrap items-center gap-3">
              <div class="flex-1 min-w-[200px]"><div class="font-mono text-xs">{{ p.sku }} — {{ p.product?.title ?? p.sku }}</div><div class="text-body-sm">Retail {{ fmt(p.product?.price ?? 0) }} → B2B <span class="font-bold">{{ fmt(p.price) }}</span></div></div>
              <div class="flex gap-2 items-center"><input :id="'price-'+p.sku" type="number" :value="p.price" class="border-2 border-black px-2 py-1 w-28 text-body-sm font-mono" @change="(e:any)=> savePrice(p.sku, Number((e.target as HTMLInputElement).value))" /><span class="text-xs">IDR</span></div>
            </div>
          </div>
        </VgCard>
      </template>

      <VgCard class="p-4">
        <h2 class="text-label-lg border-b-2 border-black pb-2 mb-3">Akun — {{ auth.user.value.name }}</h2>
        <div class="text-body-sm space-y-1">
          <div><span class="font-bold">ID:</span> <span class="font-mono text-xs">{{ auth.user.value.id }}</span></div>
          <div><span class="font-bold">Nama:</span> {{ auth.user.value.name }}</div>
          <div><span class="font-bold">Email verified:</span> {{ me?.user?.emailVerified ? 'Ya' : 'Belum' }}</div>
        </div>
        <VgButton class="mt-4" @click="logout">Keluar</VgButton>
      </VgCard>
        </div>
      </section>
    </template>
  </div>
</template>
