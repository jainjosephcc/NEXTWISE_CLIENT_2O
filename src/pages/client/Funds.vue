<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import { Tab } from "@/components/Base/Headless";
import Deposit from "@/components/BotComponents/Fund/deposit.vue";
import Withdraw from "@/components/BotComponents/Fund/withdraw.vue";
import InternalTransfer from "@/components/BotComponents/Fund/internaltransfer.vue";
import Button from "@/components/Base/Button";
import TickerWidgetFxComponent from "@/components/Commons/TickerWidgetFxComponent.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";

// ✅ FIXED: Added missing parenthesis and default '{}' fallback
const bannerData = JSON.parse(localStorage.getItem('banners') || '{}');
const fund_banner = bannerData?.fund_banner?.promo_link || null;

const route = useRoute();
const router = useRouter();

// Tab management
const activeTab = ref(0);

// Map URL query values to tab indices
const tabMap: Record<string, number> = {
  'deposits': 0,
  'withdrawals': 1,
  'internaltransfers': 2
};

// Update tab based on route
const updateTabFromRoute = () => {
  const page = route.query.page as string;
  console.log("Current page query:", page);
  
  if (page in tabMap) {
    activeTab.value = tabMap[page];
  } else {
    // Default to deposits if no valid page query
    activeTab.value = 0;
    router.replace({ query: { page: 'deposits' } });
  }
  console.log("Active tab index:", activeTab.value);
};

// Handle tab changes
const changeTab = (index: number) => {
  console.log("Changing tab to:", index);
  activeTab.value = index;
  // Update URL to match the selected tab
  const queryParam = Object.keys(tabMap).find(key => tabMap[key] === index) || 'deposits';
  router.replace({ query: { page: queryParam } });
};

// Watch for route changes
watch(() => route.query.page, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    updateTabFromRoute();
  }
}, { immediate: true });

// Initialize on mount
onMounted(() => {
  updateTabFromRoute();
});
</script>


<template>
  
  <div class="grid grid-cols-12 gap-y-10 gap-x-6">
    <!---------TRADING VIEW WIDGET START-------->
    <div class="col-span-12">
      <TickerWidgetFxComponent/>
    </div>
    <!---------TRADING VIEW WIDGET END-------->
    
    <!---------FUND WIDGET START-------->
    <div class="col-span-12">
      <div class="mt-3.5">
        <div class="flex flex-col gap-3 p-3 xl:flex-row box box--stacked">
          <div>
            <div v-if="!fund_banner"
              class="z-10 gap-5 xl:gap-14 flex flex-col lg:flex-row xl:flex-col items-center xl:items-start xl:w-[300px] overflow-hidden flex-1 px-10 rounded-[0.6rem] bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] py-12 xl:py-9 relative before:content-[''] before:w-full before:h-[130%] before:bg-gradient-to-b before:from-black/[0.08] before:to-transparent before:absolute before:left-0 before:top-0 before:-rotate-[38deg] before:hidden before:xl:block before:-ml-[35%]"
            >
              <!-- Banner content remains the same -->
            </div>
            <img v-else :src="fund_banner" class="rounded-lg">
          </div>
          <div
            class="flex flex-col w-full p-5 sm:py-7 sm:px-8 border rounded-[0.6rem] border-slate-300/80 border-dashed"
          >
            <div class="col-span-6">
              <Tab.Group as="div" :selectedIndex="activeTab">
                <Tab.List
                  class="bg-slate-100 shadow-sm rounded-[0.6rem] flex flex-col sm:flex-row sm:divide-none"
                >
                  <!-- Deposit Tab -->
                  <Tab
                    as="template"
                    v-slot="{ selected }"
                  >
                    <button
                      @click="changeTab(0)"
                      :class="[
                  'w-full py-3 px-4 text-sm font-medium text-center border',
                  'transition-colors duration-200 rounded-t-md',
                  selected
                    ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                    : 'bg-black text-white border-b-2 border-transparent hover:bg-slate-800'
                ]"
                    >
                      <div class="flex items-center justify-center">
                        <Lucide icon="LogIn" class="w-5 h-5 mr-2 stroke-[1.3]" />
                        Deposit
                      </div>
                    </button>
                  </Tab>

                  <!-- Withdraw Tab -->
                  <Tab
                    as="template"
                    v-slot="{ selected }"
                  >
                    <button
                      @click="changeTab(1)"
                      :class="[
                  'w-full py-3 px-4 text-sm font-medium text-center border',
                  'transition-colors duration-200 rounded-t-md',
                  selected
                    ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                    : 'bg-black text-white border-b-2 border-transparent hover:bg-slate-800'
                ]"
                    >
                      <div class="flex items-center justify-center">
                        <Lucide icon="LogOut" class="w-5 h-5 mr-2 stroke-[1.3]" />
                        Withdraw
                      </div>
                    </button>
                  </Tab>

                  <!-- Internal Transfer Tab -->
                  <Tab
                    as="template"
                    v-slot="{ selected }"
                  >
                    <button
                      @click="changeTab(2)"
                      :class="[
                      'w-full py-3 px-4 text-sm font-medium text-center border',
                      'transition-colors duration-200 rounded-t-md',
                      selected
                        ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                        : 'bg-black text-white border-b-2 border-transparent hover:bg-slate-800'
                    ]"
                    >
                      <div class="flex items-center justify-center">
                        <Lucide icon="Rotate3d" class="w-5 h-5 mr-2 stroke-[1.3]" />
                        Internal Transfer
                      </div>
                    </button>
                  </Tab>
                </Tab.List>

                <Tab.Panels class="mt-6">
                  <Tab.Panel>
                    <Deposit v-show="activeTab === 0"/>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Withdraw v-show="activeTab === 1"/>
                  </Tab.Panel>
                  <Tab.Panel>
                    <InternalTransfer v-show="activeTab === 2"/>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---------FUND WIDGET END-------->
  </div>
</template>