<script setup lang="ts">
import DemoIcons from "@/assets/images/paymentmethod/USDT-TRC20.png"
import mt5 from "@/assets/images/bot/mt5_lined.png";
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import {onMounted, ref, watch} from "vue";
import apiClient from "@/services/apiService.js";
import ShimmerLoaderRow from "@/components/Commons/ShimmerLoaderRow.vue";
import Lucide from "@/components/Base/Lucide";
import {FormInput} from "@/components/Base/Form";
import Dialog from "@/components/Base/Headless/Dialog/Dialog.vue";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { getS3Image } from "@/utils/S3.ts";
import TickerWidgetFxComponent from "@/components/Commons/TickerWidgetFxComponent.vue";
//  import Button from "@/components/Base/Button";
const cards = [
  {
    id: 24,
    title: 'Debit / Credit Card Payment',
    time: 'Instant - 30 mins',
    fee: '0%',
    min: '100 USD',
    icon: '/images/depo/a_01.png'
  },
  {
    id: 26,
    title: 'WIN-PAY USDT',
    time: 'Instant - 30 mins',
    fee: '0%',
    min: '10 USDT',
    icon: '/images/depo/b_01.png'
  },
  {
    id: 15,
    title: 'BTC',
    time: 'Instant - 30 minutes',
    fee: '0%',
    min: '0.0001 BTC',
    icon: '/images/depo/c_01.png'
  },
  {
    id: 16,
    title: 'Bank Transfer',
    time: 'Banking Hours',
    fee: '0%',
    min: '1500 INR',
    icon: '/images/depo/d_01.png'
  }
]
const options1 = [
  {
    label: "IB",
    items: [
      { img: DemoIcons, heading: "Bitcoin", tag: "ID : 12645", balances: "987654321", selected: false },
      { img: DemoIcons, heading: "Bitcoin", tag: "ID : 12645", balances: "987654321", selected: false },
      { img: DemoIcons, heading: "Bitcoin", tag: "ID : 12645", balances: "987654321", selected: false },
      { img: DemoIcons, heading: "Bitcoin", tag: "ID : 12645", balances: "987654321", selected: true },
    ]
  },
  {
    label: "Fiat Wallet",
    items: [
      { img: DemoIcons, heading: "Bitcoin", tag: "ID : 12645", balances: "987654321", selected: false },
      { img: DemoIcons, heading: "Bitcoin", tag: "ID : 12645", balances: "987654321", selected: false },
      { img: DemoIcons, heading: "Bitcoin", tag: "ID : 12645", balances: "987654321", selected: false },
    ]
  }
]

const options2 = [
  {
    items: [
      { img: DemoIcons, heading: "USDT", tag: "Tether", selected: false },
      { img: DemoIcons, heading: "BTC", tag: "Bitcoin", selected: true },
      { img: DemoIcons, heading: "DemoIcons", tag: "Indian Rupee", selected: false },
    ]
  }
]

const options3 = [
  {
    items: [
      { img: DemoIcons, heading: "Deposit With Bank Transfer", selected: false },
      { img: DemoIcons, heading: "Deposit With Bank Transfer", selected: false },
      { img: DemoIcons, heading: "Deposit With Bank Transfer", selected: false },
      { img: DemoIcons, heading: "Deposit With Bank Transfer", selected: true },
    ]
  }
]



const loading=ref(false);
const accountList = ref<Account[]>([]);
const clientData = ref<Client[]>([]);
const isAccountSelectionTab=ref(true)
const isMethodSelectionTab=ref(false)
const isPaymentSummaryTab=ref(false)
const amountInUSD=ref(null)
const bankList=ref<Account[]>([]);
const selectedBank=ref(null)
const wallletId=ref(null)
const successModalPreview = ref(false);
const errorModalVisible = ref(false);
const error = ref('');
const parsedData=ref(null);

const errorModalVisible1 = ref(false);
const errorMessage2 = ref('');
const errorTitle=ref('')
const pendingWithdrawalDialog=ref(false)
const userData = localStorage.getItem('userData');
if (userData) {
  parsedData.value = JSON.parse(userData);
} else {

}


