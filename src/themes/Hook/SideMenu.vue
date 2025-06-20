<script setup lang="ts">
import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";
import {useRoute, useRouter} from "vue-router";
import Lucide from "@/components/Base/Lucide";
import Breadcrumb from "@/components/Base/Breadcrumb";
import {Menu} from "@/components/Base/Headless";
import {useCompactMenuStore} from "@/stores/compact-menu";
import {logout} from "@/services/authService";

import {
  type ProvideForceActiveMenu,
  forceActiveMenu,
  type Route,
  type FormattedMenu,
  enter,
  leave,
} from "./side-menu";
import {watch, reactive, ref, computed, onMounted, provide} from "vue";
import users from "@/fakers/users";
import SimpleBar from "simplebar";
import QuickSearch from "@/components/QuickSearch";
import SwitchAccount from "@/components/SwitchAccount";
import NotificationsPanel from "@/components/NotificationsPanel";
import ActivitiesPanel from "@/components/ActivitiesPanel";
import Dialog from "@/components/Base/Headless/Dialog/Dialog.vue";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Button from "@/components/Base/Button";
import {useI18n} from "vue-i18n";
import QuickSearchComponent from "@/components/Commons/QuickSearchComponent.vue";


const defaultCoverImage = "/user_img.png";
const img_base_url = import.meta.env.VITE_S3_BASE;

const userData = JSON.parse(localStorage.getItem("userData") || "{}");
const onBoardedData = JSON.parse(localStorage.getItem("onboarding") || "{}");
// const onBoardedData=ref({})

const profilePicUrl = ref<string | null>(null);
const onBoardingDone = ref("done")


onMounted(() => {
  /*try {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      // Assigning safely (fallback included)
      onBoardingDone.value = parsedData.onboarding_done;
      console.log(onBoardingDone.value, 'obnn');
      // Ensure it's always a boolean
      // onBoardingAnswers.value = parsedData.onboarding_answers || ""; // Fallback to empty string
    }
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
  }*/
  //console.log("User Data:", userData); // Debug userData
  // console.log("Profile Pic:", userData?.profile_pic); // Debug profile pic
  //console.log("S3 Base URL:", img_base_url); // Debug base URL

  if (userData?.profile_pic) {
    profilePicUrl.value = `${img_base_url}/profileImage/${userData.id}/${userData.profile_pic}`;
    //console.log("Generated Profile Pic URL:", profilePicUrl.value); // Debug generated URL
  } else {
    profilePicUrl.value = defaultCoverImage;
    //console.log("Using Default Cover Image:", profilePicUrl.value); // Debug fallback
  }


});


const compactMenu = useCompactMenuStore();
const setCompactMenu = (val: boolean) => {
  compactMenu.setCompactMenu(val);
};
const quickSearch = ref(false);
const setQuickSearch = (value: boolean) => {
  quickSearch.value = value;
};

const switchAccount = ref(false);
const setSwitchAccount = (value: boolean) => {
  switchAccount.value = value;
};

const notificationsPanel = ref(false);
const setNotificationsPanel = (value: boolean) => {
  notificationsPanel.value = value;
};

const activitiesPanel = ref(false);
const setActivitiesPanel = (value: boolean) => {
  activitiesPanel.value = value;
};

const compactMenuOnHover = ref(false);
const activeMobileMenu = ref(false);
const route: Route = useRoute();
const router = useRouter();
let formattedMenu = reactive<Array<FormattedMenu | string>>([]);
const setFormattedMenu = (
    computedFormattedMenu: Array<FormattedMenu | string>
) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};

provide<ProvideForceActiveMenu>("forceActiveMenu", (pageName: string) => {
  forceActiveMenu(route, pageName);
  //setFormattedMenu(menu.value);
});

const scrollableRef = ref<HTMLDivElement>();

const toggleCompactMenu = (event: MouseEvent) => {
  event.preventDefault();
  setCompactMenu(!compactMenu.value);
};

const compactLayout = () => {
  /*if (window.innerWidth <= 1600) {
    setCompactMenu(false);
  }*/
};

