export type CartItem = { sku: string; title: string; price: string; qty: number; image?: string; id?: string }

export const useCart = () => {
  const items = useState<CartItem[]>("cart-items", () => [])
  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))
  const pending = useState<boolean>("cart-pending", () => false)
  const toast = ref<{ title: string; body: string } | null>(null)
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function parsePrice(p: string) {
    return Number(p.replace(/[^\d]/g, "")) || 0
  }
  function fmt(n: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)
  }
  const subtotal = computed(() => items.value.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0))

  function formatPrice(n: number) { return fmt(n) }

  async function sync() {
    try {
      const res: any = await $fetch('/api/cart', { credentials: 'include' } as any)
      const rows: any[] = res?.items ?? []
      if (rows.length) {
        items.value = rows.map((r: any) => {
          const p = r.product
          return {
            id: r.id,
            sku: r.sku,
            title: p?.title ?? r.sku,
            price: p ? formatPrice(Number(p.price)) : r.price ?? 'Rp 0',
            qty: r.qty,
            image: p?.image,
          }
        })
      } else {
        // keep local items if API empty (anon or pre-login) — no wipe on empty
      }
    } catch { /* fallback to local state */ }
  }

  async function add(sku: string, title: string, price: string, image?: string) {
    const ex = items.value.find((i) => i.sku === sku)
    if (ex) ex.qty++
    else items.value.push({ sku, title, price, qty: 1, image })
    showToast("SUKSES DITAMBAHKAN", `${title} — dialokasikan dari Rak Gudang SMG.`)
    try { await $fetch('/api/cart', { method: 'POST', body: { sku, qty: 1 }, credentials: 'include' } as any); await sync() } catch {}
  }
  async function inc(sku: string) { const f = items.value.find(i => i.sku === sku); if (f) f.qty++; if (f) try { await $fetch('/api/cart', { method: 'PATCH', body: { sku, qty: f.qty, op: 'set' }, credentials: 'include' } as any) } catch {} }
  async function dec(sku: string) { const f = items.value.find(i => i.sku === sku); if (f) f.qty = Math.max(1, f.qty - 1); if (f) try { await $fetch('/api/cart', { method: 'PATCH', body: { sku, qty: f!.qty, op: 'set' }, credentials: 'include' } as any) } catch {} }
  async function remove(sku: string) { items.value = items.value.filter(i => i.sku !== sku); try { await $fetch('/api/cart', { method: 'PATCH', body: { sku, qty: 0, op: 'remove' }, credentials: 'include' } as any) } catch {} }
  async function clear() { items.value = []; /* server cart cleared on order */ }

  function showToast(title: string, body: string) {
    toast.value = { title, body }
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (toast.value = null), 3000)
  }
  function hideToast() { toast.value = null }

  if (import.meta.client) sync()

  return { items, count, subtotal, pending, toast, add, inc, dec, remove, clear, sync, showToast, hideToast, fmt, parsePrice }
}
