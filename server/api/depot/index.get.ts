import { getDb } from "../../db";
import { inventoryLot } from "../../db/schema";
export default defineEventHandler(async (event) => {
  const db = getDb();
  const lots = await db.select().from(inventoryLot) as any[];
  const byDepot = new Map<string, { depotId: string; totalQty: number; reserved: number; skus: number; raks: Set<string> }>();
  for (const l of lots) {
    if (!byDepot.has(l.depotId)) byDepot.set(l.depotId, { depotId: l.depotId, totalQty: 0, reserved: 0, skus: 0, raks: new Set() });
    const d = byDepot.get(l.depotId)!;
    d.totalQty += l.qty ?? 0;
    d.reserved += l.reserved ?? 0;
    d.raks.add(l.rak);
  }
  for (const d of byDepot.values()) d.skus = new Set(lots.filter(l => l.depotId === d.depotId).map(l => l.sku)).size;
  // static fallback if DB empty (pre-seed)
  if (!byDepot.size) byDepot.set("SMG-01", { depotId: "SMG-01", totalQty: 0, reserved: 0, skus: 0, raks: new Set() as any });
  const depots = [
    { id: "SMG-01", name: "Sentral Depot Pengapon", address: "Jl. Pengapon No. 12, Semarang", hours: "Senin–Sabtu 08:00–17:00 WIB", phone: "(024) 7692-8800", lat: -6.9667, lng: 110.4167 },
    { id: "SMG-02", name: "Depot Ungaran", address: "Jl. Diponegoro 88, Ungaran", hours: "Senin–Sabtu 08:00–16:00 WIB", phone: "(024) 7692-8801", lat: -7.1384, lng: 110.4049 },
  ];
  return {
    depots: depots.map(d => {
      const inv = byDepot.get(d.id);
      return { ...d, inventory: inv ? { totalQty: inv.totalQty, reserved: inv.reserved, available: inv.totalQty - inv.reserved, skus: inv.skus, raks: [...(inv.raks as Set<string>)] } : { totalQty: 0, reserved: 0, available: 0, skus: 0, raks: [] } };
    }),
  };
});
