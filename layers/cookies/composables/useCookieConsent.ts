import { useState } from "nuxt/app";
import { toRefs } from "vue";
export const useCookieConsent = (name: string) => {
    const state = useState("useCookieConsent_" + name, () => ({
        consent: false
    }));
    return {
        ...toRefs(state.value)
    };
};