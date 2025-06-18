<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import { ref, onMounted, computed, watch, provide } from "vue";
import mt5 from "@/assets/images/bot/mt5_lined.png";
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { FormInput, FormLabel } from "@/components/Base/Form";
import apiClient from "../../../services/apiService";
import { Dialog } from "@/components/Base/Headless";
import IdentityVerification from "@/components/BotComponents/ProfileSettings/IdentityVerification.vue";
import ViewIdentityComponet from "../ProfileSettings/ViewIdentityComponet.vue";

const loading = ref(false)
const accountList = ref<Account[]>([]);
const isAccountSelectionTab = ref(true)
const iscurrencySelectionTab = ref(false)
const currencies = ref<Account[]>([]);
const currencyList = ref([]);
const isMethodSelectionTab = ref(false)
const methodList = ref<Account[]>([]);
const isPaymentSummary = ref(false)
const amountInUSD = ref(null)
const successModalPreview = ref(false);
const errorModalVisible = ref(false);
const errorModalVisible1 = ref(false);
const errorMessage = ref('');
const errorMessage2 = ref('');
const parsedData = ref(null);
const userData = localStorage.getItem('userData');
const errorTitle = ref('')
const clientDocs = ref([]); // Store client documents
const isLoading = ref(false); // To manage the loading state
const errorModalVisible3 = ref(false);
const errorMessage3 = ref('');
if (userData) {
  parsedData.value = JSON.parse(userData);
  // parsedData.value.is_ib = 2 // Parse the string to JSON
  // Retrieve client documents from local storage if available
  const storedDocs = localStorage.getItem("clientDocs");

} else {
  console.error("No userData found in localStorage");
}
const fetchUserInfo = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get("/profile/user-info");

    // Extract necessary data

    clientDocs.value = response.data.result.client_docs;




    // Debugging logs (optional)

    console.log("Client Documents:", clientDocs.value);


  } catch (error) {
    console.error("Error fetching user info:", error);
  } finally {
    isLoading.value = false;
  }
};


// Fetch accounts from API
const fetchAccounts = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/live-accounts/data-list");
    accountList.value = response.data.result.mt_data;

  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally {
    loading.value = false; // Set loading to false after the API call
  }
};

const fetchCurrencies = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/fund/currency-list");
    currencies.value = response.data.result.currency;
    currencyList.value = currencies.value.filter(currency => currency.status === 1);

  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally {
    loading.value = false; // Set loading to false after the API call
  }
};

const fetchMethod = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/fund/deposit/methods");
    methodList.value = response.data.result.payment_gateways.reverse();

  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally {
    loading.value = false; // Set loading to false after the API call
  }
};



onMounted(() => {
  fetchAccounts();
  fetchCurrencies();
  fetchMethod();
  fetchUserInfo();
});

const modalTitle = ref('');
const modalIcon = ref('');
const modalIconClass = ref('');


const selectedAccountId = ref(null)
function handleTabClick(account) {
  if (parsedData.value.doc_verified !== 3) {
    errorTitle.value = 'Identity Verification Required.'
    errorMessage2.value = `Your identity verification is incomplete. Deposits can only be made once your documents are uploaded and verified. Please upload the required documents if you haven't already. You will receive an email notification once the verification process is complete.
  Thank you for your cooperation.`;
    errorModalVisible.value = true; // Show the error modal
    return;
  }
  selectedAccountId.value = account.mt_id
}
// account selection button click
function handleSelectedAccount() {

  isAccountSelectionTab.value = false
  iscurrencySelectionTab.value = false
  iscurrencySelectionTab.value = false
  isMethodSelectionTab.value = true
  isPaymentSummary.value = false
}

const selectedCurrencyId = ref(null)
const selectedCurrency = ref(null)
function handleCurrencySelection(currency) {
  selectedCurrency.value = currency
  selectedCurrencyId.value = currency.id
}

function handleSelectedCurrency() {
  isAccountSelectionTab.value = false
  iscurrencySelectionTab.value = false
  isMethodSelectionTab.value = true
  isPaymentSummary.value = false
}

const selectedMethodId = ref(null)
function handleMethodSelection(method) {
  selectedMethodId.value = method.id
  console.log(selectedMethodId.value);

}

function handleSelectedMethod() {
  isAccountSelectionTab.value = false
  iscurrencySelectionTab.value = false
  isMethodSelectionTab.value = false
  isPaymentSummary.value = true
}

function handleBack() {
  if (isPaymentSummary.value) {
    isPaymentSummary.value = false;
    isMethodSelectionTab.value = true;
  } else if (isMethodSelectionTab.value) {
    isMethodSelectionTab.value = false;
    isAccountSelectionTab.value = true;
    iscurrencySelectionTab.value = false;
  } else if (iscurrencySelectionTab.value) {
    iscurrencySelectionTab.value = false;
    isAccountSelectionTab.value = true;
  }
}
const toUSD = ref<string | null>(null);

