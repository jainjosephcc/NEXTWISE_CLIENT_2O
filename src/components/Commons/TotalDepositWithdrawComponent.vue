<script setup lang="ts">

import Button from "@/components/Base/Button";
import Tippy from "@/components/Base/Tippy";
import Lucide from "@/components/Base/Lucide";
import {onMounted, ref} from "vue";
import apiClient from "../../services/apiService";



const totalDeposit = ref(0);
const totalWithdraw = ref(0);


const fetchSummary = async () => {
  try {
    const response = await apiClient.get("/dashboard");
    totalDeposit.value = response.data.result.total_deposit;
    totalWithdraw.value = response.data.result.total_withdraw;
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
};

// Fetch accounts on component mount
onMounted(fetchSummary);




</script>

<template>
  <div class="p-5 px-4 box box--stacked bg-gradient-dark" >
    <div>
      <div class="text-xl uppercase text-yellow-500"> {{ $t('dashboard.accountSummary')}} </div>
    </div>


    <div class="flex mt-3 flex-col">
      <div
          class=" flex items-center px-3.5"
      >
        <div class="w-full">



          <div class="flex items-center  whitespace-nowrap text-slate-500">
            {{ $t('dashboard.totalDeposit')}} 
            <Tippy as="div" content="Total Approved Deposit" class="ml-1.5">
              <Lucide icon="Info" class="w-3.5 h-3.5 text-slate-500/70" />
            </Tippy>
          </div>

          <div class="flex items-center justify-between mt-3 mb-2">
            <div class="text-lg font-medium">${{ totalDeposit.toFixed(2) }}</div>
            <router-link to="/create-deposit">
              <Button class="common-btn-item cbi-fill text-white">
                {{ $t('dashboard.makeDeposit')}}
              </Button>
            </router-link>
          </div>


        </div>
      </div>
      <div class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0">
        <div class="w-full">
          <div class="flex items-center text-slate-500 whitespace-nowrap">
            {{ $t('dashboard.totalWithdraw') }}
            <Tippy as="div" content="Total Approved Withdrawals" class="ml-1.5">
              <Lucide icon="Info" class="w-3.5 h-3.5 text-slate-500/70" />
            </Tippy>
          </div>

          <!-- Amount and Button Row -->
          <div class="flex items-center justify-between mt-3 mb-2">
            <div class="text-lg font-medium">${{ totalWithdraw.toFixed(2) }}</div>
            <router-link to="/create-withdraw">
              <Button class="common-btn-item cbi-fill text-white">
                {{ $t('dashboard.makeWithdrawal') }}
              </Button>
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>