<script setup>
import LoadingIcon from "@/components/Base/LoadingIcon";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultText: {
    type: String,
    default: 'SUBMIT',
  },
  loadingText: {
    type: String,
    default: 'LOADING',
  },
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}
</script>

<template>
  <button
      :disabled="disabled || loading"
      variant="primary"
      rounded
      class="common-btn-item cbi-fill"
      style="width: 100%;"
      @click="onClick"
  >
    <template v-if="loading">
      {{ loadingText }}
      <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
    </template>
    <template v-else>
      {{ defaultText }}
    </template>
  </button>
</template>
