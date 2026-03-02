export default defineNuxtPlugin({
    name: 'init-cookies',
    parallel: true,
    setup() {
        const { initializeCookies } = useCookieBar()
        initializeCookies()
    },
});