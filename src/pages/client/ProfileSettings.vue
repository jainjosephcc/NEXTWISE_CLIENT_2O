<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import {
  FormLabel,
  FormSelect,
} from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import Button from "@/components/Base/Button";
import { ref, watch, computed, onMounted } from "vue";
import { defineProps, defineEmits } from "vue";
import { Dialog } from "@/components/Base/Headless";
import ResetPasswordComponent from "@/components/BotComponents/ProfileSettings/ResetPasswordComponent.vue";
import ProfileDetailsComponet from "@/components/BotComponents/ProfileSettings/ProfileDetailsComponet.vue";
import PreferencesComponet from "@/components/BotComponents/ProfileSettings/PreferencesComponet.vue";
import TwofactorAuthComponet from "@/components/BotComponents/ProfileSettings/TwofactorAuthComponet.vue";
import DeviceHistoryComponet from "@/components/BotComponents/ProfileSettings/DeviceHistoryComponet.vue";
import NotificationComponet from "@/components/BotComponents/ProfileSettings/NotificationComponet.vue";
import ConnectedServiceComponet from "@/components/BotComponents/ProfileSettings/ConnectedServiceComponet.vue";
import SocialMediaComponet from "@/components/BotComponents/ProfileSettings/SocialMediaComponet.vue";
import DeactiveAccountComponet from "@/components/BotComponents/ProfileSettings/DeactiveAccountComponet.vue";
import IdentityVerification from "@/components/BotComponents/ProfileSettings/IdentityVerification.vue";
import ViewIdentityComponet from "@/components/BotComponents/ProfileSettings/ViewIdentityComponet.vue";
import AddBankDetailsComponet from "@/components/BotComponents/ProfileSettings/AddBankDetailsComponet.vue";
import apiClient from "../../services/apiService";
import { getS3Image } from '@/utils/S3';


import ViewBankDetailsComponet from "@/components/BotComponents/ProfileSettings/ViewBankDetailsComponet.vue";
import ComplainceComponent from "@/components/BotComponents/ProfileSettings/ComplainceComponent.vue";


// State Variables
import { useRoute } from 'vue-router'
import GradientButton from "@/components/Commons/GradientButton.vue";


const clientDetails = ref([]);
const clientDocs = ref([]);
const bankDetails = ref([]);
const showIdentityVerification = ref(false);
const showBankVerification = ref(false);
const bank = ref("");
const country = ref(""); // Country field added
const preview = ref<string | null>(null); // To store the preview URL
const selectedFile = ref<File | null>(null); // To store the selected file
const isLoading = ref(false); // To manage the loading state
const successMessage = ref<string | null>(null); // For success feedback
const errorMessage = ref<string | null>(null); // For error feedback
const errorModalVisible = ref(false);
const successModalPreview = ref(false);
const img_base_url = import.meta.env.VITE_S3_BASE;

const defaultCoverImage = "/user_img.png"; // Placeholder image
const emit = defineEmits(["close"]);


const route = useRoute();
const page = ref(route.query.page || null);


const showReUploadForm = ref(false);
function reuploadClicked() {
  showReUploadForm.value = true;
}


const fileInputRef = ref<HTMLInputElement | null>(null);

// Trigger file input click
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};



