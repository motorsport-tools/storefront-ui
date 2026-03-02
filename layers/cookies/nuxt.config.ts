import cookieConfig from './config/cookies.config'
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            cookieGroups: cookieConfig,
            essentialCookiesIndex: 0,
        },
    },
})