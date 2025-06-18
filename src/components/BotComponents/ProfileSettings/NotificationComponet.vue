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
                Notification Settings
              </div>
              <div>
                <Alert
                    variant="outline-primary"
                    class="flex items-center px-4 mb-2 bg-primary/5 border-primary/20"
                    v-slot="{ dismiss }"
                >
                  <div>
                    <Lucide
                        icon="AlertCircle"
                        class="stroke-[1.3] w-4 h-4 mr-3 md:mr-2"
                    />
                  </div>
                  <div class="mr-5 leading-relaxed">
                    We'd like to request your browser's permission to display
                    notifications.
                    <a
                        href=""
                        class="ml-1 font-medium underline decoration-dotted decoration-warning/50 underline-offset-[3px]"
                    >
                      Request permission
                    </a>
                    <Alert.DismissButton
                        type="button"
                        class="inset-y-0 btn-close"
                        @click="dismiss"
                        aria-label="Close"
                    >
                      <Lucide icon="X" class="w-4 h-4" />
                    </Alert.DismissButton>
                  </div>
                </Alert>
                <div class="mt-5 border rounded-lg border-slate-200/80">
                  <div class="overflow-auto xl:overflow-visible">
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Td
                              class="py-4 font-medium first:rounded-tl-lg border-slate-200/80 last:rounded-tr-lg bg-slate-50 text-slate-500"
                          >
                            Type
                          </Table.Td>
                          <Table.Td
                              class="py-4 font-medium first:rounded-tl-lg border-slate-200/80 last:rounded-tr-lg bg-slate-50 text-slate-500"
                          >
                            <div class="flex flex-col items-center">
                              <Lucide icon="MailCheck" class="w-6 h-6" />
                              <div class="mt-1.5">Email</div>
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 font-medium first:rounded-tl-lg border-slate-200/80 last:rounded-tr-lg bg-slate-50 text-slate-500"
                          >
                            <div class="flex flex-col items-center">
                              <Lucide icon="Globe" class="w-6 h-6" />
                              <div class="mt-1.5">Browser</div>
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 font-medium first:rounded-tl-lg border-slate-200/80 last:rounded-tr-lg bg-slate-50 text-slate-500"
                          >
                            <div class="flex flex-col items-center">
                              <Lucide icon="Smartphone" class="w-6 h-6" />
                              <div class="mt-1.5">App</div>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <Table.Tr class="[&_td]:last:border-b-0">
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="whitespace-nowrap">
                              Unusual login activity detected
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr class="[&_td]:last:border-b-0">
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="flex items-center whitespace-nowrap">
                              Password change request
                              <Lucide
                                  class="w-4 h-4 ml-1.5 text-slate-400 stroke-[1.3]"
                                  icon="Info"
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr class="[&_td]:last:border-b-0">
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="whitespace-nowrap">
                              New message received
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr class="[&_td]:last:border-b-0">
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="whitespace-nowrap">
                              Account activity summary
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr class="[&_td]:last:border-b-0">
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="flex items-center whitespace-nowrap">
                              Security alert: Unrecognized device
                              <Lucide
                                  class="w-4 h-4 ml-1.5 text-slate-400 stroke-[1.3]"
                                  icon="Info"
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                          <Table.Td
                              class="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            <div class="text-center">
                              <FormCheck.Input
                                  id="checkbox-switch-3"
                                  type="checkbox"
                                  value=""
                              />
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>
                </div>
                <div
                    class="flex-col block pt-5 mt-3 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
                >
                  <label
                      class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-1/2 xl:mr-14"
                  >
                    <div class="text-left">
                      <div class="flex items-center">
                        <div class="font-medium">
                          When would you prefer to receive notifications?
                        </div>
                      </div>
                    </div>
                  </label>
                  <div class="flex-1 w-full mt-3 xl:mt-0">
                    <FormSelect>
                      <option value="Immediately">Immediately</option>
                      <option value="In the morning">In the morning</option>
                      <option value="At noon">At noon</option>
                      <option value="In the afternoon">In the afternoon</option>
                      <option value="In the evening">In the evening</option>
                      <option value="At night">At night</option>
                      <option value="Once a day">Once a day</option>
                      <option value="Twice a day">Twice a day</option>
                      <option value="Custom schedule">Custom schedule</option>
                      <option value="Don't send notifications">
                        Don't send notifications
                      </option>
                    </FormSelect>
                  </div>
                </div>
                <div
                    class="flex-col block pt-5 mt-3 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0"
                >
                  <label
                      class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-1/2 xl:mr-14"
                  >
                    <div class="text-left">
                      <div class="flex items-center">
                        <div class="font-medium">
                          Receive a daily overview ('Daily Digest') of your task
                          activity.
                        </div>
                      </div>
                    </div>
                  </label>
                  <div class="flex-1 w-full mt-3 xl:mt-0">
                    <div class="flex flex-col items-center md:flex-row">
                      <FormSelect
                          class="first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
                      >
                        <option value="Every day">Every day</option>
                        <option value="Once a day">Once a day</option>
                        <option value="Twice a day">Twice a day</option>
                        <option
                            value="No daily overview (disable Daily Digest)"
                        >
                          No daily overview (disable Daily Digest)
                        </option>
                      </FormSelect>
                      <FormSelect
                          class="first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
                      >
                        <option value="at 8:00 AM">at 8:00 AM</option>
                        <option value="at 12:00 PM">at 12:00 PM</option>
                        <option value="at 4:00 PM">at 4:00 PM</option>
                        <option value="at 8:00 PM">at 8:00 PM</option>
                      </FormSelect>
                    </div>
                  </div>
                </div>
                <div class="mt-7 text-slate-500">
                  To reduce interruptions, email notifications are bundled and
                  delivered when you're not actively using your device.
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