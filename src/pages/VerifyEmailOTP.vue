<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, watch, onMounted } from 'vue';
import LoadingIcon from "@/components/Base/LoadingIcon";
import Lucide from "@/components/Base/Lucide";
import apiClient from '../services/apiService';
import Dialog from "@/components/Base/Headless/Dialog/Dialog.vue";
import { logout } from "@/services/authService";

const router = useRouter();
const isLoading = ref(false);
const isLogoutLoading = ref(false);
const fields = ref(6); // Number of OTP digits
const emit = defineEmits(["update:modelValue"]);

// Reactive state for OTP data and the input elements references
const data = ref(Array(fields.value).fill(""));
const inputRefs = ref<HTMLInputElement[]>([]);

const warningModalPreview = ref(false);
const dialogMessage = ref("Something went wrong!");
const logoutModalPreview = ref(false);

// Watch for OTP changes
watch(
    data,
    (newVal) => {
      const otpValue = newVal.join("");
      if (otpValue.length === fields.value && !otpValue.includes("")) {
        emit("update:modelValue", Number(otpValue));
      } else {
        emit("update:modelValue", null);
      }
    },
    { deep: true }
);

// Prevent back navigation
onMounted(() => {
  history.pushState(null, '', location.href);
  window.addEventListener('popstate', () => {
    history.pushState(null, '', location.href);
    handleLogout();
  });

  // Focus first input on mount
  if (inputRefs.value[0]) {
    inputRefs.value[0].focus();
  }
});

// Handle user input and focus navigation
const handleOtpInput = (e: InputEvent, index: number) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;

  // Only allow numeric input
  if (!/^\d*$/.test(value)) {
    target.value = data.value[index] = '';
    return;
  }

  data.value[index] = value;

  // Move to next input if a value is entered
  if (value && index < fields.value - 1 && inputRefs.value[index + 1]) {
    inputRefs.value[index + 1].focus();
  }

  // Auto-submit if all fields are filled
  if (data.value.every(digit => digit !== '') && data.value.join("").length === fields.value) {
    submitOTP();
  }
};

// Handle backspace key
const handleKeyDown = (index: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !data.value[index] && index > 0 && inputRefs.value[index - 1]) {
    inputRefs.value[index - 1].focus();
  }
};

// Handle pasting into the OTP fields
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pasteData = e.clipboardData?.getData("text") || "";
  const otpArray = pasteData.slice(0, fields.value).split("");

  otpArray.forEach((value, index) => {
    if (/^\d+$/.test(value) ){ // Only paste numbers
      data.value[index] = value;
      if (inputRefs.value[index]) {
        inputRefs.value[index].value = value;
      }
    }
  });

  // Focus on the next empty input after pasting
  const nextEmptyIndex = otpArray.findIndex((_, idx) => idx > otpArray.length - 1);
  if (nextEmptyIndex >= 0 && inputRefs.value[nextEmptyIndex]) {
    inputRefs.value[nextEmptyIndex].focus();
  } else if (otpArray.length === fields.value) {
    submitOTP();
  }
};

// Modal control functions
const openLogoutModal = () => logoutModalPreview.value = true;
const closeLogoutModal = () => logoutModalPreview.value = false;
const closeWarningModal = () => warningModalPreview.value = false;

// Submit OTP for verification
const submitOTP = async () => {
  isLoading.value = true;
  const otpValue = data.value.join("");

  if (otpValue.length === fields.value) {
    try {
      const response = await apiClient.post("/emailVerifyOTP", { otp: otpValue });

      if (response.status === 200 && response.data.status === true) {
        // OTP Verified Successfully
        router.push("/");
      } else {
        // OTP failed (like invalid, expired, etc.)
        dialogMessage.value = response.data?.message || "Failed to verify OTP.";
        warningModalPreview.value = true;
      }
    } catch (error: any) {
      dialogMessage.value = error.response?.data?.message || "OTP verification request failed.";
      warningModalPreview.value = true;
    } finally {
      isLoading.value = false;
    }
  } else {
    dialogMessage.value = "Please enter a 6-digit OTP.";
    warningModalPreview.value = true;
    isLoading.value = false;
  }
};

// Resend OTP
const resendOTP = async () => {
  try {
    const response = await apiClient.post("/resend-verification");
    if (response.status === 200) {
      dialogMessage.value = "New OTP has been sent to your email!";
      warningModalPreview.value = true;
      // Clear existing OTP
      data.value = Array(fields.value).fill("");
      if (inputRefs.value[0]) {
        inputRefs.value[0].focus();
      }
    }
  } catch (error: any) {
    dialogMessage.value = error.response?.data?.message || "Failed to resend OTP";
    warningModalPreview.value = true;
  }
};

// Handle logout
const handleLogout = async () => {
  isLogoutLoading.value = true;
  try {
    await logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout Error:", error);
    router.push("/login");
  } finally {
    isLogoutLoading.value = false;
    closeLogoutModal();
  }
};

