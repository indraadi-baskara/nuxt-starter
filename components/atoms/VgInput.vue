<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
  label?: string
  error?: string
  type?: string
}>()
defineEmits<{ "update:modelValue": [v: string] }>()
</script>

<template>
  <label class="block">
    <span v-if="label" class="block text-label-sm text-black mb-1">{{ label }}</span>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full border-[3px] border-black bg-white px-3 py-2 text-body-md text-black placeholder:text-[#2d2d2d]/50 focus:outline-none focus:neo-shadow-ember"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="block text-body-sm text-error mt-1">{{ error }}</span>
  </label>
</template>
