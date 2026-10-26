<script setup lang="ts">
import { Primitive } from "reka-ui"

type Variant = "primary" | "ember" | "ghost" | "ghost-dark"
type Size = "sm" | "md" | "lg"

withDefaults(defineProps<{
  as?: string
  variant?: Variant
  size?: Size
  loading?: boolean
}>(), {
  as: "button",
  variant: "primary",
  size: "md",
  loading: false,
})

const variantCls: Record<Variant, string> = {
  primary: "bg-white text-black border-black neo-shadow hover:bg-zinc-50",
  ember: "bg-[#ff5722] text-white border-black neo-shadow hover:bg-[#ff6a3a]",
  ghost: "bg-transparent text-black border-black/20 hover:border-black hover:bg-black hover:text-white",
  "ghost-dark": "bg-black text-white border-black neo-shadow hover:bg-zinc-900",
}
const sizeCls: Record<Size, string> = {
  sm: "px-3 py-1.5 text-label-sm",
  md: "px-5 py-2.5 text-label-md",
  lg: "px-6 py-3 text-label-lg",
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="false"
    class="inline-flex items-center justify-center gap-2 border-[3px] font-bold uppercase tracking-wider transition-[transform,box-shadow] duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
    :class="[variantCls[variant], sizeCls[size]]"
  >
    <slot />
  </Primitive>
</template>
