<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue';
import { API_BASE_URL } from '@/apiConfig';
import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";

interface SymbolRate {
  symbol: string;
  name: string;
  icon_url: string;
  rate: {
    Symbol: string;
    Digits: number;
    Bid: number;
    Ask: number;
    Last: number;
    Volume: number;
    VolumeReal: number;
  }[];
}

// Reactive state to store symbols and rates
const symbols = reactive<SymbolRate[]>([]);

// SSE Reference
let eventSource: EventSource;

const connectSSE = () => {
  eventSource = new EventSource(`${API_BASE_URL}/web/stream-selected-symbols`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      symbols.splice(0, symbols.length, ...data);
    } catch (error) {
      console.error('Error parsing SSE message:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
    eventSource.close();
  };
};

onMounted(() => {
  connectSSE();
});

onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close();
  }
});
</script>

<template>
  <div class="grid grid-cols-12 gap-5">
    <div
        v-for="(symbol, index) in symbols"
        :key="index"
        class="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked"
    >
      <div class="flex items-center">
        <div
            class="w-[54px] h-[54px] p-0.5 border border-primary/80 rounded-full bg-slate-50 cursor-pointer"
        >
          <div
              class="w-full h-full p-1 bg-white border rounded-full border-slate-300/70"
          >
            <img class="rounded-full" :src="symbol.icon_url" :alt="symbol.name" />
          </div>
        </div>
        <div class="ml-4">
          <div class="-mt-0.5 text-md font-medium text-primary">
            {{ symbol.name }}
          </div>
          <div class="mt-0.5 text-slate-500">{{ symbol.symbol }}</div>
        </div>

      </div>
      <div
          class="px-4 py-2.5 mt-8 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm"
      >
        <div class="flex items-center">
          <div class="text-xl font-medium leading-tight">
            {{ symbol.rate[0]?.Bid.toFixed(symbol.rate[0]?.Digits) }}
          </div>
          <div class="flex items-center ml-2.5 font-medium text-danger">
            -3%
            <Lucide icon="ChevronDown" class="w-4 h-4 ml-px stroke-[1.5]" />
          </div>
        </div>
        <div class="mt-1 text-xs text-slate-400">BID PRICE</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>