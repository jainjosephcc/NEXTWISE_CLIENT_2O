<script setup lang="ts">
import users from "@/fakers/users";
import _ from "lodash";
import {FormCheck, FormInput, FormSelect} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Litepicker from "@/components/Base/Litepicker";
import Lucide from "@/components/Base/Lucide";
import {computed, onMounted, ref, watch} from "vue";
const successMessage = ref<string | null>(null); // For success feedback
const errorMessage = ref<string | null>(null); // For error feedback
const errorModalVisible = ref(false);
const successModalPreview = ref(false);
const isLoading = ref(false);
const img_base_url = import.meta.env.VITE_S3_BASE;
import apiClient from "../../services/apiService";
const preview = ref<string | null>(null); // To store the preview URL
const clientName = ref("");
const contactNo = ref("");
const email = ref("");
const profilePic = ref("");
const docVerified = ref(0);
const emailVerified = ref(0);
const clientId = ref(null);
const isIb = ref(0);
const nationality = ref(null);
const defaultCoverImage = "/user_img.png";
const dateOfBirth = ref("1996-02-01");
const selectedGender = ref("");
const validationError = ref<string | null>(null);
const calculateAge = (dob: string): number => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

onMounted(() => {
  const storedUserData = localStorage.getItem("userData");
  const onboardingData = localStorage.getItem("onboarding");
  if (storedUserData) {
    const parsedData = JSON.parse(storedUserData);
    const onboardingAnswers = typeof parsedData.onboarding_answers === "string"
        ? JSON.parse(parsedData.onboarding_answers) // Parse if it's a string
        : parsedData.onboarding_answers || {}; // Use directly if it's already an object

    clientName.value = parsedData.client_name || "";
    contactNo.value = parsedData.contact_no || "";
    email.value = parsedData.email || "";
    docVerified.value = parsedData.doc_verified || 0;
    emailVerified.value = parsedData.email_verified || 0;
    clientId.value = parsedData.id || null;
    isIb.value = parsedData.is_ib || 0;
    nationality.value = parsedData.nationality || null;
    profilePic.value = parsedData.profile_pic || "";


    dateOfBirth.value = onboardingAnswers?.dob || "";
    selectedGender.value = onboardingAnswers?.gender || "";

    //console.log("onboardingAnswers:", onboardingAnswers);

    preview.value = profilePic.value!=""? `${img_base_url}/profileImage/${clientId.value}/${profilePic.value}`
        : defaultCoverImage;
  }
  if(onboardingData){
    const onBoard = JSON.parse(onboardingData);
    dateOfBirth.value = onBoard?.dob || "";
    selectedGender.value = onBoard?.gender || "";

  }
});
const fileInputRef = ref<HTMLInputElement | null>(null);
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

      preview.value = response.data.user?.profile_pic
          ? `${img_base_url}/profileImage/${clientId.value}/${response.data.user.profile_pic}`
          : defaultCoverImage;
      //console.log("File uploaded:", response.data);
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

/*-------PAGE NAVIGATION START----------*/
const currentPage = ref(0);
watch(currentPage, (newValue) => {
  emit("update:currentPage", newValue); // Emit update event
});
// Emit function to send events to the parent
const emit = defineEmits(["update:currentPage"]);

const goNext = () => {
  if (isNextButtonEnabled.value) {
    //console.log("Navigating to the next step...");
    currentPage.value++;
  } else {
    console.warn("Please fill in both Date of Birth and Gender before proceeding.");
  }
};

/*-------PAGE NAVIGATON END----------*/


/*-------DATA YET TO BE FILLED----------*/
/*-------DATA YET TO BE FILLED----------*/


const isNextButtonEnabled = computed(() => {
  return dateOfBirth.value !== "" && selectedGender.value !== ""&&validationError.value === null;
});


const currentYear = new Date().getFullYear();
const maxYear = computed(() => currentYear - 18);
const minYear = computed(() => currentYear - 120);


watch(dateOfBirth, async (newDob, oldDob) => {
  if (newDob !== oldDob) {
    const age = calculateAge(newDob);
    if (age < 18) {
      validationError.value = "You must be at least 18 years old.";
      return; // Stop further processing
    } else
    {
      // console.log(newDob);
      
      validationError.value = null;
      try {
        // POST the updated DOB to the API
        const formData = { dob: newDob };
        const response = await apiClient.post("/onboarding-add-answer", formData);
        if (response?.data?.data) {
          localStorage.setItem("onboarding", JSON.stringify(response?.data?.data));
          // console.log("Gender updated successfully:", newDob);
        }
      } catch (error: any) {
        console.error("Error updating DOB:", error.response?.data || error);
      }
    }
  }
});
watch(selectedGender, async (newGender, oldGender) => {
  if (newGender !== oldGender) {
    try {
      // POST the updated gender to the API
      const formData = { gender: newGender };
      const response = await apiClient.post("/onboarding-add-answer", formData);
      if (response?.data?.data) {
        localStorage.setItem("onboarding", JSON.stringify(response?.data?.data));
       // console.log("Gender updated successfully:", newGender);
      }
    } catch (error: any) {
      console.error("Error updating Gender:", error.response?.data || error);
    }
  }
});
</script>

