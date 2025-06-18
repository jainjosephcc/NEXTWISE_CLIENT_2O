import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import gr from "@/locales/gr.json";
import hi from "@/locales/hi.json";
import th from "@/locales/th.json";
import vn from "@/locales/vn.json";
import ml from "@/locales/ml.json";

const messages = {
    en,
    fr,
    gr,
    hi,
    th,
    vn,
    ml
};

const i18n = createI18n({
    locale: "en", // Default locale
    fallbackLocale: "en", // Fallback locale
    messages,
});

export default i18n;
