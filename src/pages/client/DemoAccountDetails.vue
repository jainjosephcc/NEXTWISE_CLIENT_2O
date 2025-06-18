<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import { ref, onMounted, computed } from "vue";
import { Tab } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import apiClient from "../../services/apiService";
import UpdateLeverageDialog from "@/components/BotComponents/Dialog/UpdateLeverageDialog.vue";
import { formatCurrency } from "@/utils/helper";
import _ from "lodash";
import mt5 from "@/assets/images/bot/mt5_lined.png";
import {useRoute} from "vue-router";
import LoadingIcon from "@/components/Base/LoadingIcon";
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import CreateDemoAccountDialog from "@/components/BotComponents/Dialog/CreateDemoAccountDialog.vue";
import UpdatePasswordDialog from "@/components/BotComponents/Dialog/UpdatePasswordDialog.vue";
import TickerWidgetFxComponent from "@/components/Commons/TickerWidgetFxComponent.vue";

import {formatCurrencyWithSymbol} from "@/utils/formatCurrency";
import ShimmerLoaderRow from "@/components/Commons/ShimmerLoaderRow.vue";

interface Account {
  mt_id: number;
  balance: number;
  leverage: number;
  server: string;
  credit: number;
  equity: number;
  margin_free: number;
  margin: number;
  margin_level: number;
  floating: number;
  swap: number;
}

// State variables
const accountList = ref<Account[]>([]);
const accountId = ref<number | null>(null);
const accountDetails = ref<Account | null>(null);
const isUpdateLeverageDialogVisible = ref(false);
const loading=ref(true);
const isShowAddDemoAccountVisible=ref(false)
const isPasswordUpdateDialogVisible=ref(false)

const activeTabIndex = ref(0);
const route = useRoute();

const changeTab = (index) => {
  activeTabIndex.value = index;
};

const bannerData = JSON.parse(localStorage.getItem('banners'));
const demo_banner=bannerData.demo_accounts_banner?.promo_link
// console.log(bannerData.demo_accounts_banner.promo_link);



