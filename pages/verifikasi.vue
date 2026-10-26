<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Portal Verifikasi Legalitas Bengkel B2B — Vems Garage" })
const auth = useAuth()
const nama = ref("")
const nib = ref("")
const result = ref<string | null>(null)
const err = ref<string | null>(null)
const pending = ref(false)
async function submit() {
  err.value = null; result.value = null
  if (!nama.value || !nib.value) { err.value = "Lengkapi nama bengkel & NIB."; return }
  if (!auth.user.value) { err.value = 'Masuk dulu untuk mengajukan verifikasi.'; navigateTo('/auth/login'); return }
  pending.value = true
  try {
    const res: any = await $fetch('/api/bengkel/verify', { method: 'POST', body: { name: nama.value, nib: nib.value }, credentials: 'include' as any })
    result.value = res?.message || `Pengajuan verifikasi untuk ${nama.value} (NIB ${nib.value}) diterima.`
  } catch (e: any) { err.value = e?.data?.message || e?.message || 'Gagal mengajukan.' }
  finally { pending.value = false }
}
onMounted(() => auth.fetchMe())
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-4">
    <VgCard class="p-6">
      <h1 class="text-headline-lg uppercase text-black">Portal Verifikasi Legalitas Bengkel B2B</h1>
      <p class="text-body-md text-[#444748] mt-2">Daftarkan bengkel rekanan untuk akses harga B2B &amp; pengiriman prioritas.</p>
      <div v-if="!auth.user.value" class="mt-4 border-2 border-black bg-[#fff4d6] p-3 text-body-sm">Masuk dulu — verifikasi dikaitkan ke akun Anda. <NuxtLink to="/auth/login" class="underline font-bold">Masuk</NuxtLink> / <NuxtLink to="/auth/register" class="underline font-bold">Daftar</NuxtLink></div>
      <div class="mt-6 space-y-3">
        <VgInput v-model="nama" label="Nama Bengkel" placeholder="Bengkel Maju Jaya" />
        <VgInput v-model="nib" label="NIB / Legalitas" placeholder="12 digit NIB" />
        <VgButton variant="ember" :disabled="pending" @click="submit">{{ pending ? 'Mengirim…' : 'Ajukan Verifikasi' }}</VgButton>
        <div v-if="err" class="border-2 border-black bg-[#ffdbd1] p-3 text-body-sm">{{ err }}</div>
        <div v-if="result" class="border-2 border-black bg-[#f3f3f4] p-3 text-body-sm">{{ result }}</div>
      </div>
    </VgCard>
  </div>
</template>
