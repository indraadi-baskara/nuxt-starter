<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Portal Cek Keaslian & Serial Number — Vems Garage" })
const serial = ref("")
const pending = ref(false)
const result = ref<null | { ok: boolean; msg: string; product?: any; code?: string }>(null)
const vinCheck = ref("")
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
function preset(s: string) { serial.value = s; check() }
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="CEK KEASLIAN & SERIAL" />
    <!-- Stitch 6d9ddb13 — hero input -->
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="inline-flex items-center gap-2 bg-black text-white px-3 py-1 font-label-sm uppercase"><Icon name="i-lucide-shield-check" class="size-4 text-emerald-400" /> STANDAR ANTI-REKONDISI POLDA JATENG & KEMENPERIN</div>
        <h1 class="text-headline-xl uppercase tracking-tighter mt-3">PORTAL VERIFIKASI KEASLIAN SUKU CADANG & SERIAL NUMBER</h1>
        <p class="text-body-md text-on-surface-variant max-w-3xl mt-2">Basis data anti-palsu & rekondisi. Verifikasi segel hologram, validasi lot ATPM, dan aktivasi garansi digital <strong>300% uang kembali</strong>.</p>

        <div class="mt-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
          <VgCard class="p-4">
            <div class="flex flex-wrap gap-2 text-label-sm">
              <span class="bg-black text-white px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-scan-barcode" class="size-3" /> INPUT SERIAL / BARCODE</span>
              <span class="bg-white border-2 border-black px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-camera" class="size-3" /> UPLOAD FOTO HOLOGRAM</span>
              <span class="bg-white border-2 border-black px-2 py-1 flex items-center gap-1"><Icon name="i-lucide-car-front" class="size-3" /> VALIDASI VIN</span>
            </div>
            <div class="mt-4">
              <label class="text-label-sm uppercase font-bold">NOMOR SERI FISIK / KODE LOT ATPM</label>
              <div class="mt-1 flex border-2 border-black neo-shadow-sm">
                <input v-model="serial" placeholder="VG-2026-8F3A2C / SCAN BARCODE" class="flex-1 px-3 py-2.5 font-mono text-sm uppercase bg-white focus:outline-none" @keydown.enter="check" />
                <button class="bg-black text-white px-5 font-label-sm border-l-2 border-black hover:bg-[#ff5722]" :disabled="pending" @click="check">{{ pending ? 'AUDIT…' : 'CEK KEASLIAN PART →' }}</button>
              </div>
              <div class="mt-3 flex flex-wrap gap-2 text-label-sm">
                <span class="text-on-surface-variant">PRESET AUDIT:</span>
                <button class="border border-black bg-emerald-50 px-2 py-0.5 hover:bg-black hover:text-white" @click="preset('VG-2026-841201')">BREMBO FRONT DISC [VALID]</button>
                <button class="border border-black bg-emerald-50 px-2 py-0.5 hover:bg-black hover:text-white" @click="preset('VG-2026-841202')">TOYOTA BRAKE PAD [VALID]</button>
                <button class="border border-black bg-white px-2 py-0.5 hover:bg-black hover:text-white" @click="preset('VG-REPLIKA-0001')">SAMPLE REPLIKA [INVALID]</button>
              </div>
            </div>
            <div class="mt-4 border-2 border-dashed border-black bg-surface-container p-3 text-body-sm">
              <p class="font-bold flex items-center gap-2"><Icon name="i-lucide-qr-code" class="size-4" /> UNGGAH FOTO SEGEL HOLOGRAM</p>
              <p class="text-on-surface-variant mt-1">Pastikan stiker hologram terkena pantulan cahaya — pola mikro- void & serial matrix harus terbaca.</p>
            </div>
          </VgCard>

          <VgCard class="p-4 bg-[#fff4d6]">
            <p class="text-label-sm uppercase font-bold">Validasi VIN (opsional)</p>
            <input v-model="vinCheck" placeholder="17 DIGIT NOMOR RANGKA" maxlength="17" class="mt-2 w-full border-2 border-black px-3 py-2 font-mono text-sm uppercase bg-white" />
            <p class="text-body-sm text-on-surface-variant mt-2">Cocokkan part dengan sasis sebelum klaim — mitigasi VIN mismatch.</p>
            <NuxtLink to="/lokasi" class="mt-3 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5 text-label-sm font-bold">Bawa ke Dock #03 Pengapon →</NuxtLink>
          </VgCard>
        </div>

        <div
          v-if="result"
          class="mt-4 border-[3px] p-4 neo-shadow"
          :class="result.ok ? 'border-black bg-emerald-50' : 'border-black bg-[#ffdbd1]'"
        >
          <div class="flex flex-wrap items-center gap-2 text-body-sm font-bold" :class="result.ok ? 'text-emerald-900' : 'text-red-900'">
            <Icon :name="result.ok ? 'i-lucide-badge-check' : 'i-lucide-shield-x'" class="size-5" /> {{ result.ok ? 'TER VERIFIKASI — 100% ORIGINAL ATPM [PASS AUDIT]' : 'TIDAK DIKENALI — GAGAL AUDIT' }}
            <span v-if="result.code" class="ml-auto font-mono text-xs bg-black text-white px-2 py-0.5">{{ result.code }}</span>
          </div>
          <p class="text-body-sm mt-2" :class="result.ok ? 'text-emerald-900' : 'text-red-900'">{{ result.msg }}</p>
          <div v-if="result.ok" class="mt-3 grid sm:grid-cols-2 gap-2 text-label-sm">
            <span class="bg-white border border-black px-2 py-1">HRC 24-28 [PASS]</span>
            <span class="bg-white border border-black px-2 py-1">HOLOGRAM VG-HLG-*** ACTIVE</span>
            <span class="bg-white border border-black px-2 py-1">RUNOUT ±0.008MM — Mitutoyo</span>
            <span class="bg-black text-white px-2 py-1">365-DAY WARRANTY — PT BREMBO IDN</span>
          </div>
          <div v-if="result.product" class="mt-4 border-2 border-black bg-white p-3 flex gap-3">
            <img :src="result.product.image || `https://picsum.photos/seed/${result.product.sku}/200/200`" :alt="result.product.title" class="size-16 border-2 border-black object-cover shrink-0" />
            <div class="min-w-0 flex-1"><div class="font-mono text-[11px]">{{ result.product.sku }}</div><div class="text-body-sm font-bold leading-tight">{{ result.product.title }}</div><div class="text-body-sm text-[#444748]">{{ result.product.subtitle }}</div><NuxtLink :to="`/produk/${result.product.sku}`" class="inline-block mt-2 text-label-sm underline font-bold">Lihat produk →</NuxtLink></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3-point visual guide — Stitch SEC 3 -->
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <h2 class="text-headline-md uppercase">PANDUAN VISUAL 3 TITIK PEMBEDA ASLI VS REPLIKA</h2>
        <p class="text-body-sm text-on-surface-variant mt-1">Jangan tertipu kemasan rapi. Komponen aspal berisiko fatal pada kecepatan tinggi.</p>
        <div class="mt-4 grid md:grid-cols-3 gap-3">
          <VgCard class="p-4"><h3 class="text-label-sm font-bold uppercase">POINT 01 — GRAFIR LASER & ETCHING 0.05MM</h3><p class="text-body-sm mt-2">Asli: dot-matrix mikron konstan, tidak pudar oli/brake cleaner. Palsu: sablon cat terkelupas bensin.</p><span class="mt-2 inline-block bg-black text-white px-2 py-0.5 font-mono text-xs">LOKASI: BIBIR LUAR ROTOR</span></VgCard>
          <VgCard class="p-4"><h3 class="text-label-sm font-bold uppercase">POINT 02 — HOLOGRAM 3D & BUBBLE ANTI-TAMPER</h3><p class="text-body-sm mt-2">Asli: perekat termal — dikelupas tinggalkan sarang lebah. Palsu: stiker polos tanpa void.</p><span class="mt-2 inline-block bg-[#ff5722] text-white px-2 py-0.5 font-mono text-xs">LIPATAN KEMASAN OEM</span></VgCard>
          <VgCard class="p-4"><h3 class="text-label-sm font-bold uppercase">POINT 03 — KODE LOT & QR ATPM</h3><p class="text-body-sm mt-2">Scan QR → validasi lot pabrik ATPM ISO 9001:2015. Replika gagal sync database Pengapon.</p><span class="mt-2 inline-block bg-emerald-600 text-white px-2 py-0.5 font-mono text-xs">ATPM PROTOCOL</span></VgCard>
        </div>
      </div>
    </section>

    <!-- Lab + protection -->
    <section class="w-full bg-surface-container border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6 grid lg:grid-cols-2 gap-4">
        <VgCard class="p-4">
          <h3 class="text-label-md uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-flask-conical" class="size-4" /> LAB METROLOGI — KAN LP-882-IDN</h3>
          <ul class="mt-3 space-y-2 text-body-sm list-disc pl-5">
            <li><strong>HRC 24-28:</strong> uji kekerasan Rockwell — anti aus tanjakan Gombel-Ungaran.</li>
            <li><strong>Spektrometri GG20:</strong> karbon murni, anti retak rob Semarang.</li>
            <li><strong>Mitutoyo ±0.008mm:</strong> kerataan bidang kontak — bebas guncang pedal.</li>
          </ul>
        </VgCard>
        <VgCard class="p-4 bg-black text-white">
          <h3 class="text-label-md uppercase font-bold flex items-center gap-2"><Icon name="i-lucide-shield" class="size-4 text-[#ff5722]" /> KLAIM 300% JIKA PALSU — LAPORKAN</h3>
          <p class="text-body-sm text-white/70 mt-2">Curiga part mengatasnamakan Vems? Audit lab gratis + advokasi retur. Hotline investigasi <span class="text-white font-mono">+62 812-3456-7890</span></p>
          <div class="mt-3 flex flex-wrap gap-2"><a href="https://wa.me/6281234567890" class="bg-[#25d366] text-white border-2 border-white px-3 py-1.5 text-label-sm font-bold">WhatsApp Legal →</a><NuxtLink to="/bantuan" class="bg-white text-black border-2 border-white px-3 py-1.5 text-label-sm font-bold">SOP Retur</NuxtLink></div>
        </VgCard>
      </div>
    </section>
  </div>
</template>
