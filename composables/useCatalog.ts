export type Product = {
  id: string
  sku: string
  title: string
  subtitle: string
  brand: string
  category: string
  price: string
  compareAt?: string
  badge?: string
  image?: string
  specs: Array<{ label: string; value: string }>
  b2bPrice?: string
  b2bTier?: string
  priceOriginal?: string
}

const SEED: Product[] = [
  { id: "1", sku: "VG-BRK-08412", title: "Kampas Rem Depan Bendix General CT", subtitle: "Toyota Innova Reborn 2016-2022 / Fortuner VRZ", brand: "Bendix", category: "Pengereman", price: "Rp 465.000", badge: "GENUINE", image: "https://picsum.photos/seed/vg-brake-bendix-08412/600/400", specs: [{ label: "Kualitas", value: "OEM Replacement" }, { label: "Lokasi", value: "Rak B-04 Pengapon" }] },
  { id: "2", sku: "VG-FLT-11902", title: "Filter Udara Denso OEM High-Flow", subtitle: "Honda Civic Turbo 1.5 & CR-V Turbo Gen 5", brand: "Denso", category: "Filtrasi", price: "Rp 185.000", badge: "GENUINE", image: "https://picsum.photos/seed/vg-filter-denso-11902/600/400", specs: [{ label: "Sertifikasi", value: "Denso Direct Lot" }, { label: "Lokasi", value: "Rak F-12" }] },
  { id: "3", sku: "VG-SUS-44109", title: "Shock Absorber Kayaba Excel-G (Depan)", subtitle: "Toyota Avanza / Xenia 2012-2019", brand: "Kayaba", category: "Suspensi", price: "Rp 890.000", badge: "READY", image: "https://picsum.photos/seed/vg-susp-kayaba-44109/600/400", specs: [{ label: "Garansi", value: "12 Bulan" }, { label: "Lokasi", value: "Rak S-03" }] },
  { id: "4", sku: "VG-IGN-77291", title: "Busi Iridium NGK Laser (Set 4 Pcs)", subtitle: "Honda Jazz GK5 / Brio / HR-V 1.5", brand: "NGK", category: "Pengapian", price: "Rp 440.000", badge: "GENUINE", image: "https://picsum.photos/seed/vg-ign-ngk-77291/600/400", specs: [{ label: "Heat Range", value: "6" }, { label: "Lokasi", value: "Rak I-08" }] },
  { id: "5", sku: "VG-OIL-09115", title: "Filter Oli Genuine Toyota 90915-YZZE1", subtitle: "Avanza, Calya, Yaris, Vios, Sienta", brand: "Toyota", category: "Oli", price: "Rp 55.000", badge: "GENUINE", image: "https://picsum.photos/seed/vg-oil-toyota-09115/600/400", specs: [{ label: "Barcode", value: "QR ATPM" }, { label: "Lokasi", value: "Rak O-02" }] },
  { id: "6", sku: "VG-TRN-55104", title: "Kopling Set Exedy Clutch Kit (3 Pcs)", subtitle: "Pajero Sport 2.5 & Triton 4D56", brand: "Exedy", category: "Transmisi", price: "Rp 2.450.000", badge: "READY", image: "https://picsum.photos/seed/vg-trn-exedy-55104/600/400", specs: [{ label: "Torque", value: "450 Nm" }, { label: "Lokasi", value: "Rak K-01" }] },
]

function formatPrice(n: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n) }

export function useCatalog() {
  const q = ref("")
  const brand = ref("")
  const category = ref("")
  const pending = ref(false)
  const error = ref<string | null>(null)
  // seed synchronously so SSR & first paint have data; refresh from DB in background
  const products = ref<Product[]>(SEED)

  async function refresh() {
    pending.value = true
    error.value = null
    try {
      const res: any = await $fetch('/api/catalog', { params: { q: q.value || undefined, brand: brand.value || undefined, category: category.value || undefined } as any })
      const rows: any[] = res?.items ?? res ?? []
      if (rows.length) {
        products.value = rows.map((r: any) => ({
          id: r.sku.replace(/[^A-Za-z0-9]/g, '').slice(-4) || r.sku,
          sku: r.sku,
          title: r.title,
          subtitle: r.subtitle ?? '',
          brand: r.brand,
          category: r.category,
          price: r.b2bPrice ? formatPrice(Number(r.b2bPrice)) : (typeof r.price === 'string' ? r.price : formatPrice(Number(r.price))),
          compareAt: r.b2bPrice ? formatPrice(Number(r.priceOriginal ?? r.price)) : (r.compareAt ? formatPrice(Number(r.compareAt)) : undefined),
          badge: r.badge ?? undefined,
          image: r.image ?? undefined,
          specs: Array.isArray(r.specs) ? r.specs : (typeof r.specs === 'string' ? (()=>{try{const p=JSON.parse(r.specs as any); return Array.isArray(p)?p:[]}catch{return []}})() : []),
          b2bPrice: r.b2bPrice ? formatPrice(Number(r.b2bPrice)) : undefined,
          b2bTier: r.b2bTier,
          priceOriginal: r.priceOriginal ? formatPrice(Number(r.priceOriginal)) : undefined,
        }))
      }
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? 'Gagal memuat katalog'
    } finally { pending.value = false }
  }

  const filtered = computed(() => {
    return products.value.filter(p => {
      if (q.value && ![p.sku, p.title, p.subtitle, p.brand].join(" ").toLowerCase().includes(q.value.toLowerCase())) return false
      if (brand.value && p.brand !== brand.value) return false
      if (category.value && p.category !== category.value) return false
      return true
    })
  })

  const brands = computed(() => [...new Set(SEED.map(s => s.brand))])
  const categories = computed(() => [...new Set(SEED.map(s => s.category))])

  if (import.meta.client) {
    // hydrate from API but never leave UI empty
    refresh()
    watch([q, brand, category], () => refresh())
  }

  return { q, brand, category, products, filtered, brands, categories, pending, error, refresh }
}