const requestFullscreen = () => {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  }
};

watch(
    computed(() => route.path),
    () => {
      delete route.forceActiveMenu;
    }
);

watch(
    () => route.fullPath,
    () => {
      // Automatically collapse on mobile when navigating
      if (window.innerWidth < 1280) {
        activeMobileMenu.value = false;
      }
    }
);


onMounted(() => {
  if (scrollableRef.value) {
    new SimpleBar(scrollableRef.value);
  }

  compactLayout();

  window.onresize = () => {
    compactLayout();
  };
});


const {locale} = useI18n();

const changeLanguage = (language: string) => {
  locale.value = language; // Update the current locale
  localStorage.setItem("locale", language); // Save the selected language
};

const logoutModalPreview = ref(false);
const isLoading = ref(false);
const comingSoomModal = ref(false);
const openSubMenus = ref({});

const menuExpanded = reactive({
  trading: false,
  accounts: false,
  fundManagement: false,
});

const openLogoutModal = () => {
  logoutModalPreview.value = true;
};

const closeLogoutModal = () => {
  logoutModalPreview.value = false;
};
const openComingSoon = () => {
  comingSoomModal.value = true;
};

const closeComingSoon = () => {
  comingSoomModal.value = false;
};

const handleLogout = async () => {
  isLoading.value = true; // Show loading state
  try {
    await logout(); // Call the logout API
    router.push("/login"); // Redirect to login page after successful logout
  } catch (error) {
    console.error("Logout Error:", error);
  } finally {
    isLoading.value = false; // Reset loading state
    closeLogoutModal(); // Close the modal
  }
};


