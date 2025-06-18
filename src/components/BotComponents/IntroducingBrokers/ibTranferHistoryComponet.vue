<script setup lang="ts">
import { ref, onMounted } from "vue";
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import { format, parseISO } from 'date-fns';
import apiClient from "../../../services/apiService";

const isLoading = ref(false);
const commissionTransfers = ref([]);

const fetchCommission = async () => {
    isLoading.value = true;
    try {
        const response = await apiClient.get("/ib/commission-transfers");
        commissionTransfers.value = response.data.result.commission_transfers;
    } catch (error) {
        console.error("Error fetching transfer history:", error);
    } finally {
        isLoading.value = false;
    }
};



onMounted(() => {
    fetchCommission();
});
</script>

<template>
        <div class="border rounded-[0.6rem] border-slate-200/80 dark:border-darkmode-400 relative mt-3">
            <div class="absolute left-0 px-3 ml-4 -mt-2 text-xs uppercase bg-white text-slate-500">
                <div class="-mt-px">{{$t('ibprofile.transferHistory')}}</div>
            </div>
            <div class="p-5 mt-2.5 flex flex-col gap-5">
                <div class="flex items-center">
                    <Lucide icon="Clock" class="w-4 h-4 mr-2.5 stroke-[1.3] text-slate-500" />
                    <div class="sm:mr-auto w-54">
                        {{$t('ibprofile.transferHistoryDesc')}}
                    </div>
                </div>

                <!-- Table for Transfer History -->
                <div class="overflow-x-auto mt-5">
                    <Table bordered>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th class="whitespace-nowrap">{{$t('ibprofile.transferedTo')}}</Table.Th>
                                <Table.Th class="whitespace-nowrap">{{$t('ibprofile.processedOn')}}</Table.Th>
                                <Table.Th class="whitespace-nowrap">{{$t('ibprofile.amount_1')}}</Table.Th>
                                <Table.Th class="whitespace-nowrap">{{$t('viewIdentityComponent.statuS')}}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <template v-if="!isLoading && commissionTransfers.length > 0">
                                <Table.Tr v-for="transfer in commissionTransfers" :key="transfer.mt_id">
                                    <Table.Td>{{ transfer.mt_id }}</Table.Td>
                                    <Table.Td>
                                        {{ format(parseISO(transfer.created_at), "dd MMM yyyy", 'h:mm a') }}
                                    </Table.Td>
                                    <Table.Td>${{ transfer.amount.toFixed(2) }}</Table.Td>
                                    <Table.Td>
                                        <div v-if="transfer.status === 0"
                                            class="ml-1.5 whitespace-nowrap text-yellow-500">
                                            {{$t('transactionHistory.pending')}}
                                        </div>
                                        <div v-if="transfer.status === 3"
                                            class="ml-1.5 whitespace-nowrap text-green-500">

                                            {{$t('transactionHistory.approved')}}
                                        </div>
                                        <div v-if="transfer.status === 2" class="ml-1.5 whitespace-nowrap text-red-500">
                                            {{$t('transactionHistory.rejected')}}
                                        </div>
                                    </Table.Td>

                                </Table.Tr>
                            </template>
                            <template v-else>
                                <Table.Tr>
                                    <Table.Td colspan="4" class="text-center">{{$t('ibprofile.noData')}}</Table.Td>
                                </Table.Tr>
                            </template>
                        </Table.Tbody>
                    </Table>
                </div>
            </div>
        </div>
</template>
