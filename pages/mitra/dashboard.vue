<script setup lang="ts">
definePageMeta({ layout: "account", middleware: "auth" })
useHead({ title: "Mitra Bengkel — Portal Harga B2B & TOP — Vems Garage" })
const auth = useAuth()
const status = ref<any>(null)
const loading = ref(true)
const ordersCount = ref<number | null>(null)
const role = computed(() => auth.user.value?.role ?? 'customer')
const isPartner = computed(() => role.value === 'bengkel_partner')
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }

async function load() {
  await auth.fetchMe()
  if (!auth.user.value) return
  try {
    const r: any = await $fetch('/api/bengkel/me', { credentials: 'include' as any })
    status.value = r?.latest ?? null
  } catch {}
  try { const r: any = await $fetch('/api/orders', { credentials: 'include' as any }); ordersCount.value = r?.items?.length ?? 0 } catch {}
  loading.value = false
}
onMounted(load)
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="MITRA BENGKEL // PORTAL B2B — HARGA, TOP & DISPATCH" />
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap items-center gap-2 text-label-sm uppercase">
          <span class="bg-black text-white px-2 py-1">MITRA RESMI</span>
          <span class="bg-[#ff5722] text-white border-2 border-black px-2 py-1">B2B 8/12/18% · TOP 14 HARI</span>
          <span class="bg-white border-2 border-black px-2 py-1">DEPOT PENGAPON SMG-01 — DOK D-04</span>
        </div>
        <h1 class="text-headline-xl uppercase tracking-tighter mt-4 leading-none">PORTAL MITRA BENGKEL</h1>
        <p class="text-body-sm text-on-surface-variant mt-1">Harga termin otomatis, plafon kredit, dan prioritas dispatch — sinkron per NIB terverifikasi.</p>

        <div v-if="loading" class="mt-6 border-2 border-black bg-white p-6 text-body-sm">Memuat status mitra…</div>
        <template v-else>
          <!-- Not partner yet -->
          <div v-if="!isPartner && !status" class="mt-6 border-[3px] border-black bg-[#fff4d6] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p class="text-label-lg uppercase font-bold">Belum mitra B2B</p>
              <p class="text-body-sm mt-1">Verifikasi NIB 1×24 jam — upgrade role otomatis ke <span class="font-mono bg-black text-white px-1">bengkel_partner</span> dan harga B2B aktif seketika.</p>
            </div>
            <NuxtLink to="/verifikasi"><VgButton variant="ember">Ajukan Verifikasi NIB →</VgButton></NuxtLink>
          </div>

          <div v-else-if="status && status.status === 'pending'" class="mt-6 border-[3px] border-black bg-[#fff4d6] p-6">
            <p class="text-label-lg uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-clock" class="size-5" /> Pengajuan pending</p>
            <p class="text-body-sm mt-2 font-mono text-xs">{{ status.name }} · NIB {{ status.nib }} · {{ status.tier }} · {{ status.depotId }}</p>
            <p class="text-body-sm mt-2">Tim Vems memverifikasi 1×24 jam. Anda akan mendapat WhatsApp dan upgrade otomatis.</p>
          </div>

          <div v-else-if="status && status.status === 'rejected'" class="mt-6 border-[3px] border-black bg-[#ffdbd1] p-6">
            <p class="text-label-lg uppercase font-bold">Ditolak — cek NIB</p>
            <p class="text-body-sm mt-1">{{ status.nib }} ditolak. Periksa dokumen dan ajukan ulang.</p>
            <NuxtLink to="/verifikasi" class="inline-block mt-3"><VgButton variant="ember">Ajukan Ulang →</VgButton></NuxtLink>
          </div>

          <!-- Partner active -->
          <div v-if="isPartner" class="mt-6 grid md:grid-cols-3 gap-3">
            <VgCard class="p-4 bg-black text-white"><div class="text-label-sm text-[#ffb5a0] uppercase">Tier Aktif</div><div class="text-headline-md uppercase mt-1">{{ status?.tier ?? 'tier-1' }}</div><div class="text-body-sm text-white/60">{{ status?.tier==='tier-3'?'18% OFF':status?.tier==='tier-2'?'12% OFF':'8% OFF' }} — auto di katalog, keranjang & checkout</div></VgCard>
            <VgCard class="p-4"><div class="text-label-sm uppercase">Pesanan Mitra</div><div class="text-headline-md">{{ ordersCount ?? '—' }}</div><NuxtLink to="/pesanan" class="text-label-sm underline font-bold">Riwayat →</NuxtLink></VgCard>
            <VgCard class="p-4 border-2 border-black"><div class="text-label-sm uppercase">Plafon B2B</div><div class="text-body-sm mt-1">Limit <span class="font-bold">Rp 45jt</span> · TOP 14 hari (hardcode demo — akan live)</div><div class="text-body-sm text-on-surface-variant mt-1">Butuh naik limit? Hubungi (024) 7692-8800</div></VgCard>
          </div>

          <div v-if="isPartner" class="mt-6 grid lg:grid-cols-2 gap-4">
            <VgCard class="p-4">
              <h2 class="text-label-lg uppercase border-b-2 border-black pb-2">Keuntungan Mitra</h2>
              <ul class="mt-3 space-y-2 text-body-sm list-disc pl-4">
                <li>Diskon termin {{ status?.tier==='tier-3'?'18%':status?.tier==='tier-2'?'12%':'8%'}} otomatis di <NuxtLink to="/katalog" class="underline">katalog</NuxtLink> & checkout</li>
                <li>Van/Motor dedicated dispatch — estimasi 30 menit Ring 1</li>
                <li>E-Faktur DJP sync E-Nofa — unduh di <NuxtLink to="/pesanan" class="underline">pesanan</NuxtLink></li>
              </ul>
            </VgCard>
            <VgCard class="p-4">
              <h2 class="text-label-lg uppercase border-b-2 border-black pb-2">Bengkel Terverifikasi</h2>
              <div class="mt-3 text-body-sm space-y-1">
                <div><span class="font-bold">Nama:</span> {{ status?.name ?? auth.user.value?.name }}</div>
                <div><span class="font-bold">NIB:</span> <span class="font-mono text-xs">{{ status?.nib ?? '—' }}</span></div>
                <div><span class="font-bold">Depot:</span> {{ status?.depotId ?? 'SMG-01' }}</div>
                <div><span class="font-bold">Status:</span> <span class="bg-emerald-600 text-white px-1.5 py-0.5 text-[10px] uppercase">{{ status?.status ?? 'verified' }}</span></div>
              </div>
            </VgCard>
          </div>

          <div class="mt-6 flex flex-wrap gap-2">
            <NuxtLink to="/katalog"><VgButton variant="ember">Belanja Harga B2B →</VgButton></NuxtLink>
            <NuxtLink to="/pesanan"><VgButton>Riwayat Pesanan</VgButton></NuxtLink>
            <NuxtLink to="/cek-keaslian" class="border-2 border-black bg-white px-4 py-2 text-label-sm font-bold">Cek Keaslian Serial</NuxtLink>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