const videoLoaded = ref(false);
</script>
<template>
  <section class="relative bg-gray-50 dark:bg-stone-950 min-h-screen flex items-center justify-center">
    <!-- Dark/Light Mode Toggle -->
    <button
        class="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
        @click="document.documentElement.classList.toggle('dark')"
    >
      <span class="text-yellow-300 dark:hidden">☀️</span>
      <span class="text-gray-800 hidden dark:inline">🌙</span>
    </button>

    <div class="bg-gray-100 dark:bg-custom-gradient-dark flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
      <!-- OTP Form Section -->
      <div class="md:w-1/2 px-4">
        <img src="/logo_wide.svg" class="w-44 content-center" />
        <h2 class="font-bold text-2xl text-[#002D74] dark:text-gray-200 pt-5">OTP VERIFICATION</h2>
        <p class="text-xs mt-4 text-[#002D74] dark:text-gray-400">
          Enter the One-Time Password sent to your email
        </p>

        <!-- OTP Inputs -->
        <form @submit.prevent="submitOTP" class="flex flex-col gap-4">
          <div class="flex justify-between gap-2 mt-8">
            <input
                v-for="(field, index) in fields"
                :key="index"
                ref="inputRefs"
                type="text"
                maxlength="1"
                inputmode="numeric"
                pattern="\d*"
                class="w-10 h-12 text-center rounded-xl border bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-xl font-mono focus:ring-2 focus:ring-[#c59d4c]"
                v-model="data[index]"
                @input="e => handleOtpInput(e, index)"
                @keydown="e => handleKeyDown(index, e)"
                @paste="index === 0 ? handlePaste($event) : null"
                autocomplete="one-time-code"
                :disabled="isLoading"
            />
          </div>

          <button
              type="submit"
              :disabled="isLoading"
              class="bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center mt-4"
          >
            <span v-if="!isLoading">VERIFY OTP</span>
            <span v-else>
    <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    VERIFYING...
  </span>
          </button>

        </form>

        <div class="mt-5 text-xs border-b border-[#002D74] dark:border-gray-600 py-4 text-[#002D74] dark:text-gray-200 flex justify-between">
          <span>Didn’t get the code?</span>
          <button
              type="button"
              @click="resendOTP"
              class="font-semibold underline ml-2 disabled:opacity-50"
              :disabled="isLoading"
          >
            Resend
          </button>
        </div>
        <div class="mt-3 text-xs flex justify-between items-center text-[#002D74] dark:text-gray-200">
          <p>Already verified?</p>
          <button
              @click="router.push('/login')"
              class="py-1 px-5 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg hover:scale-110 duration-300"
          >
            LOGIN
          </button>
        </div>
        <div class="mt-3 text-xs flex justify-end text-[#002D74] dark:text-gray-200">
          <button
              @click="openLogoutModal"
              class="flex items-center py-1 px-3 border rounded-lg hover:scale-110 duration-300"
              :disabled="isLogoutLoading"
          >
            <Lucide icon="Power" class="w-4 h-4 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <!-- Illustration Section -->
      <div class="md:block hidden w-1/2">
        <img
            class="rounded-2xl"
            src="/assets/login_banner.png"
            alt="Trading illustration"
        />
      </div>
    </div>

    <!-- Warning Modal -->
    <Dialog :open="warningModalPreview" @close="closeWarningModal">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="AlertCircle" class="w-16 h-16 mx-auto mt-3 text-warning" />
          <div class="mt-5 text-3xl"> {{ dialogMessage }}</div>
          <div class="mt-2 text-slate-500"></div>
        </div>
        <div class="px-5 pb-8 text-center">
        </div>
        <div class="p-5 text-center border-t border-slate-200/60 dark:border-darkmode-400">
          <span class="text-warning">
          <button type="button" class="w-24 btn btn-primary" @click="closeWarningModal">Ok</button>
          </span>
        </div>
      </Dialog.Panel>
    </Dialog>

    <!-- Logout Modal -->
    <Dialog :open="logoutModalPreview" @close="closeLogoutModal">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Are you sure?</div>
          <div class="mt-2 text-slate-500">
            Do you really want to log out?<br />This will end your current session.
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <button size="sm" type="button" class="w-24 btn btn-outline-secondary mr-1" @click="closeLogoutModal">
            Cancel
          </button>
          <button
              :disabled="isLogoutLoading"
              size="sm"
              type="button"
              class="w-24 btn btn-danger"
              @click="handleLogout"
          >
            <span v-if="isLogoutLoading">
              <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" /> Loading...
            </span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  </section>
</template>

<!-- You can add/adjust any custom gradient classes to match your dark mode bg -->

<style scoped>
/* Custom styles for OTP inputs */
input[autocomplete="one-time-code"]::-webkit-input-placeholder { color: #aaa; text-align: center; }
input[autocomplete="one-time-code"]:-moz-placeholder { color: #aaa; text-align: center; }
input[autocomplete="one-time-code"]::-moz-placeholder { color: #aaa; text-align: center; }
input[autocomplete="one-time-code"]:-ms-input-placeholder { color: #aaa; text-align: center; }
</style>

