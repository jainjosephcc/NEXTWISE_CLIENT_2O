<script setup lang="ts">
import users from "@/fakers/users";
import _ from "lodash";
import {FormCheck, FormInput, FormSelect,FormLabel} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Litepicker from "@/components/Base/Litepicker";
import Lucide from "@/components/Base/Lucide";
import {computed, onMounted, watch} from "vue";
import apiClient from "../../services/apiService";
import {ref} from "vue";
import { fetchCountries } from '@/services/apiService';

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
const dateOfBirth = ref("");
const selectedGender = ref("");


const transactionCount = ref(""); // e.g., 0-4, 5-10, or More than 10
const educationLevel = ref(""); // Education level (e.g., Degree in Finance)
const tradedShares = ref(""); // Shares trading history
const tradedForex = ref(""); // Forex trading history
const tradedCfd = ref(""); // CFDs trading history
const leverage = ref(""); // Selected leverage option
const politicallyExposed = ref(false); // Whether the user is a PEP
const pepSpecify = ref(""); // PEP specification (only if the checkbox is checked)


const countries = ref([]); // List of countries
const countryOfResidence = ref(""); // Selected country
const searchQuery = ref(""); // Optional for dropdown
const passportNumber = ref(""); // Passport number input field
const isSubmittingPassport = ref(false); // Prevent duplicate
const isSubmittingEmploymentStatus = ref(false); // Prevent duplicate
const professionalStatus = ref("");
const profession = ref("");
const isSubmittingProfession = ref(false);


const currentYear = new Date().getFullYear();
const maxYear = computed(() => currentYear - 18);
const minYear = computed(() => currentYear - 120);

const onBoardingData = localStorage.getItem('onboarding');
const userData = localStorage.getItem('userData');
const parsedData=ref(null)
const parsedUserData=ref(null)
if (onBoardingData) {
    parsedData.value = JSON.parse(onBoardingData); // Parse the string into an object
} else {
    console.log('No userData found in localStorage');
}

if (userData) {

    parsedUserData.value = JSON.parse(userData); // Parse the string into an object
 // Access the 'value' property
} else {
    console.log('No userData found in localStorage');
}


onMounted(() => {
    
    clientName.value=parsedUserData.value.client_name;
     selectedGender.value = parsedData.value.gender; 
     dateOfBirth.value=parsedData.value.dob;
     email.value=parsedUserData.value.email;
     contactNo.value=parsedUserData.value.contact_no;
     nationality.value=parsedUserData.value.nationality;
     countryOfResidence.value=parsedData.value.residence;
     passportNumber.value=parsedData.value.passport_number;
     profession.value=parsedData.value.profession;
     educationLevel.value=parsedData.value.education_level;
     transactionCount.value=parsedData.value.transaction_count;
     tradedShares.value=parsedData.value.traded_shares;
     tradedForex.value=parsedData.value.traded_forex;
     tradedCfd.value=parsedData.value.traded_cfd;
     leverage.value=parsedData.value.leverage;
     politicallyExposed.value=parsedData.value.politically_exposed;
     pepSpecify.value=parsedData.value.mark_done;
   });


</script>

<template>
  <div class="flex flex-col p-5 box box--stacked">
    <div class="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
      Onboarding Questions
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
                    autoApply: false,
                    dropdowns: {
                      maxYear: maxYear,
                      minYear: minYear,
                      months: true,
                      years: true,
                    },
                  }"
                 disabled
          />
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
                    disabled
                
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
                    disabled
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
                    disabled
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
          <FormSelect disabled>
            <option value="" >{{ parsedData.residence }}</option>
            <option
                v-for="country in countries"
                :key="country.name"
                :value="country.name"
            >
              {{ parsedData.residence }}
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
                disabled
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
            <FormSelect id="professionalStatus" v-model="professionalStatus" disabled>
              <option value="" disabled>{{ parsedData.employment_status }}</option>
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
                disabled
            />
          </div>
        </div>
      </div>

             <!-- 👉🏻 -- INDUSTRY EXP ------ -->
             <div
          class="flex-col block pt-5 mt-5 sm:flex xl:flex-row first:mt-2 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">INDUSTRY EXPERIENCE</div>

            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              This helps us assess your level of expertise and tailor our services accordingly.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-0 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <div class="mt-1.5 xl:mt-3 text-sm leading-relaxed text-slate-500/80">
              How Many Transactions Have You Carried Out Over The Past 12 Months Trading Financial Instruments ?
            </div>
          </div>
          <div class="flex flex-col items-center md:flex-row">
<!--              <label>Horizontal Radio Button</label>-->
              <div class="flex flex-col mt-2 sm:flex-row">
                <FormCheck class="mr-2">
  <FormCheck.Input
    id="radio-4"
    type="radio"
    value="0-4 Transactions"
    v-model="transactionCount"
  />
  <FormCheck.Label>0-4 Transactions</FormCheck.Label>
