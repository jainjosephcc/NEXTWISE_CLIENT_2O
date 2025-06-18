<script setup lang="ts">

import apiClient from "../../services/apiService";
import { onMounted, ref, defineEmits } from "vue";
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import Lucide from "@/components/Base/Lucide";
import LoadingIcon from "@/components/Base/LoadingIcon";

const totalWalletDeposit = ref(0);
const walletCreated = ref(null)
const total_deposit = ref(0)
const errorModalVisible = ref(false);
const errorMessage = ref('');
const errorTitle = ref('')
const isBtnLoading = ref(false);
const successModalPreview = ref(false);
const loading = ref(false)


const fetchSummary = async () => {
  loading.value = true
  try {
    const response = await apiClient.get("/dashboard");
    localStorage.setItem("dashboardData", JSON.stringify(response.data.result));
    totalWalletDeposit.value = response.data.result.wallet_balance;
    walletCreated.value = response.data.result.wallet_created;
    total_deposit.value = response.data.result.total_deposit
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally {
    loading.value = false
  }
};

// Fetch accounts on component mount
onMounted(fetchSummary);

async function handleWalletActivate() {
  if (total_deposit.value <= 0) {
    errorModalVisible.value = true;
    errorTitle.value = "Wallet Activation Pending";
    errorMessage.value = "Please make an initial deposit to activate your wallet and start enjoying our services.";
  } else {
    try {
      isBtnLoading.value = true; // Set loading state to true

      // Call the API to activate the wallet
      const response = await apiClient.post("/live-account/activate-wallet");
      

      // ✅ Ensure the API response is valid and successful
      if (response?.data?.status === true) {
        successModalPreview.value = true; // Show success modal

     

      } else {
        throw new Error(response?.data?.message || "Unexpected API response");
      }

    } catch (error) {
      // ✅ Ensure error handling only occurs when an actual error happens
      console.error("Error activating wallet:", error.response?.data || error.message);

      errorMessage.value =
          error.response?.data?.message || "An unexpected error occurred. Please try again.";
      errorModalVisible.value = true; // Show error modal
    } finally {
      isBtnLoading.value = false; // Ensure button loading state is reset
    }
  }
}


function handleRefresh() {
  errorModalVisible.value = false;
  successModalPreview.value = false;
  window.location.reload();
}

// Close the modal
const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <div class="p-5 box box--stacked px-4 bg-gradient-dark">
    <div class="flex flex-col overflow-hidden pb-4">
      <div
        class=" flex items-center px-3.5 py-2.5">

        <div class="w-full">

          <div class="flex items-center w-full mt-1.5">
            <div class="mr-2.5">
              <div class="p-0.5  cursor-pointer w-20 h-20 "><img src="/wallet_2.png" alt="Paperbot">

              </div>
            </div>
            <span class="w-full px-0 text-base font-medium bg-transparent border-0 shadow-none focus:ring-0">
              <option value="bitcoin">{{ $t('wallet.myWallet').toUpperCase() }}</option>
            </span>
          </div>
        </div>
      </div>
      <div
        class="flex items-center justify-between px-3.5 py-2.5">
        <div v-if="walletCreated === 0" class="flex items-center">
          <Button class="bg-gradient-to-r from-[#f1b926] to-[#d93d18] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center cbi-fill"
            @click="handleWalletActivate()">
            <template v-if="isBtnLoading">
              {{ $t('wallet.activating') }}
              <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
            </template>
            <template v-else>
              {{ $t('wallet.activateWallet') }}
            </template>
          </Button>
        </div>


        <div v-else class="w-full">
          <div class="flex items-center text-slate-500 whitespace-nowrap">
            {{ $t('wallet.balancE') }}
          </div>
          <div class="relative mt-1">
            <div class="flex items-center justify-between">
              <div v-if="!loading" class="text-lg font-medium">
                ${{ totalWalletDeposit.toFixed(2) }}
              </div>
              <div v-else class="flex flex-col items-center my-5 justify-end col-span-6 sm:col-span-3 xl:col-span-2">
                <LoadingIcon icon="bars" class="w-8 h-8" />
              </div>
              <router-link v-if="!loading" to="/create-deposit">
        <span class="ml-3 h-6 flex items-center px-2 py-0.5 text-xs bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center cbi-fill text-white">
          {{ $t('wallet.fundNow') }}
        </span>
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>


  <!-- Sucess Modal  -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">{{ $t('wallet.goodjob') }}</div>
        <div class="mt-2 text-slate-500">
          {{ $t('wallet.walletsuccess') }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          {{ $t('identityVerification.ok') }}
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Error Message Modal -->
  <Dialog :open="errorModalVisible" @close="() => (errorModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-red-500" />
        <div class="mt-5 text-3xl font-semibold">{{ errorTitle }}</div>
        <div class="mt-2 text-slate-500">
          {{ errorMessage }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          {{ $t('identityVerification.ok') }}
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>

<style scoped></style>