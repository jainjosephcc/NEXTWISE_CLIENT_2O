<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import apiClient from "../../../services/apiService";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import {Dialog} from "@/components/Base/Headless";
import GradientButton from "@/components/Commons/GradientButton.vue";
import {useClipboard} from '@vueuse/core'
import QrImage from "@/assets/images/qr_payment.png"
import Pay89DepositComponent from "@/components/Fund/Pay89DepositComponent.vue";
import BankQRListing from "@/components/Fund/BankQRListing.vue";
import TickerWidgetFxComponent from "@/components/Commons/TickerWidgetFxComponent.vue";
import { ChevronsRightLeft } from 'lucide-vue-next';


const showPopup = ref(false)
const isagreed = ref(false)
const btc_screen2 = ref(false)
const bank_screen2 = ref(false)
const cards = [
  //epay
  /*{
    id: 24,
    title: 'Debit / Credit Card Payment',
    time: 'Instant - 30 mins',
    fee: '0%',
    min: '100 USD',
    icon: '/images/depo/a_01.png'
  },*/
  //cregis
  {
    id: 13,
    title: 'NEXTWISE-PAY USDT',
    time: 'Instant - 30 mins',
    fee: '0%',
    min: '10 USDT',
    icon: '/images/depo/b_01.png'
  },
 /* //btc
  {
    id: 15,
    title: 'BTC',
    time: 'Instant - 30 minutes',
    fee: '0%',
    min: '0.0001 BTC',
    icon: '/images/depo/c_01.png'
  },
  //bank depo
  {
    id: 16,
    title: 'Bank Transfer',
    time: 'Banking Hours',
    fee: '0%',
    min: '1500 INR',
    icon: '/images/depo/d_01.png'
  },
  //pay89
  {
    id: 32,
    title: 'AIRRSAN PAY ',
    time: 'Instant - 30 mins',
    fee: '0%',
    min: '100000.0 VND',
    icon: '/images/depo/v_01.png'
  }*/
]
const loading = ref(false)
const isSubmitBtnLoading = ref(false)
const isBTCSubmitBtnLoading = ref(false)
const successModalVisible = ref(false);
const errorModalVisible = ref(false);
const accountList = ref<Account[]>([]);
const selectedMtId = ref("");
const errorMessage = ref("");
const selectedPaymentMethod = ref(null);
const selectedFile = ref<UploadFile | null>(null)
const usdAmount = ref<number | null>(null)
const inrAmount = ref<number | null>(null)
const aedAmount = computed(() => usdAmount.value ? (usdAmount.value * 3.68).toFixed(2) : "0.00");
const inrToUsdAmount = computed(() => inrAmount.value ? (inrAmount.value / 83.7).toFixed(2) : "0.00");
const errors = ref<{
  account: string | null
  amount: string | null
  selectedFiles: string | null
}>({
  account: null,
  amount: null,
  selectedFiles: null
})
const showStatusPop=ref(false)
const selectPaymentMethod = (card) => {
  const userStatus = JSON.parse(localStorage.getItem("clientStatus") || "{}");
  
  if (userStatus?.disable_deposit === 0) {
    selectedPaymentMethod.value = card.id;
  showPopup.value = true;
  }
  else{
    showStatusPop.value=true
  }
  
};



const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `DEPO-EPAY-${timestamp}-${randomStr}`.toUpperCase();
};
const handleEpaySubmit = async (order_id: string, token: string, user: any) => {
  try {
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("token", token);
    formData.append("type", "mt5");
    formData.append("transaction_type", "bank");
    formData.append("transfer_type", "deposit");
    formData.append("payment_method_id", "24");
    formData.append("mt5_id", selectedMtId.value);
    formData.append("currency_id", "1"); // USD
    formData.append("amount", usdAmount?.value.toString());
    formData.append("order_id", order_id);

    const response = await apiClient.post("https://clientapi.nextwise.com/api/send-epay-callback", formData);
    console.log("✅ EPay response:", response.data);
  } catch (err) {
    console.error("❌ Error submitting EPay:", err);
    alert("Server Error. Please contact support.");
  }
};
const resetForm = () => {
  usdAmount.value = null;
  selectedMtId.value = "";
};
const fetchAccounts = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/live-accounts/data-list");
    accountList.value = response.data.result.mt_data;

  } catch (error) {
    console.error("Error fetching accounts:", error);
  } finally {
    loading.value = false; // Set loading to false after the API call
  }
};
onMounted(() => {
  fetchAccounts();
  /*watch(accountList, (list) => {
    const walletAccount = list.find(acc => acc.is_wallet == 1);
    if (walletAccount) {
      selectedMtId.value = walletAccount.mt_id;
    }
  });*/
});
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://epay.me/v2sdk/directsdk.js";
  script.async = true;
  script.onload = () => console.log("✅ EPay SDK loaded");
  script.onerror = () => console.error("❌ EPay SDK failed to load");
  document.body.appendChild(script);
});


const generateCregisOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `NEXTWISE-PAY-${timestamp}-${randomStr}`.toUpperCase();
};
const generateNonce = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomStr;
};
const submitCregisPayment = async () => {
  try {
    const formData = new FormData();
    formData.append('order_id', generateCregisOrderId());
    formData.append('order_currency', "USD");
    formData.append('callback_url', "https://clientapi.nextwisemarkets.com/api/client/callback-cregis-payment");
    formData.append('valid_time', "10");
    formData.append('order_amount', usdAmount?.value.toString()); // or this.amount
    formData.append('nonce', generateNonce());
    formData.append('success_url', "https://client.nextwisemarkets.com/transactions?page=deposits");
    formData.append('cancel_url', "https://client.nextwisemarkets.com/transactions?page=deposits");
    formData.append('payer_id', selectedMtId.value); // use appropriate binding
    formData.append('type', 'mt5');
    formData.append('transaction_type', '13');
    formData.append('transfer_type', 'deposit');
    formData.append('payment_method_id', '13');
    formData.append('mt5_id', selectedMtId.value);
    formData.append('currency_id', '1');

    try {
      const response = await apiClient.post("/get-checkout-url-cregis-payment", formData);
      if (response.data.success === 0 && response.data.data?.checkout_url) {
        // Use setTimeout to ensure Vue DOM updates don't interfere
        setTimeout(() => {
          window.location.href = response.data.data.checkout_url;
        }, 100);
      } else {
        console.error('Cregis Error:', response.data.data?.error || 'Unknown error');
        // Show alert to user here
      }
    } catch (error) {
      console.error('Cregis Submit Error:', error.response?.data?.message || error.message);
      throw error;

    }
  } catch (error) {
    isSubmitBtnLoading.value = false;
    // show error alert to user
  }
};


const validateAndContinue = async () => {
  errors.value.account = null;
  errors.value.amount = null;
  isSubmitBtnLoading.value = true;
  if (selectedPaymentMethod.value === 15) {
    if (!btc_screen2.value) {
      btc_screen2.value = true;
      console.log('screen 2 loaded');
      return;
    }
  }

  if (!selectedMtId.value) {
    errors.value.account = "Please select an MT5 account.";
  }

  if (!usdAmount.value || usdAmount.value < 100) {
    errors.value.amount = "Minimum deposit is $100.";
  }

  if (!errors.value.account && !errors.value.amount) {

    if (selectedPaymentMethod.value === 13) {
      await submitCregisPayment();
      return; // exit early
    }


    const orderID = generateOrderId();

    if (window.Epay) {
      isSubmitBtnLoading.value = true;
      const user = JSON.parse(localStorage.getItem("userData") || "{}");
      const token = localStorage.getItem("token");

      const options = {
        channelId: "WEB",
        customerId: user.sequence?.toString() ?? "0000",
        merchantType: "ECOMMERCE",
        merchantId: "63639567333556",
        orderID: orderID,
        orderDescription: selectedMtId.value,
        orderAmount: usdAmount.value,
        orderCurrency: "USD",
        email: user.email,
        countrycode: user.phone_prefix?.replace(/^\+/, '') ?? "971",
        mobilenumber: user.phone,
        name: `${user.first_name} ${user.last_name}`,
        successHandler: async (res) => {
          await handleEpaySubmit(orderID, token, user);
          alert("✅ Deposit Successful");
          resetForm();
        },
        failedHandler: async (res) => {
          alert("❌ Payment Failed");
        },
      };

      const epay = new window.Epay(options);
      epay.open(options);
      isSubmitBtnLoading.value = false;
    } else {
      alert("Payment gateway not loaded");
      isSubmitBtnLoading.value = false;
    }
  }
};

const continueBank = async () => {
  if (!bank_screen2.value) {
    bank_screen2.value = true;
    console.log('screen 2 loaded');
    return;
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        alert("Failed to copy to clipboard.");
      });
};

interface UploadFile extends File {
  preview: string
}

const selectedFiles = ref<UploadFile[]>([])
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  if (files.length > 0) addFiles([files[0]])
}

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : []
  if (files.length > 0) addFiles([files[0]])
}

const addFiles = (files: File[]) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const maxSize = 3 * 1024 * 1024 // 3MB

  const file = files[0]
  if (!file) return

  if (!allowedTypes.includes(file.type)) {
    errors.value.selectedFiles = 'Only JPEG, PNG, JPG files are allowed.'
    return
  }

  if (file.size > maxSize) {
    errors.value.selectedFiles = 'File size must not exceed 3MB.'
    return
  }

  if (selectedFile.value?.preview) {
    URL.revokeObjectURL(selectedFile.value.preview)
  }

  selectedFile.value = Object.assign(file, {
    preview: URL.createObjectURL(file)
  })

  errors.value.selectedFiles = null
}

const handleDragOver = () => {
}
const handleDragLeave = () => {
}
const deleteFile = () => {
  if (selectedFile.value?.preview) {
    URL.revokeObjectURL(selectedFile.value.preview)
  }
  selectedFile.value = null
}

