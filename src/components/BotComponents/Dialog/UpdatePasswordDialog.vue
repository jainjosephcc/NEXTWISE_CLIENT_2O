<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import apiClient from "../../../services/apiService";
import LoadingIcon from "@/components/Base/LoadingIcon";

// Props
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  accountDetails: {
    type: Object,
    required: true,
  },
});

// Emit
const emit = defineEmits(["close"]);

// Reactive States
const isBtnLoading = ref(false);
const successModalPreview = ref(false);
const selectedRole = ref<string | null>(null);
const selectedLeverage = ref<string | null>(null);
const selectedGroupId = ref<string | null>(null);
const password = ref<string>("");
const confirmPassword = ref<string>("");
const passwordMismatch = ref<boolean>(false);

const errorModalVisible = ref(false); // Controls visibility of the error modal
const errorMessage = ref(""); // Stores the error message

const closeErrorModal = () => {
  errorModalVisible.value = false;
};

const showErrorModal = (message: string) => {
  errorMessage.value = message;
  errorModalVisible.value = true;
};

// Password validation conditions
const passwordConditions = ref([
  { valid: false, message: "Minimum 8 characters", regex: /.{8,}/ },
  { valid: false, message: "At least 1 uppercase letter", regex: /[A-Z]/ },
  { valid: false, message: "At least 1 lowercase letter", regex: /[a-z]/ },
  { valid: false, message: "At least 1 special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  { valid: false, message: "At least 1 digit", regex: /[0-9]/ },
]);

// Methods
const closeDialog = () => {
  emit("close");
};

const validatePassword = () => {
  passwordConditions.value.forEach((condition) => {
    condition.valid = condition.regex.test(password.value);
  });
  validateConfirmPassword();
};

const validateConfirmPassword = () => {
  passwordMismatch.value = password.value !== confirmPassword.value;
};

const handleSubmit = async () => {
  if (!password.value || !selectedRole.value) {
    showErrorModal("Validation failed: Missing required inputs.");
    return;
  }

  try {
    isBtnLoading.value = true;
    const response = await apiClient.post("/live-account/update-password", {
      type: selectedRole.value,
      mt_id: props.accountDetails.mt_id,
      password: password.value,
    });
    successModalPreview.value = true;
    closeDialog();
  } catch (error) {
    console.error("Error updating password:", error.response?.data || error);
    showErrorModal(
      error.response?.data?.message || "Error updating password. Please try again."
    );
  } finally {
    isBtnLoading.value = false;
  }
};

const handleRefresh = () => {
  successModalPreview.value = false;
  window.location.reload();
};
</script>

<template>
  <!-- Main Modal -->
  <Dialog
  size="lg"
  :open="open"
  @close="closeDialog"
  class="fixed inset-0 flex items-center justify-center bg-black/50"
>
  <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-full sm:w-48rem max-w-[90%] sm:auto max-h-full sm:max-h-[90vh] overflow-y-auto p-6">
    <button
      type="button"
      class="absolute top-3 right-3 focus:outline-none"
      @click="closeDialog"
    >
      <Lucide icon="X" class="w-6 h-6 text-slate-400" />
    </button>

    <div class="text-center mb-4">
        <h2 class="text-xl font-semibold">Update Account Password</h2>
      </div>

      <div class="mb-4 mt-4 ml-3">
        <span class="text-sm font-medium flex items-center">
          MT5 Account:
          <span class="ml-4 group flex items-center text-sm font-medium rounded-lg border px-4 py-2">
            MT {{ accountDetails?.mt_id }}
          </span>
        </span>
      </div>

      <div class="mt-6 ml-3 text-xs">
        You have the ability to update your Investor and Master passwords for your trading accounts here. If you require any assistance or encounter any challenges with password management, please don't hesitate to reach out to us for support.
      </div>

      <div class="flex space-x-4 mt-4">
        <div class="w-1/2 border rounded-lg shadow p-4">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="selectedRole" value="INVESTOR" />
            <span class="text-sm font-medium">Investor Password</span>
          </label>
        </div>
        <div class="w-1/2 border rounded-lg shadow p-4">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="selectedRole" value="MAIN" />
            <span class="text-sm font-medium">Master Password</span>
          </label>
        </div>
      </div>

      <div class="space-y-4 mt-4">
        <div>
          <label class="block font-medium mb-2">New Password</label>
          <input
            type="password"
            v-model="password"
            @input="validatePassword"
            placeholder="Password"
            class="border p-2 rounded w-full bg-cyan-950"
          />
          <ul class="mt-2 grid grid-cols-2 gap-2 text-sm">
            <li
                v-for="(condition, key) in passwordConditions"
                :key="key"
                class="flex items-center"
            >
                <Lucide
                :icon="condition.valid ? 'CheckCircle' : 'XCircle'"
                :class="condition.valid ? 'text-green-500' : 'text-red-500'"
                class="w-4 h-4"
                />
                <span class="ml-2">{{ condition.message }}</span>
            </li>
            </ul>

        </div>

        <div>
          <label class="block font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            v-model="confirmPassword"
            @input="validateConfirmPassword"
            placeholder="Password"
            class="border p-2 rounded w-full bg-cyan-950"
          />
          <p
            v-if="passwordMismatch"
            class="text-red-500 text-sm mt-2 flex items-center"
          >
            <Lucide icon="XCircle" class="w-4 h-4 mr-2" /> Passwords do not
            match
          </p>
        </div>
      </div>

      <div class="mt-6 text-right space-x-2">
        <Button type="button" variant="outline-secondary" @click="closeDialog">
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          @click="handleSubmit"
          :disabled="isBtnLoading || !selectedRole || passwordMismatch"
        >
          <template v-if="isBtnLoading">
            Updating
            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
          </template>
          <template v-else>
            Update Password
          </template>
        </Button>
      </div>
  </Dialog.Panel>
</Dialog>



  <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="handleRefresh">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide
          icon="CheckCircle"
          class="w-16 h-16 mx-auto mt-3 text-success"
        />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          Password Updated Successfully!
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh">
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Error Modal -->
  <Dialog :open="errorModalVisible" @close="closeErrorModal">
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
