<script setup lang="ts">
import { ref } from "vue";

const parsedData = ref(null);
const userData = localStorage.getItem('userData');

const iOSLink = import.meta.env.VITE_DOWNLOAD_IOS;
const androidLink = import.meta.env.VITE_DOWNLOAD_ANDROID;
const windowsLink = import.meta.env.VITE_DOWNLOAD_WINDOWS;


</script>

<template>
  <div class="px-10 py-10  min-h-screen text-white">
    <h1 class="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Trading Platform</h1>
    <!-- Mobile Download -->
    <div
        class="bg-gradient-dark rounded-xl mt-10 pb-10 flex flex-col md:flex-row items-center justify-between  mb-8"
    >
      <!-- Left image -->
      <div class="w-full md:w-1/2">
        <img src="/mob2.webp" alt="Mobile Image" class="w-full max-w-sm mx-auto" />
      </div>

      <!-- Right content -->
      <div class="w-full md:w-1/2 text-center md:text-right pr-10">
        <div class="text-xs uppercase text-slate-400 font-semibold">Trading Platform</div>
        <h2 class="text-2xl font-bold mt-2">Download MT 5 <br /><span class="text-yellow-500">For Mobile</span></h2>

        <div class="flex justify-center md:justify-end mt-6 gap-4 flex-wrap">
          <a
              :href="androidLink"
              target="_blank"
              class="flex items-center gap-3 bg-[#b67b2f] rounded-lg px-4 py-3 hover:bg-[#1E293B] transition"
          >
            <img src="/play.png" class="w-6" />
            <div class="text-left">
              <p class="text-xs text-slate-400">GET IT FOR</p>
              <p class="font-semibold text-sm">Google Play</p>
            </div>
          </a>

          <a
              :href="iOSLink"
              target="_blank"
              class="flex items-center gap-3 bg-[#b67b2f] rounded-lg px-4 py-3 hover:bg-[#1E293B] transition"
          >
            <img src="/app.svg" class="w-6" />
            <div class="text-left">
              <p class="text-xs text-slate-400">GET IT FOR</p>
              <p class="font-semibold text-sm">App Store</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Web Download -->
    <div
        class="bg-gradient-dark rounded-xl p-6 md:p-10 flex flex-col md:flex-row-reverse items-center justify-between gap-8"
    >
      <!-- Right image -->
      <div class="w-full md:w-1/2">
        <img src="/lap2.webp" alt="Laptop Image" class="w-full max-w-sm mx-auto" />
      </div>

      <!-- Left content -->
      <div class="w-full md:w-1/2 text-center md:text-left">
        <div class="text-xs uppercase text-slate-400 font-semibold">Trading Platform</div>
        <h2 class="text-2xl font-bold mt-2">Download MT 5 <br /><span class="text-yellow-500">For your PC</span></h2>

        <div class="flex justify-center md:justify-start mt-6 gap-4 flex-wrap">
          <a
              :href="windowsLink"
              download
              class="flex items-center gap-3 bg-[#b67b2f] rounded-lg px-4 py-3 hover:bg-[#1E293B] transition"
          >
            <img src="/windows.svg" class="w-6" />
            <div class="text-left">
              <p class="text-xs text-slate-400">GET IT FOR</p>
              <p class="font-semibold text-sm">Windows</p>
            </div>
          </a>

          <a
              :href="iOSLink"
              download
              class="flex items-center gap-3 bg-[#b67b2f] rounded-lg px-4 py-3 hover:bg-[#1E293B] transition"
          >
            <img src="/app.svg" class="w-6" />
            <div class="text-left">
              <p class="text-xs text-slate-400">GET IT FOR</p>
              <p class="font-semibold text-sm">mac OS</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
