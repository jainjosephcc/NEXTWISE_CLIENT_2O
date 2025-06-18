<script setup lang="ts">

import Button from "@/components/Base/Button";
import {FormInput, FormSelect} from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import Lucide from "@/components/Base/Lucide";
import apiClient from '../../services/apiService';
import {computed, onMounted, ref} from "vue";

// Reactive states
const currencies = ref([]); // All currencies
const selectedFromCurrency = ref(""); // Selected "From" currency
const selectedToCurrency = ref(""); // Selected "To" currency
const showResult = ref(false); // Selected "To" currency
const amount = ref("1.00"); // Selected "To" currency
const conversionResult = ref({
  from_currency: { code: "", name: "" },
  to_currency: { code: "", name: "" },
  amount: 0,
  converted_amount: 0,
});

// Computed property for "To" currencies
const filteredToCurrencies = computed(() => {
  return currencies.value.filter(
      (currency) => currency.currency !== selectedFromCurrency.value
  );
});

// Fetch currencies from API
const fetchCurrencies = async () => {
  try {
    const response = await apiClient.get("/currencies");
    currencies.value = response.data.data; // Assuming the data is in `data.data`
    //console.log("Fetched currencies:", currencies.value);
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
};

// Fetch currencies on component mount
onMounted(fetchCurrencies);

// Handle "From" currency change
const handleFromCurrencyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedFromCurrency.value = target.value;
  selectedToCurrency.value = ""; // Reset the "To" currency when "From" changes
};

// Handle "To" currency change
const handleToCurrencyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedToCurrency.value = target.value;
};

const handleConvertNow = async () => {
  showResult.value=false;
  // Validate inputs
  if (!selectedFromCurrency.value || !selectedToCurrency.value || !amount.value) {
    console.error("Validation failed: Missing required inputs.");
    return;
  }

  try {
    // Call the conversion API
    const response = await apiClient.post("/convert-currency", {
      from_currency: selectedFromCurrency.value,
      to_currency: selectedToCurrency.value,
      amount: parseFloat(amount.value),
    });
    conversionResult.value = response.data;
    showResult.value=true;
  } catch (error) {
    console.error("Error during conversion:", error.response?.data || error);
  }
};

const resetConvertion = async () => {
  showResult.value=false;
};

</script>

