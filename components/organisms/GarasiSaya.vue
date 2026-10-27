<script setup lang="ts">
const makes = ["HONDA", "TOYOTA", "MITSUBISHI", "SUZUKI", "DAIHATSU", "NISSAN"]
const modelsByMake: Record<string, string[]> = {
  HONDA: ["CR-V", "CIVIC TURBO", "HR-V", "BR-V", "MOBILIO"],
  TOYOTA: ["INNOVA REBORN", "AVANZA", "FORTUNER", "YARIS", "CALYA"],
  MITSUBISHI: ["PAJERO SPORT", "XPANDER", "TRITON", "MIRAGE"],
  SUZUKI: ["ERTIGA", "XL7", "CARRY", "IGNIS"],
  DAIHATSU: ["XENIA", "TERIOS", "AYLA", "SIGRA"],
  NISSAN: ["LIVINA", "TERRA", "MARCH"],
}
const genByModel: Record<string, string[]> = {
  "CR-V": ["GEN 5 (RW) 2017-2023", "GEN 4 (RM) 2012-2016", "GEN 6 (RS) 2023-NOW"],
  "CIVIC TURBO": ["GEN 10 (FC/FK) 2016-2021", "GEN 11 (FE) 2022-NOW"],
  "INNOVA REBORN": ["REBORN (2016-2022)", "REBORN FACELIFT (2021-2023)"],
  "AVANZA": ["GEN 2 (2012-2019)", "GEN 3 (2020-NOW)"],
  "PAJERO SPORT": ["GEN 2 (2015-NOW)"],
}
const engineByGen: Record<string, string[]> = {
  "GEN 5 (RW) 2017-2023": ["1.5L VTEC TURBO (L15B7)", "2.0L I-VTEC (R20A)"],
  "GEN 10 (FC/FK) 2016-2021": ["1.5L VTEC TURBO (L15B7)", "1.8L I-VTEC (R18A)"],
  "REBORN (2016-2022)": ["2.0L 1TR-FE", "2.4L 2GD-FTV DIESEL"],
}

const emit = defineEmits<{ change: [payload: { make: string; model: string; gen: string; engine: string; vin: string }] }>()

const make = ref("HONDA")
const model = ref("CR-V")
const gen = ref("GEN 5 (RW) 2017-2023")
const engine = ref("1.5L VTEC TURBO (L15B7)")
const vin = ref("MH1RW1880KK104928")
const locked = ref(true)

const models = computed(() => modelsByMake[make.value] ?? Object.values(modelsByMake).flat().slice(0, 4))
const gens = computed(() => genByModel[model.value] ?? ["GEN 5 (RW) 2017-2023", "GEN 4 (RM) 2012-2016"])
const engines = computed(() => engineByGen[gen.value] ?? ["1.5L VTEC TURBO (L15B7)", "2.0L I-VTEC"])

watch([make, model, gen, engine], () => {
  // keep cascades valid
  if (!modelsByMake[make.value]?.includes(model.value)) model.value = models.value[0]
})
watch(model, () => { if (!genByModel[model.value]?.includes(gen.value)) gen.value = gens.value[0] })
watch(gen, () => { if (!engineByGen[gen.value]?.includes(engine.value)) engine.value = engines.value[0] })

function apply() {
  locked.value = true
  emit("change", { make: make.value, model: model.value, gen: gen.value, engine: engine.value, vin: vin.value })
}
function reset() {
  locked.value = false
  make.value = "HONDA"; model.value = "CR-V"; gen.value = "GEN 5 (RW) 2017-2023"; engine.value = "1.5L VTEC TURBO (L15B7)"
  emit("change", { make: make.value, model: model.value, gen: gen.value, engine: engine.value, vin: vin.value })
}
</script>

