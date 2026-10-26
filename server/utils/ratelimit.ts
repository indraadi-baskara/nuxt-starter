// simple in-memory (swap to upstash in prod)
const buckets = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(key: string, max = 10, windowMs = 60_000): { ok: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (b.count >= max) return { ok: false, remaining: 0 };
  b.count++;
  return { ok: true, remaining: max - b.count };
}
export function getClientIp(event: any): string {
  return event.context?.clientAddress || event.node?.req?.headers?.["x-forwarded-for"]?.toString().split(",")[0]?.trim() || event.node?.req?.socket?.remoteAddress || "unknown";
}
