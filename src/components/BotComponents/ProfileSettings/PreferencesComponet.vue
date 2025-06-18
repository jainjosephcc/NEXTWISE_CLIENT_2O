<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import TomSelect from "@/components/Base/TomSelect";
import {
  FormLabel,
  FormCheck,
  FormInput,
  FormSelect,
  FormSwitch,
  FormHelp,
} from "@/components/Base/Form";
import Alert from "@/components/Base/Alert";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import countries from "@/fakers/countries";
import languages from "@/fakers/languages";
import timezones from "@/fakers/timezones";
import recentDevices from "@/fakers/recent-devices";
import Button from "@/components/Base/Button";
import Litepicker from "@/components/Base/Litepicker";
import Table from "@/components/Base/Table";
import { useRoute } from "vue-router";
import { ref, watch, computed } from "vue";
import _ from "lodash";
import ResetPasswordComponent from "@/components/BotComponents/ProfileSettings/ResetPasswordComponent.vue";

const page = ref<string | null>(null);
const selectedCountry = ref("1");
const selectedLanguage = ref("en");
const selectedTimezone = ref("-05:00");
const dateOfBirth = ref<string>("");

const route = useRoute();

watch(
    computed(() => route),
    () => {
      const queryParams = new URLSearchParams(window.location.search);
      page.value = queryParams.get("page");
    },
    { deep: true }
);
</script>
<template>
<div class="flex flex-col p-5 box box--stacked">
              <div
                  class="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]"
              >
                Preferences
              </div>
              <div>
                <div
                    class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
                >
                  <label
                      class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
                  >
                    <div class="text-left">
                      <div class="flex items-center">
                        <div class="font-medium">Language</div>
                        <div
                            class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
                        >
                          Required
                        </div>
                      </div>
                      <div
                          class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
                      >
                        Select your preferred language from the available
                        options.
                      </div>
                    </div>
                  </label>
                  <div class="flex-1 w-full mt-3 xl:mt-0">
                    <TomSelect
                        v-model="selectedLanguage"
                        :options="{
                        placeholder: 'Select your language',
                      }"
                        class="w-full"
                    >
                      <template
                          v-for="(faker, fakerKey) in languages.fakeLanguages()"
                          :key="fakerKey"
                      >
                        <option :value="faker.code">
                          {{ faker.name }}
                        </option>
                      </template>
                    </TomSelect>
                  </div>
                </div>
                <div
                    class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
                >
                  <label
                      class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
                  >
                    <div class="text-left">
                      <div class="flex items-center">
                        <div class="font-medium">Time Zone</div>
                        <div
                            class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200"
                        >
                          Required
                        </div>
                      </div>
                      <div
                          class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
                      >
                        Select your current time zone from the list of available
                        options.
                      </div>
                    </div>
                  </label>
                  <div class="flex-1 w-full mt-3 xl:mt-0">
                    <TomSelect
                        v-model="selectedTimezone"
                        :options="{
                        placeholder: 'Select your timezone',
                      }"
                        class="w-full"
                    >
                      <template
                          v-for="(faker, fakerKey) in timezones.fakeTimezones()"
                          :key="fakerKey"
                      >
                        <option :value="faker.offset">
                          {{ faker.name }}
                        </option>
                      </template>
                    </TomSelect>
                  </div>
                </div>
                <div
                    class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
                >
                  <label
                      class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
                  >
                    <div class="text-left">
                      <div class="flex items-center">
                        <div class="font-medium">Item Support</div>
                      </div>
                      <div
                          class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
                      >
                        Check this box if you require additional support or
                        assistance with your item.
                      </div>
                    </div>
                  </label>
                  <div class="flex-1 w-full mt-3 xl:mt-0">
                    <FormSwitch.Input id="checkbox-switch-7" type="checkbox" />
                  </div>
                </div>
                <div
                    class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
                >
                  <label
                      class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14"
                  >
                    <div class="text-left">
                      <div class="flex items-center">
                        <div class="font-medium">Featured Items</div>
                      </div>
                      <div
                          class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80"
                      >
                        Check this box if you want your items to be featured or
                        highlighted on our
                        <a href="" class="text-primary"> platform </a>
                        .
                      </div>
                    </div>
                  </label>
                  <div class="flex-1 w-full mt-3 xl:mt-0">
                    <FormSwitch.Input id="checkbox-switch-7" type="checkbox" />
                  </div>
                </div>
              </div>
              <div
                  class="flex pt-5 mt-6 border-t border-dashed md:justify-end border-slate-300/70"
              >
                <Button
                    variant="outline-primary"
                    class="w-full px-4 border-primary/50 md:w-auto"
                >
                  Save Changes
                </Button>
              </div>
            </div>

</template>