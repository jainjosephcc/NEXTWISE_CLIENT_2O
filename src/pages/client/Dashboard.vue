<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import Button from "@/components/Base/Button";
import TradingViewWidget from "@/components/Commons/TradingViewWidget.vue";
import SelectedLiveRates from "@/components/Commons/SelectedLiveRates.vue";
import TinySlider from "@/components/Base/TinySlider";
import TipsSliderComponent from "@/components/Commons/TipsSliderComponent.vue";
import CurrencyConverterComponent from "@/components/Commons/CurrencyConverterComponent.vue";
import LiveClientAccountsListing from "@/components/Commons/LiveClientAccountsListing.vue";
import EconomicCalanderWidget from "@/components/Commons/EconomicCalanderWidget.vue";
import TransactionListingComponent from "@/components/Commons/TransactionListingComponent.vue";
import TotalDepositWithdrawComponent from "@/components/Commons/TotalDepositWithdrawComponent.vue";
import TickerWidgetFxComponent from "@/components/Commons/TickerWidgetFxComponent.vue";
import SmallNewsFeedComponent from "@/components/Commons/SmallNewsFeedComponent.vue";
import {FormInput, FormSelect} from "@/components/Base/Form";
import {Tab} from "@/components/Base/Headless";
import WalletComponentCard from "@/components/Commons/WalletComponentCard.vue";
import Dialog from "@/components/Base/Headless/Dialog/Dialog.vue";
import _ from "lodash";
import hotel from "@/fakers/hotel";
import Litepicker from "@/components/Base/Litepicker";
import {onMounted, ref} from "vue";
import OnboardClient from "@/pages/client/OnboardClient.vue";
import apiClient from "../../services/apiService";
import DownloadMT5Component from "@/components/Commons/DownloadMT5Component.vue";


const fetchMyStatus = async () => {
  try {
    const token = localStorage.getItem('token')
    const clientId = localStorage.getItem('clientId')

    const response = await apiClient.get('/getmystatus', {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    console.log('Client status response:', response) 
     const { data } = response
     localStorage.setItem('clientStatus', JSON.stringify(data))
  } catch (error) {
    console.error('Error fetching client status:', error)
  }
}


const largeModalSizePreview = ref(false);


function setLargeModalSizePreview(status: boolean) {
  largeModalSizePreview.value = status
}

const onBoardingDone = ref("");
const onBoardingAnswers = ref("");

const isBannerLoading = ref(false);
const leftBanner = ref(null);  // Default left banner image
const rightBanner = ref(null);  // Default right banner image
const liveAccountBanner = ref(null);  // Default live account banner image
const demoAccountBanner = ref(null);
const fundManagementBanner = ref(null);

const fetchBanners = async () => {
  isBannerLoading.value = true;
  try {
    const res = await apiClient.get("/app-dashboard-banners");
    if (res) {
      localStorage.setItem('banners', JSON.stringify(res.data));
      leftBanner.value = res.data.dashboard_left_banner?.promo_link ? res.data.dashboard_left_banner.promo_link : null; // Set left banner
      rightBanner.value = res.data.dashboard_right_banner?.promo_link ? res.data.dashboard_right_banner.promo_link : null;
      liveAccountBanner.value = res.data.live_accounts_banner?.promo_link ? res.data.live_accounts_banner.promo_link : null;
      demoAccountBanner.value = res.data.demo_accounts_banner?.promo_link ? res.data.demo_accounts_banner.promo_link : null;
      fundManagementBanner.value = res.data.fund_banner?.promo_link ? res.data.fund_banner.promo_link : null;

    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
  } finally {
    isBannerLoading.value = false; // Set loading to false after the API call
  }
};


onMounted(() => {
  fetchMyStatus();
  fetchBanners();
  try {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      // Assigning safely (fallback included)
      onBoardingDone.value = parsedData.onboarding_done; // Ensure it's always a boolean
      onBoardingAnswers.value = parsedData.onboarding_answers || ""; // Fallback to empty string
    }
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
  }
});

const videoLoaded = ref(false);

const handleVideoLoaded = () => {
  videoLoaded.value = true;
};

</script>
<template>
  <!--v-if="onBoardingDone==='done'"-->

  <div class="grid grid-cols-12 gap-y-8">



    <!---------TRADING VIEW WIDGET START-------->
    <div class="col-span-12" style="margin-top: -10px">
      <TickerWidgetFxComponent/>
    </div>
    <!---------TRADING VIEW WIDGET END-------->


    <!---------SELECTED SYMBOLS LIVE RATE START-------->
    <div class="flex flex-col col-span-12 xl:col-span-8">
      <LiveClientAccountsListing/>
    </div>
    <!---------SELECTED SYMBOLS LIVE RATE END-------->


    <!---------DEPOSIT/WITHDRAW START-------->
    <div class="flex flex-col px-4 col-span-12 xl:col-span-4">
      <TotalDepositWithdrawComponent/>
    </div>
    <!---------DEPOSIT/WITHDRAW END-------->


    <div class="flex flex-col col-span-12 xl:col-span-8">
      <DownloadMT5Component/>
    </div>
    <div class="flex flex-col px-4 col-span-12 xl:col-span-4">
      <WalletComponentCard/>
    </div>

    <div class="flex flex-col col-span-12 2xl:col-span-8">

      <TransactionListingComponent/>
    </div>

    <div class="hidden md:flex flex-col col-span-12 md:col-span-6 xl:col-span-4 gap-y-5">

      <SmallNewsFeedComponent/>
      <EconomicCalanderWidget/>
    </div>

  </div>

  <!-- BEGIN: Large Modal Content -->
  <Dialog size="lg" :open="largeModalSizePreview" @close="
                            () => {
                              setLargeModalSizePreview(false);
                            }
                          ">
    <Dialog.Panel class="text-center">
      <div class="flex flex-col gap-3 p-3 xl:flex-row box box--stacked">
        <div>
          <div
              class="z-10 gap-5 xl:gap-14 flex flex-col lg:flex-row xl:flex-col items-center xl:items-start xl:w-[250px] overflow-hidden flex-1 px-10 rounded-[0.6rem] bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] py-12 xl:py-9 relative before:content-[''] before:w-full before:h-[130%] before:bg-gradient-to-b before:from-black/[0.08] before:to-transparent before:absolute before:left-0 before:top-0 before:-rotate-[38deg] before:hidden before:xl:block before:-ml-[35%]"
          >
            <img src="/images/doc_verify.png" class="my-10">
          </div>
        </div>
        <div class="border rounded-[0.6rem] dark:border-darkmode-400 relative border-slate-200/80">
          <div
              class="absolute left-0 px-3 ml-4 -mt-2 text-xs uppercase bg-white text-slate-500 dark:bg-darkmode-600">
            <div class="-mt-px">Action Required</div>
          </div>
          <div class="px-5 py-2 mt-4 flex flex-col gap-3.5">
            <div>
              <p>As part of our ongoing system upgrade to improve security and compliance, we kindly request you to
                verify your identity by uploading the required documents for Proof of Identity (POI) and Proof of
                Address (POA). Completing this verification is necessary to proceed with transactions and other account
                actions.
              </p>
            </div><!---->
          </div>
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Large Modal Content -->

  <!--  <template v-else>
      <OnboardClient/>
    </template>-->

</template>
