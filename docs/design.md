# Design — Stitch → Vem Garage

> Google Stitch MCP (`opencode.json:3-12`) generates the neo-brutalist spec. This repo translates Stitch HTML into `pages/*` + `components/*`, preserving depot lore.

## Source of truth

- **Stitch project**: `Vems Garage Neo-Brutalist Storefront` `10326246268030541000`
- **MCP**: `opencode.json:7` indirect `X-Goog-Api-Key: ${STITCH_API_KEY}` — key lives only in gitignored `.env` (`STITCH_API_KEY=""` length check by loader)
- **Local snapshots**: `/tmp/stitch-*.html` (katalog `ea974eac` 69k, PDP `875a377b` 54k, cart `c48507aa` 44k, lokasi `6f64c445` 62k, cek-keaslian `6d9ddb13` 56k, bantuan `fc705469` 51k, dashboard `d8f1fb89` 41k, etc.)

To pull fresh HTML: call Stitch MCP `generate_screen_html` or fetch `https://stitch.googleapis.com/v1/projects/10326246268030541000` with `x-goog-api-key`.

## Mapping: Stitch screen → repo page

| Stitch dump | Spec emphasis | Repo page | Key components |
|-------------|---------------|-----------|----------------|
| `ea974eac` PLP | GarasiSaya 4-cascade + 17-digit VIN, 1,482 SKU strip | `pages/katalog.vue` | `GarasiSaya.vue`, `FilterPanel.vue`, `InventoryHeader.vue`, `BreadcrumbTelemetry.vue` |
| `875a377b` PDP | metrology table, compatibility, bundle, HRC/GG20 | `pages/produk/[id].vue` | `VgSpecTable` |
| `c48507aa` Cart | optimizer, B2B strikethrough, courier fee | `pages/keranjang.vue` | `AppHeader` cart count |
| `6d9ddb13` Cek Keaslian | 3-point visual guide, VIN, lab KAN | `pages/cek-keaslian.vue` | hologram/bubble copy |
| `6f64c445` Lokasi | depot hero, telemetry, Rings 1-4 35KM, ongkir sim | `pages/lokasi.vue` | Depot Pengapon SMG-01 lore |
| `fc705469` Bantuan | 4 pillars SK-VG/GAR/2025-V1, SOP, ticket RET-SMG-D4 | `pages/bantuan.vue` | FAQ accordion |
| B2B KYC upload | NPWP/NIB/plang foto/surat kuasa + plafon 45jt | `pages/verifikasi.vue` | `bengkelProfile` |
| Dashboard | credit TOP 14h, 4-unit garage, dispatch | `pages/dashboard.vue` | `GarasiSaya` + staff panel |
| Orders | dispatch pass VEMS-DP-8842, DJP E-NOFA | `pages/pesanan/[id].vue` | `CheckoutSteps` |
| Auth 01/02 | FASE 01 auth → 02 registrasi → 03 verifikasi | `pages/auth/login.vue` + `register.vue` | phase chips |

## Brand tokens

- Borders: `border-2`/`[3px]`/`[4px]` black — every card/section
- Shadows: `neo-shadow` `4px 4px 0 #000` / `neo-shadow-lg` — never Tailwind default shadow
- Palette: `surface-container` (`#eee`), `surface-container-lowest` (`#fff`), `black` primary, `secondary-container` `#ff5722` (ember), `error-container` `#ffdbd1`
- Typography: uppercase headings `tracking-tighter`, mono SKU `font-mono text-[11px]`, `text-label-sm/md`
- Layout: pages are **full-bleed** (`-m-6` wrapper + inner `max-w-7xl mx-auto px-4 lg:px-10 py-* border-b-2 border-black`) — matches Stitch edge-to-edge sections

## Component inventory

- **Atoms**: `components/atoms/VgButton.vue` (`variant: primary|ember|ghost-dark`), `VgCard.vue`, `VgInput.vue`, `VgSelect.vue`, `VgBadge.vue`, `VgDialog.vue`, `VgSpecTable.vue`
- **Molecules**: `components/molecules/AppHeader.vue` (3-layer: ticker + nav + catalog bar), `AppTopBar.vue` (same-day ticker), `AppNav.vue`, `BreadcrumbTelemetry.vue` (SYNC chip), `CheckoutSteps.vue` (1-4), `FilterPanel.vue`, `ProductCard.vue`
- **Organisms**: `components/organisms/GarasiSaya.vue` (4 cascades + VIN + fitment), `InventoryHeader.vue` (1,482 SKU/94.2%/16:30 telemetry), `HeroSukuCadang.vue`, `FeaturedCatalog.vue`, `TelemetryTicker.vue`, `TrustBanner.vue`, `VinWorkshopSection.vue`

## Translating a new Stitch screen

1. Dump HTML to `/tmp/stitch-XXXXXXXX.html`.
2. Extract sections: `grep -oE '<section[^>]*>.*?</section>'` or `python3 -c "import re; print(re.findall(r'<section[^>]*>(.*?)</section>', open('/tmp/stitch-....html').read(), re.S))"`.
3. Map Stitch `tailwind.config` colors to repo tokens (already aligned via `assets/css/main.css`).
4. Rebuild as Vue: full-bleed `<section class="w-full bg-* border-b-2 border-black">` + `<div class="max-w-7xl mx-auto px-4 lg:px-10 py-6">` — don't paste raw Stitch Tailwind cdn or `tailwind.config` script.
5. Wire data: replace Stitch placeholder text with live `useCatalog`/`$fetch /api/*`. Keep depot lore strings (Pengapon, D-04, SMG-01) verbatim.

## Do & don't

- ✅ Keep `BreadcrumbTelemetry` trail uppercase (`KATALOG › ...`) on every page.
- ✅ Keep `GarasiSaya` as the VIN entry — don't duplicate VIN logic per page.
- ❌ Don't reintroduce `container.vue` soft shadows — use `VgCard border-2 border-black`.
- ❌ Don't paste Stitch's `<script src="https://cdn.tailwindcss.com">` — repo uses `@tailwindcss/vite`.
