import { useRuntimeConfig } from '#imports';
import { defineNitroPlugin } from 'nitropack/runtime';
import { getCookie } from 'h3';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', async (event) => {
        const config = useRuntimeConfig().public.posthog;

        if (config.disabled || !config) return;

        const distinctId = getCookie(event, 'ph-session');
        event.context.posthogId = distinctId;
    });
});