<template>
  <section class="w-full bg-surface-container-low border-y-4 border-primary">
    <div class="max-w-7xl mx-auto px-4 lg:px-10 py-4">
      <div class="bg-surface-container-lowest border-2 border-primary p-4 lg:p-6 neo-shadow">
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-primary pb-3 mb-4 gap-2">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 bg-secondary-container text-on-secondary flex items-center justify-center font-bold font-label-md border border-primary">GS</span>
            <span class="font-headline-sm uppercase text-primary">GARASI SAYA: FILTER PRESISI KOMPATIBILITAS KENDARAAN</span>
          </div>
          <div class="inline-flex items-center gap-2 bg-primary text-on-primary px-2.5 py-1 font-label-sm uppercase font-bold tracking-wider">
            <span class="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            VIN COMPATIBILITY LOCK: {{ locked ? "ACTIVE" : "STANDBY" }}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label class="flex flex-col gap-1">
            <span class="font-label-sm uppercase text-on-surface-variant font-bold flex justify-between"><span>1. MEREK</span><span class="text-secondary font-mono text-[10px]">[{{ locked ? "LOCKED" : "EDIT" }}]</span></span>
            <select v-model="make" class="w-full bg-surface-container-lowest border-2 border-primary px-3 py-2 font-headline-sm uppercase focus:outline-none neo-shadow-sm">
              <option v-for="m in makes" :key="m" :value="m">{{ m }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="font-label-sm uppercase text-on-surface-variant font-bold flex justify-between"><span>2. MODEL</span><span class="text-secondary font-mono text-[10px]">[{{ locked ? "LOCKED" : "EDIT" }}]</span></span>
            <select v-model="model" class="w-full bg-surface-container-lowest border-2 border-primary px-3 py-2 font-headline-sm uppercase focus:outline-none neo-shadow-sm">
              <option v-for="m in models" :key="m" :value="m">{{ m }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="font-label-sm uppercase text-on-surface-variant font-bold flex justify-between"><span>3. GENERASI &amp; TAHUN</span><span class="text-secondary font-mono text-[10px]">[{{ locked ? "LOCKED" : "EDIT" }}]</span></span>
            <select v-model="gen" class="w-full bg-surface-container-lowest border-2 border-primary px-3 py-2 font-headline-sm uppercase focus:outline-none neo-shadow-sm">
              <option v-for="g in gens" :key="g" :value="g">{{ g }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="font-label-sm uppercase text-on-surface-variant font-bold flex justify-between"><span>4. KODE MESIN</span><span class="text-secondary font-mono text-[10px]">[{{ locked ? "LOCKED" : "EDIT" }}]</span></span>
            <select v-model="engine" class="w-full bg-surface-container-lowest border-2 border-primary px-3 py-2 font-headline-sm uppercase focus:outline-none neo-shadow-sm">
              <option v-for="e in engines" :key="e" :value="e">{{ e }}</option>
            </select>
          </label>
        </div>

        <div class="mt-4 pt-3 border-t-2 border-primary/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div class="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span class="font-label-sm uppercase font-bold text-on-surface whitespace-nowrap bg-surface-container px-2 py-1 border border-primary">ATAU SCAN/MASUKKAN VIN:</span>
            <div class="flex-1 flex border-2 border-primary neo-shadow-sm">
              <input v-model="vin" placeholder="17 DIGIT NOMOR RANGKA..." class="flex-1 px-3 py-1.5 font-mono text-sm uppercase tracking-widest bg-white focus:outline-none" maxlength="17" />
              <button class="bg-primary text-on-primary px-4 py-1.5 font-label-md uppercase border-l-2 border-primary hover:bg-secondary-container transition-colors" @click="apply">VERIFIKASI</button>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button class="bg-secondary-container text-on-secondary px-4 py-2 border-2 border-primary font-label-md uppercase font-bold neo-shadow-sm hover:translate-x-px hover:translate-y-px transition-all" @click="reset">
              GANTI KENDARAAN
            </button>
          </div>
        </div>

        <div class="mt-3 bg-primary text-on-primary border-2 border-primary px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 neo-shadow-sm">
          <div class="flex items-center gap-2 font-label-sm uppercase font-bold tracking-wide flex-wrap">
            <span class="w-4 h-4 bg-emerald-500 text-primary grid place-items-center font-bold text-[11px]">✓</span>
            <span>MEMFILTER PART 100% KOMPATIBEL UNTUK:</span>
            <span class="bg-white text-black px-1.5 py-0.5 border border-primary">{{ make }} {{ model }} {{ engine }} — {{ vin || "TANPA VIN" }}</span>
          </div>
          <span class="font-label-sm uppercase text-secondary-container font-mono">GARANSI FITMENT 100%</span>
        </div>
      </div>
    </div>
  </section>
</template>
