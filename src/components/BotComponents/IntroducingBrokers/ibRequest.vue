<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import { ref } from "vue";
import _ from "lodash";
import apiClient from "../../../services/apiService";
import { Dialog } from "@/components/Base/Headless";
import LoadingIcon from "@/components/Base/LoadingIcon";

const isBtnLoading = ref(false)
const successModalPreview = ref(false)
const errorModalVisible = ref(false)
const errorMessage = ref(null)
const projectName = import.meta.env.VITE_PROJECT_NAME;

const parsedData = ref(null);
const userData = localStorage.getItem('userData');
if (userData) {
  parsedData.value = JSON.parse(userData); // Parse the string to JSON
} else {
  console.error('No userData found in localStorage');
}

async function requestIBStatus() {
  try {
    isBtnLoading.value = true;

    // Make the API request
    const response = await apiClient.post(
      '/profile/request-ib',
      {
        client_id: parsedData.value?.id,
      },
      {
        headers: {
          'Content-Type': 'application/json', // Use 'application/json' unless multipart/form-data is needed
        },
      }
    );

    successModalPreview.value = true;
    // Update the is_ib property
    parsedData.value.is_ib = 1;

    // Save the updated object back to localStorage
    localStorage.setItem('userData', JSON.stringify(parsedData.value));
  } catch (error) {
    console.error('Error creating account:', error.response?.data || error);
    errorMessage.value =
      error.response?.data?.message || 'An unexpected error occurred. Please try again.';
    errorModalVisible.value = true;
  } finally {
    isBtnLoading.value = false;
  }
}

function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}
</script>

<template>
  <div class="px-4 sm:px-6 py-6">
    <div class="max-w-5xl mx-auto">
      <div class="bg-slate-900 rounded-xl shadow-sm p-5 sm:p-8">
        <div class="text-center mb-6">
          <h2 class="text-lg sm:text-2xl font-bold text-white">
            Become an Introducing Broker With {{ projectName }}
          </h2>
        </div>

        <div class="border-t border-slate-200/80 my-4 sm:my-6"></div>

        <div class="text-center mb-6 text-sm sm:text-base text-slate-300">
          Join our Introducing Broker (IB) program and unlock the potential to grow your
          business and increase your revenue. As a valued partner, you’ll gain access to our
          world-class trading technology, dedicated support, and competitive compensation structures.
        </div>

        <div class="text-sm sm:text-base font-semibold mb-2 text-slate-100">Benefits of Being an Introducing Broker:</div>
        <ul class="list-disc list-inside space-y-2 text-slate-200 pl-4">
          <li>
            <span class="font-bold">Attractive Rebates:</span> Earn competitive rebates and commissions on the
            trading activity of clients you introduce.
          </li>
          <li>
            <span class="font-bold">Marketing Support:</span> Access a wide range of marketing materials and tools
            designed to help you attract and retain clients.
          </li>
          <li>
            <span class="font-bold">Dedicated Manager:</span> Receive personal support from a dedicated account
            manager who understands your business.
          </li>
          <li>
            <span class="font-bold">Transparent Reporting:</span> Use our robust reporting tools to track your
            success and optimize your strategies.
          </li>
        </ul>

        <div class="mt-6 text-sm sm:text-base font-semibold text-slate-100">How to Become an Introducing Broker?</div>
        <div class="mt-2 text-sm text-slate-300">
          Starting as an Introducing Broker with {{ projectName }} is simple. Follow these steps:
        </div>
        <ol class="list-decimal list-inside space-y-1 text-sm text-slate-300 pl-4 mt-2">
          <li>Place a request</li>
          <li>Receive confirmation and your unique IB link</li>
          <li>Start promoting {{ projectName }} and earn as your referrals trade!</li>
        </ol>

        <div class="mt-6 flex flex-col items-center justify-center">
          <Button
              v-if="parsedData.is_ib === 0 || !parsedData.is_ib"
              variant="primary"
              class="w-full sm:w-[300px] mt-4"
              @click="requestIBStatus"
          >
            <template v-if="!isBtnLoading">
              Enroll to Become Introducing Broker
            </template>
            <template v-else>
              Enrolling
              <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
            </template>
          </Button>

          <div
              v-if="parsedData.is_ib == 1"
              class="flex items-center mt-4 px-4 py-2 font-medium border rounded-full border-green-400 bg-green-100 text-green-800 text-sm"
          >
            <div class="w-2 h-2 mr-2 rounded-full border border-green-500 bg-green-500"></div>
            IB Request Awaiting Approval
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto text-success" />
        <div class="mt-5 text-2xl sm:text-3xl font-semibold">Good job!</div>
        <div class="mt-2 text-gray-600">IB Requested Successfully!</div>
      </div>
      <div class="text-center mt-4">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">Ok</Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Error Modal -->
  <Dialog :open="errorModalVisible" @close="() => (errorModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto text-red-500" />
        <div class="mt-5 text-2xl sm:text-3xl font-semibold">Oops...</div>
        <div class="mt-2 text-gray-600">{{ errorMessage }}</div>
      </div>
      <div class="text-center mt-4">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">Ok</Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>

