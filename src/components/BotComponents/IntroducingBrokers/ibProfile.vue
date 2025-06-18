<script setup lang="ts">
import { ref, onMounted } from "vue";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormCheck, FormInput, FormSelect, InputGroup } from "@/components/Base/Form";
import EmptyStateComponent from "@/components/Commons/EmptyStateComponent.vue";
import apiClient from "../../../services/apiService";
import { Dialog } from "@/components/Base/Headless";
import ibconnetionComponet from "./ibconnetionComponet.vue";
import ibTranferHistoryComponet from "./ibTranferHistoryComponet.vue";
import mt5 from "@/assets/images/bot/mt5_lined.png";
import { formatCurrencyWithSymbol } from "@/utils/formatCurrency";
import LoadingIcon from "@/components/Base/LoadingIcon";
import ShimmerLoaderRow from "@/components/Commons/ShimmerLoaderRow.vue";

const API_BASE_URL = ref(import.meta.env.VITE_API_BASE_URL);
const WEBSITE_URL = ref(import.meta.env.VITE_API_REF_LINK);
const isShowAddNewAccountVisible = ref(false);
const isBtnLoading = ref(false);
const selectedAccount = ref("");
const transferAmount = ref("");
const errorModalVisible = ref(false);
const errorMessage = ref('');
const successModalPreview = ref(false);
const isLoading = ref(false);
const totalCommission = ref<number>(0);
const totalLots = ref<number>(0);
const commissionWithdraw = ref<number>(0);
const balanceCommission = ref<number>(0);
const totalClients = ref<number>(0);
const totalTeamDeposit = ref<number>(0);
const totalTeamWithdraw = ref<number>(0);
const ibKey = ref<string>("");
const ibREFLINKS = ref([]);
const isDashboardLoading = ref(false);
const accountList = ref<Account[]>([]);
const accountId = ref<number | null>(null);
const ibRefLink = ref('');
const showPopup = ref(false);

