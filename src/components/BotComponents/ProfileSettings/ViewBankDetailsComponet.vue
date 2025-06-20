<script setup lang="ts">
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import { defineProps, defineEmits, ref, reactive } from "vue";
import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import { FormInput, FormLabel } from "@/components/Base/Form";
import LoadingIcon from "@/components/Base/LoadingIcon";
import apiClient from "../../../services/apiService";
import md5 from "blueimp-md5";


// Props: list and client data
const props = defineProps<{
  bankDetails: Array<{
    id: number;
    holder_name: string;
    account_no: string;
    bank_name: string;
    ifsc_code: string;
    bank_address: string;
  }>;
  clientDetails: {
    id: number;
    email: string;
    country: string;
  };
}>();
const emit = defineEmits<{ (e: "updated", payload: any): void }>();

// State for Add Bank Details dialog
const showAddDialog = ref(false);
const isAddBankVisible = ref(false);
const newBank = reactive({
  holder_name: "",
  account_no: "",
  bank_name: "",
  ifsc_code: "",
  bank_address: "",
  country: "",
});
const newBankErrors = reactive<Partial<Record<keyof typeof newBank, string>>>({});
const isAdding = ref(false);
const addSuccessModal = ref(false);
const addErrorModal = ref(false);
const addErrorMessage = ref("");

function openAddDialog() {
  Object.assign(newBank, { holder_name: "", account_no: "", bank_name: "", ifsc_code: "", bank_address: "", country: props.clientDetails.country });
  Object.keys(newBankErrors).forEach(k => delete newBankErrors[k as keyof typeof newBank]);
  showAddDialog.value = true;
}
function closeAddDialog() {
  showAddDialog.value = false;
}

function validateNewBank() {
  // clear previous errors
  Object.keys(newBankErrors).forEach(k => delete newBankErrors[k as keyof typeof newBank]);
  // validate required fields
  if (!newBank.holder_name.trim()) newBankErrors.holder_name = "Holder Name is required.";
  if (!newBank.account_no.trim()) newBankErrors.account_no = "Account Number is required.";
  if (!newBank.bank_name.trim()) newBankErrors.bank_name = "Bank Name is required.";
  if (!newBank.ifsc_code.trim()) newBankErrors.ifsc_code = "IFSC Code is required.";
  if (!newBank.bank_address.trim()) newBankErrors.bank_address = "Bank Address is required.";
  if (!newBank.country.trim()) newBankErrors.country = "Country is required.";
  return Object.keys(newBankErrors).length === 0;
}

async function createBank() {
  if (!validateNewBank()) return;
  isAdding.value = true;
  try {
    const res = await apiClient.post("/profile/bank-add", {
      client_id: props.clientDetails.id,
      holder_name: newBank.holder_name,
      account_no: newBank.account_no,
      bank_name: newBank.bank_name,
      ifsc_code: newBank.ifsc_code,
      bank_address: newBank.bank_address,
      country: newBank.country,
    });
    if (res.data.status) {
      emit("updated", res.data.result);
      addSuccessModal.value = true;
      closeAddDialog();
    } else {
      addErrorMessage.value = res.data.message || "Failed to add bank details.";
      addErrorModal.value = true;
    }
  } catch (e: any) {
    addErrorMessage.value = e.response?.data?.message || "Error adding bank details.";
    addErrorModal.value = true;
  } finally {
    isAdding.value = false;
  }
}

// State for Edit Bank Details dialog
const showEditDialog = ref(false);
const editedBank = reactive({ id: 0, holder_name: "", account_no: "", bank_name: "", ifsc_code: "", bank_address: "" });
const isUpdating = ref(false);
const editSuccessModal = ref(false);
const editErrorModal = ref(false);
const editErrorMessage = ref("");

function openEdit(bank: typeof editedBank) {
  Object.assign(editedBank, bank);
  showEditDialog.value = true;
}
function closeEditDialog() {
  showEditDialog.value = false;
}