const formatFileSize = (size: number): string => {
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB'
  if (size >= 1024) return (size / 1024).toFixed(1) + ' KB'
  return size + ' B'
}
const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || ''
}
const btcAmount = ref<number>(0.00)
const txid = ref("")
const usdConverted = computed(() => {
  return btcAmount.value ? (btcAmount.value * 85000).toFixed(2) : "0.00"
})
const validateAndContinuewithAttachment = () => {
  // Reset errors
  errors.value.account = null
  errors.value.amount = null
  errors.value.selectedFiles = null

  let hasError = false

  // ✅ Validate Account
  if (!selectedMtId.value) {
    errors.value.account = "Please select an MT5 account."
    hasError = true
  }

  if (selectedPaymentMethod.value == 15) {
    // ✅ Validate BTC Amount
    if (!btcAmount.value || btcAmount.value < 0.0001) {
      errors.value.amount = "Minimum deposit is 0.0001 BTC."
      hasError = true
    }
    isBTCSubmitBtnLoading.value = true;

    // ✅ Validate TXID
    if (!txid.value || txid.value.trim().length < 5) {
      alert("TXID is required and must be at least 5 characters.")
      hasError = true
    }

  }

  if (selectedPaymentMethod.value == 16) {
// ✅ Validate BTC Amount
    if (!inrAmount.value || inrAmount.value < 1500) {
      errors.value.amount = "Minimum deposit is 1500 INR."
      hasError = true
    }

    // ✅ Validate TXID
    if (!txid.value || txid.value.trim().length < 5) {
      alert("TXID is required and must be at least 5 characters.")
      hasError = true
    }
  }

  // ✅ Validate Screenshot Upload
  if (!selectedFile.value) {
    errors.value.selectedFiles = "Please upload a payment screenshot."
    hasError = true
  }
  if (hasError) return
  // 🔄 Proceed with deposit submission (example)
  console.log("✅ Validated and ready to submit:", {
    mt5: selectedMtId.value,
    btcAmount: btcAmount.value,
    usdAmount: usdConverted.value,
    txid: txid.value,
    attachments: selectedFiles.value[0]
  })

  const amount = selectedPaymentMethod.value == 15 ? btcAmount.value : inrAmount.value;
  const usdAmount = selectedPaymentMethod.value == 15 ? usdConverted.value : inrToUsdAmount.value

  const formData = new FormData();
  // Append the JSON data to the FormData instance
  formData.append('mt_id', selectedMtId.value);
  formData.append('trans_amount', amount.toFixed(2) ?? "0.00");
  formData.append('trans_usd', parseFloat(usdAmount).toFixed(2) ?? "0.00");
  formData.append('payment_method', selectedPaymentMethod.value);
  formData.append('payment_currency', '10');
  if (selectedFile.value) {
    formData.append('image', selectedFile.value, selectedFile.value.name);
  }
  sendPaymentData(formData);
}

