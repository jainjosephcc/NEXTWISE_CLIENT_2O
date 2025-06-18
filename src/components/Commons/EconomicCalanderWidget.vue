<script setup lang="ts">
import { onMounted, ref } from 'vue';

// Reactive ref to hold the widget container ID
const widgetContainerId = ref<string>('tradingview-widget-container');

// Function to load the TradingView widget script
const loadTradingViewWidget = () => {
  const scriptId = 'tradingview-widget-script';

  // Check if the script already exists
  if (document.getElementById(scriptId)) {
    return;
  }

  // Create a new script element
  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'text/javascript';
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
  script.async = true;

  // Widget configuration as JSON
  script.text = JSON.stringify({
    width: '100%',
    height: '800', // Ensure this matches your desired height
    colorTheme: 'dark',
    isTransparent: true,
    locale: 'en',
    importanceFilter: '-1,0,1',
    countryFilter: 'ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu',
  });

  // Append the script to the widget container
  const widgetContainer = document.getElementById(widgetContainerId.value);
  if (widgetContainer) {
    widgetContainer.appendChild(script);
  }
};

// Load the widget when the component is mounted
onMounted(() => {
  loadTradingViewWidget();
});
</script>

<template>
  <div class="flex flex-col col-span-12 md:col-span-6 xl:col-span-4 gap-y-10 px-4">
    <div>
      <div class="p-5 mt-3.5 box box--stacked">
        <div>
          <div class="text-slate-500">Economic Calender</div>
        </div>
        <div :id="widgetContainerId" class="tradingview-widget-container">
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.tradingview-widget-container {
  width: 100%;
  height: 800px; /* Set a fixed height */
  position: relative;
}

.tradingview-widget-container__widget {
  width: 100%;
  height: 100%;
}
</style>
