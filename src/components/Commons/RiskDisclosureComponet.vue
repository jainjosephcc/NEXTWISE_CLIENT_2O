<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import { Menu, Popover } from "@/components/Base/Headless";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { computed, ref, watch } from "vue";

import { useRoute } from "vue-router";


const page = ref<string | null>(null);
const products = ref([]);
const activeTabIndex = ref(0);
const route = useRoute();




</script>

<template>
    <div class="flex flex-col border border-dashed rounded-[0.6rem] border-slate-300/80 overflow-hidden">
        <!-- Header Section -->
        <div class="bg-slate-50/80 flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed">
            <div class="w-full">
                <div class="flex items-center w-full">

                    <span class="text-base font-medium text-gray-900">
                        Risk Disclosure
                    </span>
                </div>
            </div>
        </div>

        <!-- Content Section -->
        <div class="bg-slate-50/80 px-4 py-4">
            <div class="text-sm leading-6 text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                    <strong>Investment in Derivatives:</strong> An investment in derivatives may mean investors may lose
                    an amount even greater than their original investment. Anyone wishing to invest in any of
                    the products mentioned in
                    <a href="https://www.capitalnine.co" target="_blank" class="text-blue-600 hover:underline">
                      https://www.capitalnine.co
                    </a>
                    should seek their own financial or professional advice.
                </p>

                <p>
                    <strong>Trading Risks:</strong> Trading of securities, forex, stock market, commodities, options,
                    and futures may not be suitable for everyone and involves the risk of losing part or all of
                    your money. Trading in the financial markets has large potential rewards, but also large
                    potential risk. You must be aware of the risks and be willing to accept them in order to invest in
                    the
                    markets. Don't invest and trade with money which you can't afford to lose.
                </p>

                <p>
                    <strong>Forex Trading Restrictions:</strong> Forex Trading is not allowed in some countries. Before
                    investing your money, make sure whether your country is allowing this or not.
                </p>

                <p>
                    <strong>Professional Advice:</strong> You are strongly advised to obtain independent financial,
                    legal, and tax advice before proceeding with any currency or spot metals trade. Nothing in this site
                    should be read or construed as constituting advice on the part of Capital Nine Global Limited or
                    any of its affiliates, directors, officers, or employees.
                </p>

                <p>
                    <strong>Restricted Regions:</strong> Capital Nine Global Limited does not provide services for
                    citizens/residents of the United States, Cuba, Iraq, Myanmar, North Korea, or Sudan. The services of
                  Capital Nine Global Limited are not intended for distribution to, or use by, any person in any country
                    or jurisdiction where such distribution or use would be contrary to local law or regulation.
                </p>

                <p>
                    <strong>Disclaimer:</strong> Information on this site is not directed at residents in any country or
                    jurisdiction where such distribution or use would be contrary to local law or regulation.
                </p>
            </div>
        </div>
    </div>
</template>
