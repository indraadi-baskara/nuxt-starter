<script setup lang="ts">
withDefaults(defineProps<{ hover?: boolean }>(), { hover: false })
</script>
<template>
  <div
    class="border-[3px] border-black bg-white neo-shadow"
    :class="hover ? 'brutist-interactive cursor-pointer' : ''"
  >
    <slot />
  </div>
</template>