</script>
<template>
  <div :class="[
    'hook',
    'before:content-[\'\'] before:z-[-1] before:w-screen before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:top-0 before:h-screen before:fixed before:bg-fixed',
  ]">
    <div :class="[
        'bg-gradient-dark text-white border-none shadow-lg',
      'xl:ml-0 shadow-xl transition-[margin] duration-300 xl:shadow-none fixed top-0 left-0 z-50 side-menu group',
      'after:content-[\'\'] after:fixed after:inset-0 after:bg-black/80 after:xl:hidden',
      { 'side-menu--collapsed': false },
      { 'side-menu--on-hover': compactMenuOnHover },
      { 'ml-0 after:block': activeMobileMenu },
      { '-ml-[275px] after:hidden': !activeMobileMenu },
    ]">
      <div :class="[
        'fixed ml-[275px] w-10 h-10 items-center justify-center xl:hidden z-50',
        { flex: activeMobileMenu },
        { hidden: !activeMobileMenu },
      ]">
        <router-link to="" @click="(event) => {
          event.preventDefault();
          activeMobileMenu = false;
        }
          " class="mt-5 ml-5">
          <Lucide icon="X" class="w-8 h-8 text-white"/>
        </router-link>
      </div>
      <div :class="[
          'bg-gradient-dark text-white border-none shadow-lg',
        'z-20 relative w-[275px] border-slate-200/80 duration-300 transition-[width] group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] h-screen flex flex-col',
        'before:content-[\'\'] before:absolute before:inset-0 before:xl:rounded-[0_0.75rem_0.75rem_0/0_1.1rem_1.1rem_0] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:border-slate-200/80 before:group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f]',
        'after:content-[\'\'] after:absolute after:inset-0 after:xl:-mr-4 after:bg-contain after:bg-fixed after:bg-[center_-20rem] after:bg-no-repeat',
      ]" @mouseover="(event) => {
        event.preventDefault();
        compactMenuOnHover = false;
      }
        " @mouseleave="(event) => {
          event.preventDefault();
          compactMenuOnHover = false;
        }
          ">
        <div
            class="bg-gradient-dark text-white border-none shadow-lg flex-none hidden xl:flex items-center z-10 px-5 h-[85px] w-[275px] overflow-hidden relative duration-300 group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]">
          <router-link to=""
                       class="flex items-center transition-[margin] duration-300 group-[.side-menu--collapsed]:xl:ml-4 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-0">
            <div
                class="transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:xl:-rotate-180 pb-5 mt-2">
              <div class="relative [&_div]:bg-white p-4 mt-4 pb-5">
                <img src="/logo_wide.svg" alt="Paperbot" class="w-40">
              </div>
            </div>
          </router-link>
        </div>
        <div ref="scrollableRef" :class="[
            'bg-gradient-dark text-white border-none shadow-lg',
          'w-full h-full z-20 px-5 overflow-y-auto overflow-x-hidden pb-3  [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent',
          '[&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30',
        ]">
          <ul class="scrollable mt-5">
            <!-- Quick Access -->

            <li>
              <router-link to="/"
                           class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-300 hover:drop-shadow-[0_0_6px_yellow]"
                           :class="{
    'text-yellow-500': route.path === '/',
    'text-white ': route.path !== '/',
  }"
              >
                <Lucide icon="LayoutDashboard" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300 "
                    :class="{ 'text-yellow-500': route.path === '/' }"
                >
     HOME
  </span>
              </router-link>

            </li>


            <!-- Accounts -->
            <li>
              <router-link
                  to="#"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer group hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/live-account-info' || route.path === '/demo-account-info',
      'text-white': !(route.path === '/live-account-info' || route.path === '/demo-account-info'),
    }"
                  @click.prevent="menuExpanded.accounts = !menuExpanded.accounts"
              >
                <Lucide icon="Users" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                    :class="{ 'text-yellow-500': route.path === '/live-account-info' || route.path === '/demo-account-info' }"
                >
       TRADING ACCOUNTS
    </span>
                <Lucide icon="ChevronDown" class="w-4 h-4 ml-auto"/>
              </router-link>

              <Transition @enter="enter" @leave="leave">
                <ul v-show="menuExpanded.accounts">
                  <!-- Live Account Info -->
                  <li>
                    <router-link
                        to="/live-account-info"
                        class="ml-6 flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer group"
                        :class="{
            'text-yellow-500': route.query.page === 'live-account-info',
            'text-white': route.query.page !== 'live-account-info'
          }"
                        @click.prevent="
            $router.push('/live-account-info?page=live-account-info');
            menuExpanded.accounts = true;
          "
                    >
                      <span
                          class="text-[16px] font-medium capitalize transition-all duration-300 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                          :class="{ 'text-yellow-500': route.query.page === 'live-account-info' }"
                      >
             {{ $t('menu.liveAccounts') }}
          </span>
                    </router-link>
                  </li>

                  <!-- Demo Account Info -->
                  <li>
                    <router-link
                        to="/demo-account-info"
                        class="ml-6 flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer group"
                        :class="{
            'text-yellow-500': route.query.page === 'demo-account-info',
            'text-white': route.query.page !== 'demo-account-info'
          }"
                        @click.prevent="
            $router.push('/demo-account-info?page=demo-account-info');
            menuExpanded.accounts = true;
          "
                    >
                      <span
                          class="text-[16px] font-medium capitalize transition-all duration-300 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                          :class="{ 'text-yellow-500': route.query.page === 'demo-account-info' }"
                      >
            {{ $t('menu.demoAccounts') }}
          </span>
                    </router-link>
                  </li>
                </ul>
              </Transition>
            </li>


            <!-- MT5 Trading View -->
            <li>
              <router-link
                  to="/web-trader"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/web-trader',
      'text-white': route.path !== '/web-trader'
    }"
              >
                <Lucide icon="Terminal" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300 "
                    :class="{ 'text-yellow-500': route.path === '/web-trader' }"
                >
      TRADING PORTAL
    </span>
              </router-link>
            </li>




            <li class="side-menu__divider text-xs text-slate-500 uppercase tracking-wider">{{ $t('menu.funds') }}</li>
            <li>
            </li>


            <li>
              <router-link
                  to="/create-deposit"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/create-deposit',
      'text-white': route.path !== '/create-deposit'
    }"
              >
                <Lucide icon="ArrowDownToLine" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300"
                    :class="{ 'text-yellow-500': route.path === '/create-deposit' }"
                >
      DEPOSITS
    </span>
              </router-link>
            </li>

            <li>
              <router-link
                  to="/create-withdraw"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/create-withdraw',
      'text-white': route.path !== '/create-withdraw'
    }"
              >
                <Lucide icon="ArrowUpToLine" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300"
                    :class="{ 'text-yellow-500': route.path === '/create-withdraw' }"
                >
      WITHDRAWALS
    </span>
              </router-link>
            </li>

            <li>
              <router-link
                  to="/create-transfer"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/funds' && route.query.page === 'internaltransfers',
      'text-white': !(route.path === '/funds' && route.query.page === 'internaltransfers')
    }"
              >
                <Lucide icon="Repeat" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300"
                    :class="{ 'text-yellow-500': route.path === '/funds' && route.query.page === 'internaltransfers' }"
                >
      INTERNAL TRANSFERS
    </span>
              </router-link>
            </li>

            <li>
              <router-link
                  to="/transactions"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/transactions',
      'text-white': route.path !== '/transactions'
    }"
              >
                <Lucide icon="Banknote" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300"
                    :class="{ 'text-yellow-500': route.path === '/transactions' }"
                >
      TRANSACTIONS
    </span>
              </router-link>
            </li>


            <!-- Resources & Insights -->
            <li class="side-menu__divider text-xs text-slate-500 uppercase tracking-wider">
              {{ $t('menu.resourcesInsights') }}
            </li>


            <!-- Education -->





            <!-- Platform -->
            <li>
              <router-link to="/platform"
                           class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                           :class="{
      'text-yellow-500': route.path === '/platform',
      'text-white': route.path !== '/platform'
    }"
              >
                <Lucide icon="Globe" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300 "
                    :class="{ 'text-yellow-500': route.path === '/platform' }"
                >
      PLATFORM
    </span>
              </router-link>
            </li>

            <!-- Technical Analysis
            <li>
              <router-link
                  to="/technical-analysis"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/technical-analysis',
      'text-white': route.path !== '/technical-analysis'
    }"
              >
                <Lucide icon="CandlestickChartIcon" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300 "
                    :class="{ 'text-yellow-500': route.path === '/technical-analysis' }"
                >
      TECHNICAL ANALYSIS
    </span>
              </router-link>
            </li> -->


            <!-- Market Data -->
            <li>
              <router-link
                  to="#"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path.startsWith('/live-rates') || route.path.startsWith('/economic-news-feed') || route.path.startsWith('/technical-indicator'),
      'text-white': !(route.path.startsWith('/live-rates') || route.path.startsWith('/economic-news-feed') || route.path.startsWith('/technical-indicator')),
    }"
                  @click.prevent="menuExpanded.marketData = !menuExpanded.marketData"
              >
                <Lucide icon="Activity" class="w-5 h-5"/>
                <span class="text-[16px] font-medium capitalize transition-all duration-300">
      RESOURCES
    </span>
                <Lucide icon="ChevronDown" class="w-4 h-4 ml-auto"/>
              </router-link>

              <Transition @enter="enter" @leave="leave">
                <ul v-show="menuExpanded.marketData">
                  <!-- Live Market Rates -->
                  <li>
                    <router-link to="/live-rates?page=live-rates"
                                 class="ml-6 flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                                 :class="{
            'text-yellow-500': route.query.page === 'live-rates',
            'text-white': route.query.page !== 'live-rates',
          }"
                                 @click.prevent="
            $router.push('/live-rates?page=live-rates');
            menuExpanded.marketData = true;
          "
                    >
                      <Lucide icon="TrendingUp" class="w-4 h-4"/>
                      <span class="text-sm font-medium capitalize"> {{ $t('menu.liveMarketRates') }} </span>
                    </router-link>
                  </li>

                  <!-- News Feed -->
                  <li>
                    <router-link
                        to="/economic-news-feed?page=economic-news-feed"
                        class="ml-6 flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                        :class="{
            'text-yellow-500': route.query.page === 'economic-news-feed',
            'text-white': route.query.page !== 'economic-news-feed',
          }"
                        @click.prevent="
            $router.push('/economic-news-feed?page=economic-news-feed');
            menuExpanded.marketData = true;
          "
                    >
                      <Lucide icon="Newspaper" class="w-4 h-4"/>
                      <span class="text-sm font-medium capitalize"> {{ $t('menu.newsFeed') }} </span>
                    </router-link>
                  </li>

                  <!-- Forex Indicators -->
                  <li>
                    <router-link
                        to="/technical-indicator?page=technical-indicator"
                        class="ml-6 flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                        :class="{
            'text-yellow-500': route.query.page === 'technical-indicator',
            'text-white': route.query.page !== 'technical-indicator',
          }"
                        @click.prevent="
            $router.push('/technical-indicator?page=technical-indicator');
            menuExpanded.marketData = true;
          "
                    >
                      <Lucide icon="BarChart" class="w-4 h-4"/>
                      <span class="text-sm font-medium capitalize"> {{ $t('menu.forexIndicators') }} </span>
                    </router-link>
                  </li>
                  <li>
                    <router-link
                        to="/forex-glossary"
                        class="ml-6 flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                        :class="{
      'text-yellow-500': route.path === '/forex-glossary',
      'text-white': route.path !== '/forex-glossary'
    }"
                    >
                      <Lucide icon="Book" class="w-5 h-5"/>
                      <span
                          class="text-[16px] font-medium capitalize transition-all duration-300"
                          :class="{ 'text-yellow-500': route.path === '/forex-glossary' }"
                      >
      {{ $t('menu.forexGlossary') }}
    </span>
                    </router-link>
                  </li>
                </ul>
              </Transition>
            </li>

            <!-- Customer Support -->

            <li class="side-menu__divider text-xs text-slate-500 uppercase tracking-wider">{{
                $t('menu.toolsAddOns')
              }}
            </li>

            <!-- SOCIAL -->
