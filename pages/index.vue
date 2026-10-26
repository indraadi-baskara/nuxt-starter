<script setup lang="ts">
import type { FeaturedItem } from "~/components/organisms/FeaturedCatalog.vue"

definePageMeta({ layout: "default" })
useHead({ title: "Vems Garage — Suku Cadang Asli Semarang | Tanpa Kompromi" })

const cart = useCart()
const activeCategory = ref("all")
const FEATURED: FeaturedItem[] = [
  { sku: "VG-BRK-08412", title: "Kampas Rem Depan Bendix General CT", desc: "Toyota Kijang Innova Reborn (2016-2022) / Fortuner VRZ. Bebas debu velg.", price: "Rp 465.000", brandLabel: "BENDIX AUSTRALIA SPEC", stockLabel: "TERSEDIA: 8 SET", img: "https://picsum.photos/seed/vg-brake-bendix-08412/600/400", badge: "GENUINE CT CERAMIC", specs: [{ k: "KUALITAS", v: "OEM REPLACEMENT" }, { k: "LOKASI SMG", v: "RAK B-04 PENGAPON" }], category: "brake" },
  { sku: "VG-FLT-11902", title: "Filter Udara Denso OEM High-Flow", desc: "Honda Civic Turbo 1.5 (FC/FK) & CR-V Turbo Gen 5. Filtrasi mikron presisi.", price: "Rp 185.000", brandLabel: "DENSO JAPAN GENUINE", stockLabel: "TERSEDIA: 14 PCS", img: "https://picsum.photos/seed/vg-filter-denso-11902/600/400", badge: "HIGH-FLOW MULTI-LAYER", specs: [{ k: "SERTIFIKASI", v: "DENSO DIRECT LOT" }, { k: "LOKASI SMG", v: "RAK F-12 PENGAPON" }], category: "filter" },
  { sku: "VG-SUS-44109", title: "Shock Absorber Kayaba Excel-G (Depan)", desc: "Toyota Avanza / Daihatsu Xenia 2012-2019. Twin-tube gas presisi.", price: "Rp 890.000", brandLabel: "KAYABA EXCEL-G", stockLabel: "TERSEDIA: 6 PCS", img: "https://picsum.photos/seed/vg-susp-kayaba-44109/600/400", badge: "TWIN-TUBE GAS", specs: [{ k: "GARANSI", v: "12 BULAN" }, { k: "LOKASI SMG", v: "RAK S-03 PENGAPON" }], category: "suspension" },
  { sku: "VG-IGN-77291", title: "Busi Iridium NGK Laser (Set 4 Pcs)", desc: "Honda Jazz GK5, City GM6, HR-V 1.5, Brio i-VTEC. 100.000 KM.", price: "Rp 440.000", brandLabel: "NGK SPARK PLUG CO.", stockLabel: "TERSEDIA: 19 SET", img: "https://picsum.photos/seed/vg-ign-ngk-77291/600/400", badge: "LASER WELDED 0.6MM TIP", specs: [{ k: "HEAT RANGE", v: "6 (OPTIMAL CITY RUN)" }, { k: "LOKASI SMG", v: "RAK I-08 PENGAPON" }], category: "ignition" },
  { sku: "VG-OIL-09115", title: "Filter Oli Genuine Toyota (Original Part)", desc: "Part No: 90915-YZZE1 — Avanza, Calya, Yaris, Vios, Sienta.", price: "Rp 55.000", brandLabel: "TOYOTA GENUINE PART", stockLabel: "TERSEDIA: 42 PCS", img: "https://picsum.photos/seed/vg-oil-toyota-09115/600/400", badge: "GENUINE ASTRA TOYOTA", specs: [{ k: "BARCODE ATPM", v: "SCANNABLE QR CODE" }, { k: "LOKASI SMG", v: "RAK O-02 PENGAPON" }], category: "filter" },
  { sku: "VG-TRN-55104", title: "Kopling Set Exedy Clutch Kit (3 Pcs)", desc: "Mitsubishi Pajero Sport Dakar 2.5 & Triton 4D56. Tahan torsi diesel.", price: "Rp 2.450.000", brandLabel: "EXEDY JAPAN HEAVY DUTY", stockLabel: "TERSEDIA: 3 UNIT", img: "https://picsum.photos/seed/vg-trn-exedy-55104/600/400", badge: "3-PIECE COMPLETE KIT", specs: [{ k: "TORQUE CAPACITY", v: "450 NM REINFORCED" }, { k: "LOKASI SMG", v: "RAK K-01 PENGAPON" }], category: "engine" },
]

const visible = computed(() => activeCategory.value === "all" ? FEATURED : FEATURED.filter(f => f.category === activeCategory.value))

function onHeroSearch(q: string) {
  if (!q) return
  navigateTo({ path: "/katalog", query: { q } })
}
</script>

<template>
  <div class="-m-6">
    <TelemetryTicker />
    <HeroSukuCadang @search="onHeroSearch" />
    <TrustBanner />
    <FeaturedCatalog :items="visible" :active-category="activeCategory" @filter="activeCategory = $event" @add="cart.add($event.sku, $event.title, $event.price)" />
    <VinWorkshopSection />

    <!-- Toast -->
    <Transition enter-active-class="transition duration-200" enter-from-class="translate-y-4 opacity-0" leave-active-class="transition duration-200" leave-to-class="translate-y-4 opacity-0">
      <div v-if="cart.toast.value" class="fixed bottom-6 right-6 z-50 bg-black text-white border-4 border-white p-4 max-w-md flex items-start gap-3" style="box-shadow: 6px 6px 0 0 #ff5722">
        <Icon name="i-lucide-check-circle" class="size-7 text-[#ff5722] shrink-0" />
        <div class="flex-1">
          <div class="text-label-md uppercase font-bold">{{ cart.toast.value.title }}</div>
          <div class="text-body-sm uppercase text-white/70 mt-0.5">{{ cart.toast.value.body }}</div>
        </div>
        <button class="hover:text-[#ff5722]" @click="cart.hideToast()"><Icon name="i-lucide-x" class="size-4" /></button>
      </div>
    </Transition>
  </div>
</template>
