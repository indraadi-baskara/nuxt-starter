<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Daftar — Vems Garage' })
const auth = useAuth()
const form = reactive({ name: '', email: '', password: '' })
const err = ref<string | null>(null)
const pending = ref(false)
async function submit() {
  err.value = null
  if (!form.name || !form.email || form.password.length < 8) { err.value = 'Lengkapi nama, email, password min 8 karakter.'; return }
  pending.value = true
  try { await auth.signUp({ name: form.name, email: form.email, password: form.password }); navigateTo('/checkout') } catch (e: any) { err.value = e?.data?.message || e?.message || 'Gagal daftar. Email mungkin sudah dipakai.' } finally { pending.value = false }
}
</script>
<template>
  <div class="max-w-md mx-auto space-y-4">
    <VgCard class="p-6">
      <h1 class="text-headline-lg uppercase">Daftar Pelanggan</h1>
      <p class="text-body-sm text-[#444748] mt-1">Akun = auto-sync keranjang & e-Faktur di SMG-01.</p>
      <div class="mt-6 space-y-3">
        <VgInput v-model="form.name" label="Nama Lengkap" placeholder="Budi Santoso" />
        <VgInput v-model="form.email" label="Email" placeholder="kamu@email.com" />
        <VgInput v-model="form.password" label="Password" type="password" placeholder="Min 8 karakter" />
        <div v-if="err" class="border-2 border-black bg-[#ffdbd1] p-3 text-body-sm">{{ err }}</div>
        <VgButton variant="ember" class="w-full" :disabled="pending" @click="submit">{{ pending ? 'Memproses…' : 'Daftar' }}</VgButton>
        <p class="text-body-sm text-center">Sudah punya akun? <NuxtLink to="/auth/login" class="underline font-bold">Masuk</NuxtLink></p>
      </div>
    </VgCard>
  </div>
</template>
