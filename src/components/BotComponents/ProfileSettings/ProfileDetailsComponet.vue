<script setup lang="ts">
import {
  FormCheck,
  FormInput,
} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Litepicker from "@/components/Base/Litepicker";
import { useRoute } from "vue-router";
import { ref, watch, computed } from "vue";
import _ from "lodash";

const page = ref<string | null>(null);
const selectedCountry = ref("1");
const selectedLanguage = ref("en");
const selectedTimezone = ref("-05:00");
const dateOfBirth = ref<string>("");
const gender = ref<string>("");

const route = useRoute();
defineProps({
  clientDetails: {
    type: Object,
    required: true,
  },
});

// Function to load onboarding data from localStorage
const loadOnboardingData = () => {
  const onboardingData = localStorage.getItem("onboarding");
  if (onboardingData) {
    try {
      const parsedData = JSON.parse(onboardingData);
      if (parsedData.dob) {
        dateOfBirth.value = parsedData.dob;
      }
      if (parsedData.gender) {
        gender.value = parsedData.gender;
      }
    } catch (error) {
      console.error("Failed to parse onboarding data:", error);
    }
  }
};

// Watch for route changes
watch(
  computed(() => route),
  () => {
    const queryParams = new URLSearchParams(window.location.search);
    page.value = queryParams.get("page");
  },
  { deep: true }
);

// Initialize onboarding data on component mount
loadOnboardingData();
</script>

<template>
  <div class="flex flex-col p-5 box box--stacked">
    <div class="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
      {{ $t('profileinfo.profileInfo') }}
    </div>
    <div>
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.fullName') }}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                {{ $t('profileinfo.required') }}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.inforDetails_1') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormInput type="text"
              class="first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
              :value="clientDetails.first_name" readonly />

          </div>
        </div>
      </div>
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.dateofBirth') }}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                {{ $t('profileinfo.required') }}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.inforDetails_2') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <Litepicker v-model="dateOfBirth" :options="{
            autoApply: false,
            dropdowns: {
              minYear: 1990,
              maxYear: null,
              months: true,
              years: true,
            },
          }" placeholder="Select Date of Birth" readonly disabled />
        </div>
      </div>

      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.gender') }}</div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.inforDetails_3') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <div
              class=" w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10">
              <FormCheck>
                <FormCheck.Input id="checkbox-switch-1" type="radio" value="male" v-model="gender" disabled />
                <FormCheck.Label htmlFor="checkbox-switch-1">
                  {{ $t('profileinfo.male') }}
                </FormCheck.Label>
              </FormCheck>
            </div>
            <div
              class="w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10">
              <FormCheck>
                <FormCheck.Input id="checkbox-switch-2" type="radio" value="female" v-model="gender" disabled />
                <FormCheck.Label htmlFor="checkbox-switch-2">
                  {{ $t('profileinfo.female') }}
                </FormCheck.Label>
              </FormCheck>
            </div>
            <div
              class="w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10">
              <FormCheck>
                <FormCheck.Input id="checkbox-switch-3" type="radio" value="preferNotToSay" v-model="gender" disabled />
                <FormCheck.Label htmlFor="checkbox-switch-3">
                  {{ $t('profileinfo.preferNottoSay') }}
                </FormCheck.Label>
              </FormCheck>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.email') }}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                {{ $t('profileinfo.required') }}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.inforDetails_4') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="text" :value="clientDetails.email" readonly />
        </div>
      </div>
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.phoneNumber') }}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                {{ $t('profileinfo.required') }}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.inforDetails_5') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormInput type="text"
              class="first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
              :value="clientDetails.phone" readonly />

          </div>

        </div>
      </div>

      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.accountType') }}</div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.inforDetails_6') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <!-- Individual Option -->
            <div class=" w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60">
              <FormCheck>
                <FormCheck.Input id="checkbox-switch-4" type="radio" name="accountType" value="individual" checked />
                <FormCheck.Label htmlFor="checkbox-switch-4">
                  {{ $t('profileinfo.individual') }}
                </FormCheck.Label>
              </FormCheck>
            </div>
            <!-- Corporate Option -->
            <div class=" w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 md:ml-2">
              <FormCheck>
                <FormCheck.Input id="checkbox-switch-5" type="radio" name="accountType" value="corporate" />
                <FormCheck.Label htmlFor="checkbox-switch-5">
                  {{ $t('profileinfo.corporate') }}
                </FormCheck.Label>
              </FormCheck>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.country') }}</div>
            </div>

          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <div class="flex flex-col items-center md:flex-row">
            <FormInput type="text"
              class="first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
              :value="clientDetails.country" readonly />

          </div>
        </div>
      </div>

      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.addressLine1') }}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                {{ $t('profileinfo.required') }}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.addressInfo_1') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="text" />
        </div>
      </div>
<!--      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.addressLine2') }}</div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.addressInfo_2') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="text" />
        </div>
      </div>-->
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.city') }}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                {{ $t('profileinfo.required') }}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">

              {{ $t('profileinfo.cityInfo') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="text" />
        </div>
      </div>
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.state/province') }}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                {{ $t('profileinfo.required') }}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.stateInfo') }}
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="text" />
        </div>
      </div>
      <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div class="text-left">
            <div class="flex items-center">
              <div class="font-medium">{{ $t('profileinfo.zip/Postalcode') }}</div>
              <div
                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                {{ $t('profileinfo.required') }}
              </div>
            </div>
            <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              {{ $t('profileinfo.zipInfo') }}.
            </div>
          </div>
        </label>
        <div class="flex-1 w-full mt-3 xl:mt-0">
          <FormInput type="text" />
        </div>
      </div>

    </div>
    <div class="flex pt-5 mt-6 border-t border-dashed md:justify-end border-slate-300/70">
      <Button disabled variant="outline-primary" class="w-full px-4 common-btn-item cbi-fill md:w-auto">
        {{ $t('profileinfo.updateChanges') }}
      </Button>
    </div>
  </div>
</template>
