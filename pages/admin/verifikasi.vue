<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "staff" })
useHead({ title: "Admin — Verifikasi Bengkel B2B — Vems Garage" })
const auth = useAuth()
const items = ref<any[]>([])
const filter = ref<'pending'|'verified'|'rejected'|''>('pending')
const busy = ref<string | null>(null)
async function load() {
  try { const r: any = await $fetch('/api/admin/bengkel', { credentials: 'include' as any, query: filter.value ? { status: filter.value } : {} }); items.value = r?.items ?? [] } catch (e: any) { alert(e?.data?.message || e?.message) }
}
async function verify(id: string, action: 'approve'|'reject') {
  busy.value = id; try { await $fetch(`/api/bengkel/${encodeURIComponent(id)}/verify`, { method: 'POST', body: { action }, credentials: 'include' as any }); await load() } catch (e: any) { alert(e?.data?.message || e?.message || 'Gagal') } finally { busy.value = null }
}
watch(filter, load)
onMounted(async () => { await auth.fetchMe(); await load() })
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="ADMIN // VERIFIKASI BENGKEL — NIB KEMENKUMHAM" />
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <h1 class="text-headline-xl uppercase tracking-tighter">VERIFIKASI BENGKEL B2B</h1>
        <p class="text-body-sm text-on-surface-variant mt-1">Approve NIB → role otomatis <span class="font-mono bg-black text-white px-1">bengkel_partner</span> + tier pricing aktif.</p>

        <div class="mt-4 flex gap-2 items-center flex-wrap">
          <select v-model="filter" class="border-2 border-black px-3 py-2 text-body-sm bg-white"><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option><option value="">Semua</option></select>
          <VgButton size="sm" @click="load">Refresh</VgButton>
          <span class="text-body-sm">{{ items.length }} pengajuan</span>
        </div>

        <div v-if="!items.length" class="mt-6 border-2 border-dashed border-black p-6 text-center text-body-sm">Tidak ada pengajuan untuk filter ini.</div>
        <div v-else class="mt-6 space-y-3">
          <div v-for="b in items" :key="b.id" class="border-[3px] border-black p-4 flex flex-wrap items-center gap-3" :class="b.status==='verified'?'bg-[#d6f5d6]':b.status==='rejected'?'bg-[#ffdbd1]':'bg-white'">
            <div class="flex-1 min-w-[220px]">
              <div class="text-body-sm font-bold">{{ b.name }}</div>
              <div class="font-mono text-xs">NIB {{ b.nib }} · {{ b.tier }} · {{ b.depotId }} · <span class="font-bold uppercase">{{ b.status }}</span></div>
              <div class="text-xs text-[#444748] mt-1">User: {{ b.userId }} · {{ b.createdAt ? new Date((b.createdAt as number)*1000).toLocaleString('id-ID') : '' }}</div>
            </div>
            <div v-if="b.status==='pending'" class="flex gap-2">
              <VgButton size="sm" variant="ember" :disabled="busy===b.id" @click="verify(b.id,'approve')">Approve</VgButton>
              <VgButton size="sm" :disabled="busy===b.id" @click="verify(b.id,'reject')">Reject</VgButton>
            </div>
            <span v-else class="border-2 border-black bg-white px-3 py-1 text-label-sm font-bold uppercase">{{ b.status }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