watch(amountInUSD, (newValue, oldValue) => {
  // Check if `selectedCurrency.value` is defined to avoid runtime errors
  if (selectedCurrency.value && selectedCurrency.value.to_usd) {
    toUSD.value = (Number(amountInUSD.value) / selectedCurrency.value.to_usd).toFixed(2);

  } else {
    console.warn('selectedCurrency.value or to_usd is not defined');
    toUSD.value = null; // Reset if `selectedCurrency` is invalid
  }
});

const proof = ref(null)


function handleFileChange(event) {
  const file = event.target.files[0];  // Get the first file selected
  if (file) {
    proof.value = file;
  }
}
const isBtnLoading = ref(false)
// Function to send payment data to the API
async function sendPaymentData(formData) {

  try {
    isBtnLoading.value = true



    // Call the ticket creation API
    const response = await apiClient.post("/fund/deposit/create", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    // You can handle success here, e.g., show success modal or close dialog
    successModalPreview.value = true;
    // closeDialog();
  } catch (error) {
    console.error("Error creating account:", error.response?.data || error);
    // Handle error, e.g., show error message
    errorMessage3.value = error.response?.data?.message || "An unexpected error occurred. Please try again.";
    errorModalVisible3.value = true;
  }
  finally {
    isBtnLoading.value = false
  }
}

function handleProcessPaymentPopup() {
  errorTitle.value = `Action Required: Contact Support`
  errorMessage2.value = `We are currently upgrading our transaction methods to enhance your experience. For assistance with deposits or withdrawals, please contact our support team. We appreciate your understanding and patience during this upgrade.`;
  errorModalVisible1.value = true; // Show the error modal
  return;
}

// Main function to handle payment process
function handleProcessPayment() {
  const formData = new FormData();
  // Append the JSON data to the FormData instance
  formData.append('mt_id', selectedAccountId.value);
  formData.append('trans_amount', amountInUSD.value);
  formData.append('trans_usd', amountInUSD.value);
  formData.append('payment_method', selectedMethodId.value);
  formData.append('payment_currency', '1');

  // Append the file as 'attachment' to the FormData instance
  if (proof.value) {
    formData.append('image', proof.value);
  } else {
    console.error("No file provided for the attachment.");
  }

  // Call the function to send payment data
  sendPaymentData(formData);
}

function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}


const uploadModalVisible = ref(false);

function openUploadModal() {
  //console.log("Button clicked!");
  uploadModalVisible.value = true;
}

function closeUploadModal() {
  console.log("Closing modal");
  uploadModalVisible.value = false;
}