<!--            <li>
              <a
                  href="https://social.winprotrader.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow] text-white"
              >
                <Lucide icon="Briefcase" class="w-5 h-5" />
                <span class="text-[16px] font-medium capitalize transition-all duration-300">
      SOCIAL TRADING
    </span>
              </a>
            </li>-->



            <li>
              <router-link
                  to="/introducingbroker"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/introducingbroker',
      'text-white': route.path !== '/introducingbroker',
    }"
              >
                <Lucide icon="Briefcase" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300"
                    :class="{ 'text-yellow-500': route.path === '/introducingbroker' }"
                >
      INTRODUCING BROKER
    </span>
              </router-link>
            </li>

            <li>
              <router-link
                  to="/supportChat"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path === '/supportChat',
      'text-white': route.path !== '/supportChat',
    }"
              >
                <Lucide icon="MessageCircle" class="w-5 h-5"/>
                <span
                    class="text-[16px] font-medium capitalize transition-all duration-300"
                    :class="{ 'text-yellow-500': route.path === '/supportChat' }"
                >
      SUPPORT TICKETS
    </span>
              </router-link>
            </li>

            <!-- Settings Section -->
            <li>
<!--              <li class=" py-2 text-xs text-slate-500 uppercase tracking-wider">
                {{ $t('menu.profile') }}
              </li>-->

              <!-- Settings Main -->
              <router-link
                  to="#"
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  :class="{
      'text-yellow-500': route.path.startsWith('/settings'),
      'text-white': !route.path.startsWith('/settings'),
    }"
                  @click.prevent="menuExpanded.settings = !menuExpanded.settings"
              >
                <Lucide icon="Settings" class="w-5 h-5"/>
                <span class="text-[16px] font-medium capitalize transition-all duration-300">
      SETTINGS
    </span>
                <Lucide icon="ChevronDown" class="w-4 h-4 ml-auto transition-transform duration-300"
                        :class="{ 'rotate-180': menuExpanded.settings }"/>
              </router-link>

              <!-- Submenu Items -->
              <Transition name="slide">
                <ul v-if="menuExpanded.settings" class="pl-6 mt-1 space-y-1">
                  <!-- Account -->
                  <li>
                    <router-link
                        to="/settings"
                        class="flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                        :class="{
            'text-yellow-500': route.path === '/settings',
            'text-white': route.path !== '/settings',
          }"
                    >
                      <Lucide icon="UserCircle" class="w-4 h-4"/>
                      <span class="text-sm font-medium capitalize">{{ $t('menu.accountss') }}</span>
                    </router-link>
                  </li>

                  <!-- Identity -->
                  <li>
                    <router-link
                        to="/settings?page=identity"
                        class="flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                        :class="{
            'text-yellow-500': route.query.page === 'identity',
            'text-white': route.query.page !== 'identity',
          }"
                    >
                      <Lucide icon="ShieldCheck" class="w-4 h-4"/>
                      <span class="text-sm font-medium capitalize">{{ $t('menu.verification') }}</span>
                    </router-link>
                  </li>

                  <!-- Security -->
                  <li>
                    <router-link
                        to="/settings?page=security"
                        class="flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                        :class="{
            'text-yellow-500': route.query.page === 'security',
            'text-white': route.query.page !== 'security',
          }"
                    >
                      <Lucide icon="Lock" class="w-4 h-4"/>
                      <span class="text-sm font-medium capitalize">{{ $t('menu.security') }}</span>
                    </router-link>
                  </li>
                </ul>
              </Transition>
            </li>

            <!-- Logout -->
            <li>
              <a
                  class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 cursor-pointer hover:text-yellow-400 hover:drop-shadow-[0_0_6px_yellow]"
                  @click="openLogoutModal"
              >
                <Lucide icon="LogOut" class="w-5 h-5"/>
                <span class="text-[16px] font-medium capitalize"> SIGN OUT </span>
              </a>
            </li>

          </ul>
        </div>
      </div>
      <div :class="[
        'fixed h-[65px] transition-[margin] duration-100 xl:ml-[275px] group-[.side-menu--collapsed]:xl:ml-[90px] mt-3.5 inset-x-0 top-0',
        'before:content-[\'\'] before:mx-5 before:absolute before:top-0 before:inset-x-0 before:-mt-[15px] before:h-[20px] before:backdrop-blur',
      ]">
        <div
            class="absolute inset-x-0 h-full mx-5 box rounded-xl before:content-[''] before:z-[-1] before:inset-x-4 before:shadow-sm before:h-full before:bg-slate-50 before:border before:border-slate-200 before:absolute before:rounded-lg before:mx-auto before:top-0 before:mt-3 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
          <div class="flex items-center w-full h-full px-5">
            <div class="flex items-center gap-1 xl:hidden">
              <router-link to="" @click="(event) => {
                event.preventDefault();
                activeMobileMenu = true;
              }
                " class="p-2 rounded-full hover:bg-slate-100">
                <Lucide icon="AlignJustify" class="w-[18px] h-[18px]"/>
              </router-link>
              <router-link to="" class="p-2 rounded-full hover:bg-slate-100" @click="(event) => {
                event.preventDefault();
                quickSearch = true;
              }
                ">
                <Lucide icon="Search" class="w-[18px] h-[18px]"/>
              </router-link>
            </div>


            <!-- BEGIN: Breadcrumb -->
            <Breadcrumb class="flex-1 hidden xl:block">
              <!-- <Breadcrumb.Link to="/"></Breadcrumb.Link> -->
              <Breadcrumb.Link v-for="(route, index) in $route.matched" :key="index" :to="route.path"
                               :active="index === $route.matched.length - 1">
                <!-- {{route.meta}} -->
                {{ route.meta.breadcrumb }}
              </Breadcrumb.Link>
            </Breadcrumb>

            <!-- END: Breadcrumb -->
            <!-- BEGIN: Search -->
            <div class="relative justify-center flex-1 hidden xl:flex" @click="() => {
              quickSearch = true;
            }
              ">
              <div
                  class="bg-[#0a0a0a63] border w-[350px] flex items-center py-2 px-3.5 rounded-[0.5rem] text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors">
                <Lucide icon="Search" class="w-[18px] h-[18px]"/>
                <div class="ml-2.5 mr-auto">Quick search...</div>
                <div>⌘K</div>
              </div>
            </div>

            <QuickSearchComponent :quickSearch="quickSearch" :setQuickSearch="setQuickSearch"/>

            <!-- <QuickSearch :quickSearch="quickSearch" :setQuickSearch="setQuickSearch" /> -->
            <!-- END: Search -->
            <!-- BEGIN: Notification & User Menu -->
            <div class="flex items-center flex-1">
              <div class="flex items-center gap-1 ml-auto">
                <router-link to="" class="p-2 rounded-full hover:bg-slate-100" @click="(e) => {
                  e.preventDefault();
                  activitiesPanel = true;
                }
                  ">
                  <Lucide icon="LayoutGrid" class="w-[18px] h-[18px]"/>
                </router-link>
                <router-link to="" class="p-2 rounded-full hover:bg-slate-100" @click="(e) => {
                  e.preventDefault();
                  requestFullscreen();
                }
                  ">
                  <Lucide icon="Expand" class="w-[18px] h-[18px]"/>
                </router-link>
                <router-link to="" class="p-2 rounded-full hover:bg-slate-100" @click="(e) => {
                  e.preventDefault();
                  notificationsPanel = true;
                }
                  ">
                  <Lucide icon="Bell" class="w-[18px] h-[18px]"/>
                </router-link>
              </div>
              <Menu class="ml-5">
                <Menu.Button class="overflow-hidden image-fit">
                  <Lucide icon="Languages" class="w-[18px] h-[18px]"/>
                </Menu.Button>
                <Menu.Items class="w-56 mt-1">
                  <Menu.Item @click="() => changeLanguage('en')">
                    <Lucide icon="Globe" class="w-4 h-4 mr-2"/>
                    English
                  </Menu.Item>
                  <Menu.Item @click="() => changeLanguage('vn')">
                    <Lucide icon="Globe" class="w-4 h-4 mr-2"/>
                    Vietnamese
                  </Menu.Item>
                  <Menu.Item @click="() => changeLanguage('fr')">
                    <Lucide icon="Globe" class="w-4 h-4 mr-2"/>
                    Français
                  </Menu.Item>
                  <Menu.Item @click="() => changeLanguage('gr')">
                    <Lucide icon="Globe" class="w-4 h-4 mr-2"/>
                    German
                  </Menu.Item>
                  <Menu.Item @click="() => changeLanguage('hi')">
                    <Lucide icon="Globe" class="w-4 h-4 mr-2"/>
                    हिन्दी
                  </Menu.Item>
                  <Menu.Item @click="() => changeLanguage('ml')">
                    <Lucide icon="Globe" class="w-4 h-4 mr-2"/>
                    മലയാളം
                  </Menu.Item>
                  <!--                  <Menu.Item
                      @click="() => changeLanguage('th')"
                  >
                    <Lucide icon="Globe" class="w-4 h-4 mr-2" />
                    Thai
                  </Menu.Item>
                  <Menu.Item
                      @click="() => changeLanguage('vn')"
                  >
                    <Lucide icon="Globe" class="w-4 h-4 mr-2" />
                    Vietnamese
                  </Menu.Item>-->
                </Menu.Items>
              </Menu>


              <Menu class="ml-5">
                <Menu.Button
                    class="overflow-hidden rounded-full w-[50px] h-[50px] border-[3px] border-slate-200/70 image-fit">
                  <img :src="profilePicUrl" alt="Preview" class="w-[50px] h-[50px] object-cover rounded-full"
                       @error="profilePicUrl = defaultCoverImage"/>
                </Menu.Button>
                <Menu.Items class="w-56 mt-1">
                  <!--                  <Menu.Item
                      @click="
                      () => {
                        switchAccount = true;
                      }
                    "
                  >
                    <Lucide icon="ToggleLeft" class="w-4 h-4 mr-2" />
                    Switch Account
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                      @click="
                      () => {
                        router.push({
                          name: 'settings',
                          query: { page: 'connected-services' },
                        });
                      }
                    "
                  >
                    <Lucide icon="Settings" class="w-4 h-4 mr-2" />
                    Connected Services
                  </Menu.Item>
                  <Menu.Item
                      @click="
                      () => {
                        router.push({
                          name: 'settings',
                          query: { page: 'email-settings' },
                        });
                      }
                    "
                  >
                    <Lucide icon="Inbox" class="w-4 h-4 mr-2" />
                    Email Settings
                  </Menu.Item>-->
                  <Menu.Item @click="() => {
                    router.push({
                      name: 'settings',
                      query: { page: 'identity' },
                    });
                  }
                    ">
                    <Lucide icon="UserCheckIcon" class="w-4 h-4 mr-2"/>
                    Identity Verification
                  </Menu.Item>

                  <Menu.Item @click="() => {
                    router.push({
                      name: 'settings',
                      query: { page: 'security' },
                    });
                  }
                    ">
                    <Lucide icon="Lock" class="w-4 h-4 mr-2"/>
                    Reset Password
                  </Menu.Item>
                  <Menu.Divider/>
                  <Menu.Item @click="() => {
                    router.push({
                      name: 'settings',
                    });
                  }
                    ">
                    <Lucide icon="Users" class="w-4 h-4 mr-2"/>
                    Profile Info
                  </Menu.Item>
                  <Menu.Item @click="openLogoutModal">
                    <Lucide icon="Power" class="w-4 h-4 mr-2"/>
                    Logout
                  </Menu.Item>
                </Menu.Items>
              </Menu>

            </div>
            <ActivitiesPanel :activitiesPanel="activitiesPanel" :setActivitiesPanel="setActivitiesPanel"/>
            <NotificationsPanel :notificationsPanel="notificationsPanel"
                                :setNotificationsPanel="setNotificationsPanel"/>
            <SwitchAccount :switchAccount="switchAccount" :setSwitchAccount="setSwitchAccount"/>
            <!-- END: Notification & User Menu -->
          </div>
        </div>
      </div>
    </div>
    <div
        :class="[
        'relative transition-[margin,width] duration-100 pt-[66px] pb-16',
        'before:content-[\'\'] before:bg-texture-white before:bg-contain before:bg-fixed before:bg-[center_-20rem] before:bg-no-repeat before:h-screen before:w-full before:fixed before:top-0 before:-ml-5',
        'after:content-[\'\'] after:bg-gradient-to-b after:from-slate-100 after:to-slate-50 after:h-screen after:w-full after:fixed after:top-0  dark:after:from-darkmode-800 dark:after:to-darkmode-700',
        { 'xl:ml-[250px]': true },{ 'xl:mr-[-50px]': true },
        /*{ 'xl:ml-[91px]': compactMenu.value }*/,
      ]"
    >
      <div :class="[
  route.name === 'web-trader'
    ? 'mt-[8px] px-[0px] z-10 relative'
    : 'container mt-[55px] px-3 z-10 relative'
] + ' lg:ml-[30px] mr-[30px]'">
        <RouterView/>
      </div>


    </div>
  </div>

  <Dialog :open="logoutModalPreview" @close="closeLogoutModal" :static-backdrop="true">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger"/>
        <div class="mt-5 text-3xl">Are you sure?</div>
        <div class="mt-2 text-slate-500">
          Do you really want to log out?
          <br/>
          This will end your current session.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <!-- Cancel Button -->
        <Button size="sm" type="button" variant="secondary" @click="closeLogoutModal" class="w-24 mr-4">
          Cancel
        </Button>
        <!-- Confirm Logout Button -->
        <Button size="sm" type="button" variant="danger" class="w-24" @click="handleLogout">
          <template v-if="isLoading">
            Loading...
            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2"/>
          </template>
          <template v-else>
            Confirm
          </template>
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <Dialog size="sm" :open="comingSoomModal" @close="closeComingSoon">
    <Dialog.Panel class="p-10 text-center">
      <div class="relative [&_div]:bg-white p-4 mt-4 w-[220px]">
        <img class="w-[400px]" src="/src/assets/images/coming_soon.png" alt="Paperbot">
      </div>
    </Dialog.Panel>
  </Dialog>


</template>