const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files && input.files[0];
  if (!file) {
    console.warn("No file selected.");
    return;
  }

  // Validate file type and size
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = "Invalid file type. Please upload a JPG or PNG image.";
    errorModalVisible.value = true;
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = "File size exceeds 5MB. Please upload a smaller image.";
    errorModalVisible.value = true;
    return;
  }

  console.log("File selected:", file.name);

  // Perform upload
  try {
    isLoading.value = true;
    const formData = new FormData();
    formData.append("profile_image", file);

    const response = await apiClient.post("/profile/update-pic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      successMessage.value = "File uploaded successfully!";
      successModalPreview.value = true;
      console.log("🚀 ~ handleFileChange ~ response.data.user?.profile_pic:", response.data.user?.profile_pic)

      if (response.data.user?.profile_pic) {
      const s3Path = `${img_base_url}/${response.data.user?.id}/${response.data.user.profile_pic}`;
      preview.value = await getS3Image(s3Path);
    } else {
      preview.value = defaultCoverImage;
    }

     

    } else {
      throw new Error(response.data.message || "Failed to upload the file.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    errorMessage.value = error.response?.data?.message || "Error during file upload. Please try again.";
    errorModalVisible.value = true;
  } finally {
    isLoading.value = false;
  }
};


watch(
  () => route.query.page,
  (newVal) => {
    page.value = newVal || null;
  }
);


const fetchUserInfo = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get("/profile/user-info");
    clientDetails.value = response.data.result.client_details;
    clientDocs.value = response.data.result.client_docs;

    bankDetails.value = response.data.result.bank_details.map((bank) => ({
      ...bank,
      country: clientDetails.value?.country || "N/A", // Add country value
    }));

    /* preview.value = clientDetails.value.profile_pic
      ? `${img_base_url}/profileImage/${clientDetails.value.id}/${clientDetails.value.profile_pic}` // Replace `your-image-base-url` with the actual base URL
      : defaultCoverImage; */
    // 🔥 Securely fetch the S3 image URL if profile_pic exists
    if (clientDetails.value?.profile_pic) {
      const s3Path = `pbotcrm/images/client/profileImage/${clientDetails.value.id}/${clientDetails.value.profile_pic}`;
      preview.value = await getS3Image(s3Path);
    } else {
      preview.value = defaultCoverImage;
    }


    // Check if clientDocs is empty and update the page variable
    if (!clientDocs.value || clientDocs.value.length === 0) {
      showIdentityVerification.value = true;  // Show IdentityVerification component
    } else {
      showIdentityVerification.value = false;  // Show ViewIdentityPage component
    }
    // Check if clientDocs is empty and update the page variable
    if (!bankDetails.value || bankDetails.value.length === 0) {
      showBankVerification.value = true;  // Show IdentityVerification component
    } else {
      showBankVerification.value = false;  // Show ViewIdentityPage component
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  } finally {
    isLoading.value = false;
  }
};
// Fetch categories on component mount
onMounted(fetchUserInfo);


   

// Close the modal
const closeDialog = () => {
  emit("close");
};
function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}




</script>

<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6 px-10">
    <div class="col-span-12">
      <div class="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
        <div class="text-base font-medium group-[.mode--light]:text-white pl-6">
          {{ $t('profilesetting.settings') }}
        </div>
        <div class="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
          <!--          <Button variant="primary"
            class="group-[.mode&#45;&#45;light]:!bg-white/[0.12] group-[.mode&#45;&#45;light]:!text-slate-200 group-[.mode&#45;&#45;light]:!border-transparent">
            <Lucide icon="ExternalLink" class="stroke-[1.3] w-4 h-4 mr-3" />
            {{ $t('profilesetting.gotoMyProfile')}}
          </Button>-->
        </div>
      </div>


      <div class="mt-3.5 grid grid-cols-12 gap-y-10 gap-x-6" >
        <div class="relative col-span-12 xl:col-span-3">
          <div class="sticky top-[104px]">
            <div class="flex flex-col px-5 pt-5 pb-6 box box--stacked bg-gradient-to-r from-[#000000] to-[#462903]">
              <router-link
                  :to="{ path: '/settings', query: { page: null } }"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer
         hover:text-yellow-500 hover:drop-shadow-[0_0_6px_cyan]"
                  :class="{
    'text-yellow-400': route.path === '/settings' && page === null,
    'text-white': !(route.path === '/settings' && page === null)
  }"
              >
                <Lucide icon="AppWindow" class="w-5 h-5" />
                <span class="text-[14px] font-medium capitalize">
    {{ $t('profileinfo.profileInfo') }}
  </span>
              </router-link>

              <router-link
                  :to="{ path: '/settings', query: { page: 'identity' } }"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer
         hover:text-yellow-500 hover:drop-shadow-[0_0_6px_cyan]"
                  :class="{
    'text-yellow-400': route.path === '/settings' && page === 'identity',
    'text-white': !(route.path === '/settings' && page === 'identity')
  }"
              >
                <Lucide icon="UserCheckIcon" class="w-5 h-5" />
                <span class="text-[14px] font-medium capitalize">
    {{ $t('profilesetting.identityverification') }}
  </span>
              </router-link>

              <router-link
                  :to="{ path: '/settings', query: { page: 'security' } }"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer
         hover:text-yellow-500 hover:drop-shadow-[0_0_6px_cyan]"
                  :class="{
    'text-yellow-400': route.path === '/settings' && page === 'security',
    'text-white': !(route.path === '/settings' && page === 'security')
  }"
              >
                <Lucide icon="KeyRound" class="w-5 h-5" />
                <span class="text-[14px] font-medium capitalize">
    {{ $t('passwordReset.security') }}
  </span>
              </router-link>

              <router-link
                  :to="{ path: '/settings', query: { page: 'preferences' } }"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer
         hover:text-yellow-500 hover:drop-shadow-[0_0_6px_cyan]"
                  :class="{
    'text-yellow-400': route.path === '/settings' && page === 'preferences',
    'text-white': !(route.path === '/settings' && page === 'preferences')
  }"
              >
                <Lucide icon="DollarSignIcon" class="w-5 h-5" />
                <span class="text-[14px] font-medium capitalize">
    {{ $t('profilesetting.bankDetails') }}
  </span>
              </router-link>

