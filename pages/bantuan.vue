<script setup lang="ts">
definePageMeta({ layout: "default" })
useHead({ title: "Pusat Bantuan, SOP Garansi & Retur — Vems Garage" })
const faqs = [
  { q: "Bagaimana klaim garansi orisinal?", a: "Bawa faktur + kemasan ber-serial ke Depot Pengapon. Verifikasi via /cek-keaslian. Garansi 100% orisinal 300% jika palsu." },
  { q: "Berapa lama retur fisik?", a: "14 hari tanpa debat jika VIN mismatch atau cacat pabrik. Segel Vems harus utuh — Dok D-04 langsung tukar." },
  { q: "Apakah bengkel rekanan dapat harga B2B?", a: "Ya — daftar di /verifikasi dengan NIB. Approved → tier 8/12/18% + TOP 14 hari otomatis." },
  { q: "e-Faktur B2B diterbitkan kapan?", a: "Otomatis saat packing — fakturNo di detail pesanan + invoice PDF + surat jalan." },
]
const open = ref<number | null>(0)
const ticket = reactive({ invoice: "", kategori: "", vin: "", wa: "", deskripsi: "" })
const sent = ref(false)
function submitTicket() { if (!ticket.invoice || !ticket.wa) return; sent.value = true }
</script>

