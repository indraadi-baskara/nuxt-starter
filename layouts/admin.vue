<script setup lang="ts">
const auth = useAuth()
onMounted(() => { if (!auth.initialized.value) auth.fetchMe() })
</script>

<template>
  <div class="min-h-dvh bg-[#f3f3f4] text-on-surface antialiased">
    <AppHeader />
    <div class="w-full bg-black text-white border-b-2 border-black px-4 lg:px-10 py-2.5 flex flex-wrap items-center gap-2 text-label-sm">
      <span class="bg-[#ff5722] text-white border-2 border-white px-2 py-1 font-bold inline-flex items-center gap-1"><Icon name="i-lucide-shield" class="size-3" /> PANEL STAF</span>
      <span class="hidden sm:inline text-white/70 font-mono text-[11px]">DEPOT PENGAPON SMG-01 · DOK D-04 · OPERATIONAL</span>
      <span class="ml-auto bg-white text-black border-2 border-white px-2 py-0.5 font-mono text-[11px]">{{ auth.user.value?.role ?? '—' }} · {{ auth.user.value?.email ?? '' }}</span>
    </div>
    <nav class="w-full bg-white border-b-[3px] border-black px-4 lg:px-10 py-2 flex flex-wrap items-center gap-2">
      <NuxtLink to="/admin" exact-active-class="!bg-black !text-white" active-class="!bg-black !text-white" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">RINGKASAN</NuxtLink>
      <NuxtLink to="/admin/pesanan" active-class="!bg-black !text-white" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">PESANAN</NuxtLink>
      <NuxtLink to="/admin/verifikasi" active-class="!bg-black !text-white" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">VERIFIKASI BENGKEL</NuxtLink>
      <NuxtLink to="/admin/harga" active-class="!bg-black !text-white" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">HARGA B2B</NuxtLink>
      <div class="ml-auto flex gap-2">
        <NuxtLink to="/dashboard" class="border-2 border-black bg-[#fffae6] px-3 py-1.5 text-label-sm font-bold">← AKUN SAYA</NuxtLink>
        <NuxtLink to="/katalog" class="border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">TOKO</NuxtLink>
      </div>
    </nav>
    <main class="px-4 lg:px-10 py-6">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
