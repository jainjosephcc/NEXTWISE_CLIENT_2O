<script setup lang="ts">
import { ref } from "vue";
const parsedData = ref(null);
</script>

<template>
  <div class="w-full min-h-screen">
    <h1 class="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Technical Analysis</h1>

    <!-- Responsive iframe wrapper -->
    <div class="w-full h-[80vh]">
      <iframe
          style='filter: invert(1);'
          class="w-full h-full rounded-lg border border-gray-200 border border-dashed"
          src="https://webapp.autochartist.com/componentcontainer/broker.php?broker_id=950&user=email&logintoken=874f64dbc91075ed8fe10444f152f92f&expire=1780178400&account_type=LIVE&locale=en_GB"
          title="Technical Analysis"
          frameborder="0"
          allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
