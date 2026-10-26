<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Masuk — Vems Garage' })
const auth = useAuth()
const form = reactive({ email: '', password: '' })
const err = ref<string | null>(null)
const pending = ref(false)
async function submit() {
  err.value = null
  if (!form.email || !form.password) { err.value = 'Isi email & password.'; return }
  pending.value = true
  try { await auth.signIn({ email: form.email, password: form.password }); navigateTo('/checkout') } catch (e: any) { err.value = e?.data?.message || e?.message || 'Gagal masuk.' } finally { pending.value = false }
}
</script>
<template>
  <div class="max-w-md mx-auto space-y-4">
    <VgCard class="p-6">
      <h1 class="text-headline-lg uppercase">Masuk Pelanggan</h1>
      <p class="text-body-sm text-[#444748] mt-1">Retail B2C — pakai email & password yang terdaftar.</p>
      <div class="mt-6 space-y-3">
        <VgInput v-model="form.email" label="Email" placeholder="kamu@email.com" />
        <VgInput v-model="form.password" label="Password" type="password" placeholder="••••••••" />
        <div v-if="err" class="border-2 border-black bg-[#ffdbd1] p-3 text-body-sm">{{ err }}</div>
        <VgButton variant="ember" class="w-full" :disabled="pending" @click="submit">{{ pending ? 'Memproses…' : 'Masuk' }}</VgButton>
        <p class="text-body-sm text-center">Belum punya akun? <NuxtLink to="/auth/register" class="underline font-bold">Daftar</NuxtLink></p>
      </div>
    </VgCard>
  </div>
</template>
