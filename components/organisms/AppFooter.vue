<template>
  <footer class="border-t-[4px] border-black bg-black text-white mt-12">
    <div class="px-4 lg:px-10 py-10 grid md:grid-cols-3 gap-8">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="bg-[#ff5722] text-white border-2 border-white px-2 py-1 text-label-md">VG</span>
          <span class="text-label-lg">VEMS GARAGE</span>
        </div>
        <p class="text-body-sm text-white/70">Suku cadang orisinal &amp; rekanan bengkel Semarang. Depot SMG-01 — Central Java.</p>
        <p class="font-mono text-[11px] tracking-widest text-white/50 mt-3">DEPOT SMG-01 / CENTRAL JAVA | STATUS: OPERATIONAL</p>
      </div>
      <div>
        <h4 class="text-label-md mb-3">Bantuan</h4>
        <ul class="space-y-2 text-body-sm text-white/70">
          <li><NuxtLink to="/bantuan" class="hover:text-white underline">SOP Garansi &amp; Retur</NuxtLink></li>
          <li><NuxtLink to="/cek-keaslian" class="hover:text-white underline">Cek Keaslian Serial</NuxtLink></li>
          <li><NuxtLink to="/verifikasi" class="hover:text-white underline">Verifikasi Bengkel B2B</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h4 class="text-label-md mb-3">Hubungi</h4>
        <p class="text-body-sm text-white/70">Hotline Bengkel &amp; Part: (024) 7692-8800</p>
        <p class="text-body-sm text-white/70">Pengapon, Semarang — Same-day se-Jateng</p>
      </div>
    </div>
    <div class="border-t-2 border-white/20 px-4 lg:px-10 py-4 flex items-center justify-between">
      <span class="font-mono text-[11px] tracking-widest text-white/50">© 2026 VEMS GARAGE — ALL RIGHTS RESERVED</span>
      <span class="bg-[#ff5722] text-white text-label-sm px-2 py-1 border border-white">100% ORISINIL</span>
    </div>
  </footer>
</template>
