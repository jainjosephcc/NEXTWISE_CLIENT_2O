<script setup lang="ts">
import { FormCheck, FormInput, FormLabel } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import _ from "lodash";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useRouter } from "vue-router";
import {ref, computed, watch, onMounted} from 'vue';
import 'vue3-tel-input/dist/vue3-tel-input.css'
import LoadingIcon from "@/components/Base/LoadingIcon";
import Lucide from "@/components/Base/Lucide";
import apiClient from '../services/apiService';
import Dialog from "@/components/Base/Headless/Dialog/Dialog.vue";
import { logout } from "@/services/authService";
import AuthSliders from "@/assets/AuthSliders.vue";
import LogoChip from "@/assets/LogoChip.vue";

const projectName = import.meta.env.VITE_PROJECT_NAME;
const router = useRouter();
const isLoading = ref(false);
const isOTPVisible = ref(false);
const isLogoutLoading = ref(false);
const isEmailValid = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const buttonText = ref("SEND OTP");
const errors = ref({
  email: "",
  otp: "",
  password: "",
  confirmPassword: "",
});



const fields = ref(6); // Array to store OTP digits
const emit = defineEmits(["update:modelValue"]);

// Reactive state for OTP data and the first input element reference
const data = ref(Array(fields.value).fill(""));
const firstInputEl = ref<HTMLInputElement[]>([]);

const warningModalPreview = ref(false);
const dialogMessage = ref("Something went wrong!");

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

// Handle user input and focus navigation
const handleOtpInput = (e: InputEvent) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;

  // Move to next input if a value is entered
  if (value && target.nextElementSibling instanceof HTMLInputElement) {
    target.nextElementSibling.focus();
  }
  // Move to previous input if Backspace is pressed
  else if (!value && e.inputType === "deleteContentBackward" && target.previousElementSibling instanceof HTMLInputElement) {
    target.previousElementSibling.focus();
  }
};

// Handle pasting into the OTP fields
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pasteData = e.clipboardData?.getData("text") || "";
  const otpArray = pasteData.slice(0, fields.value).split("");

  otpArray.forEach((value, index) => {
    if (firstInputEl.value[index]) {
      data.value[index] = value;
    }
  });

  // Focus on the next empty input after pasting
  const nextEmptyIndex = otpArray.findIndex((_, index) => index > otpArray.length - 1);
  if (nextEmptyIndex >= 0 && firstInputEl.value[nextEmptyIndex]) {
    firstInputEl.value[nextEmptyIndex].focus();
  }
};

// Ensure focus on the first input on mount
onMounted(() => {
  if (firstInputEl.value[0]) {
    firstInputEl.value[0].focus();
  }
});

const logoutModalPreview = ref(false);
const openLogoutModal = () => {
  logoutModalPreview.value = true;
};
const closeLogoutModal = () => {
  logoutModalPreview.value = false;
};

const closeWarningModal = () => {
  warningModalPreview.value = false;
};

// Submits the OTP
const handleButtonSubmit = async () => {
  if(buttonText.value=='SEND OTP'){
    isLoading.value = true;
    if (!email.value) {
      errors.value.email = "Email is required";
      isEmailValid.value = false;
    }
    else if (!/\S+@\S+\.\S+/.test(email.value)) {
      errors.value.email = "Invalid email format";
      isEmailValid.value = false;
    }
    else {
      errors.value.email = "";
      isEmailValid.value=true;
    }
    if(isEmailValid.value){
      try {
        const response = await apiClient.post("/profile/passupdate-send-otp", { email: email.value });
        console.log("OTP Verification successful:", response);

        if (response.status === 200) {
          console.log("OTP shared successfully:", response.data);
          isOTPVisible.value=true;
          buttonText.value='UPDATE PASSWORD';
        }
      } catch (error: any) {
        //console.error("OTP verification failed:", error.response?.data || error.message);
        dialogMessage.value =error.response?.data?.message;
        warningModalPreview.value = true;
        //alert(error.response?.data?.message || "Failed to verify OTP");
      } finally {
        isLoading.value = false;
      }
    }
    else {
      dialogMessage.value ="Please enter a valid email id";
      warningModalPreview.value = true;
      isLoading.value = false;
    }
  }
  else{
    const otpValue = data.value.join("");
    if (otpValue.length !== fields.value) {
      errors.value.otp = "Please enter a valid 6-digit OTP.";
      return;
    }
    errors.value.otp = "";

    // Validate Passwords
    if (!password.value) {
      errors.value.password = "Password is required.";
      return;
    }
    if (password.value.length < 8) {
      errors.value.password = "Password must be at least 8 characters.";
      return;
    }
    if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = "Passwords do not match.";
      return;
    }
    errors.value.password = "";
    errors.value.confirmPassword = "";

    // Submit API Call
    isLoading.value = true;
    try {
      const response = await apiClient.post("/profile/reset-pass/validate-email", {
        email: email.value,
        otp: otpValue,
        password: password.value,
      });
      if (response.status === 200) {
        alert("Password updated successfully!");
        router.push("/login"); // Redirect to login page
      }
    } catch (error) {
      dialogMessage.value = error.response?.data?.message || "Failed to update password.";
      warningModalPreview.value = true;
    } finally {
      isLoading.value = false;
    }
  }


};

