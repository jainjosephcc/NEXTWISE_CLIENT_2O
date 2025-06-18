<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import Pagination from "@/components/Base/Pagination";
import {  FormSelect } from "@/components/Base/Form";
import { formatCurrency } from "@/utils/helper";
import Table from "@/components/Base/Table";
import _ from "lodash";
import apiClient from '../../../services/apiService';
import {onMounted, ref, watch} from "vue";
import { format, parseISO } from 'date-fns';
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import LoadingIcon from "@/components/Base/LoadingIcon";
import ShimmerLoaderRow from "@/components/Commons/ShimmerLoaderRow.vue";

const internalTransferList=ref([])
const currentPage=ref(1)
const perPageOptions = [10, 25, 35, 50];
const selectedPerPage = ref(10);
const loading=ref(true);
const paginationData = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
});

// Fetch internal transfer list from API
const fetchinternalTransferList = async () => {
  loading.value=true
  try {
    const response = await apiClient.get( `/transaction/transfer?page=${currentPage.value}`);
    internalTransferList.value = response.data.result.transaction.data;
    paginationData.value = {
      current_page: response.data.result.transaction.current_page,
      last_page: response.data.result.transaction.last_page,
      per_page: response.data.result.transaction.per_page,
      total: response.data.result.transaction.total,
    };
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
  finally{
    loading.value=false
  }
};

// Fetch transfer on component mount
onMounted(fetchinternalTransferList);
watch([currentPage, selectedPerPage], fetchinternalTransferList);


</script>
<template>
  <div class="overflow-x-auto">
    <Table class="min-w-full divide-y divide-gray-200">
      <Table.Thead>
        <Table.Tr class="bg-gray-50 dark:bg-yellow-800">
          <Table.Td class="py-4 text-xs font-medium text-left text-white-500 uppercase tracking-wider">
            Date
          </Table.Td>

          <Table.Td class="py-4 text-xs font-medium text-left text-white-500 uppercase tracking-wider">
            From
          </Table.Td>
          <Table.Td class="py-4 text-xs font-medium text-left text-white-500 uppercase tracking-wider md:table-cell">
            To
          </Table.Td>

          <Table.Td class="py-4 text-xs font-medium text-left text-white-500 uppercase tracking-wider md:table-cell">
            {{ $t('transactionHistory.amount') }}
          </Table.Td>
          <Table.Td class="py-4 text-xs font-medium text-center text-white-500 uppercase tracking-wider w-36">
            {{ $t('transactionHistory.status') }}
          </Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody v-if="internalTransferList">
        <template v-if="internalTransferList.length > 0">
          <template v-for="transfer in internalTransferList" :key="transfer.id">
            <Table.Tr class="[&_td]:last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">

              <Table.Td class="py-4 border-dashed dark:bg-gray-800 text-sm">
                <a href="" class="font-medium whitespace-nowrap">
                  {{ format(parseISO(transfer.created_at), 'dd MMM yyyy') }}
                </a>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ format(parseISO(transfer.created_at), 'h:mm a') }}
                </div>
              </Table.Td>

              <Table.Td class="py-4 border-dashed dark:bg-gray-800 text-sm">
                MT{{ transfer.from_mt_id }}
              </Table.Td>
              <Table.Td class="py-4 border-dashed dark:bg-gray-800 text-sm md:table-cell">
                <a href="" class="font-medium whitespace-nowrap">
                  MT{{ transfer.to_mt_id }}
                </a>
              </Table.Td>

              <Table.Td class="py-4 border-dashed dark:bg-gray-800 text-sm md:table-cell">
                {{ formatCurrency(transfer.trans_amount) }}
              </Table.Td>
              <Table.Td class="py-4 border-dashed dark:bg-gray-800 text-sm">
                <div :class="['flex items-center justify-start', { 'text-warning': transfer.status === 0 },{'text-success': transfer.status === 3 },{ 'text-danger': transfer.status === 2 }]">
                  <Lucide icon="Database" class="w-3.5 h-3.5 stroke-[1.7]" />
                  <div v-if="transfer.status === 0" class="ml-1.5"> {{ $t('transactionHistory.pending') }}</div>
                  <div v-if="transfer.status === 3" class="ml-1.5"> {{ $t('transactionHistory.approved') }}</div>
                  <div v-if="transfer.status === 2" class="ml-1.5"> {{ $t('transactionHistory.rejected') }}</div>
                </div>
              </Table.Td>
            </Table.Tr>
          </template>
        </template>
      </Table.Tbody>
    </Table>
      <!-- </Table> -->
    <div v-if="loading">
      <ShimmerLoaderRow/>
      <ShimmerLoaderRow/>
    </div>
    <EmptyStateComponent class="py-5" v-if="internalTransferList.length<=0&&!loading" :title="$t('emptyState.noInternalTransfer')"/>
  </div>

  <!-- Pagination and Results Per Page -->
  <div class="flex flex-col sm:flex-row justify-between items-center mt-4">
    <Pagination class="mb-2 sm:mb-0">
      <!-- Previous Button -->
      <Pagination.Link
          :disabled="paginationData.current_page === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
      >
        <Lucide icon="ChevronLeft" />
      </Pagination.Link>

      <!-- Page Numbers -->
      <Pagination.Link
          v-for="page in paginationData.last_page"
          :key="page"
          :active="page === paginationData.current_page"
          @click="currentPage = page"
      >
        {{ page }}
      </Pagination.Link>

      <!-- Next Button -->
      <Pagination.Link
          :disabled="paginationData.current_page === paginationData.last_page"
          @click="currentPage = Math.min(paginationData.last_page, currentPage + 1)"
      >
        <Lucide icon="ChevronRight" />
      </Pagination.Link>
    </Pagination>

    <!-- Results Per Page -->
    <FormSelect v-model="selectedPerPage" class="sm:w-20 rounded-[0.5rem] mr-3 mb-3 bg-yellow-800">
      <option v-for="option in perPageOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </FormSelect>
  </div>
</template>
