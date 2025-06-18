<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import OnboardScreenOne from "@/components/ClientOnboarding/OnboardScreenOne.vue";
import {ref} from "vue";
import OnboardScreenTwo from "@/components/ClientOnboarding/OnboardScreenTwo.vue";
import OnboardScreenThree from "@/components/ClientOnboarding/OnboardScreenThree.vue";

const currentPage = ref(0);
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  console.log(`Current page updated to: ${newPage}`);
};
</script>

<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6">
    <div class="col-span-12 sm:col-span-10 sm:col-start-2">
      <div class="flex flex-col lg:items-center lg:flex-row gap-y-2">
        <!-- Tab 1 -->
        <div
            :class="[
        'flex items-center lg:justify-center flex-1 lg:first:justify-start lg:last:justify-end group',
        currentPage === 0 ? 'active' : '',
        'after:hidden before:hidden after:lg:block before:lg:block',
        'first:after:content-[\'\'] first:after:w-full first:after:bg-slate-300/60 first:after:h-[2px] first:after:ml-5 group-[.mode--light]:first:after:bg-slate-300/20',
        'last:before:content-[\'\'] last:before:w-full last:before:bg-slate-300/60 last:before:h-[2px] last:before:mr-5 group-[.mode--light]:last:before:bg-slate-300/20',
        'last:after:hidden after:content-[\'\'] after:w-full after:bg-slate-300/60 after:h-[2px] after:ml-5 group-[.mode--light]:after:bg-slate-300/20',
        'first:before:hidden before:content-[\'\'] before:w-full before:bg-slate-300/60 before:h-[2px] before:mr-5 group-[.mode--light]:before:bg-slate-300/20',
      ]"
        >
          <div class="flex items-center">
            <div
                class="bg-white border rounded-full group-[.mode--light]:!bg-transparent group-[.active]:bg-primary group-[.active]:text-white group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-white/[0.25] [.group.mode--light_.group.active_&]:!bg-white/[0.12] [.group.mode--light_.group.active_&]:!border-white/[0.15]"
            >
              <div class="flex items-center justify-center w-10 h-10">1</div>
            </div>
            <div
                class="ml-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100"
            >
              Personal Information
            </div>
          </div>
        </div>

        <!-- Tab 2 -->
        <div
            :class="[
        'flex items-center lg:justify-center flex-1 lg:first:justify-start lg:last:justify-end group',
        currentPage === 1 ? 'active' : '',
        'after:hidden before:hidden after:lg:block before:lg:block',
        'first:after:content-[\'\'] first:after:w-full first:after:bg-slate-300/60 first:after:h-[2px] first:after:ml-5 group-[.mode--light]:first:after:bg-slate-300/20',
        'last:before:content-[\'\'] last:before:w-full last:before:bg-slate-300/60 last:before:h-[2px] last:before:mr-5 group-[.mode--light]:last:before:bg-slate-300/20',
        'last:after:hidden after:content-[\'\'] after:w-full after:bg-slate-300/60 after:h-[2px] after:ml-5 group-[.mode--light]:after:bg-slate-300/20',
        'first:before:hidden before:content-[\'\'] before:w-full before:bg-slate-300/60 before:h-[2px] before:mr-5 group-[.mode--light]:before:bg-slate-300/20',
      ]"
        >
          <div class="flex items-center">
            <div
                class="bg-white border rounded-full group-[.mode--light]:!bg-transparent group-[.active]:bg-primary group-[.active]:text-white group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-white/[0.25] [.group.mode--light_.group.active_&]:!bg-white/[0.12] [.group.mode--light_.group.active_&]:!border-white/[0.15]"
            >
              <div class="flex items-center justify-center w-10 h-10">2</div>
            </div>
            <div
                class="ml-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100"
            >
              Account Setup
            </div>
          </div>
        </div>

        <!-- Tab 3 -->
        <div
            :class="[
        'flex items-center lg:justify-center flex-1 lg:first:justify-start lg:last:justify-end group',
        currentPage === 2 ? 'active' : '',
        'after:hidden before:hidden after:lg:block before:lg:block',
        'first:after:content-[\'\'] first:after:w-full first:after:bg-slate-300/60 first:after:h-[2px] first:after:ml-5 group-[.mode--light]:first:after:bg-slate-300/20',
        'last:before:content-[\'\'] last:before:w-full last:before:bg-slate-300/60 last:before:h-[2px] last:before:mr-5 group-[.mode--light]:last:before:bg-slate-300/20',
        'last:after:hidden after:content-[\'\'] after:w-full after:bg-slate-300/60 after:h-[2px] after:ml-5 group-[.mode--light]:after:bg-slate-300/20',
        'first:before:hidden before:content-[\'\'] before:w-full before:bg-slate-300/60 before:h-[2px] before:mr-5 group-[.mode--light]:before:bg-slate-300/20',
      ]"
        >
          <div class="flex items-center">
            <div
                class="bg-white border rounded-full group-[.mode--light]:!bg-transparent group-[.active]:bg-primary group-[.active]:text-white group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-white/[0.25] [.group.mode--light_.group.active_&]:!bg-white/[0.12] [.group.mode--light_.group.active_&]:!border-white/[0.15]"
            >
              <div class="flex items-center justify-center w-10 h-10">3</div>
            </div>
            <div
                class="ml-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100"
            >
              Additional Details
            </div>
          </div>
        </div>
      </div>
      <div class="mt-7">
        <div class="flex flex-col box box--stacked">

          <OnboardScreenOne v-if="currentPage===0" @update:currentPage="handlePageChange" />
          <OnboardScreenTwo v-else-if="currentPage===1" @update:currentPage="handlePageChange" />
          <OnboardScreenThree v-else-if="currentPage===2" @update:currentPage="handlePageChange" />

        </div>
      </div>
    </div>
  </div>
</template>
