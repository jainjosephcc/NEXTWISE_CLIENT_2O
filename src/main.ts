import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";
import i18n from "@/i18n";
import VueTelInput from 'vue3-tel-input';
import 'vue3-tel-input/dist/vue3-tel-input.css';
import { logout } from "@/services/authService";
import { getS3Image } from '@/utils/S3';
import vue3LoadingShimmer from "vue3-loading-shimmer";


const app = createApp(App);
document.documentElement.classList.add('dark');
app.use(VueTelInput);
app.component("vue3-loading-shimmer", vue3LoadingShimmer);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.config.globalProperties.$getS3Image = getS3Image;

/*
let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

const resetInactivityTimer = () => {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(async () => {
        console.log("User inactive. Logging out...");
        try{
            await logout();
            localStorage.clear();
        }
        catch (e) {
            localStorage.clear();

        }

         // Call the logout API
        localStorage.clear(); // Clear local storage
        router.push("/login"); // Redirect to login page
    }, 15 * 60 * 1000); // 15 minutes
};

// Monitor user activity globally
["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
});

// Initialize the inactivity timer
resetInactivityTimer();*/

app.mount("#app");
