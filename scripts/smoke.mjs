#!/usr/bin/env node
// Lightweight API smoke without browser — mirrors playwright smoke for CI where no browser.
// Usage: BASE_URL=http://localhost:3000 node scripts/smoke.mjs
const base = process.env.BASE_URL || "http://localhost:3000";
const uid = () => `smoke_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
const email = `${uid()}@vem.test`;
const password = "Passw0rd!123";
const name = "Smoke API";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let cookie = "";
function storeCookie(res) {
  const sc = res.headers.getSetCookie?.() ?? [];
  // also handle single set-cookie
  const single = res.headers.get("set-cookie");
  const all = sc.length ? sc : single ? [single] : [];
  for (const c of all) {
    const kv = c.split(";")[0];
    if (kv) cookie += (cookie ? "; " : "") + kv;
  }
}
function headers(extra = {}) {
  return { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}), ...extra };
}

async function jfetch(path, opts = {}) {
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { ...headers(), ...(opts.headers || {}) },
  });
  storeCookie(res);
  return res;
}

console.log(`[smoke] base=${base} email=${email}`);

let r = await jfetch("/api/inventory/stats");
assert(r.ok, `stats ${r.status} ${await r.text()}`);
let stats = await r.json();
console.log(`[smoke] stats totalSku=${stats.totalSku} ready=${stats.readyRatioFormatted}`);
assert(stats.totalSku >= 1, "no SKUs");
assert(stats.readyRatioFormatted.endsWith("%"), "bad ratio");

r = await jfetch("/api/catalog");
assert(r.ok, `catalog ${r.status}`);
let cat = await r.json();
assert(cat.items?.length >= 1, "catalog empty");
const sku = cat.items[0].sku;
console.log(`[smoke] catalog hit sku=${sku}`);

// register
r = await jfetch("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
console.log(`[smoke] register ${r.status}`);
if (!r.ok) {
  const t = await r.text();
  console.log(`[smoke] register body ${t.slice(0, 300)}`);
}
assert(r.ok || r.status === 409, "register failed");

// login to get session cookie (register may already set it, but ensure)
r = await jfetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
console.log(`[smoke] login ${r.status} cookie=${cookie ? "yes" : "no"}`);
assert(r.ok, `login ${r.status} ${await r.text()}`);

// add to cart
r = await jfetch("/api/cart", { method: "POST", body: JSON.stringify({ sku, qty: 1 }) });
assert(r.ok, `cart post ${r.status} ${await r.text()}`);
console.log(`[smoke] cart add ok`);

// verify cart
r = await jfetch("/api/cart");
assert(r.ok, `cart get ${r.status}`);
let cart = await r.json();
console.log(`[smoke] cart items=${cart.items?.length}`);
assert(cart.items?.length >= 1, "cart empty after add");

// checkout -> order
r = await jfetch("/api/orders", {
  method: "POST",
  headers: { "Idempotency-Key": `smoke_${Date.now()}` },
  body: JSON.stringify({
    customer: { name, phone: "081234567890", address: "Jl. Pengapon No.44 Semarang" },
    courier: "SAME-DAY SMG (45 MENIT)",
  }),
});
if (!r.ok) console.error(`[smoke] orders ${r.status} ${await r.text()}`);
assert(r.ok, `orders ${r.status}`);
let order = await r.json();
console.log(`[smoke] order id=${order.id} total=${order.total}`);
assert(order.id?.startsWith("VG-ORD-"), "bad order id");

// fetch order detail
r = await jfetch(`/api/orders/${encodeURIComponent(order.id)}`);
assert(r.ok, `order get ${r.status} ${await r.text()}`);
let detail = await r.json();
console.log(`[smoke] order detail items=${detail.items?.length}`);

// pdf invoice
r = await jfetch(`/api/docs/invoice?orderId=${encodeURIComponent(order.id)}`);
assert(r.ok, `invoice ${r.status} ${await r.text()}`);
let ct = r.headers.get("content-type") || "";
assert(ct.includes("application/pdf"), `invoice ct ${ct}`);
let buf = Buffer.from(await r.arrayBuffer());
assert(buf.slice(0, 5).toString() === "%PDF-", "invoice not PDF");
console.log(`[smoke] invoice PDF ${buf.length} bytes ok`);

// surat jalan
r = await jfetch(`/api/docs/surat-jalan?orderId=${encodeURIComponent(order.id)}`);
assert(r.ok, `surat-jalan ${r.status}`);
ct = r.headers.get("content-type") || "";
assert(ct.includes("application/pdf"), `sj ct ${ct}`);
buf = Buffer.from(await r.arrayBuffer());
assert(buf.slice(0, 5).toString() === "%PDF-", "sj not PDF");
console.log(`[smoke] surat-jalan PDF ${buf.length} bytes ok`);

console.log("[smoke] PASS — katalog → keranjang → checkout → pesanan/[id] → PDFs");
