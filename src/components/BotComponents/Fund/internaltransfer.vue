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


const loading=ref(false)
const accountList = ref<Account[]>([]);
const isFromAccountSelectionTab=ref(true)
const isToAccountSelectionTab=ref(false)
const isPaymentSummary=ref(false)
const amountInUSD=ref(null)
const successModalPreview = ref(false);
const errorModalVisible = ref(false);
const errorMessage = ref('');


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
  
});

const selectedAccountId=ref(null)
const balance=ref(null)
const selectedAccount=ref([])
function handleTabClick(account){
  selectedAccount.value=account
    selectedAccountId.value=account.mt_id
    balance.value=account.balance
}
const toAccountList= ref([]);
// account selection button click
function handleSelectedAccount(){
  toAccountList.value = accountList.value.filter(account => account.mt_id !== selectedAccountId.value);
    isFromAccountSelectionTab.value=false
    isToAccountSelectionTab.value=true
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

    <!--       STEP 1 STARTS   -->
    <!-- SELECT FROM ACCOUNT TAB FOR INTERNAL TRANSFER  -->
    <template v-if="isFromAccountSelectionTab">
        <div class="flex items-center justify-center h-6">
            <div class="text-base font-medium">Select From Account</div>
            <!-- <div class=" font-small">Select MT5 Account</div> -->
        </div>
        <div class="flex items-center justify-center h-6 mb-3 sm:mt-0 mt-5">
            <!-- <div class="text-base font-medium">Select MT5 Account</div> -->
            <div class=" font-small">Choose the account from which you need to make a transfer.</div>
        </div>
        <template v-if="!loading">
            <template v-if="accountList.length > 0">
                <template v-for="(account) in accountList" :key="account.mt_id">
                    <Button class="border-dashed mt-3 border-slate-300 ms-3 rounded-[0.8rem] w-[120px] sm:w-[150px] py-0.5 px-1.5" 
                        :class="selectedAccountId === account.mt_id ? 'border-slate-300 ms-3 rounded-[0.8rem] ring-primary ring-opacity-20 bg-slate-50' : ''" 
                        @click="handleTabClick(account)">
                        <div class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem] from-theme-2/90 to-theme-1/[0.85]" 
                            :class="selectedAccountId === account.mt_id ? 'bg-gradient-to-r' : ''">
                            
                            <div class="flex items-center justify-between w-full">
                              <img  v-if="!account.is_wallet" :src="mt5" alt="icon" class="w-7 h-7" />
                              <img v-else src="/wallet.webp" alt="Paperbot" class="w-7 h-7">
                                <span class="text-lg" :class="selectedAccountId === account.mt_id ? 'text-white' : ''">
                                    $ {{ account.balance }}
                                </span>
                            </div>

                            <Lucide icon="Medal" class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
                            <div class="text-start pb-2">
                                <div class="mt-1.5 text-lg font-bold" :class="selectedAccountId === account.mt_id ? 'text-white' : ''">
                                  <span v-if="!account.is_wallet">{{ account.mt_id }}</span>
                                  <span v-else>WALLET</span>
                                </div>
                            </div>
                        </div>
                    </Button>
                </template>

                <!-- Render "Next" button only if accountList has items -->
                <div class="flex items-center justify-center h-6 mt-4 mb-4">
                    <Button variant="primary" class="w-full mt-6 border-primary/50 w-[250px]" @click="handleSelectedAccount()" :disabled="selectedAccountId===null">
                        <Lucide icon="ArrowBigRight" class="stroke-[1.3] w-4 h-4 mr-2" />
                        Next
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
    <!--       STEP 1 ENDS     -->


    <!--       STEP 2 STARTS   -->
    <!-- SELECT TO ACCOUNT TAB FOR INTERNAL TRANSFER  -->
    <template v-if="isToAccountSelectionTab">
        <div class="flex items-center justify-center h-6">
            <div class="text-base font-medium">Select To Account</div>
            <!-- <div class=" font-small">Select MT5 Account</div> -->
        </div>
        <div class="flex items-center justify-center h-6 mb-3 sm:mt-0 mt-5">
            <!-- <div class="text-base font-medium">Select MT5 Account</div> -->
            <div class=" font-small">Choose the account from which you need to make a transfer.</div>
        </div>
        <template v-if="!loading">
            <template v-if="toAccountList.length > 0">
                <template v-for="(toaccount) in toAccountList" :key="toaccount.mt_id">
                    <Button class="border-dashed mt-3 border-slate-300 ms-3 rounded-[0.8rem] w-[120px] sm:w-[150px] py-0.5 px-1.5" 
                        :class="selectedToAccountId === toaccount.mt_id ? 'border-slate-300 ms-3 rounded-[0.8rem] ring-primary ring-opacity-20 bg-slate-50' : ''" 
                        @click="handleToAccountBtn(toaccount)">
                        <div class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem] from-theme-2/90 to-theme-1/[0.85]" 
                            :class="selectedToAccountId === toaccount.mt_id ? 'bg-gradient-to-r' : ''">
                            
                            <div class="flex items-center justify-between w-full">
                              <img  v-if="!toaccount.is_wallet" :src="mt5" alt="icon" class="w-7 h-7" />
                              <img v-else src="/wallet.webp" alt="Paperbot" class="w-7 h-7">                                <span class="text-lg" :class="selectedToAccountId === toaccount.mt_id ? 'text-white' : ''">
                                    $ {{ toaccount.balance }}
                                </span>
                            </div>

                            <Lucide icon="Medal" class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
                            <div class="text-start pb-2">
                              <div class="mt-1.5 text-lg font-bold" :class="selectedAccountId === toaccount.mt_id ? 'text-white' : ''">
                                  <span v-if="!toaccount.is_wallet">{{ toaccount.mt_id }}</span>
                                  <span v-else>WALLET</span>
                                </div>
                            </div>
                        </div>
                    </Button>
                </template>

                <!-- Render "Next" button only if accountList has items -->
                <div class="flex items-center justify-center h-6 mt-4 mb-4">
                    <Button variant="primary" class="w-full mt-6 border-primary/50 w-[250px]" @click="handleSelectedToAccount()" :disabled="selectedToAccountId===null">
                        <Lucide icon="ArrowBigRight" class="stroke-[1.3] w-4 h-4 mr-2" />
                        Next
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
        <div class="flex items-center justify-center h-6">
            <div class="text-base font-medium">Payment Summary</div>
            <!-- <div class=" font-small">Select MT5 Account</div> -->
        </div>
        <div class="flex items-center justify-center h-6 mb-3 sm:mt-0 mt-5">
            <!-- <div class="text-base font-medium">Select MT5 Account</div> -->
            <div class=" font-small">Review your selections before proceeding.</div>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-3">
            <!-- Selected Account -->
            <div class="flex items-center justify-end font-medium">From Account :</div>
            <div class="flex items-center justify-start font-medium">MT{{ selectedAccountId }}</div>

            <div class="flex items-center justify-end font-medium">To Account :</div>
            <div class="flex items-center justify-start font-medium">MT{{ selectedToAccountId }}</div>

            <!-- Payment Method -->
            <div class="flex items-center justify-end font-medium">Balance :</div>
            <div class="flex items-center justify-start font-medium">
               $ {{ accountList.find(account => account.mt_id === selectedAccountId)?.balance }}
            </div>

            <!-- Amount in USD -->
            <div class="flex items-center justify-end font-medium">Amount in USD :</div>
              <div class="flex flex-col items-start">
                  <FormInput
                      v-model="amountInUSD"
                      type="text"
                      class="block px-1 py-3.5 rounded-[0.6rem] border-slate-300/80 w-[120px] sm:w-[200px]"
                  />
                  <span v-if="errorMessage" class="text-red-500 mt-1 text-sm">
                      {{ errorMessage }}
                  </span>
              </div>

        </div>
            
            <div class="flex items-center justify-center h-6 mt-4 mb-4">
                    <Button variant="primary" class="w-full mt-6 border-primary/50 w-[250px]" :disabled="amountInUSD===null||isBtnDisable" @click="validateData">
                        <template v-if="isBtnLoading">
                            Processing
                            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                            </template>
                            <template v-else>
                            Process Transfer
                            </template>
                    </Button>
                </div>

  

        <!-- </div> -->


        

            <!-- Render empty state if accountList is empty -->
            <!-- <EmptyStateComponent class="py-5" v-else title="No accounts found." /> -->
        <!-- </template> -->

        <!-- Loading state -->
        <div v-if="loading" class="flex flex-col items-center my-5 justify-end col-span-6 sm:col-span-3 xl:col-span-2">
            <LoadingIcon icon="bars" class="w-8 h-8" />
        </div>
    </template>
   <!--       STEP 3  ENDS     -->

   <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          Transfer Ticket Created Successfully!
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
        {{ errorMessage }}
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


    </template>