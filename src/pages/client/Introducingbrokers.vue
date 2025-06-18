<script setup lang="ts">
import { ref } from "vue";
import IbRequest from "@/components/BotComponents/IntroducingBrokers/ibRequest.vue";
import IbProfile from "@/components/BotComponents/IntroducingBrokers/ibProfile.vue";

const parsedData = ref(null);
const userData = localStorage.getItem('userData');

if (userData) {
  parsedData.value = JSON.parse(userData);
  // parsedData.value.is_ib = 2 // Parse the string to JSON
} else {
  console.error('No userData found in localStorage');
}


</script>

<template>
  <template v-if="!parsedData.is_ib || parsedData.is_ib === 1 || parsedData.is_ib == 0">
    <IbRequest />
  </template>
  <template v-else>
    <IbProfile />
  </template>


</template>
