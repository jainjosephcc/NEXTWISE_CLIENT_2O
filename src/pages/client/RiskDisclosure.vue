<script setup lang="ts">
import EconomicCalanderWidget from "@/components/Commons/EconomicCalanderWidget.vue";
import SmallNewsFeedComponent from "@/components/Commons/SmallNewsFeedComponent.vue";
import RiskDisclosureComponet from "@/components/Commons/RiskDisclosureComponet.vue";
</script>

<template>
    <div class="grid grid-cols-12 gap-y-10 gap-x-6">
        <div class="flex flex-col col-span-12 2xl:col-span-8 gap-y-10">

            <RiskDisclosureComponet />
        </div>


        <!---------CURRENCY CONVERTER START-------->
        <div class="flex flex-col col-span-12 md:col-span-6 xl:col-span-4 gap-y-5">

            <SmallNewsFeedComponent />
            <EconomicCalanderWidget />
        </div>
        <!---------CURRENCY CONVERTER END-------->


    </div>
</template>