const s3ImageUrl = ref<string | null>(null);

// assume that after you call your `/fund/withdraw/create` endpoint
// it returns `response.data.result.attachmentKey` — the S3 object key.
// you can adapt the watch source below to whatever reactive variable
// ends up holding that key.
const attachmentKey = ref<string | null>(null);

// whenever attachmentKey changes, fetch the signed URL
watch(
    attachmentKey,
    async (key) => {
      if (!key) return;
      // strip leading slash just like your other component
      const cleaned = key.replace(/^\/+/, "");
      try {
        s3ImageUrl.value = await getS3Image(cleaned);
      } catch (e) {
        console.error("Could not get signed URL", e);
      }
    },
    { immediate: true }
);
// Retrieve the dashboard data from localStorage
/*
const dashboardData = JSON.parse(localStorage.getItem("dashboardData"));

if (dashboardData && dashboardData.pending_withdraw_count !== undefined) {
  if (dashboardData.pending_withdraw_count > 0) {
    pendingWithdrawalDialog.value = true;

  } else {
    console.log("No multiple pending withdrawals found.");
  }
} else {
  console.error("Pending withdraw count not found in dashboard data.");
}
*/


// Fetch accounts from API
const fetchAccounts = async () => {
  loading.value=true;
  try {
    const response = await apiClient.get("/live-accounts/data-list");
    accountList.value = response.data.result.mt_data;
    clientData.value = response.data.result.ui_data;

  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally{
    loading.value = false; // Set loading to false after the API call
  }
};

// Fetch banks from API
const fetchBank = async () => {
  loading.value=true;
  try {
    const response = await apiClient.get("/profile/bank-list");
    bankList.value = response.data.result.bank_details;

  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally{
    loading.value = false; // Set loading to false after the API call
  }
};



onMounted(() => {
  fetchAccounts();
  fetchBank();

});

const selectedAccountId=ref(null)
const balance=ref(null)
function handleTabClick(account){
  selectedAccountId.value=account.mt_id
  balance.value=account.balance
}
const showStatusPop=ref(false)
function handleAccountCardClick(cards) {
  const userStatus = JSON.parse(localStorage.getItem("clientStatus") || "{}");
  // Check if the user is allowed to withdraw
  if (userStatus?.disable_withdraw === 0) {
    selectedAccountId.value = cards.mt_id;
    balance.value = cards.balance;
  } else {
    showStatusPop.value = true;
  }
}
  
  

// account selection button click
function handleSelectedAccount(){
   if(parsedData?.value?.doc_verified!==3){
     error.value="Your documents are not verified yet."
     errorModalVisible.value=true
   }
   else{
     isAccountSelectionTab.value=false
     isMethodSelectionTab.value=true
   }

 }


const toUSD = ref<string | null>(null);
const selectedWithdrawalType=ref(null)


const proof=ref(null)


function handleFileChange(event) {
  const file = event.target.files[0];  // Get the first file selected
  if (file) {
    proof.value = file;
  }
}

const isBtnLoading=ref(false)
// Function to send payment data to the API
async function sendPaymentData(formData) {

  try {
    isBtnLoading.value=true
    // Call the ticket creation API
    const response = await apiClient.post("/fund/withdraw/create", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    // You can handle success here, e.g., show success modal or close dialog
    successModalPreview.value = true;
    let dashboardData = JSON.parse(localStorage.getItem("dashboardData"));

// Check if dashboardData exists
    if (dashboardData) {
      // Update the values as needed

      //dashboardData.pending_withdraw_count = 1; // Update pending_withdraw_count to 2


      // Save the updated dashboardData back to localStorage
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));

    } else {
      console.error("No dashboardData found in localStorage.");
    }
    // closeDialog();
  } catch (error) {
    console.error("Error creating account:", error.response?.data || error);
    // Handle error, e.g., show error message
    error.value = error.response?.data?.message || "An unexpected error occurred. Please try again.";
    errorModalVisible.value = true;
  }
  finally{
    isBtnLoading.value=false
  }
}

function handleProcessPaymentPopup(){
  errorTitle.value=`Action Required: Contact Support`
  errorMessage2.value = `We are currently upgrading our transaction methods to enhance your experience. For assistance with deposits or withdrawals, please contact our support team. We appreciate your understanding and patience during this upgrade.`;
  errorModalVisible1.value = true; // Show the error modal
  return;
}


// Main function to handle payment process
function handleProcessPayment() {
  if(clientData.value.doc_verified!==3){
    error.value="Your documents are not verified yet."
    errorModalVisible.value=true
  }
  else{


    const formData = new FormData();
    formData.append('mt5id', selectedAccountId.value);
    formData.append('trans_amount', amountInUSD.value);
    formData.append('withdraw_method', selectedWithdrawalType.value);
    formData.append('bank_account', selectedBank.value);
    formData.append('is_wallet', false);
    formData.append('attachment', proof.value);
    formData.append('client_note', wallletId.value?wallletId.value:'');
    // Call the function to send payment data
    sendPaymentData(formData);
  }
}

function handleMethodSelection(value){
  selectedWithdrawalType.value=value
}

function handlSelectedMethod(){
  isMethodSelectionTab.value=false
  isPaymentSummaryTab.value=true
}
const errorMessage=ref('')
const isBtnDisable=ref(false)
watch(amountInUSD, (newValue) => {
  // Reset the error message initially
  errorMessage.value = '';
  isBtnDisable.value=false
  // Check if the amount is less than 50
  if (newValue < 10) {
    errorMessage.value = 'Minimum 10 to withdraw.';
    isBtnDisable.value=true
  }

  // Check if the balance is insufficient
  if (newValue > balance.value) {
    errorMessage.value = 'Balance not available.';
    isBtnDisable.value=true
  }
});
//handle back button
function handleBack() {
  if (isPaymentSummaryTab.value) {
    isPaymentSummaryTab.value = false;
    isMethodSelectionTab.value = true;
  } else if (isMethodSelectionTab.value) {
    isMethodSelectionTab.value = false;
    isAccountSelectionTab.value = true;
  }
}


function handleRefresh(){
  successModalPreview.value = false;
  window.location.reload();
}


</script>
<template>

  <div class="grid grid-cols-12 gap-y-10 mb-4">


    <div class="col-span-12">
      <TickerWidgetFxComponent/>
    </div>
  </div>

  <div class="bg-[#090909] text-white px-3">
    <div class="max-w-7xl mx-auto">
      <!-- Heading -->
      <h2 class="text-xl font-semibold py-10">Withdraw Funds</h2>

      <!--       STEP 1 STARTS   -->
      <!-- ACCOUNT SELECTION TAB FOR WITHDRAW  -->
      <template v-if="isAccountSelectionTab">
        <div class="flex items-center h-6">
          <div class="text-base font-medium">Select MT5 Account</div>
          <!-- <div class=" font-small">Select MT5 Account</div> -->
        </div>
        <div class="flex items-center h-6 mb-3 sm:mt-0 mt-5">
          <!-- <div class="text-base font-medium">Select MT5 Account</div> -->
          <div class=" font-small">Choose the account for your transaction.</div>
        </div>
        <template v-if="!loading">
          <template v-if="accountList.length > 0">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 px-3 sm:px-4 mt-4">
              <div
                  v-for="(account) in accountList"
                  :key="account.mt_id"
                  class="bg-gray-900 text-white p-5 md:p-6 rounded-xl shadow-md hover:shadow-blue-500/50 transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 flex flex-col justify-between"
                  :class="selectedAccountId === account.mt_id ? 'ring-2 ring-blue-400 bg-blue-900 text-black shadow-blue-500/50 border-2 border-blue-500  cursor-pointer border-blue-400' : ''"
              >
                <Button
                    class="border-dashed  border-slate-300 ms-3 rounded-[0.8rem] py-1 px-2 w-full "
                    @click="handleAccountCardClick(account)"

                >
                  <div class="space-y-2 text-sm md:text-base text-gray-300 px-2">
                    <!-- Top Row -->


                    <!-- Middle Row -->
                    <div class="flex items-center justify-between pe-4">
                      <img
                          v-if="!account.is_wallet"
                          src="/mt5_logo.png"
                          alt="MT5"
                          class="w-14 h-14"
                      />
                      <img v-else
                          src="/wallet_2.png"
                          alt="MT5"
                          class="w-14 h-14"
                      />
                      <div class="flex flex-col text-right ml-auto">
                        <span class="text-base text-[26px] font-semibold">
                          USD {{ account.balance }}
                        </span>
                        <span class="text-base text-[20px] font-normal pt-2">
                          {{ account.is_wallet==1?'WALLET':'MT'+account.mt_id }}
                        </span>
                      </div>

                    </div>

                    <!-- Bottom Info -->
                  </div>
                </Button>
              </div>
            </div>
            <Dialog :open="showStatusPop" @close="showStatusPop = false">
  <Dialog.Panel class="w-full max-w-md bg-[#1f1f1f] text-white rounded-lg p-6">
    <Dialog.Title class="text-lg font-semibold">Access Denied</Dialog.Title>
    <Dialog.Description class="mt-2">
      You are currently blocked from creating withdraw. Please contact support.
    </Dialog.Description>
    <div class="mt-4 text-right">
      <Button @click="showStatusPop = false">OK</Button>
    </div>
  </Dialog.Panel>
</Dialog>

            <!-- Render "Next" button only if accountList has items -->
            <div class="flex items-center justify-center h-6 mt-4 pb-20 pt-10">

              <Button  variant="primary" class="common-btn-item cbi-fill w-[250px]" @click="handleSelectedAccount()" :disabled="selectedAccountId===null||balance<=0">
                 <Lucide icon="ArrowBigRight" class="stroke-[1.3] w-4 h-6 mr-2" />
                NEXT
              </Button>
            </div>
          </template>
        </template>

        <div v-else class="flex flex-col items-center my-5 justify-end col-span-6 sm:col-span-3 xl:col-span-2">
          <LoadingIcon icon="bars" class="w-8 h-8" />
        </div>
        <EmptyStateComponent v-if="accountList.length <= 0 && !loading" :title="$t('emptyState.noLiveAccounts')"
                             :subtitle="$t('emptyState.createNewAccount')" class="mt-6 mb-6"/>
      </template>
      <div v-if="loading">
        <ShimmerLoaderRow/>
        <ShimmerLoaderRow/>
        <ShimmerLoaderRow/>
        <ShimmerLoaderRow/>
      </div>
      <!--       STEP 1 ENDS     -->


      <!--       STEP 2 STARTS   -->
      <!-- METHOD SELECTION TAB FOR WITHDRAW  -->
      <template v-if="isMethodSelectionTab">
        <div class="flex h-6">
          <div class="text-base font-medium">Select Withdraw Method</div>
        </div>
        <div class="flex h-6 mb-3 sm:mt-0 mt-5">
          <div class=" font-small">Choose one of the following withdraw methods.</div>
        </div>
        <div class="flex flex-wrap justify-around py-8">


          <Button
              v-model="selectedWithdrawalType"
              :value=5
              class="text-white bg-cyan-950 hover:bg-cyan-900 rounded-xl shadow-md hover:shadow-blue-500/50 transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-400 py-3 flex flex-col justify-between mb-3"
              :class="selectedWithdrawalType ===5 ? 'ring-2 ring-blue-400 bg-blue-900 text-black shadow-blue-500/50 border-2 border-blue-500  cursor-pointer border-blue-400' : ''"
              @click="handleMethodSelection(5)">
            <div class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem]">
              <div class="text-start pb-2">
                <div class="mt-1.5 text-lg font-bold px-10" :class="selectedWithdrawalType === 5 ? 'text-white' : ''">
                  USDT Withdrawal
                </div>
              </div>
            </div>
          </Button>