<template>
  <div>
    <div class="p-7">

      <!-- 👉🏻 -- PROFILE IMAGE------ -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Profile Photo</div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Upload a clear and recent profile photo.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex items-center">
            <div
                class="relative flex items-center justify-center w-24 h-24 border rounded-full bg-primary/5 border-primary/10"
            >

              <img :src="preview || defaultCoverImage" alt="Preview"
                   class="w-[100%] h-[100%] object-cover rounded-full border-[6px] fill-slate-300/70 stroke-[0.5] stroke-slate-400/50" />
            </div>
            <div class="pl-2 pr-4 mr-2 h-8 ml-8">
              <Button size="sm" type="button" variant="outline-secondary" class="inline-block w-38"
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
      </div>

      <!-- 👉🏻 -- CLIENT NAME ------ -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Full Name</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Enter your full legal name as it appears on your official
              identification.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormInput
                type="text"
                disabled
                v-model="clientName"
            />
          </div>
        </div>
      </div>

      <!-- 👉🏻 -- DOB         ------ -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Date of Birth</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              This information is required to verify your age. You must be 18 years or older to access financial services.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <Litepicker
              v-model="dateOfBirth"
              :options="{
      startDate: dateOfBirth,
      autoApply: false,
      dropdowns: {
        maxYear: maxYear,
        minYear: minYear,
        months: true,
        years: true,
      },
  }"
          />
          <p v-if="validationError" class="text-red-500 text-sm mt-2">
            {{ validationError }}
          </p>
        </div>
      </div>

      <!-- 👉🏻 -- GENDER      ------ -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Gender</div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Select your gender from the options.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <div
                class="bg-white w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
            >
              <FormCheck>
                <FormCheck.Input
                    id="checkbox-switch-1"
                    type="radio"
                    value="male"
                    v-model="selectedGender"
                />
                <FormCheck.Label htmlFor="checkbox-switch-1">
                  Male
                </FormCheck.Label>
              </FormCheck>
            </div>
            <div
                class="bg-white w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
            >
              <FormCheck>
                <FormCheck.Input
                    id="checkbox-switch-2"
                    type="radio"
                    value="female"
                    v-model="selectedGender"
                />
                <FormCheck.Label htmlFor="checkbox-switch-2">
                  Female
                </FormCheck.Label>
              </FormCheck>
            </div>
            <div
                class="bg-white w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
            >
              <FormCheck>
                <FormCheck.Input
                    id="checkbox-switch-3"
                    type="radio"
                    value="none"
                    v-model="selectedGender"
                />
                <FormCheck.Label htmlFor="checkbox-switch-3">
                  Prefer Not to Say
                </FormCheck.Label>
              </FormCheck>
            </div>
          </div>
        </div>
      </div>

      <!-- 👉🏻 -- EMAIL       ------ -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Email</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Please provide a valid email address that you have access
              to.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput
              type="text"
              v-model="email"
              disabled
          />
        </div>
      </div>

      <!-- 👉🏻 -- PHONE       ------ -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Phone Number</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Please provide a valid phone number where we can reach you
              if needed.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormInput
                type="text"
                class="first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
                v-model="contactNo"
                disabled
            />
            <FormSelect
                disabled
                class="md:w-36 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
            >
              <option value="office">Personal</option>
            </FormSelect>
          </div>
          <a
              class="flex items-center mt-3.5 -mb-1 font-medium text-primary"
              href=""
          >
<!--            <Lucide class="w-4 h-4 stroke-[1.3] mr-1" icon="Plus" />-->
<!--            Add phone-->
          </a>
        </div>
      </div>
<!--      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Department</div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Choose your department or division from the list of
              available options.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormSelect>
            <template
                v-for="(faker, fakerKey) in _.take(users.fakeUsers(), 5)"
                :key="fakerKey"
            >
              <option :value="faker.department">
                {{ faker.department }}
              </option>
            </template>
          </FormSelect>
        </div>
      </div>-->
    </div>
    <div
        class="flex py-5 border-t md:justify-end px-7 border-slate-200/80"
    >
      <Button
          variant="outline-primary"
          class="w-full px-10 md:w-auto border-primary/50"
          @click="goNext"
          :disabled="!isNextButtonEnabled"
      >
        <Lucide icon="Pocket" class="stroke-[1.3] w-4 h-4 mr-2 -ml-2" />
        Next
      </Button>
    </div>
  </div>

</template>

<style scoped>

</style>