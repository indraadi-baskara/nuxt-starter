<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Cek Keaslian & Serial Number — Vems Garage" })
const serial = ref("")
const pending = ref(false)
const result = ref<null | { ok: boolean; msg: string; product?: any; code?: string }>(null)
async function check() {
  if (!serial.value.trim()) { result.value = { ok: false, msg: "Masukkan serial number." }; return }
  pending.value = true
  result.value = null
  try {
    const res: any = await $fetch('/api/cek-keaslian', { method: 'POST', body: { code: serial.value.trim() } })
    result.value = { ok: !!res.ok, msg: res.message || (res.ok ? 'Ter verifikasi.' : 'Tidak dikenali.'), product: res.product ?? null, code: res.code ?? serial.value.trim().toUpperCase() }
  } catch (e: any) {
    result.value = { ok: false, msg: e?.data?.message || e?.message || 'Gagal verifikasi.' }
  } finally { pending.value = false }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-4">
    <VgCard class="p-6">
      <h1 class="text-headline-lg uppercase text-black">Cek Keaslian &amp; Serial Number Resmi</h1>
      <p class="text-body-md text-[#444748] mt-2">Masukkan nomor seri pada kemasan untuk verifikasi orisinalitas. Coba contoh: <span class="font-mono text-xs">VG-2026-841201</span></p>
      <div class="mt-6 flex gap-2">
        <VgInput v-model="serial" placeholder="Contoh: VG-2026-8F3A2C" class="flex-1" @keydown.enter="check" />
        <VgButton variant="ember" :disabled="pending" @click="check">{{ pending ? 'Cek…' : 'Verifikasi' }}</VgButton>
      </div>
      <div
        v-if="result"
        class="mt-4 border-[3px] p-4"
        :class="result.ok ? 'border-black bg-emerald-50' : 'border-error bg-error-container'"
      >
        <div class="flex items-center gap-2 text-body-sm font-bold" :class="result.ok ? 'text-emerald-900' : 'text-on-error-container'"><Icon :name="result.ok ? 'i-lucide-badge-check' : 'i-lucide-shield-x'" class="size-5" /> {{ result.ok ? 'TER VERIFIKASI' : 'TIDAK DIKENALI' }} <span v-if="result.code" class="ml-auto font-mono text-xs bg-black text-white px-2 py-0.5">{{ result.code }}</span></div>
        <p class="text-body-sm mt-2" :class="result.ok ? 'text-emerald-900' : 'text-on-error-container'">{{ result.msg }}</p>
        <div v-if="result.product" class="mt-4 border-2 border-black bg-white p-3 flex gap-3">
          <img :src="result.product.image || `https://picsum.photos/seed/${result.product.sku}/200/200`" :alt="result.product.title" class="size-16 border-2 border-black object-cover shrink-0" />
          <div class="min-w-0 flex-1"><div class="font-mono text-[11px]">{{ result.product.sku }}</div><div class="text-body-sm font-bold leading-tight">{{ result.product.title }}</div><div class="text-body-sm text-[#444748]">{{ result.product.subtitle }}</div><NuxtLink :to="`/produk/${result.product.sku}`" class="inline-block mt-2 text-label-sm underline font-bold">Lihat produk →</NuxtLink></div>
        </div>
      </div>
    </VgCard>
    <VgCard class="p-4 bg-black text-white border-black">
      <p class="text-label-sm">Butuh bantuan? Hotline (024) 7692-8800 — Depot SMG-01</p>
    </VgCard>
  </div>
</template>
