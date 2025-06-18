<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

// Define props with default values
const props = withDefaults(defineProps<{
  title?: string;  // Make title optional
  subtitle?: string;  // Make subtitle optional
}>(), {
  title: 'No data found !',  // Default title
  subtitle: ' '  // Default subtitle
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div>
      <div class="w-64 h-64 overflow-hidden image-fit border-slate-200/70">
        <img
            alt="Empty"
            src="/empty_state.png"
        />
      </div>
    </div>
    <div class="mt-3 text-base font-medium">
      {{ props.title }}
    </div>
    <div class="text-slate-500 mt-0.5">
      {{ props.subtitle }}
    </div>
  </div>
</template>

<style scoped>
</style>