<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { FormLabel, FormSelect, FormSwitch } from "@/components/Base/Form";
import Litepicker from "@/components/Base/Litepicker";
import CurrencyConverterComponent from "@/components/Commons/CurrencyConverterComponent.vue";
import Button from "@/components/Base/Button";
import { format, parseISO } from "date-fns";

// API Key
const ACCESS_KEY = "7bo9rQYHIfWDxtuG63hz";

// API State
const calendarData = ref([]);
const isLoading = ref(false);
const error = ref("");
const filters = ref({
  country: "",
  currency: "",
  importance: "",
  from: "", // Use null to avoid implicit value
  to: "",   // Use null to avoid implicit value
});

const searchQuery = ref("");

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 20;

// Top 20 Countries and Currencies
const countries = [
  { code: "US", name: "United States" },
  { code: "JP", name: "Japan" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "BR", name: "Brazil" },
  { code: "RU", name: "Russia" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
  { code: "ZA", name: "South Africa" },
  { code: "SE", name: "Sweden" },
  { code: "SG", name: "Singapore" },
  { code: "NZ", name: "New Zealand" },
  { code: "CH", name: "Switzerland" },
];

const currencies = [
  "USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "NZD", "SEK",
  "SGD", "KRW", "INR", "MXN", "ZAR", "BRL", "RUB", "TRY", "HKD", "NOK",
];

// Fetch Data from API
const fetchCalendarData = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const params = {
      access_key: ACCESS_KEY,
      country: filters.value.country || undefined,
      symbol: filters.value.currency || undefined,
      from: filters.value.from || undefined,
      to: filters.value.to || undefined,
    };

    const response = await axios.get("https://fcsapi.com/api-v3/forex/economy_cal", { params });

    if (response.data.status) {
      calendarData.value = response.data.response;
    } else {
      error.value = response.data.msg || "Failed to fetch data.";
    }
  } catch (err) {
    error.value = "An error occurred while fetching data.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const today = new Date();
  filters.value.to = today.toISOString().split("T")[0]; // Current date

  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(today.getDate() - 10);
  filters.value.from = tenDaysAgo.toISOString().split("T")[0]; // 10 days ago

  fetchCalendarData(); // Fetch data with default dates
});



// Computed: Paginated Data
const paginatedData = computed(() =>
  calendarData.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
);

// Filter Data
const applyFilters = () => {
  fetchCalendarData();
};

// Reset Filters
const resetFilters = () => {
  filters.value = { country: "", currency: "", importance: "", from: "", to: "" };
  searchQuery.value = "";
  fetchCalendarData();
};


// Utility to Convert Importance to Stars
const getStars = (importance) => "⭐".repeat(parseInt(importance, 10));

</script>

