<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from "reka-ui"
defineProps<{ title?: string }>()
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/50 z-50" />
      <DialogContent class="fixed left-1/2 top-1/2 z-50 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 border-[3px] border-black bg-white neo-shadow-lg p-6">
        <div class="flex items-start justify-between gap-4 border-b-[3px] border-black pb-4 mb-4">
          <DialogTitle class="text-headline-sm text-black uppercase">{{ title }}</DialogTitle>
          <DialogClose class="border-2 border-black p-1 hover:bg-black hover:text-white"><Icon name="i-lucide-x" class="size-4" /></DialogClose>
        </div>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
