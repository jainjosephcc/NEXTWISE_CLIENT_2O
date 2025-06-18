<script setup lang="ts">
import { TabGroup as HeadlessTabGroup } feadlessui/vue";

export interface GroupProps
  extends /* @vue-ignore */ ExtractProps<typeof HeadlessTabGroup> {}

defineProps<GroupProps>();
</script>

<template>
  <HeadlessTabGroup as="div">
    <slot></slot>
  </HeadlessTabGroup>
</template>
