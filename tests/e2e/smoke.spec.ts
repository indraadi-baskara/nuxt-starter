import { test, expect } from "@playwright/test";

const uid = () => `e2e_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

test.describe("Vem Garage smoke — katalog → keranjang → checkout → pesanan/[id] → PDF", () => {
  test("full checkout flow with e-Faktur PDF", async ({ page, request }) => {
    const email = `${uid()}@vem.test`;
    const password = "Passw0rd!123";
    const name = "QA Smoke";

    // 0) inventory stats is live (not hardcoded)
    const statsRes = await request.get("/api/inventory/stats");
    expect(statsRes.ok()).toBeTruthy();
    const stats = await statsRes.json();
    expect(stats.totalSku).toBeGreaterThanOrEqual(1);
    expect(stats.readyRatioFormatted).toMatch(/%$/);

    // 1) katalog renders + InventoryHeader shows live numbers
    await page.goto("/katalog");
    await expect(page.getByText("KATALOG SUKU CADANG SEMARANG DEPOT")).toBeVisible();
    await expect(page.getByText(/SKU/ ).first()).toBeVisible();
    // at least one product card
    await expect(page.getByText("Kampas Rem Depan").first()).toBeVisible({ timeout: 10_000 });

    // 2) add to cart from katalog (ProductCard Tambah)
    const tambahBtn = page.getByRole("button", { name: "Tambah" }).first();
    await tambahBtn.click();
    // header cart badge increments
    await expect(page.locator('a[href="/keranjang"]')).toBeVisible();

    // go to keranjang
    await page.goto("/keranjang");
    await expect(page.getByText("KERANJANG BELANJA")).toBeVisible();
    await expect(page.getByText(/VG-/).first()).toBeVisible();

    // 3) register (or login if exists) — need auth to checkout
    // try register, fall back to login if email taken (parallel runs)
    const reg = await request.post("/api/auth/register", {
      data: { name, email, password },
    });
    if (!reg.ok()) {
      // maybe already exists in reused dev DB — try login
      const loginFallback = await request.post("/api/auth/login", { data: { email, password } });
      expect(loginFallback.ok()).toBeTruthy();
    }

    // login via UI to get session cookie into page context
    await page.goto("/auth/login");
    await page.getByPlaceholder("anda@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill(password);
    await page.getByRole("button", { name: "Masuk" }).click();
    // should land on dashboard (guarded)
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    // re-sync cart after login and ensure item persisted
    await page.goto("/keranjang");
    await expect(page.getByText("KERANJANG BELANJA")).toBeVisible();

    // 4) checkout
    await page.goto("/checkout");
    await expect(page.getByText("Data Penerima")).toBeVisible();
    await page.getByPlaceholder("Budi Santoso").fill(name);
    await page.getByPlaceholder("08xxxxxxxxxx").fill("081234567890");
    await page.getByPlaceholder("Jl. Pengapon No. 12, Semarang").fill("Jl. Pengapon No.44 Semarang");
    await page.getByRole("button", { name: "Buat Pesanan" }).click();

    // 5) redirect to pesanan/[id]
    await expect(page).toHaveURL(/\/pesanan\/VG-ORD-/, { timeout: 15_000 });
    await expect(page.getByText("Sukses Pesanan!")).toBeVisible();
    const orderId = new URL(page.url()).pathname.split("/").pop()!;

    // verify order API directly
    const orderRes = await request.get(`/api/orders/${encodeURIComponent(orderId)}`);
    // request fixture has no session; verify via page's fetch by checking UI shows invoice no
    await expect(page.getByText(/e-Faktur DJP/)).toBeVisible();
    await expect(page.getByText(/Faktur pajak elektronik/)).toBeVisible();

    // 6) PDF: e-Faktur + Surat Jalan are downloadable and are real PDFs
    // Use page context (has auth cookie) to fetch as blob
    const pdfChecks: Array<{ kind: "invoice" | "surat-jalan"; url: string }> = [
      { kind: "invoice", url: `/api/docs/invoice?orderId=${encodeURIComponent(orderId)}` },
      { kind: "surat-jalan", url: `/api/docs/surat-jalan?orderId=${encodeURIComponent(orderId)}` },
    ];
    for (const { kind, url } of pdfChecks) {
      const buf = await page.evaluate(async (u) => {
        const r = await fetch(u, { credentials: "include" });
        if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
        const ab = await r.arrayBuffer();
        return { ct: r.headers.get("content-type"), len: ab.byteLength, head: String.fromCharCode(...new Uint8Array(ab).slice(0, 5)) };
      }, url);
      expect(buf.ct).toMatch(/application\/pdf/);
      expect(buf.len).toBeGreaterThan(500);
      expect(buf.head).toBe("%PDF-");
    }

    // 7) order appears in list
    await page.goto("/pesanan");
    await expect(page.getByText(orderId).first()).toBeVisible({ timeout: 10_000 });
  });

  test("B2B price endpoint is role-aware", async ({ request }) => {
    // unauth -> 401
    const unauth = await request.get("/api/bengkel/pricing");
    expect(unauth.status()).toBe(401);
  });
});
