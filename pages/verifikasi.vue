<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Portal Verifikasi Legalitas Bengkel B2B — Vems Garage" })
const auth = useAuth()
const nama = ref("")
const nib = ref("")
const result = ref<string | null>(null)
const err = ref<string | null>(null)
const pending = ref(false)
const myStatus = ref<any>(null)
const loadingStatus = ref(true)
async function loadStatus() {
  loadingStatus.value = true
  try {
    if (!auth.user.value) return
    const res: any = await $fetch("/api/bengkel/me", { credentials: "include" as any })
    myStatus.value = res?.latest ?? null
  } catch {} finally { loadingStatus.value = false }
}
async function submit() {
  err.value = null; result.value = null
  if (!nama.value || !nib.value) { err.value = "Lengkapi nama bengkel & NIB."; return }
  if (!auth.user.value) { err.value = 'Masuk dulu untuk mengajukan verifikasi.'; navigateTo('/auth/login'); return }
  pending.value = true
  try {
    const res: any = await $fetch('/api/bengkel/verify', { method: 'POST', body: { name: nama.value, nib: nib.value }, credentials: 'include' as any })
    result.value = res?.message || `Pengajuan verifikasi untuk ${nama.value} (NIB ${nib.value}) diterima.`
    await loadStatus()
  } catch (e: any) { err.value = e?.data?.message || e?.message || 'Gagal mengajukan.' }
  finally { pending.value = false }
}
onMounted(async () => { await auth.fetchMe(); await loadStatus() })
</script>
<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="VERIFIKASI B2B" />
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="inline-flex items-center gap-2 bg-black text-white px-3 py-1 font-label-sm uppercase"><Icon name="i-lucide-building-2" class="size-4" /> PORTAL VERIFIKASI LEGALITAS BENGKEL B2B — KEMENKUMHAM NIB SYNC</div>
        <h1 class="text-headline-xl uppercase tracking-tighter mt-3">JADI MITRA BENGKEL RESMI VEMS GARAGE</h1>
        <p class="text-body-md text-on-surface-variant max-w-3xl mt-2">Akses harga termin <strong>B2B 8/12/18% + TOP 14 hari</strong>, armada prioritas, dan auto-sync DJP faktur. Verifikasi NIB 1×24 jam — upgrade role <span class="font-mono bg-black text-white px-1">bengkel_partner</span> otomatis.</p>

        <div class="mt-6 grid lg:grid-cols-3 gap-3">
          <VgCard class="p-4 text-center"><Icon name="i-lucide-badge-percent" class="size-8 mx-auto" /><h3 class="text-label-sm font-bold uppercase mt-2">DISKON TERMIN 8-18%</h3><p class="text-body-sm mt-1">Tier 1-3 berdasarkan volume — otomatis di katalog & checkout.</p></VgCard>
          <VgCard class="p-4 text-center"><Icon name="i-lucide-truck" class="size-8 mx-auto" /><h3 class="text-label-sm font-bold uppercase mt-2">PRIORITAS DISPATCH</h3><p class="text-body-sm mt-1">Van/Motor dedicated — estimasi 30 menit Ring 1.</p></VgCard>
          <VgCard class="p-4 text-center"><Icon name="i-lucide-receipt" class="size-8 mx-auto" /><h3 class="text-label-sm font-bold uppercase mt-2">E-FAKTUR DJP OTOMATIS</h3><p class="text-body-sm mt-1">Faktur pajak sync E-Nofa — unduh di pesanan & dashboard.</p></VgCard>
        </div>

        <div class="mt-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
          <VgCard class="p-6">
            <h2 class="text-label-lg uppercase border-b-2 border-black pb-2">FORM VERIFIKASI NIB</h2>
            <div v-if="!auth.user.value" class="mt-4 border-2 border-black bg-[#fff4d6] p-3 text-body-sm">Masuk dulu — verifikasi dikaitkan ke akun. <NuxtLink to="/auth/login" class="underline font-bold">Masuk</NuxtLink> / <NuxtLink to="/auth/register" class="underline font-bold">Daftar</NuxtLink></div>
            <template v-else>
              <div v-if="loadingStatus" class="mt-4 text-body-sm">Memuat status…</div>
              <div v-else-if="myStatus" class="mt-4 border-2 border-black p-3" :class="myStatus.status === 'verified' ? 'bg-[#d6f5d6]' : myStatus.status === 'rejected' ? 'bg-[#ffdbd1]' : 'bg-[#fff4d6]'">
                <div class="text-label-sm font-bold uppercase">Status: {{ myStatus.status }}</div>
                <div class="text-body-sm mt-1 font-mono text-xs">{{ myStatus.name }} • NIB {{ myStatus.nib }} • {{ myStatus.tier }}</div>
                <div v-if="myStatus.status === 'verified'" class="text-body-sm mt-2">Selamat — Anda resmi <span class="font-bold">bengkel_partner</span>. Harga B2B aktif.</div>
                <div v-else-if="myStatus.status === 'pending'" class="text-body-sm mt-2">Tim Vems verifikasi 1×24 jam. Upgrade otomatis.</div>
                <div v-else class="text-body-sm mt-2">Ditolak — periksa NIB dan ajukan ulang.</div>
              </div>
              <div v-if="!myStatus || myStatus.status === 'rejected'" class="mt-6 space-y-3">
                <VgInput v-model="nama" label="Nama Bengkel *" placeholder="Bengkel Maju Jaya Otomotif" />
                <VgInput v-model="nib" label="NIB 13 Digit *" placeholder="9120300000000" />
                <p class="text-body-sm text-on-surface-variant">Dokumen: SIUP/NIB scan akan diminta admin via WhatsApp setelah submit.</p>
                <VgButton variant="ember" :disabled="pending" @click="submit">{{ pending ? 'Mengirim…' : 'Ajukan Verifikasi →' }}</VgButton>
                <div v-if="err" class="border-2 border-black bg-[#ffdbd1] p-3 text-body-sm">{{ err }}</div>
                <div v-if="result" class="border-2 border-black bg-[#f3f3f4] p-3 text-body-sm">{{ result }}</div>
              </div>
            </template>
          </VgCard>
          <VgCard class="p-4 bg-black text-white">
            <h3 class="text-label-md uppercase">SYARAT TIERING</h3>
            <div class="mt-3 space-y-2 text-body-sm">
              <div class="flex justify-between border-b border-white/20 pb-1"><span>Tier 1 — Mitra Baru</span><span class="font-bold text-[#ffb5a0]">8% OFF</span></div>
              <div class="flex justify-between border-b border-white/20 pb-1"><span>Tier 2 — ≥20 JT/bulan</span><span class="font-bold text-[#ffb5a0]">12% OFF</span></div>
              <div class="flex justify-between"><span>Tier 3 — ≥50 JT/bulan</span><span class="font-bold text-[#ffb5a0]">18% OFF</span></div>
            </div>
            <p class="text-body-sm text-white/60 mt-3">TOP 14 hari — plafon s.d. Rp 75jt. Hubungi (024) 7692-8800 untuk upgrade limit.</p>
            <NuxtLink to="/layanan-bengkel" class="mt-3 inline-block text-label-sm underline text-[#ff5722]">Lihat 24 bengkel rekanan →</NuxtLink>
          </VgCard>
        </div>
      </div>
    </section>
  </div>
</template>
