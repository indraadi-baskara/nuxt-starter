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
  <div class="max-w-2xl mx-auto space-y-4">
    <VgCard class="p-6">
      <h1 class="text-headline-lg uppercase text-black">Portal Verifikasi Legalitas Bengkel B2B</h1>
      <p class="text-body-md text-[#444748] mt-2">Daftarkan bengkel rekanan untuk akses harga B2B &amp; pengiriman prioritas.</p>
      <div v-if="!auth.user.value" class="mt-4 border-2 border-black bg-[#fff4d6] p-3 text-body-sm">Masuk dulu — verifikasi dikaitkan ke akun Anda. <NuxtLink to="/auth/login" class="underline font-bold">Masuk</NuxtLink> / <NuxtLink to="/auth/register" class="underline font-bold">Daftar</NuxtLink></div>
      <template v-else>
        <div v-if="loadingStatus" class="mt-4 text-body-sm">Memuat status…</div>
        <div v-else-if="myStatus" class="mt-4 border-2 border-black p-3" :class="myStatus.status === 'verified' ? 'bg-[#d6f5d6]' : myStatus.status === 'rejected' ? 'bg-[#ffdbd1]' : 'bg-[#fff4d6]'">
          <div class="text-label-sm font-bold uppercase">Status: {{ myStatus.status }}</div>
          <div class="text-body-sm mt-1 font-mono text-xs">{{ myStatus.name }} • NIB {{ myStatus.nib }} • {{ myStatus.tier }}</div>
          <div v-if="myStatus.status === 'verified'" class="text-body-sm mt-2">Selamat — Anda resmi <span class="font-bold">bengkel_partner</span>. Harga B2B aktif di katalog.</div>
          <div v-else-if="myStatus.status === 'pending'" class="text-body-sm mt-2">Tim Vems verifikasi 1×24 jam. Anda akan diupgrade otomatis.</div>
          <div v-else class="text-body-sm mt-2">Ditolak — periksa NIB dan ajukan ulang bila perlu.</div>
        </div>
        <div v-if="!myStatus || myStatus.status === 'rejected'" class="mt-6 space-y-3">
          <VgInput v-model="nama" label="Nama Bengkel" placeholder="Bengkel Maju Jaya" />
          <VgInput v-model="nib" label="NIB / Legalitas" placeholder="12 digit NIB" />
          <VgButton variant="ember" :disabled="pending" @click="submit">{{ pending ? 'Mengirim…' : 'Ajukan Verifikasi' }}</VgButton>
          <div v-if="err" class="border-2 border-black bg-[#ffdbd1] p-3 text-body-sm">{{ err }}</div>
          <div v-if="result" class="border-2 border-black bg-[#f3f3f4] p-3 text-body-sm">{{ result }}</div>
        </div>
      </template>
    </VgCard>
  </div>
</template>
