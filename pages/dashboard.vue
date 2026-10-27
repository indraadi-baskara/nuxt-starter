<script setup lang="ts">
definePageMeta({ layout: "account", middleware: "auth" })
useHead({ title: "Dashboard Akun — Vems Garage" })
const auth = useAuth()
const me = ref<any>(null)
const orders = ref<any[]>([])
const ordersCount = computed(() => orders.value.length)
const role = computed(() => auth.user.value?.role ?? 'customer')
const isPartner = computed(() => role.value === 'bengkel_partner')
const mitraStatus = ref<any>(null)
const plafon = usePlafon()
const plafonData = computed(() => {
  if (!isPartner.value) return null
  const tier = (mitraStatus.value?.tier as string) ?? 'tier-1'
  return plafon.compute(orders.value as any, tier)
})
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }
async function load() {
  await auth.fetchMe()
  if (!auth.user.value) return
  try { me.value = await $fetch('/api/me', { credentials: 'include' } as any) } catch {}
  try { const r: any = await $fetch('/api/orders', { credentials: 'include' } as any); orders.value = r?.items ?? [] } catch {}
  if (isPartner.value) {
    try { const r: any = await $fetch('/api/bengkel/me', { credentials: 'include' as any }); mitraStatus.value = r?.latest ?? null } catch {}
  }
}
async function logout() { await auth.signOut(); navigateTo('/') }
onMounted(load)
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry :trail="`AKUN // ${auth.user.value?.name ?? 'MEMUAT'}`.toUpperCase()" />
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap items-center gap-2 text-label-sm uppercase">
          <span class="bg-black text-white px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-factory" class="size-3" /> DEPOT PENGAPON SMG-01</span>
          <span class="bg-emerald-600 text-white px-2 py-1">OPERATIONAL</span>
          <span class="bg-white border-2 border-black px-2 py-1">DISPATCH SIAP — JL. PENGAPON NO.44</span>
          <a href="tel:+622476928800" class="bg-[#ff5722] text-white border-2 border-black px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-phone" class="size-3" /> (024) 7692-8800</a>
        </div>
        <h1 class="text-headline-xl uppercase tracking-tighter mt-4 leading-none">DASHBOARD AKUN</h1>
        <p class="text-body-sm text-on-surface-variant mt-1">Kelola pesanan, GarasiSaya, dan akses mitra B2B Anda.</p>

        <div class="mt-6 grid md:grid-cols-4 gap-3">
          <VgCard class="p-4"><div class="text-label-sm uppercase">Pesanan</div><div class="text-headline-md">{{ ordersCount || '—' }}</div><NuxtLink to="/pesanan" class="text-label-sm underline font-bold">Lihat semua →</NuxtLink></VgCard>
          <VgCard class="p-4"><div class="text-label-sm uppercase">Akun</div><div class="text-body-sm font-bold mt-1 truncate">{{ auth.user.value?.email }}</div><div class="text-label-sm mt-1 capitalize">Role: <span class="font-mono bg-black text-white px-1">{{ auth.user.value?.role }}</span></div></VgCard>
          <VgCard class="p-4"><div class="text-label-sm uppercase">Bengkel Terverifikasi</div><div class="text-headline-sm flex items-center gap-2 mt-1"><Icon name="i-lucide-badge-check" class="size-5 text-emerald-600" /> {{ role === 'bengkel_partner' ? 'Aktif — B2B' : 'Belum' }}</div><NuxtLink to="/verifikasi" class="text-label-sm underline font-bold mt-1 inline-block">Ajukan verifikasi →</NuxtLink><NuxtLink v-if="role==='bengkel_partner'" to="/mitra/dashboard" class="text-label-sm underline font-bold mt-1 inline-block ml-2">Mitra Portal →</NuxtLink></VgCard>
          <VgCard v-if="isPartner && plafonData" class="p-4 bg-black text-white">
            <div class="text-label-sm text-[#ffb5a0] uppercase">Plafon B2B — {{ plafonData.discount }}% OFF · TOP {{ plafonData.top }}H</div>
            <div class="text-headline-sm mt-1">{{ fmt(plafonData.remaining) }} <span class="text-label-sm text-white/60">sisa</span></div>
            <div class="mt-2 h-2 bg-white/20 border border-white/30"><div class="h-full bg-[#ff5722]" :style="{ width: plafonData.pct + '%' }"></div></div>
            <div class="text-body-sm text-white/60 mt-1">Limit {{ fmt(plafonData.limit) }} · {{ plafonData.pct }}% terpakai</div>
            <NuxtLink to="/mitra/dashboard" class="text-label-sm underline text-[#ffb5a0] mt-1 inline-block">Detail mitra →</NuxtLink>
          </VgCard>
          <VgCard v-else class="p-4 bg-black text-white"><div class="text-label-sm text-[#ffb5a0] uppercase">Bantuan</div><div class="text-body-sm mt-1">Butuh faktur atau retur?</div><NuxtLink to="/bantuan" class="text-label-sm underline mt-1 inline-block text-[#ff5722]">Bantuan & SOP →</NuxtLink></VgCard>
        </div>

        <div class="mt-6">
          <GarasiSaya />
        </div>
      </div>
    </section>

    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6 space-y-4">
        <div class="flex flex-wrap gap-2">
          <NuxtLink to="/pesanan" class="bg-black text-white border-2 border-black px-3 py-1.5 text-label-sm font-bold flex items-center gap-1"><Icon name="i-lucide-receipt" class="size-4" /> RIWAYAT PESANAN</NuxtLink>
          <NuxtLink to="/katalog" class="bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold">KATALOG OEM</NuxtLink>
          <NuxtLink to="/cek-keaslian" class="bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold">CEK KEASLIAN</NuxtLink>
          <NuxtLink to="/bantuan" class="bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold">KLAIM GARANSI</NuxtLink>
          <NuxtLink to="/lokasi" class="bg-white border-2 border-black px-3 py-1.5 text-label-sm font-bold">LOKASI DEPOT</NuxtLink>
        </div>

        <VgCard class="p-4">
          <h2 class="text-label-lg border-b-2 border-black pb-2 mb-3">Akun — {{ auth.user.value?.name }}</h2>
          <div class="text-body-sm space-y-1">
            <div><span class="font-bold">ID:</span> <span class="font-mono text-xs">{{ auth.user.value?.id }}</span></div>
            <div><span class="font-bold">Nama:</span> {{ auth.user.value?.name }}</div>
            <div><span class="font-bold">Email verified:</span> {{ me?.user?.emailVerified ? 'Ya' : 'Belum' }}</div>
          </div>
          <VgButton class="mt-4" @click="logout">Keluar</VgButton>
        </VgCard>
      </div>
    </section>
  </div>
</template>
