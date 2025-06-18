<script setup lang="ts">
import { TabPanels as HeadlessTabPanels } feadlessui/vue";

export interface PanelsProps
  extends /* @vue-ignore */ ExtractProps<typeof HeadlessTabPanels> {}

defineProps<PanelsProps>();
</script>

<template>
  <HeadlessTabPanels as="div">
    <slot></slot>
  </HeadlessTabPanels>
</template>
