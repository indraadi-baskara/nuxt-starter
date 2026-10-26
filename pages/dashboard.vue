<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Dashboard Akun & Portal Mitra B2B — Vems Garage" })
const auth = useAuth()
const me = ref<any>(null)
const ordersCount = ref<number | null>(null)
onMounted(async () => {
  await auth.fetchMe()
  if (auth.user.value) {
    try { me.value = await $fetch('/api/me', { credentials: 'include' } as any) } catch {}
    try { const r: any = await $fetch('/api/orders', { credentials: 'include' } as any); ordersCount.value = r?.items?.length ?? 0 } catch {}
  }
})
async function logout() { await auth.signOut(); navigateTo('/') }
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-headline-lg uppercase text-black">Dashboard Akun<span v-if="auth.user.value"> — {{ auth.user.value.name }}</span></h1>
    <div v-if="!auth.user.value" class="border-[3px] border-black bg-[#fff4d6] p-6 flex flex-wrap items-center justify-between gap-4">
      <p class="text-body-md font-bold">Masuk untuk melihat dashboard & pesanan Anda.</p>
      <div class="flex gap-2">
        <NuxtLink to="/auth/login"><VgButton>Masuk</VgButton></NuxtLink>
        <NuxtLink to="/auth/register"><VgButton variant="ember">Daftar</VgButton></NuxtLink>
      </div>
    </div>
    <template v-else>
      <div class="grid md:grid-cols-3 gap-4">
        <VgCard class="p-4"><div class="text-label-sm">Pesanan</div><div class="text-headline-md">{{ ordersCount ?? '—' }}</div><NuxtLink to="/pesanan" class="text-label-sm underline">Lihat semua</NuxtLink></VgCard>
        <VgCard class="p-4"><div class="text-label-sm">Akun</div><div class="text-body-md font-bold mt-1">{{ auth.user.value.email }}</div><div class="text-label-sm mt-1 capitalize">Role: {{ auth.user.value.role }}</div></VgCard>
        <VgCard class="p-4"><div class="text-label-sm">Bengkel Terverifikasi</div><div class="text-headline-md flex items-center gap-2"><Icon name="i-lucide-badge-check" class="size-5 text-emerald-600" /> {{ auth.user.value.role === 'bengkel_partner' ? 'Aktif' : '—' }}</div><NuxtLink to="/verifikasi" class="text-label-sm underline">Ajukan verifikasi</NuxtLink></VgCard>
      </div>
      <VgCard class="p-4">
        <h2 class="text-label-lg border-b-2 border-black pb-2 mb-3">Akun</h2>
        <div class="text-body-sm space-y-1">
          <div><span class="font-bold">ID:</span> <span class="font-mono text-xs">{{ auth.user.value.id }}</span></div>
          <div><span class="font-bold">Nama:</span> {{ auth.user.value.name }}</div>
          <div><span class="font-bold">Email verified:</span> {{ me?.user?.emailVerified ? 'Ya' : 'Belum' }}</div>
        </div>
        <VgButton class="mt-4" @click="logout">Keluar</VgButton>
      </VgCard>
    </template>
  </div>
</template>
