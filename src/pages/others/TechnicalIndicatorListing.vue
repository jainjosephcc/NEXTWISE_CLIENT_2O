<script setup lang="ts">
import _ from "lodash";
import { ref, computed, watch } from "vue";
import { FormSwitch } from "@/components/Base/Form";

// Currency pair data
const currencyPairs = ref([
  { value: 1, name: "EUR/USD" },
  { value: 2, name: "EUR/CHF" },
  { value: 3, name: "EUR/JPY" },
  { value: 4, name: "EUR/GBP" },
  { value: 5, name: "EUR/NZD" },
  { value: 6, name: "EUR/CAD" },
  { value: 7, name: "EUR/RUB" },
  { value: 8, name: "EUR/SGD" },
  { value: 9, name: "EUR/DKK" },
  { value: 10, name: "EUR/TRY" },
  { value: 11, name: "EUR/ZAR" },
  { value: 12, name: "EUR/AUD" },
  { value: 13, name: "AUD/USD" },
  { value: 14, name: "AUD/JPY" },
  { value: 15, name: "AUD/CHF" },
  { value: 16, name: "AUD/CAD" },
  { value: 17, name: "AUD/SGD" },
  { value: 18, name: "USD/CAD" },
  { value: 19, name: "USD/CHF" },
  { value: 20, name: "USD/JPY" },
  { value: 21, name: "USD/NZD" },
  { value: 22, name: "USD/RUB" },
  { value: 23, name: "USD/HKD" },
  { value: 24, name: "USD/AED" },
  { value: 25, name: "USD/INR" },
]);

// Manage selected option
const selectedIndex = ref(0);
const selectedCurrencyPair = computed(() => currencyPairs.value[selectedIndex.value]?.name || "EUR/USD");

const iframeId = computed(() => {
  console.log("Computed iframeId:", currencyPairs.value[selectedIndex.value]?.value || 1);
  return currencyPairs.value[selectedIndex.value]?.value || 1;
});

// Reactive iframe source
const iframeSrc = ref(getIframeSrc(iframeId.value));

function getIframeSrc(id: number) {
  const src = `https://fxpricing.com/fx-widget/technical-indicator-widget.php?id=${id}&click_target=blank&theme=light&tm-cr=FFFFFF&hr-cr=00000013&by-cr=28A745&sl-cr=DC3545&flags=circle&value_alignment=center&tab=5M,15M,30M,1H,4H,5H,1D,1W,M&lang=en&font=Arial, sans-serif`;
  console.log("Generated iframeSrc:", src);
  return src;
}

const selectOption = (index: number, value: number) => {
  console.log("Option selected:", { index, value });
  selectedIndex.value = index;
};

// Watch selectedIndex for changes and update iframeSrc
watch(selectedIndex, (newIndex) => {
  console.log("selectedIndex changed:", newIndex);
  iframeSrc.value = getIframeSrc(currencyPairs.value[newIndex]?.value || 1);
});

// Watch iframeSrc for updates
watch(iframeSrc, (newSrc) => {
  console.log("iframeSrc updated:", newSrc);
});
</script>

<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6">
    <div class="col-span-12">
      <div class="flex flex-col lg:flex-row items-start h-auto mt-12">
        <div class="text-lg font-medium group-[.mode--light]:text-white">
          Technical Indicator
        </div>
        <div class="group-[.mode--light]:text-white/80 mx-3 hidden lg:block">
          •
        </div>
        <div class="group-[.mode--light]:text-white/80 text-slate-500 leading-relaxed mt-2 lg:mt-0 lg:ml-3">
          Enhance your trading decisions with a real-time technical indicator widget. Analyze currency pairs
          effortlessly using built-in indicators like RSI, STOCH, and MACD, and view ratings across multiple time
          frames.
        </div>
      </div>
      <div class="mt-10 grid grid-cols-12 xl:grid-cols-10 gap-y-7 lg:gap-y-10 gap-x-6">
        <div class="relative flex flex-col col-span-12 lg:col-span-9 xl:col-span-8 gap-y-7">
          <div class="flex flex-col p-5 box box--stacked">

            <div class="flex flex-col pb-5 mb-5 border-b border-dashed sm:items-center sm:flex-row border-slate-300/70">
              <div class="text-[0.94rem] font-medium">
                Currency Pair : {{ selectedCurrencyPair }}
              </div>


            </div>


            <!-- Dynamic iframe -->
            <iframe :src="iframeSrc" width="100%" height="590" style="border: 0px solid #eee; filter: invert(1);" frameborder="0"></iframe>
            <div class="iframe-overlay"></div>
          </div>
        </div>
        <div class="relative order-first col-span-12 lg:order-last lg:col-span-3 xl:col-span-2">
          <div class="sticky top-[104px]">
            <ul
              class="relative flex flex-col py-2.5 rounded-[0.6rem] bg-primary/[0.03] group-[.mode--light]:bg-slate-300/10 border border-primary/10 group-[.mode--light]:border-slate-300/20 text-slate-600/80">
              <li v-for="(pair, index) in currencyPairs" :key="pair.value" :data-index="index" :data-value="pair.value"
                @click="selectOption(index, pair.value)" :class="[
                  'relative pl-5 py-[9.2px] group-[.mode--light]:text-white/90',
                  selectedIndex === index ? 'text-primary font-medium before:bg-primary/70' : '',
                  selectedIndex === index ? '[.group.mode--light_&.active]:text-white before:bg-white' : '',
                  'before:content-[\'\'] before:absolute before:h-[60%] before:w-0.5 before:left-0 before:inset-y-0 before:my-auto before:-ml-px'
                ]">
                <a class="block -mt-px truncate" href="javascript:void(0)">
                  {{ pair.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iframe-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: rgb(16, 15, 15);
  /* Adjust transparency */
  pointer-events: none;
  /* Ensure user can still interact with the iframe */
}
</style>
