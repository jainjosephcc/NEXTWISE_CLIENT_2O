<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import { Menu, Popover } from "@/components/Base/Headless";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import {computed, ref, watch} from "vue";
import { Tab } from "@/components/Base/Headless";
import DepositList from "@/components/BotComponents/Transactions/depositList.vue";
import WithdrawList from "@/components/BotComponents/Transactions/withdrawList.vue";
import InternalTransferList from "@/components/BotComponents/Transactions/internalTransferList.vue";
import {useRoute} from "vue-router";


const page = ref<string | null>(null);
const products = ref([]);
const activeTabIndex = ref(0);
const route = useRoute();

const changeTab = (index) => {
  activeTabIndex.value = index;
};



</script>

<template>
  <div>
    <div class="col-span-12 mt-10">
      <Tab.Group v-model="activeTabIndex">
        <div class="flex flex-wrap items-center gap-y-3 md:h-10">
          <div class="text-base font-medium text-center w-full md:w-auto md:text-left group-[.mode--light]:text-white">
            <div class="text-xl uppercase text-yellow-500"> {{ $t('transactionHistory.transactionsHistory') }}</div>
          </div>
          <Tab.List
              variant="boxed-tabs"
              class="flex flex-wrap justify-center md:ml-auto bg-white box rounded-[0.6rem] border-slate-200 group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!border-transparent py-3 px-3"
          >
            <Tab class="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem]">
              <Tab.Button
                  @click="changeTab(0)"
                  :class="`w-full md:w-36 text-slate-500 whitespace-nowrap rounded-[0.6rem] ${activeTabIndex === 0 ? 'border-b-2 border-slate-400' : 'border-0'}`"
                  as="button"
              >
                {{ $t('transactionHistory.deposits') }}
              </Tab.Button>
            </Tab>
            <Tab class="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem]">
              <Tab.Button
                  @click="changeTab(1)"
                  :class="`w-full md:w-36 text-slate-500 whitespace-nowrap rounded-[0.6rem] ${activeTabIndex === 1 ? 'border-b-2 border-slate-400' : 'border-0'}`"
                  as="button"
              >
                {{ $t('transactionHistory.withdraw') }}
              </Tab.Button>
            </Tab>
            <Tab class=" first:rounded-l-[0.6rem] last:rounded-r-[0.6rem]">
              <Tab.Button
                  @click="changeTab(2)"
                  :class="`w-full md:w-44 text-slate-500 whitespace-nowrap rounded-[0.6rem] ${activeTabIndex === 2 ? 'border-b-2 border-slate-400' : 'border-0'}`"
                  as="button"
              >
                {{ $t('transactionHistory.internalTransactions') }}
              </Tab.Button>
            </Tab>
          </Tab.List>
        </div>
      </Tab.Group>
    </div>
    <div class="col-span-12 mt-4">
      <div class="mt-5 md:mt-20">
      <div class="flex flex-col box box--stacked">
<!--          <div class="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
            <div>
              <div class="relative">
                <Lucide
                    icon="Search"
                    class="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                />
                <FormInput
                    type="text"
                    placeholder="Search transactions..."
                    class="pl-9 sm:w-64 rounded-[0.5rem]"
                />
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
              <Menu>
                <Menu.Button
                    :as="Button"
                    variant="outline-secondary"
                    class="w-full sm:w-auto"
                >
                  <Lucide icon="Download" class="stroke-[1.3] w-4 h-4 mr-2" />
                  {{ $t('transactionHistory.export')}}
                  <Lucide
                      icon="ChevronDown"
                      class="stroke-[1.3] w-4 h-4 ml-2"
                  />
                </Menu.Button>
                <Menu.Items class="w-40">
                  <Menu.Item>
                    <Lucide icon="FileBarChart" class="w-4 h-4 mr-2" />  {{ $t('transactionHistory.pdf')}}
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="FileBarChart" class="w-4 h-4 mr-2" />
                    {{ $t('transactionHistory.csv')}}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
              <Popover class="inline-block" v-slot="{ close }">
                <Popover.Button
                    :as="Button"
                    variant="outline-secondary"
                    class="w-full sm:w-auto"
                >
                  <Lucide
                      icon="ArrowDownWideNarrow"
                      class="stroke-[1.3] w-4 h-4 mr-2"
                  />
                  {{ $t('transactionHistory.filter')}}
                  <div
                      class="flex items-center justify-center h-5 px-1.5 ml-2 text-xs font-medium border rounded-full bg-slate-100"
                  >
                    3
                  </div>
                </Popover.Button>
                <Popover.Panel placement="bottom-end">
                  <div class="p-2">
                    <div>
                      <div class="text-left text-slate-500"> {{ $t('transactionHistory.status')}}</div>
                      <FormSelect class="flex-1 mt-2">
                        <option value="Active"> {{ $t('transactionHistory.active')}}</option>
                        <option value="Inactive"> {{ $t('transactionHistory.inactive')}}</option>
                      </FormSelect>
                    </div>
                    <div class="mt-3">
                      <div class="text-left text-slate-500">{{ $t('transactionHistory.stock')}}</div>
                      <FormSelect class="flex-1 mt-2">
                        <option value="1 - 50">1 - 50</option>
                        <option value="51 - 100">50 - 100</option>
                        <option value="> 100">&gt; 100</option>
                      </FormSelect>
                    </div>
                    <div class="flex items-center mt-4">
                      <Button
                          variant="secondary"
                          @click="
                          () => {
                            close();
                          }
                        "
                          class="w-32 ml-auto"
                      >
                      {{ $t('transactionHistory.close')}}
                      </Button>
                      <Button variant="primary" class="w-32 ml-2">
                        {{ $t('transactionHistory.apply')}}
                      </Button>
                    </div>
                  </div>
                </Popover.Panel>
              </Popover>
            </div>
          </div>-->
          <!-- <div > -->
          <Tab.Group v-model="activeTabIndex">
            <Tab.Panels class="mt-5">
              <Tab.Panel v-if="activeTabIndex === 0" class="leading-relaxed">
                <DepositList/>
              </Tab.Panel>
              <Tab.Panel v-if="activeTabIndex === 1" class="leading-relaxed">
                <WithdrawList/>
              </Tab.Panel>
              <Tab.Panel v-if="activeTabIndex === 2" class="leading-relaxed">
                <InternalTransferList/>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          <!-- </div> -->

        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Adjust tab list to make it scrollable in smaller screens */
@media (max-width: 768px) {
  .Tab__List {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* smooth scrolling on iOS */
  }
  .Tab__List::-webkit-scrollbar {
    display: none; /* hide scrollbar */
  }
}
</style>
