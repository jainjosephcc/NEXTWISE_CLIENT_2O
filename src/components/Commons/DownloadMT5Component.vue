<script setup lang="ts">

import AppStore from "@/assets/images/appstore.svg";
import windows from "@/assets/images/windows.png";
import header from "@/assets/images/header.png";
import macbook from "@/assets/images/downloadmt5.png";
import playstore from "@/assets/images/playstore.svg";
const iOSLink = import.meta.env.VITE_DOWNLOAD_IOS;
const androidLink = import.meta.env.VITE_DOWNLOAD_ANDROID;
const windowsLink = import.meta.env.VITE_DOWNLOAD_WINDOWS;

interface Account {
  mt_id: number;
  mt_category: string;
  leverage: number;
}


</script>

<template>
  <div>
    <div class="p-5 box box--stacked leading-normal tracking-normal bg-gradient-dark">
      <div class="flex flex-col gap-3">
        <div class="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <!--Left Col-->
          <div class="flex flex-col w-full xl:w-4/6 justify-center lg:items-start overflow-y-hidden">
            <h3 class="my- text-xl md:text-2xl text-white font-semibold leading-tight text-center md:text-left">
              Powerful Trading on<br>Any Device
            </h3>
            <p class="leading-normal text-center md:text-left text-sm mt-5 text-gray-400">
              Download our mobile and desktop apps for seamless trading on the go or at your desk. </p>
            <div class="m-1">
              <div class="flex justify-center md:justify-end mt-6 gap-4 flex-wrap">
                <a
                    :href="androidLink"
                    target="_blank"
                    class="flex border-white border-2 items-center gap-3 bg-[#b67b2f] rounded-lg px-4 py-2 hover:bg-[#1E293B] transition"
                >
                  <img src="/play.png" class="w-6" style="filter: brightness(0) saturate(100%) invert(93%) sepia(4%) saturate(33%) hue-rotate(162deg) brightness(108%) contrast(97%)" />
                  <div class="text-left">
                    <p class="font-semibold text-sm">Google Play</p>
                  </div>
                </a>
                <a
                    :href="iOSLink"
                    target="_blank"
                    class="flex border-white border-2 items-center gap-3 bg-[#b67b2f] rounded-lg px-4 py-2 hover:bg-[#1E293B] transition"
                >
                  <img src="/app.svg"  class="w-6" />
                  <div class="text-left">
                    <p class="font-semibold text-sm">App Store</p>
                  </div>
                </a>
                <a
                    :href="windowsLink"
                    download
                    class="flex border-white border-2 items-center gap-3 bg-[#b67b2f] rounded-lg px-4 py-2 hover:bg-[#1E293B] transition"
                >
                  <img src="/windows.svg" class="w-6" />
                  <div class="text-left">
                    <p class="font-semibold text-sm">Windows</p>
                  </div>
                </a>
              </div>
            </div>
          </div><!--Right Col-->
          <div class="w-full xl:w-2/6 overflow-hidden">
            <img class="mx-auto w-full md:w-4/5 transform transition hover:scale-110 duration-700 ease-in-out" src="/lap2.webp" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>