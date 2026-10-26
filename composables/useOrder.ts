export type OrderItem = { sku: string; title: string; price: string; qty: number; image?: string }
export type Order = { id: string; items: OrderItem[]; customer: { name: string; phone: string; address: string; courier: string; note: string }; subtotal: number; fee: number; total: number; createdAt: string; fakturNo: string; suratJalanNo: string }

const ORDER_KEY = "vg-last-order";
const ORDERS_KEY = "vg-orders";

export function useOrder() {
  function save(order: Order) {
    if (import.meta.client) {
      localStorage.setItem(ORDER_KEY, JSON.stringify(order));
      const all: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      all.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(all.slice(0, 20)));
    }
  }
  function loadLast(): Order | null {
    if (!import.meta.client) return null;
    try { return JSON.parse(localStorage.getItem(ORDER_KEY) || "null"); } catch { return null; }
  }
  function loadAll(): Order[] {
    if (!import.meta.client) return [];
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch { return []; }
  }
  function loadById(id: string): Order | null {
    const all = loadAll();
    return all.find(o => o.id === id) || (loadLast()?.id === id ? loadLast() : null);
  }
  function makeId() { return `VG-ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-SMG`; }
  function makeFaktur(id: string) { return `010.${id.slice(-3)}/${new Date().getFullYear()}/DJP`; }
  function makeSJ(id: string) { return `SJ-${id.replace("VG-ORD-","")}`; }
  return { save, loadLast, loadAll, loadById, makeId, makeFaktur, makeSJ };
}
