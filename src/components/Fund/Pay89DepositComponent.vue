<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import Button from "@/components/Base/Button";
import apiClient from "@/services/apiService";
import ShimmerLoaderRow from "@/components/Commons/ShimmerLoaderRow.vue";
import GradientButton from "@/components/Commons/GradientButton.vue";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";

// Props
defineProps<{
  selectedPaymentMethod: number;
  accountList: Array<{
    mt_id: string | number;
    mt_category: string;
    is_wallet: number;
  }>;
}>();


const emit = defineEmits(["close"]);

function handleRefresh() {
  successModalVisible.value = false;
  window.location.reload();
}


// Refs and state
const successModalVisible = ref(false);
const errorModalVisible = ref(false);
const errorMessage = ref("");
const selectedCurrencyCode = ref('');
const selectedRcode = ref('');
const selectedSid = ref('');
const selectedRateUsd = ref('');
const minDeposit = ref('');
const baseAmount = ref('');
const usdAmount = ref<number | null>(null);
const selectedMtId = ref('');
const currencies = ref([]);
const currencyLoading = ref(false);
const isSubmitBtnLoading = ref(false);
const paymentFormHtml = ref('');
const isWaitingForRedirect = ref(false);

const errors = ref({
  account: null,
  amount: null,
  selectedFiles: null
});

watch(selectedCurrencyCode, (newCode) => {
  const selected = currencies.value.data.find(c => c.code === newCode);
  if (selected) {
    selectedRcode.value = selected.rcode;
    selectedSid.value = selected.sid;
    minDeposit.value = selected.min_amount;
    selectedRateUsd.value = selected.rate_usd;
  } else {
    selectedRcode.value = '';
    selectedSid.value = '';
    minDeposit.value = '';
    selectedRateUsd.value = '';
  }
});

watch(baseAmount, (val) => {
  if (val !== null && !isNaN(val)) {
    usdAmount.value = parseFloat((val * selectedRateUsd.value).toFixed(2));
  } else {
    usdAmount.value = null;
  }
});

const fetchCurrencies = async () => {
  currencyLoading.value = true;
  try {
    const response = await apiClient.get("/fund/currency-list-vn");
    currencies.value = response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
  } finally {
    currencyLoading.value = false;
  }
};

onMounted(() => {
  fetchCurrencies();
});

const closeDialog = () => {
  emit("close");
};

