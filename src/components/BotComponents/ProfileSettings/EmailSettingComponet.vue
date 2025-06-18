<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import { useRoute, useRouter } from "vue-router";
import { ref, watch, computed } from "vue";
import instructionComponet from "../Identityverification/instructionComponet.vue";
import ProofofidentityComponet from "../Identityverification/ProofofidentityComponet.vue";
import ResetPasswordComponent from "@/components/BotComponents/ProfileSettings/ResetPasswordComponent.vue";
import ProofAddressComponet from "../Identityverification/ProofAddressComponet.vue";
const page = ref<string | null>(null);
const currentStep = ref(1); // 1 = Instructions, 2 = Proof Of Identity, 3 = Proof Of Address

// Watch route changes for the query parameter 'page'
const route = useRoute();
watch(
  computed(() => route),
  () => {
    const queryParams = new URLSearchParams(window.location.search);
    page.value = queryParams.get("page");
  },
  { deep: true }
);

// Method to move to the next step
const goToNextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};
</script>

<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6">
    <div class="col-span-12 sm:col-span-10 sm:col-start-2">
      <!-- Header / Steps Navigation -->
      <div class="flex flex-col lg:items-center lg:flex-row gap-y-2">
        <!-- Step 1 -->
        <div
          :class="['flex items-center group', { 'active': currentStep === 1 }]"
        >
          <div class="flex items-center">
            <div class="bg-white border rounded-full">
              <div class="flex items-center justify-center w-10 h-10">1</div>
            </div>
            <div class="ml-3.5 text-slate-500">Instructions</div>
          </div>
        </div>

        <!-- Step 2 -->
        <div
          :class="['flex items-center group', { 'active': currentStep === 2 }]"
        >
          <div class="flex items-center">
            <div class="bg-white border rounded-full">
              <div class="flex items-center justify-center w-10 h-10">2</div>
            </div>
            <div class="ml-3.5 text-slate-500">Proof Of Identity</div>
          </div>
        </div>

        <!-- Step 3 -->
        <div
          :class="['flex items-center group', { 'active': currentStep === 3 }]"
        >
          <div class="flex items-center">
            <div class="bg-white border rounded-full">
              <div class="flex items-center justify-center w-10 h-10">3</div>
            </div>
            <div class="ml-3.5 text-slate-500">Proof Of Address</div>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="mt-7">
        <!-- Show Instruction Component if on Step 1 -->
        <instructionComponet v-if="currentStep === 1" />

        <!-- Show Proof of Identity Component if on Step 2 -->
        <ProofofidentityComponet v-if="currentStep === 2" />

        <!-- Show Proof of Address Component if on Step 3 -->
        <ProofAddressComponet v-if="currentStep === 3" />
      </div>

      <!-- Step Navigation -->

      
      <div class="py-5 border-t border-slate-200/80">
        <div class="flex justify-end">
          <button
            class="px-6 py-2 text-white bg-primary rounded-lg"
            @click="goToNextStep"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional styling for step navigation */
.group.active .bg-primary {
  background-color: #3498db;
  color: white;
}
</style>
