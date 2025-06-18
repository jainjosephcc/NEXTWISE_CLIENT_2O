<script setup lang="ts">
import {FormCheck, FormInput, FormLabel, FormSelect} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import {computed, onMounted, ref, watch} from "vue";
import apiClient from "../../services/apiService";
import {useRouter} from "vue-router";
const nationality = ref(null);
const isLoading = ref(false);
const router = useRouter();

onMounted(async () => {
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    const parsedData = JSON.parse(storedUserData);
    nationality.value = parsedData.country?.name || null;
  }
  const onboardingData = localStorage.getItem("onboarding");
  if(onboardingData){
    const onBoard = JSON.parse(onboardingData);
    transactionCount.value=onBoard?.transaction_count || "";
    educationLevel.value=onBoard?.education_level||"";
    tradedShares.value=onBoard?.traded_shares||"";
    tradedForex.value=onBoard?.traded_forex||"";
    tradedCfd.value=onBoard?.traded_cfd||"";
    leverage.value=onBoard?.leverage||"";
    politicallyExposed.value=onBoard?.politically_exposed||"";
    pepSpecify.value=onBoard?.pep_specification||"";
    
  }

});

// Defining all form fields as reactive variables
const transactionCount = ref(""); // e.g., 0-4, 5-10, or More than 10
const educationLevel = ref(""); // Education level (e.g., Degree in Finance)
const tradedShares = ref(""); // Shares trading history
const tradedForex = ref(""); // Forex trading history
const tradedCfd = ref(""); // CFDs trading history
const leverage = ref(""); // Selected leverage option
const politicallyExposed = ref(false); // Whether the user is a PEP
const pepSpecify = ref(""); // PEP specification (only if the checkbox is checked)



const isNextButtonEnabled = computed(() => {
  return (
      transactionCount.value !== "" &&
      educationLevel.value !== "" &&
      tradedShares.value !== "" &&
      tradedForex.value !== "" &&
      tradedCfd.value !== "" &&
      leverage.value !== "" &&
      (!politicallyExposed.value || pepSpecify.value.trim() !== "") // PEP specifics only mandatory when the checkbox is checked
  );
});




/*-------PAGE NAVIGATION START----------*/
const currentPage = ref(3);
watch(currentPage, (newValue) => {
  emit("update:currentPage", newValue); // Emit update event
});
// Emit function to send events to the parent
const emit = defineEmits(["update:currentPage"]);

const saveAndSubmit = async () => {
  if (isNextButtonEnabled.value) {
    await commonApiRequest("mark_done", 'done');
  } else {
    console.warn("Please fill in all required fields before proceeding.");
  }
};


const goBack = () => {
  currentPage.value--;
  currentPage.value--;
};



const commonApiRequest = async (label:any,value:any) => {
  try {

    if(value==='done'){
      isLoading.value = true;
    }
    // POST the updated gender to the API
    const formData = {[label]:value};
    const response = await apiClient.post("/onboarding-add-answer", formData);

    if (response?.data?.data) {
      localStorage.setItem("onboarding", JSON.stringify(response?.data?.data));
     // console.log("Updated successfully:", value);
    }
    if (response?.data?.onboarding_done === "done") {
      // Update userData in localStorage
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);

        // Safely update onboarding_done in userData
        parsedUserData.onboarding_done = "done";
        localStorage.setItem("userData", JSON.stringify(parsedUserData));
        if(isLoading){
          location.reload();
          isLoading.value = false;
        }
      }

      // Redirect to dashboard
      await router.push("/");
    }

  } catch (error: any) {
    console.error("Error updating Gender:", error.response?.data || error);
  }
  finally {
    isLoading.value = false; // Stop loader
  }
};

watch(transactionCount, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    await commonApiRequest("transaction_count", newVal);
  }
});
watch(educationLevel, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    await commonApiRequest("education_level", newVal);
  }
});
watch(tradedShares, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    await commonApiRequest("traded_shares", newVal);
  }
});
watch(tradedForex, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    await commonApiRequest("traded_forex", newVal);
  }
});
watch(tradedCfd, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    await commonApiRequest("traded_cfd", newVal);
  }
});
watch(leverage, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    await commonApiRequest("leverage", newVal);
  }
});
watch(politicallyExposed, async (newVal) => {
  // When PEP checkbox is toggled
  await commonApiRequest("politically_exposed", newVal);
});
watch(pepSpecify, async (newVal, oldVal) => {
  if (politicallyExposed.value && newVal.trim() !== "" && newVal !== oldVal) {
    await commonApiRequest("pep_specification", newVal);
  }
});

/*-------DATA YET TO BE FILLED----------*/
/*-------DATA YET TO BE FILLED----------*/
</script>

