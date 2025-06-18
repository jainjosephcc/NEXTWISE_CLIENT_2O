<script setup lang="ts">
import { onMounted } from 'vue';

// Props definition with TypeScript for customizability
const props = defineProps<{
  symbols?: { proName: string; title: string }[];
  showSymbolLogo?: boolean;
  isTransparent?: boolean;
  displayMode?: string;
  colorTheme?: string;
  locale?: string;
}>();

// Default values for props
const defaultSymbols = [
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
  { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
  { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
  { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
  { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
];

const symbols = props.symbols ?? defaultSymbols;
const showSymbolLogo = props.showSymbolLogo ?? true;
const isTransparent = props.isTransparent ?? false;
const displayMode = props.displayMode ?? "adaptive";
const colorTheme = props.colorTheme ?? "light";
const locale = props.locale ?? "en";

// Inject the TradingView script on mount
onMounted(() => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';

  // Configure the widget options
  script.innerHTML = JSON.stringify({
    symbols,
    showSymbolLogo,
    isTransparent,
    displayMode,
    colorTheme,
    locale,
  });

  // Append the script to the widget container
  const container = document.querySelector('.tradingview-widget-container__widget');
  if (container) {
    container.appendChild(script);
  }
});
</script>

<template>
  <!-- TradingView Widget BEGIN -->
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <div class="tradingview-widget-copyright">
      <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
      >
      </a>
    </div>
  </div>
  <!-- TradingView Widget END -->
</template>

<style scoped>
.tradingview-widget-container {
  width: 100%;
  margin: 0 auto;
}
</style>
