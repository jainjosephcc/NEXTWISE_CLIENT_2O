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
                Device History
              </div>
              <div>
                <div class="text-slate-500">
                  Access and control your currently connected devices.
                </div>
                <div class="mt-5 border rounded-lg border-slate-200/80">
                  <div class="overflow-auto xl:overflow-visible">
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Td
                              class="py-4 font-medium whitespace-nowrap first:rounded-tl-lg border-slate-200/80 last:rounded-tr-lg bg-slate-50 text-slate-500"
                          >
                            Browser
                          </Table.Td>
                          <Table.Td
                              class="py-4 font-medium whitespace-nowrap first:rounded-tl-lg border-slate-200/80 last:rounded-tr-lg bg-slate-50 text-slate-500"
                          >
                            Device
                          </Table.Td>
                          <Table.Td
                              class="py-4 font-medium whitespace-nowrap first:rounded-tl-lg border-slate-200/80 last:rounded-tr-lg bg-slate-50 text-slate-500"
                          >
                            Location
                          </Table.Td>
                          <Table.Td
                              class="py-4 font-medium whitespace-nowrap first:rounded-tl-lg border-slate-200/80 last:rounded-tr-lg bg-slate-50 text-slate-500"
                          >
                            Recent Activity
                          </Table.Td>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <template
                            v-for="(
                            faker, fakerKey
                          ) in recentDevices.fakeRecentDevices()"
                            :key="fakerKey"
                        >
                          <Table.Tr class="[&_td]:last:border-b-0">
                            <Table.Td
                                class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                            >
                              <div class="flex items-center whitespace-nowrap">
                                <div class="w-4 h-4 image-fit zoom-in">
                                  <img
                                      alt="Tailwise - Admin Dashboard Template"
                                      class="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                      :src="faker.browser.image"
                                  />
                                </div>
                                <div class="ml-3.5">
                                  {{ faker.browser.name }} on
                                  {{ faker.operatingSystem }}
                                </div>
                              </div>
                            </Table.Td>
                            <Table.Td
                                class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                            >
                              <div class="flex items-center whitespace-nowrap">
                                <Lucide
                                    icon="Smartphone"
                                    class="stroke-[1.3] w-4 h-4 mr-2"
                                />
                                {{ faker.device }}
                                <template v-if="!fakerKey">
                                  <div
                                      class="flex items-center text-xs font-medium rounded-md text-primary bg-primary/10 border border-primary/10 px-1.5 py-px ml-3"
                                  >
                                    <span class="-mt-px">Current</span>
                                  </div>
                                </template>
                              </div>
                            </Table.Td>
                            <Table.Td
                                class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                            >
                              <div class="whitespace-nowrap">
                                {{ faker.location }}
                              </div>
                            </Table.Td>
                            <Table.Td
                                class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                            >
                              <div class="whitespace-nowrap">
                                {{ faker.activity }}
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        </template>
                      </Table.Tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
    </template>