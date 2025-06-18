<script setup lang="ts">
import { FormCheck, FormInput, FormLabel } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import _ from "lodash";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { LocationQueryValue, useRoute, useRouter } from "vue-router";
import { ref, computed, watch, onMounted } from 'vue';
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
const email = ref('');
const password = ref("");
const confirmPassword = ref("");
const buttonText = ref("RESET & VERIFY");
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

const route = useRoute();

function getQueryParamAsString(value: LocationQueryValue | LocationQueryValue[] | null): string {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
}
// Ensure focus on the first input on mount
onMounted(() => {
  email.value = getQueryParamAsString(route.query.email);
  console.log("Email fetched:", email.value);
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
  if (buttonText.value == 'RESET & VERIFY') {
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
    <!-- Dark/Light Mode Toggle -->
    
    <div class="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/90 dark:bg-[#23262d] shadow-2xl relative z-10 border border-slate-200/40 dark:border-slate-700/40">
      <div class="flex flex-col items-center mb-6">
        <img src="/logo_wide.svg" class="w-44">
        <div class="text-xl font-bold tracking-wide text-center text-gray-800 dark:text-gray-100 mb-2 pt-5">
          Email Verification &amp; Password Reset
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
          For your account’s security, please enter the <b>OTP sent to your email</b> and set a new password.
        </div>
      </div>
      <form @submit.prevent="handleButtonSubmit">
        <div class="flex flex-col gap-4 mt-6">
          <!-- OTP Input -->
          <div class="flex flex-col items-center gap-1">
            <label class="text-xs text-slate-600 dark:text-slate-400 font-medium mb-2 tracking-wide">Enter OTP</label>
            <div class="flex justify-center gap-2">
              <template v-for="(field, index) in fields" :key="index">
                <input
                    v-model="data[index]"
                    ref="firstInputEl"
                    type="text"
                    maxlength="1"
                    autocomplete="one-time-code"
                    class="w-12 h-12 text-lg font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#23262d] shadow-inner text-center focus:ring-2 focus:ring-primary outline-none transition-all"
                    @input="handleOtpInput"
                    @focus="data[index]=''"
                    @keydown.tab.prevent="index < fields - 1 && firstInputEl[index + 1]?.focus()"
                    @paste="index === 0 && handlePaste($event)"
                />
              </template>
            </div>
            <div class="text-xs text-red-500 mt-1">{{ errors.otp }}</div>
          </div>
          <!-- Passwords -->
          <div>
            <FormLabel class="text-xs">New Password</FormLabel>
            <FormInput v-model="password" type="password"
                       class="block px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 w-full mt-1 text-sm"
                       placeholder="********" autocomplete="new-password"/>
            <div class="text-red-500 text-xs mt-1">{{ errors.password }}</div>
          </div>
          <div>
            <FormLabel class="text-xs">Confirm Password</FormLabel>
            <FormInput v-model="confirmPassword" type="password"
                       class="block px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 w-full mt-1 text-sm"
                       placeholder="********" autocomplete="new-password"/>
            <div class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</div>
          </div>
        </div>
        <!-- Button -->
        <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-8 bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center"
        >
          <span v-if="!isLoading">{{ buttonText }}</span>
          <span v-else>
            <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Saving...
          </span>
        </button>
        <!-- Back to Login -->

        <button
            @click="router.push('/login')"
            class="bg-white dark:bg-gray-700 border dark:border-gray-600 py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74] dark:text-gray-200"
        >
          <!-- Google Icon -->

          BACK TO LOGIN
        </button>
      </form>
    </div>

    <!-- Dialogs -->
    <Dialog :open="logoutModalPreview" @close="closeLogoutModal">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Are you sure?</div>
          <div class="mt-2 text-slate-500">
            Do you really want to log out?<br>This will end your current session.
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button size="sm" type="button" variant="outline-secondary" @click="closeLogoutModal" class="w-24 mr-1">
            Cancel
          </Button>
          <Button :disabled="isLogoutLoading" size="sm" type="button" variant="danger" class="w-24" @click="handleLogout">
            <template v-if="isLogoutLoading">
              Loading...
              <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
            </template>
            <template v-else>
              Confirm
            </template>
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <Dialog :open="warningModalPreview" @close="closeWarningModal">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-warning" />
          <div class="mt-5 text-3xl">Oops...</div>
          <div class="mt-2 text-slate-500">
            Something went wrong!
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button type="button" variant="primary" @click="closeWarningModal" class="w-24">
            Ok
          </Button>
        </div>
        <div class="p-5 text-center border-t border-slate-200/60 dark:border-darkmode-400">
          <span class="text-warning">
            {{ dialogMessage }}
          </span>
        </div>
      </Dialog.Panel>
    </Dialog>
  </section>
</template>



<style scoped>
/* Optionally add some CSS to adjust input width and alignment */
.text-center {
  text-align: center;
}

.w-12 {
  width: 3rem;
  /* Adjust input width as necessary */
}
</style>