</FormCheck>
<FormCheck class="mt-2 mr-2 sm:mt-0">
  <FormCheck.Input
    id="radio-5-to-10"
    type="radio"
    value="5-10 Transactions"
    v-model="transactionCount"
  />
  <FormCheck.Label htmlFor="radio-5-to-10">5-10 Transactions</FormCheck.Label>
</FormCheck>
<FormCheck class="mt-2 mr-2 sm:mt-0">
  <FormCheck.Input
    id="radio-more-10"
    type="radio"
    value="More than 10 Transactions"
    v-model="transactionCount"
  />
  <FormCheck.Label htmlFor="radio-more-10">More than 10 Transactions</FormCheck.Label>
</FormCheck>

              </div>
          </div>

          <div class="flex flex-col items-center md:flex-row mt-6">
            <div class="mt-1.5 xl:mt-3 text-sm leading-relaxed text-slate-500/80">
              What Is Your Financial Level Of Education?
            </div>
          </div>
          <div>
            <FormCheck class="mt-2">
              <FormCheck.Input
                  id="radio-switch-1"
                  type="radio"
                  name="vertical_radio_button"
                  value="I Hold A Professional Qualification In Finance/Economics"
                  v-model="educationLevel"
                  disabled
              />
              <FormCheck.Label htmlFor="radio-switch-1">
                I Hold A Professional Qualification In Finance/Economics
              </FormCheck.Label>
            </FormCheck>
            <FormCheck class="mt-2">
              <FormCheck.Input
                  id="radio-switch-2"
                  type="radio"
                  name="vertical_radio_button"
                  value="I Received Higher Education In Finance And/Or Financial Services"
                  v-model="educationLevel"
                  disabled
              />
              <FormCheck.Label htmlFor="radio-switch-2">
                I Received Higher Education In Finance And/Or Financial Services
              </FormCheck.Label>
            </FormCheck>
            <FormCheck class="mt-2">
              <FormCheck.Input
                  id="radio-switch-3"
                  type="radio"
                  name="vertical_radio_button"
                  value="In The Last 3 Years, Worked In A Role Relevant To Trading Derivatives, For Over 1 Year"
                  v-model="educationLevel"
                  disabled
              />
              <FormCheck.Label htmlFor="radio-switch-3">
                In The Last 3 Years, Worked In A Role Relevant To Trading Derivatives, For Over 1 Year
              </FormCheck.Label>
            </FormCheck>
            <FormCheck class="mt-2">
              <FormCheck.Input
                  id="radio-switch-4"
                  type="radio"
                  name="vertical_radio_button"
                  value="None Of The Above"
                  v-model="educationLevel"
                  disabled
              />
              <FormCheck.Label htmlFor="radio-switch-3">
                None Of The Above
              </FormCheck.Label>
            </FormCheck>
          </div>

        </div>
      </div>

      <!-- Trade History -->
      <div
          class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
      >
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">TRADE HISTORY</div>
            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >

              Over the past 2 years, to what extent have you traded on your own decision the following financial products
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="grid grid-cols-12 gap-2">
            <div class="col-span-4">
              <FormLabel class="text-xs text-slate-500/80" htmlFor="regular-form-2">Shares, Bondsor Equities</FormLabel>
              <FormSelect v-model="tradedShares " id="regular-form-2"  formSelectSize="sm"  aria-label=".form-select-sm example" disabled>
                <option value="Never">Never</option>
                <option value="Rarely: 1-25 Trades A Year">Rarely: 1-25 Trades A Year</option>
                <option value="Sometimes: 25-100 Trades A Year">Sometimes: 25-100 Trades A Year</option>
                <option value="Often: Over 100 Trades A Year">Often: Over 100 Trades A Year</option>
              </FormSelect>
            </div>
            <div class="col-span-4">
              <FormLabel class="text-xs text-slate-500/80" htmlFor="regular-form-2">Forex (FX) Or Rolling Spot FX </FormLabel>
              <FormSelect v-model="tradedForex"  id="regular-form-2"  formSelectSize="sm"  aria-label=".form-select-sm example" disabled>
                <option value="Never">Never</option>
                <option value="Rarely: 1-25 Trades A Year">Rarely: 1-25 Trades A Year</option>
                <option value="Sometimes: 25-100 Trades A Year">Sometimes: 25-100 Trades A Year</option>
                <option value="Often: Over 100 Trades A Year">Often: Over 100 Trades A Year</option>
              </FormSelect>
            </div>

            <div class="col-span-4">
              <FormLabel  class="text-xs text-slate-500/80" htmlFor="regular-form-2">CFDs </FormLabel>
              <FormSelect v-model="tradedCfd" id="regular-form-2"  formSelectSize="sm"  aria-label=".form-select-sm example" disabled>
                <option value="Never">Never</option>
                <option value="Rarely: 1-25 Trades A Year">Rarely: 1-25 Trades A Year</option>
                <option value="Sometimes: 25-100 Trades A Year">Sometimes: 25-100 Trades A Year</option>
                <option value="Often: Over 100 Trades A Year">Often: Over 100 Trades A Year</option>
              </FormSelect>
            </div>
          </div>
        </div>

      </div>

      <!-- 👉🏻 -- Levarages Preferred ------ -->
      <div
          class="flex-col block pt-5 mt-5 sm:flex xl:flex-row first:mt-2 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">AVERAGE LEVERAGE USED</div>

            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              This helps us understand your trading experience and risk preferences.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-0 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <div class="mt-1.5 xl:mt-3 text-sm leading-relaxed text-slate-500/80">
              What Was The Average Level Of Leverage You Used For Trading In The Financial Products You Selected Above? 																								*
            </div>
          </div>
          <div class="flex flex-col items-center md:flex-row">
            <!--              <label>Horizontal Radio Button</label>-->
            <div class="flex flex-col mt-2 sm:flex-row">
              <FormCheck class="mr-2">
                <FormCheck.Input
                    id="radio-never-used-leverage"
                    type="radio"
                    name="horizontal_radio_button"
                    value="Never Used Leverage"
                    v-model="leverage"
                    disabled
                />
                <FormCheck.Label htmlFor="radio-never-used-leverage">
                  Never Used Leverage
                </FormCheck.Label>
              </FormCheck>
              <FormCheck class="mt-2 mr-2 sm:mt-0">
                <FormCheck.Input
                    id="radio-upto-100-leverage"
                    type="radio"
                    name="horizontal_radio_button"
                    value="Up To 1:100"
                    v-model="leverage"
                    disabled
                />
                <FormCheck.Label htmlFor="radio-upto-100-leverage">
                  Up To 1:100
                </FormCheck.Label>
              </FormCheck>
              <FormCheck class="mt-2 mr-2 sm:mt-0">
                <FormCheck.Input
                    id="radio-upto-200-leverage"
                    type="radio"
                    name="horizontal_radio_button"
                    value="1:100 - 1:200"
                    v-model="leverage"
                    disabled
                />
                <FormCheck.Label htmlFor="radio-upto-200-leverage">
                  1:100 - 1:200
                </FormCheck.Label>
              </FormCheck>
              <FormCheck class="mt-2 mr-2 sm:mt-0">
                <FormCheck.Input
                    id="radio-upto-500-leverage"
                    type="radio"
                    name="horizontal_radio_button"
                    value="1:200 - 1:500"
                    v-model="leverage"
                    disabled
                />
                <FormCheck.Label htmlFor="radio-upto-500-leverage">
                  1:200 - 1:500
                </FormCheck.Label>
              </FormCheck>
              <FormCheck class="mt-2 mr-2 sm:mt-0">
                <FormCheck.Input
                    id="radio-morethan-500-leverage"
                    type="radio"
                    name="horizontal_radio_button"
                    value="More than 1:500"
                    v-model="leverage"
                    disabled
                />
                <FormCheck.Label htmlFor="radio-morethan-500-leverage">
                  More than 1:500
                </FormCheck.Label>
              </FormCheck>
            </div>
          </div>
        </div>
      </div>


      <!-- 👉🏻 -- legal info ------ -->
      <div
          class="flex-col block pt-5 mt-5 sm:flex xl:flex-row first:mt-2 first:pt-0"
      >
        <label
            class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
        >
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">LEGAL INFORMATION</div>

            </div>
            <div
                class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
            >
              Provide details regarding your legal status, including whether you are a Politically Exposed Person (PEP). This information is required for compliance with regulatory standards.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-0 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <div class="mt-3">
              <div class="flex flex-col mt-2 sm:flex-row">
                <FormCheck class="mr-2">
                  <FormCheck.Input
                      v-model="politicallyExposed"
                      id="checkbox-switch-4"
                      type="checkbox"
                      disabled
                  />
                  <FormCheck.Label htmlFor="checkbox-switch-4">
                    Check this box if you are a Politically Exposed Person (PEP)
                  </FormCheck.Label>
                </FormCheck>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center md:flex-row">
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              A PEP refers to an individual holding prominent public positions abroad, such as heads of state, senior politicians, or other high-ranking officials.
            </div>
          </div>
          <div v-if="politicallyExposed" class="flex-1 w-full mt-5 xl:mt-0">
            <div class="flex flex-col items-center md:flex-row">
              <FormInput
                  id="profession"
                  v-model="pepSpecify"
                  required
                  placeholder="Please Specify"
                  disabled
              />
            </div>
          </div>
        </div>
      </div>

   
    </div>
    
    <div
        class="flex py-5 border-t md:justify-end px-7 border-slate-200/80"
    >
     
    <!-- </div> -->

    
    <div>
    </div>
  </div>
  
</template>