<template>
  <div class="flex flex-col col-span-12 md:col-span-6 xl:col-span-4 gap-y-10">
    <div class="">
      <div class="p-5 mt-3.5 box box--stacked">
        <div>
          <div class="text-slate-500"> {{ $t('currencyconverter.currencyConverter')}}</div>
        </div>
        <div class="flex flex-col border border-dashed rounded-[0.6rem] border-slate-300/80 overflow-hidden mt-3">
          <div class="bg-slate-50/80 flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0">
            <div class="w-full">
              <div class="flex items-center text-slate-500 whitespace-nowrap">
                {{ $t('currencyconverter.from')}}
              </div>
              <div class="flex items-center w-full mt-1.5">
                <div class="mr-2.5">
                  <div
                      class="p-0.5 bg-white border rounded-full cursor-pointer w-8 h-8 border-slate-300/70"
                  >
                  </div>
                </div>
                <FormSelect
                    class="w-full px-0 text-base font-medium bg-transparent border-0 shadow-none focus:ring-0"
                    @change="handleFromCurrencyChange"
                >
                  <option value="" disabled selected>{{ $t('currencyconverter.selectaCurrency')}}</option>
                  <option
                      v-for="currency in currencies"
                      :key="currency.currency"
                      :value="currency.currency"
                  >
                    {{ currency.currency_name }} ({{ currency.currency }})
                  </option>
                </FormSelect>
              </div>
            </div>
          </div>
          <div
              class="bg-slate-50/80 flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
          >
            <div class="w-full">
              <div class="flex items-center text-slate-500 whitespace-nowrap">
                {{$t('currencyconverter.to')}}
              </div>
              <div class="flex items-center w-full mt-1.5">
                <div class="mr-2.5">
                  <div
                      class="p-0.5 bg-white border rounded-full cursor-pointer w-8 h-8 border-slate-300/70"
                  >
                  </div>
                </div>
                <FormSelect
                    class="w-full px-0 text-base font-medium bg-transparent border-0 shadow-none focus:ring-0"
                    @change="handleToCurrencyChange"
                >
                  <option value="" disabled selected>{{ $t('currencyconverter.selectaCurrency')}}</option>
                  <option
                      v-for="currency in filteredToCurrencies"
                      :key="currency.currency"
                      :value="currency.currency"
                  >
                    {{ currency.currency_name }} ({{ currency.currency }})
                  </option>
                </FormSelect>
              </div>
            </div>
          </div>
          <div
              class="bg-slate-50/80 flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
          >
            <div class="w-full">
              <div class="flex items-center text-slate-500 whitespace-nowrap">
                {{ $t('currencyconverter.amount')}} 
              </div>
              <div class="relative mt-1.5">
                <FormInput
                    type="text"
                    value="1.00"
                   v-model="amount"
                    class="pl-0 text-base font-medium bg-transparent border-0 shadow-none focus:ring-0"
                    @change="() => {}"
                />
                <span
                    class="absolute inset-y-0 h-6 flex items-center right-0 px-1.5 py-0.5 my-auto text-xs border rounded-md bg-slate-100 text-slate-500 mr-1.5"
                >
                    {{selectedFromCurrency}}
                  </span>
              </div>
            </div>
          </div>
        </div>


        <div class="relative flex gap-3 mt-6">
          <Button variant="primary" class="w-full border-primary/50" @click="handleConvertNow">
            <Lucide
                icon="ArrowRightLeft"
                class="stroke-[1.3] w-4 h-4 mr-2"
            />
            {{ $t('currencyconverter.convertNow')}}
          </Button>
          <Tippy content="Reset" :as="Button" @click="resetConvertion" variant="outline-secondary">
            <Lucide icon="RefreshCwIcon" class="w-4 h-4 stroke-[1.5]" />
          </Tippy>
        </div>

        <div v-if="showResult" class="flex flex-col border border-dashed rounded-[0.6rem] border-slate-300/80 overflow-hidden mt-5">
          <div
              class="bg-slate-50/80 flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
          >
            <div class="w-full">
              <div
                  class="flex items-center text-slate-500 whitespace-nowrap"
              >
              {{ $t('currencyconverter.from')}}
              </div>
              <div class="relative mt-1.5">
                <FormInput
                    type="text"
                    disabled
                    :value="conversionResult.amount"
                    class="text-base font-medium bg-transparent border-0 shadow-none focus:ring-0 pl-2"
                    @change="() => {}"
                />
                <span
                    class="absolute inset-y-0 h-6 flex items-center right-0 px-1.5 py-0.5 my-auto text-xs border rounded-md bg-slate-100 text-slate-500 mr-1.5"
                >
                          {{ conversionResult.from_currency.code }}
                        </span>
              </div>
            </div>
          </div>
          <div
              class="bg-slate-50/80 flex items-center px-3.5 py-2.5 border-b border-slate-300/80 border-dashed last:border-0"
          >
            <div class="w-full">
              <div
                  class="flex items-center text-slate-500 whitespace-nowrap"
              >
              {{ $t('currencyconverter.to')}}
              </div>
              <div class="relative mt-1.5">
                <FormInput
                    type="text"
                    disabled
                    :value="conversionResult.converted_amount"
                    class="text-base font-medium pl-2 bg-transparent border-0 shadow-none focus:ring-0"
                    @change="() => {}"
                />
                <span
                    class="absolute inset-y-0 h-6 flex items-center right-0 px-1.5 py-0.5 my-auto text-xs border rounded-md bg-slate-100 text-slate-500 mr-1.5"
                >
                          {{ conversionResult.to_currency.code }}
                        </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>