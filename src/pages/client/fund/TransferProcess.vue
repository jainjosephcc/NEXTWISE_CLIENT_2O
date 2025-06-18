<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import { ref, onMounted, computed, watch ,provide} from "vue";
import mt5 from "@/assets/images/bot/mt5_lined.png";
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { FormInput, FormLabel } from "@/components/Base/Form";
import apiClient from "../../../services/apiService";
import { Dialog } from "@/components/Base/Headless";
import ShimmerLoaderRow from "@/components/Commons/ShimmerLoaderRow.vue";
import GradientButton from "@/components/Commons/GradientButton.vue";
import TickerWidgetFxComponent from "@/components/Commons/TickerWidgetFxComponent.vue";


const loading=ref(false)
const accountList = ref<Account[]>([]);
const isFromAccountSelectionTab=ref(true)
const isToAccountSelectionTab=ref(false)
const isPaymentSummary=ref(false)
const amountInUSD=ref(null)
const successModalPreview = ref(false);
const errorModalVisible = ref(false);
const errorMessage = ref('');
const isInternalTransferBlocked = ref(false);


// Fetch accounts from API
const fetchAccounts = async () => {
  loading.value=true;
  try {
    const response = await apiClient.get("/live-accounts/data-list");
    accountList.value = response.data.result.mt_data;

  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally{
    loading.value = false; // Set loading to false after the API call
  }
};


onMounted(() => {
  fetchAccounts();
  const status = JSON.parse(localStorage.getItem("clientStatus"));
  if (status?.disable_transfer === false) {
    isInternalTransferBlocked.value = true;
  }
});


const selectedAccountId=ref(null)
const balance=ref(null)
const selectedAccount=ref([])
const showStatusPop = ref(false);
function handleTabClick(account){
  
  const userStatus = JSON.parse(localStorage.getItem("clientStatus") || "{}");

  if (userStatus?.disable_transfer === 0) {
    
    selectedAccount.value=account
  selectedAccountId.value=account.mt_id
  balance.value=account.balance
  } else {
    showStatusPop.value = true;
  }
}
const toAccountList= ref([]);
// account selection button click
function handleSelectedAccount() {
  if (isInternalTransferBlocked.value) {
    return; // Block navigation if client is disabled
  }

  toAccountList.value = accountList.value.filter(
    account => account.mt_id !== selectedAccountId.value
  );
  isFromAccountSelectionTab.value = false;
  isToAccountSelectionTab.value = true;
}


const isBtnLoading=ref(false)
function validateSelectedFromAccount(selectedAccount) {
  if (!selectedAccount) {
    errorMessage.value = 'Please select FROM account.';
    errorModalVisible.value = true; // Show error modal
    return false;
  } else if (selectedAccount.margin_free - selectedAccount.credit <= 0) {
    errorMessage.value = 'Please select an account with Balance greater than Zero.';
    errorModalVisible.value = true; // Show error modal
    return false;
  } else {
    // Clear error message if the validation passes
    errorMessage.value = '';
    errorModalVisible.value = false;
    return true;
  }
}

function validateSelectedToAccount(newValue) {
  if (!newValue) {
    errorMessage.value = 'Please select To account';
    errorModalVisible.value = true; // Show error modal
    return false;
  } else {
    errorMessage.value = '';
    return true;
  }
}

function validateTransferAmount(newValue, selectedAccount) {
  if (newValue < 1) {
    errorMessage.value = 'Please enter an amount greater than Zero';
    errorModalVisible.value = true; // Show error modal
    return false;
  } else if (newValue > selectedAccount.margin_free - selectedAccount.credit) {
    errorMessage.value = 'You don\'t have enough balance in the selected account';
    errorModalVisible.value = true; // Show error modal
    return false;
  } else {
    errorMessage.value = '';
    return true;
  }
}

function validateData() {
  if (
      validateSelectedFromAccount(selectedAccount.value) &&
      validateSelectedToAccount(selectedToAccountId.value) &&
      validateTransferAmount(amountInUSD.value, selectedAccount.value)
  ) {
    sendPaymentData()
    // Proceed with further logic
  } else {
    // If any validation fails, do not proceed and show the error modal.
    console.error('Validation failed');
  }
}

// Function to send payment data to the API
async function sendPaymentData() {
  try {
    isBtnLoading.value = true; // Start button loading indicator

    // Construct the request body as a JSON object
    const body = {
      from_account: selectedAccountId.value,
      to_account: selectedToAccountId.value,
      amount: amountInUSD.value,
    };

    // Call the ticket creation API
    const response = await apiClient.post("/fund/transfer/create", body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle success, e.g., show success modal or close dialog
    successModalPreview.value = true;
    // closeDialog(); // Uncomment if you want to close a dialog after success
  } catch (error) {
    console.error("Error creating account:", error.response?.data || error);

    // Handle error, e.g., show error message
    errorMessage.value = error.response?.data?.message || "An unexpected error occurred. Please try again.";
    errorModalVisible.value = true;
  } finally {
    isBtnLoading.value = false; // Stop button loading indicator
  }
}

function handleRefresh(){
  successModalPreview.value = false;
  window.location.reload();
}
const selectedToAccountId=ref(null)
function handleToAccountBtn(account){
  selectedToAccountId.value=account.mt_id
}

function handleSelectedToAccount(){
  isPaymentSummary.value=true;
  isToAccountSelectionTab.value=false;
}

function handleBackToFromAccount(){
  isPaymentSummary.value=false;
  isToAccountSelectionTab.value=false;
  isFromAccountSelectionTab.value=true;
}

const isBtnDisable=ref(false)
watch(amountInUSD, (newValue) => {
  // Reset the error message initially
  errorMessage.value = '';
  isBtnDisable.value=false

  // Check if the balance is insufficient
  if (newValue > balance.value) {
    errorMessage.value = 'Balance not available.';
    isBtnDisable.value=true
  }
});
</script>
<template>

  <div class="grid grid-cols-12 gap-y-10 mb-4">


    <div class="col-span-12">
      <TickerWidgetFxComponent/>
    </div>
  </div>

  <div class="container mx-auto px-4 pb-16 md:pb-25 pt-8">
    <div class="bg-[#090909] text-white">
      <div class="max-w-3xl mx-auto space-y-6">


        <div class="bg-[#111827] px-6 py-3 rounded-lg ">
          <h3 class="text-md text-gray-300 mt-2">Select Accounts</h3>
          <div class="flex items-center justify-between">
            <span class="text-white text-[19px] font-semibold">Process Internal Transfer</span>
            <img src="/arrows.png" class="h-14"/>
          </div>
        </div>
        



        <!-- BANK SCREEN 2-->
<!--        <div class="bg-[#111827] p-6 rounded-lg">
          &lt;!&ndash; Heading &ndash;&gt;
          <h3 class="text-lg font-semibold mb-4">Fill your payment details</h3>

          &lt;!&ndash; Minimum Deposit &ndash;&gt;
          <div class="bg-[#1f2937] text-md text-gray-300 px-4 py-3 rounded-lg mb-6">
            Minimum Deposit: <span class="text-white font-semibold">1500 INR</span>
          </div>

          &lt;!&ndash; Form Fields &ndash;&gt;
          <div class="grid sm:grid-cols-2 gap-6">
            &lt;!&ndash; MT5 Account Dropdown &ndash;&gt;
            <div>
              <label class="block text-md mb-1">MT5 Accounts</label>
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
              <p v-if="errors.account" class="text-red-500 text-md mt-1">{{ errors.account }}</p>

            </div>

            &lt;!&ndash; Amount Field &ndash;&gt;
            <div>
              <label class="block text-md text-gray-400 mb-1">Amount</label>
              <div class="relative">
                <input v-model="inrAmount" type="number" placeholder="Enter amount"
                       class="w-full bg-[#1f2937] text-white border border-gray-700 rounded-lg px-4 py-2 pl-14"/>
                <div class="absolute top-2.5 left-4 text-gray-400">INR</div>
              </div>
              <p v-if="errors.amount" class="text-red-500 text-md mt-1">{{ errors.amount }}</p>
            </div>

            &lt;!&ndash; USD Conversion Display &ndash;&gt;
            <div>
              <label class="block text-md text-gray-400 mb-1">
                <div class="text-md text-gray-400">Conversion <b>83.7 INR = 1 USD</b></div>
              </label>
              <div class="bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2">
                <div class="mt-1 text-white">USD <span class="font-bold">{{ inrToUsdAmount }}</span></div>
              </div>
            </div>

            &lt;!&ndash; TXID &ndash;&gt;
            <div>
              <label class="block text-md text-gray-400 mb-1">UTR ID</label>
              <input v-model="txid" type="text" placeholder="Enter UTR ID"
                     class="w-full bg-[#1f2937] text-white border border-gray-700 rounded-lg px-4 py-2"/>

            </div>
          </div>

          &lt;!&ndash; Upload Screenshot &ndash;&gt;

          <div class="mt-6 pb-5">
            &lt;!&ndash; Label &ndash;&gt;
            <label class="block text-md text-gray-400 mb-2">Payment Screenshot</label>

            &lt;!&ndash; Upload Box &ndash;&gt;
            <label
                for="IdProoffileupload"
                class="w-full rounded-lg py-6 text-center cursor-pointer bg-red-600 hover:bg-red-700 transition"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
            >
              <div class="rounded-lg border-2 border-dashed py-10">
                <div class="flex flex-col items-center justify-center text-gray-400 max-w-xs mx-auto pt-5">

                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 sm:h-10 sm:w-10" fill="none"
                       viewBox="0 0 25 25" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                  </svg>
                  <p class="text-md text-center mt-5">
                    Drag and drop your screenshot(s) or
                    <span class="text-blue-400 underline">Browse</span>
                  </p>
                  <p class="text-xs sm:text-md text-gray-500">JPEG, PNG, JPG · 3MB per file</p>
                </div>
              </div>

            </label>

            &lt;!&ndash; File Input (Hidden) &ndash;&gt;
            <input
                hidden
                type="file"
                id="IdProoffileupload"
                name="IdProoffileupload[]"
                accept="image/jpeg, image/png, image/jpg"
                @change="handleFileSelect"
            />

            &lt;!&ndash; Validation Error &ndash;&gt;
            <p v-if="errors.selectedFiles" class="text-md text-red-500 mt-2">{{ errors.selectedFiles }}</p>


          </div>

        </div>-->


        <div class="bg-[#111827] p-6 rounded-lg">
        <!--       STEP 1 STARTS   -->
        <!-- SELECT FROM ACCOUNT TAB FOR INTERNAL TRANSFER  -->
        <template v-if="isFromAccountSelectionTab">
          <div class="bg-[#111827] px-2 py-2 rounded-lg ">
            <div class="flex items-center justify-between">
              <span class="text-white text-[19px] font-semibold">Select From Account</span>
            </div>
            <h3 class="text-md text-gray-300 pt-3">Choose the account from which you need to make a transfer. </h3>
          </div>


          <template v-if="!loading">
            <template v-if="accountList.length > 0">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-4 px-3 sm:px-4 mt-4">
                <div
                    v-for="(account) in accountList"
                    :key="account.mt_id"
                    @click="handleTabClick(account)"
                    class="bg-gray-900 text-white rounded-xl shadow-md hover:shadow-blue-500/50 transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 flex flex-col justify-between"
                    :class="selectedAccountId === account.mt_id ? 'ring-2 ring-blue-400 bg-blue-900 text-black shadow-blue-500/50 border-2 border-blue-500  cursor-pointer border-blue-400' : ''"
                >
                    <div class="space-y-2 text-md md:text-base text-gray-300 px-2 py-3">
                      <!-- Middle Row -->
                      <div class="flex items-center justify-between pe-1">
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
                        <span class="text-base text-[22px]">
                          $ {{ account.balance }}
                        </span>
                          <span class="text-base text-[20px] font-normal pt-2">
                          {{ account.is_wallet==1?'WALLET':'MT'+account.mt_id }}
                        </span>
                        </div>

                      </div>

                      <!-- Bottom Info -->
                    </div>

                </div>
              </div>


              <!-- Render "Next" button only if accountList has items -->
              <div class="flex items-center justify-center h-6 mt-4 pb-20 pt-10">
                <Button class="common-btn-item cbi-fill" @click="handleSelectedAccount()" :disabled="selectedAccountId===null||balance<=0">
                  <Lucide icon="ArrowBigRight" class="stroke-[1.3] w-4 h-6 mr-2" />
                  NEXT
                </Button>
              </div>
            </template>
          </template>


          <!-- Loading state -->
          <div v-if="loading">
            <ShimmerLoaderRow/>
            <ShimmerLoaderRow/>
          </div>
        </template>
        <!--       STEP 1 ENDS     -->


<!--          Select From Account
          Choose the account from which you need to make a transfer.-->


        <!--       STEP 2 STARTS   -->
        <!-- SELECT TO ACCOUNT TAB FOR INTERNAL TRANSFER  -->
        <template v-if="isToAccountSelectionTab">
          <div class="bg-[#111827] px-2 py-2 rounded-lg ">
            <div class="flex items-center justify-between">
              <span class="text-white text-[19px] font-semibold">Select To Account</span>
            </div>
            <h3 class="text-md text-gray-300 pt-3">Choose the account from which you need to make a transfer.</h3>
          </div>
          <template v-if="!loading">
            <template v-if="toAccountList.length > 0">

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-4 px-3 sm:px-4 mt-4">
                <div
                    v-for="(toaccount) in toAccountList"
                    :key="toaccount.mt_id"
                    @click="handleToAccountBtn(toaccount)"
                    class="bg-gray-900 text-white rounded-xl shadow-md hover:shadow-blue-500/50 transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 flex flex-col justify-between"
                    :class="selectedToAccountId === toaccount.mt_id ? 'ring-2 ring-blue-400 bg-blue-900 text-black shadow-blue-500/50 border-2 border-blue-500  cursor-pointer border-blue-400' : ''"
                >
                  <div class="space-y-2 text-md md:text-base text-gray-300 px-2 py-3">
                    <!-- Middle Row -->
                    <div class="flex items-center justify-between pe-1">
                      <img
                          v-if="!toaccount.is_wallet"
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
                        <span class="text-base text-[22px]">
                          $ {{ toaccount.balance }}
                        </span>
                        <span class="text-base text-[20px] font-normal pt-2">
                          {{ toaccount.is_wallet==1?'WALLET':'MT'+toaccount.mt_id }}
                        </span>
                      </div>

                    </div>

                    <!-- Bottom Info -->
                  </div>

                </div>
              </div>
              <!-- Render "Next" button only if accountList has items -->
              <div class="flex items-center justify-center h-6 mt-8 pt-5 mb-10">
                <Button variant="primary" class="common-btn-item cbi-fill text-white mr-3" @click="handleBackToFromAccount()">
                  <Lucide icon="ArrowBigLeft" class="stroke-[1.3] w-4 h-4 mr-2" />
                  BACK
                </Button>

                <Button variant="primary" class="common-btn-item cbi-fill text-white" @click="handleSelectedToAccount()" :disabled="selectedToAccountId===null">
                  <Lucide icon="ArrowBigRight" class="stroke-[1.3] w-4 h-4 mr-2" />
                  NEXT
                </Button>
              </div>
            </template>

            <!-- Render empty state if accountList is empty -->
            <EmptyStateComponent class="py-5" v-else title="No accounts found." />
          </template>

          <!-- Loading state -->
          <div v-if="loading" class="flex flex-col items-center my-5 justify-end col-span-6 sm:col-span-3 xl:col-span-2">
            <LoadingIcon icon="bars" class="w-8 h-8" />
          </div>
        </template>
        <!--       STEP 2 ENDS     -->




        <!--       STEP 3 STARTS   -->
        <!-- PAYMENT SUMMARY FOR INTERNAL TRANSFER  -->
          <template v-if="isPaymentSummary">
            <div class="flex items-center justify-center">
              <div class="w-full sm:w-[400px] bg-[#090909] rounded-lg shadow-lg p-6 border border-gray-200">

                <div class="text-center mb-6">
                  <h2 class="text-2xl font-bold text-gray-100">Transaction Summary</h2>
                  <p class="text-md text-gray-200 mt-1">Review your selections below</p>
                </div>

                <div class="border-t border-gray-300 my-4"></div>

                <div class="space-y-4 text-md text-gray-700">

                  <!-- From Account -->
                  <div class="flex justify-between">
                    <span class="font-medium text-gray-400 text-[16px]">From Account</span>
                    <span class="font-semibold text-gray-400 text-[16px]">MT{{ selectedAccountId }}</span>
                  </div>

                  <!-- To Account -->
                  <div class="flex justify-between mt-6">
                    <span class="font-medium text-gray-400 text-[16px]">To Account</span>
                    <span class="font-semibold text-gray-400 text-[16px]">MT{{ selectedToAccountId }}</span>
                  </div>

                  <!-- Balance -->
                  <div class="flex justify-between mt-6">
                    <span class="font-medium text-gray-400 text-[16px]">Available Balance</span>
                    <span class="font-semibold text-gray-400 text-[16px]">
            ${{ accountList.find(account => account.mt_id === selectedAccountId)?.balance || '0.00' }}
          </span>
                  </div>

                  <!-- Amount In USD -->
                  <div class="flex justify-between items-center mt-6">
                    <span class="font-medium text-gray-400 text-[16px]">Amount in USD</span>
                    <div class="flex flex-col items-end">
                      <FormInput
                          v-model="amountInUSD"
                          type="text"
                          class="px-2 py-2 w-32 text-right text-[16px] text-gray-100 border rounded-md border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
                          placeholder="Enter amount"
                      />
                      <span v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</span>
                    </div>
                  </div>

                </div>

                <div class="border-t border-gray-200 my-6"></div>

<!--                <div class="flex justify-between mt-6">
                  <Button variant="primary" class="flex items-center px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600" @click="handleBackToFromAccount()">
                    <Lucide icon="ArrowBigLeft" class="w-4 h-4 mr-2" />
                    BACK
                  </Button>

                  <Button variant="primary" :disabled="selectedToAccountId===null" class="flex items-center px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600" @click="handleSelectedToAccount()">
                    NEXT
                    <Lucide icon="ArrowBigRight" class="w-4 h-4 ml-2" />
                  </Button>
                </div>-->

                <div class="flex justify-center mt-6">
                  <Button
                      variant="primary"
                      class="w-full py-3 rounded-lg  common-btn-item cbi-fill text-white font-semibold text-md transition"
                      :disabled="amountInUSD === null || isBtnDisable||isBtnLoading"
                      @click="validateData"
                  >
                    <template v-if="isBtnLoading">
                      Processing
                      <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                    </template>
                    <template v-else>
                      Process Transfer
                    </template>
                  </Button>
                </div>

              </div>
            </div>

            <div v-if="loading" class="flex flex-col items-center my-5">
              <LoadingIcon icon="bars" class="w-8 h-8" />
            </div>
          </template>

          <!--       STEP 3  ENDS     -->
        </div>

      </div>
    </div>
  </div>

<Dialog :open="showStatusPop" @close="showStatusPop = false">
  <Dialog.Panel class="w-full max-w-md bg-[#1f1f1f] text-white rounded-lg p-6">
    <Dialog.Title class="text-lg font-semibold">Access Denied</Dialog.Title>
    <Dialog.Description class="mt-2">
      You are currently blocked from using internal transfers. Please contact support.
    </Dialog.Description>
    <div class="mt-4 text-right">
      <Button @click="showStatusPop = false">OK</Button>
    </div>
  </Dialog.Panel>
</Dialog>
  <!-- Success Modal -->

  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success"/>
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          Internal Transfer Processed !
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

  <Dialog :open="errorModalVisible" @close="() => (errorModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-red-500"/>
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

<!--
  <Dialog :open="errorModalVisible1" @close="() => (errorModalVisible1 = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="AlertCircleIcon" class="w-16 h-16 mx-auto mt-3 text-red-500"/>
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
-->

</template>

