<script setup lang="ts">
import { ref } from "vue";
import TickerWidgetFxComponent from "@/components/Commons/TickerWidgetFxComponent.vue";
import EconomicCalanderWidget from "@/components/Commons/EconomicCalanderWidget.vue";
import SmallNewsFeedComponent from "@/components/Commons/SmallNewsFeedComponent.vue";

import CurrencyConverterComponent from "@/components/Commons/CurrencyConverterComponent.vue";
</script>

<template>
    <div class="grid grid-cols-12 gap-y-10 gap-x-6 mb-4">
        <div class="col-span-12">
            <TickerWidgetFxComponent />
        </div>
    </div>

    <div class="grid grid-cols-12 gap-y-10 gap-x-6">
        <div class="flex flex-col col-span-12 md:col-span-6 xl:col-span-4 gap-y-5">


            <!---------SLIDER CARDS START-------->
            <div class="flex flex-col col-span-12 xl:col-span-4 gap-y-10">
                <div class="col-span-12 p-1 md:col-span-6 2xl:col-span-3 box box--stacked mt-3.5">
                    <div
                        class="-mx-1 overflow-hidden h-[244px] [&_.tns-outer_.tns-nav]:bottom-auto [&_.tns-outer_.tns-nav]:w-auto [&_.tns-outer_.tns-nav]:ml-5 [&_.tns-outer_.tns-nav]:mt-5 [&_.tns-outer_.tns-nav_button]:w-2 [&_.tns-outer_.tns-nav_button]:h-2 [&_.tns-outer_.tns-nav_button.tns-nav-active]:w-5 [&_.tns-outer_.tns-nav_button]:mx-0.5 [&_.tns-outer_.tns-nav_button]:bg-white/40 [&_.tns-outer_.tns-nav_button.tns-nav-active]:bg-white/70">
                        <TinySlider :options="{ mode: 'gallery', nav: true }">
                            <div class="px-1">
                                <div
                                    class="overflow-hidden relative flex flex-col w-full h-full p-5 rounded-[0.5rem] bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85]">
                                    <Lucide icon="Medal"
                                        class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
                                    <div class="mt-12 mb-9">
                                        <div class="text-2xl font-medium leading-snug text-white">
                                            {{ $t('dashboard.boostYour') }}
                                            <br />
                                            {{ $t('dashboard.tradingPower') }}
                                        </div>
                                        <div class="mt-1.5 text-lg text-white/70">
                                            {{ $t('dashboard.depositnowandseizeOpporunities') }}
                                        </div>
                                    </div>
                                    <a class="flex items-center font-medium text-white" href="">
                                        {{ $t('dashboard.depositToday') }}
                                        <Lucide icon="MoveRight" class="w-4 h-4 ml-1.5" />
                                    </a>
                                </div>
                            </div>
                            <div class="px-1">
                                <div
                                    class="overflow-hidden relative flex flex-col w-full h-full p-5 rounded-[0.5rem] bg-gradient-to-b from-theme-2/90 to-theme-1/90">
                                    <Lucide icon="Database"
                                        class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
                                    <div class="mt-12 mb-9">
                                        <div class="text-2xl font-medium leading-snug text-white">
                                            {{ $t('dashboard.tradeSmarter') }}
                                            <br />
                                            {{ $t('dashboard.notHarder') }}
                                        </div>
                                        <div class="mt-1.5 text-lg text-white/70">
                                            {{ $t('dashboard.unlocktoolstomaximizeProfits') }}
                                        </div>
                                    </div>
                                    <a class="flex items-center font-medium text-white" href="">
                                        {{ $t('dashboard.startTrading') }}
                                        <Lucide icon="ArrowRight" class="w-4 h-4 ml-1.5" />
                                    </a>
                                </div>
                            </div>
                            <div class="px-1">
                                <div
                                    class="overflow-hidden relative flex flex-col w-full h-full p-5 rounded-[0.5rem] bg-gradient-to-b from-theme-2/90 to-theme-1/90">
                                    <Lucide icon="Gauge"
                                        class="absolute top-0 right-0 w-36 h-36 -mt-5 -mr-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]" />
                                    <div class="mt-12 mb-9">
                                        <div class="text-2xl font-medium leading-snug text-white">
                                            {{ $t('dashboard.earnRewards') }}
                                            <br />
                                            {{ $t('dashboard.oneveryTrade') }}
                                        </div>
                                        <div class="mt-1.5 text-lg text-white/70">
                                            {{ $t('dashboard.trademoreearnExclusivebonuses') }}
                                        </div>
                                    </div>
                                    <a class="flex items-center font-medium text-white" href="">
                                        {{ $t('dashboard.claimRewards') }}
                                        <Lucide icon="ArrowRight" class="w-4 h-4 ml-1.5" />
                                    </a>
                                </div>
                            </div>
                        </TinySlider>
                    </div>
                </div>
            </div>
            <!---------SLIDER CARDS END-------->

        </div>
        <div class="flex flex-col col-span-12 xl:col-span-4 gap-y-10">
            <CurrencyConverterComponent />
        </div>

        <!---------CURRENCY CONVERTER START-------->
        <div class="flex flex-col col-span-12 md:col-span-6 xl:col-span-4 gap-y-5">

            <SmallNewsFeedComponent />
            <EconomicCalanderWidget />
        </div>
        <!---------CURRENCY CONVERTER END-------->


    </div>
</template>
