<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import apiClient from "../../../services/apiService";
import LoadingIcon from "@/components/Base/LoadingIcon";

// Props to control the modal state
defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

// Emit event to notify parent of close action
const emit = defineEmits(["close"]);

// State for categories and loading
const categories = ref([]); // To store fetched categories
const isLoading = ref(false); // Loading state for better UX

// Fetch categories from API
const fetchCategory = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get("/ticket/category-list");
    categories.value = response.data?.result?.ticket_categories || []; // Extract ticket_categories
    console.log("Fetched categories:", categories.value);
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch categories on component mount
onMounted(fetchCategory);

// State for form fields
const selectedCategory = ref(""); // Bind to the selected category
const message = ref(""); // Bind to the typed message
const isBtnLoading = ref()
// State for success modal
const successModalPreview = ref(false);
const errorModalVisible = ref(false);
const errorMessage = ref('');
const error = ref('');
// Close the modal
const closeDialog = () => {
  emit("close");
};

// Handle form submission
const handleSubmit = async () => {
  // Validate inputs
  if (!selectedCategory.value) {
    console.error("Validation failed: Please select a category.");
    return;
  }
  if (!message.value.trim()) {
    console.error("Validation failed: Message cannot be empty.");
    return;
  }

  try {
    isBtnLoading.value = true
    // Call the ticket creation API
    const response = await apiClient.post("/ticket/create", {
      category_id: selectedCategory.value, // Pass the selected category ID
      message: message.value, // Pass the typed message
    });

    console.log("Ticket created successfully:", response.data);
    successModalPreview.value = true; // Show success modal
    closeDialog(); // Close the main modal after successful submission
  } catch (error) {
    console.error("Error creating ticket:", error.response?.data || error);
    errorModalVisible.value = true;

  }
};
function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}
</script>

<template>
  <!-- Main Ticket Creation Modal -->
  <Dialog :open="open" @close="closeDialog" class="fixed inset-0 flex items-center justify-center bg-black/50">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <!-- Close Button -->
      <button type="button" class="absolute top-3 right-3 focus:outline-none" @click="closeDialog">
        <Lucide icon="X" class="w-6 h-6 text-slate-400" />
      </button>

      <!-- Modal Title -->
      <div class="text-center mb-4">
        <h2 class="text-xl font-semibold">Create a Ticket</h2>
      </div>

      <!-- Modal Content -->
      <div class="space-y-4">
        <!-- Select Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-white">
            Select Category
          </label>
          <select id="category" v-model="selectedCategory"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
            :disabled="isLoading">
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.category }}
            </option>
          </select>
          <p v-if="isLoading" class="text-sm text-gray-500 mt-2">Loading categories...</p>
        </div>

        <!-- Type Message -->
        <div>
          <label for="message" class="block text-sm font-medium text-white">
            Type Message
          </label>
          <textarea id="message" v-model="message" rows="4"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Write your message here..."></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 text-right space-x-2">
        <Button type="button" variant="outline-secondary" @click="closeDialog">
          Cancel
        </Button>
        <Button type="button" variant="primary" @click="handleSubmit">
          <template v-if="isBtnLoading">
            Submitting
            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
          </template>
          <template v-else>
            Submit
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
          Ticket Created Successfully!
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