<!--          <Button
              v-model="selectedWithdrawalType"
              :value=4
              class="text-white bg-cyan-950 hover:bg-cyan-900 rounded-xl shadow-md hover:shadow-blue-500/50 transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-400 py-3 flex flex-col justify-between"
              :class="selectedWithdrawalType ===4 ? 'ring-2 ring-blue-400 bg-blue-900 text-black shadow-blue-500/50 border-2 border-blue-500  cursor-pointer border-blue-400' : ''"
              @click="handleMethodSelection(4)">
            <div class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem]">
              <div class="text-start pb-2">
                <div class="mt-1.5 text-lg font-bold px-10" :class="selectedWithdrawalType === 1 ? 'text-white' : ''">
                  Bank Withdrawal
                </div>
              </div>
            </div>
          </Button>-->


          <!-- Bank Card -->
          <Button
              v-model="selectedWithdrawalType"
              :value=1
              class="text-white bg-cyan-950 hover:bg-cyan-900 rounded-xl shadow-md hover:shadow-blue-500/50 transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-400 py-3 flex flex-col justify-between"
              :class="selectedWithdrawalType ===1 ? 'ring-2 ring-blue-400 bg-blue-900 text-black shadow-blue-500/50 border-2 border-blue-500  cursor-pointer border-blue-400' : ''"
              @click="handleMethodSelection(1)">
            <div class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem]">
              <div class="text-start pb-2">
                <div class="mt-1.5 text-lg font-bold px-10" :class="selectedWithdrawalType === 1 ? 'text-white' : ''">
                  Bank Withdrawal
                </div>
              </div>
            </div>
          </Button>

        </div>

        <!-- "Next" Button -->
        <div class="flex items-center justify-center mt-20 pb-20 gap-4">
          <Button variant="secondary" class="common-btn-item cbi-fill" @click="handleBack()">
            <Lucide icon="ArrowBigLeft" class="stroke-[1.3] w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
              variant="primary"
              class="common-btn-item cbi-fill"
              @click="handlSelectedMethod()"
              :disabled="selectedWithdrawalType === null"
          >
            <Lucide icon="ArrowBigRight" class="stroke-[1.3] w-4 h-4 mr-2" />
            Next
          </Button>
        </div>
      </template>

      <!--       STEP 2 ENDS     -->


      <!--       STEP 3 STARTS   -->
      <!-- WITHDRAW SUMMARY TAB FOR WITHDRAW  -->
      <template v-if="isPaymentSummaryTab">
        <div class="bg-[#090909] text-white px-4 pb-10">
          <div class="max-w-2xl mx-auto bg-[#111827] rounded-xl shadow-lg p-6">

            <!-- Headings -->
            <div class="text-center mb-2">
              <h2 class="text-xl font-semibold">Withdraw Summary</h2>
              <p class="text-sm text-gray-400 mt-1">Review your selections before proceeding.</p>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm sm:text-base">
              <!-- Selected Account -->
              <div class="font-medium text-right">Selected Account:</div>
              <div class="font-medium text-left">MT{{ selectedAccountId }}</div>

              <!-- Balance -->
              <div class="font-medium text-right">Balance:</div>
              <div class="font-medium text-left">
                $ {{ accountList.find(account => account.mt_id === selectedAccountId)?.balance }}
              </div>

              <!-- USD Input -->
              <div class="font-medium text-right">Amount in USD:</div>
              <div class="flex flex-col items-start">
                <FormInput
                    v-model="amountInUSD"
                    type="text"
                    placeholder="Enter amount"
                    class="block px-3 py-2 w-full sm:w-[300px] rounded-md bg-[#1f2937] border border-slate-600 text-white"
                />
                <span v-if="errorMessage" class="text-red-500 mt-1 text-xs">
            {{ errorMessage }}
          </span>
              </div>

              <!-- Conditional Bank Select -->
              <template v-if="selectedWithdrawalType === 1">
                <div class="font-medium text-right mt-2">Select Bank:</div>
                <div>
                  <div v-if="bankList.length" class="flex flex-col items-start">
                    <select
                        v-model="selectedBank"
                        class="w-full sm:w-[200px] mt-1 bg-[#1f2937] text-white border border-slate-600 rounded-md py-2 px-3"
                        :disabled="loading"
                    >
                      <option value="" disabled>Select bank</option>
                      <option v-for="bank in bankList" :key="bank.id" :value="bank.id">
                        {{ bank.account_no }}
                      </option>
                    </select>
                    <p v-if="loading" class="text-sm text-gray-400 mt-2">Loading banks...</p>
                  </div>
                  <div v-else class="mt-2">
                    <router-link to="/settings?page=preferences">
                      <Button variant="outlined" :disabled="loading" class="common-btn-item cbi-fill">
                        Add Bank Details
                      </Button>
                    </router-link>
                  </div>
                </div>
              </template>

              <!-- Wallet ID Input -->
              <template v-if="selectedWithdrawalType === 3 || selectedWithdrawalType === 5">
                <div class="font-medium text-right">Wallet ID:</div>
                <div>
                  <FormInput
                      v-model="wallletId"
                      type="text"
                      placeholder="Enter Wallet ID"
                      class="block px-3 py-2 w-full sm:w-[300px] rounded-md bg-[#1f2937] border border-slate-600 text-white"
                  />
                </div>
              </template>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 pb-6">
              <Button
                  variant="secondary"
                  class="common-btn-item cbi-fill"
                  @click="handleBack"
              >
                <Lucide icon="ArrowBigLeft" class="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                  variant="primary"
                  class="common-btn-item cbi-fill"
                  :disabled="amountInUSD === null || isBtnDisable"
                  @click="handleProcessPayment"
              >
                <template v-if="isBtnLoading">
                  Processing
                  <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                </template>
                <template v-else>
                  Process Withdraw
                </template>
              </Button>
            </div>

            <!-- Loader -->
            <div v-if="loading" class="flex justify-center mt-5">
              <LoadingIcon icon="bars" class="w-8 h-8" />
            </div>
          </div>
        </div>
      </template>

      <!--       STEP 3 ENDS     -->
    </div>
  </div>
  
  
    

  <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          Withdraw Ticket Created Successfully!
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
            type="button"
            variant="primary"
            @click="handleRefresh"
            class="w-24"
        >
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Error Modal-->
  <Dialog :open="errorModalVisible" @close="() => (errorModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-red-500" />
        <div class="mt-5 text-3xl font-semibold">Oops...</div>
        <div class="mt-2 text-slate-500">
          {{ error }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button
            type="button"
            variant="primary"
            @click="handleRefresh"
            class="w-24"
        >
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>


  <Dialog :open="errorModalVisible1" @close="() => (errorModalVisible1 = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="AlertCircleIcon" class="w-16 h-16 mx-auto mt-3 text-red-500" />
        <div class="mt-5 text-3xl font-semibold">{{ errorTitle }}</div>
        <div class="mt-2 text-slate-500">
          {{ errorMessage2 }}
        </div>
      </div>
      <div class="px-5 pb-3 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          Ok
        </Button>

      </div>

    </Dialog.Panel>
  </Dialog>

<!--  <Dialog :open="pendingWithdrawalDialog" @close="handleRefresh">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="AlertTriangle" class="w-16 h-16 mx-auto mt-3 text-yellow-500" />
        <div class="mt-5 text-2xl font-semibold text-yellow-600">Pending Withdrawal Request</div>
        <div class="mt-2 text-slate-500">
          You have a pending withdrawal request. Please complete or wait for it to be processed before proceeding.
        </div>
        &lt;!&ndash; <div class="px-5 pb-8 text-center">
          <Button type="button" variant="secondary" @click="handleRefresh" class="w-24">
            Refresh
          </Button>
        </div> &ndash;&gt;
      </div>

    </Dialog.Panel>
  </Dialog>-->
</template>

