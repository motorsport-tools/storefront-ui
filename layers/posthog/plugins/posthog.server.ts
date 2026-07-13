import type { JsonType } from 'posthog-js';
import { defineNuxtPlugin } from '#app';
import { PostHog } from 'posthog-node'

export default defineNuxtPlugin({
    name: 'posthog-server',
    enforce: 'pre',
    setup: async (nuxtApp) => {

        const config = useRuntimeConfig().public.posthog

        if (config.disabled || !config) {
            return {
                provide: {
                    serverPosthog: null as typeof PostHog | null,
                },
            }
        }

        if (config.publicKey.length === 0) {
            return {};
        }


        const posthog = new PostHog(config.publicKey, { host: config.host });
        await posthog.reloadFeatureFlags();

        const identity = useCookie('ph-session', { default: () => '' })

        const { featureFlags, featureFlagPayloads } = await posthog.getAllFlagsAndPayloads(identity.value)

        useState<Record<string, boolean | string> | undefined>('ph-feature-flags', () => featureFlags);
        useState<Record<string, JsonType> | undefined>('ph-feature-flag-payloads', () => featureFlagPayloads);

        if (config.captureServerErrors) {
            nuxtApp.hook('app:error', (error) => {
                posthog.captureException(error);
            });
        }

        return {
            provide: {
                serverPosthog: posthog,
            },
        };

    }
})