async function updateBank() {
  isUpdating.value = true;
  const checksum = md5(`${props.clientDetails.id}${props.clientDetails.email}`);
  try {
    const res = await apiClient.post("/profile/bank-update", {
      id: editedBank.id,
      client_id: props.clientDetails.id,
      checksum,
      holder_name: editedBank.holder_name,
      account_no: editedBank.account_no,
      bank_name: editedBank.bank_name,
      ifsc_code: editedBank.ifsc_code,
      bank_address: editedBank.bank_address,
    });
    if (res.data.status) {
      emit("updated", res.data.result);
      editSuccessModal.value = true;
      closeEditDialog();
    } else {
      editErrorMessage.value = res.data.message || "Update failed.";
      editErrorModal.value = true;
    }
  } catch (e: any) {
    editErrorMessage.value = e.response?.data?.message || "Error updating bank details.";
    editErrorModal.value = true;
  } finally {
    isUpdating.value = false;
  }
}

function closeAddSuccess() { addSuccessModal.value = false; window.location.reload(); }
function closeAddError() { addErrorModal.value = false; }
function closeEditSuccess() { editSuccessModal.value = false; window.location.reload(); }
function closeEditError() { editErrorModal.value = false; }
</script>

<template>
  <!-- Add Bank Button -->
  <div v-if="props.bankDetails.length<=2" class="flex justify-end p-5">
    <Button variant="primary" @click="openAddDialog">
      <Lucide icon="Plus" class="w-4 h-4 mr-1" /> Add Bank Details
    </Button>
  </div>

  <!-- Bank Listing -->
  <div class="flex flex-col box box--stacked">
    <div class="flex items-center pb-5 font-medium border-b border-dashed text-slate-300/70 text-sm">
      Bank Details
    </div>
    <div class="text-slate-500 mb-5">Below is the list of your saved bank details.</div>
    <div class="border rounded-lg border-slate-200/80 overflow-auto">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Td class="py-4 font-medium bg-slate-50 text-slate-500">Holder Name</Table.Td>
            <Table.Td class="py-4 font-medium bg-slate-50 text-slate-500">Account #</Table.Td>
            <Table.Td class="py-4 font-medium bg-slate-50 text-slate-500">Bank Name</Table.Td>
            <Table.Td class="py-4 font-medium bg-slate-50 text-slate-500">IFSC Code</Table.Td>
            <Table.Td class="py-4 font-medium bg-slate-50 text-slate-500">Bank Address</Table.Td>
            <Table.Td class="py-4 font-medium bg-slate-50 text-slate-500">Actions</Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="bank in props.bankDetails" :key="bank.id">
            <Table.Td class="py-4">{{ bank.holder_name }}</Table.Td>
            <Table.Td class="py-4">{{ bank.account_no }}</Table.Td>
            <Table.Td class="py-4">{{ bank.bank_name }}</Table.Td>
            <Table.Td class="py-4">{{ bank.ifsc_code }}</Table.Td>
            <Table.Td class="py-4">{{ bank.bank_address }}</Table.Td>
            <Table.Td class="py-4 text-center">
              <Button size="sm" @click="openEdit(bank)">Edit</Button>
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="props.bankDetails.length===0">
            <Table.Td colspan="6" class="py-6 text-center text-gray-500">No bank details available.</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>

  <!-- Add Bank Dialog -->
  <Dialog :open="showAddDialog" @close="closeAddDialog">
    <Dialog.Panel class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto">
      <Dialog.Title class="text-lg font-semibold mb-4">Add Bank Details</Dialog.Title>
      <div class="space-y-4">
        <div>
          <FormLabel for="holder-add">Holder Name <span class="text-red-500">*</span></FormLabel>
          <FormInput id="holder-add" v-model="newBank.holder_name" />
          <p v-if="newBankErrors.holder_name" class="mt-1 text-red-600 text-sm">{{ newBankErrors.holder_name }}</p>
        </div>
        <div>
          <FormLabel for="account-add">Account Number <span class="text-red-500">*</span></FormLabel>
          <FormInput id="account-add" v-model="newBank.account_no" />
          <p v-if="newBankErrors.account_no" class="mt-1 text-red-600 text-sm">{{ newBankErrors.account_no }}</p>
        </div>
        <div>
          <FormLabel for="bank-add">Bank Name <span class="text-red-500">*</span></FormLabel>
          <FormInput id="bank-add" v-model="newBank.bank_name" />
          <p v-if="newBankErrors.bank_name" class="mt-1 text-red-600 text-sm">{{ newBankErrors.bank_name }}</p>
        </div>
        <div>
          <FormLabel for="ifsc-add">IFSC Code <span class="text-red-500">*</span></FormLabel>
          <FormInput id="ifsc-add" v-model="newBank.ifsc_code" />
          <p v-if="newBankErrors.ifsc_code" class="mt-1 text-red-600 text-sm">{{ newBankErrors.ifsc_code }}</p>
        </div>
        <div>
          <FormLabel for="address-add">Bank Address <span class="text-red-500">*</span></FormLabel>
          <FormInput id="address-add" v-model="newBank.bank_address" />
          <p v-if="newBankErrors.bank_address" class="mt-1 text-red-600 text-sm">{{ newBankErrors.bank_address }}</p>
        </div>
        <div>
          <FormLabel for="country-add">Country <span class="text-red-500">*</span></FormLabel>
          <FormInput id="country-add" v-model="newBank.country" />
          <p v-if="newBankErrors.country" class="mt-1 text-red-600 text-sm">{{ newBankErrors.country }}</p>
        </div>
      </div>
      <div class="mt-6 flex justify-end space-x-3">
        <Button @click="createBank" :disabled="isAdding">
          <template v-if="isAdding">Saving<LoadingIcon icon="oval" class="w-4 h-4 ml-2"/></template>
          <template v-else>Save Bank Details</template>
        </Button>
        <Button variant="outline" @click="closeAddDialog" :disabled="isAdding">Cancel</Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Edit Bank Dialog (unchanged) -->
  <Dialog :open="showEditDialog" @close="closeEditDialog">
    <Dialog.Panel class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto">
      <Dialog.Title class="text-lg font-semibold mb-4">Edit Bank Details</Dialog.Title>
      <div class="space-y-4">
        <FormLabel for="holder-edit">Holder Name</FormLabel>
        <FormInput id="holder-edit" v-model="editedBank.holder_name" />
        <FormLabel for="account-edit">Account Number</FormLabel>
        <FormInput id="account-edit" v-model="editedBank.account_no" />
        <FormLabel for="bank-edit">Bank Name</FormLabel>
        <FormInput id="bank-edit" v-model="editedBank.bank_name" />
        <FormLabel for="ifsc-edit">IFSC Code</FormLabel>
        <FormInput id="ifsc-edit" v-model="editedBank.ifsc_code" />
        <FormLabel for="address-edit">Bank Address</FormLabel>
        <FormInput id="address-edit" v-model="editedBank.bank_address" />
      </div>
      <div class="mt-6 flex justify-end space-x-3">
        <Button @click="updateBank" :disabled="isUpdating">
          <template v-if="isUpdating">Updating<LoadingIcon icon="oval" class="w-4 h-4 ml-2"/></template>
          <template v-else>Update</template>
        </Button>
        <Button variant="outline" @click="closeEditDialog" :disabled="isUpdating">Cancel</Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Success & Error Modals remain unchanged -->
  <Dialog :open="addSuccessModal" @close="closeAddSuccess">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto text-success" />
        <div class="mt-5 text-3xl">Success!</div>
        <div class="mt-2 text-slate-500">Bank details added successfully.</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button variant="primary" @click="closeAddSuccess" class="w-24">OK</Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <Dialog :open="addErrorModal" @close="closeAddError">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto text-warning" />
        <div class="mt-5 text-3xl">Oops...</div>
        <div class="mt-2 text-slate-500">{{ addErrorMessage }}</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button variant="primary" @click="closeAddError" class="w-24">OK</Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <Dialog :open="editSuccessModal" @close="closeEditSuccess">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto text-success" />
        <div class="mt-5 text-3xl">Success!</div>
        <div class="mt-2 text-slate-500">Bank details updated successfully.</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button variant="primary" @click="closeEditSuccess" class="w-24">OK</Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <Dialog :open="editErrorModal" @close="closeEditError">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto text-warning" />
        <div class="mt-5 text-3xl">Oops...</div>
        <div class="mt-2 text-slate-500">{{ editErrorMessage }}</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button variant="primary" @click="closeEditError" class="w-24">OK</Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