// Fetch accounts from API
const fetchAccounts = async () => {
  loading.value=true;
  try {
    const response = await apiClient.get("demo-accounts/data-list");
    accountList.value = response.data.result.mt_data;
    if (accountList.value.length > 0) {
      accountId.value = accountList.value[0].mt_id; // Set the first account as default
      fetchAccountDetails();
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
  finally{
    loading.value = false; // Set loading to false after the API call
  }
};

// Fetch account details based on selected account ID
const fetchAccountDetails = async () => {
  if (accountId.value) {
    const selectedAccount = accountList.value.find(account => account.mt_id === accountId.value);
    accountDetails.value = selectedAccount || null;
  }
};

// Handle tab click to change selected account
function handleTabClick(id: number) {
  //console.log(id);
  accountId.value = id;
  fetchAccountDetails();
}

// Fetch accounts on component mount
onMounted(fetchAccounts);

function handleUpdatePassword(){
  isPasswordUpdateDialogVisible.value=true
}
</script>


<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6 mb-4">
    <div class="col-span-12">
      <TickerWidgetFxComponent/>
    </div>
  </div>


  <div class="grid grid-cols-12 gap-y-10 gap-x-6 mt-3">
    <div class="col-span-12">

      <div class="flex flex-col lg:items-center lg:flex-row gap-y-5">
        <div class="text-slate-500"> {{ $t('demo.demoAccounts')}}  </div>
        <div class="flex items-center lg:ml-auto gap-3.5 mt-4">
          <Button variant="primary" class="w-auto md:ml-auto group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent" @click="isShowAddDemoAccountVisible=true">
            <Lucide icon="PenLine" class="stroke-[1.3] w-4 h-4 mr-2" /> 
             {{ $t('demo.createDemo')}} 
          </Button>
        </div>
      </div>



      <!---------DETAILS WIDGET START-------->
    <div class="col-span-12">
      <div class="mt-3.5">
        <div  class="flex flex-col gap-3 p-3 xl:flex-row box box--stacked">
          <div>
            <div v-if="demo_banner==null"
              class="z-10 gap-5 xl:gap-14 flex flex-col lg:flex-row xl:flex-col items-center xl:items-start xl:w-[300px] overflow-hidden flex-1 px-10 rounded-[0.6rem] bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] py-12 xl:py-9 relative before:content-[''] before:w-full before:h-[130%] before:bg-gradient-to-b before:from-black/[0.08] before:to-transparent before:absolute before:left-0 before:top-0 before:-rotate-[38deg] before:hidden before:xl:block before:-ml-[35%]"
            >
              <div >
                <div
                  class="flex items-center justify-center w-12 h-12 border rounded-full border-white/10 bg-white/10"
                >
                  <Lucide
                    icon="Wallet"
                    class="w-6 h-6 text-white fill-white/10"
                  />
                </div>
              </div>
              <div>
                <div class="text-base text-center text-white lg:text-left">
                  Enjoy Easy Trading and
                </div>
                <div
                  class="flex items-center justify-center mt-2 lg:justify-start"
                >
                  <div class="text-2xl font-medium text-white">
                    Quick Transactions!

                  </div>
                  <!-- <div
                    class="flex items-center ml-2.5 border border-success/50 bg-success/50 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-white/90"
                  >
                    12%
                    <Lucide
                      icon="ChevronUp"
                      class="w-4 h-4 ml-px stroke-[1.5]"
                    />
                  </div> -->
                </div>
                <div
                  class="mt-3 leading-normal text-center xl:text-left text-white/70"
                >
                  Experience seamless order execution, instant deposits & withdrawals, and an intuitive platform designed to empower your trading journey.
                </div>
              </div>
              <div class="lg:ml-auto w-52 xl:ml-0 xl:w-full">
                <router-link to="/create-deposit">
                <Button
                  as="a"
                  rounded
                  class="relative justify-start w-full px-4 border-white/20 py-2.5 bg-white/10 text-white hover:bg-white/[0.15]"
                >
                  Deposit Now
                  <div
                    class="absolute right-0 w-9 h-9 mr-0.5 flex items-center justify-center border rounded-full bg-white/10 border-white/10"
                  >
                    <Lucide icon="ArrowRight" class="w-4 h-4" />
                  </div>
                </Button>
              </router-link>
              </div>
            </div>
            <img v-else :src="demo_banner" class="rounded-lg">
          </div>
          <div
            class="flex flex-col w-full p-2 sm:py-2 sm:px-2 border rounded-[0.6rem] border-slate-300/80 border-dashed"
          >
          <div class="flex flex-col">
          <template v-if="!loading">
            <div class="grid grid-cols-12">
              <!-- Account List Section -->
              <div class="col-span-12 sm:col-span-2 ml-1 lg:col-span-2 xl:col-span-4">
                <div class="mt-1 ">
                  <div>
                    <template v-if="accountList.length > 0">
                      <div class="grid grid-cols-2 sm:grid-cols-1 gap-2 pb-6">
                        <template v-for="(account) in accountList" :key="account.mt_id">
                          <Button
                              class="border-4 border-gray-100 rounded-[0.8rem] w-[180px] sm:w-[180px] px-2 py-1"
                              :class="accountId !== account.mt_id ? 'bg-primary text-white ring-opacity-80' : 'bg-slate-500'"
                              @click="handleTabClick(account.mt_id)"
                          >
                            <div class="flex flex-col items-center justify-between w-full space-y-2">
                              <!-- Icon and Balance Section -->
                              <div class="flex items-center justify-center w-full space-x-6">

                                      <span
                                          class="text-xl font-medium px-3 "
                                          :class="accountId === account.mt_id ? 'text-white' : ''"
                                      >
<!--                                        {{formatCurrency(account.balance)}}-->
                                      </span>
                              </div>

                              <!-- Account ID Section -->
                              <!--                                    <div
                                                                      class="text-lg font-medium text-center"
                                                                      :class="accountId === account.mt_id ? 'text-white' : 'text-primary'"
                                                                  >
                                                                    {{ account.mt_id }}
                                                                  </div>-->
                              <div class="flex justify-between w-full pb-2">
                                <!-- Icon -->
                                <img v-if="!account.is_wallet" :src="mt5" alt="icon" class="w-7 h-7" />
                                <img v-else src="/wallet.webp" alt="Paperbot" class="w-7 h-7" />
                                <!-- Balance -->
                                <span
                                    class="text-lg font-medium"
                                    :class="accountId === account.mt_id ? 'text-white' : ''"
                                >
                                        MT{{ account.mt_id }}
                                      </span>
                              </div>
                            </div>
                          </Button>
                        </template>
                      </div>


                    </template>
                  </div>
                </div>
              </div>

              <!-- Account Details Section -->
              <div v-if="accountList.length > 0" class="col-span-12 sm:col-span-10 lg:col-span-8 xl:col-span-8 flex items-center justify-center">
                <div class="">
                  <div class="grid grid-cols-12 gap-y-10 gap-x-6">

                    <div class="flex flex-col col-span-12 xl:col-span-12 gap-y-2 ml-5">
                      <div>
                        <div class="p-5 mt-3.5 box box--stacked" style="background-color: rgba(55,99,124,0.32)">
                          <div class="pb-5 mb-5 border-b border-dashed">
                            <div class="flex flex-col gap-3 sm:items-center sm:flex-row">
                              <div class="flex items-center">
                                <div
                                    class="w-25 h-25 cursor-pointer"
                                >
                                  <div
                                      class="w-full h-full p-1"
                                  >
                                    <img v-if="!accountDetails?.is_wallet" src="/mt5_logo.png" alt="icon" class="w-20 h-20"/>
                                    <img v-else src="/wallet.webp" alt="Paperbot" class="w-7 h-7">
                                  </div>
                                </div>
                                <div class="ml-4">
                                  <div class="text-lg text-slate-200 mt-0.5 text-[1.5rem] font-medium"> {{ $t('livemt5account.mt') }}
                                    {{ accountDetails?.mt_id }}
                                  </div>
                                  <div class="text-slate-200 text-[1rem] mt-0.5">{{ $t('livemt5account.balance') }}
                                    : {{ accountDetails?.balance > 0 ? formatCurrencyWithSymbol(accountDetails.balance) : 0 }}
                                    <!--                                          ${{ totalDeposit.toFixed(2) }}-->
                                  </div>

                                </div>
                              </div>
                              <div class="sm:ml-auto">
                                <router-link to="/funds?page=deposits">
                                  <Button
                                      variant="primary"
                                      class="common-btn-item cbi-fill"
                                  >
                                    {{ $t('livemt5account.quickDeposit') }}
                                  </Button>
                                </router-link>
                              </div>
                            </div>
                          </div>

                          <div
                              class="flex flex-col mt-4 border border-dashed rounded-[0.6rem] border-slate-300/80"
                          >
                            <div
                                class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
                            >
                              <div>
                                <div
                                    :class="[
                                                      'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                      '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',
                                                    ]"
                                >
                                  <Lucide
                                      icon="Server"
                                      :class="[
                                                        'w-[1.15rem] h-[1.15rem]',
                                                        'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                        'group-[.success]:text-success group-[.success]:fill-success/10',
                                                      ]"
                                  />
                                </div>
                              </div>
                              <div
                                  class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full"
                              >
                                <div>
                                  <a href="" class="font-medium whitespace-nowrap uppercase">
                                    {{ $t('livemt5account.server') }}
                                  </a>

                                </div>
                                <span
                                    :class="[
                                                      'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2']"
                                >

                                                    <span class="-mt-px"> {{ accountDetails?.server ?? '--' }}</span>
                                                  </span>
                              </div>
                            </div>
                            <!--
                                                              <div
                                                                  class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
                                                              >
                                                                <div>
                                                                  <div
                                                                      :class="[
                                                                                  'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                                                  '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',
                                                                                  '[&.success]:border-success/10 [&.success]:bg-success/10',
                                                                                  ['primary', 'success'][_.random(0, 1)],
                                                                                ]"
                                                                  >
                                                                    <Lucide
                                                                        icon="CreditCard"
                                                                        :class="[
                                                                                    'w-[1.15rem] h-[1.15rem]',
                                                                                    'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                                                    'group-[.success]:text-success group-[.success]:fill-success/10',
                                                                                  ]"
                                                                    />
                                                                  </div>
                                                                </div>
                                                                <div
                                                                    class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full"
                                                                >
                                                                  <div>
                                                                    <a href="" class="font-medium whitespace-nowrap">
                                                                      {{ $t('livemt5account.credit') }}
                                                                    </a>

                                                                  </div>
                                                                  <span
                                                                      :class="[
                                                                                  'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2']"
                                                                  >

                                                                                <span class="-mt-px"> {{ accountDetails?.credit?formatCurrency(accountDetails?.credit):'--' }}</span>
                                                                              </span>
                                                                </div>
                                                              </div> -->

                            <div
                                class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0">
                              <div>
                                <div
                                    :class="[
                                                        'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                        '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',
                                                      ]"
                                >
                                  <Lucide
                                      icon="Database"
                                      :class="[
                                                          'w-[1.15rem] h-[1.15rem]',
                                                          'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                          'group-[.success]:text-success group-[.success]:fill-success/10',
                                                        ]"
                                  />
                                </div>
                              </div>

                              <div class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full ">

                                <div class="flex items-center gap-1">
                                  <a href="" class="font-medium whitespace-nowrap">
                                    {{ $t('livemt5account.leverge').toUpperCase() }}
                                  </a>
                                </div>



                                <div class="flex flex-col gap-x-6 sm:ml-auto">

                                  <div class="flex items-center gap-1">
                                          <span :class="[
                                              'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2'
                                            ]">
                                            <span class="sm:ml-2 text-base"> 1:{{ accountDetails?.leverage ?? '--' }}</span>
                                          </span>
                                  </div>

                                  <div class="sm:ml-32">
                                    <a class="font-medium whitespace-nowrap text-xs text-slate-500 underline uppercase" @click="isUpdateLeverageDialogVisible=true">
                                      {{ $t('livemt5account.updateLeverage') }}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- <div
                                class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
                            >
                              <div>
                                <div
                                    :class="[
                                                'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',
                                                '[&.success]:border-success/10 [&.success]:bg-success/10',
                                                ['primary', 'success'][_.random(0, 1)],
                                              ]"
                                >
                                  <Lucide
                                      icon="SwatchBook"
                                      :class="[
                                                  'w-[1.15rem] h-[1.15rem]',
                                                  'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                  'group-[.success]:text-success group-[.success]:fill-success/10',
                                                ]"
                                  />
                                </div>
                              </div>
                              <div
                                  class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full"
                              >
                                <div>
                                  <a href="" class="font-medium whitespace-nowrap">
                                    {{ $t('livemt5account.swap') }}
                                  </a>

                                </div>
                                <span
                                    :class="[
                                                'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2']"
                                >

                                              <span class="-mt-px"> {{
                                                  accountDetails?.swap === 0 ? 'FREE' : accountDetails?.swap ?? '--'
                                                }}</span>
                                            </span>
                              </div> -->
                            <!-- </div> -->

                          </div>

                          <div
                              class="flex flex-col mt-4 border border-dashed rounded-[0.6rem] border-slate-300/80"
                          >
                            <div
                                class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
                            >
                              <div>
                                <div
                                    :class="[
                                                      'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                      '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',
                                                    ]"
                                >
                                  <Lucide
                                      icon="LeafyGreen"
                                      :class="[
                                                        'w-[1.15rem] h-[1.15rem]',
                                                        'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                        'group-[.success]:text-success group-[.success]:fill-success/10',
                                                      ]"
                                  />
                                </div>
                              </div>
                              <div
                                  class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full"
                              >
                                <div>
                                  <a href="" class="font-medium whitespace-nowrap uppercase">
                                    {{ $t('livemt5account.equity') }}
                                  </a>

                                </div>
                                <span
                                    :class="[
                                                      'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2']"
                                >

                                          <span class="-mt-px text-base">

                                            {{ accountDetails?.equity > 0 ? formatCurrencyWithSymbol(accountDetails.equity) : 0 }}
                                          </span>
                                                  </span>
                              </div>
                            </div>

                            <div
                                class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
                            >
                              <div>
                                <div
                                    :class="[
                                                      'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                      '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',

                                                    ]"
                                >
                                  <Lucide
                                      icon="SquareSlash"
                                      :class="[
                                                        'w-[1.15rem] h-[1.15rem]',
                                                        'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                        'group-[.success]:text-success group-[.success]:fill-success/10',
                                                      ]"
                                  />
                                </div>
                              </div>
                              <div
                                  class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full"
                              >
                                <div>
                                  <a href="" class="font-medium whitespace-nowrap uppercase">
                                    {{ $t('livemt5account.freeMargin') }}
                                  </a>

                                </div>
                                <span
                                    :class="[
                                                      'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2' ]"
                                >

                                                    <span class="-mt-px text-base">
                                                      {{ accountDetails?.margin_free > 0 ? formatCurrencyWithSymbol(accountDetails.margin_free) : 0 }}

                                                    </span>
                                                  </span>
                              </div>
                            </div>

                            <div
                                class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
                            >
                              <div>
                                <div
                                    :class="[
                                                      'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                      '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',

                                                    ]"
                                >
                                  <Lucide
                                      icon="GitCompareArrows"
                                      :class="[
                                                        'w-[1.15rem] h-[1.15rem]',
                                                        'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                        'group-[.success]:text-success group-[.success]:fill-success/10',
                                                      ]"
                                  />
                                </div>
                              </div>
                              <div
                                  class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full"
                              >
                                <div>
                                  <a href="" class="font-medium whitespace-nowrap uppercase">
                                    {{ $t('livemt5account.margin') }}
                                  </a>

                                </div>
                                <span
                                    :class="[
                                                      'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2']"
                                >

                                                    <span class="-mt-px text-base">
                                                      {{ accountDetails?.margin > 0 ? formatCurrencyWithSymbol(accountDetails.margin) : 0 }}

                                                    </span>
                                                  </span>
                              </div>
                            </div>

                            <div
                                class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
                            >
                              <div>
                                <div
                                    :class="[
                                                      'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                      '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',

                                                    ]"
                                >
                                  <Lucide
                                      icon="PencilRuler"
                                      :class="[
                                                        'w-[1.15rem] h-[1.15rem]',
                                                        'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                        'group-[.success]:text-success group-[.success]:fill-success/10',
                                                      ]"
                                  />
                                </div>
                              </div>
                              <div
                                  class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full"
                              >
                                <div>
                                  <a href="" class="font-medium whitespace-nowrap uppercase">
                                    {{ $t('livemt5account.marginLevel') }}
                                  </a>

                                </div>
                                <span
                                    :class="[
                                                      'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2']"
                                >

                                                    <span class="-mt-px text-base"> {{
                                                        accountDetails?.margin_level ?? '--'
                                                      }} %</span>
                                                  </span>
                              </div>
                            </div>

                            <div
                                class="flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
                            >
                              <div>
                                <div
                                    :class="[
                                                      'group flex items-center justify-center w-[2.5rem] h-[2.5rem] border rounded-full',
                                                      '[&.primary]:border-primary/10 [&.primary]:bg-primary/10',

                                                    ]"
                                >
                                  <Lucide
                                      icon="DraftingCompass"
                                      :class="[
                                                        'w-[1.15rem] h-[1.15rem]',
                                                        'group-[.primary]:text-primary group-[.primary]:fill-primary/10',
                                                        'group-[.success]:text-success group-[.success]:fill-success/10',
                                                      ]"
                                  />
                                </div>
                              </div>
                              <div
                                  class="ml-3.5 flex gap-y-2 flex-col sm:items-center sm:flex-row w-full"
                              >
                                <div>
                                  <a href="" class="font-medium whitespace-nowrap uppercase">
                                    {{ $t('livemt5account.floatingPl') }}
                                  </a>

                                </div>
                                <span
                                    :class="[
                                                      'sm:ml-auto mr-auto sm:mr-0 group flex items-center text-xs font-medium rounded-lg border px-4 py-2']"
                                >

                                                    <span class="-mt-px text-base"> {{ accountDetails?.floating ?? '--' }} </span>
                                                  </span>
                              </div>
                            </div>


                          </div>
                        </div>
                      </div>


                    </div>

                    <div class="flex flex-col col-span-12 xl:col-span-4 gap-y-10 ml-6">
                      <Button class="common-btn-item cbi-fill"  @click="handleUpdatePassword">
                        <Lucide
                            icon="SettingsIcon"
                            class="stroke-[1.3] w-4 h-4 mr-2"
                        />
                        {{ $t('livemt5account.updatePassword') }}
                      </Button>
                    </div>
                  </div>

                </div>
                <!-- </Tab.Group> -->

                <!-- <p class="text-lg font-medium text-gray-600">This is the dummy text for the remaining columns.</p> -->
              </div>
              <!-- <EmptyStateComponent v-else title="No Live Accounts Created !" subtitle=" Please create a new MT5   Live account to get started." class="mt-6 mb-6 col-span-10 flex items-center justify-center"/> -->

            </div>
          </template>
          <!-- </template> -->
            <div v-else>
              <ShimmerLoaderRow/>
              <ShimmerLoaderRow/>
            </div>
          <EmptyStateComponent v-if="accountList.length <= 0 && !loading" :title="$t('emptyState.noDemoAccounts')" :subtitle="$t('emptyState.createNewAccount')" class="mt-6 mb-6"/>
          
        </div>
          </div>
        </div>
        
      </div>
    </div>
    <!---------DETAILS WIDGET END-------->


    </div>
  </div>

  <UpdateLeverageDialog v-if="accountDetails" :open="isUpdateLeverageDialogVisible" :accountDetails="accountDetails"  @close="isUpdateLeverageDialogVisible = false" />
  
  <CreateDemoAccountDialog :accountList="accountList" :open="isShowAddDemoAccountVisible"  @close="isShowAddDemoAccountVisible = false" />

  <UpdatePasswordDialog v-if="accountDetails" :open="isPasswordUpdateDialogVisible" :accountDetails="accountDetails"  @close="isPasswordUpdateDialogVisible = false" />
</template>

<style scoped>
.slider-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  white-space: nowrap; /* Prevent wrapping */
  width: 100%; /* Ensure it takes full width */
}
</style>