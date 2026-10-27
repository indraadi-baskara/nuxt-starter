export const TIER_LIMIT: Record<string, number> = {
  'tier-1': 45_000_000,
  'tier-2': 75_000_000,
  'tier-3': 150_000_000,
}
export const TIER_DISCOUNT: Record<string, number> = { 'tier-1': 8, 'tier-2': 12, 'tier-3': 18 }
export const TIER_TOP: Record<string, number> = { 'tier-1': 14, 'tier-2': 14, 'tier-3': 30 }

export function usePlafon() {
  function limitFor(tier: string) { return TIER_LIMIT[tier] ?? TIER_LIMIT['tier-1'] }
  function discountFor(tier: string) { return TIER_DISCOUNT[tier] ?? 8 }
  function topFor(tier: string) { return TIER_TOP[tier] ?? 14 }
  function compute(orders: Array<{ total: number; status: string }>, tier: string) {
    const limit = limitFor(tier)
    const used = orders
      .filter(o => !['delivered', 'cancelled'].includes(o.status))
      .reduce((s, o) => s + (Number(o.total) || 0), 0)
    const remaining = Math.max(0, limit - used)
    const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0
    return { limit, used, remaining, pct, discount: discountFor(tier), top: topFor(tier) }
  }
  function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0) }
  return { limitFor, discountFor, topFor, compute, fmt, TIER_LIMIT, TIER_DISCOUNT, TIER_TOP }
}
