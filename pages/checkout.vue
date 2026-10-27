<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Checkout & e-Faktur — Vems Garage" })
const cart = useCart()
const auth = useAuth()
const form = reactive({ name: "", phone: "", address: "", courier: "SAME-DAY SMG (45 MENIT)", note: "" })
const error = ref<string | null>(null)
const busy = ref(false)
const courierFee: Record<string, number> = { "SAME-DAY SMG (45 MENIT)": 25000, "REGULER J&T / JNE (1-2 HARI)": 15000, "AMBIL DI DEPOT PENGAPON": 0 }
const fee = computed(() => courierFee[form.courier] ?? 0)
const grandTotal = computed(() => cart.subtotal.value + fee.value)
onMounted(async () => {
  await auth.fetchMe()
  if (auth.user.value?.name) form.name = auth.user.value.name
  if (auth.user.value?.phone) form.phone = auth.user.value.phone as string
})

async function placeOrder() {
  error.value = null
  if (!cart.items.value.length) { error.value = "Keranjang kosong."; return }
  if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) { error.value = "Lengkapi nama, no. HP, dan alamat."; return }
  if (!auth.user.value) {
    // remember form, go login/register then come back
    if (import.meta.client) sessionStorage.setItem('vg-checkout-form', JSON.stringify(form))
    return navigateTo('/auth/register')
  }
  busy.value = true
  try {
    // fallback: if DB cart empty but local cart has items, send them explicitly
    const fallbackItems = cart.items.value.map(i => ({ sku: i.sku, qty: i.qty }))
    const idem = `idem_${Date.now()}_${Math.random().toString(36).slice(2,6)}`
    const res: any = await $fetch('/api/orders', {
      method: 'POST',
      body: { customer: { name: form.name, phone: form.phone, address: form.address, note: form.note }, courier: form.courier, items: fallbackItems },
      headers: { 'Idempotency-Key': idem } as any,
      credentials: 'include' as any,
    })
    const id = res?.id
    if (!id) throw new Error('Order ID missing')
    cart.clear()
    navigateTo(`/pesanan/${id}`)
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'Gagal membuat pesanan.'
    if (e?.statusCode === 401 || /login/i.test(msg)) {
      error.value = 'Sesi habis — silakan masuk kembali.'
      navigateTo('/auth/login')
      return
    }
    error.value = msg
  } finally { busy.value = false }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-4">
    <CheckoutSteps :current="2" />
    <div v-if="!auth.user.value" class="border-[3px] border-black bg-[#fff4d6] p-4 flex flex-wrap items-center justify-between gap-3">
      <p class="text-body-sm font-bold">Masuk untuk checkout & e-Faktur dikirim ke akun Anda.</p>
      <div class="flex gap-2">
        <NuxtLink to="/auth/login"><VgButton variant="primary">Masuk</VgButton></NuxtLink>
        <NuxtLink to="/auth/register"><VgButton variant="ember">Daftar</VgButton></NuxtLink>
      </div>
    </div>
    <div v-if="!cart.items.value.length" class="border-[3px] border-black bg-white p-8 text-center">
      <p class="text-body-md">Keranjang kosong — tidak bisa checkout.</p>
      <NuxtLink to="/katalog" class="inline-block mt-4"><VgButton>Kembali ke Katalog</VgButton></NuxtLink>
    </div>
    <div v-else class="grid lg:grid-cols-[1fr_380px] gap-4">
      <div class="space-y-4">
        <VgCard class="p-4">
          <h2 class="text-label-lg text-black border-b-[3px] border-black pb-2 mb-4">Data Penerima</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <VgInput v-model="form.name" label="Nama Lengkap *" placeholder="Budi Santoso" />
            <VgInput v-model="form.phone" label="No. HP / WhatsApp *" placeholder="08xxxxxxxxxx" />
          </div>
          <VgInput v-model="form.address" label="Alamat Lengkap *" placeholder="Jl. Pengapon No. 12, Semarang" class="mt-4" />
          <VgSelect v-model="form.courier" label="Kurir" :options="[ {label: 'SAME-DAY SMG (45 MENIT) — Rp 25.000', value: 'SAME-DAY SMG (45 MENIT)'}, {label: 'REGULER J&T / JNE — Rp 15.000', value: 'REGULER J&T / JNE (1-2 HARI)'}, {label: 'AMBIL DI DEPOT — Gratis', value: 'AMBIL DI DEPOT PENGAPON'} ]" class="mt-4" />
          <VgInput v-model="form.note" label="Catatan (opsional)" placeholder="Tinggalkan di pos satpam..." class="mt-4" />
          <div v-if="error" class="mt-3 border-2 border-black bg-[#ffdbd1] p-3 text-body-sm">{{ error }}</div>
        </VgCard>
        <VgCard class="p-4 bg-[#f9f9f9]">
          <h3 class="text-label-sm uppercase font-bold">Rincian Item ({{ cart.count.value }})</h3>
          <div v-for="it in cart.items.value" :key="it.sku" class="mt-3 flex justify-between border-2 border-black bg-white p-3">
            <div class="min-w-0 pr-4"><div class="font-mono text-[11px]">{{ it.sku }}</div><div class="text-body-sm font-bold truncate">{{ it.title }} × {{ it.qty }}</div></div>
            <div class="text-body-sm font-bold shrink-0">{{ cart.fmt(cart.parsePrice(it.price) * it.qty) }}</div>
          </div>
        </VgCard>
      </div>
      <VgCard class="p-4 h-fit">
        <div v-if="auth.user.value?.role === 'bengkel_partner'" class="border-2 border-emerald-600 bg-emerald-50 p-3 mb-3 text-body-sm flex items-center gap-2"><Icon name="i-lucide-badge-check" class="size-4 text-emerald-600" /><span class="font-bold">Harga B2B aktif</span> — diskon tier otomatis di subtotal.</div>
        <h2 class="text-label-lg text-black border-b-2 border-black pb-2">Ringkasan Pembayaran</h2>
        <div class="mt-4 space-y-2 text-body-sm">
          <div class="flex justify-between"><span>Subtotal{{ auth.user.value?.role === 'bengkel_partner' ? ' (B2B)' : '' }}</span><span class="font-bold">{{ cart.fmt(cart.subtotal.value) }}</span></div>
          <div class="flex justify-between"><span>Ongkir ({{ form.courier }})</span><span class="font-bold">{{ cart.fmt(fee) }}</span></div>
          <div class="flex justify-between border-t-2 border-black pt-2 text-body-md font-bold"><span>Total Bayar</span><span>{{ cart.fmt(grandTotal) }}</span></div>
        </div>
        <VgButton variant="ember" class="w-full mt-4" :disabled="busy" @click="placeOrder">{{ busy ? 'Memproses…' : 'Buat Pesanan & e-Faktur' }}</VgButton>
        <p class="text-body-sm text-center mt-3 text-[#444748]">COD / Transfer — e-Faktur resmi DJP otomatis terbit.</p>
        <NuxtLink to="/keranjang" class="block mt-3 text-center text-label-sm underline">Kembali ke keranjang</NuxtLink>
      </VgCard>
    </div>
  </div>
</template>
