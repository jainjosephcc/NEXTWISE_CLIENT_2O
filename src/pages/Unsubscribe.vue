<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '../services/apiService';
import Button from "@/components/Base/Button";
import LoadingIcon from "@/components/Base/LoadingIcon";
import LogoChip from "@/assets/LogoChip.vue";
import AuthSliders from "@/assets/AuthSliders.vue";
import { FormInput, FormLabel } from "@/components/Base/Form";

const email = ref('');
const isLoading = ref(false);
const dialogMessage = ref('');
const warningModalPreview = ref(false);

const route = useRoute();
const token = ref(route.query.token || ''); // Fetch the token from the URL

// Validate token and email with API
const submitUnsubscribe = async () => {
    if (!email.value || !token.value) {
        dialogMessage.value = "Email or token is missing!";
        warningModalPreview.value = true;
        return;
    }

    isLoading.value = true;

    try {
        const response = await apiClient.post('/unsubscribe', {
            email: email.value,
            token: token.value,
        });

        if (response.status === 200) {
            dialogMessage.value = "You have successfully unsubscribed!";
            warningModalPreview.value = true;
        } else {
            dialogMessage.value = response.data.message || "Something went wrong!";
            warningModalPreview.value = true;
        }
    } catch (error: any) {
        dialogMessage.value = error.response?.data?.message || "Failed to process your request.";
        warningModalPreview.value = true;
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div
        class="container grid lg:h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] py-10 px-5 sm:py-14 sm:px-10 md:px-36 lg:py-0 lg:pl-14 lg:pr-12 xl:px-24">
        <div :class="[
            'relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0',
            'before:content-[\'\'] before:absolute before:inset-0 before:-mb-3.5 before:bg-white/40 before:rounded-2xl before:mx-5',
        ]">
            <div class="relative z-10 flex flex-col justify-center w-full h-full py-2 lg:py-14">
                <LogoChip />
                <div class="mt-10">
                    <div class="text-2xl font-medium">Unsubscribe from Email Services</div>
                    <div class="mt-2.5 text-slate-600">
                        We’re sorry to see you go! By unsubscribing, you will no longer receive important updates,
                        exclusive offers, and personalized content tailored just for you.
                    </div>
                    <div class="mt-2.5 text-slate-600">
                        If you’re certain you want to unsubscribe from our email services, please enter your registered
                        email id and confirm your choice by clicking the button below.</div>
                    <div class="mt-4">
                        <FormLabel class="mt-5 text-xs">Email*</FormLabel>
                        <FormInput v-model="email" type="text"
                            class="block px-4 py-2.5 rounded-[0.6rem] border-slate-300/80" />
                    </div>
                    <div class="flex gap-3 mt-3">
                        <Button :disabled="isLoading || !email" variant="primary" rounded
                            class="bg-gradient-to-r from-theme-1/70 to-theme-2/70 py-2 xl:mr-3 mt-5"
                            @click="submitUnsubscribe">
                            <template v-if="isLoading">
                                Processing
                                <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                            </template>
                            <template v-else>
                                <span class="text-xs">UNSUBSCRIBE</span>
                            </template>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AuthSliders />
    <ThemeSwitcher />
</template>

<style scoped>
/* Optionally add some CSS to adjust input width and alignment */
.text-center {
    text-align: center;
}

.w-12 {
    width: 3rem;
    /* Adjust input width as necessary */
}
</style>