<!-- START: Responsive Vue 3 IB Levels Component -->
<template>
  <div class="border bg-cyan-950 flex flex-col gap-5 rounded-lg border-slate-200/80 mt-3 px-4 sm:px-6 py-4">
    <div class="text-lg text-white font-semibold">
      {{ $t('ibprofile.myConnections') }}
    </div>

    <div class="flex flex-col gap-5">
      <Tab.Group v-if="levels.length > 0">
        <Tab.List class="flex flex-wrap gap-2">
          <Tab v-for="(level, index) in levels" :key="index" @click="getLevelInfo(index)">
            <Tab.Button class="px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-700 transition-all">
              {{ level.key.toUpperCase() }}
            </Tab.Button>
          </Tab>
        </Tab.List>

        <Tab.Panels class="mt-5">
          <Tab.Panel v-for="(level, index) in levels" :key="index">
            <div class="overflow-x-auto">
              <div class="min-w-[768px]">
                <Table class="border-b border-slate-200/60">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Td class="px-3 py-3 text-sm text-slate-300 bg-cyan-900 font-semibold">
                        {{ $t('ibprofile.client') }}
                      </Table.Td>
                      <Table.Td class="px-3 py-3 text-sm text-slate-300 bg-cyan-900 font-semibold">
                        {{ $t('ibprofile.totalAccounts') }}
                      </Table.Td>
                      <Table.Td class="px-3 py-3 text-sm text-slate-300 bg-cyan-900 font-semibold">
                        {{ $t('dashboard.totalDeposit') }}
                      </Table.Td>
                      <Table.Td class="px-3 py-3 text-sm text-slate-300 bg-cyan-900 font-semibold">
                        {{ $t('ibprofile.totalLots') }}
                      </Table.Td>
                      <Table.Td class="px-3 py-3 text-sm text-slate-300 bg-cyan-900 font-semibold">
                        {{ $t('ibprofile.commission') }}
                      </Table.Td>
                      <Table.Td class="px-3 py-3 text-sm text-slate-300 bg-cyan-900 font-semibold">
                        {{ $t('ibprofile.profileStatus') }}
                      </Table.Td>
                      <Table.Td class="px-3 py-3 text-sm text-slate-300 bg-cyan-900 font-semibold">
                        {{ $t('ibprofile.registerDate') }}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody v-if="!loading">
                    <template v-if="levelInfo.length > 0">
                      <Table.Tr v-for="info in levelInfo" :key="info.id">
                        <Table.Td class="px-3 py-3 text-white">
                          <div class="font-medium">{{ info.client_name }}</div>
                          <div class="text-xs text-slate-400">
                            {{
                              info.email.split('@')[0].slice(0, 2) +
                              '****@***' +
                              info.email.split('@')[1].slice(info.email.split('@')[1].lastIndexOf('.'))
                            }}
                          </div>
                        </Table.Td>
                        <Table.Td class="px-3 py-3 text-white">{{ info.total_mt_accounts }}</Table.Td>
                        <Table.Td class="px-3 py-3 text-white">$ {{ info.deposit }}</Table.Td>
                        <Table.Td class="px-3 py-3">
                          <div class="flex items-center">
                            <span v-if="info.total_lots === 0" class="text-sm text-red-500">No Data</span>
                            <Button
                                v-else
                                variant="primary"
                                class="flex items-center gap-2 text-sm"
                                @click="openDealsPopup(info)"
                            >
                              {{ info.total_lots }}
                              <Lucide icon="ExternalLink" class="w-4 h-4" />
                            </Button>
                          </div>
                        </Table.Td>
                        <Table.Td class="px-3 py-3 text-white">$ {{ info.total_commission }}</Table.Td>
                        <Table.Td class="px-3 py-3 text-green-400">{{ $t('ibprofile.activE') }}</Table.Td>
                        <Table.Td class="px-3 py-3 text-white">{{ info.created_at_formatted }}</Table.Td>
                      </Table.Tr>
                    </template>
                  </Table.Tbody>
                </Table>

                <div
                    v-if="loading || isLoading"
                    class="flex justify-center py-6"
                >
                  <LoadingIcon icon="bars" class="w-8 h-8" />
                </div>

                <EmptyStateComponent
                    v-if="levelInfo.length <= 0 && !loading || levels.length <= 0 && !isLoading"
                    class="py-5"
                    :title="$t('emptyState.noDataAccounts')"
                />
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div v-if="isLoading" class="flex justify-center py-6">
        <LoadingIcon icon="bars" class="w-8 h-8" />
      </div>
    </div>

    <ViewDealsIBDialog
        v-if="selectedClient"
        :clientId="selectedClient.id"
        :open="isShowViewDealsPopupVisible"
        @close="closeDealsPopup"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "@/components/Base/Button";
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import Table from "@/components/Base/Table";
import { Tab } from "@/components/Base/Headless";
import apiClient from "../../../services/apiService";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Lucide from "@/components/Base/Lucide";
import ViewDealsIBDialog from "@/components/BotComponents/IntroducingBrokers/ViewDealsIBDialog.vue";

const loading = ref(false);
const levels = ref([]);
const levelInfo = ref([]);
const index = ref(0);
const isLoading = ref(false);
const isShowViewDealsPopupVisible = ref(false);
const selectedClient = ref(null);

const openDealsPopup = (client) => {
  selectedClient.value = client;
  isShowViewDealsPopupVisible.value = true;
};

const closeDealsPopup = () => {
  isShowViewDealsPopupVisible.value = false;
  selectedClient.value = null;
};

const fetchLevel = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get("/ib/level-data");
    levels.value = response.data.result.levels;
    getLevelInfo(index.value);
  } catch (error) {
    console.error("Error fetching levels:", error);
  } finally {
    isLoading.value = false;
  }
};

const getLevelInfo = async (id) => {
  index.value = id;
  const userData = localStorage.getItem("userData");
  const parsedData = userData ? JSON.parse(userData) : null;

  if (!parsedData) {
    console.error("No userData found in localStorage");
    return;
  }

  try {
    loading.value = true;
    const response = await apiClient.post("/getIbLevelInfo", {
      ib_id: parsedData.id,
      parent_id: levels.value[index.value],
    });
    levelInfo.value = response.data.levelclientsData;
  } catch (error) {
    console.error("Error fetching level info:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLevel();
});
</script>
