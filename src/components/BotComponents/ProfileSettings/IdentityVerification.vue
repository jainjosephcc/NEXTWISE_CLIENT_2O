<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, watch, computed } from "vue";
import Button from "@/components/Base/Button";
import apiClient from "../../../services/apiService";
import { Dialog } from "@/components/Base/Headless";
import Lucide from "@/components/Base/Lucide";
import LoadingIcon from "@/components/Base/LoadingIcon";
import docImg from "@/assets/images/bot/images/doc_upload.png";
import _ from "lodash";
import hotel from "@/fakers/hotel";
import Tippy from "@/components/Base/Tippy";
import Litepicker from "@/components/Base/Litepicker";
import { FormSelect } from "@/components/Base/Form";
// Initial setup for page and step management
const page = ref<string | null>(null);

const isBtnLoading = ref(false);
const successModalVisible = ref(false);
const errorModalVisible = ref(false);
const errorMessage = ref("");

// Watch route for query parameter changes to update the page dynamically
const route = useRoute();
watch(
  computed(() => route),
  () => {
    const queryParams = new URLSearchParams(window.location.search);
    page.value = queryParams.get("page");
  },
  { deep: true }
);

// References for the three file uploads (POI, POI1, POA)
const poiFile = ref<File | null>(null);
const poi1File = ref<File | null>(null);
const poaFile = ref<File | null>(null);

// References for the image previews
const frontImage = ref<string | null>(null);  // Front side image preview
const backImage = ref<string | null>(null);   // Back side image preview
const poaImage = ref<string | null>(null);    // Proof of Address image preview

// Step management
const currentStep = ref(1); // Set to Step 3 for this example

// Modal handling methods
const showSuccessModal = () => {
  successModalVisible.value = true;
};

const showErrorModal = (message: string) => {
  errorMessage.value = message || "An unexpected error occurred.";
  errorModalVisible.value = true;
};

const closeSuccessModal = () => {
  successModalVisible.value = false;
};

const closeErrorModal = () => {
  errorModalVisible.value = false;
};
// Step-based navigation with validation
const errorMessages = ref<string[]>(["", "", ""]); // Tracks error messages for files
const fileData = ref<(File | null)[]>([poiFile.value, poi1File.value, poaFile.value]); // Array of uploaded files


// Handle form submission for uploading documents
const handleSubmitDocuments = async () => {
  // Validate file inputs for both Proof of Identity (Step 2) and Proof of Address (Step 3)
  if (!poiFile.value || !poi1File.value || !poaFile.value) {
    showErrorModal("Please select all documents to upload.");
    return;
  }

  // Parse user data from localStorage
  let parsedData = null;
  const userData = localStorage.getItem("userData");
  if (userData) {
    parsedData = JSON.parse(userData); // Parse the string to JSON
  } else {
    //console.log("No userData found in localStorage");
  }

  // Prepare form data for the API call
  const formData = new FormData();
  formData.append("poi", poiFile.value); // Front Side of ID
  formData.append("poi1", poi1File.value); // Back Side of ID
  formData.append("poa", poaFile.value); // Proof of Address file

  try {
    isBtnLoading.value = true;
    // Call the document upload API
    const response = await apiClient.post("/profile/add-docs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data.status) {
      throw new Error(response.data.message || "File upload failed");
    }

    showSuccessModal(); // Show success modal
    poiFile.value = null; // Clear inputs
    poi1File.value = null;
    poaFile.value = null;
    frontImage.value = null; // Clear image previews
    backImage.value = null;
    poaImage.value = null;
  } catch (error: any) {
    console.error("Upload failed:", error);
    showErrorModal(error.response?.data?.message || "Error uploading documents.");
  } finally {
    isBtnLoading.value = false;
  }
};

// Methods to move through steps
/* const goToNextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }


}; */
const goToNextStep = () => {
  if (currentStep.value < 4) {
    // Step 1: No validation needed, move to the next step
    if (currentStep.value === 1) {
      currentStep.value++;
    }
    // Step 2: Validate Proof of Identity (Front and Back)
    else if (currentStep.value === 2) {
      // Validate the presence of the front and back Proof of Identity documents
      errorMessages.value[0] = poiFile.value ? "" : "Mandatory Document";
      errorMessages.value[1] = poi1File.value ? "" : "Mandatory Document";

      // Proceed if no errors
      if (errorMessages.value[0] === "" && errorMessages.value[1] === "") {
        currentStep.value++;
      }
    }
    // Step 3: Validate Proof of Address
    else if (currentStep.value === 3) {
      // Validate the presence of the Proof of Address document
      errorMessages.value[2] = poaFile.value ? "" : "Mandatory Document";

      // Proceed to submission if no errors
      if (
        errorMessages.value[0] === "" &&
        errorMessages.value[1] === "" &&
        errorMessages.value[2] === ""
      ) {
        handleSubmitDocuments();
      }
    }
  }
};


