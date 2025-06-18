<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";
import { Dialog } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import Lucide from "@/components/Base/Lucide";
import { format, parseISO } from "date-fns";
import apiClient from "@/services/apiService";
import Pagination from "@/components/Base/Pagination";
import { FormSelect } from "@/components/Base/Form";
// Props and Emits
const props = defineProps({
    open: { type: Boolean, required: true },
    clientId: { type: Number },
});

const emit = defineEmits(["close"]);

// States
const dealsData = ref([]); // Deals data
const loading = ref(false); // Loading state
const error = ref<string | null>(null); // Error state
const perPageOptions = [10, 25, 35, 50];
const selectedPerPage = ref(10);
const currentPage = ref(1);

const paginationData = ref({
    current_page: 1,
    last_page: 1,
    per_page: selectedPerPage.value,
    total: 0,
});

// Fetch deals data from API
const fetchDealsData = async () => {
    const userData = localStorage.getItem("userData");
    const parsedData = userData ? JSON.parse(userData) : null;

    if (!parsedData) {
        console.error("No userData found in localStorage");
        return;
    }

    loading.value = true;

    try {
        const response = await apiClient.post("/get-ib-deals", {
            ib_client_id: parsedData.id,
            client_id: props.clientId,
            page: paginationData.value.current_page,
            per_page: paginationData.value.per_page,
        });

        const { data } = response.data.data;
        dealsData.value = data;
        paginationData.value = {
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            per_page: response.data.data.per_page,
            total: response.data.data.total,
        };
    } catch (err) {
        error.value = err.response?.data || err.message;
    } finally {
        loading.value = false;
    }
};

// Pagination change
const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationData.value.last_page) {
        paginationData.value.current_page = page;
        fetchDealsData();
    }
};

// Watchers to handle pagination and perPage changes
watch([() => props.clientId, () => props.open], async () => {
    if (props.open) {
        paginationData.value.current_page = 1; // Reset to first page on open
        await fetchDealsData();
    }
});

watch([currentPage, selectedPerPage], async () => {
    paginationData.value.per_page = selectedPerPage.value; // Update perPage
    paginationData.value.current_page = currentPage.value; // Update current page
    await fetchDealsData();
});

// Fetch initial data when the component is mounted
onMounted(async () => {
    if (props.open) {
        await fetchDealsData();
    }
});
</script>

<template>
    <Dialog size="lg" :open="open" @close="emit('close')"
        class="fixed inset-0 flex items-center justify-center bg-black/50">
        <Dialog.Panel
            class="relative bg-white rounded-lg shadow-lg w-full sm:w-[60rem] max-w-[95%] sm:auto max-h-full sm:max-h-[90vh] overflow-y-auto p-6">


            <!-- Close Button -->
            <button type="button" class="absolute top-3 right-3 focus:outline-none" @click="emit('close')">
                <Lucide icon="X" class="w-6 h-6 text-slate-400" />
            </button>

            <!-- Title -->
            <div class="text-center mb-4">
                <h2 class="text-xl font-semibold">View Trades</h2>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>

            <!-- Table -->
            <div class="overflow-x-auto">
                <Table class="min-w-full bg-white">
                    <thead class="bg-gray-700">
                        <tr>
                            <Table.Td
                                class="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider">MT5
                                ID</Table.Td>
                            <Table.Td
                                class="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider">Date
                            </Table.Td>
                            <Table.Td
                                class="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider">Deal
                                ID</Table.Td>
                            <Table.Td
                                class="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider">
                                Symbol</Table.Td>
                            <Table.Td
                                class="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider">
                                Price</Table.Td>
                            <Table.Td
                                class="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider">
                                Volume</Table.Td>
                            <Table.Td
                                class="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider">
                                Profit</Table.Td>
                            <Table.Td
                                class="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider">
                                Commission</Table.Td>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Loading State -->
                        <tr v-if="loading">
                            <Table.Td colspan="8" class="px-4 py-4 text-center text-gray-500">Loading...</Table.Td>
                        </tr>

                        <!-- Deals Data -->
                        <tr v-for="deal in dealsData" :key="deal.id">
                            <Table.Td class="px-4 py-2 text-sm text-black">{{ deal.mt_user_id }}</Table.Td>
                            <Table.Td class="px-4 py-2 text-sm text-black">
                                <div className="font-medium whitespace-nowrap">
                                    {{ format(parseISO(deal.created_at), "dd MMM yyyy") }}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                    {{ format(parseISO(deal.created_at), "h:mm a") }}
                                </div>
                            </Table.Td>
                            <Table.Td class="px-4 py-2 text-sm text-black">{{ deal.deal_id }}</Table.Td>
                            <Table.Td class="px-4 py-2 text-sm text-black">{{ deal.symbol }}</Table.Td>
                            <Table.Td className="px-4 py-2 text-sm text-black">
                                {{ Number(deal.price).toFixed(5) }}
                            </Table.Td>

                            <Table.Td class="px-4 py-2 text-sm text-black">{{ deal.volume }}</Table.Td>
                            <Table.Td className="px-4 py-2 text-sm text-black">
                                ${{ Number(deal.profit).toFixed(2) }}
                            </Table.Td>
                            <Table.Td class="px-4 py-2 text-sm text-black">${{ deal.commission }}</Table.Td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <!-- Pagination Controls -->
            <div class="flex items-center justify-between mt-4">
                <Pagination>
                    <!-- Previous Button -->
                    <Pagination.Link :disabled="paginationData.current_page === 1"
                        @click="goToPage(paginationData.current_page - 1)">
                        <Lucide icon="ChevronLeft" />
                    </Pagination.Link>

                    <!-- Page Numbers -->
                    <Pagination.Link v-for="page in paginationData.last_page" :key="page"
                        :active="page === paginationData.current_page" @click="goToPage(page)">
                        {{ page }}
                    </Pagination.Link>

                    <!-- Next Button -->
                    <Pagination.Link :disabled="paginationData.current_page === paginationData.last_page"
                        @click="goToPage(paginationData.current_page + 1)">
                        <Lucide icon="ChevronRight" />
                    </Pagination.Link>
                </Pagination>

                <!-- Results Per Page -->
                <FormSelect v-model="selectedPerPage" class="sm:w-20 rounded-[0.5rem] mr-3 mb-3">
                    <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
                </FormSelect>
            </div>
        </Dialog.Panel>
    </Dialog>
</template>
