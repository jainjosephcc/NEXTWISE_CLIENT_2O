<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Litepicker from "@/components/Base/Litepicker";
import Button from "@/components/Base/Button";
import {FormSelect} from "@/components/Base/Form";

// Dropdown options
const feedModes = [
  { value: "all_symbols", label: "All Symbols" },
  { value: "market", label: "Market" },
  { value: "symbol", label: "Symbol" },
];

const markets = [
  { value: "crypto", label: "Crypto" },
  { value: "stocks", label: "Stocks" },
  { value: "forex", label: "Forex" },
];

const symbols = [
  { value: "BITSTAMP:BTCUSD", label: "BTC/USD" },
  { value: "NASDAQ:AAPL", label: "Apple (AAPL)" },
  { value: "NYSE:TSLA", label: "Tesla (TSLA)" },
];

// Reactive state
const selectedFeedMode = ref("all_symbols");
const selectedMarket = ref("crypto");
const selectedSymbol = ref("BITSTAMP:BTCUSD");
const colorTheme = ref("dark");

// Dynamic widget configuration
const widgetConfig = ref({});

const generateWidgetConfig = () => {
  const config = {
    feedMode: selectedFeedMode.value,
    isTransparent: true,
    displayMode: "adaptive",
    width: "100%",
    height: "100%",
    colorTheme: colorTheme.value,
    locale: "en",
  };

  if (selectedFeedMode.value === "market") {
    config.market = selectedMarket.value;
  } else if (selectedFeedMode.value === "symbol") {
    config.symbol = selectedSymbol.value;
  }

  widgetConfig.value = config;
};

// Add TradingView widget script


// Watch for configuration changes and reload the widget
watch([selectedFeedMode, selectedMarket, selectedSymbol, colorTheme], () => {
  generateWidgetConfig();
  loadWidget();
});

// Initial widget load
onMounted(() => {
  generateWidgetConfig();
  loadWidget();
});


const loadWidget = () => {
  const widgetContainer = document.querySelector(".tradingview-widget-container__widget");
  if (!widgetContainer) return;

  // Clear existing widget content
  widgetContainer.innerHTML = "";

  const script = document.createElement("script");
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
  script.async = true;
  script.innerHTML = JSON.stringify(widgetConfig.value);

  widgetContainer.appendChild(script);

  // Use MutationObserver to adjust iframe settings after it's injected
  const observer = new MutationObserver(() => {
    const iframe = widgetContainer.querySelector("iframe");
    if (iframe) {
      iframe.setAttribute("scrolling", "yes"); // Allow scrolling
      iframe.style.pointerEvents = "auto"; // Enable scrolling interactions
      iframe.style.overflow = "auto"; // Ensure scrollable content
      iframe.style.touchAction = "auto"; // Enable touch scrolling for mobile
      observer.disconnect(); // Stop observing once adjustments are applied
    }
  });

  observer.observe(widgetContainer, { childList: true, subtree: true });
};
</script>

<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6 px-4" >
    <div class="col-span-12">

      <div class="relative mt-2 flex flex-col col-span-12 lg:col-span-8 xl:col-span-7 gap-y-7">
        <div class="flex flex-col p-5 box box--stacked">
          <div class=" rounded-md pl-4 pb-4 flex flex-col lg:flex-row gap-10">
            <!-- Feed Mode Dropdown -->
            <div>
              <FormSelect
                  id="feedMode"
                  v-model="selectedFeedMode"
                  class="sm:mt-2 sm:mr-2 bg-yellow-800"
              >
                <option v-for="mode in feedModes" :key="mode.value" :value="mode.value">
                  {{ mode.label }}
                </option>
              </FormSelect>
            </div>

            <!-- Market Dropdown -->
            <div v-if="selectedFeedMode === 'market'">
              <FormSelect
                  id="market"
                  v-model="selectedMarket"
                  class="sm:mt-2 sm:mr-2"
              >
                <option v-for="market in markets" :key="market.value" :value="market.value">
                  {{ market.label }}
                </option>
              </FormSelect>
            </div>

            <!-- Symbol Dropdown -->
            <div v-if="selectedFeedMode === 'symbol'">
              <FormSelect
                  id="symbol"
                  v-model="selectedSymbol"
                  class="sm:mt-2 sm:mr-2"
              >
                <option v-for="symbol in symbols" :key="symbol.value" :value="symbol.value">
                  {{ symbol.label }}
                </option>
              </FormSelect>
            </div>

            <!-- Color Theme Dropdown -->
          </div>

          <!-- TradingView Widget -->
          <div class="tradingview-widget-container rounded-lg border-0 h-[500px]" style="border: 0px !important;">
            <div class="iframe-overlay"></div>
            <div class="tradingview-widget-container__widget border-0 h-[500px]" style="border: 0px !important;"></div>
            <div class="tradingview-widget-copyright border-0 h-[500px]" style="border: 0px !important;">
              <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" style="border: 0px !important;">
                <span class="blue-text"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iframe-overlay {
  position: absolute;
  top: 90px;
  right: 0;
  width: 100px;
  height: 60px;
  background-color: #0f0f0f;
  z-index: 10; /* Ensure it is above the iframe */
}


</style>
