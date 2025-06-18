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
    // Retrieve the dashboard data from localStorage
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
// account selection button click
function handleSelectedAccount(){
    isAccountSelectionTab.value=false
    isMethodSelectionTab.value=true
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
  
  dashboardData.pending_withdraw_count = 1; // Update pending_withdraw_count to 2
  

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
  if(parsedData.value.doc_verified!==3){
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

    <!--       STEP 1 STARTS   -->
    <!-- ACCOUNT SELECTION TAB FOR WITHDRAW  -->
    <template v-if="isAccountSelectionTab">
        <div class="flex items-center justify-center h-6">
            <div class="text-base font-medium">Select MT5 Account</div>
            <!-- <div class=" font-small">Select MT5 Account</div> -->
        </div>
        <div class="flex items-center justify-center h-6 mb-3 sm:mt-0 mt-5">
            <!-- <div class="text-base font-medium">Select MT5 Account</div> -->
            <div class=" font-small">Choose the account for your transaction.</div>
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
        </template>

        <div v-else class="flex flex-col items-center my-5 justify-end col-span-6 sm:col-span-3 xl:col-span-2">
            <LoadingIcon icon="bars" class="w-8 h-8" />
        </div>
        <EmptyStateComponent class="py-5" v-if="accountList.length < 0 && !loading" title="No accounts found." />
    </template>
    <!--       STEP 1 ENDS     -->


    <!--       STEP 2 STARTS   -->
    <!-- METHOD SELECTION TAB FOR WITHDRAW  -->
    <template v-if="isMethodSelectionTab">
        <div class="flex items-center justify-center h-6">
            <div class="text-base font-medium">Select Withdraw Method</div>
        </div>
        <div class="flex items-center justify-center h-6 mb-3 sm:mt-0 mt-5">
            <div class=" font-small">Choose one of the following withdraw methods.</div>
        </div>
          <div class="flex flex-wrap justify-around">
            <!-- Bank Card -->
            <Button 
                v-model="selectedWithdrawalType" 
                :value=1
                class="border-dashed mt-3 border-slate-300 ms-3 rounded-[0.8rem]" 
                :class="selectedWithdrawalType === 1 ? 'ring-primary ring-opacity-20 bg-slate-50' : ''" @click="handleMethodSelection(1)">
                <div class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem] from-theme-2/90 to-theme-1/[0.85]" 
                    :class="selectedWithdrawalType === 1 ? 'bg-gradient-to-r' : ''" >
                    <Lucide icon="Medal" class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
                    <div class="text-start pb-2">
                        <div class="mt-1.5 text-lg font-bold" :class="selectedWithdrawalType === 1 ? 'text-white' : ''">
                            Bank Withdrawal
                        </div>
                    </div>
                </div>
            </Button>

            <!-- USDT Card -->
            <Button 
                v-model="selectedWithdrawalType" 
                :value=3 
                class="border-dashed mt-3 border-slate-300 ms-3 rounded-[0.8rem]" 
                :class="selectedWithdrawalType === 3 ? 'ring-primary ring-opacity-20 bg-slate-50' : ''"
                @click="handleMethodSelection(3)">
                <div class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem] from-theme-2/90 to-theme-1/[0.85]" 
                    :class="selectedWithdrawalType === 3 ? 'bg-gradient-to-r' : ''"
                >
                    <Lucide icon="Medal" class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
                    <div class="text-start pb-2">
                        <div class="mt-1.5 text-lg font-bold" :class="selectedWithdrawalType === 3 ? 'text-white' : ''">
                            USDT Withdrawal
                        </div>
                    </div>
                </div>
            </Button>

            <!-- Others Card -->
            <Button 
                v-model="selectedWithdrawalType" 
                :value=4 
                class="border-dashed mt-3 border-slate-300 ms-3 rounded-[0.8rem]" 
                :class="selectedWithdrawalType === 4 ? 'ring-primary ring-opacity-20 bg-slate-50' : ''"
                @click="handleMethodSelection(4)">
                <div class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem] from-theme-2/90 to-theme-1/[0.85]" 
                    :class="selectedWithdrawalType === 4 ? 'bg-gradient-to-r' : ''"
                >
                    <Lucide icon="Medal" class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
                    <div class="text-start pb-2">
                        <div class="mt-1.5 text-lg font-bold" :class="selectedWithdrawalType === 4 ? 'text-white' : ''">
                            Other
                        </div>
                    </div>
                </div>
            </Button>
        </div>

        <!-- "Next" Button -->
        <div class="flex items-center justify-center h-6 mt-4 mb-4">
          <Button variant="secondary" class="w-full mt-6 border-gray-300 w-[120px] mr-4" @click="handleBack()">
            <Lucide icon="ArrowBigLeft" class="stroke-[1.3] w-4 h-4 mr-2" />
            Back
          </Button>
            <Button 
                variant="primary" 
                class="w-full mt-6 border-primary/50 w-[250px]" 
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
        <div class="flex items-center justify-center h-6">
            <div class="text-base font-medium">Withdraw Summary</div>
            <!-- <div class=" font-small">Select MT5 Account</div> -->
        </div>
        <div class="flex items-center justify-center h-6 mb-3 sm:mt-0 mt-5">
            <!-- <div class="text-base font-medium">Select MT5 Account</div> -->
            <div class=" font-small">Review your selections before proceeding.</div>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-3">
            <!-- Selected Account -->
            <div class="flex items-center justify-end font-medium">Selected Account :</div>
            <div class="flex items-center justify-start font-medium">MT{{ selectedAccountId }}</div>

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


              <!-- Amount in USD -->
            <div v-if="selectedWithdrawalType===1" class="flex items-center justify-end font-medium"> Select Bank :</div>
            <div v-if="selectedWithdrawalType === 1">
              
              <div v-if="bankList.length" class="flex flex-col items-start w-[120px] sm:w-[200px]">
                <select
                  id="bank"
                  v-model="selectedBank"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  :disabled="loading"
                >
                  <option value="" disabled>Select bank</option>
                  <option
                    v-for="bank in bankList"
                    :key="bank.id"
                    :value="bank.id"
                  >
                    {{ bank.account_no }}
                  </option>
                </select>
                <p v-if="loading" class="text-sm text-gray-500 mt-2">{{ $t('livemt5account.loadingLevreages') }}</p>
              </div>
            
              <!-- If bankList is empty, show the button to add bank details -->
              <div v-else class="flex items-center justify-start w-[120px] sm:w-[200px] mt-2">
                <router-link to="/settings?page=preferences">
                <Button variant="outlined"  :disabled="loading" class="w-full">Add Bank Details</Button>
              </router-link>
              </div>
            </div>

            <div v-if="selectedWithdrawalType === 3|| selectedWithdrawalType===4" class="flex items-center justify-end font-medium">Wallet ID :</div>
            <div v-if="selectedWithdrawalType === 3|| selectedWithdrawalType===4" class="flex items-center justify-start">
                <FormInput
                v-model="wallletId"
                type="text"
                class="block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80 w-[120px] sm:w-[200px]"
                />
              </div>
            <!-- Amount in selected currency -->
            <!-- <div class="flex items-center justify-end font-medium">Amount in selected currency :</div>
            <div class="flex items-center justify-start">
                <FormInput
                v-model="toUSD"
                type="text"
                class="block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80 w-[200px]"
                />
                
            </div> -->
            <!-- <div v-if="selectedWithdrawalType === 3" class="flex items-center justify-end font-medium">Add Attachment :</div>
            <div  v-if="selectedWithdrawalType === 3" class="flex items-center justify-start">
                <input
      id="file-upload"
      type="file"
      class="block px-1 py-3.5 rounded-[0.6rem] border-slate-300/80 w-[120px] sm:w-[200px]"
      @change="handleFileChange"
    />
                
            </div> -->
            <!-- </span> -->
        </div>
            
            <div class="flex items-center justify-center h-6 mt-4 mb-4">
              <Button variant="secondary" class="w-full mt-6 border-gray-300 w-[120px] mr-4" @click="handleBack()">
            <Lucide icon="ArrowBigLeft" class="stroke-[1.3] w-4 h-4 mr-2" />
            Back
          </Button>
                    <Button variant="primary" class="w-full mt-6 border-primary/50 w-[250px]" :disabled="amountInUSD===null||isBtnDisable" @click="handleProcessPayment">
                      <template v-if="isBtnLoading">
                            Processing
                            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                            </template>
                            <template v-else>
                            Process Withdraw
                            </template>
                    </Button>
                </div>
        <!-- Loading state -->
        <div v-if="loading" class="flex flex-col items-center my-5 justify-end col-span-6 sm:col-span-3 xl:col-span-2">
            <LoadingIcon icon="bars" class="w-8 h-8" />
        </div>
    </template>
 
    <!--       STEP 3 ENDS     -->
      
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

  <Dialog :open="pendingWithdrawalDialog" @close="handleRefresh">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
  <Lucide icon="AlertTriangle" class="w-16 h-16 mx-auto mt-3 text-yellow-500" />
  <div class="mt-5 text-2xl font-semibold text-yellow-600">Pending Withdrawal Request</div>
  <div class="mt-2 text-slate-500">
    You have a pending withdrawal request. Please complete or wait for it to be processed before proceeding.
  </div>
  <!-- <div class="px-5 pb-8 text-center">
    <Button type="button" variant="secondary" @click="handleRefresh" class="w-24">
      Refresh
    </Button>
  </div> -->
</div>

    </Dialog.Panel>
  </Dialog>


</template>