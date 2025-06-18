<script setup lang="ts">
import _ from "lodash";
import { ref, watch } from "vue";
import { FormSwitch } from "@/components/Base/Form";

// Data for switches
const switchItems = ref([
  { label: "Price", param: "price", checked: true },
  { label: "Ask", param: "ask", checked: true },
  { label: "Bid", param: "bid", checked: true },
  { label: "Change", param: "chg", checked: true },
  { label: "Change%", param: "chg_per", checked: true },
  { label: "Spread", param: "spread", checked: true },
  { label: "Time", param: "time", checked: true },
]);

// Reactive state for dark mode toggle
const isDarkMode = ref(true);

// Function to construct the iframe URL dynamically based on active parameters
const constructIframeSrc = () => {
  const columns = switchItems.value
    .filter((item) => item.checked) // Get all active parameters
    .map((item) => item.param) // Map to their respective parameter names
    .join(",");

  // Construct the URL
  return `https://fxpricing.com/fx-widget/market-currency-rates-widget.php?id=1,2,3,5,6,7,8,9,10&click_target=blank&theme=${isDarkMode.value ? "dark" : "light"
    }&tm-cr=${isDarkMode.value ? "212529" : "FFFFFF"}&hr-cr=${isDarkMode.value ? "FFFFFF13" : "00000013"
    }&by-cr=28A745&sl-cr=DC3545&flags=circle&value_alignment=center&column=${columns}&lang=en&font=Arial, sans-serif`;
};

// Reactive iframe source
const iframeSrc = ref(constructIframeSrc());

// Function to toggle dark mode and update iframe source
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

// Watch for changes in switchItems and isDarkMode to update iframeSrc
watch(
  [switchItems, isDarkMode],
  () => {
    iframeSrc.value = constructIframeSrc();
  },
  { deep: true }
);
</script>


<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6">
    <div class="col-span-12">

      <div class="flex flex-col lg:flex-row items-start h-auto mt-12">
        <div class="text-lg font-medium group-[.mode--light]:text-white">
          {{ $t('market.marketRates') }}
        </div>
        <div class="group-[.mode--light]:text-white/80 text-slate-500 leading-relaxed mt-2 lg:mt-0 lg:ml-3">

          {{ $t('market.marketDesc') }}
        </div>
      </div>
      <div class="mt-16 grid grid-cols-12 xl:grid-cols-10 gap-y-7 lg:gap-y-10 gap-x-6">
        <div class="relative flex flex-col col-span-12 lg:col-span-9 xl:col-span-8 gap-y-7">
          <div class="flex flex-col p-5 box box--stacked">
            <div class="flex flex-col pb-5 mb-5 border-b border-dashed sm:items-center sm:flex-row border-slate-300/70">
              <div class="text-[0.94rem] font-medium">
                {{ $t('market.currencyRates') }}
              </div>
<!--              <FormSwitch class="w-full mt-3 sm:w-auto sm:ml-auto sm:mt-0" @click="toggleDarkMode">
                <FormSwitch.Label htmlFor="show-example-1" class="ml-0 sm:ml-2 me-2">
                  Dark Mode
                </FormSwitch.Label>
                <FormSwitch.Input id="show-example-1" v-model="isDarkMode" type="checkbox" />
              </FormSwitch>-->

            </div>

            <div style="position: relative; width: 100%; height: 620px;">
              <iframe :src="iframeSrc" width="100%" height="620" style="border: 0px solid #eee;"></iframe>
              <div class="iframe-overlay"></div>
            </div>
          </div>
        </div>
        <div class="relative order-first col-span-12 lg:order-last lg:col-span-3 xl:col-span-2">
          <div class="sticky top-[104px]">
            <div class="flex flex-col p-5 box box--stacked">
              <div v-for="(item, index) in switchItems" :key="item.label"
                class="flex items-center justify-between space-x-4 py-3 border-b border-dashed">
                <FormSwitch class="w-full">
                  <!-- Label -->
                  <FormSwitch.Label :htmlFor="`switch-${index}`" class="text-start flex-1">
                    {{ item.label }}
                  </FormSwitch.Label>

                  <!-- Switch -->
                  <FormSwitch.Input :id="`switch-${index}`" v-model="item.checked" type="checkbox" class="ml-auto" />
                </FormSwitch>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>


<style scoped>
#fx-pricing-widget-copyright {
  text-align: center;
  font-size: 13px;
  font-family: sans-serif;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #9db2bd;
}

.fcs-brand {}

#fx-pricing-widget-copyright a {
  text-decoration: unset;
  color: #bb3534;
  font-weight: 600;
}

.iframe-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: rgb(255, 255, 255);
  /* Adjust transparency */
  pointer-events: none;
  /* Ensure user can still interact with the iframe */
}
</style>