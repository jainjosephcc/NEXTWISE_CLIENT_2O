<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { resetPassword } from '@/services/authService';
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import { FormCheck, FormInput, FormLabel } from "@/components/Base/Form";
import _ from "lodash";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Lucide from "@/components/Base/Lucide";

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const oldPasswordError = ref('');
const newPasswordError = ref('');
const confirmPasswordError = ref('');
const successMessage = ref('');
const errorMessage = ref('');
// State for success modal
const successModalPreview = ref(false);
const isBtnLoading = ref()
const errorModalVisible = ref(false);
// Emit event to notify parent of close action
const emit = defineEmits(["close"]);
// Close the modal
const closeDialog = () => {
  emit("close");
};
const validateInputs = () => {
  oldPasswordError.value = '';
  newPasswordError.value = '';
  confirmPasswordError.value = '';
  successMessage.value = '';
  errorMessage.value = '';

  if (!oldPassword.value) {
    oldPasswordError.value = 'Old password is required';
  }

  if (!newPassword.value) {
    newPasswordError.value = 'New password is required';
  } else if (newPassword.value.length < 8) {
    newPasswordError.value = 'New password must be at least 8 characters long';
  } else if (!/\d/.test(newPassword.value)) {
    newPasswordError.value = 'New password must include at least one numeric digit';
  }

  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your new password';
  } else if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match';
  }

  return !oldPasswordError.value && !newPasswordError.value && !confirmPasswordError.value;
};

const handleResetPassword = async () => {
  if (!validateInputs()) return;

  isBtnLoading.value = true;
  try {
    const payload = {
      old_password: oldPassword.value,
      password: newPassword.value,
      confirmPassword: confirmPassword.value,
    };

    const response = await resetPassword(payload);
    successMessage.value = response.message || 'Password successfully updated';
    successModalPreview.value = true; // Show success modalaler

    closeDialog(); // Close the main modal after successful submission
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Password reset failed';
    errorModalVisible.value = true;
  } finally {
    isBtnLoading.value = false;
  }
};

function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}
</script>

<template>
  <div class="flex flex-col p-5 box box--stacked">
    <div
      class="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]"
    >
      {{ $t('passwordReset.security')}}
    </div>
    <div>
      <!-- Old Password -->
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-64 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('passwordReset.oldPassword')}}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                {{ $t('profileinfo.required')}}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('passwordReset.currentPassword')}}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="password" placeholder="Enter your old password" v-model="oldPassword" class="w-full" />
          <div v-if="oldPasswordError" class="mt-1 text-red-500 text-xs">
            {{ oldPasswordError }}
          </div>
        </div>
      </div>

      <!-- New Password -->
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-64 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('passwordReset.newPassword')}}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                {{ $t('profileinfo.required')}}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('passwordReset.createNew')}}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="password" placeholder="Enter your new password" v-model="newPassword" class="w-full" />
          <div v-if="newPasswordError" class="mt-1 text-red-500 text-xs">
            {{ newPasswordError }}
          </div>
          <div class="mt-4 text-slate-500">
            <div class="font-medium">{{ $t('passwordReset.passwordRequirements:')}}</div>
            <ul
              class="flex flex-col gap-1 pl-3 mt-2.5 list-disc text-slate-500"
            >
              <li class="pl-0.5">
                {{ $t('passwordReset.passwordReq_1')}}
              </li>
              <li class="pl-0.5">
                {{ $t('passwordReset.passwordReq_2')}}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Confirm New Password -->
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-64 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('passwordReset.confirmNewpassword')}}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                {{ $t('profileinfo.required')}}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('passwordReset.reEnter')}}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="password" placeholder="Confirm your new password" v-model="confirmPassword" class="w-full" />
          <div v-if="confirmPasswordError" class="mt-1 text-red-500 text-xs">
            {{ confirmPasswordError }}
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div
      class="flex pt-5 mt-6 border-t border-dashed md:justify-end border-slate-300/70"
    >
      <Button
        variant="outline-primary"
        class="w-full px-4 common-btn-item cbi-fill md:w-auto"
        @click="handleResetPassword"
        :disabled="isBtnLoading"
      >
      <template v-if="isBtnLoading">
        {{ $t('passwordReset.saving')}}
        <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
      </template>
      <template  v-else>
        {{ $t('passwordReset.saveChanges')}}
      </template>
         
       
      </Button>
    </div>

  </div>
  <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          {{ $t('passwordReset.passwordSuccess')}}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          {{ $t('identityVerification.ok')}}
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
          {{ $t('identityVerification.ok')}}
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>



<style scoped>
.text-red-500 {
  color: red;
}

.text-green-500 {
  color: green;
}
</style>
