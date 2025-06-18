<script setup lang="ts">
import { ref, watch } from "vue";
import { FormSwitch } from "@/components/Base/Form";

// Data for switches
const switchItems = ref([
  { label: "Price", param: "price", checked: true },
  { label: "Ask", param: "ask", checked: true },
  { label: "Bid", param: "bid", checked: true },
  { label: "Spread", param: "spread", checked: true },
]);

// Reactive state for dark mode toggle
const isDarkMode = ref(true);

// Function to construct the iframe URL dynamically
const constructIframeSrc = () => {
  const columns = switchItems.value
      .filter((item) => item.checked)
      .map((item) => item.param)
      .join(",");

  return `https://fxpricing.com/fx-widget/ticker-tape-widget.php?id=1,2,3,5,14,20&border=show&speed=50&click_target=blank&theme=${
      isDarkMode.value ? "dark" : "light"
  }&tm-cr=${isDarkMode.value ? "0a0a0a" : "FFFFFF"}&hr-cr=${
      isDarkMode.value ? "FFFFFF13" : "00000013"
  }&by-cr=28A745&sl-cr=DC3545&flags=circle&d_mode=compact-name&column=${columns}&border=hide&lang=en&font=Arial, sans-serif`;
};

// Reactive iframe source
const iframeSrc = ref(constructIframeSrc());

// Function to toggle dark mode and update iframe source
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

// Watch for changes in switches or dark mode to update iframe
watch(
    [switchItems, isDarkMode],
    () => {
      iframeSrc.value = constructIframeSrc();
    },
    { deep: true }
);
</script>

<template>
  <div class="grid grid-cols-12">
        <div class="col-span-12">
          <div class="box">
            <div style="position: relative; width: 100%;">
              <iframe
                  :src="iframeSrc"
                  width="100%"
                  height="78"
                  style="border: unset; margin-right: -30px"
              ></iframe>
              <div class="iframe-overlay"></div>
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

#fx-pricing-widget-copyright a {
  text-decoration: none;
  color: #bb3534;
  font-weight: 600;
}

.iframe-overlay {
  position: absolute;
  top: 0;
  right: -10px;
  width: 55px;
  height: 90px;
  background-color: #0a0a0a;
  z-index: 10; /* Ensure it is above the iframe */
}

</style>
