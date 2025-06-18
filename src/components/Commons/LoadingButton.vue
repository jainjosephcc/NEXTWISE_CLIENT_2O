<script setup lang="ts">
import LoadingIcon from "@/components/Base/LoadingIcon"; // Ensure this path is correct

// Define props
defineProps({
  variant: {
    type: String,
    default: "primary", // Default button style
  },
  isLoading: {
    type: Boolean,
    default: false, // Loading state
  },
  customClass: {
    type: String,
    default: "w-24", // Default size/style
  },
});
</script>

<template>
  <button
      :class="`btn btn-${variant} ${customClass}`"
      :disabled="isLoading"
  >
    <template v-if="isLoading">
      <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
      Loading...
    </template>
    <template v-else>
      <slot>OK</slot>
    </template>
  </button>
</template>