async function sendPaymentData(formData) {

  try {
    isSubmitBtnLoading.value = true
    // Call the ticket creation API
    const response = await apiClient.post("/fund/deposit/create", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    // You can handle success here, e.g., show success modal or close dialog
    successModalVisible.value = true;
    // closeDialog();
  } catch (error) {
    console.error("Error creating account:", error.response?.data || error);
    // Handle error, e.g., show error message
    errorMessage.value = error.response?.data?.message || "An unexpected error occurred. Please try again.";
    errorModalVisible.value = true;
  } finally {
    isSubmitBtnLoading.value = false
  }
}

function handleRefresh() {
  successModalVisible.value = false;
  window.location.reload();
}


const activeDepositTab = ref('qr'); // default to 'qr' or 'bank'
const upiID = 'hanifkureshi666@okaxis'
const {copy} = useClipboard()
const copied = ref(false)

const copyUpi = async () => {
  await copy(upiID)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}


function handleBack() {
  // Example action: Reset selected payment
  isagreed.value = false;
  showPopup.value=false;
  //console.log('Back button clicked!');
}

const upiOptions = [
  'upi1@bank',
  'upi2@bank',
  'upi3@bank',
  'upi4@bank'
]

const activeUpiIndex = ref(0)
//const copied = ref(false)
//const QrImage = 'https://example.com/demo-qr.png'

/*function copyUpi() {
  const upi = upiOptions[activeUpiIndex.value]
  navigator.clipboard.writeText(upi).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}*/

</script>

<template>
  <div class="bg-[#090909] text-white md:px-2">
    <div class="grid grid-cols-12 gap-y-10 mb-4">


      <div class="col-span-12">
        <TickerWidgetFxComponent/>
      </div>
    </div>

    <div class="container mx-auto px-4 pb-16 md:pb-25">
      <div class="mb-8 rounded-lg overflow-hidden"></div>

      <!-------- PAYMENT METHODS LISTING -------->
      <div v-if="!isagreed">
        <!-- Section Heading -->
        <h2 class="text-xl font-semibold mb-6 text-center md:text-left">All Payment Methods</h2>

        <!-- Payment Method Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 pb-10">
          <div
              v-for="(card, index) in cards"
              :key="index"
              @click="selectPaymentMethod(card)"
              class="bg-gray-900 text-white p-5 md:p-6 rounded-xl shadow-md hover:shadow-blue-500/50 transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 flex flex-col justify-between"
          >
            <div class="flex justify-between items-center mb-2">
              <div class="text-lg font-semibold">{{ card.title }}</div>
              <img :src="card.icon" class="w-32 object-contain" />
            </div>
            <div class="text-sm text-gray-300 space-y-1">
              <div class="font-semibold" v-if="card.id==32">(THB,VND,IDR,MYR,PHP,BDT)</div>
              <div>Processing time: {{ card.time }}</div>
              <div>Fee: {{ card.fee }}</div>
              <div>Minimum Deposit: {{ card.min }}</div>
            </div>
          </div>
        </div>
      </div>




      <div v-else>
        <div class="bg-[#090909] text-white">
          <div class="max-w-4xl mx-auto space-y-6">


            <!--          <p>{{selectedPaymentMethod}}</p>-->
            <!-- Selected payment method -->
            <div class="bg-[#111827] px-6 py-3 rounded-lg ">
              <button
                  @click="handleBack"
                  class="text-gray-400 hover:text-white flex items-center gap-2 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-sm">BACK</span>
              </button>

              <h3 class="text-sm text-gray-300 mt-5">Selected payment method</h3>
              <div v-if="selectedPaymentMethod==24" class="flex items-center justify-between mb-5">
                <span class="text-white font-semibold">Debit / Credit Card Payment</span>
                <img src="/images/depo/a_01.png" class="h-10"/>
              </div>
              <div v-else-if="selectedPaymentMethod==13" class="flex items-center justify-between">
                <span class="text-white font-semibold">WINPAY USDT</span>
                <img src="/images/depo/b_01.png" class="h-10"/>
              </div>
              <div v-else-if="selectedPaymentMethod==15" class="flex items-center justify-between">
                <span class="text-white font-semibold">BTC</span>
                <img src="/images/depo/c_01.png" class="h-10"/>
              </div>
              <div v-else-if="selectedPaymentMethod==16" class="flex items-center justify-between">
                <span class="text-white font-semibold">BANK TRANSFER</span>
                <img src="/images/depo/d_01.png" class="h-10"/>
              </div>

              <div v-else-if="selectedPaymentMethod==32" class="flex items-center justify-between">
                <span class="text-white font-semibold">WIN PAY (THB,VND,IDR,MYR,PHP,BDT)</span>
                <img src="/images/depo/v_01.png" class="h-10"/>
              </div>
            </div>

            <!-- Warning -->
            <div v-if="selectedPaymentMethod==24"
                 class="bg-yellow-100 text-yellow-800 font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-800" viewBox="0 0 24 24"
                   fill="currentColor">
                <path
                    d="M12 2C6.486 2 2 6.487 2 12s4.486 10 10 10 10-4.487 10-10S17.514 2 12 2zM11 6h2v6h-2V6zm0 8h2v2h-2v-2z"/>
              </svg>
              Only AED
            </div>

            <div v-if="selectedPaymentMethod==16"
                 class="bg-yellow-100 text-yellow-800 font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-800" viewBox="0 0 24 24"
                   fill="currentColor">
                <path
                    d="M12 2C6.486 2 2 6.487 2 12s4.486 10 10 10 10-4.487 10-10S17.514 2 12 2zM11 6h2v6h-2V6zm0 8h2v2h-2v-2z"/>
              </svg>
              Don't save bank info for Next Deposit , always Confirm Bank Details From Here
            </div>

            <!-- BANK SCREEN 1-->
            <div v-if="selectedPaymentMethod==16&&!bank_screen2" class="max-w-4xl mx-auto pt-1 space-y-6">
              <!-- Payment Tabs -->
              <div class="bg-[#111827] p-6 rounded-lg shadow-md p-5">
                <h3 class="text-lg font-semibold mb-4">Select Deposit Method</h3>

                <!-- Tab Buttons -->
                <!-- Tabs Container -->
                <div class="flex gap-4 mb-6">
                  <button
                      @click="activeDepositTab = 'qr'"
                      :class="[
      'px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300',
      activeDepositTab === 'qr'
        ? 'bg-cyan-700 text-white shadow-lg ring-2 ring-cyan-400'
        : 'bg-gray-800 text-gray-300 hover:text-white hover:ring-1 hover:ring-cyan-500'
    ]"
                  >
                    Scan QR
                  </button>

                  <button
                      @click="activeDepositTab = 'bank'"
                      :class="[
      'px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300',
      activeDepositTab === 'bank'
        ? 'bg-cyan-700 text-white shadow-lg ring-2 ring-cyan-400'
        : 'bg-gray-800 text-gray-300 hover:text-white hover:ring-1 hover:ring-cyan-500'
    ]"
                  >
                    Bank Details
                  </button>
                </div>


              </div>

              <div v-if="activeDepositTab === 'bank'" class="bg-[#111827] rounded-lg shadow-md p-5">
                <h3 class="text-lg font-semibold mb-4">Payment Details</h3>

                <!-- Tabs -->
                <!--                AC NO...5530398125
                                IFSC COD ..CBIN0280568
                                Branch name: Bhaktinaga
                                Bank name: canter Bank-->
                <!-- Bank Details -->
                <div class="space-y-2">
                  <div><strong>Account Name:</strong> RUDRA TRADING CO</div>
                  <div><strong>Bank Name:</strong> SOUTH INDIAN BANK</div>
                  <div><strong>Branch:</strong> RAJKOT</div>
                  <div class="flex items-center justify-between">
                    <div><strong>Account Number:</strong> 1053073000000071</div>
                    <button title="Copy">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="..."/>
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div><strong>IFSC Code:</strong> SIBL0000466</div>
                    <button title="Copy">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="..."/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- QR Code -->
