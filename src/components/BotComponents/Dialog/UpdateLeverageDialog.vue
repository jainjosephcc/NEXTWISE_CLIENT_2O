<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import apiClient from "../../../services/apiService";
import LoadingIcon from "@/components/Base/LoadingIcon";

// Props to control the modal state
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  accountDetails:{
    type:Object,
    required:true,
  }
});

// Emit event to notify parent of close action
const emit = defineEmits(["close"]);

// State for categories and loading
const isLoading = ref(false); // Loading state for better UX
const leverageList=ref([])
const isSelected=ref(false)
const errorModalVisible = ref(false);
const errorMessage = ref('');

// Fetch categories from API
const fetchData = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get("/live-account/form-data");
    leverageList.value=response.data.result.leverage
    
  } catch (error) {
    console.error("Error updating leverage:", error.response?.data || error);
    errorMessage.value = error.response?.data?.message || "An unexpected error occurred. Please try again.";
    errorModalVisible.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Fetch categories on component mount
onMounted(fetchData);

// State for form fields
const selectedLeverage = ref(""); // Bind to the selected category

// State for success modal
const successModalPreview = ref(false);
const isBtnLoading=ref(false)

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
  let parsedData=null;
  const userData = localStorage.getItem('userData');
    if (userData) {
    parsedData = JSON.parse(userData); // Parse the string to JSON
} else {
    //console.log('No userData found in localStorage');
}

  try {
    isBtnLoading.value=true
    // Call the ticket creation API
    const response = await apiClient.post("live-account/update-leverage", {
      mt_id: props.accountDetails.mt_id, // Pass the selected category ID
      leverage: selectedLeverage.value, // Pass the typed message
    });
    successModalPreview.value = true; // Show success modalaler
    closeDialog(); // Close the main modal after successful submission
  } catch (error) {
    console.error("Error creating account:", error.response?.data || error);
    errorMessage.value = error.response?.data?.message || "An unexpected error occurred. Please try again.";
    errorModalVisible.value = true;
  }
  finally{
    isBtnLoading.value=false
  }
};

const selectedGroupId=ref(null)

function handleRefresh(){
  successModalPreview.value = false;
   window.location.reload();
}
</script>

<template>
  <!-- Main Ticket Creation Modal -->
  <Dialog size="lg"
    :open="open"
    @close="closeDialog"
    class="fixed inset-0 flex items-center justify-center bg-black/50"
  >
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-full sm:w-48rem max-w-[90%] sm:auto max-h-full sm:max-h-[90vh] overflow-y-auto p-6">
      <!-- Close Button -->
      <button
        type="button"
        class="absolute top-3 right-3 focus:outline-none"
        @click="closeDialog"
      >
        <Lucide icon="X" class="w-6 h-6 text-slate-400" />
      </button>

      <!-- Modal Title -->
      <div class="text-center mb-4">
        <h2 class="text-xl font-semibold">Update Leverage</h2>
      </div>
      <div class="mb-4 mt-4 ml-3">
        <span class="text-sm font-medium">
          Selected Leverage: 1:{{ accountDetails.leverage }}
        </span>
      </div>


      <!-- Modal Content -->
      <div class="space-y-4 ml-3">
        <!-- Select Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">
            Choose Leverage
          </label>
          <select
            id="category"
            v-model="selectedLeverage"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-600"
            :disabled="isLoading"
          >
            <option value="" disabled>Select a leverage</option>
            <option
              v-for="leverage in leverageList"
              :key="leverage.leverage"
              :value="leverage.leverage"
            >
             1: {{ leverage.leverage }}
            </option>
          </select>
          <p v-if="isLoading" class="text-sm text-gray-500 mt-2">Loading levreages...</p>
        </div>

      </div>
      <div class="mt-6 ml-3 text-xs leading-tight">
        <span>
          Before proceeding, it's crucial to acknowledge the significant risks associated with high leverage. There's a possibility of sustaining losses exceeding the capital deposited. Please ensure that there are no open positions or pending orders before making any changes to this parameter. Your awareness and caution are essential to safeguard your investments.
        </span>
      </div>

      <div class="mt-6 ml-3">
        <label class="flex items-center space-x-4">
          <input type="checkbox" v-model="isSelected" />
          <span>I have read and agreed to the terms and conditions.</span>
        </label>
      </div>



      <!-- Action Buttons -->
      <div class="mt-6 text-right space-x-2">
        <Button
          type="button"
          variant="outline-secondary"
          @click="closeDialog"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          @click="handleSubmit"
          :disabled="!selectedLeverage || !isSelected"
        >
        <template v-if="isBtnLoading">
          Updating
          <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
        </template>
        <template v-else>
          Update Leverage
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
          Leverage Updated Successfully!
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
