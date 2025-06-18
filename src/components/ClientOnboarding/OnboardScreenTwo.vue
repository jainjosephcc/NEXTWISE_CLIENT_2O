<script setup lang="ts">
import {FormCheck, FormInput, FormSelect} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import {computed, onMounted, ref, watch} from "vue";
import apiClient from "../../services/apiService";
import { fetchCountries } from '@/services/apiService';
const nationality = ref(null);


onMounted(async () => {
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    const parsedData = JSON.parse(storedUserData);
    nationality.value = parsedData.country || null;
  }
  const onboardingData = localStorage.getItem("onboarding");
  if(onboardingData){
    const onBoard = JSON.parse(onboardingData);
// 
    passportNumber.value = onBoard?.passport_number || "";
    professionalStatus.value=onBoard?.employment_status || "";
    profession.value=onBoard?.profession||"";

  }


  try {
    countries.value = await fetchCountries(); // Fetch country list
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
  if(onboardingData){
    const onBoard = JSON.parse(onboardingData);
    const country = countries.value.find(
  (country) => country.name.toLowerCase() === onBoard?.residence?.toLowerCase()
);

if (country) {
  countryOfResidence.value = country.id; // Set the selected country in the dropdown
  
} else {
  console.log("Country not found in the list.");
}
  } 
});
const fileInputRef = ref<HTMLInputElement | null>(null);
const filteredCountries = computed(() =>
    countries.value.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const countries = ref([]); // List of countries
const countryOfResidence = ref(""); // Selected country
const searchQuery = ref(""); // Optional for dropdown
const passportNumber = ref(""); // Passport number input field
const isSubmittingPassport = ref(false); // Prevent duplicate
const isSubmittingEmploymentStatus = ref(false); // Prevent duplicate
const professionalStatus = ref("");
const profession = ref("");
const isSubmittingProfession = ref(false);

/*-------PAGE NAVIGATION START----------*/
const currentPage = ref(1);
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


const goBack = () => {
  currentPage.value--;
};

const isNextButtonEnabled = computed(() => {
  return countryOfResidence.value !== "" &&
      passportNumber.value.trim() !== "" &&
      professionalStatus.value !== "" &&
      profession.value.trim() !== "";
});

const commonApiRequest = async (label:any,value:any) => {
  try {
    // POST the updated gender to the API
    const formData = {[label]:value};
    const response = await apiClient.post("/onboarding-add-answer", formData);

    if (response?.data?.data) {
      localStorage.setItem("onboarding", JSON.stringify(response?.data?.data));
     // console.log("Updated successfully:", value);
    }

  } catch (error: any) {
    console.error("Error updating Gender:", error.response?.data || error);
  }
};

watch(countryOfResidence, async (newResidenceId) => {
  if (!newResidenceId) return;
  const selectedCountry = countries.value.find(
      (country) => country.id === newResidenceId
  );
  if (selectedCountry) {
    await commonApiRequest("residence", selectedCountry.name);
  }
});
watch(passportNumber, async (newPassportNumber, oldPassportNumber) => {
  if (!newPassportNumber || newPassportNumber === oldPassportNumber || isSubmittingPassport.value) {
    return; // Skip unnecessary or duplicate calls
  }
  if(newPassportNumber){
    isSubmittingPassport.value = true;
    await commonApiRequest("passport_number", newPassportNumber);
    isSubmittingPassport.value = false;
  }

});
watch(professionalStatus, async (newEmploymentStatus, oldEmploymentStatus) => {
  if (!newEmploymentStatus || newEmploymentStatus === oldEmploymentStatus || isSubmittingEmploymentStatus.value)
    return;

  if(newEmploymentStatus){
    isSubmittingEmploymentStatus.value = true;
    await commonApiRequest("employment_status", newEmploymentStatus);
    isSubmittingEmploymentStatus.value = false;
  }
});
watch(profession, async (newProfession, oldProfession) => {
  if (!newProfession || newProfession === oldProfession || isSubmittingProfession.value) {
    return;
  }

  if(newProfession){
    isSubmittingProfession.value = true;
    await commonApiRequest("profession", newProfession);
    isSubmittingProfession.value = false;
  }
});
/*-------DATA YET TO BE FILLED----------*/
/*-------DATA YET TO BE FILLED----------*/
</script>

<template>
  <div>
    <div class="p-7">

      <!-- 👉🏻 -- NATIONALITY ------ -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Nationality</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              This information was provided during registration and cannot be changed.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormInput
                type="text"
                disabled
                v-model="nationality"
            />
          </div>
        </div>
      </div>

      <!-- Country of Residence Field -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Country of Residence</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Select the country where you currently reside.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormSelect v-model="countryOfResidence">
            <option value="" disabled>Select a country</option>
            <option
                v-for="country in countries"
                :key="country.id"
                :value="country.id"
            >
              {{ country.name }}
            </option>
          </FormSelect>
        </div>
      </div>


      <!-- Passport Number Input Field -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Passport Number</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              A government-approved ID card number is acceptable if you do not have a passport.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormInput
                id="passportNumber"
                v-model="passportNumber"
                required
                placeholder="Enter your passport number"
            />
          </div>
        </div>
      </div>


      <!-- US WARNING ROW-->
      <div
          class="flex-col block pt-2 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
          </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <div
                class= "text-xs leading-relaxed text-warning-500/80"
            >
              * US Citizens will be subject to the IGA (Intergovernmental Agreement) between the Government of the Republic of Croatia and the Government of the United States of America, for the provision of FATCA (Foreign Account Tax Compliance Act) which is a United States Act concerning the tax obligations for any type of accounts in foreign financial institutions.
            </div>
          </div>
        </div>
      </div>

      <!-- EmploymentStatus Input Field -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Employment Status</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Select your current employment status. This information helps us tailor our services to your financial profile.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormSelect id="professionalStatus" v-model="professionalStatus">
              <option value="" disabled>Select your professional status</option>
              <option value="Employee">Employee</option>
              <option value="Salaried employee">Salaried employee</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Entrepreneur">Entrepreneur</option>
              <option value="Employee & Entrepreneur">Employee & Entrepreneur</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
            </FormSelect>
          </div>
        </div>
      </div>

      <!-- PROFESSION/INDUSTRY Field -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">Profession/Industry</div>
              <div
                  class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
              >
                Required
              </div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Specify your profession or industry
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormInput
                id="profession"
                v-model="profession"
                required
                placeholder="Enter your profession/industry"
            />
          </div>
        </div>
      </div>


    </div>
    <div
        class="flex py-5 border-t md:justify-end px-7 border-slate-200/80"
    >
      <Button
          variant="outline-primary"
          class="w-full px-10 md:w-auto border-primary/50 mr-3"
          @click="goBack"
      >
        <Lucide icon="Pocket" class="stroke-[1.3] w-4 h-4 mr-2 -ml-2" />
        BACK
      </Button>

      <Button
          variant="outline-primary"
          class="w-full px-10 md:w-auto border-primary/50"
          @click="goNext"
          :disabled="!isNextButtonEnabled"
      >
        <Lucide icon="Pocket" class="stroke-[1.3] w-4 h-4 mr-2 -ml-2" />
        NEXT
      </Button>
    </div>
  </div>

</template>

<style scoped>

</style>