const handleLogout = async () => {
  isLogoutLoading.value = true;
  try {
    await logout(); // Call the logout API
    router.push("/login"); // Redirect to login page after successful logout
  } catch (error) {
    console.error("Logout Error:", error);
    router.push("/login");
  } finally {
    isLogoutLoading.value = false; // Reset loading state
    closeLogoutModal(); // Close the modal
  }
};

</script>

<template>
  <section
      class="relative bg-gray-50 dark:bg-stone-950 min-h-screen flex items-center justify-center"
  >

    <!-- Centered Card -->
    <div class="w-full max-w-md mx-auto bg-gradient-to-br from-[#24262d] to-[#181a22] rounded-2xl shadow-2xl px-7 py-12 relative z-10 border border-[#262a32]/50 backdrop-blur-md">
      <div class="flex flex-col items-center justify-center">
        <img src="/logo_wide.svg" class="w-44 content-center pb-10">

        <div class="text-2xl font-semibold text-white mb-1">
          <span v-if="!isOTPVisible">Forgot Password</span>
          <span v-else>OTP Verification</span>
        </div>
        <div class="text-sm text-slate-400 mb-8 text-center">
          <span v-if="!isOTPVisible">
            Enter your email address and we’ll send you an OTP to reset your password.
          </span>
          <span v-else>
            Enter the 6-digit OTP sent to your email and set your new password.
          </span>
        </div>

        <form @submit.prevent="handleButtonSubmit" class="w-full space-y-5">
          <!-- Email Field -->
          <div v-if="!isOTPVisible">
            <FormLabel class="text-xs text-slate-300">Email*</FormLabel>
            <FormInput
                v-model="email"
                type="text"
                class="block w-full px-4 py-3 rounded-xl border-0 bg-[#22232a] text-white focus:ring-2 focus:ring-[#c59d4c] transition"
                :class="{'border-red-500': errors.email}"
                autocomplete="username"
                autofocus
            />
            <div class="text-xs text-red-500 mt-1 min-h-[18px]">{{ errors.email }}</div>
          </div>

          <!-- OTP & Password Fields -->
          <div v-if="isOTPVisible">
            <div class="flex justify-center gap-3 mb-2">
              <input
                  v-for="(field, idx) in fields"
                  :key="idx"
                  v-model="data[idx]"
                  ref="firstInputEl"
                  maxlength="1"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  class="otp-input bg-[#22232a] border border-slate-700 w-12 h-12 text-center text-lg font-semibold rounded-lg text-white outline-none focus:ring-2 focus:ring-[#c59d4c] transition"
                  @input="handleOtpInput"
                  @paste="idx === 0 && handlePaste($event)"
                  autocomplete="one-time-code"
              />
            </div>
            <div class="text-xs text-red-500 mt-1 min-h-[18px] text-center">{{ errors.otp }}</div>

            <FormLabel class="text-xs text-slate-300 mt-3">Password*</FormLabel>
            <FormInput
                v-model="password"
                type="password"
                class="block w-full px-4 py-3 rounded-xl border-0 bg-[#22232a] text-white focus:ring-2 focus:ring-[#c59d4c] transition"
                autocomplete="new-password"
                placeholder="************"
            />
            <div class="text-xs text-red-500 mt-1 min-h-[18px]">{{ errors.password }}</div>

            <FormLabel class="text-xs text-slate-300 mt-3">Confirm Password*</FormLabel>
            <FormInput
                v-model="confirmPassword"
                type="password"
                class="block w-full px-4 py-3 rounded-xl border-0 bg-[#22232a] text-white focus:ring-2 focus:ring-[#c59d4c] transition"
                autocomplete="new-password"
                placeholder="************"
            />
            <div class="text-xs text-red-500 mt-1 min-h-[18px]">{{ errors.confirmPassword }}</div>
          </div>

          <!-- Submit Button -->
          <button
              :disabled="isLoading"
              type="submit"
              class="w-full bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-3 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center mt-2"
          >
            <span v-if="!isLoading">{{ buttonText }}</span>
            <span v-else>
              <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span>
                {{ buttonText === 'SEND OTP' ? 'SENDING...' : 'SAVING...' }}
              </span>
            </span>
          </button>
        </form>

        <button
            @click="router.push('/login')"
            class="bg-white dark:bg-gray-700 border dark:border-gray-600 py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74] dark:text-gray-200"
        >
          <!-- Google Icon -->

          BACK TO LOGIN
        </button>
      </div>
    </div>
    <!-- Warning Modal -->
    <Dialog :open="warningModalPreview" @close="closeWarningModal">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-warning" />
          <div class="mt-5 text-3xl">Oops...</div>
          <div class="mt-2 text-slate-500">Something went wrong!</div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button type="button" variant="primary" @click="closeWarningModal" class="w-24">Ok</Button>
        </div>
        <div class="p-5 text-center border-t border-slate-200/60 dark:border-darkmode-400">
          <span class="text-warning">{{ dialogMessage }}</span>
        </div>
      </Dialog.Panel>
    </Dialog>
  </section>
</template>

<style scoped>
.otp-input::-webkit-input-placeholder { color: #b3b3b3; }
.otp-input:-ms-input-placeholder { color: #b3b3b3; }
.otp-input::placeholder { color: #b3b3b3; }
</style>
