<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot, Label } from "reka-ui"
defineProps<{ modelValue?: boolean; label?: string; id?: string }>()
defineEmits<{ "update:modelValue": [v: boolean] }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <CheckboxRoot
      :id="id"
      :model-value="modelValue"
      class="size-5 shrink-0 border-[3px] border-black bg-white data-[state=checked]:bg-black flex items-center justify-center"
      @update:model-value="$emit('update:modelValue', $event as boolean)"
    >
      <CheckboxIndicator class="text-white flex items-center justify-center">
        <Icon name="i-lucide-check" class="size-3" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <Label v-if="label" :for="id" class="text-body-sm text-black cursor-pointer select-none">{{ label }}</Label>
  </div>
</template>
