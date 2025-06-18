<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import apiClient from "../../../services/apiService";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Alert from "@/components/Base/Alert";
import TinySlider from "@/components/Base/TinySlider";
import { FormCheck, FormInput, FormSelect, InputGroup } from "@/components/Base/Form";


// Props to control the modal state
defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  accountList: {
    type: Object,
    required: true,
  }
});

// Emit event to notify parent of close action
const emit = defineEmits(["close"]);

// State for categories and loading
const categories = ref([]); // To store fetched categories
const groupList = ref([]);
const leverageList = ref([]);
const selectedGroupId = ref(null);
const selectedLeverage = ref("");
const isLoading = ref(false);
const isBtnLoading = ref(false);
const errorModalVisible = ref(false);
const errorMessage = ref('');
const successModalPreview = ref(false);
const depositAmt=ref(null)

// Fetch categories from API
const fetchData = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get("/demo-account/form-data");
    groupList.value = response.data.result.demo_mt_groups
    leverageList.value = response.data.result.leverage
      if (groupList.value.length > 0 && !selectedGroupId.value) {
        selectedGroupId.value = groupList.value[0].id.toString();
      }
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch categories on component mount
onMounted(fetchData);


const message = ref(""); // Bind to the typed message


// Close the modal
const closeDialog = () => {
  emit("close");
};

// Handle form submission
const handleSubmit = async () => {

  // Validate inputs
  if (!selectedLeverage.value) {
    console.error("Validation failed: Please select a Leverage.");
    return;
  }
  if (!selectedGroupId.value) {
    console.error("Validation failed: Selected a group.");
    return;
  }
  let parsedData = null;
  const userData = localStorage.getItem('userData');
  if (userData) {
    parsedData = JSON.parse(userData); // Parse the string to JSON
  } else {
    //console.log('No userData found in localStorage');
  }

  try {
    isBtnLoading.value = true
    // Call the ticket creation API
    const response = await apiClient.post("/demo-account/create", {
        amount: depositAmt.value,
      group_id: selectedGroupId.value, // Pass the selected category ID
      leverage: selectedLeverage.value, // Pass the typed message
    });
    successModalPreview.value = true; // Show success modalaler
    closeDialog(); // Close the main modal after successful submission
  } catch (error) {
    console.error("Error creating account:", error.response?.data || error);
    errorMessage.value = error.response?.data?.message || "An unexpected error occurred. Please try again.";
    errorModalVisible.value = true;
  }
  finally {
    isBtnLoading.value = false
  }
};

function selectGroup(groupId) {
  selectedGroupId.value = groupId.toString(); // Ensure consistent type
  //console.log('Selected Group ID:', selectedGroupId.value);
}


function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}
</script>

<template>
  <!-- Main Ticket Creation Modal -->
  <Dialog size="lg" :open="open" @close="closeDialog"
    class="fixed inset-0 flex items-center justify-center bg-black/50">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-full sm:w-48rem max-w-[90%] sm:auto max-h-full sm:max-h-[90vh] overflow-y-auto p-6">
      <!-- Close Button -->
      <button type="button" class="absolute top-3 right-3 focus:outline-none" @click="closeDialog">
        <Lucide icon="X" class="w-6 h-6 text-slate-400" />
      </button>

      <!-- Modal Title -->
      <div class="text-center mb-4">
        <h2 class="text-xl font-semibold"> Create Demo Account</h2>
      </div>

      <div v-if="accountList.length >= 3" class="mb-2">
        <Alert variant="soft-pending" class="flex items-center">
          <Lucide icon="AlertTriangle" class="w-24 h-24 mr-2" />
          Please note that you have already created 3 Demo MT5 Trading accounts. Should you require additional accounts,
          we kindly request you to connect with our dedicated support team.
          Thank you for your understanding and cooperation.
        </Alert>
      </div>
      <!-- Modal Content -->
      <div class="space-y-4">
        <!--Select Group-->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">
            Choose Account Type
          </label>
          <div class="mt-3.5">
            <div class="flex flex-wrap">
              <!-- Loop through groupList -->
              <div v-for="group in groupList" :key="group.id" class="pb-4 pr-4">
                <div
                    class="relative w-64 h-35 p-4 box box--stacked rounded-md shadow-sm cursor-pointer border"
                    :class="{
    'border-primary border-2 ring-2 ring-blue-500': selectedGroupId == group.id,
    'hover:border-blue-300': selectedGroupId !== group.id
  }"
                    @click="selectGroup(group.id)"
                >
                  <!-- Header section with category name -->
                  <div class="flex items-center">
                    <div class="text-base font-medium">{{ group.group_category }}</div>
                  </div>

                  <!-- Additional details about the category -->
                  <div class="mt-2">
                    <div class="text-slate-500 text-sm">Deposit & Trade</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
        <!-- Select Leverage -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">
            Choose Leverage
          </label>
          <select id="category" v-model="selectedLeverage"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                  :disabled="isLoading">
            <option value="" disabled> {{ $t('livemt5account.selectaLeverage') }} </option>
            <option v-for="leverage in leverageList" :key="leverage.leverage" :value="leverage.leverage">
              1: {{ leverage.leverage }}
            </option>
          </select>
          <p v-if="isLoading" class="text-sm text-gray-500 mt-2">{{ $t('livemt5account.loadingLevreages') }}</p>
        </div>
        <p v-if="isLoading" class="text-sm text-gray-500 mt-2">{{ $t('livemt5account.loadingLevreages') }}</p>
        <!-- Select Leverage -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">
            Amount to be deposited in Demo Account 
          </label>
          <div class="flex justify-between items-center">
            <div class="flex flex-col flex-wrap w-full sm:items-start sm:flex-row gap-y-1">
                <!-- Input field with prefix $ and suffix .00 -->
                <InputGroup class="w-full mt-2 rounded-[0.5rem]">
                <InputGroup.Text>$</InputGroup.Text>
                <FormInput type="number" placeholder="Deposit Amount" v-model="depositAmt"
                            aria-label="Amount (to the nearest dollar)" />
                <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
            </div>
          </div>   
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 text-right space-x-2">
        <Button type="button" variant="outline-secondary" @click="closeDialog">
          Cancel
        </Button>
        <Button type="button" variant="primary" @click="handleSubmit"
          :disabled="!selectedGroupId || !selectedLeverage || accountList.length >= 3||!depositAmt">
          <template v-if="isBtnLoading">
            Creating
            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
          </template>
          <template v-else>
            Create Account
          </template>
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          Demo Account Created Successfully!
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
</template>
