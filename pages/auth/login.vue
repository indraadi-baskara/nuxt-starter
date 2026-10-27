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
  try { await auth.signIn({ email: form.email, password: form.password }); navigateTo('/dashboard') } catch (e: any) { err.value = e?.data?.message || e?.message || 'Gagal masuk.' } finally { pending.value = false }
}
</script>
<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="AUTENTIKASI — MASUK" />
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-10">
        <div class="max-w-md mx-auto">
          <div class="text-center">
            <div class="inline-flex items-center gap-2 bg-black text-white px-3 py-1 font-label-sm uppercase"><Icon name="i-lucide-shield-check" class="size-4" /> DEPOT PENGAPON SMG-01 — SECURE PORTAL</div>
            <h1 class="text-headline-xl uppercase tracking-tighter mt-3">MASUK PELANGGAN</h1>
            <p class="text-body-sm text-on-surface-variant mt-1">Retail B2C & Bengkel B2B — satu akun untuk semua depot.</p>
          </div>
          <VgCard class="p-6 mt-6">
            <div class="space-y-3">
              <VgInput v-model="form.email" label="Email" placeholder="kamu@email.com" />
              <VgInput v-model="form.password" label="Password" type="password" placeholder="••••••••" />
              <div v-if="err" class="border-2 border-black bg-[#ffdbd1] p-3 text-body-sm">{{ err }}</div>
              <VgButton variant="ember" class="w-full" :disabled="pending" @click="submit">{{ pending ? 'Memproses…' : 'Masuk →' }}</VgButton>
              <p class="text-body-sm text-center">Belum punya akun? <NuxtLink to="/auth/register" class="underline font-bold">Daftar Sekarang</NuxtLink></p>
              <div class="border-t-2 border-black pt-3 mt-3 flex flex-wrap gap-2 text-label-sm justify-center">
                <NuxtLink to="/verifikasi" class="underline">Daftar Bengkel B2B</NuxtLink>
                <span class="text-outline">•</span>
                <NuxtLink to="/cek-keaslian" class="underline">Cek Keaslian</NuxtLink>
              </div>
            </div>
          </VgCard>
          <p class="text-body-sm text-center text-on-surface-variant mt-4">Garansi 100% original — audit lab Pengapon. Hotline (024) 7692-8800</p>
        </div>
      </div>
    </section>
  </div>
</template>
