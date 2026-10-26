<script setup lang="ts">
import { SelectContent, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport } from "reka-ui"

defineProps<{
  modelValue?: string
  placeholder?: string
  label?: string
  options: Array<{ label: string; value: string }>
}>()
defineEmits<{ "update:modelValue": [v: string] }>()
</script>

<template>
  <label class="block">
    <span v-if="label" class="block text-label-sm text-black mb-1">{{ label }}</span>
    <SelectRoot :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event as string)">
      <SelectTrigger class="flex w-full items-center justify-between border-[3px] border-black bg-white px-3 py-2 text-body-md text-black data-[placeholder]:text-[#2d2d2d]/50">
        <SelectValue :placeholder="placeholder" />
        <Icon name="i-lucide-chevron-down" class="size-4 shrink-0" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent class="border-[3px] border-black bg-white neo-shadow z-50 min-w-[var(--reka-select-trigger-width)]">
          <SelectViewport class="p-1">
            <SelectItem
              v-for="o in options"
              :key="o.value"
              :value="o.value"
              class="flex items-center justify-between px-3 py-2 text-body-sm hover:bg-black hover:text-white data-[highlighted]:bg-black data-[highlighted]:text-white outline-none cursor-pointer"
            >
              <SelectItemText>{{ o.label }}</SelectItemText>
              <SelectItemIndicator><Icon name="i-lucide-check" class="size-3" /></SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </label>
</template>
