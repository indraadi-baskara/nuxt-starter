<script setup lang="ts">
definePageMeta({ layout: "default" })
const route = useRoute()
const order = ref<any>(null)
const err = ref<string | null>(null)
const loading = ref(true)
useHead({ title: () => order.value ? `Pesanan ${order.value.id} — Vems Garage` : "Pesanan — Vems Garage" })
function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }
function fmtPriceLabel(p: any) { if (typeof p === 'string') return p; return fmt(Number(p)) }
const steps = ["Pesanan Dibuat", "Dikemas di Depot", "Diantar Kurir SMG", "Terkirim"]

async function dl(kind: 'invoice' | 'surat-jalan') {
  const id = route.params.id as string
  const url = kind === 'invoice' ? `/api/docs/invoice?orderId=${encodeURIComponent(id)}` : `/api/docs/surat-jalan?orderId=${encodeURIComponent(id)}`
  const blob = await $fetch<Blob>(url, { responseType: 'blob', credentials: 'include' } as any)
  const href = URL.createObjectURL(blob as any)
  const a = document.createElement('a'); a.href = href; a.download = `${kind}-${id}.pdf`; a.click(); URL.revokeObjectURL(href)
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    // prefer server truth
    const data: any = await $fetch(`/api/orders/${encodeURIComponent(id)}`, { credentials: 'include' } as any).catch(() => null)
    if (data?.id) {
      // normalize server shape vs legacy
      order.value = {
        id: data.id,
        createdAt: data.createdAt,
        items: data.items ?? [],
        customer: (data.address ?? {}) as any,
        subtotal: data.subtotal, fee: data.fee, total: data.total,
        fakturNo: data.fakturNo, suratJalanNo: data.suratJalanNo,
        courier: data.courier,
      }
      // address object stores courier separately on order; keep label consistent
      order.value.customer.courier = data.courier
    } else {
      // fallback legacy localStorage
      const api = useOrder()
      order.value = api.loadById(id)
      if (!order.value) err.value = 'Pesanan tidak ditemukan. Cek daftar pesanan.'
    }
  } catch (e: any) { err.value = e?.data?.message || e?.message || 'Gagal memuat pesanan' }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-4">
    <CheckoutSteps :current="4" />
    <div v-if="loading" class="border-[3px] border-black bg-white p-8 text-center text-body-sm">Memuat pesanan…</div>
    <div v-else-if="err" class="border-2 border-black bg-[#ffdbd1] p-4 text-body-sm">{{ err }} — <NuxtLink to="/pesanan" class="underline">daftar pesanan</NuxtLink>.</div>
    <div v-else-if="!order" class="border-[3px] border-black bg-white p-8 text-center">
      <p class="text-body-md">Memuat pesanan… jika tidak muncul, cek <NuxtLink to="/pesanan" class="underline">daftar pesanan</NuxtLink>.</p>
    </div>
    <div v-else class="space-y-4">
      <div class="border-[4px] border-black bg-[#0a0a0a] text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-4">
          <div class="size-12 bg-[#ff5722] border-2 border-white grid place-items-center shrink-0"><Icon name="i-lucide-check" class="size-7 text-white" /></div>
          <div>
            <h1 class="text-headline-md uppercase leading-none">Sukses Pesanan!</h1>
            <p class="font-mono text-label-sm mt-1 opacity-80">{{ order.id }} • {{ new Date(order.createdAt).toLocaleString("id-ID") }}</p>
            <p class="text-body-sm mt-2 opacity-70">Terima kasih {{ order.customer.name }} — tim Depot Pengapon sedang mengemas pesanan Anda.</p>
          </div>
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/katalog"><VgButton variant="ghost-dark">Lanjut Belanja</VgButton></NuxtLink>
          <NuxtLink to="/pesanan"><VgButton variant="ember">Lihat Pesanan</VgButton></NuxtLink>
        </div>
      </div>
      <div class="grid md:grid-cols-4 gap-3">
        <div v-for="(s, i) in steps" :key="s" class="border-2 border-black p-3 bg-white flex items-center gap-3" :class="i===0 ? 'bg-[#ff5722] text-white border-black' : ''">
          <span class="size-7 grid place-items-center border-2 text-label-sm font-bold shrink-0" :class="i===0 ? 'bg-white text-black border-white' : 'bg-black text-white border-black'">{{ i+1 }}</span>
          <span class="text-label-sm uppercase font-bold">{{ s }}</span>
        </div>
      </div>
      <div class="grid lg:grid-cols-[1fr_380px] gap-4">
        <div class="space-y-4">
          <VgCard class="p-0 overflow-hidden">
            <div class="bg-black text-white px-4 py-3 flex items-center justify-between">
              <h2 class="text-label-lg uppercase">Barang Pesanan</h2>
              <span class="font-mono text-label-sm">{{ order.items.length }} SKU</span>
            </div>
            <div class="p-4 space-y-3">
              <div v-for="it in order.items" :key="it.sku" class="flex gap-3 border-2 border-black p-3 bg-white">
                <div class="size-14 border-2 border-black bg-[#f3f3f4] shrink-0 overflow-hidden"><img :src="it.image || `https://picsum.photos/seed/${it.sku}/200/200`" :alt="it.title" class="size-full object-cover" /></div>
                <div class="flex-1 min-w-0"><div class="font-mono text-[11px]">{{ it.sku }}</div><div class="text-body-sm font-bold">{{ it.title }}</div><div class="text-label-sm">Qty {{ it.qty }} • {{ fmtPriceLabel(it.price) }}</div></div>
                <div class="text-body-sm font-bold shrink-0">{{ fmt((Number(String(it.price).replace(/[^\d]/g, ""))||0) * it.qty) }}</div>
              </div>
              <div class="border-t-2 border-black pt-3 space-y-1 text-body-sm">
                <div class="flex justify-between"><span>Subtotal</span><span class="font-bold">{{ fmt(order.subtotal) }}</span></div>
                <div class="flex justify-between"><span>Ongkir ({{ order.customer.courier ?? order.courier }})</span><span class="font-bold">{{ fmt(order.fee) }}</span></div>
                <div class="flex justify-between text-body-md font-bold border-t-2 border-black pt-2"><span>Total</span><span>{{ fmt(order.total) }}</span></div>
              </div>
            </div>
          </VgCard>
          <VgCard class="p-4">
            <h3 class="text-label-md border-b-2 border-black pb-2">Alamat Pengiriman</h3>
            <p class="text-body-sm mt-3"><span class="font-bold">{{ order.customer.name }}</span> • {{ order.customer.phone }}</p>
            <p class="text-body-sm text-[#444748]">{{ order.customer.address }}</p>
            <p v-if="order.customer.note" class="text-body-sm mt-2 border-l-2 border-black pl-3">Catatan: {{ order.customer.note }}</p>
          </VgCard>
        </div>
        <div class="space-y-4">
          <VgCard class="p-4">
            <h3 class="text-label-lg border-b-2 border-black pb-2">Dokumen Resmi</h3>
            <div class="mt-4 space-y-3">
              <div class="border-[3px] border-black p-3 bg-[#ffdbd1]">
                <div class="flex items-center gap-2 text-label-sm font-bold uppercase"><Icon name="i-lucide-file-text" class="size-4" /> e-Faktur DJP</div>
                <div class="font-mono text-label-sm mt-1">{{ order.fakturNo }}</div>
                <p class="text-body-sm mt-2">Faktur pajak elektronik — dikirim ke WhatsApp & email.</p>
                <button class="mt-3 w-full border-2 border-black bg-white py-2 text-label-sm uppercase font-bold" @click="dl('invoice')">Unduh e-Faktur (PDF)</button>
              </div>
              <div class="border-[3px] border-black p-3 bg-white">
                <div class="flex items-center gap-2 text-label-sm font-bold uppercase"><Icon name="i-lucide-truck" class="size-4" /> Surat Jalan Gudang</div>
                <div class="font-mono text-label-sm mt-1">{{ order.suratJalanNo }} • DOCK-01 Pengapon</div>
                <p class="text-body-sm mt-2">Diserahkan bersama barang oleh kurir SMG.</p>
                <button class="mt-3 w-full border-2 border-black bg-black text-white py-2 text-label-sm uppercase font-bold" @click="dl('surat-jalan')">Unduh Surat Jalan (PDF)</button>
              </div>
            </div>
          </VgCard>
          <VgCard class="p-4 bg-[#f9f9f9]">
            <h3 class="text-label-sm uppercase font-bold">Butuh bantuan?</h3>
            <p class="text-body-sm mt-2">Hubungi Depot SMG-01: (024) 7692-8800 — sebutkan nomor pesanan.</p>
            <NuxtLink to="/cek-keaslian" class="inline-block mt-3 text-label-sm underline font-bold">Cek Keaslian Serial →</NuxtLink>
          </VgCard>
        </div>
      </div>
    </div>
  </div>
</template>