<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6">
    <div class="col-span-12">
      <div class="flex flex-col lg:flex-row items-start h-auto mt-12">
        <div class="text-lg font-medium group-[.mode--light]:text-white">
          {{ $t('market.economicCalendar') }}
        </div>
        <div class="group-[.mode--light]:text-white/80 text-slate-500 leading-relaxed mt-2 lg:mt-0 lg:ml-3">
          {{ $t('market.calenderDesc') }}
        </div>
      </div>


      <div class="mt-16 grid grid-cols-12 xl:grid-cols-10 gap-y-7 lg:gap-y-10 gap-x-6">
        <div class="relative flex flex-col col-span-12 lg:col-span-8 xl:col-span-7 gap-y-7">
          <div class="flex flex-col p-5 box box--stacked">
            <div
              class="bg-white dark:bg-gray-800 shadow rounded-md p-4 mb-6 flex flex-col lg:flex-row lg:justify-between gap-4">
              <div class="flex flex-wrap gap-4">
                <!-- Country Filter -->
                <div class="flex flex-col items-center sm:flex-row">
                  <FormSelect v-model="filters.country" formSelectSize="md" class="sm:mt-2 sm:mr-2">
                    <option value="">All Countries</option>
                    <option v-for="country in countries" :key="country.code" :value="country.code">
                      {{ country.name }}
                    </option>
                  </FormSelect>

                  <!-- Currency Filter -->
                  <FormSelect v-model="filters.currency" formSelectSize="md" class="sm:mt-2 sm:mr-2">
                    <option value="">All Currencies</option>
                    <option v-for="currency in currencies" :key="currency" :value="currency">
                      {{ currency }}
                    </option>
                  </FormSelect>

                  <!-- Importance Filter -->
                  <FormSelect v-model="filters.importance" formSelectSize="md" class="sm:mt-2 sm:mr-2">
                    <option value="">All Importance Levels</option>
                    <option value="0">1 Star</option>
                    <option value="1">2 Stars</option>
                    <option value="2">3 Stars</option>
                  </FormSelect>

                  <!-- Date Range -->
                  <Litepicker id="modal-datepicker-2" v-model="filters.from" :options="{
                    autoApply: false,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }" class="pl-12 sm:mt-2 sm:mr-2" />

                  <Litepicker id="modal-datepicker-2" v-model="filters.to" :options="{
                    autoApply: false,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }" class="pl-12 ml-2 sm:mt-2 sm:mr-2" />

                </div>
              </div>

              <!-- Buttons -->
              <div class="flex items-center gap-2 mt-5 sm:mt-2 sm:mr-2">
                <Button size="md" variant="outline-success" class="w-24 sm:mr-2" @click="applyFilters">
                  {{ $t('transactionHistory.apply') }}
                </Button>
                <Button size="md" variant="outline-secondary" class="w-24 sm:mr-2" @click="resetFilters">
                  {{ $t('market.reset') }}
                </Button>
              </div>
            </div>

            <!-- Table Section -->
            <div v-if="isLoading" class="flex justify-center items-center h-64">
              <div class="loader"></div>
            </div>
            <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
            <div v-else>
              <div class="overflow-x-auto">
                <table class="table-auto w-full text-left border-collapse">
                  <thead class="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th class="px-4 py-2 font-medium">Date</th>
                      <th class="px-4 py-2 font-medium">Country</th>
                      <th class="px-4 py-2 font-medium">Event</th>
                      <th class="px-4 py-2 font-medium">Previous</th>
                      <th class="px-4 py-2 font-medium">Actual</th>
                      <th class="px-4 py-2 font-medium">Forecast</th>
                      <th class="px-4 py-2 font-medium">Importance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(event, index) in paginatedData" :key="event.id"
                      class="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td class="px-4 py-2">

                        <a href="" class="font-medium whitespace-nowrap">{{ format(parseISO(event.date), 'dd MMM yyyy')
                          }}</a>
                        <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ format(parseISO(event.date),
                          'h:mm a') }}</div>
                      </td>
                      <td class="px-4 py-2 flex items-center">
                        <img :src="`https://flagcdn.com/w40/${event.country.toLowerCase()}.png`" alt="Country Flag"
                          class="w-6 h-4 mr-2" />
                        {{ event.country }}
                      </td>
                      <td class="px-4 py-2">{{ event.title }}</td>
                      <td class="px-4 py-2">{{ event.previous || "N/A" }}</td>
                      <td class="px-4 py-2">{{ event.actual || "N/A" }}</td>
                      <td class="px-4 py-2">{{ event.forecast || "N/A" }}</td>
                      <td class="px-4 py-2">{{ getStars(event.importance) || "N/A" }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="mt-4 flex justify-between">
                <button class="btn-secondary" :disabled="currentPage === 1" @click="currentPage--">
                  Previous
                </button>
                <span>Page {{ currentPage }}</span>
                <button class="btn-secondary" :disabled="currentPage * itemsPerPage >= calendarData.length"
                  @click="currentPage++">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="relative order-first col-span-12 lg:order-last lg:col-span-4 xl:col-span-3">
          <div class="sticky top-[104px]" style="margin-top: -15px !important;">
            <CurrencyConverterComponent />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
