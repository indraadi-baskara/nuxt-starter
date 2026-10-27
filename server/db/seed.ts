import { getDb } from "./index";
import { product, inventoryLot, serial, bengkelPricing } from "./schema";

const PRODUCTS = [
  { sku: "VG-BRK-08412", title: "Kampas Rem Depan Bendix General CT", subtitle: "Toyota Innova Reborn 2016-2022 / Fortuner VRZ", brand: "Bendix", category: "Pengereman", price: 465000, badge: "GENUINE", image: "https://picsum.photos/seed/vg-brake-bendix-08412/600/400", specs: [{ label: "Kualitas", value: "OEM Replacement" }, { label: "Lokasi", value: "Rak B-04 Pengapon" }], rak: "Rak B-04 Pengapon", qty: 8 },
  { sku: "VG-FLT-11902", title: "Filter Udara Denso OEM High-Flow", subtitle: "Honda Civic Turbo 1.5 & CR-V Turbo Gen 5", brand: "Denso", category: "Filtrasi", price: 185000, badge: "GENUINE", image: "https://picsum.photos/seed/vg-filter-denso-11902/600/400", specs: [{ label: "Sertifikasi", value: "Denso Direct Lot" }, { label: "Lokasi", value: "Rak F-12" }], rak: "Rak F-12", qty: 14 },
  { sku: "VG-SUS-44109", title: "Shock Absorber Kayaba Excel-G (Depan)", subtitle: "Toyota Avanza / Xenia 2012-2019", brand: "Kayaba", category: "Suspensi", price: 890000, badge: "READY", image: "https://picsum.photos/seed/vg-susp-kayaba-44109/600/400", specs: [{ label: "Garansi", value: "12 Bulan" }, { label: "Lokasi", value: "Rak S-03" }], rak: "Rak S-03", qty: 6 },
  { sku: "VG-IGN-77291", title: "Busi Iridium NGK Laser (Set 4 Pcs)", subtitle: "Honda Jazz GK5 / Brio / HR-V 1.5", brand: "NGK", category: "Pengapian", price: 440000, badge: "GENUINE", image: "https://picsum.photos/seed/vg-ign-ngk-77291/600/400", specs: [{ label: "Heat Range", value: "6" }, { label: "Lokasi", value: "Rak I-08" }], rak: "Rak I-08", qty: 19 },
  { sku: "VG-OIL-09115", title: "Filter Oli Genuine Toyota 90915-YZZE1", subtitle: "Avanza, Calya, Yaris, Vios, Sienta", brand: "Toyota", category: "Oli", price: 55000, badge: "GENUINE", image: "https://picsum.photos/seed/vg-oil-toyota-09115/600/400", specs: [{ label: "Barcode", value: "QR ATPM" }, { label: "Lokasi", value: "Rak O-02" }], rak: "Rak O-02", qty: 42 },
  { sku: "VG-TRN-55104", title: "Kopling Set Exedy Clutch Kit (3 Pcs)", subtitle: "Pajero Sport 2.5 & Triton 4D56", brand: "Exedy", category: "Transmisi", price: 2450000, badge: "READY", image: "https://picsum.photos/seed/vg-trn-exedy-55104/600/400", specs: [{ label: "Torque", value: "450 Nm" }, { label: "Lokasi", value: "Rak K-01" }], rak: "Rak K-01", qty: 3 },
];

async function main() {
  const db = getDb();
  for (const p of PRODUCTS) {
    await db.insert(product).values({ sku: p.sku, title: p.title, subtitle: p.subtitle, brand: p.brand, category: p.category, price: p.price, badge: p.badge, image: p.image, specs: p.specs }).onConflictDoUpdate({ target: product.sku, set: { title: p.title, subtitle: p.subtitle, brand: p.brand, category: p.category, price: p.price, badge: p.badge, image: p.image, specs: p.specs } });
    await db.insert(inventoryLot).values({ id: `lot_${p.sku}`, sku: p.sku, depotId: "SMG-01", rak: p.rak, qty: p.qty, reserved: 0 }).onConflictDoUpdate({ target: inventoryLot.id, set: { qty: p.qty, rak: p.rak } });
    // seed 2 serials per SKU
    for (let i = 1; i <= 2; i++) {
      const code = `VG-2026-${p.sku.slice(-4)}${String(i).padStart(2,"0")}`;
      await db.insert(serial).values({ code, sku: p.sku, verified: true }).onConflictDoNothing();
    }
    // seed B2B pricing tiers: tier-1 -8%, tier-2 -12%, tier-3 -18%
    const tiers: Array<[string, number]> = [["tier-1", 0.08], ["tier-2", 0.12], ["tier-3", 0.18]];
    for (const [tier, disc] of tiers) {
      const b2b = Math.round(p.price * (1 - disc));
      await db.insert(bengkelPricing).values({ id: `bp_${p.sku}_${tier}`, sku: p.sku, tier, price: b2b }).onConflictDoNothing();
    }
  }
  console.log("seed done", PRODUCTS.length, "products + lots + serials + B2B pricing");
}
main().catch((e) => { console.error(e); process.exit(1); });