const validateAndContinue = async () => {
  errors.value.account = null;
  errors.value.amount = null;
  isSubmitBtnLoading.value = true;

  if (!selectedMtId.value) {
    errors.value.account = "Please select an MT5 account.";
  }

  if (!usdAmount.value || parseFloat(baseAmount.value) < parseFloat(minDeposit.value)) {
    errors.value.amount = "Minimum deposit is " + minDeposit.value + " " + selectedCurrencyCode.value;
  }

  const userData = localStorage.getItem('userData');
  const parsedData = userData ? JSON.parse(userData) : null;

  if (!errors.value.account && !errors.value.amount && parsedData) {
    const payload = {
      sid: selectedSid.value,
      rcode: selectedRcode.value,
      tx_action: 'PAYMENT',
      payby: 'p2p',
      firstname: parsedData?.client_name,
      item_quantity: 1,
      item_name: selectedMtId.value,
      item_no: '1',
      item_desc: selectedMtId.value,
      item_amount_unit: baseAmount.value,
      tid: selectedMtId.value + 'WOU' + Date.now(),
      wid: 32,
      user_id: parsedData?.id
    };

    try {
      const response = await apiClient.post("/checkout-url-pay89-payment", payload);
      paymentFormHtml.value = response.data.data;
      isWaitingForRedirect.value = true;

      // ✅ Parse and auto-submit manually since Vue won't run <script> in v-html
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.data.data;

      const form = tempDiv.querySelector("form") as HTMLFormElement;

      if (form) {
        document.body.appendChild(form); // Make sure it's part of the DOM
        form.submit(); // Trigger actual redirect
      } else {
        console.error("Payment form not found in the response.");
      }

      // Optional fallback timeout
      setTimeout(() => {
        isWaitingForRedirect.value = false;
      }, 6000);

    } catch (error) {
      console.error("Error creating account:", error.response?.data || error);
      errorMessage.value = error.response?.data?.message || "An unexpected error occurred. Please try again.";
      errorModalVisible.value = true;
    } finally {
      isSubmitBtnLoading.value = false;
    }

  } else {
    isSubmitBtnLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-[#111827] p-6 rounded-lg" style="margin-top: -30px;">


    <!-- Card Icons -->
    <div class="flex flex-wrap justify-between gap-4 mb-4">
      <div class="w-[70px] h-[40px] bg-white rounded-lg flex items-center justify-center">
        <img class="h-8" src="https://flagcdn.com/w160/th.png" alt="Visa"/>
      </div>
      <div class="w-[70px] h-[40px] bg-white rounded-lg flex items-center justify-center">
        <img class="h-8" src="https://flagcdn.com/w160/vn.png" alt="Amex"/>
      </div>
      <div class="w-[70px] h-[40px] bg-white rounded-lg flex items-center justify-center">
        <img class="h-8" src="https://flagcdn.com/w160/id.png" alt="Mastercard"/>
      </div>
      <div class="w-[70px] h-[40px] bg-white rounded-lg flex items-center justify-center">
        <img class="h-8" src="https://flagcdn.com/w160/my.png" alt="Maestro"/>
      </div>
      <div class="w-[70px] h-[40px] bg-white rounded-lg flex items-center justify-center">
        <img class="h-8" src="https://flagcdn.com/w160/ph.png" alt="Cirrus"/>
      </div>
      <div class="w-[70px] h-[40px] bg-white rounded-lg flex items-center justify-center">
        <img class="h-8" src="https://flagcdn.com/w160/bd.png" alt="Skrill"/>
      </div>
    </div>

    <div v-if="!currencyLoading">

      <h3 class="text-white font-semibold mb-4 pt-4">Fill your payment details</h3>
      <!-- Account & Amount -->
      <div class="grid sm:grid-cols-2 gap-4 mb-4 pt-2">
        <div>
          <label class="block text-sm mb-1">MT5 Accounts</label>
          <div class="relative">
            <select
                v-model="selectedMtId"
                class="w-full bg-[#1f2937] text-white border rounded-lg"
                :class="errors.account ? 'border-red-500' : 'border-gray-700'"
            >
              <option disabled value="">Select Account</option>
              <option v-for="account in accountList" :key="account.mt_id" :value="account.mt_id">
                {{ account.is_wallet == 1 ? 'WALLET' : `${account.mt_id} - ${account.mt_category}` }}
              </option>
            </select>
            <div class="absolute top-2.5 right-3 text-gray-400 pointer-events-none">▼</div>
          </div>
          <p v-if="errors.account" class="text-red-500 text-sm mt-1">{{ errors.account }}</p>

        </div>
        <div>
          <label class="block text-sm mb-1 text-white">Select Currency</label>
          <div class="relative">
            <select
                v-model="selectedCurrencyCode"
                class="w-full bg-[#1f2937] text-white border px-4 py-2 rounded-lg"
                :class="errors.currency ? 'border-red-500' : 'border-gray-700'"
            >
              <option disabled value="">Select Currency</option>
              <option
                  v-for="currency in currencies.data"
                  :key="currency.code"
                  :value="currency.code"
              >
                {{ currency.name }} ({{ currency.code }})
              </option>
            </select>
            <div class="absolute top-2.5 right-3 text-gray-400 pointer-events-none">▼</div>
          </div>
          <p v-if="errors.currency" class="text-red-500 text-sm mt-1">{{ errors.currency }}</p>
        </div>
      </div>


      <div v-if="selectedCurrencyCode!=''" class="grid sm:grid-cols-2 gap-4 mb-4 pt-2">
        <div>
          <label class="block text-sm mb-1">Amount in {{selectedCurrencyCode}}</label>
          <div class="relative">
            <input
                v-model="baseAmount"
                type="number"
                placeholder="Enter amount"
                class="w-full bg-[#1f2937] text-white border px-4 py-2 pl-14 rounded-lg"
                :class="errors.amount ? 'border-red-500' : 'border-gray-700'"
            />
            <div class="absolute top-2.5 left-4 text-gray-400">{{selectedCurrencyCode}}</div>
          </div>
          <p v-if="errors.amount" class="text-red-500 text-sm mt-1">{{ errors.amount }}</p>

        </div>
        <div>
          <div>
            <div class="text-sm text-gray-400 mb-1">1 {{selectedCurrencyCode}} =  {{selectedRateUsd}} USD</div>
            <div class="relative">
              <input
                  v-model="usdAmount"
                  type="number"
                  readonly
                  placeholder="Amount in USD"
                  class="w-full bg-[#1f2937] text-white border px-4 py-2 pl-14 rounded-lg"
                  :class="errors.amount ? 'border-red-500' : 'border-gray-700'"
              />
              <div class="absolute top-2.5 left-2 text-gray-400 right-3 pr-5">USD</div>
            </div>

          </div>
        </div>
      </div>





      <!-- Preset Amounts -->
<!--      <div class="flex flex-wrap gap-3 mb-4">
        <button @click="usdAmount = 100"
                class="bg-[#1f2937] px-4 py-2 rounded-full text-white hover:bg-blue-600 transition">$100
        </button>
        <button @click="usdAmount = 500"
                class="bg-[#1f2937] px-4 py-2 rounded-full text-white hover:bg-blue-600 transition">$500
        </button>
        <button @click="usdAmount = 1000"
                class="bg-[#1f2937] px-4 py-2 rounded-full text-white hover:bg-blue-600 transition">$1000
        </button>
        <button @click="usdAmount = 5000"
                class="bg-[#1f2937] px-4 py-2 rounded-full text-white hover:bg-blue-600 transition">$5000
        </button>
        <button @click="usdAmount = 10000"
                class="bg-[#1f2937] px-4 py-2 rounded-full text-white hover:bg-blue-600 transition">$10000
        </button>

      </div>-->


      <div v-if="selectedCurrencyCode!=''">

        <!-- Minimum Deposit -->
        <div v-if="selectedCurrencyCode!=''" class="text-sm text-gray-400 mt-2 items-end ">
          Minimum Deposit: <span class="font-semibold text-white">{{minDeposit}} {{selectedCurrencyCode}}</span>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mb-4 pt-2">
          <div>
          </div>
          <GradientButton
              :loading="isSubmitBtnLoading"
              :disabled="isSubmitBtnLoading"
              default-text="CREATE DEPOSIT"
              loading-text="Saving..."
              @click="validateAndContinue"
          />
        </div>
      </div>

    </div>
    <div v-else>
      <ShimmerLoaderRow/>
      <ShimmerLoaderRow/>
      <ShimmerLoaderRow/>

    </div>

    <!-- Injected Payment Form from Pay89 -->

    <!-- Fallback in case auto-submit fails -->
    <div v-if="isWaitingForRedirect" class="mt-6 text-center text-white">
      <div class="text-sm mb-2 animate-pulse">Redirecting to payment gateway...</div>
      <div class="text-xs text-gray-400">
        If nothing happens,
        <span class="underline cursor-pointer" @click="validateAndContinue">click here</span> to try again.
      </div>
    </div>



  </div>



  <!-- Success Modal -->
  <Dialog :open="successModalVisible" @close="() => (successModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success"/>
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          Live Account Created Successfully!
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Error Modal-->
  <Dialog :open="errorModalVisible" @close="() => (errorModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-red-500"/>
        <div class="mt-5 text-3xl font-semibold">Oops...</div>
        <div class="mt-2 text-slate-500">
          {{ errorMessage }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>