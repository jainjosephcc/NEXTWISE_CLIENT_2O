<script setup lang="ts">

import _ from "lodash";
import Lucide from "@/components/Base/Lucide";
import CreateLiveAccountDialog from "@/components/BotComponents/Dialog/CreateLiveAccountDialog.vue";
import { defineProps, defineEmits, ref, onMounted ,computed } from "vue";
import apiClient from "../../services/apiService";
import mt5 from "@/assets/images/bot/mt5_lined.png";
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Button from "@/components/Base/Button";

import Shimmer from "vue3-loading-shimmer";
import ShimmerLoaderRow from "@/components/Commons/ShimmerLoaderRow.vue";


interface Account {
  mt_id: number;
  mt_category: string;
  leverage: number;
}

// Dialog visibility state
const isShowAddNewAccountVisible = ref(false);

// Account list state
const accountList = ref<Account[]>([]);
const loading=ref(true);

// Fetch accounts from API
const fetchAccounts = async () => {
  loading.value=true;
  try {
    const response = await apiClient.get("/live-accounts/list");
    accountList.value = response.data.result.mt_data.filter(account => account.is_wallet === 0);
    console.log(response);
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally {
    loading.value = false; // Set loading to false after the API call
  }
};

// Fetch accounts on component mount
onMounted(fetchAccounts);

// Chunk the accounts into rows of 3
const chunkedAccountList = computed(() => {
  const chunkSize = 3;
  const chunks: Account[][] = [];
  for (let i = 0; i < accountList.value.length; i += chunkSize) {
    chunks.push(accountList.value.slice(i, i + chunkSize));
  }
  return chunks;
});

// Close the dialog
const closeDialog = () => {
  isShowAddNewAccountVisible.value = false;
};
</script>
<template>
  <div>
    <div class="p-4 sm:p-5 box box--stacked min-h-[16rem] h-auto bg-gradient-dark">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center">
        <div class="text-lg sm:text-xl uppercase text-yellow-500">
          {{ $t('livemt5account.liveMT5account') }}
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3.5 mt-3 lg:mt-0 lg:ml-auto flex-wrap">
          <div
              @click="isShowAddNewAccountVisible = true"
              class="bg-gradient-to-r from-[#f1b926] to-[#d93d18] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center"
          >
            <Lucide icon="Plus" class="w-5 h-5 stroke-[1.3]" />
            <div class="ml-1.5 underline decoration-dotted decoration-slate-300 underline-offset-[3px]">
              {{ $t('livemt5account.addnewAccount') }}
            </div>
          </div>

          <router-link
              to="/live-account-info"
              class="bg-gradient-to-r from-[#f1b926] to-[#d93d18] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-sm hover:brightness-110 hover:scale-80 transition duration-300 flex items-center justify-center"
          >
            <Lucide icon="ExternalLink" class="w-5 h-5 stroke-[1.3]" />
            <div class="ml-1.5 underline decoration-dotted decoration-slate-300 underline-offset-[3px]">
              {{ $t('livemt5account.showfullReport') }}
            </div>
          </router-link>
        </div>
      </div>

      <!-- Accounts Grid -->
      <div v-if="chunkedAccountList.length > 0 && !loading">
        <div
            v-for="(row, rowIndex) in chunkedAccountList"
            :key="rowIndex"
            class="py-3"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 sm:px-4">
            <div
                v-for="account in row"
                :key="account.mt_id"
                class="bg-gradient-to-r from-[#000000] to-[#442702] text-white rounded-lg p-4 shadow-md transition-all duration-200 mt-5
         border border-transparent hover:border-yellow-400 hover:shadow-[0_0_16px_4px_rgba(255,215,0,0.5)]"
            >
              <router-link to="/live-account-info" class="block">
                <div class="flex justify-between items-center">
                  <img
                      v-if="!account.is_wallet"
                      src="/mt_lined.svg"
                      alt="MT5"
                      class="w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <span class="text-xl sm:text-xl font-medium truncate text-white">
        MT{{ account.mt_id }}
      </span>
                </div>
              </router-link>
            </div>

          </div>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyStateComponent
          v-else-if="!chunkedAccountList.length && !loading"
          class="py-8"
          title="No Live Accounts."
      />

      <!-- Loading State -->
      <ShimmerLoaderRow v-if="loading" class="mt-5" />
    </div>

    <!-- Add Account Dialog -->
    <CreateLiveAccountDialog
        :open="isShowAddNewAccountVisible"
        :accountList="accountList"
        @close="isShowAddNewAccountVisible = false"
    />
  </div>
</template>


