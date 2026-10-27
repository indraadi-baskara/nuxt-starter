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
  try { await auth.signUp({ name: form.name, email: form.email, password: form.password }); navigateTo('/dashboard') } catch (e: any) { err.value = e?.data?.message || e?.message || 'Gagal daftar. Email mungkin sudah dipakai.' } finally { pending.value = false }
}
</script>
<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="AUTENTIKASI — DAFTAR" />
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-8">
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center gap-2 text-label-sm">
            <span class="bg-black text-white px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-check-circle" class="size-3" /> FASE 01 — AUTENTIKASI</span>
            <span class="bg-[#ff5722] text-white px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-radio-button-checked" class="size-3" /> FASE 02 — REGISTRASI</span>
            <span class="bg-white border-2 border-black px-2 py-1">FASE 03 — VERIFIKASI B2B</span>
          </div>
          <h1 class="text-headline-xl uppercase tracking-tighter mt-4">REGISTRASI ANGGOTA RESMI — DISTRIBUSI PENGAPON</h1>
          <p class="text-body-sm text-on-surface-variant mt-2">Pilih kategori akun. Bengkel mitra dapat diskon 14.5% + TOP 30 hari + e-Faktur DJP otomatis.</p>

          <div class="mt-6 grid sm:grid-cols-2 gap-3">
            <VgCard class="p-4 border-[3px] border-black"><div class="flex items-center gap-2"><Icon name="i-lucide-car-front" class="size-5" /><span class="text-label-sm font-bold uppercase">RETAIL — Personal</span></div><p class="text-body-sm mt-2">Eceran ATPM langsung gudang. VIN consult gratis. Garansi 300% jika palsu.</p></VgCard>
            <VgCard class="p-4 bg-black text-white border-[3px] border-black"><div class="flex items-center gap-2"><Icon name="i-lucide-factory" class="size-5 text-[#ff5722]" /><span class="text-label-sm font-bold uppercase">B2B — Bengkel Mitra</span><span class="ml-auto bg-[#ff5722] text-white px-2 py-0.5 text-[10px]">REKOMENDASI</span></div><p class="text-body-sm mt-2 text-white/80">Diskon grosir hingga 18% + plafon 45jt + kurir <45 menit.</p></VgCard>
          </div>

          <VgCard class="p-6 mt-6">
            <h2 class="text-label-lg uppercase border-b-2 border-black pb-2">FORMULIR PENDAFTARAN</h2>
            <div class="mt-6 space-y-3">
              <VgInput v-model="form.name" label="Nama Lengkap / Bengkel *" placeholder="Budi Santoso / Bengkel Maju Jaya" />
              <VgInput v-model="form.email" label="Email *" placeholder="kamu@email.com" />
              <VgInput v-model="form.password" label="Password *" type="password" placeholder="Min 8 karakter" />
              <div v-if="err" class="border-2 border-black bg-[#ffdbd1] p-3 text-body-sm">{{ err }}</div>
              <VgButton variant="ember" class="w-full" :disabled="pending" @click="submit">{{ pending ? 'Memproses…' : 'Daftar & Lanjutkan →' }}</VgButton>
              <p class="text-body-sm text-center">Sudah punya akun? <NuxtLink to="/auth/login" class="underline font-bold">Masuk</NuxtLink></p>
            </div>
            <div class="mt-4 border-t-2 border-black pt-3 text-body-sm">
              <p class="font-bold">Setelah daftar:</p>
              <ol class="list-decimal pl-5 mt-1 space-y-1">
                <li>Bengkel: lengkapi <NuxtLink to="/verifikasi" class="underline">verifikasi NIB</NuxtLink> untuk B2B 8/12/18%.</li>
                <li>Retail: langsung belanja — cek <NuxtLink to="/katalog" class="underline">katalog OEM</NuxtLink>.</li>
              </ol>
            </div>
          </VgCard>
        </div>
      </div>
    </section>
  </div>
</template>
