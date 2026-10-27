<script setup lang="ts">
const auth = useAuth()
onMounted(() => { if (!auth.initialized.value) auth.fetchMe() })
const role = computed(() => auth.user.value?.role ?? null)
const isStaff = computed(() => role.value && ['admin', 'gudang_picker'].includes(role.value as string))
const isPartner = computed(() => role.value === 'bengkel_partner')
</script>

<template>
  <div class="min-h-dvh bg-background text-on-surface antialiased">
    <AppHeader />
    <nav class="w-full border-b-2 border-black bg-[#fffae6] px-4 lg:px-10 py-2 flex flex-wrap items-center gap-2">
      <NuxtLink to="/dashboard" class="border-2 border-black px-3 py-1.5 text-label-sm font-bold inline-flex items-center gap-1" active-class="bg-black text-white" exact-active-class="bg-black text-white"><Icon name="i-lucide-layout-dashboard" class="size-3.5" /> DASBOR</NuxtLink>
      <NuxtLink to="/pesanan" class="border-2 border-black px-3 py-1.5 text-label-sm font-bold inline-flex items-center gap-1" active-class="bg-black text-white"><Icon name="i-lucide-receipt" class="size-3.5" /> PESANAN</NuxtLink>
      <NuxtLink to="/mitra/dashboard" class="border-2 border-black px-3 py-1.5 text-label-sm font-bold inline-flex items-center gap-1" active-class="bg-black text-white"><Icon name="i-lucide-handshake" class="size-3.5" /> MITRA BENGKEL</NuxtLink>
      <span v-if="isPartner" class="hidden sm:inline-flex bg-emerald-600 text-white border-2 border-black px-2 py-1 text-[10px] font-bold uppercase">B2B AKTIF</span>
      <NuxtLink to="/verifikasi" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold" active-class="bg-black text-white">VERIFIKASI NIB</NuxtLink>
      <div class="ml-auto flex items-center gap-2">
        <NuxtLink v-if="isStaff" to="/admin" class="border-[3px] border-black bg-black text-white px-3 py-1.5 text-label-sm font-bold">ADMIN →</NuxtLink>
        <NuxtLink to="/katalog" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">KATALOG</NuxtLink>
      </div>
    </nav>
    <main class="px-4 lg:px-10 py-6">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
