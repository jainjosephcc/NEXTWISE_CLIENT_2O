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
                Social Media Links
              </div>
              <div>
                <div
                    class="flex items-center pt-2.5 mt-2.5 last:mb-2 first:mt-0 first:pt-0"
                >
                  <div>
                    <div
                        class="flex items-center justify-center w-10 h-10 ml-2 border rounded-full border-primary/10 bg-primary/10"
                    >
                      <Lucide
                          icon="Linkedin"
                          class="stroke-[1.3] w-4 h-4 text-primary fill-primary/10"
                      />
                    </div>
                  </div>
                  <div
                      class="flex flex-col sm:items-center ml-5 gap-y-2.5 sm:flex-row w-full"
                  >
                    <div>
                      <div class="flex items-center">
                        <div class="font-medium">Linked In</div>
                      </div>
                      <div
                          class="pr-10 mt-1 text-xs leading-relaxed text-slate-500"
                      >
                        Not connected
                      </div>
                    </div>
                    <div class="flex flex-1 w-full sm:justify-end">
                      <Button
                          variant="primary"
                          class="px-4 bg-primary/5 border-primary/50 text-primary"
                      >
                        <Lucide
                            icon="UserPlus"
                            class="stroke-[1.3] w-4 h-4 -ml-0.5 mr-2"
                        />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                    class="flex items-center pt-2.5 mt-2.5 last:mb-2 first:mt-0 first:pt-0"
                >
                  <div>
                    <div
                        class="flex items-center justify-center w-10 h-10 ml-2 border rounded-full border-primary/10 bg-primary/10"
                    >
                      <Lucide
                          icon="Twitter"
                          class="stroke-[1.3] w-4 h-4 text-primary fill-primary/10"
                      />
                    </div>
                  </div>
                  <div
                      class="flex flex-col sm:items-center ml-5 gap-y-2.5 sm:flex-row w-full"
                  >
                    <div>
                      <div class="flex items-center">
                        <div class="font-medium">Dribbble</div>
                      </div>
                      <div
                          class="pr-10 mt-1 text-xs leading-relaxed text-slate-500"
                      >
                        Not connected
                      </div>
                    </div>
                    <div class="flex flex-1 w-full sm:justify-end">
                      <Button
                          variant="primary"
                          class="px-4 bg-primary/5 border-primary/50 text-primary"
                      >
                        <Lucide
                            icon="UserPlus"
                            class="stroke-[1.3] w-4 h-4 -ml-0.5 mr-2"
                        />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                    class="flex items-center pt-2.5 mt-2.5 last:mb-2 first:mt-0 first:pt-0"
                >
                  <div>
                    <div
                        class="flex items-center justify-center w-10 h-10 ml-2 border rounded-full border-primary/10 bg-primary/10"
                    >
                      <Lucide
                          icon="Facebook"
                          class="stroke-[1.3] w-4 h-4 text-primary fill-primary/10"
                      />
                    </div>
                  </div>
                  <div
                      class="flex flex-col sm:items-center ml-5 gap-y-2.5 sm:flex-row w-full"
                  >
                    <div>
                      <div class="flex items-center">
                        <div class="font-medium">Facebook</div>
                      </div>
                      <div
                          class="pr-10 mt-1 text-xs leading-relaxed text-slate-500"
                      >
                        <a
                            class="text-primary underline decoration-dotted decoration-primary/30 underline-offset-[3px] text-xs"
                            href=""
                        >
                          www.facebook.com/{{
                            users
                                .fakeUsers()[0]
                                .name.toLowerCase()
                                .replace(" ", "")
                          }}
                        </a>
                      </div>
                    </div>
                    <div class="flex flex-1 w-full sm:justify-end">
                      <Button
                          variant="primary"
                          class="px-4 bg-primary/5 border-primary/50 text-primary"
                      >
                        <Lucide
                            icon="Check"
                            class="stroke-[1.3] w-4 h-4 -ml-0.5 mr-2"
                        />
                        Connected
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                    class="flex items-center pt-2.5 mt-2.5 last:mb-2 first:mt-0 first:pt-0"
                >
                  <div>
                    <div
                        class="flex items-center justify-center w-10 h-10 ml-2 border rounded-full border-primary/10 bg-primary/10"
                    >
                      <Lucide
                          icon="Instagram"
                          class="stroke-[1.3] w-4 h-4 text-primary fill-primary/10"
                      />
                    </div>
                  </div>
                  <div
                      class="flex flex-col sm:items-center ml-5 gap-y-2.5 sm:flex-row w-full"
                  >
                    <div>
                      <div class="flex items-center">
                        <div class="font-medium">Instagram</div>
                      </div>
                      <div
                          class="pr-10 mt-1 text-xs leading-relaxed text-slate-500"
                      >
                        Not connected
                      </div>
                    </div>
                    <div class="flex flex-1 w-full sm:justify-end">
                      <Button
                          variant="primary"
                          class="px-4 bg-primary/5 border-primary/50 text-primary"
                      >
                        <Lucide
                            icon="UserPlus"
                            class="stroke-[1.3] w-4 h-4 -ml-0.5 mr-2"
                        />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                    class="flex items-center pt-2.5 mt-2.5 last:mb-2 first:mt-0 first:pt-0"
                >
                  <div>
                    <div
                        class="flex items-center justify-center w-10 h-10 ml-2 border rounded-full border-primary/10 bg-primary/10"
                    >
                      <Lucide
                          icon="Twitter"
                          class="stroke-[1.3] w-4 h-4 text-primary fill-primary/10"
                      />
                    </div>
                  </div>
                  <div
                      class="flex flex-col sm:items-center ml-5 gap-y-2.5 sm:flex-row w-full"
                  >
                    <div>
                      <div class="flex items-center">
                        <div class="font-medium">Twitter</div>
                      </div>
                      <div
                          class="pr-10 mt-1 text-xs leading-relaxed text-slate-500"
                      >
                        <a
                            class="text-primary underline decoration-dotted decoration-primary/30 underline-offset-[3px] text-xs"
                            href=""
                        >
                          www.twitter.com/{{
                            users
                                .fakeUsers()[0]
                                .name.toLowerCase()
                                .replace(" ", "")
                          }}
                        </a>
                      </div>
                    </div>
                    <div class="flex flex-1 w-full sm:justify-end">
                      <Button
                          variant="primary"
                          class="px-4 bg-primary/5 border-primary/50 text-primary"
                      >
                        <Lucide
                            icon="Check"
                            class="stroke-[1.3] w-4 h-4 -ml-0.5 mr-2"
                        />
                        Connected
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
</template>