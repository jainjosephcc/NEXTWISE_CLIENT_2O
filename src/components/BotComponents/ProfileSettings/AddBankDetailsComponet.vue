<script setup lang="ts">
import { ref } from 'vue';
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import { FormInput } from "@/components/Base/Form";
import LoadingIcon from "@/components/Base/LoadingIcon";
import apiClient from "../../../services/apiService";
import Lucide from "@/components/Base/Lucide";
const holderName = ref('');
const accountNo = ref('');
const ifscCode = ref('');
const iban = ref('');
const bankName = ref('');
const bankAddress = ref('');
const isBtnLoading = ref(false);
const successModalVisible = ref(false);
const errorModalVisible = ref(false);
const errorMessage = ref('');

const props = defineProps({
    country: {
        type: String,
        required: true,
    },
});

const country = ref(props.country);
// Modal handling methods
const showSuccessModal = () => {
    successModalVisible.value = true;
};

const showErrorModal = (message: string) => {
    errorMessage.value = message || "An unexpected error occurred.";
    errorModalVisible.value = true;
};

const closeSuccessModal = () => {
    successModalVisible.value = false;
};

const closeErrorModal = () => {
    errorModalVisible.value = false;
};
// Handle form submission
// Handle form submission
const handleSubmit = async () => {
    try {
        isBtnLoading.value = true;

        // API call with form data
        const response = await apiClient.post("/profile/bank-add", {
            holder_name: holderName.value,
            account_no: accountNo.value,
            ifsc_code: ifscCode.value,
            iban: iban.value,
            bank_name: bankName.value,
            bank_address: bankAddress.value,
            country: country.value, // Pass country field
        });

        // Handle success
        if (response.data.status) {
            //console.log("Bank added successfully:", response.data.result);
            showSuccessModal(); // Show success modal
        } else {
            showErrorModal(response.data.message || "Failed to add bank details.");
        }
    } catch (error) {
        console.error("Error adding bank:", error.response?.data || error);
        showErrorModal("An error occurred while adding bank details.");
    } finally {
        isBtnLoading.value = false; // Reset button loading state
    }
};
function handleRefresh() {
    successModalVisible.value = false;
    window.location.reload();
}


</script>

<template>
    <div class="flex flex-col p-5 box box--stacked">
        <div class="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">

            Add Bank Details
        </div>
        <div>
            <!-- Holder Name -->
            <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Account Holder Name</div>
                            <div
                                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                Required
                            </div>
                        </div>
                        <div class="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                            Enter your full legal name as it appears on your
                            official identification.
                        </div>
                    </div>
                </label>


                <div class="flex-1 w-full">
                    <FormInput type="text" placeholder="Enter account holder's name" v-model="holderName"
                        class="w-full" />
                </div>
            </div>

            <!-- Account Number -->
            <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Account Number</div>
                            <div
                                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                Required
                            </div>
                        </div>
                    </div>
                </label>
                <div class="flex-1 w-full">
                    <FormInput type="text" placeholder="Enter account number" v-model="accountNo" class="w-full" />
                </div>
            </div>

            <!-- IFSC Code -->
            <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">IFSC Code</div>
                            <div
                                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                Required
                            </div>
                        </div>
                    </div>
                </label>
                <div class="flex-1 w-full">
                    <FormInput type="text" placeholder="Enter IFSC code" v-model="ifscCode" class="w-full" />
                </div>
            </div>
            <!-- IBAN -->
            <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">IBAN</div>
                            <div
                                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                Optional
                            </div>
                        </div>
                    </div>
                </label>
                <div class="flex-1 w-full">
                    <FormInput type="text" placeholder="Enter IBAN" v-model="iban" class="w-full" />
                </div>
            </div>


            <!-- Bank Name -->
            <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Bank Name</div>
                            <div
                                class="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                Required
                            </div>
                        </div>
                    </div>
                </label>
                <div class="flex-1 w-full">
                    <FormInput type="text" placeholder="Enter bank name" v-model="bankName" class="w-full" />
                </div>
            </div>

            <!-- Bank Address -->
            <div class="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                <label class="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                    <div class="text-left">
                        <div class="flex items-center">
                            <div class="font-medium">Bank Address</div>

                        </div>
                    </div>
                </label>
                <div class="flex-1 w-full">
                    <FormInput type="text" placeholder="Enter bank address" v-model="bankAddress" class="w-full" />
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex pt-5 mt-6 border-t border-dashed md:justify-end border-slate-300/70">
                <Button variant="outline-primary" class="w-full px-4 border-primary/50 md:w-auto bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center" @click="handleSubmit"
                    :disabled="isBtnLoading">
                    <template v-if="isBtnLoading">
                        Saving
                        <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                    </template>
                    <template v-else>
                        Save Bank Details
                    </template>
                </Button>
            </div>
        </div>
    </div>
    <!-- Success Modal -->
    <Dialog :open="successModalVisible" @close="closeSuccessModal">
        <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
            <div class="p-5 text-center">
                <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
                <div class="mt-5 text-3xl">Good job!</div>
                <div class="mt-2 text-slate-500">
                    Bank Details Added Successfully!
                </div>
            </div>
            <div class="px-5 pb-8 text-center">
                <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
                    Ok
                </Button>
            </div>
        </Dialog.Panel>
    </Dialog>

    <!-- Error Modal -->
    <Dialog :open="errorModalVisible" @close="closeErrorModal">
        <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
            <div class="p-5 text-center">
                <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-warning" />
                <div class="mt-5 text-3xl">Oops...</div>
                <div class="mt-2 text-slate-500">
                    {{ errorMessage }}
                </div>
            </div>
            <div class="px-5 pb-8 text-center">
                <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
                    Ok
                </Button>
            </div>
        </Dialog.Panel>
    </Dialog>
</template>