const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// Methods to handle file changes and set preview images
const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
const maxSize = 2 * 1024 * 1024;
const onFileChange = (event: Event, type: string) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    if (!allowedTypes.includes(file.type)) {
      showErrorModal("Only PDF and image files (PNG, JPEG) are allowed.");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      showErrorModal("File size must be less than 2 MB.");
      return;
    }


    const reader = new FileReader();

    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;

      if (type === "poi") {
        poiFile.value = file;
        frontImage.value = fileUrl; // Set front side image preview
        errorMessages.value[0] = ""; // Clear the error message
      } else if (type === "poi1") {
        poi1File.value = file;
        backImage.value = fileUrl; // Set back side image preview
        errorMessages.value[1] = ""; // Clear the error message
      } else if (type === "poa") {
        poaFile.value = file;
        poaImage.value = fileUrl; // Set proof of address image preview
        errorMessages.value[2] = ""; // Clear the error message
      }
    };

    reader.readAsDataURL(file);
  }
};

function handleRefresh() {
  successModalVisible.value = false;
  window.location.reload();
}
</script>

<template>
  <div class="max-h-[80vh] overflow-auto px-4 ">
    <!-- Steps Navigation -->
    <div class="flex flex-col lg:items-center lg:flex-row gap-y-2">
      <div :class="[currentStep === 1 ? 'active' : '',
        'flex items-center lg:justify-center flex-1 lg:first:justify-start lg:last:justify-end group',
        'after:hidden before:hidden after:lg:block before:lg:block',
        'first:after:content-[\'\'] first:after:w-full first:after:bg-slate-300/60 first:after:h-[2px] first:after:ml-5 group-[.mode--light]:first:after:bg-slate-300/20',
        'last:before:content-[\'\'] last:before:w-full last:before:bg-slate-300/60 last:before:h-[2px] last:before:mr-5 group-[.mode--light]:last:before:bg-slate-300/20',
        'last:after:hidden after:content-[\'\'] after:w-full after:bg-slate-300/60 after:h-[2px] after:ml-5 group-[.mode--light]:after:bg-slate-300/20',
        'first:before:hidden before:content-[\'\'] before:w-full before:bg-slate-300/60 before:h-[2px] before:mr-5 group-[.mode--light]:before:bg-slate-300/20',
      ]">
        <div class="flex items-center">
          <div
            class="bg-white border rounded-full group-[.mode--light]:!bg-transparent group-[.active]:bg-primary group-[.active]:text-white group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-white/[0.25] [.group.mode--light_.group.active_&]:!bg-white/[0.12] [.group.mode--light_.group.active_&]:!border-white/[0.15]">
            <div class="flex items-center justify-center w-10 h-10">1</div>
          </div>
          <div
            class="ml-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100">
            {{ $t('identityVerification.instructions') }}
          </div>
        </div>
      </div>


      <div :class="[currentStep === 2 ? 'active' : '',
        'flex items-center lg:justify-center flex-1 lg:first:justify-start lg:last:justify-end group',
        'after:hidden before:hidden after:lg:block before:lg:block',
        'first:after:content-[\'\'] first:after:w-full first:after:bg-slate-300/60 first:after:h-[2px] first:after:ml-5 group-[.mode--light]:first:after:bg-slate-300/20',
        'last:before:content-[\'\'] last:before:w-full last:before:bg-slate-300/60 last:before:h-[2px] last:before:mr-5 group-[.mode--light]:last:before:bg-slate-300/20',
        'last:after:hidden after:content-[\'\'] after:w-full after:bg-slate-300/60 after:h-[2px] after:ml-5 group-[.mode--light]:after:bg-slate-300/20',
        'first:before:hidden before:content-[\'\'] before:w-full before:bg-slate-300/60 before:h-[2px] before:mr-5 group-[.mode--light]:before:bg-slate-300/20',
      ]">
        <div class="flex items-center">
          <div
            class="bg-white border rounded-full group-[.mode--light]:!bg-transparent group-[.active]:bg-primary group-[.active]:text-white group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-white/[0.25] [.group.mode--light_.group.active_&]:!bg-white/[0.12] [.group.mode--light_.group.active_&]:!border-white/[0.15]">
            <div class="flex items-center justify-center w-10 h-10">2</div>
          </div>
          <div
            class="ml-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100">
            {{ $t('identityVerification.proofofIdentity') }}
          </div>
        </div>
      </div>


      <div :class="[
        currentStep === 3 ? 'active' : '',
        'flex items-center lg:justify-center flex-1 lg:first:justify-start lg:last:justify-end group',
        'after:hidden before:hidden after:lg:block before:lg:block',
        'first:after:content-[\'\'] first:after:w-full first:after:bg-slate-300/60 first:after:h-[2px] first:after:ml-5 group-[.mode--light]:first:after:bg-slate-300/20',
        'last:before:content-[\'\'] last:before:w-full last:before:bg-slate-300/60 last:before:h-[2px] last:before:mr-5 group-[.mode--light]:last:before:bg-slate-300/20',
        'last:after:hidden after:content-[\'\'] after:w-full after:bg-slate-300/60 after:h-[2px] after:ml-5 group-[.mode--light]:after:bg-slate-300/20',
        'first:before:hidden before:content-[\'\'] before:w-full before:bg-slate-300/60 before:h-[2px] before:mr-5 group-[.mode--light]:before:bg-slate-300/20',
      ]">
        <div class="flex items-center">
          <div
            class="bg-white border rounded-full group-[.mode--light]:!bg-transparent group-[.active]:bg-primary group-[.active]:text-white group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-white/[0.25] [.group.mode--light_.group.active_&]:!bg-white/[0.12] [.group.mode--light_.group.active_&]:!border-white/[0.15]">
            <div class="flex items-center justify-center w-10 h-10">3</div>
          </div>
          <div
            class="ml-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100">
            {{ $t('identityVerification.proofofAddress') }}
          </div>
        </div>
      </div>
    </div>


    <!-- Step Content -->
    <div class="mt-7">
      <!-- Step 1: Instructions -->
      <div class="mt-7">
        <div class="flex flex-col p-5 box box--stacked ">


          <div v-if="currentStep === 1">
            <div class="p-5 box box--stacked min-h-[90vh]">
              <div class="flex flex-col xl:flex-row gap-6">
                <!-- Instructions Section -->
                <div class="border w-full rounded-[0.6rem] border-slate-300/80 dark:border-darkmode-400 relative border-dashed p-5">
                  <div class="absolute left-0 px-3 -mt-2 uppercase text-cyan-50 text-base">
                    Instructions to upload Documents
                  </div>

                  <div class="mt-4 space-y-5">
                    <p class="font-medium text-slate-500">
                      Your document security is our top priority. <br>
                      Rest assured, all files uploaded through this portal are securely stored.
                    </p>

                    <!-- Guidelines -->
                    <div class="space-y-5">
                      <div class="flex items-start gap-4">
                        <div class="flex items-center justify-center w-10 h-10 rounded-full border border-success/10 bg-success/10">
                          <Lucide icon="FigmaIcon" class="w-5 h-5 text-success fill-success/10" />
                        </div>
                        <div>
                          <div class="font-medium">Accepted File Formats: PDF, JPG, JPEG, PNG</div>
                          <div class="text-xs text-slate-500">Please ensure the document is uploaded in one of these accepted formats.</div>
                        </div>
                      </div>

                      <div class="flex items-start gap-4">
                        <div class="flex items-center justify-center w-10 h-10 rounded-full border border-success/10 bg-success/10">
                          <Lucide icon="FigmaIcon" class="w-5 h-5 text-success fill-success/10" />
                        </div>
                        <div>
                          <div class="font-medium">File Size Limitation: 5 MB per file</div>
                          <div class="text-xs text-slate-500">Ensure each file does not exceed 5 MB in size to facilitate smooth uploading.</div>
                        </div>
                      </div>

                      <div class="flex items-start gap-4">
                        <div class="flex items-center justify-center w-10 h-10 rounded-full border border-success/10 bg-success/10">
                          <Lucide icon="FigmaIcon" class="w-5 h-5 text-success fill-success/10" />
                        </div>
                        <div>
                          <div class="font-medium">Document Clarity: The document must be clear and readable.</div>
                          <div class="text-xs text-slate-500">Upload documents that are easy to read, ensuring all text and details are visible.</div>
                        </div>
                      </div>

                      <div class="flex items-start gap-4">
                        <div class="flex items-center justify-center w-10 h-10 rounded-full border border-success/10 bg-success/10">
                          <Lucide icon="FigmaIcon" class="w-5 h-5 text-success fill-success/10" />
                        </div>
                        <div>
                          <div class="font-medium">Valid Identity Card</div>
                          <div class="text-xs text-slate-500">Only official, government-recognized, non-expired ID cards are accepted.</div>
                        </div>
                      </div>
                    </div>

                    <!-- Next Button -->
                    <div class="flex justify-center pt-4">
                      <Button variant="primary" @click="goToNextStep" :disabled="isBtnLoading || currentStep === 3" class="bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center">
                        <template v-if="isBtnLoading">
                          {{ $t('identityVerification.loading') }}
                          <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                        </template>
                        <template v-else>
                          {{ $t('identityVerification.next') }}
                        </template>
                      </Button>
                    </div>
                  </div>
                </div>

                <!-- Image Section -->
                <div class="w-full xl:w-[300px] flex items-center justify-center px-4 xl:px-0">
                  <div class="w-full rounded-[0.6rem] overflow-hidden bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] relative py-10">
                    <img :src="docImg" alt="Instruction Image" class="w-full h-auto object-contain rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>



          <!-- Step 2: Proof of Identity -->
          <div v-if="currentStep === 2">
            <div class="p-5">
              <div class="border w-full rounded-[0.6rem] border-slate-300/80 dark:border-darkmode-400 relative mt-3 border-dashed">
                <div class="absolute left-0 px-3 ml-4 -mt-2 text-xs uppercase text-cyan-50">
                  <div class="-mt-px text-base">{{ $t('identityVerification.identityProof') }}</div>
                </div>
                <div class="p-5">
                  <p class="text-sm text-slate-100 leading-relaxed mb-4">
                    {{ $t('identityVerification.identityProofinstr') }}
                  </p>
                  <!-- Front Side File Upload -->
                  <div class="mb-6 flex items-center">
                    <div class="w-full">
                      <label for="frontSide" class="block text-sm font-medium text-slate-600 mb-2">Front Side</label>
                      <input type="file" id="poi" accept="image/png, image/jpeg, application/pdf"
                        class="block w-full px-3 py-2 border border-slate-300 rounded-md"
                        @change="onFileChange($event, 'poi')" />
                      <p class="error" v-if="errorMessages[0]">{{ errorMessages[0] }}</p>
                      <p class="text-xs text-slate-500 mt-1">{{ $t('identityVerification.uploadId') }}.</p>
                    </div>

                    <!-- Front Side Image Preview -->
                    <div v-if="frontImage" class="ml-6">
                      <img :src="frontImage" alt="Front Side Preview"
                        class="w-32 h-32 object-cover border border-slate-300 rounded-md" />
                    </div>
                  </div>
                  <!-- Back Side File Upload -->
                  <div class="flex items-center">
                    <div class="w-full">
                      <label for="backSide" class="block text-sm font-medium text-slate-600 mb-2">Back Side</label>
                      <input type="file" id="poi1" accept="image/png, image/jpeg, application/pdf"
                        class="block w-full px-3 py-2 border border-slate-300 rounded-md"
                        @change="onFileChange($event, 'poi1')" />
                      <p class="error" v-if="errorMessages[1]">{{ errorMessages[1] }}</p>
                      <p class="text-xs text-slate-500 mt-1">{{ $t('identityVerification.idBack') }}</p>
                    </div>

                    <!-- Back Side Image Preview -->
                    <div v-if="backImage" class="ml-6">
                      <img :src="backImage" alt="Back Side Preview"
                        class="w-32 h-32 object-cover border border-slate-300 rounded-md" />
                    </div>



                  </div>

                  <div class="flex justify-center mt-5">
                    <div>
                      <Button v-if="currentStep != 1" variant="secondary" @click="goToPreviousStep"
                        :disabled="isBtnLoading" class="w-24 ml-auto mr-4 mt-4 bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center">
                        <template v-if="isBtnLoading">
                          {{ $t('identityVerification.loading...') }}
                          <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                        </template>
                        <template v-else>
                          {{ $t('identityVerification.back') }}
                        </template>
                      </Button>

                    </div>


                    <div>
                      <!-- Next Step Button, visible only on steps other than the last step -->
                      <Button variant="primary" @click="goToNextStep" :disabled="isBtnLoading || currentStep === 3"
                        class="w-24 ml-auto mr-4 mt-4 common-btn-item cbi-fill" v-if="currentStep !== 3">
                        <template v-if="isBtnLoading">
                          {{ $t('identityVerification.loading') }}
                          <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                        </template>
                        <template v-else>
                          {{ $t('identityVerification.next') }}
                        </template>
                      </Button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Proof of Address -->
          <div v-if="currentStep === 3">

            <div class="p-5">
              <div
                class="border w-full rounded-[0.6rem] border-slate-300/80 dark:border-darkmode-400 relative mt-3 border-dashed">
                <div class="absolute left-0 px-3 ml-4 -mt-2 text-xs uppercase text-cyan-50">
                  <div class="-mt-px text-base">{{ $t('identityVerification.address') }}</div>
                </div>
                <div class="p-5">
                  <p class="text-sm text-slate-100 leading-relaxed mb-4">
                    {{ $t('identityVerification.addressProof') }}
                  </p>

                  <!-- Front Side File Upload -->
                  <div class="mb-6">
                    <label for="frontSide" class="block text-sm font-medium text-slate-600 mb-2">Front Side</label>
                    <input type="file" id="poa" accept="image/png, image/jpeg, application/pdf"
                      class="block w-full px-3 py-2 border border-slate-300 rounded-md"
                      @change="onFileChange($event, 'poa')" />
                    <p class="error" v-if="errorMessages[2]">{{ errorMessages[2] }}</p>
                    <p class="text-xs text-slate-500 mt-1">{{ $t('identityVerification.frontSide') }}.</p>


                  </div>
                  <!-- Display Preview for POA -->
                  <div v-if="poaImage" class="ml-6 mt-4">
                    <img :src="poaImage" alt="Proof of Address Preview"
                      class="w-32 h-32 object-cover border border-slate-300 rounded-md" />
                  </div>
                  <div class="flex justify-center mt-5">
                    <Button v-if="currentStep === 3" variant="primary" @click="handleSubmitDocuments"
                      :disabled="isBtnLoading" class="common-btn-item cbi-fill">
                      <template v-if="isBtnLoading">
                        {{ $t('identityVerification.submitting') }}
                        <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                      </template>
                      <template v-else>
                        {{ $t('identityVerification.submit') }}
                      </template>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Step Navigation Buttons -->
          <!--  <div class="flex flex-col-reverse gap-3 pt-5 mb-4 pb-5 md:flex-row md:justify-center border-slate-300/70">
            -- Previous Step Button, visible only on steps other than the first one --
            <Button v-if="currentStep != 1" variant="secondary" @click="goToPreviousStep" :disabled="isBtnLoading"
              class="w-24">
              <template v-if="isBtnLoading">
                {{ $t('identityVerification.loading...') }}
                <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
              </template>
              <template v-else>
                {{ $t('identityVerification.back') }}
              </template>
            </Button>


            <Button v-if="currentStep === 3" variant="primary" @click="handleSubmitDocuments" :disabled="isBtnLoading"
              class="w-24">
              <template v-if="isBtnLoading">
                {{ $t('identityVerification.submitting') }}
                <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
              </template>
              <template v-else>
                {{ $t('identityVerification.submit') }}
              </template>
            </Button>


            <Button variant="primary" @click="goToNextStep" :disabled="isBtnLoading || currentStep === 3" class="w-24"
              v-if="currentStep !== 3">
              <template v-if="isBtnLoading">
                {{ $t('identityVerification.loading') }}
                <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
              </template>
              <template v-else>
                {{ $t('identityVerification.next') }}
              </template>
            </Button>
          </div> -->
        </div>
      </div>
    </div>

  </div>


  <!-- Success Modal -->
  <Dialog :open="successModalVisible" @close="closeSuccessModal">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          {{ $t('identityVerification.uploadSuccess') }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          {{ $t('identityVerification.ok') }}
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Error Modal -->
  <Dialog :open="errorModalVisible" @close="closeErrorModal">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-warning" />
        <div class="mt-5 text-3xl">{{ $t('identityVerification.oops') }}</div>
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
<style>
.error {
  color: red;
  font-size: 0.85rem;
  margin-top: 4px;
}
</style>