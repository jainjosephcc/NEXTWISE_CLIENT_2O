<script setup lang="ts">
import Lucide from "@/components/Base/Lucide";
import Pagination from "@/components/Base/Pagination";
import {  FormSelect } from "@/components/Base/Form";
import { formatCurrency } from "@/utils/helper";
import Table from "@/components/Base/Table";
import _ from "lodash";
import apiClient from '../../../services/apiService';
import { onMounted, ref, watch} from "vue";
import { format, parseISO } from 'date-fns';
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import LoadingIcon from "@/components/Base/LoadingIcon";
import ShimmerLoaderRow from "@/components/Commons/ShimmerLoaderRow.vue";

const withdrawList=ref([])
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

// Fetch withdrawlist from API
const fetchWithdrawList = async () => {
  try {
    loading.value=true;
    const response = await apiClient.get( `/transaction/withdraw?page=${currentPage.value}`);
    withdrawList.value = response.data.result.transaction.data;
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
    loading.value=false;
  }
};

// Fetch currencies on component mount
onMounted(fetchWithdrawList);

watch([currentPage, selectedPerPage], fetchWithdrawList);

// const products = ref([]);

</script>
<template>
  <div class="overflow-x-auto">
    <Table class="min-w-full divide-y divide-gray-200">
      <Table.Thead >
        <Table.Tr class="bg-gray-50 dark:bg-yellow-800">

          <Table.Td class="md:table-cell py-4 text-xs font-medium text-left text-white-500 uppercase tracking-wider">
            {{ $t('transactionHistory.date') }}
          </Table.Td>
          <Table.Td class="py-4 text-xs font-medium text-left text-white-500 uppercase tracking-wider">
            {{ $t('transactionHistory.account') }}
          </Table.Td>
          <Table.Td class="hidden md:table-cell py-4 text-xs font-medium text-left text-white-500 uppercase tracking-wider">
            {{ $t('transactionHistory.method') }}
          </Table.Td>
          <Table.Td class="py-4 text-xs font-medium text-left text-white-500 uppercase tracking-wider">
            {{ $t('transactionHistory.amount') }}
          </Table.Td>
          <Table.Td class="py-4 text-xs font-medium text-center w-36 text-white-500 uppercase tracking-wider">
            {{ $t('transactionHistory.status') }}
          </Table.Td>
          <th class="px-2 py-3 text-xs font-medium text-left text-white-500 uppercase tracking-wider">
          {{ $t('transactionHistory.Reason') }}
        </th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody z>
        <template v-if="withdrawList.length > 0">
          <template v-for="withdraw in withdrawList" :key="withdraw.id">
            <Table.Tr class="[&_td]:last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">

              <Table.Td class="md:table-cell py-4 border-dashed dark:bg-gray-800 text-sm">
                <a href="" class="font-medium whitespace-nowrap">
                  {{ format(parseISO(withdraw.created_at), 'dd MMM yyyy') }}
                </a>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ format(parseISO(withdraw.created_at), 'h:mm a') }}
                </div>
              </Table.Td>
              <Table.Td class="py-4 border-dashed dark:bg-gray-800 text-sm">
                MT{{ withdraw.from }}
              </Table.Td>
              <Table.Td class="hidden md:table-cell py-4 border-dashed dark:bg-gray-800 text-sm">
                {{ withdraw.withdarw_method }}
              </Table.Td>
              <Table.Td class="py-4 border-dashed dark:bg-gray-800 text-sm">
                {{ formatCurrency(withdraw.amount_req) }}
              </Table.Td>
              <Table.Td class="py-4 border-dashed dark:bg-gray-800 text-sm">
                <div :class="['flex items-center justify-start', { 'text-warning': withdraw.status === 0 },{'text-success': withdraw.status === 3 },{ 'text-danger': withdraw.status === 2 }]">
                  <Lucide icon="Database" class="w-3.5 h-3.5 stroke-[1.7]" />
                  <div v-if="withdraw.status === 0" class="ml-1.5"> {{ $t('transactionHistory.pending') }}</div>
                  <div v-if="withdraw.status === 3" class="ml-1.5"> {{ $t('transactionHistory.approved') }}</div>
                  <div v-if="withdraw.status === 2" class="ml-1.5"> {{ $t('transactionHistory.rejected') }}</div>
                </div>
              </Table.Td>
              <Table.Td class="py-4 px-2 border-dashed dark:bg-gray-800 text-sm">
                {{ withdraw.admin_note ?? '--' }}

        </Table.Td>
            </Table.Tr>
          </template>
        </template>
      </Table.Tbody>
    </Table>
    <div v-if="loading">
      <ShimmerLoaderRow/>
      <ShimmerLoaderRow/>
    </div>
    <EmptyStateComponent class="py-5" v-if="withdrawList.length<=0&&!loading" :title="$t('emptyState.noWithdrawals')"/>
  </div>

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
