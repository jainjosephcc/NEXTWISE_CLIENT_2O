<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../../services/apiService';

const tips = ref([]); // To hold the 5 tips from the API
const currentTipIndex = ref(0); // To track the current tip index
const currentTip = ref(null); // To hold the currently displayed tip
let tipInterval: ReturnType<typeof setInterval> | null = null;

// Fetch tips from the API
const fetchTips = async () => {
  try {
    const response = await apiClient.get('/web/stream-tips');
   // console.log(response.data);

    if (response.data.tips && response.data.tips.length > 0) {
      tips.value = response.data.tips; // Store the 5 tips
      currentTip.value = tips.value[currentTipIndex.value]; // Set the first tip to display
    }
  } catch (error) {
    console.error('Error fetching tips:', error);
  }
};

// Function to update the displayed tip every 10 seconds
const cycleTips = () => {
  if (tips.value.length > 0) {
    currentTipIndex.value = (currentTipIndex.value + 1) % tips.value.length; // Increment the index and loop back
    currentTip.value = tips.value[currentTipIndex.value]; // Update the current tip
  }
};

onMounted(() => {
  fetchTips(); // Fetch tips on component mount

  // Start the interval to cycle through tips every 10 seconds
  tipInterval = setInterval(cycleTips, 10000);
});

</script>

<template>
  <div class="p-5 mt-3.5 box box--stacked">
    <div class="relative">
      <div
          class="overflow-hidden rounded-lg h-52 image-fit before:block before:absolute before:w-full before:h-5/6 before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-transparent before:to-theme-2/70"
      >
      </div>
      <div class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2">
        <div v-if="currentTip" class="text-base uppercase text-white/90">
          {{ currentTip.title }}
        </div>
        <div v-if="currentTip" class="text-white p-2 text-center font-medium text-xl">
          {{ currentTip.tip }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