interface Account {
  mt_id: number;
  balance: number;
  leverage: number;
  server: string;
  credit: number;
  equity: number;
  margin_free: number;
  margin: number;
  margin_level: number;
  floating: number;
  swap: number;
  is_wallet?: boolean;
}
const showStatusPop = ref(false);
const fetchAccounts = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get("/live-accounts/data-list");
    accountList.value = response.data.result.mt_data;
    if (accountList.value.length > 0) {
      accountId.value = accountList.value[0].mt_id;
      fetchAccountDetails();
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchAccountDetails = async () => {
  if (accountId.value) {
    const selectedAccount = accountId.value;
  }
};

const fetchIBDashboardData = async () => {
  isDashboardLoading.value = true;
  try {
    const response = await apiClient.get("/ib/ib-dashboard");
    const result = response.data.result;

    totalCommission.value = result.totalCommision || 0;
    totalLots.value = result.totalLots || 0;
    commissionWithdraw.value = result.commisionWithdraw || 0;
    balanceCommission.value = result.balanceCommision || 0;
    totalClients.value = result.total_clients || 0;
    totalTeamDeposit.value = result.total_team_deposit || 0;
    totalTeamWithdraw.value = result.total_team_withdraw || 0;
    ibKey.value = result.ib_key || "";

    if (result.special_ref_codes) {
      ibREFLINKS.value = result.special_ref_codes;
    }

    if (API_BASE_URL.value && ibKey.value) {
      const levelResponse = await apiClient.get(`/ib/level-data`, {
        headers: {
          Authorization: `Bearer ${ibKey.value}`,
        },
      });
      const levelResult = levelResponse.data.result;

      if (levelResult.ib_key && levelResult.ib_key[0]?.ib_key) {
        ibRefLink.value = `${WEBSITE_URL.value}${levelResult.ib_key[0].ib_key}`;
      }
    }
  } catch (error) {
    console.error("Error fetching IB dashboard data:", error.response?.data || error);
  } finally {
    isDashboardLoading.value = false;
  }
};

function getRefLink(link: string) {
  return `${WEBSITE_URL.value}${link}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showPopup.value = true;
    setTimeout(() => (showPopup.value = false), 2000);
  });
}

onMounted(() => {
  fetchAccounts();
  fetchIBDashboardData();
});

const handleSubmit = async () => {


  const userStatus = JSON.parse(localStorage.getItem("clientStatus") || "{}");
  
  if (userStatus?.disable_ib_transfer === 0) {
    try {
    isBtnLoading.value = true;
    await apiClient.post("/ib/transfer-commission", {
      to_account: accountId.value,
      amount: transferAmount.value,
    });
    successModalPreview.value = true;
    closeDialog();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "An unexpected error occurred.";
    errorModalVisible.value = true;
  } finally {
    isBtnLoading.value = false;
  }
    
  }
  else{
    showStatusPop.value=true
  }

  
};

function handleTabClick(id: number) {
  accountId.value = id;
  fetchAccountDetails();
}

function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}

const closeDialog = () => {
  isShowAddNewAccountVisible.value = false;
};
</script>

<template>
  <div class="p-4 sm:p-6 md:px-8">
    <div class="text-lg sm:text-xl font-medium text-white mb-4">{{ $t('ibprofile.myIbProfile') }}</div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div class="col-span-1">
        <div class="flex flex-col p-4 sm:p-5 bg-slate-900 rounded-xl shadow-sm">
          <div class="flex flex-col w-full p-4 border border-dashed border-slate-300/80 rounded-xl bg-cyan-950 mb-6">
            <div class="text-white text-base sm:text-lg font-semibold mb-3">
              {{ $t('ibprofile.transferCommision') }}
            </div>

            <div class="flex flex-wrap justify-between items-center mb-4 text-sm sm:text-base text-white">
              <span class="w-full sm:w-auto">{{ $t('ibprofile.transferableBalance') }}</span>
              <span class="text-lg font-semibold w-full sm:w-auto text-right">{{ formatCurrencyWithSymbol(balanceCommission) }}</span>
            </div>

            <div v-if="isLoading">
              <ShimmerLoaderRow v-for="n in 4" :key="n" />
            </div>

            <div v-else-if="accountList.length > 0" class="mb-4">
              <div class="text-sm font-medium mb-2 text-white">{{ $t('ibprofile.selectaccount') }}</div>

              <div class="grid grid-cols-1 sm:grid-cols-1 gap-3">
                <div
                    v-for="(account) in accountList"
                    :key="account.mt_id"
                    class="bg-cyan-800 text-white rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all"
                    :class="accountId === account.mt_id ? 'ring-2 ring-blue-400 bg-blue-900 text-black border-blue-500' : ''"
                    @click="handleTabClick(account.mt_id)"
                >
                  <div class="flex flex-row sm:items-center gap-3 ps-2 py-2">
                    <img
                        :src="account.is_wallet ? '/wallet_2.png' : '/mt5_logo.png'"
                        alt="Account"
                        class="w-10 h-10 mx-auto sm:mx-0"
                    />

                    <div class="flex flex-col text-left sm:text-left text-sm sm:text-base w-full">
                      <div class="font-semibold">{{ account.balance }} $</div>
                      <div class="font-light break-words">
                        {{ account.is_wallet == 1 ? 'WALLET' : 'MT' + account.mt_id }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col items-center mt-6 text-center">
              <EmptyStateComponent title="No Live Accounts Found!" subtitle="Please create a new Live Account to get started." class="my-6" />
              <RouterLink :to="{ name: 'live-account-info' }" class="w-full">
                <Button variant="primary" class="w-full flex justify-center items-center gap-2">
                  <Lucide icon="Plus" class="w-4 h-4" />
                  Manage Live Account
                </Button>
              </RouterLink>
            </div>

            <div class="mt-4">
              <label class="block text-sm text-white mb-2">{{ $t('ibprofile.enterAmount') }}</label>
              <InputGroup class="w-full flex min-w-0">
                <InputGroup.Text>$</InputGroup.Text>
                <FormInput type="number" v-model="transferAmount" placeholder="Amount" />
                <InputGroup.Text>.00</InputGroup.Text>
              </InputGroup>
            </div>

            <Button class="w-full mt-4 bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center cbi-fill" @click="handleSubmit">
              <Lucide icon="CheckSquareIcon" class="w-5 h-5 mr-2" />
              <template v-if="isBtnLoading">
                {{ $t('ibprofile.processing') }}
                <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
              </template>
              <template v-else>
                {{ $t('ibprofile.processTransfer') }}
              </template>
            </Button>
          </div>

          <div class="relative p-4 rounded-xl bg-cyan-950">
            <div class="text-white text-lg font-semibold mb-3">{{ $t('ibprofile.myRefereralLink') }}</div>
            <div class="text-sm mb-3 text-white">
              {{ $t('ibprofile.referalReady') }}<br />
              {{ $t('ibprofile.referalReady2') }}

              <div v-if="!ibREFLINKS?.length > 0" class="flex items-center gap-2">
                <InputGroup class="w-full">
                  <InputGroup.Text>@</InputGroup.Text>
                  <FormInput
                    type="text"
                    v-model="ibRefLink"
                    disabled
                    class="flex-grow min-w-0"
                  />
                </InputGroup>
                <Button variant="primary" @click="copyToClipboard(ibRefLink)">
                  <Lucide icon="CopyIcon" class="w-5 h-5" />
                </Button>
              </div>


              <div v-else v-for="(link, index) in ibREFLINKS" :key="link" class="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 w-full">
                <span class="block text-sm font-medium">PLAN {{ index + 1 }}</span>
                <FormInput :value="getRefLink(link)" disabled class="flex-grow min-w-0" />
                <Button variant="primary" @click="copyToClipboard(getRefLink(link))" class="w-full sm:w-auto">
                  <Lucide icon="CopyIcon" class="w-5 h-5" />
                </Button>
              </div>

              <div v-if="showPopup" class="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 text-xs rounded shadow">
                Copied!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-1 xl:col-span-2">
        <div class="flex flex-col gap-6">
          <ibconnetionComponet />
          <ibTranferHistoryComponet />
        </div>
      </div>
    </div>

    <Dialog :open="showStatusPop" @close="showStatusPop = false">
  <Dialog.Panel class="w-full max-w-md bg-[#1f1f1f] text-white rounded-lg p-6">
    <Dialog.Title class="text-lg font-semibold">Access Denied</Dialog.Title>
    <Dialog.Description class="mt-2">
      You are currently blocked from using IB . Please contact support.
    </Dialog.Description>
    <div class="mt-4 text-right">
      <Button @click="showStatusPop = false">OK</Button>
    </div>
  </Dialog.Panel>
  </Dialog>

    <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
      <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-[95%] sm:w-[90%] max-w-md p-6">
        <div class="text-center">
          <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto text-green-500" />
          <div class="mt-4 text-2xl font-bold">{{ $t('wallet.goodjob') }}</div>
          <p class="mt-2 text-gray-600">{{ $t('ibprofile.ibSuccess') }}</p>
          <Button @click="handleRefresh" class="mt-6 w-24">{{ $t('identityVerification.ok') }}</Button>
        </div>
      </Dialog.Panel>
    </Dialog>

    <Dialog :open="errorModalVisible" @close="() => (errorModalVisible = false)">
      <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-[95%] sm:w-[90%] max-w-md p-6">
        <div class="text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto text-red-500" />
          <div class="mt-4 text-2xl font-bold">{{ $t('identityVerification.oops') }}</div>
          <p class="mt-2 text-gray-600">{{ errorMessage }}</p>
          <Button @click="handleRefresh" class="mt-6 w-24">{{ $t('identityVerification.ok') }}</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  </div>
</template>
