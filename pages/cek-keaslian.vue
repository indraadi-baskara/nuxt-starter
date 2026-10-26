<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Cek Keaslian & Serial Number — Vems Garage" })
const serial = ref("")
const pending = ref(false)
const result = ref<null | { ok: boolean; msg: string }>(null)
async function check() {
  if (!serial.value.trim()) { result.value = { ok: false, msg: "Masukkan serial number." }; return }
  pending.value = true
  result.value = null
  try {
    const res: any = await $fetch('/api/cek-keaslian', { method: 'POST', body: { code: serial.value.trim() } })
    result.value = { ok: !!res.ok, msg: res.message || (res.ok ? 'Ter verifikasi.' : 'Tidak dikenali.') }
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
        class="mt-4 border-[3px] p-4 text-body-sm"
        :class="result.ok ? 'border-black bg-emerald-50 text-emerald-900' : 'border-error bg-error-container text-on-error-container'"
      >
        {{ result.msg }}
      </div>
    </VgCard>
    <VgCard class="p-4 bg-black text-white border-black">
      <p class="text-label-sm">Butuh bantuan? Hotline (024) 7692-8800 — Depot SMG-01</p>
    </VgCard>
  </div>
</template>