<template>
  <div class="-m-6">
    <BreadcrumbTelemetry trail="GARANSI & PURNA JUAL" />
    <!-- Hero — Stitch fc705469 SEC1-2 -->
    <section class="w-full bg-surface-container-lowest border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <div class="flex flex-wrap gap-2 text-label-sm">
          <span class="bg-black text-white px-2 py-1">TERMINAL: AKTIF 24/7</span>
          <span class="bg-white border-2 border-black px-2 py-1">RESPON TIKET: ~12 MENIT</span>
          <span class="bg-emerald-600 text-white px-2 py-1">DOK RETUR: D-04 PENGAPON READY</span>
        </div>
        <h1 class="text-headline-xl uppercase tracking-tighter mt-3">PUSAT BANTUAN TEKNIS & DOKUMEN RETUR FISIK</h1>
        <p class="text-body-md text-on-surface-variant max-w-3xl mt-2">Transparansi penuh tanpa birokrasi. <strong>100% uang kembali VIN Fitment Guarantee</strong>, cacat pabrik, atau tukar spesifikasi langsung di Pengapon. QC Kepala On-Duty: Ir. Haryanto (DEPOT-01) — DJP E-NOFA Synchronous.</p>
        <div class="mt-4 flex flex-wrap gap-2 text-label-sm">
          <NuxtLink to="#klaim" class="bg-[#ff5722] text-white border-2 border-black px-3 py-1.5 font-bold">AKSES CEPAT: KLAIM GARANSI & RETUR →</NuxtLink>
          <NuxtLink to="/lokasi" class="bg-white border-2 border-black px-3 py-1.5 font-bold">LOKASI D-04 PENGAPON</NuxtLink>
          <NuxtLink to="/cek-keaslian" class="bg-black text-white border-2 border-black px-3 py-1.5 font-bold">CEK KEASLIAN SERIAL</NuxtLink>
        </div>
      </div>
    </section>

    <!-- 4 pillars -->
    <section class="w-full bg-white border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">
        <h2 class="text-headline-md uppercase">4 PILAR INTEGRITAS KLAIM — SK-VG/GAR/2025-V1</h2>
        <div class="mt-4 grid md:grid-cols-4 gap-3">
          <VgCard class="p-4 bg-surface-container"><div class="w-8 h-8 bg-black text-white grid place-items-center"><Icon name="i-lucide-undo-2" class="size-4" /></div><h3 class="text-label-sm font-bold uppercase mt-3">14 HARI RETUR TANPA DEBAT</h3><p class="text-body-sm mt-1">Salah spec / VIN mismatch → tukar baru seketika atau refund 100% tanpa admin fee.</p><span class="mt-2 inline-block bg-emerald-600 text-white px-2 py-0.5 text-[11px]">PROTEKSI HUKUM PEMBELI</span></VgCard>
          <VgCard class="p-4 bg-surface-container"><div class="w-8 h-8 bg-[#ff5722] text-white grid place-items-center"><Icon name="i-lucide-gavel" class="size-4" /></div><h3 class="text-label-sm font-bold uppercase mt-3">GARANSI 300% ANTI-PALSU</h3><p class="text-body-sm mt-1">Replika terbukti lab ATPM/UPTD → ganti tunai 3× lipat nominal faktur.</p><span class="mt-2 inline-block bg-black text-white px-2 py-0.5 text-[11px]">VALIDASI LAB ATPM</span></VgCard>
          <VgCard class="p-4 bg-surface-container"><div class="w-8 h-8 bg-black text-white grid place-items-center"><Icon name="i-lucide-truck" class="size-4" /></div><h3 class="text-label-sm font-bold uppercase mt-3">GRATIS ONGKOS RETUR KOTA</h3><p class="text-body-sm mt-1">Jemput gratis Semarang Raya, Demak barat, Kendal timur via Vems Express tertutup.</p><span class="mt-2 inline-block bg-[#ff5722] text-white px-2 py-0.5 text-[11px]">PICK-UP ON-CALL</span></VgCard>
          <VgCard class="p-4 bg-surface-container"><div class="w-8 h-8 bg-emerald-600 text-white grid place-items-center"><Icon name="i-lucide-timer" class="size-4" /></div><h3 class="text-label-sm font-bold uppercase mt-3">AUDIT DOK D-04 INSTAN</h3><p class="text-body-sm mt-1">Inspeksi fisik langsung di meja QC Dok D-04 — tanpa restocking fee jika segel utuh.</p><span class="mt-2 inline-block bg-black text-white px-2 py-0.5 text-[11px]">ZERO-WAITING</span></VgCard>
        </div>
      </div>
    </section>

    <!-- Alur + FAQ -->
    <section id="klaim" class="w-full bg-surface-container border-b-2 border-black">
      <div class="max-w-7xl mx-auto px-4 lg:px-10 py-6 grid lg:grid-cols-2 gap-6">
        <div>
          <h2 class="text-label-lg uppercase font-bold border-b-2 border-black pb-2">ALUR KLAIM & RETUR — SOP ISO-PART-SMG 01</h2>
          <ol class="mt-4 space-y-3">
            <li class="border-2 border-black bg-white p-3"><span class="bg-black text-white px-2 py-0.5 text-label-sm font-bold">01</span> <strong>Digital Input</strong> — invoice + foto STNK 17-digit VIN. Estimasi 3 menit.</li>
            <li class="border-2 border-black bg-white p-3"><span class="bg-black text-white px-2 py-0.5 text-label-sm font-bold">02</span> <strong>Analisa QC 15 menit</strong> — validasi EPC pabrik, approval retur.</li>
            <li class="border-2 border-black bg-white p-3"><span class="bg-black text-white px-2 py-0.5 text-label-sm font-bold">03</span> <strong>Serah Fisik</strong> — Drop Dok D-04 atau jemput Vems Express same-day.</li>
            <li class="border-2 border-black bg-emerald-50 p-3"><span class="bg-emerald-600 text-white px-2 py-0.5 text-label-sm font-bold">04</span> <strong>Selesai</strong> — tukar unit di counter atau refund BCA/Mandiri 1×24 jam.</li>
          </ol>
          <VgCard class="p-4 mt-4">
            <h3 class="text-label-lg border-b-2 border-black pb-2">FAQ</h3>
            <div class="mt-3 divide-y-2 divide-black border-2 border-black bg-white">
              <div v-for="(f,i) in faqs" :key="f.q">
                <button class="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-surface-container" @click="open = open === i ? null : i">
                  <span class="text-body-sm font-bold">{{ f.q }}</span><Icon :name="open===i ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-4 shrink-0" />
                </button>
                <div v-if="open===i" class="px-4 pb-3 text-body-sm text-on-surface-variant">{{ f.a }}</div>
              </div>
            </div>
          </VgCard>
        </div>

        <!-- Form Stitch SEC5 -->
        <VgCard class="p-4 h-fit">
          <h3 class="text-label-lg uppercase font-bold">FORMULIR PENGAJUAN RETUR & KLAIM — RET-SMG-D4</h3>
          <div class="mt-4 space-y-3">
            <VgInput v-model="ticket.invoice" label="Nomor Invoice *" placeholder="VG-TRX-2024-XXXX" />
            <VgSelect v-model="ticket.kategori" label="Kategori Kendala *" placeholder="Pilih klasifikasi" :options="[{label:'Salah Beli / Beda Spec',value:'salah'},{label:'Cacat Fisik Unboxing',value:'cacat'},{label:'VIN Mismatch',value:'vin'},{label:'Garansi Pabrik',value:'garansi'},{label:'E-Faktur DJP',value:'faktur'}]" />
            <div class="grid sm:grid-cols-2 gap-3">
              <VgInput v-model="ticket.vin" label="VIN 17 Digit *" placeholder="MH1RW1880KK104928" />
              <VgInput v-model="ticket.wa" label="WhatsApp Aktif *" placeholder="08xxxxxxxxxx" />
            </div>
            <label class="block"><span class="text-label-sm uppercase font-bold">Deskripsi & Keluhan *</span><textarea v-model="ticket.deskripsi" rows="3" placeholder="Gejala teknis, foto seal barcode..." class="mt-1 w-full border-2 border-black p-3 text-body-sm bg-white"></textarea></label>
            <div class="border-2 border-dashed border-black bg-surface-container p-4 text-center text-body-sm">
              <Icon name="i-lucide-upload" class="size-6 mx-auto" />
              <p class="mt-1">KLIK ATAU SERET FOTO/VIDEO (JPG, PNG, PDF, MP4 ≤25MB)</p>
            </div>
            <label class="flex gap-2 text-body-sm"><input type="checkbox" class="mt-1" /> Saya menyatakan data VIN & kondisi part adalah asli, segel belum dirusak.</label>
            <VgButton variant="ember" class="w-full" @click="submitTicket">KIRIMKAN TIKET KLAIM SEKARANG →</VgButton>
            <div v-if="sent" class="border-2 border-black bg-emerald-50 p-3 text-body-sm"><strong>TIKET TERCATAT: #TK-SMG-9942</strong> — dispatch dikirim ke WhatsApp Anda.</div>
          </div>
          <div class="mt-4 border-t-2 border-black pt-3 text-body-sm">
            <p class="font-bold">DROP POINT & HOTLINE</p>
            <p class="mt-1">Dok D-04: Jl. Pengapon No.42-44, Kemijen, Semarang Timur — <a href="https://maps.google.com/?q=Jl+Pengapon+No+42+Semarang" target="_blank" class="underline">Maps</a></p>
            <p>QC WA: +62 811-2890-VEMS • Dispatch: (024) 354-8890</p>
          </div>
        </VgCard>
      </div>
    </section>
  </div>
</template>