<!--              <div v-if="activeDepositTab === 'qr'" class="bg-[#111827] shadow-md rounded-md p-5 justify-center">
                &lt;!&ndash; UPI &ndash;&gt;


                <div class="flex justify-center mt-4">
                  <div class="flex justify-between bg-gray-800 p-2 rounded-md font-medium max-w-md">
                    <div class="sm:text-[10px] xs:text-[10px]"><span class="text-slate-400 text-[12px] ">UPI ID: </span>
                      <p class="text-[12px]">{{ upiID }} </p></div>
                    <button @click="copyUpi" class="group relative text-yellow-500 hover:text-white transition pr-1">
                      COPY
                      <span
                          class="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-xs text-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-all"
                      >
                      {{ copied ? 'Copied!' : 'Click to copy' }}</span>
                    </button>
                  </div>
                </div>
                <div class="text-sm text-center text-gray-300 max-w-xl mx-auto px-2 py-4">
                  SCAN QR CODE
                </div>


                &lt;!&ndash; QR Code &ndash;&gt;
                <div class="flex justify-center pb-5">
                  <img
                      class="max-h-48 rounded-md"
                      :src="QrImage"
                      alt="QR Code"
                  />
                </div>

                &lt;!&ndash; QR Instruction &ndash;&gt;
                <div class="text-sm text-center text-gray-400 max-w-xl mx-auto px-2">
                  <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="..."/>
                  </svg>
                  Point your smartphone’s camera at the QR code provided. Ensure it's within the frame and clearly
                  visible.
                </div>

                &lt;!&ndash; Min Deposit &ndash;&gt;
                <div class="flex justify-center mt-4">
                  <div class="flex justify-between bg-gray-800 p-3 rounded-md font-medium w-full max-w-md">
                    <div>Minimum Deposit:</div>
                    <div>1500 <span class="text-gray-500">INR</span></div>
                  </div>
                </div>

                &lt;!&ndash; Screenshot Reminder &ndash;&gt;
                <div class="text-sm text-center text-gray-400 max-w-xl mx-auto px-2 mt-2">
                  <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="..."/>
                  </svg>
                  If your payment is successful, take a screenshot and submit it on the deposit portal.
                </div>

              </div>
            -->

              <div v-if="activeDepositTab === 'qr'" class="bg-[#111827] shadow-md rounded-md p-5">
                <BankQRListing/>
              </div>

            </div>


            <!-- BANK SCREEN 2-->
            <div v-if="selectedPaymentMethod==16&&bank_screen2" class="bg-[#111827] p-6 rounded-lg">
              <!-- Heading -->
              <h3 class="text-lg font-semibold mb-4">Fill your payment details</h3>

              <!-- Minimum Deposit -->
              <div class="bg-[#1f2937] text-sm text-gray-300 px-4 py-3 rounded-lg mb-6">
                Minimum Deposit: <span class="text-white font-semibold">1500 INR</span>
              </div>

              <!-- Form Fields -->
              <div class="grid sm:grid-cols-2 gap-6">
                <!-- MT5 Account Dropdown -->
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

                <!-- Amount Field -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Amount</label>
                  <div class="relative">
                    <input v-model="inrAmount" type="number" placeholder="Enter amount"
                           class="w-full bg-[#1f2937] text-white border border-gray-700 rounded-lg px-4 py-2 pl-14"/>
                    <div class="absolute top-2.5 left-4 text-gray-400">INR</div>
                  </div>
                  <p v-if="errors.amount" class="text-red-500 text-sm mt-1">{{ errors.amount }}</p>
                </div>

                <!-- USD Conversion Display -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">
                    <div class="text-sm text-gray-400">Conversion <b>83.7 INR = 1 USD</b></div>
                  </label>
                  <div class="bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2">
                    <div class="mt-1 text-white">USD <span class="font-bold">{{ inrToUsdAmount }}</span></div>
                  </div>
                </div>

                <!-- TXID -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">UTR ID</label>
                  <input v-model="txid" type="text" placeholder="Enter UTR ID"
                         class="w-full bg-[#1f2937] text-white border border-gray-700 rounded-lg px-4 py-2"/>

                </div>
              </div>

              <!-- Upload Screenshot -->

              <div class="mt-6 pb-5">
                <!-- Label -->
                <label class="block text-sm text-gray-400 mb-2">Payment Screenshot</label>

                <!-- Upload Box -->
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
                      <p class="text-sm text-center mt-5">
                        Drag and drop your screenshot(s) or
                        <span class="text-blue-400 underline">Browse</span>
                      </p>
                      <p class="text-xs sm:text-sm text-gray-500">JPEG, PNG, JPG · 3MB per file</p>
                    </div>
                  </div>

                </label>

                <!-- File Input (Hidden) -->
                <input
                    hidden
                    type="file"
                    id="IdProoffileupload"
                    name="IdProoffileupload[]"
                    accept="image/jpeg, image/png, image/jpg"
                    @change="handleFileSelect"
                />

                <!-- Validation Error -->
                <p v-if="errors.selectedFiles" class="text-sm text-red-500 mt-2">{{ errors.selectedFiles }}</p>

                <!-- Preview -->
                <div v-if="selectedFile" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div class="bg-[#1f2937] p-4 rounded-lg relative shadow-md flex flex-col">
                    <img
                        :src="selectedFile.preview"
                        alt="Preview"
                        class="w-full h-40 object-contain bg-black rounded mb-2"
                    />
                    <div class="text-sm text-white truncate">{{ selectedFile.name }}</div>
                    <div class="text-xs text-gray-400">
                      {{ getFileExtension(selectedFile.name) }}, {{ formatFileSize(selectedFile.size) }}
                    </div>
                    <button
                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        @click="deleteFile"
                        aria-label="Remove file"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>

              </div>

            </div>


            <!-- USDT DEPOSIT CREGIS -->
            <div v-if="selectedPaymentMethod==24||selectedPaymentMethod==13"
                 class="bg-[#111827] p-6 rounded-lg pb-28">
              <h3 class="text-white font-semibold mb-4">Fill your payment details</h3>

              <!-- Card Icons -->
              <div v-if="selectedPaymentMethod==24" class="flex flex-wrap justify-between gap-4 mb-4">
                <div class="w-[80px] h-[50px] bg-white rounded-lg flex items-center justify-center">
                  <img class="h-8" src="/images/paymentmethod/visa.webp" alt="Visa"/>
                </div>
                <div class="w-[80px] h-[50px] bg-white rounded-lg flex items-center justify-center">
                  <img class="h-8" src="/images/paymentmethod/american-express.png" alt="Amex"/>
                </div>
                <div class="w-[80px] h-[50px] bg-white rounded-lg flex items-center justify-center">
                  <img class="h-8" src="/images/paymentmethod/mastercard.png" alt="Mastercard"/>
                </div>
                <div class="w-[80px] h-[50px] bg-white rounded-lg flex items-center justify-center">
                  <img class="h-8" src="/images/paymentmethod/maestro.png" alt="Maestro"/>
                </div>
                <div class="w-[80px] h-[50px] bg-white rounded-lg flex items-center justify-center">
                  <img class="h-8" src="/images/paymentmethod/cirrus.jpg" alt="Cirrus"/>
                </div>
                <div class="w-[80px] h-[50px] bg-white rounded-lg flex items-center justify-center">
                  <img class="h-8" src="/images/paymentmethod/skrill.jpg" alt="Skrill"/>
                </div>
              </div>


              <!-- Account & Amount -->
              <div class="grid sm:grid-cols-2 gap-4 mb-4 pt-4">
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
                  <label class="block text-sm mb-1">Amount</label>
                  <div class="relative">
                    <input
                        v-model="usdAmount"
                        type="number"
                        placeholder="Enter amount"
                        class="w-full bg-[#1f2937] text-white border px-4 py-2 pl-14 rounded-lg"
                        :class="errors.amount ? 'border-red-500' : 'border-gray-700'"
                    />
                    <div class="absolute top-2.5 left-4 text-gray-400">USD</div>
                  </div>
                  <p v-if="errors.amount" class="text-red-500 text-sm mt-1">{{ errors.amount }}</p>

                </div>
              </div>

              <!-- Preset Amounts -->
              <div class="flex flex-wrap gap-3 mb-4">
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

              </div>

              <!-- USD to USDT Conversion -->
              <div v-if="selectedPaymentMethod==13" class="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div class="text-sm text-gray-400 mb-1">1 USD = 1 USDT</div>
                  <div class="relative">
                    <input
                        v-model="usdAmount"
                        type="number"
                        readonly
                        placeholder="Amount in USDT"
                        class="w-full bg-[#1f2937] text-white border px-4 py-2 pl-14 rounded-lg"
                        :class="errors.amount ? 'border-red-500' : 'border-gray-700'"
                    />
                    <div class="absolute top-2.5 left-2 text-gray-400 right-3 pr-5">USDT</div>
                  </div>

                </div>
              </div>


              <!-- USD to AED Conversion -->
              <div v-if="selectedPaymentMethod==24" class="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div class="text-sm text-gray-400 mb-1">3.68 AED = 1 USD</div>
                  <div class="relative">
                    <input
                        v-model="aedAmount"
                        type="number"
                        readonly
                        placeholder="Amount in AED"
                        class="w-full bg-[#1f2937] text-white border px-4 py-2 pl-14 rounded-lg"
                        :class="errors.amount ? 'border-red-500' : 'border-gray-700'"
                    />
                    <div class="absolute top-2.5 left-2 text-gray-400 right-3 pr-5">AED</div>
                  </div>

                </div>
              </div>


              <!-- Minimum Deposit -->
              <div class="text-sm text-gray-400 mt-2">
                Minimum Deposit: <span class="font-semibold text-white">100 USD</span>
              </div>
            </div>


            <!--USDT SUBMIT-->
            <div v-if="selectedPaymentMethod==24||selectedPaymentMethod==13" class="flex justify-center">
              <GradientButton
                  style="width: 200px;"
                  :loading="isSubmitBtnLoading"
                  :disabled="isSubmitBtnLoading"
                  default-text="PROCEED TO PAY"
                  loading-text="Saving..."
                  @click="validateAndContinue"
              />
            </div>


            <!-- BTC SCREEN 1-->
            <div v-if="selectedPaymentMethod==15&&!btc_screen2" class="bg-[#111827] p-6 rounded-lg">
              <h2 class="text-white font-semibold mb-4">Payment details</h2>
              <div class="space-y-4">
                <!-- Deposit Address -->
                <div>
                  <label class="block text-sm font-medium text-gray-500">Deposit Address:</label>
                  <div class="mt-1 flex items-center space-x-2">
                    <span class="font-mono font-medium text-cyan-100">1EYXxDAhZHFreLLr6nT38RB6BtJXiQcu1V</span>
                    <button @click="copyToClipboard('1EYXxDAhZHFreLLr6nT38RB6BtJXiQcu1V')"
                            class="text-blue-500 hover:underline">Copy
                    </button>

                  </div>
                </div>

                <!-- QR Code -->
                <div class="w-full bg-white rounded-lg p-4 flex justify-center items-center">
                  <div>
                    <label class="block text-sm font-medium text-gray-500 text-center mb-2">Scan QR Code:</label>
                    <img
                        src="https://hariheadoffice.winprofx.com/storage/photos/paymentmethod/qr/yfyDwLrI5sSsjSUf5986id7ebpPQlMKImBO7NNFr.png"
                        alt="QR Code"
                        class="mx-auto h-44 object-contain pb-2"/>
                  </div>
                </div>


                <!-- Procedure -->
                <div>
                  <label class="block text-sm font-medium text-gray-500">Procedure:</label>
                  <ol class="mt-1 list-decimal list-inside text-sm text-gray-400 space-y-1">
                    <li>Complete the transfer to the USDT TRC20 deposit address.</li>
                    <li>Once you get the confirmation, then enter the amount transferred along with the Proof of
                      Transfer. - <strong>CONTINUE</strong></li>
                    <li>We will verify your transaction and automatically approve your Deposit.</li>
                  </ol>
                </div>
              </div>
            </div>
            <!-- BTC SCREEN 2-->
            <div v-if="selectedPaymentMethod==15&&btc_screen2" class="bg-[#111827] p-6 rounded-lg">
              <!-- Heading -->
              <h3 class="text-lg font-semibold mb-4">Fill your payment details</h3>

              <!-- Minimum Deposit -->
              <div class="bg-[#1f2937] text-sm text-gray-300 px-4 py-3 rounded-lg mb-6">
                Minimum Deposit: <span class="text-white font-semibold">0.0001 BTC</span>
              </div>

              <!-- Form Fields -->
              <div class="grid sm:grid-cols-2 gap-6">
                <!-- MT5 Account Dropdown -->
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

                <!-- Amount Field -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Amount</label>
                  <div class="relative">
                    <input v-model="btcAmount" type="number" placeholder="Enter amount"
                           class="w-full bg-[#1f2937] text-white border border-gray-700 rounded-lg px-4 py-2 pl-14"/>
                    <div class="absolute top-2.5 left-4 text-gray-400">BTC</div>
                  </div>
                  <p v-if="errors.amount" class="text-red-500 text-sm mt-1">{{ errors.amount }}</p>
                </div>

                <!-- USD Conversion Display -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">
                    <div class="text-sm text-gray-400">Conversion <b>1 BTC = 85000 USD</b></div>
                  </label>
                  <div class="bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2">
                    <div class="mt-1 text-white">USD <span class="font-bold">{{ usdConverted }}</span></div>
                  </div>
                </div>

                <!-- TXID -->
                <div>
                  <label class="block text-sm text-gray-400 mb-1">TXID</label>
                  <input v-model="txid" type="text" placeholder="Enter TXID"
                         class="w-full bg-[#1f2937] text-white border border-gray-700 rounded-lg px-4 py-2"/>

                </div>
              </div>

              <!-- Upload Screenshot -->

              <div class="mt-6 pb-5">
                <!-- Label -->
                <label class="block text-sm text-gray-400 mb-2">Payment Screenshot</label>

                <!-- Upload Box -->
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
                      <p class="text-sm text-center mt-5">
                        Drag and drop your screenshot(s) or
                        <span class="text-blue-400 underline">Browse</span>
                      </p>
                      <p class="text-xs sm:text-sm text-gray-500">JPEG, PNG, JPG · 3MB per file</p>
                    </div>
                  </div>

                </label>

                <!-- File Input (Hidden) -->
                <input
                    hidden
                    type="file"
                    id="IdProoffileupload"
                    name="IdProoffileupload[]"
                    accept="image/jpeg, image/png, image/jpg"
                    @change="handleFileSelect"
                />

                <!-- Validation Error -->
                <p v-if="errors.selectedFiles" class="text-sm text-red-500 mt-2">{{ errors.selectedFiles }}</p>

                <!-- Preview -->
                <div v-if="selectedFile" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div class="bg-[#1f2937] p-4 rounded-lg relative shadow-md flex flex-col">
                    <img
                        :src="selectedFile.preview"
                        alt="Preview"
                        class="w-full h-40 object-contain bg-black rounded mb-2"
                    />
                    <div class="text-sm text-white truncate">{{ selectedFile.name }}</div>
                    <div class="text-xs text-gray-400">
                      {{ getFileExtension(selectedFile.name) }}, {{ formatFileSize(selectedFile.size) }}
                    </div>
                    <button
                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        @click="deleteFile"
                        aria-label="Remove file"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>

              </div>

            </div>


            <!-- Continue Button BTC-->
            <div class="flex justify-center">
              <button v-if="selectedPaymentMethod==15&&!btc_screen2"
                      @click="validateAndContinue"
                      class="common-btn-item cbi-fill inline-block"
              >
                Continue
              </button>

              <div v-if="btc_screen2" class="mt-2 flex justify-center">
                <!--                <button @click="validateAndContinuewithAttachment"
                                        class="common-btn-item cbi-fill">
                                  Deposit
                                </button>-->

                <GradientButton
                    :loading="isBTCSubmitBtnLoading"
                    :disabled="isBTCSubmitBtnLoading"
                    default-text="DEPOSIT"
                    loading-text="Saving..."
                    @click="validateAndContinuewithAttachment"
                />
              </div>

            </div>


            <!-- Continue Button BANK-->
            <div v-if="selectedPaymentMethod==16" class="flex justify-center" style="margin-top: -1px;">
              <button v-if="selectedPaymentMethod==16&&!bank_screen2"
                      @click="continueBank"
                      class="common-btn-item cbi-fill inline-block"
              >
                CONTINUE
              </button>

              <div v-if="bank_screen2" class="flex justify-center">
                <!--                <button @click="validateAndContinuewithAttachment"
                                        class="common-btn-item cbi-fill">
                                  Deposit
                                </button>-->

                <GradientButton
                    :loading="isSubmitBtnLoading"
                    :disabled="isSubmitBtnLoading"
                    default-text="DEPOSIT"
                    loading-text="Saving..."
                    @click="validateAndContinuewithAttachment"
                />
              </div>

            </div>

            <!-- PAY Button BTC AND VISA  MASTER-->

            <!-- PAY89 START-->
            <div v-if="selectedPaymentMethod==32" class="pb-28">
              <Pay89DepositComponent :selectedPaymentMethod="selectedPaymentMethod" :accountList="accountList"/>
            </div>
            <!-- PAY89 END  -->

          </div>
        </div>

      </div>


      <!-- Modal -->
      <div
          v-if="showPopup && !isagreed"
          class="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      >
        <div
            class="bg-[#111827] text-white max-w-lg w-full p-6 rounded-xl shadow-lg relative"
        >
          <!-- Top Left Close Button -->
          <!-- Top Right Close Button -->
          <button style="margin-right: -20px;margin-top: -25px;"
                  @click="showPopup = false"
                  class="absolute top-4 right-4 text-gray-400 hover:text-white transition bg-blue-950 border rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>


          <!-- Modal Content -->
          <h2 class="text-lg font-bold mb-4">
            Dear client, please carefully read the following rules before making your deposit,
          </h2>
          <ul class="list-decimal ml-5 text-sm space-y-3 text-gray-300">
            <li>
              Every time you make a deposit, please obtain the deposit information through the <strong>deposit Merchant
              Page</strong>. Please do not transfer funds to the old account or address, as the old account or address
              may become <strong>invalid and unable to recover the funds</strong>.
            </li>
            <li>
              It is not allowed to use someone else's bank information for remittance, as it may result in the <strong>inability
              to receive the funds</strong>.
            </li>
            <li>
              The deposit amount needs to be consistent with the order amount to <strong>avoid delays in receiving the
              deposit</strong>.
            </li>
            <li>
              Please note that there may be <strong>some delays in processing deposits and withdrawals due to the
              end-of-financial-year procedures</strong>.
            </li>
          </ul>
          <div class="text-center mt-6">
            <button @click="isagreed = true" class="common-btn-item cbi-fill mx-auto mb-4"><span>I AGREE</span></button>
          </div>
        </div>
      </div>


       <Dialog :open="showStatusPop" @close="showStatusPop = false">
  <Dialog.Panel class="w-full max-w-md bg-[#1f1f1f] text-white rounded-lg p-6">
    <Dialog.Title class="text-lg font-semibold">Access Denied</Dialog.Title>
    <Dialog.Description class="mt-2">
      You are currently blocked from creating deposits . Please contact support.
    </Dialog.Description>
    <div class="mt-4 text-right">
      <Button @click="showStatusPop = false">OK</Button>
    </div>
  </Dialog.Panel>
