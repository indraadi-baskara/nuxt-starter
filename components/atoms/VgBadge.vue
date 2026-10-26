<script setup lang="ts">
type Variant = "default" | "ember" | "charcoal" | "outline" | "success"
withDefaults(defineProps<{ variant?: Variant; dot?: boolean }>(), { variant: "default", dot: false })

const cls: Record<Variant, string> = {
  default: "bg-white text-black border-black",
  ember: "bg-[#ff5722] text-white border-black",
  charcoal: "bg-[#2d2d2d] text-white border-black",
  outline: "bg-transparent text-black border-black",
  success: "bg-emerald-500 text-white border-black",
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 border-2 px-2 py-0.5 text-label-sm"
    :class="cls[variant]"
  >
    <span v-if="dot" class="size-2 shrink-0" :class="variant==='ember' ? 'bg-white' : 'bg-[#ff5722]'" />
    <slot />
  </span>
</template>