<!--              <router-link
                  :to="{ path: '/settings', query: { page: 'complaince' } }"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer
         hover:text-yellow-500 hover:drop-shadow-[0_0_6px_cyan]"
                  :class="{
    'text-[#00d5ff]': route.path === '/settings' && page === 'complaince',
    'text-white': !(route.path === '/settings' && page === 'complaince')
  }"
              >
                <Lucide icon="VoicemailIcon" class="w-5 h-5" />
                <span class="text-[14px] font-medium capitalize">
    Complaince
  </span>
              </router-link>-->

              <!--              <router-link to="/settings?page=two-factor-authentication" :class="[
                'flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary',
                {
                  active: page === 'two-factor-authentication',
                },
              ]">
                <Lucide icon="ShieldCheck" class="stroke-[1.3] w-4 h-4 mr-3" />
                {{ $t('profilesetting.twofactorAuthentication')}}
              </router-link>-->
              <!--              <router-link to="/settings?page=device-history" :class="[
                'flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary',
                { active: page === 'device-history' },
              ]">
                <Lucide icon="Smartphone" class="stroke-[1.3] w-4 h-4 mr-3" />
                {{ $t('profilesetting.deviceHistory')}}
              </router-link>-->
              <!--              <router-link to="/settings?page=notification-settings" :class="[
                'flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary',
                {
                  active: page === 'notification-settings',
                },
              ]">
                <Lucide icon="BellDot" class="stroke-[1.3] w-4 h-4 mr-3" />
                {{ $t('profilesetting.notificationSettings')}}
              </router-link>-->
              <!--              <router-link to="/settings?page=connected-services" :class="[
                'flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary',
                {
                  active: page === 'connected-services',
                },
              ]">
                <Lucide icon="Workflow" class="stroke-[1.3] w-4 h-4 mr-3" />
                {{ $t('profilesetting.connectedServices')}}
              </router-link>-->
              <!--              <router-link to="/settings?page=social-media-links" :class="[
                'flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary',
                {
                  active: page === 'social-media-links',
                },
              ]">
                <Lucide icon="Podcast" class="stroke-[1.3] w-4 h-4 mr-3" />
                {{ $t('profilesetting.socialmediaLinks')}}
              </router-link>-->
              <!--              <router-link to="/settings?page=account-deactivation" :class="[
                'flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary',
                {
                  active: page === 'account-deactivation',
                },
              ]">
                <Lucide icon="Trash2" class="stroke-[1.3] w-4 h-4 mr-3" />
                {{ $t('profilesetting.accountDeactivation')}}
              </router-link>-->
            </div>
          </div>
        </div>


        <div class="flex flex-col col-span-12 xl:col-span-9 gap-y-7">
          <div class="p-1.5 box flex flex-col box--stacked">
            <div class="h-60 relative w-full rounded-[0.6rem] bg-gradient-to-r from-[#000000] to-[#442702]">
              <div :class="[
                'w-full h-full relative overflow-hidden',
                'before:content-[\'\'] before:absolute before:inset-0 before:bg-texture-white before:-mt-[50rem]',
                'after:content-[\'\'] after:absolute after:inset-0 after:bg-texture-white after:-mt-[50rem]',
              ]"></div>
              <div class="absolute inset-x-0 top-0 w-32 h-32 mx-auto mt-36">

                <div class="mt-6 flex justify-center">
                  <img :src="preview || defaultCoverImage" alt="Preview"
                    class="w-32 h-32 object-cover rounded-full border-[6px] border-white" />
                </div>
              </div>
            </div>
            <div class="p-5 flex flex-col sm:flex-row gap-y-3 sm:items-end rounded-[0.6rem] bg-slate-900 pt-12">
              <div>
                <Button size="sm" type="button" variant="outline-secondary" class="common-btn-item cbi-fill text-white"
                  :disabled="isLoading" @click="triggerFileInput">
                  <span v-if="isLoading">Uploading...</span>
                  <span v-else>Update Profile Picture</span>
                </Button>
                <!-- Use ref to reference the input -->
                <input ref="fileInputRef" type="file" accept="image/*" class="opacity-0 absolute pointer-events-none"
                  @change="handleFileChange" />
              </div>
            </div>


          </div>

          <template v-if="page === null">
            <ProfileDetailsComponet v-if="clientDetails" :clientDetails="clientDetails" />
          </template>
          <template v-if="page === 'identity'">
            <!-- Conditionally render IdentityVerification or ViewIdentityComponent based on the flag -->
            <IdentityVerification v-if="showIdentityVerification || showReUploadForm" />
            <ViewIdentityComponet v-else :clientDocs="clientDocs" @button-clicked="reuploadClicked" />
          </template>
          <template v-if="page === 'security'">
            <ResetPasswordComponent />
          </template>
          <template v-if="page === 'preferences'">
            <AddBankDetailsComponet :country="clientDetails.country" v-if="showBankVerification" />
            <ViewBankDetailsComponet v-else :bankDetails="bankDetails" :clientDetails="clientDetails" />

          </template>
          <template v-if="page === 'complaince'">
            <ComplainceComponent />
          </template>
          <template v-if="page === 'two-factor-authentication'">
            <TwofactorAuthComponet />
          </template>
          <template v-if="page === 'device-history'">
            <DeviceHistoryComponet />
          </template>
          <template v-if="page === 'notification-settings'">
            <NotificationComponet />
          </template>
          <template v-if="page === 'connected-services'">
            <ConnectedServiceComponet />
          </template>
          <template v-if="page === 'social-media-links'">
            <SocialMediaComponet />
          </template>
          <template v-if="page === 'account-deactivation'">
            <DeactiveAccountComponet />
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          {{ $t('profilesetting.profilesuccess') }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          {{ $t('identityVerification.ok') }}
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
          {{ $t('identityVerification.ok') }}
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
<style scoped>
.menu-item {
  @apply flex items-center py-5 first:-mt-3 last:-mb-3
  transition-shadow duration-200 ease-in-out
  hover:text-primary;
}
/* Glow on hover */
.menu-item:hover {
  @apply shadow-md shadow-primary/50;
}
/* Active link styling */
.menu-item.active {
  @apply text-primary font-medium shadow-lg shadow-primary/60;
}
</style>