</Dialog>
    </div>


  </div>
  <!-- Success Modal -->
  <Dialog :open="successModalVisible" @close="() => (successModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success"/>
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
<style scoped>
/* Optional glow effect */
.payment-method-card:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  border-color: rgba(59, 130, 246, 1);
}

.common-btn-item.cbi-fill {
  background: linear-gradient(90deg, #00d5ff66, #007bff66);
  border-color: #00d5ff80;
}

.common-btn-item {
  align-items: center;
  border: 1px solid #0000;
  border-radius: 54px;
  color: #d2e5f1;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  height: 36px;
  justify-content: center;
  min-width: 100px;
  padding: 0 12px;
  position: relative;
  transition: all .3s ease-in-out;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
}

.common-tabs-bx.ctb-style-2.ctb-s2-big .ctb-item {
  background: var(--black-200);
  color: var(--celeste);
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  margin: 0;
  padding: 0 16px;
  text-align: center;
}

.common-tabs-bx.ctb-style-2 .ctb-item {
  border: 1px solid #0000;
  border-radius: 50px;
  font-size: 14px;
  margin: 0 5px;
  overflow: hidden;
  padding: 6px 10px;
  z-index: 1;
}

.common-tabs-bx .ctb-item {
  color: var(--celeste-600);
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 15px;
  position: relative;
  transition: all .3s ease-in-out;
}

</style>