<template>
  <div class="col-span-12 mt-5 md:ml-10">
      <div class="iframe-container" :style="{ height: iframeHeight + 'px' }">
        <iframe
            :src="iframeUrl"
            frameborder="0"
            width="100%"
            height="100%"
            allowfullscreen
        ></iframe>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mt5Id = ref<string | null>(null);
const iframeHeight = ref(window.innerHeight - 100); // initial guess (-100px for navbar/header)

onMounted(() => {
  mt5Id.value = route.query.mt5_id as string || null;
  console.log('Received MT5 ID:', mt5Id.value);

  // Adjust iframe height on mount
  calculateIframeHeight();

  // Update iframe height on window resize (for mobile rotate etc)
  window.addEventListener("resize", calculateIframeHeight);
});

// Create iframe URL dynamically
const iframeUrl = computed(() => {
  const loginId = mt5Id.value || "10000";
  return `https://webtrading.airrsanfx.com/terminal?utm_source=www.airrsanfx.com&mode=connect&lang=en&theme-mode=1&theme=blueRed&login=${loginId}`;
});

// Function to calculate iframe height
const calculateIframeHeight = () => {
  const headerHeight = 100; // adjust if your header height is different
  iframeHeight.value = window.innerHeight - headerHeight;
};
</script>

<style scoped>
.iframe-container {
  width: 100%;
  overflow: hidden; /* No scroll inside iframe */
}
.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
