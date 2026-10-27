<script setup lang="ts">
const cart = useCart()
const cartCount = computed(() => cart.count.value)
const auth = useAuth()
const showMobileNav = ref(false)
const headerSearch = ref("")
function goSearch() {
  const q = headerSearch.value.trim()
  if (!q) return
  navigateTo({ path: "/katalog", query: { q } })
}
onMounted(() => auth.fetchMe())
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b-2 border-black">
    <AppTopBar />
    <div class="w-full px-4 lg:px-10 h-16 flex items-center justify-between gap-4 bg-white border-b-2 border-black">
      <NuxtLink to="/" class="flex items-center gap-3 shrink-0">
        <div class="w-10 h-10 bg-[#ff5722] text-white flex items-center justify-center font-bold text-headline-sm border-2 border-black neo-shadow-sm">VG</div>
        <div class="flex flex-col leading-none hidden sm:flex">
          <span class="text-headline-sm uppercase tracking-tight">VEMS GARAGE</span>
          <span class="text-label-sm text-on-surface-variant">SUKU CADANG ASLI SEMARANG</span>
        </div>
        <div class="hidden xl:flex flex-col border-l-2 border-black/10 pl-3 ml-1">
          <span class="text-label-sm text-secondary font-bold">DEPOT PENGAPON</span>
          <span class="text-label-sm text-on-surface-variant font-mono">SPEC: CENTRAL JAVA ID</span>
        </div>
      </NuxtLink>

      <div class="hidden lg:flex items-center flex-1 max-w-xl mx-6">
        <div class="flex-1 flex border-2 border-black neo-shadow-sm">
          <span class="bg-black text-white px-3 py-2 text-label-md hidden xl:flex items-center shrink-0">SEARCH</span>
          <input v-model="headerSearch" placeholder="Masukkan Nama Part atau VIN/Nomor Rangka..." class="flex-1 px-3 py-2 text-body-sm outline-none bg-white" @keydown.enter="goSearch" />
          <button class="bg-black text-white px-4 text-label-md border-l-2 border-black hover:bg-[#ff5722] transition-colors" @click="goSearch">CARI</button>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <AppNav />
        <NuxtLink to="/keranjang" class="relative border-[3px] border-black bg-white px-3 py-2 neo-shadow-sm flex items-center gap-2">
          <Icon name="i-lucide-shopping-cart" class="size-4" />
          <span class="hidden sm:inline text-label-sm">Keranjang</span>
          <span class="absolute -top-2 -right-2 bg-[#ff5722] text-white border-2 border-black text-[10px] font-bold px-1.5 py-0.5 leading-none">{{ cartCount }}</span>
        </NuxtLink>
        <NuxtLink to="/pesanan" class="hidden sm:inline-flex border-2 border-black bg-white px-3 py-2 text-label-sm">Pesanan</NuxtLink>
        <NuxtLink v-if="auth.user.value" to="/dashboard" class="hidden sm:inline-flex border-[3px] border-black bg-black text-white px-3 py-2 text-label-sm">{{ auth.user.value.name.split(' ')[0] }}</NuxtLink>
        <NuxtLink v-else to="/auth/login" class="hidden sm:inline-flex border-[3px] border-black bg-white px-3 py-2 text-label-sm">Masuk</NuxtLink>
        <NuxtLink v-if="!auth.user.value" to="/auth/register" class="hidden sm:inline-flex border-2 border-black bg-[#ff5722] text-white px-3 py-2 text-label-sm">Daftar</NuxtLink>
        <button v-else class="hidden sm:inline-flex border-2 border-black bg-white px-3 py-2 text-label-sm" @click="auth.signOut()">Keluar</button>
        <button class="lg:hidden border-2 border-black p-2" @click="showMobileNav = !showMobileNav">
          <Icon :name="showMobileNav ? 'i-lucide-x' : 'i-lucide-menu'" class="size-4" />
        </button>
      </div>
    </div>
    <div v-if="showMobileNav" class="lg:hidden border-b-2 border-black bg-white p-4 flex flex-col gap-2">
      <NuxtLink to="/katalog" class="border-2 border-black px-3 py-2 text-label-md">Katalog</NuxtLink>
      <NuxtLink to="/cek-keaslian" class="border-2 border-black px-3 py-2 text-label-md">Cek Keaslian</NuxtLink>
      <NuxtLink to="/layanan-bengkel" class="border-2 border-black px-3 py-2 text-label-md">Layanan Bengkel</NuxtLink>
      <NuxtLink to="/lokasi" class="border-2 border-black px-3 py-2 text-label-md">Lokasi</NuxtLink>
      <NuxtLink to="/pesanan" class="border-2 border-black px-3 py-2 text-label-md">Pesanan Saya</NuxtLink>
      <template v-if="auth.user.value">
        <NuxtLink to="/dashboard" class="border-2 border-black bg-black text-white px-3 py-2 text-label-md">Dashboard — {{ auth.user.value.name }}</NuxtLink>
        <button class="border-2 border-black px-3 py-2 text-label-md text-left" @click="auth.signOut()">Keluar</button>
      </template>
      <template v-else>
        <NuxtLink to="/auth/login" class="border-2 border-black px-3 py-2 text-label-md">Masuk</NuxtLink>
        <NuxtLink to="/auth/register" class="border-2 border-black bg-[#ff5722] text-white px-3 py-2 text-label-md">Daftar</NuxtLink>
      </template>
      <NuxtLink to="/bantuan" class="border-2 border-black px-3 py-2 text-label-md">Bantuan</NuxtLink>
    </div>
  </header>
</template>
