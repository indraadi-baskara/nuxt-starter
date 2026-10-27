<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Layanan Bengkel & Jaringan Rekanan — Vems Garage" })
const q = ref("")
const partners = ref<any[]>([])
const loading = ref(true)
const err = ref<string | null>(null)
async function load() {
  loading.value = true; err.value = null
  try {
    const res: any = await $fetch("/api/bengkel", { query: q.value ? { q: q.value } : {} })
    let items = res?.items ?? []
    if (q.value) {
      const term = q.value.toLowerCase()
      items = items.filter((p: any) => `${p.name} ${p.nib} ${p.tier}`.toLowerCase().includes(term))
    }
    partners.value = items
  } catch (e: any) { err.value = e?.data?.message || e?.message || "Gagal memuat" }
  finally { loading.value = false }
}
onMounted(load)
watch(q, () => load())
</script>
<template>
  <div class="space-y-4 max-w-4xl">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-headline-lg uppercase text-black">Layanan Bengkel &amp; Jaringan Rekanan</h1>
        <p class="text-body-md text-[#444748]">Pasang suku cadang di bengkel rekanan terverifikasi — garansi pemasangan berlaku.</p>
      </div>
      <NuxtLink to="/verifikasi"><VgButton variant="ember">Daftar Jadi Rekanan</VgButton></NuxtLink>
    </div>
    <VgInput v-model="q" placeholder="Cari bengkel / NIB / tier…" />
    <div v-if="loading" class="border-2 border-black bg-white p-6 text-center text-body-sm">Memuat…</div>
    <div v-else-if="err" class="border-2 border-black bg-[#ffdbd1] p-4 text-body-sm">{{ err }}</div>
    <div v-else-if="!partners.length" class="border-2 border-black bg-[#fff4d6] p-6 text-center">
      <p class="text-body-md">Belum ada bengkel terverifikasi. Jadilah yang pertama!</p>
      <NuxtLink to="/verifikasi" class="inline-block mt-3"><VgButton>Ajukan Verifikasi</VgButton></NuxtLink>
    </div>
    <div v-else class="grid md:grid-cols-2 gap-4">
      <VgCard v-for="p in partners" :key="p.id" class="p-4">
        <div class="flex items-center gap-2"><Icon name="i-lucide-badge-check" class="size-4 text-emerald-600" /><span class="text-label-sm font-bold uppercase text-emerald-700">Terverifikasi</span><span class="ml-auto font-mono text-[11px] bg-black text-white px-2 py-0.5">{{ p.tier }}</span></div>
        <div class="text-label-md text-black mt-2">{{ p.name }}</div>
        <div class="text-body-sm text-[#444748] mt-1 font-mono text-xs">NIB {{ p.nib }} • {{ p.depotId }}</div>
        <div class="text-body-sm text-[#444748] mt-1">Garansi pemasangan berlaku.</div>
      </VgCard>
    </div>
  </div>
</template>
