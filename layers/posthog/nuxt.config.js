export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            posthog: {
                publicKey: '',
                host: '',
                defaults: '2026-05-30',
                capturePageViews: true,
                capturePageLeaves: true,
                captureClientErrors: true,
                captureServerErrors: true,
                disabled: false,
                proxy: false,
            }
        }
    },
    build: {
        transpile: ['posthog-node']
    },
    vite: {
        optimizeDeps: {
            exclude: ['posthog-node']
        }
    },
    nitro: {
        externals: {
            external: ['posthog-node']
        }
    },
})