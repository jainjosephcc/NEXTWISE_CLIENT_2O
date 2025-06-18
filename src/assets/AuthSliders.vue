<script setup lang="ts">

import users from "@/fakers/users";
import Tippy from "@/components/Base/Tippy";
</script>

<template>
  <div class="fixed container grid w-screen inset-0 h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] pl-14 pr-12 xl:px-24">
    <div
        :class="[
        'relative h-screen col-span-12 lg:col-span-5 2xl:col-span-4 z-20',
        'after:bg-white after:hidden after:lg:block after:content-[\'\'] after:absolute after:right-0 after:inset-y-0 after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0]',
        'before:content-[\'\'] before:hidden before:lg:block before:absolute before:right-0 before:inset-y-0 before:my-6 before:bg-gradient-to-b before:from-white/10 before:to-slate-50/10 before:bg-white/50 before:w-[800%] before:-mr-4 before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0]',
      ]"
    ></div>
    <div
        :class="[
        'h-full col-span-7 2xl:col-span-8 lg:relative',
        'before:content-[\'\'] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:w-screen before:lg:w-[800%]',
        'after:content-[\'\'] after:absolute after:inset-y-0 after:left-0 after:w-screen after:lg:w-[800%] after:bg-texture-white after:bg-fixed after:bg-center after:lg:bg-[25rem_-25rem] after:bg-no-repeat',
      ]"
    >
      <div
          class="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36"
      >
        <div class="relative flex">
          <div class="w-[600px] mt-2 relative [&_div]:bg-white">
            <img src="/images/banner_2.png" alt="Paperbot">
          </div>
        </div>
        <div class="leading-[1.4] mt-10 text-[2.6rem] xl:text-4xl font-medium xl:leading-[1.2] text-white">
          Your Gateway to
          Smarter Trading!
        </div>
        <div class="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
          Simplify your trading experience with our Client Portal. Access powerful tools to manage accounts, create MT5 profiles, and handle funds securely. Take control of your trading journey today!
        </div>
        <div class="flex flex-col gap-3 mt-10 xl:items-center xl:flex-row">
          <div class="flex items-center">
            <div class="w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
              <Tippy
                  as="img"
                  alt="Tailwise - Admin Dashboard Template"
                  class="rounded-full border-[3px] border-white/50"
                  :src="users.fakeUsers()[0].photo"
                  :content="users.fakeUsers()[0].name"
              />
            </div>
            <div class="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
              <Tippy
                  as="img"
                  alt="Tailwise - Admin Dashboard Template"
                  class="rounded-full border-[3px] border-white/50"
                  :src="users.fakeUsers()[0].photo"
                  :content="users.fakeUsers()[0].name"
              />
            </div>
            <div class="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
              <Tippy
                  as="img"
                  alt="Tailwise - Admin Dashboard Template"
                  class="rounded-full border-[3px] border-white/50"
                  :src="users.fakeUsers()[0].photo"
                  :content="users.fakeUsers()[0].name"
              />
            </div>
            <div class="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
              <Tippy
                  as="img"
                  alt="Tailwise - Admin Dashboard Template"
                  class="rounded-full border-[3px] border-white/50"
                  :src="users.fakeUsers()[0].photo"
                  :content="users.fakeUsers()[0].name"
              />
            </div>
          </div>
          <div class="text-base xl:ml-2 2xl:ml-3 text-white/70">
            Thousands of traders trust us to elevate their trading game. Take the first step toward unlocking your potential today!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>