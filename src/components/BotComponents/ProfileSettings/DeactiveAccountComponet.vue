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
                  class="flex items-center pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]"
              >
                Account Deactivation
              </div>
              <div>
                <div class="leading-relaxed">
                  When you initiate the account deletion process, you'll no
                  longer have access to Front account services, and your
                  personal data will be permanently removed. You have a 10-day
                  window to cancel the deletion if needed.
                </div>
                <FormCheck class="mt-5">
                  <FormCheck.Input
                      id="checkbox-switch-1"
                      type="checkbox"
                      value=""
                  />
                  <FormCheck.Label htmlFor="checkbox-switch-1">
                    Confirm that I want to delete my account.
                  </FormCheck.Label>
                </FormCheck>
              </div>
              <div
                  class="flex flex-col-reverse gap-3 pt-5 mt-6 border-t border-dashed md:flex-row md:justify-end border-slate-300/70"
              >
                <Button
                    variant="outline-secondary"
                    class="w-full px-4 md:w-auto"
                >
                  Learn More
                </Button>
                <Button
                    variant="outline-danger"
                    class="w-full px-4 border-danger/50 bg-danger/5 md:w-auto"
                >
                  Delete
                </Button>
              </div>
            </div>
</template>