<template>
  <div>
    <div class="p-7">

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
                      id="radio-lessthan-4"
                      type="radio"
                      name="horizontal_radio_button"
                      value="0-4 Transactions"
                     v-model="transactionCount"
                  />
                  <FormCheck.Label htmlFor="radio-lessthan-4">
                    0-4 Transactions
                  </FormCheck.Label>
                </FormCheck>
                <FormCheck class="mt-2 mr-2 sm:mt-0">
                  <FormCheck.Input
                      id="radio-5-to-10"
                      type="radio"
                      name="horizontal_radio_button"
                      value="5-10 Transactions"
                      v-model="transactionCount"
                  />
                  <FormCheck.Label htmlFor="radio-5-to-10">
                    5-10 Transactions
                  </FormCheck.Label>
                </FormCheck>
                <FormCheck class="mt-2 mr-2 sm:mt-0">
                  <FormCheck.Input
                      id="radio-more-10"
                      type="radio"
                      name="horizontal_radio_button"
                      value="More than 10 Transactions"
                      v-model="transactionCount"
                  />
                  <FormCheck.Label htmlFor="radio-more-10">
                    More than 10 Transactions
                  </FormCheck.Label>
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
              <FormSelect v-model="tradedShares " id="regular-form-2"  formSelectSize="sm"  aria-label=".form-select-sm example">
                <option value="Never">Never</option>
                <option value="Rarely: 1-25 Trades A Year">Rarely: 1-25 Trades A Year</option>
                <option value="Sometimes: 25-100 Trades A Year">Sometimes: 25-100 Trades A Year</option>
                <option value="Often: Over 100 Trades A Year">Often: Over 100 Trades A Year</option>
              </FormSelect>
            </div>
            <div class="col-span-4">
              <FormLabel class="text-xs text-slate-500/80" htmlFor="regular-form-2">Forex (FX) Or Rolling Spot FX *</FormLabel>
              <FormSelect v-model="tradedForex"  id="regular-form-2"  formSelectSize="sm"  aria-label=".form-select-sm example">
                <option value="Never">Never</option>
                <option value="Rarely: 1-25 Trades A Year">Rarely: 1-25 Trades A Year</option>
                <option value="Sometimes: 25-100 Trades A Year">Sometimes: 25-100 Trades A Year</option>
                <option value="Often: Over 100 Trades A Year">Often: Over 100 Trades A Year</option>
              </FormSelect>
            </div>

            <div class="col-span-4">
              <FormLabel  class="text-xs text-slate-500/80" htmlFor="regular-form-2">CFDs * </FormLabel>
              <FormSelect v-model="tradedCfd" id="regular-form-2"  formSelectSize="sm"  aria-label=".form-select-sm example">
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
                    name="radio_button"
                    value="Never Used Leverage"
                    v-model="leverage"
                />
                <FormCheck.Label htmlFor="radio-never-used-leverage">
                  Never Used Leverage
                </FormCheck.Label>
              </FormCheck>
              <FormCheck class="mt-2 mr-2 sm:mt-0">
                <FormCheck.Input
                    id="radio-upto-100-leverage"
                    type="radio"
                    name="radio_button"
                    value="Up To 1:100"
                    v-model="leverage"
                />
                <FormCheck.Label htmlFor="radio-upto-100-leverage">
                  Up To 1:100
                </FormCheck.Label>
              </FormCheck>
              <FormCheck class="mt-2 mr-2 sm:mt-0">
                <FormCheck.Input
                    id="radio-upto-200-leverage"
                    type="radio"
                    name="radio_button"
                    value="1:100 - 1:200"
                    v-model="leverage"
                />
                <FormCheck.Label htmlFor="radio-upto-200-leverage">
                  1:100 - 1:200
                </FormCheck.Label>
              </FormCheck>
              <FormCheck class="mt-2 mr-2 sm:mt-0">
                <FormCheck.Input
                    id="radio-upto-500-leverage"
                    type="radio"
                    name="radio_button"
                    value="1:200 - 1:500"
                    v-model="leverage"
                />
                <FormCheck.Label htmlFor="radio-upto-500-leverage">
                  1:200 - 1:500
                </FormCheck.Label>
              </FormCheck>
              <FormCheck class="mt-2 mr-2 sm:mt-0">
                <FormCheck.Input
                    id="radio-morethan-500-leverage"
                    type="radio"
                    name="radio_button"
                    value="More than 1:500"
                    v-model="leverage"
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
              />
            </div>
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
          @click="saveAndSubmit"
          :disabled="!isNextButtonEnabled"
      >
        <Lucide icon="Pocket" class="stroke-[1.3] w-4 h-4 mr-2 -ml-2" />
        Save and Submit
      </Button>
    </div>
  </div>

</template>

<style scoped>

</style>