</script>
<template>

  <!--       STEP 1 STARTS   -->
  <!-- ACCOUNT SELECTION TAB FOR DEPOSIT  -->
  <template v-if="isAccountSelectionTab">
    <div class="flex items-center justify-center h-6 mb-3">
      <div class="text-base font-medium">Select MT5 Account</div>
      <!-- <div class=" font-small">Select MT5 Account</div> -->
    </div>
    <div class="flex items-center justify-center h-6 mb-3 sm:mt-0 mt-5">
      <div class="flex items-center justify-center text-sm sm:text-base font-medium h-full">
        Choose the account for your transaction.
      </div>
    </div>

    <template v-if="!loading">
      <template v-if="accountList.length > 0">
        <template v-for="(account) in accountList" :key="account.mt_id">
          <Button class="border-dashed mt-3 border-slate-300 ms-3 rounded-[0.8rem] w-[120px] sm:w-[150px] py-0.5 px-1.5"
            :class="selectedAccountId === account.mt_id ? 'border-slate-300 ms-3 rounded-[0.8rem] ring-primary ring-opacity-20 bg-slate-50' : ''"
            @click="handleTabClick(account)">
            <div
              class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem] from-theme-2/90 to-theme-1/[0.85]"
              :class="selectedAccountId === account.mt_id ? 'bg-gradient-to-r' : ''">

              <div class="flex items-center justify-between w-full">
                <img v-if="!account.is_wallet" :src="mt5" alt="icon" class="w-7 h-7" />
                <img v-else src="/wallet.webp" alt="Paperbot" class="w-7 h-7">
                <span class="text-lg" :class="selectedAccountId === account.mt_id ? 'text-white' : ''">
                  $ {{ account.balance }}
                </span>
              </div>

              <Lucide icon="Medal"
                class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
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


          <Button variant="primary" class="w-full mt-6 border-primary/50 w-[250px]" @click="handleSelectedAccount()"
            :disabled="selectedAccountId === null">
            <Lucide icon="ArrowBigRight" class="stroke-[1.3] w-4 h-4 mr-2" />
            Next

          </Button>
        </div>
      </template>
    </template>

    <!-- Loading state -->
    <div v-else class="flex flex-col items-center my-5 justify-end col-span-6 sm:col-span-3 xl:col-span-2">
      <LoadingIcon icon="bars" class="w-8 h-8" />
    </div>
    <EmptyStateComponent class="py-5" v-if="accountList.length < 0 && !loading" title="No accounts found." />
  </template>

  <!-- Loading state -->

  <!-- </template> -->
  <!--       STEP 1 ENDS     -->



  <!--       STEP 2 STARTS   -->
  <!-- CURRENCY SELECTION TAB FOR DEPOSIT  -->
  <!-- <template v-if="iscurrencySelectionTab">
    <div class="flex items-center justify-center h-6">
      <div class="text-base font-medium">Select Currency</div> -->
      <!-- <div class=" font-small">Select MT5 Account</div> -->
    <!-- </div>
    <div class="flex items-center justify-center h-6 mb-3 sm:mt-0 mt-5"> -->
      <!-- <div class="text-base font-medium">Select MT5 Account</div> -->
      <!-- <div class=" font-small">Choose your preferred currency to proceed with the deposit transaction.</div>
    </div>
    <template v-if="!loading">
      <template v-if="currencyList.length > 0">
        <template v-for="(currency) in currencyList" :key="currency.id">
          <Button class="border-dashed mt-3 border-slate-300 ms-3 rounded-[0.8rem]"
            :class="selectedCurrencyId === currency.id ? 'border-slate-300 ms-3 rounded-[0.8rem] ring-primary ring-opacity-20 bg-slate-50' : ''"
            @click="handleCurrencySelection(currency)">
            <div
              class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem] from-theme-2/90 to-theme-1/[0.85]"
              :class="selectedCurrencyId === currency.id ? 'bg-gradient-to-r' : ''">

              <Lucide icon="Medal"
                class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
              <div class="text-start pb-2">
                <div class="mt-1.5 text-lg font-bold" :class="selectedCurrencyId === currency.id ? 'text-white' : ''">
                  {{ currency.currency }}
                </div>
              </div>
            </div>
          </Button>
        </template> -->

        <!-- Render "Next" button only if accountList has items -->
        <!-- <div class="flex items-center justify-center h-6 mt-4 mb-4">
          <Button variant="secondary" class="w-full mt-6 border-gray-300 w-[120px] mr-4" @click="handleBack()">
            <Lucide icon="ArrowBigLeft" class="stroke-[1.3] w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="primary" class="w-full mt-6 border-primary/50 w-[250px]" @click="handleSelectedCurrency()"
            :disabled="selectedCurrencyId === null">
            <Lucide icon="ArrowBigRight" class="stroke-[1.3] w-4 h-4 mr-2" />
            Next
          </Button>
        </div>
      </template> -->

      <!-- Render empty state if accountList is empty -->
      <!-- <EmptyStateComponent class="py-5" v-else title="No accounts found." />
    </template> -->

    <!-- Loading state -->
    <!-- <div v-if="loading" class="flex flex-col items-center my-5 justify-end col-span-6 sm:col-span-3 xl:col-span-2">
      <LoadingIcon icon="bars" class="w-8 h-8" />
    </div>
  </template> -->
  <!--       STEP 2 ENDS     -->


  <!--       STEP 3 STARTS   -->
  <!-- METHOD SELECTION TAB FOR DEPOSIT  -->
  <template v-if="isMethodSelectionTab">
    <div class="flex items-center justify-center h-6">
      <div class="text-base font-medium">Select Payment Method</div>
      <!-- <div class=" font-small">Select MT5 Account</div> -->
    </div>
    <div class="flex items-center justify-center h-6 mb-4 sm:mt-0 mt-5">
      <!-- <div class="text-base font-medium">Select MT5 Account</div> -->
      <div class=" font-small flex justify-center">Choose your preferred payment provider to proceed with the
        transaction.</div>
    </div>
    <template v-if="!loading">
      <template v-if="methodList.length > 0">
        <template v-for="(method) in methodList" :key="method.id">
          <Button class="border-dashed mt-3 border-slate-300 ms-3 rounded-[0.8rem]"
            :class="selectedMethodId === method.id ? 'border-slate-300 ms-3 rounded-[0.8rem] ring-primary ring-opacity-20 bg-slate-50' : ''"
            @click="handleMethodSelection(method)">
            <div
              class="overflow-hidden relative flex flex-col w-full h-full px-2 py-2 pb-1 my-1 rounded-[0.8rem] from-theme-2/90 to-theme-1/[0.85]"
              :class="selectedMethodId === method.id ? 'bg-gradient-to-r' : ''">

              <Lucide icon="Medal"
                class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
              <div class="text-start pb-2">
                <div class="mt-1.5 text-lg font-bold" :class="selectedMethodId === method.id ? 'text-white' : ''">
                  {{ method.display_name }}
                </div>
              </div>
            </div>
          </Button>
        </template>

        <!-- Render "Next" button only if accountList has items -->
        <div class="flex items-center justify-center h-6 mt-4 mb-4">
          <Button variant="secondary" class="w-full mt-6 border-gray-300 w-[120px] mr-4" @click="handleBack()">
            <Lucide icon="ArrowBigLeft" class="stroke-[1.3] w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="primary" class="w-full mt-6 border-primary/50 w-[250px]" @click="handleSelectedMethod()"
            :disabled="selectedMethodId === null">
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
  <!--       STEP 3 ENDS     -->


  <!--       STEP 4 STARTS   -->
  <!-- PAYMENT SUMMARY FOR DEPOSIT  -->
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
      <div class="flex items-center justify-end font-medium">Selected Account :</div>
      <div class="flex items-center justify-start font-medium">MT{{ selectedAccountId }}</div>

      <!-- Payment Method -->
      <div class="flex items-center justify-end font-medium">Payment Method :</div>
      <div class="flex items-center justify-start font-medium">
        {{ methodList.find(gateway => gateway.id === selectedMethodId)?.display_name }}
      </div>

      <!-- Amount in USD -->
      <div class="flex items-center justify-end font-medium">Amount in USD :</div>
      <div class="flex items-center justify-start">
        <FormInput v-model="amountInUSD" type="text"
          class="block px-1 py-3.5 rounded-[0.6rem] border-slate-300/80 w-[120px] sm:w-[200px]" />
      </div>

      <!-- Amount in selected currency -->
      <!-- <div class="flex items-center justify-end font-medium">Amount in selected currency :</div>
      <div class="flex items-center justify-start">
        <FormInput v-model="toUSD" type="text"
          class="block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80 w-[120px] sm:w-[200px]" />

      </div> -->
      <div v-if="selectedMethodId === 1 || selectedMethodId === 2 || selectedMethodId === 13"
        class="flex items-center justify-end font-medium">
        Upload
        Proof for Transaction :</div>
      <div v-if="selectedMethodId === 1 || selectedMethodId === 2 || selectedMethodId === 13"
        class="flex items-center justify-start">
        <input id="file-upload" type="file"
          class="block px-1 py-3.5 rounded-[0.6rem] border-slate-300/80 w-[120px] sm:w-[200px]"
          @change="handleFileChange" />

      </div>
      <!-- </span> -->
    </div>

    <div class="flex items-center justify-center h-6 mt-4 mb-4">
      <Button variant="secondary" class="w-full mt-6 border-gray-300 w-[120px] mr-4" @click="handleBack()">
        <Lucide icon="ArrowBigLeft" class="stroke-[1.3] w-4 h-4 mr-2" />
        Back
      </Button>
      <Button variant="primary" class="w-full mt-6 border-primary/50 w-[250px]" :disabled="amountInUSD === null||proof===null"
        @click="handleProcessPayment()">
        <template v-if="isBtnLoading">
          Processing
          <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
        </template>
        <template v-else>
          Process Deposit
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
  <!--       STEP 4  ENDS     -->

  <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          Deposit Ticket Created Successfully!
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
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-red-500" />
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

  <!-- Error Modal 2-->
  <Dialog :open="errorModalVisible" @close="() => (errorModalVisible = false)">
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
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="secondary" @click="openUploadModal" @touchstart="openUploadModal"
          class="w-44 mt-2 z-50">
          {{ parsedData?.doc_verified === 1 ? "View Documents" : "Upload Now" }}
        </Button>



      </div>
    </Dialog.Panel>
  </Dialog>

  <Dialog size="xl" sm:size="xl" :open="uploadModalVisible" @close="() => (uploadModalVisible = false)">
    <Dialog.Panel class="bg-white sm:w-[80%] lg:w-[70%] md:w-[60%] shadow-lg px-5">
      <div class="p-5 text-center">
        <template v-if="parsedData?.doc_verified === 1">
          <div class="mt-5 text-3xl font-semibold">View Documents</div>
          <ViewIdentityComponet :clientDocs="clientDocs" />
        </template>

        <template v-else>
          <div class="mt-5 text-3xl font-semibold">Upload Your Documents</div>
          <IdentityVerification />
        </template>
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

  <Dialog :open="errorModalVisible3" @close="() => (errorModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-red-500" />
        <div class="mt-5 text-3xl font-semibold">Oops...</div>
        <div class="mt-2 text-slate-500">
          {{ errorMessage3}}
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